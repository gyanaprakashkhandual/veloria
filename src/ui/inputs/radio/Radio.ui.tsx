import React, { forwardRef, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useRadioContext,
  useRadioGroupContext,
  RadioGroupProvider,
  RadioProvider,
  type RadioSize,
  type RadioVariant,
  type RadioOrientation,
  type RadioGroupProviderProps,
} from "./Radio.context";

function cx(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type" | "onChange"> {
  size?: RadioSize;
  variant?: RadioVariant;
  label?: React.ReactNode;
  description?: string;
  labelPlacement?: "right" | "left";
  onChange?: (value: string) => void;
  className?: string;
  radioClassName?: string;
  labelClassName?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      size = "md",
      variant = "solid",
      label,
      description,
      labelPlacement = "right",
      onChange,
      disabled: disabledProp,
      value = "",
      className,
      radioClassName,
      labelClassName,
      id: idProp,
      ...rest
    },
    ref,
  ) => {
    const { resolveSize, resolveVariant } = useRadioContext();
    const groupCtx = useRadioGroupContext();

    const resolvedSize = groupCtx?.size ?? size;
    const resolvedVariant = groupCtx?.variant ?? variant;
    const resolvedDisabled = groupCtx?.disabled ?? disabledProp ?? false;
    const name = groupCtx?.name ?? rest.name;

    const s = resolveSize(resolvedSize);
    const v = resolveVariant(resolvedVariant);

    const generatedId = useId();
    const id = idProp ?? generatedId;

    const isChecked = groupCtx
      ? groupCtx.value === String(value)
      : rest.checked ?? false;

    const handleChange = () => {
      if (resolvedDisabled) return;
      if (groupCtx) {
        groupCtx.onChange(String(value));
      } else {
        onChange?.(String(value));
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        handleChange();
      }
    };

    const ringClasses = cx(
      "relative shrink-0 inline-flex items-center justify-center rounded-full",
      "cursor-pointer select-none",
      s.ring,
      v.base,
      !isChecked && !resolvedDisabled ? v.hover : "",
      isChecked ? v.checked : "",
      v.focus,
      resolvedDisabled ? v.disabled : "",
      radioClassName,
    );

    return (
      <label
        htmlFor={id}
        className={cx(
          "inline-flex items-start cursor-pointer",
          labelPlacement === "left" ? "flex-row-reverse" : "flex-row",
          s.gap,
          resolvedDisabled ? "cursor-not-allowed opacity-60" : "",
          className,
        )}
      >
        <input
          ref={ref}
          id={id}
          type="radio"
          name={name}
          value={value}
          checked={isChecked}
          disabled={resolvedDisabled}
          onChange={handleChange}
          className="sr-only"
          {...rest}
        />

        <span
          role="radio"
          aria-checked={isChecked}
          tabIndex={resolvedDisabled ? -1 : 0}
          onKeyDown={handleKeyDown}
          onClick={(e) => {
            e.preventDefault();
            handleChange();
          }}
          className={ringClasses}
        >
          <AnimatePresence initial={false}>
            {isChecked && (
              <motion.span
                key="dot"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.15, ease: [0.34, 1.56, 0.64, 1] }}
                className={cx(
                  "rounded-full shrink-0",
                  s.dot,
                  v.dot,
                )}
              />
            )}
          </AnimatePresence>
        </span>

        {(label || description) && (
          <span className={cx("flex flex-col", labelClassName)}>
            {label && (
              <span className={cx(s.label, "text-zinc-800 dark:text-zinc-200 leading-none")}>
                {label}
              </span>
            )}
            {description && (
              <span className={cx(s.description, "text-zinc-500 dark:text-zinc-400 font-normal mt-0.5")}>
                {description}
              </span>
            )}
          </span>
        )}
      </label>
    );
  },
);

Radio.displayName = "Radio";

export interface RadioGroupProps extends Omit<RadioGroupProviderProps, "children"> {
  children: React.ReactNode;
  label?: string;
  description?: string;
  orientation?: RadioOrientation;
  error?: string;
  className?: string;
  legendClassName?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  children,
  label,
  description,
  orientation = "vertical",
  error,
  className,
  legendClassName,
  ...providerProps
}) => {
  const resolvedSize = providerProps.size ?? "md";

  const sizeToText: Record<RadioSize, { label: string; desc: string }> = {
    "2xs": { label: "text-[10px] font-semibold", desc: "text-[9px]" },
    xs:   { label: "text-xs font-semibold",       desc: "text-[10px]" },
    sm:   { label: "text-xs font-semibold",        desc: "text-xs" },
    md:   { label: "text-sm font-semibold",        desc: "text-xs" },
    lg:   { label: "text-sm font-bold",            desc: "text-sm" },
    xl:   { label: "text-base font-bold",          desc: "text-sm" },
    "2xl":{ label: "text-lg font-bold",            desc: "text-base" },
  };

  const t = sizeToText[resolvedSize];

  return (
    <RadioGroupProvider {...providerProps}>
      <fieldset className={cx("border-none p-0 m-0", className)}>
        {(label || description) && (
          <legend className={cx("mb-2.5", legendClassName)}>
            {label && (
              <span className={cx(t.label, "block text-zinc-800 dark:text-zinc-200")}>
                {label}
              </span>
            )}
            {description && (
              <span className={cx(t.desc, "block text-zinc-500 dark:text-zinc-400 font-normal mt-0.5")}>
                {description}
              </span>
            )}
          </legend>
        )}

        <div
          role="radiogroup"
          className={cx(
            "flex",
            orientation === "vertical" ? "flex-col gap-2.5" : "flex-row flex-wrap gap-4",
          )}
        >
          {children}
        </div>

        {error && (
          <p className="mt-1.5 text-xs text-red-500 dark:text-red-400 font-medium">
            {error}
          </p>
        )}
      </fieldset>
    </RadioGroupProvider>
  );
};

export interface CardRadioProps extends RadioProps {
  icon?: React.ReactNode;
  badge?: string;
  cardClassName?: string;
}

export const CardRadio = forwardRef<HTMLInputElement, CardRadioProps>(
  ({ icon, badge, cardClassName, label, description, value = "", size = "md", variant = "solid", disabled, ...rest }, ref) => {
    const groupCtx = useRadioGroupContext();
    const isChecked = groupCtx ? groupCtx.value === String(value) : rest.checked ?? false;
    const isDisabled = groupCtx?.disabled ?? disabled ?? false;

    return (
      <label
        className={cx(
          "relative flex items-start gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer select-none",
          "transition-all duration-150",
          "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900",
          !isChecked && !isDisabled
            ? "hover:border-zinc-300 dark:hover:border-zinc-600"
            : "",
          isChecked
            ? "border-zinc-900 bg-zinc-50 dark:border-zinc-100 dark:bg-zinc-800"
            : "",
          isDisabled ? "opacity-50 cursor-not-allowed" : "",
          cardClassName,
        )}
      >
        {badge && (
          <span className="absolute top-2 right-2 text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
            {badge}
          </span>
        )}

        <Radio
          ref={ref}
          value={value}
          size={size}
          variant={variant}
          disabled={disabled}
          radioClassName="mt-0.5"
          {...rest}
        />

        {(icon || label || description) && (
          <span className="flex flex-col gap-0.5 min-w-0">
            {icon && (
              <span className="mb-1 text-zinc-600 dark:text-zinc-400">{icon}</span>
            )}
            {label && (
              <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 leading-none">
                {label}
              </span>
            )}
            {description && (
              <span className="text-xs text-zinc-500 dark:text-zinc-400 font-normal">
                {description}
              </span>
            )}
          </span>
        )}
      </label>
    );
  },
);

CardRadio.displayName = "CardRadio";

export interface SegmentedRadioOption {
  value: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface SegmentedRadioProps {
  options: SegmentedRadioOption[];
  name: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  size?: RadioSize;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export const SegmentedRadio: React.FC<SegmentedRadioProps> = ({
  options,
  name,
  value: controlledValue,
  defaultValue = "",
  onChange,
  size = "md",
  disabled = false,
  fullWidth = false,
  className,
}) => {
  const isControlled = controlledValue !== undefined;
  const [internal, setInternal] = React.useState(defaultValue);
  const value = isControlled ? controlledValue! : internal;

  const sizeClasses: Record<RadioSize, { wrap: string; item: string; text: string; icon: string }> = {
    "2xs": { wrap: "p-0.5 gap-0.5 rounded-md",   item: "px-2 py-0.5 rounded-[5px]",    text: "text-[10px]", icon: "w-2.5 h-2.5" },
    xs:    { wrap: "p-0.5 gap-0.5 rounded-md",   item: "px-2.5 py-1 rounded-[5px]",    text: "text-xs",     icon: "w-3 h-3" },
    sm:    { wrap: "p-0.5 gap-0.5 rounded-lg",   item: "px-3 py-1.5 rounded-md",        text: "text-xs",     icon: "w-3.5 h-3.5" },
    md:    { wrap: "p-1 gap-0.5 rounded-xl",     item: "px-3.5 py-1.5 rounded-[9px]",  text: "text-sm",     icon: "w-4 h-4" },
    lg:    { wrap: "p-1 gap-1 rounded-xl",       item: "px-4 py-2 rounded-[9px]",      text: "text-sm",     icon: "w-4 h-4" },
    xl:    { wrap: "p-1 gap-1 rounded-2xl",      item: "px-5 py-2.5 rounded-xl",       text: "text-base",   icon: "w-5 h-5" },
    "2xl": { wrap: "p-1.5 gap-1 rounded-2xl",   item: "px-6 py-3 rounded-xl",         text: "text-lg",     icon: "w-5 h-5" },
  };

  const sc = sizeClasses[size];

  const handleChange = (val: string) => {
    if (disabled) return;
    if (!isControlled) setInternal(val);
    onChange?.(val);
  };

  return (
    <div
      role="radiogroup"
      className={cx(
        "relative inline-flex items-center",
        "bg-zinc-100 dark:bg-zinc-800",
        sc.wrap,
        fullWidth ? "w-full" : "",
        disabled ? "opacity-50 pointer-events-none" : "",
        className,
      )}
    >
      {options.map((opt) => {
        const isSelected = value === opt.value;
        const isOptDisabled = disabled || opt.disabled;

        return (
          <label
            key={opt.value}
            className={cx(
              "relative flex items-center justify-center gap-1.5 cursor-pointer select-none",
              "font-medium transition-colors duration-150 z-10",
              sc.item,
              sc.text,
              fullWidth ? "flex-1" : "",
              isSelected
                ? "text-zinc-900 dark:text-zinc-100"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300",
              isOptDisabled ? "opacity-40 cursor-not-allowed pointer-events-none" : "",
            )}
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={isSelected}
              disabled={isOptDisabled}
              onChange={() => handleChange(opt.value)}
              className="sr-only"
            />

            {isSelected && (
              <motion.span
                layoutId={`segmented-pill-${name}`}
                className="absolute inset-0 bg-white dark:bg-zinc-900 shadow-sm rounded-[inherit]"
                style={{ borderRadius: "inherit" }}
                transition={{ type: "spring", stiffness: 400, damping: 35 }}
              />
            )}

            {opt.icon && (
              <span className={cx("relative z-10 flex items-center", sc.icon)}>
                {opt.icon}
              </span>
            )}
            <span className="relative z-10">{opt.label}</span>
          </label>
        );
      })}
    </div>
  );
};

export { RadioProvider, useRadioContext };
export type { RadioSize, RadioVariant, RadioOrientation };