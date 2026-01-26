import { TagProps } from './Tag.types';
import { Badge } from '@/components/ui/badge';
import { Icon } from '../Icon';
import { cn } from '@/lib/utils';

export const Tag = ({
  label,
  variant = 'default',
  size = 'md',
  icon,
  onRemove,
  className,
}: TagProps) => {
  const sizeClasses: Record<'sm' | 'md' | 'lg', string> = {
    sm: 'px-1.5 py-0.5 text-[10px]',
    md: 'px-2 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  const variantClasses: Record<'default' | 'owned' | 'missing' | 'primary' | 'outline', string> = {
    default: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    owned: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
    missing: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
    primary: 'bg-primary text-primary-foreground',
    outline: 'border-border text-muted-foreground bg-transparent',
  };

  return (
    <Badge
      variant="outline" // base variant
      className={cn(
        "font-medium rounded-full flex items-center gap-1 transition-colors",
        sizeClasses[size as keyof typeof sizeClasses],
        variantClasses[variant as keyof typeof variantClasses],
        className
      )}
    >
      {icon && <Icon name={icon} size={size === 'sm' ? 10 : 14} />}
      {label}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 hover:text-foreground/80 focus:outline-none"
        >
          <Icon name="X" size={12} />
        </button>
      )}
    </Badge>
  );
};
