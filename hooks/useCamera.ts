"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Step, DetectedItem } from "@/components/modules/CameraSection";

export const useCamera = () => {
    const router = useRouter();
    const [step, setStep] = useState<Step>("capture");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [detectedItems, setDetectedItems] = useState<DetectedItem[]>([]);
    const [editingItem, setEditingItem] = useState<DetectedItem | null>(null);
    const [showDuplicateAlert, setShowDuplicateAlert] = useState(false);
    const [duplicateMessage, setDuplicateMessage] = useState("");
    const [showRecipes, setShowRecipes] = useState(false);

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

    // 실제 저장 로직 (중복 확인 후 또는 강제 저장 시 호출)
    const executeSave = async () => {
        try {
            // 카테고리 & 이름 기반 유통기한 계산 헬퍼 함수
            const calculateExpiryDate = (name: string, category: string | null) => {
                const today = new Date();
                let addDays = 14; // 기본 2주

                // 1. 이름 기반 추론 (더 구체적)
                const lowerName = name.toLowerCase();
                if (lowerName.match(/우유|치즈|요거트|버터|달걀|계란|유제품/)) addDays = 10;
                else if (lowerName.match(/돼지|소고기|닭|고기|양고기|햄|소세지|베이컨/)) addDays = 3;
                else if (lowerName.match(/생선|해산물|조개|새우|오징어/)) addDays = 2;
                else if (lowerName.match(/두부|콩나물|시금치|상추|깻잎/)) addDays = 5;
                else if (lowerName.match(/김치|장아찌|젓갈|반찬/)) addDays = 60;
                else if (lowerName.match(/양파|감자|고구마|당근|마늘/)) addDays = 30;
                else if (lowerName.match(/냉동|만두|피자|아이스크림/)) addDays = 30;

                // 2. 카테고리 기반 추론 (이름 매칭 없을 경우)
                else if (category) {
                    switch (category.toLowerCase()) {
                        case 'vegetable':
                        case 'fruit':
                            addDays = 7;
                            break;
                        case 'meat':
                        case 'fish':
                        case 'seafood':
                            addDays = 3;
                            break;
                        case 'dairy':
                        case 'milk':
                        case 'egg':
                            addDays = 10;
                            break;
                        case 'frozen':
                            addDays = 30;
                            break;
                        default:
                            addDays = 14;
                    }
                }

                return new Date(today.setDate(today.getDate() + addDays));
            };

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
                        expiryDate: calculateExpiryDate(item.label, null), // 이름 기반으로 우선 추론
                    });
                }
                return acc;
            }, [] as { name: string; quantity: number; category: string | null; source: string; expiryDate: Date }[]);

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

            // alert(`✅ ${aggregatedItems.length}종류의 재료(총 ${detectedItems.length}개 객체)가 냉장고에 저장되었습니다.`);
            setShowRecipes(true); // 저장 완료 후 레시피 팝업 띄우기
        } catch (error) {
            console.error('재료 저장 에러:', error);
            alert(`❌ 재료 저장 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
        }
    };

    // 저장 버튼 클릭 시 처리 (중복 체크)
    const handleConfirmSave = async () => {
        console.log('Saving ingredients...', detectedItems);
        try {
            // 1. 현재 냉장고 재료 조회 (중복 체크용)
            // TODO: 캐싱하거나 react-query 등을 사용하면 더 좋음
            const currentIngredientsRes = await fetch('/api/ingredients');
            const currentIngredientsData = await currentIngredientsRes.json();

            const existingNames = new Set<string>();
            if (currentIngredientsData.success && Array.isArray(currentIngredientsData.data)) {
                currentIngredientsData.data.forEach((item: { name: string }) => {
                    existingNames.add(item.name.replace(/\s+/g, '').toLowerCase());
                });
            }

            // 2. 중복되는 항목 찾기
            const duplicates = detectedItems.filter(item =>
                existingNames.has(item.label.replace(/\s+/g, '').toLowerCase())
            );

            if (duplicates.length > 0) {
                const uniqueDuplicateNames = Array.from(new Set(duplicates.map(d => d.label)));
                const message = `'${uniqueDuplicateNames.join(', ')}' 이(가) 이미 냉장고에 있습니다.\n그래도 저장하시겠습니까?`;

                setDuplicateMessage(message);
                setShowDuplicateAlert(true);
                return;
            }

            // 중복 없으면 바로 저장
            executeSave();

        } catch (error) {
            console.error('중복 체크 중 에러:', error);
            // 에러 나도 일단 저장 시도
            executeSave();
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
        showDuplicateAlert,
        setShowDuplicateAlert,
        duplicateMessage,
        handleForceSave: executeSave,
        showRecipes,
        setShowRecipes,
    };
};
