import { useState } from 'react';
import { Recipe } from '@/types/recipe';

export const useRecipeSimulation = () => {
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const fetchRecipes = async () => {
    setLoading(true);
    // 추천 시뮬레이션 지연
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockRecipes: Recipe[] = [
      {
        id: 'recipe-1',
        title: '돼지고기 김치찌개',
        description: '밥 두 공기 뚝딱! 깊은 맛의 김치찌개',
        thumbnailUrl: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=800&q=80',
        matchRate: 95,
        matchCount: 4,
        totalIngredientCount: 5,
        cookingTime: 30,
        servings: 2,
        category: '한식',
        difficulty: '보통',
        ingredients: [
          { name: '돼지고기', isOwned: true, displayAmount: '200g' },
          { name: '김치', isOwned: true, displayAmount: '300g' },
          { name: '양파', isOwned: true, displayAmount: '1/2개' },
          { name: '두부', isOwned: false, displayAmount: '1/2모' },
        ],
        steps: [
          { order: 1, description: '돼지고기를 한입 크기로 썰어주세요.' },
          { order: 2, description: '냄비에 기름을 두르고 돼지고기를 볶습니다.' },
          { order: 3, description: '김치를 넣고 함께 볶아주세요.' },
        ],
        youtubeUrl: 'https://youtube.com/watch?v=dummy1'
      },
      {
        id: 'recipe-2',
        title: '간단 계란말이',
        description: '반찬 걱정 끝! 포실포실한 계란말이',
        thumbnailUrl: 'https://images.unsplash.com/photo-1518492104633-c3ed9e754ff2?w=800&q=80',
        matchRate: 100,
        matchCount: 3,
        totalIngredientCount: 3,
        cookingTime: 10,
        servings: 1,
        category: '한식',
        difficulty: '쉬움',
        ingredients: [
          { name: '계란', isOwned: true, displayAmount: '3개' },
          { name: '대파', isOwned: true, displayAmount: '적당량' },
          { name: '소금', isOwned: true, displayAmount: '한꼬집' },
        ],
        steps: [
          { order: 1, description: '계란을 풀고 대파를 송송 썹니다.' },
          { order: 2, description: '팬에 계란물을 붓고 돌돌 맙니다.' },
        ],
      }
    ];

    setRecipes(mockRecipes);
    setLoading(false);
  };

  return { loading, recipes, fetchRecipes };
};
