import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronRight,
  Search,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  PanelLeft,
} from "lucide-react";
import {
  SidebarProvider,
  useSidebarContext,
  type SidebarProviderProps,
  type SidebarItem,
  type SidebarSize,
  type SidebarVariant,
  type SidebarPosition,
  type SidebarState_Mode,
} from "../../../context/sidebar/Sidebar.context";

const sizeConfig = {
  sm: {
    expandedWidth: 220,
    collapsedWidth: 48,
    px: "px-2",
    py: "py-1.5",
    iconSize: 14,
    labelText: "text-xs",
    headerText: "text-[10px]",
    badgeText: "text-[9px]",
    headerPx: "px-2",
    headerPy: "py-2",
    headerTitleText: "text-xs",
    searchHeight: "h-7",
    searchText: "text-xs",
    searchPx: "px-2",
    footerPx: "px-2",
    footerPy: "py-2",
    gap: "gap-0.5",
    indentBase: 20,
    chevronSize: 10,
    toggleSize: 14,
  },
  md: {
    expandedWidth: 260,
    collapsedWidth: 56,
    px: "px-2.5",
    py: "py-2",
    iconSize: 16,
    labelText: "text-sm",
    headerText: "text-[10px]",
    badgeText: "text-[10px]",
    headerPx: "px-3",
    headerPy: "py-3",
    headerTitleText: "text-sm",
    searchHeight: "h-8",
    searchText: "text-sm",
    searchPx: "px-3",
    footerPx: "px-3",
    footerPy: "py-3",
    gap: "gap-0.5",
    indentBase: 24,
    chevronSize: 12,
    toggleSize: 16,
  },
  lg: {
    expandedWidth: 300,
    collapsedWidth: 64,
    px: "px-3",
    py: "py-2.5",
    iconSize: 17,
    labelText: "text-sm",
    headerText: "text-[11px]",
    badgeText: "text-[10px]",
    headerPx: "px-4",
    headerPy: "py-4",
    headerTitleText: "text-base",
    searchHeight: "h-9",
    searchText: "text-sm",
    searchPx: "px-4",
    footerPx: "px-4",
    footerPy: "py-4",
    gap: "gap-1",
    indentBase: 28,
    chevronSize: 13,
    toggleSize: 17,
  },
};

const variantStyles: Record<SidebarVariant, string> = {
  default: "bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800",
  filled: "bg-gray-50 dark:bg-gray-800/80 border-r border-gray-200 dark:border-gray-700",
  ghost: "bg-transparent border-r border-gray-100 dark:border-gray-800/60",
  glass: "bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-r border-gray-200/60 dark:border-gray-700/60",
};

const variantMobileOverlay: Record<SidebarVariant, string> = {
  default: "bg-white dark:bg-gray-900",
  filled: "bg-gray-50 dark:bg-gray-800",
  ghost: "bg-white dark:bg-gray-900",
  glass: "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md",
};

function flattenSearch(items: SidebarItem[], query: string): SidebarItem[] {
  const q = query.toLowerCase();
  const result: SidebarItem[] = [];
  const walk = (list: SidebarItem[]) => {
    for (const item of list) {
      if (item.children?.length) {
        walk(item.children);
      } else if (item.label.toLowerCase().includes(q) && !item.disabled) {
        result.push(item);
      }
    }
  };
  walk(items);
  return result;
}

interface SidebarRowProps {
  item: SidebarItem;
  depth: number;
  size: SidebarSize;
  collapsed: boolean;
  onClose?: () => void;
}

function SidebarRow({ item, depth, size, collapsed, onClose }: SidebarRowProps) {
  const s = sizeConfig[size];
  const { setActiveItem, toggleExpand, isExpanded, isActive } = useSidebarContext();
  const hasChildren = !!item.children?.length;
  const expanded = isExpanded(item.id);
  const active = isActive(item.id);
  const indent = depth * s.indentBase;

  const handleClick = () => {
    if (item.disabled) return;
    if (hasChildren) {
      toggleExpand(item.id);
      return;
    }
    item.onClick?.();
    setActiveItem(item.id);
    onClose?.();
  };

  return (
    <>
      <button
        type="button"
        disabled={item.disabled}
        title={collapsed ? item.label : undefined}
        onClick={handleClick}
        className={`
          w-full flex items-center ${collapsed ? "justify-center" : "gap-2.5"} 
          ${s.px} ${s.py} rounded-lg ${s.labelText} font-medium
          transition-colors duration-100 text-left relative group
          ${item.disabled
            ? "opacity-40 cursor-not-allowed text-gray-400 dark:text-gray-600"
            : active && !hasChildren
              ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
          }
        `}
        style={{ paddingLeft: !collapsed && depth > 0 ? indent + 10 : undefined }}
      >
        {item.icon && (
          <span
            className={`shrink-0 flex items-center justify-center transition-colors duration-100 ${active && !hasChildren ? "opacity-100" : "opacity-60 group-hover:opacity-100"}`}
            style={{ width: s.iconSize, height: s.iconSize }}
          >
            {item.icon}
          </span>
        )}

        {!collapsed && (
          <>
            <span className="flex-1 min-w-0 truncate">{item.label}</span>

            {item.badge !== undefined && (
              <span className={`shrink-0 ${s.badgeText} font-semibold px-1.5 py-0.5 rounded-full ${active && !hasChildren ? "bg-white/20 text-white dark:bg-black/20 dark:text-gray-900" : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"}`}>
                {item.badge}
              </span>
            )}

            {hasChildren && (
              <ChevronDown
                size={s.chevronSize}
                className={`shrink-0 text-gray-400 dark:text-gray-500 transition-transform duration-150 ${expanded ? "rotate-180" : ""}`}
              />
            )}
          </>
        )}

        {collapsed && item.badge !== undefined && (
          <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-gray-900 dark:bg-white" />
        )}
      </button>

      <AnimatePresence initial={false}>
        {hasChildren && expanded && !collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="overflow-hidden"
          >
            {item.children!.map((child) => (
              <SidebarRow
                key={child.id}
                item={child}
                depth={depth + 1}
                size={size}
                collapsed={collapsed}
                onClose={onClose}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

interface SidebarBodyProps {
  items: SidebarItem[];
  size: SidebarSize;
  collapsed: boolean;
  onClose?: () => void;
}

function SidebarBody({ items, size, collapsed, onClose }: SidebarBodyProps) {
  const s = sizeConfig[size];
  const { state } = useSidebarContext();
  const isSearching = state.searchValue.trim().length > 0;
  const filtered = isSearching ? flattenSearch(items, state.searchValue) : null;

  const renderList = (list: SidebarItem[], depth = 0) =>
    list.map((item, idx) => (
      <React.Fragment key={item.id}>
        {item.dividerBefore && idx > 0 && (
          <div className="my-1.5 border-t border-gray-100 dark:border-gray-800" />
        )}
        {item.header && !collapsed && (
          <div className={`${s.headerPx} pt-3 pb-1 ${s.headerText} font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 select-none`}>
            {item.header}
          </div>
        )}
        <SidebarRow
          item={item}
          depth={depth}
          size={size}
          collapsed={collapsed}
          onClose={onClose}
        />
      </React.Fragment>
    ));

  if (isSearching && !collapsed) {
    return (
      <div className={`flex flex-col ${s.gap}`}>
        {filtered!.length === 0 ? (
          <div className={`${s.px} ${s.py} ${s.labelText} text-gray-400 dark:text-gray-500 text-center py-6`}>
            No results
          </div>
        ) : (
          filtered!.map((item) => (
            <SidebarRow
              key={item.id}
              item={item}
              depth={0}
              size={size}
              collapsed={false}
              onClose={onClose}
            />
          ))
        )}
      </div>
    );
  }

  return <div className={`flex flex-col ${s.gap}`}>{renderList(items)}</div>;
}

export interface SidebarProps {
  items?: SidebarItem[];
  size?: SidebarSize;
  variant?: SidebarVariant;
  position?: SidebarPosition;
  sticky?: boolean;
  showSearch?: boolean;
  showToggle?: boolean;
  showHamburger?: boolean;
  title?: string;
  logo?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  topContent?: React.ReactNode;
  bottomContent?: React.ReactNode;
  className?: string;
  innerClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  mobileBreakpoint?: string;
  defaultMode?: SidebarState_Mode;
  persistToStorage?: boolean;
  enableKeyboardShortcut?: boolean;
  defaultActiveItem?: string | null;
  onActiveChange?: (id: string) => void;
  onModeChange?: (mode: SidebarState_Mode) => void;
}

function SidebarInner({
  items = [],
  size = "md",
  variant = "default",
  position = "left",
  sticky = true,
  showSearch = true,
  showToggle = true,
  showHamburger = true,
  title,
  logo,
  header,
  footer,
  topContent,
  bottomContent,
  className = "",
  innerClassName = "",
  headerClassName = "",
  bodyClassName = "",
  footerClassName = "",
}: Omit<SidebarProps, keyof SidebarProviderProps>) {
  const {
    state,
    isCollapsed,
    isHidden,
    cycleMode,
    expand,
    setSearch,
    toggleSearch,
    closeSearch,
    toggleMobile,
    closeMobile,
    searchInputRef,
  } = useSidebarContext();

  const s = sizeConfig[size];
  const collapsed = isCollapsed;

  const currentWidth = isHidden ? 0 : collapsed ? s.collapsedWidth : s.expandedWidth;

  const toggleIcon = isHidden
    ? <PanelLeftOpen size={s.toggleSize} />
    : collapsed
      ? <PanelLeft size={s.toggleSize} />
      : <PanelLeftClose size={s.toggleSize} />;

  const positionClass = position === "right"
    ? "border-r-0 border-l border-gray-200 dark:border-gray-800 right-0"
    : "";

  const SidebarContent = (
    <div
      className={`flex flex-col h-full overflow-hidden ${innerClassName}`}
    >
      <div className={`shrink-0 flex items-center justify-between ${s.headerPx} ${s.headerPy} border-b border-gray-100 dark:border-gray-800 ${headerClassName}`}>
        {!collapsed && (
          <div className="flex items-center gap-2 min-w-0">
            {logo && (
              <span className="shrink-0 flex items-center" style={{ width: s.iconSize + 2, height: s.iconSize + 2 }}>
                {logo}
              </span>
            )}
            {header ? (
              <div className="flex-1 min-w-0">{header}</div>
            ) : title ? (
              <span className={`${s.headerTitleText} font-bold text-gray-900 dark:text-white truncate`}>
                {title}
              </span>
            ) : null}
          </div>
        )}

        {collapsed && (
          <div className="flex-1 flex justify-center">
            {logo ? (
              <span className="flex items-center" style={{ width: s.iconSize + 2, height: s.iconSize + 2 }}>
                {logo}
              </span>
            ) : null}
          </div>
        )}

        {showToggle && (
          <button
            type="button"
            onClick={cycleMode}
            title="Toggle sidebar (Ctrl+B)"
            className={`shrink-0 flex items-center justify-center w-7 h-7 rounded-lg text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-100 ${collapsed ? "mx-auto" : ""}`}
          >
            {toggleIcon}
          </button>
        )}
      </div>

      {showSearch && !collapsed && (
        <div className={`shrink-0 ${s.searchPx} py-2 border-b border-gray-100 dark:border-gray-800`}>
          <div className={`flex items-center gap-2 ${s.searchHeight} px-2.5 rounded-lg bg-gray-100 dark:bg-gray-800`}>
            <Search size={s.iconSize - 3} className="shrink-0 text-gray-400 dark:text-gray-500" />
            <input
              ref={searchInputRef as React.RefObject<HTMLInputElement>}
              type="text"
              value={state.searchValue}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Escape") closeSearch(); }}
              placeholder="Search..."
              className={`flex-1 min-w-0 bg-transparent border-0 outline-none ring-0 ${s.searchText} text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600`}
            />
            {state.searchValue && (
              <button type="button" onClick={() => setSearch("")} className="shrink-0 text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 transition-colors">
                <X size={s.iconSize - 4} />
              </button>
            )}
          </div>
        </div>
      )}

      {showSearch && collapsed && (
        <div className={`shrink-0 flex justify-center py-2 border-b border-gray-100 dark:border-gray-800`}>
          <button
            type="button"
            onClick={() => { expand(); setTimeout(() => searchInputRef.current?.focus(), 120); }}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-100"
            title="Search"
          >
            <Search size={s.iconSize - 2} />
          </button>
        </div>
      )}

      {topContent && !collapsed && (
        <div className={`shrink-0 ${s.headerPx} py-2 border-b border-gray-100 dark:border-gray-800`}>
          {topContent}
        </div>
      )}

      <div className={`flex-1 overflow-y-auto overflow-x-hidden p-2 ${bodyClassName}`}>
        <SidebarBody items={items} size={size} collapsed={collapsed} />
      </div>

      {bottomContent && !collapsed && (
        <div className={`shrink-0 ${s.footerPx} py-2 border-t border-gray-100 dark:border-gray-800`}>
          {bottomContent}
        </div>
      )}

      {footer && (
        <div className={`shrink-0 ${s.footerPx} ${s.footerPy} border-t border-gray-100 dark:border-gray-800 ${footerClassName}`}>
          {!collapsed ? footer : null}
        </div>
      )}
    </div>
  );

  return (
    <>
      <motion.aside
        animate={{ width: currentWidth }}
        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
        className={`
          hidden md:flex flex-col shrink-0 overflow-hidden
          ${sticky ? "sticky top-0 h-screen" : "h-full"}
          ${variantStyles[variant]}
          ${positionClass}
          ${className}
        `}
        style={{ width: currentWidth }}
      >
        {SidebarContent}
      </motion.aside>

      {showHamburger && (
        <>
          <AnimatePresence>
            {state.mobileOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="md:hidden fixed inset-0 bg-black/30 dark:bg-black/50 z-40"
                onClick={closeMobile}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {state.mobileOpen && (
              <motion.aside
                initial={{ x: position === "right" ? "100%" : "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: position === "right" ? "100%" : "-100%" }}
                transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                className={`
                  md:hidden fixed top-0 bottom-0 z-50 flex flex-col
                  ${position === "right" ? "right-0" : "left-0"}
                  ${variantMobileOverlay[variant]}
                  border-r border-gray-200 dark:border-gray-800
                  shadow-xl shadow-black/10 dark:shadow-black/40
                `}
                style={{ width: s.expandedWidth }}
              >
                <div className="flex flex-col h-full">
                  <div className={`shrink-0 flex items-center justify-between ${s.headerPx} ${s.headerPy} border-b border-gray-100 dark:border-gray-800`}>
                    <div className="flex items-center gap-2 min-w-0">
                      {logo && (
                        <span className="shrink-0 flex items-center" style={{ width: s.iconSize + 2, height: s.iconSize + 2 }}>
                          {logo}
                        </span>
                      )}
                      {header ? (
                        <div className="flex-1 min-w-0">{header}</div>
                      ) : title ? (
                        <span className={`${s.headerTitleText} font-bold text-gray-900 dark:text-white truncate`}>
                          {title}
                        </span>
                      ) : null}
                    </div>
                    <button
                      type="button"
                      onClick={closeMobile}
                      className="shrink-0 flex items-center justify-center w-7 h-7 rounded-lg text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-100"
                    >
                      <X size={s.iconSize - 1} />
                    </button>
                  </div>

                  {showSearch && (
                    <div className={`shrink-0 ${s.searchPx} py-2 border-b border-gray-100 dark:border-gray-800`}>
                      <div className={`flex items-center gap-2 ${s.searchHeight} px-2.5 rounded-lg bg-gray-100 dark:bg-gray-800`}>
                        <Search size={s.iconSize - 3} className="shrink-0 text-gray-400 dark:text-gray-500" />
                        <input
                          type="text"
                          value={state.searchValue}
                          onChange={(e) => setSearch(e.target.value)}
                          placeholder="Search..."
                          className={`flex-1 min-w-0 bg-transparent border-0 outline-none ring-0 ${s.searchText} text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600`}
                        />
                        {state.searchValue && (
                          <button type="button" onClick={() => setSearch("")} className="shrink-0 text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 transition-colors">
                            <X size={s.iconSize - 4} />
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex-1 overflow-y-auto p-2">
                    <SidebarBody items={items} size={size} collapsed={false} onClose={closeMobile} />
                  </div>

                  {footer && (
                    <div className={`shrink-0 ${s.footerPx} ${s.footerPy} border-t border-gray-100 dark:border-gray-800`}>
                      {footer}
                    </div>
                  )}
                </div>
              </motion.aside>
            )}
          </AnimatePresence>
        </>
      )}
    </>
  );
}

export function Sidebar({
  defaultActiveItem = null,
  defaultMode = "expanded",
  size = "md",
  variant = "default",
  persistToStorage = true,
  enableKeyboardShortcut = true,
  onActiveChange,
  onModeChange,
  ...rest
}: SidebarProps) {
  return (
    <SidebarProvider
      defaultActiveItem={defaultActiveItem}
      defaultMode={defaultMode}
      size={size}
      variant={variant}
      persistToStorage={persistToStorage}
      enableKeyboardShortcut={enableKeyboardShortcut}
      onActiveChange={onActiveChange}
      onModeChange={onModeChange}
    >
      <SidebarInner size={size} variant={variant} {...rest} />
    </SidebarProvider>
  );
}

export { SidebarProvider, useSidebarContext };
export type { SidebarItem, SidebarSize, SidebarVariant, SidebarPosition, SidebarState_Mode };