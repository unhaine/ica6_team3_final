"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Step, DetectedItem } from "./components/types";

export const useCamera = () => {
    const router = useRouter();
    const [step, setStep] = useState<Step>("capture");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [detectedItems, setDetectedItems] = useState<DetectedItem[]>([]);
    const [editingItem, setEditingItem] = useState<DetectedItem | null>(null);

    // 분석 요청
    const handleAnalyze = async (file: File) => {
        setIsAnalyzing(true);
        try {
            const reader = new FileReader();
            const base64Promise = new Promise<string>((resolve) => {
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(file);
            });
            
            const base64Image = await base64Promise;

            const response = await fetch(`/api/vision/analyze/gemini-flash`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image: base64Image }),
            });

            if (!response.ok) throw new Error("분석 실패");

            const data = await response.json() as { detectedItems: Omit<DetectedItem, "quantity">[] };
            setDetectedItems(data.detectedItems.map((item) => ({
                ...item,
                quantity: 1
            })));
        } catch (error) {
            console.error("분석 에러:", error);
            alert("이미지 분석 중 오류가 발생했습니다.");
            setStep("capture");
        } finally {
            setIsAnalyzing(false);
        }
    };

    // 이미지 선택 처리
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            setStep("detect");
            handleAnalyze(file);
        }
    };

    const handleSaveEdit = (newLabel: string, quantity: number) => {
        if (!editingItem) return;
        handleEditLabel(editingItem.id, newLabel, quantity);
        setEditingItem(null);
    };

    // 아이템 업데이트 (드래그/리사이즈)
    const handleUpdateItem = useCallback((id: string, newBox: { x: number; y: number; width: number; height: number }) => {
        setDetectedItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, boundingBox: newBox } : item))
        );
    }, []);

    // 아이템 삭제
    const handleDeleteItem = (id: string) => {
        setDetectedItems((prev) => prev.filter(item => item.id !== id));
    };

    // 아이템 이름 및 수량 수정
    const handleEditLabel = (id: string, newLabel: string, quantity: number) => {
        setDetectedItems((prev) => 
            prev.map(item => item.id === id ? { ...item, label: newLabel, quantity } : item)
        );
    };

    // 저장 완료 처리
    const handleConfirmSave = async () => {
        try {
            // 중복된 이름의 재료를 합쳐서 수량 계산
            const aggregatedItems = detectedItems.reduce((acc, item) => {
                const existingItem = acc.find(i => i.name === item.label);
                if (existingItem) {
                    existingItem.quantity += (item.quantity || 1);
                } else {
                    acc.push({
                        name: item.label,
                        quantity: item.quantity || 1,
                        category: null, // 카테고리는 나중에 추가 가능
                        source: 'fridge-photo', // 냉장고 사진에서 추출
                    });
                }
                return acc;
            }, [] as { name: string; quantity: number; category: string | null; source: string }[]);

            // 재료 저장 API 호출
            const response = await fetch('/api/ingredients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items: aggregatedItems,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || '재료 저장에 실패했습니다.');
            }

            alert(`✅ ${aggregatedItems.length}종류의 재료(총 ${detectedItems.length}개 객체)가 냉장고에 저장되었습니다.`);
            router.push("/test/fridge");
        } catch (error) {
            console.error('재료 저장 에러:', error);
            alert(`❌ 재료 저장 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
        }
    };

    return {
        step,
        setStep,
        imageFile,
        previewUrl,
        isAnalyzing,
        detectedItems,
        setDetectedItems,
        editingItem,
        setEditingItem,
        handleImageChange,
        handleUpdateItem,
        handleDeleteItem,
        handleEditLabel,
        handleSaveEdit,
        handleConfirmSave,
    };
};
