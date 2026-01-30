"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { HeaderState } from './Header.type';

const defaultState: HeaderState = {
    isVisible: true,
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
        // Prevent unnecessary state updates if values are same (Simple shallow check could help, but strictly separating contexts is enough for the loop)
        setState(prev => {
             // Optional: Deep compare or just return new state
             return { ...prev, ...newState };
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

    useEffect(() => {
        setHeader({ isVisible, title, left, center, right, transparent });
    }, [isVisible, title, left, center, right, transparent, setHeader]);
};
