import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // 세션 확인
    const session = await auth();
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { householdSize, allergies, skip } = body;

    // 사용자 찾기 (세션 ID 기반)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 설문조사 데이터 업데이트
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        householdSize: skip ? null : householdSize,
        allergies: skip ? [] : allergies || [],
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
        surveyCompleted: updatedUser.surveyCompleted,
      },
    });
  } catch (error) {
    console.error('Survey API error:', error);
    return NextResponse.json(
      { error: '설문조사 저장 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
