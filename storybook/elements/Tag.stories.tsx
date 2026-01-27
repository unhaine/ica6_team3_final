import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Tag } from '@/components/elements/Tag';
import { expect, fn, userEvent, within } from 'storybook/test';

/**
 * Tag 컴포넌트
 * 
 * 라벨과 아이콘을 표시하는 태그/칩 컴포넌트입니다.
 * 카테고리, 필터, 상태 표시 등에 사용됩니다.
 */
const meta: Meta<typeof Tag> = {
    title: 'Elements/Tag',
    component: Tag,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: '라벨, 아이콘, 삭제 버튼을 지원하는 태그 컴포넌트입니다.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        label: {
            control: 'text',
            description: '태그 텍스트',
        },
        variant: {
            control: 'select',
            options: ['default', 'owned', 'missing', 'primary', 'outline'],
            description: '스타일 변형',
        },
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
            description: '태그 크기',
        },
        icon: {
            control: 'select',
            options: ['Check', 'X', 'Star', 'Heart', 'Tag'],
            description: '표시할 아이콘',
        },
    },
    args: {
        onRemove: fn(),
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 기본 Tag
 */
export const Default: Story = {
    args: {
        label: '기본 태그',
    },
};

/**
 * 스타일 변형 비교
 */
export const Variants: Story = {
    render: () => (
        <div className="flex flex-wrap gap-2">
            <Tag label="Default" variant="default" />
            <Tag label="보유 재료" variant="owned" />
            <Tag label="없는 재료" variant="missing" />
            <Tag label="Primary" variant="primary" />
            <Tag label="Outline" variant="outline" />
        </div>
    ),
};

/**
 * 크기 비교
 */
export const Sizes: Story = {
    render: () => (
        <div className="flex items-center gap-2">
            <Tag label="Small" size="sm" />
            <Tag label="Medium" size="md" />
            <Tag label="Large" size="lg" />
        </div>
    ),
};

/**
 * 아이콘이 있는 태그
 */
export const WithIcon: Story = {
    render: () => (
        <div className="flex flex-wrap gap-2">
            <Tag label="완료" icon="Check" variant="owned" />
            <Tag label="중요" icon="Star" variant="primary" />
            <Tag label="좋아요" icon="Heart" />
        </div>
    ),
};

/**
 * 삭제 가능한 태그
 */
export const Removable: Story = {
    args: {
        label: '삭제 가능',
        onRemove: fn(),
    },
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement);
        const removeButton = canvas.getByRole('button', { name: '태그 삭제' });
        
        await expect(removeButton).toBeInTheDocument();
        
        await userEvent.click(removeButton);
        await expect(args.onRemove).toHaveBeenCalled();
    },
};

/**
 * 재료 상태 표시 예제
 */
export const IngredientStatus: Story = {
    render: () => (
        <div className="flex flex-col gap-4">
            <div>
                <p className="text-sm text-muted-foreground mb-2">보유 재료:</p>
                <div className="flex flex-wrap gap-2">
                    <Tag label="양파" variant="owned" icon="Check" />
                    <Tag label="마늘" variant="owned" icon="Check" />
                    <Tag label="간장" variant="owned" icon="Check" />
                </div>
            </div>
            <div>
                <p className="text-sm text-muted-foreground mb-2">없는 재료:</p>
                <div className="flex flex-wrap gap-2">
                    <Tag label="고추장" variant="missing" icon="X" />
                    <Tag label="참기름" variant="missing" icon="X" />
                </div>
            </div>
        </div>
    ),
};
