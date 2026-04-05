import React, {
  createContext,
  useContext,
  useCallback,
  useRef,
  type ReactNode,
} from "react";

export type CheckboxSize = "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

export type CheckboxVariant = "solid" | "outline" | "soft" | "ghost";

export type CheckboxShape = "rounded" | "square" | "circle";

export type CheckboxState = "unchecked" | "checked" | "indeterminate";

export interface CheckboxConfig {
  size?: CheckboxSize;
  variant?: CheckboxVariant;
  shape?: CheckboxShape;
  disabled?: boolean;
  loading?: boolean;
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  required?: boolean;
  "aria-label"?: string;
  "aria-describedby"?: string;
}

export interface CheckboxGroupConfig {
  size?: CheckboxSize;
  variant?: CheckboxVariant;
  shape?: CheckboxShape;
  disabled?: boolean;
  orientation?: "horizontal" | "vertical";
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
}

interface CheckboxSizeClasses {
  box: string;
  icon: string;
  label: string;
  gap: string;
  description: string;
}

interface CheckboxVariantClasses {
  base: string;
  hover: string;
  checked: string;
  indeterminate: string;
  focus: string;
  disabled: string;
  loading: string;
}

interface CheckboxContextValue {
  resolveSize: (size: CheckboxSize) => CheckboxSizeClasses;
  resolveVariant: (variant: CheckboxVariant) => CheckboxVariantClasses;
  resolveShape: (shape: CheckboxShape) => string;
}

const CheckboxContext = createContext<CheckboxContextValue | undefined>(
  undefined,
);

const SIZE_MAP: Record<CheckboxSize, CheckboxSizeClasses> = {
  "2xs": {
    box: "w-3 h-3",
    icon: "w-2 h-2",
    label: "text-[10px] font-medium",
    gap: "gap-1",
    description: "text-[9px]",
  },
  xs: {
    box: "w-3.5 h-3.5",
    icon: "w-2.5 h-2.5",
    label: "text-xs font-medium",
    gap: "gap-1.5",
    description: "text-[10px]",
  },
  sm: {
    box: "w-4 h-4",
    icon: "w-3 h-3",
    label: "text-xs font-medium",
    gap: "gap-1.5",
    description: "text-xs",
  },
  md: {
    box: "w-[18px] h-[18px]",
    icon: "w-3 h-3",
    label: "text-sm font-medium",
    gap: "gap-2",
    description: "text-xs",
  },
  lg: {
    box: "w-5 h-5",
    icon: "w-3.5 h-3.5",
    label: "text-sm font-semibold",
    gap: "gap-2",
    description: "text-sm",
  },
  xl: {
    box: "w-6 h-6",
    icon: "w-4 h-4",
    label: "text-base font-semibold",
    gap: "gap-2.5",
    description: "text-sm",
  },
  "2xl": {
    box: "w-7 h-7",
    icon: "w-5 h-5",
    label: "text-lg font-semibold",
    gap: "gap-3",
    description: "text-base",
  },
};

const VARIANT_MAP: Record<CheckboxVariant, CheckboxVariantClasses> = {
  solid: {
    base: "border-2 border-zinc-300 bg-white dark:border-zinc-600 dark:bg-zinc-900 transition-all duration-150",
    hover: "hover:border-zinc-400 dark:hover:border-zinc-500",
    checked:
      "border-zinc-900 bg-zinc-900 dark:border-zinc-100 dark:bg-zinc-100",
    indeterminate:
      "border-zinc-900 bg-zinc-900 dark:border-zinc-100 dark:bg-zinc-100",
    focus:
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 dark:focus-visible:ring-zinc-100",
    disabled: "opacity-40 cursor-not-allowed pointer-events-none",
    loading: "opacity-60 cursor-wait pointer-events-none animate-pulse",
  },
  outline: {
    base: "border-2 border-zinc-300 bg-transparent dark:border-zinc-600 transition-all duration-150",
    hover: "hover:border-zinc-500 dark:hover:border-zinc-400",
    checked: "border-zinc-900 bg-transparent dark:border-zinc-100",
    indeterminate: "border-zinc-900 bg-transparent dark:border-zinc-100",
    focus:
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-2",
    disabled: "opacity-40 cursor-not-allowed pointer-events-none",
    loading: "opacity-60 cursor-wait pointer-events-none animate-pulse",
  },
  soft: {
    base: "border-2 border-transparent bg-zinc-100 dark:bg-zinc-800 transition-all duration-150",
    hover: "hover:bg-zinc-200 dark:hover:bg-zinc-700",
    checked: "border-transparent bg-zinc-200 dark:bg-zinc-700",
    indeterminate: "border-transparent bg-zinc-200 dark:bg-zinc-700",
    focus:
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2",
    disabled: "opacity-40 cursor-not-allowed pointer-events-none",
    loading: "opacity-60 cursor-wait pointer-events-none animate-pulse",
  },
  ghost: {
    base: "border-2 border-transparent bg-transparent transition-all duration-150",
    hover: "hover:bg-zinc-100 dark:hover:bg-zinc-800",
    checked: "border-transparent bg-transparent",
    indeterminate: "border-transparent bg-transparent",
    focus:
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2",
    disabled: "opacity-40 cursor-not-allowed pointer-events-none",
    loading: "opacity-60 cursor-wait pointer-events-none animate-pulse",
  },
};

const SHAPE_MAP: Record<CheckboxShape, string> = {
  rounded: "rounded-md",
  square: "rounded-none",
  circle: "rounded-full",
};

export const CheckboxProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const resolveSize = useCallback(
    (size: CheckboxSize): CheckboxSizeClasses => SIZE_MAP[size] ?? SIZE_MAP.md,
    [],
  );

  const resolveVariant = useCallback(
    (variant: CheckboxVariant): CheckboxVariantClasses =>
      VARIANT_MAP[variant] ?? VARIANT_MAP.solid,
    [],
  );

  const resolveShape = useCallback(
    (shape: CheckboxShape): string => SHAPE_MAP[shape] ?? SHAPE_MAP.rounded,
    [],
  );

  return (
    <CheckboxContext.Provider
      value={{ resolveSize, resolveVariant, resolveShape }}
    >
      {children}
    </CheckboxContext.Provider>
  );
};

export const useCheckboxContext = (): CheckboxContextValue => {
  const ctx = useContext(CheckboxContext);
  if (!ctx)
    throw new Error(
      "useCheckboxContext must be used within <CheckboxProvider>",
    );
  return ctx;
};

export function useCheckboxState(
  controlled?: boolean,
  defaultValue = false,
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

interface CheckboxGroupContextValue {
  value: string[];
  onChange: (id: string, checked: boolean) => void;
  disabled?: boolean;
  size?: CheckboxSize;
  variant?: CheckboxVariant;
  shape?: CheckboxShape;
}

const CheckboxGroupContext = createContext<CheckboxGroupContextValue | null>(
  null,
);

export const useCheckboxGroupContext = () => useContext(CheckboxGroupContext);

export interface CheckboxGroupProviderProps {
  children: ReactNode;
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  disabled?: boolean;
  size?: CheckboxSize;
  variant?: CheckboxVariant;
  shape?: CheckboxShape;
}

export const CheckboxGroupProvider: React.FC<CheckboxGroupProviderProps> = ({
  children,
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
    (id: string, checked: boolean) => {
      const next = checked ? [...value, id] : value.filter((v) => v !== id);
      if (!isControlled) setInternal(next);
      onChange?.(next);
    },
    [value, isControlled, onChange],
  );

  return (
    <CheckboxGroupContext.Provider
      value={{ value, onChange: handleChange, disabled, size, variant, shape }}
    >
      {children}
    </CheckboxGroupContext.Provider>
  );
};
