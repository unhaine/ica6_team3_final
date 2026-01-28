export interface AppHeaderProps {
    title?: string;
    showBack?: boolean;
    onBack?: () => void;
    rightAction?: React.ReactNode;
    showLogout?: boolean;
    transparent?: boolean;
    className?: string;
}
