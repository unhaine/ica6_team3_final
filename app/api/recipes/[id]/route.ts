import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = BigInt(idParam);

    const recipe = await (prisma.recipe as any).findUnique({
      where: {
        rcpSno: id,
      },
      include: {
        ingredients: true,
        steps: {
          orderBy: {
            stepId: 'asc',
          },
        },
      },
    });

    if (!recipe) {
      return NextResponse.json(
        { success: false, error: 'Recipe not found' },
        { status: 404 }
      );
    }

    // BigInt 직렬화 처리
    const serializedRecipe = {
      ...recipe,
      rcpSno: recipe.rcpSno.toString(),
      steps: (recipe as any).steps?.map((step: any) => ({
        ...step,
        rcpSno: step.rcpSno.toString(),
      })) || [],
      ingredients: (recipe as any).ingredients?.map((ing: any) => ({
        ...ing,
        rcpSno: ing.rcpSno.toString(),
      })) || [],
    };

    return NextResponse.json({
      success: true,
      data: serializedRecipe,
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[API] 레시피 상세 조회 에러:', errorMessage);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
