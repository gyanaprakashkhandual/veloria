
import React, { forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useButtonContext,
  useAsyncClick,
  useToggleState,
  type ButtonVariant,
  type ButtonSize,
  type ButtonShape,
} from "../../context/button/Button.context";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Merge class names — user-supplied className always wins (appended last) */
function cx(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

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
        cx="12" cy="12" r="10"
        stroke="currentColor" strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

// ─── Base Button Props ────────────────────────────────────────────────────────

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  /** Visual style variant */
  variant?: ButtonVariant;
  /** Size token */
  size?: ButtonSize;
  /** Border-radius shape */
  shape?: ButtonShape;
  /** Show loading spinner; blocks interactions */
  loading?: boolean;
  /** Stretch to container width */
  fullWidth?: boolean;
  /** Icon rendered before label */
  iconLeft?: React.ReactNode;
  /** Icon rendered after label */
  iconRight?: React.ReactNode;
  /** Render as icon-only (square) button */
  iconOnly?: boolean;
  /** Label shown inside spinner state (replaces children) */
  loadingText?: string;
  /** className is always merged last so callers can override anything */
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
}

// ─── Button ───────────────────────────────────────────────────────────────────

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "solid",
      size = "md",
      shape = "rounded",
      loading: loadingProp = false,
      fullWidth = false,
      iconLeft,
      iconRight,
      iconOnly = false,
      loadingText,
      className,
      children,
      disabled,
      onClick,
      ...rest
    },
    ref,
  ) => {
    const { resolveVariant, resolveSize, resolveShape } = useButtonContext();
    const { loading: asyncLoading, handleClick } = useAsyncClick(onClick);

    const isLoading = loadingProp || asyncLoading;
    const isDisabled = disabled || isLoading;

    const v = resolveVariant(variant);
    const s = resolveSize(size, iconOnly);
    const shapeClass = resolveShape(shape);

    const baseClasses = cx(
      // layout
      "relative inline-flex items-center justify-center select-none",
      "transition-all duration-150 ease-in-out",
      // size
      s.height,
      s.gap,
      iconOnly ? s.padding : cx(s.padding, s.minWidth),
      s.text,
      // shape
      shapeClass,
      // variant
      v.base,
      v.hover,
      v.active,
      v.focus,
      // states
      isDisabled ? v.disabled : "",
      isLoading ? v.loading : "",
      // full-width
      fullWidth ? "w-full" : "",
      // caller override — always last
      className,
    );

    const iconSizeClass = s.iconSize;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        onClick={handleClick}
        aria-busy={isLoading}
        aria-disabled={isDisabled}
        {...rest}
        className={baseClasses}
      >
        {/* Loading spinner replaces iconLeft */}
        <AnimatePresence mode="wait" initial={false}>
          {isLoading ? (
            <motion.span
              key="spinner"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-center"
            >
              <Spinner className={iconSizeClass} />
            </motion.span>
          ) : iconLeft ? (
            <motion.span
              key="icon-left"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              className={cx("shrink-0 flex items-center", iconSizeClass)}
            >
              {iconLeft}
            </motion.span>
          ) : null}
        </AnimatePresence>

        {/* Label */}
        {!iconOnly && (
          <span className="truncate">
            {isLoading && loadingText ? loadingText : children}
          </span>
        )}

        {/* Right icon — hidden while loading */}
        {!iconOnly && iconRight && !isLoading && (
          <span className={cx("shrink-0 flex items-center", iconSizeClass)}>
            {iconRight}
          </span>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

// ─── AsyncButton ──────────────────────────────────────────────────────────────
// Identical API to Button but makes async management more explicit in naming.

export interface AsyncButtonProps extends ButtonProps {
  /** Called on click; if it returns a Promise, loading state is auto-managed */
  onClickAsync?: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
}

export const AsyncButton = forwardRef<HTMLButtonElement, AsyncButtonProps>(
  ({ onClickAsync, onClick, ...rest }, ref) => {
    const mergedClick = onClickAsync ?? onClick;
    return <Button ref={ref} onClick={mergedClick} {...rest} />;
  },
);

AsyncButton.displayName = "AsyncButton";

// ─── ToggleButton ─────────────────────────────────────────────────────────────

export interface ToggleButtonProps
  extends Omit<ButtonProps, "onClick" | "aria-pressed"> {
  /** Controlled pressed state */
  pressed?: boolean;
  /** Uncontrolled default */
  defaultPressed?: boolean;
  /** Called when pressed state changes */
  onPressedChange?: (pressed: boolean) => void;
  /** Classes applied when pressed=true (merged after className) */
  pressedClassName?: string;
}

export const ToggleButton = forwardRef<HTMLButtonElement, ToggleButtonProps>(
  (
    {
      pressed: pressedProp,
      defaultPressed = false,
      onPressedChange,
      pressedClassName,
      className,
      variant = "outline",
      children,
      ...rest
    },
    ref,
  ) => {
    const { pressed, toggle } = useToggleState(
      pressedProp,
      defaultPressed,
      onPressedChange,
    );

    const pressedClasses = pressed
      ? cx(
          // default pressed visual: invert to solid-like
          "bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100",
          pressedClassName,
        )
      : "";

    return (
      <Button
        ref={ref}
        variant={variant}
        onClick={toggle}
        aria-pressed={pressed}
        className={cx(className, pressedClasses)}
        {...rest}
      >
        {children}
      </Button>
    );
  },
);

ToggleButton.displayName = "ToggleButton";

// ─── ButtonGroup ─────────────────────────────────────────────────────────────

export interface ButtonGroupProps {
  children: React.ReactNode;
  /** Orientation of the group */
  orientation?: "horizontal" | "vertical";
  /** Shared size for all children */
  size?: ButtonSize;
  /** Shared variant for all children */
  variant?: ButtonVariant;
  className?: string;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  orientation = "horizontal",
  className,
}) => {
  return (
    <div
      role="group"
      className={cx(
        "inline-flex",
        orientation === "vertical" ? "flex-col" : "flex-row",
        // Collapse borders between siblings
        "[&>button:not(:first-child):not(:last-child)]:rounded-none",
        orientation === "horizontal"
          ? "[&>button:first-child]:rounded-r-none [&>button:last-child]:rounded-l-none [&>button:not(:first-child)]:-ml-px"
          : "[&>button:first-child]:rounded-b-none [&>button:last-child]:rounded-t-none [&>button:not(:first-child)]:-mt-px",
        className,
      )}
    >
      {children}
    </div>
  );
};

// ─── IconButton ───────────────────────────────────────────────────────────────
// Convenience wrapper that enforces iconOnly and requires aria-label.

export interface IconButtonProps extends Omit<ButtonProps, "iconOnly" | "children"> {
  icon: React.ReactNode;
  "aria-label": string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, ...rest }, ref) => {
    return (
      <Button ref={ref} iconOnly iconLeft={icon} {...rest}>
        {/* children intentionally empty for icon-only */}
        <span className="sr-only">{rest["aria-label"]}</span>
      </Button>
    );
  },
);

IconButton.displayName = "IconButton";