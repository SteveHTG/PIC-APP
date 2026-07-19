import { APP_CONFIG } from "../config";

// Contact Us overlay: three native-action buttons — Email (mailto),
// Phone (tel), and Facebook (opens the page). No form / backend.
export default function ContactModal({ open, onClose }) {
  if (!open) return null;
  const { contact } = APP_CONFIG;
  const telHref = `tel:+1${contact.phone.replace(/[^\d]/g, "")}`;

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center animate-fade-in">
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute inset-0 bg-navy/30"
      />

      <div className="safe-bottom relative w-full animate-sheet-up">
        <div className="mx-auto max-w-md rounded-t-3xl bg-white px-5 pb-6 pt-3 shadow-[var(--shadow-sheet)]">
          <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-slate-200" />

          <div className="mb-1 flex items-center justify-between">
            <h2 className="text-lg font-bold text-navy">Contact Us</h2>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-navy-400"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <p className="mb-4 text-sm text-navy-400">
            Get in touch with Plugged In Charging.
          </p>

          <div className="space-y-3">
            <ContactButton
              href={telHref}
              label="Call Us"
              value={contact.phone}
              iconBg="bg-brand-green-light"
              icon={<PhoneIcon className="h-5 w-5 text-brand-green-dark" />}
            />
            <ContactButton
              href={`mailto:${contact.email}`}
              label="Email Us"
              value={contact.email}
              iconBg="bg-navy/10"
              icon={<MailIcon className="h-5 w-5 text-navy" />}
            />
            <ContactButton
              href={contact.facebook}
              external
              label="Facebook"
              value="Message us on Facebook"
              iconBg="bg-[#1877F2]/10"
              icon={<FacebookIcon className="h-5 w-5 text-[#1877F2]" />}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactButton({ href, external, label, value, icon, iconBg }) {
  return (
    <a
      href={href}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3.5 shadow-[var(--shadow-card)] transition active:scale-[0.98]"
    >
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBg}`}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-navy">{label}</span>
        <span className="block truncate text-xs text-navy-400">{value}</span>
      </span>
      <ChevronIcon className="h-5 w-5 shrink-0 text-slate-300" />
    </a>
  );
}

function PhoneIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24 11 11 0 0 0 3.5.56 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11 11 0 0 0 .56 3.5 1 1 0 0 1-.25 1l-2.2 2.3z" />
    </svg>
  );
}
function MailIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function FacebookIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.2c-1.2 0-1.6.75-1.6 1.5V12h2.7l-.43 2.9h-2.3v7A10 10 0 0 0 22 12z" />
    </svg>
  );
}
function ChevronIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
