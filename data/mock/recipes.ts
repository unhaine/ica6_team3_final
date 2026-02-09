export interface MockRecipe {
    rcpSno: number;
    rcpTtl: string;
    ckgNm: string;
    rgtrId?: string;
    rgtrNm?: string;
    inqCnt: number;
    rcmmCnt: number;
    srapCnt: number;
    ckgMthActoNm?: string;
    ckgStaActoNm?: string;
    ckgMtrlActoNm?: string;
    ckgKndActoNm?: string;
    ckgIpdc?: string;
    ckgMtrlCn?: string;
    ckgInbunNm?: string;
    ckgDodfNm?: string;
    ckgTimeNm?: string;
    firstRegDt?: string;
    rcpImgUrl?: string;
}

export const MOCK_RECIPES: MockRecipe[] = [
    {
        rcpSno: 1,
        rcpTtl: "간단한 김치볶음밥",
        ckgNm: "김치볶음밥",
        rgtrId: "admin",
        rgtrNm: "관리자",
        inqCnt: 1250,
        rcmmCnt: 320,
        srapCnt: 180,
        ckgMthActoNm: "볶기",
        ckgStaActoNm: "혼밥",
        ckgMtrlActoNm: "김치",
        ckgKndActoNm: "한식",
        ckgIpdc: "냉장고에 남은 김치로 간단하게 만드는 김치볶음밥입니다. 혼자 먹기 딱 좋은 한 끼!",
        ckgMtrlCn: "밥 1공기, 김치 1/2컵, 참기름 1큰술, 김 약간, 계란 1개",
        ckgInbunNm: "1인분",
        ckgDodfNm: "쉬움",
        ckgTimeNm: "10분 이내",
        firstRegDt: "20240101120000",
        rcpImgUrl: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&q=80"
    },
    {
        rcpSno: 2,
        rcpTtl: "크리미 까르보나라",
        ckgNm: "까르보나라",
        rgtrId: "chef01",
        rgtrNm: "셰프김",
        inqCnt: 2100,
        rcmmCnt: 580,
        srapCnt: 420,
        ckgMthActoNm: "삶기",
        ckgStaActoNm: "일상",
        ckgMtrlActoNm: "파스타면",
        ckgKndActoNm: "양식",
        ckgIpdc: "부드럽고 크리미한 까르보나라 파스타. 베이컨과 달걀 노른자의 환상 조합!",
        ckgMtrlCn: "스파게티면 100g, 베이컨 3줄, 달걀노른자 2개, 파마산치즈 30g, 생크림 50ml, 후추 약간",
        ckgInbunNm: "1인분",
        ckgDodfNm: "보통",
        ckgTimeNm: "20분",
        firstRegDt: "20240115093000",
        rcpImgUrl: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&q=80"
    },
    {
        rcpSno: 3,
        rcpTtl: "매콤 닭가슴살 샐러드",
        ckgNm: "닭가슴살샐러드",
        rgtrId: "healthy_cook",
        rgtrNm: "헬시쿡",
        inqCnt: 890,
        rcmmCnt: 210,
        srapCnt: 150,
        ckgMthActoNm: "굽기",
        ckgStaActoNm: "다이어트",
        ckgMtrlActoNm: "닭가슴살",
        ckgKndActoNm: "샐러드",
        ckgIpdc: "다이어트에 좋은 고단백 저칼로리 샐러드. 매콤한 소스가 포인트!",
        ckgMtrlCn: "닭가슴살 150g, 양상추 2컵, 방울토마토 5개, 오이 1/2개, 고추장 1큰술, 식초 1큰술, 올리브오일 1큰술",
        ckgInbunNm: "1인분",
        ckgDodfNm: "쉬움",
        ckgTimeNm: "15분",
        firstRegDt: "20240120140000",
        rcpImgUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80"
    },
    {
        rcpSno: 4,
        rcpTtl: "부드러운 계란찜",
        ckgNm: "계란찜",
        rgtrId: "homecook",
        rgtrNm: "집밥요리사",
        inqCnt: 1580,
        rcmmCnt: 390,
        srapCnt: 280,
        ckgMthActoNm: "찌기",
        ckgStaActoNm: "일상",
        ckgMtrlActoNm: "계란",
        ckgKndActoNm: "한식",
        ckgIpdc: "부드럽고 폭신한 계란찜. 밥 반찬으로 최고!",
        ckgMtrlCn: "계란 3개, 물 1컵, 소금 약간, 대파 약간, 새우젓 1/2큰술",
        ckgInbunNm: "2인분",
        ckgDodfNm: "쉬움",
        ckgTimeNm: "15분",
        firstRegDt: "20240125100000",
        rcpImgUrl: "https://images.unsplash.com/photo-1587486937736-e8c6a2f6d4c7?w=800&q=80"
    },
    {
        rcpSno: 5,
        rcpTtl: "참치마요 주먹밥",
        ckgNm: "참치마요주먹밥",
        rgtrId: "lunchbox",
        rgtrNm: "도시락왕",
        inqCnt: 950,
        rcmmCnt: 240,
        srapCnt: 190,
        ckgMthActoNm: "비비기",
        ckgStaActoNm: "도시락",
        ckgMtrlActoNm: "참치캔",
        ckgKndActoNm: "한식",
        ckgIpdc: "간편하게 만들 수 있는 참치마요 주먹밥. 도시락 메뉴로 완벽!",
        ckgMtrlCn: "밥 2공기, 참치캔 1개, 마요네즈 2큰술, 김 2장, 소금 약간",
        ckgInbunNm: "2인분",
        ckgDodfNm: "쉬움",
        ckgTimeNm: "10분 이내",
        firstRegDt: "20240201113000",
        rcpImgUrl: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=800&q=80"
    },
    {
        rcpSno: 6,
        rcpTtl: "토마토 달걀 볶음",
        ckgNm: "토마토달걀볶음",
        rgtrId: "chinese_food",
        rgtrNm: "중식마스터",
        inqCnt: 720,
        rcmmCnt: 180,
        srapCnt: 120,
        ckgMthActoNm: "볶기",
        ckgStaActoNm: "혼밥",
        ckgMtrlActoNm: "토마토",
        ckgKndActoNm: "중식",
        ckgIpdc: "새콤달콤한 토마토와 부드러운 달걀의 조화. 중국 가정식의 대표 메뉴!",
        ckgMtrlCn: "토마토 2개, 계란 3개, 설탕 1큰술, 소금 약간, 대파 약간, 식용유 2큰술",
        ckgInbunNm: "2인분",
        ckgDodfNm: "쉬움",
        ckgTimeNm: "15분",
        firstRegDt: "20240205150000",
        rcpImgUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80"
    },
    {
        rcpSno: 7,
        rcpTtl: "간단 새우볶음밥",
        ckgNm: "새우볶음밥",
        rgtrId: "quickmeal",
        rgtrNm: "퀵밀",
        inqCnt: 1100,
        rcmmCnt: 270,
        srapCnt: 200,
        ckgMthActoNm: "볶기",
        ckgStaActoNm: "혼밥",
        ckgMtrlActoNm: "새우",
        ckgKndActoNm: "중식",
        ckgIpdc: "냉동 새우로 간단하게 만드는 중식 볶음밥. 고소하고 담백해요!",
        ckgMtrlCn: "밥 1공기, 냉동새우 100g, 계란 1개, 당근 1/4개, 양파 1/4개, 간장 1큰술, 참기름 약간",
        ckgInbunNm: "1인분",
        ckgDodfNm: "쉬움",
        ckgTimeNm: "15분",
        firstRegDt: "20240210120000",
        rcpImgUrl: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&q=80"
    },
    {
        rcpSno: 8,
        rcpTtl: "치즈 듬뿍 오므라이스",
        ckgNm: "치즈오므라이스",
        rgtrId: "western_cook",
        rgtrNm: "양식요리사",
        inqCnt: 1850,
        rcmmCnt: 480,
        srapCnt: 350,
        ckgMthActoNm: "볶기",
        ckgStaActoNm: "일상",
        ckgMtrlActoNm: "계란",
        ckgKndActoNm: "양식",
        ckgIpdc: "치즈가 듬뿍 들어간 부드러운 오므라이스. SNS 인증샷 필수!",
        ckgMtrlCn: "밥 1공기, 계란 3개, 체다치즈 50g, 양파 1/4개, 햄 50g, 케첩 3큰술, 버터 1큰술",
        ckgInbunNm: "1인분",
        ckgDodfNm: "보통",
        ckgTimeNm: "20분",
        firstRegDt: "20240215140000",
        rcpImgUrl: "https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=800&q=80"
    }
];

// 랜덤 레시피 가져오기 헬퍼 함수
export function getRandomRecipes(count: number = 5): MockRecipe[] {
    const shuffled = [...MOCK_RECIPES].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, MOCK_RECIPES.length));
}

// 특정 상황별 레시피 필터링
export function getRecipesByCategory(category: string): MockRecipe[] {
    return MOCK_RECIPES.filter(recipe => recipe.ckgStaActoNm === category);
}

// 혼밥 레시피만 가져오기
export function getSoloRecipes(): MockRecipe[] {
    return getRecipesByCategory("혼밥");
}
