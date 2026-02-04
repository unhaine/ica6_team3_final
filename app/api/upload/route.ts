import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json(
                { error: "파일이 없습니다." },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // public/uploads 디렉토리 확인 및 생성
        const uploadDir = join(process.cwd(), "public", "uploads");
        await mkdir(uploadDir, { recursive: true });

        // 파일명 생성 (UUID + 원본 확장자)
        const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
        const fileName = `${uuidv4()}.${ext}`;
        const filePath = join(uploadDir, fileName);

        // 파일 저장
        await writeFile(filePath, buffer);

        // 접근 가능한 URL 반환 (app/api/uploads/[...path]/route.ts에서 서빙)
        const fileUrl = `/api/uploads/${fileName}`;

        return NextResponse.json({ success: true, url: fileUrl });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { error: "파일 업로드 중 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}
