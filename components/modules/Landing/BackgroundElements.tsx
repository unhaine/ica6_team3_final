'use client';

import React from 'react';

export const BackgroundElements = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-32 h-32 bg-purple-400/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-40 right-10 w-40 h-40 bg-indigo-400/10 rounded-full blur-3xl"></div>
        </div>
    );
};
