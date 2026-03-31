/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Settings,
  User,
  Trash2,
  Edit3,
  Copy,
  Download,
  Share2,
  Star,
  Heart,
  Bookmark,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Filter,
  Search,
  Plus,
  X,
  ChevronDown,
  MoreHorizontal,
  Info,
  AlertTriangle,
  CheckCircle,
  Lock,
  Eye,
  EyeOff,
  Send,
  Paperclip,
  Smile,
  Link,
  ExternalLink,
  Mail,
  Phone,
  Globe,
  Map,
  Calendar,
  Clock,
  Tag,
  Flag,
  Archive,
  RefreshCw,
  Home,
  BarChart2,
  MessageCircle,
  HelpCircle,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { Tooltip } from "../../ui/tooltip/Tooltip.ui";

// ─── Section wrapper ────────────────────────────────────────────────────────
const Section = ({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) => (
  <section className="mb-14">
    <div className="mb-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
    </div>
    {children}
  </section>
);

// ─── Card wrapper ────────────────────────────────────────────────────────────
const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 ${className}`}
  >
    {children}
  </div>
);

// ─── Icon button helper ──────────────────────────────────────────────────────
const IconBtn = ({
  icon: Icon,
  label,
  variant = "ghost",
  danger = false,
}: {
  icon: React.ElementType;
  label: string;
  variant?: "ghost" | "filled" | "outline";
  danger?: boolean;
}) => {
  const base =
    "relative inline-flex items-center justify-center w-9 h-9 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900";
  const styles = {
    ghost: danger
      ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
      : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700",
    filled: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
    outline:
      "border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700",
  };
  return (
    <Tooltip content={label}>
      <button className={`${base} ${styles[variant]}`} aria-label={label}>
        <Icon size={16} />
      </button>
    </Tooltip>
  );
};

// ─── Main export ─────────────────────────────────────────────────────────────
export function TooltipTestPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [starred, setStarred] = useState(false);

  // Simulated table data
  const tableRows = [
    {
      id: 1,
      name: "Aria Nakamura",
      role: "Designer",
      status: "active",
      score: 94,
    },
    {
      id: 2,
      name: "Luis Ferreira",
      role: "Engineer",
      status: "away",
      score: 78,
    },
    { id: 3, name: "Priya Mehta", role: "PM", status: "busy", score: 86 },
    { id: 4, name: "James Okoye", role: "QA", status: "offline", score: 61 },
  ];

  const statusColors: Record<string, string> = {
    active:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    away: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    busy: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    offline: "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400",
  };

  const statusTooltips: Record<string, string> = {
    active: "Online and available",
    away: "Away — may be slow to respond",
    busy: "Do not disturb",
    offline: "Not currently online",
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        {/* ── Top nav ─────────────────────────────────────────────────────── */}
        <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900 dark:text-white text-sm tracking-tight">
                Tooltip
              </span>
              <span className="text-gray-300 dark:text-gray-600">/</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Test Suite
              </span>
            </div>

            {/* Nav icon group with tooltips */}
            <div className="flex items-center gap-1">
              <Tooltip content="Search" position="bottom">
                <button className="w-9 h-9 inline-flex items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <Search size={16} />
                </button>
              </Tooltip>
              <Tooltip content="Notifications" position="bottom">
                <button className="relative w-9 h-9 inline-flex items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <Bell size={16} />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800" />
                </button>
              </Tooltip>
              <Tooltip content="Settings" position="bottom">
                <button className="w-9 h-9 inline-flex items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <Settings size={16} />
                </button>
              </Tooltip>
              {/* Dark mode toggle */}
              <Tooltip
                content={
                  darkMode ? "Switch to light mode" : "Switch to dark mode"
                }
              >
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="ml-2 w-9 h-9 inline-flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-xs font-bold"
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? "☀" : "☾"}
                </button>
              </Tooltip>
            </div>
          </div>
        </header>

        {/* ── Page body ───────────────────────────────────────────────────── */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          {/* Page title */}
          <div className="mb-10">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Tooltip Edge Cases
            </h1>
            <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm max-w-xl">
              Every realistic usage pattern — buttons, tables, forms, icons, nav
              bars, cards, and more — stress-tested across positions and
              viewports.
            </p>
          </div>

          {/* ── 1. All positions ──────────────────────────────────────────── */}
          <Section
            title="1. All Positions"
            description="Twelve placement variants. Tooltip auto-flips when near viewport edges."
          >
            <Card>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {(
                  [
                    "top",
                    "bottom",
                    "left",
                    "right",
                    "top-left",
                    "top-right",
                    "bottom-left",
                    "bottom-right",
                    "left-top",
                    "left-bottom",
                    "right-top",
                    "right-bottom",
                  ] as const
                ).map((pos) => (
                  <Tooltip
                    key={pos}
                    content={`Position: ${pos}`}
                    position={pos as any}
                  >
                    <button className="w-full py-2 px-3 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                      {pos}
                    </button>
                  </Tooltip>
                ))}
              </div>
            </Card>
          </Section>

          {/* ── 2. Button variants ────────────────────────────────────────── */}
          <Section
            title="2. Button Variants"
            description="Primary, secondary, danger, ghost, and disabled buttons — common in every dashboard."
          >
            <Card>
              <div className="flex flex-wrap gap-3 items-center">
                <Tooltip content="Save your progress" position="top">
                  <button className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800">
                    Save
                  </button>
                </Tooltip>

                <Tooltip content="Discard all unsaved changes" position="top">
                  <button className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600">
                    Cancel
                  </button>
                </Tooltip>

                <Tooltip
                  content="Permanently delete this item — cannot be undone"
                  position="top"
                >
                  <button className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800">
                    Delete
                  </button>
                </Tooltip>

                {/* Disabled button — tooltip still works */}
                <Tooltip
                  content="You need edit permission to do this"
                  position="top"
                >
                  <span className="inline-block">
                    <button
                      disabled
                      className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 text-sm font-medium cursor-not-allowed"
                    >
                      Publish
                    </button>
                  </span>
                </Tooltip>

                <Tooltip content="Download as CSV" position="top">
                  <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <Download size={14} />
                    Export
                  </button>
                </Tooltip>

                <Tooltip content="Share via link" position="top">
                  <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium shadow-sm transition-colors">
                    <Share2 size={14} />
                    Share
                  </button>
                </Tooltip>
              </div>
            </Card>
          </Section>

          {/* ── 3. Icon-only toolbar ──────────────────────────────────────── */}
          <Section
            title="3. Icon Toolbar"
            description="Pure icon buttons — tooltip is the only label. Critical for accessibility."
          >
            <Card>
              <div className="flex flex-wrap gap-2 items-center">
                <IconBtn icon={Edit3} label="Edit" />
                <IconBtn icon={Copy} label="Copy to clipboard" />
                <IconBtn icon={Download} label="Download file" />
                <IconBtn icon={Share2} label="Share" />
                <IconBtn icon={Bookmark} label="Save to bookmarks" />
                <IconBtn icon={Star} label="Add to favourites" />
                <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />
                <IconBtn icon={ZoomIn} label="Zoom in" variant="outline" />
                <IconBtn icon={ZoomOut} label="Zoom out" variant="outline" />
                <IconBtn
                  icon={RotateCcw}
                  label="Reset zoom"
                  variant="outline"
                />
                <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />
                <IconBtn icon={Trash2} label="Delete permanently" danger />
                <IconBtn icon={Archive} label="Move to archive" danger />
              </div>
            </Card>
          </Section>

          {/* ── 4. Data table with row actions ───────────────────────────── */}
          <Section
            title="4. Data Table"
            description="Status badges, inline row actions, and column header tooltips."
          >
            <Card className="p-0 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">
                        <Tooltip content="Team member full name" position="top">
                          <span className="cursor-default inline-flex items-center gap-1">
                            Name
                            <Info size={12} className="text-gray-400" />
                          </span>
                        </Tooltip>
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">
                        Role
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">
                        <Tooltip
                          content="Current presence status"
                          position="top"
                        >
                          <span className="cursor-default inline-flex items-center gap-1">
                            Status
                            <Info size={12} className="text-gray-400" />
                          </span>
                        </Tooltip>
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">
                        <Tooltip
                          content="Performance score out of 100 — averaged over last 30 days"
                          position="top"
                          maxWidth={220}
                        >
                          <span className="cursor-default inline-flex items-center gap-1">
                            Score
                            <Info size={12} className="text-gray-400" />
                          </span>
                        </Tooltip>
                      </th>
                      <th className="text-right px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {tableRows.map((row) => (
                      <tr
                        key={row.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors"
                      >
                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                          <div className="flex items-center gap-2">
                            {/* Avatar with tooltip */}
                            <Tooltip
                              content={`View ${row.name}'s profile`}
                              position="right"
                            >
                              <div className="w-7 h-7 rounded-full bg-linear-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold cursor-pointer shrink-0">
                                {row.name[0]}
                              </div>
                            </Tooltip>
                            {row.name}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                          {row.role}
                        </td>
                        <td className="px-4 py-3">
                          <Tooltip
                            content={statusTooltips[row.status]}
                            position="top"
                          >
                            <span
                              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium capitalize cursor-default ${statusColors[row.status]}`}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-current" />
                              {row.status}
                            </span>
                          </Tooltip>
                        </td>
                        <td className="px-4 py-3">
                          <Tooltip
                            content={`${row.score >= 80 ? "Above average" : "Needs improvement"} — ${row.score}/100`}
                            position="top"
                          >
                            <div className="flex items-center gap-2 cursor-default">
                              <div className="flex-1 max-w-20 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${row.score >= 80 ? "bg-emerald-500" : "bg-amber-500"}`}
                                  style={{ width: `${row.score}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-600 dark:text-gray-400 tabular-nums">
                                {row.score}
                              </span>
                            </div>
                          </Tooltip>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <IconBtn icon={Edit3} label="Edit member" />
                            <IconBtn icon={Mail} label="Send email" />
                            <IconBtn
                              icon={Trash2}
                              label="Remove member"
                              danger
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </Section>

          {/* ── 5. Form fields ────────────────────────────────────────────── */}
          <Section
            title="5. Form Fields"
            description="Input helper icons, validation indicators, and password toggle."
          >
            <Card>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl">
                {/* Username */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Username
                    </label>
                    <Tooltip
                      content="Must be 3–20 characters; letters, numbers, and underscores only"
                      position="right"
                      maxWidth={240}
                    >
                      <HelpCircle
                        size={13}
                        className="text-gray-400 cursor-default"
                      />
                    </Tooltip>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="your_username"
                      className="w-full pr-9 pl-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    />
                    <Tooltip content="Username available" position="left">
                      <CheckCircle
                        size={14}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500 cursor-default"
                      />
                    </Tooltip>
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email
                    </label>
                    <Tooltip
                      content="We'll never share your email with anyone"
                      position="right"
                    >
                      <Lock
                        size={13}
                        className="text-gray-400 cursor-default"
                      />
                    </Tooltip>
                  </div>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="w-full pr-9 pl-3 py-2 rounded-lg border border-red-300 dark:border-red-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400"
                    />
                    <Tooltip content="Invalid email format" position="left">
                      <AlertTriangle
                        size={14}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 cursor-default"
                      />
                    </Tooltip>
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Password
                    </label>
                    <Tooltip
                      content="Minimum 8 characters, including one number and one symbol"
                      position="right"
                      maxWidth={260}
                    >
                      <HelpCircle
                        size={13}
                        className="text-gray-400 cursor-default"
                      />
                    </Tooltip>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full pr-9 pl-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Tooltip
                      content={showPassword ? "Hide password" : "Show password"}
                      position="left"
                    >
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff size={14} />
                        ) : (
                          <Eye size={14} />
                        )}
                      </button>
                    </Tooltip>
                  </div>
                </div>

                {/* Tags input */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Tags
                    </label>
                    <Tooltip
                      content="Add up to 5 tags. Press Enter or comma to add."
                      position="right"
                      maxWidth={240}
                    >
                      <Info
                        size={13}
                        className="text-gray-400 cursor-default"
                      />
                    </Tooltip>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    {["react", "ui"].map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium"
                      >
                        {tag}
                        <Tooltip content={`Remove "${tag}" tag`} position="top">
                          <button className="hover:text-blue-900 dark:hover:text-blue-200 transition-colors">
                            <X size={10} />
                          </button>
                        </Tooltip>
                      </span>
                    ))}
                    <input
                      className="flex-1 min-w-0 bg-transparent text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 focus:outline-none"
                      placeholder="Add tag..."
                    />
                  </div>
                </div>
              </div>
            </Card>
          </Section>

          {/* ── 6. Rich text / chat editor toolbar ───────────────────────── */}
          <Section
            title="6. Rich Text / Chat Toolbar"
            description="Message composer with formatting and attachment tooltips."
          >
            <Card>
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                {/* Toolbar */}
                <div className="flex items-center gap-0.5 px-3 py-2 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 flex-wrap">
                  {[
                    { icon: Tag, label: "Bold (⌘B)" },
                    { icon: Link, label: "Insert link" },
                    { icon: Filter, label: "Text color" },
                  ].map(({ icon: Icon, label }) => (
                    <Tooltip key={label} content={label} position="top">
                      <button className="w-8 h-8 inline-flex items-center justify-center rounded text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-xs font-bold">
                        <Icon size={14} />
                      </button>
                    </Tooltip>
                  ))}
                  <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-1" />
                  {[
                    { icon: Smile, label: "Insert emoji" },
                    { icon: Paperclip, label: "Attach file (max 25MB)" },
                    { icon: ExternalLink, label: "Insert image URL" },
                  ].map(({ icon: Icon, label }) => (
                    <Tooltip key={label} content={label} position="top">
                      <button className="w-8 h-8 inline-flex items-center justify-center rounded text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        <Icon size={14} />
                      </button>
                    </Tooltip>
                  ))}
                </div>

                {/* Editor area */}
                <div className="px-4 py-3 min-h-18 text-sm text-gray-400 dark:text-gray-500">
                  Type your message…
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-3 py-2 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-1">
                    <Tooltip content="Formatting guide">
                      <button className="w-7 h-7 inline-flex items-center justify-center rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                        <HelpCircle size={14} />
                      </button>
                    </Tooltip>
                  </div>
                  <Tooltip content="Send message (⌘Enter)">
                    <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-sm transition-colors">
                      <Send size={12} />
                      Send
                    </button>
                  </Tooltip>
                </div>
              </div>
            </Card>
          </Section>

          {/* ── 7. Card actions & social ──────────────────────────────────── */}
          <Section
            title="7. Content Cards with Social Actions"
            description="Tooltip on stateful toggle buttons — like / bookmark / star."
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  title: "Design System Deep Dive",
                  desc: "A comprehensive walkthrough of building a scalable component library from scratch.",
                  category: "Design",
                },
                {
                  title: "React Performance Patterns",
                  desc: "Common pitfalls and proven techniques to keep your React apps blazing fast.",
                  category: "Engineering",
                },
              ].map((article, i) => (
                <Card key={i} className="group">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                      {article.category}
                    </span>
                    <Tooltip content="More options" position="left">
                      <button className="w-7 h-7 inline-flex items-center justify-center rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 opacity-0 group-hover:opacity-100 transition-all">
                        <MoreHorizontal size={14} />
                      </button>
                    </Tooltip>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1.5 leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
                    {article.desc}
                  </p>
                  <div className="flex items-center gap-1 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <Tooltip
                      content={liked ? "Unlike article" : "Like article"}
                      position="top"
                    >
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={() => setLiked(!liked)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          liked
                            ? "text-red-600 bg-red-50 dark:bg-red-900/20"
                            : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        <Heart
                          size={12}
                          className={liked ? "fill-current" : ""}
                        />
                        {liked ? "Liked" : "Like"}
                      </motion.button>
                    </Tooltip>

                    <Tooltip
                      content={
                        bookmarked ? "Remove bookmark" : "Save for later"
                      }
                      position="top"
                    >
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={() => setBookmarked(!bookmarked)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          bookmarked
                            ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20"
                            : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        <Bookmark
                          size={12}
                          className={bookmarked ? "fill-current" : ""}
                        />
                        {bookmarked ? "Saved" : "Save"}
                      </motion.button>
                    </Tooltip>

                    <Tooltip
                      content={starred ? "Remove star" : "Star this article"}
                      position="top"
                    >
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={() => setStarred(!starred)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          starred
                            ? "text-amber-500 bg-amber-50 dark:bg-amber-900/20"
                            : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        <Star
                          size={12}
                          className={starred ? "fill-current" : ""}
                        />
                        {starred ? "Starred" : "Star"}
                      </motion.button>
                    </Tooltip>

                    <div className="ml-auto">
                      <Tooltip content="Share article">
                        <button className="w-7 h-7 inline-flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          <Share2 size={12} />
                        </button>
                      </Tooltip>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Section>

          {/* ── 8. Sidebar / vertical navigation ─────────────────────────── */}
          <Section
            title="8. Collapsed Sidebar Navigation"
            description="Icon-only navigation — tooltips act as the visible label in collapsed state."
          >
            <Card className="p-3">
              <div className="inline-flex flex-col gap-1">
                {[
                  { icon: Home, label: "Dashboard", active: true },
                  { icon: BarChart2, label: "Analytics" },
                  { icon: MessageCircle, label: "Messages" },
                  { icon: Calendar, label: "Calendar" },
                  { icon: User, label: "Profile" },
                  { icon: Settings, label: "Settings" },
                ].map(({ icon: Icon, label, active }) => (
                  <Tooltip key={label} content={label} position="right">
                    <button
                      className={`w-10 h-10 inline-flex items-center justify-center rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        active
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                      aria-label={label}
                    >
                      <Icon size={16} />
                    </button>
                  </Tooltip>
                ))}
              </div>
            </Card>
          </Section>

          {/* ── 9. Delay, long content, and edge cases ───────────────────── */}
          <Section
            title="9. Delay, Long Content & Overflow Edge Cases"
            description="Custom delays, multi-word content, and maxWidth capping."
          >
            <Card>
              <div className="flex flex-wrap gap-3 items-center">
                <Tooltip
                  content="Appears after 500ms delay"
                  position="top"
                  delay={500}
                >
                  <button className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    500ms delay
                  </button>
                </Tooltip>

                <Tooltip
                  content="This tooltip has no delay at all"
                  position="top"
                  delay={0}
                >
                  <button className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    No delay
                  </button>
                </Tooltip>

                <Tooltip
                  content="This is a long description that explains something in more detail and should be capped by maxWidth"
                  position="top"
                  maxWidth={280}
                >
                  <button className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    Long content (280px)
                  </button>
                </Tooltip>

                {/* Empty content — tooltip should not render */}
                <Tooltip content="" position="top">
                  <button className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    Empty content
                  </button>
                </Tooltip>

                {/* Nested interactive element */}
                <Tooltip content="Nested button with tooltip" position="top">
                  <div className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 inline-flex items-center gap-2">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Wrapper div
                    </span>
                    <Tooltip content="Inner action" position="right">
                      <button className="w-5 h-5 inline-flex items-center justify-center rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <Plus size={12} />
                      </button>
                    </Tooltip>
                  </div>
                </Tooltip>
              </div>
            </Card>
          </Section>

          {/* ── 10. Breadcrumb / overflow chips ──────────────────────────── */}
          <Section
            title="10. Breadcrumb & Truncated Text"
            description="Tooltip reveals full content when text is truncated in compact layouts."
          >
            <Card>
              <div className="space-y-4">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-1 text-sm">
                  {["Home", "Projects", "Design System", "Components"].map(
                    (crumb, i, arr) => (
                      <React.Fragment key={crumb}>
                        {i < arr.length - 1 ? (
                          <>
                            <Tooltip content={`Go to ${crumb}`} position="top">
                              <a
                                href="#"
                                className="text-blue-600 dark:text-blue-400 hover:underline truncate max-w-20"
                                onClick={(e) => e.preventDefault()}
                              >
                                {crumb}
                              </a>
                            </Tooltip>
                            <ChevronDown
                              size={12}
                              className="text-gray-400 -rotate-90 shrink-0"
                            />
                          </>
                        ) : (
                          <span className="text-gray-500 dark:text-gray-400 truncate max-w-25">
                            {crumb}
                          </span>
                        )}
                      </React.Fragment>
                    ),
                  )}
                </nav>

                {/* Overflow user chips */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-gray-500 dark:text-gray-400 mr-1">
                    Assignees:
                  </span>
                  {tableRows.map((member) => (
                    <Tooltip
                      key={member.id}
                      content={`${member.name} · ${member.role}`}
                      position="top"
                    >
                      <div className="w-7 h-7 rounded-full bg-linear-to-br from-indigo-400 to-pink-400 flex items-center justify-center text-white text-xs font-bold cursor-pointer ring-2 ring-white dark:ring-gray-800">
                        {member.name[0]}
                      </div>
                    </Tooltip>
                  ))}
                  <Tooltip content="Add assignee" position="top">
                    <button className="w-7 h-7 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors">
                      <Plus size={12} />
                    </button>
                  </Tooltip>
                </div>
              </div>
            </Card>
          </Section>

          {/* ── 11. Metadata chips ────────────────────────────────────────── */}
          <Section
            title="11. Metadata & Info Chips"
            description="Small info badges where tooltip provides the full context."
          >
            <Card>
              <div className="flex flex-wrap gap-2">
                {[
                  {
                    icon: Clock,
                    text: "2h ago",
                    tip: "Last edited March 31, 2026 at 10:42 AM",
                  },
                  {
                    icon: User,
                    text: "Priya M.",
                    tip: "Last modified by Priya Mehta",
                  },
                  {
                    icon: Globe,
                    text: "Public",
                    tip: "Visible to everyone with the link",
                  },
                  {
                    icon: Map,
                    text: "Mumbai",
                    tip: "Project timezone: Asia/Kolkata (IST)",
                  },
                  {
                    icon: Flag,
                    text: "High",
                    tip: "Priority: High — requires attention this sprint",
                  },
                  {
                    icon: RefreshCw,
                    text: "Auto-synced",
                    tip: "Syncs every 5 minutes with the source",
                  },
                  {
                    icon: FaGithub,
                    text: "main",
                    tip: "Connected branch: main · 3 open PRs",
                  },
                  {
                    icon: Phone,
                    text: "+91 98...",
                    tip: "Click to reveal full number",
                  },
                ].map(({ icon: Icon, text, tip }) => (
                  <Tooltip
                    key={text}
                    content={tip}
                    position="top"
                    maxWidth={240}
                  >
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium cursor-default hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                      <Icon size={11} />
                      {text}
                    </span>
                  </Tooltip>
                ))}
              </div>
            </Card>
          </Section>
        </main>

        {/* ── Footer ──────────────────────────────────────────────────────── */}
        <footer className="border-t border-gray-200 dark:border-gray-700 mt-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between gap-4 flex-wrap">
            <p className="text-xs text-gray-400 dark:text-gray-600">
              Tooltip.test.tsx — edge case suite
            </p>
            <div className="flex items-center gap-3">
              <Tooltip content="View source on GitHub" position="top">
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                >
                  <FaGithub size={15} />
                </a>
              </Tooltip>
              <Tooltip content="Open documentation" position="top">
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                >
                  <ExternalLink size={15} />
                </a>
              </Tooltip>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
