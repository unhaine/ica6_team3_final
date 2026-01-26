export type TypographyVariant = 
  | 'h1' | 'h2' | 'h3' | 'h4' 
  | 'subtitle1' | 'subtitle2' 
  | 'body1' | 'body2' 
  | 'caption' | 'overline';

export type TypographyWeight = 'thin' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'black';

export type TypographyColor = 'primary' | 'secondary' | 'muted' | 'error' | 'success' | 'warning' | 'inherit' | 'white';

export type TypographyAlign = 'left' | 'center' | 'right' | 'justify';

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: TypographyVariant;
  as?: React.ElementType;
  weight?: TypographyWeight;
  color?: TypographyColor;
  align?: TypographyAlign;
  children: React.ReactNode;
}
