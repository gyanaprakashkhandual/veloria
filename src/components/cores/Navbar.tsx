"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Sun,
  Moon,
  Monitor,
  ChevronDown,
  Menu,
  X,
  Layers,
  BookOpen,
  LayoutTemplate,
  Sparkles,
  Box,
  Palette,
  Navigation,
  ToggleLeft,
  Table,
  Bell,
  ExternalLink,
  Command,
  ArrowRight,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Theme = "light" | "dark" | "system";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

interface DropdownSection {
  title: string;
  items: NavItem[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const componentSections: DropdownSection[] = [
  {
    title: "Layout",
    items: [
      { label: "Navigation", href: "#", icon: <Navigation size={14} /> },
      { label: "Containers", href: "#", icon: <Box size={14} /> },
      { label: "Grid", href: "#", icon: <Table size={14} /> },
    ],
  },
  {
    title: "Inputs",
    items: [
      {
        label: "Buttons",
        href: "#",
        icon: <ToggleLeft size={14} />,
        badge: "New",
      },
      { label: "Forms", href: "#", icon: <Layers size={14} /> },
      { label: "Toggles", href: "#", icon: <ToggleLeft size={14} /> },
    ],
  },
  {
    title: "Feedback",
    items: [
      { label: "Alerts", href: "#", icon: <Bell size={14} /> },
      { label: "Modals", href: "#", icon: <Layers size={14} /> },
      {
        label: "Toasts",
        href: "#",
        icon: <Sparkles size={14} />,
        badge: "Hot",
      },
    ],
  },
];

const templateItems: NavItem[] = [
  {
    label: "Landing Page",
    href: "#",
    icon: <LayoutTemplate size={14} />,
    badge: "Free",
  },
  { label: "Dashboard", href: "#", icon: <Table size={14} /> },
  { label: "Portfolio", href: "#", icon: <Palette size={14} /> },
  {
    label: "SaaS Starter",
    href: "#",
    icon: <Sparkles size={14} />,
    badge: "Pro",
  },
];

const themeOptions: { label: string; value: Theme; icon: React.ReactNode }[] = [
  { label: "Light", value: "light", icon: <Sun size={14} /> },
  { label: "Dark", value: "dark", icon: <Moon size={14} /> },
  { label: "System", value: "system", icon: <Monitor size={14} /> },
];

// ─── SVG Background ───────────────────────────────────────────────────────────
function SVGBackground() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(139,92,246,0)" />
          <stop offset="50%" stopColor="rgba(139,92,246,0.25)" />
          <stop offset="100%" stopColor="rgba(59,130,246,0)" />
        </linearGradient>
        <linearGradient id="line-grad-2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(59,130,246,0)" />
          <stop offset="50%" stopColor="rgba(236,72,153,0.18)" />
          <stop offset="100%" stopColor="rgba(139,92,246,0)" />
        </linearGradient>
      </defs>
      {/* Bottom border line */}
      <line
        x1="0"
        y1="99%"
        x2="100%"
        y2="99%"
        stroke="url(#line-grad)"
        strokeWidth="1"
      />
      {/* Subtle vertical accent lines */}
      <line
        x1="0%"
        y1="0"
        x2="0%"
        y2="100%"
        stroke="rgba(139,92,246,0.06)"
        strokeWidth="1"
      />
      <line
        x1="100%"
        y1="0"
        x2="100%"
        y2="100%"
        stroke="rgba(59,130,246,0.06)"
        strokeWidth="1"
      />
      {/* Animated top shimmer */}
      <line
        x1="0"
        y1="1"
        x2="100%"
        y2="1"
        stroke="url(#line-grad-2)"
        strokeWidth="1"
      />
    </svg>
  );
}

// ─── Logo ─────────────────────────────────────────────────────────────────────
function VeloriaLogo() {
  return (
    <a href="/" className="flex items-center gap-2.5 group select-none">
      <div className="relative w-8 h-8 flex items-center justify-center">
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500 opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500 blur-md opacity-40 group-hover:opacity-60 transition-opacity duration-300" />
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          className="relative z-10"
        >
          <path
            d="M3 3 L9 15 L15 3"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M5.5 8 L12.5 8"
            stroke="white"
            strokeWidth="1.6"
            strokeLinecap="round"
            opacity="0.6"
          />
        </svg>
      </div>
      <span className="text-[17px] font-bold tracking-tight text-black dark:text-white">
        Veloria
      </span>
    </a>
  );
}

// ─── Search Bar ───────────────────────────────────────────────────────────────
function SearchBar() {
  const [focused, setFocused] = useState(false);

  return (
    <motion.div
      className="relative hidden md:flex items-center"
      animate={{ width: focused ? 220 : 176 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <div
        className={`
          flex items-center gap-2 w-full px-3 py-1.5 rounded-lg cursor-text
          border transition-all duration-200
          bg-white dark:bg-black/20
          ${
            focused
              ? "border-violet-400/60 dark:border-violet-500/50 shadow-[0_0_0_3px_rgba(139,92,246,0.12)]"
              : "border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20"
          }
        `}
      >
        <Search
          size={13}
          className="text-black/40 dark:text-white/40 shrink-0"
        />
        <input
          type="text"
          placeholder="Search..."
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="
            w-full bg-transparent text-[13px] text-black dark:text-white
            placeholder:text-black/35 dark:placeholder:text-white/30
            outline-none caret-violet-500
          "
        />
        <div className="hidden lg:flex items-center gap-0.5 shrink-0">
          <kbd className="flex items-center gap-0.5 px-1 py-0.5 rounded text-[10px] font-medium text-black/40 dark:text-white/30 bg-black/5 dark:bg-white/8 border border-black/8 dark:border-white/10">
            <Command size={9} />K
          </kbd>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Dropdown ─────────────────────────────────────────────────────────────────
function ComponentsDropdown({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.97 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      className="
        absolute top-[calc(100%+10px)] left-1/2 -translate-x-1/2
        w-[520px] p-4 rounded-2xl
        bg-white dark:bg-[#0d0d0d]
        border border-black/8 dark:border-white/8
        shadow-[0_20px_60px_rgba(0,0,0,0.12)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.6)]
      "
    >
      {/* Gradient top bar */}
      <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-violet-400/50 to-transparent rounded-full" />

      <div className="grid grid-cols-3 gap-3">
        {componentSections.map((section) => (
          <div key={section.title}>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-black/30 dark:text-white/25 mb-2 px-1">
              {section.title}
            </p>
            <div className="flex flex-col gap-0.5">
              {section.items.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  className="
                    flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg
                    text-[13px] text-black/70 dark:text-white/65
                    hover:text-black dark:hover:text-white
                    hover:bg-black/4 dark:hover:bg-white/6
                    transition-all duration-150 group
                  "
                >
                  <span className="flex items-center gap-2">
                    <span className="text-black/35 dark:text-white/30 group-hover:text-violet-500 transition-colors duration-150">
                      {item.icon}
                    </span>
                    {item.label}
                  </span>
                  {item.badge && (
                    <span
                      className={`
                        text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full
                        ${item.badge === "New" ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400" : ""}
                        ${item.badge === "Hot" ? "bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400" : ""}
                      `}
                    >
                      {item.badge}
                    </span>
                  )}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-black/6 dark:border-white/6 flex items-center justify-between">
        <p className="text-[12px] text-black/40 dark:text-white/30">
          70+ components available
        </p>
        <a
          href="#"
          onClick={onClose}
          className="flex items-center gap-1 text-[12px] font-medium text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
        >
          Browse all <ArrowRight size={11} />
        </a>
      </div>
    </motion.div>
  );
}

function TemplatesDropdown({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.97 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      className="
        absolute top-[calc(100%+10px)] left-1/2 -translate-x-1/2
        w-[280px] p-3 rounded-2xl
        bg-white dark:bg-[#0d0d0d]
        border border-black/8 dark:border-white/8
        shadow-[0_20px_60px_rgba(0,0,0,0.12)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.6)]
      "
    >
      <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent rounded-full" />
      <div className="flex flex-col gap-0.5">
        {templateItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            onClick={onClose}
            className="
              flex items-center justify-between gap-2 px-2.5 py-2.5 rounded-lg
              text-[13px] text-black/70 dark:text-white/65
              hover:text-black dark:hover:text-white
              hover:bg-black/4 dark:hover:bg-white/6
              transition-all duration-150 group
            "
          >
            <span className="flex items-center gap-2.5">
              <span className="text-black/35 dark:text-white/30 group-hover:text-blue-500 transition-colors duration-150">
                {item.icon}
              </span>
              {item.label}
            </span>
            {item.badge && (
              <span
                className={`
                  text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full
                  ${item.badge === "Free" ? "bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400" : ""}
                  ${item.badge === "Pro" ? "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400" : ""}
                `}
              >
                {item.badge}
              </span>
            )}
          </a>
        ))}
      </div>
      <div className="mt-2 pt-2.5 border-t border-black/6 dark:border-white/6">
        <a
          href="#"
          onClick={onClose}
          className="flex items-center justify-center gap-1.5 py-1.5 text-[12px] font-medium text-black/50 dark:text-white/40 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
        >
          <ExternalLink size={11} /> View all templates
        </a>
      </div>
    </motion.div>
  );
}

function ThemeDropdown({
  theme,
  setTheme,
  onClose,
}: {
  theme: Theme;
  setTheme: (t: Theme) => void;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.97 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      className="
        absolute top-[calc(100%+10px)] right-0
        w-[160px] p-1.5 rounded-xl
        bg-white dark:bg-[#0d0d0d]
        border border-black/8 dark:border-white/8
        shadow-[0_16px_48px_rgba(0,0,0,0.12)] dark:shadow-[0_16px_48px_rgba(0,0,0,0.6)]
      "
    >
      {themeOptions.map((opt) => (
        <button
          key={opt.value}
          onClick={() => {
            setTheme(opt.value);
            onClose();
          }}
          className={`
            w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-all duration-150
            ${
              theme === opt.value
                ? "bg-gradient-to-r from-violet-50 to-blue-50 dark:from-violet-900/30 dark:to-blue-900/20 text-violet-700 dark:text-violet-300 font-medium"
                : "text-black/65 dark:text-white/55 hover:bg-black/4 dark:hover:bg-white/6 hover:text-black dark:hover:text-white"
            }
          `}
        >
          <span
            className={
              theme === opt.value
                ? "text-violet-500"
                : "text-black/35 dark:text-white/30"
            }
          >
            {opt.icon}
          </span>
          {opt.label}
          {theme === opt.value && (
            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-500" />
          )}
        </button>
      ))}
    </motion.div>
  );
}

// ─── Nav Item with Dropdown ────────────────────────────────────────────────────
type DropdownType = "components" | "templates" | "theme" | null;

function NavTab({
  label,
  icon,
  hasDropdown,
  isActive,
  onClick,
  href,
}: {
  label: string;
  icon?: React.ReactNode;
  hasDropdown?: boolean;
  isActive?: boolean;
  onClick?: () => void;
  href?: string;
}) {
  const base = `
    relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13.5px] font-medium
    transition-all duration-150 cursor-pointer select-none whitespace-nowrap
    ${
      isActive
        ? "text-black dark:text-white bg-black/5 dark:bg-white/8"
        : "text-black/60 dark:text-white/55 hover:text-black dark:hover:text-white hover:bg-black/4 dark:hover:bg-white/5"
    }
  `;
  const content = (
    <>
      {icon && (
        <span
          className={`transition-colors duration-150 ${isActive ? "text-violet-500" : "text-black/35 dark:text-white/30"}`}
        >
          {icon}
        </span>
      )}
      {label}
      {hasDropdown && (
        <ChevronDown
          size={12}
          className={`transition-transform duration-200 ${isActive ? "rotate-180 text-violet-500" : "text-black/30 dark:text-white/25"}`}
        />
      )}
      {isActive && (
        <motion.span
          layoutId="nav-indicator"
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-gradient-to-r from-violet-500 to-blue-500"
        />
      )}
    </>
  );

  if (href && !hasDropdown) {
    return (
      <a href={href} className={base}>
        {content}
      </a>
    );
  }
  return (
    <button onClick={onClick} className={base}>
      {content}
    </button>
  );
}

// ─── Main Navbar ──────────────────────────────────────────────────────────────
export default function Navbar() {
  const [activeDropdown, setActiveDropdown] = useState<DropdownType>(null);
  const [theme, setTheme] = useState<Theme>("system");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Click outside to close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveDropdown(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const toggle = (d: DropdownType) =>
    setActiveDropdown((prev) => (prev === d ? null : d));

  const ThemeIcon = theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;

  return (
    <>
      {/* Navbar */}
      <header
        ref={navRef}
        className={`
          fixed top-0 left-0 right-0 z-50 transition-all duration-300
          ${
            scrolled
              ? "bg-white/90 dark:bg-black/85 backdrop-blur-xl border-b border-black/6 dark:border-white/6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
              : "bg-white dark:bg-black border-b border-transparent"
          }
        `}
      >
        {/* Gradient background layer */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-50/30 via-transparent to-blue-50/30 dark:from-violet-950/20 dark:via-transparent dark:to-blue-950/20" />
          <SVGBackground />
        </div>

        <nav className="relative mx-auto max-w-7xl px-4 sm:px-6 h-14 flex items-center gap-4">
          {/* Logo */}
          <VeloriaLogo />

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 ml-4">
            <NavTab label="Docs" icon={<BookOpen size={13} />} href="/docs" />

            {/* Components */}
            <div className="relative">
              <NavTab
                label="Components"
                icon={<Layers size={13} />}
                hasDropdown
                isActive={activeDropdown === "components"}
                onClick={() => toggle("components")}
              />
              <AnimatePresence>
                {activeDropdown === "components" && (
                  <ComponentsDropdown onClose={() => setActiveDropdown(null)} />
                )}
              </AnimatePresence>
            </div>

            {/* Templates */}
            <div className="relative">
              <NavTab
                label="Templates"
                icon={<LayoutTemplate size={13} />}
                hasDropdown
                isActive={activeDropdown === "templates"}
                onClick={() => toggle("templates")}
              />
              <AnimatePresence>
                {activeDropdown === "templates" && (
                  <TemplatesDropdown onClose={() => setActiveDropdown(null)} />
                )}
              </AnimatePresence>
            </div>

            <NavTab
              label="Showcase"
              icon={<Sparkles size={13} />}
              href="/showcase"
            />
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 ml-auto">
            <SearchBar />

            {/* GitHub */}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center justify-center w-8 h-8 rounded-lg text-black/50 dark:text-white/45 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/8 transition-all duration-150"
              title="GitHub"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>

            {/* Theme toggle */}
            <div className="relative hidden md:block">
              <button
                onClick={() => toggle("theme")}
                className={`
                  flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium
                  transition-all duration-150 border
                  ${
                    activeDropdown === "theme"
                      ? "bg-black/5 dark:bg-white/8 border-black/10 dark:border-white/10 text-black dark:text-white"
                      : "text-black/55 dark:text-white/45 border-black/8 dark:border-white/8 hover:border-black/15 dark:hover:border-white/15 hover:text-black dark:hover:text-white hover:bg-black/3 dark:hover:bg-white/5"
                  }
                `}
              >
                <ThemeIcon size={13} />
                <ChevronDown
                  size={11}
                  className={`transition-transform duration-200 ${activeDropdown === "theme" ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence>
                {activeDropdown === "theme" && (
                  <ThemeDropdown
                    theme={theme}
                    setTheme={setTheme}
                    onClose={() => setActiveDropdown(null)}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* CTA */}
            <a
              href="/docs/getting-started"
              className="
                hidden sm:flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[13px] font-semibold text-white
                bg-gradient-to-r from-violet-600 via-violet-600 to-blue-600
                hover:from-violet-500 hover:via-violet-500 hover:to-blue-500
                shadow-[0_2px_12px_rgba(139,92,246,0.35)] hover:shadow-[0_4px_20px_rgba(139,92,246,0.5)]
                transition-all duration-200
              "
            >
              Get Started
              <ArrowRight size={12} />
            </a>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((p) => !p)}
              className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg text-black/60 dark:text-white/55 hover:bg-black/5 dark:hover:bg-white/8 transition-all duration-150"
            >
              <AnimatePresence mode="wait">
                {mobileOpen ? (
                  <motion.span
                    key="x"
                    initial={{ rotate: -45, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 45, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X size={18} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="m"
                    initial={{ rotate: 45, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -45, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu size={18} />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="
              fixed top-14 left-0 right-0 z-40 md:hidden
              bg-white dark:bg-black border-b border-black/8 dark:border-white/8
              shadow-[0_16px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.5)]
            "
          >
            <div className="absolute inset-0 bg-gradient-to-b from-violet-50/40 to-transparent dark:from-violet-950/20 pointer-events-none" />
            <div className="relative px-4 py-4 flex flex-col gap-0.5">
              {/* Search */}
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-black/8 dark:border-white/8 mb-2">
                <Search
                  size={13}
                  className="text-black/35 dark:text-white/30"
                />
                <input
                  placeholder="Search components..."
                  className="flex-1 bg-transparent text-[13px] text-black dark:text-white placeholder:text-black/35 dark:placeholder:text-white/30 outline-none"
                />
              </div>

              {[
                { label: "Docs", icon: <BookOpen size={14} /> },
                { label: "Components", icon: <Layers size={14} /> },
                { label: "Templates", icon: <LayoutTemplate size={14} /> },
                { label: "Showcase", icon: <Sparkles size={14} /> },
              ].map((item) => (
                <a
                  key={item.label}
                  href="#"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium text-black/70 dark:text-white/65 hover:text-black dark:hover:text-white hover:bg-black/4 dark:hover:bg-white/6 transition-all duration-150"
                >
                  <span className="text-black/35 dark:text-white/30">
                    {item.icon}
                  </span>
                  {item.label}
                </a>
              ))}

              <div className="mt-3 pt-3 border-t border-black/6 dark:border-white/6 flex flex-col gap-2">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-black/30 dark:text-white/25 px-3 mb-1">
                  Theme
                </p>
                <div className="flex gap-1.5 px-1">
                  {themeOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setTheme(opt.value)}
                      className={`
                        flex items-center gap-1.5 flex-1 justify-center px-3 py-2 rounded-lg text-[12px] font-medium border transition-all duration-150
                        ${
                          theme === opt.value
                            ? "bg-gradient-to-r from-violet-50 to-blue-50 dark:from-violet-900/30 dark:to-blue-900/20 border-violet-200 dark:border-violet-700/40 text-violet-700 dark:text-violet-300"
                            : "border-black/8 dark:border-white/8 text-black/55 dark:text-white/45"
                        }
                      `}
                    >
                      {opt.icon} {opt.label}
                    </button>
                  ))}
                </div>
                <a
                  href="/docs/getting-started"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 mx-2 mt-1 py-2.5 rounded-lg text-[14px] font-semibold text-white bg-gradient-to-r from-violet-600 to-blue-600 shadow-[0_4px_16px_rgba(139,92,246,0.35)]"
                >
                  Get Started <ArrowRight size={13} />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      <AnimatePresence>
        {activeDropdown && activeDropdown !== "theme" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40 bg-black/5 dark:bg-black/30 backdrop-blur-[1px]"
            onClick={() => setActiveDropdown(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
