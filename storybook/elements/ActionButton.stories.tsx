import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ActionButton } from '@/components/elements/ActionButton';
import { expect, fn, userEvent, within } from 'storybook/test';

/**
 * ActionButton 컴포넌트
 * 
 * 아이콘과 로딩 상태를 지원하는 버튼 컴포넌트입니다.
 * 기본 Button 컴포넌트를 확장하여 아이콘, 로딩 스피너, 전체 너비 옵션을 제공합니다.
 */
const meta: Meta<typeof ActionButton> = {
    title: 'Elements/ActionButton',
    component: ActionButton,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: '아이콘과 로딩 상태를 지원하는 확장 버튼 컴포넌트입니다.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
            description: '버튼 스타일 변형',
        },
        size: {
            control: 'select',
            options: ['default', 'sm', 'lg', 'icon'],
            description: '버튼 크기',
        },
        icon: {
            control: 'select',
            options: ['Camera', 'Upload', 'Download', 'Settings', 'Search', 'Plus', 'Trash2', 'Pencil'],
            description: '표시할 아이콘 이름 (Lucide Icons)',
        },
        iconPosition: {
            control: 'radio',
            options: ['left', 'right'],
            description: '아이콘 위치',
        },
        loading: {
            control: 'boolean',
            description: '로딩 상태',
        },
        fullWidth: {
            control: 'boolean',
            description: '전체 너비 사용 여부',
        },
        disabled: {
            control: 'boolean',
            description: '비활성화 상태',
        },
        children: {
            control: 'text',
            description: '버튼 텍스트',
        },
    },
    args: {
        onClick: fn(),
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 기본 ActionButton
 */
export const Default: Story = {
    args: {
        children: 'Action Button',
    },
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement);
        const button = canvas.getByRole('button');
        
        // 버튼이 렌더링되었는지 확인
        await expect(button).toBeInTheDocument();
        await expect(button).toHaveTextContent('Action Button');
        
        // 클릭 테스트
        await userEvent.click(button);
        await expect(args.onClick).toHaveBeenCalled();
    },
};

/**
 * 왼쪽에 아이콘이 있는 버튼
 */
export const WithIcon: Story = {
    args: {
        children: '사진 촬영',
        icon: 'Camera',
    },
};

/**
 * 오른쪽에 아이콘이 있는 버튼
 */
export const WithIconRight: Story = {
    args: {
        children: '다운로드',
        icon: 'Download',
        iconPosition: 'right',
    },
};

/**
 * 로딩 상태 버튼
 * 
 * 로딩 중일 때 스피너가 표시되고 버튼이 비활성화됩니다.
 */
export const Loading: Story = {
    args: {
        children: '처리 중...',
        loading: true,
    },
};

/**
 * 전체 너비 버튼
 * 
 * 부모 컨테이너의 전체 너비를 차지합니다.
 */
export const FullWidth: Story = {
    args: {
        children: '전체 너비 버튼',
        fullWidth: true,
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
 * 모든 Variant 비교
 */
export const Variants: Story = {
    render: () => (
        <div className="flex flex-col gap-4">
            <ActionButton variant="default">Default</ActionButton>
            <ActionButton variant="secondary">Secondary</ActionButton>
            <ActionButton variant="destructive">Destructive</ActionButton>
            <ActionButton variant="outline">Outline</ActionButton>
            <ActionButton variant="ghost">Ghost</ActionButton>
            <ActionButton variant="link">Link</ActionButton>
        </div>
    ),
};

/**
 * 모든 Size 비교
 */
export const Sizes: Story = {
    render: () => (
        <div className="flex items-center gap-4">
            <ActionButton size="sm">Small</ActionButton>
            <ActionButton size="default">Default</ActionButton>
            <ActionButton size="lg">Large</ActionButton>
        </div>
    ),
};

/**
 * 비활성화 상태
 */
export const Disabled: Story = {
    args: {
        children: '비활성화',
        disabled: true,
    },
};

/**
 * 아이콘과 함께 사용하는 다양한 예시
 */
export const IconVariations: Story = {
    render: () => (
        <div className="flex flex-col gap-4">
            <ActionButton icon="Upload" variant="default">업로드</ActionButton>
            <ActionButton icon="Download" variant="outline" iconPosition="right">다운로드</ActionButton>
            <ActionButton icon="Camera" variant="secondary">사진 촬영</ActionButton>
            <ActionButton icon="Search" variant="ghost">검색</ActionButton>
        </div>
    ),
};
