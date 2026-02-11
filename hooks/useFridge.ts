"use client";

import { useState, useEffect, useMemo, useCallback } from "react";

export interface FridgeItem {
  id: string;
  name: string;
  quantity: string | null;
  category: string | null;
  createdAt: Date;
}


export const useFridge = (mockData?: FridgeItem[]) => {
  const [activeFilter, setActiveFilter] = useState("all");
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
        setItems(data.data);
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
    return activeFilter === "all"
      ? items
      : items.filter(item => item.category === activeFilter);
  }, [items, activeFilter]);

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
  const handleSaveEdit = useCallback(async (id: string, name: string, quantity: string) => {
    try {
      const response = await fetch(`/api/ingredients?id=${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          quantity: quantity || null,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setItems(prev => prev.map(item =>
          item.id === id
            ? { ...item, name, quantity: quantity || null }
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

  // 추가 핸들러
  const handleAdd = useCallback(async (name: string, quantity: string) => {
    const newItem: FridgeItem = {
      id: Date.now().toString(),
      name,
      quantity: quantity || null,
      category: '기타',
      createdAt: new Date(),
    };

    try {
      const response = await fetch('/api/ingredients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      });

      const data = await response.json();

      if (data.success) {
        setItems(prev => [data.data, ...prev]);
        setEditingItem(null);
        alert('✅ 재료가 추가되었습니다.');
      } else {
        // API 실패 시에도 (테스트 환경 가정) 로컬 추가
        setItems(prev => [newItem, ...prev]);
        setEditingItem(null);
        alert('✅ (로컬) 재료가 추가되었습니다.');
      }
    } catch (error) {
      console.error('추가 에러:', error);
      // API 에러 시에도 (테스트 환경 가정) 로컬 추가
      setItems(prev => [newItem, ...prev]);
      setEditingItem(null);
      alert('✅ (로컬) 재료가 추가되었습니다.');
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
    editingItem,
    setActiveFilter,
    handleDelete,
    handleEdit,
    handleSaveEdit,
    handleAdd,
    handleUse,
    setEditingItem,
    groupedItems: useMemo(() => {
      const groups: { [key: string]: FridgeItem[] } = {};

      filteredItems.forEach(item => {
        // Ensure createdAt is a Date object
        const date = new Date(item.createdAt);
        // Format: 최근 업로드 일 : YYYY.MM.DD
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateString = `최근 업로드 일 : ${year}.${month}.${day}`;

        if (!groups[dateString]) {
          groups[dateString] = [];
        }
        groups[dateString].push(item);
      });

      // Sort groups by date (descending)
      return Object.entries(groups)
        .sort((a, b) => {
          // Remove prefix and convert . to - for parsing
          const dateAStr = a[0].replace('최근 업로드 일 : ', '').replace(/\./g, '-');
          const dateBStr = b[0].replace('최근 업로드 일 : ', '').replace(/\./g, '-');
          return new Date(dateBStr).getTime() - new Date(dateAStr).getTime();
        })
        .map(([date, items]) => ({
          date,
          // Sort items within group by time (newest first)
          items: items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        }));
    }, [filteredItems]),
  };
};
