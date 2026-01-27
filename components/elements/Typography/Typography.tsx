import { TypographyProps } from './Typography.type';
import { cn } from '@/lib/utils';
import { typographyStyles } from './Typography.style';

export const Typography = ({
    variant = 'body2',
    as,
    weight,
    color,
    align,
    className,
    children,
    ...props
}: TypographyProps) => {
    const Component = as || typographyStyles.variantMapping[variant] || 'p';

    return (
        <Component
            className={cn(
                typographyStyles.variants[variant],
                weight && typographyStyles.weights[weight],
                color && typographyStyles.colors[color],
                align && typographyStyles.alignments[align],
                className
            )}
            {...props}
        >
            {children}
        </Component>
    );
};
