import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  MoreHorizontal,
  MoreVertical,
  Settings,
  Trash2,
  Edit3,
  Copy,
  Download,
  Share2,
  Archive,
  Star,
  Flag,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  RefreshCw,
  LogOut,
  UserPlus,
  Mail,
  Bell,
  BellOff,
  Link,
  ExternalLink,
  ChevronDown,
  Sliders,
  Bookmark,
  Tag,
  Move,
  Scissors,
  FileText,
  FolderOpen,
  Zap,
  Shield,
  AlertTriangle,
  CheckCircle,
  Info,
  Upload,
  Code,
  Database,
} from "lucide-react";
import {
  ActionMenu,
  DefaultTrigger,
  IconTrigger,
} from "../../ui/navigations/action/Action.menu.ui"; // adjust path
import type { ActionItem } from "../../context/action/Action.menu.context"; // adjust path

// ─── Shared item sets ─────────────────────────────────────────────────────────

const BASIC_ITEMS: ActionItem[] = [
  { id: "edit",     label: "Edit",     leadingIcon: <Edit3 size={14} />,    onClick: () => {} },
  { id: "copy",     label: "Copy",     leadingIcon: <Copy size={14} />,     onClick: () => {} },
  { id: "share",    label: "Share",    leadingIcon: <Share2 size={14} />,   onClick: () => {} },
  { id: "delete",   label: "Delete",   leadingIcon: <Trash2 size={14} />,   variant: "danger", dividerBefore: true, onClick: () => {} },
];

const WITH_DESCRIPTIONS: ActionItem[] = [
  { id: "rename",   label: "Rename",   description: "Change the display name",   leadingIcon: <Edit3 size={14} /> },
  { id: "duplicate",label: "Duplicate",description: "Create an exact copy",      leadingIcon: <Copy size={14} /> },
  { id: "move",     label: "Move to",  description: "Change its parent folder",  leadingIcon: <Move size={14} /> },
  { id: "archive",  label: "Archive",  description: "Hide without deleting",     leadingIcon: <Archive size={14} />, dividerBefore: true },
  { id: "delete",   label: "Delete permanently", description: "Cannot be undone", leadingIcon: <Trash2 size={14} />, variant: "danger" },
];

const WITH_SHORTCUTS: ActionItem[] = [
  { id: "cut",    label: "Cut",    leadingIcon: <Scissors size={14} />,     trailingText: "⌘X" },
  { id: "copy",   label: "Copy",   leadingIcon: <Copy size={14} />,         trailingText: "⌘C" },
  { id: "paste",  label: "Paste",  leadingIcon: <FileText size={14} />,     trailingText: "⌘V" },
  { id: "undo",   label: "Undo",   leadingIcon: <RefreshCw size={14} />,    trailingText: "⌘Z",  dividerBefore: true },
  { id: "save",   label: "Save",   leadingIcon: <Download size={14} />,     trailingText: "⌘S" },
];

const GROUPED_ITEMS: ActionItem[] = [
  { id: "view",    label: "View file",   leadingIcon: <Eye size={14} />,       header: "File" },
  { id: "open",    label: "Open folder", leadingIcon: <FolderOpen size={14} /> },
  { id: "dl",      label: "Download",    leadingIcon: <Download size={14} /> },
  { id: "link",    label: "Copy link",   leadingIcon: <Link size={14} />,      dividerBefore: true, header: "Share" },
  { id: "ext",     label: "Open in new tab", leadingIcon: <ExternalLink size={14} /> },
  { id: "email",   label: "Send via email",  leadingIcon: <Mail size={14} /> },
  { id: "del",     label: "Delete",      leadingIcon: <Trash2 size={14} />,    variant: "danger", dividerBefore: true, header: "Danger zone" },
];

const VARIANT_ITEMS: ActionItem[] = [
  { id: "info",    label: "View details",  leadingIcon: <Info size={14} />,          variant: "default" },
  { id: "success", label: "Mark resolved", leadingIcon: <CheckCircle size={14} />,   variant: "success" },
  { id: "warn",    label: "Flag for review", leadingIcon: <AlertTriangle size={14} />, variant: "warning" },
  { id: "danger",  label: "Delete record", leadingIcon: <Trash2 size={14} />,        variant: "danger" },
];

const WITH_SUBMENU: ActionItem[] = [
  { id: "edit",   label: "Edit",   leadingIcon: <Edit3 size={14} /> },
  {
    id: "share",
    label: "Share",
    leadingIcon: <Share2 size={14} />,
    children: [
      { id: "share-link",  label: "Copy link",      leadingIcon: <Link size={14} /> },
      { id: "share-email", label: "Email invite",   leadingIcon: <Mail size={14} /> },
      { id: "share-ext",   label: "Open publicly",  leadingIcon: <ExternalLink size={14} /> },
    ],
  },
  {
    id: "export",
    label: "Export as",
    leadingIcon: <Upload size={14} />,
    children: [
      { id: "exp-pdf",  label: "PDF",  leadingIcon: <FileText size={14} />, trailingText: ".pdf" },
      { id: "exp-csv",  label: "CSV",  leadingIcon: <Database size={14} />, trailingText: ".csv" },
      { id: "exp-json", label: "JSON", leadingIcon: <Code size={14} />,     trailingText: ".json" },
    ],
  },
  { id: "delete", label: "Delete", leadingIcon: <Trash2 size={14} />, variant: "danger", dividerBefore: true },
];

const DISABLED_ITEMS: ActionItem[] = [
  { id: "edit",     label: "Edit",     leadingIcon: <Edit3 size={14} /> },
  { id: "publish",  label: "Publish",  leadingIcon: <Zap size={14} />,    disabled: true },
  { id: "share",    label: "Share",    leadingIcon: <Share2 size={14} />, disabled: true },
  { id: "lock",     label: "Lock",     leadingIcon: <Lock size={14} /> },
  { id: "delete",   label: "Delete",   leadingIcon: <Trash2 size={14} />, variant: "danger", dividerBefore: true },
];

const NOTIFICATION_ITEMS: ActionItem[] = [
  { id: "mute",    label: "Mute notifications", leadingIcon: <BellOff size={14} /> },
  { id: "star",    label: "Star",               leadingIcon: <Star size={14} />,    variant: "default" },
  { id: "bookmark",label: "Bookmark",           leadingIcon: <Bookmark size={14} /> },
  { id: "tag",     label: "Add tag",            leadingIcon: <Tag size={14} /> },
  { id: "flag",    label: "Report",             leadingIcon: <Flag size={14} />,    variant: "warning", dividerBefore: true },
  { id: "block",   label: "Block user",         leadingIcon: <Shield size={14} />,  variant: "danger" },
];

const PROFILE_ITEMS: ActionItem[] = [
  { id: "profile",  label: "View profile",     leadingIcon: <Eye size={14} /> },
  { id: "settings", label: "Account settings", leadingIcon: <Settings size={14} />,  trailingText: "⌘," },
  { id: "invite",   label: "Invite teammate",  leadingIcon: <UserPlus size={14} />,  dividerBefore: true },
  { id: "notify",   label: "Notification prefs", leadingIcon: <Bell size={14} /> },
  { id: "logout",   label: "Sign out",         leadingIcon: <LogOut size={14} />,    variant: "danger", dividerBefore: true },
];

// ─── Layout helpers ───────────────────────────────────────────────────────────

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

function DemoCard({ label, children, center = false }: { label: string; children: React.ReactNode; center?: boolean }) {
  return (
    <div className={`rounded-xl border border-neutral-100 bg-neutral-50 p-5 flex flex-col gap-3 ${center ? "items-center" : ""}`}>
      <p className="text-[9px] font-bold tracking-[0.18em] uppercase text-neutral-400 font-mono w-full">{label}</p>
      <div className={center ? "flex items-center justify-center w-full py-2" : ""}>{children}</div>
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

function Row({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap items-start gap-4">{children}</div>;
}

function LiveBadge({ value }: { value: string }) {
  return value ? (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: 3 }}
      animate={{ opacity: 1, y: 0 }}
      className="inline-block rounded bg-neutral-100 border border-neutral-200 px-2 py-0.5 text-xs font-mono text-neutral-700"
    >
      {value}
    </motion.span>
  ) : (
    <span className="text-xs font-mono text-neutral-400">—</span>
  );
}

// ─── Fake table row for context menu demo ─────────────────────────────────────
function FakeTableRow({ name, status, date }: { name: string; status: string; date: string }) {
  return (
    <div className="flex items-center gap-4 px-4 py-3 border-b border-neutral-100 last:border-0 hover:bg-neutral-50 transition-colors group rounded-lg">
      <div className="w-6 h-6 rounded-full bg-neutral-200 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-neutral-800 truncate">{name}</p>
        <p className="text-xs text-neutral-400">{date}</p>
      </div>
      <span className={`text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full ${
        status === "Active" ? "bg-emerald-50 text-emerald-600" :
        status === "Draft"  ? "bg-amber-50 text-amber-600" :
                              "bg-neutral-100 text-neutral-500"
      }`}>
        {status}
      </span>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <ActionMenu
          items={WITH_DESCRIPTIONS}
          trigger={<IconTrigger icon={<MoreHorizontal size={15} />} />}
          align="bottom-right"
          size="md"
        />
      </div>
    </div>
  );
}

// ─── Main showcase page ───────────────────────────────────────────────────────

export default function ActionMenuShowcase() {
  const [lastAction, setLastAction] = useState("");
  const [eventLog, setEventLog]     = useState<string[]>([]);

  const log = (msg: string) => setEventLog((p) => [msg, ...p].slice(0, 6));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=IBM+Plex+Mono:wght@400;500&family=Geist:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; background: #f5f5f4; }
      `}</style>

      <div
        className="min-h-screen w-full px-4 py-16 bg-stone-100"
        style={{ fontFamily: "'Geist', sans-serif" }}
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
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            Component Library · v1
          </p>
          <h1
            className="text-[64px] leading-[1.0] font-normal text-neutral-900 mb-4"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Action Menu
          </h1>
          <p className="text-base text-neutral-500 max-w-md leading-relaxed">
            Contextual action dropdowns with submenus, item variants, keyboard
            shortcuts, grouping, and custom triggers — all in one composable primitive.
          </p>
        </motion.header>

        <div className="max-w-4xl mx-auto flex flex-col gap-6">

          {/* 1 · Basic */}
          <Section index={0} title="Basic Usage" subtitle="The simplest ActionMenu with a DefaultTrigger and four items." badge="basic">
            <Row>
              <DemoCard label="Default trigger">
                <ActionMenu items={BASIC_ITEMS} trigger={<DefaultTrigger label="Actions" trailingIcon={<ChevronDown size={12} />} />} />
              </DemoCard>
              <DemoCard label="Ghost variant">
                <ActionMenu items={BASIC_ITEMS} trigger={<DefaultTrigger label="Options" variant="ghost" trailingIcon={<ChevronDown size={12} />} />} />
              </DemoCard>
              <DemoCard label="Outline variant">
                <ActionMenu items={BASIC_ITEMS} trigger={<DefaultTrigger label="Menu" variant="outline" trailingIcon={<ChevronDown size={12} />} />} />
              </DemoCard>
            </Row>
          </Section>

          {/* 2 · Icon triggers */}
          <Section index={1} title="Icon Triggers" subtitle="Use IconTrigger for compact contexts like table rows, cards, and toolbars." badge="trigger">
            <Row>
              <DemoCard label="Ghost (default)" center>
                <ActionMenu items={BASIC_ITEMS} trigger={<IconTrigger icon={<MoreHorizontal size={16} />} />} />
              </DemoCard>
              <DemoCard label="Ghost vertical" center>
                <ActionMenu items={BASIC_ITEMS} trigger={<IconTrigger icon={<MoreVertical size={16} />} />} />
              </DemoCard>
              <DemoCard label="Border variant" center>
                <ActionMenu items={BASIC_ITEMS} trigger={<IconTrigger icon={<Settings size={16} />} variant="default" />} />
              </DemoCard>
              <DemoCard label="Sliders icon" center>
                <ActionMenu items={BASIC_ITEMS} trigger={<IconTrigger icon={<Sliders size={16} />} variant="default" />} />
              </DemoCard>
            </Row>
          </Section>

          {/* 3 · Custom trigger */}
          <Section index={2} title="Custom Triggers" subtitle="Any React node works as a trigger — avatar, badge, or fully custom button." badge="custom">
            <Row>
              <DemoCard label="Avatar trigger" center>
                <ActionMenu
                  items={PROFILE_ITEMS}
                  trigger={
                    <button className="w-9 h-9 rounded-full bg-neutral-800 text-white text-sm font-semibold flex items-center justify-center hover:ring-2 hover:ring-neutral-300 transition-all">
                      JD
                    </button>
                  }
                  align="bottom-right"
                />
              </DemoCard>
              <DemoCard label="Pill trigger" center>
                <ActionMenu
                  items={BASIC_ITEMS}
                  trigger={
                    <button className="flex items-center gap-2 rounded-full bg-neutral-900 text-white text-sm font-medium px-4 py-2 hover:bg-neutral-700 transition-colors">
                      <Zap size={13} /> Quick actions
                    </button>
                  }
                />
              </DemoCard>
              <DemoCard label="Badge trigger" center>
                <ActionMenu
                  items={NOTIFICATION_ITEMS}
                  trigger={
                    <button className="relative flex items-center justify-center w-9 h-9 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 transition-colors text-neutral-600">
                      <Bell size={16} />
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
                    </button>
                  }
                  align="bottom-right"
                />
              </DemoCard>
            </Row>
          </Section>

          {/* 4 · Sizes */}
          <Section index={3} title="Sizes" subtitle="sm · md · lg · xl scale the trigger button, menu width, and all typography." badge="size">
            <Grid>
              {(["sm", "md", "lg", "xl"] as const).map((sz) => (
                <DemoCard key={sz} label={`size="${sz}"`}>
                  <ActionMenu
                    items={BASIC_ITEMS}
                    size={sz}
                    trigger={<DefaultTrigger label={`Size ${sz}`} size={sz} trailingIcon={<ChevronDown size={10} />} />}
                  />
                </DemoCard>
              ))}
            </Grid>
          </Section>

          {/* 5 · Item variants */}
          <Section index={4} title="Item Variants" subtitle="default · success · warning · danger — each has its own color system for text and hover state." badge="variant">
            <DemoCard label="All four variants in one menu">
              <ActionMenu
                items={VARIANT_ITEMS}
                trigger={<DefaultTrigger label="Status actions" trailingIcon={<ChevronDown size={12} />} />}
              />
            </DemoCard>
          </Section>

          {/* 6 · Descriptions */}
          <Section index={5} title="Descriptions" subtitle="Each ActionItem accepts an optional description rendered as a subtitle below the label." badge="meta">
            <DemoCard label="Items with descriptions">
              <ActionMenu
                items={WITH_DESCRIPTIONS}
                size="lg"
                trigger={<DefaultTrigger label="File actions" size="lg" trailingIcon={<ChevronDown size={12} />} />}
              />
            </DemoCard>
          </Section>

          {/* 7 · Keyboard shortcuts */}
          <Section index={6} title="Keyboard Shortcuts" subtitle="trailingText renders flush-right — use it for keyboard shortcuts, badges, or counts." badge="trailing">
            <DemoCard label="Shortcut hints via trailingText">
              <ActionMenu
                items={WITH_SHORTCUTS}
                trigger={<DefaultTrigger label="Edit" trailingIcon={<ChevronDown size={12} />} />}
              />
            </DemoCard>
          </Section>

          {/* 8 · Groups & headers */}
          <Section index={7} title="Groups & Headers" subtitle="header renders a section label above an item; dividerBefore adds a horizontal rule." badge="groups">
            <DemoCard label="Three sections with headers + dividers">
              <ActionMenu
                items={GROUPED_ITEMS}
                size="md"
                trigger={<DefaultTrigger label="More options" trailingIcon={<ChevronDown size={12} />} />}
              />
            </DemoCard>
          </Section>

          {/* 9 · Submenus */}
          <Section index={8} title="Nested Submenus" subtitle="children on any ActionItem opens a hover-triggered fly-out panel, auto-positioned left or right." badge="submenu">
            <Grid>
              <DemoCard label="Hover to reveal submenus">
                <ActionMenu
                  items={WITH_SUBMENU}
                  trigger={<DefaultTrigger label="Actions" trailingIcon={<ChevronDown size={12} />} />}
                />
              </DemoCard>
              <DemoCard label="Large size submenu">
                <ActionMenu
                  items={WITH_SUBMENU}
                  size="lg"
                  trigger={<DefaultTrigger label="Actions" size="lg" trailingIcon={<ChevronDown size={12} />} />}
                />
              </DemoCard>
            </Grid>
          </Section>

          {/* 10 · Disabled items & whole menu */}
          <Section index={9} title="Disabled States" subtitle="Per-item disabled dims and blocks individual rows; top-level disabled blocks the trigger entirely." badge="disabled">
            <Grid>
              <DemoCard label="Disabled items inside menu">
                <ActionMenu
                  items={DISABLED_ITEMS}
                  trigger={<DefaultTrigger label="Actions" trailingIcon={<ChevronDown size={12} />} />}
                />
              </DemoCard>
              <DemoCard label="Whole menu disabled" center>
                <ActionMenu
                  items={BASIC_ITEMS}
                  disabled
                  trigger={<DefaultTrigger label="Disabled menu" trailingIcon={<ChevronDown size={12} />} />}
                />
              </DemoCard>
            </Grid>
          </Section>

          {/* 11 · Alignment */}
          <Section index={10} title="Alignment / Position" subtitle="Force the panel to open in a specific direction rather than auto-detecting viewport space." badge="align">
            <Grid cols={2}>
              {(["bottom-left", "bottom-right", "top-left", "top-right"] as const).map((a) => (
                <DemoCard key={a} label={`align="${a}"`}>
                  <ActionMenu
                    items={BASIC_ITEMS}
                    align={a}
                    trigger={<DefaultTrigger label={a} trailingIcon={<ChevronDown size={11} />} />}
                  />
                </DemoCard>
              ))}
            </Grid>
          </Section>

          {/* 12 · onAction callback */}
          <Section index={11} title="onAction Callback" subtitle="A single onAction handler fires for every item click, receiving the full ActionItem object." badge="events">
            <DemoCard label="Click any item to capture it">
              <ActionMenu
                items={[...BASIC_ITEMS, ...VARIANT_ITEMS.map(i => ({ ...i, id: `v-${i.id}`, dividerBefore: i.id === "info" }))]}
                trigger={<DefaultTrigger label="Trigger action" trailingIcon={<ChevronDown size={12} />} />}
                onAction={(item) => {
                  setLastAction(item.label);
                  log(`onAction → { id: "${item.id}", label: "${item.label}", variant: "${item.variant ?? "default"}" }`);
                }}
              />
              <div className="mt-4 flex items-center gap-2 flex-wrap">
                <span className="text-[9px] font-bold tracking-widest uppercase text-neutral-400 font-mono">Last action:</span>
                <LiveBadge value={lastAction} />
              </div>
              <div
                className="mt-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3 min-h-[96px]"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              >
                {eventLog.length === 0 ? (
                  <p className="text-[11px] text-neutral-400">Interact above to see log…</p>
                ) : (
                  eventLog.map((e, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-[11px] text-neutral-700 leading-relaxed"
                    >
                      {e}
                    </motion.p>
                  ))
                )}
              </div>
            </DemoCard>
          </Section>

          {/* 13 · onOpen / onClose */}
          <Section index={12} title="onOpen & onClose Callbacks" subtitle="Lifecycle hooks fire whenever the menu opens or closes." badge="lifecycle">
            <DemoCard label="Open/close event log">
              <ActionMenu
                items={BASIC_ITEMS}
                trigger={<DefaultTrigger label="Open me" trailingIcon={<ChevronDown size={12} />} />}
                onOpen={() => log("onOpen fired")}
                onClose={() => log("onClose fired")}
              />
              <div
                className="mt-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3 min-h-[64px]"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              >
                {eventLog.filter(e => e.includes("fired")).slice(0, 3).length === 0 ? (
                  <p className="text-[11px] text-neutral-400">Open or close the menu above…</p>
                ) : (
                  eventLog.filter(e => e.includes("fired")).slice(0, 3).map((e, i) => (
                    <motion.p key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[11px] text-neutral-700">
                      {e}
                    </motion.p>
                  ))
                )}
              </div>
            </DemoCard>
          </Section>

          {/* 14 · Real-world: Table with per-row menus */}
          <Section index={13} title="Real-world: Table with Row Actions" subtitle="ActionMenu embedded inline inside a data table — appears on hover via group-hover." badge="example">
            <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
              <div className="flex items-center gap-4 px-4 py-2.5 border-b border-neutral-100 bg-neutral-50">
                <div className="w-6 shrink-0" />
                <p className="flex-1 text-[10px] font-bold tracking-widest uppercase text-neutral-400">Name</p>
                <p className="w-20 text-[10px] font-bold tracking-widest uppercase text-neutral-400">Status</p>
                <div className="w-8 shrink-0" />
              </div>
              <FakeTableRow name="Homepage redesign"      status="Active"   date="Updated 2h ago" />
              <FakeTableRow name="API documentation"      status="Draft"    date="Updated yesterday" />
              <FakeTableRow name="Mobile app v2"          status="Active"   date="Updated 3d ago" />
              <FakeTableRow name="Brand identity refresh" status="Archived" date="Updated 2w ago" />
            </div>
          </Section>

          {/* 15 · Real-world: Toolbar */}
          <Section index={14} title="Real-world: Editor Toolbar" subtitle="Multiple ActionMenus composing a document editor toolbar." badge="example">
            <div className="rounded-xl border border-neutral-200 bg-white p-3 flex items-center gap-2 flex-wrap">
              <ActionMenu
                items={WITH_SHORTCUTS}
                size="sm"
                trigger={<DefaultTrigger label="Edit" size="sm" variant="ghost" trailingIcon={<ChevronDown size={10} />} />}
              />
              <ActionMenu
                items={WITH_SUBMENU}
                size="sm"
                trigger={<DefaultTrigger label="Insert" size="sm" variant="ghost" trailingIcon={<ChevronDown size={10} />} />}
              />
              <ActionMenu
                items={GROUPED_ITEMS}
                size="sm"
                trigger={<DefaultTrigger label="Share" size="sm" variant="ghost" trailingIcon={<ChevronDown size={10} />} />}
              />
              <div className="h-5 w-px bg-neutral-200 mx-1" />
              <ActionMenu
                items={PROFILE_ITEMS}
                size="sm"
                align="bottom-right"
                trigger={
                  <button className="w-7 h-7 rounded-full bg-neutral-800 text-white text-xs font-semibold flex items-center justify-center hover:bg-neutral-600 transition-colors">
                    JD
                  </button>
                }
              />
              <div className="flex-1" />
              <ActionMenu
                items={NOTIFICATION_ITEMS}
                size="sm"
                align="bottom-right"
                trigger={<IconTrigger icon={<MoreHorizontal size={14} />} size="sm" />}
              />
            </div>
          </Section>

          {/* footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="text-center text-[11px] text-neutral-400 pb-4"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            ActionMenu · All variants · React + Framer Motion + Tailwind
          </motion.p>
        </div>
      </div>
    </>
  );
}