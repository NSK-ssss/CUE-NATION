import React from 'react';
import { cn } from '@/lib/utils';

interface PriceTagProps {
  amount: number;
  unit?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  currencySymbol?: string;
}

export function PriceTag({
  amount,
  unit = '/ hr',
  size = 'md',
  className,
  currencySymbol = '₹',
}: PriceTagProps) {
  return (
    <div
      className={cn(
        'inline-flex items-baseline font-sans font-bold tabular-nums text-brass',
        size === 'sm' && 'text-sm',
        size === 'md' && 'text-lg',
        size === 'lg' && 'text-2xl',
        className
      )}
    >
      <span>
        {currencySymbol}
        {amount}
      </span>
      {unit && (
        <span className="text-xs font-normal text-[#E5B869] ml-1">
          {unit}
        </span>
      )}
    </div>
  );
}
