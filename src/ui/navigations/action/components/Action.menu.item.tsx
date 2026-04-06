import React, { useRef, useState, useCallback } from "react";
import type {
  ActionItem,
  ActionItemVariant,
  ActionMenuSize,
} from "../Action.menu.context";
import { useActionMenuContext } from "../Action.menu.context";
import { sizeConfig, useSubmenuSide } from "../utils/Action.menu.util";
import { MenuPanel } from "./Action.menu.panel";

interface ActionRowProps {
  item: ActionItem;
  size: ActionMenuSize;
  onClose: () => void;
}

const ChevronRightIcon = ({ size }: { size: number }) => (
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
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export function ActionRow({ item, size, onClose }: ActionRowProps) {
  const { onAction } = useActionMenuContext();
  const s = sizeConfig[size];
  const hasChildren = !!item.children?.length;
  const variant: ActionItemVariant = item.variant ?? "default";
  const itemRef = useRef<HTMLDivElement>(null);
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const submenuSide = useSubmenuSide(
    itemRef as React.RefObject<HTMLElement | null>,
    s.menuWidth,
  );

  const handleClick = useCallback(() => {
    if (item.disabled || hasChildren) return;
    item.onClick?.();
    onAction?.(item);
    onClose();
  }, [item, hasChildren, onAction, onClose]);

  const handleMouseEnter = useCallback(() => {
    if (item.disabled) return;
    if (hasChildren) setSubmenuOpen(true);
  }, [item.disabled, hasChildren]);

  const handleMouseLeave = useCallback(() => {
    if (hasChildren) setSubmenuOpen(false);
  }, [hasChildren]);

  if (item.customContent) {
    return <div className="am-custom-content">{item.customContent}</div>;
  }

  return (
    <div
      ref={itemRef}
      className="am-item-row"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        disabled={item.disabled}
        onClick={handleClick}
        className={`am-item am-item--${variant}`}
        style={{
          padding: s.itemPadding,
          fontSize: s.itemFontSize,
          borderRadius: s.borderRadius,
        }}
      >
        {item.leadingIcon && (
          <span
            className={`am-item-icon-lead am-item-icon-lead--${variant}`}
            style={{ width: s.iconSize, height: s.iconSize }}
          >
            {item.leadingIcon}
          </span>
        )}

        <span className="am-item-content">
          <span className="am-item-label">{item.label}</span>
          {item.description && (
            <span className="am-item-desc" style={{ fontSize: s.descFontSize }}>
              {item.description}
            </span>
          )}
        </span>

        {item.trailingText && (
          <span
            className="am-item-trailing-text"
            style={{ fontSize: s.trailingFontSize }}
          >
            {item.trailingText}
          </span>
        )}

        {item.trailingIcon && !hasChildren && (
          <span
            className="am-item-trailing-icon"
            style={{ width: s.iconSize - 2, height: s.iconSize - 2 }}
          >
            {item.trailingIcon}
          </span>
        )}

        {hasChildren && (
          <span className="am-item-chevron">
            <ChevronRightIcon size={s.chevronSize} />
          </span>
        )}
      </button>

      {hasChildren && submenuOpen && (
        <div
          className={`am-submenu-wrap am-submenu-wrap--${submenuSide} am-submenu-enter`}
        >
          <MenuPanel
            items={item.children!}
            size={size}
            onClose={onClose}
            depth={1}
          />
        </div>
      )}
    </div>
  );
}
