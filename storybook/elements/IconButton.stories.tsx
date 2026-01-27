import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { IconButton } from '@/components/elements/IconButton';
import { expect, fn, userEvent, within } from 'storybook/test';

/**
 * IconButton 컴포넌트
 * 
 * 아이콘만 포함하는 원형 버튼 컴포넌트입니다.
 * 툴바, 액션 메뉴 등에서 공간을 절약하면서 클릭 가능한 아이콘을 제공합니다.
 */
const meta: Meta<typeof IconButton> = {
    title: 'Elements/IconButton',
    component: IconButton,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: '아이콘만 포함하는 원형 버튼 컴포넌트입니다. 툴바나 액션 메뉴에서 사용합니다.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        icon: {
            control: 'select',
            options: ['Camera', 'Upload', 'Download', 'Settings', 'Search', 'Plus', 'Trash2', 'Pencil', 'X', 'Menu', 'EllipsisVertical'],
            description: 'Lucide 아이콘 이름',
        },
        variant: {
            control: 'select',
            options: ['default', 'outline', 'secondary', 'ghost'],
            description: '버튼 스타일 변형',
        },
        size: {
            control: 'select',
            options: ['sm', 'default', 'lg'],
            description: '버튼 크기',
        },
        disabled: {
            control: 'boolean',
            description: '비활성화 상태',
        },
        ariaLabel: {
            control: 'text',
            description: '접근성을 위한 라벨 (필수)',
        },
    },
    args: {
        onClick: fn(),
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 기본 IconButton
 */
export const Default: Story = {
    args: {
        icon: 'Camera',
        ariaLabel: '카메라',
    },
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement);
        const button = canvas.getByRole('button', { name: '카메라' });
        
        await expect(button).toBeInTheDocument();
        await expect(button).toHaveAttribute('aria-label', '카메라');
        
        await userEvent.click(button);
        await expect(args.onClick).toHaveBeenCalled();
    },
};

/**
 * 스타일 변형 비교
 */
export const Variants: Story = {
    render: () => (
        <div className="flex items-center gap-4">
            <IconButton icon="Settings" variant="default" ariaLabel="설정" />
            <IconButton icon="Settings" variant="secondary" ariaLabel="설정" />
            <IconButton icon="Settings" variant="outline" ariaLabel="설정" />
            <IconButton icon="Settings" variant="ghost" ariaLabel="설정" />
        </div>
    ),
};

/**
 * 크기 비교
 */
export const Sizes: Story = {
    render: () => (
        <div className="flex items-center gap-4">
            <IconButton icon="Plus" size="sm" ariaLabel="추가" />
            <IconButton icon="Plus" size="default" ariaLabel="추가" />
            <IconButton icon="Plus" size="lg" ariaLabel="추가" />
        </div>
    ),
};

/**
 * 일반적인 액션 아이콘들
 */
export const CommonActions: Story = {
    render: () => (
        <div className="flex items-center gap-2">
            <IconButton icon="Pencil" variant="ghost" ariaLabel="수정" />
            <IconButton icon="Trash2" variant="ghost" ariaLabel="삭제" />
            <IconButton icon="X" variant="ghost" ariaLabel="닫기" />
            <IconButton icon="EllipsisVertical" variant="ghost" ariaLabel="더보기" />
        </div>
    ),
};

/**
 * 비활성화 상태
 */
export const Disabled: Story = {
    args: {
        icon: 'Camera',
        disabled: true,
        ariaLabel: '카메라 (비활성화)',
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const button = canvas.getByRole('button');
        
        await expect(button).toBeDisabled();
    },
};
