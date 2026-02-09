import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helpers';
import { recommendRecipes, matchRecipeIngredients } from '@/lib/recommender';

export async function GET() {
  try {
    // 인증된 사용자 확인
    const authResult = await requireAuth();
    if ('error' in authResult) return authResult.error;
    const user = authResult.user;

    // 사용자 보유 식재료 조회
    const userGroceries = await prisma.groceryItem.findMany({
      where: { userId: user.id },
      select: { name: true },
    });
    const userItems = userGroceries.map(g => ({ name: g.name }));

    // 레시피 조회 (재료 있는 것만, 성능 목적 상 상한)
    const rows = await prisma.recipe.findMany({
      where: { ckgMtrlCn: { not: null } },
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
    const recs = recommendRecipes(recipes, {
      id: user.id,
      householdSize: user.householdSize ?? 1,
      cookingPreference,
      allergies: user.allergies ?? [],
    }, userItems, { limit: 20 });

    // 결과가 없으면 2차(완화) 재시도: 인분/선호 무시, 알러지는 유지
    let finalRecs = recs;
    let reasonMode: 'normal' | 'relaxed' | 'popular' = 'normal';
    if (!finalRecs || finalRecs.length === 0) {
      const relaxed = recommendRecipes(recipes, {
        id: user.id,
        householdSize: null,
        cookingPreference: null,
        allergies: user.allergies ?? [],
      }, userItems, { limit: 50 });

      if (relaxed && relaxed.length > 0) {
        finalRecs = relaxed;
        reasonMode = 'relaxed';
      } else {
        // 3차: 인기순으로 DB에서 직접 조회(알러지 제외), 상위 후보들에서 첫번째 선택
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

        // 경량 normalize 함수 (간단히 사용)
        const normalizeText = (t?: string | null) => String(t || '').replace(/\s+/g, '').toLowerCase();

        let popularPick: { recipe: any; score: any } | null = null;
        for (const r of candidates) {
          const candidate = {
            id: String(r.rcpSno),
            rcpSno: String(r.rcpSno),
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
            ingredients: (r.ingredients || []).map((i: any) => ({ recipeId: String(r.rcpSno), ingName: i.ingName })),
          };

          // 알러지 필터 적용 (텍스트/ingredients 비교)
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
            popularPick = { recipe: candidate, score: { recipeId: String(r.rcpSno), totalScore: 0, ingredientScore: 0, householdScore: 0, preferenceScore: 0, popularityScore: 0 } };
            break;
          }
        }

        if (popularPick) {
          finalRecs = [popularPick];
          reasonMode = 'popular';
        } else {
          finalRecs = [];
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
      if (reasonMode === 'normal') {
        const prefText = cookingPreference ?? '추천';
        reason = `👨‍👩‍👧‍👦 당신의 ${user.householdSize}인 가구를 위한 '${prefText}' 레시피!\n✅ ${matchedCount}/${totalCount} 재료가 준비되어 있어요.`;
      } else if (reasonMode === 'relaxed') {
        // 완화 재시도에 대한 문구 (다소 완화된 이유 표기)
        reason = `🔎 일부 조건을 넓혀 추천한 레시피입니다.\n✅ ${matchedCount}/${totalCount} 재료가 준비되어 있어요.`;
      } else {
        // 인기 대체 문구 (조건 맞는 레시피가 없어 인기 레시피를 강제로 추천)
        reason = `🔥 조건에 맞는 레시피가 적어, 인기 레시피를 추천드립니다.`;
      }

      return {
        recipe: {
          ...rec.recipe,
          rcpSno: String(rec.recipe.rcpSno), // BigInt를 String으로 변환
          recommendReason: reason,
        },
        score: rec.score,
      };
    });

    return NextResponse.json({ success: true, recommendations: serializable });
  } catch (error: any) {
    console.error('[API /api/recommend] Error:', error);
    return NextResponse.json({ error: error?.message || String(error) }, { status: 500 });
  }
}
