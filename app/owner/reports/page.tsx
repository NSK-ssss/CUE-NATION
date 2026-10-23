'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { SEED_BOOKINGS } from '@/lib/seed';
import { Download, FileSpreadsheet, FileText, Search, Filter } from 'lucide-react';

export default function OwnerReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground">
            Financial &amp; Revenue Reports
          </h1>
          <p className="text-xs text-stone mt-1">
            Audit table session earnings, slot breakdown, and tax statements.
          </p>
        </div>

        {/* Disabled Export PDF and Export Excel Buttons as specified */}
        <div className="flex items-center gap-2">
          <Button variant="outline" disabled className="text-xs opacity-60 cursor-not-allowed">
            <FileText className="w-4 h-4 mr-1.5" /> Export PDF (Stage 5)
          </Button>
          <Button variant="outline" disabled className="text-xs opacity-60 cursor-not-allowed">
            <FileSpreadsheet className="w-4 h-4 mr-1.5" /> Export Excel (Stage 5)
          </Button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-2xl bg-white border border-border/80">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-stone" />
          <Input placeholder="Filter by customer, booking ID, or table..." className="pl-9" />
        </div>
        <Button variant="outline" className="text-xs font-semibold">
          <Filter className="w-4 h-4 mr-1.5" /> Date Range: Oct 2026
        </Button>
      </div>

      {/* Data Table */}
      <Card className="border-border/80 bg-white shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm font-sans">
              <thead className="bg-muted/50 border-b border-border text-xs uppercase font-semibold text-stone">
                <tr>
                  <th className="p-4">Booking ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Table</th>
                  <th className="p-4">Time Slot</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Revenue (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {SEED_BOOKINGS.map((row) => (
                  <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-mono text-xs font-bold text-stone">{row.id}</td>
                    <td className="p-4 font-semibold text-foreground">{row.customerName}</td>
                    <td className="p-4 font-display">{row.tableName}</td>
                    <td className="p-4 text-stone text-xs">{row.slot}</td>
                    <td className="p-4">
                      <Badge variant="brass" className="uppercase text-[10px]">
                        {row.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-right font-bold font-sans tabular-nums text-brass">
                      ₹{row.totalAmount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
