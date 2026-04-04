"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Download,
  Trash2,
  Send,
  Star,
  Heart,
  Bell,
  Settings,
  Plus,
  ChevronRight,
  Check,
  X,
  Moon,
  Sun,
  Copy,
  RefreshCw,
  LogIn,
  Zap,
  Lock,
  Upload,
  ArrowRight,
  Bookmark,
  Eye,
  MoreHorizontal,
} from "lucide-react";

import { type ButtonVariant, type ButtonSize, type ButtonShape } from "../../context/button/Button.context";
import { Button, AsyncButton, ToggleButton, ButtonGroup, IconButton } from "../../ui/core/button/Button.ui";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-1">
        {title}
      </h2>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{subtitle}</p>
    </div>
  );
}

function Divider() {
  return <hr className="border-zinc-200 dark:border-zinc-800" />;
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 px-1.5 py-0.5 rounded">
      {children}
    </span>
  );
}


export default function ButtonTestPage({ dark, setDark }: { dark: boolean; setDark: (v: boolean) => void }) {

  // Toggle states
  const [starred, setStarred] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [notified, setNotified] = useState(false);
  const [eyeOn, setEyeOn] = useState(true);

  // Button group alignment
  const [align, setAlign] = useState<"left" | "center" | "right">("left");

  // Async result trackers
  const [uploadResult, setUploadResult] = useState<string | null>(null);
  const [deleteResult, setDeleteResult] = useState<string | null>(null);
  const [saveResult, setSaveResult] = useState<string | null>(null);
  const [failResult, setFailResult] = useState<string | null>(null);

  const variants: ButtonVariant[] = ["solid", "outline", "ghost", "soft", "link", "danger", "success", "warning"];
  const sizes: ButtonSize[] = ["2xs", "xs", "sm", "md", "lg", "xl", "2xl"];
  const shapes: ButtonShape[] = ["rounded", "pill", "square"];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 transition-colors duration-300">

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-zinc-900 dark:bg-white flex items-center justify-center">
              <Zap size={14} className="text-white dark:text-zinc-900" />
            </div>
            <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100 tracking-tight">
              Button
              <span className="ml-1.5 text-[11px] font-normal text-zinc-400 dark:text-zinc-500">test suite</span>
            </span>
          </div>
          <button
            onClick={() => setDark(!dark)}
            className="w-9 h-9 rounded-xl border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            {dark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-14">

        {/* ── Hero ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mb-2">
            All Use Cases
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xl leading-relaxed">
            Production-ready Button system — variants, sizes, shapes, async, toggle, group, icon-only, disabled, loading, and full className override support.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            {[
              { label: "Variants", value: variants.length },
              { label: "Sizes", value: sizes.length },
              { label: "Shapes", value: shapes.length },
              { label: "Async auto-loading", value: "✓" },
              { label: "className override", value: "✓" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300">
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">{s.value}</span>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <Divider />

        {/* ── Section 1: Variants ── */}
        <section>
          <SectionHeader title="Variants" subtitle="Every visual style available. className is always merged last — callers win." />
          <div className="flex flex-wrap gap-3">
            {variants.map((v) => (
              <Button key={v} variant={v} size="md">
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </Button>
            ))}
          </div>
          {/* With icons */}
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-5 mb-3">With icons</p>
          <div className="flex flex-wrap gap-3">
            <Button variant="solid" iconLeft={<Download />} size="md">Download</Button>
            <Button variant="outline" iconLeft={<Upload />} size="md">Upload</Button>
            <Button variant="danger" iconLeft={<Trash2 />} size="md">Delete</Button>
            <Button variant="success" iconLeft={<Check />} size="md">Confirm</Button>
            <Button variant="ghost" iconRight={<ArrowRight />} size="md">Continue</Button>
            <Button variant="soft" iconLeft={<Settings />} size="md">Settings</Button>
            <Button variant="warning" iconLeft={<Lock />} size="md">Restricted</Button>
            <Button variant="link" iconRight={<ChevronRight />} size="md">Learn more</Button>
          </div>
        </section>

        <Divider />

        {/* ── Section 2: Sizes ── */}
        <section>
          <SectionHeader title="Sizes" subtitle="From 2xs to 2xl — all sizes share the same variant/shape API." />
          <div className="flex flex-wrap items-end gap-3">
            {sizes.map((s) => (
              <div key={s} className="flex flex-col items-center gap-2">
                <Button variant="solid" size={s}>Button</Button>
                <Tag>{s}</Tag>
              </div>
            ))}
          </div>
          {/* Outline sizes */}
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-6 mb-3">Outline at every size</p>
          <div className="flex flex-wrap items-end gap-3">
            {sizes.map((s) => (
              <Button key={s} variant="outline" size={s}>{s}</Button>
            ))}
          </div>
          {/* Ghost sizes */}
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-6 mb-3">Ghost at every size</p>
          <div className="flex flex-wrap items-end gap-3">
            {sizes.map((s) => (
              <Button key={s} variant="ghost" size={s}>{s}</Button>
            ))}
          </div>
        </section>

        <Divider />

        {/* ── Section 3: Shapes ── */}
        <section>
          <SectionHeader title="Shapes" subtitle="rounded (default), pill, and square — each works across all variants and sizes." />
          <div className="flex flex-wrap gap-8">
            {shapes.map((sh) => (
              <div key={sh} className="flex flex-col items-start gap-3">
                <Tag>{sh}</Tag>
                <div className="flex flex-wrap items-end gap-2">
                  {(["solid", "outline", "ghost"] as ButtonVariant[]).map((v) => (
                    <Button key={v} variant={v} shape={sh} size="md">{v}</Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <Divider />

        {/* ── Section 4: States ── */}
        <section>
          <SectionHeader title="States" subtitle="Disabled, loading (controlled), and combined." />
          <div className="flex flex-wrap gap-3">
            <Button variant="solid" disabled>Disabled solid</Button>
            <Button variant="outline" disabled>Disabled outline</Button>
            <Button variant="danger" disabled>Disabled danger</Button>
            <Button variant="ghost" disabled>Disabled ghost</Button>
          </div>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-5 mb-3">Loading (controlled prop)</p>
          <div className="flex flex-wrap gap-3">
            <Button variant="solid" loading>Saving</Button>
            <Button variant="outline" loading loadingText="Uploading…">Upload</Button>
            <Button variant="danger" loading>Deleting</Button>
            <Button variant="success" loading loadingText="Publishing…">Publish</Button>
          </div>
        </section>

        <Divider />

        {/* ── Section 5: Async ── */}
        <section>
          <SectionHeader title="Async — Auto Loading" subtitle="Pass an async onClick and loading state is managed automatically. No extra state needed." />
          <div className="flex flex-wrap gap-4">

            {/* Upload */}
            <div className="flex flex-col items-start gap-1.5">
              <AsyncButton
                variant="solid"
                iconLeft={<Upload />}
                onClick={async () => {
                  await sleep(2000);
                  setUploadResult("Upload complete ✓");
                  setTimeout(() => setUploadResult(null), 2500);
                }}
              >
                Upload file
              </AsyncButton>
              {uploadResult && <span className="text-xs text-green-600 dark:text-green-400">{uploadResult}</span>}
            </div>

            {/* Delete */}
            <div className="flex flex-col items-start gap-1.5">
              <AsyncButton
                variant="danger"
                iconLeft={<Trash2 />}
                loadingText="Deleting…"
                onClick={async () => {
                  await sleep(1500);
                  setDeleteResult("Deleted ✓");
                  setTimeout(() => setDeleteResult(null), 2500);
                }}
              >
                Delete record
              </AsyncButton>
              {deleteResult && <span className="text-xs text-green-600 dark:text-green-400">{deleteResult}</span>}
            </div>

            {/* Save */}
            <div className="flex flex-col items-start gap-1.5">
              <AsyncButton
                variant="success"
                iconLeft={<Send />}
                loadingText="Saving…"
                onClick={async () => {
                  await sleep(1800);
                  setSaveResult("Saved ✓");
                  setTimeout(() => setSaveResult(null), 2500);
                }}
              >
                Save changes
              </AsyncButton>
              {saveResult && <span className="text-xs text-green-600 dark:text-green-400">{saveResult}</span>}
            </div>

            {/* Simulated failure */}
            <div className="flex flex-col items-start gap-1.5">
              <AsyncButton
                variant="warning"
                iconLeft={<RefreshCw />}
                loadingText="Retrying…"
                onClick={async () => {
                  await sleep(2000);
                  setFailResult("Error: timeout — retry again");
                  setTimeout(() => setFailResult(null), 3000);
                }}
              >
                Retry request
              </AsyncButton>
              {failResult && <span className="text-xs text-red-500">{failResult}</span>}
            </div>

            {/* Long running */}
            <AsyncButton
              variant="outline"
              iconLeft={<RefreshCw />}
              loadingText="Syncing (5s)…"
              onClick={() => sleep(5000)}
            >
              Long sync
            </AsyncButton>

            {/* Instant */}
            <AsyncButton
              variant="ghost"
              iconLeft={<Copy />}
              onClick={async () => {
                await sleep(300);
              }}
            >
              Copy (fast)
            </AsyncButton>
          </div>
        </section>

        <Divider />

        {/* ── Section 6: Toggle ── */}
        <section>
          <SectionHeader title="Toggle Buttons" subtitle="Uncontrolled and controlled pressed state. aria-pressed is set automatically." />
          <div className="flex flex-wrap gap-3">

            {/* Uncontrolled */}
            <ToggleButton iconLeft={<Star />} defaultPressed={false} size="md" variant="outline">
              Favourite
            </ToggleButton>

            {/* Controlled */}
            <ToggleButton
              iconLeft={<Star className={starred ? "fill-current" : ""} />}
              pressed={starred}
              onPressedChange={setStarred}
              size="md"
              variant="outline"
            >
              {starred ? "Starred" : "Star"}
            </ToggleButton>

            <ToggleButton
              iconLeft={<Bookmark className={bookmarked ? "fill-current" : ""} />}
              pressed={bookmarked}
              onPressedChange={setBookmarked}
              size="md"
              variant="soft"
            >
              {bookmarked ? "Saved" : "Save"}
            </ToggleButton>

            <ToggleButton
              iconLeft={<Bell />}
              pressed={notified}
              onPressedChange={setNotified}
              size="md"
              variant="outline"
            >
              {notified ? "Mute" : "Notify me"}
            </ToggleButton>

            <ToggleButton
              iconLeft={eyeOn ? <Eye /> : <X />}
              pressed={eyeOn}
              onPressedChange={setEyeOn}
              size="md"
              variant="ghost"
            >
              {eyeOn ? "Visible" : "Hidden"}
            </ToggleButton>

            {/* Pill toggle */}
            <ToggleButton shape="pill" iconLeft={<Heart />} size="md" variant="outline">
              Like
            </ToggleButton>
          </div>
        </section>

        <Divider />

        {/* ── Section 7: Button Group ── */}
        <section>
          <SectionHeader title="Button Group" subtitle="Borders collapse between siblings. Works horizontally and vertically." />

          {/* Alignment group (controlled toggles) */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-3">Alignment selector (controlled)</p>
              <ButtonGroup>
                {(["left", "center", "right"] as const).map((a) => (
                  <Button
                    key={a}
                    variant={align === a ? "solid" : "outline"}
                    size="md"
                    onClick={() => setAlign(a)}
                  >
                    {a.charAt(0).toUpperCase() + a.slice(1)}
                  </Button>
                ))}
              </ButtonGroup>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">Selected: <strong>{align}</strong></p>
            </div>

            {/* Horizontal */}
            <div>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-3">Horizontal group</p>
              <ButtonGroup>
                <Button variant="outline" size="md" iconLeft={<Copy />}>Copy</Button>
                <Button variant="outline" size="md" iconLeft={<Download />}>Export</Button>
                <Button variant="outline" size="md" iconLeft={<Send />}>Share</Button>
              </ButtonGroup>
            </div>

            {/* Vertical */}
            <div>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-3">Vertical group</p>
              <ButtonGroup orientation="vertical">
                <Button variant="outline" size="sm">Option A</Button>
                <Button variant="outline" size="sm">Option B</Button>
                <Button variant="outline" size="sm">Option C</Button>
              </ButtonGroup>
            </div>

            {/* Mixed sizes in group */}
            <div>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-3">Danger group</p>
              <ButtonGroup>
                <Button variant="solid" size="md">Primary</Button>
                <Button variant="outline" size="md">Secondary</Button>
                <Button variant="danger" size="md" iconLeft={<Trash2 />}>Delete</Button>
              </ButtonGroup>
            </div>
          </div>
        </section>

        <Divider />

        {/* ── Section 8: Icon Buttons ── */}
        <section>
          <SectionHeader title="Icon Buttons & Icon-Only" subtitle="IconButton enforces aria-label. iconOnly on Button also works for custom compositions." />
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex flex-col items-center gap-2">
              <div className="flex flex-wrap gap-2">
                {sizes.map((s) => (
                  <IconButton key={s} aria-label="Settings" icon={<Settings />} variant="outline" size={s} />
                ))}
              </div>
              <Tag>outline — all sizes</Tag>
            </div>
          </div>

          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-6 mb-3">Variants</p>
          <div className="flex flex-wrap gap-3">
            <IconButton aria-label="Add" icon={<Plus />} variant="solid" />
            <IconButton aria-label="Delete" icon={<Trash2 />} variant="danger" />
            <IconButton aria-label="Download" icon={<Download />} variant="success" />
            <IconButton aria-label="Settings" icon={<Settings />} variant="ghost" />
            <IconButton aria-label="More" icon={<MoreHorizontal />} variant="soft" />
            <IconButton aria-label="Notify" icon={<Bell />} variant="outline" shape="pill" />
            <IconButton aria-label="Sign in" icon={<LogIn />} variant="warning" />
          </div>

          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-6 mb-3">Async icon buttons</p>
          <div className="flex flex-wrap gap-3">
            <IconButton
              aria-label="Refresh"
              icon={<RefreshCw />}
              variant="outline"
              onClick={() => sleep(2000)}
            />
            <IconButton
              aria-label="Upload"
              icon={<Upload />}
              variant="solid"
              onClick={() => sleep(1500)}
            />
          </div>
        </section>

        <Divider />

        {/* ── Section 9: Full Width ── */}
        <section>
          <SectionHeader title="Full Width" subtitle="fullWidth stretches the button to fill its container." />
          <div className="flex flex-col gap-3 max-w-sm">
            <Button variant="solid" fullWidth iconLeft={<LogIn />}>Sign in with email</Button>
            <Button variant="outline" fullWidth iconLeft={<Send />}>Send message</Button>
            <AsyncButton variant="danger" fullWidth iconLeft={<Trash2 />} loadingText="Deleting…" onClick={() => sleep(2000)}>
              Delete account
            </AsyncButton>
          </div>
        </section>

        <Divider />

        {/* ── Section 10: className Override ── */}
        <section>
          <SectionHeader
            title="className Override"
            subtitle="Pass className to override any style. Your classes are always merged last — they win."
          />
          <div className="flex flex-wrap gap-3">
            {/* Brand colour override */}
            <Button
              variant="solid"
              className="bg-violet-600 border-violet-600 hover:bg-violet-700 hover:border-violet-700 focus-visible:ring-violet-500"
            >
              Brand violet
            </Button>

            {/* Custom text colour */}
            <Button
              variant="outline"
              className="text-pink-600 border-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/20"
            >
              Pink outline
            </Button>

            {/* Extra large padding */}
            <Button variant="ghost" className="px-10 py-4 text-base font-bold tracking-widest uppercase">
              Wide ghost
            </Button>

            {/* Gradient override */}
            <Button
              variant="solid"
              className="bg-gradient-to-r from-orange-500 to-pink-500 border-transparent hover:from-orange-600 hover:to-pink-600"
            >
              Gradient
            </Button>

            {/* Shadow emphasis */}
            <Button variant="solid" className="shadow-lg shadow-zinc-900/30 dark:shadow-zinc-100/10">
              Shadow emphasis
            </Button>

            {/* Pill + custom colour */}
            <Button variant="solid" shape="pill" className="bg-teal-600 border-teal-600 hover:bg-teal-700">
              Teal pill
            </Button>

            {/* Monospaced label */}
            <Button variant="soft" className="font-mono text-xs tracking-tight">
              monospace label
            </Button>
          </div>
        </section>

        <Divider />

        {/* ── Section 11: Real-world patterns ── */}
        <section>
          <SectionHeader title="Real-world Patterns" subtitle="Common UI patterns assembled from the primitives." />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            {/* Form actions */}
            <div className="bg-white dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 rounded-2xl p-5">
              <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-4 uppercase tracking-wider">Form actions</p>
              <div className="flex gap-2 justify-end">
                <Button variant="ghost" size="sm">Cancel</Button>
                <AsyncButton variant="solid" size="sm" iconLeft={<Check />} loadingText="Saving…" onClick={() => sleep(1500)}>
                  Save changes
                </AsyncButton>
              </div>
            </div>

            {/* Danger zone */}
            <div className="bg-white dark:bg-zinc-800/60 border border-red-200 dark:border-red-900/40 rounded-2xl p-5">
              <p className="text-xs font-semibold text-red-500 mb-1 uppercase tracking-wider">Danger zone</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">This action is irreversible.</p>
              <AsyncButton variant="danger" size="sm" iconLeft={<Trash2 />} loadingText="Deleting…" onClick={() => sleep(2000)}>
                Delete account
              </AsyncButton>
            </div>

            {/* Toolbar */}
            <div className="bg-white dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 rounded-2xl p-5">
              <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-4 uppercase tracking-wider">Toolbar</p>
              <div className="flex items-center gap-2 flex-wrap">
                <ButtonGroup>
                  <IconButton aria-label="Copy" icon={<Copy />} variant="outline" size="sm" />
                  <IconButton aria-label="Download" icon={<Download />} variant="outline" size="sm" />
                  <IconButton aria-label="Send" icon={<Send />} variant="outline" size="sm" />
                </ButtonGroup>
                <Button variant="solid" size="sm" iconLeft={<Plus />}>New</Button>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-zinc-900 dark:bg-zinc-100 rounded-2xl p-5 flex flex-col gap-3">
              <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-wider">CTA block</p>
              <p className="text-sm text-zinc-200 dark:text-zinc-700 leading-relaxed">Start building today. No credit card required.</p>
              <div className="flex gap-2">
                <Button
                  variant="solid"
                  className="bg-white text-zinc-900 border-white hover:bg-zinc-100 hover:border-zinc-100 dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-900 dark:hover:bg-zinc-800"
                  iconRight={<ArrowRight />}
                  shape="pill"
                  size="sm"
                >
                  Get started
                </Button>
                <Button
                  variant="ghost"
                  className="text-zinc-400 hover:text-white hover:bg-zinc-800 dark:text-zinc-600 dark:hover:text-zinc-900 dark:hover:bg-zinc-200"
                  size="sm"
                >
                  Learn more
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Spacer */}
        <div className="h-8" />
      </div>
    </div>
  );
}

