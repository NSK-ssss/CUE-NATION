'use client';

import React from 'react';
import Image from 'next/image';

export default function BilliardsBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none"
    >
      {/* High-Resolution Enhanced Cue Nation Lounge Background Image */}
      <div className="relative w-full h-full">
        <Image
          src="/images/billiards-lounge-bg.jpg"
          alt="Cue Nation Billiards & Lounge Background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center contrast-[1.05] brightness-[0.96]"
          quality={100}
        />
      </div>

      {/* Subtle Atmospheric Vignette for Rich Aesthetics & Crisp Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/60 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_50%,_rgba(0,0,0,0.55)_100%)] pointer-events-none" />
    </div>
  );
}
