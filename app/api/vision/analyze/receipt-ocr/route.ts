import { NextRequest, NextResponse } from 'next/server';

// OpenAI GPT-4o Vision을 사용한 영수증/구매내역 OCR
// 쿠팡프레시, 롯데마트 등 온라인 구매내역에서 식료품 정보 추출

interface GroceryItem {
  id: string;
  name: string;          // 식료품 이름
  quantity: string;      // 수량 (예: "1개", "700g", "10입")
  price?: number;        // 가격 (선택)
  category?: string;     // 카테고리 (예: "채소", "과일", "육류")
}

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json();
    const apiKey = process.env.OPENAI_API_KEY;

    console.log('★★★ [OpenAI GPT-4o - 영수증 OCR 모드] 분석 요청 수신 ★★★');

    if (!image || !apiKey) {
      return NextResponse.json({ 
        error: '필수 데이터가 없습니다. (OPENAI_API_KEY 환경변수 확인 필요)' 
      }, { status: 400 });
    }

    // Base64 이미지 데이터 추출
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');

    // OpenAI GPT-4o Vision API 호출
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',  // GPT-4o는 vision을 기본 지원
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `당신은 온라인 쇼핑몰 구매내역과 영수증을 분석하는 전문가입니다.

이 이미지는 쿠팡프레시, 롯데마트, 이마트 등의 온라인 구매내역 또는 종이 영수증입니다.

**중요 지침:**
1. 이미지에서 **식료품만** 추출해주세요 (음식, 음료, 식재료, 조미료 등)
2. 비식료품은 제외해주세요 (주방용품, 세제, 화장품 등)
3. 각 식료품에 대해 다음 정보를 추출:
   - name: 상품명 (간결하게, 브랜드명 제거)
   - quantity: 수량 (예: "1개", "700g", "10입", "1팩")
   - price: 가격 (숫자만, 원 단위)
   - category: 카테고리 (채소, 과일, 육류, 유제품, 해산물, 가공식품, 음료, 조미료 중 하나)

**응답 형식:**
반드시 유효한 JSON 배열만 반환하세요. 마크다운 코드블록 없이 순수 JSON만 반환.

예시:
[
  {"name": "방울토마토", "quantity": "10입", "price": 9990, "category": "채소"},
  {"name": "대파", "quantity": "700g", "price": 2490, "category": "채소"},
  {"name": "계란", "quantity": "10구", "price": 3990, "category": "유제품"}
]

**상품명 정리 규칙:**
- "수량: 1, 방울토마토 (10입)" → "방울토마토"
- "1+등급 무항생제 백색란 (대란/10구)" → "계란"
- "해초명가 진도 자른미역 (50G)" → "자른미역"
- 브랜드명, 상세 설명, 괄호 내용 등은 제거하고 핵심 식품명만 추출`
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Data}`
                }
              }
            ]
          }
        ],
        max_tokens: 4096,
        temperature: 0.1  // 일관성을 위해 낮은 temperature
      }),
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error('OpenAI API 에러:', result);
      const errorMessage = result.error?.message || 'OpenAI API 에러';
      
      // 할당량 초과 에러
      if (result.error?.code === 'insufficient_quota' || errorMessage.includes('quota')) {
        throw new Error('OpenAI API 할당량이 초과되었습니다. API 키를 확인하거나 크레딧을 충전해주세요.');
      }
      
      throw new Error(errorMessage);
    }

    // 응답에서 텍스트 추출
    const textContent = result.choices?.[0]?.message?.content;
    
    if (!textContent) {
      console.error('OpenAI 응답에 텍스트가 없습니다:', result);
      throw new Error('OpenAI 응답 파싱 실패');
    }

    console.log('OpenAI 원본 응답:', textContent.substring(0, 500));

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
      throw new Error('OpenAI 응답 JSON 파싱 실패');
    }

    // 결과 형식화
    const groceryItems: GroceryItem[] = parsedItems.map((item: any, idx: number) => ({
      id: `receipt-${idx}-${Math.random().toString(36).substr(2, 6)}`,
      name: item.name || '알 수 없음',
      quantity: item.quantity || '1개',
      price: item.price,
      category: item.category || '기타'
    }));

    console.log(`★★★ [OpenAI GPT-4o] OCR 완료! 총 ${groceryItems.length}개 식료품 추출 ★★★`);
    console.log('추출된 식료품:', groceryItems.map(i => i.name).join(', '));

    return NextResponse.json({ 
      groceryItems,
      totalCount: groceryItems.length,
      apiSource: 'openai-gpt4o'
    });

  } catch (error: any) {
    console.error('[OpenAI Receipt OCR] 서버 에러:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
