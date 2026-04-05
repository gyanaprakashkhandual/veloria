/* eslint-disable react-refresh/only-export-components */
"use client";

import React, {
  createContext,
  useContext,
  useCallback,
  type ReactNode,
} from "react";

export type SliderSize = "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

export type SliderVariant = "solid" | "outline" | "soft" | "ghost";

export type SliderOrientation = "horizontal" | "vertical";

export interface SliderMark {
  value: number;
  label?: string;
}

interface SliderSizeClasses {
  track: string;
  thumb: string;
  thumbSize: number;
  trackThickness: number;
  label: string;
  markDot: string;
  markLabel: string;
  tooltip: string;
  valueLabel: string;
}

interface SliderVariantClasses {
  track: string;
  fill: string;
  thumb: string;
  thumbHover: string;
  thumbFocus: string;
  thumbActive: string;
  thumbDisabled: string;
  mark: string;
  markActive: string;
}

interface SliderContextValue {
  resolveSize: (size: SliderSize) => SliderSizeClasses;
  resolveVariant: (variant: SliderVariant) => SliderVariantClasses;
}

const SliderContext = createContext<SliderContextValue | undefined>(undefined);

const SIZE_MAP: Record<SliderSize, SliderSizeClasses> = {
  "2xs": {
    track: "h-0.5",
    thumb: "w-2.5 h-2.5",
    thumbSize: 10,
    trackThickness: 2,
    label: "text-[10px] font-medium",
    markDot: "w-1 h-1",
    markLabel: "text-[9px]",
    tooltip: "text-[9px] px-1 py-0.5",
    valueLabel: "text-[10px]",
  },
  xs: {
    track: "h-1",
    thumb: "w-3 h-3",
    thumbSize: 12,
    trackThickness: 4,
    label: "text-xs font-medium",
    markDot: "w-1 h-1",
    markLabel: "text-[10px]",
    tooltip: "text-[10px] px-1.5 py-0.5",
    valueLabel: "text-xs",
  },
  sm: {
    track: "h-1.5",
    thumb: "w-3.5 h-3.5",
    thumbSize: 14,
    trackThickness: 6,
    label: "text-xs font-medium",
    markDot: "w-1.5 h-1.5",
    markLabel: "text-xs",
    tooltip: "text-xs px-1.5 py-0.5",
    valueLabel: "text-xs",
  },
  md: {
    track: "h-2",
    thumb: "w-4 h-4",
    thumbSize: 16,
    trackThickness: 8,
    label: "text-sm font-medium",
    markDot: "w-1.5 h-1.5",
    markLabel: "text-xs",
    tooltip: "text-xs px-2 py-1",
    valueLabel: "text-sm",
  },
  lg: {
    track: "h-2.5",
    thumb: "w-5 h-5",
    thumbSize: 20,
    trackThickness: 10,
    label: "text-sm font-semibold",
    markDot: "w-2 h-2",
    markLabel: "text-xs",
    tooltip: "text-sm px-2 py-1",
    valueLabel: "text-sm",
  },
  xl: {
    track: "h-3",
    thumb: "w-6 h-6",
    thumbSize: 24,
    trackThickness: 12,
    label: "text-base font-semibold",
    markDot: "w-2 h-2",
    markLabel: "text-sm",
    tooltip: "text-sm px-2.5 py-1",
    valueLabel: "text-base",
  },
  "2xl": {
    track: "h-4",
    thumb: "w-7 h-7",
    thumbSize: 28,
    trackThickness: 16,
    label: "text-lg font-semibold",
    markDot: "w-2.5 h-2.5",
    markLabel: "text-sm",
    tooltip: "text-base px-3 py-1.5",
    valueLabel: "text-lg",
  },
};

const VARIANT_MAP: Record<SliderVariant, SliderVariantClasses> = {
  solid: {
    track:
      "bg-zinc-200 dark:bg-zinc-700 rounded-full",
    fill: "bg-zinc-900 dark:bg-zinc-100 rounded-full",
    thumb:
      "bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-zinc-100 rounded-full shadow-sm transition-all duration-150",
    thumbHover: "hover:scale-110 hover:shadow-md",
    thumbFocus:
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 dark:focus-visible:ring-zinc-100",
    thumbActive: "active:scale-95",
    thumbDisabled: "opacity-40 cursor-not-allowed pointer-events-none",
    mark: "bg-zinc-300 dark:bg-zinc-600 rounded-full",
    markActive: "bg-zinc-900 dark:bg-zinc-100",
  },
  outline: {
    track: "bg-transparent border border-zinc-300 dark:border-zinc-600 rounded-full",
    fill: "bg-transparent border-t border-zinc-900 dark:border-zinc-100 rounded-full",
    thumb:
      "bg-white dark:bg-zinc-900 border-2 border-zinc-700 dark:border-zinc-300 rounded-full transition-all duration-150",
    thumbHover: "hover:border-zinc-900 dark:hover:border-zinc-100 hover:scale-110",
    thumbFocus:
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-2",
    thumbActive: "active:scale-95",
    thumbDisabled: "opacity-40 cursor-not-allowed pointer-events-none",
    mark: "bg-zinc-300 dark:bg-zinc-600 rounded-full",
    markActive: "bg-zinc-700 dark:bg-zinc-300",
  },
  soft: {
    track: "bg-zinc-100 dark:bg-zinc-800 rounded-full",
    fill: "bg-zinc-300 dark:bg-zinc-500 rounded-full",
    thumb:
      "bg-zinc-800 dark:bg-zinc-200 rounded-full transition-all duration-150",
    thumbHover: "hover:bg-zinc-900 dark:hover:bg-zinc-100 hover:scale-110",
    thumbFocus:
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2",
    thumbActive: "active:scale-95",
    thumbDisabled: "opacity-40 cursor-not-allowed pointer-events-none",
    mark: "bg-zinc-200 dark:bg-zinc-700 rounded-full",
    markActive: "bg-zinc-500 dark:bg-zinc-400",
  },
  ghost: {
    track: "bg-zinc-100 dark:bg-zinc-800 rounded-full",
    fill: "bg-zinc-400 dark:bg-zinc-400 rounded-full",
    thumb:
      "bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-600 rounded-full shadow-sm transition-all duration-150",
    thumbHover: "hover:border-zinc-500 dark:hover:border-zinc-400 hover:scale-110",
    thumbFocus:
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2",
    thumbActive: "active:scale-95",
    thumbDisabled: "opacity-40 cursor-not-allowed pointer-events-none",
    mark: "bg-zinc-200 dark:bg-zinc-700 rounded-full",
    markActive: "bg-zinc-400",
  },
};

export const SliderProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const resolveSize = useCallback(
    (size: SliderSize): SliderSizeClasses => SIZE_MAP[size] ?? SIZE_MAP.md,
    [],
  );

  const resolveVariant = useCallback(
    (variant: SliderVariant): SliderVariantClasses =>
      VARIANT_MAP[variant] ?? VARIANT_MAP.solid,
    [],
  );

  return (
    <SliderContext.Provider value={{ resolveSize, resolveVariant }}>
      {children}
    </SliderContext.Provider>
  );
};

export const useSliderContext = (): SliderContextValue => {
  const ctx = useContext(SliderContext);
  if (!ctx)
    throw new Error("useSliderContext must be used within <SliderProvider>");
  return ctx;
};

export function useSliderState(
  controlled: number | undefined,
  defaultValue: number,
  min: number,
  max: number,
  step: number,
  onChange?: (value: number) => void,
) {
  const isControlled = controlled !== undefined;
  const [internal, setInternal] = React.useState(defaultValue);
  const value = isControlled ? controlled : internal;

  const setValue = useCallback(
    (next: number) => {
      const clamped = Math.min(max, Math.max(min, next));
      const stepped = Math.round((clamped - min) / step) * step + min;
      const rounded = Math.round(stepped * 1e10) / 1e10;
      if (!isControlled) setInternal(rounded);
      onChange?.(rounded);
    },
    [min, max, step, isControlled, onChange],
  );

  return { value, setValue };
}

export function useRangeSliderState(
  controlled: [number, number] | undefined,
  defaultValue: [number, number],
  min: number,
  max: number,
  step: number,
  onChange?: (value: [number, number]) => void,
) {
  const isControlled = controlled !== undefined;
  const [internal, setInternal] = React.useState<[number, number]>(defaultValue);
  const value = isControlled ? controlled : internal;

  const setValue = useCallback(
    (next: [number, number]) => {
      const clamp = (v: number) =>
        Math.round(
          (Math.min(max, Math.max(min, v)) / step) * step * 1e10,
        ) / 1e10;
      const clamped: [number, number] = [clamp(next[0]), clamp(next[1])];
      if (!isControlled) setInternal(clamped);
      onChange?.(clamped);
    },
    [min, max, step, isControlled, onChange],
  );

  return { value, setValue };
}