"use client";

  import { Search } from "lucide-react";
  import { EmptyState as BaseEmptyState } from "@/components/elements";

  interface EmptyStateProps {
    isLoading: boolean;
  }

  export const EmptyState = ({ isLoading }: EmptyStateProps) => {
    return (
      <BaseEmptyState
        icon={Search}
        title={isLoading ? "재료를 불러오는 중..." : "보관 중인 식재료가 없습니다."}
        description={isLoading ? "" : "식재료를 추가하고 냉장고를 관리해보세요."}
        className="py-20"
      />
    );
  };
  
