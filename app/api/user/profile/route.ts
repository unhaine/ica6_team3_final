import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // 세션 확인 및 사용자 찾기
    const authResult = await requireAuth();
    if ('error' in authResult) {
      return authResult.error;
    }
    const currentUser = authResult.user;

    // 사용자 정보 조회 (select로 필요한 필드만 가져오기)
    const user = await prisma.user.findUnique({
      where: { id: currentUser.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        householdSize: true,
        allergies: true,
        cookingPreference: true,
        surveyCompleted: true,
        surveyCompletedAt: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Profile API error:', error);
    return NextResponse.json(
      { error: '사용자 정보 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
