"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { COMMERCE_PROVIDERS, CommerceProvider, getCommerceLink } from "@/app/lib/commerce";
import { Typography } from "@/components/elements";
import { ExternalLink, ShoppingBag } from "lucide-react";
import Image from "next/image";

interface CommerceModalProps {
    isOpen: boolean;
    onClose: () => void;
    ingredientName: string;
}

export function CommerceModal({ isOpen, onClose, ingredientName }: CommerceModalProps) {

    const normalizedName = ingredientName.replace(/[\.·•]/g, ' ');

    const handleCommerceClick = (provider: any) => {
        const link = getCommerceLink(normalizedName, provider);
        window.open(link, '_blank');
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-surface border-border rounded-[2rem]">
                <DialogHeader className="space-y-4">
                    <div className="flex flex-col items-center gap-2 text-center pt-4">
                        <div className="bg-primary/10 p-4 rounded-full mb-2">
                            <ShoppingBag className="w-8 h-8 text-primary" />
                        </div>
                        <DialogTitle className="text-xl sm:text-2xl font-bold text-text-primary">
                            <span className="text-primary">{normalizedName}</span> 구매하기
                        </DialogTitle>
                        <Typography variant="body2" color="secondary">
                            원하시는 쇼핑몰에서 재료를 구매해보세요!
                        </Typography>
                    </div>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-3 py-6">
                    {COMMERCE_PROVIDERS.map((provider) => (
                        <button
                            key={provider.id}
                            onClick={() => handleCommerceClick(provider.id)}
                            className="flex items-center gap-3 p-4 rounded-2xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group"
                        >
                            {/* Note: In a real app, you'd use actual logos. Using text/icons for now */}
                            <div className="flex-1 flex flex-col items-start gap-0.5">
                                <span className="font-bold text-text-primary group-hover:text-primary transition-colors">
                                    {provider.name}
                                </span>
                                <span className="text-[10px] text-text-tertiary">검색 결과로 이동</span>
                            </div>
                            <ExternalLink className="w-4 h-4 text-text-tertiary group-hover:text-primary transition-colors" />
                        </button>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}

// Multi-item Modal Wrapper or Extension
export function CommerceMultiModal({ isOpen, onClose, ingredients }: { isOpen: boolean; onClose: () => void; ingredients: string[] }) {
    const [selectedItem, setSelectedItem] = useState<string | null>(null);

    // If a specific item is selected, show the single modal
    if (selectedItem) {
        return (
            <CommerceModal
                isOpen={true}
                onClose={() => setSelectedItem(null)}
                ingredientName={selectedItem}
            />
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-surface border-border rounded-[2rem]">
                <DialogHeader>
                    <div className="flex flex-col items-center gap-2 text-center pt-4">
                        <div className="bg-primary/10 p-4 rounded-full mb-2">
                            <ShoppingBag className="w-8 h-8 text-primary" />
                        </div>
                        <DialogTitle className="text-xl font-bold">
                            부족한 재료 장보기
                        </DialogTitle>
                        <Typography variant="body2" color="secondary">
                            냉장고에 없는 재료들을 구매해보세요.
                        </Typography>
                    </div>
                </DialogHeader>

                <div className="py-6 space-y-3 max-h-[60vh] overflow-y-auto">
                    {ingredients.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            모든 재료가 냉장고에 있습니다! 🎉
                        </div>
                    ) : (
                        ingredients.map((ing, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-border bg-gray-50">
                                <span className="font-bold text-gray-800">{ing.replace(/[\.·•]/g, ' ')}</span>
                                <button
                                    onClick={() => setSelectedItem(ing)}
                                    className="px-3 py-1.5 bg-primary/10 text-primary text-sm font-bold rounded-lg hover:bg-primary/20 transition-colors"
                                >
                                    구매하기
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
