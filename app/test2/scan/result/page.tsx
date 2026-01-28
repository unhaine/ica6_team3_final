"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { AppHeader } from "@/components/modules/AppHeader";
import { CorrectionItem } from "@/components/modules/CorrectionItem";
import { Button } from "@/components/ui/Button";
import { AvatarThumbnail } from "@/components/elements/AvatarThumbnail";
import { Typography } from "@/components/elements/Typography";

const MOCK_DETECTED = [
    { id: "1", name: "사과", quantity: "1개", expiryDate: "2026-02-10" },
    { id: "2", name: "우유", quantity: "1L", expiryDate: "2026-02-05" },
    { id: "3", name: "양파", quantity: "2개", expiryDate: "2026-02-15" },
];

export default function CorrectionPage() {
    const router = useRouter();
    const [items, setItems] = useState(MOCK_DETECTED);

    const handleUpdate = (id: string, field: string, value: any) => {
        setItems(prev => prev.map(item => 
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const handleDelete = (id: string) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };

    const handleAddManual = () => {
        const newItem = {
            id: Date.now().toString(),
            name: "새 식재료",
            quantity: "1",
            expiryDate: new Date().toISOString().split('T')[0]
        };
        setItems([...items, newItem]);
    };

    const handleSubmit = () => {
        // In a real app, optimize optimistic update or API call here
        alert("냉장고에 3개의 식재료가 추가되었습니다!");
        router.push("/mobile/fridge");
    };

    return (
        <div className="flex flex-col h-screen bg-white">
            <AppHeader title="인식 결과 확인" showBack onBack={() => router.back()} />
            
            <div className="flex-1 overflow-y-auto px-5 pb-32">
                {/* Thumbnail Display */}
                <div className="flex justify-center py-6">
                    <div className="relative w-48 h-48 rounded-2xl overflow-hidden shadow-lg border-4 border-white ring-1 ring-gray-100">
                        <AvatarThumbnail 
                            src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80" 
                            alt="Scanned Image"
                            shape="square"
                            className="w-full h-full"
                        />
                        {/* Overlay to hint it's adjustable */}
                    </div>
                </div>

                <div className="space-y-1 mb-6">
                     <Typography variant="h6" weight="bold">
                        {items.length}개의 식재료를 찾았어요
                     </Typography>
                     <Typography variant="body2" className="text-gray-500">
                        유통기한과 수량을 확인해주세요.
                     </Typography>
                </div>

                <div className="space-y-3">
                    {items.map(item => (
                        <CorrectionItem
                            key={item.id}
                            {...item}
                            onUpdate={handleUpdate}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
                
                <button 
                    onClick={handleAddManual}
                    className="w-full py-4 mt-6 flex items-center justify-center gap-2 text-primary font-bold border-2 border-dashed border-primary/30 rounded-xl hover:bg-primary/5 transition-colors active:scale-[0.98]"
                >
                    <Plus className="w-5 h-5" />
                    직접 추가하기
                </button>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 max-w-md mx-auto z-50 pb-8">
                <Button size="lg" className="w-full font-bold h-14 text-lg rounded-xl shadow-lg shadow-primary/20" onClick={handleSubmit}>
                    냉장고에 넣기
                </Button>
            </div>
        </div>
    )
}
