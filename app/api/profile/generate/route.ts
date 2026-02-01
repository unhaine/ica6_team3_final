import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { animal } = await request.json();

        // 냉장고 안에 있는 동물 컨셉으로 이미지 생성
        const prompt = `A cute ${animal} character peeking out from inside a refrigerator, surrounded by food items. The style should be playful and cartoon-like, with vibrant colors. The ${animal} should look friendly and curious. PNG format with transparent or white background. Digital art style, suitable for a profile picture.`;

        // 실제로는 여기서 이미지 생성 API를 호출합니다
        // 예: OpenAI DALL-E, Stability AI, etc.
        
        // 임시로 성공 응답 반환
        return NextResponse.json({
            success: true,
            message: `${animal} 프로필 이미지가 생성되었습니다`,
            imageUrl: `/profile/generated-${animal}-${Date.now()}.png`,
            prompt,
        });
    } catch (error) {
        console.error("이미지 생성 오류:", error);
        return NextResponse.json(
            { success: false, error: "이미지 생성에 실패했습니다" },
            { status: 500 }
        );
    }
}
