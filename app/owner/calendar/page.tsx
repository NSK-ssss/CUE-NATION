'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function OwnerCalendarPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground">
            Master Booking Calendar
          </h1>
          <p className="text-xs text-stone mt-1">
            Visual day/week timeline for all 6 pool and snooker tables.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => toast.info('Previous Month')}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="font-display font-bold text-base px-2">October 2026</span>
          <Button variant="outline" size="sm" onClick={() => toast.info('Next Month')}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Card className="border-border/80 bg-white">
        <CardContent className="p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-brass/10 text-brass mx-auto flex items-center justify-center">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-xl">Full Interactive Calendar Grid</h3>
          <p className="text-xs text-stone max-w-md mx-auto">
            Drag-and-drop booking slots, tournament blackout dates, and staff shift assignments shell.
          </p>
          <Badge variant="brass" className="uppercase text-[10px]">
            Stage 3 Calendar Integration
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
}
