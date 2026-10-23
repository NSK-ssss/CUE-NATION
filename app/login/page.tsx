'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/shared/Logo';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { authenticateUser, AUTH_COOKIE_ROLE, AUTH_COOKIE_EMAIL, AUTH_COOKIE_NAME } from '@/lib/auth';
import { DEMO_USERS, UserRole } from '@/lib/seed';
import { LogIn, Lock, Mail, ShieldAlert, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    const result = authenticateUser(email, password);

    if (!result.success || !result.user) {
      setErrorMsg(result.error || 'Authentication failed');
      toast.error('Login Failed', { description: result.error });
      setIsLoading(false);
      return;
    }

    // Store mock cookies for 7 days
    document.cookie = `${AUTH_COOKIE_ROLE}=${result.user.role}; path=/; max-age=604800; SameSite=Lax`;
    document.cookie = `${AUTH_COOKIE_EMAIL}=${result.user.email}; path=/; max-age=604800; SameSite=Lax`;
    document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(result.user.name)}; path=/; max-age=604800; SameSite=Lax`;

    toast.success(`Welcome back, ${result.user.name}!`, {
      description: `Logged in as ${result.user.role.toUpperCase()}`,
    });

    // Redirect to specified area
    const destination = result.redirectTo || '/';
    router.push(destination);
    router.refresh();
  };

  const autofillDemoAccount = (role: UserRole) => {
    if (role === 'customer') {
      setEmail('demo@cuenation.com');
      setPassword('Demo@123');
    } else if (role === 'staff') {
      setEmail('staff@cuenation.com');
      setPassword('Staff@123');
    } else if (role === 'owner') {
      setEmail('owner@cuenation.com');
      setPassword('Owner@123');
    }
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-ivory dark:bg-charcoal flex flex-col justify-center items-center p-4 relative overflow-hidden felt-texture-bg">
      {/* Background Cue Ball Accents */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-felt/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-brass/20 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Logo Container */}
        <div className="flex flex-col items-center justify-center text-center space-y-2">
          <Logo href="/" showSubtitle className="scale-110 mb-2" />
          <h1 className="font-display text-2xl font-bold text-foreground">
            Sign In to Cue Nation
          </h1>
          <p className="text-xs text-stone">
            Select a role or enter your credentials to access your dashboard.
          </p>
        </div>

        {/* Login Form Card */}
        <Card className="border-border/80 shadow-xl bg-card">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl font-display">Account Login</CardTitle>
            <CardDescription className="text-xs">
              Enter your email and password below to log in.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@cuenation.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-semibold">
                    Password
                  </Label>
                  <span className="text-[11px] text-brass hover:underline cursor-pointer">
                    Forgot password?
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="default"
                className="w-full h-11 font-semibold text-base mt-2 shadow-md"
                disabled={isLoading}
              >
                {isLoading ? (
                  'Signing in...'
                ) : (
                  <span className="flex items-center gap-2">
                    Sign In <LogIn className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground font-medium">Or</span>
              </div>
            </div>

            {/* Disabled Google Login Button as specified */}
            <Button
              variant="outline"
              disabled
              className="w-full h-10 text-xs text-muted-foreground cursor-not-allowed bg-muted/30"
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google (coming in Stage 1)
            </Button>
          </CardContent>

          {/* Quick Demo Autofill Helper */}
          <CardFooter className="bg-muted/40 border-t border-border/50 p-4 flex flex-col gap-2 rounded-b-2xl">
            <span className="text-xs font-semibold text-foreground flex items-center gap-1">
              Demo Accounts Helper (Click to autofill):
            </span>
            <div className="grid grid-cols-3 gap-2 w-full">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs h-9 flex items-center justify-between px-2 bg-background hover:border-brass"
                onClick={() => autofillDemoAccount('customer')}
              >
                <span>Customer</span>
                <Badge variant="secondary" className="text-[10px] px-1 py-0">
                  Fill
                </Badge>
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs h-9 flex items-center justify-between px-2 bg-background hover:border-brass"
                onClick={() => autofillDemoAccount('staff')}
              >
                <span>Staff</span>
                <Badge variant="secondary" className="text-[10px] px-1 py-0">
                  Fill
                </Badge>
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs h-9 flex items-center justify-between px-2 bg-background hover:border-brass"
                onClick={() => autofillDemoAccount('owner')}
              >
                <span>Owner</span>
                <Badge variant="secondary" className="text-[10px] px-1 py-0">
                  Fill
                </Badge>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
