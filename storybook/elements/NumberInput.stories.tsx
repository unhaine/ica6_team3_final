import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { NumberInput } from '@/components/elements/NumberInput';
import { expect, fn, userEvent, within } from 'storybook/test';

/**
 * NumberInput 컴포넌트
 * 
 * 증감 버튼이 있는 숫자 입력 필드입니다.
 * 수량 선택, 인원수 설정 등에 사용됩니다.
 */
const meta: Meta<typeof NumberInput> = {
    title: 'Elements/NumberInput',
    component: NumberInput,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: '증감 버튼이 있는 숫자 입력 컴포넌트입니다.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        value: {
            control: 'number',
            description: '현재 값',
        },
        min: {
            control: 'number',
            description: '최소값',
        },
        max: {
            control: 'number',
            description: '최대값',
        },
        step: {
            control: 'number',
            description: '증감 단위',
        },
        disabled: {
            control: 'boolean',
            description: '비활성화 상태',
        },
    },
    args: {
        onChange: fn(),
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 기본 NumberInput
 */
export const Default: Story = {
    args: {
        value: 1,
        min: 0,
        max: 10,
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const input = canvas.getByRole('spinbutton');
        
        await expect(input).toBeInTheDocument();
        await expect(input).toHaveValue(1);
    },
};

/**
 * 증감 버튼 테스트
 */
export const IncrementDecrement: Story = {
    args: {
        value: 5,
        min: 0,
        max: 10,
        onChange: fn(),
    },
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement);
        const buttons = canvas.getAllByRole('button');
        const decrementBtn = buttons[0];
        const incrementBtn = buttons[1];
        
        // 증가 버튼 클릭
        await userEvent.click(incrementBtn);
        await expect(args.onChange).toHaveBeenCalled();
        
        // 감소 버튼 클릭
        await userEvent.click(decrementBtn);
        await expect(args.onChange).toHaveBeenCalled();
    },
};

/**
 * 범위 제한
 */
export const WithRange: Story = {
    args: {
        value: 1,
        min: 1,
        max: 5,
    },
    decorators: [
        (Story) => (
            <div className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">범위: 1 ~ 5</p>
                <Story />
            </div>
        ),
    ],
};

/**
 * 증감 단위 설정
 */
export const WithStep: Story = {
    args: {
        value: 10,
        min: 0,
        max: 100,
        step: 10,
    },
    decorators: [
        (Story) => (
            <div className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">10 단위로 증감</p>
                <Story />
            </div>
        ),
    ],
};

/**
 * 비활성화 상태
 */
export const Disabled: Story = {
    args: {
        value: 3,
        disabled: true,
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const input = canvas.getByRole('spinbutton');
        const buttons = canvas.getAllByRole('button');
        
        await expect(input).toBeDisabled();
        await expect(buttons[0]).toBeDisabled();
        await expect(buttons[1]).toBeDisabled();
    },
};

/**
 * 인분 선택 예제
 */
export const ServingsExample: Story = {
    args: {
        value: 2,
        min: 1,
        max: 10,
    },
    decorators: [
        (Story) => (
            <div className="flex items-center gap-4">
                <span className="text-sm font-medium">인분:</span>
                <Story />
            </div>
        ),
    ],
};
