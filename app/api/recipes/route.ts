import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

import { Recipe, Prisma } from '@prisma/client';

// BigInt 직렬화 처리 함수
const serializeRecipe = (recipe: Recipe) => ({
  ...recipe,
  rcpSno: recipe.rcpSno.toString(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    // 쿼리 파라미터 파싱
    const limit = parseInt(searchParams.get('limit') || '20');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    // 필터 조건 구성
    const where: Prisma.RecipeWhereInput = {};
    
    if (category && category !== 'all') {
      where.ckgKndActoNm = category;
    }
    
    if (search) {
      where.OR = [
        { rcpTtl: { contains: search, mode: 'insensitive' } },
        { ckgNm: { contains: search, mode: 'insensitive' } },
        { ckgMtrlCn: { contains: search, mode: 'insensitive' } },
      ];
    }

    // 데이터 조회
    const recipes = await prisma.recipe.findMany({
      where,
      take: limit,
      orderBy: {
        inqCnt: 'desc', // 조회수 높은 순으로 기본 정렬
      },
    });

    // BigInt 변환 후 응답
    const serializedRecipes = recipes.map(serializeRecipe);

    return NextResponse.json({
      success: true,
      count: serializedRecipes.length,
      data: serializedRecipes,
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[API] 레시피 목록 조회 에러:', errorMessage);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
