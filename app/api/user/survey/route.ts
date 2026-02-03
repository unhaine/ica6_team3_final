import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import { User, Prisma } from '@prisma/client';

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
    const updateData: Prisma.UserUpdateInput = {
      householdSize: skip ? null : householdSize,
      allergies: skip ? [] : allergies || [],
      cookingPreference: skip ? null : cookingPreference,
      surveyCompleted: true,
      surveyCompletedAt: new Date(),
    } as unknown as Prisma.UserUpdateInput;

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    // 타입 단언을 통해 cookingPreference 접근
    const userWithPreference = updatedUser as User & { cookingPreference: string | null };

    return NextResponse.json({
      success: true,
      user: {
        id: userWithPreference.id,
        householdSize: userWithPreference.householdSize,
        allergies: userWithPreference.allergies,
        cookingPreference: userWithPreference.cookingPreference,
        surveyCompleted: userWithPreference.surveyCompleted,
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
