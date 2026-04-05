"use client";

import React, { useState } from "react";
import {
  Home,
  LayoutDashboard,
  Settings,
  Users,
  FileText,
  Bell,
  BarChart2,
  ShoppingBag,
  Code2,
  Layers,
  HelpCircle,
  LogOut,
  User,
  Zap,
  Globe,
  Lock,
  CreditCard,
  Mail,
} from "lucide-react";
import { Navbar } from "../../../ui/navigations/navbar/Navbar.ui";
import type { NavItem, NavbarTheme } from "../../../ui/navigations/navbar/Navbar.ui";

// ─── Reusable layout helpers ──────────────────────────────────────────────────

function PageSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-16">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-[11px] font-semibold tracking-widest uppercase text-gray-400 dark:text-gray-500 whitespace-nowrap">
          {title}
        </h2>
        <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
      </div>
      {children}
    </section>
  );
}

function DemoFrame({
  label,
  badge,
  children,
  noPad = false,
}: {
  label: string;
  badge?: string;
  children: React.ReactNode;
  noPad?: boolean;
}) {
  return (
    <div className="flex flex-col gap-0 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden bg-gray-50 dark:bg-gray-950">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
        <span className="text-xs font-medium text-gray-400 dark:text-gray-500">{label}</span>
        {badge && (
          <span className="text-[10px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </div>
      <div className={noPad ? "" : "p-0"}>
        {children}
      </div>
    </div>
  );
}

function EventLog({ events }: { events: string[] }) {
  if (!events.length) return null;
  return (
    <div className="mt-2 mx-4 mb-3 flex flex-col gap-1">
      {events.slice(-3).map((e, i) => (
        <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
          <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">{e}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Nav item sets ────────────────────────────────────────────────────────────

const simpleItems: NavItem[] = [
  { id: "home", label: "Home", icon: <Home size={14} /> },
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={14} /> },
  { id: "analytics", label: "Analytics", icon: <BarChart2 size={14} /> },
  { id: "settings", label: "Settings", icon: <Settings size={14} /> },
];

const badgeItems: NavItem[] = [
  { id: "home", label: "Home", icon: <Home size={14} /> },
  { id: "inbox", label: "Inbox", icon: <Mail size={14} />, badge: 4 },
  { id: "notifications", label: "Alerts", icon: <Bell size={14} />, badge: "12" },
  { id: "team", label: "Team", icon: <Users size={14} /> },
];

const dropdownItems: NavItem[] = [
  { id: "home", label: "Home" },
  {
    id: "products",
    label: "Products",
    children: [
      { id: "prod-design", label: "Design System", icon: <Layers size={13} /> },
      { id: "prod-api", label: "API Platform", icon: <Code2 size={13} />, badge: "New" },
      { id: "prod-analytics", label: "Analytics", icon: <BarChart2 size={13} /> },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    children: [
      { id: "set-profile", label: "Profile", icon: <User size={13} /> },
      { id: "set-billing", label: "Billing", icon: <CreditCard size={13} /> },
      { id: "set-security", label: "Security", icon: <Lock size={13} /> },
      { id: "set-logout", label: "Sign out", icon: <LogOut size={13} />, disabled: false },
    ],
  },
  { id: "docs", label: "Docs", icon: <FileText size={14} /> },
];

const mixedItems: NavItem[] = [
  { id: "home", label: "Home", icon: <Home size={14} /> },
  { id: "shop", label: "Shop", icon: <ShoppingBag size={14} /> },
  {
    id: "resources",
    label: "Resources",
    children: [
      { id: "res-docs", label: "Documentation", icon: <FileText size={13} /> },
      { id: "res-api", label: "API Reference", icon: <Code2 size={13} /> },
      { id: "res-help", label: "Help Center", icon: <HelpCircle size={13} /> },
    ],
  },
  { id: "pricing", label: "Pricing", icon: <Zap size={14} /> },
  { id: "about", label: "About", icon: <Globe size={14} />, disabled: true },
];

// ─── Logo components ──────────────────────────────────────────────────────────

function LogoMark({ color = "#6366f1" }: { color?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill={color} />
      <path d="M7 12l3.5 3.5L17 8" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AvatarBtn() {
  return (
    <button
      type="button"
      className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white text-xs font-semibold shrink-0 hover:opacity-90 transition-opacity"
    >
      JD
    </button>
  );
}

function NotificationBtn() {
  return (
    <div className="relative">
      <button
        type="button"
        className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
      >
        <Bell size={16} />
      </button>
      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 border-2 border-white dark:border-gray-900" />
    </div>
  );
}

function UpgradeBadge() {
  return (
    <button
      type="button"
      className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold rounded-lg transition-colors"
    >
      <Zap size={11} />
      Upgrade
    </button>
  );
}

// ─── Showcase page ────────────────────────────────────────────────────────────

export default function NavbarShowcase() {
  const [tabEvents, setTabEvents] = useState<string[]>([]);
  const [themeEvents, setThemeEvents] = useState<string[]>([]);
  const [searchEvents, setSearchEvents] = useState<string[]>([]);

  const logTab = (id: string) =>
    setTabEvents((prev) => [...prev, `onTabChange → "${id}"`]);

  const logTheme = (theme: NavbarTheme) =>
    setThemeEvents((prev) => [...prev, `onThemeChange → "${theme}"`]);

  const logSearch = (val: string) =>
    setSearchEvents((prev) => (val ? [...prev, `onSearch → "${val}"`] : prev));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

      {/* ── Page header (static, not a demo) ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 pt-12 pb-10">
        <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 dark:text-gray-500 mb-2">
          Component showcase
        </p>
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-3">
          Navbar
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-lg leading-relaxed">
          All variants, sizes, positions, dropdown menus, badges, slots, and
          real-world usage patterns for the{" "}
          <code className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
            Navbar
          </code>{" "}
          component.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-8 pb-20">

        {/* ── 1. Variants ── */}
        <PageSection title="Variants">
          <div className="flex flex-col gap-4">
            <DemoFrame label='variant="default"'>
              <Navbar
                logoText="Acme"
                logo={<LogoMark />}
                items={simpleItems}
                variant="default"
                position="static"
                showThemeToggle={false}
                defaultActiveTab="home"
              />
            </DemoFrame>

            <DemoFrame label='variant="filled"'>
              <Navbar
                logoText="Acme"
                logo={<LogoMark color="#10b981" />}
                items={simpleItems}
                variant="filled"
                position="static"
                showThemeToggle={false}
                defaultActiveTab="dashboard"
              />
            </DemoFrame>

            <DemoFrame label='variant="ghost"'>
              <Navbar
                logoText="Acme"
                logo={<LogoMark color="#f59e0b" />}
                items={simpleItems}
                variant="ghost"
                position="static"
                showThemeToggle={false}
                defaultActiveTab="analytics"
              />
            </DemoFrame>

            <DemoFrame label='variant="glass" — backdrop blur'>
              <div className="relative overflow-hidden">
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
                  }}
                />
                <div className="relative">
                  <Navbar
                    logoText="Acme"
                    logo={<LogoMark color="#fff" />}
                    items={simpleItems}
                    variant="glass"
                    position="static"
                    showThemeToggle={false}
                    defaultActiveTab="settings"
                  />
                </div>
              </div>
            </DemoFrame>
          </div>
        </PageSection>

        {/* ── 2. Sizes ── */}
        <PageSection title="Sizes">
          <div className="flex flex-col gap-4">
            {(["sm", "md", "lg"] as const).map((sz) => (
              <DemoFrame key={sz} label={`size="${sz}"`}>
                <Navbar
                  logoText="Acme"
                  logo={<LogoMark />}
                  items={simpleItems}
                  size={sz}
                  variant="default"
                  position="static"
                  showThemeToggle={false}
                  defaultActiveTab="home"
                />
              </DemoFrame>
            ))}
          </div>
        </PageSection>

        {/* ── 3. With badges ── */}
        <PageSection title="With badges">
          <div className="flex flex-col gap-4">
            <DemoFrame label="Numeric & string badges on nav items">
              <Navbar
                logoText="Inbox"
                logo={<LogoMark color="#ef4444" />}
                items={badgeItems}
                variant="default"
                position="static"
                showThemeToggle={false}
                defaultActiveTab="home"
              />
            </DemoFrame>
          </div>
        </PageSection>

        {/* ── 4. Dropdown menus ── */}
        <PageSection title="Dropdown menus">
          <div className="flex flex-col gap-4">
            <DemoFrame label="items with children → renders dropdown" badge="nested">
              <Navbar
                logoText="Platform"
                logo={<LogoMark color="#8b5cf6" />}
                items={dropdownItems}
                variant="default"
                position="static"
                showThemeToggle={false}
                defaultActiveTab="home"
              />
            </DemoFrame>

            <DemoFrame label="Dropdown with disabled item + badge in children">
              <Navbar
                logoText="Studio"
                logo={<LogoMark color="#06b6d4" />}
                items={mixedItems}
                variant="filled"
                position="static"
                showThemeToggle={false}
                defaultActiveTab="home"
              />
            </DemoFrame>
          </div>
        </PageSection>

        {/* ── 5. Search ── */}
        <PageSection title="Search">
          <div className="flex flex-col gap-4">
            <DemoFrame label="showSearch={true} — click the search icon to expand" badge="animated">
              <Navbar
                logoText="Search demo"
                logo={<LogoMark color="#f97316" />}
                items={simpleItems}
                variant="default"
                position="static"
                showSearch={true}
                showThemeToggle={false}
                defaultActiveTab="home"
                onSearch={logSearch}
              />
            </DemoFrame>

            <DemoFrame label="showSearch={false}">
              <Navbar
                logoText="No search"
                logo={<LogoMark color="#64748b" />}
                items={simpleItems}
                variant="default"
                position="static"
                showSearch={false}
                showThemeToggle={false}
                defaultActiveTab="home"
              />
            </DemoFrame>
            <EventLog events={searchEvents} />
          </div>
        </PageSection>

        {/* ── 6. Theme toggle ── */}
        <PageSection title="Theme toggle">
          <div className="flex flex-col gap-4">
            <DemoFrame label="showThemeToggle={true} — click sun/moon/monitor icon" badge="dropdown">
              <Navbar
                logoText="Themed"
                logo={<LogoMark />}
                items={simpleItems}
                variant="default"
                position="static"
                showSearch={false}
                showThemeToggle={true}
                defaultActiveTab="home"
                defaultTheme="system"
                onThemeChange={logTheme}
              />
            </DemoFrame>
            <EventLog events={themeEvents} />
          </div>
        </PageSection>

        {/* ── 7. Custom slots ── */}
        <PageSection title="Custom slots">
          <div className="flex flex-col gap-4">
            <DemoFrame label="endContent — avatar + notification bell">
              <Navbar
                logoText="Acme"
                logo={<LogoMark />}
                items={simpleItems}
                variant="default"
                position="static"
                showSearch={false}
                showThemeToggle={false}
                defaultActiveTab="home"
                endContent={
                  <div className="flex items-center gap-2">
                    <NotificationBtn />
                    <AvatarBtn />
                  </div>
                }
              />
            </DemoFrame>

            <DemoFrame label="endContent — upgrade CTA button">
              <Navbar
                logoText="Pro App"
                logo={<LogoMark color="#7c3aed" />}
                items={simpleItems}
                variant="default"
                position="static"
                showSearch={false}
                showThemeToggle={true}
                defaultActiveTab="home"
                endContent={<UpgradeBadge />}
              />
            </DemoFrame>

            <DemoFrame label="startContent — version badge next to logo">
              <Navbar
                logoText="Design System"
                logo={<LogoMark color="#0ea5e9" />}
                items={simpleItems}
                variant="default"
                position="static"
                showSearch={false}
                showThemeToggle={false}
                defaultActiveTab="home"
                startContent={
                  <span className="text-[10px] font-semibold bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-300 px-2 py-0.5 rounded-full">
                    v2.0
                  </span>
                }
              />
            </DemoFrame>

            <DemoFrame label="centerContent — custom search bar centered">
              <Navbar
                logo={<LogoMark />}
                logoText="Center"
                variant="default"
                position="static"
                showSearch={false}
                showThemeToggle={false}
                items={[]}
                centerContent={
                  <div className="flex items-center gap-2 h-8 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 w-64">
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-gray-400 shrink-0">
                      <circle cx="6.5" cy="6.5" r="5" /><path d="M11 11l3 3" strokeLinecap="round" />
                    </svg>
                    <span className="text-sm text-gray-400 dark:text-gray-500">Search anything…</span>
                  </div>
                }
                endContent={<AvatarBtn />}
              />
            </DemoFrame>
          </div>
        </PageSection>

        {/* ── 8. Disabled items ── */}
        <PageSection title="Disabled items">
          <div className="flex flex-col gap-4">
            <DemoFrame label="disabled prop on a nav item — muted + non-interactive">
              <Navbar
                logoText="Acme"
                logo={<LogoMark color="#94a3b8" />}
                items={mixedItems}
                variant="default"
                position="static"
                showSearch={false}
                showThemeToggle={false}
                defaultActiveTab="home"
              />
            </DemoFrame>
          </div>
        </PageSection>

        {/* ── 9. Logo only / no items ── */}
        <PageSection title="Minimal configurations">
          <div className="flex flex-col gap-4">
            <DemoFrame label="Logo only — no nav items">
              <Navbar
                logoText="Minimal"
                logo={<LogoMark color="#64748b" />}
                items={[]}
                variant="default"
                position="static"
                showSearch={false}
                showThemeToggle={false}
              />
            </DemoFrame>

            <DemoFrame label="No logo — items only">
              <Navbar
                items={simpleItems}
                variant="default"
                position="static"
                showSearch={false}
                showThemeToggle={false}
                defaultActiveTab="home"
              />
            </DemoFrame>

            <DemoFrame label="Actions only — no logo, no items">
              <Navbar
                items={[]}
                variant="default"
                position="static"
                showSearch={true}
                showThemeToggle={true}
                endContent={<AvatarBtn />}
              />
            </DemoFrame>
          </div>
        </PageSection>

        {/* ── 10. Interactive / callbacks ── */}
        <PageSection title="Interactive & callbacks">
          <div className="flex flex-col gap-4">
            <DemoFrame label="onTabChange + onThemeChange + onSearch — all wired up" badge="stateful">
              <Navbar
                logoText="Events"
                logo={<LogoMark color="#10b981" />}
                items={dropdownItems}
                variant="default"
                position="static"
                showSearch={true}
                showThemeToggle={true}
                defaultActiveTab="home"
                onTabChange={logTab}
                onThemeChange={logTheme}
                onSearch={logSearch}
                endContent={<AvatarBtn />}
              />
            </DemoFrame>
            <EventLog events={[...tabEvents, ...themeEvents, ...searchEvents].slice(-4)} />
          </div>
        </PageSection>

        {/* ── 11. Real-world presets ── */}
        <PageSection title="Real-world presets">
          <div className="flex flex-col gap-4">

            <DemoFrame label="SaaS app — filled + badges + avatar + upgrade CTA">
              <Navbar
                logoText="Notion"
                logo={<LogoMark color="#000" />}
                items={badgeItems}
                variant="filled"
                size="md"
                position="static"
                showSearch={true}
                showThemeToggle={true}
                defaultActiveTab="home"
                endContent={
                  <div className="flex items-center gap-2">
                    <UpgradeBadge />
                    <AvatarBtn />
                  </div>
                }
              />
            </DemoFrame>

            <DemoFrame label="Marketing site — ghost over hero image">
              <div className="relative overflow-hidden rounded-b-xl">
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)",
                  }}
                />
                <div className="relative">
                  <Navbar
                    logoText="Launch"
                    logo={<LogoMark color="#a78bfa" />}
                    items={[
                      { id: "features", label: "Features" },
                      { id: "pricing", label: "Pricing" },
                      { id: "docs", label: "Docs" },
                      { id: "blog", label: "Blog" },
                    ]}
                    variant="ghost"
                    position="static"
                    showSearch={false}
                    showThemeToggle={false}
                    defaultActiveTab="features"
                    endContent={
                      <button
                        type="button"
                        className="px-3 py-1.5 text-xs font-semibold text-white border border-white/30 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        Get started
                      </button>
                    }
                  />
                  <div className="h-24 flex items-center justify-center">
                    <p className="text-white/30 text-sm">Hero content area</p>
                  </div>
                </div>
              </div>
            </DemoFrame>

            <DemoFrame label="Admin dashboard — lg size + dropdown menus + all actions">
              <Navbar
                logoText="Admin"
                logo={<LogoMark color="#7c3aed" />}
                items={dropdownItems}
                variant="default"
                size="lg"
                position="static"
                showSearch={true}
                showThemeToggle={true}
                defaultActiveTab="home"
                endContent={
                  <div className="flex items-center gap-2">
                    <NotificationBtn />
                    <AvatarBtn />
                  </div>
                }
              />
            </DemoFrame>

            <DemoFrame label="E-commerce storefront — sm + glass + cart badge">
              <div className="relative overflow-hidden">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-rose-100 to-pink-100 dark:from-rose-950 dark:to-pink-950"
                />
                <div className="relative">
                  <Navbar
                    logoText="Boutique"
                    logo={<LogoMark color="#e11d48" />}
                    items={[
                      { id: "new", label: "New Arrivals" },
                      { id: "women", label: "Women" },
                      { id: "men", label: "Men" },
                      { id: "sale", label: "Sale", badge: "20%" },
                    ]}
                    variant="glass"
                    size="sm"
                    position="static"
                    showSearch={true}
                    showThemeToggle={false}
                    defaultActiveTab="new"
                    endContent={
                      <div className="relative">
                        <button
                          type="button"
                          className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          <ShoppingBag size={15} />
                        </button>
                        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">3</span>
                      </div>
                    }
                  />
                </div>
              </div>
            </DemoFrame>

          </div>
        </PageSection>

      </div>
    </div>
  );
}