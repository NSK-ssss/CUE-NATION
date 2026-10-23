'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Logo } from '@/components/shared/Logo';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Grid,
  Calendar,
  UtensilsCrossed,
  ChefHat,
  Menu as MenuIcon,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Store,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userName, setUserName] = useState<string | null>('Rohan Sharma');
  const [userRole, setUserRole] = useState<string | null>('staff');

  useEffect(() => {
    const getCookie = (name: string) => {
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      return match ? decodeURIComponent(match[2]) : null;
    };
    setUserRole(getCookie('cue_user_role') || 'staff');
    setUserName(getCookie('cue_user_name') || 'Staff Member');
  }, []);

  const handleLogout = () => {
    document.cookie = 'cue_user_role=; path=/; max-age=0';
    document.cookie = 'cue_user_email=; path=/; max-age=0';
    document.cookie = 'cue_user_name=; path=/; max-age=0';
    toast.info('Logged out from staff terminal');
    router.push('/login');
    router.refresh();
  };

  const navItems = [
    { label: 'Floor Grid', href: '/staff', icon: Grid },
    { label: 'Bookings', href: '/staff/bookings', icon: Calendar },
    { label: 'Orders', href: '/staff/orders', icon: UtensilsCrossed },
    { label: 'Menu Catalog', href: '/staff/menu', icon: MenuIcon },
    { label: 'Kitchen View', href: '/kitchen', icon: ChefHat },
  ];

  return (
    <div className="dark bg-charcoal/80 backdrop-blur-[2px] text-ivory min-h-screen flex flex-col md:flex-row antialiased selection:bg-brass selection:text-charcoal">
      {/* Dark Sidebar (Collapsible for Tablets 768px-1024px) */}
      <aside
        className={cn(
          'bg-charcoal-card border-r border-border/60 transition-all duration-300 flex flex-col justify-between shrink-0 z-30',
          isCollapsed ? 'w-20' : 'w-64'
        )}
      >
        <div className="p-4 space-y-6">
          {/* Logo Bar */}
          <div className="flex items-center justify-between h-12">
            {!isCollapsed && <Logo variant="brass" href="/staff" />}
            {isCollapsed && (
              <div className="w-10 h-10 rounded-full bg-felt border border-brass flex items-center justify-center font-bold text-brass mx-auto">
                CN
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex text-muted-foreground hover:text-white"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </Button>
          </div>

          {/* Navigation Links (Tablet Touch Targets 48px+) */}
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={cn(
                      'flex items-center gap-3 px-3.5 h-12 rounded-xl text-sm font-semibold transition-all cursor-pointer',
                      isActive
                        ? 'bg-brass text-charcoal shadow-md font-bold'
                        : 'text-stone hover:bg-muted/30 hover:text-white'
                    )}
                  >
                    <Icon className={cn('w-5 h-5 shrink-0', isActive ? 'text-charcoal' : 'text-brass')} />
                    {!isCollapsed && <span>{item.label}</span>}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer User Badge */}
        <div className="p-4 border-t border-border/40 space-y-3">
          {!isCollapsed && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-felt text-brass text-xs font-bold">
                    {userName ? userName[0] : 'S'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white leading-tight">
                    {userName}
                  </span>
                  <Badge variant="brass" className="text-[9px] px-1 py-0 uppercase w-fit">
                    {userRole}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Link href="/" className="flex-1">
              <Button variant="outline" size="sm" className="w-full text-xs h-10 border-border/50 text-stone">
                <Store className="w-4 h-4 mr-1" /> {!isCollapsed && 'Public Site'}
              </Button>
            </Link>
            <Button
              variant="destructive"
              size="icon"
              className="h-10 w-10 shrink-0"
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Staff Dashboard Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-16 bg-charcoal-card border-b border-border/60 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-display font-bold text-lg text-white">
              Staff Operations Portal
            </span>
            <Badge variant="felt" className="text-xs border-emerald-500/40 text-emerald-400">
              Live Terminal
            </Badge>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-stone font-mono hidden sm:inline">
              Shift: Morning / Afternoon
            </span>
            <Link href="/kitchen">
              <Button variant="outline" size="sm" className="border-brass/40 text-brass hover:bg-brass/10 h-9">
                <ChefHat className="w-4 h-4 mr-1.5" /> KDS Fullscreen
              </Button>
            </Link>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
