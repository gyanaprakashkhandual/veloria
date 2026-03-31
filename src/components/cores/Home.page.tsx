"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Copy,
  Check,
  Star,
  Zap,
  Layers,
  Shield,
  Code2,
  ExternalLink,
  ChevronRight,
  Play,
} from "lucide-react";

// ─── SVG Background ────────────────────────────────────────────────────────────
function HeroSVGBackground() {
  return (
    <svg className="pointer-events-none absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      <defs>
        {/* Grid lines */}
        <pattern id="hero-grid" x="0" y="0" width="64" height="64" patternUnits="userSpaceOnUse">
          <path d="M 64 0 L 0 0 0 64" fill="none" stroke="rgba(139,92,246,0.055)" strokeWidth="1" />
        </pattern>
        {/* Radial glow center */}
        <radialGradient id="hero-glow-center" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="rgba(139,92,246,0.10)" />
          <stop offset="60%" stopColor="rgba(59,130,246,0.04)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
        {/* Top arc shimmer */}
        <linearGradient id="arc-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(139,92,246,0)" />
          <stop offset="30%" stopColor="rgba(139,92,246,0.35)" />
          <stop offset="70%" stopColor="rgba(59,130,246,0.35)" />
          <stop offset="100%" stopColor="rgba(59,130,246,0)" />
        </linearGradient>
        {/* Left glow */}
        <radialGradient id="left-glow" cx="0%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(139,92,246,0.08)" />
          <stop offset="100%" stopColor="rgba(139,92,246,0)" />
        </radialGradient>
        {/* Right glow */}
        <radialGradient id="right-glow" cx="100%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(59,130,246,0.07)" />
          <stop offset="100%" stopColor="rgba(59,130,246,0)" />
        </radialGradient>
        {/* Dot pattern */}
        <pattern id="hero-dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="0.8" cy="0.8" r="0.7" fill="rgba(139,92,246,0.09)" />
        </pattern>
      </defs>
      {/* Dot field */}
      <rect width="100%" height="100%" fill="url(#hero-dots)" />
      {/* Grid */}
      <rect width="100%" height="100%" fill="url(#hero-grid)" />
      {/* Center glow */}
      <rect width="100%" height="100%" fill="url(#hero-glow-center)" />
      {/* Side glows */}
      <rect width="40%" height="100%" fill="url(#left-glow)" />
      <rect x="60%" width="40%" height="100%" fill="url(#right-glow)" />
      {/* Horizontal shimmer lines */}
      <line x1="0" y1="1" x2="100%" y2="1" stroke="url(#arc-grad)" strokeWidth="1" />
      {/* Decorative arcs */}
      <ellipse cx="50%" cy="-10%" rx="50%" ry="55%" fill="none" stroke="rgba(139,92,246,0.06)" strokeWidth="1" />
      <ellipse cx="50%" cy="-10%" rx="38%" ry="42%" fill="none" stroke="rgba(59,130,246,0.05)" strokeWidth="1" />
      <ellipse cx="50%" cy="-10%" rx="26%" ry="30%" fill="none" stroke="rgba(139,92,246,0.07)" strokeWidth="1" />
      {/* Corner cross marks */}
      <g stroke="rgba(139,92,246,0.18)" strokeWidth="1" strokeLinecap="round">
        <line x1="48" y1="32" x2="56" y2="32" /><line x1="52" y1="28" x2="52" y2="36" />
        <line x1="calc(100% - 48px)" y1="32" x2="calc(100% - 56px)" y2="32" />
      </g>
    </svg>
  );
}

// ─── Floating gradient orbs ───────────────────────────────────────────────────
function GradientOrbs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-gradient-to-b from-violet-500/10 via-purple-500/6 to-transparent blur-3xl" />
      <div className="absolute top-20 -left-32 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-violet-400/8 to-transparent blur-3xl" />
      <div className="absolute top-20 -right-32 w-[400px] h-[400px] rounded-full bg-gradient-to-bl from-blue-400/8 to-transparent blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-[300px] h-[200px] rounded-full bg-gradient-to-t from-blue-500/6 to-transparent blur-3xl" />
    </div>
  );
}

// ─── Animated badge ───────────────────────────────────────────────────────────
function AnnouncementBadge() {
  return (
    <motion.a
      href="#"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-200/70 dark:border-violet-700/40 bg-gradient-to-r from-violet-50 to-blue-50 dark:from-violet-950/50 dark:to-blue-950/40 text-[12px] font-semibold text-violet-700 dark:text-violet-300 hover:shadow-[0_0_20px_rgba(139,92,246,0.2)] transition-all duration-200 cursor-pointer"
    >
      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 text-white text-[10px] font-bold tracking-wide">
        <Sparkles size={9} /> NEW
      </span>
      <span>Veloria v1.0 is here — 70+ components</span>
      <ChevronRight size={13} className="text-violet-500 group-hover:translate-x-0.5 transition-transform duration-150" />
    </motion.a>
  );
}

// ─── Animated code snippet ────────────────────────────────────────────────────
const installCmd = "npx veloria@latest init";

function InstallCommand() {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(installCmd).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55, duration: 0.45, ease: "easeOut" }}
      className="inline-flex items-center gap-3 px-4 py-2.5 rounded-xl border border-black/8 dark:border-white/10 bg-black/3 dark:bg-white/4 backdrop-blur-sm"
    >
      <span className="text-[12px] font-mono text-black/50 dark:text-white/40 select-none">$</span>
      <span className="text-[13px] font-mono text-black/75 dark:text-white/70 tracking-tight">{installCmd}</span>
      <button
        onClick={copy}
        className="ml-1 flex items-center justify-center w-6 h-6 rounded-md text-black/35 dark:text-white/30 hover:text-black dark:hover:text-white hover:bg-black/6 dark:hover:bg-white/8 transition-all duration-150"
      >
        <AnimatePresence mode="wait">
          {copied ? (
            <motion.span key="check" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.7, opacity: 0 }} transition={{ duration: 0.15 }}>
              <Check size={12} className="text-emerald-500" />
            </motion.span>
          ) : (
            <motion.span key="copy" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.7, opacity: 0 }} transition={{ duration: 0.15 }}>
              <Copy size={12} />
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </motion.div>
  );
}

// ─── Feature chips ─────────────────────────────────────────────────────────────
const features = [
  { icon: <Zap size={12} />, label: "Blazing Fast" },
  { icon: <Shield size={12} />, label: "Accessible" },
  { icon: <Layers size={12} />, label: "Composable" },
  { icon: <Code2 size={12} />, label: "TypeScript" },
];

// ─── Component preview cards ───────────────────────────────────────────────────

// Mini button preview
function ButtonPreview() {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="flex flex-col gap-2 p-4">
      <p className="text-[10px] font-bold uppercase tracking-widest text-black/25 dark:text-white/20 mb-1">Buttons</p>
      <button
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="px-4 py-2 rounded-lg text-[12px] font-semibold text-white bg-gradient-to-r from-violet-600 to-blue-600 shadow-[0_2px_10px_rgba(139,92,246,0.35)] hover:shadow-[0_4px_18px_rgba(139,92,246,0.5)] transition-all duration-200"
      >
        {hovered ? "✨ Click me!" : "Primary Button"}
      </button>
      <div className="flex gap-2">
        <button className="flex-1 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-black/70 dark:text-white/65 border border-black/10 dark:border-white/10 hover:bg-black/4 dark:hover:bg-white/6 transition-all duration-150">
          Secondary
        </button>
        <button className="flex-1 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/30 hover:bg-violet-100 dark:hover:bg-violet-900/50 transition-all duration-150">
          Ghost
        </button>
      </div>
    </div>
  );
}

// Mini badge preview
function BadgePreview() {
  return (
    <div className="flex flex-col gap-2.5 p-4">
      <p className="text-[10px] font-bold uppercase tracking-widest text-black/25 dark:text-white/20 mb-1">Badges</p>
      <div className="flex flex-wrap gap-1.5">
        {[
          { label: "New", cls: "bg-gradient-to-r from-violet-600 to-blue-600 text-white" },
          { label: "Stable", cls: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-700/30" },
          { label: "Beta", cls: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-700/30" },
          { label: "Hot 🔥", cls: "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-400 border border-rose-200/60 dark:border-rose-700/30" },
        ].map((b) => (
          <span key={b.label} className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${b.cls}`}>{b.label}</span>
        ))}
      </div>
    </div>
  );
}

// Mini card preview
function CardPreview() {
  return (
    <div className="p-4 flex flex-col gap-2">
      <p className="text-[10px] font-bold uppercase tracking-widest text-black/25 dark:text-white/20 mb-1">Cards</p>
      <div className="rounded-xl border border-black/8 dark:border-white/8 bg-gradient-to-br from-white to-violet-50/30 dark:from-white/4 dark:to-violet-900/10 p-3 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500" />
          <div>
            <p className="text-[11px] font-bold text-black dark:text-white">Component</p>
            <p className="text-[9px] text-black/40 dark:text-white/35">Veloria UI</p>
          </div>
        </div>
        <p className="text-[10px] text-black/45 dark:text-white/40 leading-relaxed">Beautiful cards with subtle gradients and clean typography.</p>
      </div>
    </div>
  );
}

// Mini input preview
function InputPreview() {
  const [val, setVal] = useState("");
  return (
    <div className="p-4 flex flex-col gap-2">
      <p className="text-[10px] font-bold uppercase tracking-widest text-black/25 dark:text-white/20 mb-1">Inputs</p>
      <input
        value={val}
        onChange={e => setVal(e.target.value)}
        placeholder="Search components..."
        className="w-full px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 text-[12px] text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/25 outline-none focus:border-violet-400/60 dark:focus:border-violet-500/50 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.12)] transition-all duration-150"
      />
      <div className="flex gap-1.5">
        <div className="flex-1 h-1.5 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 opacity-70" />
        <div className="w-8 h-1.5 rounded-full bg-black/8 dark:bg-white/10" />
      </div>
    </div>
  );
}

// ─── Floating preview panel (tilt on mouse) ────────────────────────────────────
function ComponentShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 });

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onMouseLeave = () => { mouseX.set(0); mouseY.set(0); };

  const panels = [
    { id: "btn", component: <ButtonPreview />, col: "col-span-2", delay: 0.7 },
    { id: "badge", component: <BadgePreview />, col: "col-span-2", delay: 0.8 },
    { id: "card", component: <CardPreview />, col: "col-span-2", delay: 0.75 },
    { id: "input", component: <InputPreview />, col: "col-span-2", delay: 0.85 },
  ];

  return (
    <motion.div
      ref={ref}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1000 }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.65, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-[560px] mx-auto lg:mx-0"
    >
      {/* Outer glow */}
      <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-violet-500/15 via-purple-500/8 to-blue-500/12 blur-2xl" />

      {/* Main panel */}
      <div className="relative rounded-2xl border border-black/8 dark:border-white/8 bg-white/90 dark:bg-[#0d0d0f]/90 backdrop-blur-xl shadow-[0_32px_80px_rgba(0,0,0,0.1)] dark:shadow-[0_32px_80px_rgba(0,0,0,0.5)] overflow-hidden">

        {/* Top gradient bar */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-400/60 to-transparent" />

        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-black/5 dark:border-white/5 bg-black/2 dark:bg-white/2">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <div className="ml-2 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-black/4 dark:bg-white/6 text-[10px] font-mono text-black/40 dark:text-white/35">
            <Code2 size={9} /> veloria-components
          </div>
        </div>

        {/* Component grid */}
        <div className="grid grid-cols-4 divide-x divide-y divide-black/5 dark:divide-white/5">
          {panels.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: p.delay, duration: 0.4 }}
              className={`${p.col} bg-white dark:bg-transparent hover:bg-violet-50/30 dark:hover:bg-white/2 transition-colors duration-200`}
            >
              {p.component}
            </motion.div>
          ))}
        </div>

        {/* Bottom badge row */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-black/5 dark:border-white/5 bg-black/2 dark:bg-white/2">
          <span className="text-[10px] font-mono text-black/30 dark:text-white/25">70+ components ready</span>
          <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Preview
          </span>
        </div>
      </div>

      {/* Floating accent chips */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.0, duration: 0.5, ease: "easeOut" }}
        className="absolute -right-4 top-16 flex flex-col gap-2"
      >
        {[
          { label: "React", color: "from-cyan-400/20 to-cyan-500/10 border-cyan-400/25 text-cyan-600 dark:text-cyan-400" },
          { label: "TypeScript", color: "from-blue-400/20 to-blue-500/10 border-blue-400/25 text-blue-600 dark:text-blue-400" },
          { label: "Tailwind", color: "from-teal-400/20 to-teal-500/10 border-teal-400/25 text-teal-600 dark:text-teal-400" },
        ].map((chip) => (
          <div key={chip.label} className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border bg-gradient-to-r ${chip.color} backdrop-blur-sm shadow-sm`}>
            {chip.label}
          </div>
        ))}
      </motion.div>

      {/* Stars floating chip */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.1, duration: 0.5, ease: "easeOut" }}
        className="absolute -left-4 bottom-20 px-3 py-1.5 rounded-xl border border-amber-300/30 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/15 shadow-sm backdrop-blur-sm"
      >
        <div className="flex items-center gap-1.5">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={9} className="text-amber-400 fill-amber-400" />
            ))}
          </div>
          <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400">4.9 / 5</span>
        </div>
        <p className="text-[9px] text-amber-600/70 dark:text-amber-500/60 mt-0.5">by developers</p>
      </motion.div>
    </motion.div>
  );
}

// ─── Animated stat counter ────────────────────────────────────────────────────
function StatItem({ value, label, delay }: { value: string; label: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      className="flex flex-col items-center sm:items-start"
    >
      <span className="text-2xl sm:text-3xl font-black bg-gradient-to-br from-violet-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
        {value}
      </span>
      <span className="text-[12px] text-black/40 dark:text-white/35 font-medium mt-0.5">{label}</span>
    </motion.div>
  );
}

// ─── Scrolling component ticker ────────────────────────────────────────────────
const tickerItems = [
  "Button", "Input", "Modal", "Dropdown", "Toast", "Badge", "Card", "Table",
  "Accordion", "Tabs", "Tooltip", "Avatar", "Switch", "Slider", "Progress",
  "Select", "Checkbox", "Radio", "Alert", "Popover", "Sheet", "Skeleton",
];

function ComponentTicker() {
  return (
    <div className="relative overflow-hidden py-3 border-y border-black/5 dark:border-white/5">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white dark:from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white dark:from-black to-transparent z-10 pointer-events-none" />
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        className="flex gap-4 w-max"
      >
        {[...tickerItems, ...tickerItems].map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-2 text-[12px] font-medium text-black/40 dark:text-white/30 whitespace-nowrap"
          >
            <span className="w-1 h-1 rounded-full bg-gradient-to-r from-violet-400 to-blue-400" />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ─── Trusted by logos (abstract shapes) ───────────────────────────────────────
function TrustedBy() {
  const logos = [
    { name: "Acme", shape: "M4 12h16M12 4v16" },
    { name: "Nexus", shape: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" },
    { name: "Orbit", shape: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" },
    { name: "Pulse", shape: "M22 12h-4l-3 9L9 3l-3 9H2" },
    { name: "Forge", shape: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.9, duration: 0.5 }}
      className="flex flex-col items-center sm:flex-row sm:items-center gap-4 sm:gap-8"
    >
      <p className="text-[11px] font-semibold uppercase tracking-widest text-black/25 dark:text-white/20 whitespace-nowrap">
        Trusted by teams at
      </p>
      <div className="flex items-center gap-5">
        {logos.map((l) => (
          <div key={l.name} title={l.name} className="opacity-25 hover:opacity-50 transition-opacity duration-200">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-black dark:text-white">
              <path d={l.shape} />
            </svg>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Main Hero ─────────────────────────────────────────────────────────────────
export default function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <section className="relative min-h-screen bg-white dark:bg-black overflow-hidden flex flex-col">
      {/* Backgrounds */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 via-white to-blue-50/40 dark:from-violet-950/25 dark:via-black dark:to-blue-950/20" />
        <HeroSVGBackground />
        <GradientOrbs />
      </div>

      {/* ── Main content ── */}
      <div className="relative flex-1 flex flex-col justify-center pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col lg:flex-row items-center lg:items-center gap-16 lg:gap-12">

            {/* ── Left: Text content ── */}
            <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left max-w-2xl mx-auto lg:mx-0">

              {/* Badge */}
              <AnnouncementBadge />

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="mt-7 text-[42px] sm:text-[56px] lg:text-[64px] xl:text-[72px] font-black leading-[1.0] tracking-tight text-black dark:text-white"
              >
                Build{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                    stunning
                  </span>
                  {/* Underline stroke */}
                  <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 8" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                    <path d="M2 6 C 40 2, 100 1, 198 5" stroke="url(#underline-grad)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                    <defs>
                      <linearGradient id="underline-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(139,92,246,0.6)" />
                        <stop offset="100%" stopColor="rgba(59,130,246,0.6)" />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>{" "}
                interfaces{" "}
                <br className="hidden sm:block" />
                <span className="text-black/15 dark:text-white/15">faster than ever</span>
              </motion.h1>

              {/* Subtext */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28, duration: 0.55, ease: "easeOut" }}
                className="mt-6 text-[16px] sm:text-[18px] text-black/50 dark:text-white/45 leading-relaxed max-w-lg"
              >
                Veloria is a free, open-source React UI library with{" "}
                <span className="text-black/70 dark:text-white/65 font-semibold">70+ production-ready components</span>{" "}
                — crafted for speed, accessibility, and beauty.
              </motion.p>

              {/* Feature chips */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.38, duration: 0.45, ease: "easeOut" }}
                className="mt-6 flex flex-wrap justify-center lg:justify-start gap-2"
              >
                {features.map((f) => (
                  <span
                    key={f.label}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold text-black/60 dark:text-white/50 border border-black/8 dark:border-white/8 bg-black/3 dark:bg-white/4 hover:border-violet-300/50 dark:hover:border-violet-600/40 hover:text-violet-700 dark:hover:text-violet-400 transition-all duration-150"
                  >
                    <span className="text-violet-500">{f.icon}</span>
                    {f.label}
                  </span>
                ))}
              </motion.div>

              {/* CTA buttons */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.5, ease: "easeOut" }}
                className="mt-8 flex flex-wrap justify-center lg:justify-start gap-3"
              >
                <a
                  href="/docs/getting-started"
                  className="group flex items-center gap-2 px-6 py-3 rounded-xl text-[14px] font-bold text-white bg-gradient-to-r from-violet-600 via-violet-600 to-blue-600 hover:from-violet-500 hover:via-violet-500 hover:to-blue-500 shadow-[0_4px_20px_rgba(139,92,246,0.4)] hover:shadow-[0_8px_32px_rgba(139,92,246,0.55)] transition-all duration-200 hover:-translate-y-0.5"
                >
                  Get Started Free
                  <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform duration-150" />
                </a>
                <a
                  href="/components"
                  className="group flex items-center gap-2 px-6 py-3 rounded-xl text-[14px] font-bold text-black/70 dark:text-white/65 border border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 hover:text-black dark:hover:text-white hover:bg-black/3 dark:hover:bg-white/5 transition-all duration-200 hover:-translate-y-0.5"
                >
                  <Play size={13} className="text-violet-500" />
                  Browse Components
                </a>
              </motion.div>

              {/* Install command */}
              <div className="mt-5">
                <InstallCommand />
              </div>

              {/* Stats row */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="mt-10 flex items-center gap-8 sm:gap-10"
              >
                <div className="w-px h-8 bg-black/8 dark:bg-white/8 hidden sm:block" />
                <StatItem value="70+" label="Components" delay={0.72} />
                <div className="w-px h-8 bg-black/8 dark:bg-white/8" />
                <StatItem value="12+" label="Templates" delay={0.76} />
                <div className="w-px h-8 bg-black/8 dark:bg-white/8" />
                <StatItem value="MIT" label="Open Source" delay={0.80} />
                <div className="w-px h-8 bg-black/8 dark:bg-white/8 hidden sm:block" />
                <StatItem value="4.9★" label="Rating" delay={0.84} />
              </motion.div>

              {/* Trusted by */}
              <div className="mt-8">
                <TrustedBy />
              </div>
            </div>

            {/* ── Right: Component Showcase ── */}
            <div className="w-full lg:w-auto lg:flex-shrink-0 flex justify-center">
              <ComponentShowcase />
            </div>
          </div>
        </div>
      </div>

      {/* ── Component ticker ── */}
      <div className="relative mt-auto">
        <ComponentTicker />
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-black to-transparent pointer-events-none" />
    </section>
  );
}