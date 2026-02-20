import { ComponentProps, ElementType, ReactNode } from "react";

export interface FooterItem {
    label: string;
    icon?: ElementType;
    iconDefault?: string;
    iconSelected?: string;
    href: string;
    badge?: string | number;
    isFab?: boolean; // If true, handled specially
}

export interface FooterProps extends ComponentProps<"nav"> {
    className?: string;
}

export interface FooterState {
    isVisible: boolean;
    items?: FooterItem[];
}

export interface FooterContextType {
    state: FooterState;
    setFooter: (state: Partial<FooterState>) => void;
}
