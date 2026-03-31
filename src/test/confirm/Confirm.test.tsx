import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  Trash2,
  LogOut,
  Save,
  ShieldAlert,
  Zap,
  RefreshCw,
  Moon,
  Sun,
} from "lucide-react";
import { useConfirm } from "../../context/confirm/Confirm.context";

// ─── Types ────────────────────────────────────────────────────────────────────
type ModalType = "default" | "success" | "danger" | "warning" | "info";

interface UseCase {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  type: ModalType;
  title: string;
  message: string;
  confirmText: string;
  cancelText?: string;
  iconColor: string;
  badgeBg: string;
  badgeText: string;
}

// ─── Use Cases ────────────────────────────────────────────────────────────────
const USE_CASES: UseCase[] = [
  {
    id: "delete",
    label: "Delete Item",
    description: "Permanent record removal",
    icon: Trash2,
    type: "danger",
    title: "Delete this item?",
    message:
      "This action cannot be undone. The item will be permanently removed from your workspace.",
    confirmText: "Yes, delete",
    cancelText: "Keep it",
    iconColor: "text-red-500",
    badgeBg: "bg-red-100 dark:bg-red-900/30",
    badgeText: "text-red-600 dark:text-red-400",
  },
  {
    id: "logout",
    label: "Sign Out",
    description: "End the current session",
    icon: LogOut,
    type: "warning",
    title: "Sign out of TaskFlow?",
    message:
      "You'll be redirected to the login page. Any unsaved changes will be lost.",
    confirmText: "Sign out",
    cancelText: "Stay signed in",
    iconColor: "text-amber-500",
    badgeBg: "bg-amber-100 dark:bg-amber-900/30",
    badgeText: "text-amber-600 dark:text-amber-400",
  },
  {
    id: "save",
    label: "Save Changes",
    description: "Publish updates to production",
    icon: Save,
    type: "success",
    title: "Publish changes?",
    message:
      "Your edits will go live immediately and be visible to all users. Make sure everything looks right.",
    confirmText: "Publish now",
    cancelText: "Review first",
    iconColor: "text-green-500",
    badgeBg: "bg-green-100 dark:bg-green-900/30",
    badgeText: "text-green-600 dark:text-green-400",
  },
  {
    id: "info",
    label: "Learn More",
    description: "Acknowledge info before continuing",
    icon: Info,
    type: "info",
    title: "Before you continue",
    message:
      "This feature is in beta. You may encounter occasional bugs. Your feedback helps us improve.",
    confirmText: "Got it",
    cancelText: "Not now",
    iconColor: "text-blue-500",
    badgeBg: "bg-blue-100 dark:bg-blue-900/30",
    badgeText: "text-blue-600 dark:text-blue-400",
  },
  {
    id: "reset",
    label: "Reset Settings",
    description: "Restore all defaults",
    icon: RefreshCw,
    type: "warning",
    title: "Reset all settings?",
    message:
      "All your customizations — themes, preferences, and shortcuts — will revert to factory defaults.",
    confirmText: "Reset everything",
    iconColor: "text-amber-500",
    badgeBg: "bg-amber-100 dark:bg-amber-900/30",
    badgeText: "text-amber-600 dark:text-amber-400",
  },
  {
    id: "revoke",
    label: "Revoke Access",
    description: "Remove third-party permissions",
    icon: ShieldAlert,
    type: "danger",
    title: "Revoke app access?",
    message:
      "This will immediately disconnect the integration. Active syncs will stop and tokens will be invalidated.",
    confirmText: "Revoke access",
    cancelText: "Keep connected",
    iconColor: "text-red-500",
    badgeBg: "bg-red-100 dark:bg-red-900/30",
    badgeText: "text-red-600 dark:text-red-400",
  },
  {
    id: "upgrade",
    label: "Upgrade Plan",
    description: "Switch to a paid tier",
    icon: Zap,
    type: "default",
    title: "Upgrade to Pro?",
    message:
      "You'll be charged $12/month starting today. You can cancel anytime from your billing settings.",
    confirmText: "Upgrade now",
    cancelText: "Maybe later",
    iconColor: "text-blue-500",
    badgeBg: "bg-blue-100 dark:bg-blue-900/30",
    badgeText: "text-blue-600 dark:text-blue-400",
  },
  {
    id: "alert",
    label: "Critical Alert",
    description: "High-severity system warning",
    icon: AlertCircle,
    type: "danger",
    title: "Critical system action",
    message:
      "You're about to perform an irreversible system-level operation. This affects all team members immediately.",
    confirmText: "I understand, proceed",
    cancelText: "Abort",
    iconColor: "text-red-500",
    badgeBg: "bg-red-100 dark:bg-red-900/30",
    badgeText: "text-red-600 dark:text-red-400",
  },
];

// ─── Result Toast ──────────────────────────────────────────────────────────────
interface ToastMessage {
  id: string;
  label: string;
  confirmed: boolean;
}

function Toast({
  toast,
  onDismiss,
}: {
  toast: ToastMessage;
  onDismiss: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.96 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-100"
    >
      {toast.confirmed ? (
        <CheckCircle size={16} className="text-green-500 shrink-0" />
      ) : (
        <AlertTriangle size={16} className="text-zinc-400 shrink-0" />
      )}
      <span>
        <span className="font-semibold">{toast.label}</span> —{" "}
        {toast.confirmed ? "Confirmed ✓" : "Cancelled"}
      </span>
      <button
        onClick={onDismiss}
        className="ml-auto text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors text-xs"
      >
        ✕
      </button>
    </motion.div>
  );
}

// ─── Card ──────────────────────────────────────────────────────────────────────
function UseCaseCard({
  useCase,
  onTrigger,
}: {
  useCase: UseCase;
  onTrigger: (uc: UseCase) => void;
}) {
  const Icon = useCase.icon;
  return (
    <motion.button
      whileHover={{ y: -3, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={() => onTrigger(useCase)}
      className="group w-full text-left rounded-2xl border border-zinc-200 dark:border-zinc-700/60 bg-white dark:bg-zinc-800/60 p-5 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
    >
      <div className="flex items-start gap-4">
        {/* Icon bubble */}
        <div
          className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ${useCase.badgeBg}`}
        >
          <Icon size={20} className={useCase.iconColor} />
        </div>

        {/* Text */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm leading-tight">
              {useCase.label}
            </span>
            <span
              className={`shrink-0 text-[11px] font-medium px-2 py-0.5 rounded-full ${useCase.badgeBg} ${useCase.badgeText}`}
            >
              {useCase.type}
            </span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-snug">
            {useCase.description}
          </p>
        </div>
      </div>

      {/* Hover cue */}
      <div className="mt-4 flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
        <Zap size={11} />
        <span>Click to trigger modal</span>
      </div>
    </motion.button>
  );
}

// ─── Inner page (needs useConfirm hook) ───────────────────────────────────────
export default function ConfirmTestPage({
  dark,
  setDark,
}: {
  dark: boolean;
  setDark: (v: boolean) => void;
}) {
  const { showConfirm } = useConfirm();
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const dismiss = (id: string) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  const handleTrigger = async (uc: UseCase) => {
    const confirmed = await showConfirm({
      title: uc.title,
      message: uc.message,
      confirmText: uc.confirmText,
      cancelText: uc.cancelText,
      type: uc.type,
    });

    // Simulate async operation on confirm
    if (confirmed) {
      setLoadingId(uc.id);
      await new Promise((r) => setTimeout(r, 1200));
      setLoadingId(null);
    }

    const toastId = `${uc.id}-${Date.now()}`;
    setToasts((prev) => [
      { id: toastId, label: uc.label, confirmed },
      ...prev.slice(0, 4),
    ]);
    setTimeout(() => dismiss(toastId), 4000);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 transition-colors duration-300">
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-zinc-900 dark:bg-white flex items-center justify-center">
              <CheckCircle size={14} className="text-white dark:text-zinc-900" />
            </div>
            <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100 tracking-tight">
              ConfirmModal
              <span className="ml-1.5 text-[11px] font-normal text-zinc-400 dark:text-zinc-500">
                test suite
              </span>
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

      {/* ── Hero ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mb-2">
            All Use Cases
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xl leading-relaxed">
            Every card below triggers the{" "}
            <code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-700 dark:text-zinc-300">
              showConfirm()
            </code>{" "}
            hook with a different config. Confirm or cancel — the result appears
            as a toast.
          </p>
        </motion.div>

        {/* Stats strip */}
        <div className="mt-6 flex flex-wrap gap-3">
          {[
            { label: "Total cases", value: USE_CASES.length },
            { label: "Modal types", value: 5 },
            { label: "Promise-based", value: "✓" },
            { label: "Dark mode", value: "✓" },
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
      </div>

      {/* ── Grid ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-24">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.06 } },
          }}
        >
          {USE_CASES.map((uc) => (
            <motion.div
              key={uc.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              {loadingId === uc.id ? (
                <div className="w-full h-full min-h-30 rounded-2xl border border-zinc-200 dark:border-zinc-700/60 bg-white dark:bg-zinc-800/60 p-5 flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 text-zinc-400"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                </div>
              ) : (
                <UseCaseCard useCase={uc} onTrigger={handleTrigger} />
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* ── Modal type legend ── */}
        <div className="mt-12">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4">
            Modal type reference
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {(
              [
                {
                  type: "default",
                  icon: Info,
                  color: "text-blue-500",
                  bg: "bg-blue-50 dark:bg-blue-900/20",
                },
                {
                  type: "success",
                  icon: CheckCircle,
                  color: "text-green-500",
                  bg: "bg-green-50 dark:bg-green-900/20",
                },
                {
                  type: "danger",
                  icon: AlertCircle,
                  color: "text-red-500",
                  bg: "bg-red-50 dark:bg-red-900/20",
                },
                {
                  type: "warning",
                  icon: AlertTriangle,
                  color: "text-amber-500",
                  bg: "bg-amber-50 dark:bg-amber-900/20",
                },
                {
                  type: "info",
                  icon: Info,
                  color: "text-blue-500",
                  bg: "bg-blue-50 dark:bg-blue-900/20",
                },
              ] as const
            ).map((t) => {
              const TIcon = t.icon;
              return (
                <div
                  key={t.type}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2.5 ${t.bg}`}
                >
                  <TIcon size={14} className={t.color} />
                  <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 capitalize">
                    {t.type}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Toast stack ── */}
      <div className="fixed bottom-6 right-4 sm:right-6 z-60 flex flex-col gap-2 w-72 sm:w-80">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <Toast key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
