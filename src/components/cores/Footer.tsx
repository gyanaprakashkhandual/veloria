"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Heart, Sparkles } from "lucide-react";

// ─── SVG Background (matching Navbar style) ───────────────────────────────────
function SVGBackground() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="footer-line-top" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(139,92,246,0)" />
          <stop offset="50%" stopColor="rgba(139,92,246,0.28)" />
          <stop offset="100%" stopColor="rgba(59,130,246,0)" />
        </linearGradient>
        <linearGradient id="footer-line-bottom" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(59,130,246,0)" />
          <stop offset="50%" stopColor="rgba(236,72,153,0.15)" />
          <stop offset="100%" stopColor="rgba(139,92,246,0)" />
        </linearGradient>
        <linearGradient id="footer-glow-left" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(139,92,246,0.07)" />
          <stop offset="100%" stopColor="rgba(139,92,246,0)" />
        </linearGradient>
        <linearGradient id="footer-glow-right" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(59,130,246,0.06)" />
          <stop offset="100%" stopColor="rgba(59,130,246,0)" />
        </linearGradient>
      </defs>
      {/* Top shimmer line */}
      <line x1="0" y1="1" x2="100%" y2="1" stroke="url(#footer-line-top)" strokeWidth="1" />
      {/* Bottom accent line */}
      <line x1="0" y1="99.5%" x2="100%" y2="99.5%" stroke="url(#footer-line-bottom)" strokeWidth="1" />
      {/* Corner glows */}
      <rect x="0" y="0" width="35%" height="100%" fill="url(#footer-glow-left)" />
      <rect x="65%" y="0" width="35%" height="100%" fill="url(#footer-glow-right)" />
      {/* Subtle grid dots */}
      <pattern id="dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
        <circle cx="1" cy="1" r="0.8" fill="rgba(139,92,246,0.08)" />
      </pattern>
      <rect width="100%" height="100%" fill="url(#dots)" />
    </svg>
  );
}

// ─── Logo (matching Navbar) ────────────────────────────────────────────────────
function VeloriaLogo() {
  return (
    <div className="flex items-center gap-2.5 select-none">
      <div className="relative w-8 h-8 flex items-center justify-center">
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500 opacity-90" />
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500 blur-md opacity-40" />
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="relative z-10">
          <path d="M3 3 L9 15 L15 3" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M5.5 8 L12.5 8" stroke="white" strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />
        </svg>
      </div>
      <span className="text-[17px] font-bold tracking-tight text-black dark:text-white">Veloria</span>
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const socials = [
  {
    name: "YouTube",
    url: "https://youtube.com/@GyanaprakashKhandual",
    color: "hover:text-red-500 hover:border-red-500/30 hover:bg-red-500/8",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/gyanaprakashkhandual",
    color: "hover:text-blue-500 hover:border-blue-500/30 hover:bg-blue-500/8",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    url: "https://instagram.com/GyanaprakashKhandual",
    color: "hover:text-pink-500 hover:border-pink-500/30 hover:bg-pink-500/8",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    url: "https://facebook.com/GyanaprakashKhandual",
    color: "hover:text-blue-600 hover:border-blue-600/30 hover:bg-blue-600/8",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    name: "GitHub",
    url: "https://github.com/GyanaprakashKhandual",
    color: "hover:text-black dark:hover:text-white hover:border-black/30 dark:hover:border-white/30 hover:bg-black/8 dark:hover:bg-white/8",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
];

const navLinks = [
  { label: "About", href: "https://gyanprakash.vercel.app/about" },
  { label: "Projects", href: "https://gyanprakash.vercel.app/projects" },
  { label: "Skills", href: "https://gyanprakash.vercel.app/skills" },
  { label: "Contact", href: "https://gyanprakash.vercel.app/contact" },
];

const projects = [
  { label: "Caffetest", href: "#" },
  { label: "Fetch", href: "#" },
  { label: "Selenium Ext.", href: "#" },
  { label: "Caffetest Ext.", href: "#" },
];

const connectLinks = [
  { label: "GitHub", href: "https://github.com/GyanaprakashKhandual" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/gyana-prakash-khandual-79b205332/" },
  { label: "Email", href: "https://gyanprakash.vercel.app/contact" },
  { label: "Marketplace", href: "https://marketplace.visualstudio.com/manage/publishers/gyanaprakashkhandual" },
];

// Veloria-specific links
const docsLinks = [
  { label: "Getting Started", href: "#" },
  { label: "Components", href: "#" },
  { label: "Templates", href: "#" },
  { label: "Changelog", href: "#" },
];

const resourceLinks = [
  { label: "Showcase", href: "#" },
  { label: "Figma Kit", href: "#" },
  { label: "GitHub Repo", href: "#" },
  { label: "Releases", href: "#" },
];

// ─── Reusable link column ─────────────────────────────────────────────────────
function LinkColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h4 className="text-[10px] font-bold uppercase tracking-[0.18em] text-black/30 dark:text-white/30 mb-5">
        {title}
      </h4>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 text-[13px] text-black/55 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors duration-150 font-medium"
            >
              {link.label}
              <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 translate-x-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-150" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Stats ────────────────────────────────────────────────────────────────────
const stats = [
  { value: "70+", label: "Components" },
  { value: "12+", label: "Templates" },
  { value: "MIT", label: "License" },
  { value: "v1.0", label: "Stable" },
];

// ─── Footer ───────────────────────────────────────────────────────────────────
export default function Footer() {
  return (
    <footer className="relative bg-white dark:bg-black border-t border-black/6 dark:border-white/6 overflow-hidden">
      {/* Gradient layer matching Navbar */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50/40 via-transparent to-blue-50/30 dark:from-violet-950/20 dark:via-transparent dark:to-blue-950/15" />
        <SVGBackground />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Top CTA Banner ── */}
        <div className="py-14 border-b border-black/6 dark:border-white/6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-gradient-to-r from-violet-100 to-blue-100 dark:from-violet-900/40 dark:to-blue-900/30 text-violet-700 dark:text-violet-300 border border-violet-200/60 dark:border-violet-700/30">
                  <Sparkles size={10} /> Open Source
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-black dark:text-white tracking-tight">
                Start building with{" "}
                <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Veloria
                </span>
              </h2>
              <p className="text-[13px] text-black/45 dark:text-white/40 max-w-md leading-relaxed">
                Beautiful, accessible, and composable UI components for React. Free and open source, forever.
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 sm:gap-8">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.4, ease: "easeOut" }}
                  className="text-center"
                >
                  <p className="text-xl font-black bg-gradient-to-br from-violet-600 to-blue-600 bg-clip-text text-transparent">
                    {s.value}
                  </p>
                  <p className="text-[11px] font-medium text-black/35 dark:text-white/30 mt-0.5">{s.label}</p>
                </motion.div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex items-center gap-3 shrink-0">
              <a
                href="#"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-semibold text-white bg-gradient-to-r from-violet-600 via-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 shadow-[0_2px_12px_rgba(139,92,246,0.35)] hover:shadow-[0_4px_20px_rgba(139,92,246,0.5)] transition-all duration-200"
              >
                Get Started <ArrowUpRight size={13} />
              </a>
              <a
                href="https://github.com/GyanaprakashKhandual"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-semibold text-black/70 dark:text-white/65 border border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 hover:text-black dark:hover:text-white hover:bg-black/3 dark:hover:bg-white/5 transition-all duration-200"
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                GitHub
              </a>
            </div>
          </div>
        </div>

        {/* ── Main Link Grid ── */}
        <div className="py-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-12 border-b border-black/6 dark:border-white/6">

          {/* Brand col */}
          <div className="sm:col-span-2 lg:col-span-4 space-y-6">
            <VeloriaLogo />
            <p className="text-[13px] text-black/45 dark:text-white/40 leading-relaxed max-w-xs">
              A modern open-source UI library built for React. Craft stunning interfaces with composable, accessible components.
            </p>

            {/* Creator credit */}
            <div className="p-4 rounded-xl border border-black/6 dark:border-white/6 bg-black/2 dark:bg-white/3 space-y-1.5">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-black/30 dark:text-white/25">
                Created by
              </p>
              <p className="text-[13px] font-bold text-black dark:text-white">
                Gyana Prakash Khandual
              </p>
              <p className="text-[11px] text-black/40 dark:text-white/35">
                Full-Stack Developer · QA Engineer · Ethical Hacker
              </p>
            </div>

            {/* Socials */}
            <div className="flex flex-wrap gap-2">
              {socials.map((s) => (
                <motion.a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.name}
                  whileTap={{ scale: 0.9 }}
                  className={`
                    group relative flex items-center justify-center w-9 h-9 rounded-xl
                    bg-black/4 dark:bg-white/4 border border-black/8 dark:border-white/8
                    text-black/40 dark:text-white/35
                    ${s.color}
                    transition-all duration-200 shadow-sm hover:shadow-md
                  `}
                >
                  {s.icon}
                  <span className="absolute -top-9 left-1/2 -translate-x-1/2 px-2 py-1 text-[10px] font-semibold tracking-wide bg-black dark:bg-white text-white dark:text-black rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap shadow-lg">
                    {s.name}
                  </span>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Spacer */}
          <div className="hidden lg:block lg:col-span-1" />

          {/* Link columns */}
          <div className="lg:col-span-2">
            <LinkColumn title="Docs" links={docsLinks} />
          </div>
          <div className="lg:col-span-2">
            <LinkColumn title="Resources" links={resourceLinks} />
          </div>
          <div className="lg:col-span-1">
            <LinkColumn title="Navigate" links={navLinks} />
          </div>
          <div className="lg:col-span-2">
            <LinkColumn title="Connect" links={connectLinks} />
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-black/35 dark:text-white/30">
            © 2026 Veloria UI · Gyana Prakash Khandual. All rights reserved.
          </p>

          <div className="flex items-center gap-1.5 text-[12px] text-black/35 dark:text-white/30">
            <span>Built with</span>
            <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
            <span>and lots of love for</span>
            <span className="bg-gradient-to-r from-violet-500 to-blue-500 bg-clip-text text-transparent font-semibold">open source</span>
          </div>

          <div className="flex gap-5 text-[12px] text-black/35 dark:text-white/30">
            <a href="/privacy-policy" className="hover:text-black dark:hover:text-white transition-colors duration-150">
              Privacy
            </a>
            <a href="/terms-and-conditions" className="hover:text-black dark:hover:text-white transition-colors duration-150">
              Terms
            </a>
            <a href="#" className="hover:text-black dark:hover:text-white transition-colors duration-150">
              MIT License
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}