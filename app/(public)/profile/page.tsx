'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { TimerDisplay } from '@/components/shared/TimerDisplay';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TableStatusBadge } from '@/components/shared/TableStatusBadge';
import { SEED_BOOKINGS, DEMO_USERS, SEED_TABLES, SEED_ORDERS, Booking } from '@/lib/seed';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import {
  Calendar,
  Clock,
  ShoppingBag,
  Receipt,
  User as UserIcon,
  Phone,
  Mail,
  Copy,
  XCircle,
  CheckCircle2,
  Edit2,
  Save,
} from 'lucide-react';
import { toast } from 'sonner';



export default function CustomerProfilePage() {
  const [userName, setUserName] = useState('Alex Johnson');
  const [userEmail, setUserEmail] = useState('demo@cuenation.com');
  const [userPhone, setUserPhone] = useState('+91 98765 43210');
  const [isEditing, setIsEditing] = useState(false);

  // Bookings list
  const [bookings, setBookings] = useState<Booking[]>(SEED_BOOKINGS);

  // Active Session & Live Timer state
  const [activeSession, setActiveSession] = useState<{
    tableName: string;
    hourlyRate: number;
    startedAt: string; // ISO string
    elapsedSeconds: number;
  }>({
    tableName: 'Pool 2 (Classic)',
    hourlyRate: 300,
    startedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    elapsedSeconds: 2700,
  });

  // Client-side Live Timer Tick (survives refresh using startedAt)
  useEffect(() => {
    const timer = setInterval(() => {
      if (activeSession) {
        const start = new Date(activeSession.startedAt).getTime();
        const now = Date.now();
        const seconds = Math.floor((now - start) / 1000);
        setActiveSession((prev) => (prev ? { ...prev, elapsedSeconds: seconds } : prev));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [activeSession?.startedAt]);

  // Read cookies on mount
  useEffect(() => {
    const getCookie = (name: string) => {
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      return match ? decodeURIComponent(match[2]) : null;
    };
    const cookieName = getCookie('cue_user_name');
    const cookieEmail = getCookie('cue_user_email');
    if (cookieName) setUserName(cookieName);
    if (cookieEmail) setUserEmail(cookieEmail);
  }, []);

  // Supabase Realtime Session Subscription
  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      const channel = supabase
        .channel('public_sessions_channel')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'sessions' }, (payload) => {
          if (payload.new) {
            const data = payload.new as any;
            setActiveSession({
              tableName: 'Pool 2',
              hourlyRate: 300,
              startedAt: data.started_at,
              elapsedSeconds: Math.floor((Date.now() - new Date(data.started_at).getTime()) / 1000),
            });
          }
        })
        .subscribe();

      return () => {
        if (supabase) {
          supabase.removeChannel(channel);
        }
      };
    }
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    document.cookie = `cue_user_name=${encodeURIComponent(userName)}; path=/; max-age=604800; SameSite=Lax`;
    toast.success('Profile Updated Successfully');
  };

  const handleCopyPin = (pin: string) => {
    navigator.clipboard.writeText(pin);
    toast.success('PIN Copied to Clipboard', { description: pin });
  };

  const handleCancelBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b))
    );
    toast.success('Booking Cancelled', { description: 'Your slot has been released back to availability.' });
  };

  // Format Elapsed Seconds to HH:MM:SS
  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Compute live estimated cost
  const liveCost = activeSession
    ? ((activeSession.elapsedSeconds / 3600) * activeSession.hourlyRate).toFixed(2)
    : '0.00';

  const upcomingBookings = bookings.filter((b) => b.status === 'confirmed');
  const pastBookings = bookings.filter((b) => b.status !== 'confirmed');

  return (
    <div className="relative min-h-screen">

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 relative z-10">
        {/* SECTION 1: USER DETAILS */}
        <div className="p-6 rounded-2xl bg-card/90 backdrop-blur-md border border-border shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-felt text-white font-display text-2xl font-bold flex items-center justify-center border-2 border-brass shadow-md">
                {userName[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-display text-2xl font-bold text-foreground">
                    {userName}
                  </h1>
                  <Badge variant="brass" className="uppercase text-[10px]">
                    Customer
                  </Badge>
                </div>
                <p className="text-xs text-stone mt-0.5">{userEmail} • {userPhone}</p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="border-brass text-brass hover:bg-brass hover:text-charcoal font-semibold"
            >
              {isEditing ? <Save className="w-4 h-4 mr-1.5" /> : <Edit2 className="w-4 h-4 mr-1.5" />}
              {isEditing ? 'Cancel Edit' : 'Edit Details'}
            </Button>
          </div>

          {/* Editable Form */}
          {isEditing && (
            <form onSubmit={handleSaveProfile} className="pt-4 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="ename" className="text-xs font-semibold">Full Name</Label>
                <Input
                  id="ename"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="bg-background"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="ephone" className="text-xs font-semibold">Phone Number</Label>
                <Input
                  id="ephone"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  className="bg-background"
                  required
                />
              </div>

              <div className="sm:col-span-2 flex justify-end">
                <Button type="submit" variant="default" size="sm" className="font-bold bg-brass text-charcoal">
                  Save Profile Changes
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* SECTION 2: LIVE TIMER & ACTIVE SESSION */}
        <section className="space-y-4">
          <h3 className="font-display font-bold text-xl flex items-center gap-2 text-white drop-shadow-sm">
            <Clock className="w-5 h-5 text-brass" /> Active Table Session &amp; Live Timer
          </h3>
          <Card className="border-brass/60 bg-charcoal/95 backdrop-blur-md text-white overflow-hidden shadow-2xl">
            <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1 text-center md:text-left">
                <span className="text-xs uppercase tracking-wider text-brass font-mono font-bold">
                  Currently Playing on {activeSession.tableName}
                </span>
                <h4 className="font-display font-bold text-2xl">{activeSession.tableName}</h4>
                <p className="text-xs text-stone">
                  Rate: ₹{activeSession.hourlyRate}/hr • Started at {new Date(activeSession.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              <div className="flex flex-col items-center p-4 rounded-2xl bg-charcoal-card border border-brass/40 min-w-[220px]">
                <span className="text-[11px] text-stone mb-1 font-mono uppercase tracking-wider">Elapsed Time</span>
                <TimerDisplay formattedTime={formatTime(activeSession.elapsedSeconds)} size="xl" isRunning />
                <span className="text-xs text-emerald-400 mt-2 font-bold font-mono">
                  Live Bill: ₹{liveCost}
                </span>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* SECTION 3: MY BOOKINGS (UPCOMING & PAST) */}
        <section className="space-y-4">
          <h3 className="font-display font-bold text-xl flex items-center gap-2 text-white drop-shadow-sm">
            <Calendar className="w-5 h-5 text-brass" /> My Reservations
          </h3>

          <div className="space-y-4">
            {/* Upcoming Bookings */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-brass font-mono">
                Upcoming Bookings ({upcomingBookings.length})
              </h4>

              {upcomingBookings.length === 0 ? (
                <Card className="border-border bg-card/95 backdrop-blur-md">
                  <CardContent className="p-8 text-center space-y-2">
                    <Calendar className="w-8 h-8 text-muted-foreground mx-auto" />
                    <h5 className="font-display font-bold text-base">No Upcoming Reservations</h5>
                    <p className="text-xs text-stone max-w-sm mx-auto">
                      Reserve a pool or snooker table ahead of time.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                upcomingBookings.map((b) => (
                  <Card key={b.id} className="border-border/80 bg-card/95 backdrop-blur-md shadow-md">
                    <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-brass">{b.id}</span>
                          <Badge variant="outline" className="text-[10px] uppercase">
                            {b.status}
                          </Badge>
                        </div>
                        <h5 className="font-display font-bold text-lg text-foreground">{b.tableName}</h5>
                        <p className="text-xs text-stone">{b.date} • {b.slot}</p>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="p-2.5 rounded-xl bg-muted/60 border border-border text-center">
                          <span className="text-[10px] uppercase text-stone font-mono block">Counter PIN</span>
                          <span className="font-mono font-bold text-base text-foreground tracking-widest">
                            849201
                          </span>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopyPin('849201')}
                          className="text-xs border-brass text-brass hover:bg-brass hover:text-charcoal"
                        >
                          <Copy className="w-3.5 h-3.5 mr-1" /> Copy PIN
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCancelBooking(b.id)}
                          className="text-xs text-rose-600 hover:bg-rose-500/10"
                        >
                          <XCircle className="w-3.5 h-3.5 mr-1" /> Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Past / Cancelled Bookings */}
            <div className="space-y-3 pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone font-mono">
                Past &amp; History ({pastBookings.length})
              </h4>
              {pastBookings.map((b) => (
                <Card key={b.id} className="border-border/60 bg-card/80 backdrop-blur-sm opacity-80">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <span className="font-mono text-xs text-stone">{b.id}</span>
                      <h5 className="font-display font-bold text-sm text-foreground">{b.tableName}</h5>
                      <span className="text-xs text-stone">{b.date} • {b.slot}</span>
                    </div>
                    <Badge variant="secondary" className="text-[10px] uppercase">
                      {b.status}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 4: ORDERS AND BILL */}
        <section className="space-y-4">
          <h3 className="font-display font-bold text-xl flex items-center gap-2 text-white drop-shadow-sm">
            <Receipt className="w-5 h-5 text-stone" /> Orders &amp; Billing History
          </h3>
          <Card className="border-border bg-card/95 backdrop-blur-md">
            <CardContent className="p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-muted/60 text-muted-foreground mx-auto flex items-center justify-center">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h4 className="font-display font-bold text-lg">No Recent Orders</h4>
              <p className="text-xs text-stone max-w-sm mx-auto">
                Scan the QR code at your table to order snacks and drinks directly during your play session.
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
