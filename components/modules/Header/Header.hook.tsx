"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { HeaderState } from './Header.type';

const defaultState: HeaderState = {
    isVisible: false,
    title: undefined,
    left: undefined,
    center: undefined,
    right: undefined,
    transparent: false,
};

// Split Contexts to prevent re-render loops
const HeaderStateContext = createContext<HeaderState | undefined>(undefined);
const HeaderDispatchContext = createContext<((newState: Partial<HeaderState>) => void) | undefined>(undefined);

export const HeaderProvider = ({ children }: { children: ReactNode }) => {
    const [state, setState] = useState<HeaderState>(defaultState);

    const setHeader = useCallback((newState: Partial<HeaderState>) => {
        setState(prev => {
             const updates = Object.fromEntries(
                 Object.entries(newState).filter(([_, v]) => v !== undefined)
             );
             if (Object.keys(updates).length === 0) return prev;
             return { ...prev, ...updates };
        });
    }, []);

    return (
        <HeaderStateContext.Provider value={state}>
            <HeaderDispatchContext.Provider value={setHeader}>
                {children}
            </HeaderDispatchContext.Provider>
        </HeaderStateContext.Provider>
    );
};

/**
 * useHeaderState
 * @description Consumes only the Header State. Components using this will re-render when header updates.
 */
export const useHeaderState = () => {
    const context = useContext(HeaderStateContext);
    if (context === undefined) throw new Error('useHeaderState must be used within a HeaderProvider');
    return context;
};

/**
 * useHeaderDispatch
 * @description Consumes only the Header Dispatcher. Components using this will NOT re-render on state changes.
 */
export const useHeaderDispatch = () => {
    const context = useContext(HeaderDispatchContext);
    if (context === undefined) throw new Error('useHeaderDispatch must be used within a HeaderProvider');
    return context;
};

/**
 * useHeaderContext (Legacy/Combined)
 * @deprecated Use useHeaderState or useHeaderDispatch for better performance
 */
export const useHeaderContext = () => {
    const state = useHeaderState();
    const setHeader = useHeaderDispatch();
    return { state, setHeader };
};

/**
 * useHeader Hook
 * @description Page-level hook to control the Header. Optimized to preventing re-render loops.
 */
export const useHeader = (options: Partial<HeaderState>) => {
    const setHeader = useHeaderDispatch(); // Depends only on Dispatch
    
    const { isVisible, title, left, center, right, transparent } = options;

    // Use useLayoutEffect to update state before paint, preventing layout flicker
    const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

    useIsomorphicLayoutEffect(() => {
        setHeader({ 
            isVisible: isVisible ?? false, 
            title: title ?? null, 
            left: left ?? null, 
            center: center ?? null, 
            right: right ?? null, 
            transparent: transparent ?? false 
        });
    }, [isVisible, title, left, center, right, transparent, setHeader]);

    // Optional: Reset header on unmount to prevent flickering during navigation
    useEffect(() => {
        return () => {
            // Note: In Next.js App Router, unmount cleanup can sometimes wipe the header for the next page during concurrent transitions, 
            // but setting the exact missing fields to null on mount (above) handles most state-bleeding cases.
        };
    }, []);
};
