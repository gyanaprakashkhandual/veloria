"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle, XCircle, AlertCircle, Info, X,
  Rocket, Bell, Wifi, WifiOff, Trash2, Download,
  RefreshCw, Sparkles, Moon, Sun,
} from "lucide-react";

// ─── YOUR MarkdownRenderer ────────────────────────────────────────────────────
import MarkdownRenderer from "../../../components/markdown/Markdown.render";
// If your prop is named differently, e.g. `markdown` or `children`, find-replace
// `content={MD_` → `yourPropName={MD_` throughout this file.
// ─────────────────────────────────────────────────────────────────────────────

// ─── Types (mirror Alert.context.tsx — no duplication in your real app) ──────
type AlertType = "success" | "error" | "warning" | "info" | "message";
type AlertPosition =
  | "top-left" | "top-center" | "top-right"
  | "middle-left" | "middle-center" | "middle-right"
  | "bottom-left" | "bottom-center" | "bottom-right"
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

// ═══════════════════════════════════════════════════════════════════════════════
// MARKDOWN CONTENT STRINGS
// Each string maps to one <MarkdownRenderer> block in the page below.
// ═══════════════════════════════════════════════════════════════════════════════

const MD_INTRO = `# Alert Component

A fully-featured, animated alert/toast notification system built with **React**, **Framer Motion**, and **Tailwind CSS**. Supports 5 alert types, 9 positions, actions, links, custom icons, and auto-dismiss.`;

const MD_INSTALL = `## Installation

\`\`\`bash
npm install framer-motion lucide-react
\`\`\``;

const MD_SETUP = `## Setup

Wrap your app root with \`AlertProvider\` and place \`AlertContainer\` once at the top level:

\`\`\`tsx
import { AlertProvider } from "@/context/alert/Alert.context";
import AlertContainer from "@/components/ui/Alert.ui";

export default function App({ children }) {
  return (
    <AlertProvider>
      {children}
      <AlertContainer />
    </AlertProvider>
  );
}
\`\`\``;

const MD_USAGE = `## Basic Usage

\`\`\`tsx
import { useAlert } from "@/context/alert/Alert.context";

function MyComponent() {
  const { addAlert, removeAlert, clearAll } = useAlert();

  const showSuccess = () => {
    addAlert({
      type: "success",
      title: "Saved!",
      message: "Your changes have been saved successfully.",
      duration: 4000,
      position: "top-right",
    });
  };

  return <button onClick={showSuccess}>Save</button>;
}
\`\`\``;

const MD_TYPES = `## Alert Types

| Type      | Color  | Icon           | Use Case                        |
|-----------|--------|----------------|---------------------------------|
| \`success\` | Green  | ✅ CheckCircle | Confirmations, completions      |
| \`error\`   | Red    | ❌ XCircle     | Failures, validation errors     |
| \`warning\` | Yellow | ⚠️ AlertCircle | Cautions, destructive actions   |
| \`info\`    | Blue   | ℹ️ Info        | Neutral information             |
| \`message\` | Gray   | 💬 Bell        | General messages, notifications |`;

const MD_POSITIONS = `## Positions

9 placement options plus \`auto\` (defaults to \`top-right\`):

\`\`\`
top-left      top-center      top-right
middle-left   middle-center   middle-right
bottom-left   bottom-center   bottom-right
auto  →  top-right
\`\`\``;

const MD_PROPS = `## AlertConfig Props

| Prop              | Type                  | Default        | Description                            |
|-------------------|-----------------------|----------------|----------------------------------------|
| \`type\`            | \`AlertType\`           | —              | Alert variant                          |
| \`title\`           | \`string\`              | —              | Bold heading text                      |
| \`message\`         | \`string\`              | —              | Supporting body text                   |
| \`duration\`        | \`number\` (ms)         | \`5000\`         | \`0\` = persistent (no auto-dismiss)     |
| \`position\`        | \`AlertPosition\`       | \`"top-right"\`  | Where the alert appears on screen      |
| \`showCloseButton\` | \`boolean\`             | \`true\`         | Show × dismiss button                  |
| \`action\`          | \`{ label, onClick }\`  | —              | Primary action button                  |
| \`link\`            | \`{ label, href }\`     | —              | Anchor link button                     |
| \`customClassName\` | \`string\`              | —              | Extra Tailwind classes on the wrapper  |
| \`icon\`            | \`ReactNode\`           | —              | Override the default type icon         |
| \`onClose\`         | \`() => void\`          | —              | Callback fired when alert is dismissed |`;

const MD_CONTEXT = `## Context API

\`\`\`tsx
const { alerts, addAlert, removeAlert, clearAll } = useAlert();
\`\`\`

| Method        | Signature                                     | Returns    |
|---------------|-----------------------------------------------|------------|
| \`addAlert\`    | \`(config: Omit<AlertConfig, "id">) => string\` | Alert \`id\` |
| \`removeAlert\` | \`(id: string) => void\`                        | —          |
| \`clearAll\`    | \`() => void\`                                  | —          |`;

const MD_EXAMPLES = `## Code Examples

### With Action Button

\`\`\`tsx
addAlert({
  type: "warning",
  title: "Delete file?",
  message: "This action cannot be undone.",
  duration: 0,
  action: {
    label: "Delete",
    onClick: () => handleDelete(),
  },
});
\`\`\`

### With Link

\`\`\`tsx
addAlert({
  type: "info",
  title: "Update available",
  message: "Version 2.0 is ready.",
  link: { label: "Release notes", href: "/changelog" },
});
\`\`\`

### Persistent (no auto-dismiss)

\`\`\`tsx
addAlert({
  type: "error",
  title: "Connection lost",
  message: "Check your network and try again.",
  duration: 0,
  showCloseButton: true,
});
\`\`\`

### Custom Icon

\`\`\`tsx
import { Rocket } from "lucide-react";

addAlert({
  type: "success",
  title: "Deployed!",
  icon: <Rocket className="w-5 h-5" />,
});
\`\`\``;

const MD_ANIMATION = `## Animation

Alerts animate in and out using Framer Motion spring physics:

\`\`\`ts
transition: { type: "spring", stiffness: 300, damping: 30 }
\`\`\`

\`AnimatePresence\` handles exit animations automatically when alerts leave the DOM.`;

const MD_NOTES = `## Notes

- Multiple alerts stack per position group with \`gap-3\` spacing.
- \`AlertContainer\` renders with \`position: fixed\` and \`z-50\` — outside normal document flow.
- Alerts with \`duration > 0\` return an \`id\` for manual early dismissal via \`removeAlert(id)\`.`;

// ═══════════════════════════════════════════════════════════════════════════════
// TYPE CONFIG  (visual tokens per alert type)
// ═══════════════════════════════════════════════════════════════════════════════

const TYPE_CFG: Record<AlertType, {
  bg: string; border: string;
  icon: string; title: string; msg: string;
  btn: string; btnHover: string;
  node: React.ReactNode;
  progress: string;
}> = {
  success: {
    bg: "bg-green-50 dark:bg-green-950/40",
    border: "border-green-200 dark:border-green-700/50",
    icon: "text-green-600 dark:text-green-400",
    title: "text-green-900 dark:text-green-100",
    msg: "text-green-700 dark:text-green-300",
    btn: "bg-green-600", btnHover: "hover:bg-green-700",
    node: <CheckCircle className="w-5 h-5" />,
    progress: "bg-green-500",
  },
  error: {
    bg: "bg-red-50 dark:bg-red-950/40",
    border: "border-red-200 dark:border-red-700/50",
    icon: "text-red-600 dark:text-red-400",
    title: "text-red-900 dark:text-red-100",
    msg: "text-red-700 dark:text-red-300",
    btn: "bg-red-600", btnHover: "hover:bg-red-700",
    node: <XCircle className="w-5 h-5" />,
    progress: "bg-red-500",
  },
  warning: {
    bg: "bg-yellow-50 dark:bg-yellow-950/40",
    border: "border-yellow-200 dark:border-yellow-700/50",
    icon: "text-yellow-600 dark:text-yellow-400",
    title: "text-yellow-900 dark:text-yellow-100",
    msg: "text-yellow-700 dark:text-yellow-300",
    btn: "bg-yellow-500", btnHover: "hover:bg-yellow-600",
    node: <AlertCircle className="w-5 h-5" />,
    progress: "bg-yellow-500",
  },
  info: {
    bg: "bg-blue-50 dark:bg-blue-950/40",
    border: "border-blue-200 dark:border-blue-700/50",
    icon: "text-blue-600 dark:text-blue-400",
    title: "text-blue-900 dark:text-blue-100",
    msg: "text-blue-700 dark:text-blue-300",
    btn: "bg-blue-600", btnHover: "hover:bg-blue-700",
    node: <Info className="w-5 h-5" />,
    progress: "bg-blue-500",
  },
  message: {
    bg: "bg-gray-50 dark:bg-gray-800/60",
    border: "border-gray-200 dark:border-gray-600/50",
    icon: "text-gray-600 dark:text-gray-400",
    title: "text-gray-900 dark:text-gray-100",
    msg: "text-gray-700 dark:text-gray-300",
    btn: "bg-gray-600", btnHover: "hover:bg-gray-700",
    node: <Bell className="w-5 h-5" />,
    progress: "bg-gray-500",
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// SHARED PREVIEW WRAPPER
// Wraps every live example with a labelled card + show/hide code toggle
// ═══════════════════════════════════════════════════════════════════════════════

const Preview: React.FC<{
  title: string;
  code: string;
  badge?: string;
  badgeColor?: string;
  children: React.ReactNode;
}> = ({ title, code, badge, badgeColor = "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300", children }) => {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="font-semibold text-sm text-slate-900 dark:text-white">{title}</span>
          {badge && (
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${badgeColor}`}>
              {badge}
            </span>
          )}
        </div>
        <button
          onClick={() => setOpen(v => !v)}
          className="text-[11px] font-medium text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors flex items-center gap-1"
        >
          {open ? "Hide code" : "Show code"}
          <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
            ↓
          </motion.span>
        </button>
      </div>

      {/* Live preview area */}
      <div className="p-5 flex flex-col gap-3">{children}</div>

      {/* Code block */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-t border-slate-100 dark:border-slate-700/60"
          >
            <pre className="p-5 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 overflow-x-auto font-mono">
              {code}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// LIVE ALERT ITEM  (self-contained for the playground — with progress bar)
// ═══════════════════════════════════════════════════════════════════════════════

const LiveAlertItem: React.FC<{ alert: AlertConfig; onClose: () => void }> = ({ alert, onClose }) => {
  const c = TYPE_CFG[alert.type];
  const [progress, setProgress] = React.useState(100);
  const duration = alert.duration ?? 5000;

  React.useEffect(() => {
    if (!duration || duration <= 0) return;
    const start = Date.now();
    const iv = setInterval(() => {
      const pct = Math.max(0, 100 - ((Date.now() - start) / duration) * 100);
      setProgress(pct);
      if (pct === 0) clearInterval(iv);
    }, 16);
    const t = setTimeout(onClose, duration);
    return () => { clearInterval(iv); clearTimeout(t); };
  }, [duration, onClose]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -14, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.97 }}
      transition={{ type: "spring", stiffness: 340, damping: 28 }}
      className={`relative rounded-xl border shadow-md overflow-hidden w-full ${c.bg} ${c.border} backdrop-blur-sm`}
    >
      {duration > 0 && (
        <div className={`absolute top-0 left-0 h-0.5 ${c.progress} transition-none`} style={{ width: `${progress}%` }} />
      )}
      <div className="p-4 flex gap-3 items-start">
        <motion.span
          initial={{ scale: 0.4, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.04, type: "spring", stiffness: 420, damping: 18 }}
          className={`shrink-0 mt-0.5 ${c.icon}`}
        >
          {alert.icon ?? c.node}
        </motion.span>
        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-sm leading-snug ${c.title}`}>{alert.title}</p>
          {alert.message && <p className={`text-sm mt-1 leading-relaxed ${c.msg}`}>{alert.message}</p>}
          {(alert.action || alert.link) && (
            <div className="flex flex-wrap gap-2 mt-3">
              {alert.action && (
                <button
                  onClick={() => { alert.action?.onClick(); onClose(); }}
                  className={`text-xs font-semibold text-white px-3 py-1.5 rounded-lg transition-all active:scale-95 ${c.btn} ${c.btnHover}`}
                >
                  {alert.action.label}
                </button>
              )}
              {alert.link && (
                <a href={alert.link.href} className={`text-xs font-semibold text-white px-3 py-1.5 rounded-lg transition-all active:scale-95 ${c.btn} ${c.btnHover}`}>
                  {alert.link.label}
                </a>
              )}
            </div>
          )}
        </div>
        {alert.showCloseButton !== false && (
          <button
            onClick={onClose}
            aria-label="Dismiss"
            className={`shrink-0 p-1 rounded-md transition-all active:scale-90 ${c.icon} hover:bg-black/10 dark:hover:bg-white/10`}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// LIVE PLAYGROUND
// ═══════════════════════════════════════════════════════════════════════════════

const LivePlayground: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertConfig[]>([]);

  const add = useCallback((config: Omit<AlertConfig, "id">) => {
    const id = `alert-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setAlerts(prev => [...prev, { ...config, id, showCloseButton: config.showCloseButton !== false }]);
  }, []);

  const remove = useCallback((id: string) => setAlerts(prev => prev.filter(a => a.id !== id)), []);

  const DEMOS = [
    { label: "Success", color: "bg-green-600 hover:bg-green-700", config: { type: "success" as AlertType, title: "Changes saved!", message: "Your profile has been updated successfully.", duration: 4000 } },
    { label: "Error",   color: "bg-red-600 hover:bg-red-700",     config: { type: "error" as AlertType,   title: "Upload failed",    message: "File exceeds the 10 MB limit.",            duration: 5000 } },
    { label: "Warning", color: "bg-yellow-500 hover:bg-yellow-600", config: { type: "warning" as AlertType, title: "Storage almost full", message: "You've used 95% of your quota.", duration: 5000 } },
    { label: "Info",    color: "bg-blue-600 hover:bg-blue-700",    config: { type: "info" as AlertType,    title: "Maintenance window",  message: "Downtime tonight 2–3 AM UTC.",             duration: 5000 } },
    { label: "Message", color: "bg-slate-600 hover:bg-slate-700",  config: { type: "message" as AlertType, title: "New message from Alex", message: "Hey! Free for a quick call?",           duration: 4000 } },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800/60 overflow-hidden shadow-sm">
      <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <div>
          <p className="font-semibold text-sm text-slate-900 dark:text-white">Live Playground</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Click to fire real alerts with progress timers</p>
        </div>
        {alerts.length > 0 && (
          <button onClick={() => setAlerts([])} className="text-xs text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors underline underline-offset-2">
            Clear all
          </button>
        )}
      </div>
      <div className="p-5">
        <div className="flex flex-wrap gap-2 mb-5">
          {DEMOS.map(d => (
            <motion.button
              key={d.label}
              whileTap={{ scale: 0.92 }}
              onClick={() => add(d.config)}
              className={`text-xs font-semibold text-white px-3.5 py-2 rounded-lg transition-colors ${d.color}`}
            >
              {d.label}
            </motion.button>
          ))}
        </div>
        <div className="flex flex-col gap-2.5">
          <AnimatePresence initial={false}>
            {alerts.map(alert => (
              <LiveAlertItem key={alert.id} alert={alert} onClose={() => remove(alert.id)} />
            ))}
          </AnimatePresence>
          {alerts.length === 0 && (
            <p className="text-xs text-center text-slate-400 dark:text-slate-600 py-5">
              No active alerts — try the buttons above
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION PREVIEWS  (one component per showcase section)
// ═══════════════════════════════════════════════════════════════════════════════

const AllTypesPreview: React.FC = () => {
  const rows: Array<{ type: AlertType; title: string; msg: string }> = [
    { type: "success", title: "Operation successful",  msg: "Your data has been saved to the cloud." },
    { type: "error",   title: "Something went wrong",  msg: "Failed to connect to the server." },
    { type: "warning", title: "Proceed with caution",  msg: "This action is irreversible." },
    { type: "info",    title: "Here's some information", msg: "Scheduled maintenance on Sunday." },
    { type: "message", title: "You have a new message", msg: "Jake left a comment on your post." },
  ];
  return (
    <Preview title="All Types" code={`addAlert({ type: "success", title: "Operation successful", message: "..." });
addAlert({ type: "error",   title: "Something went wrong", message: "..." });
addAlert({ type: "warning", title: "Proceed with caution", message: "..." });
addAlert({ type: "info",    title: "Here's some information", message: "..." });
addAlert({ type: "message", title: "You have a new message", message: "..." });`}
      badge="5 variants"
    >
      {rows.map(({ type, title, msg }) => {
        const c = TYPE_CFG[type];
        return (
          <div key={type} className={`flex items-start gap-3 p-3.5 rounded-xl border ${c.bg} ${c.border}`}>
            <span className={`mt-0.5 ${c.icon}`}>{c.node}</span>
            <div>
              <p className={`font-semibold text-sm ${c.title}`}>{title}</p>
              <p className={`text-xs mt-0.5 ${c.msg}`}>{msg}</p>
            </div>
          </div>
        );
      })}
    </Preview>
  );
};

const WithActionPreview: React.FC = () => {
  const c = TYPE_CFG["warning"];
  return (
    <Preview
      title="With Action Button"
      badge="action prop"
      code={`addAlert({
  type: "warning",
  title: "Delete file?",
  message: "This action cannot be undone.",
  duration: 0,
  action: {
    label: "Delete",
    onClick: () => handleDelete(),
  },
});`}
    >
      <div className={`flex items-start gap-3 p-3.5 rounded-xl border ${c.bg} ${c.border}`}>
        <span className={`mt-0.5 ${c.icon}`}>{c.node}</span>
        <div className="flex-1">
          <p className={`font-semibold text-sm ${c.title}`}>Delete file?</p>
          <p className={`text-xs mt-0.5 ${c.msg}`}>This action cannot be undone.</p>
          <button className={`mt-2.5 text-xs font-semibold text-white px-3 py-1.5 rounded-lg transition-colors ${c.btn} ${c.btnHover}`}>
            Delete
          </button>
        </div>
        <X className={`w-4 h-4 shrink-0 ${c.icon} opacity-60`} />
      </div>
    </Preview>
  );
};

const WithLinkPreview: React.FC = () => {
  const c = TYPE_CFG["info"];
  return (
    <Preview
      title="With Link"
      badge="link prop"
      code={`addAlert({
  type: "info",
  title: "Update available",
  message: "Version 2.0 is ready.",
  link: { label: "Release notes", href: "/changelog" },
});`}
    >
      <div className={`flex items-start gap-3 p-3.5 rounded-xl border ${c.bg} ${c.border}`}>
        <span className={`mt-0.5 ${c.icon}`}>{c.node}</span>
        <div className="flex-1">
          <p className={`font-semibold text-sm ${c.title}`}>Update available</p>
          <p className={`text-xs mt-0.5 ${c.msg}`}>Version 2.0 is ready.</p>
          <a href="#" className={`mt-2.5 inline-block text-xs font-semibold text-white px-3 py-1.5 rounded-lg transition-colors ${c.btn} ${c.btnHover}`}>
            Release notes
          </a>
        </div>
        <X className={`w-4 h-4 shrink-0 ${c.icon} opacity-60`} />
      </div>
    </Preview>
  );
};

const CustomIconPreview: React.FC = () => {
  const items: Array<{ type: AlertType; icon: React.ReactNode; title: string; msg: string }> = [
    { type: "success", icon: <Rocket className="w-5 h-5" />,   title: "Deployed to production", msg: "Build #204 is live on all regions." },
    { type: "error",   icon: <WifiOff className="w-5 h-5" />,  title: "Connection lost",         msg: "Check your network and try again." },
    { type: "info",    icon: <Download className="w-5 h-5" />, title: "Download started",         msg: "Your file will be ready shortly." },
    { type: "warning", icon: <Trash2 className="w-5 h-5" />,   title: "Permanent delete",         msg: "This item will be removed forever." },
    { type: "message", icon: <Sparkles className="w-5 h-5" />, title: "You unlocked a badge!",    msg: "Welcome to the 100-day streak club." },
  ];
  return (
    <Preview
      title="Custom Icons"
      badge="icon prop"
      code={`import { Rocket } from "lucide-react";

addAlert({
  type: "success",
  title: "Deployed to production",
  message: "Build #204 is live on all regions.",
  icon: <Rocket className="w-5 h-5" />,
});`}
    >
      {items.map(({ type, icon, title, msg }) => {
        const c = TYPE_CFG[type];
        return (
          <div key={title} className={`flex items-start gap-3 p-3.5 rounded-xl border ${c.bg} ${c.border}`}>
            <span className={`mt-0.5 ${c.icon}`}>{icon}</span>
            <div>
              <p className={`font-semibold text-sm ${c.title}`}>{title}</p>
              <p className={`text-xs mt-0.5 ${c.msg}`}>{msg}</p>
            </div>
          </div>
        );
      })}
    </Preview>
  );
};

const PersistentPreview: React.FC = () => {
  const c = TYPE_CFG["error"];
  return (
    <Preview
      title="Persistent — duration: 0"
      badge="no auto-dismiss"
      badgeColor="bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300"
      code={`addAlert({
  type: "error",
  title: "Connection lost",
  message: "Check your network and try again.",
  duration: 0, // ← never auto-dismisses
  showCloseButton: true,
});`}
    >
      <div className={`flex items-start gap-3 p-3.5 rounded-xl border ${c.bg} ${c.border}`}>
        <span className={`mt-0.5 ${c.icon}`}><WifiOff className="w-5 h-5" /></span>
        <div className="flex-1">
          <p className={`font-semibold text-sm ${c.title}`}>Connection lost</p>
          <p className={`text-xs mt-0.5 ${c.msg}`}>Check your network and try again.</p>
        </div>
        <X className={`w-4 h-4 shrink-0 ${c.icon} opacity-60`} />
      </div>
      <p className="text-xs text-slate-400 dark:text-slate-500 pl-1">
        ↑ No progress bar. Will not dismiss until the user clicks ×.
      </p>
    </Preview>
  );
};

const MinimalPreview: React.FC = () => (
  <Preview
    title="Minimal Variants"
    badge="title-only"
    code={`// Title only
addAlert({ type: "success", title: "Saved!", duration: 2000 });

// No close button
addAlert({ type: "info", title: "Syncing…", showCloseButton: false });`}
  >
    {[
      { type: "success" as AlertType, title: "Saved!",                showClose: false },
      { type: "info"    as AlertType, title: "Syncing in background…", showClose: false },
      { type: "error"   as AlertType, title: "Failed to load data.",   showClose: true  },
    ].map(({ type, title, showClose }) => {
      const c = TYPE_CFG[type];
      return (
        <div key={title} className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${c.bg} ${c.border}`}>
          <span className={c.icon}>{c.node}</span>
          <p className={`font-semibold text-sm flex-1 ${c.title}`}>{title}</p>
          {showClose && <X className={`w-4 h-4 ${c.icon} opacity-60`} />}
        </div>
      );
    })}
  </Preview>
);

const StackedPreview: React.FC = () => (
  <Preview
    title="Stacked Alerts"
    badge="AnimatePresence"
    code={`// Multiple addAlert() calls stack per position group
addAlert({ type: "success", title: "Image uploaded" });
addAlert({ type: "info",    title: "Processing file…", message: "This may take a moment." });
addAlert({ type: "warning", title: "Low disk space",   message: "2.1 GB remaining." });`}
  >
    {[
      { type: "success" as AlertType, title: "Image uploaded",    msg: undefined },
      { type: "info"    as AlertType, title: "Processing file…",  msg: "This may take a moment." },
      { type: "warning" as AlertType, title: "Low disk space",    msg: "2.1 GB remaining." },
    ].map(({ type, title, msg }) => {
      const c = TYPE_CFG[type];
      return (
        <div key={title} className={`flex items-start gap-3 px-3.5 py-3 rounded-xl border ${c.bg} ${c.border}`}>
          <span className={`mt-0.5 ${c.icon}`}>{c.node}</span>
          <div>
            <p className={`font-semibold text-sm ${c.title}`}>{title}</p>
            {msg && <p className={`text-xs mt-0.5 ${c.msg}`}>{msg}</p>}
          </div>
        </div>
      );
    })}
  </Preview>
);

const RealWorldPreview: React.FC = () => (
  <Preview
    title="Real-World Scenarios"
    badge="patterns"
    code={`// Payment confirmation
addAlert({ type: "success", title: "Payment received · $49.00", message: "Receipt sent to you@example.com", link: { label: "View invoice", href: "/invoice" } });

// Unsaved changes guard
addAlert({ type: "warning", title: "Unsaved changes", message: "Leave page? Your edits will be lost.", action: { label: "Save draft", onClick: saveDraft } });

// Reconnect
addAlert({ type: "info", title: "Reconnected", message: "You're back online. Syncing data…" });`}
  >
    {[
      { type: "success" as AlertType, icon: <CheckCircle className="w-5 h-5" />, title: "Payment received · $49.00", msg: "Receipt sent to you@example.com", link: "View invoice →" },
      { type: "warning" as AlertType, icon: <AlertCircle  className="w-5 h-5" />, title: "Unsaved changes",           msg: "Leave page? Your edits will be lost.", btn: "Save draft" },
      { type: "message" as AlertType, icon: <Bell         className="w-5 h-5" />, title: "3 new notifications",       msg: "Mia, Lucas, and 1 other liked your post.", link: "View all →" },
      { type: "info"    as AlertType, icon: <Wifi         className="w-5 h-5" />, title: "Reconnected",               msg: "You're back online. Syncing data…" },
    ].map(({ type, icon, title, msg, link, btn }) => {
      const c = TYPE_CFG[type];
      return (
        <div key={title} className={`flex items-start gap-3 p-3.5 rounded-xl border ${c.bg} ${c.border}`}>
          <span className={`mt-0.5 ${c.icon}`}>{icon}</span>
          <div className="flex-1 min-w-0">
            <p className={`font-semibold text-sm ${c.title}`}>{title}</p>
            {msg && <p className={`text-xs mt-0.5 ${c.msg}`}>{msg}</p>}
            <div className="flex flex-wrap gap-2">
              {btn  && <button className={`mt-2 text-xs font-semibold text-white px-3 py-1.5 rounded-lg transition-colors ${c.btn} ${c.btnHover}`}>{btn}</button>}
              {link && <a href="#" className={`mt-2 inline-block text-xs font-semibold text-white px-3 py-1.5 rounded-lg transition-colors ${c.btn} ${c.btnHover}`}>{link}</a>}
            </div>
          </div>
          <X className={`w-4 h-4 shrink-0 mt-0.5 ${c.icon} opacity-50`} />
        </div>
      );
    })}
  </Preview>
);

// ═══════════════════════════════════════════════════════════════════════════════
// DOC PAGE  — MarkdownRenderer prose + live previews interleaved
// ═══════════════════════════════════════════════════════════════════════════════

export default function AlertDoc() {
  const [dark, setDark] = useState(false);

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-white dark:bg-slate-900 text-black dark:text-white transition-colors duration-300">

        {/* ── Sticky nav ── */}
        <nav className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 sm:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <span className="hover:text-slate-800 dark:hover:text-white cursor-pointer transition-colors">Docs</span>
            <span>/</span>
            <span className="text-slate-900 dark:text-white font-semibold">Alert</span>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setDark(d => !d)}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle theme"
          >
            <AnimatePresence mode="wait" initial={false}>
              {dark
                ? <motion.div key="sun"  initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}  transition={{ duration: 0.18 }}><Sun  className="w-4 h-4" /></motion.div>
                : <motion.div key="moon" initial={{ rotate:  90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}><Moon className="w-4 h-4" /></motion.div>
              }
            </AnimatePresence>
          </motion.button>
        </nav>

        {/* ── Body ── */}
        <div className="max-w-3xl mx-auto px-4 sm:px-8 py-10 space-y-8">

          {/* INTRO ── prose */}
          <MarkdownRenderer content={MD_INTRO} />

          {/* INSTALL ── prose */}
          <MarkdownRenderer content={MD_INSTALL} />

          {/* SETUP ── prose */}
          <MarkdownRenderer content={MD_SETUP} />

          {/* USAGE ── prose */}
          <MarkdownRenderer content={MD_USAGE} />

          {/* ── LIVE PLAYGROUND ── */}
          <LivePlayground />

          {/* TYPES ── prose table then live preview */}
          <MarkdownRenderer content={MD_TYPES} />
          <AllTypesPreview />

          {/* POSITIONS ── prose */}
          <MarkdownRenderer content={MD_POSITIONS} />

          {/* PROPS TABLE ── prose */}
          <MarkdownRenderer content={MD_PROPS} />

          {/* CONTEXT API ── prose */}
          <MarkdownRenderer content={MD_CONTEXT} />

          {/* CODE EXAMPLES ── prose + matching live previews interleaved */}
          <MarkdownRenderer content={MD_EXAMPLES} />
          <WithActionPreview />
          <WithLinkPreview />
          <CustomIconPreview />
          <PersistentPreview />
          <MinimalPreview />
          <StackedPreview />
          <RealWorldPreview />

          {/* ANIMATION ── prose */}
          <MarkdownRenderer content={MD_ANIMATION} />

          {/* NOTES ── prose */}
          <MarkdownRenderer content={MD_NOTES} />

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-xs text-slate-300 dark:text-slate-700 pt-4 pb-8"
          >
            Alert · React · Tailwind CSS · Framer Motion · lucide-react
          </motion.p>

        </div>
      </div>
    </div>
  );
}