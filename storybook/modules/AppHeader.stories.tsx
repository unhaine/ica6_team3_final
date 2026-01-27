import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { AppHeader } from '@/components/modules/AppHeader';
import { IconButton } from '@/components/elements/IconButton';
import { expect, fn, userEvent, within } from 'storybook/test';

/**
 * AppHeader 컴포넌트
 * 
 * 애플리케이션의 상단 헤더 컴포넌트입니다.
 * 제목, 뒤로가기 버튼, 우측 액션 버튼 등을 포함합니다.
 */
const meta: Meta<typeof AppHeader> = {
    title: 'Modules/AppHeader',
    component: AppHeader,
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component: '앱의 상단 네비게이션을 담당하는 헤더 컴포넌트입니다.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        title: {
            control: 'text',
            description: '헤더에 표시할 제목',
        },
        showBack: {
            control: 'boolean',
            description: '뒤로가기 버튼 표시 여부',
        },
        transparent: {
            control: 'boolean',
            description: '투명 배경 사용 여부',
        },
    },
    decorators: [
        (Story) => (
            <div className="min-h-[200px] bg-linear-to-b from-primary/10 to-background">
                <Story />
                <div className="p-4">
                    <p className="text-muted-foreground">페이지 컨텐츠 영역</p>
                </div>
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 기본 앱 헤더 (로고 표시)
 */
export const Default: Story = {
    args: {},
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        // 로고(텍스트)가 표시되는지 확인
        await expect(canvas.getByText('냉파고수')).toBeInTheDocument();
    },
};

/**
 * 제목이 있는 헤더
 */
export const WithTitle: Story = {
    args: {
        title: '페이지 제목',
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByText('페이지 제목')).toBeInTheDocument();
    },
};

/**
 * 뒤로가기 버튼이 있는 헤더
 */
export const WithBackButton: Story = {
    args: {
        title: '상세 페이지',
        showBack: true,
        onBack: fn(),
    },
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement);
        const backButton = canvas.getByRole('button', { name: '뒤로 가기' });
        
        await expect(backButton).toBeInTheDocument();
        
        await userEvent.click(backButton);
        await expect(args.onBack).toHaveBeenCalled();
    },
};

/**
 * 우측 액션이 있는 헤더
 */
export const WithRightAction: Story = {
    args: {
        title: '설정',
        showBack: true,
        rightAction: (
            <IconButton 
                icon="Settings" 
                variant="ghost" 
                ariaLabel="설정" 
            />
        ),
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const actionButton = canvas.getByRole('button', { name: '설정' });
        
        await expect(actionButton).toBeInTheDocument();
    },
};

/**
 * 여러 우측 액션이 있는 헤더
 */
export const WithMultipleActions: Story = {
    args: {
        title: '마이페이지',
        rightAction: (
            <div className="flex gap-1">
                <IconButton icon="Bell" variant="ghost" ariaLabel="알림" />
                <IconButton icon="Settings" variant="ghost" ariaLabel="설정" />
            </div>
        ),
    },
};

/**
 * 투명 배경 헤더
 */
export const Transparent: Story = {
    args: {
        title: '투명 헤더',
        transparent: true,
        showBack: true,
    },
};
