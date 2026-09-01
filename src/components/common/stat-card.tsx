import React from "react";
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  icon?: LucideIcon;
  iconClassName?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  change,
  icon: Icon,
  iconClassName,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden border-border/60 transition-all hover:shadow-md", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {Icon && (
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
                iconClassName
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
          )}
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold tracking-tight text-foreground">{value}</div>
          {(subtitle || change) && (
            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
              {change && (
                <span className="font-medium text-emerald-600 dark:text-emerald-400">
                  {change}
                </span>
              )}
              {subtitle && <span>{subtitle}</span>}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
