'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SEED_ORDERS } from '@/lib/seed';
import { ChefHat, ArrowLeft, Clock, CheckCircle, BellRing } from 'lucide-react';
import { toast } from 'sonner';

export default function KitchenDisplayPage() {
  const newTicket = SEED_ORDERS[0];
  const prepTicket = SEED_ORDERS[1];

  return (
    <div className="dark bg-[#0D1013] text-white min-h-screen p-6 flex flex-col gap-6 selection:bg-brass selection:text-charcoal font-sans">
      {/* Top KDS Header */}
      <header className="flex items-center justify-between border-b border-border/40 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-brass text-charcoal font-bold">
            <ChefHat className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-display font-black text-2xl tracking-wide uppercase">
              Kitchen Display System (KDS)
            </h1>
            <p className="text-xs text-stone">
              Live Order Stream for Chef &amp; Bar Station
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Badge variant="brass" className="text-xs px-3 py-1 animate-pulse">
            <BellRing className="w-3.5 h-3.5 mr-1" /> Live Station Online
          </Badge>
          <Link href="/staff">
            <Button variant="outline" size="sm" className="border-border/60 text-stone">
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Staff Floor
            </Button>
          </Link>
        </div>
      </header>

      {/* 3 Ticket Columns: New, Preparing, Served */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* NEW ORDERS COLUMN */}
        <div className="flex flex-col gap-4 bg-charcoal-card p-4 rounded-2xl border border-rose-500/30">
          <div className="flex items-center justify-between border-b border-border/40 pb-3">
            <span className="font-display font-bold text-rose-400 text-base tracking-wide">
              1. NEW TICKETS (1)
            </span>
            <Badge variant="destructive" className="text-xs">Priority</Badge>
          </div>

          <Card className="bg-[#161B21] border-rose-500/60 shadow-lg">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <span className="font-display font-bold text-xl text-brass">
                  {newTicket.tableName}
                </span>
                <span className="text-xs font-mono text-rose-400 font-bold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {newTicket.createdAt}
                </span>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono uppercase text-stone block">Order #{newTicket.id}</span>
                <ul className="text-sm space-y-2 font-medium">
                  {newTicket.items.map((item, idx) => (
                    <li key={idx} className="flex justify-between items-center p-2 rounded bg-charcoal/60">
                      <span className="font-bold text-white text-base">{item.quantity}x {item.name}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                variant="default"
                className="w-full h-12 font-bold text-base bg-rose-600 hover:bg-rose-700 text-white shadow-md"
                onClick={() => toast.success(`Ticket ${newTicket.id} moved to Preparing`)}
              >
                Start Preparation
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* PREPARING COLUMN */}
        <div className="flex flex-col gap-4 bg-charcoal-card p-4 rounded-2xl border border-amber-500/30">
          <div className="flex items-center justify-between border-b border-border/40 pb-3">
            <span className="font-display font-bold text-amber-400 text-base tracking-wide">
              2. IN PREPARATION (1)
            </span>
            <Badge variant="booked" className="text-xs">Cooking</Badge>
          </div>

          <Card className="bg-[#161B21] border-amber-500/60 shadow-lg">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <span className="font-display font-bold text-xl text-brass">
                  {prepTicket.tableName}
                </span>
                <span className="text-xs font-mono text-amber-400 font-bold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {prepTicket.createdAt}
                </span>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono uppercase text-stone block">Order #{prepTicket.id}</span>
                <ul className="text-sm space-y-2 font-medium">
                  {prepTicket.items.map((item, idx) => (
                    <li key={idx} className="flex justify-between items-center p-2 rounded bg-charcoal/60">
                      <span className="font-bold text-white text-base">{item.quantity}x {item.name}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                variant="default"
                className="w-full h-12 font-bold text-base bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
                onClick={() => toast.success(`Ticket ${prepTicket.id} Ready to Serve!`)}
              >
                Mark Ready to Serve
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* SERVED COLUMN */}
        <div className="flex flex-col gap-4 bg-charcoal-card p-4 rounded-2xl border border-emerald-500/30">
          <div className="flex items-center justify-between border-b border-border/40 pb-3">
            <span className="font-display font-bold text-emerald-400 text-base tracking-wide">
              3. SERVED / PASSED (1)
            </span>
            <Badge variant="free" className="text-xs">Done</Badge>
          </div>

          <Card className="bg-[#161B21] border-border/40 opacity-70">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <span className="font-display font-bold text-lg text-stone">
                  Pool 3
                </span>
                <span className="text-xs font-mono text-stone">45 mins ago</span>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono uppercase text-stone block">Order #ord_103</span>
                <p className="text-sm text-stone font-medium">
                  1x Chalk &amp; Cue Loaded Nachos
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold pt-2">
                <CheckCircle className="w-4 h-4" /> Picked up by Runner
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
