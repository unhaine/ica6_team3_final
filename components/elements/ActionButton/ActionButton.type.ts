import { ButtonProps } from '@/components/ui';
import { IconName } from '../Icon';

export interface ActionButtonProps extends ButtonProps {
    icon?: IconName;
    iconPosition?: 'left' | 'right';
    loading?: boolean;
    fullWidth?: boolean;
}
