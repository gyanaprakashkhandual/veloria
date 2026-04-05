import React, {
  useEffect,
  useRef,
  useLayoutEffect,
  useState,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft } from "lucide-react";
import {
  ActionMenuProvider,
  useActionMenuContext,
  type ActionMenuProviderProps,
  type ActionItem,
  type ActionMenuSize,
  type ActionItemVariant,
  type MenuAlign,
} from "../../../context/action/Action.menu.context";

const sizeConfig = {
  sm: {
    menuWidth: 176,
    itemPx: "px-2",
    itemPy: "py-1",
    itemText: "text-xs",
    iconSize: 13,
    trailingTextSize: "text-[10px]",
    headerText: "text-[10px]",
    descText: "text-[10px]",
    chevronSize: 10,
    triggerPx: "px-2",
    triggerPy: "py-1",
    triggerText: "text-xs",
    triggerIconSize: 13,
    backBtnPy: "py-1",
    backBtnPx: "px-2",
  },
  md: {
    menuWidth: 220,
    itemPx: "px-2.5",
    itemPy: "py-1.5",
    itemText: "text-sm",
    iconSize: 15,
    trailingTextSize: "text-xs",
    headerText: "text-[10px]",
    descText: "text-xs",
    chevronSize: 12,
    triggerPx: "px-3",
    triggerPy: "py-1.5",
    triggerText: "text-sm",
    triggerIconSize: 15,
    backBtnPy: "py-1.5",
    backBtnPx: "px-2.5",
  },
  lg: {
    menuWidth: 256,
    itemPx: "px-3",
    itemPy: "py-2",
    itemText: "text-sm",
    iconSize: 16,
    trailingTextSize: "text-xs",
    headerText: "text-[11px]",
    descText: "text-xs",
    chevronSize: 13,
    triggerPx: "px-3.5",
    triggerPy: "py-2",
    triggerText: "text-sm",
    triggerIconSize: 16,
    backBtnPy: "py-2",
    backBtnPx: "px-3",
  },
  xl: {
    menuWidth: 288,
    itemPx: "px-3.5",
    itemPy: "py-2.5",
    itemText: "text-sm",
    iconSize: 17,
    trailingTextSize: "text-sm",
    headerText: "text-xs",
    descText: "text-xs",
    chevronSize: 14,
    triggerPx: "px-4",
    triggerPy: "py-2.5",
    triggerText: "text-base",
    triggerIconSize: 17,
    backBtnPy: "py-2.5",
    backBtnPx: "px-3.5",
  },
};

const variantStyles: Record<ActionItemVariant, string> = {
  default:
    "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
  danger:
    "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40",
  warning:
    "text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40",
  success:
    "text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40",
};

const variantIconStyles: Record<ActionItemVariant, string> = {
  default: "text-gray-400 dark:text-gray-500",
  danger: "text-red-500 dark:text-red-400",
  warning: "text-amber-500 dark:text-amber-400",
  success: "text-emerald-500 dark:text-emerald-400",
};

type ResolvedAlign = "bottom-left" | "bottom-right" | "top-left" | "top-right";
type SubmenuSide = "right" | "left";

function useAutoAlign(
  open: boolean,
  anchorRef: React.RefObject<HTMLElement | null>,
  preferred: MenuAlign,
  menuWidth: number,
  menuHeight: number,
): ResolvedAlign {
  const [align, setAlign] = useState<ResolvedAlign>("bottom-left");

  useLayoutEffect(() => {
    if (!open || !anchorRef.current) return;
    if (preferred !== "auto") {
      setAlign(preferred as ResolvedAlign);
      return;
    }
    const rect = anchorRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const spaceRight = window.innerWidth - rect.left;
    const vert =
      spaceBelow >= menuHeight || spaceBelow >= spaceAbove ? "bottom" : "top";
    const horiz = spaceRight >= menuWidth ? "left" : "right";
    setAlign(`${vert}-${horiz}` as ResolvedAlign);
  }, [open, anchorRef, preferred, menuWidth, menuHeight]);

  return align;
}

function useSubmenuSide(
  itemRef: React.RefObject<HTMLElement | null>,
  menuWidth: number,
): SubmenuSide {
  const [side, setSide] = useState<SubmenuSide>("right");

  useLayoutEffect(() => {
    if (!itemRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    setSide(window.innerWidth - rect.right >= menuWidth ? "right" : "left");
  });

  return side;
}

function resolvedAlignToStyle(align: ResolvedAlign): React.CSSProperties {
  const base: React.CSSProperties = { position: "absolute", zIndex: 50 };
  if (align === "bottom-left")
    return { ...base, top: "100%", left: 0, marginTop: 6 };
  if (align === "bottom-right")
    return { ...base, top: "100%", right: 0, marginTop: 6 };
  if (align === "top-left")
    return { ...base, bottom: "100%", left: 0, marginBottom: 6 };
  return { ...base, bottom: "100%", right: 0, marginBottom: 6 };
}

const menuMotion = {
  initial: { opacity: 0, scale: 0.97, y: -4 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.97, y: -4 },
  transition: { duration: 0.13, ease: "easeOut" },
};

const submenuMotion = {
  initial: { opacity: 0, x: 8, scale: 0.97 },
  animate: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: 8, scale: 0.97 },
  transition: { duration: 0.13, ease: "easeOut" },
};

interface ActionRowProps {
  item: ActionItem;
  size: ActionMenuSize;
  onClose: () => void;
}

function ActionRow({ item, size, onClose }: ActionRowProps) {
  const { pushSubmenu, onAction } = useActionMenuContext();
  const s = sizeConfig[size];
  const hasChildren = !!item.children?.length;
  const variant = item.variant ?? "default";
  const itemRef = useRef<HTMLDivElement>(null);
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const submenuSide = useSubmenuSide(
    itemRef as React.RefObject<HTMLElement | null>,
    s.menuWidth,
  );

  const handleClick = useCallback(() => {
    if (item.disabled) return;
    if (hasChildren) return;
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

  return (
    <div
      ref={itemRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        disabled={item.disabled}
        onClick={handleClick}
        className={`
          w-full flex items-center gap-2 ${s.itemPx} ${s.itemPy} rounded-md
          ${s.itemText} font-medium transition-colors duration-100 text-left
          ${
            item.disabled
              ? "opacity-40 cursor-not-allowed text-gray-400 dark:text-gray-600"
              : variantStyles[variant]
          }
        `}
      >
        {item.leadingIcon && (
          <span
            className={`shrink-0 flex items-center justify-center ${item.disabled ? "opacity-40" : variantIconStyles[variant]}`}
            style={{ width: s.iconSize, height: s.iconSize }}
          >
            {item.leadingIcon}
          </span>
        )}

        <span className="flex-1 min-w-0">
          <span className="block truncate">{item.label}</span>
          {item.description && (
            <span
              className={`block truncate ${s.descText} text-gray-400 dark:text-gray-500 font-normal mt-0.5`}
            >
              {item.description}
            </span>
          )}
        </span>

        {item.trailingText && (
          <span
            className={`shrink-0 ${s.trailingTextSize} text-gray-400 dark:text-gray-500 font-normal`}
          >
            {item.trailingText}
          </span>
        )}

        {item.trailingIcon && !hasChildren && (
          <span
            className={`shrink-0 flex items-center justify-center ${variantIconStyles[variant]}`}
            style={{ width: s.iconSize - 2, height: s.iconSize - 2 }}
          >
            {item.trailingIcon}
          </span>
        )}

        {hasChildren && (
          <ChevronRight
            size={s.chevronSize}
            className="shrink-0 text-gray-400 dark:text-gray-500"
          />
        )}
      </button>

      <AnimatePresence>
        {hasChildren && submenuOpen && (
          <motion.div
            {...submenuMotion}
            style={{
              position: "absolute",
              top: 0,
              ...(submenuSide === "right"
                ? { left: "100%", paddingLeft: 4 }
                : { right: "100%", paddingRight: 4 }),
              zIndex: 60,
              minWidth: s.menuWidth,
            }}
          >
            <MenuPanel
              items={item.children!}
              size={size}
              onClose={onClose}
              depth={1}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface MenuPanelProps {
  items: ActionItem[];
  size: ActionMenuSize;
  onClose: () => void;
  depth?: number;
}

function MenuPanel({ items, size, onClose, depth = 0 }: MenuPanelProps) {
  const s = sizeConfig[size];

  return (
    <div
      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg shadow-black/10 dark:shadow-black/40 overflow-hidden"
      style={{ minWidth: s.menuWidth }}
    >
      <div className="p-1">
        {items.map((item, idx) => (
          <React.Fragment key={item.id}>
            {item.dividerBefore && idx > 0 && (
              <div className="my-1 -mx-1 border-t border-gray-100 dark:border-gray-800" />
            )}
            {item.header && (
              <div
                className={`${s.itemPx} pt-2 pb-1 ${s.headerText} font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 select-none`}
              >
                {item.header}
              </div>
            )}
            <ActionRow item={item} size={size} onClose={onClose} />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

interface ActionMenuInnerProps {
  items: ActionItem[];
  size: ActionMenuSize;
  trigger: React.ReactNode;
  align: MenuAlign;
}

function ActionMenuInner({
  items,
  size,
  trigger,
  align,
}: ActionMenuInnerProps) {
  const { state, toggle, close } = useActionMenuContext();
  const s = sizeConfig[size];
  const wrapRef = useRef<HTMLDivElement>(null);
  const estimatedHeight = Math.min(items.length * 36 + 16, 400);
  const resolvedAlign = useAutoAlign(
    state.isOpen,
    wrapRef as React.RefObject<HTMLElement | null>,
    align,
    s.menuWidth,
    estimatedHeight,
  );

  useEffect(() => {
    if (!state.isOpen) return;
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node))
        close();
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
  }, [state.isOpen, close]);

  return (
    <div ref={wrapRef} className="relative inline-block">
      <div
        onClick={() => {
          if (!state.disabled) toggle();
        }}
        className={
          state.disabled
            ? "opacity-50 cursor-not-allowed pointer-events-none"
            : "cursor-pointer"
        }
      >
        {trigger}
      </div>

      <AnimatePresence>
        {state.isOpen && (
          <motion.div
            {...menuMotion}
            style={resolvedAlignToStyle(resolvedAlign)}
          >
            <MenuPanel items={items} size={size} onClose={close} depth={0} />
          </motion.div>
        )}
      </AnimatePresence>
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
}

export function ActionMenu({
  items,
  trigger,
  size = "md",
  align = "auto",
  className = "",
  ...providerProps
}: ActionMenuProps) {
  return (
    <div className={className}>
      <ActionMenuProvider {...providerProps} size={size} align={align}>
        <ActionMenuInner
          items={items}
          size={size}
          trigger={trigger}
          align={align}
        />
      </ActionMenuProvider>
    </div>
  );
}

export interface DefaultTriggerProps {
  label?: string;
  size?: ActionMenuSize;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  variant?: "default" | "ghost" | "outline";
}

export function DefaultTrigger({
  label = "Actions",
  size = "md",
  leadingIcon,
  trailingIcon,
  variant = "default",
}: DefaultTriggerProps) {
  const s = sizeConfig[size];

  const variantClass = {
    default:
      "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm",
    ghost:
      "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 border border-transparent",
    outline:
      "bg-transparent border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500",
  }[variant];

  return (
    <button
      type="button"
      className={`
        inline-flex items-center gap-1.5 ${s.triggerPx} ${s.triggerPy}
        ${s.triggerText} font-medium rounded-lg transition-colors duration-100
        text-gray-700 dark:text-gray-200
        ${variantClass}
      `}
    >
      {leadingIcon && (
        <span
          className="shrink-0 flex items-center text-gray-500 dark:text-gray-400"
          style={{ width: s.triggerIconSize, height: s.triggerIconSize }}
        >
          {leadingIcon}
        </span>
      )}
      {label && <span>{label}</span>}
      {trailingIcon && (
        <span
          className="shrink-0 flex items-center text-gray-400 dark:text-gray-500"
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
}

export function IconTrigger({
  size = "md",
  icon,
  variant = "ghost",
}: IconTriggerProps) {
  const s = sizeConfig[size];
  const dim = { sm: "w-7 h-7", md: "w-8 h-8", lg: "w-9 h-9", xl: "w-10 h-10" }[
    size
  ];

  return (
    <button
      type="button"
      className={`
        inline-flex items-center justify-center ${dim} rounded-lg
        text-gray-500 dark:text-gray-400 transition-colors duration-100
        ${
          variant === "ghost"
            ? "hover:bg-gray-100 dark:hover:bg-gray-800"
            : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm"
        }
      `}
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
export type { ActionItem, ActionMenuSize, MenuAlign, ActionItemVariant };
