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
                className="absolute top-6 left-6 z-10 p-2 bg-white/20 backdrop-blur-md rounded-full text-white"
                onClick={onClose}
            >
                <X className="w-6 h-6" />
            </button>

            <div className="flex-1 flex flex-col items-center justify-center space-y-8">
                <div className="w-64 h-64 border-2 border-dashed border-white/30 rounded-3xl flex items-center justify-center">
                    <Camera className="w-16 h-16 text-white/50" />
                </div>
                <div className="text-center space-y-2">
                    <Typography variant="h3" weight="bold" className="text-white">
                        냉장고 안을 찍어주세요!
                    </Typography>
                    <Typography variant="body2" className="text-white/60">
                        AI가 재료를 자동으로 찾아드릴게요.
                    </Typography>
                </div>
            </div>

            <div className="space-y-4">
                <label className="block">
                    <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={onImageChange}
                    />
                    <div className="w-full h-16 bg-white rounded-2xl flex items-center justify-center relative cursor-pointer active:scale-95 transition-transform">
                        <Upload className="absolute left-6 w-5 h-5 text-black" />
                        <span className="font-bold text-black text-lg">사진 업로드</span>
                    </div>
                </label>
                
                <button 
                    className="w-full h-16 rounded-2xl border border-white/30 text-white hover:bg-white/10 flex items-center justify-center relative cursor-pointer active:scale-95 transition-transform"
                    onClick={() => alert("카메라 기능은 모바일 브라우저에서 지원될 예정입니다. 사진 업로드를 이용해주세요.")}
                >
                    <Camera className="absolute left-6 w-5 h-5" />
                    <span className="font-bold text-lg">카메라 촬영</span>
                </button>
            </div>
        </motion.div>
    );
};
