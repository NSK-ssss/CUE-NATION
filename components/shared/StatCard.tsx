import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({
  label,
  value,
  trend,
  trendDirection = 'up',
  icon,
  className,
}: StatCardProps) {
  return (
    <Card className={cn('overflow-hidden border-border/70 hover:shadow-md transition-shadow', className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </span>
          {icon && (
            <div className="p-2 rounded-xl bg-brass/10 text-brass">
              {icon}
            </div>
          )}
        </div>

        <div className="mt-3 flex flex-col">
          <span className="font-sans text-2xl md:text-3xl font-extrabold tracking-tight tabular-nums text-foreground">
            {value}
          </span>

          {trend && (
            <div className="mt-2 flex items-center gap-1 text-xs font-medium">
              {trendDirection === 'up' && (
                <span className="flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="w-3.5 h-3.5" />
                  {trend}
                </span>
              )}
              {trendDirection === 'down' && (
                <span className="flex items-center gap-0.5 text-rose-600 dark:text-rose-400">
                  <TrendingDown className="w-3.5 h-3.5" />
                  {trend}
                </span>
              )}
              {trendDirection === 'neutral' && (
                <span className="flex items-center gap-0.5 text-stone">
                  <Minus className="w-3.5 h-3.5" />
                  {trend}
                </span>
              )}
              <span className="text-muted-foreground font-normal ml-1">vs last period</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
