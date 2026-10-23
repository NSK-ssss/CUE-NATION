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

export interface TableSession {
  startTime: string;
  elapsedSeconds: number;
  customerName?: string;
}

export interface Table {
  id: string;
  name: string;
  type: TableType;
  status: TableStatus;
  hourlyRate: number;
  qrCodeUrl: string;
  currentSession?: TableSession;
  nextBookingTime?: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  specs?: string[];
}

export interface SlotPrice {
  id: string;
  tableType: TableType;
  slotName: string;
  timeRange: string;
  pricePerHour: number;
}

export type MenuItemCategory = 'Snacks' | 'Beverages' | 'Meals' | 'Desserts';

export interface MenuItem {
  id: string;
  name: string;
  category: MenuItemCategory;
  price: number;
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

// Demo Users
export const DEMO_USERS: User[] = [
  {
    id: 'usr_customer',
    email: 'demo@cuenation.com',
    name: 'Alex Johnson',
    role: 'customer',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    phone: '+91 98765 43210',
  },
  {
    id: 'usr_staff',
    email: 'staff@cuenation.com',
    name: 'Rohan Sharma',
    role: 'staff',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    phone: '+91 98123 45678',
  },
  {
    id: 'usr_owner',
    email: 'owner@cuenation.com',
    name: 'Vikramaditya Roy',
    role: 'owner',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    phone: '+91 99000 11223',
  },
];

// Tables (4 Pool, 2 Snooker)
export const SEED_TABLES: Table[] = [
  {
    id: 'tbl_pool_1',
    name: 'Pool Table 1',
    subtitle: '8-Ball Championship',
    type: 'pool',
    status: 'free',
    hourlyRate: 300,
    qrCodeUrl: '/qr/pool-1.png',
    imageUrl: '/images/tables/pool-1.jpg',
    description: 'Tournament-spec 8ft slate table fitted with Simonis 860 worsted wool cloth and high-precision Aramith Pro balls.',
    specs: ['8ft Tournament Slate', 'Aramith Pro Balls', 'Simonis 860 Cloth'],
  },
  {
    id: 'tbl_pool_2',
    name: 'Pool Table 2',
    subtitle: 'English Classic',
    type: 'pool',
    status: 'running',
    hourlyRate: 300,
    qrCodeUrl: '/qr/pool-2.png',
    imageUrl: '/images/tables/pool-2.jpg',
    description: 'Classic 8ft English pool table with premium responsive rubber cushions and Canadian maple cues.',
    specs: ['8ft Solid Oak Frame', 'K55 Rubber Cushions', 'Classic Green Felt'],
    currentSession: {
      startTime: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      elapsedSeconds: 2700, // 45 mins
      customerName: 'Samir Gupta',
    },
  },
  {
    id: 'tbl_pool_3',
    name: 'Pool Table 3',
    subtitle: 'Tournament Arena',
    type: 'pool',
    status: 'booked',
    hourlyRate: 350,
    qrCodeUrl: '/qr/pool-3.png',
    imageUrl: '/images/tables/pool-3.jpg',
    description: 'Match-play arena table featuring low-glare overhead canopy lighting and laser-calibrated leveling.',
    specs: ['Overhead Pro Lighting', 'Drop Pockets', 'Laser-Leveled Slate'],
    nextBookingTime: '06:00 PM Today',
  },
  {
    id: 'tbl_pool_4',
    name: 'Pool Table 4',
    subtitle: 'VIP Private Salon',
    type: 'pool',
    status: 'free',
    hourlyRate: 400,
    qrCodeUrl: '/qr/pool-4.png',
    imageUrl: '/images/tables/pool-4.jpg',
    description: 'Private lounge booth with luxury leather seating, acoustic dampening, and dedicated café service.',
    specs: ['Private Salon Suite', 'Lounge Seating', 'Dedicated Server'],
  },
  {
    id: 'tbl_snooker_1',
    name: 'Snooker Table 1',
    subtitle: 'Riley Championship 12ft',
    type: 'snooker',
    status: 'running',
    hourlyRate: 500,
    qrCodeUrl: '/qr/snooker-1.png',
    imageUrl: '/images/tables/snooker-1.jpg',
    description: 'Official 12ft tournament table fitted with Strachan 6811 Gold cloth and precision steel block cushions.',
    specs: ['Official 12ft Tournament', 'Strachan 6811 Cloth', 'Steel Block Cushions'],
    currentSession: {
      startTime: new Date(Date.now() - 110 * 60 * 1000).toISOString(),
      elapsedSeconds: 6600, // 1 hr 50 mins
      customerName: 'Kabir & Friends',
    },
  },
  {
    id: 'tbl_snooker_2',
    name: 'Snooker Table 2',
    subtitle: 'Match Table 12ft',
    type: 'snooker',
    status: 'free',
    hourlyRate: 550,
    qrCodeUrl: '/qr/snooker-2.png',
    imageUrl: '/images/tables/snooker-2.jpg',
    description: 'Full-size 12ft championship match table with Northern rubber cushions and digital live scoreboard.',
    specs: ['12ft Full Size', 'Northern Rubber', 'Digital Scoreboard'],
  },
];

// Slot Pricing
export const SEED_PRICING: SlotPrice[] = [
  { id: 'p1', tableType: 'pool', slotName: 'Morning Warmup', timeRange: '10:00 AM - 02:00 PM', pricePerHour: 250 },
  { id: 'p2', tableType: 'pool', slotName: 'Afternoon Session', timeRange: '02:00 PM - 06:00 PM', pricePerHour: 300 },
  { id: 'p3', tableType: 'pool', slotName: 'Prime Evening', timeRange: '06:00 PM - 10:00 PM', pricePerHour: 380 },
  { id: 'p4', tableType: 'pool', slotName: 'Late Night Cue', timeRange: '10:00 PM - 02:00 AM', pricePerHour: 450 },

  { id: 's1', tableType: 'snooker', slotName: 'Morning Solo', timeRange: '10:00 AM - 02:00 PM', pricePerHour: 400 },
  { id: 's2', tableType: 'snooker', slotName: 'Afternoon Practice', timeRange: '02:00 PM - 06:00 PM', pricePerHour: 480 },
  { id: 's3', tableType: 'snooker', slotName: 'Prime Match Time', timeRange: '06:00 PM - 10:00 PM', pricePerHour: 600 },
  { id: 's4', tableType: 'snooker', slotName: 'Late Night Pro', timeRange: '10:00 PM - 02:00 AM', pricePerHour: 650 },
];

// Café Menu Items (12 Items across Snacks, Beverages, Meals, Desserts)
export const SEED_MENU: MenuItem[] = [
  {
    id: 'm1',
    name: 'Truffle Fries with Garlic Dip',
    category: 'Snacks',
    price: 240,
    description: 'Hand-cut golden fries tossed in French black truffle oil & parmesan.',
    available: true,
  },
  {
    id: 'm2',
    name: 'Chalk & Cue Loaded Nachos',
    category: 'Snacks',
    price: 320,
    description: 'Tortilla chips topped with melted cheddar, jalapeños, salsa & sour cream.',
    available: true,
  },
  {
    id: 'm3',
    name: 'Crispy Chicken Wings (6 pcs)',
    category: 'Snacks',
    price: 350,
    description: 'Tossed in smoked BBQ or fiery ghost pepper glaze.',
    available: true,
  },
  {
    id: 'm4',
    name: 'Artisanal Cold Brew Coffee',
    category: 'Beverages',
    price: 180,
    description: '18-hour slow-steeped Arabica coffee over carved ice block.',
    available: true,
  },
  {
    id: 'm5',
    name: 'Iced Matcha Green Tea Latte',
    category: 'Beverages',
    price: 220,
    description: 'Ceremonial Uji matcha whisked with oat milk & honey.',
    available: true,
  },
  {
    id: 'm6',
    name: 'Signature Cue Mojito (Non-Alc)',
    category: 'Beverages',
    price: 200,
    description: 'Fresh crushed mint, lime juice, brown sugar & sparkling soda.',
    available: true,
  },
  {
    id: 'm7',
    name: 'The Break Off Smash Burger',
    category: 'Meals',
    price: 420,
    description: 'Double tender beef patty, sharp cheddar, caramelized onions & secret sauce.',
    available: true,
  },
  {
    id: 'm8',
    name: 'Neapolitan Margherita Pizza',
    category: 'Meals',
    price: 480,
    description: 'Sourdough crust, San Marzano tomatoes, fresh mozzarella & basil.',
    available: true,
  },
  {
    id: 'm9',
    name: 'Grilled Chicken & Pesto Club Sandwich',
    category: 'Meals',
    price: 380,
    description: 'Triple-decker toasted brioche with herb chicken, bacon & pesto mayo.',
    available: true,
  },
  {
    id: 'm10',
    name: 'Warm Belgian Chocolate Brownie',
    category: 'Desserts',
    price: 260,
    description: 'Fudgy dark chocolate brownie served with vanilla bean gelato.',
    available: true,
  },
  {
    id: 'm11',
    name: 'Classic New York Cheesecake',
    category: 'Desserts',
    price: 290,
    description: 'Rich baked cheesecake topped with wild blueberry compote.',
    available: true,
  },
  {
    id: 'm12',
    name: 'Churros with Dark Chocolate Dip',
    category: 'Desserts',
    price: 250,
    description: 'Golden cinnamon-sugar dusted Spanish churros.',
    available: true,
  },
];

// Sample Orders
export const SEED_ORDERS: Order[] = [
  {
    id: 'ord_101',
    tableId: 'tbl_pool_2',
    tableName: 'Pool 2',
    items: [
      { menuItemId: 'm1', name: 'Truffle Fries with Garlic Dip', quantity: 1, price: 240 },
      { menuItemId: 'm4', name: 'Artisanal Cold Brew Coffee', quantity: 2, price: 180 },
    ],
    totalAmount: 600,
    status: 'new',
    createdAt: '10 mins ago',
  },
  {
    id: 'ord_102',
    tableId: 'tbl_snooker_1',
    tableName: 'Snooker 1',
    items: [
      { menuItemId: 'm7', name: 'The Break Off Smash Burger', quantity: 2, price: 420 },
      { menuItemId: 'm6', name: 'Signature Cue Mojito (Non-Alc)', quantity: 2, price: 200 },
    ],
    totalAmount: 1240,
    status: 'preparing',
    createdAt: '22 mins ago',
  },
  {
    id: 'ord_103',
    tableId: 'tbl_pool_3',
    tableName: 'Pool 3',
    items: [
      { menuItemId: 'm2', name: 'Chalk & Cue Loaded Nachos', quantity: 1, price: 320 },
    ],
    totalAmount: 320,
    status: 'served',
    createdAt: '45 mins ago',
  },
];

// Sample Bookings
export const SEED_BOOKINGS: Booking[] = [
  {
    id: 'bk_201',
    tableId: 'tbl_pool_3',
    tableName: 'Pool 3 (Tournament)',
    customerName: 'Karan Mehta',
    customerPhone: '+91 98200 11223',
    date: 'Today',
    slot: '06:00 PM - 08:00 PM',
    status: 'confirmed',
    totalAmount: 760,
  },
  {
    id: 'bk_202',
    tableId: 'tbl_snooker_1',
    tableName: 'Snooker 1',
    customerName: 'Siddharth Rao',
    customerPhone: '+91 97111 88990',
    date: 'Tomorrow',
    slot: '08:00 PM - 10:00 PM',
    status: 'confirmed',
    totalAmount: 1200,
  },
  {
    id: 'bk_203',
    tableId: 'tbl_pool_1',
    tableName: 'Pool 1',
    customerName: 'Ananya Deshmukh',
    customerPhone: '+91 98333 44556',
    date: 'Yesterday',
    slot: '04:00 PM - 06:00 PM',
    status: 'completed',
    totalAmount: 600,
  },
];

// Sample Expenses
export const SEED_EXPENSES: Expense[] = [
  { id: 'exp_1', title: 'New Aramith Tournament Pool Balls Set', category: 'Equipment Maintenance', amount: 14500, date: '2026-10-02' },
  { id: 'exp_2', title: 'Strachan 6811 Gold Tournament Cloth (Snooker 1)', category: 'Table Re-felting', amount: 32000, date: '2026-10-04' },
  { id: 'exp_3', title: 'Taom Pyro Blue Chalk Box (12 pcs)', category: 'Consumables', amount: 4800, date: '2026-10-05' },
  { id: 'exp_4', title: 'Arabica Coffee Beans Supply (10 kg)', category: 'Café Inventory', amount: 12500, date: '2026-10-06' },
];
