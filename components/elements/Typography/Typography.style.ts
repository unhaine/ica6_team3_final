import { TypographyVariant, TypographyWeight, TypographyColor, TypographyAlign } from './Typography.type';

export const typographyStyles = {
    variants: {
        h1: 'text-4xl font-bold tracking-tight sm:text-5xl',
        h2: 'text-3xl font-semibold tracking-tight sm:text-4xl',
        h3: 'text-2xl font-semibold tracking-tight sm:text-3xl',
        h4: 'text-xl font-semibold tracking-tight sm:text-2xl',
        subtitle1: 'text-lg font-medium leading-7',
        subtitle2: 'text-base font-medium leading-6',
        body1: 'text-base leading-7',
        body2: 'text-sm leading-6',
        caption: 'text-xs leading-5',
        overline: 'text-xs font-semibold uppercase tracking-wider',
    } as Record<TypographyVariant, string>,

    variantMapping: {
        h1: 'h1',
        h2: 'h2',
        h3: 'h3',
        h4: 'h4',
        subtitle1: 'p',
        subtitle2: 'p',
        body1: 'p',
        body2: 'p',
        caption: 'span',
        overline: 'span',
    } as Record<TypographyVariant, string>,

    weights: {
        thin: 'font-thin',
        light: 'font-light',
        normal: 'font-normal',
        medium: 'font-medium',
        semibold: 'font-semibold',
        bold: 'font-bold',
        black: 'font-black',
    } as Record<TypographyWeight, string>,

    colors: {
        primary: 'text-foreground',
        secondary: 'text-secondary-foreground',
        muted: 'text-muted-foreground',
        error: 'text-destructive',
        success: 'text-green-600 dark:text-green-400',
        warning: 'text-yellow-600 dark:text-yellow-400',
        inherit: 'text-inherit',
        white: 'text-white',
    } as Record<TypographyColor, string>,

    alignments: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
        justify: 'text-justify',
    } as Record<TypographyAlign, string>,
} as const;
