'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/shared/Logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Menu, User as UserIcon, LogOut, LayoutDashboard, Calendar } from 'lucide-react';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    // Read mock auth cookie on client mount
    const getCookie = (name: string) => {
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      return match ? decodeURIComponent(match[2]) : null;
    };
    setUserRole(getCookie('cue_user_role'));
    setUserName(getCookie('cue_user_name'));
  }, []);

  const handleLogout = () => {
    document.cookie = 'cue_user_role=; path=/; max-age=0';
    document.cookie = 'cue_user_email=; path=/; max-age=0';
    document.cookie = 'cue_user_name=; path=/; max-age=0';
    setUserRole(null);
    setUserName(null);
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen flex flex-col bg-ivory/80 dark:bg-charcoal/80 backdrop-blur-[1px] text-ink">
      {/* Sticky Navbar with Speakeasy Dark Glass & Hairline Brass Divider */}
      <header
        className="sticky top-0 z-40 transition-colors"
        style={{
          backgroundColor: 'rgba(5, 12, 10, 0.75)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(229, 184, 105, 0.15)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Logo href="/" showSubtitle variant="brass" />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 font-outfit font-medium text-sm">
            <a href="#tables" className="text-[#E5B869] hover:text-[#FDFBF7] transition-colors tracking-wide font-medium">
              Tables
            </a>
            <a href="#cafe" className="text-[#E5B869] hover:text-[#FDFBF7] transition-colors tracking-wide font-medium">
              Café Menu
            </a>
            <a href="#about" className="text-[#E5B869] hover:text-[#FDFBF7] transition-colors tracking-wide font-medium">
              About Us
            </a>
            <Link href="/book" className="text-[#E5B869] hover:text-[#FDFBF7] transition-colors tracking-wide font-medium">
              Reserve
            </Link>
          </nav>

          {/* Right Action Controls */}
          <div className="hidden md:flex items-center gap-3">
            {userRole ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 pl-2 pr-3 rounded-full border border-[#E5B869]/30 bg-white/5 text-[#E5B869]">
                    <Avatar className="w-7 h-7">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-felt text-white text-xs font-bold">
                        {userName ? userName[0].toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-semibold text-[#E5B869]">{userName || 'User'}</span>
                    <Badge variant="brass" className="text-[10px] px-1.5 py-0 uppercase">
                      {userRole}
                    </Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-[#0B1410] border-[#E5B869]/30 text-[#E5B869]">
                  <DropdownMenuItem onClick={() => router.push('/profile')}>
                    <UserIcon className="w-4 h-4 mr-2 text-[#E5B869]" /> My Profile
                  </DropdownMenuItem>

                  {userRole === 'staff' && (
                    <DropdownMenuItem onClick={() => router.push('/staff')}>
                      <LayoutDashboard className="w-4 h-4 mr-2 text-brass" /> Staff Dashboard
                    </DropdownMenuItem>
                  )}

                  {userRole === 'owner' && (
                    <>
                      <DropdownMenuItem onClick={() => router.push('/owner')}>
                        <LayoutDashboard className="w-4 h-4 mr-2 text-brass" /> Owner Overview
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push('/staff')}>
                        <LayoutDashboard className="w-4 h-4 mr-2 text-felt" /> Staff View
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuSeparator className="bg-[#E5B869]/20" />
                  <DropdownMenuItem onClick={handleLogout} className="text-rose-400">
                    <LogOut className="w-4 h-4 mr-2" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full font-outfit text-xs px-4 h-9 border-[#E5B869]/40 text-[#E5B869] hover:border-[#E5B869] hover:text-[#12100E] hover:bg-[#E5B869] bg-white/5 backdrop-blur-sm transition-all"
                >
                  Login
                </Button>
              </Link>
            )}

            {/* Primary CTA (Header "Book Now"): Luxury Metallic Gold Gradient */}
            <Link href="/book">
              <Button
                size="sm"
                className="rounded-full font-outfit text-xs font-semibold px-4 h-9 shadow-[0_2px_12px_rgba(229,184,105,0.25)] hover:shadow-[0_4px_18px_rgba(229,184,105,0.45)] hover:brightness-105 active:scale-[0.98] transition-all duration-300 border border-[#FDFBF7]/30"
                style={{
                  background: 'linear-gradient(135deg, #E5B869 0%, #C8973D 100%)',
                  color: '#12100E',
                  fontWeight: 600,
                }}
              >
                <Calendar className="w-3.5 h-3.5 mr-1.5 text-[#12100E]" /> Book Now
              </Button>
            </Link>
          </div>

          {/* Mobile Drawer Navigation */}
          <div className="md:hidden flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="w-10 h-10 rounded-full border-[#FDFBF7]/25 text-[#FDFBF7] bg-white/5 hover:border-[#E5B869] hover:text-[#E5B869]">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-[#050C0A]/95 backdrop-blur-xl border-l border-[#E5B869]/20 p-6 flex flex-col justify-between text-[#FDFBF7]">
                <SheetHeader>
                  <SheetTitle className="text-left">
                    <Logo variant="brass" />
                  </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col gap-6 my-8 font-outfit font-medium text-lg">
                  <a href="#tables" className="hover:text-[#E5B869] transition-colors">Tables &amp; Rates</a>
                  <a href="#cafe" className="hover:text-[#E5B869] transition-colors">Café &amp; Drinks</a>
                  <a href="#about" className="hover:text-[#E5B869] transition-colors">About Lounge</a>
                  <Link href="/book" className="hover:text-[#E5B869] text-[#E5B869] font-bold">
                    Book a Table
                  </Link>
                  {userRole && (
                    <Link href="/profile" className="hover:text-[#E5B869] transition-colors">
                      My Profile &amp; History
                    </Link>
                  )}
                </div>

                <div className="flex flex-col gap-3 pt-6 border-t border-[#E5B869]/20">
                  {userRole ? (
                    <Button variant="outline" onClick={handleLogout} className="w-full text-rose-400 border-rose-400/30">
                      <LogOut className="w-4 h-4 mr-2" /> Logout ({userName})
                    </Button>
                  ) : (
                    <Link href="/login" className="w-full">
                      <Button variant="outline" className="w-full border-[#FDFBF7]/25 text-[#FDFBF7] hover:border-[#E5B869] hover:text-[#E5B869] bg-white/5">
                        Login
                      </Button>
                    </Link>
                  )}
                  <Link href="/book" className="w-full">
                    <Button
                      className="w-full rounded-full font-outfit text-sm font-semibold h-11 border border-[#FDFBF7]/30 shadow-lg"
                      style={{
                        background: 'linear-gradient(135deg, #E5B869 0%, #C8973D 100%)',
                        color: '#12100E',
                        fontWeight: 600,
                      }}
                    >
                      Book Now
                    </Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-felt text-ivory border-t border-brass/20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Logo variant="brass" showSubtitle />
            <p className="text-xs text-[#E5B869] leading-relaxed">
              Cue Nation is India&apos;s luxury billiards, snooker lounge and artisanal café management experience.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-display font-bold text-brass text-sm uppercase tracking-wider">
              Venue Location
            </h4>
            <p className="text-xs text-[#E5B869] leading-relaxed">
              124 Tournament Avenue, Indiranagar<br />
              Bengaluru, Karnataka 560038
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-display font-bold text-brass text-sm uppercase tracking-wider">
              Opening Hours
            </h4>
            <p className="text-xs text-[#E5B869] leading-relaxed">
              Monday - Sunday: 10:00 AM – 02:00 AM<br />
              Happy Hours: 02:00 PM – 06:00 PM
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-display font-bold text-brass text-sm uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="text-xs space-y-1.5 text-[#E5B869]">
              <li><Link href="/design-system" className="hover:text-white transition-colors">Design System (Dev)</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Staff / Owner Portal</Link></li>
              <li><Link href="/book" className="hover:text-white transition-colors">Online Booking Engine</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-brass/20 text-center text-xs text-[#E5B869]/80 font-mono">
          © 2026 Cue Nation Platform. All rights reserved. Stage 0 Skeleton.
        </div>
      </footer>
    </div>
  );
}
