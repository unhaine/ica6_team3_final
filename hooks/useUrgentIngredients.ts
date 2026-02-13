"use client";

import { useState, useEffect, useCallback } from "react";
import { FridgeItem } from "../hooks/useFridge";

export function useUrgentIngredients() {
    const [items, setItems] = useState<FridgeItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchItems = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/ingredients');
            const data = await response.json();

            if (data.success && Array.isArray(data.data)) {
                const allItems: FridgeItem[] = data.data;
                const now = new Date();
                now.setHours(0, 0, 0, 0);

                // Filter items that have expiry date and sort by urgency
                const urgentItems = allItems
                    .filter(item => item.expiryDate)
                    .sort((a, b) => {
                        const dateA = new Date(a.expiryDate!).getTime();
                        const dateB = new Date(b.expiryDate!).getTime();
                        return dateA - dateB;
                    })
                    .slice(0, 5); // Take top 5

                setItems(urgentItems);
            } else {
                setItems([]);
            }
        } catch (error) {
            console.error('Failed to fetch urgent ingredients:', error);
            setItems([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    return {
        items,
        isLoading,
        refresh: fetchItems
    };
}
