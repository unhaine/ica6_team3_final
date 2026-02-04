import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';

// Phase 1: Rule-based Filter 레시피 추천
// 온보딩 설문 + 냉장고 식재료 기반 추천

interface RecommendedRecipe {
  recipe: {
    rcpSno: string;
    rcpTtl: string | null;
    ckgNm: string | null;
    ckgIpdc: string | null;
    ckgMtrlCn: string | null;
    ckgInbunNm: string | null;
    ckgDodfNm: string | null;
    ckgTimeNm: string | null;
    ckgStaActoNm: string | null;
    ckgKndActoNm: string | null;
    rcpImgUrl: string | null;
  };
  matchedIngredients: string[];
  missingIngredients: string[];
  ingredientMatchRate: number;
  totalScore: number;
  filterReasons: string[];
}

export async function GET(req: NextRequest) {
  try {
    // 1. 인증 확인
    const authResult = await requireAuth();
    if ('error' in authResult) {
      return authResult.error;
    }
    const user = authResult.user;

    console.log('★★★ [Rule-based 추천] 사용자:', user.id);

    // 2. 사용자 설문조사 정보 조회
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        householdSize: true,
        cookingPreference: true,
        allergies: true,
      },
    });

    if (!userData) {
      return NextResponse.json({ 
        error: '사용자 정보를 찾을 수 없습니다.' 
      }, { status: 404 });
    }

    // 3. 사용자의 냉장고 식재료 조회
    const userGroceries = await prisma.groceryItem.findMany({
      where: { userId: user.id },
      select: { name: true },
    });

    const userIngredients = userGroceries.map(g => g.name.toLowerCase().trim());
    console.log('보유 식재료:', userIngredients);
    console.log('가구 인원:', userData.householdSize);
    console.log('요리 선호:', userData.cookingPreference);
    console.log('알러지:', userData.allergies);

    // 4. Recipe 필터링 쿼리 구성
    const whereConditions: any = {
      ckgMtrlCn: { not: null },
    };

    // 4-1. 가구 인원 필터 (ckg_inbun_nm)
    if (userData.householdSize) {
      const householdMapping: Record<number, string[]> = {
        1: ['1인분', '1~2인분', '1-2인분'],
        2: ['2인분', '1~2인분', '1-2인분', '2~3인분', '2-3인분'],
        3: ['3인분', '2~3인분', '2-3인분', '3~4인분', '3-4인분'],
        4: ['4인분', '3~4인분', '3-4인분', '4인분이상', '4인분 이상'],
      };

      const matchingPortions = householdMapping[userData.householdSize] || [];
      if (matchingPortions.length > 0) {
        whereConditions.ckgInbunNm = {
          in: matchingPortions,
        };
      }
    }

    // 4-2. 요리 선호 필터 (ckg_sta_acto_nm)
    if (userData.cookingPreference) {
      whereConditions.ckgStaActoNm = {
        contains: userData.cookingPreference,
      };
    }

    // 5. Recipe 조회 (필터 적용)
    const recipes = await prisma.recipe.findMany({
      where: whereConditions,
      take: 200, // 성능을 위해 200개만
      orderBy: [
        { inqCnt: 'desc' }, // 조회수 높은 순
        { rcmmCnt: 'desc' }, // 추천수 높은 순
      ],
    });

    console.log(`필터링 후 ${recipes.length}개 레시피 검색 중...`);

    // 6. 알러지 필터링 및 식재료 매칭
    const recommendations: RecommendedRecipe[] = [];

    for (const recipe of recipes) {
      if (!recipe.ckgMtrlCn) continue;

      const filterReasons: string[] = [];

      // 6-1. 알러지 체크
      if (userData.allergies && userData.allergies.length > 0) {
        const hasAllergy = userData.allergies.some(allergy => 
          recipe.ckgMtrlCn!.toLowerCase().includes(allergy.toLowerCase())
        );

        if (hasAllergy) {
          // 알러지 재료 포함 -> 제외
          continue;
        }
      }

      // 6-2. 필터 이유 기록
      if (userData.householdSize) {
        filterReasons.push(`${userData.householdSize}인 가구에 적합`);
      }
      if (userData.cookingPreference) {
        filterReasons.push(`${userData.cookingPreference} 추천`);
      }

      // 6-3. 식재료 매칭 계산
      const recipeIngredients = parseIngredients(recipe.ckgMtrlCn);
      
      if (recipeIngredients.length === 0) continue;

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

      const ingredientMatchRate = recipeIngredients.length > 0 
        ? matched.length / recipeIngredients.length 
        : 0;

      // 6-4. 총점 계산 (가중치 적용)
      let totalScore = 0;
      
      // 식재료 매칭률 (0~50점)
      totalScore += ingredientMatchRate * 50;
      
      // 가구 인원 매칭 (0~20점)
      if (userData.householdSize && recipe.ckgInbunNm) {
        totalScore += 20;
      }
      
      // 요리 선호 매칭 (0~20점)
      if (userData.cookingPreference && recipe.ckgStaActoNm?.includes(userData.cookingPreference)) {
        totalScore += 20;
      }
      
      // 조회수/추천수 (0~10점)
      const popularity = ((recipe.inqCnt || 0) + (recipe.rcmmCnt || 0)) / 1000;
      totalScore += Math.min(popularity, 10);

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
          ckgStaActoNm: recipe.ckgStaActoNm,
          ckgKndActoNm: recipe.ckgKndActoNm,
          rcpImgUrl: recipe.rcpImgUrl,
        },
        matchedIngredients: matched,
        missingIngredients: missing,
        ingredientMatchRate: Math.round(ingredientMatchRate * 100) / 100,
        totalScore: Math.round(totalScore * 100) / 100,
        filterReasons,
      });
    }

    // 7. 총점 순으로 정렬
    recommendations.sort((a, b) => b.totalScore - a.totalScore);

    // 상위 20개만 반환
    const topRecommendations = recommendations.slice(0, 20);

    console.log(`★★★ [Rule-based 추천] ${topRecommendations.length}개 레시피 추천 완료!`);

    return NextResponse.json({
      user: {
        householdSize: userData.householdSize,
        cookingPreference: userData.cookingPreference,
        allergies: userData.allergies,
        groceryCount: userIngredients.length,
      },
      totalRecipes: recipes.length,
      recommendations: topRecommendations.length,
      recipes: topRecommendations,
    });

  } catch (error: any) {
    console.error('[Rule-based 추천] 서버 에러:', error);
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
      .replace(/[gmlkL개입봉팩큰술작은술컵T조각통쪽장마리근송이포기]/g, '')  // 단위 제거
      .replace(/[\(\)\/\s~]/g, '')  // 괄호, 슬래시, 공백, ~ 제거
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
    '계란': ['달걀', '에그', 'egg', '계란'],
    '우유': ['밀크', 'milk'],
    '소고기': ['쇠고기', 'beef', '다진소고기', '소고깃가루'],
    '돼지고기': ['돼지', '삼겹살', 'pork', '목살', '앞다리'],
    '닭고기': ['닭', 'chicken', '닭가슴살', '닭다리'],
    '대파': ['파', '쪽파', '실파'],
    '양파': ['onion'],
    '마늘': ['garlic', '다진마늘'],
    '간장': ['진간장', '양조간장', '국간장'],
    '설탕': ['백설탕', '황설탕'],
    '김치': ['배추김치', '포기김치', '익은김치'],
    '두부': ['연두부', '순두부', '부침두부'],
    '고추': ['청양고추', '홍고추', '풋고추'],
    '버섯': ['느타리버섯', '팽이버섯', '새송이버섯'],
  };
  
  for (const [key, values] of Object.entries(synonyms)) {
    if ((user === key || values.includes(user)) && 
        (recipe === key || values.includes(recipe))) {
      return true;
    }
  }
  
  return false;
}
