'use client';

import React, { useState } from 'react';
import { Logo } from '@/components/shared/Logo';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { PriceTag } from '@/components/shared/PriceTag';
import { TableStatusBadge } from '@/components/shared/TableStatusBadge';
import { TimerDisplay } from '@/components/shared/TimerDisplay';
import { TableTile } from '@/components/shared/TableTile';
import { StatCard } from '@/components/shared/StatCard';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { SEED_TABLES } from '@/lib/seed';
import { Moon, Sun, DollarSign, Users, Award, ShieldCheck } from 'lucide-react';

export default function DesignSystemPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <div className={isDarkMode ? 'dark bg-charcoal text-ivory min-h-screen' : 'bg-ivory text-ink min-h-screen'}>
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-3">
              <Logo />
              <Badge variant="brass">Hidden Dev Preview</Badge>
            </div>
            <h1 className="font-display text-3xl font-bold mt-2">
              &quot;Felt &amp; Brass&quot; Design System Specification
            </h1>
            <p className="text-sm text-stone">
              Palette swatches, typography scale, buttons, badges, cards, and all shared components in light &amp; dark themes.
            </p>
          </div>

          <Button
            variant="outline"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="flex items-center gap-2"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-brass" /> : <Moon className="w-4 h-4 text-felt" />}
            <span>Toggle {isDarkMode ? 'Light' : 'Dark'} Theme</span>
          </Button>
        </div>

        {/* 1. Color Palette Swatches */}
        <section className="space-y-4">
          <SectionHeading title="1. Color Palette Swatches" subtitle="Tailwind tokens & CSS variable mapping" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            <div className="p-4 rounded-2xl bg-[#0F3D2E] text-white space-y-1 shadow-md">
              <span className="font-semibold text-sm">felt</span>
              <span className="block text-xs opacity-80">#0F3D2E</span>
              <span className="text-[10px] opacity-60">Primary Brand</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#0A2A20] text-white space-y-1 shadow-md">
              <span className="font-semibold text-sm">felt-dark</span>
              <span className="block text-xs opacity-80">#0A2A20</span>
              <span className="text-[10px] opacity-60">Felt Hover</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#C9A24B] text-charcoal space-y-1 shadow-md">
              <span className="font-semibold text-sm">brass</span>
              <span className="block text-xs opacity-80">#C9A24B</span>
              <span className="text-[10px] opacity-60">Accent Gold</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#B08A35] text-charcoal space-y-1 shadow-md">
              <span className="font-semibold text-sm">brass-dark</span>
              <span className="block text-xs opacity-80">#B08A35</span>
              <span className="text-[10px] opacity-60">Brass Hover</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#12161A] text-white space-y-1 border border-stone/30 shadow-md">
              <span className="font-semibold text-sm">charcoal</span>
              <span className="block text-xs opacity-80">#12161A</span>
              <span className="text-[10px] opacity-60">Dark Background</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#1B2128] text-white space-y-1 border border-stone/30 shadow-md">
              <span className="font-semibold text-sm">charcoal-card</span>
              <span className="block text-xs opacity-80">#1B2128</span>
              <span className="text-[10px] opacity-60">Dark Surface</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#F7F4EC] text-ink space-y-1 border border-stone/30 shadow-md">
              <span className="font-semibold text-sm">ivory</span>
              <span className="block text-xs opacity-80">#F7F4EC</span>
              <span className="text-[10px] opacity-60">Light Background</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#2E9E6B] text-white space-y-1 shadow-md">
              <span className="font-semibold text-sm">table-free</span>
              <span className="block text-xs opacity-80">#2E9E6B</span>
              <span className="text-[10px] opacity-60">Success Green</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#E0A526] text-white space-y-1 shadow-md">
              <span className="font-semibold text-sm">table-booked</span>
              <span className="block text-xs opacity-80">#E0A526</span>
              <span className="text-[10px] opacity-60">Booked Amber</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#B23A48] text-white space-y-1 shadow-md">
              <span className="font-semibold text-sm">danger</span>
              <span className="block text-xs opacity-80">#B23A48</span>
              <span className="text-[10px] opacity-60">Cue Red</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#3B82C4] text-white space-y-1 shadow-md">
              <span className="font-semibold text-sm">info</span>
              <span className="block text-xs opacity-80">#3B82C4</span>
              <span className="text-[10px] opacity-60">Chalk Blue</span>
            </div>
          </div>
        </section>

        {/* 2. Typography Scale */}
        <section className="space-y-4">
          <SectionHeading title="2. Typography Scale" subtitle="Playfair Display headings & Inter body with tabular digits" />
          <div className="space-y-3 p-6 rounded-2xl border border-border bg-card">
            <div>
              <span className="text-xs text-stone font-mono">H1 (Playfair Display 4xl Bold)</span>
              <h1 className="font-display text-4xl font-bold">The Premier Billiards &amp; Café Lounge</h1>
            </div>
            <div>
              <span className="text-xs text-stone font-mono">H2 (Playfair Display 3xl Bold)</span>
              <h2 className="font-display text-3xl font-bold">Reserve Championship Tables</h2>
            </div>
            <div>
              <span className="text-xs text-stone font-mono">H3 (Playfair Display 2xl Bold)</span>
              <h3 className="font-display text-2xl font-bold">Snooker Match Arena</h3>
            </div>
            <div>
              <span className="text-xs text-stone font-mono">Body (Inter Regular 16px)</span>
              <p className="font-sans text-base text-stone">
                Experience high-precision tournament tables, handcrafted artisanal coffee, and seamless digital booking.
              </p>
            </div>
            <div>
              <span className="text-xs text-stone font-mono">Tabular Timer Digits (Inter / Mono Tabular)</span>
              <div className="mt-1">
                <TimerDisplay seconds={4520} size="xl" />
              </div>
            </div>
          </div>
        </section>

        {/* 3. Buttons & Interactive Elements */}
        <section className="space-y-4">
          <SectionHeading title="3. Buttons & Badges" subtitle="Primary brass, felt, secondary, outlined and status badges" />
          <div className="flex flex-wrap items-center gap-4 p-6 rounded-2xl border border-border bg-card">
            <Button variant="default">Brass Primary Button</Button>
            <Button variant="felt">Felt Green Button</Button>
            <Button variant="outline">Outlined Secondary</Button>
            <Button variant="ghost">Ghost Trigger</Button>
            <Button variant="destructive">Danger Button</Button>

            <div className="w-full my-2 border-t border-border" />

            <div className="flex flex-wrap items-center gap-3">
              <TableStatusBadge status="free" />
              <TableStatusBadge status="booked" />
              <TableStatusBadge status="running" />
              <TableStatusBadge status="maintenance" />
              <Badge variant="brass">Brass Badge</Badge>
              <Badge variant="felt">Felt Badge</Badge>
            </div>
          </div>
        </section>

        {/* 4. Shared Components Showcase */}
        <section className="space-y-4">
          <SectionHeading title="4. Shared Component Library" subtitle="StatCards, PriceTags, TableTiles" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              label="Today's Revenue"
              value="₹24,850"
              trend="+18.4%"
              trendDirection="up"
              icon={<DollarSign className="w-5 h-5" />}
            />
            <StatCard
              label="Active Bookings"
              value="14 Sessions"
              trend="+4 today"
              trendDirection="up"
              icon={<Users className="w-5 h-5" />}
            />
            <StatCard
              label="Table Utilization"
              value="82%"
              trend="Peak Hours"
              trendDirection="neutral"
              icon={<Award className="w-5 h-5" />}
            />
          </div>

          <div className="mt-6">
            <h3 className="font-display text-xl font-bold mb-4">Sample Table Tiles (Staff Floor)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <TableTile table={SEED_TABLES[0]} />
              <TableTile table={SEED_TABLES[1]} />
              <TableTile table={SEED_TABLES[2]} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
