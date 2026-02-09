'use client';

import React from 'react';
import { Input } from '@/components/ui/Input';
import { Typography } from '@/components/elements/Typography';
import { cn } from '@/lib/utils';

interface AuthFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    containerClassName?: string;
}

export const AuthField = ({ label, containerClassName, className, ...props }: AuthFieldProps) => {
    return (
        <div className={cn("space-y-2", containerClassName)}>
            <label className="ml-1">
                <Typography variant="overline" color="secondary">
                    {label}
                </Typography>
            </label>
            <Input
                {...props}
                className={cn(
                    "h-12 rounded-xl border-slate-200 bg-white text-slate-900",
                    "placeholder:text-slate-400",
                    "focus:border-purple-600 focus:ring-purple-600/20 transition-all",
                    className
                )}
            />
        </div>
    );
};
