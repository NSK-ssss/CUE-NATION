import React from 'react';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  hasAccent?: boolean;
  className?: string;
  titleClassName?: string;
}

export function SectionHeading({
  title,
  subtitle,
  align = 'left',
  hasAccent = true,
  className,
  titleClassName,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-1.5',
        align === 'center' && 'items-center text-center',
        align === 'right' && 'items-end text-right',
        align === 'left' && 'items-start text-left',
        className
      )}
    >
      <h2
        className={cn(
          'font-display text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-[#F5E6C8] via-[#E5B869] to-[#C8973D] bg-clip-text text-transparent drop-shadow-[0_2px_14px_rgba(229,184,105,0.35)]',
          titleClassName
        )}
      >
        {title}
      </h2>
      {hasAccent && (
        <div className="h-1 w-16 bg-brass rounded-full my-1.5 shadow-sm" />
      )}
      {subtitle && (
        <p className="text-sm md:text-base text-[#E5B869] font-medium max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}
