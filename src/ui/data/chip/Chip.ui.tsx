import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, ChevronDown, ChevronUp, Loader2, Plus } from "lucide-react";
import {
  ChipProvider,
  ChipGroupProvider,
  useChipContext,
  useChipGroupContext,
  type ChipProviderProps,
  type ChipSize,
  type ChipVariant,
  type ChipColor,
  type ChipShape,
  type ChipStatus,
} from "./Chip.context";

const sizeConfig = {
  xs: {
    px: "px-1.5",
    py: "py-0.5",
    text: "text-[10px]",
    iconSize: 9,
    closeSize: 8,
    gap: "gap-0.5",
    height: "h-5",
    dotSize: "w-1.5 h-1.5",
    avatarSize: "w-3.5 h-3.5",
    countText: "text-[9px]",
    countPx: "px-1",
  },
  sm: {
    px: "px-2",
    py: "py-0.5",
    text: "text-xs",
    iconSize: 11,
    closeSize: 10,
    gap: "gap-1",
    height: "h-6",
    dotSize: "w-2 h-2",
    avatarSize: "w-4 h-4",
    countText: "text-[10px]",
    countPx: "px-1",
  },
  md: {
    px: "px-2.5",
    py: "py-1",
    text: "text-sm",
    iconSize: 13,
    closeSize: 12,
    gap: "gap-1.5",
    height: "h-7",
    dotSize: "w-2 h-2",
    avatarSize: "w-5 h-5",
    countText: "text-xs",
    countPx: "px-1.5",
  },
  lg: {
    px: "px-3",
    py: "py-1.5",
    text: "text-sm",
    iconSize: 14,
    closeSize: 13,
    gap: "gap-2",
    height: "h-8",
    dotSize: "w-2.5 h-2.5",
    avatarSize: "w-6 h-6",
    countText: "text-xs",
    countPx: "px-1.5",
  },
  xl: {
    px: "px-4",
    py: "py-2",
    text: "text-base",
    iconSize: 16,
    closeSize: 14,
    gap: "gap-2",
    height: "h-10",
    dotSize: "w-3 h-3",
    avatarSize: "w-7 h-7",
    countText: "text-sm",
    countPx: "px-2",
  },
};

const shapeStyles: Record<ChipShape, string> = {
  pill: "rounded-full",
  rounded: "rounded-lg",
  square: "rounded-none",
};

type ColorTokens = {
  filled: string;
  filledSelected: string;
  outlined: string;
  outlinedSelected: string;
  soft: string;
  softSelected: string;
  ghost: string;
  ghostSelected: string;
  elevated: string;
  elevatedSelected: string;
  dot: string;
  selectedRing: string;
};

const colorTokens: Record<ChipColor, ColorTokens> = {
  gray: {
    filled: "bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 border border-transparent",
    filledSelected: "bg-gray-900 dark:bg-white text-white dark:text-gray-900 border border-transparent",
    outlined: "bg-transparent border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500",
    outlinedSelected: "bg-transparent border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white",
    soft: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-transparent hover:bg-gray-200 dark:hover:bg-gray-700",
    softSelected: "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white border border-transparent",
    ghost: "bg-transparent text-gray-600 dark:text-gray-400 border border-transparent hover:bg-gray-100 dark:hover:bg-gray-800",
    ghostSelected: "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-transparent",
    elevated: "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 shadow-sm shadow-black/5",
    elevatedSelected: "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-500 shadow-md shadow-black/10",
    dot: "bg-gray-500",
    selectedRing: "ring-gray-400",
  },
  red: {
    filled: "bg-red-600 text-white border border-transparent",
    filledSelected: "bg-red-700 text-white border border-transparent",
    outlined: "bg-transparent border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:border-red-400",
    outlinedSelected: "bg-transparent border-2 border-red-600 dark:border-red-400 text-red-600 dark:text-red-400",
    soft: "bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border border-transparent hover:bg-red-100 dark:hover:bg-red-950/70",
    softSelected: "bg-red-100 dark:bg-red-950/70 text-red-800 dark:text-red-200 border border-transparent",
    ghost: "bg-transparent text-red-600 dark:text-red-400 border border-transparent hover:bg-red-50 dark:hover:bg-red-950/40",
    ghostSelected: "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-transparent",
    elevated: "bg-white dark:bg-gray-800 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 shadow-sm",
    elevatedSelected: "bg-white dark:bg-gray-800 text-red-700 dark:text-red-300 border border-red-400 dark:border-red-600 shadow-md",
    dot: "bg-red-500",
    selectedRing: "ring-red-400",
  },
  amber: {
    filled: "bg-amber-500 text-white border border-transparent",
    filledSelected: "bg-amber-600 text-white border border-transparent",
    outlined: "bg-transparent border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400 hover:border-amber-400",
    outlinedSelected: "bg-transparent border-2 border-amber-600 dark:border-amber-400 text-amber-700 dark:text-amber-300",
    soft: "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-transparent hover:bg-amber-100 dark:hover:bg-amber-950/70",
    softSelected: "bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-200 border border-transparent",
    ghost: "bg-transparent text-amber-600 dark:text-amber-400 border border-transparent hover:bg-amber-50 dark:hover:bg-amber-950/40",
    ghostSelected: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-transparent",
    elevated: "bg-white dark:bg-gray-800 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 shadow-sm",
    elevatedSelected: "bg-white dark:bg-gray-800 text-amber-800 dark:text-amber-300 border border-amber-400 dark:border-amber-600 shadow-md",
    dot: "bg-amber-500",
    selectedRing: "ring-amber-400",
  },
  emerald: {
    filled: "bg-emerald-600 text-white border border-transparent",
    filledSelected: "bg-emerald-700 text-white border border-transparent",
    outlined: "bg-transparent border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400 hover:border-emerald-400",
    outlinedSelected: "bg-transparent border-2 border-emerald-600 dark:border-emerald-400 text-emerald-700 dark:text-emerald-300",
    soft: "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-transparent hover:bg-emerald-100 dark:hover:bg-emerald-950/70",
    softSelected: "bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-200 border border-transparent",
    ghost: "bg-transparent text-emerald-600 dark:text-emerald-400 border border-transparent hover:bg-emerald-50 dark:hover:bg-emerald-950/40",
    ghostSelected: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-transparent",
    elevated: "bg-white dark:bg-gray-800 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 shadow-sm",
    elevatedSelected: "bg-white dark:bg-gray-800 text-emerald-800 dark:text-emerald-300 border border-emerald-400 dark:border-emerald-600 shadow-md",
    dot: "bg-emerald-500",
    selectedRing: "ring-emerald-400",
  },
  blue: {
    filled: "bg-blue-600 text-white border border-transparent",
    filledSelected: "bg-blue-700 text-white border border-transparent",
    outlined: "bg-transparent border border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-400 hover:border-blue-400",
    outlinedSelected: "bg-transparent border-2 border-blue-600 dark:border-blue-400 text-blue-700 dark:text-blue-300",
    soft: "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-transparent hover:bg-blue-100 dark:hover:bg-blue-950/70",
    softSelected: "bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-200 border border-transparent",
    ghost: "bg-transparent text-blue-600 dark:text-blue-400 border border-transparent hover:bg-blue-50 dark:hover:bg-blue-950/40",
    ghostSelected: "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-transparent",
    elevated: "bg-white dark:bg-gray-800 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 shadow-sm",
    elevatedSelected: "bg-white dark:bg-gray-800 text-blue-800 dark:text-blue-300 border border-blue-400 dark:border-blue-600 shadow-md",
    dot: "bg-blue-500",
    selectedRing: "ring-blue-400",
  },
  violet: {
    filled: "bg-violet-600 text-white border border-transparent",
    filledSelected: "bg-violet-700 text-white border border-transparent",
    outlined: "bg-transparent border border-violet-300 dark:border-violet-700 text-violet-700 dark:text-violet-400 hover:border-violet-400",
    outlinedSelected: "bg-transparent border-2 border-violet-600 dark:border-violet-400 text-violet-700 dark:text-violet-300",
    soft: "bg-violet-50 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 border border-transparent hover:bg-violet-100 dark:hover:bg-violet-950/70",
    softSelected: "bg-violet-100 dark:bg-violet-950/70 text-violet-800 dark:text-violet-200 border border-transparent",
    ghost: "bg-transparent text-violet-600 dark:text-violet-400 border border-transparent hover:bg-violet-50 dark:hover:bg-violet-950/40",
    ghostSelected: "bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 border border-transparent",
    elevated: "bg-white dark:bg-gray-800 text-violet-700 dark:text-violet-400 border border-violet-200 dark:border-violet-800 shadow-sm",
    elevatedSelected: "bg-white dark:bg-gray-800 text-violet-800 dark:text-violet-300 border border-violet-400 dark:border-violet-600 shadow-md",
    dot: "bg-violet-500",
    selectedRing: "ring-violet-400",
  },
  rose: {
    filled: "bg-rose-600 text-white border border-transparent",
    filledSelected: "bg-rose-700 text-white border border-transparent",
    outlined: "bg-transparent border border-rose-300 dark:border-rose-700 text-rose-700 dark:text-rose-400 hover:border-rose-400",
    outlinedSelected: "bg-transparent border-2 border-rose-600 dark:border-rose-400 text-rose-700 dark:text-rose-300",
    soft: "bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-transparent hover:bg-rose-100 dark:hover:bg-rose-950/70",
    softSelected: "bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-200 border border-transparent",
    ghost: "bg-transparent text-rose-600 dark:text-rose-400 border border-transparent hover:bg-rose-50 dark:hover:bg-rose-950/40",
    ghostSelected: "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-transparent",
    elevated: "bg-white dark:bg-gray-800 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800 shadow-sm",
    elevatedSelected: "bg-white dark:bg-gray-800 text-rose-800 dark:text-rose-300 border border-rose-400 dark:border-rose-600 shadow-md",
    dot: "bg-rose-500",
    selectedRing: "ring-rose-400",
  },
  indigo: {
    filled: "bg-indigo-600 text-white border border-transparent",
    filledSelected: "bg-indigo-700 text-white border border-transparent",
    outlined: "bg-transparent border border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-400 hover:border-indigo-400",
    outlinedSelected: "bg-transparent border-2 border-indigo-600 dark:border-indigo-400 text-indigo-700 dark:text-indigo-300",
    soft: "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-transparent hover:bg-indigo-100 dark:hover:bg-indigo-950/70",
    softSelected: "bg-indigo-100 dark:bg-indigo-950/70 text-indigo-800 dark:text-indigo-200 border border-transparent",
    ghost: "bg-transparent text-indigo-600 dark:text-indigo-400 border border-transparent hover:bg-indigo-50 dark:hover:bg-indigo-950/40",
    ghostSelected: "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-transparent",
    elevated: "bg-white dark:bg-gray-800 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 shadow-sm",
    elevatedSelected: "bg-white dark:bg-gray-800 text-indigo-800 dark:text-indigo-300 border border-indigo-400 dark:border-indigo-600 shadow-md",
    dot: "bg-indigo-500",
    selectedRing: "ring-indigo-400",
  },
  teal: {
    filled: "bg-teal-600 text-white border border-transparent",
    filledSelected: "bg-teal-700 text-white border border-transparent",
    outlined: "bg-transparent border border-teal-300 dark:border-teal-700 text-teal-700 dark:text-teal-400 hover:border-teal-400",
    outlinedSelected: "bg-transparent border-2 border-teal-600 dark:border-teal-400 text-teal-700 dark:text-teal-300",
    soft: "bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border border-transparent hover:bg-teal-100 dark:hover:bg-teal-950/70",
    softSelected: "bg-teal-100 dark:bg-teal-950/70 text-teal-800 dark:text-teal-200 border border-transparent",
    ghost: "bg-transparent text-teal-600 dark:text-teal-400 border border-transparent hover:bg-teal-50 dark:hover:bg-teal-950/40",
    ghostSelected: "bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-transparent",
    elevated: "bg-white dark:bg-gray-800 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800 shadow-sm",
    elevatedSelected: "bg-white dark:bg-gray-800 text-teal-800 dark:text-teal-300 border border-teal-400 dark:border-teal-600 shadow-md",
    dot: "bg-teal-500",
    selectedRing: "ring-teal-400",
  },
  orange: {
    filled: "bg-orange-500 text-white border border-transparent",
    filledSelected: "bg-orange-600 text-white border border-transparent",
    outlined: "bg-transparent border border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-400 hover:border-orange-400",
    outlinedSelected: "bg-transparent border-2 border-orange-600 dark:border-orange-400 text-orange-700 dark:text-orange-300",
    soft: "bg-orange-50 dark:bg-orange-950/50 text-orange-700 dark:text-orange-300 border border-transparent hover:bg-orange-100 dark:hover:bg-orange-950/70",
    softSelected: "bg-orange-100 dark:bg-orange-950/70 text-orange-800 dark:text-orange-200 border border-transparent",
    ghost: "bg-transparent text-orange-600 dark:text-orange-400 border border-transparent hover:bg-orange-50 dark:hover:bg-orange-950/40",
    ghostSelected: "bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border border-transparent",
    elevated: "bg-white dark:bg-gray-800 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800 shadow-sm",
    elevatedSelected: "bg-white dark:bg-gray-800 text-orange-800 dark:text-orange-300 border border-orange-400 dark:border-orange-600 shadow-md",
    dot: "bg-orange-500",
    selectedRing: "ring-orange-400",
  },
  pink: {
    filled: "bg-pink-600 text-white border border-transparent",
    filledSelected: "bg-pink-700 text-white border border-transparent",
    outlined: "bg-transparent border border-pink-300 dark:border-pink-700 text-pink-700 dark:text-pink-400 hover:border-pink-400",
    outlinedSelected: "bg-transparent border-2 border-pink-600 dark:border-pink-400 text-pink-700 dark:text-pink-300",
    soft: "bg-pink-50 dark:bg-pink-950/50 text-pink-700 dark:text-pink-300 border border-transparent hover:bg-pink-100 dark:hover:bg-pink-950/70",
    softSelected: "bg-pink-100 dark:bg-pink-950/70 text-pink-800 dark:text-pink-200 border border-transparent",
    ghost: "bg-transparent text-pink-600 dark:text-pink-400 border border-transparent hover:bg-pink-50 dark:hover:bg-pink-950/40",
    ghostSelected: "bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 border border-transparent",
    elevated: "bg-white dark:bg-gray-800 text-pink-700 dark:text-pink-400 border border-pink-200 dark:border-pink-800 shadow-sm",
    elevatedSelected: "bg-white dark:bg-gray-800 text-pink-800 dark:text-pink-300 border border-pink-400 dark:border-pink-600 shadow-md",
    dot: "bg-pink-500",
    selectedRing: "ring-pink-400",
  },
  cyan: {
    filled: "bg-cyan-600 text-white border border-transparent",
    filledSelected: "bg-cyan-700 text-white border border-transparent",
    outlined: "bg-transparent border border-cyan-300 dark:border-cyan-700 text-cyan-700 dark:text-cyan-400 hover:border-cyan-400",
    outlinedSelected: "bg-transparent border-2 border-cyan-600 dark:border-cyan-400 text-cyan-700 dark:text-cyan-300",
    soft: "bg-cyan-50 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-300 border border-transparent hover:bg-cyan-100 dark:hover:bg-cyan-950/70",
    softSelected: "bg-cyan-100 dark:bg-cyan-950/70 text-cyan-800 dark:text-cyan-200 border border-transparent",
    ghost: "bg-transparent text-cyan-600 dark:text-cyan-400 border border-transparent hover:bg-cyan-50 dark:hover:bg-cyan-950/40",
    ghostSelected: "bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 border border-transparent",
    elevated: "bg-white dark:bg-gray-800 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800 shadow-sm",
    elevatedSelected: "bg-white dark:bg-gray-800 text-cyan-800 dark:text-cyan-300 border border-cyan-400 dark:border-cyan-600 shadow-md",
    dot: "bg-cyan-500",
    selectedRing: "ring-cyan-400",
  },
};

function resolveColorClass(
  variant: ChipVariant,
  color: ChipColor,
  isSelected: boolean,
): string {
  const t = colorTokens[color];
  const map: Record<ChipVariant, [string, string]> = {
    filled: [t.filled, t.filledSelected],
    outlined: [t.outlined, t.outlinedSelected],
    soft: [t.soft, t.softSelected],
    ghost: [t.ghost, t.ghostSelected],
    elevated: [t.elevated, t.elevatedSelected],
  };
  return map[variant][isSelected ? 1 : 0];
}

export interface ChipDotProps {
  pulsing?: boolean;
  className?: string;
}

export function ChipDot({ pulsing = false, className = "" }: ChipDotProps) {
  const { state } = useChipContext();
  const s = sizeConfig[state.size];
  const dot = colorTokens[state.color].dot;

  return (
    <span className={`relative inline-flex shrink-0 ${s.dotSize} ${className}`}>
      <span className={`w-full h-full rounded-full ${dot}`} />
      {pulsing && (
        <span className={`absolute inset-0 rounded-full ${dot} animate-ping opacity-60`} />
      )}
    </span>
  );
}

export interface ChipAvatarProps {
  src?: string;
  name?: string;
  className?: string;
}

function nameToColor(name: string): string {
  const palette = [
    "bg-violet-200 dark:bg-violet-900 text-violet-800 dark:text-violet-200",
    "bg-blue-200 dark:bg-blue-900 text-blue-800 dark:text-blue-200",
    "bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200",
    "bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-200",
    "bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200",
  ];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return palette[Math.abs(h) % palette.length];
}

export function ChipAvatar({ src, name = "", className = "" }: ChipAvatarProps) {
  const { state } = useChipContext();
  const s = sizeConfig[state.size];
  const [err, setErr] = useState(false);

  return (
    <span
      className={`shrink-0 rounded-full overflow-hidden flex items-center justify-center ${s.avatarSize} ${!src || err ? nameToColor(name) : ""} ${className}`}
    >
      {src && !err ? (
        <img src={src} alt={name} className="w-full h-full object-cover" onError={() => setErr(true)} draggable={false} />
      ) : (
        <span className="font-semibold leading-none" style={{ fontSize: "0.6em" }}>
          {name.charAt(0).toUpperCase()}
        </span>
      )}
    </span>
  );
}

export interface ChipIconProps {
  icon: React.ReactNode;
  side?: "leading" | "trailing";
  className?: string;
}

export function ChipIcon({ icon, className = "" }: ChipIconProps) {
  const { state } = useChipContext();
  const s = sizeConfig[state.size];
  return (
    <span
      className={`shrink-0 flex items-center justify-center ${className}`}
      style={{ width: s.iconSize, height: s.iconSize }}
    >
      {icon}
    </span>
  );
}

export interface ChipLabelProps {
  children: React.ReactNode;
  truncate?: boolean;
  maxWidth?: string;
  className?: string;
}

export function ChipLabel({ children, truncate = false, maxWidth, className = "" }: ChipLabelProps) {
  const { state } = useChipContext();
  const s = sizeConfig[state.size];

  return (
    <span
      className={`font-medium leading-none ${s.text} ${truncate ? "truncate" : ""} ${className}`}
      style={maxWidth ? { maxWidth } : undefined}
    >
      {children}
    </span>
  );
}

export interface ChipCloseButtonProps {
  onClose?: () => void;
  className?: string;
  icon?: React.ReactNode;
}

export function ChipCloseButton({ onClose, className = "", icon }: ChipCloseButtonProps) {
  const { state, dismiss } = useChipContext();
  const s = sizeConfig[state.size];

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onClose ? onClose() : dismiss();
  }, [onClose, dismiss]);

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={state.status === "disabled"}
      aria-label="Remove"
      className={`shrink-0 flex items-center justify-center rounded-full opacity-60 hover:opacity-100 transition-opacity focus:outline-none ${className}`}
      style={{ width: s.closeSize + 6, height: s.closeSize + 6 }}
    >
      {icon ?? <X size={s.closeSize} strokeWidth={2.5} />}
    </button>
  );
}

export interface ChipCheckmarkProps {
  className?: string;
}

export function ChipCheckmark({ className = "" }: ChipCheckmarkProps) {
  const { state } = useChipContext();
  const s = sizeConfig[state.size];

  return (
    <AnimatePresence>
      {state.isSelected && (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className={`shrink-0 flex items-center justify-center ${className}`}
          style={{ width: s.iconSize, height: s.iconSize }}
        >
          <Check size={s.iconSize} strokeWidth={3} />
        </motion.span>
      )}
    </AnimatePresence>
  );
}

export interface ChipCountProps {
  count: number;
  className?: string;
}

export function ChipCount({ count, className = "" }: ChipCountProps) {
  const { state } = useChipContext();
  const s = sizeConfig[state.size];

  return (
    <span
      className={`shrink-0 inline-flex items-center justify-center rounded-full font-semibold leading-none ${s.countText} ${s.countPx} py-0.5 bg-black/10 dark:bg-white/15 ${className}`}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}

export interface ChipExpandButtonProps {
  expandLabel?: string;
  collapseLabel?: string;
  onToggle?: () => void;
  className?: string;
}

export function ChipExpandButton({
  expandLabel,
  collapseLabel,
  onToggle,
  className = "",
}: ChipExpandButtonProps) {
  const { state, toggleExpand } = useChipContext();
  const s = sizeConfig[state.size];

  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onToggle ? onToggle() : toggleExpand(); }}
      className={`shrink-0 flex items-center gap-0.5 opacity-70 hover:opacity-100 transition-opacity ${s.text} ${className}`}
    >
      {state.isExpanded
        ? (collapseLabel ? <span>{collapseLabel}</span> : <ChevronUp size={s.closeSize} />)
        : (expandLabel ? <span>{expandLabel}</span> : <ChevronDown size={s.closeSize} />)
      }
    </button>
  );
}

export interface ChipRootProps {
  children?: React.ReactNode;
  onClick?: () => void;
  selectable?: boolean;
  className?: string;
  style?: React.CSSProperties;
  role?: string;
  tabIndex?: number;
}

export function ChipRoot({
  children,
  onClick,
  selectable = false,
  className = "",
  style,
  role,
  tabIndex,
}: ChipRootProps) {
  const { state, chipRef, toggleSelect } = useChipContext();
  const s = sizeConfig[state.size];
  const tokens = colorTokens[state.color];

  const isClickable = !!(onClick || selectable);
  const isDisabled = state.status === "disabled";
  const isLoading = state.status === "loading";

  const colorClass = resolveColorClass(state.variant, state.color, state.isSelected);
  const shapeClass = shapeStyles[state.shape];

  const handleClick = useCallback(() => {
    if (isDisabled || isLoading) return;
    if (selectable) toggleSelect();
    onClick?.();
  }, [isDisabled, isLoading, selectable, toggleSelect, onClick]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  }, [handleClick]);

  return (
    <AnimatePresence>
      {!state.isDismissed && (
        <motion.div
          ref={chipRef}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8, width: 0, marginRight: 0, paddingLeft: 0, paddingRight: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          onClick={handleClick}
          onKeyDown={isClickable ? handleKeyDown : undefined}
          role={role ?? (selectable ? "checkbox" : isClickable ? "button" : undefined)}
          aria-checked={selectable ? state.isSelected : undefined}
          aria-disabled={isDisabled}
          tabIndex={isDisabled ? -1 : (isClickable ? (tabIndex ?? 0) : undefined)}
          style={style}
          className={`
            inline-flex items-center ${s.gap} ${s.px} ${s.height} ${shapeClass} ${colorClass}
            transition-all duration-150 select-none
            ${isClickable && !isDisabled ? "cursor-pointer active:scale-95" : ""}
            ${isDisabled ? "opacity-40 cursor-not-allowed pointer-events-none" : ""}
            ${isLoading ? "cursor-wait" : ""}
            ${state.isSelected && state.variant !== "outlined" ? `ring-1 ring-offset-1 ring-offset-white dark:ring-offset-gray-900 ${tokens.selectedRing}` : ""}
            ${className}
          `}
        >
          {isLoading && (
            <Loader2 size={s.iconSize} className="animate-spin shrink-0" />
          )}
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export interface ChipMultilineBodyProps {
  children: React.ReactNode;
  maxLines?: number;
  expandable?: boolean;
  className?: string;
}

export function ChipMultilineBody({
  children,
  maxLines = 2,
  expandable = true,
  className = "",
}: ChipMultilineBodyProps) {
  const { state, toggleExpand, setTruncated } = useChipContext();
  const textRef = useRef<HTMLSpanElement>(null);
  const s = sizeConfig[state.size];

  useLayoutEffect(() => {
    const el = textRef.current;
    if (!el) return;
    const isClamped = el.scrollHeight > el.clientHeight + 2;
    setTruncated(isClamped);
  }, [children, maxLines, setTruncated]);

  return (
    <span className={`flex-1 min-w-0 flex flex-col gap-0.5 ${className}`}>
      <span
        ref={textRef}
        className={`${s.text} font-medium leading-snug transition-all duration-200`}
        style={!state.isExpanded ? {
          display: "-webkit-box",
          WebkitLineClamp: maxLines,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        } : undefined}
      >
        {children}
      </span>
      {expandable && state.isTruncated && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); toggleExpand(); }}
          className="flex items-center gap-0.5 self-start text-[10px] font-semibold opacity-60 hover:opacity-100 transition-opacity mt-0.5"
        >
          {state.isExpanded ? (
            <><ChevronUp size={9} /> less</>
          ) : (
            <><ChevronDown size={9} /> more</>
          )}
        </button>
      )}
    </span>
  );
}

export interface ChipProps extends Omit<ChipProviderProps, "children"> {
  label: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  avatar?: { src?: string; name?: string };
  dot?: boolean;
  dotPulsing?: boolean;
  dismissible?: boolean;
  selectable?: boolean;
  showCheckmark?: boolean;
  count?: number;
  truncate?: boolean;
  maxWidth?: string;
  maxLines?: number;
  expandable?: boolean;
  onClick?: () => void;
  onDismiss?: () => void;
  onSelect?: (selected: boolean) => void;
  className?: string;
  labelClassName?: string;
  style?: React.CSSProperties;
}

export function Chip({
  label,
  leadingIcon,
  trailingIcon,
  avatar,
  dot = false,
  dotPulsing = false,
  dismissible = false,
  selectable = false,
  showCheckmark = false,
  count,
  truncate = false,
  maxWidth,
  maxLines,
  expandable = false,
  onClick,
  onDismiss,
  onSelect,
  className = "",
  labelClassName = "",
  style,
  ...providerProps
}: ChipProps) {
  const isMultiline = !!maxLines && maxLines > 1;

  return (
    <ChipProvider
      {...providerProps}
      onDismiss={onDismiss}
      onSelect={onSelect}
      maxLines={maxLines ?? 1}
    >
      <ChipRoot
        onClick={onClick}
        selectable={selectable}
        className={className}
        style={style}
      >
        {showCheckmark && <ChipCheckmark />}
        {avatar && <ChipAvatar src={avatar.src} name={avatar.name ?? label} />}
        {dot && <ChipDot pulsing={dotPulsing} />}
        {leadingIcon && <ChipIcon icon={leadingIcon} />}

        {isMultiline ? (
          <ChipMultilineBody maxLines={maxLines} expandable={expandable}>
            {label}
          </ChipMultilineBody>
        ) : (
          <ChipLabel truncate={truncate} maxWidth={maxWidth} className={labelClassName}>
            {label}
          </ChipLabel>
        )}

        {count !== undefined && <ChipCount count={count} />}
        {trailingIcon && <ChipIcon icon={trailingIcon} />}
        {dismissible && <ChipCloseButton />}
      </ChipRoot>
    </ChipProvider>
  );
}

export interface ChipGroupItem {
  id: string;
  label: string;
  leadingIcon?: React.ReactNode;
  avatar?: { src?: string; name?: string };
  dot?: boolean;
  disabled?: boolean;
  count?: number;
  color?: ChipColor;
}

export interface ChipGroupProps {
  items: ChipGroupItem[];
  size?: ChipSize;
  variant?: ChipVariant;
  color?: ChipColor;
  shape?: ChipShape;
  multiSelect?: boolean;
  defaultSelectedIds?: string[];
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  dismissible?: boolean;
  gap?: "sm" | "md" | "lg";
  wrap?: boolean;
  showCheckmarks?: boolean;
  className?: string;
  itemClassName?: string;
}

export function ChipGroup({
  items,
  size = "md",
  variant = "soft",
  color = "gray",
  shape = "pill",
  multiSelect = true,
  defaultSelectedIds = [],
  selectedIds: controlledIds,
  onSelectionChange,
  dismissible = false,
  gap = "md",
  wrap = true,
  showCheckmarks = false,
  className = "",
  itemClassName = "",
}: ChipGroupProps) {
  const [internalSelected, setInternalSelected] = useState<string[]>(defaultSelectedIds);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const selectedIds = controlledIds ?? internalSelected;

  const gapMap = { sm: "gap-1", md: "gap-1.5", lg: "gap-2" };

  const handleSelect = useCallback((id: string, isSelected: boolean) => {
    let next: string[];
    if (multiSelect) {
      next = isSelected ? [...selectedIds, id] : selectedIds.filter((s) => s !== id);
    } else {
      next = isSelected ? [id] : [];
    }
    if (!controlledIds) setInternalSelected(next);
    onSelectionChange?.(next);
  }, [multiSelect, selectedIds, controlledIds, onSelectionChange]);

  const handleDismiss = useCallback((id: string) => {
    setDismissed((prev) => new Set([...prev, id]));
  }, []);

  const visibleItems = items.filter((item) => !dismissed.has(item.id));

  return (
    <div className={`${wrap ? "flex flex-wrap" : "flex flex-nowrap overflow-x-auto"} ${gapMap[gap]} ${className}`}>
      <AnimatePresence mode="popLayout">
        {visibleItems.map((item) => {
          const isSelected = selectedIds.includes(item.id);
          return (
            <Chip
              key={item.id}
              label={item.label}
              size={size}
              variant={variant}
              color={item.color ?? color}
              shape={shape}
              leadingIcon={item.leadingIcon}
              avatar={item.avatar}
              dot={item.dot}
              count={item.count}
              dismissible={dismissible}
              selectable
              showCheckmark={showCheckmarks && isSelected}
              defaultSelected={isSelected}
              status={item.disabled ? "disabled" : "default"}
              onSelect={(sel) => handleSelect(item.id, sel)}
              onDismiss={() => handleDismiss(item.id)}
              className={itemClassName}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
}

export interface ChipInputProps {
  chips: string[];
  onChange: (chips: string[]) => void;
  size?: ChipSize;
  variant?: ChipVariant;
  color?: ChipColor;
  shape?: ChipShape;
  placeholder?: string;
  maxChips?: number;
  allowDuplicates?: boolean;
  validateChip?: (value: string) => boolean;
  className?: string;
  inputClassName?: string;
}

export function ChipInput({
  chips,
  onChange,
  size = "md",
  variant = "soft",
  color = "blue",
  shape = "pill",
  placeholder = "Add tag…",
  maxChips,
  allowDuplicates = false,
  validateChip,
  className = "",
  inputClassName = "",
}: ChipInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const s = sizeConfig[size];

  const addChip = useCallback((value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    if (!allowDuplicates && chips.includes(trimmed)) { setInputValue(""); return; }
    if (maxChips && chips.length >= maxChips) return;
    if (validateChip && !validateChip(trimmed)) return;
    onChange([...chips, trimmed]);
    setInputValue("");
  }, [chips, onChange, allowDuplicates, maxChips, validateChip]);

  const removeChip = useCallback((index: number) => {
    onChange(chips.filter((_, i) => i !== index));
  }, [chips, onChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && inputValue) {
      e.preventDefault();
      addChip(inputValue);
    }
    if (e.key === "Backspace" && !inputValue && chips.length > 0) {
      removeChip(chips.length - 1);
    }
  }, [inputValue, addChip, chips, removeChip]);

  return (
    <div
      className={`flex flex-wrap items-center gap-1.5 min-h-[42px] px-2.5 py-1.5 rounded-xl border transition-all cursor-text
        bg-white dark:bg-gray-900
        ${isFocused
          ? "border-gray-400 dark:border-gray-500 ring-1 ring-gray-900 dark:ring-white"
          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
        } ${className}`}
      onClick={() => inputRef.current?.focus()}
    >
      <AnimatePresence mode="popLayout">
        {chips.map((chip, i) => (
          <Chip
            key={`${chip}-${i}`}
            label={chip}
            size={size}
            variant={variant}
            color={color}
            shape={shape}
            dismissible
            onDismiss={() => removeChip(i)}
          />
        ))}
      </AnimatePresence>

      {(!maxChips || chips.length < maxChips) && (
        <input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => { setIsFocused(false); if (inputValue) addChip(inputValue); }}
          placeholder={chips.length === 0 ? placeholder : ""}
          className={`flex-1 min-w-[80px] bg-transparent outline-none ${s.text} text-gray-700 dark:text-gray-300 placeholder:text-gray-400 dark:placeholder:text-gray-600 ${inputClassName}`}
        />
      )}
    </div>
  );
}

export interface ChipAddButtonProps {
  label?: string;
  size?: ChipSize;
  shape?: ChipShape;
  onClick?: () => void;
  className?: string;
}

export function ChipAddButton({
  label = "Add",
  size = "md",
  shape = "pill",
  onClick,
  className = "",
}: ChipAddButtonProps) {
  const s = sizeConfig[size];
  const shapeClass = shapeStyles[shape];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center ${s.gap} ${s.px} ${s.height} ${shapeClass} ${s.text}
        font-medium border border-dashed border-gray-300 dark:border-gray-600
        text-gray-500 dark:text-gray-400
        hover:border-gray-400 dark:hover:border-gray-500
        hover:text-gray-700 dark:hover:text-gray-200
        transition-all duration-150 cursor-pointer select-none ${className}`}
    >
      <Plus size={s.iconSize - 1} />
      <span>{label}</span>
    </button>
  );
}

export {
  ChipProvider,
  ChipGroupProvider,
  useChipContext,
  useChipGroupContext,
};

export type {
  ChipSize,
  ChipVariant,
  ChipColor,
  ChipShape,
  ChipStatus,
};