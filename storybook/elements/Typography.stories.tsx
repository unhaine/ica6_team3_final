import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Typography } from '@/components/elements/Typography';
import { expect, within } from 'storybook/test';

/**
 * Typography 컴포넌트
 * 
 * 텍스트 스타일링을 위한 컴포넌트입니다.
 * 일관된 타이포그래피 시스템을 제공합니다.
 */
const meta: Meta<typeof Typography> = {
    title: 'Elements/Typography',
    component: Typography,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: '일관된 텍스트 스타일링을 위한 타이포그래피 컴포넌트입니다.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['h1', 'h2', 'h3', 'h4', 'subtitle1', 'subtitle2', 'body1', 'body2', 'caption', 'overline'],
            description: '텍스트 스타일 변형',
        },
        weight: {
            control: 'select',
            options: ['thin', 'light', 'normal', 'medium', 'semibold', 'bold', 'black'],
            description: '폰트 굵기',
        },
        color: {
            control: 'select',
            options: ['primary', 'secondary', 'muted', 'error', 'success', 'warning', 'inherit', 'white'],
            description: '텍스트 색상',
        },
        align: {
            control: 'select',
            options: ['left', 'center', 'right', 'justify'],
            description: '텍스트 정렬',
        },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 기본 Typography
 */
export const Default: Story = {
    args: {
        variant: 'body1',
        children: '기본 텍스트입니다.',
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const text = canvas.getByText('기본 텍스트입니다.');
        
        await expect(text).toBeInTheDocument();
    },
};

/**
 * 헤딩 스타일
 */
export const Headings: Story = {
    render: () => (
        <div className="flex flex-col gap-4">
            <Typography variant="h1">Heading 1</Typography>
            <Typography variant="h2">Heading 2</Typography>
            <Typography variant="h3">Heading 3</Typography>
            <Typography variant="h4">Heading 4</Typography>
        </div>
    ),
};

/**
 * 본문 스타일
 */
export const BodyText: Story = {
    render: () => (
        <div className="flex flex-col gap-4 max-w-md">
            <Typography variant="subtitle1">서브타이틀 1 - 강조된 본문</Typography>
            <Typography variant="subtitle2">서브타이틀 2 - 부제목</Typography>
            <Typography variant="body1">
                Body 1 - 기본 본문 텍스트입니다. 일반적인 단락에 사용됩니다.
            </Typography>
            <Typography variant="body2">
                Body 2 - 작은 본문 텍스트입니다. 보조 정보에 사용됩니다.
            </Typography>
            <Typography variant="caption">Caption - 매우 작은 텍스트</Typography>
            <Typography variant="overline">OVERLINE TEXT</Typography>
        </div>
    ),
};

/**
 * 폰트 굵기
 */
export const FontWeights: Story = {
    render: () => (
        <div className="flex flex-col gap-2">
            <Typography weight="thin">Thin - 100</Typography>
            <Typography weight="light">Light - 300</Typography>
            <Typography weight="normal">Normal - 400</Typography>
            <Typography weight="medium">Medium - 500</Typography>
            <Typography weight="semibold">Semibold - 600</Typography>
            <Typography weight="bold">Bold - 700</Typography>
            <Typography weight="black">Black - 900</Typography>
        </div>
    ),
};

/**
 * 색상
 */
export const Colors: Story = {
    render: () => (
        <div className="flex flex-col gap-2">
            <Typography color="primary">Primary 색상</Typography>
            <Typography color="secondary">Secondary 색상</Typography>
            <Typography color="muted">Muted 색상</Typography>
            <Typography color="error">Error 색상</Typography>
            <Typography color="success">Success 색상</Typography>
            <Typography color="warning">Warning 색상</Typography>
            <div className="bg-gray-800 p-2 rounded">
                <Typography color="white">White 색상</Typography>
            </div>
        </div>
    ),
};

/**
 * 정렬
 */
export const Alignment: Story = {
    render: () => (
        <div className="flex flex-col gap-4 w-80">
            <Typography align="left">왼쪽 정렬</Typography>
            <Typography align="center">가운데 정렬</Typography>
            <Typography align="right">오른쪽 정렬</Typography>
            <Typography align="justify">
                양쪽 정렬 - 이 텍스트는 양쪽 끝에 맞춰 정렬됩니다. 단어 간격이 조정되어 양쪽 여백이 균일하게 됩니다.
            </Typography>
        </div>
    ),
};

/**
 * 조합 예제
 */
export const CombinedExample: Story = {
    render: () => (
        <article className="max-w-md space-y-4">
            <Typography variant="h2" weight="bold">
                냉장고 속 재료로 만드는 요리
            </Typography>
            <Typography variant="subtitle1" color="muted">
                간단하고 맛있는 집밥 레시피
            </Typography>
            <Typography variant="body1">
                냉장고에 남아있는 재료들로 손쉽게 만들 수 있는 요리 레시피를 소개합니다. 
                AI가 분석한 재료를 기반으로 최적의 레시피를 추천해 드립니다.
            </Typography>
            <Typography variant="caption" color="muted">
                마지막 업데이트: 2024년 1월 27일
            </Typography>
        </article>
    ),
};
