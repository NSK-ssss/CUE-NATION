'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Table, TableType, SEED_TABLES } from '@/lib/seed';
import {
  getAvailableDates,
  getTableSlotAvailability,
  getVenueAvailabilitySummary,
  TableSlot,
} from '@/lib/tableAvailability';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { PriceTag } from '@/components/shared/PriceTag';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Sparkles,
  Clock,
  AlertCircle,
  Wrench,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function OurTablesSection() {
  const router = useRouter();
  const carouselRef = useRef<HTMLDivElement>(null);

  // Date selection state
  const availableDates = getAvailableDates(7);
  const [selectedDate, setSelectedDate] = useState<string>(availableDates[0].dateStr);

  // Filter state: 'all' | 'pool' | 'snooker'
  const [filterType, setFilterType] = useState<'all' | TableType>('all');

  // Selected slot per table: { [tableId]: slotTime }
  const [selectedSlotsByTable, setSelectedSlotsByTable] = useState<Record<string, string>>({});

  // Active slide index for pagination dots & scroll detection
  const [activeSlide, setActiveSlide] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Filtered tables list
  const filteredTables = SEED_TABLES.filter((t) => {
    if (filterType === 'all') return true;
    return t.type === filterType;
  });

  // Calculate venue-wide availability for the selected date
  const availabilitySummary = getVenueAvailabilitySummary(SEED_TABLES, selectedDate);
  const selectedDateObj = availableDates.find((d) => d.dateStr === selectedDate) || availableDates[0];

  // Carousel scroll listeners to update arrow states
  const checkScrollBounds = () => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    // Approximate slide index based on card width
    const cardWidth = clientWidth > 900 ? clientWidth / 3 : clientWidth > 600 ? clientWidth / 2 : clientWidth * 0.85;
    const index = Math.round(scrollLeft / cardWidth);
    setActiveSlide(Math.min(index, filteredTables.length - 1));
  };

  useEffect(() => {
    const el = carouselRef.current;
    if (el) {
      el.addEventListener('scroll', checkScrollBounds, { passive: true });
      checkScrollBounds();
      return () => el.removeEventListener('scroll', checkScrollBounds);
    }
  }, [filterType, filteredTables.length]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const scrollAmount = container.clientWidth * 0.75;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const handleSelectSlot = (tableId: string, slotTime: string) => {
    setSelectedSlotsByTable((prev) => ({
      ...prev,
      [tableId]: prev[tableId] === slotTime ? '' : slotTime,
    }));
  };

  const handleBookTable = (table: Table) => {
    const chosenSlot = selectedSlotsByTable[table.id];
    let query = `/book?tableId=${encodeURIComponent(table.id)}&type=${encodeURIComponent(table.type)}&date=${encodeURIComponent(selectedDate)}`;
    if (chosenSlot) {
      query += `&slot=${encodeURIComponent(chosenSlot)}`;
    }
    router.push(query);
  };

  return (
    <section id="tables" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-24">
      {/* 1. SECTION HEADER (Playfair Display, Forest Green & Brass Gold) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <div className="space-y-2">
          {/* Eyebrow with Sparkle */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-brass bg-brass/10 px-2.5 py-1 rounded-md border border-brass/25">
              <Sparkles className="w-3.5 h-3.5 inline mr-1 text-brass" />
              PLAY YOUR GAME
            </span>

            {/* Availability Indicator */}
            <Badge
              variant="outline"
              className="bg-[#2E9E6B]/15 text-[#2E9E6B] border-[#2E9E6B]/30 font-sans text-xs font-semibold px-2.5 py-1 flex items-center gap-1.5 shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-[#2E9E6B] animate-pulse" />
              {availabilitySummary.availableTablesCount} of {availabilitySummary.totalTables} Tables Available {selectedDateObj.displayLabel}
            </Badge>
          </div>

          {/* Main Heading in Metallic Gold */}
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-r from-[#F5E6C8] via-[#E5B869] to-[#C8973D] bg-clip-text text-transparent drop-shadow-[0_2px_14px_rgba(229,184,105,0.35)]">
            Our Tables
          </h2>

          {/* Subtitle */}
          <p className="font-sans text-sm sm:text-base text-[#E5B869] max-w-xl leading-relaxed font-medium">
            Choose your table. Make your move. Real-time availability for tournament pool and Riley 12ft snooker.
          </p>
        </div>

        {/* Carousel Desktop Navigation Arrows */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            aria-label="Previous tables"
            className="rounded-full w-11 h-11 border-border/80 hover:border-brass hover:text-brass bg-white dark:bg-card shadow-sm disabled:opacity-30 transition-all"
          >
            <ChevronLeft className="w-5 h-5 text-[#E5B869]" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            aria-label="Next tables"
            className="rounded-full w-11 h-11 border-border/80 hover:border-brass hover:text-brass bg-white dark:bg-card shadow-sm disabled:opacity-30 transition-all"
          >
            <ChevronRight className="w-5 h-5 text-[#E5B869]" />
          </Button>
        </div>
      </div>

      {/* 2. CONTROLS BAR: DATE SELECTION & TABLE TYPE FILTER */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-3.5 bg-white/70 dark:bg-card/70 backdrop-blur-md rounded-2xl border border-border/80 shadow-sm">
        {/* Date Selection Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 lg:pb-0 no-scrollbar">
          <div className="flex items-center text-xs font-semibold text-[#E5B869] uppercase tracking-wider pl-1 pr-2 shrink-0">
            <CalendarIcon className="w-4 h-4 mr-1.5 text-brass" /> Date:
          </div>

          {availableDates.map((d) => {
            const isSelected = d.dateStr === selectedDate;
            return (
              <button
                key={d.dateStr}
                onClick={() => setSelectedDate(d.dateStr)}
                className={cn(
                  'px-3.5 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all flex flex-col items-center min-w-[70px] border',
                  isSelected
                    ? 'bg-[#0F3D2E] text-white border-brass shadow-md scale-[1.02]'
                    : 'bg-white dark:bg-card text-[#E5B869] hover:text-[#12100E] dark:hover:text-white border-border/70 hover:border-brass/40'
                )}
              >
                <span className={cn('text-[10px] uppercase font-mono', isSelected ? 'text-brass font-bold' : 'text-[#E5B869]')}>
                  {d.displayLabel === 'Today' || d.displayLabel === 'Tomorrow' ? d.displayLabel : d.dayName}
                </span>
                <span className="text-sm font-bold font-sans mt-0.5 text-foreground">{d.dayNumber}</span>
              </button>
            );
          })}
        </div>

        {/* Table Type Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-muted/50 p-1 rounded-xl shrink-0 self-start lg:self-center">
          <button
            onClick={() => setFilterType('all')}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
              filterType === 'all'
                ? 'bg-white dark:bg-card text-[#0F3D2E] dark:text-brass shadow-sm font-bold'
                : 'text-[#E5B869] hover:text-foreground'
            )}
          >
            All Tables ({SEED_TABLES.length})
          </button>
          <button
            onClick={() => setFilterType('pool')}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
              filterType === 'pool'
                ? 'bg-white dark:bg-card text-[#0F3D2E] dark:text-brass shadow-sm font-bold'
                : 'text-[#E5B869] hover:text-foreground'
            )}
          >
            Pool (4)
          </button>
          <button
            onClick={() => setFilterType('snooker')}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
              filterType === 'snooker'
                ? 'bg-white dark:bg-card text-[#0F3D2E] dark:text-brass shadow-sm font-bold'
                : 'text-[#E5B869] hover:text-foreground'
            )}
          >
            Snooker (2)
          </button>
        </div>
      </div>

      {/* 3. TABLE CAROUSEL CONTAINER (Responsive: 1 mobile, ~2 tablet, 3 desktop) */}
      <div
        ref={carouselRef}
        className="flex gap-6 overflow-x-auto pb-6 pt-2 scroll-smooth snap-x snap-mandatory no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0"
      >
        {filteredTables.map((table) => {
          const { slots, availableCount, isFullyBooked, isMaintenance, effectiveStatus } =
            getTableSlotAvailability(table, selectedDate);
          const chosenSlot = selectedSlotsByTable[table.id];

          return (
            <div
              key={table.id}
              className="snap-start shrink-0 w-[86vw] max-w-[340px] sm:max-w-none sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] flex"
            >
              <Card className="w-full border-border/80 hover:border-brass/50 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden group bg-white dark:bg-card hover:-translate-y-1.5">
                {/* A. TABLE IMAGE HEADER WITH BADGES & OVERLAY */}
                <div className="relative h-52 sm:h-56 w-full bg-felt-dark overflow-hidden flex items-center justify-center shrink-0">
                  <div
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700 opacity-90"
                    style={{
                      backgroundImage: `url(${table.imageUrl || '/images/billiards-lounge-bg.jpg'})`,
                    }}
                  />
                  {/* Subtle Gradient for Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/95 via-charcoal/40 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                    <Badge
                      variant="outline"
                      className="px-2.5 py-0.5 text-[11px] font-mono uppercase bg-charcoal/70 text-ivory border-white/20 backdrop-blur-md"
                    >
                      {table.type === 'pool' ? '8-Ball Pool' : '12ft Snooker'}
                    </Badge>

                    {/* Status Badge */}
                    {isMaintenance ? (
                      <Badge className="bg-[#6B7280]/90 text-white font-medium text-[11px] px-2.5 py-0.5 flex items-center gap-1 shadow-sm">
                        <Wrench className="w-3 h-3 mr-0.5" /> Maintenance
                      </Badge>
                    ) : isFullyBooked ? (
                      <Badge className="bg-[#E0A526] text-charcoal font-bold text-[11px] px-2.5 py-0.5 flex items-center gap-1 shadow-sm">
                        Booked Out
                      </Badge>
                    ) : effectiveStatus === 'running' ? (
                      <Badge className="bg-[#C9A24B] text-charcoal font-bold text-[11px] px-2.5 py-0.5 flex items-center gap-1 shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-charcoal animate-ping" /> Live Session
                      </Badge>
                    ) : (
                      <Badge className="bg-[#2E9E6B] text-white font-semibold text-[11px] px-2.5 py-0.5 flex items-center gap-1 shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Available
                      </Badge>
                    )}
                  </div>

                  {/* Bottom Title on Image */}
                  <div className="absolute bottom-3 left-4 right-4 z-10 text-white space-y-0.5">
                    <h3 className="font-display font-bold text-xl sm:text-2xl text-white tracking-tight drop-shadow-md">
                      {table.name}
                    </h3>
                    <p className="text-xs text-brass font-medium flex items-center gap-1">
                      {table.subtitle || (table.type === 'pool' ? 'Championship Slate' : 'Official Tournament')}
                    </p>
                  </div>
                </div>

                {/* B. CARD CONTENT */}
                <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  {/* Price & Specs Header */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-border/60 pb-3">
                      <div>
                        <span className="text-[11px] font-semibold text-[#E5B869] uppercase tracking-wider block">
                          Hourly Rate
                        </span>
                        <PriceTag amount={table.hourlyRate} unit="/ hr" size="lg" />
                      </div>

                      <div className="text-right">
                        <span className="text-[11px] font-semibold text-[#E5B869] uppercase tracking-wider block">
                          Availability
                        </span>
                        <span
                          className={cn(
                            'text-xs font-bold font-mono',
                            availableCount > 0 ? 'text-[#2E9E6B]' : 'text-[#E5B869]'
                          )}
                        >
                          {availableCount > 0 ? `${availableCount} slots open` : '0 slots open'}
                        </span>
                      </div>
                    </div>

                    {/* Table Description / Specs */}
                    {table.description && (
                      <p className="text-xs text-[#E5B869] line-clamp-2 leading-relaxed font-medium">
                        {table.description}
                      </p>
                    )}

                    {/* Table Feature Tags */}
                    {table.specs && (
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {table.specs.map((spec, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-muted/60 text-[10px] font-medium text-[#E5B869] border border-[#E5B869]/30"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* C. AVAILABLE TIME SLOTS (DERIVED FROM SELECTED DATE) */}
                  <div className="space-y-2 pt-2 border-t border-border/50">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-foreground flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-brass" />
                        Slots for {selectedDateObj.displayLabel}:
                      </span>
                      {chosenSlot && (
                        <span className="text-[11px] text-brass font-bold">
                          Selected: {chosenSlot.split(' - ')[0]}
                        </span>
                      )}
                    </div>

                    {/* Empty State: If maintenance or 0 slots */}
                    {isMaintenance ? (
                      <div className="p-3 rounded-xl bg-muted/40 border border-border/60 text-center space-y-1">
                        <Wrench className="w-4 h-4 text-[#E5B869] mx-auto" />
                        <p className="text-xs font-semibold text-[#E5B869]">Table under scheduled maintenance</p>
                        <p className="text-[11px] text-[#E5B869]/90">Cloth re-felting &amp; laser calibration in progress</p>
                      </div>
                    ) : isFullyBooked ? (
                      <div className="p-3 rounded-xl bg-[#E0A526]/10 border border-[#E0A526]/30 text-center space-y-1">
                        <AlertCircle className="w-4 h-4 text-[#E0A526] mx-auto" />
                        <p className="text-xs font-semibold text-foreground">No available slots for this date</p>
                        <p className="text-[11px] text-[#E5B869]">Please pick another date above or select a different table</p>
                      </div>
                    ) : (
                      /* Slot Pills Grid */
                      <div className="grid grid-cols-2 gap-1.5">
                        {slots.slice(0, 6).map((slot) => {
                          const isSelected = chosenSlot === slot.time;

                          if (slot.isBooked) {
                            return (
                              <div
                                key={slot.id}
                                title={slot.bookedBy ? `Booked by ${slot.bookedBy}` : 'Booked'}
                                className="px-2 py-1.5 rounded-lg text-[11px] font-medium border border-border/40 bg-muted/40 text-stone/40 line-through text-center cursor-not-allowed select-none"
                              >
                                {slot.shortTime} (Booked)
                              </div>
                            );
                          }

                          return (
                            <button
                              key={slot.id}
                              type="button"
                              onClick={() => handleSelectSlot(table.id, slot.time)}
                              className={cn(
                                'px-2 py-1.5 rounded-lg text-[11px] font-semibold border transition-all text-center',
                                isSelected
                                  ? 'bg-[#0F3D2E] text-white border-brass shadow-sm'
                                  : 'bg-white dark:bg-card text-foreground border-border hover:border-brass/70 hover:bg-brass/5'
                              )}
                            >
                              {slot.shortTime}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* D. ACTION: BOOK TABLE BUTTON */}
                  <div className="pt-2">
                    <Button
                      variant="default"
                      onClick={() => handleBookTable(table)}
                      disabled={isMaintenance || isFullyBooked}
                      className={cn(
                        'w-full h-11 font-bold text-sm shadow-md transition-all',
                        isMaintenance || isFullyBooked
                          ? 'opacity-50 cursor-not-allowed bg-stone/20 text-stone'
                          : 'bg-brass text-charcoal hover:bg-brass-dark hover:scale-[1.01]'
                      )}
                    >
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {isMaintenance
                        ? 'Under Maintenance'
                        : isFullyBooked
                        ? 'Fully Booked for Date'
                        : chosenSlot
                        ? `Book Table (${chosenSlot.split(' - ')[0]})`
                        : `Book ${table.name}`}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      {/* 4. CAROUSEL INDICATOR DOTS */}
      <div className="flex justify-center items-center gap-2 pt-2">
        {filteredTables.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              if (carouselRef.current) {
                const container = carouselRef.current;
                const cardWidth = container.clientWidth > 900 ? container.clientWidth / 3 : container.clientWidth * 0.85;
                container.scrollTo({ left: i * cardWidth, behavior: 'smooth' });
                setActiveSlide(i);
              }
            }}
            className={cn(
              'h-2.5 rounded-full transition-all duration-300',
              activeSlide === i ? 'w-8 bg-brass shadow-sm' : 'w-2.5 bg-border hover:bg-brass/50'
            )}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
