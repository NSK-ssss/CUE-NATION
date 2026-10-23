import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TableStatus } from '@/lib/seed';
import { cn } from '@/lib/utils';

interface TableStatusBadgeProps {
  status: TableStatus;
  className?: string;
}

export function TableStatusBadge({ status, className }: TableStatusBadgeProps) {
  switch (status) {
    case 'free':
      return (
        <Badge
          className={cn(
            'bg-[#2E9E6B]/15 text-[#2E9E6B] border-[#2E9E6B]/30 font-medium px-2.5 py-0.5',
            className
          )}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#2E9E6B] mr-1.5 animate-pulse" />
          Free
        </Badge>
      );
    case 'booked':
      return (
        <Badge
          className={cn(
            'bg-[#E0A526]/15 text-[#E0A526] border-[#E0A526]/30 font-medium px-2.5 py-0.5',
            className
          )}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#E0A526] mr-1.5" />
          Booked
        </Badge>
      );
    case 'running':
      return (
        <Badge
          className={cn(
            'bg-[#C9A24B]/20 text-[#C9A24B] border-[#C9A24B]/40 font-semibold px-2.5 py-0.5 shadow-sm',
            className
          )}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#C9A24B] mr-1.5 animate-ping" />
          Running
        </Badge>
      );
    case 'maintenance':
      return (
        <Badge
          className={cn(
            'bg-[#6B7280]/15 text-[#6B7280] border-[#6B7280]/30 font-medium px-2.5 py-0.5',
            className
          )}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#6B7280] mr-1.5" />
          Maintenance
        </Badge>
      );
    default:
      return null;
  }
}
