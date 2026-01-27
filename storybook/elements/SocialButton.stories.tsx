import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SocialButton } from '@/components/elements/SocialButton';
import { expect, fn, userEvent, within } from 'storybook/test';

/**
 * SocialButton 컴포넌트
 * 
 * 소셜 로그인 버튼 컴포넌트입니다.
 * Google, Kakao, Naver, Apple 로그인을 지원합니다.
 */
const meta: Meta<typeof SocialButton> = {
    title: 'Elements/SocialButton',
    component: SocialButton,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: '소셜 로그인 버튼 컴포넌트입니다. Google, Kakao, Naver, Apple을 지원합니다.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        provider: {
            control: 'select',
            options: ['google', 'kakao', 'naver', 'apple'],
            description: '소셜 로그인 제공자',
        },
    },
    args: {
        onClick: fn(),
    },
    decorators: [
        (Story) => (
            <div style={{ width: '300px' }}>
                <Story />
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Google 로그인 버튼
 */
export const Google: Story = {
    args: {
        provider: 'google',
    },
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement);
        const button = canvas.getByRole('button');
        
        await expect(button).toBeInTheDocument();
        await expect(button).toHaveTextContent('Google 로그인');
        
        await userEvent.click(button);
        await expect(args.onClick).toHaveBeenCalled();
    },
};

/**
 * Kakao 로그인 버튼
 */
export const Kakao: Story = {
    args: {
        provider: 'kakao',
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const button = canvas.getByRole('button');
        
        await expect(button).toBeInTheDocument();
        await expect(button).toHaveTextContent('카카오톡 로그인');
    },
};

/**
 * Naver 로그인 버튼
 */
export const Naver: Story = {
    args: {
        provider: 'naver',
    },
};

/**
 * Apple 로그인 버튼
 */
export const Apple: Story = {
    args: {
        provider: 'apple',
    },
};

/**
 * 모든 소셜 버튼 비교
 */
export const AllProviders: Story = {
    render: () => (
        <div className="flex flex-col gap-3" style={{ width: '300px' }}>
            <SocialButton provider="google" onClick={() => {}} />
            <SocialButton provider="kakao" onClick={() => {}} />
            <SocialButton provider="naver" onClick={() => {}} />
            <SocialButton provider="apple" onClick={() => {}} />
        </div>
    ),
};

/**
 * 로그인 페이지 예제
 */
export const LoginPageExample: Story = {
    render: () => (
        <div className="flex flex-col gap-4 p-6 border rounded-2xl" style={{ width: '350px' }}>
            <h2 className="text-xl font-bold text-center mb-2">로그인</h2>
            <p className="text-sm text-muted-foreground text-center mb-4">
                소셜 계정으로 간편하게 로그인하세요
            </p>
            <div className="flex flex-col gap-3">
                <SocialButton provider="google" onClick={() => {}} />
                <SocialButton provider="kakao" onClick={() => {}} />
                <SocialButton provider="naver" onClick={() => {}} />
                <SocialButton provider="apple" onClick={() => {}} />
            </div>
        </div>
    ),
};
