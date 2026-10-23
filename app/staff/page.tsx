'use client';

import React from 'react';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { TableTile } from '@/components/shared/TableTile';
import { SEED_TABLES } from '@/lib/seed';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, RefreshCw, Filter } from 'lucide-react';
import { toast } from 'sonner';

export default function StaffFloorPage() {
  const freeCount = SEED_TABLES.filter((t) => t.status === 'free').length;
  const runningCount = SEED_TABLES.filter((t) => t.status === 'running').length;
  const bookedCount = SEED_TABLES.filter((t) => t.status === 'booked').length;

  return (
    <div className="space-y-6">
      {/* Top Controls & Status Metric Summary Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-white">
            Billiards &amp; Snooker Floor Grid
          </h1>
          <p className="text-xs text-stone mt-1">
            Real-time table status monitoring and session trigger actions.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 py-1 px-3">
            Free: {freeCount}
          </Badge>
          <Badge variant="outline" className="border-yellow-500/30 text-yellow-400 py-1 px-3">
            Running: {runningCount}
          </Badge>
          <Badge variant="outline" className="border-amber-500/30 text-amber-400 py-1 px-3">
            Booked: {bookedCount}
          </Badge>

          <Button
            variant="default"
            size="sm"
            onClick={() => toast.info('Add Walk-in Booking Modal (Stage 3 Integration)')}
            className="ml-2 font-bold h-10"
          >
            <PlusCircle className="w-4 h-4 mr-1.5" /> Walk-in Booking
          </Button>
        </div>
      </div>

      {/* 6 Table Tiles Grid (Tablet Friendly Layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SEED_TABLES.map((table) => (
          <TableTile key={table.id} table={table} />
        ))}
      </div>
    </div>
  );
}
