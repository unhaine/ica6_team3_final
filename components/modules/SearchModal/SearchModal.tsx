import { useState, useMemo } from "react";
import { Typography, DataRow } from "@/components/elements";
import { Trash2, Search, X, Plus, Minus } from "lucide-react";
import { motion } from "framer-motion";

export interface SearchModalProps {
    initialValue?: string;
    initialQuantity?: number;
    onClose: () => void;
    onSave: (value: string, quantity: number) => void;
    onDelete?: () => void;
    data: string[];
    title?: string;
    subtitle?: string;
    placeholder?: string;
}

export const SearchModal = ({ 
    initialValue = "", 
    initialQuantity = 1,
    onClose, 
    onSave, 
    onDelete,
    data = [],
    title = "검색",
    subtitle = "항목을 검색하여 선택해주세요.",
    placeholder = "검색..."
}: SearchModalProps) => {
    const [searchTerm, setSearchTerm] = useState(initialValue);
    const [quantity, setQuantity] = useState(initialQuantity);

    const filteredItems = useMemo(() => {
        if (!searchTerm) return data;
        return data.filter(item => 
            item.includes(searchTerm)
        );
    }, [searchTerm, data]);

    const handleSave = (value: string) => {
        onSave(value, quantity);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="bg-white w-full max-w-sm rounded-[2rem] p-6 shadow-2xl flex flex-col max-h-[90vh]">
                <div className="text-center space-y-1 mb-6">
                    <Typography variant="h4" weight="bold">{title}</Typography>
                    <Typography variant="caption" className="text-slate-500">
                        {subtitle}
                    </Typography>
                </div>

                {/* Search Input */}
                <div className="relative mb-4">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                        autoFocus
                        className="w-full pl-12 pr-10 py-4 bg-slate-100 rounded-2xl text-lg font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder={placeholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && searchTerm.trim()) {
                                handleSave(searchTerm);
                            }
                        }}
                    />
                    {searchTerm && (
                        <button 
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 bg-slate-200/50 rounded-full"
                            onClick={() => setSearchTerm("")}
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Search Results */}
                <div className="flex-1 overflow-y-auto -mx-2 px-2 space-y-2 mb-4 min-h-[150px]">
                    {filteredItems.length > 0 ? (
                        filteredItems.map((item) => (
                            <DataRow
                                key={item}
                                itemAction={() => setSearchTerm(item)}
                                className={item === searchTerm ? "bg-primary/5 border-primary/20" : ""}
                                title={item}
                                right={
                                    item === searchTerm ? (
                                        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">
                                            선택됨
                                        </span>
                                    ) : undefined
                                }
                            />
                        ))
                    ) : (
                        <div className="py-8 text-center text-slate-500">
                            <Typography variant="body2">검색 결과가 없습니다.</Typography>
                        </div>
                    )}
                </div>
                
                <div className="pt-4 border-t border-slate-100 space-y-4">
                    {/* Quantity Selector */}
                    <div className="flex items-center justify-between px-2">
                        <Typography weight="bold" className="text-slate-700">수량</Typography>
                        <div className="flex items-center gap-4 bg-slate-100 rounded-xl p-1">
                            <button 
                                className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-slate-600 disabled:opacity-30"
                                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                disabled={quantity <= 1}
                            >
                                <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-bold text-lg">{quantity}</span>
                            <button 
                                className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-slate-600"
                                onClick={() => setQuantity(prev => prev + 1)}
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button 
                            className="w-full py-4 rounded-xl bg-primary font-bold text-white hover:bg-primary-dark shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                            onClick={() => handleSave(searchTerm)}
                            disabled={!searchTerm.trim()}
                        >
                            저장하기
                        </button>
                        
                        <button 
                            className="w-full py-2 rounded-xl text-slate-400 font-medium text-sm hover:text-slate-600"
                            onClick={onClose}
                        >
                            닫기
                        </button>
                        
                        {onDelete && (
                            <button 
                                className="w-full py-2 text-red-500 font-bold text-sm hover:bg-red-50 rounded-xl transition-colors flex items-center justify-center gap-2"
                                onClick={onDelete}
                            >
                                <Trash2 className="w-4 h-4" />
                                삭제하기
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
