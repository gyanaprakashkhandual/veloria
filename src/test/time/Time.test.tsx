import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  DateTimePicker,
  StandaloneDatePicker,
  StandaloneTimePicker,
} from "../../ui/time/Time.ui"; // adjust path as needed
import type { DateTimeValue } from "../../context/time/Time.context"; // adjust path as needed

// ─── Fade-in section wrapper ────────────────────────────────────────────────
function Section({
  title,
  subtitle,
  tag,
  children,
  index = 0,
}: {
  title: string;
  subtitle?: string;
  tag?: string;
  children: React.ReactNode;
  index?: number;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: "easeOut" }}
      className="rounded-2xl border border-zinc-800/60 bg-zinc-900/50 backdrop-blur-sm p-8 flex flex-col gap-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-semibold text-zinc-100 tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1 text-sm text-zinc-500 leading-relaxed">{subtitle}</p>
          )}
        </div>
        {tag && (
          <span className="shrink-0 rounded-md bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 text-[11px] font-semibold tracking-widest text-amber-400 uppercase">
            {tag}
          </span>
        )}
      </div>
      <div>{children}</div>
    </motion.section>
  );
}

// ─── Live value badge ────────────────────────────────────────────────────────
function ValueBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 mt-4">
      <span className="text-[11px] font-bold tracking-widest uppercase text-zinc-600">
        {label}:
      </span>
      <code className="rounded bg-zinc-800 border border-zinc-700 px-2 py-0.5 text-xs font-mono text-amber-300">
        {value || "—"}
      </code>
    </div>
  );
}

// ─── Grid layout helper ──────────────────────────────────────────────────────
function Grid({ children, cols = 2 }: { children: React.ReactNode; cols?: number }) {
  return (
    <div
      className="grid gap-6"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {children}
    </div>
  );
}

// ─── Demo sub-card ───────────────────────────────────────────────────────────
function DemoCard({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5 flex flex-col gap-3">
      <p className="text-[11px] font-semibold tracking-widest uppercase text-zinc-600">
        {label}
      </p>
      {children}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// Main Showcase Page
// ════════════════════════════════════════════════════════════════════════════
export default function DateTimeShowcasePage() {
  // ── State for controlled / reactive demos ──────────────────────────────
  const [controlled, setControlled] = useState<DateTimeValue>({ date: "", time: "" });
  const [eventLog, setEventLog] = useState<string[]>([]);

  const log = (msg: string) =>
    setEventLog((prev) => [msg, ...prev].slice(0, 6));

  return (
    <>
      {/* Google font injection */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; background: #0a0a0b; }
        .font-display { font-family: 'Sora', sans-serif; }
        .font-mono   { font-family: 'Space Mono', monospace; }
      `}</style>

      <div
        className="min-h-screen w-full px-4 py-16"
        style={{
          fontFamily: "'Sora', sans-serif",
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, #1a160a 0%, #0a0a0b 70%)",
        }}
      >
        {/* ── Page header ───────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="max-w-4xl mx-auto mb-14 text-center"
        >
          <span className="inline-block rounded-full border border-amber-400/25 bg-amber-400/8 px-4 py-1 text-[11px] font-bold tracking-[0.2em] uppercase text-amber-400 mb-5">
            Component Showcase
          </span>
          <h1
            className="text-5xl font-bold tracking-tight text-zinc-50 mb-4 leading-[1.1]"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            DateTimePicker
          </h1>
          <p className="text-zinc-500 text-base max-w-lg mx-auto leading-relaxed">
            Every variant, size, mode, and configuration in one place. Dark-first,
            accessible, and composable.
          </p>
        </motion.div>

        {/* ── Sections grid ─────────────────────────────────────────────── */}
        <div className="max-w-4xl mx-auto flex flex-col gap-8">

          {/* 1 · Modes */}
          <Section
            index={0}
            title="Picker Modes"
            subtitle="date · time · datetime — each mode activates the relevant fields."
            tag="mode"
          >
            <Grid>
              <DemoCard label="mode=&quot;date&quot;">
                <StandaloneDatePicker label="Select Date" placeholder="Pick a date" />
              </DemoCard>
              <DemoCard label="mode=&quot;time&quot;">
                <StandaloneTimePicker label="Select Time" placeholder="Pick a time" />
              </DemoCard>
            </Grid>
            <div className="mt-6">
              <DemoCard label="mode=&quot;datetime&quot; layout=&quot;horizontal&quot; (default)">
                <DateTimePicker
                  dateLabel="Date"
                  timeLabel="Time"
                  datePlaceholder="Pick a date"
                  timePlaceholder="Pick a time"
                />
              </DemoCard>
            </div>
            <div className="mt-4">
              <DemoCard label="mode=&quot;datetime&quot; layout=&quot;vertical&quot;">
                <DateTimePicker
                  dateLabel="Date"
                  timeLabel="Time"
                  layout="vertical"
                  datePlaceholder="Pick a date"
                  timePlaceholder="Pick a time"
                />
              </DemoCard>
            </div>
          </Section>

          {/* 2 · Sizes */}
          <Section
            index={1}
            title="Sizes"
            subtitle="sm · md · lg · xl — scales the trigger, calendar cells, and typography."
            tag="size"
          >
            <div className="flex flex-col gap-4">
              {(["sm", "md", "lg", "xl"] as const).map((sz) => (
                <DemoCard key={sz} label={`size="${sz}"`}>
                  <DateTimePicker size={sz} datePlaceholder="Pick a date" timePlaceholder="Pick a time" />
                </DemoCard>
              ))}
            </div>
          </Section>

          {/* 3 · Default values */}
          <Section
            index={2}
            title="Default Values"
            subtitle="Pre-populate with defaultDate and defaultTime."
            tag="defaults"
          >
            <Grid>
              <DemoCard label="defaultDate">
                <StandaloneDatePicker defaultDate="2025-12-25" label="Christmas Day" />
              </DemoCard>
              <DemoCard label="defaultTime">
                <StandaloneTimePicker defaultTime="09:30" label="Morning standup" />
              </DemoCard>
            </Grid>
            <div className="mt-4">
              <DemoCard label="Both defaultDate + defaultTime">
                <DateTimePicker
                  defaultDate="2025-07-04"
                  defaultTime="20:00"
                  dateLabel="Event date"
                  timeLabel="Event time"
                />
              </DemoCard>
            </div>
          </Section>

          {/* 4 · Min / Max constraints */}
          <Section
            index={3}
            title="Min & Max Date Constraints"
            subtitle="Dates outside the range are visually dimmed and unclickable."
            tag="validation"
          >
            <Grid>
              <DemoCard label="minDate = today">
                <StandaloneDatePicker
                  label="Future only"
                  minDate={new Date().toISOString().split("T")[0]}
                  placeholder="No past dates"
                />
              </DemoCard>
              <DemoCard label="maxDate = today">
                <StandaloneDatePicker
                  label="Past only"
                  maxDate={new Date().toISOString().split("T")[0]}
                  placeholder="No future dates"
                />
              </DemoCard>
            </Grid>
            <div className="mt-4">
              <DemoCard label="minDate + maxDate (this month only)">
                <StandaloneDatePicker
                  label="Restricted window"
                  minDate={`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}-01`}
                  maxDate={`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}-${new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()}`}
                  placeholder="This month only"
                />
              </DemoCard>
            </div>
          </Section>

          {/* 5 · Disabled dates & days of week */}
          <Section
            index={4}
            title="Disabled Dates & Days"
            subtitle="Block specific dates or entire weekdays (e.g., weekends)."
            tag="disabled dates"
          >
            <Grid>
              <DemoCard label="Specific dates disabled">
                <StandaloneDatePicker
                  label="Blocked dates"
                  disabledDates={[
                    "2025-12-24",
                    "2025-12-25",
                    "2025-12-31",
                    "2026-01-01",
                  ]}
                  placeholder="Holiday dates blocked"
                />
              </DemoCard>
              <DemoCard label="Weekends disabled (0=Sun, 6=Sat)">
                <StandaloneDatePicker
                  label="Weekdays only"
                  disabledDaysOfWeek={[0, 6]}
                  placeholder="No weekends"
                />
              </DemoCard>
            </Grid>
          </Section>

          {/* 6 · Disabled & Read-only */}
          <Section
            index={5}
            title="Disabled & Read-Only States"
            subtitle="disabled prevents all interaction; readOnly allows display only."
            tag="states"
          >
            <Grid>
              <DemoCard label="disabled={true}">
                <StandaloneDatePicker
                  label="Disabled field"
                  defaultDate="2025-06-15"
                  disabled
                />
              </DemoCard>
              <DemoCard label="readOnly={true}">
                <StandaloneDatePicker
                  label="Read-only field"
                  defaultDate="2025-06-15"
                  readOnly
                />
              </DemoCard>
            </Grid>
            <div className="mt-4">
              <DemoCard label="Disabled datetime picker">
                <DateTimePicker
                  defaultDate="2025-09-01"
                  defaultTime="14:00"
                  dateLabel="Date"
                  timeLabel="Time"
                  disabled
                />
              </DemoCard>
            </div>
          </Section>

          {/* 7 · Dropdown position */}
          <Section
            index={6}
            title="Dropdown Position"
            subtitle="Control where the calendar/time panel appears relative to the trigger."
            tag="position"
          >
            <Grid cols={2}>
              {(["bottom-left", "bottom-right", "top-left", "top-right"] as const).map(
                (pos) => (
                  <DemoCard key={pos} label={`dropdownPosition="${pos}"`}>
                    <StandaloneDatePicker
                      dropdownPosition={pos}
                      placeholder={pos}
                    />
                  </DemoCard>
                )
              )}
            </Grid>
          </Section>

          {/* 8 · Event callbacks */}
          <Section
            index={7}
            title="Event Callbacks"
            subtitle="onDateChange · onTimeChange · onChange — wire up your app logic."
            tag="events"
          >
            <DemoCard label="Live event log">
              <DateTimePicker
                dateLabel="Date"
                timeLabel="Time"
                onDateChange={(d) => log(`onDateChange → "${d}"`)}
                onTimeChange={(t) => log(`onTimeChange → "${t}"`)}
                onChange={(v) =>
                  log(`onChange → { date: "${v.date}", time: "${v.time}" }`)
                }
              />
              <div className="mt-4 rounded-lg bg-zinc-900 border border-zinc-800 p-3 min-h-[100px] font-mono text-xs space-y-1.5">
                {eventLog.length === 0 ? (
                  <p className="text-zinc-700">Interact above to see events…</p>
                ) : (
                  eventLog.map((e, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-amber-300"
                    >
                      {e}
                    </motion.p>
                  ))
                )}
              </div>
            </DemoCard>
          </Section>

          {/* 9 · Controlled component */}
          <Section
            index={8}
            title="Controlled Component"
            subtitle="Drive picker state externally via onChange and render it elsewhere."
            tag="controlled"
          >
            <DemoCard label="External state control">
              <DateTimePicker
                dateLabel="Controlled date"
                timeLabel="Controlled time"
                onChange={setControlled}
              />
              <div className="mt-4 grid grid-cols-2 gap-3">
                <ValueBadge label="date" value={controlled.date} />
                <ValueBadge label="time" value={controlled.time} />
              </div>
              {controlled.date && controlled.time && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-4 rounded-lg border border-amber-400/20 bg-amber-400/5 px-4 py-3 text-sm text-amber-300"
                >
                  ✦ Scheduled for{" "}
                  <strong>
                    {new Date(`${controlled.date}T${controlled.time}`).toLocaleString(
                      "en-US",
                      {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </strong>
                </motion.div>
              )}
            </DemoCard>
          </Section>

          {/* 10 · Custom placeholders & labels */}
          <Section
            index={9}
            title="Custom Labels & Placeholders"
            subtitle="All text strings are fully customisable via props."
            tag="customise"
          >
            <Grid>
              <DemoCard label="Custom label">
                <StandaloneDatePicker
                  label="📅 Departure"
                  placeholder="When do you leave?"
                />
              </DemoCard>
              <DemoCard label="No label">
                <StandaloneDatePicker placeholder="No label, just placeholder" />
              </DemoCard>
            </Grid>
            <div className="mt-4">
              <DemoCard label="Full datetime custom strings">
                <DateTimePicker
                  dateLabel="🗓 Meeting date"
                  timeLabel="⏰ Meeting time"
                  datePlaceholder="Choose a day…"
                  timePlaceholder="Choose a slot…"
                />
              </DemoCard>
            </div>
          </Section>

          {/* 11 · Real-world form example */}
          <Section
            index={10}
            title="Real-world: Event Booking Form"
            subtitle="Combines multiple pickers to demonstrate a realistic scheduling UI."
            tag="example"
          >
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-6 flex flex-col gap-5">
              <div>
                <label className="block text-[11px] font-bold tracking-widest uppercase text-zinc-500 mb-1.5">
                  Event Name
                </label>
                <input
                  className="w-full h-9 rounded-lg border border-zinc-700 bg-zinc-800 px-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/30 transition"
                  placeholder="Team all-hands"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <DateTimePicker
                  dateLabel="Start"
                  timeLabel="From"
                  size="md"
                  disabledDaysOfWeek={[0, 6]}
                  minDate={new Date().toISOString().split("T")[0]}
                />
                <DateTimePicker
                  dateLabel="End"
                  timeLabel="To"
                  size="md"
                  disabledDaysOfWeek={[0, 6]}
                  minDate={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold tracking-widest uppercase text-zinc-500 mb-1.5">
                  Notes
                </label>
                <textarea
                  rows={2}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/30 transition resize-none"
                  placeholder="Optional agenda…"
                />
              </div>
              <button
                className="self-start rounded-lg bg-amber-400 hover:bg-amber-300 active:scale-[0.98] transition-all text-zinc-900 font-semibold text-sm px-5 h-9"
              >
                Book Event →
              </button>
            </div>
          </Section>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center text-xs text-zinc-700 pb-4"
          >
            DateTimePicker · All variants · Built with React + Framer Motion + Tailwind
          </motion.p>
        </div>
      </div>
    </>
  );
}