import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ProgressBar } from '@/components/elements/ProgressBar';
import { expect, within } from 'storybook/test';

/**
 * ProgressBar 컴포넌트
 * 
 * 진행률을 시각적으로 표시하는 바 컴포넌트입니다.
 * 파일 업로드, 작업 진행률, 로딩 상태 등에 사용됩니다.
 */
const meta: Meta<typeof ProgressBar> = {
    title: 'Elements/ProgressBar',
    component: ProgressBar,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: '진행률을 시각적으로 표시하는 프로그래스 바 컴포넌트입니다.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        value: {
            control: { type: 'range', min: 0, max: 100 },
            description: '현재 진행률 값',
        },
        max: {
            control: 'number',
            description: '최대값 (기본: 100)',
        },
        showLabel: {
            control: 'boolean',
            description: '퍼센트 라벨 표시 여부',
        },
        label: {
            control: 'text',
            description: '커스텀 라벨 텍스트',
        },
        variant: {
            control: 'select',
            options: ['default', 'success', 'warning', 'gradient'],
            description: '스타일 변형',
        },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 기본 ProgressBar
 */
export const Default: Story = {
    args: {
        value: 60,
    },
    decorators: [
        (Story) => (
            <div style={{ width: '300px' }}>
                <Story />
            </div>
        ),
    ],
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const progressbar = canvas.getByRole('progressbar');
        
        await expect(progressbar).toBeInTheDocument();
    },
};

/**
 * 라벨 표시
 */
export const WithLabel: Story = {
    args: {
        value: 75,
        showLabel: true,
    },
    decorators: [
        (Story) => (
            <div style={{ width: '300px' }}>
                <Story />
            </div>
        ),
    ],
};

/**
 * 커스텀 라벨
 */
export const WithCustomLabel: Story = {
    args: {
        value: 45,
        showLabel: true,
        label: '파일 업로드 중',
    },
    decorators: [
        (Story) => (
            <div style={{ width: '300px' }}>
                <Story />
            </div>
        ),
    ],
};

/**
 * 스타일 변형 비교
 */
export const Variants: Story = {
    render: () => (
        <div className="flex flex-col gap-6" style={{ width: '300px' }}>
            <div>
                <p className="text-xs text-muted-foreground mb-1">Default</p>
                <ProgressBar value={60} variant="default" />
            </div>
            <div>
                <p className="text-xs text-muted-foreground mb-1">Success</p>
                <ProgressBar value={100} variant="success" />
            </div>
            <div>
                <p className="text-xs text-muted-foreground mb-1">Warning</p>
                <ProgressBar value={30} variant="warning" />
            </div>
            <div>
                <p className="text-xs text-muted-foreground mb-1">Gradient</p>
                <ProgressBar value={80} variant="gradient" />
            </div>
        </div>
    ),
};

/**
 * 진행 상태 표시 예제
 */
export const ProgressStates: Story = {
    render: () => (
        <div className="flex flex-col gap-4" style={{ width: '300px' }}>
            <ProgressBar value={0} showLabel label="대기 중" />
            <ProgressBar value={33} showLabel label="분석 중" />
            <ProgressBar value={66} showLabel label="레시피 생성 중" variant="gradient" />
            <ProgressBar value={100} showLabel label="완료!" variant="success" />
        </div>
    ),
};

/**
 * 파일 업로드 예제
 */
export const FileUploadExample: Story = {
    args: {
        value: 67,
        showLabel: true,
        label: 'image.jpg 업로드 중',
        variant: 'gradient',
    },
    decorators: [
        (Story) => (
            <div className="p-4 border rounded-lg" style={{ width: '350px' }}>
                <Story />
            </div>
        ),
    ],
};
