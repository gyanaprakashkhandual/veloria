/* eslint-disable react-refresh/only-export-components */
"use client";

import React, {
  createContext,
  useContext,
  useCallback,
  type ReactNode,
} from "react";

export type SwitchSize = "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

export type SwitchVariant = "solid" | "outline" | "soft" | "ghost";

export type SwitchShape = "pill" | "rounded" | "square";

interface SwitchSizeClasses {
  track: string;
  trackWidth: number;
  trackHeight: number;
  thumb: string;
  thumbSize: number;
  thumbOffset: number;
  label: string;
  description: string;
  gap: string;
  iconSize: number;
}

interface SwitchVariantClasses {
  trackOff: string;
  trackOn: string;
  trackHoverOff: string;
  trackHoverOn: string;
  focus: string;
  disabled: string;
  thumbOff: string;
  thumbOn: string;
}

interface SwitchContextValue {
  resolveSize: (size: SwitchSize) => SwitchSizeClasses;
  resolveVariant: (variant: SwitchVariant) => SwitchVariantClasses;
  resolveShape: (shape: SwitchShape) => { track: string; thumb: string };
}

const SwitchContext = createContext<SwitchContextValue | undefined>(undefined);

const SIZE_MAP: Record<SwitchSize, SwitchSizeClasses> = {
  "2xs": {
    track: "w-6 h-3.5",
    trackWidth: 24,
    trackHeight: 14,
    thumb: "w-2.5 h-2.5",
    thumbSize: 10,
    thumbOffset: 2,
    label: "text-[10px] font-medium",
    description: "text-[9px]",
    gap: "gap-1",
    iconSize: 6,
  },
  xs: {
    track: "w-7 h-4",
    trackWidth: 28,
    trackHeight: 16,
    thumb: "w-3 h-3",
    thumbSize: 12,
    thumbOffset: 2,
    label: "text-xs font-medium",
    description: "text-[10px]",
    gap: "gap-1.5",
    iconSize: 7,
  },
  sm: {
    track: "w-8 h-[18px]",
    trackWidth: 32,
    trackHeight: 18,
    thumb: "w-3.5 h-3.5",
    thumbSize: 14,
    thumbOffset: 2,
    label: "text-xs font-medium",
    description: "text-xs",
    gap: "gap-1.5",
    iconSize: 8,
  },
  md: {
    track: "w-10 h-[22px]",
    trackWidth: 40,
    trackHeight: 22,
    thumb: "w-[18px] h-[18px]",
    thumbSize: 18,
    thumbOffset: 2,
    label: "text-sm font-medium",
    description: "text-xs",
    gap: "gap-2",
    iconSize: 10,
  },
  lg: {
    track: "w-12 h-7",
    trackWidth: 48,
    trackHeight: 28,
    thumb: "w-[22px] h-[22px]",
    thumbSize: 22,
    thumbOffset: 3,
    label: "text-sm font-semibold",
    description: "text-sm",
    gap: "gap-2",
    iconSize: 12,
  },
  xl: {
    track: "w-14 h-8",
    trackWidth: 56,
    trackHeight: 32,
    thumb: "w-[26px] h-[26px]",
    thumbSize: 26,
    thumbOffset: 3,
    label: "text-base font-semibold",
    description: "text-sm",
    gap: "gap-2.5",
    iconSize: 14,
  },
  "2xl": {
    track: "w-16 h-9",
    trackWidth: 64,
    trackHeight: 36,
    thumb: "w-[30px] h-[30px]",
    thumbSize: 30,
    thumbOffset: 3,
    label: "text-lg font-semibold",
    description: "text-base",
    gap: "gap-3",
    iconSize: 16,
  },
};

const VARIANT_MAP: Record<SwitchVariant, SwitchVariantClasses> = {
  solid: {
    trackOff: "bg-zinc-200 dark:bg-zinc-700 transition-colors duration-200",
    trackOn: "bg-zinc-900 dark:bg-zinc-100",
    trackHoverOff: "hover:bg-zinc-300 dark:hover:bg-zinc-600",
    trackHoverOn: "hover:bg-zinc-800 dark:hover:bg-zinc-200",
    focus: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 dark:focus-visible:ring-zinc-100",
    disabled: "opacity-40 cursor-not-allowed pointer-events-none",
    thumbOff: "bg-white dark:bg-zinc-300 shadow-sm",
    thumbOn: "bg-white dark:bg-zinc-900",
  },
  outline: {
    trackOff: "bg-transparent border-2 border-zinc-300 dark:border-zinc-600 transition-colors duration-200",
    trackOn: "bg-transparent border-2 border-zinc-900 dark:border-zinc-100",
    trackHoverOff: "hover:border-zinc-400 dark:hover:border-zinc-500",
    trackHoverOn: "hover:border-zinc-700 dark:hover:border-zinc-200",
    focus: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-2",
    disabled: "opacity-40 cursor-not-allowed pointer-events-none",
    thumbOff: "bg-zinc-300 dark:bg-zinc-600",
    thumbOn: "bg-zinc-900 dark:bg-zinc-100",
  },
  soft: {
    trackOff: "bg-zinc-100 dark:bg-zinc-800 transition-colors duration-200",
    trackOn: "bg-zinc-200 dark:bg-zinc-700",
    trackHoverOff: "hover:bg-zinc-200 dark:hover:bg-zinc-700",
    trackHoverOn: "hover:bg-zinc-300 dark:hover:bg-zinc-600",
    focus: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2",
    disabled: "opacity-40 cursor-not-allowed pointer-events-none",
    thumbOff: "bg-zinc-400 dark:bg-zinc-500",
    thumbOn: "bg-zinc-800 dark:bg-zinc-200",
  },
  ghost: {
    trackOff: "bg-zinc-100 dark:bg-zinc-800 transition-colors duration-200",
    trackOn: "bg-zinc-100 dark:bg-zinc-800",
    trackHoverOff: "hover:bg-zinc-200 dark:hover:bg-zinc-700",
    trackHoverOn: "hover:bg-zinc-200 dark:hover:bg-zinc-700",
    focus: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2",
    disabled: "opacity-40 cursor-not-allowed pointer-events-none",
    thumbOff: "bg-zinc-400 dark:bg-zinc-500",
    thumbOn: "bg-zinc-900 dark:bg-zinc-100",
  },
};

const SHAPE_MAP: Record<SwitchShape, { track: string; thumb: string }> = {
  pill: { track: "rounded-full", thumb: "rounded-full" },
  rounded: { track: "rounded-lg", thumb: "rounded-md" },
  square: { track: "rounded-none", thumb: "rounded-none" },
};

export const SwitchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const resolveSize = useCallback(
    (size: SwitchSize): SwitchSizeClasses => SIZE_MAP[size] ?? SIZE_MAP.md,
    [],
  );

  const resolveVariant = useCallback(
    (variant: SwitchVariant): SwitchVariantClasses =>
      VARIANT_MAP[variant] ?? VARIANT_MAP.solid,
    [],
  );

  const resolveShape = useCallback(
    (shape: SwitchShape) => SHAPE_MAP[shape] ?? SHAPE_MAP.pill,
    [],
  );

  return (
    <SwitchContext.Provider value={{ resolveSize, resolveVariant, resolveShape }}>
      {children}
    </SwitchContext.Provider>
  );
};

export const useSwitchContext = (): SwitchContextValue => {
  const ctx = useContext(SwitchContext);
  if (!ctx) throw new Error("useSwitchContext must be used within <SwitchProvider>");
  return ctx;
};

export function useSwitchState(
  controlled: boolean | undefined,
  defaultValue: boolean,
  onChange?: (checked: boolean) => void,
) {
  const isControlled = controlled !== undefined;
  const [internal, setInternal] = React.useState(defaultValue);
  const checked = isControlled ? controlled : internal;

  const toggle = useCallback(() => {
    const next = !checked;
    if (!isControlled) setInternal(next);
    onChange?.(next);
  }, [checked, isControlled, onChange]);

  const set = useCallback(
    (value: boolean) => {
      if (!isControlled) setInternal(value);
      onChange?.(value);
    },
    [isControlled, onChange],
  );

  return { checked, toggle, set };
}

interface SwitchGroupContextValue {
  values: Record<string, boolean>;
  onChange: (name: string, checked: boolean) => void;
  disabled?: boolean;
  size?: SwitchSize;
  variant?: SwitchVariant;
}

const SwitchGroupContext = createContext<SwitchGroupContextValue | null>(null);

export const useSwitchGroupContext = () => useContext(SwitchGroupContext);

export interface SwitchGroupProviderProps {
  children: ReactNode;
  values?: Record<string, boolean>;
  defaultValues?: Record<string, boolean>;
  onChange?: (values: Record<string, boolean>) => void;
  disabled?: boolean;
  size?: SwitchSize;
  variant?: SwitchVariant;
}

export const SwitchGroupProvider: React.FC<SwitchGroupProviderProps> = ({
  children,
  values: controlledValues,
  defaultValues = {},
  onChange,
  disabled,
  size,
  variant,
}) => {
  const isControlled = controlledValues !== undefined;
  const [internal, setInternal] = React.useState<Record<string, boolean>>(defaultValues);
  const values = isControlled ? controlledValues! : internal;

  const handleChange = useCallback(
    (name: string, checked: boolean) => {
      const next = { ...values, [name]: checked };
      if (!isControlled) setInternal(next);
      onChange?.(next);
    },
    [values, isControlled, onChange],
  );

  return (
    <SwitchGroupContext.Provider value={{ values, onChange: handleChange, disabled, size, variant }}>
      {children}
    </SwitchGroupContext.Provider>
  );
};