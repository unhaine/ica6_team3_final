"use client";

import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { FridgeStatusCardProps } from "./FridgeStatusCard.type";
import { STYLES } from "./FridgeStatusCard.style";

/**
 * FridgeStatusCard Module
 * @description Dashboard widget showing fridge capacity and urgent alerts.
 */
export const FridgeStatusCard = ({
  fillPercentage,
  urgentItems = [],
  loading = false,
  className,
  ...props
}: FridgeStatusCardProps) => {
  // Animation for progress bar on mount
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    // Delay slightly to start animation after render
    const timer = setTimeout(() => {
        setAnimatedValue(fillPercentage);
    }, 100);
    return () => clearTimeout(timer);
  }, [fillPercentage]);

  if (loading) {
    return <StatusCardSkeleton className={className} />;
  }

  return (
    <Card className={cn(STYLES.container, className)} {...props}>
      <CardContent className="p-5">
        
        {/* Fill Rate Section */}
        <div className={STYLES.header}>
          <span className={STYLES.fillLabel}>냉장고 채움 상태</span>
          <span className={STYLES.percentText}>{fillPercentage}%</span>
        </div>
        
        <Progress value={animatedValue} className="h-3 bg-gray-100" />
        
        {/* Urgent Items Section */}
        {urgentItems.length > 0 && (
          <div className={STYLES.urgentSection}>
            <div className={STYLES.urgentTitle}>
              <AlertCircle className="w-3.5 h-3.5" />
              <span>3일 내 소비 권장</span>
            </div>
            <div className={STYLES.urgentList}>
              {urgentItems.map((item, index) => (
                <Badge 
                    key={index} 
                    variant="outline" 
                    className={STYLES.urgentBadge}
                >
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  );
};

const StatusCardSkeleton = ({ className }: { className?: string }) => (
    <Card className={cn(STYLES.container, className)}>
        <CardContent className="p-5">
             <div className="flex justify-between mb-2">
                 <Skeleton className="h-4 w-24" />
                 <Skeleton className="h-6 w-12" />
             </div>
             <Skeleton className="h-3 w-full rounded-full" />
             <div className="mt-4 pt-3 border-t border-gray-100">
                <Skeleton className="h-4 w-32 mb-2" />
                <div className="flex gap-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                </div>
             </div>
        </CardContent>
    </Card>
);
