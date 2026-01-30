import { ComponentProps, ReactNode } from "react";

export interface HeaderProps extends ComponentProps<"header"> {
    children?: ReactNode;
    className?: string;
}

export interface HeaderState {
    isVisible: boolean;
    title?: string;
    left?: ReactNode;
    center?: ReactNode;
    right?: ReactNode;
    transparent?: boolean;
}

export interface HeaderContextType {
    state: HeaderState;
    setHeader: (state: Partial<HeaderState>) => void;
}
