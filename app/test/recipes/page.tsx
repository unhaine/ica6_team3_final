"use client";

import { useState } from "react";
import { Heart, Bookmark, Eye, Clock, ChefHat } from "lucide-react";
import { useHeader } from "@/components/modules/Header";
import { useFooter } from "@/components/modules/Footer";
import { DataList, FilterCarousel } from "@/components/modules";
import { useQuery } from "@tanstack/react-query";
import { SelectableChip, MediaCard } from "@/components/elements";
import { EmptyState } from "@/components/elements/EmptyState";
import { IconButton } from "@/components/elements/IconButton";
import { Recipe } from "./data";
import { Spinner } from "@/components/elements/Spinner";
import { STYLES as FilterStyles } from "@/components/modules/FilterCarousel/FilterCarousel.style";

// --- Filters ---
const RECIPE_FILTERS = [
  { id: "all", label: "전체" },
  { id: "한식", label: "🍚 한식" },
  { id: "양식", label: "🍝 양식" },
  { id: "중식", label: "🥘 중식" },
  { id: "일식", label: "🍣 일식" },
  { id: "초급", label: "⏱️ 초급" },
];

export default function RecipeTestPage() {
  const [activeFilter, setActiveFilter] = useState("all");

  // 1. 헤더 설정
  useHeader({
    isVisible: true,
    title: "추천 레시피",
    right: <IconButton icon="Search" variant="ghost" ariaLabel="레시피 검색" />,
  });

  useFooter({
    isVisible: true,
  });

  // 2. API 데이터 페칭
  const { data, isLoading, isError } = useQuery({
    queryKey: ["recipes", activeFilter],
    queryFn: async () => {
      const url = new URL("/api/recipes", window.location.origin);
      url.searchParams.set("limit", "50");
      if (activeFilter !== "all" && activeFilter !== "초급") {
          url.searchParams.set("category", activeFilter);
      }
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error("Failed to fetch recipes");
      return res.json();
    },
  });

  const recipes: Recipe[] = data?.data || [];

  // 3. 필터링 로직 (난이도 '초급' 필터만 클라이언트에서 추가 처리)
  const filteredRecipes = activeFilter === "초급" 
    ? recipes.filter(r => r.ckgDodfNm === "초급")
    : recipes;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-full">
        <EmptyState 
          title="데이터를 불러오지 못했습니다."
          description="잠시 후 다시 시도해주세요."
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      
      {/* 1. Fixed Filter Area */}
      <div className={FilterStyles.stickySection}>
        <FilterCarousel
          data={RECIPE_FILTERS}
          keyExtractor={(item) => item.id}
          renderItem={(filter) => (
            <SelectableChip
              label={filter.label}
              selected={activeFilter === filter.id}
              onClick={() => setActiveFilter(filter.id)}
            />
          )}
        />
      </div>

      {/* 2. Scrollable Recipe List */}
      <DataList
        data={filteredRecipes}
        className="flex-1 overflow-y-auto space-y-4 p-4 pb-24 scrollbar-hide"
        
        ListEmptyComponent={
          <EmptyState 
            icon={ChefHat}
            title="조건에 맞는 레시피가 없습니다."
            description="다른 검색어 필터를 선택해보세요."
          />
        }

        renderItem={(recipe) => (
          <MediaCard
            key={recipe.rcpSno}
            imageUrl={recipe.rcpImgUrl}
            title={recipe.rcpTtl}
            layout="horizontal"
            onClick={() => alert(`${recipe.rcpTtl} 상세 보기`)}
            aspectRatio="square"
            imageClassName="w-24 h-24" // 이미지 크기를 세밀하게 조정
            
            // 이제 태그들을 데이터로만 넘깁니다. 스타일은 안에서 처리함!
            badge={recipe.ckgKndActoNm} 
            metadata={[
                { icon: Clock, label: recipe.ckgTimeNm },
                { icon: ChefHat, label: recipe.ckgDodfNm }
            ]}

            footerLeft={<strong>{recipe.rgtrNm}</strong>}

            footerRight={
                <div className="flex gap-2">
                    <span className="flex items-center gap-0.5"><Heart className="w-3 h-3 fill-red-400 stroke-red-400" /> {recipe.rcmmCnt}</span>
                    <span className="flex items-center gap-0.5"><Bookmark className="w-3 h-3 fill-amber-400 stroke-amber-400" /> {recipe.srapCnt}</span>
                    <span className="flex items-center gap-0.5"><Eye className="w-3 h-3" /> {recipe.inqCnt}</span>
                </div>
            }
          />
        )}
      />
    </div>
  );
}
