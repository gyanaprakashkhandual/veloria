/* eslint-disable react-refresh/only-export-components */
"use client";

import React, {
  createContext,
  useContext,
  useCallback,
  useRef,
  type ReactNode,
} from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ButtonVariant =
  | "solid"
  | "outline"
  | "ghost"
  | "soft"
  | "link"
  | "danger"
  | "success"
  | "warning";

export type ButtonSize = "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

export type ButtonShape = "rounded" | "pill" | "square";

export interface ButtonConfig {
  /** Visual variant */
  variant?: ButtonVariant;
  /** Size token */
  size?: ButtonSize;
  /** Border-radius shape */
  shape?: ButtonShape;
  /** Disabled state */
  disabled?: boolean;
  /** Show spinner and block interactions while true */
  loading?: boolean;
  /** Full-width block button */
  fullWidth?: boolean;
  /** Icon placed before the label */
  iconLeft?: ReactNode;
  /** Icon placed after the label */
  iconRight?: ReactNode;
  /** Render as icon-only button (square aspect ratio) */
  iconOnly?: boolean;
  /** Accessible label when iconOnly is true */
  "aria-label"?: string;
}

export interface AsyncButtonConfig extends ButtonConfig {
  /** Called on click; if it returns a Promise the loading state is managed automatically */
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
}

export interface ToggleButtonConfig extends ButtonConfig {
  /** Controlled pressed state */
  pressed?: boolean;
  /** Default pressed state (uncontrolled) */
  defaultPressed?: boolean;
  /** Called when pressed state changes */
  onPressedChange?: (pressed: boolean) => void;
}

interface ButtonContextValue {
  /** Resolve variant-level class tokens */
  resolveVariant: (variant: ButtonVariant) => VariantClasses;
  /** Resolve size-level class tokens */
  resolveSize: (size: ButtonSize, iconOnly?: boolean) => SizeClasses;
  /** Resolve shape class */
  resolveShape: (shape: ButtonShape) => string;
}

interface VariantClasses {
  base: string;
  hover: string;
  active: string;
  focus: string;
  disabled: string;
  loading: string;
  pressed?: string; // for toggle
}

interface SizeClasses {
  padding: string;
  text: string;
  height: string;
  iconSize: string;
  gap: string;
  minWidth?: string;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ButtonContext = createContext<ButtonContextValue | undefined>(undefined);

// ─── Variant Resolver ─────────────────────────────────────────────────────────

const VARIANT_MAP: Record<ButtonVariant, VariantClasses> = {
  solid: {
    base: "bg-zinc-900 text-white border border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100",
    hover:
      "hover:bg-zinc-700 hover:border-zinc-700 dark:hover:bg-zinc-300 dark:hover:border-zinc-300",
    active: "active:bg-zinc-800 active:scale-[0.98]",
    focus:
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 dark:focus-visible:ring-zinc-100",
    disabled:
      "disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none",
    loading: "opacity-80 cursor-wait pointer-events-none",
  },
  outline: {
    base: "bg-transparent text-zinc-800 border border-zinc-300 dark:text-zinc-200 dark:border-zinc-600",
    hover:
      "hover:bg-zinc-100 hover:border-zinc-400 dark:hover:bg-zinc-800 dark:hover:border-zinc-500",
    active: "active:bg-zinc-200 active:scale-[0.98] dark:active:bg-zinc-700",
    focus:
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-2",
    disabled:
      "disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none",
    loading: "opacity-70 cursor-wait pointer-events-none",
  },
  ghost: {
    base: "bg-transparent text-zinc-700 border border-transparent dark:text-zinc-300",
    hover:
      "hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100",
    active: "active:bg-zinc-200 active:scale-[0.98] dark:active:bg-zinc-700",
    focus:
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2",
    disabled:
      "disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none",
    loading: "opacity-70 cursor-wait pointer-events-none",
  },
  soft: {
    base: "bg-zinc-100 text-zinc-800 border border-transparent dark:bg-zinc-800 dark:text-zinc-200",
    hover: "hover:bg-zinc-200 dark:hover:bg-zinc-700",
    active: "active:bg-zinc-300 active:scale-[0.98] dark:active:bg-zinc-600",
    focus:
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2",
    disabled:
      "disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none",
    loading: "opacity-70 cursor-wait pointer-events-none",
  },
  link: {
    base: "bg-transparent text-zinc-800 border border-transparent underline-offset-4 dark:text-zinc-200",
    hover: "hover:underline hover:text-zinc-600 dark:hover:text-zinc-400",
    active: "active:opacity-70",
    focus:
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 rounded",
    disabled:
      "disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none",
    loading: "opacity-70 cursor-wait pointer-events-none",
  },
  danger: {
    base: "bg-red-600 text-white border border-red-600 dark:bg-red-700 dark:border-red-700",
    hover: "hover:bg-red-700 hover:border-red-700 dark:hover:bg-red-600",
    active: "active:bg-red-800 active:scale-[0.98]",
    focus:
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2",
    disabled:
      "disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none",
    loading: "opacity-80 cursor-wait pointer-events-none",
  },
  success: {
    base: "bg-green-600 text-white border border-green-600 dark:bg-green-700 dark:border-green-700",
    hover: "hover:bg-green-700 hover:border-green-700 dark:hover:bg-green-600",
    active: "active:bg-green-800 active:scale-[0.98]",
    focus:
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2",
    disabled:
      "disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none",
    loading: "opacity-80 cursor-wait pointer-events-none",
  },
  warning: {
    base: "bg-amber-500 text-white border border-amber-500 dark:bg-amber-600 dark:border-amber-600",
    hover: "hover:bg-amber-600 hover:border-amber-600 dark:hover:bg-amber-500",
    active: "active:bg-amber-700 active:scale-[0.98]",
    focus:
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2",
    disabled:
      "disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none",
    loading: "opacity-80 cursor-wait pointer-events-none",
  },
};

// ─── Size Resolver ────────────────────────────────────────────────────────────

const SIZE_MAP: Record<ButtonSize, SizeClasses> = {
  "2xs": {
    padding: "px-1.5 py-0.5",
    text: "text-[10px] font-medium tracking-wide",
    height: "h-5",
    iconSize: "w-2.5 h-2.5",
    gap: "gap-1",
    minWidth: "min-w-[28px]",
  },
  xs: {
    padding: "px-2 py-1",
    text: "text-xs font-medium",
    height: "h-6",
    iconSize: "w-3 h-3",
    gap: "gap-1",
    minWidth: "min-w-[32px]",
  },
  sm: {
    padding: "px-3 py-1.5",
    text: "text-xs font-medium",
    height: "h-8",
    iconSize: "w-3.5 h-3.5",
    gap: "gap-1.5",
    minWidth: "min-w-[48px]",
  },
  md: {
    padding: "px-4 py-2",
    text: "text-sm font-medium",
    height: "h-9",
    iconSize: "w-4 h-4",
    gap: "gap-2",
    minWidth: "min-w-[64px]",
  },
  lg: {
    padding: "px-5 py-2.5",
    text: "text-sm font-semibold",
    height: "h-10",
    iconSize: "w-4 h-4",
    gap: "gap-2",
    minWidth: "min-w-[80px]",
  },
  xl: {
    padding: "px-6 py-3",
    text: "text-base font-semibold",
    height: "h-12",
    iconSize: "w-5 h-5",
    gap: "gap-2.5",
    minWidth: "min-w-[96px]",
  },
  "2xl": {
    padding: "px-8 py-4",
    text: "text-lg font-semibold",
    height: "h-14",
    iconSize: "w-5 h-5",
    gap: "gap-3",
    minWidth: "min-w-[120px]",
  },
};

const ICON_ONLY_SIZE_MAP: Record<ButtonSize, string> = {
  "2xs": "w-5 h-5 p-0",
  xs: "w-6 h-6 p-0",
  sm: "w-8 h-8 p-0",
  md: "w-9 h-9 p-0",
  lg: "w-10 h-10 p-0",
  xl: "w-12 h-12 p-0",
  "2xl": "w-14 h-14 p-0",
};

const SHAPE_MAP: Record<ButtonShape, string> = {
  rounded: "rounded-lg",
  pill: "rounded-full",
  square: "rounded-none",
};

// ─── Provider ─────────────────────────────────────────────────────────────────

export const ButtonProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const resolveVariant = useCallback(
    (variant: ButtonVariant): VariantClasses =>
      VARIANT_MAP[variant] ?? VARIANT_MAP.solid,
    [],
  );

  const resolveSize = useCallback(
    (size: ButtonSize, iconOnly?: boolean): SizeClasses => {
      const base = SIZE_MAP[size] ?? SIZE_MAP.md;
      if (iconOnly) {
        return { ...base, padding: ICON_ONLY_SIZE_MAP[size] };
      }
      return base;
    },
    [],
  );

  const resolveShape = useCallback(
    (shape: ButtonShape): string => SHAPE_MAP[shape] ?? SHAPE_MAP.rounded,
    [],
  );

  return (
    <ButtonContext.Provider
      value={{ resolveVariant, resolveSize, resolveShape }}
    >
      {children}
    </ButtonContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useButtonContext = (): ButtonContextValue => {
  const ctx = useContext(ButtonContext);
  if (!ctx)
    throw new Error("useButtonContext must be used within <ButtonProvider>");
  return ctx;
};

// ─── Async click handler hook ─────────────────────────────────────────────────

export function useAsyncClick(
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>,
) {
  const [loading, setLoading] = React.useState(false);
  const mountedRef = useRef(true);

  React.useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handleClick = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!onClick) return;
      const result = onClick(e);
      if (result instanceof Promise) {
        setLoading(true);
        try {
          await result;
        } finally {
          if (mountedRef.current) setLoading(false);
        }
      }
    },
    [onClick],
  );

  return { loading, handleClick };
}

// ─── Toggle state hook ────────────────────────────────────────────────────────

export function useToggleState(
  controlled?: boolean,
  defaultValue = false,
  onChange?: (v: boolean) => void,
) {
  const isControlled = controlled !== undefined;
  const [internal, setInternal] = React.useState(defaultValue);
  const pressed = isControlled ? controlled : internal;

  const toggle = useCallback(() => {
    const next = !pressed;
    if (!isControlled) setInternal(next);
    onChange?.(next);
  }, [pressed, isControlled, onChange]);

  return { pressed, toggle };
}
