import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Icon } from '@/components/elements/Icon';
import { expect } from 'storybook/test';

/**
 * Icon 컴포넌트
 * 
 * Lucide 아이콘을 렌더링하는 래퍼 컴포넌트입니다.
 * 다양한 크기, 색상, 굵기를 지원합니다.
 */
const meta: Meta<typeof Icon> = {
    title: 'Elements/Icon',
    component: Icon,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Lucide 아이콘 라이브러리를 래핑한 아이콘 컴포넌트입니다.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        name: {
            control: 'select',
            options: [
                'Camera', 'Upload', 'Download', 'Settings', 'Search', 'Plus', 
                'Minus', 'Trash2', 'Pencil', 'Check', 'X', 'ChevronLeft', 
                'ChevronRight', 'ChevronUp', 'ChevronDown', 'ArrowLeft', 
                'ArrowRight', 'Home', 'User', 'Heart', 'Star', 'Bell'
            ],
            description: 'Lucide 아이콘 이름',
        },
        size: {
            control: { type: 'range', min: 12, max: 64, step: 4 },
            description: '아이콘 크기 (px)',
        },
        color: {
            control: 'color',
            description: '아이콘 색상',
        },
        strokeWidth: {
            control: { type: 'range', min: 1, max: 4, step: 0.5 },
            description: '선 굵기',
        },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 기본 Icon
 */
export const Default: Story = {
    args: {
        name: 'Camera',
        size: 24,
    },
    play: async ({ canvasElement }) => {
        const svg = canvasElement.querySelector('svg');
        
        await expect(svg).toBeInTheDocument();
    },
};

/**
 * 다양한 크기
 */
export const DifferentSizes: Story = {
    render: () => (
        <div className="flex items-end gap-4">
            <Icon name="Camera" size={16} />
            <Icon name="Camera" size={24} />
            <Icon name="Camera" size={32} />
            <Icon name="Camera" size={48} />
        </div>
    ),
};

/**
 * 다양한 색상
 */
export const DifferentColors: Story = {
    render: () => (
        <div className="flex gap-4">
            <Icon name="Heart" size={32} color="#ef4444" />
            <Icon name="Star" size={32} color="#f59e0b" />
            <Icon name="Check" size={32} color="#22c55e" />
            <Icon name="Bell" size={32} color="#3b82f6" />
        </div>
    ),
};

/**
 * 자주 사용하는 아이콘
 */
export const CommonIcons: Story = {
    render: () => (
        <div className="grid grid-cols-6 gap-4">
            <div className="flex flex-col items-center gap-1">
                <Icon name="Camera" size={24} />
                <span className="text-xs text-muted-foreground">Camera</span>
            </div>
            <div className="flex flex-col items-center gap-1">
                <Icon name="Upload" size={24} />
                <span className="text-xs text-muted-foreground">Upload</span>
            </div>
            <div className="flex flex-col items-center gap-1">
                <Icon name="Download" size={24} />
                <span className="text-xs text-muted-foreground">Download</span>
            </div>
            <div className="flex flex-col items-center gap-1">
                <Icon name="Settings" size={24} />
                <span className="text-xs text-muted-foreground">Settings</span>
            </div>
            <div className="flex flex-col items-center gap-1">
                <Icon name="Search" size={24} />
                <span className="text-xs text-muted-foreground">Search</span>
            </div>
            <div className="flex flex-col items-center gap-1">
                <Icon name="Plus" size={24} />
                <span className="text-xs text-muted-foreground">Plus</span>
            </div>
            <div className="flex flex-col items-center gap-1">
                <Icon name="Trash2" size={24} />
                <span className="text-xs text-muted-foreground">Trash2</span>
            </div>
            <div className="flex flex-col items-center gap-1">
                <Icon name="Pencil" size={24} />
                <span className="text-xs text-muted-foreground">Pencil</span>
            </div>
            <div className="flex flex-col items-center gap-1">
                <Icon name="Check" size={24} />
                <span className="text-xs text-muted-foreground">Check</span>
            </div>
            <div className="flex flex-col items-center gap-1">
                <Icon name="X" size={24} />
                <span className="text-xs text-muted-foreground">X</span>
            </div>
            <div className="flex flex-col items-center gap-1">
                <Icon name="Heart" size={24} />
                <span className="text-xs text-muted-foreground">Heart</span>
            </div>
            <div className="flex flex-col items-center gap-1">
                <Icon name="Star" size={24} />
                <span className="text-xs text-muted-foreground">Star</span>
            </div>
        </div>
    ),
};

/**
 * 선 굵기 비교
 */
export const StrokeWidths: Story = {
    render: () => (
        <div className="flex items-center gap-4">
            <div className="flex flex-col items-center gap-1">
                <Icon name="Camera" size={32} strokeWidth={1} />
                <span className="text-xs text-muted-foreground">1px</span>
            </div>
            <div className="flex flex-col items-center gap-1">
                <Icon name="Camera" size={32} strokeWidth={1.5} />
                <span className="text-xs text-muted-foreground">1.5px</span>
            </div>
            <div className="flex flex-col items-center gap-1">
                <Icon name="Camera" size={32} strokeWidth={2} />
                <span className="text-xs text-muted-foreground">2px</span>
            </div>
            <div className="flex flex-col items-center gap-1">
                <Icon name="Camera" size={32} strokeWidth={3} />
                <span className="text-xs text-muted-foreground">3px</span>
            </div>
        </div>
    ),
};

/**
 * 네비게이션 아이콘
 */
export const NavigationIcons: Story = {
    render: () => (
        <div className="flex gap-4">
            <Icon name="ChevronLeft" size={24} />
            <Icon name="ChevronRight" size={24} />
            <Icon name="ChevronUp" size={24} />
            <Icon name="ChevronDown" size={24} />
            <Icon name="ArrowLeft" size={24} />
            <Icon name="ArrowRight" size={24} />
        </div>
    ),
};
