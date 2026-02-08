'use client';

import { useState, useEffect } from 'react';

export const useLandingAnimation = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [hasAppeared, setHasAppeared] = useState(false);
    const [isWiggling, setIsWiggling] = useState(false);

    useEffect(() => {
        const appearTimer = setTimeout(() => {
            setHasAppeared(true);
        }, 100);

        const wiggleTimer = setTimeout(() => {
            setIsWiggling(true);
        }, 1400);

        const stopWiggleTimer = setTimeout(() => {
            setIsWiggling(false);
        }, 2400);

        return () => {
            clearTimeout(appearTimer);
            clearTimeout(wiggleTimer);
            clearTimeout(stopWiggleTimer);
        };
    }, []);

    const handleExpand = () => setIsExpanded(true);

    return {
        isExpanded,
        hasAppeared,
        isWiggling,
        handleExpand,
    };
};
