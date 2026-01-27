import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// 재료 리스트로 직접 레시피 추천
// 인증 없이 빠르게 프로토타입 테스트용

interface RecommendedRecipe {
  recipe: any;
  matchedIngredients: string[];
  missingIngredients: string[];
  matchRate: number;
  canCook: boolean;
}

export async function POST(req: NextRequest) {
  try {
    const { ingredients } = await req.json();

    console.log('★★★ [레시피 추천 (재료 직접)] 요청 수신 ★★★');

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return NextResponse.json({ 
        error: '재료 목록이 필요합니다.' 
      }, { status: 400 });
    }

    const userIngredients = ingredients.map(ing => 
      ing.toLowerCase().trim()
    );

    console.log('입력 재료:', userIngredients);

    // 모든 레시피 조회 (재료 정보가 있는 것만)
    const allRecipes = await prisma.recipe.findMany({
      where: {
        ckgMtrlCn: { not: null }
      },
      take: 1000  // 최대 1000개
    });

    console.log(`총 ${allRecipes.length}개 레시피 검색 중...`);

    if (allRecipes.length === 0) {
      return NextResponse.json({
        message: '레시피 데이터가 없습니다. Recipe 테이블에 데이터를 먼저 넣어주세요.',
        recipes: []
      });
    }

    // 각 레시피와 보유 재료 매칭
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
      const canCook = matchRate >= 0.6;  // 60% 이상 매칭되면 요리 가능

      // 최소 20% 이상 매칭된 것만 추천 (낮춰서 더 많은 결과)
      if (matchRate >= 0.2) {
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

    // 매칭률 순으로 정렬
    recommendations.sort((a, b) => b.matchRate - a.matchRate);

    // 상위 30개만 반환
    const topRecommendations = recommendations.slice(0, 30);

    console.log(`★★★ [레시피 추천] ${topRecommendations.length}개 레시피 추천 완료!`);
    
    if (topRecommendations.length > 0) {
      console.log('Top 3 추천:');
      topRecommendations.slice(0, 3).forEach((rec, idx) => {
        console.log(`${idx + 1}. ${rec.recipe.ckgNm} (${rec.matchRate * 100}% 매칭)`);
      });
    }

    return NextResponse.json({
      inputIngredients: ingredients,
      totalRecipes: allRecipes.length,
      matchedRecipes: recommendations.length,
      topRecommendations: topRecommendations.length,
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
    // 숫자와 단위 제거
    const cleaned = item
      .replace(/\d+(\.\d+)?/g, '')  // 숫자 제거
      .replace(/[gmlkL개입봉팩큰술작은술컵T조각통쪽장마리근송이포기대]/g, '')  // 단위 제거
      .replace(/[\(\)\/\s]/g, '')  // 괄호, 슬래시, 공백 제거
      .trim();
    
    return cleaned;
  }).filter(ing => ing.length > 0 && ing.length < 20);
  
  return [...new Set(ingredients)];  // 중복 제거
}

// 재료 매칭 (유사도 체크)
function matchIngredient(userIngredient: string, recipeIngredient: string): boolean {
  const user = userIngredient.toLowerCase();
  const recipe = recipeIngredient.toLowerCase();
  
  // 1. 완전 일치
  if (user === recipe) return true;
  
  // 2. 포함 관계 (더 유연하게)
  if (user.includes(recipe) || recipe.includes(user)) return true;
  
  // 3. 동의어/유사어 매칭 (확장)
  const synonyms: Record<string, string[]> = {
    '소스': ['sauce', '소오스', '드레싱'],
    '식용유': ['기름', '올리브유', '참기름', '식물성기름', 'oil'],
    '물': ['water', '생수', '정수'],
    '와인': ['wine', '적포도주', '백포도주'],
    '계란': ['달걀', '에그', 'egg', '란'],
    '우유': ['밀크', 'milk'],
    '소고기': ['쇠고기', 'beef', '육류'],
    '돼지고기': ['돼지', '삼겹살', 'pork'],
    '닭고기': ['닭', 'chicken', '치킨'],
    '대파': ['파', '쪽파', '녹색파'],
    '양파': ['onion'],
    '마늘': ['garlic', '다진마늘'],
    '간장': ['진간장', '양조간장', '국간장'],
    '설탕': ['백설탕', '황설탕'],
    '소금': ['salt', '천일염'],
    '후추': ['pepper', '흑후추'],
    '고추': ['청양고추', '홍고추'],
    '김치': ['배추김치', '깍두기'],
  };
  
  for (const [key, values] of Object.entries(synonyms)) {
    if ((user === key || values.includes(user)) && 
        (recipe === key || values.includes(recipe))) {
      return true;
    }
  }
  
  return false;
}
