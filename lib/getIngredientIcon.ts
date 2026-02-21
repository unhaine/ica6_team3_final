import { iconMap } from './iconMap';

// 자주 쓰이는 한국어 식재료 키워드와 Ingre_file(아이콘 맵의 Key) 매핑
const KOREAN_KEYWORD_MAP: Record<string, string> = {
    // 육류
    '소고기': 'Beef', '돼지고기': 'Pork', '닭고기': 'Chicken', '닭': 'Chicken',
    '베이컨': 'Bacon', '소시지': 'Sausage', '햄': 'Ham', '오리': 'Duck',
    '사골': 'Beef-bone', '뼈': 'Bone', '치킨': 'Chicken-fried', '너겟': 'Nuggets',

    // 채소
    '양파': 'Onion', '마늘': 'Garlic', '파': 'Scallion', '대파': 'Scallion', '쪽파': 'Scallion',
    '감자': 'Potato', '고구마': 'SweetPotato', '당근': 'Carrot', '오이': 'Cucumber',
    '호박': 'pumpkin', '단호박': 'pumpkin', '애호박': 'pumpkin',
    '고추': 'Pepper-green', '청양고추': 'Pepper-green', '홍고추': 'Pepper-red',
    '파프리카': 'Paprika', '피망': 'BellPepper',
    '버섯': 'Mushroom', '양송이': 'Mushroom-brown', '표고버섯': 'Mushroom-brown',
    '배추': 'Cabbage', '양배추': 'Cabbage', '상추': 'Lettuce', '깻잎': 'LeafyGreen',
    '브로콜리': 'Broccoli', '샐러드': 'GreenSalad', '콩': 'Beans', '완두콩': 'PeaPod',
    '가지': 'Eggplant', '무': 'Radish', '샐러리': 'Celery', '옥수수': 'Corn',
    '고사리': 'Bracken', '새싹': 'Sprouts', '생강': 'GingerRoot',
    '아보카도': 'Avocado',

    // 과일
    '사과': 'Apple-red', '청사과': 'Apple-green', '바나나': 'Banana', '딸기': 'Strawberry',
    '포도': 'Grapes', '수박': 'Watermelon', '토마토': 'Tomato', '방울토마토': 'Tomato',
    '복숭아': 'Peach', '오렌지': 'Orange', '레몬': 'Lemon', '라임': 'Lime',
    '블루베리': 'Blueberries', '체리': 'Cherries', '자두': 'Plum', '망고': 'Mango',
    '멜론': 'Melon', '파인애플': 'Pineapple', '키위': 'KiwiFruit', '코코넛': 'Coconut',
    '배': 'Pear', '대추': 'Jujube', '올리브': 'Olive',

    // 유제품 / 계란
    '계란': 'Egg', '달걀': 'Egg', '우유': 'Milk', '치즈': 'Cheese', '버터': 'Butter',

    // 곡물 / 밥 / 면
    '쌀': 'Rice', '밥': 'Bob', '떡': 'RiceCake', '파스타': 'Pasta', '면': 'Pasta',
    '라면': 'Ramen', '국수': 'Chopstick',

    // 해산물
    '새우': 'Shrimp', '오징어': 'Squid', '문어': 'Squid', '낙지': 'Squid', '게': 'Crab',
    '생선': 'Fish-White', '고등어': 'Fish-Oily', '연어': 'Fish-Oily', '치어': 'Fish-dried',
    '멸치': 'Fish-dried', '어묵': 'Oden', '맛살': 'Surimi', '김': 'Seaweed',
    '미역': 'Seaweed', '굴': 'Oyster', '참치': 'TunaCan', '초밥': 'Sushi', '수달': 'Otter',

    // 김치 / 반찬
    '김치': 'Cabbage-Kimchi', '배추김치': 'Cabbage-Kimchi', '깍두기': 'Radish-cubed-Kimchi',
    '총각김치': 'Radish-Kimchi', '열무김치': 'Radish-Kimchi', '명란': 'Mentaiko',
    '단무지': 'Pickled', '젓갈': 'Fermented',

    // 가공식품 / 빵
    '식빵': 'Bread', '빵': 'Bread', '초콜릿': 'Chocolate', '만두': 'Dumpling',
    '두부': 'Tofu', '통조림': 'CannedFood', '밀가루': 'Flour', '전분': 'Flour',
    '쿠키': 'Cookie', '과자': 'Cookie', '그래놀라': 'Granola',

    // 견과류
    '호두': 'Walnut', '땅콩': 'Peanuts', '아몬드': 'Peanuts', '밤': 'Chestnut',

    // 소스 / 조미료 / 음료
    '간장': 'SoySauce', '된장': 'Jar', '고추장': 'ChiliPaste', '쌈장': 'Jar',
    '소금': 'Condiments', '설탕': 'Condiments', '후추': 'Condiments', '조미료': 'Seasonings',
    '기름': 'Oil', '식용유': 'Oil', '참기름': 'Oil', '올리브유': 'Oil',
    '소스': 'SauceBottle-light', '케첩': 'TomatoSauce', '마요네즈': 'SauceBottle-light',
    '드레싱': 'SauceBottle-light', '스리라차': 'SauceBottle-dark', '핫소스': 'SauceBottle-dark',
    '꿀': 'Honey', '잼': 'Jam-red', '깨': 'Seeds', '고춧가루': 'RedPepperFlakes',
    '물': 'GlassMilk', '음료': 'Beverage', '맥주': 'Beer', '술': 'Beer', '소주': 'Beer', '와인': 'Beverage'
};

/**
 * 한국어 식재료 이름을 받아 가장 적절한 아이콘 이미지 URL을 반환합니다.
 */
export function getIngredientIcon(itemName: string): string | null {
    if (!itemName) return null;

    const normalized = itemName.replace(/\s+/g, '').toLowerCase();

    // 1. 정확히 매칭되는 키워드 찾기
    for (const [keyword, iconKey] of Object.entries(KOREAN_KEYWORD_MAP)) {
        if (normalized === keyword) {
            return iconMap[iconKey] || null;
        }
    }

    // 2. 포함되는 키워드 찾기 (긴 단어부터 매칭되도록 정렬)
    const sortedKeywords = Object.keys(KOREAN_KEYWORD_MAP).sort((a, b) => b.length - a.length);
    for (const keyword of sortedKeywords) {
        if (normalized.includes(keyword)) {
            return iconMap[KOREAN_KEYWORD_MAP[keyword]] || null;
        }
    }

    return null;
}
