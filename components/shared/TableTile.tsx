'use client';

import React, { useState } from 'react';
import { Table } from '@/lib/seed';
import { TableStatusBadge } from './TableStatusBadge';
import { TimerDisplay } from './TimerDisplay';
import { PriceTag } from './PriceTag';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Play, Plus, CalendarPlus, AlertCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface TableTileProps {
  table: Table;
  className?: string;
  onActionClick?: (action: string, table: Table) => void;
}

export function TableTile({ table, className }: TableTileProps) {
  const [isPinDialogOpen, setIsPinDialogOpen] = useState(false);
  const [pin, setPin] = useState('');

  const handleStartSessionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`PIN verified for ${table.name}. (Stage 1 feature: session start)`);
    setIsPinDialogOpen(false);
    setPin('');
  };

  return (
    <>
      <Card
        className={cn(
          'relative overflow-hidden transition-all duration-200 border-border/80 hover:border-brass/50 shadow-md',
          table.status === 'running' && 'ring-1 ring-brass/40 bg-charcoal-card',
          table.status === 'maintenance' && 'opacity-75 bg-muted/20',
          className
        )}
      >
        {/* Top Status Accent Bar */}
        <div
          className={cn(
            'h-1.5 w-full',
            table.status === 'free' && 'bg-[#2E9E6B]',
            table.status === 'booked' && 'bg-[#E0A526]',
            table.status === 'running' && 'bg-[#C9A24B]',
            table.status === 'maintenance' && 'bg-[#6B7280]'
          )}
        />

        <CardContent className="p-5 flex flex-col gap-4">
          {/* Header Row */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground px-2 py-0.5 rounded bg-muted/40 border border-border/40">
                  {table.type}
                </span>
                <PriceTag amount={table.hourlyRate} size="sm" />
              </div>
              <h3 className="font-display font-bold text-lg text-foreground mt-1 leading-tight">
                {table.name}
              </h3>
            </div>
            <TableStatusBadge status={table.status} />
          </div>

          {/* Session Timer & Information Display */}
          <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-background/50 border border-border/50 text-center gap-1 min-h-[96px]">
            {table.status === 'running' && table.currentSession ? (
              <>
                <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5 text-brass" /> Active Session (
                  {table.currentSession.customerName || 'Walk-in Guest'})
                </span>
                <TimerDisplay
                  seconds={table.currentSession.elapsedSeconds}
                  size="xl"
                  isRunning
                />
              </>
            ) : table.status === 'booked' ? (
              <>
                <span className="text-xs text-amber-500 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Booked Soon
                </span>
                <span className="font-sans text-sm font-semibold text-foreground">
                  {table.nextBookingTime || '18:00 Today'}
                </span>
              </>
            ) : table.status === 'maintenance' ? (
              <span className="text-sm font-medium text-stone italic">
                Under Repair / Maintenance
              </span>
            ) : (
              <>
                <span className="text-xs text-muted-foreground font-medium">
                  Ready for Guest
                </span>
                <TimerDisplay formattedTime="00:00:00" size="lg" className="text-muted-foreground/60" />
              </>
            )}
          </div>

          {/* Staff Control Buttons (Tablet Touch-Friendly 48px targets) */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <Button
              variant={table.status === 'running' ? 'secondary' : 'default'}
              className="h-12 text-xs md:text-sm font-semibold flex flex-col gap-0.5 items-center justify-center p-1"
              onClick={() => setIsPinDialogOpen(true)}
              disabled={table.status === 'maintenance'}
            >
              <Play className="w-4 h-4" />
              <span>{table.status === 'running' ? 'Manage' : 'Start'}</span>
            </Button>

            <Button
              variant="outline"
              className="h-12 text-xs md:text-sm flex flex-col gap-0.5 items-center justify-center p-1"
              onClick={() =>
                toast.info(`Time added to ${table.name} (Stage 1 functionality)`)
              }
              disabled={table.status !== 'running'}
            >
              <Plus className="w-4 h-4 text-brass" />
              <span>+ Time</span>
            </Button>

            <Button
              variant="outline"
              className="h-12 text-xs md:text-sm flex flex-col gap-0.5 items-center justify-center p-1"
              onClick={() =>
                toast.info(`Offline booking triggered for ${table.name} (Stage 3 feature)`)
              }
              disabled={table.status === 'maintenance'}
            >
              <CalendarPlus className="w-4 h-4 text-felt dark:text-emerald-400" />
              <span>Booking</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Start Session PIN Verification Modal */}
      <Dialog open={isPinDialogOpen} onOpenChange={setIsPinDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              Start Session - {table.name}
            </DialogTitle>
            <DialogDescription>
              Enter staff authorization 6-digit PIN to unlock table lights and start timer.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleStartSessionSubmit} className="space-y-4 py-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">
                Staff 6-Digit PIN
              </label>
              <Input
                type="password"
                maxLength={6}
                placeholder="• • • • • •"
                className="text-center text-2xl tracking-widest font-mono h-14"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                autoFocus
              />
              <span className="text-xs text-muted-foreground text-center">
                Demo PIN: any 6 digits (e.g., 123456)
              </span>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsPinDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="default">
                Confirm & Start
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
