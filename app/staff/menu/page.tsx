'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PriceTag } from '@/components/shared/PriceTag';
import { SEED_MENU } from '@/lib/seed';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function StaffMenuPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-white">
            Café Menu Catalog
          </h1>
          <p className="text-xs text-stone mt-1">
            Manage food and beverage items, pricing, and availability.
          </p>
        </div>

        <Button
          variant="default"
          className="font-bold"
          onClick={() => toast.info('Add New Menu Item (Stage 4 feature)')}
        >
          <Plus className="w-4 h-4 mr-1.5" /> Add Menu Item
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-3 text-stone" />
        <Input
          placeholder="Search menu items or categories..."
          className="pl-9 bg-charcoal-card border-border/60 text-white"
        />
      </div>

      {/* Menu Items Table / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SEED_MENU.map((item) => (
          <Card key={item.id} className="bg-charcoal-card border-border/60 hover:border-brass/40">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <Badge variant="outline" className="uppercase text-[10px] font-mono border-stone/40 text-stone">
                  {item.category}
                </Badge>
                <Badge variant="free" className="text-[10px]">
                  Available
                </Badge>
              </div>

              <div>
                <h3 className="font-display font-bold text-base text-white">
                  {item.name}
                </h3>
                <p className="text-xs text-stone mt-1 line-clamp-2">
                  {item.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border/40">
                <PriceTag amount={item.price} unit="" size="md" />

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-stone hover:text-white"
                    onClick={() => toast.info(`Editing ${item.name}`)}
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-rose-400 hover:text-rose-300"
                    onClick={() => toast.error(`Delete item coming in Stage 4`)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
