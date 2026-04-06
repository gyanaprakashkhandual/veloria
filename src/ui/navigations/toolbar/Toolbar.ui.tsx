import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoreHorizontal } from "lucide-react";
import {
  ToolbarProvider,
  useToolbarContext,
  type ToolbarProviderProps,
  type ToolbarSize,
  type ToolbarVariant,
  type ToolbarOrientation,
} from "./Toolbar.context";
import { ActionMenu, type ActionItem } from "../../navigations/action/Action.menu.ui";

// ─── Size Config ────────────────────────────────────────────────────────────

const sizeConfig = {
  sm: {
    toolbarPx: "px-1",
    toolbarPy: "py-1",
    toolbarGap: "gap-0.5",
    itemPx: "px-2",
    itemPy: "py-1",
    itemText: "text-xs",
    iconSize: 13,
    separatorH: "h-4",
    separatorW: "w-4",
    overflowBtnDim: "w-7 h-7",
    labelText: "text-[10px]",
    badgeSize: "w-3.5 h-3.5 text-[8px]",
  },
  md: {
    toolbarPx: "px-1.5",
    toolbarPy: "py-1.5",
    toolbarGap: "gap-0.5",
    itemPx: "px-2.5",
    itemPy: "py-1.5",
    itemText: "text-sm",
    iconSize: 15,
    separatorH: "h-5",
    separatorW: "w-5",
    overflowBtnDim: "w-8 h-8",
    labelText: "text-[10px]",
    badgeSize: "w-4 h-4 text-[9px]",
  },
  lg: {
    toolbarPx: "px-2",
    toolbarPy: "py-2",
    toolbarGap: "gap-1",
    itemPx: "px-3",
    itemPy: "py-2",
    itemText: "text-sm",
    iconSize: 16,
    separatorH: "h-5",
    separatorW: "w-5",
    overflowBtnDim: "w-9 h-9",
    labelText: "text-[11px]",
    badgeSize: "w-4 h-4 text-[9px]",
  },
  xl: {
    toolbarPx: "px-2.5",
    toolbarPy: "py-2.5",
    toolbarGap: "gap-1",
    itemPx: "px-3.5",
    itemPy: "py-2.5",
    itemText: "text-sm",
    iconSize: 17,
    separatorH: "h-6",
    separatorW: "w-6",
    overflowBtnDim: "w-10 h-10",
    labelText: "text-xs",
    badgeSize: "w-4.5 h-4.5 text-[10px]",
  },
};

// ─── Variant Styles ──────────────────────────────────────────────────────────

const toolbarVariantStyles: Record<ToolbarVariant, string> = {
  default:
    "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm shadow-black/5 dark:shadow-black/20",
  ghost: "bg-transparent",
  outline:
    "bg-transparent border border-gray-300 dark:border-gray-600",
  filled:
    "bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
};

const itemBaseStyles =
  "relative inline-flex items-center justify-center gap-1.5 font-medium transition-colors duration-100 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:ring-offset-1";

const itemActiveStyles =
  "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100";

const itemInactiveStyles =
  "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100";

const itemDisabledStyles =
  "opacity-40 cursor-not-allowed pointer-events-none text-gray-400 dark:text-gray-600";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ToolbarItemDef {
  id: string;
  /** Icon node */
  icon?: React.ReactNode;
  /** Label shown below icon (icon-only mode) or beside it */
  label?: string;
  /** Tooltip text shown on hover */
  tooltip?: string;
  /** Show a numeric/dot badge */
  badge?: number | boolean;
  /** Disable this specific item */
  disabled?: boolean;
  /** Render as a toggle (stays active after click) */
  toggle?: boolean;
  /** Nested ActionMenu items – renders overflow menu */
  menuItems?: ActionItem[];
  /** Custom click handler */
  onClick?: (id: string) => void;
  /** Custom render – full control */
  render?: (props: ToolbarItemRenderProps) => React.ReactNode;
}

export interface ToolbarItemRenderProps {
  id: string;
  isActive: boolean;
  size: ToolbarSize;
  disabled: boolean;
}

export interface ToolbarSeparatorDef {
  type: "separator";
  id: string;
}

export interface ToolbarGroupDef {
  type: "group";
  id: string;
  items: ToolbarItemDef[];
}

export type ToolbarChild =
  | ToolbarItemDef
  | ToolbarSeparatorDef
  | ToolbarGroupDef;

// ─── Tooltip ─────────────────────────────────────────────────────────────────

interface TooltipProps {
  label: string;
  children: React.ReactNode;
  orientation: ToolbarOrientation;
}

function Tooltip({ label, children, orientation }: TooltipProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="relative flex items-center justify-center"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.93 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.93 }}
            transition={{ duration: 0.1, ease: "easeOut" }}
            className={`
              pointer-events-none absolute z-50 whitespace-nowrap
              bg-gray-900 dark:bg-gray-700 text-white text-[11px] font-medium
              px-2 py-1 rounded-md shadow-md
              ${
                orientation === "horizontal"
                  ? "top-full mt-2"
                  : "left-full ml-2"
              }
            `}
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────

function Badge({ value, sizeKey }: { value: number | boolean; sizeKey: ToolbarSize }) {
  const s = sizeConfig[sizeKey];
  const isNumber = typeof value === "number";

  return (
    <span
      className={`
        absolute -top-1 -right-1 flex items-center justify-center
        rounded-full bg-blue-500 text-white font-bold leading-none
        ${s.badgeSize}
      `}
    >
      {isNumber && value > 0 ? (value > 99 ? "99+" : value) : ""}
    </span>
  );
}

// ─── ToolbarButton ────────────────────────────────────────────────────────────

interface ToolbarButtonProps {
  item: ToolbarItemDef;
}

function ToolbarButton({ item }: ToolbarButtonProps) {
  const { state, toggleActive, setActive, isActive } = useToolbarContext();
  const s = sizeConfig[state.size];
  const active = isActive(item.id);
  const disabled = state.disabled || !!item.disabled;
  const showLabel = !!item.label;

  const handleClick = useCallback(() => {
    if (disabled) return;
    if (item.toggle) toggleActive(item.id);
    else setActive(item.id);
    item.onClick?.(item.id);
  }, [disabled, item, toggleActive, setActive]);

  const btn = (
    <button
      type="button"
      disabled={disabled}
      onClick={handleClick}
      aria-pressed={item.toggle ? active : undefined}
      className={`
        ${itemBaseStyles}
        ${s.itemPx} ${s.itemPy} ${s.itemText}
        rounded-lg
        ${disabled ? itemDisabledStyles : active ? itemActiveStyles : itemInactiveStyles}
        ${state.orientation === "vertical" && showLabel ? "w-full justify-start" : ""}
      `}
    >
      {item.icon && (
        <span
          className="shrink-0 flex items-center justify-center relative"
          style={{ width: s.iconSize, height: s.iconSize }}
        >
          {item.icon}
          {item.badge !== undefined && item.badge !== false && (
            <Badge value={item.badge} sizeKey={state.size} />
          )}
        </span>
      )}
      {showLabel && (
        <span className={`${s.itemText} font-medium`}>{item.label}</span>
      )}
    </button>
  );

  if (item.tooltip) {
    return (
      <Tooltip label={item.tooltip} orientation={state.orientation}>
        {btn}
      </Tooltip>
    );
  }

  return btn;
}

// ─── ToolbarMenuButton ────────────────────────────────────────────────────────

interface ToolbarMenuButtonProps {
  item: ToolbarItemDef;
}

function ToolbarMenuButton({ item }: ToolbarMenuButtonProps) {
  const { state } = useToolbarContext();
  const s = sizeConfig[state.size];
  const disabled = state.disabled || !!item.disabled;

  const trigger = (
    <button
      type="button"
      disabled={disabled}
      className={`
        ${itemBaseStyles}
        ${s.itemPx} ${s.itemPy} ${s.itemText}
        rounded-lg
        ${disabled ? itemDisabledStyles : itemInactiveStyles}
      `}
    >
      {item.icon && (
        <span
          className="shrink-0 flex items-center justify-center"
          style={{ width: s.iconSize, height: s.iconSize }}
        >
          {item.icon}
        </span>
      )}
      {item.label && (
        <span className={`${s.itemText} font-medium`}>{item.label}</span>
      )}
    </button>
  );

  return (
    <ActionMenu
      items={item.menuItems!}
      trigger={trigger}
      size={state.size}
      align="auto"
      disabled={disabled}
    />
  );
}

// ─── ToolbarSeparator ─────────────────────────────────────────────────────────

function ToolbarSeparator() {
  const { state } = useToolbarContext();

  return state.orientation === "horizontal" ? (
    <div className="shrink-0 w-px mx-1 self-stretch bg-gray-200 dark:bg-gray-700 rounded-full" />
  ) : (
    <div className="shrink-0 h-px my-1 self-stretch bg-gray-200 dark:bg-gray-700 rounded-full" />
  );
}

// ─── ToolbarGroup ─────────────────────────────────────────────────────────────

interface ToolbarGroupProps {
  group: ToolbarGroupDef;
}

function ToolbarGroup({ group }: ToolbarGroupProps) {
  const { state } = useToolbarContext();

  return (
    <div
      className={`
        flex items-center rounded-lg
        bg-gray-100 dark:bg-gray-800
        border border-gray-200 dark:border-gray-700
        ${state.orientation === "horizontal" ? "flex-row" : "flex-col"}
        p-0.5 gap-0
      `}
    >
      {group.items.map((item, idx) => (
        <React.Fragment key={item.id}>
          {idx > 0 && (
            <div
              className={
                state.orientation === "horizontal"
                  ? "w-px self-stretch bg-gray-200 dark:bg-gray-700 mx-0.5"
                  : "h-px self-stretch bg-gray-200 dark:bg-gray-700 my-0.5"
              }
            />
          )}
          {item.menuItems?.length ? (
            <ToolbarMenuButton item={item} />
          ) : (
            <ToolbarButton item={item} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ─── Overflow Menu ────────────────────────────────────────────────────────────

interface OverflowMenuProps {
  items: ToolbarItemDef[];
}

function OverflowMenu({ items }: OverflowMenuProps) {
  const { state } = useToolbarContext();
  const s = sizeConfig[state.size];

  const actionItems: ActionItem[] = items.map((item) => ({
    id: item.id,
    label: item.label ?? item.id,
    leadingIcon: item.icon,
    disabled: item.disabled,
    onClick: () => item.onClick?.(item.id),
    children: item.menuItems,
  }));

  const trigger = (
    <button
      type="button"
      className={`
        ${itemBaseStyles}
        ${s.overflowBtnDim}
        rounded-lg
        ${itemInactiveStyles}
      `}
      aria-label="More actions"
    >
      <MoreHorizontal size={s.iconSize} />
    </button>
  );

  return (
    <ActionMenu
      items={actionItems}
      trigger={trigger}
      size={state.size}
      align="auto"
    />
  );
}

// ─── ToolbarInner ─────────────────────────────────────────────────────────────

interface ToolbarInnerProps {
  items: ToolbarChild[];
  className?: string;
  children?: React.ReactNode;
  responsive?: boolean;
}

function ToolbarInner({ items, className = "", children, responsive = true }: ToolbarInnerProps) {
  const { state } = useToolbarContext();
  const s = sizeConfig[state.size];
  const containerRef = useRef<HTMLDivElement>(null);
  const [overflowIds, setOverflowIds] = useState<Set<string>>(new Set());

  // Responsive overflow detection
  useEffect(() => {
    if (!responsive || state.orientation === "vertical") return;

    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      const containerWidth = container.offsetWidth;
      const childNodes = Array.from(container.children) as HTMLElement[];
      // Last child is the overflow button — skip it in measurement
      const visibleChildren = childNodes.slice(0, -1);

      let usedWidth = 0;
      const hidden = new Set<string>();
      const overflowBtnWidth = 40; // approx

      visibleChildren.forEach((child) => {
        const id = child.dataset.toolbarid;
        if (!id) return;
        usedWidth += child.scrollWidth + 4; // gap
        if (usedWidth + overflowBtnWidth > containerWidth) {
          hidden.add(id);
        }
      });

      setOverflowIds(hidden);
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [responsive, state.orientation, items]);

  const overflowItems = items
    .filter(
      (c): c is ToolbarItemDef =>
        !("type" in c) && overflowIds.has(c.id)
    );

  const renderChild = (child: ToolbarChild) => {
    if ("type" in child && child.type === "separator") {
      const hidden = false; // separators don't overflow individually
      return hidden ? null : <ToolbarSeparator key={child.id} />;
    }

    if ("type" in child && child.type === "group") {
      return <ToolbarGroup key={child.id} group={child} />;
    }

    const item = child as ToolbarItemDef;
    const isHidden = overflowIds.has(item.id);

    const el = item.render ? (
      item.render({
        id: item.id,
        isActive: false,
        size: state.size,
        disabled: state.disabled || !!item.disabled,
      })
    ) : item.menuItems?.length ? (
      <ToolbarMenuButton key={item.id} item={item} />
    ) : (
      <ToolbarButton key={item.id} item={item} />
    );

    return (
      <div
        key={item.id}
        data-toolbarid={item.id}
        className={isHidden ? "hidden" : "flex items-center"}
      >
        {el}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      role="toolbar"
      aria-orientation={state.orientation}
      className={`
        inline-flex items-center
        ${state.orientation === "horizontal" ? `flex-row ${s.toolbarGap}` : `flex-col ${s.toolbarGap}`}
        ${s.toolbarPx} ${s.toolbarPy}
        rounded-xl
        ${toolbarVariantStyles[state.variant]}
        ${state.orientation === "vertical" ? "w-max" : ""}
        ${className}
      `}
    >
      {items.map(renderChild)}

      {/* Custom children (e.g. search input, custom slots) */}
      {children}

      {/* Overflow button */}
      {responsive && overflowItems.length > 0 && (
        <OverflowMenu items={overflowItems} />
      )}
    </div>
  );
}

// ─── Public API ───────────────────────────────────────────────────────────────

export interface ToolbarProps
  extends Omit<ToolbarProviderProps, "children"> {
  items: ToolbarChild[];
  /** Additional custom children rendered inside the toolbar */
  children?: React.ReactNode;
  /** Whether to auto-collapse items into overflow menu when space is limited */
  responsive?: boolean;
  /** Extra classes on the outer toolbar element */
  className?: string;
}

export function Toolbar({
  items,
  children,
  responsive = true,
  className = "",
  size = "md",
  variant = "default",
  orientation = "horizontal",
  disabled = false,
  defaultActiveIds = [],
  ...providerProps
}: ToolbarProps) {
  return (
    <ToolbarProvider
      size={size}
      variant={variant}
      orientation={orientation}
      disabled={disabled}
      defaultActiveIds={defaultActiveIds}
      {...providerProps}
    >
      <ToolbarInner
        items={items}
        className={className}
        responsive={responsive}
      >
        {children}
      </ToolbarInner>
    </ToolbarProvider>
  );
}

// ─── Convenience sub-components ───────────────────────────────────────────────

/** A plain text / input slot to embed inside a Toolbar as a child */
export interface ToolbarSlotProps {
  children: React.ReactNode;
  className?: string;
}

export function ToolbarSlot({ children, className = "" }: ToolbarSlotProps) {
  return (
    <div className={`flex items-center ${className}`}>
      {children}
    </div>
  );
}

export { ToolbarProvider, useToolbarContext };
export type { ToolbarSize, ToolbarVariant, ToolbarOrientation };