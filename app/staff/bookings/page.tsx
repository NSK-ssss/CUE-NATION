'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SEED_BOOKINGS } from '@/lib/seed';
import { Search, Filter, CalendarPlus, Phone, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function StaffBookingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-white">
            Table Reservations
          </h1>
          <p className="text-xs text-stone mt-1">
            Search, filter and check-in customer reservations.
          </p>
        </div>

        <Button
          variant="default"
          className="font-bold"
          onClick={() => toast.info('New Manual Booking Triggered')}
        >
          <CalendarPlus className="w-4 h-4 mr-2" /> Add Offline Booking
        </Button>
      </div>

      {/* Search and Filters Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-stone" />
          <Input
            placeholder="Search by customer name, phone or booking ID..."
            className="pl-9 bg-charcoal-card border-border/60 text-white"
          />
        </div>
        <Button variant="outline" className="border-border/60 text-stone">
          <Filter className="w-4 h-4 mr-2" /> Filter Date
        </Button>
      </div>

      {/* Bookings Data List */}
      <div className="space-y-3">
        {SEED_BOOKINGS.map((booking) => (
          <Card key={booking.id} className="bg-charcoal-card border-border/60 hover:border-brass/40">
            <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="brass" className="uppercase text-[10px]">
                    {booking.status}
                  </Badge>
                  <span className="font-mono text-xs text-stone">{booking.id}</span>
                </div>
                <h3 className="font-display font-bold text-lg text-white">
                  {booking.customerName}
                </h3>
                <div className="flex items-center gap-4 text-xs text-stone">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-brass" /> {booking.customerPhone}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-felt dark:text-emerald-400" /> {booking.date} ({booking.slot})
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-xs text-stone block">Total</span>
                  <span className="font-sans font-bold text-lg text-brass">
                    ₹{booking.totalAmount}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast.success(`Check-in complete for ${booking.customerName}`)}
                >
                  Check-in Guest
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
