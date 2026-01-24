import { NextRequest, NextResponse } from 'next/server';

// 기본 분석 라우트 - Cloud Vision과 Gemini Flash 중 선택 가능
// 쿼리 파라미터로 api=cloud-vision 또는 api=gemini-flash 지정
// 또는 api=compare로 두 API 결과 비교

export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const apiType = url.searchParams.get('api') || 'cloud-vision';  // 기본값: cloud-vision
    
    const body = await req.json();
    const baseUrl = url.origin;

    console.log(`★★★ [통합 분석 API] api=${apiType} 요청 수신 ★★★`);

    if (apiType === 'compare') {
      // 두 API 동시 호출하여 비교
      const [cloudVisionResult, geminiFlashResult] = await Promise.allSettled([
        fetch(`${baseUrl}/api/vision/analyze/cloud-vision`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        }).then(r => r.json()),
        fetch(`${baseUrl}/api/vision/analyze/gemini-flash`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        }).then(r => r.json())
      ]);

      return NextResponse.json({
        comparison: true,
        cloudVision: cloudVisionResult.status === 'fulfilled' 
          ? cloudVisionResult.value 
          : { error: cloudVisionResult.reason?.message || '호출 실패' },
        geminiFlash: geminiFlashResult.status === 'fulfilled'
          ? geminiFlashResult.value
          : { error: geminiFlashResult.reason?.message || '호출 실패' }
      });
    }

    // 단일 API 호출
    const targetUrl = apiType === 'gemini-flash' 
      ? `${baseUrl}/api/vision/analyze/gemini-flash`
      : `${baseUrl}/api/vision/analyze/cloud-vision`;

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const result = await response.json();
    return NextResponse.json(result, { status: response.status });

  } catch (error: any) {
    console.error('[통합 API] 서버 에러:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
