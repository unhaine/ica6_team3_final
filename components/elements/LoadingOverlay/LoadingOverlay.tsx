import { Typography } from "@/components/elements";
import { Loader2 } from "lucide-react";

interface LoadingOverlayProps {
    message?: string;
    isVisible?: boolean;
}

export const LoadingOverlay = ({ message = "로딩 중...", isVisible = true }: LoadingOverlayProps) => {
    if (!isVisible) return null;
    
    return (
        <div className="absolute inset-0 z-30 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center space-y-4">
            <div className="relative">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
            </div>
            <Typography weight="bold" className="text-white">
                {message}
            </Typography>
        </div>
    );
};
