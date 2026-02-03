import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

/**
 * 현재 세션에서 사용자 정보를 가져옵니다.
 * id가 있으면 id로, 없으면 email로 사용자를 찾습니다.
 * 
 * @returns 사용자 객체 또는 null
 */
export async function getCurrentUser() {
  const session = await auth();
  
  if (!session || (!session.user?.id && !session.user?.email)) {
    return null;
  }

  // id가 있으면 id로, 없으면 email로 사용자 찾기
  const user = session.user.id
    ? await prisma.user.findUnique({
        where: { id: session.user.id },
      })
    : await prisma.user.findFirst({
        where: { email: session.user.email! },
      });

  return user;
}

/**
 * 인증이 필요한 API에서 사용하는 헬퍼 함수.
 * 세션을 확인하고 사용자를 반환합니다.
 * 
 * @returns { user: User } 또는 { error: NextResponse } - 인증 실패 또는 사용자 없음
 */
export async function requireAuth(): Promise<
  | { user: NonNullable<Awaited<ReturnType<typeof getCurrentUser>>> }
  | { error: NextResponse }
> {
  const session = await auth();
  
  if (!session || (!session.user?.id && !session.user?.email)) {
    return {
      error: NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      ),
    };
  }

  const user = await getCurrentUser();
  
  if (!user) {
    return {
      error: NextResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      ),
    };
  }

  return { user };
}
