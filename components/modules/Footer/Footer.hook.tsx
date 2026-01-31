"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect, useMemo } from 'react';
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
             // Create a filtered update without undefined values
             const updates = Object.fromEntries(
                 Object.entries(newState).filter(([_, v]) => v !== undefined)
             );

             if (Object.keys(updates).length === 0) return prev;

             const next = { ...prev, ...updates };
             
             // Prevent unnecessary updates
             if (JSON.stringify(prev) === JSON.stringify(next)) {
                 return prev;
             }
             return next;
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
    const setFooter = useFooterDispatch();
    
    const { isVisible, items } = options;
    
    // Memoize items stringification to avoid unnecessary re-renders
    const itemsKey = useMemo(() => items ? JSON.stringify(items) : undefined, [items]);

    useEffect(() => {
        setFooter({ isVisible, items });
    }, [isVisible, items, itemsKey, setFooter]);
};
