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

    // 재료명 -> 가장 빠른 유통기한 매핑
    const userIngredientMap = new Map<string, Date | null>();
    const TODAY = new Date();
    const URGENT_THRESHOLD_DAYS = 3;

    userGroceries.forEach(item => {
      const cleanName = item.name.replace(/ /g, '').trim();
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

    // 3. 재료 텍스트 파싱 (섹션별 분류)
    const rawIngredients = recipe.ckgMtrlCn || "";
    // 예: "[재료] 감자 2개, 양파 1개 [양념] 소금 약간, 후추 톡톡"

    // 섹션 타이틀 탐지 정규식 (대괄호로 묶인 단어)
    const sectionRegex = /\[([^\]]+)\]/g;
    let match;
    const sections: { title: string; content: string }[] = [];
    let lastIndex = 0;

    while ((match = sectionRegex.exec(rawIngredients)) !== null) {
      // 이전 섹션의 내용 저장 (첫 번째 매치 전의 내용은 '기본' 섹션으로 처리 가능하나, 보통 [재료]로 시작함)
      if (lastIndex < match.index) {
        // 대괄호가 처음에 나오지 않는 경우 처리 (거의 없음)
      }

      const title = match[1];
      const startIndex = match.index + match[0].length;

      // 다음 섹션 시작 위치 찾기
      const nextMatch = rawIngredients.indexOf('[', startIndex);
      const content = nextMatch !== -1
        ? rawIngredients.substring(startIndex, nextMatch)
        : rawIngredients.substring(startIndex);

      sections.push({ title, content });
      lastIndex = startIndex + content.length;
    }

    // 만약 섹션이 하나도 감지되지 않았다면 전체를 '재료' 섹션으로 간주
    if (sections.length === 0 && rawIngredients.trim().length > 0) {
      sections.push({ title: '재료', content: rawIngredients });
    }

    // 4. 각 섹션별 재료 파싱 및 보유/임박 여부 확인
    const structuredIngredients = sections.map(section => {
      // 쉼표, 줄바꿈 등으로 분리
      const items = section.content.split(/,|\\n|\n/).map(item => item.trim()).filter(Boolean);

      const parsedItems = items.map(itemStr => {
        // 이름과 수량 분리 (단순화된 로직: 공백 기준)
        // "감자 2개" -> name: "감자", amount: "2개"
        // "소금 약간" -> name: "소금", amount: "약간"
        // 점(.) 제거 로직 추가
        const cleanItemStr = itemStr.replace(/[\.·•]/g, ' ').trim();
        const parts = cleanItemStr.split(' ');
        const name = parts[0];
        const amount = parts.slice(1).join(' ');

        const cleanName = name.replace(/ /g, '');
        let isOwned = false;
        let isUrgent = false;

        // 보유 여부 및 임박 여부 확인
        for (const [myItemName, expiryDate] of userIngredientMap.entries()) {
          if (cleanName.includes(myItemName) || myItemName.includes(cleanName)) {
            isOwned = true;

            if (expiryDate) {
              const diffTime = expiryDate.getTime() - TODAY.getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              // 유통기한 지났거나 3일 이내 남은 경우
              if (diffDays <= URGENT_THRESHOLD_DAYS) {
                isUrgent = true;
              }
            }
            break;
          }
        }

        return {
          name: cleanItemStr, // 전체 텍스트 (표시용)
          ingredientName: name, // 검색용 이름
          amount: amount,
          isOwned: isOwned,
          isUrgent: isUrgent
        };
      });

      return {
        sectionTitle: section.title,
        items: parsedItems
      };
    });


    // 5. BigInt 직렬화 및 응답 생성
    const serializedRecipe = {
      ...recipe,
      rcpSno: recipe.rcpSno.toString(),
      steps: (recipe as any).steps?.map((step: any) => ({
        ...step,
        rcpSno: step.rcpSno.toString(),
      })) || [],
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
