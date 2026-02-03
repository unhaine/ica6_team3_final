"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-helpers";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";

/**
 * Base64 이미지를 파일로 저장하고 URL을 반환
 */
async function saveImageFile(base64Data: string): Promise<string> {
    try {
        // "data:image/png;base64," 헤더 제거
        const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        
        if (!matches || matches.length !== 3) {
            throw new Error('Invalid base64 string');
        }
        
        const buffer = Buffer.from(matches[2], 'base64');
        
        // 저장 경로 설정 (public/uploads/profile)
        // Next.js standalone mode에서 process.cwd()는 실행 위치(server.js가 있는 곳)
        const uploadDir = join(process.cwd(), 'public', 'uploads', 'profile');
        
        // 개발 환경 로그
        console.log('[Save Image File] Saving to:', uploadDir);
        
        // 디렉토리 생성
        await mkdir(uploadDir, { recursive: true });
        
        // 파일명 생성
        const fileName = `${randomUUID()}.png`;
        const filePath = join(uploadDir, fileName);
        
        // 파일 저장
        await writeFile(filePath, buffer);
        
        // API Route를 통해 서빙되도록 경로 변경
        // /uploads/profile/... -> /api/uploads/profile/...
        return `/api/uploads/profile/${fileName}`;
    } catch (error) {
        console.error('[Save Image File] Error:', error);
        throw new Error('이미지 파일 저장 실패');
    }
}

/**
 * 사용자 프로필 이미지 업데이트
 */
export async function updateProfileImage(imageUrl: string): Promise<{
    success: boolean;
    error?: string;
    savedUrl?: string; // 클라이언트 세션 업데이트용
}> {
    try {
        const user = await getCurrentUser();
        
        if (!user) {
            console.error('[Update Profile Image] 사용자 없음');
            return {
                success: false,
                error: "로그인이 필요합니다.",
            };
        }

        let finalImageUrl = imageUrl;

        // Base64 이미지인 경우 파일로 저장
        if (imageUrl.startsWith('data:image')) {
            finalImageUrl = await saveImageFile(imageUrl);
        }

        // 사용자 프로필 이미지 업데이트 (id로 업데이트)
        await prisma.user.update({
            where: { id: user.id },
            data: { image: finalImageUrl },
        });

        return { success: true, savedUrl: finalImageUrl };
    } catch (error) {
        console.error('[Update Profile Image] Error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : '프로필 이미지 업데이트에 실패했습니다',
        };
    }
}

/**
 * 서버 액션: Google Imagen 3를 사용하여 프로필 이미지 생성
 * 
 * Google AI Studio의 Imagen 3 모델을 사용하여 
 * 냉장고 안의 귀여운 동물 캐릭터 이미지를 생성합니다.
 */

export async function generateProfileImage(animal: string): Promise<{
    success: boolean;
    imageUrl?: string;
    error?: string;
}> {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY가 설정되지 않았습니다.');
        }

        // 간결한 프롬프트로 AI의 창의성 극대화
        const prompt = `A cute kawaii ${animal} peeking out from inside a refrigerator. Minimalist icon style, simple and adorable.`;

        // Development logging
        if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.log(`[Profile Image Generation] Animal: ${animal}`);
            // eslint-disable-next-line no-console
            console.log(`[Profile Image Generation] Prompt: ${prompt}`);
        }

        // Google Imagen 4 API 호출 (Imagen 3는 종료됨)
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict`,
            {
                method: 'POST',
                headers: {
                    'x-goog-api-key': apiKey,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    instances: [
                        {
                            prompt: prompt,
                        }
                    ],
                    parameters: {
                        sampleCount: 1,
                        aspectRatio: '1:1', // 프로필 이미지용 정사각형
                    }
                }),
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                `Imagen API 오류: ${response.status} - ${JSON.stringify(errorData)}`
            );
        }

        const data = await response.json();
        
        // Imagen 4 응답에서 이미지 추출
        if (!data.predictions || data.predictions.length === 0) {
            throw new Error('이미지가 생성되지 않았습니다.');
        }

        // Base64 이미지를 data URL로 변환
        const imageBase64 = data.predictions[0].bytesBase64Encoded;
        const imageUrl = `data:image/png;base64,${imageBase64}`;

        if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.log('[Profile Image Generation] 이미지 생성 성공');
        }

        return {
            success: true,
            imageUrl,
        };
    } catch (error) {
        console.error('[Profile Image Generation] Error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : '이미지 생성에 실패했습니다',
        };
    }
}

/**
 * 생성된 이미지를 서버에 저장하는 함수
 * 
 * 실제 구현 시:
 * - AWS S3, Google Cloud Storage 등의 클라우드 스토리지에 업로드
 * - 또는 로컬 파일 시스템에 저장 (개발 환경)
 * - 데이터베이스에 이미지 URL 저장
 */
export async function saveGeneratedImage(imageUrl: string, userId: string): Promise<{
    success: boolean;
    savedUrl?: string;
    error?: string;
}> {
    try {
        // TODO: 실제 이미지 저장 로직 구현
        // 예시:
        // 1. 이미지 다운로드
        // 2. 클라우드 스토리지에 업로드
        // 3. 데이터베이스에 URL 저장

        if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.log(`[Save Profile Image] User: ${userId}, URL: ${imageUrl}`);
        }

        return {
            success: true,
            savedUrl: imageUrl,
        };
    } catch (error) {
        console.error('[Save Profile Image] Error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : '이미지 저장에 실패했습니다',
        };
    }
}
