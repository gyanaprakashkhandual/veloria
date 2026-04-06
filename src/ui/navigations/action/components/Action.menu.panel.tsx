import React from "react";
import type {
  ActionItem,
  ActionMenuSize,
  ActionMenuHeader,
  ActionMenuFooter,
  ActionMenuDivider,
} from "../Action.menu.context";
import { sizeConfig } from "../utils/Action.menu.util";
import { ActionRow } from "./Action.menu.item";

const XIcon = ({ size }: { size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const AlertCircleIcon = ({ size }: { size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

interface MenuPanelProps {
  items: ActionItem[];
  size: ActionMenuSize;
  onClose: () => void;
  depth?: number;
  header?: ActionMenuHeader;
  footer?: ActionMenuFooter;
  divider?: ActionMenuDivider;
  showCloseButton?: boolean;
  menuState?: "default" | "loading" | "error";
  errorMessage?: string;
  errorDescription?: string;
  className?: string;
  children?: React.ReactNode;
}

function SkeletonItem({ size }: { size: ActionMenuSize }) {
  const s = sizeConfig[size];
  return (
    <div className="am-skeleton-item" style={{ padding: s.itemPadding }}>
      <div
        className="am-skeleton-icon"
        style={{ width: s.iconSize, height: s.iconSize }}
      />
      <div className="am-skeleton-lines">
        <div className="am-skeleton-line" />
        <div className="am-skeleton-line am-skeleton-line--short" />
      </div>
    </div>
  );
}

export function MenuPanel({
  items,
  size,
  onClose,
  header,
  footer,
  divider,
  showCloseButton = false,
  menuState = "default",
  errorMessage = "Something went wrong",
  errorDescription,
  className = "",
  children,
}: MenuPanelProps) {
  const s = sizeConfig[size];

  const dividerStyle: React.CSSProperties = divider
    ? {
        height: divider.thickness ?? 1,
        background: divider.color ?? "var(--color-divider-primary)",
      }
    : {};

  return (
    <div
      className={`am-panel ${className}`}
      style={{ minWidth: s.menuWidth, borderRadius: s.borderRadius }}
    >
      <div className="am-panel-inner">
        {(header?.text || header?.leadingIcon || showCloseButton) && (
          <div
            className="am-header"
            style={{
              padding: s.itemPadding,
              fontSize: s.headerFontSize,
              color: header?.color ?? undefined,
            }}
          >
            {header?.leadingIcon && (
              <span
                className="am-header-icon"
                style={{ width: s.iconSize - 2, height: s.iconSize - 2 }}
              >
                {header.leadingIcon}
              </span>
            )}
            {header?.text && (
              <span className="am-header-text">{header.text}</span>
            )}
            {header?.trailingIcon && (
              <span
                className="am-header-trailing"
                style={{ width: s.iconSize - 2, height: s.iconSize - 2 }}
              >
                {header.trailingIcon}
              </span>
            )}
            {showCloseButton && (
              <button
                type="button"
                className="am-close-btn"
                onClick={onClose}
                aria-label="Close menu"
              >
                <XIcon size={s.iconSize - 3} />
              </button>
            )}
          </div>
        )}

        <div
          className="am-items"
          style={{ padding: s.menuPadding, gap: s.gap }}
        >
          {menuState === "loading" && (
            <>
              <SkeletonItem size={size} />
              <SkeletonItem size={size} />
              <SkeletonItem size={size} />
            </>
          )}

          {menuState === "error" && (
            <div className="am-error-state">
              <span className="am-error-icon">
                <AlertCircleIcon size={s.iconSize + 4} />
              </span>
              <span className="am-error-text">{errorMessage}</span>
              {errorDescription && (
                <span className="am-error-desc">{errorDescription}</span>
              )}
            </div>
          )}

          {menuState === "default" &&
            items.map((item, idx) => (
              <React.Fragment key={item.id}>
                {item.dividerBefore && idx > 0 && (
                  <div
                    className="am-divider"
                    style={divider ? dividerStyle : undefined}
                  />
                )}
                {item.header && (
                  <div
                    className="am-section-header"
                    style={{ fontSize: s.headerFontSize }}
                  >
                    {item.header}
                  </div>
                )}
                <ActionRow item={item} size={size} onClose={onClose} />
              </React.Fragment>
            ))}

          {menuState === "default" && children && (
            <div className="am-custom-content">{children}</div>
          )}
        </div>

        {(footer?.text || footer?.leadingIcon) && (
          <div
            className="am-footer"
            style={{
              padding: s.itemPadding,
              fontSize: s.headerFontSize,
              color: footer?.color ?? undefined,
            }}
          >
            {footer?.leadingIcon && (
              <span
                className="am-footer-icon"
                style={{ width: s.iconSize - 2, height: s.iconSize - 2 }}
              >
                {footer.leadingIcon}
              </span>
            )}
            {footer?.text && (
              <span className="am-footer-text">{footer.text}</span>
            )}
            {footer?.trailingIcon && (
              <span
                className="am-footer-trailing"
                style={{ width: s.iconSize - 2, height: s.iconSize - 2 }}
              >
                {footer.trailingIcon}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
