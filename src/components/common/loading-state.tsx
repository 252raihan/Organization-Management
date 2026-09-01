import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({
  message = "লোড হচ্ছে...",
  className,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[250px] flex-col items-center justify-center gap-3 p-8 text-center",
        className
      )}
    >
      <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      <p className="text-sm font-medium text-muted-foreground font-bengali">
        {message}
      </p>
    </div>
  );
}
