import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helpers';
import { recommendRecipes, matchRecipeIngredients } from '@/lib/recommender';

export async function GET(req: NextRequest) {
  try {
    // 인증된 사용자 확인
    const authResult = await requireAuth();
    if ('error' in authResult) return authResult.error;
    const user = authResult.user;

    // 파라미터 확인: 특정 재료 위주 추천 요청
    const { searchParams } = new URL(req.url);
    const focusedIngredients = searchParams.get('ingredients')?.split(',') || [];

    // 경량 normalize 함수
    const normalizeText = (t?: string | null) => String(t || '').replace(/\s+/g, '').toLowerCase();

    // 사용자 보유 식재료 조회
    const userGroceries = await prisma.groceryItem.findMany({
      where: { userId: user.id },
      select: { name: true },
    });

    // 사용자 재료 + 집중 재료 병합 (중복 제거)
    const uniqueNames = new Set([
      ...userGroceries.map(g => g.name),
      ...focusedIngredients
    ]);

    const userItems = Array.from(uniqueNames).map(name => ({ name }));



    // 레시피 조회 (재료 있는 것만, 성능 목적 상 상한)
    const where: any = { ckgMtrlCn: { not: null } };

    // 특정 재료가 지정된 경우, 해당 재료를 포함하는 레시피를 우선적으로 검색 (DB 레벨 필터)
    // OR 조건으로 '적어도 하나'를 포함하는 레시피 검색
    if (focusedIngredients.length > 0) {
      where.OR = focusedIngredients.map(ing => ({
        ckgMtrlCn: { contains: ing }
      }));
    }

    const rows = await prisma.recipe.findMany({
      where,
      take: 500,
      include: { ingredients: true },
    });

    const recipes = rows.map(r => ({
      id: String(r.rcpSno),
      rcpSno: String(r.rcpSno),  // BigInt를 String으로 변환 (UI에서 key로 사용)
      rcpTtl: r.rcpTtl,  // UI에서 사용
      ckgNm: r.ckgNm,    // UI에서 사용
      rcpImgUrl: r.rcpImgUrl,  // UI에서 이미지로 사용
      ckgInbunNm: r.ckgInbunNm,
      ckgStaActoNm: r.ckgStaActoNm,
      ckgTimeNm: r.ckgTimeNm,
      ckgDodfNm: r.ckgDodfNm,
      ckgKndActoNm: r.ckgKndActoNm,
      ckgIpdc: r.ckgIpdc,
      ckgMtrlCn: r.ckgMtrlCn,
      viewCount: r.inqCnt ?? 0,
      likeCount: r.rcmmCnt ?? 0,
      ingredients: (r.ingredients || []).map(i => ({ recipeId: String(r.rcpSno), ingName: i.ingName })),
    }));

    // 추천 엔진 호출
    // 요리 선호도는 4가지로 제한: 냉파, 완성도, 건강, 간편성
    const allowedPreferences = ["냉파", "완성도", "건강", "간편성"];
    let cookingPreference: string | null = user.cookingPreference ?? null;
    if (cookingPreference && !allowedPreferences.includes(cookingPreference)) {
      cookingPreference = null;
    }
    // 1차 추천 (기본 필터)
    let finalRecs = recommendRecipes(recipes, {
      id: user.id,
      householdSize: user.householdSize ?? 1,
      cookingPreference,
      allergies: user.allergies ?? [],
    }, userItems, { limit: 20 });

    if (!finalRecs) finalRecs = [];

    // 2차(완화) 재시도: 결과가 5개 미만이면 추가
    if (finalRecs.length < 5) {
      const relaxed = recommendRecipes(recipes, {
        id: user.id,
        householdSize: null,
        cookingPreference: null,
        allergies: user.allergies ?? [],
      }, userItems, { limit: 50 });

      if (relaxed && relaxed.length > 0) {
        // 중복 제거 후 추가
        const existingIds = new Set(finalRecs.map(r => r.recipe.id));
        for (const r of relaxed) {
          if (finalRecs.length >= 5) break;
          if (!existingIds.has(r.recipe.id)) {
            // 완화된 추천임을 표시하기 위해 score 객체에 메타데이터 추가 가능하지만, 
            // 여기서는 로직 단순화를 위해 그대로 추가. 
            // 단, 추천 사유 생성을 위해 recipe 객체에 임시 플래그를 달거나, 
            // 아래 매핑 로직에서 판별해야 함. 
            // 현재 구조상 recipe 객체에 직접 넣기는 어려우므로, 
            // 별도 리스트로 관리하거나, score에 태깅하는 것이 좋으나
            // 기존 타입 유지를 위해 일단 추가하고, 나중에 점수/매칭률로 사유 생성.
            finalRecs.push(r);
            existingIds.add(r.recipe.id);
          }
        }
      }
    }

    // 3차(인기): 여전히 5개 미만이면 인기 레시피로 채움
    if (finalRecs.length < 5) {
      const candidates = await prisma.recipe.findMany({
        where: { ckgMtrlCn: { not: null } },
        take: 200,
        orderBy: [
          { inqCnt: 'desc' },
          { rcmmCnt: 'desc' },
          { srapCnt: 'desc' },
        ],
        include: { ingredients: true },
      });



      const existingIds = new Set(finalRecs.map(r => r.recipe.id));

      for (const r of candidates) {
        if (finalRecs.length >= 5) break;
        const scanId = String(r.rcpSno);
        if (existingIds.has(scanId)) continue;

        const candidate = {
          id: scanId,
          rcpSno: scanId,
          rcpTtl: r.rcpTtl,
          ckgNm: r.ckgNm,
          rcpImgUrl: r.rcpImgUrl,
          ckgInbunNm: r.ckgInbunNm,
          ckgStaActoNm: r.ckgStaActoNm,
          ckgTimeNm: r.ckgTimeNm,
          ckgDodfNm: r.ckgDodfNm,
          ckgKndActoNm: r.ckgKndActoNm,
          ckgIpdc: r.ckgIpdc,
          ckgMtrlCn: r.ckgMtrlCn,
          viewCount: r.inqCnt ?? 0,
          likeCount: r.rcmmCnt ?? 0,
          ingredients: (r.ingredients || []).map((i: any) => ({ recipeId: scanId, ingName: i.ingName })),
        };

        // 알러지 필터 적용
        let hasAllergy = false;
        const mtrl = normalizeText(candidate.ckgMtrlCn);
        for (const allergy of user.allergies || []) {
          if (!allergy) continue;
          const a = normalizeText(allergy);
          if (!a) continue;
          if (mtrl.includes(a)) { hasAllergy = true; break; }
          if (candidate.ingredients && candidate.ingredients.some((ii: any) => normalizeText(ii.ingName) === a)) { hasAllergy = true; break; }
        }

        if (!hasAllergy) {
          // 인기 레시피 추가 (점수는 0 또는 낮게 설정하여 구분 가능하게 함)
          const matched = matchRecipeIngredients(candidate as any, userItems);
          const matchedNames = new Set(matched.matchedNames.map(n => normalizeText(n)));

          finalRecs.push({
            recipe: {
              ...candidate,
              ingredients: (candidate.ingredients || []).map((i: any) => ({
                recipeId: scanId,
                ingName: i.ingName,
                isOwned: matchedNames.has(normalizeText(i.ingName))
              }))
            } as any,
            score: { recipeId: scanId, totalScore: 0, ingredientScore: 0, householdScore: 0, preferenceScore: 0, popularityScore: 0 }
          });
          existingIds.add(scanId);
        }
      }
    }



    // 각 추천에 대해 사용자 근거(설명) 생성하고 BigInt를 문자열로 변환
    const serializable = finalRecs.map(rec => {
      const matched = matchRecipeIngredients(rec.recipe, userItems);
      const matchedCount = matched.matchedCount;
      const totalCount = (String(rec.recipe.ckgMtrlCn || '')
        .split(/[\n,·\/\|\\]+/) // 분리자
        .map(s => s.trim())
        .filter(Boolean)).length || 0;


      let reason = '';

      // 추천 사유 동적 생성
      if (rec.score && rec.score.totalScore > 0) {
        // 정상/완화 추천 (점수가 있음)
        const isStrict = rec.score.householdScore > 0 && rec.score.preferenceScore > 0;
        if (isStrict) {
          const prefText = cookingPreference ?? '추천';
          reason = `👨‍👩‍👧‍👦 당신의 ${user.householdSize}인 가구를 위한 '${prefText}' 레시피!\n✅ ${matchedCount}/${totalCount} 재료가 준비되어 있어요.`;
        } else {
          reason = `🔎 일부 조건을 넓혀 추천한 레시피입니다.\n✅ ${matchedCount}/${totalCount} 재료가 준비되어 있어요.`;
        }
      } else {
        reason = `🔥 조건에 맞는 레시피가 적어, 인기 레시피를 추천드립니다.`;
      }

      return {
        recipe: {
          ...rec.recipe,
          rcpSno: String(rec.recipe.rcpSno), // BigInt를 String으로 변환
          recommendReason: reason,
          ingredients: (() => {
            let initialIngs: any[] = rec.recipe.ingredients || [];
            if (initialIngs.length === 0 && rec.recipe.ckgMtrlCn) {
              // Parse ckgMtrlCn if structured ingredients are missing
              initialIngs = rec.recipe.ckgMtrlCn.split(/,|\[|\]|\n/).map((s: string) => ({ ingName: s.trim() })).filter((i: any) => i.ingName && !i.ingName.match(/^재료/));
            }

            return initialIngs.map((i: any) => {
              const norm = normalizeText(i.ingName);
              return {
                ...i,
                isOwned: matched.matchedNames.some(m => normalizeText(m) === norm || norm.includes(normalizeText(m)) || normalizeText(m).includes(norm))
              };
            });
          })()
        },
        score: rec.score,
      };
    });

    const jsonResponse = JSON.stringify(
      { success: true, recommendations: serializable },
      (key, value) => (typeof value === 'bigint' ? value.toString() : value)
    );
    return new NextResponse(jsonResponse, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('[API /api/recommend] Error:', error);
    return new NextResponse(
      JSON.stringify(
        { error: error?.message || String(error) },
        (key, value) => (typeof value === 'bigint' ? value.toString() : value)
      ),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
