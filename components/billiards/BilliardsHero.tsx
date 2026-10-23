'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Coffee, Sparkles } from 'lucide-react';

export function BilliardsHero() {
  return (
    <section className="relative w-full min-h-[90vh] md:min-h-[94vh] flex flex-col justify-between overflow-hidden text-white border-b border-[#E5B869]/20">
      {/* 1. PHOTOGRAPHIC CUE NATION LOUNGE BACKGROUND (Preserved Intact) */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <Image
          src="/images/billiards-lounge-bg.jpg"
          alt="Cue Nation Luxury Billiards Lounge"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center contrast-[1.05] brightness-[0.97]"
          quality={100}
        />
        {/* Soft, Transparent Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_50%,_rgba(0,0,0,0.55)_100%)] pointer-events-none" />
      </div>

      {/* 2. HERO CONTENT (Heritage Gentlemen's Speakeasy Typography) */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 pb-12 relative z-20 flex-1 flex flex-col justify-center items-center text-center">
        {/* Subtle Radial Contrast Overlay behind center text container */}
        <div
          className="absolute inset-0 max-w-4xl mx-auto pointer-events-none rounded-3xl"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 75%)',
          }}
        />

        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          {/* Eyebrow Badge with diamond sights and brass border */}
          <div
            className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full font-outfit uppercase font-semibold backdrop-blur-md shadow-xl select-none"
            style={{
              letterSpacing: '0.18em',
              fontSize: '12px',
              backgroundColor: 'rgba(10, 25, 20, 0.65)',
              border: '1px solid rgba(229, 184, 105, 0.3)',
              color: '#E5B869',
            }}
          >
            <span className="text-[#E5B869] text-[10px]">◆</span>
            <Sparkles className="w-3.5 h-3.5 inline text-[#E5B869]" />
            <span className="text-[#E5B869] font-bold">LUXURY BILLIARDS &amp; ARTISANAL CAFÉ</span>
            <span className="text-[#E5B869] text-[10px]">◆</span>
          </div>

          {/* Hero Headline: Cinzel Ivory + Playfair Display Italic Gold */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.12] drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
            <span className="font-cinzel font-semibold md:font-bold tracking-[0.03em] text-[#FDFBF7] block sm:inline">
              Precision Cue Sports Meets{" "}
            </span>
            <span className="font-playfair italic font-medium text-[#E5B869] drop-shadow-[0_2px_14px_rgba(229,184,105,0.45)]">
              Artisanal Dining
            </span>
          </h1>

          {/* Body Description: Outfit font in metallic gold */}
          <p
            className="font-outfit text-base sm:text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)] text-[#E5B869]"
          >
            Reserve world-class 8-ball pool and Riley 12ft snooker tables online. Experience live digital session tracking and table-side gourmet dining.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/book">
              <Button
                variant="default"
                size="lg"
                className="h-14 px-8 rounded-full font-outfit text-base font-semibold shadow-[0_4px_16px_rgba(229,184,105,0.25)] hover:shadow-[0_8px_25px_rgba(229,184,105,0.45)] hover:brightness-105 active:scale-[0.98] transition-all duration-300 border border-[#FDFBF7]/30"
                style={{
                  background: 'linear-gradient(135deg, #E5B869 0%, #C8973D 100%)',
                  color: '#12100E',
                  fontWeight: 600,
                }}
              >
                <Calendar className="w-5 h-5 mr-2 text-[#12100E]" /> Book a Table
              </Button>
            </Link>

            <a href="#cafe">
              <Button
                variant="outline"
                size="lg"
                className="h-14 px-8 rounded-full font-outfit text-base font-medium shadow-xl hover:shadow-[0_4px_20px_rgba(229,184,105,0.3)] hover:border-[#E5B869] hover:bg-[rgba(10,25,20,0.65)] active:scale-[0.98] transition-all duration-300 group"
                style={{
                  background: 'rgba(10, 25, 20, 0.45)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  border: '1px solid rgba(229, 184, 105, 0.4)',
                  color: '#E5B869',
                }}
              >
                <Coffee className="w-5 h-5 mr-2 text-[#E5B869]" /> View Café Menu
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM BAR: EXCLUSIVE TOURNAMENT BOARD METRICS */}
      <div
        className="relative z-20 w-full py-4.5"
        style={{
          backgroundColor: 'rgba(5, 12, 10, 0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderTop: '1px solid rgba(229, 184, 105, 0.2)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div
            className="flex items-center gap-2.5 text-xs font-outfit font-medium tracking-wide text-[#E5B869]"
          >
            <Sparkles className="w-4 h-4 text-[#E5B869]" />
            <span>Championship Tables &bull; Artisanal Café &bull; Live Session Tracking</span>
          </div>

          {/* Quick Metrics Bar (Tournament Board) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center w-full md:w-auto">
            <div className="px-3">
              <span className="block font-cinzel text-xl font-bold tracking-wider text-[#E5B869]">6 Tables</span>
              <span className="text-[11px] font-outfit font-medium text-[#E5B869]/90">Pool &amp; Snooker</span>
            </div>
            <div className="px-3">
              <span className="block font-cinzel text-xl font-bold tracking-wider text-[#E5B869]">₹250 / hr</span>
              <span className="text-[11px] font-outfit font-medium text-[#E5B869]/90">Starting Rate</span>
            </div>
            <div className="px-3">
              <span className="block font-cinzel text-xl font-bold tracking-wider text-[#E5B869]">Live PIN</span>
              <span className="text-[11px] font-outfit font-medium text-[#E5B869]/90">Quick Check-in</span>
            </div>
            <div className="px-3">
              <span className="block font-cinzel text-xl font-bold tracking-wider text-[#E5B869]">02:00 AM</span>
              <span className="text-[11px] font-outfit font-medium text-[#E5B869]/90">Late Night Café</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
