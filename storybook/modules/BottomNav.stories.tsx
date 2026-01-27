import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { BottomNav } from '@/components/modules/BottomNav';
import { expect, within } from 'storybook/test';

/**
 * BottomNav 컴포넌트
 * 
 * 모바일 환경에서 주로 사용되는 하단 네비게이션 바입니다.
 * 주요 페이지로 이동하는 링크들을 포함합니다.
 */
const meta: Meta<typeof BottomNav> = {
    title: 'Modules/BottomNav',
    component: BottomNav,
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component: '앱의 주요 페이지로 이동할 수 있는 하단 네비게이션 바입니다.',
            },
        },
    },
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <div className="relative min-h-[400px] bg-background">
                <div className="p-4 pb-20">
                    <h1 className="text-xl font-bold mb-4">페이지 컨텐츠</h1>
                    <p className="text-muted-foreground mb-2">
                        하단 네비게이션 바가 고정되어 표시됩니다.
                    </p>
                    <p className="text-muted-foreground">
                        모바일 앱에서 주로 사용되는 네비게이션 패턴입니다.
                    </p>
                </div>
                <Story />
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 기본 하단 네비게이션
 */
export const Default: Story = {
    args: {},
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        // 네비게이션 아이템들이 렌더링되었는지 확인
        const links = canvas.getAllByRole('link');
        await expect(links).toHaveLength(3); // 홈, 업로드, 레시피
        
        await expect(canvas.getByText('홈')).toBeInTheDocument();
        await expect(canvas.getByText('업로드')).toBeInTheDocument();
        await expect(canvas.getByText('레시피')).toBeInTheDocument();
    },
};

/**
 * 커스텀 클래스가 적용된 하단 네비게이션
 */
export const WithCustomClass: Story = {
    args: {
        className: 'border-t border-border',
    },
};

/**
 * 모바일 프레임 미리보기
 */
export const MobilePreview: Story = {
    decorators: [
        (Story) => (
            <div className="flex justify-center p-8 bg-muted">
                <div className="relative w-[375px] h-[667px] bg-background rounded-3xl overflow-hidden shadow-2xl border-8 border-gray-800">
                    <div className="p-4 pb-20">
                        <h1 className="text-xl font-bold mb-4">홈</h1>
                        <p className="text-muted-foreground">
                            모바일 디바이스에서의 미리보기입니다.
                        </p>
                    </div>
                    <Story />
                </div>
            </div>
        ),
    ],
    args: {},
};
