/* eslint-disable react-refresh/only-export-components */
"use client";

import React, {
  createContext,
  useContext,
  useCallback,
  type ReactNode,
} from "react";

export type ToggleSize = "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

export type ToggleVariant =
  | "solid"
  | "outline"
  | "soft"
  | "ghost";

export type ToggleShape = "rounded" | "pill" | "square";

export type ToggleGroupSelectionMode = "single" | "multiple";

interface ToggleSizeClasses {
  height: string;
  padding: string;
  text: string;
  iconSize: string;
  iconSizePx: number;
  gap: string;
  minWidth: string;
}

interface ToggleVariantClasses {
  base: string;
  hover: string;
  pressed: string;
  pressedHover: string;
  focus: string;
  disabled: string;
  active: string;
}

interface ToggleContextValue {
  resolveSize: (size: ToggleSize) => ToggleSizeClasses;
  resolveVariant: (variant: ToggleVariant) => ToggleVariantClasses;
  resolveShape: (shape: ToggleShape) => string;
}

const ToggleContext = createContext<ToggleContextValue | undefined>(undefined);

const SIZE_MAP: Record<ToggleSize, ToggleSizeClasses> = {
  "2xs": {
    height: "h-5",
    padding: "px-1.5",
    text: "text-[10px] font-medium",
    iconSize: "w-2.5 h-2.5",
    iconSizePx: 10,
    gap: "gap-0.5",
    minWidth: "min-w-[20px]",
  },
  xs: {
    height: "h-6",
    padding: "px-2",
    text: "text-xs font-medium",
    iconSize: "w-3 h-3",
    iconSizePx: 12,
    gap: "gap-1",
    minWidth: "min-w-[24px]",
  },
  sm: {
    height: "h-8",
    padding: "px-3",
    text: "text-xs font-medium",
    iconSize: "w-3.5 h-3.5",
    iconSizePx: 14,
    gap: "gap-1.5",
    minWidth: "min-w-[32px]",
  },
  md: {
    height: "h-9",
    padding: "px-3.5",
    text: "text-sm font-medium",
    iconSize: "w-4 h-4",
    iconSizePx: 16,
    gap: "gap-1.5",
    minWidth: "min-w-[36px]",
  },
  lg: {
    height: "h-10",
    padding: "px-4",
    text: "text-sm font-semibold",
    iconSize: "w-4 h-4",
    iconSizePx: 16,
    gap: "gap-2",
    minWidth: "min-w-[40px]",
  },
  xl: {
    height: "h-11",
    padding: "px-5",
    text: "text-base font-semibold",
    iconSize: "w-5 h-5",
    iconSizePx: 20,
    gap: "gap-2",
    minWidth: "min-w-[44px]",
  },
  "2xl": {
    height: "h-12",
    padding: "px-6",
    text: "text-lg font-semibold",
    iconSize: "w-5 h-5",
    iconSizePx: 20,
    gap: "gap-2.5",
    minWidth: "min-w-[48px]",
  },
};

const VARIANT_MAP: Record<ToggleVariant, ToggleVariantClasses> = {
  solid: {
    base: "bg-transparent text-zinc-600 dark:text-zinc-400 border border-transparent transition-all duration-150",
    hover: "hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100",
    pressed: "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-transparent",
    pressedHover: "hover:bg-zinc-800 dark:hover:bg-zinc-200",
    focus: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-1 dark:focus-visible:ring-zinc-100",
    disabled: "opacity-40 cursor-not-allowed pointer-events-none",
    active: "active:scale-95",
  },
  outline: {
    base: "bg-transparent text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 transition-all duration-150",
    hover: "hover:border-zinc-300 dark:hover:border-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-100",
    pressed: "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100",
    pressedHover: "hover:bg-zinc-800 dark:hover:bg-zinc-200",
    focus: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-1",
    disabled: "opacity-40 cursor-not-allowed pointer-events-none",
    active: "active:scale-95",
  },
  soft: {
    base: "bg-transparent text-zinc-600 dark:text-zinc-400 border border-transparent transition-all duration-150",
    hover: "hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100",
    pressed: "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-transparent",
    pressedHover: "hover:bg-zinc-200 dark:hover:bg-zinc-700",
    focus: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-1",
    disabled: "opacity-40 cursor-not-allowed pointer-events-none",
    active: "active:scale-95",
  },
  ghost: {
    base: "bg-transparent text-zinc-500 dark:text-zinc-500 border border-transparent transition-all duration-150",
    hover: "hover:text-zinc-900 dark:hover:text-zinc-100",
    pressed: "text-zinc-900 dark:text-zinc-100 border-transparent",
    pressedHover: "hover:text-zinc-700 dark:hover:text-zinc-300",
    focus: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-1",
    disabled: "opacity-40 cursor-not-allowed pointer-events-none",
    active: "active:scale-95",
  },
};

const SHAPE_MAP: Record<ToggleShape, string> = {
  rounded: "rounded-lg",
  pill: "rounded-full",
  square: "rounded-none",
};

export const ToggleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const resolveSize = useCallback(
    (size: ToggleSize): ToggleSizeClasses => SIZE_MAP[size] ?? SIZE_MAP.md,
    [],
  );

  const resolveVariant = useCallback(
    (variant: ToggleVariant): ToggleVariantClasses =>
      VARIANT_MAP[variant] ?? VARIANT_MAP.outline,
    [],
  );

  const resolveShape = useCallback(
    (shape: ToggleShape): string => SHAPE_MAP[shape] ?? SHAPE_MAP.rounded,
    [],
  );

  return (
    <ToggleContext.Provider value={{ resolveSize, resolveVariant, resolveShape }}>
      {children}
    </ToggleContext.Provider>
  );
};

export const useToggleContext = (): ToggleContextValue => {
  const ctx = useContext(ToggleContext);
  if (!ctx) throw new Error("useToggleContext must be used within <ToggleProvider>");
  return ctx;
};

export function useToggleState(
  controlled: boolean | undefined,
  defaultValue: boolean,
  onChange?: (pressed: boolean) => void,
) {
  const isControlled = controlled !== undefined;
  const [internal, setInternal] = React.useState(defaultValue);
  const pressed = isControlled ? controlled : internal;

  const toggle = useCallback(() => {
    const next = !pressed;
    if (!isControlled) setInternal(next);
    onChange?.(next);
  }, [pressed, isControlled, onChange]);

  const set = useCallback(
    (value: boolean) => {
      if (!isControlled) setInternal(value);
      onChange?.(value);
    },
    [isControlled, onChange],
  );

  return { pressed, toggle, set };
}

interface ToggleGroupContextValue {
  value: string[];
  onChange: (id: string, pressed: boolean) => void;
  mode: ToggleGroupSelectionMode;
  disabled?: boolean;
  size?: ToggleSize;
  variant?: ToggleVariant;
  shape?: ToggleShape;
}

const ToggleGroupContext = createContext<ToggleGroupContextValue | null>(null);

export const useToggleGroupContext = () => useContext(ToggleGroupContext);

export interface ToggleGroupProviderProps {
  children: ReactNode;
  mode?: ToggleGroupSelectionMode;
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  disabled?: boolean;
  size?: ToggleSize;
  variant?: ToggleVariant;
  shape?: ToggleShape;
}

export const ToggleGroupProvider: React.FC<ToggleGroupProviderProps> = ({
  children,
  mode = "multiple",
  value: controlledValue,
  defaultValue = [],
  onChange,
  disabled,
  size,
  variant,
  shape,
}) => {
  const isControlled = controlledValue !== undefined;
  const [internal, setInternal] = React.useState<string[]>(defaultValue);
  const value = isControlled ? controlledValue! : internal;

  const handleChange = useCallback(
    (id: string, pressed: boolean) => {
      let next: string[];
      if (mode === "single") {
        next = pressed ? [id] : [];
      } else {
        next = pressed ? [...value, id] : value.filter((v) => v !== id);
      }
      if (!isControlled) setInternal(next);
      onChange?.(next);
    },
    [value, mode, isControlled, onChange],
  );

  return (
    <ToggleGroupContext.Provider
      value={{ value, onChange: handleChange, mode, disabled, size, variant, shape }}
    >
      {children}
    </ToggleGroupContext.Provider>
  );
};