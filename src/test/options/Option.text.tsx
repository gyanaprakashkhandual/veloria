import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Globe,
  Layers,
  Zap,
  Shield,
  Star,
  Flag,
  Cpu,
  Database,
  BarChart2,
  Users,
  GitBranch,
  Terminal,
  Moon,
  Sun,
  Cloud,
  Lock,
  Unlock,
} from "lucide-react";
import { OptionMenu } from "../../ui/options/Option.ui"; // adjust path as needed
import type { OptionItem } from "../../ui/options/Option.ui";    // adjust path as needed
import { FiFigma } from "react-icons/fi";
import { BsSlack } from "react-icons/bs";
import { DiChrome } from "react-icons/di";

// ─── Sample datasets ─────────────────────────────────────────────────────────

const COUNTRIES: OptionItem[] = [
  { value: "us", label: "United States", icon: <Flag size={13} />, description: "North America" },
  { value: "gb", label: "United Kingdom", icon: <Flag size={13} />, description: "Europe" },
  { value: "de", label: "Germany",        icon: <Flag size={13} />, description: "Europe" },
  { value: "jp", label: "Japan",          icon: <Flag size={13} />, description: "Asia" },
  { value: "in", label: "India",          icon: <Flag size={13} />, description: "Asia" },
  { value: "br", label: "Brazil",         icon: <Flag size={13} />, description: "South America" },
  { value: "au", label: "Australia",      icon: <Flag size={13} />, description: "Oceania" },
  { value: "ca", label: "Canada",         icon: <Flag size={13} />, description: "North America" },
];

const TECH_STACK: OptionItem[] = [
  { value: "react",   label: "React",      icon: <Layers size={13} />,   description: "UI library" },
  { value: "vue",     label: "Vue",        icon: <Zap size={13} />,      description: "Progressive framework" },
  { value: "svelte",  label: "Svelte",     icon: <Cpu size={13} />,      description: "Compiled framework" },
  { value: "next",    label: "Next.js",    icon: <Globe size={13} />,    description: "React meta-framework" },
  { value: "nuxt",    label: "Nuxt",       icon: <Globe size={13} />,    description: "Vue meta-framework" },
  { value: "astro",   label: "Astro",      icon: <Star size={13} />,     description: "Island architecture" },
];

const ROLES: OptionItem[] = [
  { value: "owner",   label: "Owner",  icon: <Shield size={13} />, description: "Full access" },
  { value: "admin",   label: "Admin",  icon: <Lock size={13} />,   description: "Manage members" },
  { value: "editor",  label: "Editor", icon: <Unlock size={13} />, description: "Edit content" },
  { value: "viewer",  label: "Viewer", icon: <Users size={13} />,  description: "Read only", disabled: false },
  { value: "guest",   label: "Guest",  icon: <Users size={13} />,  description: "Limited access", disabled: true },
];

const INTEGRATIONS: OptionItem[] = [
  {
    value: "design",
    label: "Design",
    header: "Design Tools",
    children: [
      { value: "figma",   label: "Figma",        icon: <FiFigma size={13} />,      description: "Collaborative design" },
      { value: "framer",  label: "Framer",       icon: <Layers size={13} />,     description: "Prototyping" },
    ],
  },
  {
    value: "dev",
    label: "Dev Tools",
    dividerBefore: true,
    header: "Development",
    children: [
      { value: "github",  label: "GitHub",       icon: <GitBranch size={13} />,  description: "Version control" },
      { value: "terminal",label: "Terminal",     icon: <Terminal size={13} />,   description: "CLI tools" },
    ],
  },
  {
    value: "collab",
    label: "Collaboration",
    dividerBefore: true,
    header: "Collaboration",
    children: [
      { value: "slack",   label: "Slack",        icon: <BsSlack size={13} />,      description: "Messaging" },
      { value: "chrome",  label: "Chrome DevTools", icon: <DiChrome size={13} />, description: "Browser debugging" },
    ],
  },
];

const INFRASTRUCTURE: OptionItem[] = [
  { value: "compute",  label: "Compute",      icon: <Cpu size={13} />,       header: "Cloud Services" },
  { value: "storage",  label: "Storage",      icon: <Database size={13} />,  dividerBefore: false },
  { value: "analytics",label: "Analytics",    icon: <BarChart2 size={13} />, description: "Usage insights" },
  { value: "cdn",      label: "CDN",          icon: <Cloud size={13} />,     description: "Edge delivery", dividerBefore: true, header: "Networking" },
  { value: "dns",      label: "DNS",          icon: <Globe size={13} />,     description: "Domain routing" },
  { value: "ssl",      label: "SSL / TLS",    icon: <Shield size={13} />,    description: "Encrypted traffic" },
];

const THEME_OPTIONS: OptionItem[] = [
  { value: "light", label: "Light", icon: <Sun size={13} /> },
  { value: "dark",  label: "Dark",  icon: <Moon size={13} /> },
  { value: "auto",  label: "System",icon: <Cpu size={13} /> },
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
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: "easeOut" }}
      className="border border-stone-200 rounded-2xl p-8 bg-white"
    >
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h2 className="text-lg font-bold text-stone-900 tracking-tight leading-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1 text-sm text-stone-400 leading-relaxed">{subtitle}</p>
          )}
        </div>
        {badge && (
          <span className="shrink-0 rounded border border-stone-300 px-2.5 py-0.5 text-[10px] font-bold tracking-[0.15em] uppercase text-stone-500 bg-stone-50">
            {badge}
          </span>
        )}
      </div>
      {children}
    </motion.section>
  );
}

function DemoCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-stone-100 bg-stone-50 p-5 flex flex-col gap-3">
      <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-stone-400">{label}</p>
      {children}
    </div>
  );
}

function Grid({ children, cols = 2 }: { children: React.ReactNode; cols?: number }) {
  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
      {children}
    </div>
  );
}

function LiveValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 mt-3 flex-wrap">
      <span className="text-[10px] font-bold tracking-widest uppercase text-stone-400">{label}:</span>
      <code className="rounded bg-stone-100 border border-stone-200 px-2 py-0.5 text-xs font-mono text-stone-700">
        {value || "—"}
      </code>
    </div>
  );
}

// ─── Main showcase ────────────────────────────────────────────────────────────

export default function OptionMenuShowcase() {
  const [multiValue, setMultiValue] = useState<string[]>([]);
  const [controlledRole, setControlledRole] = useState<string[]>([]);
  const [eventLog, setEventLog] = useState<string[]>([]);

  const log = (msg: string) => setEventLog((p) => [msg, ...p].slice(0, 5));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; background: #fafaf9; }
      `}</style>

      <div
        className="min-h-screen w-full px-4 py-16 bg-stone-50"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {/* ── Page header ───────────────────────────────────────────────── */}
        <motion.header
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-4xl mx-auto mb-14"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px flex-1 bg-stone-200" />
            <span
              className="text-[10px] font-bold tracking-[0.25em] uppercase text-stone-400"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              Component Library
            </span>
            <div className="h-px flex-1 bg-stone-200" />
          </div>
          <h1
            className="text-6xl font-bold text-stone-900 leading-[1.05] tracking-tight mb-4"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Option Menu
          </h1>
          <p className="text-base text-stone-500 max-w-md leading-relaxed">
            Every variant, mode, and configuration — single, multi, nested, searchable,
            constrained, and controlled.
          </p>
        </motion.header>

        {/* ── Sections ──────────────────────────────────────────────────── */}
        <div className="max-w-4xl mx-auto flex flex-col gap-6">

          {/* 1 · Selection Modes */}
          <Section
            index={0}
            title="Selection Modes"
            subtitle="single closes on pick; multi accumulates selections with checkboxes."
            badge="mode"
          >
            <Grid>
              <DemoCard label='selectionMode="single"'>
                <OptionMenu
                  items={COUNTRIES}
                  label="Country"
                  placeholder="Select a country"
                  selectionMode="single"
                />
              </DemoCard>
              <DemoCard label='selectionMode="multi"'>
                <OptionMenu
                  items={TECH_STACK}
                  label="Tech stack"
                  placeholder="Pick frameworks"
                  selectionMode="multi"
                  closeOnSelect={false}
                />
              </DemoCard>
            </Grid>
          </Section>

          {/* 2 · Sizes */}
          <Section
            index={1}
            title="Sizes"
            subtitle="sm · md · lg · xl — scales the trigger, menu, and item typography uniformly."
            badge="size"
          >
            <div className="flex flex-col gap-4">
              {(["sm", "md", "lg", "xl"] as const).map((sz) => (
                <DemoCard key={sz} label={`size="${sz}"`}>
                  <OptionMenu
                    items={THEME_OPTIONS}
                    placeholder={`${sz} — pick a theme`}
                    size={sz}
                  />
                </DemoCard>
              ))}
            </div>
          </Section>

          {/* 3 · Search */}
          <Section
            index={2}
            title="Search / Filter"
            subtitle="showSearch adds a live filter input that highlights matched characters."
            badge="search"
          >
            <Grid>
              <DemoCard label="Single + search">
                <OptionMenu
                  items={COUNTRIES}
                  label="Region"
                  placeholder="Search countries…"
                  showSearch
                />
              </DemoCard>
              <DemoCard label="Multi + search">
                <OptionMenu
                  items={INFRASTRUCTURE}
                  label="Services"
                  placeholder="Search services…"
                  selectionMode="multi"
                  showSearch
                  closeOnSelect={false}
                />
              </DemoCard>
            </Grid>
          </Section>

          {/* 4 · Icons & Descriptions */}
          <Section
            index={3}
            title="Icons & Descriptions"
            subtitle="Each OptionItem accepts an icon node and a description subtitle."
            badge="metadata"
          >
            <Grid>
              <DemoCard label="With icons + descriptions">
                <OptionMenu
                  items={ROLES}
                  label="Role"
                  placeholder="Assign a role"
                />
              </DemoCard>
              <DemoCard label="Icons-only (no description)">
                <OptionMenu
                  items={THEME_OPTIONS}
                  label="Appearance"
                  placeholder="Choose theme"
                />
              </DemoCard>
            </Grid>
          </Section>

          {/* 5 · Nested / grouped (tree) */}
          <Section
            index={4}
            title="Nested Groups & Headers"
            subtitle="children creates an expandable sub-tree; header renders a group label; dividerBefore adds a separator."
            badge="nested"
          >
            <DemoCard label="Nested tree with headers + dividers">
              <OptionMenu
                items={INTEGRATIONS}
                label="Integration"
                placeholder="Connect a tool"
                maxMenuHeight={340}
              />
            </DemoCard>
          </Section>

          {/* 6 · Disabled items & disabled state */}
          <Section
            index={5}
            title="Disabled Items & States"
            subtitle="Per-item disabled prevents selection; top-level disabled or readOnly affects the whole control."
            badge="states"
          >
            <Grid>
              <DemoCard label="Disabled items inside list">
                <OptionMenu
                  items={ROLES}
                  label="Role (guest disabled)"
                  placeholder="Select role"
                />
              </DemoCard>
              <DemoCard label="disabled={true}">
                <OptionMenu
                  items={COUNTRIES}
                  label="Country (disabled)"
                  defaultSelected={["jp"]}
                  disabled
                />
              </DemoCard>
            </Grid>
            <div className="mt-4">
              <DemoCard label="readOnly={true}">
                <OptionMenu
                  items={TECH_STACK}
                  label="Stack (read-only)"
                  defaultSelected={["react", "next"]}
                  selectionMode="multi"
                  readOnly
                />
              </DemoCard>
            </div>
          </Section>

          {/* 7 · Default selections */}
          <Section
            index={6}
            title="Default Selections"
            subtitle="Pre-populate via defaultSelected — works for both single and multi mode."
            badge="defaults"
          >
            <Grid>
              <DemoCard label="Single default">
                <OptionMenu
                  items={COUNTRIES}
                  label="Country"
                  defaultSelected={["de"]}
                />
              </DemoCard>
              <DemoCard label="Multi defaults">
                <OptionMenu
                  items={TECH_STACK}
                  label="Stack"
                  defaultSelected={["react", "next", "astro"]}
                  selectionMode="multi"
                  closeOnSelect={false}
                />
              </DemoCard>
            </Grid>
          </Section>

          {/* 8 · Max selections */}
          <Section
            index={7}
            title="Max Selections"
            subtitle="maxSelections caps how many items can be chosen in multi mode."
            badge="constraint"
          >
            <Grid>
              <DemoCard label="maxSelections={2}">
                <OptionMenu
                  items={TECH_STACK}
                  label="Pick up to 2 frameworks"
                  placeholder="Max 2"
                  selectionMode="multi"
                  maxSelections={2}
                  closeOnSelect={false}
                />
              </DemoCard>
              <DemoCard label="maxSelections={1} + multi">
                <OptionMenu
                  items={THEME_OPTIONS}
                  label="Theme (max 1, multi mode)"
                  placeholder="Max 1"
                  selectionMode="multi"
                  maxSelections={1}
                  closeOnSelect={false}
                />
              </DemoCard>
            </Grid>
          </Section>

          {/* 9 · closeOnSelect */}
          <Section
            index={8}
            title="Close-on-Select Behaviour"
            subtitle="closeOnSelect={false} keeps the menu open after picking — ideal for multi-select workflows."
            badge="UX"
          >
            <Grid>
              <DemoCard label="closeOnSelect={true} (default)">
                <OptionMenu
                  items={COUNTRIES}
                  label="Country"
                  placeholder="Closes immediately"
                  closeOnSelect
                />
              </DemoCard>
              <DemoCard label="closeOnSelect={false}">
                <OptionMenu
                  items={TECH_STACK}
                  label="Frameworks"
                  placeholder="Stays open"
                  selectionMode="multi"
                  closeOnSelect={false}
                />
              </DemoCard>
            </Grid>
          </Section>

          {/* 10 · Menu position */}
          <Section
            index={9}
            title="Dropdown Position"
            subtitle="Force the menu to open in a specific direction instead of auto-detecting."
            badge="position"
          >
            <Grid cols={2}>
              {(["bottom-left", "bottom-right", "top-left", "top-right"] as const).map((pos) => (
                <DemoCard key={pos} label={`position="${pos}"`}>
                  <OptionMenu
                    items={THEME_OPTIONS}
                    placeholder={pos}
                    position={pos}
                  />
                </DemoCard>
              ))}
            </Grid>
          </Section>

          {/* 11 · Event callbacks */}
          <Section
            index={10}
            title="Event Callbacks"
            subtitle="onChange · onOpen · onClose — wire up your application logic."
            badge="events"
          >
            <DemoCard label="Live event log">
              <OptionMenu
                items={INFRASTRUCTURE}
                label="Services"
                placeholder="Pick services"
                selectionMode="multi"
                closeOnSelect={false}
                showSearch
                onChange={(v) => log(`onChange → [${v.map((s) => `"${s}"`).join(", ")}]`)}
                onOpen={() => log("onOpen")}
                onClose={() => log("onClose")}
              />
              <div
                className="mt-4 rounded-lg bg-stone-100 border border-stone-200 p-3 min-h-[100px] overflow-hidden"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                {eventLog.length === 0 ? (
                  <p className="text-xs text-stone-400">Interact above to see events…</p>
                ) : (
                  eventLog.map((e, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-xs text-stone-700 leading-relaxed"
                    >
                      {e}
                    </motion.p>
                  ))
                )}
              </div>
            </DemoCard>
          </Section>

          {/* 12 · Controlled component */}
          <Section
            index={11}
            title="Controlled Component"
            subtitle="Drive selection state externally through onChange and display it live."
            badge="controlled"
          >
            <DemoCard label="External state">
              <OptionMenu
                items={TECH_STACK}
                label="Tech stack"
                placeholder="Pick frameworks"
                selectionMode="multi"
                closeOnSelect={false}
                onChange={setMultiValue}
              />
              <LiveValue
                label="selected"
                value={multiValue.length ? `[${multiValue.map((v) => `"${v}"`).join(", ")}]` : ""}
              />
            </DemoCard>
          </Section>

          {/* 13 · Custom trigger label */}
          <Section
            index={12}
            title="Custom Trigger Label"
            subtitle="triggerLabel overrides the dynamic display and shows a fixed string."
            badge="custom"
          >
            <Grid>
              <DemoCard label="triggerLabel (static text)">
                <OptionMenu
                  items={ROLES}
                  label="Role"
                  triggerLabel="Manage roles →"
                />
              </DemoCard>
              <DemoCard label="No label prop">
                <OptionMenu
                  items={THEME_OPTIONS}
                  placeholder="No label shown"
                />
              </DemoCard>
            </Grid>
          </Section>

          {/* 14 · Real-world: Team settings form */}
          <Section
            index={13}
            title="Real-world: Team Settings Form"
            subtitle="Multiple OptionMenus working together inside a realistic form layout."
            badge="example"
          >
            <div className="rounded-xl border border-stone-200 bg-white p-6 flex flex-col gap-5">
              <div>
                <label className="block text-[10px] font-bold tracking-[0.15em] uppercase text-stone-400 mb-1.5">
                  Team name
                </label>
                <input
                  className="w-full h-9 rounded-lg border border-stone-200 bg-stone-50 px-3 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-200 transition"
                  placeholder="e.g. Product Design"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                />
              </div>

              <Grid>
                <OptionMenu
                  items={ROLES}
                  label="Default role"
                  placeholder="Assign default role"
                  onChange={setControlledRole}
                />
                <OptionMenu
                  items={COUNTRIES}
                  label="Region"
                  placeholder="Select region"
                  showSearch
                />
              </Grid>

              <OptionMenu
                items={INTEGRATIONS}
                label="Integrations"
                placeholder="Connect tools"
                selectionMode="multi"
                closeOnSelect={false}
                maxMenuHeight={260}
              />

              <OptionMenu
                items={TECH_STACK}
                label="Tech stack"
                placeholder="Pick up to 3 technologies"
                selectionMode="multi"
                maxSelections={3}
                closeOnSelect={false}
                showSearch
              />

              {controlledRole.length > 0 && (
                <motion.p
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-stone-500"
                  style={{ fontFamily: "'DM Mono', monospace" }}
                >
                  Role set to: <strong className="text-stone-800">{controlledRole[0]}</strong>
                </motion.p>
              )}

              <div className="pt-1 flex gap-3">
                <button className="rounded-lg bg-stone-900 hover:bg-stone-700 active:scale-[0.98] transition-all text-white font-semibold text-sm px-5 h-9">
                  Save settings
                </button>
                <button className="rounded-lg border border-stone-200 hover:border-stone-300 text-stone-600 font-medium text-sm px-5 h-9 transition-all">
                  Cancel
                </button>
              </div>
            </div>
          </Section>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="text-center text-xs text-stone-400 pb-4"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            OptionMenu · All variants · React + Framer Motion + Tailwind
          </motion.p>
        </div>
      </div>
    </>
  );
}