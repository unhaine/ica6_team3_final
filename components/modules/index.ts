// Modules - 비즈니스 로직이 포함된 복합 컴포넌트
// 각 모듈에서 컴포넌트와 타입만 명시적으로 Export하여 STYLES 이름 충돌 방지

// Existing Modules
export { AppHeader } from './AppHeader';
export type { AppHeaderProps } from './AppHeader/AppHeader.type';

export { BottomNav } from './BottomNav';

export { BoundingBoxCanvas as BoundingBox } from './BoundingBox';

// New Mobile Modules
export { BottomNavBar } from './BottomNavBar';
export type { BottomNavBarProps } from './BottomNavBar/BottomNavBar.type';

export { TopAppBar } from './TopAppBar';
export type { TopAppBarProps } from './TopAppBar/TopAppBar.type';

export { FridgeStatusCard } from './FridgeStatusCard';
export type { FridgeStatusCardProps } from './FridgeStatusCard/FridgeStatusCard.type';

export { RecipeCard } from './RecipeCard';
export type { RecipeCardProps } from './RecipeCard/RecipeCard.type';

export { RecipeCarousel } from './RecipeCarousel';
export type { RecipeCarouselProps } from './RecipeCarousel/RecipeCarousel.type';

export { CategoryFilter } from './CategoryFilter';
export type { CategoryFilterProps } from './CategoryFilter/CategoryFilter.type';

export { FridgeItem } from './FridgeItem';
export type { FridgeItemProps } from './FridgeItem/FridgeItem.type';

export { FridgeList } from './FridgeList';
export type { FridgeListProps } from './FridgeList/FridgeList.type';

export { CorrectionItem } from './CorrectionItem';
export type { CorrectionItemProps } from './CorrectionItem/CorrectionItem.type';
