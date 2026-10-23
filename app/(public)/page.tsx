'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { PriceTag } from '@/components/shared/PriceTag';
import { TableStatusBadge } from '@/components/shared/TableStatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SEED_TABLES, SEED_MENU, SEED_PRICING, TableType } from '@/lib/seed';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { Calendar, ChevronRight, ChevronLeft, Sparkles, Coffee, Award, Clock, MapPin, Phone, CheckCircle2 } from 'lucide-react';
import { BilliardsHero } from '@/components/billiards/BilliardsHero';
import { OurTablesSection } from '@/components/tables/OurTablesSection';

export default function HomePage() {
  const router = useRouter();
  const [tables, setTables] = useState(SEED_TABLES);
  const [menuItems, setMenuItems] = useState(SEED_MENU.slice(0, 8));

  // Real-time table status subscription via Supabase
  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      const channel = supabase
        .channel('public_tables_channel')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'tables' }, (payload) => {
          if (payload.new) {
            setTables((prev) =>
              prev.map((t) => (t.id === (payload.new as any).id ? { ...t, ...(payload.new as any) } : t))
            );
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

  return (
    <div className="space-y-20 pb-20">
      {/* 1. CINEMATIC 3D BILLIARDS HERO SECTION */}
      <BilliardsHero />

      {/* 2. OUR TABLES SECTION (Stage 2: 6 Tables, Dates, Slot Availability & Responsive Carousel) */}
      <OurTablesSection />


      {/* 3. CAFÉ MENU HIGHLIGHTS */}
      <section id="cafe" className="bg-ivory/50 border-y border-border/60 py-16 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <SectionHeading
            title="Artisanal Café Highlights"
            subtitle="Gourmet coffee, artisan smash burgers, truffle fries &amp; craft drinks served right at your table."
            align="center"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {menuItems.map((item) => (
              <Card key={item.id} className="border-border/70 hover:border-brass/50 shadow-sm hover:shadow-md transition-all bg-card">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant="outline" className="text-[10px] uppercase font-mono tracking-wider text-[#E5B869] border-[#E5B869]/30">
                      {item.category}
                    </Badge>
                    <PriceTag amount={item.price} unit="" size="sm" />
                  </div>

                  <div>
                    <h4 className="font-display font-bold text-base text-foreground">
                      {item.name}
                    </h4>
                    <p className="text-xs text-[#E5B869] mt-1 line-clamp-2 leading-relaxed font-medium">
                      {item.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 4. ABOUT US SECTION */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <SectionHeading
              title="The Ultimate Cue Sports Sanctuary"
              subtitle="Designed for casual players, tournament professionals, and culinary enthusiasts."
            />

            <p className="font-sans text-[#E5B869] text-sm md:text-base leading-relaxed font-medium">
              Cue Nation combines tournament-grade English wool cloth, Aramith Super Pro ball sets, and acoustically dampened lounge interiors with a full kitchen &amp; café.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs text-[#E5B869] font-medium">
                <MapPin className="w-5 h-5 text-brass shrink-0" />
                <span>124 Tournament Avenue, Indiranagar, Bengaluru, Karnataka 560038</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#E5B869] font-medium">
                <Clock className="w-5 h-5 text-brass shrink-0" />
                <span>Open Daily: 10:00 AM – 02:00 AM</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#E5B869] font-medium">
                <Phone className="w-5 h-5 text-brass shrink-0" />
                <span>+91 98765 43210</span>
              </div>
            </div>
          </div>

          {/* Interactive Map Placeholder Card */}
          <div className="relative h-80 rounded-2xl bg-felt border-2 border-brass/40 shadow-2xl overflow-hidden flex items-center justify-center p-8 text-center felt-texture">
            <div className="space-y-3 z-10 max-w-sm">
              <div className="w-14 h-14 rounded-full bg-brass/20 border-2 border-brass mx-auto flex items-center justify-center text-brass font-bold text-xl font-display">
                CN
              </div>
              <h3 className="font-display font-bold text-2xl text-white">
                Cue Nation Lounge
              </h3>
              <p className="text-xs text-[#E5B869] font-medium">
                Indiranagar, Bengaluru
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
