"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  MessageSquare,
  Moon,
  Sun,
  Trash2,
  Zap,
  Link,
  Clock,
  MapPin,
  Eye,
  EyeOff,
  Star,
} from "lucide-react";
import {
  useAlert,
  type AlertPosition,
  type AlertType,
} from "../../context/alert/Alert.context";
import AlertContainer from "../../ui/alert/Alert.ui";

// ─── Types ────────────────────────────────────────────────────────────────────
interface UseCaseConfig {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  badgeBg: string;
  badgeText: string;
  iconColor: string;
  trigger: () => void;
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-4">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-1">
        {title}
      </h2>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">{subtitle}</p>
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
function CaseCard({
  label,
  description,
  icon: Icon,
  badgeBg,
  badgeText,
  iconColor,
  onClick,
  tag,
}: {
  label: string;
  description: string;
  icon: React.ElementType;
  badgeBg: string;
  badgeText: string;
  iconColor: string;
  onClick: () => void;
  tag?: string;
}) {
  return (
    <motion.button
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      onClick={onClick}
      className="group w-full text-left rounded-2xl border border-zinc-200 dark:border-zinc-700/60 bg-white dark:bg-zinc-800/60 p-4 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
    >
      <div className="flex items-start gap-3">
        <div
          className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${badgeBg}`}
        >
          <Icon size={18} className={iconColor} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
              {label}
            </span>
            {tag && (
              <span
                className={`shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full ${badgeBg} ${badgeText}`}
              >
                {tag}
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-snug">
            {description}
          </p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1.5 text-[11px] text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-500 dark:group-hover:text-zinc-300 transition-colors">
        <Zap size={10} />
        <span>Click to trigger</span>
      </div>
    </motion.button>
  );
}

// ─── Custom Position Picker ───────────────────────────────────────────────────
const POSITIONS: AlertPosition[] = [
  "top-left",
  "top-center",
  "top-right",
  "middle-left",
  "middle-center",
  "middle-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
];

function PositionGrid({
  selected,
  onChange,
}: {
  selected: AlertPosition;
  onChange: (p: AlertPosition) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-1.5 w-fit">
      {POSITIONS.map((pos) => (
        <button
          key={pos}
          onClick={() => onChange(pos)}
          title={pos}
          className={`w-14 h-8 rounded-lg text-[10px] font-medium transition-all border ${
            selected === pos
              ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100"
              : "bg-white dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500"
          }`}
        >
          {pos.replace("-", "\n")}
        </button>
      ))}
    </div>
  );
}

// ─── Inner Page ───────────────────────────────────────────────────────────────
export default function AlertTestPage({
  dark,
  setDark,
}: {
  dark: boolean;
  setDark: (v: boolean) => void;
}) {
  const { addAlert, clearAll } = useAlert();

  // Builder state
  const [builderType, setBuilderType] = useState<AlertType>("info");
  const [builderPosition, setBuilderPosition] =
    useState<AlertPosition>("top-right");
  const [builderTitle, setBuilderTitle] = useState("Custom Alert");
  const [builderMessage, setBuilderMessage] = useState(
    "This is a custom alert message.",
  );
  const [builderDuration, setBuilderDuration] = useState(5000);
  const [builderShowClose, setBuilderShowClose] = useState(true);
  const [builderPersistent, setBuilderPersistent] = useState(false);

  const fireBuilder = () => {
    addAlert({
      type: builderType,
      title: builderTitle,
      message: builderMessage,
      duration: builderPersistent ? 0 : builderDuration,
      position: builderPosition,
      showCloseButton: builderShowClose,
    });
  };

  // ── Alert type use cases ──
  const typeCases: UseCaseConfig[] = [
    {
      id: "success",
      label: "Success",
      description: "File saved — operation completed without errors.",
      icon: CheckCircle,
      badgeBg: "bg-green-100 dark:bg-green-900/30",
      badgeText: "text-green-600 dark:text-green-400",
      iconColor: "text-green-500",
      trigger: () =>
        addAlert({
          type: "success",
          title: "Changes saved!",
          message: "Your file has been saved successfully.",
          position: "top-right",
        }),
    },
    {
      id: "error",
      label: "Error",
      description: "Network failure — request could not be completed.",
      icon: XCircle,
      badgeBg: "bg-red-100 dark:bg-red-900/30",
      badgeText: "text-red-600 dark:text-red-400",
      iconColor: "text-red-500",
      trigger: () =>
        addAlert({
          type: "error",
          title: "Request failed",
          message: "Unable to reach the server. Check your connection.",
          position: "top-right",
        }),
    },
    {
      id: "warning",
      label: "Warning",
      description: "Low disk space — action may be required.",
      icon: AlertCircle,
      badgeBg: "bg-amber-100 dark:bg-amber-900/30",
      badgeText: "text-amber-600 dark:text-amber-400",
      iconColor: "text-amber-500",
      trigger: () =>
        addAlert({
          type: "warning",
          title: "Low storage",
          message: "You're running low on disk space. Free up some room.",
          position: "top-right",
        }),
    },
    {
      id: "info",
      label: "Info",
      description: "System update available — no action needed yet.",
      icon: Info,
      badgeBg: "bg-blue-100 dark:bg-blue-900/30",
      badgeText: "text-blue-600 dark:text-blue-400",
      iconColor: "text-blue-500",
      trigger: () =>
        addAlert({
          type: "info",
          title: "Update available",
          message: "Version 2.4.0 is ready to install.",
          position: "top-right",
        }),
    },
    {
      id: "message",
      label: "Message",
      description: "Neutral system notification, no urgency.",
      icon: MessageSquare,
      badgeBg: "bg-zinc-100 dark:bg-zinc-700/50",
      badgeText: "text-zinc-600 dark:text-zinc-300",
      iconColor: "text-zinc-500",
      trigger: () =>
        addAlert({
          type: "message",
          title: "New message from Alex",
          message: "Hey, the PR is ready for review!",
          position: "top-right",
        }),
    },
  ];

  // ── Position use cases ──
  const positionCases = [
    { pos: "top-left" as AlertPosition, label: "Top Left" },
    { pos: "top-center" as AlertPosition, label: "Top Center" },
    { pos: "top-right" as AlertPosition, label: "Top Right" },
    { pos: "middle-left" as AlertPosition, label: "Middle Left" },
    { pos: "middle-center" as AlertPosition, label: "Middle Center" },
    { pos: "middle-right" as AlertPosition, label: "Middle Right" },
    { pos: "bottom-left" as AlertPosition, label: "Bottom Left" },
    { pos: "bottom-center" as AlertPosition, label: "Bottom Center" },
    { pos: "bottom-right" as AlertPosition, label: "Bottom Right" },
  ];

  // ── Feature use cases ──
  const featureCases: UseCaseConfig[] = [
    {
      id: "action",
      label: "With Action Button",
      description: "Alert with a clickable action to undo or retry.",
      icon: Zap,
      badgeBg: "bg-blue-100 dark:bg-blue-900/30",
      badgeText: "text-blue-600 dark:text-blue-400",
      iconColor: "text-blue-500",
      trigger: () =>
        addAlert({
          type: "warning",
          title: "Item deleted",
          message: "The task was removed from your board.",
          position: "bottom-right",
          action: { label: "Undo", onClick: () => console.log("Undone!") },
        }),
    },
    {
      id: "link",
      label: "With Link",
      description: "Alert that navigates the user to an external resource.",
      icon: Link,
      badgeBg: "bg-purple-100 dark:bg-purple-900/30",
      badgeText: "text-purple-600 dark:text-purple-400",
      iconColor: "text-purple-500",
      trigger: () =>
        addAlert({
          type: "info",
          title: "Documentation updated",
          message: "The API reference has been refreshed with new examples.",
          position: "top-right",
          link: { label: "View docs", href: "https://docs.example.com" },
        }),
    },
    {
      id: "persistent",
      label: "Persistent (no timeout)",
      description: "Stays until the user manually closes it.",
      icon: Star,
      badgeBg: "bg-amber-100 dark:bg-amber-900/30",
      badgeText: "text-amber-600 dark:text-amber-400",
      iconColor: "text-amber-500",
      trigger: () =>
        addAlert({
          type: "warning",
          title: "Action required",
          message:
            "Your account will be suspended unless you verify your email.",
          position: "top-center",
          duration: 0,
          showCloseButton: true,
        }),
    },
    {
      id: "no-close",
      label: "No Close Button",
      description: "Dismisses only via timeout, no manual close.",
      icon: EyeOff,
      badgeBg: "bg-zinc-100 dark:bg-zinc-700/50",
      badgeText: "text-zinc-600 dark:text-zinc-300",
      iconColor: "text-zinc-500",
      trigger: () =>
        addAlert({
          type: "info",
          title: "Auto-dismissing",
          message: "This alert will disappear in 3 seconds.",
          position: "top-right",
          duration: 3000,
          showCloseButton: false,
        }),
    },
    {
      id: "no-message",
      label: "Title Only",
      description: "Compact alert with no body message.",
      icon: Eye,
      badgeBg: "bg-green-100 dark:bg-green-900/30",
      badgeText: "text-green-600 dark:text-green-400",
      iconColor: "text-green-500",
      trigger: () =>
        addAlert({
          type: "success",
          title: "Copied to clipboard!",
          position: "bottom-center",
          duration: 2000,
        }),
    },
    {
      id: "fast",
      label: "Fast (1.5s)",
      description: "Very short duration for ephemeral feedback.",
      icon: Clock,
      badgeBg: "bg-green-100 dark:bg-green-900/30",
      badgeText: "text-green-600 dark:text-green-400",
      iconColor: "text-green-500",
      trigger: () =>
        addAlert({
          type: "success",
          title: "Sent!",
          message: "Message delivered.",
          position: "bottom-right",
          duration: 1500,
        }),
    },
    {
      id: "slow",
      label: "Slow (10s)",
      description: "Long duration for important notices.",
      icon: Clock,
      badgeBg: "bg-red-100 dark:bg-red-900/30",
      badgeText: "text-red-600 dark:text-red-400",
      iconColor: "text-red-500",
      trigger: () =>
        addAlert({
          type: "error",
          title: "Maintenance window",
          message: "The system will go offline in 10 minutes. Save your work.",
          position: "top-center",
          duration: 10000,
        }),
    },
    {
      id: "custom-icon",
      label: "Custom Icon",
      description: "Override the default type icon with any ReactNode.",
      icon: Star,
      badgeBg: "bg-purple-100 dark:bg-purple-900/30",
      badgeText: "text-purple-600 dark:text-purple-400",
      iconColor: "text-purple-500",
      trigger: () =>
        addAlert({
          type: "message",
          title: "You earned a badge!",
          message: "First task completed — welcome aboard.",
          position: "bottom-left",
          icon: <Star className="w-5 h-5 text-purple-500" />,
        }),
    },
    {
      id: "stacked",
      label: "Stacked (fire 3)",
      description: "Fires three alerts at once to test stacking.",
      icon: MapPin,
      badgeBg: "bg-zinc-100 dark:bg-zinc-700/50",
      badgeText: "text-zinc-600 dark:text-zinc-300",
      iconColor: "text-zinc-500",
      trigger: () => {
        addAlert({
          type: "success",
          title: "Step 1 complete",
          position: "top-right",
        });
        setTimeout(
          () =>
            addAlert({
              type: "info",
              title: "Step 2 in progress",
              message: "Processing your request...",
              position: "top-right",
            }),
          200,
        );
        setTimeout(
          () =>
            addAlert({
              type: "warning",
              title: "Step 3 needs attention",
              message: "Review required before finalising.",
              position: "top-right",
            }),
          400,
        );
      },
    },
  ];

  const typeColors: Record<AlertType, string> = {
    success: "bg-green-600",
    error: "bg-red-600",
    warning: "bg-amber-500",
    info: "bg-blue-600",
    message: "bg-zinc-600",
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-zinc-900 dark:bg-white flex items-center justify-center">
              <Info size={14} className="text-white dark:text-zinc-900" />
            </div>
            <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100 tracking-tight">
              AlertSystem
              <span className="ml-1.5 text-[11px] font-normal text-zinc-400 dark:text-zinc-500">
                test suite
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <Trash2 size={12} />
              Clear all
            </button>
            <button
              onClick={() => setDark(!dark)}
              className="w-9 h-9 rounded-xl border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              {dark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mb-2">
            All Use Cases
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xl leading-relaxed">
            Every card triggers{" "}
            <code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-700 dark:text-zinc-300">
              addAlert()
            </code>{" "}
            with a different config. Alerts stack per position with a live
            progress bar.
          </p>
          {/* Stats */}
          <div className="mt-5 flex flex-wrap gap-3">
            {[
              { label: "Alert types", value: 5 },
              { label: "Positions", value: 9 },
              { label: "Feature cases", value: featureCases.length },
              { label: "Auto-dismiss", value: "✓" },
            ].map((s) => (
              <div
                key={s.label}
                className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300"
              >
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {s.value}
                </span>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Section 1: Types ── */}
        <section>
          <SectionHeader
            title="Alert Types"
            subtitle="One card per alert type — success, error, warning, info, message."
          />
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.05 } },
            }}
          >
            {typeCases.map((uc) => (
              <motion.div
                key={uc.id}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.3 }}
              >
                <CaseCard {...uc} tag={uc.id} onClick={uc.trigger} />
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ── Section 2: Positions ── */}
        <section>
          <SectionHeader
            title="All 9 Positions"
            subtitle="Fire an info alert at every supported screen position."
          />
          <motion.div
            className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-5 gap-3"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.04 } },
            }}
          >
            {positionCases.map(({ pos, label }) => (
              <motion.button
                key={pos}
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.28 }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() =>
                  addAlert({
                    type: "info",
                    title: label,
                    message: `Position: ${pos}`,
                    position: pos,
                    duration: 3000,
                  })
                }
                className="group rounded-2xl border border-zinc-200 dark:border-zinc-700/60 bg-white dark:bg-zinc-800/60 px-3 py-4 text-center shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <MapPin size={16} className="mx-auto mb-2 text-blue-400" />
                <span className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  {label}
                </span>
                <span className="block text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">
                  {pos}
                </span>
              </motion.button>
            ))}
          </motion.div>
        </section>

        {/* ── Section 3: Features ── */}
        <section>
          <SectionHeader
            title="Feature Cases"
            subtitle="Action buttons, links, custom icons, persistence, stacking and more."
          />
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.05 } },
            }}
          >
            {featureCases.map((uc) => (
              <motion.div
                key={uc.id}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.3 }}
              >
                <CaseCard {...uc} onClick={uc.trigger} />
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ── Section 4: Custom Builder ── */}
        <section>
          <SectionHeader
            title="Custom Builder"
            subtitle="Configure every option and fire a fully custom alert."
          />
          <div className="bg-white dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 rounded-2xl p-6 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left: controls */}
              <div className="space-y-5">
                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-300 mb-1.5">
                    Title
                  </label>
                  <input
                    value={builderTitle}
                    onChange={(e) => setBuilderTitle(e.target.value)}
                    className="w-full text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-500 transition"
                    placeholder="Alert title"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-300 mb-1.5">
                    Message
                  </label>
                  <textarea
                    value={builderMessage}
                    onChange={(e) => setBuilderMessage(e.target.value)}
                    rows={2}
                    className="w-full text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-500 transition resize-none"
                    placeholder="Optional body message"
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-300 mb-2">
                    Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(
                      [
                        "success",
                        "error",
                        "warning",
                        "info",
                        "message",
                      ] as AlertType[]
                    ).map((t) => (
                      <button
                        key={t}
                        onClick={() => setBuilderType(t)}
                        className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-all capitalize ${
                          builderType === t
                            ? `${typeColors[t]} text-white border-transparent`
                            : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-300 mb-2">
                    Duration —{" "}
                    {builderPersistent
                      ? "persistent"
                      : `${builderDuration / 1000}s`}
                  </label>
                  <input
                    type="range"
                    min={1000}
                    max={15000}
                    step={500}
                    value={builderDuration}
                    disabled={builderPersistent}
                    onChange={(e) => setBuilderDuration(Number(e.target.value))}
                    className="w-full accent-zinc-800 dark:accent-zinc-100 disabled:opacity-40"
                  />
                </div>

                {/* Toggles */}
                <div className="flex flex-col gap-2">
                  {[
                    {
                      label: "Persistent (no auto-dismiss)",
                      value: builderPersistent,
                      set: setBuilderPersistent,
                    },
                    {
                      label: "Show close button",
                      value: builderShowClose,
                      set: setBuilderShowClose,
                    },
                  ].map(({ label, value, set }) => (
                    <label
                      key={label}
                      className="flex items-center gap-2.5 cursor-pointer select-none"
                    >
                      <div
                        onClick={() => set(!value)}
                        className={`w-9 h-5 rounded-full transition-colors relative ${value ? "bg-zinc-900 dark:bg-zinc-100" : "bg-zinc-200 dark:bg-zinc-700"}`}
                      >
                        <div
                          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white dark:bg-zinc-900 shadow transition-transform ${value ? "translate-x-4" : "translate-x-0"}`}
                        />
                      </div>
                      <span className="text-xs text-zinc-600 dark:text-zinc-300">
                        {label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Right: position picker + fire */}
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-300 mb-3">
                    Position —{" "}
                    <span className="font-normal text-zinc-400">
                      {builderPosition}
                    </span>
                  </label>
                  <PositionGrid
                    selected={builderPosition}
                    onChange={setBuilderPosition}
                  />
                </div>

                <button
                  onClick={fireBuilder}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-semibold hover:opacity-90 active:scale-95 transition-all"
                >
                  <Zap size={15} />
                  Fire custom alert
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── Legend ── */}
        <section className="pb-8">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4">
            Type reference
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {(
              ["success", "error", "warning", "info", "message"] as AlertType[]
            ).map((t) => {
              const icons = {
                success: CheckCircle,
                error: XCircle,
                warning: AlertCircle,
                info: Info,
                message: MessageSquare,
              };
              const TIcon = icons[t];
              const colors = {
                success: "bg-green-50 dark:bg-green-900/20 text-green-500",
                error: "bg-red-50 dark:bg-red-900/20 text-red-500",
                warning: "bg-amber-50 dark:bg-amber-900/20 text-amber-500",
                info: "bg-blue-50 dark:bg-blue-900/20 text-blue-500",
                message: "bg-zinc-100 dark:bg-zinc-800 text-zinc-500",
              };
              return (
                <div
                  key={t}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2.5 ${colors[t]}`}
                >
                  <TIcon size={14} />
                  <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 capitalize">
                    {t}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Alert container renders all live alerts */}
      <AlertContainer />
    </div>
  );
}
