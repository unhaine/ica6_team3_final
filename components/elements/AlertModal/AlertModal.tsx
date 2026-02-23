import { motion, AnimatePresence } from "framer-motion";
import { Typography } from "../Typography";
import { X } from "lucide-react";

interface AlertModalProps {
    isOpen: boolean;
    title: string;
    message: string | React.ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onClose: () => void;
    variant?: 'default' | 'danger';
    showCancel?: boolean;
}

export const AlertModal = ({
    isOpen,
    title,
    message,
    confirmLabel = "확인",
    cancelLabel = "취소",
    onConfirm,
    onClose,
    variant = 'default',
    showCancel = true
}: AlertModalProps) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="bg-white w-full max-w-xs rounded-2xl p-6 shadow-2xl flex flex-col items-center text-center"
                >
                    <Typography variant="h4" weight="bold" className="mb-2 text-gray-900">
                        {title}
                    </Typography>

                    <div className="mb-6 text-gray-600 text-sm whitespace-pre-wrap">
                        {message}
                    </div>

                    <div className="flex w-full gap-3">
                        {showCancel && (
                            <button
                                onClick={onClose}
                                className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors"
                            >
                                {cancelLabel}
                            </button>
                        )}
                        <button
                            onClick={onConfirm}
                            className={`flex-1 py-3 rounded-xl font-bold text-sm text-white shadow-md transition-all active:scale-95 ${variant === 'danger' ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary-dark'
                                }`}
                        >
                            {confirmLabel}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
