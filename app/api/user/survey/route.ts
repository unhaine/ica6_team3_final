import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // 세션 확인 및 사용자 찾기
    const authResult = await requireAuth();
    if ('error' in authResult) {
      return authResult.error;
    }
    const user = authResult.user;

    const body = await request.json();
    const { householdSize, allergies, cookingPreference, skip } = body;

    // 설문조사 데이터 업데이트
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        householdSize: skip ? null : householdSize,
        allergies: skip ? [] : allergies || [],
        cookingPreference: skip ? null : cookingPreference,
        surveyCompleted: true,
        surveyCompletedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        householdSize: updatedUser.householdSize,
        allergies: updatedUser.allergies,
        cookingPreference: updatedUser.cookingPreference,
        surveyCompleted: updatedUser.surveyCompleted,
      },
    });
  } catch (error) {
    console.error('Survey API error:', error);
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
    console.error('상세 에러:', errorMessage);
    return NextResponse.json(
      { error: `설문조사 저장 중 오류가 발생했습니다: ${errorMessage}` },
      { status: 500 }
    );
  }
}
