import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

// Gemini Flash 2.0을 사용한 객체 탐지 및 바운딩 박스 생성
// API: https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent

interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface DetectedItem {
  id: string;
  label: string;
  confidence: number;
  boundingBox: BoundingBox;
  source: string;
}

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    console.log('★★★ [Gemini Flash 2.0 - 객체 탐지 모드] 분석 요청 수신 ★★★');

    if (!image || !apiKey) {
      return NextResponse.json({ 
        error: '필수 데이터가 없습니다. (GEMINI_API_KEY 환경변수 확인 필요)' 
      }, { status: 400 });
    }

    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');

    // 이미지 최적화 (Gemini는 최대 20MB 지원하지만, 처리 속도를 위해 적정 크기로 조정)
    // .rotate()를 추가하여 EXIF 오리엔테이션 문제를 방지합니다.
    const optimizedBuffer = await sharp(imageBuffer)
      .rotate()
      .resize(1600, 1600, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toBuffer();
    
    const metadata = await sharp(optimizedBuffer).metadata();
    const { width, height } = metadata;
    console.log(`최적화된 이미지 크기: ${width}x${height}`);

    const optimizedBase64 = optimizedBuffer.toString('base64');

    // Gemini Flash 2.0 API 호출 (v1 버전 사용)
    const geminiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    
    const prompt = `당신은 냉장고 내부 이미지를 분석하는 전문가입니다. 
이 냉장고 이미지에서 모든 식료품과 물품을 찾아주세요.

각 물품에 대해 다음 정보를 JSON 배열로 반환해주세요:
1. label: 물품의 한글 이름 (예: "우유", "계란", "김치", "사과" 등)
2. confidence: 확신도 (0.0 ~ 1.0 사이의 숫자)
3. box_2d: [ymin, xmin, ymax, xmax] 형식의 바운딩 박스 (0 ~ 1000 사이의 정수)
   - ymin, xmin: 박스의 좌상단 좌표 (0~1000)
   - ymax, xmax: 박스의 우하단 좌표 (0~1000)

중요 지침:
- 모든 보이는 식품/물품을 최대한 빠짐없이 찾아주세요. 
- 특히 냉장고 선반마다 위치한 반찬통, 음료, 야채 등을 개별적으로 인식해주세요.
- 바운딩 박스는 물품을 정확하게 감싸야 합니다.
- **반드시** [ymin, xmin, ymax, xmax] 형식을 준수하세요. 이 값들은 0에서 1000 사이의 정수여야 합니다.
- 응답은 반드시 유효한 JSON 배열만 반환해주세요 (마크다운 코드블록 없이).

응답 형식 예시:
[
  {"label": "우유", "confidence": 0.95, "box_2d": [200, 100, 500, 250]},
  {"label": "김치통", "confidence": 0.88, "box_2d": [100, 500, 250, 700]}
]`;

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: 'image/jpeg',
                data: optimizedBase64
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.1,  // 낮은 temperature로 일관된 결과 유도
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 8192
        }
      }),
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error('Gemini API 에러:', result);
      const errorMessage = result.error?.message || 'Gemini API 에러';
      
      // 할당량 초과 에러인 경우 사용자 친화적 메시지
      if (result.error?.code === 429 || errorMessage.includes('quota')) {
        throw new Error('Gemini API 할당량이 초과되었습니다. Cloud Vision API를 사용하거나 잠시 후 다시 시도해주세요.');
      }
      
      throw new Error(errorMessage);
    }

    // 응답에서 텍스트 추출
    const textContent = result.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!textContent) {
      console.error('Gemini 응답에 텍스트가 없습니다:', result);
      throw new Error('Gemini 응답 파싱 실패');
    }

    console.log('Gemini 원본 응답:', textContent.substring(0, 500) + '...');

    // JSON 파싱 (마크다운 코드블록 제거)
    let cleanedText = textContent.trim();
    
    // ```json ... ``` 또는 ``` ... ``` 형태 제거
    if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }

    let parsedItems: any[];
    try {
      parsedItems = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('JSON 파싱 에러:', parseError, '\n원본:', cleanedText);
      throw new Error('Gemini 응답 JSON 파싱 실패');
    }

// 컨테이너 키워드 정의
const CONTAINER_KEYWORDS = ['통', '병', '박스', '봉지', '캔', '컵', '팩', '용기', 'box', 'container', 'bottle', 'jar', 'can', 'bag'];

    // 결과 형식화
    const detectedItems: DetectedItem[] = parsedItems
      .filter((item: any) => item.box_2d && Array.isArray(item.box_2d) && item.box_2d.length === 4)
      .map((item: any, idx: number) => {
        const [ymin, xmin, ymax, xmax] = item.box_2d;
        
        // 0-1000 좌표를 0.0-1.0으로 변환
        const x = xmin / 1000;
        const y = ymin / 1000;
        const width = (xmax - xmin) / 1000;
        const height = (ymax - ymin) / 1000;

        const label = item.label || '알 수 없음';
        // 컨테이너 여부 판단
        const isContainer = CONTAINER_KEYWORDS.some(k => label.includes(k));

        return {
          id: `gf-${idx}-${Math.random().toString(36).substr(2, 4)}`,
          label: label,
          confidence: Math.min(1, Math.max(0, item.confidence || 0.5)),
          boundingBox: {
            x: Math.min(1, Math.max(0, x)),
            y: Math.min(1, Math.max(0, y)),
            width: Math.min(1, Math.max(0, width)),
            height: Math.min(1, Math.max(0, height))
          },
          source: 'gemini-flash',
          isContainer: isContainer
        };
      });

    // 라벨 목록 추출
    const allLabels = [...new Set(detectedItems.map(item => item.label))];

    console.log(`★★★ [Gemini Flash 2.0] 분석 완료! 총 ${detectedItems.length}개 품목 발견 ★★★`);
    console.log('감지된 품목:', allLabels.join(', '));

    return NextResponse.json({ 
      detectedItems,
      allLabels,
      apiSource: 'gemini-flash'
    });

  } catch (error: any) {
    console.error('[Gemini Flash] 서버 에러:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
