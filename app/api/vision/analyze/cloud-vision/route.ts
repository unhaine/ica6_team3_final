import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

// 식료품 관련 라벨 (LABEL_DETECTION에서 필터링용)
const FOOD_KEYWORDS = [
  // 채소
  'vegetable', 'carrot', 'cabbage', 'lettuce', 'spinach', 'broccoli', 'cucumber', 'tomato', 
  'onion', 'garlic', 'pepper', 'potato', 'radish', 'mushroom', 'zucchini', 'eggplant',
  'celery', 'asparagus', 'corn', 'pea', 'bean', 'leek', 'scallion', 'ginger',
  // 과일
  'fruit', 'apple', 'banana', 'orange', 'grape', 'strawberry', 'watermelon', 'melon',
  'peach', 'pear', 'kiwi', 'mango', 'lemon', 'lime', 'cherry', 'blueberry', 'raspberry',
  // 유제품
  'dairy', 'milk', 'cheese', 'butter', 'yogurt', 'cream', 'egg',
  // 육류/해산물
  'meat', 'beef', 'pork', 'chicken', 'fish', 'seafood', 'salmon', 'tuna', 'shrimp', 'sausage', 'ham', 'bacon',
  // 음료
  'beverage', 'juice', 'water', 'soda', 'beer', 'wine', 'coffee', 'tea',
  // 조미료/소스
  'sauce', 'ketchup', 'mayonnaise', 'mustard', 'soy sauce', 'vinegar', 'oil', 'dressing',
  // 기타 식품
  'food', 'bread', 'rice', 'noodle', 'pasta', 'tofu', 'kimchi', 'pickle', 'jam', 'jelly',
  'snack', 'candy', 'chocolate', 'ice cream', 'frozen', 'canned', 'packaged',
  // 용기/박스
  'container', 'box', 'bottle', 'jar', 'can', 'bag', 'package', 'carton', 'tub', 'cup',
  'plastic', 'glass', 'tupperware', 'storage', 'wrap', 'foil', 'lid', 'cap'
];

// 범용 라벨을 더 구체적인 라벨로 보정하는 맵
const LABEL_REFINEMENT: Record<string, string> = {
  'Food': '식품',
  'Packaged goods': '포장식품',
  'Bottle': '음료/소스',
  'Drink': '음료',
  'Produce': '농산물',
  'Dairy': '유제품',
  'Container': '용기/식품',
  'Jar': '병조림/소스',
  'Can': '캔식품',
  'Box': '박스식품',
  'Plastic bag': '봉지식품',
  'Tableware': '식기',
  'Vegetable': '채소',
  'Fruit': '과일'
};

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json();
    const apiKey = process.env.GOOGLE_VISION_API_KEY;

    console.log('★★★ [Cloud Vision - LABEL_DETECTION + OBJECT_LOCALIZATION 통합 모드] 분석 요청 수신 ★★★');

    if (!image || !apiKey) {
      return NextResponse.json({ error: '필수 데이터가 없습니다.' }, { status: 400 });
    }

    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');

    // 1. 해상도 최적화 (너무 크면 인식이 안 될 수 있으므로 적정 크기(1600px)로 리사이징)
    const optimizedBuffer = await sharp(imageBuffer)
      .resize(1600, 1600, { fit: 'inside', withoutEnlargement: true })
      .toBuffer();
    
    const metadata = await sharp(optimizedBuffer).metadata();
    const { width, height } = metadata;
    console.log(`최적화된 이미지 크기: ${width}x${height}`);

    // 2. 4구간 분할 (30% 겹침)
    const overlap = 0.3;
    const tileW = Math.floor(width! / (2 - overlap));
    const tileH = Math.floor(height! / (2 - overlap));

    const crops = [
      { left: 0, top: 0, w: tileW, h: tileH, l: '좌상' },
      { left: width! - tileW, top: 0, w: tileW, h: tileH, l: '우상' },
      { left: 0, top: height! - tileH, w: tileW, h: tileH, l: '좌하' },
      { left: width! - tileW, top: height! - tileH, w: tileW, h: tileH, l: '우하' }
    ];

    const tileBuffers = await Promise.all(
      crops.map(c => sharp(optimizedBuffer).extract({ left: c.left, top: c.top, width: c.w, height: c.h }).toBuffer())
    );

    // 3. 구글 API 호출 (OBJECT_LOCALIZATION + LABEL_DETECTION 동시 사용)
    const visionUrl = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;
    const payloads = [optimizedBuffer.toString('base64'), ...tileBuffers.map(t => t.toString('base64'))].map(content => ({
      image: { content },
      features: [
        { type: 'OBJECT_LOCALIZATION', maxResults: 50 },
        { type: 'LABEL_DETECTION', maxResults: 30 }  // 🔥 세부 라벨 감지 추가
      ]
    }));

    const response = await fetch(visionUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requests: payloads }),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error?.message || 'Vision API 에러');

    // 4. LABEL_DETECTION 결과에서 식료품 라벨 추출
    const allFoodLabels: string[] = [];
    result.responses.forEach((res: any, idx: number) => {
      const labels = res.labelAnnotations || [];
      const foodLabels = labels
        .filter((label: any) => {
          const desc = label.description.toLowerCase();
          return FOOD_KEYWORDS.some(keyword => desc.includes(keyword));
        })
        .map((label: any) => label.description);
      
      allFoodLabels.push(...foodLabels);
      console.log(`> [${idx === 0 ? '전체' : crops[idx-1].l}] 식료품 라벨: ${foodLabels.join(', ') || '없음'}`);
    });

    // 중복 제거된 고유 식료품 라벨
    const uniqueFoodLabels = [...new Set(allFoodLabels)];
    console.log(`🍎 감지된 식료품 라벨 목록: ${uniqueFoodLabels.join(', ')}`);

    // 5. OBJECT_LOCALIZATION 결과 통합
    const combined: any[] = [];
    result.responses.forEach((res: any, idx: number) => {
      const objects = res.localizedObjectAnnotations || [];
      console.log(`> [${idx === 0 ? '전체' : crops[idx-1].l}] 객체 탐지: ${objects.length}개`);

      objects.forEach((obj: any, objIdx: number) => {
        const vertices = obj.boundingPoly?.normalizedVertices || [];
        if (vertices.length < 4) return;

        const xs = vertices.map((v: any) => v.x || 0);
        const ys = vertices.map((v: any) => v.y || 0);
        let x = Math.min(...xs), y = Math.min(...ys), w = Math.max(...xs) - x, h = Math.max(...ys) - y;

        if (idx > 0) { // 타일 좌표 보정
          const c = crops[idx-1];
          x = (x * c.w + c.left) / width!;
          y = (y * c.h + c.top) / height!;
          w = (w * c.w) / width!;
          h = (h * c.h) / height!;
        }

const CONTAINER_KEYWORDS = [
  'container', 'box', 'bottle', 'jar', 'can', 'bag', 'package', 'carton', 'tub', 'cup',
  'plastic', 'glass', 'tupperware', 'storage', 'wrap', 'foil', 'lid', 'cap'
];

// ... inside the function ...

        // 라벨 보정: 범용 라벨이면 더 구체적인 이름으로 변환
        let refinedLabel = obj.name;
        if (LABEL_REFINEMENT[obj.name]) {
          refinedLabel = LABEL_REFINEMENT[obj.name];
        }

        const lowerLabel = obj.name.toLowerCase();
        const isContainer = CONTAINER_KEYWORDS.some(k => lowerLabel.includes(k)) || 
                           ['packaged goods', 'bottle', 'jar', 'can', 'box', 'container'].includes(lowerLabel);

        combined.push({
          id: `cv-${idx}-${objIdx}-${Math.random().toString(36).substr(2, 4)}`,
          label: refinedLabel,
          originalLabel: obj.name,  // 원본 라벨 보존 (디버깅용)
          confidence: obj.score,
          boundingBox: { x, y, width: w, height: h },
          source: 'cloud-vision',  // 어떤 API에서 감지했는지 표시
          isContainer: isContainer
        });
      });
    });

    // 6. 개선된 중복 제거 (IoU 기반)
    const final: any[] = [];
    combined.sort((a, b) => b.confidence - a.confidence);
    
    for (const item of combined) {
      const isDuplicate = final.some(f => {
        // IoU(Intersection over Union) 기반 중복 체크
        const dx = Math.abs(f.boundingBox.x - item.boundingBox.x);
        const dy = Math.abs(f.boundingBox.y - item.boundingBox.y);
        const dw = Math.abs(f.boundingBox.width - item.boundingBox.width);
        const dh = Math.abs(f.boundingBox.height - item.boundingBox.height);
        
        // 위치와 크기가 모두 유사하면 중복으로 판단 (임계값: 5%)
        return dx < 0.05 && dy < 0.05 && dw < 0.1 && dh < 0.1;
      });
      
      if (!isDuplicate) {
        final.push(item);
      }
    }

    console.log(`★★★ [Cloud Vision] 분석 완료! 총 ${final.length}개 품목 발견 ★★★`);
    return NextResponse.json({ 
      detectedItems: final, 
      allLabels: uniqueFoodLabels,  // 🔥 감지된 식료품 라벨도 함께 반환
      apiSource: 'cloud-vision'
    });

  } catch (error: any) {
    console.error('[Cloud Vision] 서버 에러:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
