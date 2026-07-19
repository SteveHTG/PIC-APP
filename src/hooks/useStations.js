import { useEffect, useState } from "react";
import {
  supabase,
  isSupabaseConfigured,
  rowToStation,
} from "../supabase/client";
import { MOCK_STATIONS } from "../data/mockStations";

/**
 * Returns live station data.
 *
 * - When Supabase is configured, loads the `stations` table and subscribes
 *   to Postgres changes so battery/slot counts update in real time.
 * - Otherwise falls back to mock data so the app is fully usable in dev.
 */
export function useStations() {
  const [stations, setStations] = useState(
    isSupabaseConfigured ? [] : MOCK_STATIONS,
  );
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let active = true;

    async function load() {
      const { data, error: err } = await supabase
        .from("stations")
        .select("*")
        .order("name");
      if (!active) return;
      if (err) {
        console.error("[PIC] Failed to load stations:", err);
        setError(err);
      } else {
        setStations(data.map(rowToStation));
      }
      setLoading(false);
    }

    load();

    // Realtime: any insert/update/delete on stations refetches the set
    // (small table — simplest correct approach).
    const channel = supabase
      .channel("stations-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "stations" },
        () => load(),
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return { stations, loading, error, isLive: isSupabaseConfigured };
}
