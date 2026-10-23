'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { PriceTag } from '@/components/shared/PriceTag';
import { TableStatusBadge } from '@/components/shared/TableStatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Logo } from '@/components/shared/Logo';
import { SEED_TABLES, SEED_PRICING, TableType, Table } from '@/lib/seed';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { toPng } from 'html-to-image';
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  Copy,
  Download,
  ShieldCheck,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';

// Generate next 14 days for date picker
function getAvailableDates() {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const d = new Date();
    d.setDate(today.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const displayLabel = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    dates.push({ dateStr, displayLabel, dayName: d.toLocaleDateString('en-US', { weekday: 'short' }) });
  }
  return dates;
}

function BookContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedType = searchParams.get('type') as TableType | null;

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedType, setSelectedType] = useState<TableType>(preselectedType || 'pool');
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  const availableDates = getAvailableDates();
  const [selectedDate, setSelectedDate] = useState(availableDates[0].dateStr);

  // Time Slots (10:00 AM to 11:00 PM hourly)
  const HOURLY_SLOTS = [
    { start: '10:00', end: '11:00', label: '10:00 AM - 11:00 AM', isPeak: false },
    { start: '11:00', end: '12:00', label: '11:00 AM - 12:00 PM', isPeak: false },
    { start: '12:00', end: '13:00', label: '12:00 PM - 01:00 PM', isPeak: false },
    { start: '13:00', end: '14:00', label: '01:00 PM - 02:00 PM', isPeak: false },
    { start: '14:00', end: '15:00', label: '02:00 PM - 03:00 PM', isPeak: false },
    { start: '15:00', end: '16:00', label: '03:00 PM - 04:00 PM', isPeak: false },
    { start: '16:00', end: '17:00', label: '04:00 PM - 05:00 PM', isPeak: false },
    { start: '17:00', end: '18:00', label: '05:00 PM - 06:00 PM', isPeak: true },
    { start: '18:00', end: '19:00', label: '06:00 PM - 07:00 PM', isPeak: true },
    { start: '19:00', end: '20:00', label: '07:00 PM - 08:00 PM', isPeak: true },
    { start: '20:00', end: '21:00', label: '08:00 PM - 09:00 PM', isPeak: true },
    { start: '21:00', end: '22:00', label: '09:00 PM - 10:00 PM', isPeak: true },
    { start: '22:00', end: '23:00', label: '10:00 PM - 11:00 PM', isPeak: true },
  ];

  const [selectedSlots, setSelectedSlots] = useState<typeof HOURLY_SLOTS>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>(['18:00', '19:00']);

  // Details
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Confirmed booking state
  const [confirmedBooking, setConfirmedBooking] = useState<{
    id: string;
    bookingCode: string;
    pin: string;
    tableName: string;
    date: string;
    slotLabel: string;
    amount: number;
  } | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Read logged in user profile cookies if available
    const getCookie = (name: string) => {
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      return match ? decodeURIComponent(match[2]) : null;
    };

    const name = getCookie('cue_user_name');
    if (name) setCustomerName(name);

    // Set initial table based on preselected tableId or preselected type
    const tableIdParam = searchParams.get('tableId') || searchParams.get('table');
    if (tableIdParam) {
      const match = SEED_TABLES.find((t) => t.id === tableIdParam);
      if (match) {
        setSelectedTable(match);
        setSelectedType(match.type);
      } else {
        const matchingTables = SEED_TABLES.filter((t) => t.type === (preselectedType || 'pool'));
        if (matchingTables.length > 0) setSelectedTable(matchingTables[0]);
      }
    } else {
      const matchingTables = SEED_TABLES.filter((t) => t.type === (preselectedType || 'pool'));
      if (matchingTables.length > 0) {
        setSelectedTable(matchingTables[0]);
      }
    }

    const dateParam = searchParams.get('date');
    if (dateParam && availableDates.some((d) => d.dateStr === dateParam)) {
      setSelectedDate(dateParam);
    }
  }, [preselectedType, searchParams]);

  const handleSelectTableType = (type: TableType) => {
    setSelectedType(type);
    const matching = SEED_TABLES.filter((t) => t.type === type);
    if (matching.length > 0) setSelectedTable(matching[0]);
  };

  const handleToggleSlot = (slot: typeof HOURLY_SLOTS[0]) => {
    if (bookedSlots.includes(slot.start)) return;

    if (selectedSlots.find((s) => s.start === slot.start)) {
      setSelectedSlots(selectedSlots.filter((s) => s.start !== slot.start));
    } else {
      setSelectedSlots([...selectedSlots, slot].sort((a, b) => a.start.localeCompare(b.start)));
    }
  };

  // Calculate pricing
  const baseRate = selectedTable ? selectedTable.hourlyRate : 300;
  const totalPrice = selectedSlots.reduce((sum, slot) => {
    const rate = slot.isPeak ? baseRate * 1.25 : baseRate;
    return sum + rate;
  }, 0);

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTable || selectedSlots.length === 0) {
      toast.error('Missing Selection', { description: 'Please choose a table and at least one time slot.' });
      return;
    }

    // Check login state
    const roleCookie = document.cookie.match(new RegExp('(^| )cue_user_role=([^;]+)'));
    if (!roleCookie) {
      toast.error('Login Required', { description: 'Please sign in to complete your table reservation.' });
      router.push(`/login?from=/book`);
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingCode = 'CN-' + Math.random().toString(36).substring(2, 7).toUpperCase();
      const pin = Math.floor(100000 + Math.random() * 900000).toString();
      const slotLabel = `${selectedSlots[0].start} - ${selectedSlots[selectedSlots.length - 1].end}`;

      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.rpc('create_booking_atomic', {
          p_user_id: null,
          p_table_id: selectedTable.id,
          p_date: selectedDate,
          p_slot_start: selectedSlots[0].start + ':00',
          p_slot_end: selectedSlots[selectedSlots.length - 1].end + ':00',
          p_customer_name: customerName,
          p_customer_phone: customerPhone,
          p_amount: totalPrice,
          p_booking_code: bookingCode,
          p_pin: pin,
        });

        if (error || (data && !data.success)) {
          toast.error('Booking Failed', {
            description: data?.message || error?.message || 'Slot already booked. Please choose another slot.',
          });
          setStep(2);
          setIsSubmitting(false);
          return;
        }
      }

      const newBooking = {
        id: 'bk_' + Math.random().toString(36).substring(2, 9),
        bookingCode,
        pin,
        tableName: selectedTable.name,
        date: selectedDate,
        slotLabel,
        amount: totalPrice,
      };

      setConfirmedBooking(newBooking);
      setStep(4);
      toast.success('Reservation Confirmed!', { description: `Booking Code: ${bookingCode}` });
    } catch (err) {
      toast.error('Booking Error', { description: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${label}`, { description: text });
  };

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true });
      const link = document.createElement('a');
      link.download = `cue-nation-booking-${confirmedBooking?.bookingCode || 'card'}.png`;
      link.href = dataUrl;
      link.click();
      toast.success('Confirmation Card Downloaded!');
    } catch (err) {
      toast.error('Failed to download image card');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 pb-32">
      {step < 4 && (
        <>
          <SectionHeading
            title="Reserve a Table Online"
            subtitle="Pick your cue sport, date, time slots, and confirm your instant venue access PIN."
          />

          {/* Stepper Header */}
          <div className="grid grid-cols-3 gap-2 border-b border-border pb-4">
            <div className={`flex items-center gap-2 font-bold text-xs sm:text-sm ${step >= 1 ? 'text-brass' : 'text-muted-foreground'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs ${step >= 1 ? 'bg-brass text-charcoal' : 'bg-muted'}`}>
                1
              </div>
              <span>1. Table</span>
            </div>

            <div className={`flex items-center gap-2 font-bold text-xs sm:text-sm ${step >= 2 ? 'text-brass' : 'text-muted-foreground'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs ${step >= 2 ? 'bg-brass text-charcoal' : 'bg-muted'}`}>
                2
              </div>
              <span>2. Date &amp; Slots</span>
            </div>

            <div className={`flex items-center gap-2 font-bold text-xs sm:text-sm ${step >= 3 ? 'text-brass' : 'text-muted-foreground'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs ${step >= 3 ? 'bg-brass text-charcoal' : 'bg-muted'}`}>
                3
              </div>
              <span>3. Confirm</span>
            </div>
          </div>
        </>
      )}

      {/* STEP 1: CHOOSE TABLE TYPE & SPECIFIC TABLE */}
      {step === 1 && (
        <div className="space-y-8">
          <div className="space-y-3">
            <h3 className="font-display font-bold text-xl">Select Sport Type</h3>
            <div className="grid grid-cols-2 gap-4">
              <Card
                onClick={() => handleSelectTableType('pool')}
                className={`cursor-pointer border-2 transition-all p-5 ${selectedType === 'pool' ? 'border-brass bg-brass/5 shadow-md' : 'border-border bg-card'}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-display font-bold text-lg">English 8-Ball Pool</h4>
                    <p className="text-xs text-stone">4 Tables Available • ₹250 - ₹450/hr</p>
                  </div>
                  {selectedType === 'pool' && <CheckCircle2 className="w-6 h-6 text-brass" />}
                </div>
              </Card>

              <Card
                onClick={() => handleSelectTableType('snooker')}
                className={`cursor-pointer border-2 transition-all p-5 ${selectedType === 'snooker' ? 'border-brass bg-brass/5 shadow-md' : 'border-border bg-card'}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-display font-bold text-lg">12ft Snooker</h4>
                    <p className="text-xs text-stone">2 Championship Tables • ₹400 - ₹650/hr</p>
                  </div>
                  {selectedType === 'snooker' && <CheckCircle2 className="w-6 h-6 text-brass" />}
                </div>
              </Card>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-display font-bold text-xl">Choose Specific Table</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SEED_TABLES.filter((t) => t.type === selectedType).map((table) => {
                const isSelected = selectedTable?.id === table.id;
                return (
                  <Card
                    key={table.id}
                    onClick={() => setSelectedTable(table)}
                    className={`cursor-pointer border-2 transition-all p-5 ${isSelected ? 'border-brass bg-brass/5 shadow-md' : 'border-border bg-card'}`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-display font-bold text-base">{table.name}</h4>
                        <PriceTag amount={table.hourlyRate} size="sm" className="mt-1" />
                      </div>
                      <TableStatusBadge status={table.status} />
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              variant="default"
              onClick={() => setStep(2)}
              disabled={!selectedTable}
              className="h-12 px-8 font-bold text-base bg-brass text-charcoal hover:bg-brass-dark"
            >
              Continue to Date &amp; Slots <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: DATE & TIME SLOT PICKER */}
      {step === 2 && (
        <div className="space-y-8">
          {/* Date Picker Horizontal Bar */}
          <div className="space-y-3">
            <h3 className="font-display font-bold text-xl flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-brass" /> Select Reservation Date
            </h3>
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {availableDates.map((item) => {
                const isSelected = selectedDate === item.dateStr;
                return (
                  <button
                    key={item.dateStr}
                    type="button"
                    onClick={() => setSelectedDate(item.dateStr)}
                    className={`shrink-0 px-4 py-3 rounded-2xl border text-center transition-all ${
                      isSelected
                        ? 'bg-felt text-white border-brass font-bold shadow-md'
                        : 'bg-card border-border hover:border-brass/50 text-foreground'
                    }`}
                  >
                    <span className="block text-[11px] uppercase tracking-wider opacity-80">{item.dayName}</span>
                    <span className="block font-display text-sm font-bold mt-0.5">{item.displayLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Slot Picker Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-xl flex items-center gap-2">
                <Clock className="w-5 h-5 text-brass" /> Pick Time Slots ({selectedTable?.name})
              </h3>
              <span className="text-xs text-stone">Click multiple consecutive slots for multi-hour play</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {HOURLY_SLOTS.map((slot) => {
                const isBooked = bookedSlots.includes(slot.start);
                const isSelected = Boolean(selectedSlots.find((s) => s.start === slot.start));
                const slotRate = slot.isPeak ? (selectedTable?.hourlyRate || 300) * 1.25 : (selectedTable?.hourlyRate || 300);

                return (
                  <button
                    key={slot.start}
                    type="button"
                    disabled={isBooked}
                    onClick={() => handleToggleSlot(slot)}
                    className={`p-3 rounded-xl border text-left transition-all relative ${
                      isBooked
                        ? 'bg-muted/40 border-border opacity-50 cursor-not-allowed'
                        : isSelected
                        ? 'bg-brass/20 border-brass text-foreground font-bold shadow-md'
                        : 'bg-card border-border hover:border-brass/60'
                    }`}
                  >
                    <span className="text-xs font-semibold block">{slot.label}</span>
                    <span className="text-[11px] text-brass font-bold block mt-1">₹{slotRate}/hr</span>
                    {isBooked ? (
                      <span className="text-[10px] text-rose-500 font-mono uppercase block mt-1">Booked</span>
                    ) : isSelected ? (
                      <CheckCircle2 className="w-4 h-4 text-brass absolute top-2 right-2" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setStep(1)} className="h-12 px-6 font-semibold">
              <ChevronLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            <Button
              variant="default"
              onClick={() => setStep(3)}
              disabled={selectedSlots.length === 0}
              className="h-12 px-8 font-bold text-base bg-brass text-charcoal hover:bg-brass-dark"
            >
              Continue to Details ({selectedSlots.length} slot{selectedSlots.length > 1 ? 's' : ''}) <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: CONTACT DETAILS & CONFIRMATION */}
      {step === 3 && (
        <form onSubmit={handleConfirmBooking} className="space-y-8">
          <div className="space-y-4">
            <h3 className="font-display font-bold text-xl">Customer Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 rounded-2xl bg-card border border-border">
              <div className="space-y-1.5">
                <Label htmlFor="cname" className="text-xs font-semibold">Full Name</Label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                  <Input
                    id="cname"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Alex Johnson"
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cphone" className="text-xs font-semibold">Phone Number</Label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                  <Input
                    id="cphone"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="pl-9"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Reservation Summary */}
          <div className="p-6 rounded-2xl bg-felt text-white border-2 border-brass/50 space-y-4">
            <h4 className="font-display font-bold text-lg text-brass uppercase tracking-wider">
              Reservation Summary
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-ivory/70 block">Table</span>
                <span className="font-bold text-sm text-white">{selectedTable?.name}</span>
              </div>
              <div>
                <span className="text-ivory/70 block">Date</span>
                <span className="font-bold text-sm text-white">{selectedDate}</span>
              </div>
              <div>
                <span className="text-ivory/70 block">Time Slot</span>
                <span className="font-bold text-sm text-white">
                  {selectedSlots[0]?.start} - {selectedSlots[selectedSlots.length - 1]?.end}
                </span>
              </div>
              <div>
                <span className="text-ivory/70 block">Total Amount</span>
                <span className="font-bold text-base text-brass">₹{totalPrice}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setStep(2)} className="h-12 px-6 font-semibold">
              <ChevronLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            <Button
              type="submit"
              variant="default"
              disabled={isSubmitting}
              className="h-12 px-8 font-bold text-base bg-brass text-charcoal hover:bg-brass-dark shadow-lg"
            >
              {isSubmitting ? 'Confirming Reservation...' : 'Confirm & Generate PIN'}
            </Button>
          </div>
        </form>
      )}

      {/* PHASE 4: SCREENSHOT-FRIENDLY CONFIRMATION CARD */}
      {step === 4 && confirmedBooking && (
        <div className="space-y-8 max-w-xl mx-auto">
          <div
            ref={cardRef}
            className="p-8 rounded-3xl bg-felt text-white border-4 border-brass shadow-2xl space-y-6 felt-texture relative overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-brass/30 pb-4">
              <Logo variant="brass" />
              <Badge variant="brass" className="font-mono text-xs uppercase px-3 py-1">
                Confirmed
              </Badge>
            </div>

            <div className="text-center space-y-2 py-4 bg-charcoal/80 rounded-2xl border border-brass/40 p-6">
              <span className="text-xs uppercase tracking-widest text-brass font-mono font-semibold">
                Your Counter Access PIN
              </span>
              <div className="font-mono font-extrabold text-4xl sm:text-5xl tracking-widest text-white">
                {confirmedBooking.pin}
              </div>
              <p className="text-xs text-ivory/80 pt-1">
                Show this 6-digit PIN at the counter to start your session
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs border-t border-b border-brass/30 py-4">
              <div>
                <span className="text-ivory/70 block">Booking ID</span>
                <span className="font-mono font-bold text-sm text-brass">{confirmedBooking.bookingCode}</span>
              </div>
              <div>
                <span className="text-ivory/70 block">Table Reserved</span>
                <span className="font-bold text-sm text-white">{confirmedBooking.tableName}</span>
              </div>
              <div>
                <span className="text-ivory/70 block">Reservation Date</span>
                <span className="font-bold text-sm text-white">{confirmedBooking.date}</span>
              </div>
              <div>
                <span className="text-ivory/70 block">Time Slot</span>
                <span className="font-bold text-sm text-white">{confirmedBooking.slotLabel}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-ivory/80">Total Charge Paid</span>
              <span className="font-display font-bold text-xl text-brass">₹{confirmedBooking.amount}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(confirmedBooking.bookingCode, 'Booking Code')}
              className="text-xs font-semibold"
            >
              <Copy className="w-3.5 h-3.5 mr-1.5" /> Code
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(confirmedBooking.pin, 'PIN')}
              className="text-xs font-semibold"
            >
              <Copy className="w-3.5 h-3.5 mr-1.5" /> PIN
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadImage}
              className="text-xs font-semibold border-brass text-brass hover:bg-brass hover:text-charcoal"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" /> Download
            </Button>
            <Link href="/profile" className="w-full">
              <Button variant="default" size="sm" className="w-full text-xs font-bold bg-brass text-charcoal">
                My Bookings
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* STICKY PRICE SUMMARY BAR AT BOTTOM (Steps 1 to 3) */}
      {step < 4 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-charcoal text-white border-t-2 border-brass p-4 shadow-2xl">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-left">
              <div>
                <span className="text-xs text-stone uppercase tracking-wider block">
                  Selected Table &amp; Date
                </span>
                <span className="font-display font-bold text-base text-brass">
                  {selectedTable?.name || 'No table selected'} • {selectedDate}
                </span>
              </div>
              <div className="h-8 w-px bg-border/40 hidden sm:block" />
              <div>
                <span className="text-xs text-stone uppercase tracking-wider block">
                  Estimated Total
                </span>
                <span className="font-sans font-extrabold text-xl text-white tabular-nums">
                  ₹{totalPrice}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BookPage() {
  return (
    <React.Suspense fallback={<div className="p-12 text-center text-stone">Loading reservation engine...</div>}>
      <BookContent />
    </React.Suspense>
  );
}
