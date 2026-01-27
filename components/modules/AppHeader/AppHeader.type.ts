export interface AppHeaderProps {
    title?: string;
    showBack?: boolean;
    onBack?: () => void;
    rightAction?: React.ReactNode;
    transparent?: boolean;
    className?: string;
}
