import {
  User,
  GroceryItem,
  Recipe,
  RecipeIngredient,
  IngredientSynonymMap,
  RecipeScoreDetail,
  RecommendOptions,
  RecommendedRecipe,
} from "@/types/recipe";

// 1. 텍스트 정규화
export function normalize(text: string): string {
  return String(text || "").replace(/\s+/g, "");
}

// 2. 재료 매칭 카운트
export function countMatchingIngredients(recipeText: string, userIngredients: string[]): number {
  const norm = normalize(recipeText);
  let count = 0;
  for (const ing of userIngredients) {
    if (!ing) continue;
    const n = normalize(ing);
    if (n && norm.includes(n)) count += 1;
  }
  return count;
}

// 3. 요리 선호 태깅 로직
export type TagGoal = "냉파" | "완성도" | "건강" | "간편성";
export function classifyGoal(recipe: Recipe, userIngredients: string[]): TagGoal {
  const textAll = [
    recipe.ckgStaActoNm || "",
    recipe.ckgTimeNm || "",
    recipe.ckgDodfNm || "",
    recipe.ckgKndActoNm || "",
    recipe.ckgIpdc || "",
  ].join(" ");
  const recipeIngredients = recipe.ckgMtrlCn || "";
  const matchCount = countMatchingIngredients(recipeIngredients, userIngredients);
  if (matchCount >= 2) return "냉파";
  const finishKeywords = [
    "찜", "조림", "전골", "구이", "튀김",
    "스테이크", "파스타", "정성", "풍부", "깊은", "제대로"
  ];
  const timeAggressive = ["30", "40", "50", "60"];
  if (
    finishKeywords.some(k => textAll.includes(k)) ||
    timeAggressive.some(t => String(recipe.ckgTimeNm || "").includes(t))
  ) return "완성도";
  const healthKeywords = [
    "다이어트", "담백", "영양", "샐러드", "나물", "국",
    "두부", "생선", "닭", "버섯", "해조"
  ];
  if (healthKeywords.some(k => textAll.includes(k))) return "건강";
  return "간편성";
}

// 4. Rule-based 필터링
function parsePortion(portion?: string | null): number | null {
  if (!portion) return null;
  const m = String(portion).match(/(\d+)/);
  if (!m) return null;
  const n = parseInt(m[1], 10);
  if (Number.isNaN(n)) return null;
  return n;
}

export function filterRecipesByRules(recipes: Recipe[], user: User, userItems: GroceryItem[] = []): Recipe[] {
  // 1) household filter
  let out = recipes.filter(r => {
    const inbun = parsePortion(r.ckgInbunNm);
    if (inbun == null) return true;
    if ([1,2,3,4].includes(inbun)) return inbun === user.householdSize;
    if ([5,6].includes(inbun)) return user.householdSize === 4;
    return false;
  });
  // 2) preference filter
  out = out.filter(r => {
    const tag = classifyGoal(r, userItems.map(i => i.name));
    const pref = user.cookingPreference;
    if (!pref) return true;
    if (tag === pref) return true;
    const sta = String(r.ckgStaActoNm || "");
    if (pref && sta.includes(pref)) return true;
    return false;
  });
  // 3) allergy filter
  out = out.filter(r => {
    const mtrl = normalize(r.ckgMtrlCn || "").toLowerCase();
    for (const allergy of user.allergies || []) {
      if (!allergy) continue;
      const a = normalize(allergy).toLowerCase();
      if (a && mtrl.includes(a)) return false;
      if (r.ingredients && r.ingredients.some(i => normalize(i.ingName).toLowerCase() === a)) return false;
    }
    return true;
  });
  return out;
}

// 5. 식재료 매칭 (동의어 포함)
export function matchRecipeIngredients(
  recipe: Recipe,
  userItems: GroceryItem[],
  synonymMap: IngredientSynonymMap = {}
): { matchedCount: number; matchedNames: string[]; coverage: number } {
  const recipeText = normalize(recipe.ckgMtrlCn || "").toLowerCase();
  const userNames = userItems.map(u => String(u.name || "").toLowerCase());
  const matchedNames: string[] = [];
  for (const uname of userNames) {
    if (!uname) continue;
    const candidates = [uname];
    for (const [key, syns] of Object.entries(synonymMap)) {
      const k = key.toLowerCase();
      if (k === uname || syns.map(s=>s.toLowerCase()).includes(uname)) {
        candidates.push(...syns.map(s => s.toLowerCase()));
      }
    }
    let matched = false;
    for (const c of candidates) {
      if (!c) continue;
      if (recipeText.includes(normalize(c))) {
        matched = true;
        matchedNames.push(c);
        break;
      }
    }
  }
  const uniqueMatched = Array.from(new Set(matchedNames));
  const matchedCount = uniqueMatched.length;
  const coverage = userItems.length > 0 ? matchedCount / userItems.length : 0;
  return { matchedCount, matchedNames: uniqueMatched, coverage };
}

// 6. 점수 계산
export function scoreRecipe(
  recipe: Recipe,
  user: User,
  userItems: GroceryItem[],
  synonymMap: IngredientSynonymMap = {}
): RecipeScoreDetail {
  const { coverage } = matchRecipeIngredients(recipe, userItems, synonymMap);
  const ingredientScore = Math.round(Math.min(Math.max(coverage, 0), 1) * 50);
  // household score
  const inbun = parsePortion(recipe.ckgInbunNm);
  let householdScore = 0;
  if (inbun != null) {
    if (([1,2,3,4].includes(inbun) && inbun === user.householdSize) || ([5,6].includes(inbun) && user.householdSize === 4)) {
      householdScore = 20;
    } else if (Math.abs((inbun || 0) - user.householdSize) === 1) {
      householdScore = 10;
    }
  }
  // preference score
  const tag = classifyGoal(recipe, userItems.map(i=>i.name));
  const pref = user.cookingPreference;
  const preferenceScore = pref && (tag === pref || String(recipe.ckgStaActoNm || "").includes(pref)) ? 20 : 0;
  // popularity score
  const views = recipe.viewCount || 0;
  const likes = recipe.likeCount || 0;
  const popMetric = views * 0.001 + likes * 0.01;
  const popularityScore = Math.round(Math.min(popMetric, 1) * 10);
  const total = Math.max(0, Math.min(100, ingredientScore + householdScore + preferenceScore + popularityScore));
  return {
    recipeId: recipe.id,
    totalScore: total,
    ingredientScore,
    householdScore,
    preferenceScore,
    popularityScore,
  };
}

// 7. 전체 추천 파이프라인
export function recommendRecipes(
  recipes: Recipe[],
  user: User,
  userItems: GroceryItem[],
  options: RecommendOptions = {}
): RecommendedRecipe[] {
  const limit = options.limit ?? 20;
  const synonymMap = options.synonymMap ?? ({
    계란: ["달걀", "알", "egg"],
    밥: ["흰밥", "쌀", "밥알"],
    소고기: ["쇠고기", "우둔살", "등심", "안심", "우삼겹", "소고기다짐", "beef"],
    돼지고기: ["돼지", "삼겹살", "목살", "앞다리살", "뒷다리살", "pork"],
    닭: ["닭고기", "닭가슴살", "닭다리", "치킨", "chicken"],
    감자: ["감자", "potato"],
    양파: ["양파", "대파", "쪽파", "onion"],
    파: ["파", "대파", "쪽파"],
    버섯: ["표고", "새송이", "느타리", "버섯", "mushroom"],
    두부: ["두부", "tofu"],
    생선: ["연어", "고등어", "명태", "참치", "생선", "fish"],
    김치: ["김치"],
    스팸: ["스팸", "햄", "spam", "ham"],
    당근: ["당근", "carrot"],
    마늘: ["마늘", "garlic"],
    소스: ["간장", "된장", "고추장", "soy sauce", "bean paste", "red pepper paste"],
  } as IngredientSynonymMap);
  const filtered = filterRecipesByRules(recipes, user, userItems);
  const scored = filtered.map(r => ({ recipe: r, score: scoreRecipe(r, user, userItems, synonymMap) }));
  scored.sort((a,b) => b.score.totalScore - a.score.totalScore);
  return scored.slice(0, limit);
}

export default {
  normalize,
  countMatchingIngredients,
  classifyGoal,
  filterRecipesByRules,
  matchRecipeIngredients,
  scoreRecipe,
  recommendRecipes,
};
