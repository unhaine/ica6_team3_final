"use client";

import { useState, useRef, useCallback } from "react";

interface ImageUploaderProps {
  onImageSelect: (file: File, previewUrl: string) => void;
  onAnalyze: () => void;
  isAnalyzing?: boolean;
  hasImage: boolean;
  showUploader?: boolean;
}

export default function ImageUploader({
  onImageSelect,
  onAnalyze,
  isAnalyzing = false,
  hasImage,
  showUploader = true,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) {
        alert("이미지 파일만 업로드 가능합니다.");
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      onImageSelect(file, previewUrl);
    },
    [onImageSelect],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFile(files[0]);
      }
    },
    [handleFile],
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFile(files[0]);
      }
    },
    [handleFile],
  );

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* 드래그 앤 드롭 영역 - showUploader가 true일 때만 표시 */}
      {showUploader && (
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative cursor-pointer rounded-2xl border-2 border-dashed
            transition-all duration-300 ease-out
            ${
              isDragging
                ? "border-emerald-400 bg-emerald-500/10 scale-[1.02]"
                : "border-gray-600 bg-gray-800/50 hover:border-emerald-500/50 hover:bg-gray-700/50"
            }
            p-12
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="flex flex-col items-center gap-4">
            {/* 아이콘 */}
            <div
              className={`
                w-20 h-20 rounded-full flex items-center justify-center
                transition-all duration-300
                ${isDragging ? "bg-emerald-500/20 scale-110" : "bg-gray-700/50"}
              `}
            >
              <svg
                className={`w-10 h-10 transition-colors duration-300 ${
                  isDragging ? "text-emerald-400" : "text-gray-400"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>

            {/* 텍스트 */}
            <div className="text-center">
              <p className="text-lg font-medium text-gray-200">
                {isDragging ? "여기에 놓으세요!" : "냉장고 사진을 업로드하세요"}
              </p>
              <p className="mt-2 text-sm text-gray-400">
                드래그 앤 드롭 또는{" "}
                <span className="text-emerald-400 font-medium">
                  클릭하여 선택
                </span>
              </p>
              <p className="mt-1 text-xs text-gray-500">
                PNG, JPG, WEBP 형식 지원
              </p>
            </div>
          </div>

          {/* 빛나는 테두리 효과 */}
          {isDragging && (
            <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-emerald-500/20 via-transparent to-emerald-500/20 animate-pulse pointer-events-none" />
          )}
        </div>
      )}

      {/* 분석하기 버튼 - 이미지가 있을 때만 표시 */}
      {hasImage && (
        <button
          onClick={onAnalyze}
          disabled={!hasImage || isAnalyzing}
          className={`
            w-full py-2 px-3 rounded-xl font-semibold text-lg
            transition-all duration-300 ease-out
            ${
              hasImage && !isAnalyzing
                ? "bg-linear-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 hover:shadow-lg hover:shadow-emerald-500/25 active:scale-[0.98]"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }
          `}
        >
          {isAnalyzing ? (
            <span className="flex items-center justify-center gap-3">
              <svg
                className="animate-spin h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              분석 중...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              AI로 분석하기
            </span>
          )}
        </button>
      )}
    </div>
  );
}
