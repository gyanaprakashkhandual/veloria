"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  X,
  Rocket,
  Bell,
  Wifi,
  WifiOff,
  Trash2,
  Download,
  RefreshCw,
  Sparkles,
  Moon,
  Sun,
} from "lucide-react";

// ─── Inlined types (mirroring Alert.context.tsx) ─────────────────────────────
type AlertType = "success" | "error" | "warning" | "info" | "message";
type AlertPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "middle-left"
  | "middle-center"
  | "middle-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right"
  | "auto";

interface AlertConfig {
  id: string;
  type: AlertType;
  title: string;
  message?: string;
  duration?: number;
  position?: AlertPosition;
  showCloseButton?: boolean;
  action?: { label: string; onClick: () => void };
  link?: { label: string; href: string };
  customClassName?: string;
  icon?: React.ReactNode;
  onClose?: () => void;
}

// ─── Minimal self-contained context ──────────────────────────────────────────
// In real usage, import { useAlert } from "@/context/alert/Alert.context"
// and wrap with <AlertProvider> + render <AlertContainer />.
// This file is self-contained for the showcase only.

// ─── Type config ─────────────────────────────────────────────────────────────
const TYPE_CONFIG: Record<
  AlertType,
  {
    bgLight: string;
    bgDark: string;
    border: string;
    borderDark: string;
    iconColor: string;
    iconColorDark: string;
    titleLight: string;
    titleDark: string;
    msgLight: string;
    msgDark: string;
    btnBg: string;
    btnHover: string;
    icon: React.ReactNode;
    badge: string;
    badgeDark: string;
    progress: string;
  }
> = {
  success: {
    bgLight: "bg-green-50",
    bgDark: "dark:bg-green-950/40",
    border: "border-green-200",
    borderDark: "dark:border-green-700/50",
    iconColor: "text-green-600",
    iconColorDark: "dark:text-green-400",
    titleLight: "text-green-900",
    titleDark: "dark:text-green-100",
    msgLight: "text-green-700",
    msgDark: "dark:text-green-300",
    btnBg: "bg-green-600",
    btnHover: "hover:bg-green-700",
    icon: <CheckCircle className="w-5 h-5" />,
    badge: "bg-green-100 text-green-800",
    badgeDark: "dark:bg-green-900/60 dark:text-green-200",
    progress: "bg-green-500",
  },
  error: {
    bgLight: "bg-red-50",
    bgDark: "dark:bg-red-950/40",
    border: "border-red-200",
    borderDark: "dark:border-red-700/50",
    iconColor: "text-red-600",
    iconColorDark: "dark:text-red-400",
    titleLight: "text-red-900",
    titleDark: "dark:text-red-100",
    msgLight: "text-red-700",
    msgDark: "dark:text-red-300",
    btnBg: "bg-red-600",
    btnHover: "hover:bg-red-700",
    icon: <XCircle className="w-5 h-5" />,
    badge: "bg-red-100 text-red-800",
    badgeDark: "dark:bg-red-900/60 dark:text-red-200",
    progress: "bg-red-500",
  },
  warning: {
    bgLight: "bg-yellow-50",
    bgDark: "dark:bg-yellow-950/40",
    border: "border-yellow-200",
    borderDark: "dark:border-yellow-700/50",
    iconColor: "text-yellow-600",
    iconColorDark: "dark:text-yellow-400",
    titleLight: "text-yellow-900",
    titleDark: "dark:text-yellow-100",
    msgLight: "text-yellow-700",
    msgDark: "dark:text-yellow-300",
    btnBg: "bg-yellow-500",
    btnHover: "hover:bg-yellow-600",
    icon: <AlertCircle className="w-5 h-5" />,
    badge: "bg-yellow-100 text-yellow-800",
    badgeDark: "dark:bg-yellow-900/60 dark:text-yellow-200",
    progress: "bg-yellow-500",
  },
  info: {
    bgLight: "bg-blue-50",
    bgDark: "dark:bg-blue-950/40",
    border: "border-blue-200",
    borderDark: "dark:border-blue-700/50",
    iconColor: "text-blue-600",
    iconColorDark: "dark:text-blue-400",
    titleLight: "text-blue-900",
    titleDark: "dark:text-blue-100",
    msgLight: "text-blue-700",
    msgDark: "dark:text-blue-300",
    btnBg: "bg-blue-600",
    btnHover: "hover:bg-blue-700",
    icon: <Info className="w-5 h-5" />,
    badge: "bg-blue-100 text-blue-800",
    badgeDark: "dark:bg-blue-900/60 dark:text-blue-200",
    progress: "bg-blue-500",
  },
  message: {
    bgLight: "bg-gray-50",
    bgDark: "dark:bg-gray-800/60",
    border: "border-gray-200",
    borderDark: "dark:border-gray-600/50",
    iconColor: "text-gray-600",
    iconColorDark: "dark:text-gray-400",
    titleLight: "text-gray-900",
    titleDark: "dark:text-gray-100",
    msgLight: "text-gray-700",
    msgDark: "dark:text-gray-300",
    btnBg: "bg-gray-600",
    btnHover: "hover:bg-gray-700",
    icon: <Bell className="w-5 h-5" />,
    badge: "bg-gray-100 text-gray-800",
    badgeDark: "dark:bg-gray-700 dark:text-gray-200",
    progress: "bg-gray-500",
  },
};

// ─── Single Alert Item ────────────────────────────────────────────────────────
const AlertItem: React.FC<{
  alert: AlertConfig;
  onClose: () => void;
  showProgress?: boolean;
}> = ({ alert, onClose, showProgress = true }) => {
  const cfg = TYPE_CONFIG[alert.type];
  const [progress, setProgress] = useState(100);
  const duration = alert.duration ?? 5000;

  useEffect(() => {
    if (!duration || duration <= 0) return;
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(pct);
      if (pct === 0) clearInterval(interval);
    }, 16);

    const timer = setTimeout(onClose, duration);
    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [duration, onClose]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.97 }}
      transition={{ type: "spring", stiffness: 340, damping: 28 }}
      className={`
        relative rounded-xl border shadow-lg overflow-hidden w-full max-w-sm
        ${cfg.bgLight} ${cfg.bgDark}
        ${cfg.border} ${cfg.borderDark}
        ${alert.customClassName ?? ""}
        backdrop-blur-sm
        transition-shadow duration-200 hover:shadow-xl
      `}
    >
      {/* Progress bar */}
      {showProgress && duration > 0 && (
        <motion.div
          className={`absolute top-0 left-0 h-0.5 ${cfg.progress} origin-left`}
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.016 }}
        />
      )}

      <div className="p-4 flex gap-3 items-start">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0.5, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            delay: 0.05,
            type: "spring",
            stiffness: 400,
            damping: 20,
          }}
          className={`shrink-0 mt-0.5 ${cfg.iconColor} ${cfg.iconColorDark}`}
        >
          {alert.icon ?? cfg.icon}
        </motion.div>

        {/* Body */}
        <div className="flex-1 min-w-0">
          <p
            className={`font-semibold text-sm leading-snug ${cfg.titleLight} ${cfg.titleDark}`}
          >
            {alert.title}
          </p>
          {alert.message && (
            <p
              className={`text-sm mt-1 leading-relaxed ${cfg.msgLight} ${cfg.msgDark}`}
            >
              {alert.message}
            </p>
          )}

          {(alert.action || alert.link) && (
            <div className="flex flex-wrap gap-2 mt-3">
              {alert.action && (
                <button
                  onClick={() => {
                    alert.action?.onClick();
                    onClose();
                  }}
                  className={`
                    text-xs font-semibold px-3 py-1.5 rounded-lg text-white
                    transition-all duration-150 active:scale-95
                    ${cfg.btnBg} ${cfg.btnHover}
                  `}
                >
                  {alert.action.label}
                </button>
              )}
              {alert.link && (
                <a
                  href={alert.link.href}
                  className={`
                    text-xs font-semibold px-3 py-1.5 rounded-lg text-white
                    transition-all duration-150 active:scale-95
                    ${cfg.btnBg} ${cfg.btnHover}
                  `}
                >
                  {alert.link.label}
                </a>
              )}
            </div>
          )}
        </div>

        {/* Close */}
        {alert.showCloseButton !== false && (
          <button
            onClick={onClose}
            aria-label="Dismiss"
            className={`
              shrink-0 p-1 rounded-md transition-all duration-150
              ${cfg.iconColor} ${cfg.iconColorDark}
              hover:bg-black/10 dark:hover:bg-white/10
              active:scale-90
            `}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

// ─── Showcase Card ────────────────────────────────────────────────────────────
const ShowcaseCard: React.FC<{
  label: string;
  description: string;
  children: React.ReactNode;
  badge?: string;
  badgeColor?: string;
}> = ({
  label,
  description,
  children,
  badge,
  badgeColor = "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    className="
      rounded-2xl border border-slate-200 dark:border-slate-700
      bg-white dark:bg-slate-800/50
      shadow-sm overflow-hidden
    "
  >
    <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/60 flex items-start justify-between gap-3">
      <div>
        <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
          {label}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {description}
        </p>
      </div>
      {badge && (
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${badgeColor}`}
        >
          {badge}
        </span>
      )}
    </div>
    <div className="p-5 flex flex-col gap-3">{children}</div>
  </motion.div>
);

// ─── Live Demo ────────────────────────────────────────────────────────────────
const LiveDemo: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertConfig[]>([]);

  const add = useCallback((config: Omit<AlertConfig, "id">) => {
    const id = `alert-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setAlerts((prev) => [
      ...prev,
      { ...config, id, showCloseButton: config.showCloseButton !== false },
    ]);
  }, []);

  const remove = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const DEMOS: Array<{
    label: string;
    color: string;
    config: Omit<AlertConfig, "id">;
  }> = [
    {
      label: "Success",
      color: "bg-green-600 hover:bg-green-700",
      config: {
        type: "success",
        title: "Changes saved!",
        message: "Your profile has been updated successfully.",
        duration: 4000,
        position: "top-right",
      },
    },
    {
      label: "Error",
      color: "bg-red-600 hover:bg-red-700",
      config: {
        type: "error",
        title: "Upload failed",
        message: "File exceeds the 10 MB limit. Please try a smaller file.",
        duration: 5000,
        position: "top-right",
      },
    },
    {
      label: "Warning",
      color: "bg-yellow-500 hover:bg-yellow-600",
      config: {
        type: "warning",
        title: "Storage almost full",
        message: "You've used 95% of your storage quota.",
        duration: 5000,
        position: "top-right",
      },
    },
    {
      label: "Info",
      color: "bg-blue-600 hover:bg-blue-700",
      config: {
        type: "info",
        title: "Maintenance window",
        message: "Scheduled downtime tonight 2–3 AM UTC.",
        duration: 5000,
        position: "top-right",
      },
    },
    {
      label: "Message",
      color: "bg-slate-600 hover:bg-slate-700",
      config: {
        type: "message",
        title: "New message from Alex",
        message: "Hey! Are you free for a quick call?",
        duration: 4000,
        position: "top-right",
      },
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800/60 overflow-hidden shadow-sm">
      <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
            Live Playground
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Click buttons to fire real alerts
          </p>
        </div>
        {alerts.length > 0 && (
          <button
            onClick={() => setAlerts([])}
            className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors underline underline-offset-2"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="p-5">
        {/* Trigger buttons */}
        <div className="flex flex-wrap gap-2 mb-5">
          {DEMOS.map((d) => (
            <motion.button
              key={d.label}
              whileTap={{ scale: 0.93 }}
              onClick={() => add(d.config)}
              className={`text-xs font-semibold text-white px-3.5 py-2 rounded-lg transition-colors duration-150 ${d.color}`}
            >
              {d.label}
            </motion.button>
          ))}
        </div>

        {/* Inline alert stack */}
        <div className="flex flex-col gap-2.5">
          <AnimatePresence initial={false}>
            {alerts.map((alert) => (
              <AlertItem
                key={alert.id}
                alert={alert}
                onClose={() => remove(alert.id)}
                showProgress
              />
            ))}
          </AnimatePresence>
          {alerts.length === 0 && (
            <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-4">
              No active alerts — try the buttons above
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Main Showcase Page ───────────────────────────────────────────────────────
export default function AlertShowcase() {
  const [dark, setDark] = useState(false);

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-white dark:bg-slate-900 text-black dark:text-white transition-colors duration-300">
        {/* Header */}
        <div className="border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-white flex items-center justify-center">
              <Bell className="w-4 h-4 text-white dark:text-slate-900" />
            </div>
            <div>
              <h1 className="font-bold text-base text-slate-900 dark:text-white leading-none">
                Alert System
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Component Showcase
              </p>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setDark((d) => !d)}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle theme"
          >
            <AnimatePresence mode="wait" initial={false}>
              {dark ? (
                <motion.div
                  key="sun"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun className="w-4 h-4" />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon className="w-4 h-4" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-4 sm:px-8 py-10 space-y-6">
          {/* Intro */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-1"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Alert Component
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base">
              Animated, accessible toast notifications. 5 types · 9 positions ·
              actions · links · auto-dismiss.
            </p>
          </motion.div>

          {/* Live Demo */}
          <LiveDemo />

          {/* 1. All Types */}
          <ShowcaseCard
            label="Alert Types"
            description="All 5 variants with their default icons and color palettes"
            badge="5 types"
          >
            {(
              ["success", "error", "warning", "info", "message"] as AlertType[]
            ).map((type) => {
              const cfg = TYPE_CONFIG[type];
              const titles: Record<AlertType, string> = {
                success: "Operation successful",
                error: "Something went wrong",
                warning: "Proceed with caution",
                info: "Here's some information",
                message: "You have a new message",
              };
              const msgs: Record<AlertType, string> = {
                success: "Your data has been saved to the cloud.",
                error: "Failed to connect to the server.",
                warning: "This action is irreversible.",
                info: "Scheduled maintenance on Sunday.",
                message: "Jake left a comment on your post.",
              };
              return (
                <div
                  key={type}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border ${cfg.bgLight} ${cfg.bgDark} ${cfg.border} ${cfg.borderDark}`}
                >
                  <span
                    className={`mt-0.5 ${cfg.iconColor} ${cfg.iconColorDark}`}
                  >
                    {cfg.icon}
                  </span>
                  <div>
                    <p
                      className={`font-semibold text-sm ${cfg.titleLight} ${cfg.titleDark}`}
                    >
                      {titles[type]}
                    </p>
                    <p
                      className={`text-xs mt-0.5 ${cfg.msgLight} ${cfg.msgDark}`}
                    >
                      {msgs[type]}
                    </p>
                  </div>
                </div>
              );
            })}
          </ShowcaseCard>

          {/* 2. With Action */}
          <ShowcaseCard
            label="With Action Button"
            description="Primary CTA inside the alert — fires a callback and dismisses"
            badge="action"
          >
            {(["warning", "error", "info"] as AlertType[]).map((type) => {
              const cfg = TYPE_CONFIG[type];
              const data: Record<
                string,
                { title: string; msg: string; btn: string }
              > = {
                warning: {
                  title: "Delete this project?",
                  msg: "All files will be permanently removed.",
                  btn: "Delete",
                },
                error: {
                  title: "Payment declined",
                  msg: "Please update your billing information.",
                  btn: "Update Card",
                },
                info: {
                  title: "New update ready",
                  msg: "Version 3.1.0 includes performance improvements.",
                  btn: "Update Now",
                },
              };
              const d = data[type];
              return (
                <div
                  key={type}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border ${cfg.bgLight} ${cfg.bgDark} ${cfg.border} ${cfg.borderDark}`}
                >
                  <span
                    className={`mt-0.5 ${cfg.iconColor} ${cfg.iconColorDark}`}
                  >
                    {cfg.icon}
                  </span>
                  <div className="flex-1">
                    <p
                      className={`font-semibold text-sm ${cfg.titleLight} ${cfg.titleDark}`}
                    >
                      {d.title}
                    </p>
                    <p
                      className={`text-xs mt-0.5 ${cfg.msgLight} ${cfg.msgDark}`}
                    >
                      {d.msg}
                    </p>
                    <button
                      className={`mt-2.5 text-xs font-semibold text-white px-3 py-1.5 rounded-lg transition-colors ${cfg.btnBg} ${cfg.btnHover}`}
                    >
                      {d.btn}
                    </button>
                  </div>
                </div>
              );
            })}
          </ShowcaseCard>

          {/* 3. With Link */}
          <ShowcaseCard
            label="With Link"
            description="Inline anchor button that navigates without dismissing"
            badge="link"
          >
            {[
              {
                type: "info" as AlertType,
                title: "Update available",
                msg: "Version 2.0 is ready to install.",
                link: "Release notes →",
              },
              {
                type: "success" as AlertType,
                title: "Report generated",
                msg: "Your Q3 summary is ready to download.",
                link: "Download PDF →",
              },
            ].map(({ type, title, msg, link }) => {
              const cfg = TYPE_CONFIG[type];
              return (
                <div
                  key={type}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border ${cfg.bgLight} ${cfg.bgDark} ${cfg.border} ${cfg.borderDark}`}
                >
                  <span
                    className={`mt-0.5 ${cfg.iconColor} ${cfg.iconColorDark}`}
                  >
                    {cfg.icon}
                  </span>
                  <div className="flex-1">
                    <p
                      className={`font-semibold text-sm ${cfg.titleLight} ${cfg.titleDark}`}
                    >
                      {title}
                    </p>
                    <p
                      className={`text-xs mt-0.5 ${cfg.msgLight} ${cfg.msgDark}`}
                    >
                      {msg}
                    </p>
                    <a
                      href="#"
                      className={`mt-2.5 inline-block text-xs font-semibold text-white px-3 py-1.5 rounded-lg transition-colors ${cfg.btnBg} ${cfg.btnHover}`}
                    >
                      {link}
                    </a>
                  </div>
                </div>
              );
            })}
          </ShowcaseCard>

          {/* 4. Custom Icons */}
          <ShowcaseCard
            label="Custom Icons"
            description="Override the default icon with any ReactNode"
            badge="icon prop"
          >
            {[
              {
                type: "success" as AlertType,
                icon: <Rocket className="w-5 h-5" />,
                title: "Deployed to production",
                msg: "Build #204 is live on all regions.",
              },
              {
                type: "error" as AlertType,
                icon: <WifiOff className="w-5 h-5" />,
                title: "Connection lost",
                msg: "Check your network and try again.",
              },
              {
                type: "info" as AlertType,
                icon: <Download className="w-5 h-5" />,
                title: "Download started",
                msg: "Your file will be ready shortly.",
              },
              {
                type: "warning" as AlertType,
                icon: <Trash2 className="w-5 h-5" />,
                title: "Permanent delete",
                msg: "This item will be removed forever.",
              },
              {
                type: "message" as AlertType,
                icon: <Sparkles className="w-5 h-5" />,
                title: "You unlocked a badge!",
                msg: "Welcome to the 100-day streak club.",
              },
            ].map(({ type, icon, title, msg }) => {
              const cfg = TYPE_CONFIG[type];
              return (
                <div
                  key={title}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border ${cfg.bgLight} ${cfg.bgDark} ${cfg.border} ${cfg.borderDark}`}
                >
                  <span
                    className={`mt-0.5 ${cfg.iconColor} ${cfg.iconColorDark}`}
                  >
                    {icon}
                  </span>
                  <div>
                    <p
                      className={`font-semibold text-sm ${cfg.titleLight} ${cfg.titleDark}`}
                    >
                      {title}
                    </p>
                    <p
                      className={`text-xs mt-0.5 ${cfg.msgLight} ${cfg.msgDark}`}
                    >
                      {msg}
                    </p>
                  </div>
                </div>
              );
            })}
          </ShowcaseCard>

          {/* 5. No close button / title only */}
          <ShowcaseCard
            label="Minimal Variants"
            description="Title-only and without close button"
            badge="minimal"
          >
            {[
              {
                type: "success" as AlertType,
                title: "Saved!",
                showClose: false,
              },
              {
                type: "info" as AlertType,
                title: "Syncing in background…",
                showClose: false,
              },
              {
                type: "error" as AlertType,
                title: "Failed to load data.",
                showClose: true,
              },
            ].map(({ type, title, showClose }) => {
              const cfg = TYPE_CONFIG[type];
              return (
                <div
                  key={title}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${cfg.bgLight} ${cfg.bgDark} ${cfg.border} ${cfg.borderDark}`}
                >
                  <span className={`${cfg.iconColor} ${cfg.iconColorDark}`}>
                    {cfg.icon}
                  </span>
                  <p
                    className={`font-semibold text-sm flex-1 ${cfg.titleLight} ${cfg.titleDark}`}
                  >
                    {title}
                  </p>
                  {showClose && (
                    <X
                      className={`w-4 h-4 ${cfg.iconColor} ${cfg.iconColorDark} opacity-60`}
                    />
                  )}
                </div>
              );
            })}
          </ShowcaseCard>

          {/* 6. Persistent */}
          <ShowcaseCard
            label="Persistent (duration: 0)"
            description="Never auto-dismisses — user must close manually"
            badge="duration: 0"
            badgeColor="bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300"
          >
            {[
              {
                type: "error" as AlertType,
                icon: <WifiOff className="w-5 h-5" />,
                title: "No internet connection",
                msg: "Reconnect to resume syncing your data.",
              },
              {
                type: "warning" as AlertType,
                icon: <RefreshCw className="w-5 h-5" />,
                title: "Session expiring",
                msg: "You'll be logged out in 5 minutes.",
                btn: "Refresh session",
              },
            ].map(({ type, icon, title, msg, btn }) => {
              const cfg = TYPE_CONFIG[type];
              return (
                <div
                  key={title}
                  className={`relative flex items-start gap-3 p-3.5 rounded-xl border ${cfg.bgLight} ${cfg.bgDark} ${cfg.border} ${cfg.borderDark}`}
                >
                  <span
                    className={`mt-0.5 ${cfg.iconColor} ${cfg.iconColorDark}`}
                  >
                    {icon}
                  </span>
                  <div className="flex-1">
                    <p
                      className={`font-semibold text-sm ${cfg.titleLight} ${cfg.titleDark}`}
                    >
                      {title}
                    </p>
                    <p
                      className={`text-xs mt-0.5 ${cfg.msgLight} ${cfg.msgDark}`}
                    >
                      {msg}
                    </p>
                    {btn && (
                      <button
                        className={`mt-2.5 text-xs font-semibold text-white px-3 py-1.5 rounded-lg transition-colors ${cfg.btnBg} ${cfg.btnHover}`}
                      >
                        {btn}
                      </button>
                    )}
                  </div>
                  <X
                    className={`w-4 h-4 shrink-0 ${cfg.iconColor} ${cfg.iconColorDark} opacity-60`}
                  />
                </div>
              );
            })}
          </ShowcaseCard>

          {/* 7. Stack / multiple alerts */}
          <ShowcaseCard
            label="Stacked Alerts"
            description="Multiple alerts render as a grouped stack per position"
            badge="AnimatePresence"
          >
            <div className="flex flex-col gap-2.5">
              {[
                { type: "success" as AlertType, title: "Image uploaded" },
                {
                  type: "info" as AlertType,
                  title: "Processing file…",
                  msg: "This may take a moment.",
                },
                {
                  type: "warning" as AlertType,
                  title: "Low disk space",
                  msg: "2.1 GB remaining.",
                },
              ].map(({ type, title, msg }) => {
                const cfg = TYPE_CONFIG[type];
                return (
                  <div
                    key={title}
                    className={`flex items-start gap-3 px-3.5 py-3 rounded-xl border ${cfg.bgLight} ${cfg.bgDark} ${cfg.border} ${cfg.borderDark}`}
                  >
                    <span
                      className={`mt-0.5 ${cfg.iconColor} ${cfg.iconColorDark}`}
                    >
                      {cfg.icon}
                    </span>
                    <div>
                      <p
                        className={`font-semibold text-sm ${cfg.titleLight} ${cfg.titleDark}`}
                      >
                        {title}
                      </p>
                      {msg && (
                        <p
                          className={`text-xs mt-0.5 ${cfg.msgLight} ${cfg.msgDark}`}
                        >
                          {msg}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </ShowcaseCard>

          {/* 8. Positions reference */}
          <ShowcaseCard
            label="Position Reference"
            description="9 screen positions + auto → defaults to top-right"
            badge="9 positions"
          >
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              {(
                [
                  "top-left",
                  "top-center",
                  "top-right",
                  "middle-left",
                  "middle-center",
                  "middle-right",
                  "bottom-left",
                  "bottom-center",
                  "bottom-right",
                ] as AlertPosition[]
              ).map((pos) => (
                <div
                  key={pos}
                  className="bg-slate-100 dark:bg-slate-700/60 rounded-lg px-2 py-1.5 text-center font-mono text-slate-600 dark:text-slate-300 text-[10px]"
                >
                  {pos}
                </div>
              ))}
            </div>
            <div className="bg-slate-100 dark:bg-slate-700/60 rounded-lg px-2 py-1.5 text-center font-mono text-slate-600 dark:text-slate-300 text-[10px]">
              auto → top-right
            </div>
          </ShowcaseCard>

          {/* 9. Real-world scenarios */}
          <ShowcaseCard
            label="Real-World Scenarios"
            description="Common production patterns"
            badge="patterns"
          >
            {[
              {
                type: "success" as AlertType,
                icon: <CheckCircle className="w-5 h-5" />,
                title: "Payment received · $49.00",
                msg: "Receipt sent to you@example.com",
                link: "View invoice →",
              },
              {
                type: "warning" as AlertType,
                icon: <AlertCircle className="w-5 h-5" />,
                title: "Unsaved changes",
                msg: "Leave page? Your edits will be lost.",
                btn: "Save draft",
              },
              {
                type: "message" as AlertType,
                icon: <Bell className="w-5 h-5" />,
                title: "3 new notifications",
                msg: "Mia, Lucas, and 1 other liked your post.",
                link: "View all →",
              },
              {
                type: "info" as AlertType,
                icon: <Wifi className="w-5 h-5" />,
                title: "Reconnected",
                msg: "You're back online. Syncing data…",
              },
            ].map(({ type, icon, title, msg, link, btn }) => {
              const cfg = TYPE_CONFIG[type];
              return (
                <div
                  key={title}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border ${cfg.bgLight} ${cfg.bgDark} ${cfg.border} ${cfg.borderDark}`}
                >
                  <span
                    className={`mt-0.5 ${cfg.iconColor} ${cfg.iconColorDark}`}
                  >
                    {icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-semibold text-sm ${cfg.titleLight} ${cfg.titleDark}`}
                    >
                      {title}
                    </p>
                    {msg && (
                      <p
                        className={`text-xs mt-0.5 ${cfg.msgLight} ${cfg.msgDark}`}
                      >
                        {msg}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-0">
                      {btn && (
                        <button
                          className={`mt-2 text-xs font-semibold text-white px-3 py-1.5 rounded-lg transition-colors ${cfg.btnBg} ${cfg.btnHover}`}
                        >
                          {btn}
                        </button>
                      )}
                      {link && (
                        <a
                          href="#"
                          className={`mt-2 inline-block text-xs font-semibold text-white px-3 py-1.5 rounded-lg transition-colors ${cfg.btnBg} ${cfg.btnHover}`}
                        >
                          {link}
                        </a>
                      )}
                    </div>
                  </div>
                  <X
                    className={`w-4 h-4 shrink-0 mt-0.5 ${cfg.iconColor} ${cfg.iconColorDark} opacity-50`}
                  />
                </div>
              );
            })}
          </ShowcaseCard>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-xs text-slate-400 dark:text-slate-600 pb-6"
          >
            Alert Component · React · Tailwind CSS · Framer Motion ·
            lucide-react
          </motion.p>
        </div>
      </div>
    </div>
  );
}
