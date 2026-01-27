import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// 레시피 추천 API
// 사용자가 보유한 식재료를 기반으로 만들 수 있는 요리를 추천

interface RecommendedRecipe {
  recipe: any;
  matchedIngredients: string[];
  missingIngredients: string[];
  matchRate: number;
  canCook: boolean;
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    console.log('★★★ [레시피 추천] 사용자:', userId);

    if (!userId) {
      return NextResponse.json({ 
        error: '사용자 ID가 필요합니다.' 
      }, { status: 400 });
    }

    // 1. 사용자의 보유 식재료 조회
    const userGroceries = await prisma.groceryItem.findMany({
      where: { userId },
      select: { name: true }
    });

    if (userGroceries.length === 0) {
      return NextResponse.json({ 
        message: '보유한 식재료가 없습니다.',
        recipes: []
      });
    }

    const userIngredients = userGroceries.map(g => g.name.toLowerCase().trim());
    console.log('보유 식재료:', userIngredients);

    // 2. 모든 레시피 조회 (재료 정보가 있는 것만)
    const allRecipes = await prisma.recipe.findMany({
      where: {
        ckgMtrlCn: { not: null }
      },
      take: 500  // 성능을 위해 최대 500개만
    });

    console.log(`총 ${allRecipes.length}개 레시피 검색 중...`);

    // 3. 각 레시피와 보유 재료 매칭
    const recommendations: RecommendedRecipe[] = [];

    for (const recipe of allRecipes) {
      if (!recipe.ckgMtrlCn) continue;

      // 레시피 재료 파싱
      const recipeIngredients = parseIngredients(recipe.ckgMtrlCn);
      
      if (recipeIngredients.length === 0) continue;

      // 매칭 계산
      const matched: string[] = [];
      const missing: string[] = [];

      for (const ingredient of recipeIngredients) {
        const isMatched = userIngredients.some(userIng => 
          matchIngredient(userIng, ingredient)
        );

        if (isMatched) {
          matched.push(ingredient);
        } else {
          missing.push(ingredient);
        }
      }

      const matchRate = matched.length / recipeIngredients.length;
      const canCook = matchRate >= 0.7;  // 70% 이상 매칭되면 요리 가능

      // 최소 30% 이상 매칭된 것만 추천
      if (matchRate >= 0.3) {
        recommendations.push({
          recipe: {
            rcpSno: recipe.rcpSno.toString(),
            rcpTtl: recipe.rcpTtl,
            ckgNm: recipe.ckgNm,
            ckgIpdc: recipe.ckgIpdc,
            ckgMtrlCn: recipe.ckgMtrlCn,
            ckgInbunNm: recipe.ckgInbunNm,
            ckgDodfNm: recipe.ckgDodfNm,
            ckgTimeNm: recipe.ckgTimeNm,
            rcpImgUrl: recipe.rcpImgUrl,
            ckgKndActoNm: recipe.ckgKndActoNm,
          },
          matchedIngredients: matched,
          missingIngredients: missing,
          matchRate: Math.round(matchRate * 100) / 100,
          canCook
        });
      }
    }

    // 4. 매칭률 순으로 정렬
    recommendations.sort((a, b) => b.matchRate - a.matchRate);

    // 상위 20개만 반환
    const topRecommendations = recommendations.slice(0, 20);

    console.log(`★★★ [레시피 추천] ${topRecommendations.length}개 레시피 추천 완료!`);

    return NextResponse.json({
      totalGroceries: userIngredients.length,
      totalRecipes: allRecipes.length,
      recommendations: topRecommendations.length,
      recipes: topRecommendations
    });

  } catch (error: any) {
    console.error('[레시피 추천] 서버 에러:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 레시피 재료 문자열 파싱
function parseIngredients(ingredientText: string): string[] {
  // "[재료] 떡국떡400g| 다진소고기100g| 멸치육수800ml| 대파1/3대| 계란2개..."
  
  // 1. [재료], [양념] 등의 태그 제거
  const text = ingredientText.replace(/\[.*?\]/g, '');
  
  // 2. |로 분리
  const items = text.split('|').map(s => s.trim());
  
  // 3. 각 항목에서 재료명만 추출 (숫자, 단위 제거)
  const ingredients = items.map(item => {
    // 숫자와 단위 제거 (예: "떡국떡400g" -> "떡국떡")
    const cleaned = item
      .replace(/\d+(\.\d+)?/g, '')  // 숫자 제거
      .replace(/[gmlkL개입봉팩큰술작은술컵T조각통쪽장마리근송이포기개입]/g, '')  // 단위 제거
      .replace(/[\(\)\/\s]/g, '')  // 괄호, 슬래시, 공백 제거
      .trim();
    
    return cleaned;
  }).filter(ing => ing.length > 0 && ing.length < 20);  // 너무 짧거나 긴 것 제외
  
  return [...new Set(ingredients)];  // 중복 제거
}

// 재료 매칭 (유사도 체크)
function matchIngredient(userIngredient: string, recipeIngredient: string): boolean {
  const user = userIngredient.toLowerCase();
  const recipe = recipeIngredient.toLowerCase();
  
  // 1. 완전 일치
  if (user === recipe) return true;
  
  // 2. 포함 관계
  if (user.includes(recipe) || recipe.includes(user)) return true;
  
  // 3. 동의어/유사어 매칭
  const synonyms: Record<string, string[]> = {
    '계란': ['달걀', '에그', 'egg'],
    '우유': ['밀크', 'milk'],
    '소고기': ['쇠고기', 'beef'],
    '돼지고기': ['돼지', '삼겹살', 'pork'],
    '닭고기': ['닭', 'chicken'],
    '대파': ['파', '쪽파'],
    '양파': ['onion'],
    '마늘': ['garlic'],
    '간장': ['진간장', '양조간장'],
    '설탕': ['백설탕'],
  };
  
  for (const [key, values] of Object.entries(synonyms)) {
    if ((user === key || values.includes(user)) && 
        (recipe === key || values.includes(recipe))) {
      return true;
    }
  }
  
  return false;
}
