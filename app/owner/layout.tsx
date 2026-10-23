'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Logo } from '@/components/shared/Logo';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  BarChart3,
  FileSpreadsheet,
  Receipt,
  Calendar,
  Settings,
  LogOut,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Store,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userName, setUserName] = useState<string | null>('Vikramaditya Roy');

  useEffect(() => {
    const getCookie = (name: string) => {
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      return match ? decodeURIComponent(match[2]) : null;
    };
    setUserName(getCookie('cue_user_name') || 'Owner Admin');
  }, []);

  const handleLogout = () => {
    document.cookie = 'cue_user_role=; path=/; max-age=0';
    document.cookie = 'cue_user_email=; path=/; max-age=0';
    document.cookie = 'cue_user_name=; path=/; max-age=0';
    toast.info('Logged out from owner dashboard');
    router.push('/login');
    router.refresh();
  };

  const navItems = [
    { label: 'Overview', href: '/owner', icon: BarChart3 },
    { label: 'Reports', href: '/owner/reports', icon: FileSpreadsheet },
    { label: 'Expenses', href: '/owner/expenses', icon: Receipt },
    { label: 'Calendar', href: '/owner/calendar', icon: Calendar },
    { label: 'Settings', href: '/owner/settings', icon: Settings },
  ];

  return (
    <div className="bg-ivory/85 text-ink min-h-screen flex flex-col md:flex-row antialiased backdrop-blur-[2px]">
      {/* Light Sidebar */}
      <aside
        className={cn(
          'bg-white border-r border-border/70 transition-all duration-300 flex flex-col justify-between shrink-0 z-30 shadow-sm',
          isCollapsed ? 'w-20' : 'w-64'
        )}
      >
        <div className="p-4 space-y-6">
          {/* Logo Bar */}
          <div className="flex items-center justify-between h-12">
            {!isCollapsed && <Logo variant="dark" href="/owner" />}
            {isCollapsed && (
              <div className="w-10 h-10 rounded-full bg-brass text-charcoal flex items-center justify-center font-bold mx-auto">
                CN
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex text-stone hover:text-foreground"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </Button>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={cn(
                      'flex items-center gap-3 px-3.5 h-11 rounded-xl text-sm font-semibold transition-all cursor-pointer',
                      isActive
                        ? 'bg-felt text-white shadow-sm font-bold'
                        : 'text-stone hover:bg-muted/50 hover:text-foreground'
                    )}
                  >
                    <Icon className={cn('w-5 h-5 shrink-0', isActive ? 'text-brass' : 'text-stone')} />
                    {!isCollapsed && <span>{item.label}</span>}
                  </div>
                </Link>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-border/50">
            {/* Open Staff View Switch */}
            <Link href="/staff">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-brass/10 hover:bg-brass/20 text-brass-dark border border-brass/30 cursor-pointer font-bold text-xs transition-colors">
                <Store className="w-4 h-4 shrink-0 text-brass" />
                {!isCollapsed && (
                  <span className="flex items-center justify-between w-full">
                    Open Staff View <ExternalLink className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>
            </Link>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border/70 space-y-3">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-brass text-charcoal font-bold text-xs">
                  {userName ? userName[0] : 'O'}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-foreground leading-tight">
                  {userName}
                </span>
                <Badge variant="brass" className="text-[9px] px-1 py-0 uppercase w-fit">
                  Owner Admin
                </Badge>
              </div>
            </div>
          )}

          <Button
            variant="outline"
            className="w-full text-xs h-10 border-border text-rose-600 hover:bg-rose-50"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-1.5" /> {!isCollapsed && 'Logout'}
          </Button>
        </div>
      </aside>

      {/* Main Content Body */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-border/70 px-6 flex items-center justify-between shrink-0 shadow-2xs">
          <div className="flex items-center gap-3">
            <span className="font-display font-bold text-lg text-foreground">
              Owner Management &amp; Financial Analytics
            </span>
            <Badge variant="felt" className="text-xs">
              Venue Admin
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="outline" size="sm" className="text-xs h-9">
                View Public Site
              </Button>
            </Link>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
