'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SEED_EXPENSES } from '@/lib/seed';
import { Plus, Receipt, Wallet } from 'lucide-react';
import { toast } from 'sonner';

export default function OwnerExpensesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground">
            Venue Expense Ledger
          </h1>
          <p className="text-xs text-stone mt-1">
            Track cloth re-felting, cue maintenance, chalk, and café supplies.
          </p>
        </div>

        <Button
          variant="default"
          className="font-bold"
          onClick={() => toast.info('Add New Expense Entry (Stage 5 Feature)')}
        >
          <Plus className="w-4 h-4 mr-1.5" /> Log Expense
        </Button>
      </div>

      <div className="space-y-3">
        {SEED_EXPENSES.map((exp) => (
          <Card key={exp.id} className="border-border/80 bg-white">
            <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="uppercase text-[10px]">
                    {exp.category}
                  </Badge>
                  <span className="text-xs text-stone">{exp.date}</span>
                </div>
                <h3 className="font-display font-bold text-lg text-foreground">
                  {exp.title}
                </h3>
              </div>

              <div className="text-right">
                <span className="text-xs text-stone block">Amount Paid</span>
                <span className="font-sans font-bold text-lg text-rose-600 tabular-nums">
                  ₹{exp.amount.toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
