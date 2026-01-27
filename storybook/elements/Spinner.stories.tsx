import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Spinner } from '@/components/elements/Spinner';
import { expect } from 'storybook/test';

/**
 * Spinner 컴포넌트
 * 
 * 로딩 상태를 표시하는 원형 스피너입니다.
 * 버튼 내부, 페이지 로딩, 비동기 작업 대기 등에 사용됩니다.
 */
const meta: Meta<typeof Spinner> = {
    title: 'Elements/Spinner',
    component: Spinner,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: '로딩 상태를 표시하는 원형 스피너 컴포넌트입니다.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
            description: '스피너 크기',
        },
        color: {
            control: 'select',
            options: ['primary', 'secondary', 'white', 'inherit'],
            description: '스피너 색상',
        },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 기본 Spinner
 */
export const Default: Story = {
    args: {
        size: 'md',
        color: 'primary',
    },
    play: async ({ canvasElement }) => {
        const spinner = canvasElement.querySelector('.animate-spin');
        
        await expect(spinner).toBeInTheDocument();
    },
};

/**
 * 크기 비교
 */
export const Sizes: Story = {
    render: () => (
        <div className="flex items-center gap-8">
            <div className="flex flex-col items-center gap-2">
                <Spinner size="sm" />
                <span className="text-xs text-muted-foreground">Small</span>
            </div>
            <div className="flex flex-col items-center gap-2">
                <Spinner size="md" />
                <span className="text-xs text-muted-foreground">Medium</span>
            </div>
            <div className="flex flex-col items-center gap-2">
                <Spinner size="lg" />
                <span className="text-xs text-muted-foreground">Large</span>
            </div>
        </div>
    ),
};

/**
 * 색상 비교
 */
export const Colors: Story = {
    render: () => (
        <div className="flex items-center gap-8">
            <div className="flex flex-col items-center gap-2">
                <Spinner color="primary" />
                <span className="text-xs text-muted-foreground">Primary</span>
            </div>
            <div className="flex flex-col items-center gap-2">
                <Spinner color="secondary" />
                <span className="text-xs text-muted-foreground">Secondary</span>
            </div>
            <div className="flex flex-col items-center gap-2 bg-gray-800 p-4 rounded-lg">
                <Spinner color="white" />
                <span className="text-xs text-white">White</span>
            </div>
        </div>
    ),
};

/**
 * 버튼 내부 스피너
 */
export const InButton: Story = {
    render: () => (
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md">
            <Spinner size="sm" color="white" />
            <span>처리 중...</span>
        </button>
    ),
};

/**
 * 페이지 로딩 예제
 */
export const PageLoading: Story = {
    render: () => (
        <div className="flex flex-col items-center gap-4 p-8">
            <Spinner size="lg" color="primary" />
            <p className="text-sm text-muted-foreground">데이터를 불러오는 중...</p>
        </div>
    ),
};

/**
 * 카드 로딩 예제
 */
export const CardLoading: Story = {
    render: () => (
        <div className="w-64 h-40 border rounded-lg flex items-center justify-center bg-muted/10">
            <div className="flex flex-col items-center gap-2">
                <Spinner size="md" />
                <span className="text-sm text-muted-foreground">로딩 중</span>
            </div>
        </div>
    ),
};
