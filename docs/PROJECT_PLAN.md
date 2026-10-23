# Cue Nation - Project Plan & Specification

## §1. Roles & Permissions Matrix
Cue Nation defines three core user roles:
1. **Customer (`customer`)**:
   - Access to Public Site (`/`), `/book`, `/profile`.
   - Can view tables, menu, prices, and personal booking history.
   - Cannot access `/staff` or `/owner`.
2. **Staff / Manager (`staff`)**:
   - Access to Staff Dashboard (`/staff`, `/staff/bookings`, `/staff/orders`, `/staff/menu`, `/kitchen`).
   - Can manage live floor tables, track ongoing sessions, view orders, update kitchen statuses.
   - Cannot access `/owner`.
3. **Owner / Admin (`owner`)**:
   - Full access across all platforms: `/owner` (Overview, Reports, Expenses, Calendar, Settings) AND `/staff` area ("Open Staff View").
   - Access to revenue metrics, financial analytics, report exports, staff permissions, and venue settings.

---

## §2. System Architecture & Tech Stack (Roadmap)
- **Framework**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, CSS Variables, shadcn/ui components
- **Icons**: Lucide React
- **Typography**: Playfair Display (headings), Inter (body, UI, tabular numbers)
- **State & Database (Stage 1+)**: Supabase Auth, PostgreSQL, Realtime Subscriptions
- **Stage 0 Scope**: Project Skeleton, "Felt & Brass" Design System, Public/Staff/Owner Layout Shells, Seed Data, Mock Authentication, Route Protection via Middleware.

---

## §3. Stage Roadmap Overview
- **Stage 0 (Current)**: Foundation & Skeleton, Design System, Mock Auth & Protection, Shell Layouts & Seed Data.
- **Stage 1**: Supabase Database Integration, Real Google & Email/Password Auth, Table Session Timers.
- **Stage 2**: Real-time Table Session Timers & Live Billing, Kitchen Display System (KDS) sockets.
- **Stage 3**: Customer Booking Engine, Slot Selection, Payment Gateway (Razorpay/Stripe).
- **Stage 4**: QR Code Tabletop Café Ordering & Staff Order Execution.
- **Stage 5**: Analytics, Revenue Reports & Financial Exports (PDF/Excel).

---

## §4. Design System ("Felt & Brass")
- **Theme Concept**: Inspired by classic billiards green baize felt, polished brass accents, rich dark charcoal surfaces for staff environments, and elegant warm ivory for customer facing pages.
- **Color Tokens**:
  - `felt` (#0F3D2E) - Primary felt green
  - `felt-dark` (#0A2A20) - Deep felt green hover
  - `brass` (#C9A24B) - Accent gold
  - `brass-dark` (#B08A35) - Deep brass gold hover
  - `charcoal` (#12161A) - Dark surface background
  - `charcoal-card` (#1B2128) - Dark card container background
  - `ivory` (#F7F4EC) - Public light background
  - `white` (#FFFFFF) - Light card surface background
  - `ink` (#1A1F24) - Text color on light theme
  - `stone` (#6B7280) - Muted secondary text
  - `success` (#2E9E6B) - Free table / success indicator
  - `warning` (#E0A526) - Booked soon / warning indicator
  - `danger` (#B23A48) - Maintenance / cue red indicator
  - `info` (#3B82C4) - Chalk blue indicator
- **Typography Rules**:
  - Display Font: `Playfair Display`, serif (Titles, Headings, Branding).
  - Body & UI Font: `Inter`, sans-serif (Body, Inputs, Buttons, Data Tables).
  - Timers & Numbers: `Inter` with `tabular-nums` class to prevent layout jitter.
- **Border Radius**:
  - `rounded-xl` (14px) for small items/badges/inputs.
  - `rounded-2xl` (20px) for cards, modals, and container shells.

---

## §5. Data Model (TypeScript Schema)
```ts
export type UserRole = 'customer' | 'staff' | 'owner';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  phone?: string;
}

export type TableType = 'pool' | 'snooker';
export type TableStatus = 'free' | 'booked' | 'running' | 'maintenance';

export interface Table {
  id: string;
  name: string;
  type: TableType;
  status: TableStatus;
  hourlyRate: number;
  qrCodeUrl: string;
  currentSession?: {
    startTime: string; // ISO string
    elapsedSeconds: number;
    customerName?: string;
  };
}

export interface SlotPrice {
  id: string;
  tableType: TableType;
  slotName: string; // e.g. Morning, Afternoon, Evening, Night
  timeRange: string; // e.g. 10:00 - 14:00
  pricePerHour: number; // in INR (₹)
}

export type MenuItemCategory = 'Snacks' | 'Beverages' | 'Meals' | 'Desserts';

export interface MenuItem {
  id: string;
  name: string;
  category: MenuItemCategory;
  price: number; // in INR (₹)
  description: string;
  available: boolean;
  imageUrl?: string;
}

export type OrderStatus = 'new' | 'preparing' | 'served' | 'cancelled';

export interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  tableId: string;
  tableName: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
}

export interface Booking {
  id: string;
  tableId: string;
  tableName: string;
  customerName: string;
  customerPhone: string;
  date: string;
  slot: string;
  status: 'confirmed' | 'completed' | 'cancelled';
  totalAmount: number;
}

export interface Expense {
  id: string;
  title: string;
  category: string;
  amount: number;
  date: string;
}
```

---

## §6. Detailed Layouts & UI Specifications

### A. Public Website (`app/(public)`)
- **Theme**: Light Ivory (`#F7F4EC`) + Felt Green & Brass Accents.
- **Navbar**: Sticky logo, links (`Tables`, `Café`, `About`), Login button, and gold "Book Now" CTA button. Mobile menu via sheet drawer.
- **Home Page**:
  1. **Hero**: Felt green background, Playfair Display title, subline, Gold CTA button.
  2. **Our Tables Carousel**: Horizontal scroll snap cards for Pool & Snooker.
  3. **Café Highlights**: Grid of food & beverage items with INR pricing.
  4. **About Us**: Story section with image placeholder.
- **`/book`**: 3-step static stepper (1. Table -> 2. Time Slot -> 3. Details) with sticky price summary bar.
- **`/profile`**: Customer dashboard shell (My Bookings, Active Session, Orders).

### B. Staff Dashboard (`app/staff` & `/kitchen`)
- **Theme**: Dark Charcoal (`#12161A` & `#1B2128`) with high contrast touch targets (48px+).
- **Navigation**: Sidebar with Floor Grid, Bookings, Orders, Menu management. Top bar with profile badge and Logout.
- **`/staff` Floor**: 6 Table tiles with real-time status color badges, tabular timers, session control triggers.
- **`/kitchen`**: Fullscreen dark KDS shell with New, Preparing, Served columns.

### C. Owner Dashboard (`app/owner`)
- **Theme**: Clean Light Theme with structured metrics & financial analytics.
- **Navigation**: Sidebar with Overview, Reports, Expenses, Calendar, Settings, and "Open Staff View" switch.
- **`/owner` Overview**: 4 StatCards, Recharts revenue bar chart, monthly calendar overview.
- **`/owner/reports`**: Data table view with simulated PDF and Excel export triggers.

---

## §7. Stage 0 Deliverables Checklists
- [x] Next.js App Router + TypeScript + Tailwind CSS
- [x] Design System variables & Tailwind tokens
- [x] Shared components: `TableStatusBadge`, `TableTile`, `TimerDisplay`, `StatCard`, `PriceTag`, `SectionHeading`, `Logo`
- [x] Dev-only hidden preview page (`/design-system`)
- [x] Three complete Layouts (Public, Staff Dark, Owner Light)
- [x] Seed data (`/lib/seed.ts`) with typed models
- [x] Mock authentication (`/lib/auth.ts`) & role-based middleware (`/middleware.ts`)
- [x] Demo login credentials & quick autofill on `/login`
