"use client";

import { useHeader } from "@/components/modules/Header";
import { useFooter } from "@/components/modules/Footer";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function FullScreenTestPage() {
  const router = useRouter();

  // 1. 헤더 숨기기 (isVisible: false)
  useHeader({
    isVisible: false,
    // (보이지 않지만, 내부 상태 초기화용)
    title: "", 
    left: undefined,
    right: undefined,
  });

  // 2. 푸터 숨기기 (isVisible: false)
  useFooter({
    isVisible: false,
    // items: [], // 굳이 빈 배열로 안 덮어써도 isVisible이 우선순위입니다.
  });

  return (
    <div className="flex flex-col items-center justify-center h-full bg-slate-900 text-white p-6 space-y-6">
      <div className="bg-white/10 p-4 rounded-full mb-4">
        <ArrowLeft className="w-12 h-12 text-slate-300" />
      </div>
      
      <h1 className="text-2xl font-bold text-center">
        이곳은 &quot;전체 화면&quot; 입니다.
      </h1>
      
      <p className="text-slate-400 text-center max-w-xs leading-relaxed">
        헤더와 푸터가 모두 숨겨진 상태입니다.<br/>
        마치 전체 화면 앱처럼 보이죠?
      </p>

      <button 
        onClick={() => router.back()}
        className="mt-8 px-6 py-3 bg-white text-slate-900 font-bold rounded-lg hover:bg-slate-200 transition-colors active:scale-95"
      >
        뒤로 돌아가기
      </button>

      <div className="text-xs text-slate-600 mt-12 bg-black/20 p-4 rounded text-center w-full">
        <code className="block mb-2">useHeader(&#123; isVisible: false &#125;)</code>
        <code className="block">useFooter(&#123; isVisible: false &#125;)</code>
      </div>
    </div>
  );
}
