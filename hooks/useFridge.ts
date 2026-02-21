"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { getIngredientCategory } from "@/lib/getIngredientCategory";

export interface FridgeItem {
  id: string;
  name: string;
  quantity: string | null;
  category: string | null;
  createdAt: Date;
  expiryDate?: Date | null;
}


export const useFridge = (mockData?: FridgeItem[]) => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState<FridgeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<{
    id: string;
    name: string;
    quantity: string | null;
  } | null>(null);

  // 재료 목록 불러오기
  const fetchItems = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/ingredients');
      const data = await response.json();

      if (data.success) {
        // 백엔드 데이터에 카테고리가 없거나 유효하지 않으면 이름 기반으로 자동 분류 주입
        const categorizedItems = data.data.map((item: FridgeItem) => ({
          ...item,
          category: item.category || getIngredientCategory(item.name)
        }));
        setItems(categorizedItems);
      } else {
        console.error('재료 목록 조회 실패:', data.error);
      }
    } catch (error) {
      console.error('재료 목록 조회 에러:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (mockData) {
      setItems(mockData);
      setIsLoading(false);
    } else {
      fetchItems();
    }
  }, [fetchItems, mockData]);

  // 필터링된 아이템
  const filteredItems = useMemo(() => {
    let result = items;

    // 1. Filter by Category
    if (activeFilter !== "all") {
      result = result.filter(item => item.category === activeFilter);
    }

    // 2. Filter by Search Query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(item => item.name.toLowerCase().includes(query));
    }

    return result;
  }, [items, activeFilter, searchQuery]);

  // 삭제 핸들러
  const handleDelete = useCallback(async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) {
      return;
    }

    try {
      const response = await fetch(`/api/ingredients?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setItems(prev => prev.filter(item => item.id !== id));
        alert('✅ 재료가 삭제되었습니다.');
      } else {
        alert(`❌ 삭제 실패: ${data.error}`);
      }
    } catch (error) {
      console.error('삭제 에러:', error);
      alert('❌ 삭제 중 오류가 발생했습니다.');
    }
  }, []);

  // 수정 핸들러
  const handleEdit = useCallback((item: { id: string; name: string; quantity: string | null }) => {
    setEditingItem(item);
  }, []);

  // 수정 저장 핸들러
  const handleSaveEdit = useCallback(async (id: string, name: string, quantity: string, expiryDate?: string) => {
    try {
      const response = await fetch(`/api/ingredients?id=${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          quantity: quantity || null,
          expiryDate: expiryDate ? new Date(expiryDate) : null,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setItems(prev => prev.map(item =>
          item.id === id
            ? { ...item, name, quantity: quantity || null, expiryDate: expiryDate ? new Date(expiryDate) : null }
            : item
        ));
        setEditingItem(null);
        alert('✅ 재료가 수정되었습니다.');
      } else {
        alert(`❌ 수정 실패: ${data.error}`);
      }
    } catch (error) {
      console.error('수정 에러:', error);
      alert('❌ 수정 중 오류가 발생했습니다.');
    }
  }, []);

  // 유통기한 계산 헬퍼
  const calculateExpiryDate = (name: string) => {
    const today = new Date();
    let addDays = 14; // 기본 2주

    const lowerName = name.toLowerCase();

    if (lowerName.match(/우유|치즈|요거트|버터|달걀|계란|유제품/)) {
      addDays = 10;
    } else if (lowerName.match(/돼지|소고기|닭|고기|양고기|햄|소세지|베이컨/)) {
      addDays = 3;
    } else if (lowerName.match(/생선|해산물|조개|새우|오징어/)) {
      addDays = 2;
    } else if (lowerName.match(/두부|콩나물|시금치|상추|깻잎/)) {
      addDays = 5;
    } else if (lowerName.match(/김치|장아찌|젓갈/)) {
      addDays = 90; // 오래 보관 가능
    } else if (lowerName.match(/양파|감자|고구마|당근|마늘/)) {
      addDays = 30; // 뿌리 채소
    } else if (lowerName.match(/냉동|만두|피자|아이스크림/)) {
      addDays = 30;
    }

    return new Date(today.setDate(today.getDate() + addDays));
  };

  // 추가 핸들러
  const handleAdd = useCallback(async (name: string, quantity: string, expiryDate?: string) => {
    const newItem: FridgeItem = {
      id: Date.now().toString(), // 임시 ID
      name,
      quantity: quantity || null,
      category: getIngredientCategory(name),
      createdAt: new Date(),
      expiryDate: expiryDate ? new Date(expiryDate) : calculateExpiryDate(name),
    };

    try {
      const response = await fetch('/api/ingredients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [newItem], // POST는 { items: [] } 형식을 기대함
        }),
      });

      const data = await response.json();

      if (data.success && data.data.items && data.data.items.length > 0) {
        // 서버에서 생성된 실제 데이터 사용
        const createdItem = data.data.items[0];
        setItems(prev => [createdItem, ...prev]);
        setEditingItem(null);
        alert('✅ 재료가 추가되었습니다.');
      } else {
        alert(`❌ 재료 추가 실패: ${data.error || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('추가 에러:', error);
      alert('❌ 추가 중 서버 통신 오류가 발생했습니다.');
    }
  }, []);

  const handleUse = useCallback((item: FridgeItem) => {
    alert(`${item.name} 사용`);
  }, []);

  return {
    items,
    filteredItems,
    isLoading,
    activeFilter,
    searchQuery,
    setSearchQuery,
    editingItem,
    setActiveFilter,
    handleDelete,
    handleEdit,
    handleSaveEdit,
    handleAdd,
    handleUse,
    setEditingItem,
    sortedItems: useMemo(() => {
      // Sort items by expiry date (ascending) - urgent first
      return [...filteredItems].sort((a, b) => {
        const dateA = a.expiryDate ? new Date(a.expiryDate).getTime() : 9999999999999; // Far future if no expiry
        const dateB = b.expiryDate ? new Date(b.expiryDate).getTime() : 9999999999999;
        return dateA - dateB;
      });
    }, [filteredItems]),
  };
};
