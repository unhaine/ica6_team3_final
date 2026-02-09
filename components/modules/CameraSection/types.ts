export type Step = "capture" | "detect" | "confirm";

export interface DetectedItem {
    id: string;
    label: string;
    confidence: number;
    boundingBox: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    source?: string;
    isContainer?: boolean;
    quantity: number;
}
