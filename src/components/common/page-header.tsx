import React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  heading: string;
  subheading?: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  heading,
  subheading,
  children,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 md:flex-row md:items-center md:justify-between pb-6 border-b border-border/40",
        className
      )}
    >
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl font-bengali">
          {heading}
        </h1>
        {subheading && (
          <p className="text-sm text-muted-foreground font-bengali">
            {subheading}
          </p>
        )}
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </div>
  );
}
