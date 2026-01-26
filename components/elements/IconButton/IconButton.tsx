import { IconButtonProps } from './IconButton.types';
import { Button } from '@/components/ui/button';
import { Icon } from '../Icon';
import { cn } from '@/lib/utils';

export const IconButton = ({
  icon,
  size = 'default',
  variant = 'ghost',
  onClick,
  ariaLabel,
  className,
  disabled,
}: IconButtonProps) => {
  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 24 : 20;

  return (
    <Button
      variant={variant}
      size="icon"
      onClick={onClick}
      disabled={disabled}
      className={cn("rounded-full h-10 w-10 active:scale-90 transition-transform", className)}
      aria-label={ariaLabel}
    >
      <Icon name={icon} size={iconSize} />
    </Button>
  );
};
