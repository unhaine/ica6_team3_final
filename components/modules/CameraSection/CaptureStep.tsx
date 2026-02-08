import { Typography } from "@/components/elements";
import { Camera, Image as ImageIcon, Zap } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { CameraHeader } from "./CameraHeader";

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
            className="flex-1 flex flex-col relative bg-linear-to-b from-purple-900/40 via-black to-purple-900/40"
        >
            {/* Header */}
            <CameraHeader onClose={onClose} onBack={onClose} />

            {/* Instruction Text */}
            <div className="text-center space-y-2 px-6 pb-2 pt-2 z-20">
                <Typography variant="h3" weight="bold" className="text-white drop-shadow-lg text-xl leading-tight">
                    영수증 또는 냉장고 내부가<br/>잘 보이게 촬영해주세요
                </Typography>
            </div>

            {/* Viewfinder Area */}
            <div className="flex-1 w-full px-4 flex items-center justify-center relative z-10">
                <div className="w-full aspect-2/3 relative rounded-[32px] overflow-hidden border-2 border-white/20 shadow-2xl">
                    <Image
                        src="/fridge/fridge.png"
                        alt="Camera Viewfinder"
                        fill
                        className="object-cover"
                    />
                    {/* Viewfinder Overlays */}
                    <div className="absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-black/20" />
                </div>
            </div>

            {/* Instruction Text */}
            <div className="text-center space-y-2 px-6 pb-2 pt-2 z-20">
                <Typography variant="body2" className="text-white/70 text-sm">
                    전체가 보이게 찍으면 더 정확해요
                </Typography>
            </div>

            {/* Bottom Controls */}
            <div className="w-full px-8 pb-12 pt-2 flex items-center justify-between z-20">
                <button className="p-3 text-white/50 hover:text-white transition-colors">
                    <Zap className="w-6 h-6 fill-current" />
                </button>

                <label className="group relative flex items-center justify-center cursor-pointer">
                    <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={onImageChange}
                        capture="environment"
                    />
                    {/* Shutter Button Ring */}
                    <div className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center transition-transform group-active:scale-95">
                        {/* Inner Button */}
                        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                            <Camera className="w-8 h-8 text-black" />
                        </div>
                    </div>
                </label>

                <button className="p-3 text-white/50 hover:text-white transition-colors">
                    <ImageIcon className="w-6 h-6" />
                </button>
            </div>
            
            {/* Background Effects */}
            <div className="absolute inset-0 z-0 bg-black/60 backdrop-blur-3xl" />
        </motion.div>
    );
};
