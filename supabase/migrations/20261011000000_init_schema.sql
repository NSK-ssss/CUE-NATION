-- Cue Nation Supabase Database Migration
-- Includes Schema, Indexes, Constraints, Triggers, RLS Policies, and Atomic RPC Functions

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'staff', 'owner')),
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. TABLES TABLE
CREATE TABLE IF NOT EXISTS public.tables (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('pool', 'snooker')),
    status TEXT NOT NULL DEFAULT 'free' CHECK (status IN ('free', 'booked', 'running', 'maintenance')),
    hourly_rate NUMERIC NOT NULL DEFAULT 300,
    image TEXT,
    qr_code_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. PRICING TABLE
CREATE TABLE IF NOT EXISTS public.pricing (
    id TEXT PRIMARY KEY,
    table_type TEXT NOT NULL CHECK (table_type IN ('pool', 'snooker')),
    slot_name TEXT NOT NULL,
    slot_start TIME NOT NULL,
    slot_end TIME NOT NULL,
    price_per_hour NUMERIC NOT NULL
);

-- 4. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.bookings (
    id TEXT PRIMARY KEY DEFAULT ('bk_' || gen_random_uuid()),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    table_id TEXT NOT NULL REFERENCES public.tables(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    slot_start TIME NOT NULL,
    slot_end TIME NOT NULL,
    status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'running', 'completed', 'cancelled', 'no_show')),
    source TEXT NOT NULL DEFAULT 'online' CHECK (source IN ('online', 'offline')),
    pin VARCHAR(6) NOT NULL,
    booking_code TEXT NOT NULL UNIQUE,
    amount NUMERIC NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- UNIQUE Partial Index to guarantee no double bookings at database level
CREATE UNIQUE INDEX IF NOT EXISTS unique_active_table_booking 
ON public.bookings (table_id, date, slot_start) 
WHERE status != 'cancelled';

-- 5. SESSIONS TABLE
CREATE TABLE IF NOT EXISTS public.sessions (
    id TEXT PRIMARY KEY DEFAULT ('sess_' || gen_random_uuid()),
    booking_id TEXT REFERENCES public.bookings(id) ON DELETE SET NULL,
    table_id TEXT NOT NULL REFERENCES public.tables(id) ON DELETE CASCADE,
    customer_name TEXT,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    extra_minutes INT DEFAULT 0,
    time_charge NUMERIC DEFAULT 0
);

-- 6. MENU ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.menu_items (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Snacks', 'Beverages', 'Meals', 'Desserts')),
    price NUMERIC NOT NULL,
    description TEXT,
    available BOOLEAN NOT NULL DEFAULT TRUE,
    image_url TEXT
);

-- 7. ORDERS, ORDER_ITEMS & BILLS TABLES
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY DEFAULT ('ord_' || gen_random_uuid()),
    session_id TEXT REFERENCES public.sessions(id) ON DELETE SET NULL,
    table_id TEXT REFERENCES public.tables(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    table_name TEXT NOT NULL,
    total_amount NUMERIC NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'preparing', 'served', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    menu_item_id TEXT REFERENCES public.menu_items(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    price NUMERIC NOT NULL
);

CREATE TABLE IF NOT EXISTS public.bills (
    id TEXT PRIMARY KEY DEFAULT ('bill_' || gen_random_uuid()),
    session_id TEXT REFERENCES public.sessions(id) ON DELETE SET NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    time_charge NUMERIC NOT NULL DEFAULT 0,
    food_charge NUMERIC NOT NULL DEFAULT 0,
    tax_amount NUMERIC NOT NULL DEFAULT 0,
    total_amount NUMERIC NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'paid')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bills ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Profiles: read/write own profile, staff/owner read all
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('staff', 'owner')));
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Tables: Everyone can read, staff/owner write
CREATE POLICY "Tables public read" ON public.tables FOR SELECT USING (true);
CREATE POLICY "Tables staff write" ON public.tables FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('staff', 'owner')));

-- Pricing: Everyone can read
CREATE POLICY "Pricing public read" ON public.pricing FOR SELECT USING (true);

-- Menu Items: Everyone can read
CREATE POLICY "Menu public read" ON public.menu_items FOR SELECT USING (true);

-- Bookings: Customer read/write own, staff/owner read/write all
CREATE POLICY "Bookings user read" ON public.bookings FOR SELECT USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('staff', 'owner')));
CREATE POLICY "Bookings user insert" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('staff', 'owner')));
CREATE POLICY "Bookings user update" ON public.bookings FOR UPDATE USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('staff', 'owner')));

-- Sessions: Public read active, staff manage
CREATE POLICY "Sessions read" ON public.sessions FOR SELECT USING (true);
CREATE POLICY "Sessions staff manage" ON public.sessions FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('staff', 'owner')));

-- AUTOMATIC PROFILE CREATION TRIGGER ON AUTH SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role, phone, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer'),
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ATOMIC BOOKING CREATION RPC FUNCTION
CREATE OR REPLACE FUNCTION public.create_booking_atomic(
  p_user_id UUID,
  p_table_id TEXT,
  p_date DATE,
  p_slot_start TIME,
  p_slot_end TIME,
  p_customer_name TEXT,
  p_customer_phone TEXT,
  p_amount NUMERIC,
  p_booking_code TEXT,
  p_pin VARCHAR(6)
)
RETURNS JSONB AS $$
DECLARE
  v_existing INT;
  v_booking_id TEXT;
BEGIN
  -- Check if slot is already booked
  SELECT COUNT(*) INTO v_existing
  FROM public.bookings
  WHERE table_id = p_table_id
    AND date = p_date
    AND slot_start = p_slot_start
    AND status != 'cancelled';

  IF v_existing > 0 THEN
    RETURN jsonb_build_object('success', false, 'message', 'This slot has already been reserved by another customer.');
  END IF;

  v_booking_id := 'bk_' || lower(substring(md5(random()::text) from 1 for 8));

  INSERT INTO public.bookings (
    id, user_id, table_id, date, slot_start, slot_end, 
    status, source, pin, booking_code, amount, customer_name, customer_phone
  ) VALUES (
    v_booking_id, p_user_id, p_table_id, p_date, p_slot_start, p_slot_end,
    'confirmed', 'online', p_pin, p_booking_code, p_amount, p_customer_name, p_customer_phone
  );

  RETURN jsonb_build_object('success', true, 'booking_id', v_booking_id);
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('success', false, 'message', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
