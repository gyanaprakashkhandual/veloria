import React, {
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useId,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import {
  TabsProvider,
  useTabsContext,
  type TabsProviderProps,
  type TabsDef,
  type TabsSize,
  type TabsVariant,
  type TabsOrientation,
} from "./Tab.context";

// ─── Size Config ──────────────────────────────────────────────────────────────

const sizeConfig = {
  sm: {
    tabPx: "px-2.5",
    tabPy: "py-1",
    tabText: "text-xs",
    iconSize: 12,
    badgeSize: "w-3.5 h-3.5 text-[8px]",
    closeBtnSize: 12,
    closeBtnDim: "w-3.5 h-3.5",
    gap: "gap-0.5",
    listPadding: "p-0.5",
    panelPt: "pt-3",
    underlineH: "h-0.5",
    indicatorRounded: "rounded-sm",
  },
  md: {
    tabPx: "px-3",
    tabPy: "py-1.5",
    tabText: "text-sm",
    iconSize: 14,
    badgeSize: "w-4 h-4 text-[9px]",
    closeBtnSize: 13,
    closeBtnDim: "w-4 h-4",
    gap: "gap-0.5",
    listPadding: "p-1",
    panelPt: "pt-4",
    underlineH: "h-0.5",
    indicatorRounded: "rounded-sm",
  },
  lg: {
    tabPx: "px-4",
    tabPy: "py-2",
    tabText: "text-sm",
    iconSize: 15,
    badgeSize: "w-4 h-4 text-[9px]",
    closeBtnSize: 14,
    closeBtnDim: "w-4 h-4",
    gap: "gap-1",
    listPadding: "p-1",
    panelPt: "pt-5",
    underlineH: "h-[3px]",
    indicatorRounded: "rounded",
  },
  xl: {
    tabPx: "px-5",
    tabPy: "py-2.5",
    tabText: "text-base",
    iconSize: 16,
    badgeSize: "w-5 h-5 text-[10px]",
    closeBtnSize: 14,
    closeBtnDim: "w-5 h-5",
    gap: "gap-1",
    listPadding: "p-1",
    panelPt: "pt-6",
    underlineH: "h-[3px]",
    indicatorRounded: "rounded",
  },
};

// ─── Variant config ───────────────────────────────────────────────────────────

type VariantStyles = {
  list: string;
  tab: (active: boolean, disabled: boolean) => string;
  indicator: string;
  showIndicator: boolean;
  useIndicatorBar: boolean; // sliding underline vs pill
};

const variantConfig: Record<TabsVariant, VariantStyles> = {
  underline: {
    list: "border-b border-gray-200 dark:border-gray-700",
    tab: (active, disabled) =>
      disabled
        ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
        : active
          ? "text-gray-900 dark:text-gray-100"
          : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200",
    indicator: "bg-gray-900 dark:bg-gray-100 bottom-0",
    showIndicator: true,
    useIndicatorBar: true,
  },
  pill: {
    list: "bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl",
    tab: (active, disabled) =>
      disabled
        ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
        : active
          ? "text-gray-900 dark:text-gray-100"
          : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50",
    indicator: "bg-white dark:bg-gray-900 shadow-sm shadow-black/10 dark:shadow-black/30",
    showIndicator: true,
    useIndicatorBar: false,
  },
  card: {
    list: "border-b border-gray-200 dark:border-gray-700",
    tab: (active, disabled) =>
      disabled
        ? "text-gray-300 dark:text-gray-600 cursor-not-allowed border border-transparent"
        : active
          ? "text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 border-b-white dark:border-b-gray-900 -mb-px shadow-sm shadow-black/5"
          : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 border border-transparent",
    indicator: "",
    showIndicator: false,
    useIndicatorBar: false,
  },
  filled: {
    list: "bg-gray-100 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl",
    tab: (active, disabled) =>
      disabled
        ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
        : active
          ? "text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm shadow-black/5"
          : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 border border-transparent",
    indicator: "",
    showIndicator: false,
    useIndicatorBar: false,
  },
};

// ─── Tooltip ──────────────────────────────────────────────────────────────────

function Tooltip({
  label,
  children,
  orientation,
}: {
  label: string;
  children: React.ReactNode;
  orientation: TabsOrientation;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
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
              ${orientation === "horizontal" ? "top-full mt-2 left-1/2 -translate-x-1/2" : "left-full ml-2 top-1/2 -translate-y-1/2"}
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

function Badge({
  value,
  sizeKey,
}: {
  value: number | boolean;
  sizeKey: TabsSize;
}) {
  const s = sizeConfig[sizeKey];
  const isNum = typeof value === "number" && value > 0;

  return (
    <span
      className={`
        inline-flex items-center justify-center shrink-0
        rounded-full bg-blue-500 text-white font-bold leading-none
        ${s.badgeSize}
      `}
    >
      {isNum ? (value > 99 ? "99+" : value) : ""}
    </span>
  );
}

// ─── Animated Indicator ───────────────────────────────────────────────────────

interface IndicatorProps {
  activeId: string;
  listRef: React.RefObject<HTMLDivElement | null>;
  variant: TabsVariant;
  size: TabsSize;
  orientation: TabsOrientation;
}

function Indicator({ activeId, listRef, variant, size, orientation }: IndicatorProps) {
  const vc = variantConfig[variant];
  const s = sizeConfig[size];
  const [rect, setRect] = useState<{ left: number; top: number; width: number; height: number } | null>(null);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const el = list.querySelector<HTMLElement>(`[data-tabid="${activeId}"]`);
    if (!el) return;
    const listRect = list.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    setRect({
      left: elRect.left - listRect.left,
      top: elRect.top - listRect.top,
      width: elRect.width,
      height: elRect.height,
    });
  }, [activeId, listRef]);

  if (!rect || !vc.showIndicator) return null;

  if (vc.useIndicatorBar) {
    // Underline variant – thin bar along the bottom (horizontal) or left (vertical)
    if (orientation === "horizontal") {
      return (
        <motion.div
          layout
          layoutId="tab-indicator-bar"
          animate={{ left: rect.left, width: rect.width }}
          transition={{ type: "spring", stiffness: 400, damping: 35 }}
          className={`absolute ${s.underlineH} ${s.indicatorRounded} ${vc.indicator}`}
          style={{ bottom: 0, left: rect.left, width: rect.width }}
        />
      );
    } else {
      return (
        <motion.div
          layout
          layoutId="tab-indicator-bar-v"
          animate={{ top: rect.top, height: rect.height }}
          transition={{ type: "spring", stiffness: 400, damping: 35 }}
          className={`absolute w-0.5 ${s.indicatorRounded} bg-gray-900 dark:bg-gray-100 left-0`}
          style={{ top: rect.top, height: rect.height }}
        />
      );
    }
  }

  // Pill / filled variant – full background pill
  return (
    <motion.div
      layout
      layoutId="tab-indicator-pill"
      animate={{ left: rect.left, top: rect.top, width: rect.width, height: rect.height }}
      transition={{ type: "spring", stiffness: 400, damping: 35 }}
      className={`absolute rounded-lg pointer-events-none ${vc.indicator}`}
      style={{ left: rect.left, top: rect.top, width: rect.width, height: rect.height }}
    />
  );
}

// ─── Single Tab Button ────────────────────────────────────────────────────────

interface TabButtonProps {
  tab: TabsDef;
  className?: string;
}

function TabButton({ tab, className = "" }: TabButtonProps) {
  const { state, setActive, closeTab, isActive } = useTabsContext();
  const s = sizeConfig[state.size];
  const vc = variantConfig[state.variant];
  const active = isActive(tab.id);
  const disabled = state.disabled || !!tab.disabled;

  const handleClick = useCallback(() => {
    if (disabled) return;
    setActive(tab.id);
  }, [disabled, tab.id, setActive]);

  const handleClose = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      closeTab(tab.id);
    },
    [tab.id, closeTab],
  );

  const baseBtn = (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      aria-disabled={disabled}
      data-tabid={tab.id}
      disabled={disabled}
      onClick={handleClick}
      className={`
        relative z-10 inline-flex items-center gap-1.5 shrink-0
        font-medium transition-colors duration-100
        focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400
        focus-visible:ring-offset-1
        select-none
        ${s.tabPx} ${s.tabPy} ${s.tabText}
        ${state.variant === "card" || state.variant === "filled" ? "rounded-lg" : "rounded-md"}
        ${vc.tab(active, disabled)}
        ${className}
      `}
    >
      {tab.icon && (
        <span
          className="shrink-0 flex items-center justify-center"
          style={{ width: s.iconSize, height: s.iconSize }}
        >
          {tab.icon}
        </span>
      )}

      <span className="truncate max-w-[160px]">{tab.label}</span>

      {tab.badge !== undefined && tab.badge !== false && (
        <Badge value={tab.badge} sizeKey={state.size} />
      )}

      {tab.closeable && !disabled && (
        <button
          type="button"
          onClick={handleClose}
          aria-label={`Close ${tab.label}`}
          className={`
            ${s.closeBtnDim} shrink-0 flex items-center justify-center
            rounded-md text-gray-400 dark:text-gray-500
            hover:bg-gray-200 dark:hover:bg-gray-700
            hover:text-gray-600 dark:hover:text-gray-300
            transition-colors duration-100
            -mr-0.5
          `}
        >
          <X size={s.closeBtnSize} />
        </button>
      )}
    </button>
  );

  if (tab.tooltip) {
    return (
      <Tooltip label={tab.tooltip} orientation={state.orientation}>
        {baseBtn}
      </Tooltip>
    );
  }

  return baseBtn;
}

// ─── Tab List ─────────────────────────────────────────────────────────────────

interface TabListProps {
  tabs: TabsDef[];
  className?: string;
}

function TabList({ tabs, className = "" }: TabListProps) {
  const { state, listRef, isActive, isClosed } = useTabsContext();
  const s = sizeConfig[state.size];
  const vc = variantConfig[state.variant];
  const isHorizontal = state.orientation === "horizontal";

  const visibleTabs = tabs.filter((t) => !isClosed(t.id));

  return (
    <div
      className={`
        relative
        ${isHorizontal
          ? "overflow-x-auto overflow-y-hidden scrollbar-none"
          : "overflow-y-auto overflow-x-hidden scrollbar-none"
        }
      `}
    >
      <div
        ref={listRef}
        role="tablist"
        aria-orientation={state.orientation}
        className={`
          relative flex
          ${isHorizontal ? `flex-row ${s.gap} w-max min-w-full` : `flex-col ${s.gap}`}
          ${["pill", "filled"].includes(state.variant) ? s.listPadding : ""}
          ${vc.list}
          ${className}
        `}
      >
        {/* Animated indicator rendered behind tabs */}
        {vc.showIndicator && (
          <Indicator
            activeId={state.activeId}
            listRef={listRef}
            variant={state.variant}
            size={state.size}
            orientation={state.orientation}
          />
        )}

        {visibleTabs.map((tab) => (
          <TabButton key={tab.id} tab={tab} />
        ))}
      </div>
    </div>
  );
}

// ─── Tab Panel ────────────────────────────────────────────────────────────────

export interface TabPanelDef {
  id: string;
  content: React.ReactNode;
  /** Force mount in DOM even when inactive (default: false = lazy) */
  keepMounted?: boolean;
}

interface TabPanelProps {
  panel: TabPanelDef;
  className?: string;
}

const panelMotion = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 6 },
  transition: { duration: 0.15, ease: "easeOut" },
};

function TabPanel({ panel, className = "" }: TabPanelProps) {
  const { state, isActive, isClosed } = useTabsContext();
  const s = sizeConfig[state.size];
  const active = isActive(panel.id);
  const closed = isClosed(panel.id);
  const isHorizontal = state.orientation === "horizontal";

  if (closed) return null;

  if (!active && !panel.keepMounted) return null;

  return (
    <div
      role="tabpanel"
      id={`tabpanel-${panel.id}`}
      aria-labelledby={`tab-${panel.id}`}
      hidden={!active}
      className={`
        ${isHorizontal ? s.panelPt : "pl-5"}
        ${className}
      `}
    >
      <AnimatePresence mode="wait">
        {active && (
          <motion.div key={panel.id} {...panelMotion}>
            {panel.content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Closed Tabs Restore Bar ──────────────────────────────────────────────────

interface RestoreBarProps {
  tabs: TabsDef[];
  className?: string;
}

function RestoreBar({ tabs, className = "" }: RestoreBarProps) {
  const { state, isClosed, reopenTab } = useTabsContext();
  const s = sizeConfig[state.size];
  const closedTabs = tabs.filter((t) => isClosed(t.id));

  if (closedTabs.length === 0) return null;

  return (
    <div
      className={`
        flex flex-wrap items-center gap-1.5
        ${s.tabText} text-gray-500 dark:text-gray-400
        ${className}
      `}
    >
      <span className="text-gray-400 dark:text-gray-500 font-medium">Closed:</span>
      {closedTabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => reopenTab(tab.id)}
          className={`
            inline-flex items-center gap-1 ${s.tabPx} py-0.5
            rounded-md border border-dashed border-gray-300 dark:border-gray-600
            text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200
            hover:border-gray-400 dark:hover:border-gray-500
            transition-colors duration-100 ${s.tabText}
          `}
        >
          {tab.icon && (
            <span style={{ width: s.iconSize - 2, height: s.iconSize - 2 }} className="flex items-center">
              {tab.icon}
            </span>
          )}
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// ─── Root Tabs Component ──────────────────────────────────────────────────────

export interface TabsProps extends Omit<TabsProviderProps, "children"> {
  tabs: TabsDef[];
  panels?: TabPanelDef[];
  /** Show a restore bar when tabs are closed */
  showRestoreBar?: boolean;
  /** Extra classes on the root wrapper */
  className?: string;
  /** Extra classes on the tab list */
  listClassName?: string;
  /** Extra classes on the panels wrapper */
  panelsClassName?: string;
  /** Extra classes on each panel */
  panelClassName?: string;
  /** Extra classes on the restore bar */
  restoreBarClassName?: string;
}

export function Tabs({
  tabs,
  panels,
  showRestoreBar = false,
  className = "",
  listClassName = "",
  panelsClassName = "",
  panelClassName = "",
  restoreBarClassName = "",
  defaultActiveId,
  size = "md",
  variant = "underline",
  orientation = "horizontal",
  disabled = false,
  onTabChange,
  onTabClose,
}: TabsProps) {
  const isHorizontal = orientation === "horizontal";

  return (
    <TabsProvider
      defaultActiveId={defaultActiveId}
      size={size}
      variant={variant}
      orientation={orientation}
      disabled={disabled}
      onTabChange={onTabChange}
      onTabClose={onTabClose}
    >
      <div
        className={`
          flex
          ${isHorizontal ? "flex-col" : "flex-row gap-4"}
          ${className}
        `}
      >
        {/* Tab List */}
        <TabList tabs={tabs} className={listClassName} />

        {/* Panels */}
        {panels && panels.length > 0 && (
          <div className={`flex-1 min-w-0 ${panelsClassName}`}>
            {panels.map((panel) => (
              <TabPanel
                key={panel.id}
                panel={panel}
                className={panelClassName}
              />
            ))}
          </div>
        )}

        {/* Restore bar for closed tabs */}
        {showRestoreBar && (
          <RestoreBar tabs={tabs} className={restoreBarClassName} />
        )}
      </div>
    </TabsProvider>
  );
}

// ─── Controlled Tabs (external activeId) ─────────────────────────────────────

export interface ControlledTabsProps extends TabsProps {
  activeId: string;
}

/**
 * Fully controlled variant — manage activeId externally.
 * Pass `activeId` + `onTabChange` to control which tab is selected.
 */
export function ControlledTabs({ activeId, onTabChange, ...rest }: ControlledTabsProps) {
  // Sync external activeId into provider via key reset on change
  return (
    <Tabs
      {...rest}
      defaultActiveId={activeId}
      onTabChange={onTabChange}
      key={activeId}
    />
  );
}

// ─── Re-exports ───────────────────────────────────────────────────────────────

export { TabsProvider, useTabsContext };
export type { TabsDef, TabsSize, TabsVariant, TabsOrientation };