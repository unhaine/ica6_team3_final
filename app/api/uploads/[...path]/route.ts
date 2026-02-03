import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    
    // 경로 탐색 방지 (보안)
    if (path.some(p => p.includes('..'))) {
      return new NextResponse("Invalid path", { status: 400 });
    }

    // 파일 경로 조합
    // process.cwd()는 Docker에서 /app
    const filePath = join(process.cwd(), "public", "uploads", ...path);

    if (!existsSync(filePath)) {
      return new NextResponse("File not found", { status: 404 });
    }

    // 파일 읽기
    const fileBuffer = await readFile(filePath);

    // MIME 타입 결정 (확장자 기반)
    const ext = filePath.split('.').pop()?.toLowerCase();
    let contentType = 'application/octet-stream';
    if (ext === 'png') contentType = 'image/png';
    else if (ext === 'jpg' || ext === 'jpeg') contentType = 'image/jpeg';
    else if (ext === 'gif') contentType = 'image/gif';
    else if (ext === 'webp') contentType = 'image/webp';

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Image serving error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
