import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  User,
  Bell,
  Search,
  FileText,
  BarChart2,
  Shield,
  HelpCircle,
  Star,
  Inbox,
  Send,
  Archive,
  Trash2,
  Plus,
  Filter,
  Download,
  Info,
  Zap,
  Layers,
  Globe,
  Lock,
  ChevronRight,
} from "lucide-react";
import { Window, useWindow } from "../../ui/overlay/window/Window.ui";
import type { WindowTab } from "../../context/window/Window.context"; // adjust path

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Section({
  title,
  subtitle,
  badge,
  children,
  index = 0,
}: {
  title: string;
  subtitle?: string;
  badge?: string;
  children: React.ReactNode;
  index?: number;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, delay: index * 0.055, ease: "easeOut" }}
      className="border border-neutral-200 rounded-2xl p-8 bg-white"
    >
      <div className="flex items-start justify-between mb-7 gap-4">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1 text-sm text-neutral-400 leading-relaxed max-w-xl">
              {subtitle}
            </p>
          )}
        </div>
        {badge && (
          <span className="shrink-0 mt-0.5 rounded border border-neutral-300 px-2.5 py-0.5 text-[9px] font-bold tracking-[0.18em] uppercase text-neutral-500 bg-neutral-50 font-mono">
            {badge}
          </span>
        )}
      </div>
      {children}
    </motion.section>
  );
}

function DemoCard({
  label,
  children,
  center = false,
  tall = false,
}: {
  label: string;
  children: React.ReactNode;
  center?: boolean;
  tall?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border border-neutral-100 bg-neutral-50 p-5 flex flex-col gap-3 ${tall ? "min-h-[160px]" : ""} ${center ? "items-center justify-center" : ""}`}
    >
      <p className="text-[9px] font-bold tracking-[0.18em] uppercase text-neutral-400 font-mono">
        {label}
      </p>
      <div className={center ? "flex items-center justify-center flex-1 w-full" : ""}>
        {children}
      </div>
    </div>
  );
}

function Grid({ children, cols = 2 }: { children: React.ReactNode; cols?: number }) {
  return (
    <div
      className="grid gap-4"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}
    >
      {children}
    </div>
  );
}


// ─── Reusable window content snippets ────────────────────────────────────────

function SimpleContent() {
  return (
    <div className="space-y-3">
      <p className="text-sm text-neutral-600 leading-relaxed">
        This is a basic Window with a title, close button, and a scrollable body. Click outside or press Escape to dismiss.
      </p>
      <div className="rounded-lg bg-neutral-50 border border-neutral-100 p-3 text-xs text-neutral-500 font-mono">
        isOpen: true
      </div>
    </div>
  );
}

function SettingsContent() {
  return (
    <div className="space-y-4">
      {[
        { label: "Display name", value: "Jane Doe" },
        { label: "Email", value: "jane@example.com" },
        { label: "Timezone", value: "UTC+5:30" },
      ].map((row) => (
        <div key={row.label} className="flex items-center justify-between">
          <span className="text-sm text-neutral-500">{row.label}</span>
          <span className="text-sm font-medium text-neutral-900">{row.value}</span>
        </div>
      ))}
    </div>
  );
}

function NotificationsContent() {
  const notifs = [
    { icon: <Star size={13} className="text-amber-500" />, msg: "Your report is ready", time: "2m ago" },
    { icon: <User size={13} className="text-blue-500" />, msg: "Alex commented on your post", time: "14m ago" },
    { icon: <Zap size={13} className="text-emerald-500" />, msg: "Deployment succeeded", time: "1h ago" },
    { icon: <Bell size={13} className="text-neutral-400" />, msg: "Weekly digest ready", time: "3h ago" },
  ];
  return (
    <div className="space-y-1">
      {notifs.map((n, i) => (
        <div key={i} className="flex items-center gap-3 rounded-lg px-2 py-2.5 hover:bg-neutral-50 transition-colors cursor-pointer">
          <div className="w-6 h-6 flex items-center justify-center rounded-full bg-neutral-100 shrink-0">
            {n.icon}
          </div>
          <p className="flex-1 text-sm text-neutral-700">{n.msg}</p>
          <span className="text-xs text-neutral-400 shrink-0">{n.time}</span>
        </div>
      ))}
    </div>
  );
}

function SearchContent() {
  const [q, setQ] = useState("");
  const results = ["Dashboard overview", "Team settings", "Billing & plans", "API documentation", "Release notes"]
    .filter((r) => r.toLowerCase().includes(q.toLowerCase()) || !q);
  return (
    <div className="space-y-3">
      <input
        autoFocus
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Type to search…"
        className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-400 transition"
      />
      <div className="space-y-0.5">
        {results.map((r) => (
          <div key={r} className="flex items-center gap-2 rounded-md px-2.5 py-2 hover:bg-neutral-50 transition-colors cursor-pointer">
            <FileText size={13} className="text-neutral-400 shrink-0" />
            <span className="text-sm text-neutral-700">{r}</span>
            <ChevronRight size={12} className="text-neutral-300 ml-auto" />
          </div>
        ))}
        {results.length === 0 && <p className="text-sm text-neutral-400 text-center py-4">No results</p>}
      </div>
    </div>
  );
}

function StatsContent() {
  const stats = [
    { label: "Total users", value: "12,481", change: "+8.2%" },
    { label: "Revenue", value: "$48,200", change: "+14.1%" },
    { label: "Active sessions", value: "2,340", change: "-3.4%" },
  ];
  return (
    <div className="space-y-3">
      {stats.map((s) => (
        <div key={s.label} className="flex items-center justify-between rounded-lg border border-neutral-100 bg-neutral-50 px-3 py-2.5">
          <span className="text-xs text-neutral-500">{s.label}</span>
          <div className="text-right">
            <p className="text-sm font-semibold text-neutral-900">{s.value}</p>
            <p className={`text-[10px] font-medium ${s.change.startsWith("+") ? "text-emerald-600" : "text-red-500"}`}>{s.change}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

const MAIL_TABS: WindowTab[] = [
  { id: "inbox",   label: "Inbox",   icon: <Inbox size={12} /> },
  { id: "sent",    label: "Sent",    icon: <Send size={12} /> },
  { id: "archive", label: "Archive", icon: <Archive size={12} /> },
  { id: "trash",   label: "Trash",   icon: <Trash2 size={12} /> },
];

const SETTINGS_TABS: WindowTab[] = [
  { id: "profile",  label: "Profile",  icon: <User size={12} /> },
  { id: "security", label: "Security", icon: <Shield size={12} /> },
  { id: "notifs",   label: "Notifs",   icon: <Bell size={12} /> },
];

function TabContentMail({ tab }: { tab: string }) {
  const items: Record<string, string[]> = {
    inbox:   ["Q2 report is ready", "Meeting at 3pm", "Invoice #4421"],
    sent:    ["Re: Product update", "Team standup notes"],
    archive: ["Jan newsletter", "Old onboarding flow"],
    trash:   ["Spam digest"],
  };
  return (
    <div className="space-y-1">
      {(items[tab] ?? []).map((m, i) => (
        <div key={i} className="flex items-center gap-3 rounded-md px-2 py-2.5 hover:bg-neutral-50 cursor-pointer transition-colors">
          <div className="w-2 h-2 rounded-full bg-neutral-300 shrink-0" />
          <p className="text-sm text-neutral-700">{m}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Main showcase ─────────────────────────────────────────────────────────────

export default function WindowShowcase() {
  // Each demo gets its own useWindow instance
  const basic        = useWindow();
  const noClose      = useWindow();
  const withFooter   = useWindow();
  const smWin        = useWindow();
  const lgWin        = useWindow();
  const xlWin        = useWindow();
  const searchWin    = useWindow();
  const statsWin     = useWindow();
  const notifsWin    = useWindow();
  const settingsWin  = useWindow();
  const tabsWin      = useWindow();
  const tabsSettings = useWindow();
  const customHeader = useWindow();
  const noOutside    = useWindow();
  const noEscape     = useWindow();
  const scrollWin    = useWindow();

  // Position demos — one button per position
  const positions = [
    "top-left","top-center","top-right",
    "center-left","center","center-right",
    "bottom-left","bottom-center","bottom-right",
  ] as const;
  const posWins = positions.map(() => useWindow()); // eslint-disable-line react-hooks/rules-of-hooks

  // Tabs state
  const [mailTab, setMailTab]         = useState("inbox");
  const [settingsTab, setSettingsTab] = useState("profile");

  // Event log
  const [log, setLog] = useState<string[]>([]);
  const addLog = (msg: string) => setLog((p) => [msg, ...p].slice(0, 5));
  const evtWin = useWindow();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,300;0,400;0,500;1,300&family=JetBrains+Mono:wght@400;500&family=Figtree:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; background: #f5f4f2; }
      `}</style>

      <div
        className="min-h-screen w-full px-4 py-16 bg-stone-100"
        style={{ fontFamily: "'Figtree', sans-serif" }}
      >
        {/* ── Header ──────────────────────────────────────────────────── */}
        <motion.header
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-4xl mx-auto mb-14"
        >
          <p
            className="text-[10px] font-bold tracking-[0.25em] uppercase text-neutral-400 mb-4"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            Component Library
          </p>
          <h1
            className="text-[60px] leading-[1.0] text-neutral-900 mb-4 font-light"
            style={{ fontFamily: "'Newsreader', serif" }}
          >
            Window
          </h1>
          <p className="text-base text-neutral-500 max-w-md leading-relaxed">
            A floating panel anchored to any element. Supports tabs, custom headers,
            footers, scrollable bodies, 11 positions, and full lifecycle control.
          </p>
        </motion.header>

        <div className="max-w-4xl mx-auto flex flex-col gap-6">

          {/* ── 1. Basic ─────────────────────────────────────────────── */}
          <Section index={0} title="Basic Usage" subtitle="Open a simple Window below its anchor with title and auto-close on outside click or Escape." badge="basic">
            <DemoCard label="title + showClose + closeOnOutsideClick">
              <TriggerBtn
                ref={basic.anchorRef as React.RefObject<HTMLButtonElement>}
                onClick={basic.toggle}
                label="Open window"
                icon={<Layers size={14} />}
                active={basic.isOpen}
              />
              <Window
                anchor={basic.anchorRef}
                isOpen={basic.isOpen}
                onClose={basic.close}
                title="Basic window"
                size="md"
              >
                <SimpleContent />
              </Window>
            </DemoCard>
          </Section>

          {/* ── 2. Sizes ─────────────────────────────────────────────── */}
          <Section index={1} title="Sizes" subtitle="sm · md · lg · xl — scales panel width, padding, and typography." badge="size">
            <Grid cols={2}>
              {(["sm","md","lg","xl"] as const).map((sz, i) => {
                const w = [smWin, basic, lgWin, xlWin][i];
                return (
                  <DemoCard key={sz} label={`size="${sz}"`}>
                    <TriggerBtn
                      ref={w.anchorRef as React.RefObject<HTMLButtonElement>}
                      onClick={w.toggle}
                      label={`size=${sz}`}
                      active={w.isOpen}
                    />
                    <Window anchor={w.anchorRef} isOpen={w.isOpen} onClose={w.close} title={`Size: ${sz}`} size={sz}>
                      <SimpleContent />
                    </Window>
                  </DemoCard>
                );
              })}
            </Grid>
          </Section>

          {/* ── 3. Positions ─────────────────────────────────────────── */}
          <Section index={2} title="Positions" subtitle="11 positions available — fixed viewport corners/centers plus above-element, below-element, and auto." badge="position">
            <div className="grid grid-cols-3 gap-3">
              {positions.map((pos, i) => (
                <DemoCard key={pos} label={`"${pos}"`} center>
                  <TriggerBtn
                    ref={posWins[i].anchorRef as React.RefObject<HTMLButtonElement>}
                    onClick={posWins[i].toggle}
                    label={pos.replace(/-/g, " ")}
                    active={posWins[i].isOpen}
                  />
                  <Window
                    anchor={posWins[i].anchorRef}
                    isOpen={posWins[i].isOpen}
                    onClose={posWins[i].close}
                    title={pos}
                    position={pos}
                    size="sm"
                  >
                    <p className="text-sm text-neutral-600">Positioned at <strong>{pos}</strong>.</p>
                  </Window>
                </DemoCard>
              ))}
            </div>
          </Section>

          {/* ── 4. showClose = false ─────────────────────────────────── */}
          <Section index={3} title="showClose = false" subtitle="Hides the × button — useful when the trigger itself is the toggle." badge="close">
            <DemoCard label="No close button — click trigger again to dismiss">
              <TriggerBtn
                ref={noClose.anchorRef as React.RefObject<HTMLButtonElement>}
                onClick={noClose.toggle}
                label={noClose.isOpen ? "Close window" : "Open window"}
                active={noClose.isOpen}
              />
              <Window anchor={noClose.anchorRef} isOpen={noClose.isOpen} onClose={noClose.close} title="No close button" showClose={false} size="md">
                <p className="text-sm text-neutral-600">The × button is hidden. Toggle via the trigger or press Escape.</p>
              </Window>
            </DemoCard>
          </Section>

          {/* ── 5. Footer ────────────────────────────────────────────── */}
          <Section index={4} title="Footer Slot" subtitle="Pass any ReactNode as footer — it renders in a bordered strip below the body." badge="footer">
            <DemoCard label="Window with action footer">
              <TriggerBtn
                ref={withFooter.anchorRef as React.RefObject<HTMLButtonElement>}
                onClick={withFooter.toggle}
                label="Open with footer"
                icon={<FileText size={14} />}
                active={withFooter.isOpen}
              />
              <Window
                anchor={withFooter.anchorRef}
                isOpen={withFooter.isOpen}
                onClose={withFooter.close}
                title="Account settings"
                size="md"
                footer={
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={withFooter.close} className="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-50 transition-colors">
                      Cancel
                    </button>
                    <button onClick={withFooter.close} className="rounded-lg bg-neutral-900 px-3 py-1.5 text-sm text-white hover:bg-neutral-700 transition-colors">
                      Save changes
                    </button>
                  </div>
                }
              >
                <SettingsContent />
              </Window>
            </DemoCard>
          </Section>

          {/* ── 6. Custom header ─────────────────────────────────────── */}
          <Section index={5} title="Custom Header" subtitle="Replace the title string with any ReactNode via the header prop." badge="header">
            <DemoCard label="header={<ReactNode>}">
              <TriggerBtn
                ref={customHeader.anchorRef as React.RefObject<HTMLButtonElement>}
                onClick={customHeader.toggle}
                label="Custom header"
                icon={<Zap size={14} />}
                active={customHeader.isOpen}
              />
              <Window
                anchor={customHeader.anchorRef}
                isOpen={customHeader.isOpen}
                onClose={customHeader.close}
                size="md"
                header={
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-neutral-900 flex items-center justify-center shrink-0">
                      <Zap size={11} className="text-amber-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-neutral-900">Upgrade plan</p>
                      <p className="text-[10px] text-neutral-400 leading-none">Pro features unlocked</p>
                    </div>
                  </div>
                }
                footer={
                  <button className="w-full rounded-lg bg-neutral-900 py-2 text-sm font-medium text-white hover:bg-neutral-700 transition-colors">
                    Upgrade to Pro →
                  </button>
                }
              >
                <div className="space-y-2">
                  {["Unlimited projects","Advanced analytics","Priority support","Custom domains"].map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm text-neutral-700">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      </div>
                      {f}
                    </div>
                  ))}
                </div>
              </Window>
            </DemoCard>
          </Section>

          {/* ── 7. Tabs ──────────────────────────────────────────────── */}
          <Section index={6} title="Tabs" subtitle="Pass a tabs array to render an underline tab bar at the top. Control activeTab externally." badge="tabs">
            <Grid>
              <DemoCard label="Mail tabs (4 tabs)">
                <TriggerBtn
                  ref={tabsWin.anchorRef as React.RefObject<HTMLButtonElement>}
                  onClick={tabsWin.toggle}
                  label="Open mail"
                  icon={<Inbox size={14} />}
                  active={tabsWin.isOpen}
                />
                <Window
                  anchor={tabsWin.anchorRef}
                  isOpen={tabsWin.isOpen}
                  onClose={tabsWin.close}
                  title="Messages"
                  size="md"
                  tabs={MAIL_TABS}
                  activeTab={mailTab}
                  onTabChange={setMailTab}
                >
                  <TabContentMail tab={mailTab} />
                </Window>
              </DemoCard>

              <DemoCard label="Settings tabs (3 tabs)">
                <TriggerBtn
                  ref={tabsSettings.anchorRef as React.RefObject<HTMLButtonElement>}
                  onClick={tabsSettings.toggle}
                  label="Open settings"
                  icon={<Settings size={14} />}
                  active={tabsSettings.isOpen}
                />
                <Window
                  anchor={tabsSettings.anchorRef}
                  isOpen={tabsSettings.isOpen}
                  onClose={tabsSettings.close}
                  title="Settings"
                  size="md"
                  tabs={SETTINGS_TABS}
                  activeTab={settingsTab}
                  onTabChange={setSettingsTab}
                  footer={
                    <button onClick={tabsSettings.close} className="w-full rounded-lg bg-neutral-900 py-2 text-sm text-white font-medium hover:bg-neutral-700 transition-colors">
                      Save
                    </button>
                  }
                >
                  {settingsTab === "profile"  && <SettingsContent />}
                  {settingsTab === "security" && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 rounded-lg border border-neutral-100 bg-neutral-50 p-3">
                        <Lock size={13} className="text-neutral-400" />
                        <p className="text-sm text-neutral-600">Two-factor auth is <strong>enabled</strong></p>
                      </div>
                      <div className="flex items-center gap-2 rounded-lg border border-neutral-100 bg-neutral-50 p-3">
                        <Globe size={13} className="text-neutral-400" />
                        <p className="text-sm text-neutral-600">Last sign-in: <strong>3h ago</strong></p>
                      </div>
                    </div>
                  )}
                  {settingsTab === "notifs"   && <NotificationsContent />}
                </Window>
              </DemoCard>
            </Grid>
          </Section>

          {/* ── 8. Varied content types ──────────────────────────────── */}
          <Section index={7} title="Content Variations" subtitle="Any content works inside the body — search inputs, stat cards, notification lists, and more." badge="content">
            <Grid>
              <DemoCard label="Search palette">
                <TriggerBtn
                  ref={searchWin.anchorRef as React.RefObject<HTMLButtonElement>}
                  onClick={searchWin.toggle}
                  label="Search"
                  icon={<Search size={14} />}
                  active={searchWin.isOpen}
                />
                <Window anchor={searchWin.anchorRef} isOpen={searchWin.isOpen} onClose={searchWin.close} title="Quick search" size="md">
                  <SearchContent />
                </Window>
              </DemoCard>

              <DemoCard label="Stats panel">
                <TriggerBtn
                  ref={statsWin.anchorRef as React.RefObject<HTMLButtonElement>}
                  onClick={statsWin.toggle}
                  label="View stats"
                  icon={<BarChart2 size={14} />}
                  active={statsWin.isOpen}
                />
                <Window anchor={statsWin.anchorRef} isOpen={statsWin.isOpen} onClose={statsWin.close} title="This week" size="md">
                  <StatsContent />
                </Window>
              </DemoCard>

              <DemoCard label="Notifications">
                <TriggerBtn
                  ref={notifsWin.anchorRef as React.RefObject<HTMLButtonElement>}
                  onClick={notifsWin.toggle}
                  label="Notifications"
                  icon={<Bell size={14} />}
                  active={notifsWin.isOpen}
                />
                <Window anchor={notifsWin.anchorRef} isOpen={notifsWin.isOpen} onClose={notifsWin.close} title="Notifications" size="md">
                  <NotificationsContent />
                </Window>
              </DemoCard>

              <DemoCard label="Scrollable body (maxHeight)">
                <TriggerBtn
                  ref={scrollWin.anchorRef as React.RefObject<HTMLButtonElement>}
                  onClick={scrollWin.toggle}
                  label="Long list"
                  icon={<Filter size={14} />}
                  active={scrollWin.isOpen}
                />
                <Window anchor={scrollWin.anchorRef} isOpen={scrollWin.isOpen} onClose={scrollWin.close} title="All items" size="md" maxHeight={180}>
                  <div className="space-y-1">
                    {Array.from({ length: 12 }, (_, i) => (
                      <div key={i} className="flex items-center gap-2 rounded-md px-2 py-2 hover:bg-neutral-50 cursor-pointer transition-colors">
                        <FileText size={12} className="text-neutral-400 shrink-0" />
                        <span className="text-sm text-neutral-700">Item {i + 1}</span>
                      </div>
                    ))}
                  </div>
                </Window>
              </DemoCard>
            </Grid>
          </Section>

          {/* ── 9. Dismiss behaviour ─────────────────────────────────── */}
          <Section index={8} title="Dismiss Behaviour" subtitle="closeOnOutsideClick and closeOnEscape are independent — mix and match." badge="dismiss">
            <Grid>
              <DemoCard label="closeOnOutsideClick={false}">
                <TriggerBtn
                  ref={noOutside.anchorRef as React.RefObject<HTMLButtonElement>}
                  onClick={noOutside.toggle}
                  label="No outside close"
                  active={noOutside.isOpen}
                />
                <Window anchor={noOutside.anchorRef} isOpen={noOutside.isOpen} onClose={noOutside.close} title="Sticky window" size="sm" closeOnOutsideClick={false}>
                  <p className="text-sm text-neutral-600">Clicking outside does nothing. Use × or Escape.</p>
                </Window>
              </DemoCard>

              <DemoCard label="closeOnEscape={false}">
                <TriggerBtn
                  ref={noEscape.anchorRef as React.RefObject<HTMLButtonElement>}
                  onClick={noEscape.toggle}
                  label="No Escape close"
                  active={noEscape.isOpen}
                />
                <Window anchor={noEscape.anchorRef} isOpen={noEscape.isOpen} onClose={noEscape.close} title="Escape ignored" size="sm" closeOnEscape={false}>
                  <p className="text-sm text-neutral-600">Escape key is disabled. Close via × or outside click.</p>
                </Window>
              </DemoCard>
            </Grid>
          </Section>

          {/* ── 10. Event callbacks ──────────────────────────────────── */}
          <Section index={9} title="Event Callbacks" subtitle="useWindow exposes open · close · toggle. Wire onOpen / onClose to log lifecycle events." badge="events">
            <DemoCard label="Live open/close event log">
              <TriggerBtn
                ref={evtWin.anchorRef as React.RefObject<HTMLButtonElement>}
                onClick={() => {
                  evtWin.toggle();
                  addLog(evtWin.isOpen ? "close() called" : "open() called");
                }}
                label={evtWin.isOpen ? "Close" : "Open"}
                active={evtWin.isOpen}
              />
              <Window
                anchor={evtWin.anchorRef}
                isOpen={evtWin.isOpen}
                onClose={() => { evtWin.close(); addLog("onClose fired (outside click / Escape / ×)"); }}
                title="Event window"
                size="md"
              >
                <p className="text-sm text-neutral-600">Open and close this window in different ways and watch the log below.</p>
              </Window>

              <div
                className="mt-4 rounded-lg border border-neutral-200 bg-neutral-50 p-3 min-h-[90px]"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {log.length === 0 ? (
                  <p className="text-[11px] text-neutral-400">Interact above to see events…</p>
                ) : (
                  log.map((e, i) => (
                    <motion.p key={i} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} className="text-[11px] text-neutral-700 leading-relaxed">
                      {e}
                    </motion.p>
                  ))
                )}
              </div>
            </DemoCard>
          </Section>

          {/* ── 11. Real-world: profile popover ──────────────────────── */}
          <Section index={10} title="Real-world: Profile Popover" subtitle="Avatar trigger opens a richly structured Window with tabs, custom header, and footer actions." badge="example">
            <DemoCard label="Click the avatar">
              <div className="flex items-center gap-3">
                <button
                  ref={settingsWin.anchorRef as React.RefObject<HTMLButtonElement>}
                  onClick={settingsWin.toggle}
                  className={`w-10 h-10 rounded-full bg-neutral-800 text-white font-semibold text-sm flex items-center justify-center transition-all ${settingsWin.isOpen ? "ring-2 ring-neutral-400 ring-offset-2" : "hover:ring-2 hover:ring-neutral-200 hover:ring-offset-2"}`}
                >
                  JD
                </button>
                <div>
                  <p className="text-sm font-medium text-neutral-900">Jane Doe</p>
                  <p className="text-xs text-neutral-400">jane@example.com</p>
                </div>
              </div>
              <Window
                anchor={settingsWin.anchorRef}
                isOpen={settingsWin.isOpen}
                onClose={settingsWin.close}
                size="md"
                position="below-element"
                tabs={SETTINGS_TABS}
                activeTab={settingsTab}
                onTabChange={setSettingsTab}
                header={
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-neutral-800 text-white text-sm font-semibold flex items-center justify-center shrink-0">
                      JD
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-neutral-900">Jane Doe</p>
                      <p className="text-[11px] text-neutral-400">Pro plan</p>
                    </div>
                  </div>
                }
                footer={
                  <div className="flex items-center gap-2">
                    <button onClick={settingsWin.close} className="flex-1 rounded-lg border border-neutral-200 py-1.5 text-sm text-neutral-600 hover:bg-neutral-50 transition-colors">
                      Log out
                    </button>
                    <button onClick={settingsWin.close} className="flex-1 rounded-lg bg-neutral-900 py-1.5 text-sm text-white hover:bg-neutral-700 transition-colors">
                      Save
                    </button>
                  </div>
                }
              >
                {settingsTab === "profile"  && <SettingsContent />}
                {settingsTab === "security" && (
                  <div className="flex items-center gap-2 rounded-lg border border-neutral-100 bg-neutral-50 p-3">
                    <Shield size={13} className="text-neutral-400" />
                    <p className="text-sm text-neutral-600">2FA is <strong>enabled</strong></p>
                  </div>
                )}
                {settingsTab === "notifs" && <NotificationsContent />}
              </Window>
            </DemoCard>
          </Section>

          {/* footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="text-center text-[11px] text-neutral-400 pb-4"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            Window · All variants · React + Framer Motion + Tailwind
          </motion.p>
        </div>
      </div>
    </>
  );
}

// Patch: forward ref shim for TriggerBtn so anchorRef works on the button element
const TriggerBtn = React.forwardRef<HTMLButtonElement, {
  onClick: () => void; label: string; icon?: React.ReactNode; active?: boolean;
}>(({ onClick, label, icon, active = false }, ref) => (
  <button
    ref={ref}
    onClick={onClick}
    className={`inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-medium transition-all duration-150 ${
      active
        ? "border-neutral-800 bg-neutral-900 text-white shadow-sm"
        : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50"
    }`}
  >
    {icon}{label}
  </button>
));
TriggerBtn.displayName = "TriggerBtn";