// ------------------------------------------------------------------
// Supabase client.
//
// The app is designed to run WITHOUT Supabase (on mock data) until you
// create a project and fill in .env. `isSupabaseConfigured` gates all
// live data access so nothing crashes before then.
// ------------------------------------------------------------------
import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey)
  : null;

if (!isSupabaseConfigured && import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.info(
    "[PIC] Supabase not configured — running on mock data. Add .env values to go live.",
  );
}

// ---- Row <-> app-object mapping ----------------------------------
// Postgres columns are snake_case; the UI uses camelCase + a nested
// coordinates object (same shape as the mock data), so the rest of the
// app is agnostic to the data source.

export function rowToStation(row) {
  return {
    id: row.id,
    name: row.name,
    address: row.address,
    coordinates: { latitude: row.latitude, longitude: row.longitude },
    hours: row.hours,
    terminalId: row.terminal_id,
    totalSlots: row.total_slots,
    availableBatteries: row.available_batteries,
    emptySlots: row.empty_slots,
    lastUpdated: row.last_updated,
  };
}

export function stationToRow(s) {
  return {
    name: s.name,
    address: s.address,
    latitude: Number(s.latitude),
    longitude: Number(s.longitude),
    hours: s.hours,
    terminal_id: s.terminalId,
    total_slots: Number(s.totalSlots) || 0,
    available_batteries: Number(s.availableBatteries) || 0,
    empty_slots: Number(s.emptySlots) || 0,
  };
}
