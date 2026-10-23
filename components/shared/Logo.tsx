import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  href?: string;
  variant?: 'light' | 'dark' | 'brass';
  showSubtitle?: boolean;
}

export function Logo({
  className,
  href = '/',
  variant = 'light',
  showSubtitle = false,
}: LogoProps) {
  const content = (
    <div className={cn('flex items-center gap-2.5 select-none group', className)}>
      {/* 8-Ball Gold Icon */}
      <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-felt border-2 border-brass shadow-md group-hover:scale-105 transition-transform">
        <span className="text-brass font-bold text-xs tracking-tighter">8</span>
        {/* Subtle cue highlight stick */}
        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-brass rounded-full border border-felt" />
      </div>

      <div className="flex flex-col">
        <span
          className={cn(
            'font-display font-black text-xl tracking-wider uppercase leading-none',
            variant === 'dark' && 'text-foreground',
            variant === 'light' && 'text-felt dark:text-ivory',
            variant === 'brass' && 'text-brass'
          )}
        >
          CUE <span className="text-brass font-normal">NATION</span>
        </span>
        {showSubtitle && (
          <span
            className="text-[10px] tracking-widest uppercase font-outfit font-medium text-[#E5B869]"
          >
            Billiards & Café
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
