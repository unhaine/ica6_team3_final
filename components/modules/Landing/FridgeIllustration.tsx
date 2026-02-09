'use client';

import React from 'react';

interface FridgeIllustrationProps {
    isExpanded: boolean;
    hasAppeared: boolean;
    isWiggling: boolean;
}

export const FridgeIllustration = ({ isExpanded, hasAppeared, isWiggling }: FridgeIllustrationProps) => {
    return (
        <div className={`relative transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
            isExpanded ? 'w-32 h-32' : 'w-64 h-64'
        } ${hasAppeared ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
            <svg viewBox="0 0 200 200" className={`w-full h-full drop-shadow-2xl ${isWiggling ? 'animate-wiggle' : ''}`}>
                {/* Fridge body */}
                <rect x="50" y="30" width="100" height="140" rx="8" fill="#f8f9fa" stroke="#e9ecef" strokeWidth="2"/>
                
                {/* Fridge door (open) */}
                <path d="M 50 30 Q 30 35, 25 60 L 25 160 Q 30 165, 50 170 L 50 30 Z" fill="#ffffff" stroke="#dee2e6" strokeWidth="2"/>
                
                {/* Door handle */}
                <rect x="45" y="95" width="8" height="25" rx="4" fill="#adb5bd"/>
                
                {/* Inside shelves */}
                <line x1="55" y1="80" x2="145" y2="80" stroke="#e9ecef" strokeWidth="2"/>
                <line x1="55" y1="120" x2="145" y2="120" stroke="#e9ecef" strokeWidth="2"/>
                
                {/* Food items - colorful circles and rectangles */}
                <circle cx="75" cy="55" r="8" fill="#51cf66"/>
                <circle cx="95" cy="55" r="8" fill="#ff6b6b"/>
                <circle cx="115" cy="55" r="8" fill="#ffd43b"/>
                
                <rect x="65" y="90" width="25" height="20" rx="3" fill="#ff8787"/>
                <rect x="100" y="90" width="25" height="20" rx="3" fill="#74c0fc"/>
                
                <circle cx="80" cy="140" r="10" fill="#ffa94d"/>
                <rect x="105" y="130" width="30" height="25" rx="3" fill="#a9e34b"/>
            </svg>
        </div>
    );
};
