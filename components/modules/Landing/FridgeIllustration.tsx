import Image from 'next/image';

interface FridgeIllustrationProps {
    isExpanded: boolean;
    hasAppeared: boolean;
    isWiggling: boolean;
}

export const FridgeIllustration = ({ isExpanded, hasAppeared, isWiggling }: FridgeIllustrationProps) => {
    return (
        <div className={`relative transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isExpanded ? 'w-32 h-32' : 'w-64 h-64'
            } ${hasAppeared ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
            <div className={`relative w-full h-full drop-shadow-2xl ${isWiggling ? 'animate-wiggle' : ''}`}>
                <Image
                    src="/keyvisual.png"
                    alt="Fridge Illustration"
                    fill
                    className="object-contain"
                    priority
                />
            </div>
        </div>
    );
};
