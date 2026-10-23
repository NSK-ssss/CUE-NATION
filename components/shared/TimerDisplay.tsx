import React from 'react';
import { cn } from '@/lib/utils';

interface TimerDisplayProps {
  seconds?: number;
  formattedTime?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  isRunning?: boolean;
}

export function TimerDisplay({
  seconds = 0,
  formattedTime,
  size = 'md',
  className,
  isRunning = false,
}: TimerDisplayProps) {
  // Format seconds into HH:MM:SS if not explicitly provided
  const timeString = React.useMemo(() => {
    if (formattedTime) return formattedTime;
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return [hours, mins, secs]
      .map((v) => String(v).padStart(2, '0'))
      .join(':');
  }, [seconds, formattedTime]);

  return (
    <div
      className={cn(
        'font-mono font-bold tracking-tight tabular-nums select-none inline-flex items-center gap-1',
        size === 'sm' && 'text-sm font-semibold',
        size === 'md' && 'text-lg md:text-xl',
        size === 'lg' && 'text-2xl md:text-3xl text-brass',
        size === 'xl' && 'text-4xl md:text-5xl text-brass',
        isRunning && 'animate-pulse text-brass',
        className
      )}
    >
      <span>{timeString}</span>
    </div>
  );
}
