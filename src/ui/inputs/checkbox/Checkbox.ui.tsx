/* eslint-disable react-refresh/only-export-components */
import React, { forwardRef, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useCheckboxContext,
  useCheckboxState,
  useCheckboxGroupContext,
  CheckboxGroupProvider,
  type CheckboxSize,
  type CheckboxVariant,
  type CheckboxShape,
  type CheckboxGroupProviderProps,
  CheckboxProvider,
} from "./Checkbox.context";

function cx(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <polyline
        points="1.5,6 4.5,9 10.5,3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IndeterminateIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <line
        x1="2"
        y1="6"
        x2="10"
        y2="6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cx("animate-spin shrink-0", className)}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export interface CheckboxProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "size" | "type" | "onChange" | "checked" | "defaultChecked"
  > {
  size?: CheckboxSize;
  variant?: CheckboxVariant;
  shape?: CheckboxShape;
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  loading?: boolean;
  label?: React.ReactNode;
  description?: string;
  labelPlacement?: "right" | "left";
  onChange?: (checked: boolean) => void;
  className?: string;
  checkboxClassName?: string;
  labelClassName?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      size = "md",
      variant = "solid",
      shape = "rounded",
      checked: checkedProp,
      defaultChecked = false,
      indeterminate = false,
      loading = false,
      label,
      description,
      labelPlacement = "right",
      onChange,
      disabled: disabledProp,
      className,
      checkboxClassName,
      labelClassName,
      id: idProp,
      ...rest
    },
    ref,
  ) => {
    const { resolveSize, resolveVariant, resolveShape } = useCheckboxContext();
    const groupCtx = useCheckboxGroupContext();

    const resolvedSize = groupCtx?.size ?? size;
    const resolvedVariant = groupCtx?.variant ?? variant;
    const resolvedShape = groupCtx?.shape ?? shape;
    const resolvedDisabled = groupCtx?.disabled ?? disabledProp ?? false;

    const s = resolveSize(resolvedSize);
    const v = resolveVariant(resolvedVariant);
    const shapeClass = resolveShape(resolvedShape);

    const generatedId = useId();
    const id = idProp ?? generatedId;

    const isGrouped = !!groupCtx && !!rest.value;

    const groupChecked = isGrouped
      ? groupCtx!.value.includes(String(rest.value))
      : undefined;

    const { checked, toggle } = useCheckboxState(
      isGrouped ? groupChecked : checkedProp,
      defaultChecked,
      (next) => {
        if (isGrouped) {
          groupCtx!.onChange(String(rest.value), next);
        } else {
          onChange?.(next);
        }
      },
    );

    const isChecked = checked;
    const isDisabled = resolvedDisabled || loading;
    const isIndeterminate = indeterminate && !isChecked;

    const iconColor =
      resolvedVariant === "solid"
        ? "text-white dark:text-zinc-900"
        : resolvedVariant === "outline"
          ? "text-zinc-900 dark:text-zinc-100"
          : resolvedVariant === "soft"
            ? "text-zinc-800 dark:text-zinc-200"
            : "text-zinc-800 dark:text-zinc-200";

    const boxClasses = cx(
      "relative shrink-0 inline-flex items-center justify-center",
      "cursor-pointer select-none",
      s.box,
      shapeClass,
      v.base,
      !isChecked && !isIndeterminate && !isDisabled ? v.hover : "",
      isChecked || isIndeterminate ? v.checked : "",
      v.focus,
      isDisabled ? v.disabled : "",
      loading ? v.loading : "",
      checkboxClassName,
    );

    const wrapperClasses = cx(
      "inline-flex items-start",
      labelPlacement === "left" ? "flex-row-reverse" : "flex-row",
      s.gap,
      className,
    );

    const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (!isDisabled) toggle();
      }
    };

    return (
      <label
        htmlFor={id}
        className={cx(
          "inline-flex items-start cursor-pointer",
          labelPlacement === "left" ? "flex-row-reverse" : "flex-row",
          s.gap,
          isDisabled ? "cursor-not-allowed opacity-60" : "",
          className,
        )}
      >
        <input
          ref={ref}
          id={id}
          type="checkbox"
          checked={isChecked}
          disabled={isDisabled}
          onChange={() => {
            if (!isDisabled) toggle();
          }}
          aria-checked={isIndeterminate ? "mixed" : isChecked}
          className="sr-only"
          {...rest}
        />

        <span
          role="checkbox"
          aria-checked={isIndeterminate ? "mixed" : isChecked}
          tabIndex={isDisabled ? -1 : 0}
          onKeyDown={handleKeyDown}
          onClick={(e) => {
            e.preventDefault();
            if (!isDisabled) toggle();
          }}
          className={boxClasses}
        >
          <AnimatePresence mode="wait" initial={false}>
            {loading ? (
              <motion.span
                key="spinner"
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.4 }}
                transition={{ duration: 0.12 }}
                className="flex items-center justify-center"
              >
                <Spinner
                  className={cx(
                    s.icon,
                    resolvedVariant === "solid"
                      ? "text-zinc-400 dark:text-zinc-600"
                      : "text-zinc-500 dark:text-zinc-400",
                  )}
                />
              </motion.span>
            ) : isIndeterminate ? (
              <motion.span
                key="indeterminate"
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.4 }}
                transition={{ duration: 0.12, ease: "easeOut" }}
                className="flex items-center justify-center"
              >
                <IndeterminateIcon className={cx(s.icon, iconColor)} />
              </motion.span>
            ) : isChecked ? (
              <motion.span
                key="check"
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.4 }}
                transition={{ duration: 0.12, ease: "easeOut" }}
                className="flex items-center justify-center"
              >
                <CheckIcon className={cx(s.icon, iconColor)} />
              </motion.span>
            ) : null}
          </AnimatePresence>
        </span>

        {(label || description) && (
          <span className={cx("flex flex-col", labelClassName)}>
            {label && (
              <span
                className={cx(
                  s.label,
                  "text-zinc-800 dark:text-zinc-200 leading-none",
                )}
              >
                {label}
              </span>
            )}
            {description && (
              <span
                className={cx(
                  s.description,
                  "text-zinc-500 dark:text-zinc-400 font-normal mt-0.5",
                )}
              >
                {description}
              </span>
            )}
          </span>
        )}
      </label>
    );
  },
);

Checkbox.displayName = "Checkbox";

export interface CheckboxGroupProps
  extends Omit<CheckboxGroupProviderProps, "children"> {
  children: React.ReactNode;
  label?: string;
  description?: string;
  orientation?: "horizontal" | "vertical";
  className?: string;
  legendClassName?: string;
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  children,
  label,
  description,
  orientation = "vertical",
  className,
  legendClassName,
  ...providerProps
}) => {
  const resolvedSize = providerProps.size ?? "md";
  const sizeToText: Record<CheckboxSize, { label: string; desc: string }> = {
    "2xs": { label: "text-[10px] font-semibold", desc: "text-[9px]" },
    xs: { label: "text-xs font-semibold", desc: "text-[10px]" },
    sm: { label: "text-xs font-semibold", desc: "text-xs" },
    md: { label: "text-sm font-semibold", desc: "text-xs" },
    lg: { label: "text-sm font-bold", desc: "text-sm" },
    xl: { label: "text-base font-bold", desc: "text-sm" },
    "2xl": { label: "text-lg font-bold", desc: "text-base" },
  };
  const t = sizeToText[resolvedSize];

  return (
    <CheckboxGroupProvider {...providerProps}>
      <fieldset className={cx("border-none p-0 m-0", className)}>
        {(label || description) && (
          <legend className={cx("mb-2", legendClassName)}>
            {label && (
              <span
                className={cx(
                  t.label,
                  "block text-zinc-800 dark:text-zinc-200",
                )}
              >
                {label}
              </span>
            )}
            {description && (
              <span
                className={cx(
                  t.desc,
                  "block text-zinc-500 dark:text-zinc-400 font-normal mt-0.5",
                )}
              >
                {description}
              </span>
            )}
          </legend>
        )}
        <div
          className={cx(
            "flex",
            orientation === "vertical" ? "flex-col gap-2" : "flex-row flex-wrap gap-4",
          )}
        >
          {children}
        </div>
      </fieldset>
    </CheckboxGroupProvider>
  );
};

export interface CardCheckboxProps extends CheckboxProps {
  cardClassName?: string;
}

export const CardCheckbox = forwardRef<HTMLInputElement, CardCheckboxProps>(
  ({ cardClassName, className, ...rest }, ref) => {
    return (
      <div
        className={cx(
          "relative flex items-start gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-150 cursor-pointer select-none",
          "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900",
          "hover:border-zinc-300 dark:hover:border-zinc-600",
          "has-[:checked]:border-zinc-900 has-[:checked]:bg-zinc-50 dark:has-[:checked]:border-zinc-100 dark:has-[:checked]:bg-zinc-800",
          "has-[:disabled]:opacity-50 has-[:disabled]:cursor-not-allowed",
          cardClassName,
        )}
      >
        <Checkbox ref={ref} className={className} {...rest} />
      </div>
    );
  },
);

CardCheckbox.displayName = "CardCheckbox";

export { CheckboxProvider, useCheckboxContext };
export type { CheckboxSize, CheckboxVariant, CheckboxShape };