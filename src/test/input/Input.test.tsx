import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Mail,
  Lock,
  User,
  Phone,
  Globe,
  Link,
  Hash,
  AtSign,
  Eye,
  CreditCard,
  MapPin,
  Building,
  Calendar,
  Clock,
  DollarSign,
  Percent,
  Zap,
  Send,
  ArrowRight,
} from "lucide-react";
import { Input } from "../../ui/inputs/inputs/Input.ui"; // adjust path

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
      className="border border-neutral-200 rounded-2xl p-8 bg-white"
    >
      <div className="flex items-start justify-between mb-7 gap-4">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 tracking-tight">{title}</h2>
          {subtitle && (
            <p className="mt-1 text-sm text-neutral-400 leading-relaxed max-w-xl">{subtitle}</p>
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

function DemoCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-5 flex flex-col gap-3">
      <p className="text-[9px] font-bold tracking-[0.18em] uppercase text-neutral-400 font-mono">{label}</p>
      {children}
    </div>
  );
}

function Grid({ children, cols = 2 }: { children: React.ReactNode; cols?: number }) {
  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
      {children}
    </div>
  );
}

function LiveValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 mt-2 flex-wrap">
      <span className="text-[9px] font-bold tracking-widest uppercase text-neutral-400 font-mono">{label}:</span>
      <code className="rounded bg-neutral-100 border border-neutral-200 px-2 py-0.5 text-xs font-mono text-neutral-700 min-w-[32px]">
        {value || "—"}
      </code>
    </div>
  );
}

// ─── Main showcase ─────────────────────────────────────────────────────────────

export default function InputShowcase() {
  const [controlled, setControlled] = useState("");
  const [enterLog, setEnterLog]     = useState<string[]>([]);
  const [eventLog, setEventLog]     = useState<string[]>([]);

  const logEvent = (msg: string) => setEventLog((p) => [msg, ...p].slice(0, 5));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=IBM+Plex+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; background: #f5f5f4; }
      `}</style>

      <div
        className="min-h-screen w-full px-4 py-16 bg-stone-100"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        {/* ── Header ──────────────────────────────────────────────────── */}
        <motion.header
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-4xl mx-auto mb-14"
        >
          <p
            className="text-[10px] font-bold tracking-[0.25em] uppercase text-neutral-400 mb-4"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            Component Library
          </p>
          <h1
            className="text-[62px] leading-[1.0] text-neutral-900 mb-4 font-medium"
            style={{ fontFamily: "'Lora', serif" }}
          >
            Input
          </h1>
          <p className="text-base text-neutral-500 max-w-md leading-relaxed">
            A fully-featured text input supporting types, variants, sizes, statuses,
            icons, prefixes, character counts, and full lifecycle callbacks.
          </p>
        </motion.header>

        <div className="max-w-4xl mx-auto flex flex-col gap-6">

          {/* 1 · Basic */}
          <Section index={0} title="Basic" subtitle="Minimal Input with just a placeholder — no label, no extras." badge="basic">
            <DemoCard label="No props beyond placeholder">
              <Input placeholder="Type something…" />
            </DemoCard>
          </Section>

          {/* 2 · Label, hint, required, optional */}
          <Section index={1} title="Label, Hint & Badges" subtitle="label shows above the field; hint below. required adds a red asterisk; optional adds an 'Optional' tag." badge="label">
            <Grid>
              <DemoCard label="label only">
                <Input label="Full name" placeholder="Jane Doe" />
              </DemoCard>
              <DemoCard label="label + hint">
                <Input label="Username" placeholder="@handle" hint="Must be unique across the platform" />
              </DemoCard>
              <DemoCard label="required={true}">
                <Input label="Email address" placeholder="you@example.com" required />
              </DemoCard>
              <DemoCard label="optional={true}">
                <Input label="Company" placeholder="Acme Inc." optional />
              </DemoCard>
            </Grid>
          </Section>

          {/* 3 · Sizes */}
          <Section index={2} title="Sizes" subtitle="sm · md · lg · xl — scales height, padding, text, and icon proportionally." badge="size">
            <div className="flex flex-col gap-4">
              {(["sm", "md", "lg", "xl"] as const).map((sz) => (
                <DemoCard key={sz} label={`size="${sz}"`}>
                  <Input size={sz} label={`Size ${sz}`} placeholder={`${sz} input`} />
                </DemoCard>
              ))}
            </div>
          </Section>

          {/* 4 · Variants */}
          <Section index={3} title="Variants" subtitle="default (bordered) · filled (surface bg) · ghost (borderless) — each with matching focus rings." badge="variant">
            <Grid>
              <DemoCard label='variant="default"'>
                <Input variant="default" label="Default" placeholder="Bordered input" />
              </DemoCard>
              <DemoCard label='variant="filled"'>
                <Input variant="filled" label="Filled" placeholder="Filled surface" />
              </DemoCard>
              <DemoCard label='variant="ghost"'>
                <Input variant="ghost" label="Ghost" placeholder="No border" />
              </DemoCard>
              <DemoCard label="Ghost in context">
                <div className="rounded-lg border border-neutral-200 px-3 bg-white">
                  <Input variant="ghost" placeholder="Search within a container…" leadingIcon={<Search size={14} />} />
                </div>
              </DemoCard>
            </Grid>
          </Section>

          {/* 5 · Status */}
          <Section index={4} title="Statuses" subtitle="default · error · warning · success — changes border colour, ring, icon, and hint colour." badge="status">
            <Grid>
              <DemoCard label='status="default"'>
                <Input label="Default" status="default" defaultValue="Some value" hint="Everything looks fine" />
              </DemoCard>
              <DemoCard label='status="error"'>
                <Input label="Email" status="error" defaultValue="not-an-email" hint="Please enter a valid email address" />
              </DemoCard>
              <DemoCard label='status="warning"'>
                <Input label="Password" status="warning" defaultValue="pass123" hint="Password is weak — try adding symbols" />
              </DemoCard>
              <DemoCard label='status="success"'>
                <Input label="Username" status="success" defaultValue="janedoe" hint="Username is available!" />
              </DemoCard>
            </Grid>
          </Section>

          {/* 6 · Input types */}
          <Section index={5} title="Input Types" subtitle="All HTML input types supported — password gets a show/hide toggle; search gets the search icon automatically." badge="type">
            <Grid>
              <DemoCard label='type="text"'>
                <Input type="text" label="Full name" placeholder="Jane Doe" leadingIcon={<User size={14} />} />
              </DemoCard>
              <DemoCard label='type="email"'>
                <Input type="email" label="Email" placeholder="you@example.com" leadingIcon={<Mail size={14} />} />
              </DemoCard>
              <DemoCard label='type="password" — show/hide toggle'>
                <Input type="password" label="Password" placeholder="Enter password" leadingIcon={<Lock size={14} />} />
              </DemoCard>
              <DemoCard label='type="search" — auto search icon'>
                <Input type="search" label="Search" placeholder="Search anything…" clearable />
              </DemoCard>
              <DemoCard label='type="tel"'>
                <Input type="tel" label="Phone" placeholder="+1 (555) 000-0000" leadingIcon={<Phone size={14} />} />
              </DemoCard>
              <DemoCard label='type="url"'>
                <Input type="url" label="Website" placeholder="https://example.com" leadingIcon={<Globe size={14} />} />
              </DemoCard>
              <DemoCard label='type="number"'>
                <Input type="number" label="Amount" placeholder="0" prefix="$" />
              </DemoCard>
              <DemoCard label='type="date"'>
                <Input type="date" label="Start date" leadingIcon={<Calendar size={14} />} />
              </DemoCard>
              <DemoCard label='type="time"'>
                <Input type="time" label="Meeting time" leadingIcon={<Clock size={14} />} />
              </DemoCard>
              <DemoCard label='type="datetime-local"'>
                <Input type="datetime-local" label="Event datetime" />
              </DemoCard>
            </Grid>
          </Section>

          {/* 7 · Leading & trailing icons */}
          <Section index={6} title="Icons" subtitle="leadingIcon renders left; trailingIcon renders right. Both accept any ReactNode." badge="icons">
            <Grid>
              <DemoCard label="leadingIcon only">
                <Input label="Handle" placeholder="@username" leadingIcon={<AtSign size={14} />} />
              </DemoCard>
              <DemoCard label="trailingIcon only">
                <Input label="Link" placeholder="Paste URL" trailingIcon={<Link size={14} />} />
              </DemoCard>
              <DemoCard label="Both icons">
                <Input label="Channel" placeholder="#general" leadingIcon={<Hash size={14} />} trailingIcon={<ArrowRight size={14} />} />
              </DemoCard>
              <DemoCard label="Icon + clearable">
                <Input label="Search" placeholder="Find a user…" leadingIcon={<Search size={14} />} clearable />
              </DemoCard>
            </Grid>
          </Section>

          {/* 8 · Prefix & suffix */}
          <Section index={7} title="Prefix & Suffix" subtitle="prefix and suffix render attached addon pills — useful for currencies, units, and domains." badge="affix">
            <Grid>
              <DemoCard label="prefix only">
                <Input label="Price" placeholder="0.00" prefix="$" type="number" />
              </DemoCard>
              <DemoCard label="suffix only">
                <Input label="Weight" placeholder="0" suffix="kg" type="number" />
              </DemoCard>
              <DemoCard label="prefix + suffix">
                <Input label="Discount" placeholder="10" prefix="%" suffix="off" type="number" />
              </DemoCard>
              <DemoCard label="Domain suffix">
                <Input label="Subdomain" placeholder="myapp" suffix=".example.com" />
              </DemoCard>
              <DemoCard label="Protocol prefix">
                <Input label="API endpoint" placeholder="api/v1/users" prefix="https://" />
              </DemoCard>
              <DemoCard label="Currency prefix + clearable">
                <Input label="Budget" placeholder="5000" prefix="USD" clearable />
              </DemoCard>
            </Grid>
          </Section>

          {/* 9 · Clearable */}
          <Section index={8} title="Clearable" subtitle="clearable shows a × button when the field has a value — clicking it fires onClear and refocuses." badge="clear">
            <Grid>
              <DemoCard label="clearable + defaultValue">
                <Input label="Clearable field" defaultValue="Delete me!" clearable />
              </DemoCard>
              <DemoCard label="clearable + search type">
                <Input type="search" label="Search" placeholder="Type then clear…" clearable />
              </DemoCard>
            </Grid>
          </Section>

          {/* 10 · Character count */}
          <Section index={9} title="Character Count" subtitle="showCharacterCount + maxLength renders a live counter in the footer." badge="counter">
            <Grid>
              <DemoCard label="maxLength={80}">
                <Input
                  label="Bio"
                  placeholder="Tell us about yourself…"
                  maxLength={80}
                  showCharacterCount
                  hint="Keep it short and punchy"
                />
              </DemoCard>
              <DemoCard label="maxLength={20} tight limit">
                <Input
                  label="Username"
                  placeholder="@handle"
                  maxLength={20}
                  showCharacterCount
                />
              </DemoCard>
              <DemoCard label="maxLength + status=error">
                <Input
                  label="Tweet"
                  defaultValue="This is already way too long and should show an error status here right now"
                  maxLength={40}
                  showCharacterCount
                  status="error"
                  hint="Exceeds character limit"
                />
              </DemoCard>
              <DemoCard label="No hint, counter only">
                <Input
                  label="Headline"
                  placeholder="Enter a headline…"
                  maxLength={60}
                  showCharacterCount
                />
              </DemoCard>
            </Grid>
          </Section>

          {/* 11 · Loading */}
          <Section index={10} title="Loading State" subtitle="loading={true} renders an animated spinner in the trailing slot — useful for async validation." badge="loading">
            <Grid>
              <DemoCard label="loading={true}">
                <Input label="Username" defaultValue="janedoe" loading hint="Checking availability…" />
              </DemoCard>
              <DemoCard label="loading + leadingIcon">
                <Input label="Email" placeholder="you@example.com" leadingIcon={<Mail size={14} />} loading />
              </DemoCard>
            </Grid>
          </Section>

          {/* 12 · Disabled & read-only */}
          <Section index={11} title="Disabled & Read-Only" subtitle="disabled blocks all interaction and dims the field; readOnly allows text selection but prevents editing." badge="state">
            <Grid>
              <DemoCard label="disabled={true}">
                <Input label="Disabled field" defaultValue="Cannot edit this" disabled />
              </DemoCard>
              <DemoCard label="disabled + icon">
                <Input label="Locked email" defaultValue="jane@example.com" leadingIcon={<Lock size={14} />} disabled />
              </DemoCard>
              <DemoCard label="readOnly={true}">
                <Input label="Read-only value" defaultValue="Read, not write" readOnly hint="Click to select all" />
              </DemoCard>
              <DemoCard label="readOnly + clearable (clear hidden)">
                <Input label="API key" defaultValue="sk-xxxxxxxxxxxx" readOnly clearable />
              </DemoCard>
            </Grid>
          </Section>

          {/* 13 · Default value */}
          <Section index={12} title="Default Value" subtitle="defaultValue pre-populates the field. It is uncontrolled — the component manages its own state internally." badge="default">
            <Grid>
              <DemoCard label="defaultValue string">
                <Input label="First name" defaultValue="Jane" />
              </DemoCard>
              <DemoCard label="defaultValue + clearable">
                <Input label="City" defaultValue="San Francisco" clearable leadingIcon={<MapPin size={14} />} />
              </DemoCard>
            </Grid>
          </Section>

          {/* 14 · onEnter callback */}
          <Section index={13} title="onEnter Callback" subtitle="Fires when the user presses Enter, passing the current value. Ideal for search and quick-add inputs." badge="onEnter">
            <DemoCard label="Press Enter to submit">
              <Input
                label="Quick add task"
                placeholder="Type a task and press Enter…"
                leadingIcon={<Zap size={14} />}
                clearable
                onEnter={(val) => {
                  if (val.trim()) setEnterLog((p) => [`Added: "${val}"`, ...p].slice(0, 4));
                }}
              />
              <div
                className="mt-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3 min-h-[64px]"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              >
                {enterLog.length === 0 ? (
                  <p className="text-[11px] text-neutral-400">Submitted values appear here…</p>
                ) : (
                  enterLog.map((e, i) => (
                    <motion.p key={i} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} className="text-[11px] text-neutral-700 leading-relaxed">
                      {e}
                    </motion.p>
                  ))
                )}
              </div>
            </DemoCard>
          </Section>

          {/* 15 · Event callbacks */}
          <Section index={14} title="Event Callbacks" subtitle="onChange · onFocus · onBlur · onClear fire at each interaction stage." badge="events">
            <DemoCard label="Live callback log">
              <Input
                label="Interactive field"
                placeholder="Focus, type, clear…"
                clearable
                leadingIcon={<Send size={14} />}
                onChange={(v) => logEvent(`onChange → "${v}"`)}
                onFocus={() => logEvent("onFocus")}
                onBlur={() => logEvent("onBlur")}
                onClear={() => logEvent("onClear")}
              />
              <div
                className="mt-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3 min-h-[88px]"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              >
                {eventLog.length === 0 ? (
                  <p className="text-[11px] text-neutral-400">Interact with the field above…</p>
                ) : (
                  eventLog.map((e, i) => (
                    <motion.p key={i} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} className="text-[11px] text-neutral-700 leading-relaxed">
                      {e}
                    </motion.p>
                  ))
                )}
              </div>
            </DemoCard>
          </Section>

          {/* 16 · Controlled */}
          <Section index={15} title="Controlled via onChange" subtitle="Use onChange to lift state up and drive other UI from the input value." badge="controlled">
            <DemoCard label="Value mirrored externally">
              <Input
                label="Controlled input"
                placeholder="Start typing…"
                onChange={setControlled}
              />
              <LiveValue label="value" value={controlled} />
              {controlled.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 rounded-lg border border-neutral-100 bg-white px-3 py-2.5 text-sm text-neutral-700"
                >
                  Preview: <strong className="text-neutral-900">{controlled}</strong>
                </motion.div>
              )}
            </DemoCard>
          </Section>

          {/* 17 · Combinations */}
          <Section index={16} title="Combined Props" subtitle="Mixing multiple features: icons + status + hint + clearable + character count." badge="combined">
            <Grid>
              <DemoCard label="Email validation error">
                <Input
                  type="email"
                  label="Email address"
                  defaultValue="bad-email"
                  leadingIcon={<Mail size={14} />}
                  status="error"
                  hint="Enter a valid email like user@example.com"
                  required
                />
              </DemoCard>
              <DemoCard label="Password with strength hint">
                <Input
                  type="password"
                  label="New password"
                  defaultValue="Str0ng!Pass"
                  status="success"
                  hint="Strong password — great job!"
                  showStatusIcon
                />
              </DemoCard>
              <DemoCard label="Search + loading + clearable">
                <Input
                  type="search"
                  label="User lookup"
                  defaultValue="jane"
                  loading
                  clearable
                  hint="Searching directory…"
                />
              </DemoCard>
              <DemoCard label="Bio with counter + warning">
                <Input
                  label="Bio"
                  defaultValue="I'm a designer and I love building beautiful interfaces for the web."
                  maxLength={80}
                  showCharacterCount
                  status="warning"
                  hint="Approaching the limit"
                />
              </DemoCard>
            </Grid>
          </Section>

          {/* 18 · Real-world form */}
          <Section index={17} title="Real-world: Sign-up Form" subtitle="Multiple Input components composing a realistic registration form." badge="example">
            <div className="rounded-xl border border-neutral-200 bg-white p-6 flex flex-col gap-5 max-w-lg">
              <Grid>
                <Input label="First name" placeholder="Jane" required leadingIcon={<User size={14} />} />
                <Input label="Last name" placeholder="Doe" required />
              </Grid>
              <Input
                type="email"
                label="Email"
                placeholder="you@example.com"
                leadingIcon={<Mail size={14} />}
                required
                hint="We'll send a confirmation link"
              />
              <Input
                type="password"
                label="Password"
                placeholder="Min 8 characters"
                leadingIcon={<Lock size={14} />}
                required
                hint="Use uppercase, numbers and symbols"
                maxLength={64}
                showCharacterCount
              />
              <Input
                label="Company"
                placeholder="Acme Inc."
                leadingIcon={<Building size={14} />}
                optional
              />
              <Input
                label="Website"
                placeholder="yoursite.com"
                prefix="https://"
                type="url"
                optional
              />
              <div className="flex gap-3 pt-1">
                <button className="flex-1 rounded-lg bg-neutral-900 py-2.5 text-sm font-semibold text-white hover:bg-neutral-700 transition-colors">
                  Create account
                </button>
                <button className="rounded-lg border border-neutral-200 px-4 py-2.5 text-sm text-neutral-600 hover:bg-neutral-50 transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          </Section>

          {/* 19 · Real-world search bar */}
          <Section index={18} title="Real-world: Search Bar" subtitle="A polished command-palette-style search field combining search type, icon, clearable, and onEnter." badge="example">
            <div className="rounded-xl border border-neutral-200 bg-white p-6">
              <Input
                type="search"
                size="lg"
                variant="filled"
                placeholder="Search files, people, or commands…"
                clearable
                trailingIcon={<kbd className="text-[10px] font-mono bg-neutral-200 text-neutral-500 rounded px-1.5 py-0.5">⌘K</kbd>}
                onEnter={(v) => logEvent(`Search submitted: "${v}"`)}
              />
              <p className="mt-3 text-xs text-neutral-400">Press Enter to search · Esc to dismiss</p>
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
            Input · All variants · React + Framer Motion + Tailwind
          </motion.p>
        </div>
      </div>
    </>
  );
}