import type { ProgressBarProps } from './ProgressBar.types';
import { Progress } from '@/components/ui/progress';
import { Typography } from '../Typography';
import { cn } from '@/lib/utils';

export const ProgressBar = ({
  value,
  max = 100,
  showLabel = false,
  label,
  variant = 'default',
  className,
}: ProgressBarProps) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const variantStyles = {
    default: "bg-primary",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    gradient: "bg-gradient-to-r from-primary to-purple-500",
  };

  return (
    <div className={cn("space-y-2", className)}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center">
          {label && <Typography variant="caption" color="muted">{label}</Typography>}
          {showLabel && (
            <Typography variant="caption" weight="medium" className="ml-auto">
              {Math.round(percentage)}%
            </Typography>
          )}
        </div>
      )}
      <Progress 
        value={percentage} 
        className={cn("h-2", variantStyles[variant as keyof typeof variantStyles])} 
      />
    </div>
  );
};
