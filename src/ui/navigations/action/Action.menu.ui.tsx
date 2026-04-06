/* eslint-disable react-refresh/only-export-components */
import React, { useEffect, useRef, useCallback } from "react";
import {
  ActionMenuProvider,
  useActionMenuContext,
  type ActionMenuProviderProps,
  type ActionItem,
  type ActionMenuSize,
  type ActionItemVariant,
  type MenuAlign,
  type ActionMenuHeader,
  type ActionMenuFooter,
  type ActionMenuDivider,
} from "./Action.menu.context";
import {
  sizeConfig,
  useAutoAlign,
  resolvedAlignToStyle,
} from "./utils/Action.menu.util";
import { MenuPanel } from "./components/Action.menu.panel";
import "./Action.menu.css";

type MenuOpenTrigger = "click" | "hover";
type MenuState = "default" | "loading" | "error";

interface ActionMenuInnerProps {
  items: ActionItem[];
  size: ActionMenuSize;
  trigger: React.ReactNode;
  align: MenuAlign;
  openTrigger: MenuOpenTrigger;
  closeOnOutsideClick: boolean;
  header?: ActionMenuHeader;
  footer?: ActionMenuFooter;
  divider?: ActionMenuDivider;
  showCloseButton?: boolean;
  menuState?: MenuState;
  errorMessage?: string;
  errorDescription?: string;
  className?: string;
  menuClassName?: string;
  children?: React.ReactNode;
}

function ActionMenuInner({
  items,
  size,
  trigger,
  align,
  openTrigger,
  closeOnOutsideClick,
  header,
  footer,
  divider,
  showCloseButton,
  menuState = "default",
  errorMessage,
  errorDescription,
  className = "",
  menuClassName = "",
  children,
}: ActionMenuInnerProps) {
  const { state, toggle, close, open } = useActionMenuContext();
  const s = sizeConfig[size];
  const wrapRef = useRef<HTMLDivElement>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const estimatedHeight = Math.min(items.length * 36 + 16, 400);
  const resolvedAlign = useAutoAlign(
    state.isOpen,
    wrapRef as React.RefObject<HTMLElement | null>,
    align,
    s.menuWidth,
    estimatedHeight,
  );

  useEffect(() => {
    if (!state.isOpen || !closeOnOutsideClick) return;
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        close();
      }
    };
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", keyHandler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", keyHandler);
    };
  }, [state.isOpen, close, closeOnOutsideClick]);

  const handleTriggerClick = useCallback(() => {
    if (state.disabled || openTrigger !== "click") return;
    toggle();
  }, [state.disabled, openTrigger, toggle]);

  const handleMouseEnter = useCallback(() => {
    if (state.disabled || openTrigger !== "hover") return;
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    open();
  }, [state.disabled, openTrigger, open]);

  const handleMouseLeave = useCallback(() => {
    if (openTrigger !== "hover") return;
    hoverTimerRef.current = setTimeout(() => {
      close();
    }, 80);
  }, [openTrigger, close]);

  const alignStyle = resolvedAlignToStyle(resolvedAlign);

  return (
    <div
      ref={wrapRef}
      className={`am-wrapper ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        onClick={handleTriggerClick}
        className={`am-trigger-wrap ${state.disabled ? "am-trigger-wrap--disabled" : ""}`}
        aria-expanded={state.isOpen}
        aria-haspopup="true"
      >
        {trigger}
      </div>

      {state.isOpen && (
        <div style={alignStyle} className="am-enter">
          <MenuPanel
            items={items}
            size={size}
            onClose={close}
            depth={0}
            header={header}
            footer={footer}
            divider={divider}
            showCloseButton={showCloseButton}
            menuState={menuState}
            errorMessage={errorMessage}
            errorDescription={errorDescription}
            className={menuClassName}
          >
            {children}
          </MenuPanel>
        </div>
      )}
    </div>
  );
}

export interface ActionMenuProps extends Omit<
  ActionMenuProviderProps,
  "children"
> {
  items: ActionItem[];
  trigger: React.ReactNode;
  size?: ActionMenuSize;
  align?: MenuAlign;
  className?: string;
  menuClassName?: string;
  openTrigger?: MenuOpenTrigger;
  closeOnOutsideClick?: boolean;
  header?: ActionMenuHeader;
  footer?: ActionMenuFooter;
  divider?: ActionMenuDivider;
  showCloseButton?: boolean;
  menuState?: MenuState;
  errorMessage?: string;
  errorDescription?: string;
  children?: React.ReactNode;
}

export function ActionMenu({
  items,
  trigger,
  size = "md",
  align = "auto",
  className = "",
  menuClassName = "",
  openTrigger = "click",
  closeOnOutsideClick = true,
  header,
  footer,
  divider,
  showCloseButton = false,
  menuState = "default",
  errorMessage,
  errorDescription,
  children,
  ...providerProps
}: ActionMenuProps) {
  return (
    <ActionMenuProvider {...providerProps} size={size} align={align}>
      <ActionMenuInner
        items={items}
        size={size}
        trigger={trigger}
        align={align}
        openTrigger={openTrigger}
        closeOnOutsideClick={closeOnOutsideClick}
        header={header}
        footer={footer}
        divider={divider}
        showCloseButton={showCloseButton}
        menuState={menuState}
        errorMessage={errorMessage}
        errorDescription={errorDescription}
        className={className}
        menuClassName={menuClassName}
      >
        {children}
      </ActionMenuInner>
    </ActionMenuProvider>
  );
}

export interface DefaultTriggerProps {
  label?: string;
  size?: ActionMenuSize;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  variant?: "default" | "ghost" | "outline";
  className?: string;
}

export function DefaultTrigger({
  label = "Actions",
  size = "md",
  leadingIcon,
  trailingIcon,
  variant = "default",
  className = "",
}: DefaultTriggerProps) {
  const s = sizeConfig[size];
  return (
    <button
      type="button"
      className={`am-btn-trigger am-btn-trigger--${variant} ${className}`}
      style={{ padding: s.triggerPadding, fontSize: s.triggerFontSize }}
    >
      {leadingIcon && (
        <span
          className="am-btn-trigger-lead-icon"
          style={{ width: s.triggerIconSize, height: s.triggerIconSize }}
        >
          {leadingIcon}
        </span>
      )}
      {label && <span>{label}</span>}
      {trailingIcon && (
        <span
          className="am-btn-trigger-trail-icon"
          style={{
            width: s.triggerIconSize - 2,
            height: s.triggerIconSize - 2,
          }}
        >
          {trailingIcon}
        </span>
      )}
    </button>
  );
}

export interface IconTriggerProps {
  size?: ActionMenuSize;
  icon: React.ReactNode;
  variant?: "default" | "ghost";
  className?: string;
}

const iconTriggerDim: Record<ActionMenuSize, string> = {
  xs: "26px",
  sm: "28px",
  md: "32px",
  lg: "36px",
  xl: "40px",
  "2xl": "44px",
  "3xl": "48px",
};

export function IconTrigger({
  size = "md",
  icon,
  variant = "ghost",
  className = "",
}: IconTriggerProps) {
  const s = sizeConfig[size];
  const dim = iconTriggerDim[size];

  return (
    <button
      type="button"
      className={`am-icon-trigger am-icon-trigger--${variant} ${className}`}
      style={{ width: dim, height: dim }}
    >
      <span
        style={{
          width: s.triggerIconSize,
          height: s.triggerIconSize,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </span>
    </button>
  );
}

export { ActionMenuProvider, useActionMenuContext };
export type {
  ActionItem,
  ActionMenuSize,
  MenuAlign,
  ActionItemVariant,
  ActionMenuHeader,
  ActionMenuFooter,
  ActionMenuDivider,
  MenuOpenTrigger,
  MenuState,
};
