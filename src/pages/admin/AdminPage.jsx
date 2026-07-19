import { useState } from "react";
import { Link } from "react-router-dom";
import {
  supabase,
  isSupabaseConfigured,
  stationToRow,
} from "../../supabase/client";
import { useStations } from "../../hooks/useStations";
import { useAuth } from "../../hooks/useAuth";

// ------------------------------------------------------------------
// Admin gate:
//  - Supabase configured -> real Supabase Auth (email/password), and
//    RLS (see supabase/schema.sql §4) only allows writes from a signed-in
//    admin. Create the admin user in the Supabase Dashboard
//    (Authentication > Users > Add user) — there is no public sign-up.
//  - Supabase NOT configured -> a client-side passcode (VITE_ADMIN_PASSCODE)
//    just so the screen is explorable in demo mode. Never real security.
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
};

export default function AdminPage() {
  const { session, loading, signIn, signOut } = useAuth();
  const [passcodeAuthed, setPasscodeAuthed] = useState(false);
  const [pass, setPass] = useState("");

  if (isSupabaseConfigured) {
    if (loading) {
      return (
        <div className="flex h-[100dvh] items-center justify-center bg-[#f4f6fb] text-sm text-navy-400">
          Loading…
        </div>
      );
    }
    if (!session) return <LoginGate signIn={signIn} />;
    return (
      <Dashboard
        adminEmail={session.user.email}
        onSignOut={signOut}
      />
    );
  }

  if (!passcodeAuthed) {
    return (
      <PasscodeGate
        pass={pass}
        setPass={setPass}
        onSubmit={(e) => {
          e.preventDefault();
          setPasscodeAuthed(pass === PASSCODE);
        }}
      />
    );
  }
  return <Dashboard onSignOut={() => setPasscodeAuthed(false)} />;
}

function LoginGate({ signIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const { error: err } = await signIn(email, password);
    if (err) setError(err.message);
    setSubmitting(false);
  }

  return (
    <div className="flex h-[100dvh] items-center justify-center bg-[#f4f6fb] px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-[var(--shadow-card)]"
      >
        <h1 className="text-xl font-bold text-navy">Admin sign in</h1>
        <p className="mt-1 text-sm text-navy-400">
          Sign in to manage P.I.C. Points.
        </p>
        <input
          type="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="mt-4 w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none focus:border-brand-green"
        />
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="mt-2.5 w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none focus:border-brand-green"
        />
        {error && (
          <p className="mt-2 text-sm font-medium text-red-600">{error}</p>
        )}
        <button
          disabled={submitting}
          className="mt-3 w-full rounded-2xl bg-navy py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {submitting ? "Signing in…" : "Sign in"}
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

function PasscodeGate({ pass, setPass, onSubmit }) {
  return (
    <div className="flex h-[100dvh] items-center justify-center bg-[#f4f6fb] px-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-[var(--shadow-card)]"
      >
        <h1 className="text-xl font-bold text-navy">Admin access</h1>
        <p className="mt-1 text-sm text-navy-400">
          Enter the passcode to manage P.I.C. Points.
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

function Dashboard({ adminEmail, onSignOut }) {
  const { stations } = useStations();
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleAdd(e) {
    e.preventDefault();
    if (!isSupabaseConfigured) {
      setNotice("Connect Supabase (.env) to save P.I.C. Points. Nothing was written.");
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase.from("stations").insert(stationToRow(form));
      if (error) throw error;
      setForm(EMPTY);
      setNotice("P.I.C. Point added.");
    } catch (err) {
      console.error(err);
      setNotice("Failed to add P.I.C. Point: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!isSupabaseConfigured) return;
    if (!confirm("Delete this P.I.C. Point?")) return;
    const { error } = await supabase.from("stations").delete().eq("id", id);
    if (error) console.error(error);
  }

  return (
    <div className="min-h-[100dvh] bg-[#f4f6fb] pb-12">
      <header className="safe-top bg-navy px-5 py-4 text-white">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold">P.I.C. Point Admin</h1>
          <Link to="/" className="text-sm font-medium text-white/80">
            View map →
          </Link>
        </div>
        <div className="mt-1 flex items-center justify-between">
          <p className="text-xs text-white/60">
            {adminEmail ? `Signed in as ${adminEmail}` : "Demo mode"}
          </p>
          <button
            onClick={onSignOut}
            className="text-xs font-semibold text-white/80"
          >
            {adminEmail ? "Sign out" : "Lock"}
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-md px-5">
        {!isSupabaseConfigured && (
          <p className="mt-4 rounded-xl bg-amber/15 px-4 py-3 text-sm text-amber-dark">
            Demo mode — Supabase isn't configured, so changes aren't saved.
            P.I.C. Points below are mock data.
          </p>
        )}

        <form
          onSubmit={handleAdd}
          className="mt-4 space-y-2.5 rounded-2xl bg-white p-4 shadow-[var(--shadow-card)]"
        >
          <h2 className="font-semibold text-navy">Add a P.I.C. Point</h2>
          <Field label="Venue name" value={form.name} onChange={update("name")} />
          <Field label="Address" value={form.address} onChange={update("address")} />
          <div className="grid grid-cols-2 gap-2.5">
            <Field label="Latitude" value={form.latitude} onChange={update("latitude")} />
            <Field label="Longitude" value={form.longitude} onChange={update("longitude")} />
          </div>
          <Field label="Hours" value={form.hours} onChange={update("hours")} />
          <Field label="Terminal / hardware ID" value={form.terminalId} onChange={update("terminalId")} />
          <Field label="Battery Capacity" value={form.totalSlots} onChange={update("totalSlots")} />
          <button
            disabled={saving}
            className="w-full rounded-xl bg-brand-green py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? "Saving…" : "Add P.I.C. Point"}
          </button>
          {notice && <p className="text-center text-xs text-navy-400">{notice}</p>}
        </form>

        <h2 className="mt-6 mb-2 font-semibold text-navy">
          P.I.C. Points ({stations.length})
        </h2>
        <ul className="space-y-2">
          {stations.map((s) => (
            <StationRow key={s.id} station={s} onDelete={handleDelete} />
          ))}
        </ul>
      </div>
    </div>
  );
}

function StationRow({ station, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(station.name);
  const [capacity, setCapacity] = useState(String(station.totalSlots ?? ""));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function startEdit() {
    setName(station.name);
    setCapacity(String(station.totalSlots ?? ""));
    setError("");
    setEditing(true);
  }

  async function save() {
    if (!name.trim()) {
      setError("Name can't be empty.");
      return;
    }
    if (!isSupabaseConfigured) {
      setError("Connect Supabase to save changes.");
      return;
    }
    setSaving(true);
    setError("");
    const { error: err } = await supabase
      .from("stations")
      .update({ name: name.trim(), total_slots: Number(capacity) || 0 })
      .eq("id", station.id);
    setSaving(false);
    if (err) {
      setError(err.message);
      return;
    }
    setEditing(false);
  }

  if (editing) {
    return (
      <li className="space-y-2.5 rounded-2xl bg-white p-4 shadow-[var(--shadow-card)]">
        <Field label="Venue name" value={name} onChange={(e) => setName(e.target.value)} />
        <Field
          label="Battery Capacity"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
        />
        {error && <p className="text-xs font-medium text-red-600">{error}</p>}
        <div className="flex gap-2">
          <button
            onClick={save}
            disabled={saving}
            className="flex-1 rounded-xl bg-brand-green py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save"}
          </button>
          <button
            onClick={() => setEditing(false)}
            className="rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-navy-400"
          >
            Cancel
          </button>
        </div>
      </li>
    );
  }

  return (
    <li className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-[var(--shadow-card)]">
      <div className="min-w-0">
        <p className="truncate font-semibold text-navy">{station.name}</p>
        <p className="text-xs text-navy-400">
          Battery capacity {station.totalSlots ?? 0} · {station.terminalId}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <button
          onClick={startEdit}
          className="rounded-lg px-3 py-1.5 text-xs font-semibold text-navy hover:bg-slate-100"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(station.id)}
          className="rounded-lg px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </li>
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
