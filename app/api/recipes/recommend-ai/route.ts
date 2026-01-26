import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// OpenAI API를 사용한 지능형 레시피 추천
// 사용자가 보유한 재료로 만들 수 있는 레시피를 AI가 추천

interface RecommendedRecipe {
  recipe: any;
  matchedIngredients: string[];
  missingIngredients: string[];
  matchRate: number;
  canCook: boolean;
  reason?: string;
}

export async function POST(req: NextRequest) {
  try {
    const { ingredients } = await req.json();
    const apiKey = process.env.OPENAI_API_KEY;

    console.log('★★★ [AI 레시피 추천] 요청 수신 ★★★');

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return NextResponse.json({ 
        error: '재료 목록이 필요합니다.' 
      }, { status: 400 });
    }

    if (!apiKey) {
      return NextResponse.json({ 
        error: 'OpenAI API 키가 설정되지 않았습니다.' 
      }, { status: 500 });
    }

    console.log('보유 재료:', ingredients);

    // 1. Recipe 테이블에서 레시피 가져오기 (샘플링)
    const recipes = await prisma.recipe.findMany({
      where: {
        ckgMtrlCn: { not: null }
      },
      take: 100,  // 처음 100개만 (성능 고려)
      select: {
        rcpSno: true,
        rcpTtl: true,
        ckgNm: true,
        ckgIpdc: true,
        ckgMtrlCn: true,
        ckgInbunNm: true,
        ckgDodfNm: true,
        ckgTimeNm: true,
        rcpImgUrl: true,
        ckgKndActoNm: true,
      }
    });

    if (recipes.length === 0) {
      return NextResponse.json({
        message: '레시피 데이터가 없습니다.',
        recipes: []
      });
    }

    console.log(`${recipes.length}개 레시피 중 AI 분석 시작...`);

    // 2. OpenAI API로 레시피 매칭 분석
    const recipesForAI = recipes.map(r => ({
      id: r.rcpSno.toString(),
      name: r.ckgNm,
      ingredients: r.ckgMtrlCn
    }));

    const prompt = `당신은 요리 전문가입니다. 사용자가 보유한 재료로 만들 수 있는 레시피를 추천해주세요.

**사용자 보유 재료:**
${ingredients.join(', ')}

**레시피 목록:**
${recipesForAI.slice(0, 30).map(r => `
- ID: ${r.id}
- 요리: ${r.name}
- 필요재료: ${r.ingredients}
`).join('\n')}

**지침:**
1. 각 레시피의 필요 재료를 분석하세요
2. 사용자가 보유한 재료와 매칭되는 정도를 계산하세요
3. 매칭률이 높은 순서로 상위 10개 레시피를 추천하세요
4. 동의어도 고려하세요 (예: 계란=달걀, 소스=드레싱, 간장=진간장)
5. 조미료(소금, 설탕, 간장 등)는 기본 재료로 간주하세요

**응답 형식 (JSON만):**
[
  {
    "recipeId": "7016813",
    "matchedIngredients": ["소고기", "대파"],
    "missingIngredients": ["떡국떡", "멸치육수"],
    "matchRate": 0.6,
    "canCook": false,
    "reason": "소고기와 대파가 있지만 떡국떡이 필요합니다"
  }
]`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',  // 빠르고 저렴한 모델
        messages: [
          { role: 'system', content: '당신은 요리 전문가이자 재료 매칭 전문가입니다.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 2000,
        response_format: { type: "json_object" }
      }),
    });

    const aiResult = await response.json();

    if (!response.ok) {
      console.error('OpenAI API 에러:', aiResult);
      throw new Error(aiResult.error?.message || 'OpenAI API 호출 실패');
    }

    const aiContent = aiResult.choices?.[0]?.message?.content;
    if (!aiContent) {
      throw new Error('OpenAI 응답이 비어있습니다');
    }

    console.log('OpenAI 응답:', aiContent.substring(0, 500));

    // 3. AI 응답 파싱
    let aiRecommendations: any[] = [];
    try {
      const parsed = JSON.parse(aiContent);
      // 응답이 { recommendations: [...] } 형식일 수도 있음
      aiRecommendations = Array.isArray(parsed) ? parsed : (parsed.recommendations || []);
    } catch (parseError) {
      console.error('AI 응답 파싱 실패:', parseError);
      // AI 응답 파싱 실패 시 폴백: 간단한 텍스트 매칭
      return fallbackRecommendation(ingredients, recipes);
    }

    // 4. AI 추천을 실제 레시피 데이터와 결합
    const finalRecommendations: RecommendedRecipe[] = [];

    for (const aiRec of aiRecommendations) {
      const recipe = recipes.find(r => r.rcpSno.toString() === aiRec.recipeId);
      if (!recipe) continue;

      finalRecommendations.push({
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
        matchedIngredients: aiRec.matchedIngredients || [],
        missingIngredients: aiRec.missingIngredients || [],
        matchRate: aiRec.matchRate || 0,
        canCook: aiRec.canCook || false,
        reason: aiRec.reason
      });
    }

    console.log(`★★★ [AI 레시피 추천] ${finalRecommendations.length}개 추천 완료!`);

    return NextResponse.json({
      inputIngredients: ingredients,
      totalRecipes: recipes.length,
      recommendations: finalRecommendations.length,
      recipes: finalRecommendations,
      aiPowered: true
    });

  } catch (error: any) {
    console.error('[AI 레시피 추천] 서버 에러:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 폴백: OpenAI 실패 시 간단한 텍스트 매칭
function fallbackRecommendation(ingredients: string[], recipes: any[]) {
  console.log('폴백 모드: 간단한 텍스트 매칭 사용');
  
  const recommendations = recipes
    .map(recipe => {
      const recipeText = (recipe.ckgMtrlCn || '').toLowerCase();
      const matched = ingredients.filter(ing => 
        recipeText.includes(ing.toLowerCase())
      );
      const matchRate = matched.length / Math.max(ingredients.length, 1);

      return {
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
        missingIngredients: [],
        matchRate,
        canCook: matchRate >= 0.5
      };
    })
    .filter(r => r.matchRate > 0)
    .sort((a, b) => b.matchRate - a.matchRate)
    .slice(0, 10);

  return NextResponse.json({
    recipes: recommendations,
    aiPowered: false,
    fallback: true
  });
}
