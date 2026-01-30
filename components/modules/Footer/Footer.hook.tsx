"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { FooterState } from './Footer.type';

const defaultState: FooterState = {
    isVisible: true,
    items: [],
};

// Split Contexts to prevent re-render loops
const FooterStateContext = createContext<FooterState | undefined>(undefined);
const FooterDispatchContext = createContext<((newState: Partial<FooterState>) => void) | undefined>(undefined);

export const FooterProvider = ({ children }: { children: ReactNode }) => {
    const [state, setState] = useState<FooterState>(defaultState);

    const setFooter = useCallback((newState: Partial<FooterState>) => {
        setState(prev => {
             // Optional: Deep compare or just return new state
             // Prevent unnecessary updates if values are loosely same (JSON stringify hack or deep equal)
             if (JSON.stringify(prev) === JSON.stringify({ ...prev, ...newState })) {
                 return prev;
             }
             return { ...prev, ...newState };
        });
    }, []);

    return (
        <FooterStateContext.Provider value={state}>
            <FooterDispatchContext.Provider value={setFooter}>
                {children}
            </FooterDispatchContext.Provider>
        </FooterStateContext.Provider>
    );
};

/**
 * useFooterState
 * @description Consumes only the Footer State.
 */
export const useFooterState = () => {
    const context = useContext(FooterStateContext);
    if (context === undefined) throw new Error('useFooterState must be used within a FooterProvider');
    return context;
};

/**
 * useFooterDispatch
 * @description Consumes only the Footer Dispatcher.
 */
export const useFooterDispatch = () => {
    const context = useContext(FooterDispatchContext);
    if (context === undefined) throw new Error('useFooterDispatch must be used within a FooterProvider');
    return context;
};

/**
 * useFooterContext (Legacy/Combined)
 * @deprecated Use useFooterState or useFooterDispatch
 */
export const useFooterContext = () => {
    const state = useFooterState();
    const setFooter = useFooterDispatch();
    return { state, setFooter };
};

/**
 * useFooter Hook
 * @description Page-level hook to control the Footer (Navigation).
 */
export const useFooter = (options: Partial<FooterState>) => {
    const setFooter = useFooterDispatch(); // Only depends on Dispatch
    
    // Destructure specifically to use in dependency array
    // Note: 'items' array reference changes on every render if passed inline!
    // We need to be careful. Ideally user should pass useMemo-ized items or constant.
    // However, to be safe, we can rely on the setFooter's internal check or simplify here.
    const { isVisible, items } = options;

    useEffect(() => {
        setFooter({ isVisible, items });
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isVisible, setFooter, JSON.stringify(items)]); // Deep compare items
};
