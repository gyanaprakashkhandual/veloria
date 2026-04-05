import React, { useEffect, useRef, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Info, CheckCircle2, AlertTriangle, XCircle, Bell } from "lucide-react";
import {
  useSnackbar,
  SnackbarProvider,
  type SnackbarItem,
  type SnackbarSize,
  type SnackbarVariant,
  type SnackbarSeverity,
  type SnackbarPosition,
  type SnackbarProviderProps,
} from "./Snackbar.context";

// ─── Size Config ──────────────────────────────────────────────────────────────

const sizeConfig: Record<
  SnackbarSize,
  {
    px: string;
    py: string;
    gap: string;
    iconSize: number;
    messageText: string;
    descText: string;
    actionText: string;
    closeBtnSize: string;
    closeIconSize: number;
    minWidth: string;
    maxWidth: string;
    progressH: string;
    borderRadius: string;
  }
> = {
  xs: {
    px: "px-3",
    py: "py-2",
    gap: "gap-2",
    iconSize: 14,
    messageText: "text-xs",
    descText: "text-[10px]",
    actionText: "text-[10px]",
    closeBtnSize: "w-4 h-4",
    closeIconSize: 10,
    minWidth: "min-w-[220px]",
    maxWidth: "max-w-[320px]",
    progressH: "h-0.5",
    borderRadius: "rounded-lg",
  },
  sm: {
    px: "px-3.5",
    py: "py-2.5",
    gap: "gap-2.5",
    iconSize: 15,
    messageText: "text-sm",
    descText: "text-xs",
    actionText: "text-xs",
    closeBtnSize: "w-5 h-5",
    closeIconSize: 11,
    minWidth: "min-w-[260px]",
    maxWidth: "max-w-[360px]",
    progressH: "h-0.5",
    borderRadius: "rounded-lg",
  },
  md: {
    px: "px-4",
    py: "py-3",
    gap: "gap-3",
    iconSize: 17,
    messageText: "text-sm",
    descText: "text-xs",
    actionText: "text-xs",
    closeBtnSize: "w-5 h-5",
    closeIconSize: 13,
    minWidth: "min-w-[300px]",
    maxWidth: "max-w-[420px]",
    progressH: "h-[3px]",
    borderRadius: "rounded-xl",
  },
  lg: {
    px: "px-5",
    py: "py-4",
    gap: "gap-3.5",
    iconSize: 19,
    messageText: "text-base",
    descText: "text-sm",
    actionText: "text-sm",
    closeBtnSize: "w-6 h-6",
    closeIconSize: 14,
    minWidth: "min-w-[340px]",
    maxWidth: "max-w-[480px]",
    progressH: "h-[3px]",
    borderRadius: "rounded-xl",
  },
};

// ─── Severity Config ──────────────────────────────────────────────────────────

type SeverityConfig = {
  icon: React.ReactNode;
  // per-variant class sets
  default: { wrapper: string; icon: string; message: string; desc: string; progress: string; close: string };
  filled:  { wrapper: string; icon: string; message: string; desc: string; progress: string; close: string };
  ghost:   { wrapper: string; icon: string; message: string; desc: string; progress: string; close: string };
  outline: { wrapper: string; icon: string; message: string; desc: string; progress: string; close: string };
};

function makeIcon(Component: React.ElementType, cls: string, size: number = 17) {
  return <Component size={size} className={cls} />;
}

const severityConfig: Record<SnackbarSeverity, Omit<SeverityConfig, "icon"> & { iconColor: string; DefaultIcon: React.ElementType }> = {
  info: {
    iconColor: "text-blue-500 dark:text-blue-400",
    DefaultIcon: Info,
    default: {
      wrapper: "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg shadow-black/8 dark:shadow-black/30",
      icon:    "text-blue-500 dark:text-blue-400",
      message: "text-gray-800 dark:text-gray-100",
      desc:    "text-gray-500 dark:text-gray-400",
      progress:"bg-blue-500 dark:bg-blue-400",
      close:   "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
    },
    filled: {
      wrapper: "bg-blue-500 dark:bg-blue-600 shadow-lg shadow-blue-500/25",
      icon:    "text-white/90",
      message: "text-white",
      desc:    "text-blue-100",
      progress:"bg-white/50",
      close:   "text-white/70 hover:text-white hover:bg-white/15",
    },
    ghost: {
      wrapper: "bg-blue-50 dark:bg-blue-950/40",
      icon:    "text-blue-500 dark:text-blue-400",
      message: "text-blue-900 dark:text-blue-100",
      desc:    "text-blue-600 dark:text-blue-400",
      progress:"bg-blue-400 dark:bg-blue-500",
      close:   "text-blue-400 hover:text-blue-600 dark:text-blue-500 dark:hover:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50",
    },
    outline: {
      wrapper: "bg-white dark:bg-gray-900 border-2 border-blue-400 dark:border-blue-500 shadow-md shadow-blue-500/10",
      icon:    "text-blue-500 dark:text-blue-400",
      message: "text-gray-800 dark:text-gray-100",
      desc:    "text-gray-500 dark:text-gray-400",
      progress:"bg-blue-500 dark:bg-blue-400",
      close:   "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
    },
  },
  success: {
    iconColor: "text-emerald-500 dark:text-emerald-400",
    DefaultIcon: CheckCircle2,
    default: {
      wrapper: "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg shadow-black/8 dark:shadow-black/30",
      icon:    "text-emerald-500 dark:text-emerald-400",
      message: "text-gray-800 dark:text-gray-100",
      desc:    "text-gray-500 dark:text-gray-400",
      progress:"bg-emerald-500 dark:bg-emerald-400",
      close:   "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
    },
    filled: {
      wrapper: "bg-emerald-500 dark:bg-emerald-600 shadow-lg shadow-emerald-500/25",
      icon:    "text-white/90",
      message: "text-white",
      desc:    "text-emerald-100",
      progress:"bg-white/50",
      close:   "text-white/70 hover:text-white hover:bg-white/15",
    },
    ghost: {
      wrapper: "bg-emerald-50 dark:bg-emerald-950/40",
      icon:    "text-emerald-500 dark:text-emerald-400",
      message: "text-emerald-900 dark:text-emerald-100",
      desc:    "text-emerald-600 dark:text-emerald-400",
      progress:"bg-emerald-400 dark:bg-emerald-500",
      close:   "text-emerald-400 hover:text-emerald-600 dark:text-emerald-500 dark:hover:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50",
    },
    outline: {
      wrapper: "bg-white dark:bg-gray-900 border-2 border-emerald-400 dark:border-emerald-500 shadow-md shadow-emerald-500/10",
      icon:    "text-emerald-500 dark:text-emerald-400",
      message: "text-gray-800 dark:text-gray-100",
      desc:    "text-gray-500 dark:text-gray-400",
      progress:"bg-emerald-500 dark:bg-emerald-400",
      close:   "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
    },
  },
  warning: {
    iconColor: "text-amber-500 dark:text-amber-400",
    DefaultIcon: AlertTriangle,
    default: {
      wrapper: "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg shadow-black/8 dark:shadow-black/30",
      icon:    "text-amber-500 dark:text-amber-400",
      message: "text-gray-800 dark:text-gray-100",
      desc:    "text-gray-500 dark:text-gray-400",
      progress:"bg-amber-500 dark:bg-amber-400",
      close:   "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
    },
    filled: {
      wrapper: "bg-amber-500 dark:bg-amber-600 shadow-lg shadow-amber-500/25",
      icon:    "text-white/90",
      message: "text-white",
      desc:    "text-amber-100",
      progress:"bg-white/50",
      close:   "text-white/70 hover:text-white hover:bg-white/15",
    },
    ghost: {
      wrapper: "bg-amber-50 dark:bg-amber-950/40",
      icon:    "text-amber-500 dark:text-amber-400",
      message: "text-amber-900 dark:text-amber-100",
      desc:    "text-amber-600 dark:text-amber-400",
      progress:"bg-amber-400 dark:bg-amber-500",
      close:   "text-amber-400 hover:text-amber-600 dark:text-amber-500 dark:hover:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50",
    },
    outline: {
      wrapper: "bg-white dark:bg-gray-900 border-2 border-amber-400 dark:border-amber-500 shadow-md shadow-amber-500/10",
      icon:    "text-amber-500 dark:text-amber-400",
      message: "text-gray-800 dark:text-gray-100",
      desc:    "text-gray-500 dark:text-gray-400",
      progress:"bg-amber-500 dark:bg-amber-400",
      close:   "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
    },
  },
  danger: {
    iconColor: "text-red-500 dark:text-red-400",
    DefaultIcon: XCircle,
    default: {
      wrapper: "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg shadow-black/8 dark:shadow-black/30",
      icon:    "text-red-500 dark:text-red-400",
      message: "text-gray-800 dark:text-gray-100",
      desc:    "text-gray-500 dark:text-gray-400",
      progress:"bg-red-500 dark:bg-red-400",
      close:   "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
    },
    filled: {
      wrapper: "bg-red-500 dark:bg-red-600 shadow-lg shadow-red-500/25",
      icon:    "text-white/90",
      message: "text-white",
      desc:    "text-red-100",
      progress:"bg-white/50",
      close:   "text-white/70 hover:text-white hover:bg-white/15",
    },
    ghost: {
      wrapper: "bg-red-50 dark:bg-red-950/40",
      icon:    "text-red-500 dark:text-red-400",
      message: "text-red-900 dark:text-red-100",
      desc:    "text-red-600 dark:text-red-400",
      progress:"bg-red-400 dark:bg-red-500",
      close:   "text-red-400 hover:text-red-600 dark:text-red-500 dark:hover:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/50",
    },
    outline: {
      wrapper: "bg-white dark:bg-gray-900 border-2 border-red-400 dark:border-red-500 shadow-md shadow-red-500/10",
      icon:    "text-red-500 dark:text-red-400",
      message: "text-gray-800 dark:text-gray-100",
      desc:    "text-gray-500 dark:text-gray-400",
      progress:"bg-red-500 dark:bg-red-400",
      close:   "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
    },
  },
  neutral: {
    iconColor: "text-gray-500 dark:text-gray-400",
    DefaultIcon: Bell,
    default: {
      wrapper: "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg shadow-black/8 dark:shadow-black/30",
      icon:    "text-gray-500 dark:text-gray-400",
      message: "text-gray-800 dark:text-gray-100",
      desc:    "text-gray-500 dark:text-gray-400",
      progress:"bg-gray-400 dark:bg-gray-500",
      close:   "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
    },
    filled: {
      wrapper: "bg-gray-800 dark:bg-gray-700 shadow-lg shadow-black/20",
      icon:    "text-white/80",
      message: "text-white",
      desc:    "text-gray-300",
      progress:"bg-white/40",
      close:   "text-white/60 hover:text-white hover:bg-white/15",
    },
    ghost: {
      wrapper: "bg-gray-100 dark:bg-gray-800",
      icon:    "text-gray-500 dark:text-gray-400",
      message: "text-gray-800 dark:text-gray-100",
      desc:    "text-gray-500 dark:text-gray-400",
      progress:"bg-gray-400 dark:bg-gray-500",
      close:   "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700",
    },
    outline: {
      wrapper: "bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 shadow-md",
      icon:    "text-gray-500 dark:text-gray-400",
      message: "text-gray-800 dark:text-gray-100",
      desc:    "text-gray-500 dark:text-gray-400",
      progress:"bg-gray-400 dark:bg-gray-500",
      close:   "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
    },
  },
};

// ─── Position Config ──────────────────────────────────────────────────────────

const positionClasses: Record<SnackbarPosition, string> = {
  "top-left":       "top-4 left-4 items-start",
  "top-center":     "top-4 left-1/2 -translate-x-1/2 items-center",
  "top-right":      "top-4 right-4 items-end",
  "bottom-left":    "bottom-4 left-4 items-start",
  "bottom-center":  "bottom-4 left-1/2 -translate-x-1/2 items-center",
  "bottom-right":   "bottom-4 right-4 items-end",
};

function isBottom(p: SnackbarPosition) {
  return p.startsWith("bottom");
}

// ─── Slide-in motion per position ────────────────────────────────────────────

function getMotion(position: SnackbarPosition) {
  const fromBottom = isBottom(position);
  const isCenter = position.endsWith("center");
  const isLeft = position.endsWith("left");

  const x = isCenter ? "-50%" : isLeft ? "-110%" : "110%";
  const y = fromBottom ? "100%" : "-100%";

  return {
    initial: { opacity: 0, x: isCenter ? 0 : isLeft ? -24 : 24, y: fromBottom ? 16 : -16, scale: 0.95 },
    animate: { opacity: 1, x: 0, y: 0, scale: 1 },
    exit:    { opacity: 0, x: isCenter ? 0 : isLeft ? -16 : 16, y: 0, scale: 0.95 },
    transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
  };
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

interface ProgressBarProps {
  duration: number;
  paused: boolean;
  progressClass: string;
  progressH: string;
  onComplete: () => void;
}

function ProgressBar({ duration, paused, progressClass, progressH, onComplete }: ProgressBarProps) {
  const [width, setWidth] = useState(100);
  const startRef = useRef<number | null>(null);
  const elapsed = useRef(0);
  const rafRef = useRef<number | null>(null);

  const tick = useCallback((now: number) => {
    if (startRef.current === null) startRef.current = now;
    elapsed.current += now - startRef.current;
    startRef.current = now;
    const pct = Math.max(0, 100 - (elapsed.current / duration) * 100);
    setWidth(pct);
    if (pct <= 0) { onComplete(); return; }
    rafRef.current = requestAnimationFrame(tick);
  }, [duration, onComplete]);

  useEffect(() => {
    if (paused) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      startRef.current = null;
      return;
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [paused, tick]);

  return (
    <div className={`w-full ${progressH} bg-black/10 dark:bg-white/10 overflow-hidden`}>
      <div
        className={`h-full ${progressClass} transition-none`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

// ─── Single Snackbar Item ─────────────────────────────────────────────────────

interface SnackbarItemCardProps {
  item: SnackbarItem;
  defaultSize: SnackbarSize;
  defaultVariant: SnackbarVariant;
  defaultDuration: number;
  pauseOnHover: boolean;
  position: SnackbarPosition;
}

function SnackbarItemCard({
  item,
  defaultSize,
  defaultVariant,
  defaultDuration,
  pauseOnHover,
  position,
}: SnackbarItemCardProps) {
  const { close } = useSnackbar();
  const [hovered, setHovered] = useState(false);

  const size     = item.size     ?? defaultSize;
  const variant  = item.variant  ?? defaultVariant;
  const severity = item.severity ?? "neutral";
  const duration = item.duration ?? defaultDuration;
  const closable = item.closable !== false;
  const persistent = item.persistent ?? false;
  const paused = pauseOnHover && hovered;

  const s   = sizeConfig[size];
  const sev = severityConfig[severity];
  const col = sev[variant];

  const handleClose = useCallback(() => {
    item.onClose?.();
    close(item.id);
  }, [item, close]);

  const renderIcon = () => {
    if (item.icon) {
      return (
        <span className={`shrink-0 flex items-center justify-center ${col.icon}`}
          style={{ width: s.iconSize, height: s.iconSize }}>
          {item.icon}
        </span>
      );
    }
    const Icon = sev.DefaultIcon;
    return (
      <Icon
        size={s.iconSize}
        className={`shrink-0 ${col.icon}`}
        style={{ minWidth: s.iconSize }}
      />
    );
  };

  const renderAction = (action: NonNullable<SnackbarItem["action"]>, secondary = false) => {
    const baseClass = `
      inline-flex items-center font-semibold ${s.actionText} transition-colors duration-100
      ${secondary ? "opacity-70 hover:opacity-100" : ""}
    `;
    const colorClass = variant === "filled"
      ? "text-white/90 hover:text-white underline underline-offset-2"
      : `${sev[variant].icon} hover:underline underline-offset-2`;

    return (
      <button
        key={action.label}
        type="button"
        onClick={() => { action.onClick(); handleClose(); }}
        className={`${baseClass} ${colorClass} ${action.className ?? ""}`}
      >
        {action.label}
      </button>
    );
  };

  return (
    <div
      className={`relative overflow-hidden ${s.borderRadius} ${s.minWidth} ${s.maxWidth} w-full
        ${col.wrapper} ${item.className ?? ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="alert"
      aria-live="polite"
    >
      {/* Body */}
      <div className={`flex items-start ${s.px} ${s.py} ${s.gap}`}>
        {/* Leading icon */}
        <span className="mt-px">{renderIcon()}</span>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className={`font-semibold leading-snug ${s.messageText} ${col.message}`}>
            {item.message}
          </p>
          {item.description && (
            <p className={`mt-0.5 leading-snug ${s.descText} ${col.desc}`}>
              {item.description}
            </p>
          )}
          {(item.action || item.secondaryAction) && (
            <div className={`flex items-center gap-3 mt-2`}>
              {item.action         && renderAction(item.action)}
              {item.secondaryAction && renderAction(item.secondaryAction, true)}
            </div>
          )}
        </div>

        {/* Close button */}
        {closable && (
          <button
            type="button"
            onClick={handleClose}
            className={`
              shrink-0 ${s.closeBtnSize} rounded-md flex items-center justify-center
              transition-colors duration-100 ${col.close}
            `}
            aria-label="Dismiss"
          >
            <X size={s.closeIconSize} />
          </button>
        )}
      </div>

      {/* Progress bar */}
      {!persistent && (
        <ProgressBar
          duration={duration}
          paused={paused}
          progressClass={col.progress}
          progressH={s.progressH}
          onComplete={handleClose}
        />
      )}
    </div>
  );
}

// ─── Position Group ───────────────────────────────────────────────────────────

interface PositionGroupProps {
  position: SnackbarPosition;
  items: SnackbarItem[];
  defaultSize: SnackbarSize;
  defaultVariant: SnackbarVariant;
  defaultDuration: number;
  pauseOnHover: boolean;
}

function PositionGroup({
  position,
  items,
  defaultSize,
  defaultVariant,
  defaultDuration,
  pauseOnHover,
}: PositionGroupProps) {
  const motion_ = getMotion(position);
  const orderedItems = isBottom(position) ? [...items].reverse() : items;

  return (
    <div
      className={`fixed z-[9999] flex flex-col gap-2.5 pointer-events-none ${positionClasses[position]}`}
      style={{ maxWidth: "calc(100vw - 2rem)" }}
    >
      <AnimatePresence mode="sync" initial={false}>
        {orderedItems.map((item) => (
          <motion.div
            key={item.id}
            layout
            {...motion_}
            className="pointer-events-auto w-full"
          >
            <SnackbarItemCard
              item={item}
              defaultSize={defaultSize}
              defaultVariant={defaultVariant}
              defaultDuration={defaultDuration}
              pauseOnHover={pauseOnHover}
              position={position}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ─── Snackbar Container (portal renderer) ─────────────────────────────────────

export function SnackbarContainer() {
  const { state } = useSnackbar();
  const {
    items,
    defaultPosition,
    defaultSize,
    defaultVariant,
    defaultDuration,
    pauseOnHover,
  } = state;

  // Group items by their resolved position
  const groups = items.reduce<Record<string, SnackbarItem[]>>((acc, item) => {
    const pos = item.position ?? defaultPosition;
    if (!acc[pos]) acc[pos] = [];
    acc[pos].push(item);
    return acc;
  }, {});

  const allPositions: SnackbarPosition[] = [
    "top-left", "top-center", "top-right",
    "bottom-left", "bottom-center", "bottom-right",
  ];

  return createPortal(
    <>
      {allPositions.map((pos) => (
        <PositionGroup
          key={pos}
          position={pos}
          items={groups[pos] ?? []}
          defaultSize={defaultSize}
          defaultVariant={defaultVariant}
          defaultDuration={defaultDuration}
          pauseOnHover={pauseOnHover}
        />
      ))}
    </>,
    document.body,
  );
}

// ─── SnackbarRoot: Provider + Container bundled ───────────────────────────────
// Drop-in: wrap your app with <SnackbarRoot> and call useSnackbar() anywhere.

export interface SnackbarRootProps extends SnackbarProviderProps {
  children: React.ReactNode;
}

export function SnackbarRoot({ children, ...providerProps }: SnackbarRootProps) {
  return (
    <SnackbarProvider {...providerProps}>
      {children}
      <SnackbarContainer />
    </SnackbarProvider>
  );
}

// ─── Re-exports ───────────────────────────────────────────────────────────────

export { useSnackbar, SnackbarProvider };
export type {
  SnackbarItem,
  SnackbarSize,
  SnackbarVariant,
  SnackbarSeverity,
  SnackbarPosition,
};