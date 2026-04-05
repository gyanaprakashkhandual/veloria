/* eslint-disable react-refresh/only-export-components */
"use client";

import React, {
  createContext,
  useContext,
  useCallback,
  type ReactNode,
} from "react";

export type RadioSize = "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

export type RadioVariant = "solid" | "outline" | "soft" | "ghost";

export type RadioOrientation = "horizontal" | "vertical";

interface RadioSizeClasses {
  ring: string;
  dot: string;
  ringSize: number;
  label: string;
  description: string;
  gap: string;
}

interface RadioVariantClasses {
  base: string;
  hover: string;
  checked: string;
  focus: string;
  disabled: string;
  dot: string;
}

interface RadioContextValue {
  resolveSize: (size: RadioSize) => RadioSizeClasses;
  resolveVariant: (variant: RadioVariant) => RadioVariantClasses;
}

const RadioContext = createContext<RadioContextValue | undefined>(undefined);

const SIZE_MAP: Record<RadioSize, RadioSizeClasses> = {
  "2xs": {
    ring: "w-3 h-3",
    dot: "w-1 h-1",
    ringSize: 12,
    label: "text-[10px] font-medium",
    description: "text-[9px]",
    gap: "gap-1",
  },
  xs: {
    ring: "w-3.5 h-3.5",
    dot: "w-1.5 h-1.5",
    ringSize: 14,
    label: "text-xs font-medium",
    description: "text-[10px]",
    gap: "gap-1.5",
  },
  sm: {
    ring: "w-4 h-4",
    dot: "w-1.5 h-1.5",
    ringSize: 16,
    label: "text-xs font-medium",
    description: "text-xs",
    gap: "gap-1.5",
  },
  md: {
    ring: "w-[18px] h-[18px]",
    dot: "w-2 h-2",
    ringSize: 18,
    label: "text-sm font-medium",
    description: "text-xs",
    gap: "gap-2",
  },
  lg: {
    ring: "w-5 h-5",
    dot: "w-2 h-2",
    ringSize: 20,
    label: "text-sm font-semibold",
    description: "text-sm",
    gap: "gap-2",
  },
  xl: {
    ring: "w-6 h-6",
    dot: "w-2.5 h-2.5",
    ringSize: 24,
    label: "text-base font-semibold",
    description: "text-sm",
    gap: "gap-2.5",
  },
  "2xl": {
    ring: "w-7 h-7",
    dot: "w-3 h-3",
    ringSize: 28,
    label: "text-lg font-semibold",
    description: "text-base",
    gap: "gap-3",
  },
};

const VARIANT_MAP: Record<RadioVariant, RadioVariantClasses> = {
  solid: {
    base: "border-2 border-zinc-300 bg-white dark:border-zinc-600 dark:bg-zinc-900 transition-all duration-150",
    hover: "hover:border-zinc-400 dark:hover:border-zinc-500",
    checked: "border-zinc-900 bg-zinc-900 dark:border-zinc-100 dark:bg-zinc-100",
    focus: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 dark:focus-visible:ring-zinc-100",
    disabled: "opacity-40 cursor-not-allowed pointer-events-none",
    dot: "bg-white dark:bg-zinc-900",
  },
  outline: {
    base: "border-2 border-zinc-300 bg-transparent dark:border-zinc-600 transition-all duration-150",
    hover: "hover:border-zinc-500 dark:hover:border-zinc-400",
    checked: "border-zinc-900 bg-transparent dark:border-zinc-100",
    focus: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-2",
    disabled: "opacity-40 cursor-not-allowed pointer-events-none",
    dot: "bg-zinc-900 dark:bg-zinc-100",
  },
  soft: {
    base: "border-2 border-transparent bg-zinc-100 dark:bg-zinc-800 transition-all duration-150",
    hover: "hover:bg-zinc-200 dark:hover:bg-zinc-700",
    checked: "border-transparent bg-zinc-200 dark:bg-zinc-700",
    focus: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2",
    disabled: "opacity-40 cursor-not-allowed pointer-events-none",
    dot: "bg-zinc-800 dark:bg-zinc-200",
  },
  ghost: {
    base: "border-2 border-transparent bg-transparent transition-all duration-150",
    hover: "hover:bg-zinc-100 dark:hover:bg-zinc-800",
    checked: "border-transparent bg-transparent",
    focus: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2",
    disabled: "opacity-40 cursor-not-allowed pointer-events-none",
    dot: "bg-zinc-800 dark:bg-zinc-200",
  },
};

export const RadioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const resolveSize = useCallback(
    (size: RadioSize): RadioSizeClasses => SIZE_MAP[size] ?? SIZE_MAP.md,
    [],
  );

  const resolveVariant = useCallback(
    (variant: RadioVariant): RadioVariantClasses =>
      VARIANT_MAP[variant] ?? VARIANT_MAP.solid,
    [],
  );

  return (
    <RadioContext.Provider value={{ resolveSize, resolveVariant }}>
      {children}
    </RadioContext.Provider>
  );
};

export const useRadioContext = (): RadioContextValue => {
  const ctx = useContext(RadioContext);
  if (!ctx) throw new Error("useRadioContext must be used within <RadioProvider>");
  return ctx;
};

interface RadioGroupContextValue {
  value: string;
  onChange: (value: string) => void;
  name: string;
  disabled?: boolean;
  size?: RadioSize;
  variant?: RadioVariant;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export const useRadioGroupContext = () => useContext(RadioGroupContext);

export interface RadioGroupProviderProps {
  children: ReactNode;
  name: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  size?: RadioSize;
  variant?: RadioVariant;
}

export const RadioGroupProvider: React.FC<RadioGroupProviderProps> = ({
  children,
  name,
  value: controlledValue,
  defaultValue = "",
  onChange,
  disabled,
  size,
  variant,
}) => {
  const isControlled = controlledValue !== undefined;
  const [internal, setInternal] = React.useState(defaultValue);
  const value = isControlled ? controlledValue! : internal;

  const handleChange = useCallback(
    (next: string) => {
      if (!isControlled) setInternal(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  return (
    <RadioGroupContext.Provider
      value={{ value, onChange: handleChange, name, disabled, size, variant }}
    >
      {children}
    </RadioGroupContext.Provider>
  );
};