/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {
  forwardRef,
  useCallback,
  useRef,
  useState,
  useId,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import "./button.css";
import { SpinnerIcon } from "./Button.icon";
import { ButtonGroupProvider, useButtonGroup } from "./Button.context";

export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
export type ButtonVariant = "solid" | "outline" | "ghost" | "soft" | "link";
export type ButtonColorScheme =
  | "primary"
  | "neutral"
  | "success"
  | "warning"
  | "danger";
export type ButtonJustify = "start" | "center" | "end" | "between";

export interface ButtonClassNames {
  root?: string;
  inner?: string;
  label?: string;
  startIcon?: string;
  endIcon?: string;
  spinner?: string;
  focusRing?: string;
}

export interface ButtonStyles {
  root?: React.CSSProperties;
  inner?: React.CSSProperties;
  label?: React.CSSProperties;
  startIcon?: React.CSSProperties;
  endIcon?: React.CSSProperties;
  spinner?: React.CSSProperties;
}

export interface ButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "color"
> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  colorScheme?: ButtonColorScheme;
  children?: React.ReactNode;
  disabled?: boolean;
  disabledReason?: string;
  focusableWhenDisabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  loadingPlacement?: "start" | "center";
  selected?: boolean;
  defaultSelected?: boolean;
  isToggle?: boolean;
  onSelectedChange?: (selected: boolean) => void;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  iconOnly?: boolean;
  as?: React.ElementType;
  href?: string;
  target?: string;
  rel?: string;
  fullWidth?: boolean;
  justify?: ButtonJustify;
  classNames?: ButtonClassNames;
  styles?: ButtonStyles;
  unstyled?: boolean;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-expanded"?: boolean;
  "aria-haspopup"?: boolean | "menu" | "listbox" | "dialog";
  "aria-controls"?: string;
  "aria-pressed"?: boolean;
  onSelectedChange_internal?: never;
}

function buildClassName(
  ...parts: (string | undefined | false | null)[]
): string {
  return parts.filter(Boolean).join(" ");
}

const SPINNER_SIZES: Record<ButtonSize, number> = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  "2xl": 20,
  "3xl": 24,
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant: variantProp,
      size: sizeProp,
      colorScheme: colorSchemeProp,
      children,
      disabled: disabledProp,
      disabledReason,
      focusableWhenDisabled = false,
      loading = false,
      loadingText,
      loadingPlacement = "start",
      selected: selectedProp,
      defaultSelected,
      isToggle = false,
      onSelectedChange,
      startIcon,
      endIcon,
      iconOnly = false,
      as,
      href,
      target,
      rel,
      fullWidth = false,
      justify = "center",
      classNames = {},
      styles = {},
      unstyled = false,
      className,
      style,
      onClick,
      onKeyDown,
      onFocus,
      onBlur,
      onMouseEnter,
      onMouseLeave,
      type = "button",
      id: idProp,
      name,
      value,
      form,
      "aria-label": ariaLabel,
      "aria-describedby": ariaDescribedBy,
      "aria-expanded": ariaExpanded,
      "aria-haspopup": ariaHasPopup,
      "aria-controls": ariaControls,
      "aria-pressed": ariaPressedProp,
      children: _children,
      ...rest
    },
    ref,
  ) => {
    const group = useButtonGroup();
    const generatedId = useId();
    const buttonId = idProp ?? `btn-${generatedId}`;
    const tooltipId = `${buttonId}-tooltip`;

    const variant = group?.variant ?? variantProp ?? "solid";
    const size = group?.size ?? sizeProp ?? "md";
    const colorScheme = group?.colorScheme ?? colorSchemeProp ?? "primary";
    const disabled = group?.disabled ?? disabledProp ?? false;

    const [internalSelected, setInternalSelected] = useState(
      defaultSelected ?? false,
    );
    const isControlledToggle = selectedProp !== undefined;
    const selected = isControlledToggle ? selectedProp : internalSelected;

    const isEffectivelyDisabled = disabled || loading;

    const handleClick = useCallback(
      (e: MouseEvent<HTMLButtonElement>) => {
        if (isEffectivelyDisabled) {
          e.preventDefault();
          return;
        }
        if (isToggle) {
          const next = !selected;
          if (!isControlledToggle) setInternalSelected(next);
          onSelectedChange?.(next);
        }
        onClick?.(e);
      },
      [
        isEffectivelyDisabled,
        isToggle,
        selected,
        isControlledToggle,
        onSelectedChange,
        onClick,
      ],
    );

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLButtonElement>) => {
        if (href && (e.key === " " || e.key === "Space")) {
          e.preventDefault();
          (e.currentTarget as HTMLButtonElement).click();
        }
        onKeyDown?.(e);
      },
      [href, onKeyDown],
    );

    const ariaPressed =
      ariaPressedProp !== undefined
        ? ariaPressedProp
        : isToggle
          ? selected
          : undefined;

    const Component: React.ElementType = as ?? (href ? "a" : "button");
    const isAnchor = Component === "a" || !!href;

    if (process.env.NODE_ENV !== "production" && iconOnly && !ariaLabel) {
      console.warn(
        `[Button] iconOnly buttons require an aria-label for accessibility. Button id="${buttonId}"`,
      );
    }

    const spinnerSize = SPINNER_SIZES[size];

    const showCenterSpinner = loading && loadingPlacement === "center";
    const showStartSpinner = loading && loadingPlacement === "start";

    const rootClass = unstyled
      ? buildClassName("btn--unstyled", classNames.root, className)
      : buildClassName(
          "btn",
          `btn--${variant}`,
          `btn--${size}`,
          `btn--${colorScheme}`,
          fullWidth && "btn--full-width",
          iconOnly && "btn--icon-only",
          disabled && "btn--disabled",
          loading && "btn--loading",
          selected && "btn--selected",
          justify !== "center" && `btn--justify-${justify}`,
          classNames.root,
          className,
        );

    const innerClass = buildClassName("btn__inner", classNames.inner);
    const labelClass = buildClassName("btn__label", classNames.label);
    const startIconClass = buildClassName(
      "btn__start-icon",
      classNames.startIcon,
    );
    const endIconClass = buildClassName("btn__end-icon", classNames.endIcon);
    const spinnerClass = buildClassName("btn__spinner", classNames.spinner);

    const anchorProps = isAnchor
      ? {
          href: disabled ? undefined : href,
          target,
          rel: target === "_blank" ? (rel ?? "noopener noreferrer") : rel,
          role: "button" as const,
        }
      : {};

    const buttonOnlyProps = !isAnchor
      ? {
          type,
          name,
          value,
          form,
          disabled: disabled && !focusableWhenDisabled,
        }
      : {};

    return (
      <>
        <Component
          {...rest}
          {...anchorProps}
          {...buttonOnlyProps}
          ref={ref}
          id={buttonId}
          className={rootClass}
          style={{ ...style, ...styles.root }}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          onFocus={onFocus}
          onBlur={onBlur}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          aria-disabled={disabled || undefined}
          aria-busy={loading || undefined}
          aria-pressed={ariaPressed}
          aria-label={ariaLabel}
          aria-describedby={
            disabledReason && disabled
              ? buildClassName(tooltipId, ariaDescribedBy)
              : ariaDescribedBy
          }
          aria-expanded={ariaExpanded}
          aria-haspopup={ariaHasPopup}
          aria-controls={ariaControls}
          tabIndex={disabled && !focusableWhenDisabled ? -1 : undefined}
        >
          <span className={innerClass} style={styles.inner}>
            {showCenterSpinner ? (
              <span className={spinnerClass} style={styles.spinner}>
                <SpinnerIcon size={spinnerSize} />
              </span>
            ) : (
              <>
                {showStartSpinner ? (
                  <span className={spinnerClass} style={styles.spinner}>
                    <SpinnerIcon size={spinnerSize} />
                  </span>
                ) : startIcon ? (
                  <span className={startIconClass} style={styles.startIcon}>
                    {startIcon}
                  </span>
                ) : null}

                {!iconOnly && (
                  <span className={labelClass} style={styles.label}>
                    {loading && loadingText ? loadingText : children}
                  </span>
                )}

                {!showStartSpinner && endIcon && (
                  <span className={endIconClass} style={styles.endIcon}>
                    {endIcon}
                  </span>
                )}
              </>
            )}
          </span>
        </Component>

        {disabledReason && disabled && (
          <span
            id={tooltipId}
            role="tooltip"
            style={{
              position: "absolute",
              width: 1,
              height: 1,
              padding: 0,
              margin: -1,
              overflow: "hidden",
              clip: "rect(0,0,0,0)",
              whiteSpace: "nowrap",
              border: 0,
            }}
          >
            {disabledReason}
          </span>
        )}
      </>
    );
  },
);

Button.displayName = "Button";

export interface ButtonGroupProps {
  children: React.ReactNode;
  size?: ButtonSize;
  variant?: ButtonVariant;
  colorScheme?: ButtonColorScheme;
  disabled?: boolean;
  orientation?: "horizontal" | "vertical";
  spacing?: "compact" | "separated";
  fullWidth?: boolean;
  loop?: boolean;
  className?: string;
  classNames?: { root?: string; divider?: string };
  style?: React.CSSProperties;
  id?: string;
}

export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(
  (
    {
      children,
      size,
      variant,
      colorScheme,
      disabled,
      orientation = "horizontal",
      spacing = "compact",
      fullWidth = false,
      loop = false,
      className,
      classNames = {},
      style,
      id,
    },
    ref,
  ) => {
    const groupRef = useRef<HTMLDivElement>(null);
    const resolvedRef = (ref as React.RefObject<HTMLDivElement>) ?? groupRef;

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLDivElement>) => {
        const container = resolvedRef.current;
        if (!container) return;

        const buttons = Array.from(
          container.querySelectorAll<HTMLButtonElement | HTMLAnchorElement>(
            "[role='button']:not([disabled]):not([aria-disabled='true']), button:not([disabled]):not([aria-disabled='true'])",
          ),
        );

        const current = document.activeElement as HTMLElement;
        const idx = buttons.indexOf(current as HTMLButtonElement);
        if (idx === -1) return;

        const isHorizontal = orientation === "horizontal";
        const forward = isHorizontal ? "ArrowRight" : "ArrowDown";
        const backward = isHorizontal ? "ArrowLeft" : "ArrowUp";

        if (e.key === forward || e.key === backward) {
          e.preventDefault();
          let next: number;
          if (e.key === forward) {
            next = idx + 1 >= buttons.length ? (loop ? 0 : idx) : idx + 1;
          } else {
            next = idx - 1 < 0 ? (loop ? buttons.length - 1 : idx) : idx - 1;
          }
          buttons[next]?.focus();
        }
      },
      [orientation, loop, resolvedRef],
    );

    const rootClass = buildClassName(
      "btn-group",
      orientation === "vertical" && "btn-group--vertical",
      `btn-group--${spacing}`,
      fullWidth && "btn-group--full-width",
      classNames.root,
      className,
    );

    return (
      <ButtonGroupProvider
        value={{ size, variant, colorScheme, disabled, orientation, spacing }}
      >
        <div
          ref={resolvedRef}
          id={id}
          className={rootClass}
          style={style}
          role="group"
          onKeyDown={handleKeyDown}
        >
          {children}
        </div>
      </ButtonGroupProvider>
    );
  },
);

ButtonGroup.displayName = "ButtonGroup";

export namespace ButtonPrimitive {
  export const Root = Button;
  export const Group = ButtonGroup;

  export const Label = forwardRef<
    HTMLSpanElement,
    React.HTMLAttributes<HTMLSpanElement>
  >(({ children, ...props }, ref) => (
    <span ref={ref} {...props}>
      {children}
    </span>
  ));
  Label.displayName = "ButtonPrimitive.Label";

  export const StartIcon = forwardRef<
    HTMLSpanElement,
    React.HTMLAttributes<HTMLSpanElement>
  >(({ children, ...props }, ref) => (
    <span ref={ref} {...props}>
      {children}
    </span>
  ));
  StartIcon.displayName = "ButtonPrimitive.StartIcon";

  export const EndIcon = forwardRef<
    HTMLSpanElement,
    React.HTMLAttributes<HTMLSpanElement>
  >(({ children, ...props }, ref) => (
    <span ref={ref} {...props}>
      {children}
    </span>
  ));
  EndIcon.displayName = "ButtonPrimitive.EndIcon";

  export const Spinner = forwardRef<
    HTMLSpanElement,
    React.HTMLAttributes<HTMLSpanElement> & { size?: number }
  >(({ size = 16, ...props }, ref) => (
    <span ref={ref} {...props}>
      <SpinnerIcon size={size} />
    </span>
  ));
  Spinner.displayName = "ButtonPrimitive.Spinner";
}
