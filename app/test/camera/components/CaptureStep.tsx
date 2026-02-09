import { Typography } from "@/components/elements";
import { Camera, Upload, X } from "lucide-react";
import { motion } from "framer-motion";

interface CaptureStepProps {
    onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClose: () => void;
}

export const CaptureStep = ({ onImageChange, onClose }: CaptureStepProps) => {
    return (
        <motion.div 
            key="capture"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col justify-between p-6 relative"
        >
            <button 
                className="absolute top-6 left-6 z-10 p-2 bg-black/20 backdrop-blur-md rounded-full text-white"
                onClick={onClose}
            >
                <X className="w-6 h-6" />
            </button>

            <div className="flex-1 flex flex-col items-center justify-center space-y-8 relative z-0">
                <div className="w-full max-w-sm aspect-3/4 border-2 border-white/20 rounded-3xl relative overflow-hidden">
                    <div className="absolute inset-0 border-[3px] border-white/40 rounded-3xl" />
                    <div className="absolute top-0 left-0 right-0 h-32 bg-linear-to-b from-black/50 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-black/50 to-transparent" />
                    
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 space-y-4">
                        <Typography variant="h3" weight="bold" className="text-white drop-shadow-md">
                            영수증 또는 냉장고 내부가<br/>잘 보이게 촬영해주세요
                        </Typography>
                        <Typography variant="body2" className="text-white/80 drop-shadow-md">
                            문을 활짝 열고<br/>전체가 보이게 찍으면 더 정확해요
                        </Typography>
                    </div>
                </div>
            </div>

            <div className="w-full px-6 pb-8 pt-4 flex items-center justify-between relative z-10">
                <button className="p-3 rounded-full bg-white/10 backdrop-blur-md text-white/50">
                    <div className="w-6 h-6" /> {/* Placeholder for gallery/flash if needed later */}
                </button>

                <label className="group relative flex items-center justify-center cursor-pointer">
                    <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={onImageChange}
                        capture="environment"
                    />
                    {/* Outer Ring */}
                    <div className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center transition-transform group-active:scale-95">
                        {/* Inner Button */}
                        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                            <Camera className="w-8 h-8 text-black" />
                        </div>
                    </div>
                </label>

                <button className="p-3 rounded-full bg-white/10 backdrop-blur-md text-white">
                    <div className="w-6 h-6 bg-white/20 rounded bg-cover bg-center" /> {/* Placeholder for gallery preview */}
                </button>
            </div>
        </motion.div>
    );
};
