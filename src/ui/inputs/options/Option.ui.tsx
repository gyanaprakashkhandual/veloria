import React, {
  useEffect,
  useRef,
  useLayoutEffect,
  useState,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, ChevronRight, X, Search, ChevronsUpDown } from "lucide-react";
import {
  OptionProvider,
  useOptionContext,
  type OptionProviderProps,
  type OptionItem,
  type OptionSize,
  type MenuPosition,
  type SelectionMode,
} from "./Option.conetxt";

const sizeConfig = {
  sm: {
    triggerHeight: "h-7",
    triggerPx: "px-2.5",
    triggerText: "text-xs",
    iconSize: 11,
    menuWidth: "w-48",
    itemPx: "px-2.5",
    itemPy: "py-1",
    itemText: "text-xs",
    itemIconSize: 12,
    checkSize: 11,
    searchPx: "px-2.5",
    searchPy: "py-1.5",
    headerText: "text-[10px]",
    badgeText: "text-[10px]",
    badgePx: "px-1.5",
    badgePy: "py-0",
    descText: "text-[10px]",
    chevronSize: 10,
    subIndent: "pl-5",
    subSubIndent: "pl-9",
  },
  md: {
    triggerHeight: "h-9",
    triggerPx: "px-3",
    triggerText: "text-sm",
    iconSize: 13,
    menuWidth: "w-56",
    itemPx: "px-3",
    itemPy: "py-1.5",
    itemText: "text-sm",
    itemIconSize: 14,
    checkSize: 13,
    searchPx: "px-3",
    searchPy: "py-2",
    headerText: "text-[10px]",
    badgeText: "text-xs",
    badgePx: "px-2",
    badgePy: "py-0.5",
    descText: "text-xs",
    chevronSize: 12,
    subIndent: "pl-6",
    subSubIndent: "pl-11",
  },
  lg: {
    triggerHeight: "h-10",
    triggerPx: "px-3.5",
    triggerText: "text-sm",
    iconSize: 14,
    menuWidth: "w-64",
    itemPx: "px-3.5",
    itemPy: "py-2",
    itemText: "text-sm",
    itemIconSize: 15,
    checkSize: 14,
    searchPx: "px-3.5",
    searchPy: "py-2.5",
    headerText: "text-[11px]",
    badgeText: "text-xs",
    badgePx: "px-2",
    badgePy: "py-0.5",
    descText: "text-xs",
    chevronSize: 13,
    subIndent: "pl-7",
    subSubIndent: "pl-12",
  },
  xl: {
    triggerHeight: "h-11",
    triggerPx: "px-4",
    triggerText: "text-base",
    iconSize: 16,
    menuWidth: "w-72",
    itemPx: "px-4",
    itemPy: "py-2.5",
    itemText: "text-sm",
    itemIconSize: 16,
    checkSize: 15,
    searchPx: "px-4",
    searchPy: "py-3",
    headerText: "text-xs",
    badgeText: "text-xs",
    badgePx: "px-2",
    badgePy: "py-0.5",
    descText: "text-xs",
    chevronSize: 14,
    subIndent: "pl-8",
    subSubIndent: "pl-14",
  },
};

type ResolvedPosition = "bottom-left" | "bottom-right" | "top-left" | "top-right";

function useAutoPosition(
  open: boolean,
  anchorRef: React.RefObject<HTMLDivElement | null>,
  preferred: MenuPosition,
  menuWidth: number = 224,
  menuHeight: number = 320,
): ResolvedPosition {
  const [pos, setPos] = useState<ResolvedPosition>("bottom-left");

  useLayoutEffect(() => {
    if (!open || !anchorRef.current) return;
    if (preferred !== "auto") {
      setPos(preferred as ResolvedPosition);
      return;
    }
    const rect = anchorRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const spaceRight = window.innerWidth - rect.left;
    const spaceLeft = rect.right;
    const vertical = spaceBelow >= menuHeight || spaceBelow >= spaceAbove ? "bottom" : "top";
    const horizontal = spaceRight >= menuWidth ? "left" : spaceLeft >= menuWidth ? "right" : "left";
    setPos(`${vertical}-${horizontal}` as ResolvedPosition);
  }, [open, anchorRef, preferred, menuWidth, menuHeight]);

  return pos;
}

function positionStyles(pos: ResolvedPosition): React.CSSProperties {
  const base: React.CSSProperties = { position: "absolute", zIndex: 50 };
  if (pos === "bottom-left") return { ...base, top: "100%", left: 0, marginTop: 6 };
  if (pos === "bottom-right") return { ...base, top: "100%", right: 0, marginTop: 6 };
  if (pos === "top-left") return { ...base, bottom: "100%", left: 0, marginBottom: 6 };
  return { ...base, bottom: "100%", right: 0, marginBottom: 6 };
}

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white rounded-[2px]">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

function flattenForSearch(items: OptionItem[], search: string): OptionItem[] {
  const q = search.toLowerCase();
  const result: OptionItem[] = [];
  const walk = (list: OptionItem[]) => {
    for (const item of list) {
      if (item.children?.length) {
        walk(item.children);
      } else if (!item.disabled) {
        if (item.label.toLowerCase().includes(q) || item.description?.toLowerCase().includes(q)) {
          result.push(item);
        }
      }
    }
  };
  walk(items);
  return result;
}

interface OptionRowProps {
  item: OptionItem;
  depth?: number;
  size: OptionSize;
  search: string;
}

function OptionRow({ item, depth = 0, size, search }: OptionRowProps) {
  const { toggleItem, toggleExpand, isSelected, isExpanded, state } = useOptionContext();
  const s = sizeConfig[size];
  const hasChildren = !!item.children?.length;
  const expanded = isExpanded(item.value);
  const selected = isSelected(item.value);
  const indentClass = depth === 1 ? s.subIndent : depth >= 2 ? s.subSubIndent : "";

  const handleClick = () => {
    if (item.disabled) return;
    if (hasChildren) {
      toggleExpand(item.value);
      return;
    }
    toggleItem(item.value);
  };

  return (
    <>
      <button
        type="button"
        disabled={item.disabled}
        onClick={handleClick}
        className={`
          w-full flex items-center gap-2 ${s.itemPx} ${s.itemPy} ${indentClass}
          ${s.itemText} font-medium rounded-md transition-all text-left
          ${item.disabled
            ? "opacity-40 cursor-not-allowed text-gray-400 dark:text-gray-600"
            : selected && !hasChildren
              ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          }
        `}
      >
        {item.icon && (
          <span className={`shrink-0 flex items-center justify-center ${selected && !hasChildren ? "opacity-100" : "opacity-60"}`}
            style={{ width: s.itemIconSize, height: s.itemIconSize }}>
            {item.icon}
          </span>
        )}

        <span className="flex-1 min-w-0">
          <span className="block truncate">
            {search && !hasChildren ? highlightMatch(item.label, search) : item.label}
          </span>
          {item.description && (
            <span className={`block truncate ${s.descText} ${selected && !hasChildren ? "opacity-70" : "text-gray-400 dark:text-gray-500"}`}>
              {item.description}
            </span>
          )}
        </span>

        {state.selectionMode === "multi" && !hasChildren && (
          <span className={`shrink-0 w-4 h-4 flex items-center justify-center rounded border transition-all ${
            selected
              ? "bg-white dark:bg-gray-900 border-white dark:border-gray-900"
              : "border-gray-300 dark:border-gray-600"
          }`}>
            {selected && <Check size={10} className="text-gray-900 dark:text-white" strokeWidth={3} />}
          </span>
        )}

        {state.selectionMode === "single" && !hasChildren && selected && (
          <Check size={s.checkSize} className="shrink-0 text-white dark:text-gray-900" strokeWidth={2.5} />
        )}

        {hasChildren && (
          <ChevronRight
            size={s.chevronSize}
            className={`shrink-0 text-gray-400 dark:text-gray-500 transition-transform duration-150 ${expanded ? "rotate-90" : ""}`}
          />
        )}
      </button>

      <AnimatePresence initial={false}>
        {hasChildren && expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="overflow-hidden"
          >
            {item.children!.map((child) => (
              <OptionRow key={child.value} item={child} depth={depth + 1} size={size} search={search} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

interface MenuBodyProps {
  items: OptionItem[];
  size: OptionSize;
  label?: string;
  maxHeight?: number;
}

function MenuBody({ items, size, label, maxHeight = 300 }: MenuBodyProps) {
  const { state, setSearch, clearSelection } = useOptionContext();
  const s = sizeConfig[size];
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.isOpen && state.showSearch) {
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  }, [state.isOpen, state.showSearch]);

  const isSearching = state.search.trim().length > 0;
  const filtered = isSearching ? flattenForSearch(items, state.search) : null;

  const renderItems = (list: OptionItem[], depth = 0) =>
    list.map((item, idx) => {
      const showDivider = item.dividerBefore && idx > 0;
      const showHeader = !!item.header;
      return (
        <React.Fragment key={item.value}>
          {showDivider && <div className="my-1 border-t border-gray-100 dark:border-gray-800" />}
          {showHeader && (
            <div className={`${s.itemPx} pt-2 pb-1 ${s.headerText} font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500`}>
              {item.header}
            </div>
          )}
          <OptionRow item={item} depth={depth} size={size} search={state.search} />
        </React.Fragment>
      );
    });

  return (
    <motion.div
      initial={{ opacity: 0, y: -6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.98 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className={`${s.menuWidth} bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg shadow-black/10 dark:shadow-black/40 overflow-hidden`}
      style={{ minWidth: "100%" }}
    >
      {state.showSearch && (
        <div className={`flex items-center gap-2 ${s.searchPx} ${s.searchPy} border-b border-gray-100 dark:border-gray-800`}>
          <Search size={s.iconSize - 1} className="shrink-0 text-gray-400 dark:text-gray-500" />
          <input
            ref={searchRef}
            type="text"
            value={state.search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className={`flex-1 bg-transparent border-0 outline-none ${s.itemText} text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600`}
          />
          {state.search && (
            <button type="button" onClick={() => setSearch("")} className="shrink-0 text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 transition-colors">
              <X size={s.iconSize - 2} />
            </button>
          )}
        </div>
      )}

      <div className="p-1 overflow-y-auto" style={{ maxHeight }}>
        {isSearching && filtered !== null ? (
          filtered.length === 0 ? (
            <div className={`${s.itemPx} ${s.itemPy} ${s.itemText} text-gray-400 dark:text-gray-500 text-center py-4`}>
              No results found
            </div>
          ) : (
            filtered.map((item) => (
              <OptionRow key={item.value} item={item} depth={0} size={size} search={state.search} />
            ))
          )
        ) : (
          renderItems(items)
        )}
      </div>

      {state.selectionMode === "multi" && state.selected.length > 0 && (
        <div className={`${s.searchPx} py-1.5 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between`}>
          <span className={`${s.descText} text-gray-400 dark:text-gray-500`}>
            {state.selected.length} selected
          </span>
          <button
            type="button"
            onClick={clearSelection}
            className={`${s.descText} text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors`}
          >
            Clear all
          </button>
        </div>
      )}
    </motion.div>
  );
}

export interface OptionMenuProps {
  items: OptionItem[];
  label?: string;
  triggerLabel?: string;
  size?: OptionSize;
  selectionMode?: SelectionMode;
  position?: MenuPosition;
  showSearch?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  maxSelections?: number | null;
  closeOnSelect?: boolean;
  defaultSelected?: string[];
  maxMenuHeight?: number;
  className?: string;
  triggerClassName?: string;
  onChange?: (selected: string[]) => void;
  onOpen?: () => void;
  onClose?: () => void;
}

function OptionMenuInner({
  items,
  label,
  triggerLabel,
  size = "md",
  maxMenuHeight = 300,
  className = "",
  triggerClassName = "",
}: {
  items: OptionItem[];
  label?: string;
  triggerLabel?: string;
  size: OptionSize;
  maxMenuHeight: number;
  className: string;
  triggerClassName: string;
}) {
  const { state, toggle, close, getSelectedLabels, clearSelection } = useOptionContext();
  const s = sizeConfig[size];
  const wrapRef = useRef<HTMLDivElement>(null);
  const pos = useAutoPosition(state.isOpen, wrapRef, state.position, 256, maxMenuHeight + 60);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) close();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [close]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [close]);

  const selectedLabels = getSelectedLabels(items);
  const hasSelection = state.selected.length > 0;

  const renderTriggerContent = () => {
    if (triggerLabel) return <span className="text-gray-900 dark:text-white truncate">{triggerLabel}</span>;
    if (!hasSelection) return <span className="text-gray-400 dark:text-gray-500 truncate">{state.placeholder}</span>;

    if (state.selectionMode === "single") {
      return <span className="text-gray-900 dark:text-white truncate">{selectedLabels[0]}</span>;
    }

    return (
      <span className="flex items-center gap-1 flex-wrap min-w-0">
        {selectedLabels.slice(0, 2).map((lbl, i) => (
          <span
            key={i}
            className={`inline-flex items-center gap-1 ${s.badgePx} ${s.badgePy} ${s.badgeText} font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md whitespace-nowrap`}
          >
            {lbl}
          </span>
        ))}
        {selectedLabels.length > 2 && (
          <span className={`${s.badgeText} text-gray-400 dark:text-gray-500 whitespace-nowrap`}>
            +{selectedLabels.length - 2}
          </span>
        )}
      </span>
    );
  };

  return (
    <div ref={wrapRef} className={`relative w-full ${className}`}>
      {label && (
        <label className={`block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider`}>
          {label}
        </label>
      )}

      <button
        type="button"
        disabled={state.disabled}
        onClick={toggle}
        className={`
          w-full ${s.triggerHeight} flex items-center gap-2 ${s.triggerPx} rounded-lg border ${s.triggerText} transition-all text-left
          bg-white dark:bg-gray-800
          ${state.disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${state.readOnly ? "cursor-default" : ""}
          ${state.isOpen
            ? "border-gray-400 dark:border-gray-500 ring-1 ring-gray-900 dark:ring-white"
            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
          }
          ${triggerClassName}
        `}
      >
        <span className="flex-1 min-w-0 flex items-center gap-1.5 overflow-hidden">
          {renderTriggerContent()}
        </span>

        <span className="shrink-0 flex items-center gap-1">
          {hasSelection && !state.disabled && !state.readOnly && (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => { e.stopPropagation(); clearSelection(); }}
              onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); clearSelection(); } }}
              className="text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 transition-colors cursor-pointer"
            >
              <X size={s.iconSize - 2} />
            </span>
          )}
          <ChevronsUpDown size={s.iconSize} className={`text-gray-400 dark:text-gray-500 transition-transform duration-150 ${state.isOpen ? "opacity-100" : "opacity-60"}`} />
        </span>
      </button>

      <AnimatePresence>
        {state.isOpen && (
          <div style={positionStyles(pos)}>
            <MenuBody items={items} size={size} label={label} maxHeight={maxMenuHeight} />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function OptionMenu({
  items,
  label,
  triggerLabel,
  size = "md",
  selectionMode = "single",
  position = "auto",
  showSearch = false,
  disabled = false,
  readOnly = false,
  placeholder = "Select an option",
  maxSelections = null,
  closeOnSelect = true,
  defaultSelected = [],
  maxMenuHeight = 300,
  className = "",
  triggerClassName = "",
  onChange,
  onOpen,
  onClose,
}: OptionMenuProps) {
  return (
    <OptionProvider
      defaultSelected={defaultSelected}
      size={size}
      selectionMode={selectionMode}
      position={position}
      showSearch={showSearch}
      disabled={disabled}
      readOnly={readOnly}
      placeholder={placeholder}
      maxSelections={maxSelections}
      closeOnSelect={closeOnSelect}
      onChange={onChange}
      onOpen={onOpen}
      onClose={onClose}
    >
      <OptionMenuInner
        items={items}
        label={label}
        triggerLabel={triggerLabel}
        size={size}
        maxMenuHeight={maxMenuHeight}
        className={className}
        triggerClassName={triggerClassName}
      />
    </OptionProvider>
  );
}

export { OptionProvider, useOptionContext };
export type { OptionItem, OptionSize, MenuPosition, SelectionMode };