import React from "react";
import { LoadingState } from "@/components/common/loading-state";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <LoadingState message="পৃষ্ঠা লোড হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন..." />
    </div>
  );
}
