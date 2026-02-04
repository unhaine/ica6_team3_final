import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import prisma from '@/lib/prisma';

/**
 * 재료 목록 조회
 */
export async function GET() {
  try {
    const authResult = await requireAuth();
    if ('error' in authResult) {
      return authResult.error;
    }
    const user = authResult.user;

    // 사용자의 재료 목록 조회
    const items = await prisma.groceryItem.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: items,
      count: items.length,
    });
  } catch (error) {
    console.error('[Ingredients GET] Error:', error);
    return NextResponse.json(
      { error: '재료 목록 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * 재료 저장 (냉장고에 넣기)
 */
export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAuth();
    if ('error' in authResult) {
      return authResult.error;
    }
    const user = authResult.user;

    const body = await req.json();
    const { items, photoAnalysisId } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: '저장할 재료가 없습니다.' },
        { status: 400 }
      );
    }

    // 재료 저장
    const createdItems = await Promise.all(
      items.map((item: { name: string; quantity?: string | number; category?: string; source?: string }) =>
        prisma.groceryItem.create({
          data: {
            userId: user.id,
            name: item.name,
            quantity: item.quantity ? String(item.quantity) : null,
            category: item.category || null,
            source: item.source || 'fridge-photo', // 'fridge-photo' or 'receipt-ocr' or 'manual'
            receiptId: photoAnalysisId || null,
          },
        })
      )
    );

    return NextResponse.json({
      success: true,
      data: {
        created: createdItems.length,
        items: createdItems,
      },
    });
  } catch (error) {
    console.error('[Ingredients POST] Error:', error);
    return NextResponse.json(
      { error: '재료 저장 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * 재료 수정
 */
export async function PATCH(req: NextRequest) {
  try {
    const authResult = await requireAuth();
    if ('error' in authResult) {
      return authResult.error;
    }
    const user = authResult.user;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: '재료 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { name, quantity } = body;

    // 재료가 사용자의 것인지 확인
    const existingItem = await prisma.groceryItem.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: '재료를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 재료 수정
    const updatedItem = await prisma.groceryItem.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(quantity !== undefined && { quantity: quantity ? String(quantity) : null }),
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedItem,
    });
  } catch (error) {
    console.error('[Ingredients PATCH] Error:', error);
    return NextResponse.json(
      { error: '재료 수정 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * 재료 삭제
 */
export async function DELETE(req: NextRequest) {
  try {
    const authResult = await requireAuth();
    if ('error' in authResult) {
      return authResult.error;
    }
    const user = authResult.user;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: '재료 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    // 재료가 사용자의 것인지 확인
    const existingItem = await prisma.groceryItem.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: '재료를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 재료 삭제
    await prisma.groceryItem.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: '재료가 삭제되었습니다.',
    });
  } catch (error) {
    console.error('[Ingredients DELETE] Error:', error);
    return NextResponse.json(
      { error: '재료 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
