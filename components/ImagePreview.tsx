'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';

interface ImagePreviewProps {
  previewUrl: string;
  onRemove: () => void;
  onHeightChange?: (height: number) => void;
}

export default function ImagePreview({ previewUrl, onRemove, onHeightChange }: ImagePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && onHeightChange) {
      onHeightChange(containerRef.current.offsetHeight);
    }
  }, [previewUrl, onHeightChange]);

  return (
    <div ref={containerRef} className="relative w-full group">
      {/* 이미지 컨테이너 */}
      <div className="relative rounded-2xl overflow-hidden bg-gray-800 shadow-2xl shadow-black/50">
        {/* 배경 그라데이션 장식 */}
        <div className="absolute inset-0 bg-linear-to-br from-emerald-500/10 via-transparent to-teal-500/10 pointer-events-none z-10" />
        
        {/* 이미지 - 높이를 700px로 넉넉하게 잡고 가로 너비를 꽉 채웁니다 */}
        <div className="relative h-[580px] w-full">
          <Image
            src={previewUrl}
            alt="업로드된 냉장고 이미지"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* 호버 시 오버레이 */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
          <button
            onClick={onRemove}
            className="px-6 py-3 bg-red-500/90 hover:bg-red-600 text-white font-medium rounded-xl transition-all duration-200 flex items-center gap-2 hover:scale-105 active:scale-95"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            다른 이미지 선택
          </button>
        </div>
      </div>

      {/* 이미지 정보 뱃지 */}
      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-30">
        <div className="px-4 py-1.5 bg-gray-800 border border-gray-700 rounded-full text-sm text-gray-300 flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          이미지 준비 완료
        </div>
      </div>
    </div>
  );
}
