'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SEED_ORDERS, OrderStatus } from '@/lib/seed';
import { UtensilsCrossed, CheckCircle2, Clock, Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function StaffOrdersPage() {
  const newOrders = SEED_ORDERS.filter((o) => o.status === 'new');
  const preparingOrders = SEED_ORDERS.filter((o) => o.status === 'preparing');
  const servedOrders = SEED_ORDERS.filter((o) => o.status === 'served');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-white">
            Table-side Order Management
          </h1>
          <p className="text-xs text-stone mt-1">
            Real-time KDS tickets ordered via QR code at pool and snooker tables.
          </p>
        </div>

        <Button
          variant="default"
          className="font-bold"
          onClick={() => toast.info('Add Staff Table Order')}
        >
          <Plus className="w-4 h-4 mr-1.5" /> Take Staff Order
        </Button>
      </div>

      {/* 3 Columns: New / Preparing / Served */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Column 1: New Orders */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-rose-500/10 border border-rose-500/30">
            <span className="font-display font-bold text-rose-400 text-sm">
              NEW ORDERS ({newOrders.length})
            </span>
            <Badge variant="destructive" className="animate-pulse">
              Needs Kitchen Action
            </Badge>
          </div>

          <div className="space-y-3">
            {newOrders.map((order) => (
              <Card key={order.id} className="bg-charcoal-card border-rose-500/40 shadow-md">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-border/40 pb-2">
                    <span className="font-bold text-brass">{order.tableName}</span>
                    <span className="text-xs text-stone">{order.createdAt}</span>
                  </div>

                  <ul className="text-xs space-y-1 text-ivory/90">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="flex justify-between">
                        <span>{item.quantity}x {item.name}</span>
                        <span className="font-mono">₹{item.price * item.quantity}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-between pt-2 border-t border-border/40">
                    <span className="font-sans font-bold text-sm text-brass">
                      Total: ₹{order.totalAmount}
                    </span>
                    <Button
                      size="sm"
                      variant="default"
                      className="text-xs font-bold"
                      onClick={() => toast.success(`Order ${order.id} sent to kitchen preparing stage`)}
                    >
                      Accept Order
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Column 2: Preparing */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
            <span className="font-display font-bold text-amber-400 text-sm">
              PREPARING ({preparingOrders.length})
            </span>
            <Badge variant="booked">In Kitchen</Badge>
          </div>

          <div className="space-y-3">
            {preparingOrders.map((order) => (
              <Card key={order.id} className="bg-charcoal-card border-amber-500/40">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-border/40 pb-2">
                    <span className="font-bold text-brass">{order.tableName}</span>
                    <span className="text-xs text-stone">{order.createdAt}</span>
                  </div>

                  <ul className="text-xs space-y-1 text-ivory/90">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="flex justify-between">
                        <span>{item.quantity}x {item.name}</span>
                        <span className="font-mono">₹{item.price * item.quantity}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-between pt-2 border-t border-border/40">
                    <span className="font-sans font-bold text-sm text-brass">
                      Total: ₹{order.totalAmount}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs border-emerald-500 text-emerald-400 hover:bg-emerald-500/10"
                      onClick={() => toast.success(`Order ${order.id} marked as Served`)}
                    >
                      Mark Ready &amp; Serve
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Column 3: Served */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
            <span className="font-display font-bold text-emerald-400 text-sm">
              SERVED ({servedOrders.length})
            </span>
            <Badge variant="free">Completed</Badge>
          </div>

          <div className="space-y-3">
            {servedOrders.map((order) => (
              <Card key={order.id} className="bg-charcoal-card border-border/40 opacity-80">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-border/40 pb-2">
                    <span className="font-bold text-brass">{order.tableName}</span>
                    <span className="text-xs text-stone">{order.createdAt}</span>
                  </div>

                  <ul className="text-xs space-y-1 text-stone">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="flex justify-between">
                        <span>{item.quantity}x {item.name}</span>
                        <span className="font-mono">₹{item.price * item.quantity}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-between pt-2 border-t border-border/40">
                    <span className="font-sans font-bold text-sm text-stone">
                      Total: ₹{order.totalAmount}
                    </span>
                    <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Served
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
