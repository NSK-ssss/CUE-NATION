import { Table, SEED_BOOKINGS } from './seed';

export interface TableSlot {
  id: string;
  time: string;
  shortTime: string;
  period: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  isBooked: boolean;
  bookedBy?: string;
}

export interface AvailableDateOption {
  dateStr: string;
  displayLabel: string;
  dayName: string;
  dayNumber: string;
  isToday: boolean;
  isTomorrow: boolean;
}

export const BASE_SLOTS: Omit<TableSlot, 'isBooked' | 'bookedBy'>[] = [
  { id: 's1', time: '10:00 AM - 12:00 PM', shortTime: '10:00 AM', period: 'Morning' },
  { id: 's2', time: '12:00 PM - 02:00 PM', shortTime: '12:00 PM', period: 'Afternoon' },
  { id: 's3', time: '02:00 PM - 04:00 PM', shortTime: '02:00 PM', period: 'Afternoon' },
  { id: 's4', time: '04:00 PM - 06:00 PM', shortTime: '04:00 PM', period: 'Evening' },
  { id: 's5', time: '06:00 PM - 08:00 PM', shortTime: '06:00 PM', period: 'Evening' },
  { id: 's6', time: '08:00 PM - 10:00 PM', shortTime: '08:00 PM', period: 'Night' },
  { id: 's7', time: '10:00 PM - 12:00 AM', shortTime: '10:00 PM', period: 'Night' },
];

/**
 * Returns the next N days starting from today for date-based availability checking.
 */
export function getAvailableDates(daysCount = 7): AvailableDateOption[] {
  const dates: AvailableDateOption[] = [];
  const today = new Date();

  for (let i = 0; i < daysCount; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];

    const displayLabel =
      i === 0
        ? 'Today'
        : i === 1
        ? 'Tomorrow'
        : d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

    dates.push({
      dateStr,
      displayLabel,
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: d.getDate().toString(),
      isToday: i === 0,
      isTomorrow: i === 1,
    });
  }

  return dates;
}

/**
 * Deterministic helper for realistic mock bookings on future dates.
 */
function getDeterministicBookedSlotIds(tableId: string, dateStr: string): string[] {
  // Simple reproducible hash
  let hash = 0;
  const str = `${tableId}-${dateStr}`;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  // Pool Table 3 on 4th day is fully booked to test the empty state
  if (tableId === 'tbl_pool_3' && absHash % 5 === 0) {
    return ['s1', 's2', 's3', 's4', 's5', 's6', 's7'];
  }

  const booked: string[] = [];
  // Prime slots are more likely booked
  if (absHash % 2 === 0) booked.push('s5'); // 06:00 PM - 08:00 PM
  if (absHash % 3 === 0) booked.push('s6'); // 08:00 PM - 10:00 PM
  if (absHash % 7 === 0) booked.push('s3'); // 02:00 PM - 04:00 PM
  if (absHash % 11 === 0) booked.push('s2'); // 12:00 PM - 02:00 PM

  return booked;
}

/**
 * Derives slot-by-slot availability for a table based on the selected date
 * and existing local bookings / live table state.
 */
export function getTableSlotAvailability(table: Table, dateStr: string): {
  slots: TableSlot[];
  availableCount: number;
  totalCount: number;
  isFullyBooked: boolean;
  isMaintenance: boolean;
  effectiveStatus: 'available' | 'running' | 'booked' | 'maintenance';
} {
  const isMaintenance = table.status === 'maintenance';

  if (isMaintenance) {
    const slots: TableSlot[] = BASE_SLOTS.map((slot) => ({
      ...slot,
      isBooked: true,
      bookedBy: 'Scheduled Maintenance',
    }));
    return {
      slots,
      availableCount: 0,
      totalCount: slots.length,
      isFullyBooked: true,
      isMaintenance: true,
      effectiveStatus: 'maintenance',
    };
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const isToday = dateStr === todayStr;
  const isTomorrow =
    new Date(Date.now() + 86400000).toISOString().split('T')[0] === dateStr;

  // 1. Gather confirmed bookings for this table from SEED_BOOKINGS
  const matchingBookings = SEED_BOOKINGS.filter((b) => {
    if (b.tableId !== table.id) return false;
    if (isToday && (b.date === 'Today' || b.date === dateStr)) return true;
    if (isTomorrow && (b.date === 'Tomorrow' || b.date === dateStr)) return true;
    return b.date === dateStr;
  });

  // 2. Deterministic bookings for this date
  const deterministicBooked = getDeterministicBookedSlotIds(table.id, dateStr);

  const slots: TableSlot[] = BASE_SLOTS.map((baseSlot) => {
    let isBooked = false;
    let bookedBy: string | undefined = undefined;

    // Check seed bookings matching slot time
    const seedMatch = matchingBookings.find(
      (b) => b.slot === baseSlot.time || b.slot.includes(baseSlot.shortTime)
    );
    if (seedMatch) {
      isBooked = true;
      bookedBy = seedMatch.customerName;
    }

    // Check live state on Today
    if (isToday) {
      if (table.status === 'running' && baseSlot.id === 's3') {
        // Current 02:00 PM session in progress
        isBooked = true;
        bookedBy = table.currentSession?.customerName || 'Active Session';
      }
      if (table.status === 'booked' && (baseSlot.id === 's5' || baseSlot.id === 's6')) {
        isBooked = true;
        bookedBy = 'Reserved';
      }
    }

    // Fallback to deterministic schedule if not today or if slot hit
    if (!isBooked && deterministicBooked.includes(baseSlot.id)) {
      isBooked = true;
      bookedBy = 'Reserved';
    }

    return {
      ...baseSlot,
      isBooked,
      bookedBy,
    };
  });

  const availableCount = slots.filter((s) => !s.isBooked).length;
  const isFullyBooked = availableCount === 0;

  let effectiveStatus: 'available' | 'running' | 'booked' | 'maintenance' = 'available';
  if (isFullyBooked) {
    effectiveStatus = 'booked';
  } else if (isToday && table.status === 'running') {
    effectiveStatus = 'running';
  }

  return {
    slots,
    availableCount,
    totalCount: slots.length,
    isFullyBooked,
    isMaintenance: false,
    effectiveStatus,
  };
}

/**
 * Returns venue-wide metrics for the selected date.
 */
export function getVenueAvailabilitySummary(tables: Table[], dateStr: string) {
  let availableTablesCount = 0;

  for (const table of tables) {
    const { isFullyBooked, isMaintenance } = getTableSlotAvailability(table, dateStr);
    if (!isFullyBooked && !isMaintenance) {
      availableTablesCount++;
    }
  }

  return {
    totalTables: tables.length,
    availableTablesCount,
  };
}
