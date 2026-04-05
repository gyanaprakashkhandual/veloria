import React, { forwardRef, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useToggleContext,
  useToggleState,
  useToggleGroupContext,
  ToggleGroupProvider,
  ToggleProvider,
  type ToggleSize,
  type ToggleVariant,
  type ToggleShape,
  type ToggleGroupSelectionMode,
  type ToggleGroupProviderProps,
} from "./Toogle.context";

function cx(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export interface ToggleButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  size?: ToggleSize;
  variant?: ToggleVariant;
  shape?: ToggleShape;
  pressed?: boolean;
  defaultPressed?: boolean;
  disabled?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  iconOnly?: boolean;
  fullWidth?: boolean;
  value?: string;
  onChange?: (pressed: boolean) => void;
  pressedClassName?: string;
  className?: string;
}

export const ToggleButton = forwardRef<HTMLButtonElement, ToggleButtonProps>(
  (
    {
      size = "md",
      variant = "outline",
      shape = "rounded",
      pressed: pressedProp,
      defaultPressed = false,
      disabled: disabledProp,
      iconLeft,
      iconRight,
      iconOnly = false,
      fullWidth = false,
      value = "",
      onChange,
      pressedClassName,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const { resolveSize, resolveVariant, resolveShape } = useToggleContext();
    const groupCtx = useToggleGroupContext();

    const resolvedSize = groupCtx?.size ?? size;
    const resolvedVariant = groupCtx?.variant ?? variant;
    const resolvedShape = groupCtx?.shape ?? shape;
    const resolvedDisabled = groupCtx?.disabled ?? disabledProp ?? false;

    const s = resolveSize(resolvedSize);
    const v = resolveVariant(resolvedVariant);
    const shapeClass = resolveShape(resolvedShape);

    const groupPressed = groupCtx ? groupCtx.value.includes(value) : undefined;

    const { pressed, toggle } = useToggleState(
      groupPressed !== undefined ? groupPressed : pressedProp,
      defaultPressed,
      (next) => {
        if (groupCtx && value) {
          groupCtx.onChange(value, next);
        } else {
          onChange?.(next);
        }
      },
    );

    const baseClasses = cx(
      "relative inline-flex items-center justify-center select-none",
      "transition-all duration-150 ease-in-out",
      s.height,
      s.gap,
      iconOnly ? cx(s.minWidth, "aspect-square") : cx(s.padding, s.minWidth),
      s.text,
      shapeClass,
      pressed ? cx(v.pressed, v.pressedHover) : cx(v.base, v.hover),
      v.focus,
      v.active,
      resolvedDisabled ? v.disabled : "",
      fullWidth ? "w-full" : "",
      pressed && pressedClassName,
      className,
    );

    return (
      <button
        ref={ref}
        type="button"
        role="button"
        aria-pressed={pressed}
        disabled={resolvedDisabled}
        onClick={toggle}
        className={baseClasses}
        {...rest}
      >
        {iconLeft && (
          <span className={cx("shrink-0 flex items-center", s.iconSize)}>
            {iconLeft}
          </span>
        )}

        {!iconOnly && children && (
          <span className="truncate leading-none">{children}</span>
        )}

        {iconOnly && iconLeft && null}

        {iconRight && !iconOnly && (
          <span className={cx("shrink-0 flex items-center", s.iconSize)}>
            {iconRight}
          </span>
        )}
      </button>
    );
  },
);

ToggleButton.displayName = "ToggleButton";

export interface ToggleGroupProps extends Omit<ToggleGroupProviderProps, "children"> {
  children: React.ReactNode;
  orientation?: "horizontal" | "vertical";
  separated?: boolean;
  label?: string;
  className?: string;
}

export const ToggleGroup: React.FC<ToggleGroupProps> = ({
  children,
  orientation = "horizontal",
  separated = false,
  label,
  className,
  ...providerProps
}) => {
  const resolvedShape = providerProps.shape ?? "rounded";

  const shapeMap: Record<ToggleShape, { group: string; firstH: string; lastH: string; middleH: string; firstV: string; lastV: string; middleV: string }> = {
    rounded: {
      group: "rounded-lg",
      firstH: "rounded-l-lg rounded-r-none",
      lastH: "rounded-r-lg rounded-l-none",
      middleH: "rounded-none",
      firstV: "rounded-t-lg rounded-b-none",
      lastV: "rounded-b-lg rounded-t-none",
      middleV: "rounded-none",
    },
    pill: {
      group: "rounded-full",
      firstH: "rounded-l-full rounded-r-none",
      lastH: "rounded-r-full rounded-l-none",
      middleH: "rounded-none",
      firstV: "rounded-t-full rounded-b-none",
      lastV: "rounded-b-full rounded-t-none",
      middleV: "rounded-none",
    },
    square: {
      group: "rounded-none",
      firstH: "rounded-none",
      lastH: "rounded-none",
      middleH: "rounded-none",
      firstV: "rounded-none",
      lastV: "rounded-none",
      middleV: "rounded-none",
    },
  };

  const sm = shapeMap[resolvedShape as ToggleShape] ?? shapeMap.rounded;

  const childArray = React.Children.toArray(children);

  const styledChildren = separated
    ? children
    : childArray.map((child, i) => {
        if (!React.isValidElement(child)) return child;
        const isFirst = i === 0;
        const isLast = i === childArray.length - 1;

        const edgeClass =
          orientation === "horizontal"
            ? isFirst
              ? sm.firstH
              : isLast
                ? sm.lastH
                : sm.middleH
            : isFirst
              ? sm.firstV
              : isLast
                ? sm.lastV
                : sm.middleV;

        return React.cloneElement(child as React.ReactElement<ToggleButtonProps>, {
          shape: "square" as ToggleShape,
          className: cx(
            (child as React.ReactElement<ToggleButtonProps>).props.className,
            edgeClass,
            orientation === "horizontal" && !isFirst ? "-ml-px" : "",
            orientation === "vertical" && !isFirst ? "-mt-px" : "",
          ),
        });
      });

  return (
    <ToggleGroupProvider {...providerProps}>
      <div className={cx("flex flex-col gap-1.5", className)}>
        {label && (
          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            {label}
          </span>
        )}
        <div
          role="group"
          className={cx(
            "inline-flex",
            orientation === "vertical" ? "flex-col" : "flex-row",
            !separated && "overflow-hidden",
            !separated && sm.group,
            !separated && "border border-zinc-200 dark:border-zinc-700",
            separated && orientation === "horizontal" && "gap-1",
            separated && orientation === "vertical" && "flex-col gap-1",
          )}
        >
          {styledChildren}
        </div>
      </div>
    </ToggleGroupProvider>
  );
};

export interface ToggleToolbarProps {
  children: React.ReactNode;
  label?: string;
  className?: string;
}

export const ToggleToolbar: React.FC<ToggleToolbarProps> = ({
  children,
  label,
  className,
}) => {
  return (
    <div
      role="toolbar"
      aria-label={label}
      className={cx(
        "inline-flex items-center gap-1 p-1",
        "bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const ToolbarDivider: React.FC = () => (
  <div className="w-px h-5 bg-zinc-200 dark:border-zinc-700 mx-0.5 shrink-0" />
);

export interface ToggleChipProps {
  size?: ToggleSize;
  pressed?: boolean;
  defaultPressed?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  onChange?: (pressed: boolean) => void;
  value?: string;
  className?: string;
  children: React.ReactNode;
}

export const ToggleChip: React.FC<ToggleChipProps> = ({
  size = "md",
  pressed: pressedProp,
  defaultPressed = false,
  disabled = false,
  icon,
  onChange,
  value = "",
  className,
  children,
}) => {
  const { resolveSize } = useToggleContext();
  const groupCtx = useToggleGroupContext();

  const resolvedSize = groupCtx?.size ?? size;
  const resolvedDisabled = groupCtx?.disabled ?? disabled;
  const s = resolveSize(resolvedSize);

  const groupPressed = groupCtx ? groupCtx.value.includes(value) : undefined;

  const { pressed, toggle } = useToggleState(
    groupPressed !== undefined ? groupPressed : pressedProp,
    defaultPressed,
    (next) => {
      if (groupCtx && value) {
        groupCtx.onChange(value, next);
      } else {
        onChange?.(next);
      }
    },
  );

  return (
    <button
      type="button"
      role="button"
      aria-pressed={pressed}
      disabled={resolvedDisabled}
      onClick={toggle}
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full select-none cursor-pointer",
        "border transition-all duration-150",
        s.height,
        s.padding,
        s.text,
        pressed
          ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100"
          : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-100",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-1",
        "active:scale-95",
        resolvedDisabled ? "opacity-40 cursor-not-allowed pointer-events-none" : "",
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        {pressed ? (
          <motion.span
            key="check"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.15, ease: [0.34, 1.56, 0.64, 1] }}
            className={cx("shrink-0 flex items-center", s.iconSize)}
          >
            <svg viewBox="0 0 12 12" fill="none" className="w-full h-full">
              <polyline
                points="1.5,6 4.5,9 10.5,3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.span>
        ) : icon ? (
          <motion.span
            key="icon"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.12 }}
            className={cx("shrink-0 flex items-center", s.iconSize)}
          >
            {icon}
          </motion.span>
        ) : null}
      </AnimatePresence>

      <span className="truncate leading-none">{children}</span>
    </button>
  );
};

export interface IconToggleProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  size?: ToggleSize;
  variant?: ToggleVariant;
  shape?: ToggleShape;
  pressed?: boolean;
  defaultPressed?: boolean;
  icon: React.ReactNode;
  iconPressed?: React.ReactNode;
  value?: string;
  onChange?: (pressed: boolean) => void;
  "aria-label": string;
  className?: string;
}

export const IconToggle = forwardRef<HTMLButtonElement, IconToggleProps>(
  (
    {
      size = "md",
      variant = "ghost",
      shape = "rounded",
      pressed: pressedProp,
      defaultPressed = false,
      icon,
      iconPressed,
      value = "",
      onChange,
      disabled,
      "aria-label": ariaLabel,
      className,
      ...rest
    },
    ref,
  ) => {
    const { resolveSize, resolveVariant, resolveShape } = useToggleContext();
    const groupCtx = useToggleGroupContext();

    const resolvedSize = groupCtx?.size ?? size;
    const resolvedVariant = groupCtx?.variant ?? variant;
    const resolvedShape = groupCtx?.shape ?? shape;
    const resolvedDisabled = groupCtx?.disabled ?? disabled ?? false;

    const s = resolveSize(resolvedSize);
    const v = resolveVariant(resolvedVariant);
    const shapeClass = resolveShape(resolvedShape);

    const groupPressed = groupCtx ? groupCtx.value.includes(value) : undefined;

    const { pressed, toggle } = useToggleState(
      groupPressed !== undefined ? groupPressed : pressedProp,
      defaultPressed,
      (next) => {
        if (groupCtx && value) {
          groupCtx.onChange(value, next);
        } else {
          onChange?.(next);
        }
      },
    );

    return (
      <button
        ref={ref}
        type="button"
        role="button"
        aria-pressed={pressed}
        aria-label={ariaLabel}
        disabled={resolvedDisabled}
        onClick={toggle}
        className={cx(
          "relative inline-flex items-center justify-center select-none",
          "transition-all duration-150 aspect-square",
          s.height,
          s.minWidth,
          shapeClass,
          pressed ? cx(v.pressed, v.pressedHover) : cx(v.base, v.hover),
          v.focus,
          v.active,
          resolvedDisabled ? v.disabled : "",
          className,
        )}
        {...rest}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={pressed ? "pressed-icon" : "default-icon"}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ duration: 0.13, ease: "easeOut" }}
            className={cx("flex items-center justify-center", s.iconSize)}
          >
            {pressed && iconPressed ? iconPressed : icon}
          </motion.span>
        </AnimatePresence>
      </button>
    );
  },
);

IconToggle.displayName = "IconToggle";

export { ToggleProvider, useToggleContext };
export type { ToggleSize, ToggleVariant, ToggleShape, ToggleGroupSelectionMode };