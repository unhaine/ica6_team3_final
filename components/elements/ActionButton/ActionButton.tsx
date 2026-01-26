import { ActionButtonProps } from './ActionButton.types';
import { Button } from '@/components/ui/button';
import { Icon } from '../Icon';
import { Spinner } from '../Spinner';
import { cn } from '@/lib/utils';

export const ActionButton = ({
  children,
  icon,
  iconPosition = 'left',
  loading = false,
  fullWidth = false,
  className,
  variant = 'default',
  size = 'default',
  disabled,
  ...props
}: ActionButtonProps) => {
  return (
    <Button
      variant={variant}
      size={size}
      disabled={disabled || loading}
      className={cn(
        "relative transition-all duration-200 active:scale-95",
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {loading && (
        <Spinner size="sm" className="mr-2" color="inherit" />
      )}
      
      {!loading && icon && iconPosition === 'left' && (
        <Icon name={icon} size={size === 'sm' ? 16 : 20} className="mr-2" />
      )}
      
      <span className={cn(loading && "opacity-80")}>{children}</span>
      
      {!loading && icon && iconPosition === 'right' && (
        <Icon name={icon} size={size === 'sm' ? 16 : 20} className="ml-2" />
      )}
    </Button>
  );
};
