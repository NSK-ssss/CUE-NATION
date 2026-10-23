'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/shared/Logo';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AUTH_COOKIE_ROLE, AUTH_COOKIE_EMAIL, AUTH_COOKIE_NAME } from '@/lib/auth';
import { UserRole } from '@/lib/seed';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { UserPlus, Lock, Mail, User, Phone, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('customer');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              phone,
              role,
            },
          },
        });

        if (error) throw error;
      }

      // Store auth cookies for session
      document.cookie = `${AUTH_COOKIE_ROLE}=${role}; path=/; max-age=604800; SameSite=Lax`;
      document.cookie = `${AUTH_COOKIE_EMAIL}=${email}; path=/; max-age=604800; SameSite=Lax`;
      document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(name)}; path=/; max-age=604800; SameSite=Lax`;

      toast.success('Account created successfully!', {
        description: `Welcome to Cue Nation, ${name}!`,
      });

      const redirectPath = role === 'staff' ? '/staff' : role === 'owner' ? '/owner' : '/';
      router.push(redirectPath);
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Sign up failed';
      setErrorMsg(message);
      toast.error('Sign Up Error', { description: message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signInWithOAuth({ provider: 'google' });
    } else {
      // Demo Google Auth Simulation
      document.cookie = `${AUTH_COOKIE_ROLE}=customer; path=/; max-age=604800; SameSite=Lax`;
      document.cookie = `${AUTH_COOKIE_EMAIL}=alex.google@example.com; path=/; max-age=604800; SameSite=Lax`;
      document.cookie = `${AUTH_COOKIE_NAME}=Alex%20Google; path=/; max-age=604800; SameSite=Lax`;
      toast.success('Signed in with Google (Demo mode)');
      router.push('/');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-ivory dark:bg-charcoal flex flex-col justify-center items-center p-4 relative overflow-hidden felt-texture-bg">
      <div className="w-full max-w-md relative z-10 space-y-6">
        <div className="flex flex-col items-center justify-center text-center space-y-2">
          <Logo href="/" showSubtitle className="scale-110 mb-2" />
          <h1 className="font-display text-2xl font-bold text-foreground">
            Create an Account
          </h1>
          <p className="text-xs text-stone">
            Join Cue Nation to book pool tables &amp; track play sessions.
          </p>
        </div>

        <Card className="border-border/80 shadow-xl bg-card">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl font-display">Sign Up</CardTitle>
            <CardDescription className="text-xs">
              Fill in your details below to register.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSignUpSubmit} className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="name" className="text-xs font-semibold">Full Name</Label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Alex Johnson"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="email" className="text-xs font-semibold">Email Address</Label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="alex@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="phone" className="text-xs font-semibold">Phone Number</Label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="password" className="text-xs font-semibold">Password</Label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9"
                    minLength={6}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="default"
                className="w-full h-11 font-semibold text-base mt-3 shadow-md"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : (
                  <span className="flex items-center gap-2">
                    Create Account <UserPlus className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>

            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground font-medium">Or</span>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={handleGoogleSignUp}
              className="w-full h-10 text-xs font-medium border-border"
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              Sign up with Google
            </Button>
          </CardContent>

          <CardFooter className="bg-muted/40 border-t border-border/50 p-4 text-center justify-center text-xs rounded-b-2xl">
            <span>Already have an account? </span>
            <Link href="/login" className="text-brass font-bold hover:underline ml-1">
              Sign In
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
