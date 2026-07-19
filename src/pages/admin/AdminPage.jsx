import { useState } from "react";
import { Link } from "react-router-dom";
import {
  supabase,
  isSupabaseConfigured,
  stationToRow,
} from "../../supabase/client";
import { useStations } from "../../hooks/useStations";

// ------------------------------------------------------------------
// Basic station admin. This is a PLACEHOLDER gate — a passcode checked in
// the browser is NOT real security. Before go-live, replace with Supabase
// Auth (admin email/password) + RLS policies that only allow writes from
// an authenticated admin. Tracked as a follow-up.
// ------------------------------------------------------------------
const PASSCODE = import.meta.env.VITE_ADMIN_PASSCODE || "changeme";

const EMPTY = {
  name: "",
  address: "",
  latitude: "",
  longitude: "",
  hours: "",
  terminalId: "",
  totalSlots: "",
  availableBatteries: "",
  emptySlots: "",
};

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState("");

  if (!authed) {
    return (
      <Gate
        pass={pass}
        setPass={setPass}
        onSubmit={(e) => {
          e.preventDefault();
          setAuthed(pass === PASSCODE);
        }}
      />
    );
  }
  return <Dashboard />;
}

function Gate({ pass, setPass, onSubmit }) {
  return (
    <div className="flex h-[100dvh] items-center justify-center bg-[#f4f6fb] px-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-[var(--shadow-card)]"
      >
        <h1 className="text-xl font-bold text-navy">Admin access</h1>
        <p className="mt-1 text-sm text-navy-400">
          Enter the passcode to manage stations.
        </p>
        <input
          type="password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          placeholder="Passcode"
          className="mt-4 w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none focus:border-brand-green"
        />
        <button className="mt-3 w-full rounded-2xl bg-navy py-3 text-sm font-semibold text-white">
          Unlock
        </button>
        <Link
          to="/"
          className="mt-4 block text-center text-sm font-medium text-navy-400"
        >
          ← Back to map
        </Link>
      </form>
    </div>
  );
}

function Dashboard() {
  const { stations } = useStations();
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleAdd(e) {
    e.preventDefault();
    if (!isSupabaseConfigured) {
      setNotice("Connect Supabase (.env) to save stations. Nothing was written.");
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase.from("stations").insert(stationToRow(form));
      if (error) throw error;
      setForm(EMPTY);
      setNotice("Station added.");
    } catch (err) {
      console.error(err);
      setNotice("Failed to add station: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!isSupabaseConfigured) return;
    if (!confirm("Delete this station?")) return;
    const { error } = await supabase.from("stations").delete().eq("id", id);
    if (error) console.error(error);
  }

  return (
    <div className="min-h-[100dvh] bg-[#f4f6fb] pb-12">
      <header className="safe-top flex items-center justify-between bg-navy px-5 py-4 text-white">
        <h1 className="text-lg font-bold">Station Admin</h1>
        <Link to="/" className="text-sm font-medium text-white/80">
          View map →
        </Link>
      </header>

      <div className="mx-auto max-w-md px-5">
        {!isSupabaseConfigured && (
          <p className="mt-4 rounded-xl bg-amber/15 px-4 py-3 text-sm text-amber-dark">
            Demo mode — Supabase isn't configured, so changes aren't saved.
            Stations below are mock data.
          </p>
        )}

        <form
          onSubmit={handleAdd}
          className="mt-4 space-y-2.5 rounded-2xl bg-white p-4 shadow-[var(--shadow-card)]"
        >
          <h2 className="font-semibold text-navy">Add a station</h2>
          <Field label="Venue name" value={form.name} onChange={update("name")} />
          <Field label="Address" value={form.address} onChange={update("address")} />
          <div className="grid grid-cols-2 gap-2.5">
            <Field label="Latitude" value={form.latitude} onChange={update("latitude")} />
            <Field label="Longitude" value={form.longitude} onChange={update("longitude")} />
          </div>
          <Field label="Hours" value={form.hours} onChange={update("hours")} />
          <Field label="Terminal / hardware ID" value={form.terminalId} onChange={update("terminalId")} />
          <div className="grid grid-cols-3 gap-2.5">
            <Field label="Total slots" value={form.totalSlots} onChange={update("totalSlots")} />
            <Field label="Batteries" value={form.availableBatteries} onChange={update("availableBatteries")} />
            <Field label="Empty slots" value={form.emptySlots} onChange={update("emptySlots")} />
          </div>
          <button
            disabled={saving}
            className="w-full rounded-xl bg-brand-green py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? "Saving…" : "Add station"}
          </button>
          {notice && <p className="text-center text-xs text-navy-400">{notice}</p>}
        </form>

        <h2 className="mt-6 mb-2 font-semibold text-navy">
          Stations ({stations.length})
        </h2>
        <ul className="space-y-2">
          {stations.map((s) => (
            <li
              key={s.id}
              className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-[var(--shadow-card)]"
            >
              <div>
                <p className="font-semibold text-navy">{s.name}</p>
                <p className="text-xs text-navy-400">
                  {s.availableBatteries ?? 0} batteries · {s.emptySlots ?? 0}{" "}
                  slots · {s.terminalId}
                </p>
              </div>
              <button
                onClick={() => handleDelete(s.id)}
                className="rounded-lg px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-navy-400">{label}</span>
      <input
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand-green"
      />
    </label>
  );
}
