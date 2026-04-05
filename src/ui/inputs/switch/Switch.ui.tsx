import React, { forwardRef, useId } from "react";
import { motion } from "framer-motion";
import {
  useSwitchContext,
  useSwitchState,
  useSwitchGroupContext,
  SwitchGroupProvider,
  SwitchProvider,
  type SwitchSize,
  type SwitchVariant,
  type SwitchShape,
  type SwitchGroupProviderProps,
} from "./Switch.context";

function cx(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export interface SwitchProps {
  size?: SwitchSize;
  variant?: SwitchVariant;
  shape?: SwitchShape;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  loading?: boolean;
  label?: React.ReactNode;
  description?: string;
  labelPlacement?: "right" | "left";
  name?: string;
  onChange?: (checked: boolean) => void;
  className?: string;
  trackClassName?: string;
  thumbClassName?: string;
  id?: string;
  "aria-label"?: string;
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      size = "md",
      variant = "solid",
      shape = "pill",
      checked: checkedProp,
      defaultChecked = false,
      disabled: disabledProp,
      loading = false,
      label,
      description,
      labelPlacement = "right",
      name,
      onChange,
      className,
      trackClassName,
      thumbClassName,
      id: idProp,
      "aria-label": ariaLabel,
    },
    ref,
  ) => {
    const { resolveSize, resolveVariant, resolveShape } = useSwitchContext();
    const groupCtx = useSwitchGroupContext();

    const resolvedSize = groupCtx?.size ?? size;
    const resolvedVariant = groupCtx?.variant ?? variant;
    const resolvedDisabled = groupCtx?.disabled ?? disabledProp ?? false;
    const isDisabled = resolvedDisabled || loading;

    const s = resolveSize(resolvedSize);
    const v = resolveVariant(resolvedVariant);
    const sh = resolveShape(shape);

    const generatedId = useId();
    const id = idProp ?? generatedId;

    const groupChecked = name && groupCtx ? groupCtx.values[name] ?? false : undefined;

    const { checked, toggle } = useSwitchState(
      groupChecked !== undefined ? groupChecked : checkedProp,
      defaultChecked,
      (next) => {
        if (name && groupCtx) {
          groupCtx.onChange(name, next);
        } else {
          onChange?.(next);
        }
      },
    );

    const thumbTranslate = checked
      ? s.trackWidth - s.thumbSize - s.thumbOffset
      : s.thumbOffset;

    const trackClasses = cx(
      "relative inline-flex shrink-0 items-center cursor-pointer",
      "transition-colors duration-200 select-none",
      s.track,
      sh.track,
      checked ? v.trackOn : v.trackOff,
      !isDisabled ? (checked ? v.trackHoverOn : v.trackHoverOff) : "",
      v.focus,
      isDisabled ? v.disabled : "",
      trackClassName,
    );

    const thumbClasses = cx(
      "absolute shrink-0 flex items-center justify-center",
      "shadow-sm transition-shadow duration-150",
      s.thumb,
      sh.thumb,
      checked ? v.thumbOn : v.thumbOff,
      thumbClassName,
    );

    return (
      <div
        className={cx(
          "inline-flex items-start",
          labelPlacement === "left" ? "flex-row-reverse" : "flex-row",
          s.gap,
          isDisabled ? "cursor-not-allowed opacity-60" : "",
          className,
        )}
      >
        <button
          ref={ref}
          id={id}
          type="button"
          role="switch"
          aria-checked={checked}
          aria-label={ariaLabel ?? (typeof label === "string" ? label : undefined)}
          aria-disabled={isDisabled}
          disabled={isDisabled}
          onClick={toggle}
          className={trackClasses}
        >
          <motion.span
            className={thumbClasses}
            animate={{ x: thumbTranslate }}
            transition={{ type: "spring", stiffness: 500, damping: 35, mass: 0.6 }}
          >
            {loading && (
              <svg
                className="animate-spin"
                viewBox="0 0 16 16"
                fill="none"
                style={{ width: s.iconSize, height: s.iconSize }}
              >
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" opacity={0.25} />
                <path
                  d="M14 8a6 6 0 00-6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity={0.75}
                />
              </svg>
            )}
          </motion.span>
        </button>

        {(label || description) && (
          <label htmlFor={id} className="flex flex-col cursor-pointer select-none">
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
          </label>
        )}
      </div>
    );
  },
);

Switch.displayName = "Switch";

export interface SwitchGroupProps extends Omit<SwitchGroupProviderProps, "children"> {
  children: React.ReactNode;
  label?: string;
  description?: string;
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export const SwitchGroup: React.FC<SwitchGroupProps> = ({
  children,
  label,
  description,
  orientation = "vertical",
  className,
  ...providerProps
}) => {
  return (
    <SwitchGroupProvider {...providerProps}>
      <div className={cx("flex flex-col gap-2", className)}>
        {(label || description) && (
          <div className="flex flex-col gap-0.5 mb-0.5">
            {label && (
              <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                {label}
              </span>
            )}
            {description && (
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {description}
              </span>
            )}
          </div>
        )}
        <div
          className={cx(
            "flex",
            orientation === "vertical" ? "flex-col gap-3" : "flex-row flex-wrap gap-4",
          )}
        >
          {children}
        </div>
      </div>
    </SwitchGroupProvider>
  );
};

export interface IconSwitchProps extends Omit<SwitchProps, "label" | "description"> {
  iconOff: React.ReactNode;
  iconOn: React.ReactNode;
}

export const IconSwitch = forwardRef<HTMLButtonElement, IconSwitchProps>(
  ({ iconOff, iconOn, size = "md", variant = "solid", shape = "pill", checked: checkedProp, defaultChecked = false, disabled, onChange, className, trackClassName, thumbClassName, id: idProp, "aria-label": ariaLabel }, ref) => {
    const { resolveSize, resolveVariant, resolveShape } = useSwitchContext();
    const s = resolveSize(size);
    const v = resolveVariant(variant);
    const sh = resolveShape(shape);

    const { checked, toggle } = useSwitchState(checkedProp, defaultChecked, onChange);
    const isDisabled = disabled ?? false;

    const thumbTranslate = checked
      ? s.trackWidth - s.thumbSize - s.thumbOffset
      : s.thumbOffset;

    return (
      <button
        ref={ref}
        id={idProp}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={ariaLabel}
        disabled={isDisabled}
        onClick={toggle}
        className={cx(
          "relative inline-flex shrink-0 items-center cursor-pointer",
          "transition-colors duration-200 select-none",
          s.track,
          sh.track,
          checked ? v.trackOn : v.trackOff,
          !isDisabled ? (checked ? v.trackHoverOn : v.trackHoverOff) : "",
          v.focus,
          isDisabled ? v.disabled : "",
          trackClassName,
          className,
        )}
      >
        <motion.span
          className={cx(
            "absolute shrink-0 flex items-center justify-center shadow-sm",
            s.thumb,
            sh.thumb,
            checked ? v.thumbOn : v.thumbOff,
            thumbClassName,
          )}
          animate={{ x: thumbTranslate }}
          transition={{ type: "spring", stiffness: 500, damping: 35, mass: 0.6 }}
          style={{ color: checked ? undefined : "currentColor" }}
        >
          <motion.span
            key={checked ? "on" : "off"}
            initial={{ scale: 0.5, opacity: 0, rotate: -30 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="flex items-center justify-center"
            style={{ width: s.iconSize, height: s.iconSize }}
          >
            {checked ? iconOn : iconOff}
          </motion.span>
        </motion.span>
      </button>
    );
  },
);

IconSwitch.displayName = "IconSwitch";

export interface CardSwitchProps extends SwitchProps {
  icon?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: string;
  badge?: string;
  cardClassName?: string;
}

export const CardSwitch = forwardRef<HTMLButtonElement, CardSwitchProps>(
  ({ icon, title, subtitle, badge, cardClassName, size = "md", variant = "solid", shape = "pill", checked: checkedProp, defaultChecked = false, disabled, onChange, className }, ref) => {
    const { checked, toggle } = useSwitchState(checkedProp, defaultChecked, onChange);
    const isDisabled = disabled ?? false;

    return (
      <div
        onClick={isDisabled ? undefined : toggle}
        className={cx(
          "flex items-center justify-between gap-4 px-4 py-3.5 rounded-xl border-2",
          "cursor-pointer select-none transition-all duration-150",
          "bg-white dark:bg-zinc-900",
          checked
            ? "border-zinc-900 dark:border-zinc-100"
            : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600",
          isDisabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "",
          cardClassName,
        )}
      >
        <div className="flex items-center gap-3 min-w-0">
          {icon && (
            <span
              className={cx(
                "shrink-0 flex items-center justify-center w-9 h-9 rounded-lg",
                checked
                  ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500",
              )}
            >
              {icon}
            </span>
          )}
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 truncate leading-none">
                {title}
              </span>
              {badge && (
                <span className="shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                  {badge}
                </span>
              )}
            </div>
            {subtitle && (
              <span className="text-xs text-zinc-500 dark:text-zinc-400 font-normal mt-0.5 truncate">
                {subtitle}
              </span>
            )}
          </div>
        </div>

        <Switch
          ref={ref}
          size={size}
          variant={variant}
          shape={shape}
          checked={checked}
          disabled={isDisabled}
          className={cx("shrink-0 pointer-events-none", className)}
        />
      </div>
    );
  },
);

CardSwitch.displayName = "CardSwitch";

export interface InlineLabelSwitchProps extends SwitchProps {
  labelOn?: string;
  labelOff?: string;
}

export const InlineLabelSwitch = forwardRef<HTMLButtonElement, InlineLabelSwitchProps>(
  ({ labelOn = "On", labelOff = "Off", size = "md", variant = "solid", shape = "pill", checked: checkedProp, defaultChecked = false, disabled, onChange, className }, ref) => {
    const { resolveSize, resolveVariant, resolveShape } = useSwitchContext();
    const s = resolveSize(size);
    const v = resolveVariant(variant);
    const sh = resolveShape(shape);

    const { checked, toggle } = useSwitchState(checkedProp, defaultChecked, onChange);
    const isDisabled = disabled ?? false;

    const thumbTranslate = checked
      ? s.trackWidth - s.thumbSize - s.thumbOffset
      : s.thumbOffset;

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={isDisabled}
        onClick={toggle}
        className={cx(
          "relative inline-flex shrink-0 items-center cursor-pointer select-none overflow-hidden",
          "transition-colors duration-200",
          s.track,
          sh.track,
          checked ? v.trackOn : v.trackOff,
          !isDisabled ? (checked ? v.trackHoverOn : v.trackHoverOff) : "",
          v.focus,
          isDisabled ? v.disabled : "",
          className,
        )}
      >
        <motion.span
          key="off-label"
          className={cx(
            "absolute right-0 pr-1 text-[10px] font-semibold select-none pointer-events-none",
            "text-zinc-400 dark:text-zinc-500",
          )}
          animate={{ opacity: checked ? 0 : 1 }}
          transition={{ duration: 0.15 }}
          style={{ right: 4 }}
        >
          {labelOff}
        </motion.span>

        <motion.span
          key="on-label"
          className={cx(
            "absolute left-0 pl-1 text-[10px] font-semibold select-none pointer-events-none",
            "text-white dark:text-zinc-900",
          )}
          animate={{ opacity: checked ? 1 : 0 }}
          transition={{ duration: 0.15 }}
          style={{ left: 4 }}
        >
          {labelOn}
        </motion.span>

        <motion.span
          className={cx(
            "absolute shrink-0 shadow-sm",
            s.thumb,
            sh.thumb,
            checked ? v.thumbOn : v.thumbOff,
          )}
          animate={{ x: thumbTranslate }}
          transition={{ type: "spring", stiffness: 500, damping: 35, mass: 0.6 }}
        />
      </button>
    );
  },
);

InlineLabelSwitch.displayName = "InlineLabelSwitch";

export { SwitchProvider, useSwitchContext };
export type { SwitchSize, SwitchVariant, SwitchShape };