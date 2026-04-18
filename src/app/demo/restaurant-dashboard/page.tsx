"use client";

import { useState } from "react";
import {
  Users,
  Bell,
  Send,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  ChevronDown,
  ChevronRight,
  MapPin,
  MessageSquare,
  BarChart3,
  ShieldCheck,
  Phone,
  Eye,
  Filter,
} from "lucide-react";

// ─── Mock Data ───────────────────────────────────────────────────────────────

const LOCATIONS = ["All Locations", "Downtown", "Westside", "Airport", "Midtown"];

type ConsentType = "menu_only" | "marketing";
type ReminderStatus = "pending" | "sent" | "failed" | "none";
type AuditAction = "consent_given" | "reminder_sent" | "opt_out" | "campaign_received";

interface Contact {
  id: string;
  phone: string;
  location: string;
  consentDate: string;
  consentType: ConsentType;
  reminderStatus: ReminderStatus;
  lastInteraction: string;
  optedOut: boolean;
  history: { timestamp: string; action: AuditAction; detail: string }[];
}

const CONTACTS: Contact[] = [
  {
    id: "c1",
    phone: "+44 7700 900142",
    location: "Downtown",
    consentDate: "2026-04-17",
    consentType: "marketing",
    reminderStatus: "pending",
    lastInteraction: "2 hrs ago",
    optedOut: false,
    history: [
      { timestamp: "2026-04-17 14:32", action: "consent_given", detail: "Marketing consent via QR scan" },
      { timestamp: "2026-04-17 14:33", action: "campaign_received", detail: "Welcome message sent" },
    ],
  },
  {
    id: "c2",
    phone: "+44 7700 900281",
    location: "Westside",
    consentDate: "2026-04-16",
    consentType: "menu_only",
    reminderStatus: "sent",
    lastInteraction: "1 day ago",
    optedOut: false,
    history: [
      { timestamp: "2026-04-16 19:15", action: "consent_given", detail: "Menu-only consent via QR scan" },
      { timestamp: "2026-04-17 09:00", action: "reminder_sent", detail: "Consent review reminder sent" },
    ],
  },
  {
    id: "c3",
    phone: "+44 7700 900374",
    location: "Airport",
    consentDate: "2026-04-15",
    consentType: "marketing",
    reminderStatus: "failed",
    lastInteraction: "3 days ago",
    optedOut: false,
    history: [
      { timestamp: "2026-04-15 11:45", action: "consent_given", detail: "Marketing consent via QR scan" },
      { timestamp: "2026-04-16 11:45", action: "reminder_sent", detail: "Reminder sent" },
      { timestamp: "2026-04-17 11:45", action: "reminder_sent", detail: "Reminder failed — delivery error" },
    ],
  },
  {
    id: "c4",
    phone: "+44 7700 900519",
    location: "Downtown",
    consentDate: "2026-04-14",
    consentType: "marketing",
    reminderStatus: "none",
    lastInteraction: "4 days ago",
    optedOut: true,
    history: [
      { timestamp: "2026-04-14 13:00", action: "consent_given", detail: "Marketing consent via QR scan" },
      { timestamp: "2026-04-15 09:30", action: "campaign_received", detail: "Lunch special campaign" },
      { timestamp: "2026-04-16 10:00", action: "opt_out", detail: "Customer opted out via WhatsApp" },
    ],
  },
  {
    id: "c5",
    phone: "+44 7700 900663",
    location: "Midtown",
    consentDate: "2026-04-18",
    consentType: "menu_only",
    reminderStatus: "pending",
    lastInteraction: "30 min ago",
    optedOut: false,
    history: [
      { timestamp: "2026-04-18 09:15", action: "consent_given", detail: "Menu-only consent via QR scan" },
    ],
  },
  {
    id: "c6",
    phone: "+44 7700 900788",
    location: "Westside",
    consentDate: "2026-04-17",
    consentType: "marketing",
    reminderStatus: "pending",
    lastInteraction: "5 hrs ago",
    optedOut: false,
    history: [
      { timestamp: "2026-04-17 18:45", action: "consent_given", detail: "Marketing consent via QR scan" },
    ],
  },
  {
    id: "c7",
    phone: "+44 7700 900921",
    location: "Airport",
    consentDate: "2026-04-16",
    consentType: "marketing",
    reminderStatus: "sent",
    lastInteraction: "2 days ago",
    optedOut: false,
    history: [
      { timestamp: "2026-04-16 12:00", action: "consent_given", detail: "Marketing consent via QR scan" },
      { timestamp: "2026-04-17 12:00", action: "reminder_sent", detail: "Consent review reminder sent" },
      { timestamp: "2026-04-17 14:00", action: "campaign_received", detail: "Happy hour campaign" },
    ],
  },
  {
    id: "c8",
    phone: "+44 7700 901055",
    location: "Midtown",
    consentDate: "2026-04-18",
    consentType: "marketing",
    reminderStatus: "pending",
    lastInteraction: "15 min ago",
    optedOut: false,
    history: [
      { timestamp: "2026-04-18 10:30", action: "consent_given", detail: "Marketing consent via QR scan" },
    ],
  },
];

const REMINDER_QUEUE = [
  { id: "r1", phone: "+44 7700 900142", location: "Downtown", dueIn: "12 min", status: "pending" as const },
  { id: "r2", phone: "+44 7700 900788", location: "Westside", dueIn: "28 min", status: "pending" as const },
  { id: "r3", phone: "+44 7700 901055", location: "Midtown", dueIn: "45 min", status: "pending" as const },
  { id: "r4", phone: "+44 7700 900374", location: "Airport", dueIn: "just now", status: "failed" as const },
];

const AUDIT_LOG = [
  { id: "a1", timestamp: "10:30", action: "consent_given" as AuditAction, phone: "+44 7700 901055", consentType: "marketing" as ConsentType, location: "Midtown" },
  { id: "a2", timestamp: "09:15", action: "consent_given" as AuditAction, phone: "+44 7700 900663", consentType: "menu_only" as ConsentType, location: "Midtown" },
  { id: "a3", timestamp: "Yesterday 14:00", action: "campaign_received" as AuditAction, phone: "+44 7700 900921", consentType: "marketing" as ConsentType, location: "Airport" },
  { id: "a4", timestamp: "Yesterday 12:00", action: "reminder_sent" as AuditAction, phone: "+44 7700 900921", consentType: "marketing" as ConsentType, location: "Airport" },
  { id: "a5", timestamp: "2 days ago 10:00", action: "opt_out" as AuditAction, phone: "+44 7700 900519", consentType: "marketing" as ConsentType, location: "Downtown" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

const actionLabel: Record<AuditAction, string> = {
  consent_given: "Consent given",
  reminder_sent: "Reminder sent",
  opt_out: "Opted out",
  campaign_received: "Campaign received",
};

const actionColor: Record<AuditAction, string> = {
  consent_given: "text-emerald-600",
  reminder_sent: "text-blue-500",
  opt_out: "text-red-500",
  campaign_received: "text-violet-500",
};

const consentBadge: Record<ConsentType, { label: string; cls: string }> = {
  marketing: { label: "Marketing", cls: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
  menu_only: { label: "Menu only", cls: "bg-zinc-100 text-zinc-600 border border-zinc-200" },
};

const reminderBadge: Record<ReminderStatus, { label: string; cls: string }> = {
  pending: { label: "Pending", cls: "bg-amber-50 text-amber-700 border border-amber-200" },
  sent: { label: "Sent", cls: "bg-blue-50 text-blue-700 border border-blue-200" },
  failed: { label: "Failed", cls: "bg-red-50 text-red-700 border border-red-200" },
  none: { label: "—", cls: "text-zinc-400" },
};

type NavItem = "dashboard" | "contacts" | "campaigns" | "reminders" | "audit";

const NAV: { id: NavItem; label: string; icon: React.ReactNode }[] = [
  { id: "dashboard", label: "Dashboard", icon: <BarChart3 size={15} /> },
  { id: "contacts", label: "Contacts", icon: <Users size={15} /> },
  { id: "campaigns", label: "Campaigns", icon: <Send size={15} /> },
  { id: "reminders", label: "Reminders", icon: <Bell size={15} /> },
  { id: "audit", label: "Audit Log", icon: <ShieldCheck size={15} /> },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div className="bg-white rounded-xl border border-zinc-200 px-4 py-3 flex flex-col gap-1">
      <span className="text-xs text-zinc-500 font-medium uppercase tracking-wide">{label}</span>
      <span className={cn("text-2xl font-semibold tabular-nums", accent ? "text-[#25D366]" : "text-zinc-900")}>
        {value}
      </span>
      {sub && <span className="text-xs text-zinc-400">{sub}</span>}
    </div>
  );
}

function Badge({ label, cls }: { label: string; cls: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", cls)}>
      {label}
    </span>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function RestaurantDashboard() {
  const [activeNav, setActiveNav] = useState<NavItem>("dashboard");
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("All Locations");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [campaignLocation, setCampaignLocation] = useState("Downtown");
  const [campaignMessage, setCampaignMessage] = useState(
    "Hi! We have a special lunch deal today — 20% off for loyal customers. Show this message at the counter. See you soon!"
  );
  const [campaignSent, setCampaignSent] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Derived stats
  const totalContacts = CONTACTS.length;
  const optedIn = CONTACTS.filter((c) => !c.optedOut).length;
  const optInRate = Math.round((optedIn / totalContacts) * 100);
  const pendingReminders = CONTACTS.filter((c) => c.reminderStatus === "pending").length;
  const campaignsSentThisWeek = 4;

  // Filtered contacts
  const filteredContacts = CONTACTS.filter((c) => {
    const matchSearch =
      c.phone.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase());
    const matchLocation =
      locationFilter === "All Locations" || c.location === locationFilter;
    return matchSearch && matchLocation;
  });

  const handleSendCampaign = () => {
    setCampaignSent(true);
    setTimeout(() => setCampaignSent(false), 3000);
  };

  const recipientCount = CONTACTS.filter(
    (c) => !c.optedOut && c.consentType === "marketing" && (campaignLocation === "All Locations" || c.location === campaignLocation)
  ).length;

  return (
    <div className="flex h-screen bg-zinc-50 font-sans text-zinc-900 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-zinc-900 flex flex-col h-full">
        {/* Brand */}
        <div className="px-4 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-sm font-bold"
              style={{ backgroundColor: "#25D366" }}
            >
              W
            </div>
            <div>
              <p className="text-white text-sm font-semibold leading-none">WaiterBot</p>
              <p className="text-zinc-500 text-xs mt-0.5">Restaurant Suite</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-3 space-y-0.5">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={cn(
                "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
                activeNav === item.id
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60"
              )}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* Locations */}
        <div className="px-3 py-3 border-t border-zinc-800">
          <p className="text-zinc-600 text-xs uppercase tracking-wider mb-2 px-1">Locations</p>
          {LOCATIONS.slice(1).map((loc) => (
            <button
              key={loc}
              onClick={() => {
                setLocationFilter(loc);
                if (activeNav === "dashboard") setActiveNav("contacts");
              }}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-colors"
            >
              <MapPin size={11} />
              {loc}
            </button>
          ))}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-zinc-200 px-6 py-3 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-base font-semibold text-zinc-900">
              {activeNav === "dashboard" && "Overview"}
              {activeNav === "contacts" && "Contacts"}
              {activeNav === "campaigns" && "Campaign Sender"}
              {activeNav === "reminders" && "Reminder Queue"}
              {activeNav === "audit" && "Consent Audit Log"}
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              {locationFilter !== "All Locations" ? `Filtered: ${locationFilter}` : "All locations"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-zinc-500">Live</span>
          </div>
        </header>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          {/* ── DASHBOARD ── */}
          {activeNav === "dashboard" && (
            <div className="px-6 py-5 space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-4 gap-3">
                <StatCard label="Total Contacts" value={totalContacts} sub={`${optedIn} active`} />
                <StatCard label="Opt-in Rate" value={`${optInRate}%`} sub="of all scans" accent />
                <StatCard label="Pending Reminders" value={pendingReminders} sub="next hour" />
                <StatCard label="Campaigns this week" value={campaignsSentThisWeek} sub="across all locations" />
              </div>

              {/* Recent activity + reminder preview */}
              <div className="grid grid-cols-5 gap-4">
                {/* Contacts snapshot */}
                <div className="col-span-3 bg-white rounded-xl border border-zinc-200 overflow-hidden">
                  <div className="px-4 py-3 border-b border-zinc-100 flex items-center justify-between">
                    <p className="text-sm font-medium">Recent Contacts</p>
                    <button
                      onClick={() => setActiveNav("contacts")}
                      className="text-xs text-zinc-400 hover:text-zinc-700 transition-colors"
                    >
                      View all →
                    </button>
                  </div>
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-zinc-50">
                        <th className="text-left px-4 py-2 text-zinc-400 font-medium">Phone</th>
                        <th className="text-left px-4 py-2 text-zinc-400 font-medium">Location</th>
                        <th className="text-left px-4 py-2 text-zinc-400 font-medium">Consent</th>
                        <th className="text-left px-4 py-2 text-zinc-400 font-medium">Last seen</th>
                      </tr>
                    </thead>
                    <tbody>
                      {CONTACTS.slice(0, 5).map((c) => (
                        <tr key={c.id} className="border-b border-zinc-50 last:border-0">
                          <td className="px-4 py-2.5 font-mono text-zinc-600">{c.phone}</td>
                          <td className="px-4 py-2.5 text-zinc-500">{c.location}</td>
                          <td className="px-4 py-2.5">
                            <Badge {...consentBadge[c.consentType]} />
                          </td>
                          <td className="px-4 py-2.5 text-zinc-400">{c.lastInteraction}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Audit log snapshot */}
                <div className="col-span-2 bg-white rounded-xl border border-zinc-200 overflow-hidden">
                  <div className="px-4 py-3 border-b border-zinc-100 flex items-center justify-between">
                    <p className="text-sm font-medium">Audit Log</p>
                    <button
                      onClick={() => setActiveNav("audit")}
                      className="text-xs text-zinc-400 hover:text-zinc-700 transition-colors"
                    >
                      View all →
                    </button>
                  </div>
                  <ul className="divide-y divide-zinc-50">
                    {AUDIT_LOG.slice(0, 5).map((entry) => (
                      <li key={entry.id} className="px-4 py-2.5">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className={cn("text-xs font-medium", actionColor[entry.action])}>
                            {actionLabel[entry.action]}
                          </span>
                          <span className="text-[10px] text-zinc-400">{entry.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-zinc-500 font-mono">{entry.phone}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Quick campaign CTA */}
              <div
                className="rounded-xl p-4 flex items-center justify-between"
                style={{ background: "linear-gradient(135deg, #1a9e4e 0%, #25D366 100%)" }}
              >
                <div>
                  <p className="text-white font-semibold text-sm">Send a campaign now</p>
                  <p className="text-white/70 text-xs mt-0.5">
                    {CONTACTS.filter((c) => !c.optedOut && c.consentType === "marketing").length} marketing-consented contacts ready
                  </p>
                </div>
                <button
                  onClick={() => setActiveNav("campaigns")}
                  className="bg-white text-sm font-medium px-4 py-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 transition-colors"
                >
                  Open Sender →
                </button>
              </div>
            </div>
          )}

          {/* ── CONTACTS ── */}
          {activeNav === "contacts" && (
            <div className="px-6 py-5">
              {/* Search + filter bar */}
              <div className="flex items-center gap-3 mb-4">
                <div className="relative flex-1 max-w-xs">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Search phone or location…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-white border border-zinc-200 rounded-lg pl-8 pr-3 py-1.5 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-zinc-400 transition-colors"
                  />
                </div>
                <div className="relative">
                  <Filter size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="bg-white border border-zinc-200 rounded-lg pl-8 pr-8 py-1.5 text-sm text-zinc-700 outline-none focus:border-zinc-400 appearance-none cursor-pointer"
                  >
                    {LOCATIONS.map((l) => (
                      <option key={l}>{l}</option>
                    ))}
                  </select>
                  <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                </div>
                <span className="text-xs text-zinc-400 ml-auto">{filteredContacts.length} results</span>
              </div>

              {/* Table */}
              <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-100 bg-zinc-50">
                      <th className="text-left px-4 py-2.5 text-xs text-zinc-400 font-medium">Phone</th>
                      <th className="text-left px-4 py-2.5 text-xs text-zinc-400 font-medium">Location</th>
                      <th className="text-left px-4 py-2.5 text-xs text-zinc-400 font-medium">Consent date</th>
                      <th className="text-left px-4 py-2.5 text-xs text-zinc-400 font-medium">Consent type</th>
                      <th className="text-left px-4 py-2.5 text-xs text-zinc-400 font-medium">Reminder</th>
                      <th className="text-left px-4 py-2.5 text-xs text-zinc-400 font-medium">Last interaction</th>
                      <th className="w-8" />
                    </tr>
                  </thead>
                  <tbody>
                    {filteredContacts.map((c) => (
                      <>
                        <tr
                          key={c.id}
                          className={cn(
                            "border-b border-zinc-50 last:border-0 hover:bg-zinc-50/80 transition-colors cursor-pointer",
                            c.optedOut && "opacity-50"
                          )}
                          onClick={() => setExpandedRow(expandedRow === c.id ? null : c.id)}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div
                                className={cn(
                                  "w-1.5 h-1.5 rounded-full shrink-0",
                                  c.optedOut
                                    ? "bg-red-400"
                                    : c.consentType === "marketing"
                                    ? "bg-emerald-400"
                                    : "bg-zinc-300"
                                )}
                              />
                              <span className="font-mono text-xs text-zinc-700">{c.phone}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-xs text-zinc-500">{c.location}</td>
                          <td className="px-4 py-3 text-xs text-zinc-500">{c.consentDate}</td>
                          <td className="px-4 py-3">
                            <Badge {...consentBadge[c.consentType]} />
                          </td>
                          <td className="px-4 py-3">
                            {c.reminderStatus !== "none" ? (
                              <Badge {...reminderBadge[c.reminderStatus]} />
                            ) : (
                              <span className="text-xs text-zinc-300">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-xs text-zinc-400">{c.lastInteraction}</td>
                          <td className="px-4 py-3">
                            <ChevronRight
                              size={14}
                              className={cn(
                                "text-zinc-300 transition-transform",
                                expandedRow === c.id && "rotate-90"
                              )}
                            />
                          </td>
                        </tr>

                        {/* Expanded row */}
                        {expandedRow === c.id && (
                          <tr key={`${c.id}-expanded`} className="bg-zinc-50/70">
                            <td colSpan={7} className="px-6 py-4">
                              <p className="text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wide">
                                Consent history
                              </p>
                              <ul className="space-y-2">
                                {c.history.map((h, i) => (
                                  <li key={i} className="flex items-start gap-3 text-xs">
                                    <span className="text-zinc-400 w-32 shrink-0 font-mono">{h.timestamp}</span>
                                    <span className={cn("font-medium shrink-0 w-32", actionColor[h.action])}>
                                      {actionLabel[h.action]}
                                    </span>
                                    <span className="text-zinc-500">{h.detail}</span>
                                  </li>
                                ))}
                              </ul>
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── CAMPAIGNS ── */}
          {activeNav === "campaigns" && (
            <div className="px-6 py-5">
              <div className="grid grid-cols-2 gap-5">
                {/* Builder */}
                <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
                  <div className="px-4 py-3 border-b border-zinc-100">
                    <p className="text-sm font-medium">Message Builder</p>
                    <p className="text-xs text-zinc-400 mt-0.5">Marketing-consented contacts only</p>
                  </div>
                  <div className="p-4 space-y-4">
                    {/* Location */}
                    <div>
                      <label className="text-xs font-medium text-zinc-600 block mb-1">Location</label>
                      <div className="relative">
                        <MapPin size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <select
                          value={campaignLocation}
                          onChange={(e) => setCampaignLocation(e.target.value)}
                          className="w-full bg-zinc-50 border border-zinc-200 rounded-lg pl-8 pr-8 py-2 text-sm text-zinc-700 outline-none focus:border-zinc-400 appearance-none cursor-pointer"
                        >
                          {LOCATIONS.map((l) => (
                            <option key={l}>{l}</option>
                          ))}
                        </select>
                        <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="text-xs font-medium text-zinc-600 block mb-1">Message</label>
                      <textarea
                        value={campaignMessage}
                        onChange={(e) => setCampaignMessage(e.target.value)}
                        rows={5}
                        maxLength={1024}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2.5 text-sm text-zinc-800 resize-none outline-none focus:border-zinc-400 transition-colors placeholder:text-zinc-400"
                        placeholder="Write your message…"
                      />
                      <p className="text-right text-xs text-zinc-400 mt-1">
                        {campaignMessage.length}/1024
                      </p>
                    </div>

                    {/* Recipients */}
                    <div className="flex items-center justify-between rounded-lg bg-zinc-50 border border-zinc-200 px-3 py-2">
                      <div className="flex items-center gap-2">
                        <Users size={14} className="text-zinc-400" />
                        <span className="text-xs text-zinc-600">Recipients</span>
                      </div>
                      <span className="text-sm font-semibold text-zinc-900">{recipientCount} contacts</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowPreview(!showPreview)}
                        className="flex-1 flex items-center justify-center gap-2 border border-zinc-200 rounded-lg py-2 text-sm text-zinc-600 hover:bg-zinc-50 transition-colors"
                      >
                        <Eye size={14} />
                        {showPreview ? "Hide preview" : "Preview"}
                      </button>
                      <button
                        onClick={handleSendCampaign}
                        disabled={campaignSent || recipientCount === 0}
                        className={cn(
                          "flex-1 flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium text-white transition-all",
                          campaignSent
                            ? "bg-emerald-500"
                            : "hover:opacity-90 active:scale-[0.99]"
                        )}
                        style={{ backgroundColor: campaignSent ? undefined : "#25D366" }}
                      >
                        {campaignSent ? (
                          <>
                            <CheckCircle2 size={14} />
                            Sent!
                          </>
                        ) : (
                          <>
                            <Send size={14} />
                            Send Campaign
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* WhatsApp Preview */}
                <div>
                  {showPreview ? (
                    <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden h-full flex flex-col">
                      <div className="px-4 py-3 border-b border-zinc-100 flex items-center gap-2">
                        <MessageSquare size={14} className="text-[#25D366]" />
                        <p className="text-sm font-medium">WhatsApp Preview</p>
                      </div>
                      <div className="flex-1 p-4" style={{ background: "#e5ddd5" }}>
                        {/* WhatsApp chat bubble */}
                        <div className="flex justify-end">
                          <div
                            className="max-w-xs rounded-xl rounded-br-sm px-3 py-2 shadow-sm"
                            style={{ background: "#dcf8c6" }}
                          >
                            <p className="text-xs text-zinc-800 leading-relaxed whitespace-pre-wrap">
                              {campaignMessage || "Your message will appear here…"}
                            </p>
                            <div className="flex items-center justify-end gap-1 mt-1">
                              <span className="text-[10px] text-zinc-400">
                                {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </span>
                              <CheckCircle2 size={11} className="text-[#53bdeb]" />
                            </div>
                          </div>
                        </div>
                        {/* Opt-out note */}
                        <div className="flex justify-center mt-4">
                          <div className="bg-white/60 rounded-full px-3 py-1">
                            <p className="text-[10px] text-zinc-500">Reply STOP to opt out at any time</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-zinc-50 rounded-xl border border-dashed border-zinc-200 h-full flex flex-col items-center justify-center gap-3 p-8 text-center">
                      <MessageSquare size={28} className="text-zinc-300" />
                      <div>
                        <p className="text-sm text-zinc-400 font-medium">WhatsApp Preview</p>
                        <p className="text-xs text-zinc-300 mt-1">Click "Preview" to see how your message looks</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent campaigns table */}
              <div className="mt-5 bg-white rounded-xl border border-zinc-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-zinc-100">
                  <p className="text-sm font-medium">Recent Campaigns</p>
                </div>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-zinc-50 bg-zinc-50">
                      <th className="text-left px-4 py-2 text-zinc-400 font-medium">Sent</th>
                      <th className="text-left px-4 py-2 text-zinc-400 font-medium">Location</th>
                      <th className="text-left px-4 py-2 text-zinc-400 font-medium">Message excerpt</th>
                      <th className="text-left px-4 py-2 text-zinc-400 font-medium">Recipients</th>
                      <th className="text-left px-4 py-2 text-zinc-400 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { sent: "Today 09:00", location: "Airport", msg: "Happy hour starts at 5pm — 2-for-1 on all cocktails!", recipients: 12, status: "delivered" },
                      { sent: "Yesterday 14:00", location: "Downtown", msg: "Weekend brunch is back! Book your table today.", recipients: 23, status: "delivered" },
                      { sent: "Apr 16 11:00", location: "Westside", msg: "Loyalty reward: free dessert on your next visit.", recipients: 8, status: "delivered" },
                      { sent: "Apr 15 18:30", location: "All Locations", msg: "New spring menu now live — come taste the season!", recipients: 55, status: "delivered" },
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-zinc-50 last:border-0">
                        <td className="px-4 py-2.5 text-zinc-500 whitespace-nowrap">{row.sent}</td>
                        <td className="px-4 py-2.5 text-zinc-500">{row.location}</td>
                        <td className="px-4 py-2.5 text-zinc-600 max-w-xs truncate">{row.msg}</td>
                        <td className="px-4 py-2.5 text-zinc-500">{row.recipients}</td>
                        <td className="px-4 py-2.5">
                          <Badge label="Delivered" cls="bg-emerald-50 text-emerald-700 border border-emerald-200" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── REMINDERS ── */}
          {activeNav === "reminders" && (
            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-3 gap-3 mb-2">
                <StatCard label="Due next hour" value={REMINDER_QUEUE.filter((r) => r.status === "pending").length} sub="pending reminders" />
                <StatCard label="Failed today" value={REMINDER_QUEUE.filter((r) => r.status === "failed").length} sub="need attention" />
                <StatCard label="Sent this week" value={18} sub="total reminders" />
              </div>

              <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-zinc-100">
                  <p className="text-sm font-medium">Reminder Queue — Next Hour</p>
                </div>
                <ul className="divide-y divide-zinc-50">
                  {REMINDER_QUEUE.map((r) => (
                    <li key={r.id} className="px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {r.status === "pending" ? (
                          <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center">
                            <Clock size={15} className="text-amber-500" />
                          </div>
                        ) : r.status === "failed" ? (
                          <div className="w-8 h-8 rounded-full bg-red-50 border border-red-200 flex items-center justify-center">
                            <XCircle size={15} className="text-red-500" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                            <CheckCircle2 size={15} className="text-emerald-500" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-mono text-zinc-700">{r.phone}</p>
                          <p className="text-xs text-zinc-400">{r.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-zinc-400">Due: {r.dueIn}</span>
                        <Badge {...reminderBadge[r.status]} />
                        {r.status === "failed" && (
                          <button
                            className="text-xs text-white px-2.5 py-1 rounded-md font-medium"
                            style={{ backgroundColor: "#25D366" }}
                          >
                            Retry
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* GDPR note */}
              <div className="rounded-lg bg-blue-50 border border-blue-100 px-4 py-3 flex items-start gap-3">
                <ShieldCheck size={16} className="text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-blue-800">GDPR Compliance</p>
                  <p className="text-xs text-blue-600 mt-0.5">
                    Reminders are sent only to contacts who gave explicit consent. Opt-out requests are processed
                    immediately and contacts are removed from all future campaigns.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── AUDIT LOG ── */}
          {activeNav === "audit" && (
            <div className="px-6 py-5">
              <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-zinc-100 flex items-center gap-2">
                  <ShieldCheck size={15} className="text-zinc-400" />
                  <p className="text-sm font-medium">Consent Audit Log</p>
                  <span className="ml-auto text-xs text-zinc-400">Showing all events</span>
                </div>
                <ul className="divide-y divide-zinc-50">
                  {CONTACTS.flatMap((c) =>
                    c.history.map((h, i) => ({
                      key: `${c.id}-${i}`,
                      phone: c.phone,
                      location: c.location,
                      timestamp: h.timestamp,
                      action: h.action,
                      detail: h.detail,
                      consentType: c.consentType,
                    }))
                  )
                    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
                    .map((entry) => (
                      <li key={entry.key} className="px-4 py-3 flex items-start gap-4">
                        {/* Action icon */}
                        <div
                          className={cn(
                            "w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                            entry.action === "consent_given" && "bg-emerald-50 border border-emerald-200",
                            entry.action === "reminder_sent" && "bg-blue-50 border border-blue-200",
                            entry.action === "opt_out" && "bg-red-50 border border-red-200",
                            entry.action === "campaign_received" && "bg-violet-50 border border-violet-200"
                          )}
                        >
                          {entry.action === "consent_given" && <CheckCircle2 size={13} className="text-emerald-500" />}
                          {entry.action === "reminder_sent" && <Bell size={13} className="text-blue-500" />}
                          {entry.action === "opt_out" && <XCircle size={13} className="text-red-500" />}
                          {entry.action === "campaign_received" && <Send size={13} className="text-violet-500" />}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={cn("text-xs font-medium", actionColor[entry.action])}>
                              {actionLabel[entry.action]}
                            </span>
                            <span className="text-xs text-zinc-400">·</span>
                            <span className="text-xs font-mono text-zinc-500">{entry.phone}</span>
                            <span className="text-xs text-zinc-400">·</span>
                            <span className="text-xs text-zinc-400">{entry.location}</span>
                          </div>
                          <p className="text-xs text-zinc-500 mt-0.5">{entry.detail}</p>
                        </div>

                        {/* Timestamp */}
                        <div className="text-right shrink-0">
                          <span className="text-xs text-zinc-400 font-mono">{entry.timestamp}</span>
                          <div className="mt-1">
                            <Badge {...consentBadge[entry.consentType]} />
                          </div>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
