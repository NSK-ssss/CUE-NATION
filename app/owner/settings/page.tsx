'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Shield, Sliders, Store, Database } from 'lucide-react';
import { toast } from 'sonner';

export default function OwnerSettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground">
          Venue &amp; System Settings
        </h1>
        <p className="text-xs text-stone mt-1">
          Configure venue operating hours, table pricing rates, staff roles, and integrations.
        </p>
      </div>

      <div className="space-y-6">
        {/* Venue Information */}
        <Card className="border-border/80 bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-display flex items-center gap-2">
              <Store className="w-5 h-5 text-brass" /> Venue Branding &amp; Contact
            </CardTitle>
            <CardDescription className="text-xs">
              Displayed on customer public site and booking receipts.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Venue Name</Label>
                <Input defaultValue="Cue Nation Lounge & Café" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Support Phone</Label>
                <Input defaultValue="+91 99000 11223" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Address Line</Label>
              <Input defaultValue="124 Tournament Avenue, Indiranagar, Bengaluru, KA 560038" />
            </div>
          </CardContent>
        </Card>

        {/* System & Supabase Integration (Stage 1 roadmap) */}
        <Card className="border-border/80 bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-display flex items-center gap-2">
              <Database className="w-5 h-5 text-felt" /> Backend Integration Roadmap
            </CardTitle>
            <CardDescription className="text-xs">
              Stage 0 Mock Auth → Stage 1 Supabase Database & Auth Provider.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-4 rounded-xl bg-brass/10 border border-brass/30 flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-foreground block">Current Mode: Stage 0 Mock Auth</span>
                <span className="text-xs text-stone">Role-based cookie protection active</span>
              </div>
              <Badge variant="brass">Mock Active</Badge>
            </div>

            <Button
              variant="default"
              onClick={() => toast.success('Settings saved (Stage 0 shell)')}
              className="font-bold"
            >
              Save Configuration
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
