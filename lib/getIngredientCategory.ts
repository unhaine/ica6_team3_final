// KOREAN_KEYWORD_MAP from getIngredientIcon.ts could be utilized or recreated here
// for simplicity and modularity, we map keyword groups to standard categories
// Categories: "meat" | "seafood" | "vegetable" | "dairy" | "fruit" | "etc"

const CATEGORY_MAP: Record<string, string[]> = {
    meat: [
        '소고기', '돼지고기', '닭고기', '닭', '베이컨', '소시지', '햄', '오리', '사골', '뼈', '치킨', '너겟'
    ],
    seafood: [
        '새우', '오징어', '문어', '낙지', '게', '생선', '고등어', '연어', '치어', '멸치', '어묵', '맛살', '김', '미역', '굴', '참치', '초밥'
    ],
    vegetable: [
        '양파', '마늘', '파', '대파', '쪽파', '감자', '고구마', '당근', '오이', '호박', '단호박', '애호박',
        '고추', '청양고추', '홍고추', '파프리카', '피망', '버섯', '양송이', '표고버섯', '배추', '양배추',
        '상추', '깻잎', '브로콜리', '샐러드', '콩', '완두콩', '가지', '무', '샐러리', '옥수수', '고사리', '새싹', '생강', '아보카도'
    ],
    dairy: [
        '계란', '달걀', '우유', '치즈', '버터', '요거트', '크림', '두유'
    ],
    fruit: [
        '사과', '청사과', '바나나', '딸기', '포도', '수박', '토마토', '방울토마토', '복숭아', '오렌지', '레몬', '라임',
        '블루베리', '체리', '자두', '망고', '멜론', '파인애플', '키위', '코코넛', '배', '대추', '올리브', '반건시', '홍시'
    ]
};

export function getIngredientCategory(name: string): string {
    if (!name) return 'etc';

    const normalized = name.replace(/\s+/g, '').toLowerCase();

    for (const [category, keywords] of Object.entries(CATEGORY_MAP)) {
        for (const keyword of keywords) {
            if (normalized.includes(keyword)) {
                return category;
            }
        }
    }

    return 'etc';
}
