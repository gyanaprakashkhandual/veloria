import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useCallback,
  useState,
  useMemo,
  useId,
} from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, X, Search, Loader2, ChevronsUpDown } from "lucide-react";
import {
  DropdownProvider,
  useDropdownContext,
  type DropdownProviderProps,
  type DropdownOption,
  type DropdownSize,
  type DropdownMode,
  type DropdownAlign,
} from "./Dropdown.context";

// ─── Size Config ──────────────────────────────────────────────────────────────

const sizeConfig = {
  sm: {
    triggerPx:    "px-2.5",
    triggerPy:    "py-1",
    triggerText:  "text-xs",
    triggerH:     "h-7",
    chevronSize:  13,
    clearSize:    11,
    panelWidth:   "min-w-[176px]",
    optionPx:     "px-2",
    optionPy:     "py-1",
    optionText:   "text-xs",
    iconSize:     13,
    checkSize:    11,
    badgeText:    "text-[9px]",
    badgePx:      "px-1",
    groupText:    "text-[10px]",
    groupPx:      "px-2",
    groupPy:      "pt-2 pb-0.5",
    searchPx:     "px-2",
    searchPy:     "py-1.5",
    searchText:   "text-xs",
    searchIcon:   12,
    tagPx:        "px-1.5",
    tagPy:        "py-0",
    tagText:      "text-[10px]",
    tagClose:     9,
    maxH:         "max-h-52",
    descText:     "text-[10px]",
    gap:          "gap-1.5",
  },
  md: {
    triggerPx:    "px-3",
    triggerPy:    "py-1.5",
    triggerText:  "text-sm",
    triggerH:     "h-9",
    chevronSize:  15,
    clearSize:    13,
    panelWidth:   "min-w-[220px]",
    optionPx:     "px-2.5",
    optionPy:     "py-1.5",
    optionText:   "text-sm",
    iconSize:     15,
    checkSize:    13,
    badgeText:    "text-[10px]",
    badgePx:      "px-1.5",
    groupText:    "text-[10px]",
    groupPx:      "px-2.5",
    groupPy:      "pt-2.5 pb-1",
    searchPx:     "px-2.5",
    searchPy:     "py-2",
    searchText:   "text-sm",
    searchIcon:   14,
    tagPx:        "px-2",
    tagPy:        "py-0.5",
    tagText:      "text-xs",
    tagClose:     10,
    maxH:         "max-h-64",
    descText:     "text-xs",
    gap:          "gap-2",
  },
  lg: {
    triggerPx:    "px-3.5",
    triggerPy:    "py-2",
    triggerText:  "text-sm",
    triggerH:     "h-10",
    chevronSize:  16,
    clearSize:    14,
    panelWidth:   "min-w-[256px]",
    optionPx:     "px-3",
    optionPy:     "py-2",
    optionText:   "text-sm",
    iconSize:     16,
    checkSize:    14,
    badgeText:    "text-xs",
    badgePx:      "px-1.5",
    groupText:    "text-[11px]",
    groupPx:      "px-3",
    groupPy:      "pt-3 pb-1",
    searchPx:     "px-3",
    searchPy:     "py-2",
    searchText:   "text-sm",
    searchIcon:   15,
    tagPx:        "px-2",
    tagPy:        "py-0.5",
    tagText:      "text-xs",
    tagClose:     11,
    maxH:         "max-h-72",
    descText:     "text-xs",
    gap:          "gap-2",
  },
  xl: {
    triggerPx:    "px-4",
    triggerPy:    "py-2.5",
    triggerText:  "text-base",
    triggerH:     "h-11",
    chevronSize:  17,
    clearSize:    14,
    panelWidth:   "min-w-[288px]",
    optionPx:     "px-3.5",
    optionPy:     "py-2.5",
    optionText:   "text-sm",
    iconSize:     17,
    checkSize:    15,
    badgeText:    "text-xs",
    badgePx:      "px-2",
    groupText:    "text-xs",
    groupPx:      "px-3.5",
    groupPy:      "pt-3 pb-1",
    searchPx:     "px-3.5",
    searchPy:     "py-2.5",
    searchText:   "text-sm",
    searchIcon:   16,
    tagPx:        "px-2",
    tagPy:        "py-0.5",
    tagText:      "text-xs",
    tagClose:     11,
    maxH:         "max-h-80",
    descText:     "text-sm",
    gap:          "gap-2",
  },
};

// ─── Auto Position Hook ───────────────────────────────────────────────────────

interface PanelPosition {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  minWidth: number;
  transformOrigin: string;
}

function useAutoPosition(
  open: boolean,
  triggerRef: React.RefObject<HTMLElement | null>,
  panelRef: React.RefObject<HTMLElement | null>,
  preferred: DropdownAlign,
): PanelPosition {
  const [pos, setPos] = useState<PanelPosition>({
    top: 0, left: 0, minWidth: 0, transformOrigin: "top left",
  });

  const calculate = useCallback(() => {
    if (!open || !triggerRef.current) return;
    const trigger  = triggerRef.current.getBoundingClientRect();
    const panelH   = panelRef.current?.offsetHeight ?? 300;
    const panelW   = panelRef.current?.offsetWidth  ?? 220;
    const vw       = window.innerWidth;
    const vh       = window.innerHeight;
    const GAP      = 6;

    let resolvedAlign = preferred;

    if (preferred === "auto") {
      const spaceBelow = vh - trigger.bottom - GAP;
      const spaceAbove = trigger.top - GAP;
      const spaceRight = vw - trigger.left;
      const vert  = spaceBelow >= panelH || spaceBelow >= spaceAbove ? "bottom" : "top";
      const horiz = spaceRight >= panelW ? "left" : "right";
      resolvedAlign = `${vert}-${horiz}` as DropdownAlign;
    }

    const result: PanelPosition = { minWidth: trigger.width, transformOrigin: "top left" };

    // Vertical
    if (resolvedAlign.startsWith("bottom")) {
      result.top = trigger.bottom + GAP + window.scrollY;
      result.transformOrigin = "top";
    } else {
      result.bottom = vh - trigger.top + GAP - window.scrollY;
      result.transformOrigin = "bottom";
    }

    // Horizontal
    if (resolvedAlign.endsWith("left")) {
      result.left = trigger.left + window.scrollX;
      result.transformOrigin += " left";
    } else {
      result.right = vw - trigger.right - window.scrollX;
      result.transformOrigin += " right";
    }

    setPos(result);
  }, [open, triggerRef, panelRef, preferred]);

  useLayoutEffect(() => { calculate(); }, [calculate]);

  useEffect(() => {
    if (!open) return;
    window.addEventListener("scroll",  calculate, true);
    window.addEventListener("resize",  calculate);
    return () => {
      window.removeEventListener("scroll", calculate, true);
      window.removeEventListener("resize", calculate);
    };
  }, [open, calculate]);

  return pos;
}

// ─── Menu animation ───────────────────────────────────────────────────────────

const menuMotion = {
  initial:    { opacity: 0, scale: 0.97, y: -4 },
  animate:    { opacity: 1, scale: 1,    y: 0  },
  exit:       { opacity: 0, scale: 0.97, y: -4 },
  transition: { duration: 0.13, ease: "easeOut" },
};

// ─── Multi-select Tag ─────────────────────────────────────────────────────────

function Tag({
  label,
  onRemove,
  size,
}: {
  label: string;
  onRemove: () => void;
  size: DropdownSize;
}) {
  const s = sizeConfig[size];
  return (
    <span
      className={`
        inline-flex items-center ${s.gap} ${s.tagPx} ${s.tagPy} ${s.tagText}
        rounded-md font-medium
        bg-gray-100 dark:bg-gray-800
        text-gray-700 dark:text-gray-300
        border border-gray-200 dark:border-gray-700
        leading-none
      `}
    >
      <span className="max-w-[80px] truncate">{label}</span>
      <button
        type="button"
        onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); onRemove(); }}
        className="flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
      >
        <X size={s.tagClose} />
      </button>
    </span>
  );
}

// ─── Option Row ───────────────────────────────────────────────────────────────

interface OptionRowProps {
  option: DropdownOption;
  isFocused: boolean;
  onMouseEnter: () => void;
  onClick: () => void;
}

function OptionRow({ option, isFocused, onMouseEnter, onClick }: OptionRowProps) {
  const { state, isSelected } = useDropdownContext();
  const s       = sizeConfig[state.size];
  const selected = isSelected(option.value);
  const ref = useRef<HTMLDivElement>(null);

  // Scroll focused item into view
  useEffect(() => {
    if (isFocused && ref.current) {
      ref.current.scrollIntoView({ block: "nearest" });
    }
  }, [isFocused]);

  return (
    <div
      ref={ref}
      role="option"
      aria-selected={selected}
      aria-disabled={option.disabled}
      onMouseEnter={onMouseEnter}
      onMouseDown={(e) => e.preventDefault()}
      onClick={option.disabled ? undefined : onClick}
      className={`
        flex items-start ${s.gap} ${s.optionPx} ${s.optionPy}
        rounded-lg cursor-pointer
        transition-colors duration-100
        ${option.disabled
          ? "opacity-40 cursor-not-allowed text-gray-400 dark:text-gray-600"
          : isFocused || selected
            ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60"
        }
      `}
    >
      {/* Leading icon */}
      {option.icon && (
        <span
          className="shrink-0 flex items-center justify-center mt-0.5 text-gray-400 dark:text-gray-500"
          style={{ width: s.iconSize, height: s.iconSize }}
        >
          {option.icon}
        </span>
      )}

      {/* Label + description */}
      <span className="flex-1 min-w-0">
        <span className={`block truncate ${s.optionText} font-medium`}>
          {option.label}
        </span>
        {option.description && (
          <span className={`block truncate ${s.descText} text-gray-400 dark:text-gray-500 font-normal mt-0.5`}>
            {option.description}
          </span>
        )}
      </span>

      {/* Badge */}
      {option.badge !== undefined && option.badge !== false && (
        <span
          className={`
            shrink-0 ${s.badgePx} py-0.5 ${s.badgeText}
            rounded-full font-semibold
            bg-gray-100 dark:bg-gray-700
            text-gray-500 dark:text-gray-400
          `}
        >
          {typeof option.badge === "number" ? option.badge : ""}
        </span>
      )}

      {/* Checkmark */}
      <span
        className={`
          shrink-0 flex items-center justify-center
          transition-opacity duration-100
          ${selected
            ? "opacity-100 text-gray-700 dark:text-gray-200"
            : "opacity-0"
          }
        `}
        style={{ width: s.checkSize, height: s.checkSize }}
      >
        <Check size={s.checkSize} strokeWidth={2.5} />
      </span>
    </div>
  );
}

// ─── Panel (portal) ───────────────────────────────────────────────────────────

interface DropdownPanelProps {
  options: DropdownOption[];
  searchable: boolean;
  searchPlaceholder: string;
  emptyLabel: string;
  className?: string;
}

function DropdownPanel({
  options,
  searchable,
  searchPlaceholder,
  emptyLabel,
  className = "",
}: DropdownPanelProps) {
  const {
    state, close, toggleOption,
    setSearch, setFocused,
    triggerRef, panelRef,
    isSelected,
  } = useDropdownContext();

  const { isOpen, search, focusedIndex, size, align, loading } = state;
  const s = sizeConfig[size];

  const searchRef = useRef<HTMLInputElement>(null);

  // Auto-position
  const pos = useAutoPosition(isOpen, triggerRef, panelRef, align);

  // Filter + group options
  const filtered = useMemo(() => {
    if (!search.trim()) return options;
    const q = search.toLowerCase();
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        o.description?.toLowerCase().includes(q) ||
        o.value.toLowerCase().includes(q),
    );
  }, [options, search]);

  const groups = useMemo(() => {
    const map = new Map<string, DropdownOption[]>();
    for (const opt of filtered) {
      const g = opt.group ?? "__ungrouped__";
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(opt);
    }
    return map;
  }, [filtered]);

  // Focus first item when opening
  useEffect(() => {
    if (isOpen) {
      if (searchable) setTimeout(() => searchRef.current?.focus(), 10);
      setFocused(0);
    }
  }, [isOpen, searchable, setFocused]);

  // Click outside
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      const t = e.target as Node;
      if (
        panelRef.current   && panelRef.current.contains(t)   ||
        triggerRef.current && triggerRef.current.contains(t)
      ) return;
      close();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, close, panelRef, triggerRef]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") { close(); return; }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocused(Math.min(focusedIndex + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocused(Math.max(focusedIndex - 1, 0));
      } else if (e.key === "Home") {
        e.preventDefault();
        setFocused(0);
      } else if (e.key === "End") {
        e.preventDefault();
        setFocused(filtered.length - 1);
      } else if (e.key === "Enter" || e.key === " ") {
        const opt = filtered[focusedIndex];
        if (opt && !opt.disabled) { e.preventDefault(); toggleOption(opt.value); }
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, close, focusedIndex, filtered, toggleOption, setFocused]);

  // Flat index for focus tracking
  const flatOptions = filtered;
  let globalIdx = 0;

  const panel = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={panelRef}
          {...menuMotion}
          style={{
            position:        "absolute",
            zIndex:          9999,
            top:             pos.top,
            bottom:          pos.bottom,
            left:            pos.left,
            right:           pos.right,
            minWidth:        pos.minWidth,
            transformOrigin: pos.transformOrigin,
          }}
          className={`
            ${s.panelWidth}
            bg-white dark:bg-gray-900
            border border-gray-200 dark:border-gray-700
            rounded-xl
            shadow-lg shadow-black/10 dark:shadow-black/40
            overflow-hidden
            ${className}
          `}
          role="listbox"
          aria-multiselectable={state.mode === "multi"}
        >
          {/* Search input */}
          {searchable && (
            <div className={`${s.searchPx} ${s.searchPy} border-b border-gray-100 dark:border-gray-800`}>
              <div className="flex items-center gap-2 px-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <Search size={s.searchIcon} className="text-gray-400 dark:text-gray-500 shrink-0" />
                <input
                  ref={searchRef}
                  type="text"
                  value={state.search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={searchPlaceholder}
                  className={`
                    flex-1 bg-transparent outline-none
                    ${s.searchText} text-gray-700 dark:text-gray-300
                    placeholder:text-gray-400 dark:placeholder:text-gray-500
                    py-1.5
                  `}
                />
                {state.search && (
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setSearch("")}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                  >
                    <X size={s.searchIcon} />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Options list */}
          <div className={`${s.maxH} overflow-y-auto overscroll-contain p-1`}>
            {loading ? (
              <div className={`flex items-center justify-center gap-2 ${s.optionPy} ${s.optionText} text-gray-400 dark:text-gray-500`}>
                <Loader2 size={s.iconSize} className="animate-spin" />
                <span>Loading…</span>
              </div>
            ) : flatOptions.length === 0 ? (
              <div className={`text-center ${s.optionPy} ${s.optionText} text-gray-400 dark:text-gray-500`}>
                {emptyLabel}
              </div>
            ) : (
              Array.from(groups.entries()).map(([group, opts], gIdx) => (
                <React.Fragment key={group}>
                  {group !== "__ungrouped__" && (
                    <div
                      className={`
                        ${s.groupPx} ${s.groupPy}
                        ${s.groupText} font-semibold uppercase tracking-wider
                        text-gray-400 dark:text-gray-500
                        select-none
                        ${gIdx > 0 ? "mt-1 border-t border-gray-100 dark:border-gray-800" : ""}
                      `}
                    >
                      {group}
                    </div>
                  )}
                  {opts.map((opt) => {
                    const idx = flatOptions.indexOf(opt);
                    return (
                      <OptionRow
                        key={opt.value}
                        option={opt}
                        isFocused={idx === focusedIndex}
                        onMouseEnter={() => setFocused(idx)}
                        onClick={() => toggleOption(opt.value)}
                      />
                    );
                  })}
                </React.Fragment>
              ))
            )}
          </div>

          {/* Multi-select footer with count + clear all */}
          {state.mode === "multi" && state.selected.size > 0 && (
            <div className={`
              flex items-center justify-between
              ${s.searchPx} ${s.searchPy}
              border-t border-gray-100 dark:border-gray-800
              bg-gray-50/80 dark:bg-gray-900/80
            `}>
              <span className={`${s.groupText} text-gray-500 dark:text-gray-400`}>
                {state.selected.size} selected
              </span>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => { close(); }}
                className={`
                  ${s.groupText} font-semibold
                  text-gray-700 dark:text-gray-300
                  hover:text-gray-900 dark:hover:text-gray-100
                  transition-colors duration-100
                `}
              >
                Done
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(panel, document.body);
}

// ─── Trigger ──────────────────────────────────────────────────────────────────

interface DropdownTriggerProps {
  options: DropdownOption[];
  placeholder: string;
  clearable: boolean;
  triggerClassName?: string;
}

function DropdownTrigger({
  options,
  placeholder,
  clearable,
  triggerClassName = "",
}: DropdownTriggerProps) {
  const { state, toggle, clear, triggerRef, isSelected } = useDropdownContext();
  const { size, disabled, loading, selected, mode, isOpen } = state;
  const s = sizeConfig[size];

  const selectedOptions = options.filter((o) => isSelected(o.value));
  const hasSelection    = selected.size > 0;

  const handleClear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    clear();
  }, [clear]);

  return (
    <div
      ref={triggerRef}
      role="combobox"
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      tabIndex={disabled ? -1 : 0}
      onClick={() => { if (!disabled) toggle(); }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
          e.preventDefault();
          if (!disabled) toggle();
        }
      }}
      className={`
        inline-flex items-center ${s.gap} w-full
        ${s.triggerPx} ${s.triggerH}
        ${s.triggerText} font-medium
        rounded-xl
        bg-white dark:bg-gray-900
        border
        ${isOpen
          ? "border-gray-400 dark:border-gray-500 ring-2 ring-gray-200 dark:ring-gray-700"
          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
        }
        shadow-sm shadow-black/5 dark:shadow-black/10
        transition-all duration-100
        cursor-pointer select-none
        ${disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}
        ${triggerClassName}
      `}
    >
      {/* Value display */}
      <div className="flex-1 min-w-0 flex items-center gap-1 flex-wrap">
        {!hasSelection && (
          <span className="text-gray-400 dark:text-gray-500 truncate">
            {loading ? "Loading…" : placeholder}
          </span>
        )}

        {hasSelection && mode === "single" && selectedOptions[0] && (
          <span className="flex items-center gap-1.5 truncate text-gray-700 dark:text-gray-200">
            {selectedOptions[0].icon && (
              <span
                className="shrink-0 flex items-center text-gray-400 dark:text-gray-500"
                style={{ width: s.iconSize - 1, height: s.iconSize - 1 }}
              >
                {selectedOptions[0].icon}
              </span>
            )}
            <span className="truncate">{selectedOptions[0].label}</span>
          </span>
        )}

        {hasSelection && mode === "multi" && (
          <div className="flex flex-wrap gap-1">
            {selectedOptions.map((opt) => (
              <Tag
                key={opt.value}
                label={opt.label}
                size={size}
                onRemove={() => {
                  const { deselectOption } = useDropdownContext();
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Right side controls */}
      <div className="shrink-0 flex items-center gap-1">
        {loading && (
          <Loader2
            size={s.chevronSize - 1}
            className="animate-spin text-gray-400 dark:text-gray-500"
          />
        )}

        {clearable && hasSelection && !loading && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear selection"
            className="flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors duration-100 rounded p-0.5 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X size={s.clearSize} />
          </button>
        )}

        <ChevronsUpDown
          size={s.chevronSize}
          className={`text-gray-400 dark:text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </div>
    </div>
  );
}

// ─── Multi-select Tag with context fix ───────────────────────────────────────
// Separate component so the hook call is valid inside a component

function MultiTags({
  options,
  size,
}: {
  options: DropdownOption[];
  size: DropdownSize;
}) {
  const { deselectOption, state } = useDropdownContext();
  const selected = options.filter((o) => state.selected.has(o.value));

  return (
    <>
      {selected.map((opt) => (
        <Tag
          key={opt.value}
          label={opt.label}
          size={size}
          onRemove={() => deselectOption(opt.value)}
        />
      ))}
    </>
  );
}

// Reworked trigger that properly calls hooks
function DropdownTriggerInner({
  options,
  placeholder,
  clearable,
  triggerClassName = "",
}: DropdownTriggerProps) {
  const { state, toggle, clear, triggerRef, isSelected } = useDropdownContext();
  const { size, disabled, loading, selected, mode, isOpen } = state;
  const s = sizeConfig[size];

  const selectedOptions = options.filter((o) => isSelected(o.value));
  const hasSelection    = selected.size > 0;

  const handleClear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    clear();
  }, [clear]);

  return (
    <div
      ref={triggerRef}
      role="combobox"
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      tabIndex={disabled ? -1 : 0}
      onClick={() => { if (!disabled && !loading) toggle(); }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
          e.preventDefault();
          if (!disabled && !loading) toggle();
        }
      }}
      className={`
        inline-flex items-center ${s.gap} w-full
        ${s.triggerPx} ${s.triggerH}
        ${s.triggerText} font-medium
        rounded-xl
        bg-white dark:bg-gray-900
        border
        ${isOpen
          ? "border-gray-400 dark:border-gray-500 ring-2 ring-gray-200 dark:ring-gray-700"
          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
        }
        shadow-sm shadow-black/5 dark:shadow-black/10
        transition-all duration-100
        cursor-pointer select-none
        ${disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}
        ${triggerClassName}
      `}
    >
      {/* Value area */}
      <div className="flex-1 min-w-0 flex items-center flex-wrap gap-1">
        {!hasSelection && (
          <span className="text-gray-400 dark:text-gray-500 truncate">
            {loading ? "Loading…" : placeholder}
          </span>
        )}

        {hasSelection && mode === "single" && selectedOptions[0] && (
          <span className="flex items-center gap-1.5 min-w-0 text-gray-700 dark:text-gray-200">
            {selectedOptions[0].icon && (
              <span
                className="shrink-0 flex items-center text-gray-400 dark:text-gray-500"
                style={{ width: s.iconSize - 1, height: s.iconSize - 1 }}
              >
                {selectedOptions[0].icon}
              </span>
            )}
            <span className="truncate">{selectedOptions[0].label}</span>
          </span>
        )}

        {hasSelection && mode === "multi" && (
          <MultiTags options={options} size={size} />
        )}
      </div>

      {/* Controls */}
      <div className="shrink-0 flex items-center gap-1">
        {loading && (
          <Loader2 size={s.chevronSize - 1} className="animate-spin text-gray-400 dark:text-gray-500" />
        )}
        {clearable && hasSelection && !loading && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear selection"
            className="flex items-center justify-center p-0.5 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-100"
          >
            <X size={s.clearSize} />
          </button>
        )}
        <ChevronDown
          size={s.chevronSize}
          className={`text-gray-400 dark:text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </div>
    </div>
  );
}

// ─── Root Dropdown Component ──────────────────────────────────────────────────

export interface DropdownProps extends Omit<DropdownProviderProps, "children"> {
  options: DropdownOption[];
  placeholder?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  clearable?: boolean;
  emptyLabel?: string;
  /** Extra class on the root wrapper */
  className?: string;
  /** Extra class on the trigger button */
  triggerClassName?: string;
  /** Extra class on the dropdown panel */
  panelClassName?: string;
}

export function Dropdown({
  options,
  placeholder         = "Select an option…",
  searchable          = false,
  searchPlaceholder   = "Search…",
  clearable           = true,
  emptyLabel          = "No options found",
  className           = "",
  triggerClassName    = "",
  panelClassName      = "",
  size                = "md",
  mode                = "single",
  align               = "auto",
  disabled            = false,
  loading             = false,
  defaultValue,
  onValueChange,
  onOpen,
  onClose,
}: DropdownProps) {
  return (
    <DropdownProvider
      size={size}
      mode={mode}
      align={align}
      disabled={disabled}
      loading={loading}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      onOpen={onOpen}
      onClose={onClose}
    >
      <div className={`relative inline-block w-full ${className}`}>
        <DropdownTriggerInner
          options={options}
          placeholder={placeholder}
          clearable={clearable}
          triggerClassName={triggerClassName}
        />
        <DropdownPanel
          options={options}
          searchable={searchable}
          searchPlaceholder={searchPlaceholder}
          emptyLabel={emptyLabel}
          className={panelClassName}
        />
      </div>
    </DropdownProvider>
  );
}

// ─── Controlled Dropdown ──────────────────────────────────────────────────────

export interface ControlledDropdownProps extends Omit<DropdownProps, "defaultValue"> {
  value: string | string[];
}

/**
 * Fully controlled — manage value externally.
 *
 * ```tsx
 * const [val, setVal] = useState("apple");
 * <ControlledDropdown value={val} onValueChange={(v) => setVal(v as string)} options={...} />
 * ```
 */
export function ControlledDropdown({ value, ...rest }: ControlledDropdownProps) {
  return <Dropdown {...rest} defaultValue={value} key={JSON.stringify(value)} />;
}

// ─── Re-exports ───────────────────────────────────────────────────────────────

export { DropdownProvider, useDropdownContext };
export type { DropdownOption, DropdownSize, DropdownMode, DropdownAlign };