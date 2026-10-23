'use client';

import React from 'react';
import { StatCard } from '@/components/shared/StatCard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SEED_EXPENSES } from '@/lib/seed';
import { DollarSign, Calendar, TrendingUp, Wallet, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const SAMPLE_CHART_DATA = [
  { day: 'Mon', revenue: 18500, expenses: 4200 },
  { day: 'Tue', revenue: 22000, expenses: 5100 },
  { day: 'Wed', revenue: 19800, expenses: 3800 },
  { day: 'Thu', revenue: 24500, expenses: 6200 },
  { day: 'Fri', revenue: 38000, expenses: 12000 },
  { day: 'Sat', revenue: 49500, expenses: 14500 },
  { day: 'Sun', revenue: 42000, expenses: 11000 },
];

export default function OwnerOverviewPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground">
          Executive Financial Overview
        </h1>
        <p className="text-xs text-stone mt-1">
          Real-time venue performance metrics, revenue charts and calendar bookings.
        </p>
      </div>

      {/* 4 StatCards: Today's Revenue, Bookings, Expenses, Profit */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Today's Revenue"
          value="₹24,850"
          trend="+18.4%"
          trendDirection="up"
          icon={<DollarSign className="w-5 h-5 text-brass" />}
        />
        <StatCard
          label="Total Bookings"
          value="18 Sessions"
          trend="+5 today"
          trendDirection="up"
          icon={<Calendar className="w-5 h-5 text-felt" />}
        />
        <StatCard
          label="Total Expenses"
          value="₹63,800"
          trend="Cloth & Coffee"
          trendDirection="neutral"
          icon={<Wallet className="w-5 h-5 text-rose-500" />}
        />
        <StatCard
          label="Net Profit (MTD)"
          value="₹1,50,500"
          trend="+22.1%"
          trendDirection="up"
          icon={<TrendingUp className="w-5 h-5 text-emerald-600" />}
        />
      </div>

      {/* Recharts Revenue vs Expenses Bar Chart Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-border/80 shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-xl font-display">Weekly Financial Performance</CardTitle>
              <CardDescription className="text-xs">
                Revenue vs Expenses (INR ₹) across 7 days
              </CardDescription>
            </div>
            <Badge variant="brass" className="text-xs">
              Live Analytics
            </Badge>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SAMPLE_CHART_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2DCD0" />
                  <XAxis dataKey="day" stroke="#6B7280" fontSize={12} />
                  <YAxis stroke="#6B7280" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#12161A',
                      borderColor: '#C9A24B',
                      borderRadius: '12px',
                      color: '#F7F4EC',
                    }}
                    formatter={(val: number) => [`₹${val.toLocaleString()}`, '']}
                  />
                  <Legend />
                  <Bar dataKey="revenue" name="Revenue (₹)" fill="#0F3D2E" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="expenses" name="Expenses (₹)" fill="#C9A24B" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Calendar Overview Grid Shell */}
        <Card className="border-border/80 shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg font-display">October 2026 Calendar</CardTitle>
              <CardDescription className="text-xs">
                Peak table booking density
              </CardDescription>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="pt-2">
            <div className="grid grid-cols-7 gap-1 text-center font-mono text-xs font-semibold text-stone mb-2">
              <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
            </div>

            <div className="grid grid-cols-7 gap-1 text-xs">
              {Array.from({ length: 31 }).map((_, i) => {
                const dayNum = i + 1;
                const isToday = dayNum === 6;
                const hasHighBookings = [4, 6, 11, 18, 25].includes(dayNum);
                return (
                  <div
                    key={dayNum}
                    className={`h-9 rounded-lg flex flex-col items-center justify-center p-1 font-mono transition-colors ${
                      isToday
                        ? 'bg-felt text-white font-bold ring-2 ring-brass'
                        : hasHighBookings
                        ? 'bg-brass/20 text-charcoal font-bold'
                        : 'bg-muted/40 text-foreground hover:bg-muted'
                    }`}
                  >
                    <span>{dayNum}</span>
                    {hasHighBookings && <span className="w-1 h-1 rounded-full bg-brass" />}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
