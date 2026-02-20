import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = BigInt(idParam);

    // 1. 레시피 기본 정보 조회
    const recipe = await (prisma.recipe as any).findUnique({
      where: {
        rcpSno: id,
      },
      include: {
        steps: {
          orderBy: {
            stepId: 'asc',
          },
        },
        ingredients: true,
      },
    });

    if (!recipe) {
      return NextResponse.json(
        { success: false, error: 'Recipe not found' },
        { status: 404 }
      );
    }

    // 2. 사용자 식료품 정보 조회
    const userGroceries = await prisma.groceryItem.findMany({
      select: {
        name: true,
        expiryDate: true
      },
    });

    const normalizeText = (t?: string | null) => String(t || '').replace(/\s+/g, '').toLowerCase();

    // 재료명 -> 가장 빠른 유통기한 매핑
    const userIngredientMap = new Map<string, Date | null>();
    const TODAY = new Date();
    const URGENT_THRESHOLD_DAYS = 3;

    userGroceries.forEach(item => {
      const cleanName = normalizeText(item.name);
      if (!cleanName) return;
      const currentExpiry = userIngredientMap.get(cleanName);

      // 유통기한이 있는 경우만 비교
      if (item.expiryDate) {
        if (!currentExpiry || item.expiryDate < currentExpiry) {
          userIngredientMap.set(cleanName, item.expiryDate);
        }
      } else if (!userIngredientMap.has(cleanName)) {
        // 유통기한 없는 아이템도 보유 목록에는 추가 (유통기한 null)
        userIngredientMap.set(cleanName, null);
      }
    });

    const isBadSubstring = (base: string, find: string) => {
      if (find === '파' && (base.includes('양파') || base.includes('파스타') || base.includes('파프리카'))) return true;
      if (find === '김' && (base.includes('김치') || base.includes('튀김'))) return true;
      if (find === '무' && (base.includes('고무') || base.includes('무침') || base.includes('무늬'))) return true;
      if (find === '소' && base.includes('소스')) return true;
      return false;
    };

    const parsedItems = (recipe.ingredients || []).map((ing: any) => {
      const name = ing.ingName || "";
      const amount = ing.ingUnit || "";
      const cleanName = normalizeText(name);

      let isOwned = false;
      let isUrgent = false;

      for (const [myItemClean, expiryDate] of userIngredientMap.entries()) {
        if (myItemClean === cleanName) {
          isOwned = true;
        } else if (cleanName.includes(myItemClean) && !isBadSubstring(cleanName, myItemClean)) {
          isOwned = true;
        } else if (myItemClean.includes(cleanName) && !isBadSubstring(myItemClean, cleanName)) {
          isOwned = true;
        }

        if (isOwned) {
          if (expiryDate) {
            const diffTime = expiryDate.getTime() - TODAY.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays <= URGENT_THRESHOLD_DAYS) {
              isUrgent = true;
            }
          }
          break;
        }
      }

      return {
        name: `${name} ${amount}`.trim(),
        ingredientName: name,
        amount: amount,
        isOwned: isOwned,
        isUrgent: isUrgent
      };
    });

    const structuredIngredients = parsedItems.length > 0
      ? [{ sectionTitle: "재료", items: parsedItems }]
      : [];



    // 5. BigInt 직렬화 및 응답 생성
    const serializedRecipe = {
      ...recipe,
      rcpSno: recipe.rcpSno.toString(),
      steps: (recipe as any).steps?.map((step: any) => ({
        ...step,
        rcpSno: step.rcpSno.toString(),
      })) || [],
      ingredients: undefined,
      // 기존 ingredients 배열 대신 구조화된 데이터 반환
      structuredIngredients: structuredIngredients,
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
