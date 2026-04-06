import React, {
  useCallback,
  useRef,
  useId,
  useMemo,
  useEffect,
  useState,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  Lock,
  Loader2,
  Search,
  X,
  Check,
  Minus,
  FolderOpen,
  Folder,
  FileText,
  GripVertical,
  ChevronsDownUp,
  ChevronsUpDown,
} from "lucide-react";
import {
  TreeProvider,
  useTreeContext,
  type TreeProviderProps,
  type TreeNodeData,
  type TreeSize,
  type TreeVariant,
  type TreeSelectionMode,
} from "./Tree.context";

// ─── Design Tokens ────────────────────────────────────────────────────────────

const sizeConfig = {
  sm: {
    rowH: "min-h-[28px]",
    rowPy: "py-0.5",
    rowPx: "px-2",
    text: "text-xs",
    sublabel: "text-[10px]",
    icon: 12,
    chevron: 11,
    indent: 16,
    checkboxSize: "w-3.5 h-3.5",
    checkIcon: 9,
    gap: "gap-1.5",
    searchH: "h-7",
    searchText: "text-xs",
    searchPx: "px-2.5",
    headerPy: "py-2",
    headerPx: "px-3",
    footerPy: "py-2",
    footerPx: "px-3",
    badgeText: "text-[10px]",
  },
  md: {
    rowH: "min-h-[36px]",
    rowPy: "py-1",
    rowPx: "px-3",
    text: "text-sm",
    sublabel: "text-xs",
    icon: 15,
    chevron: 13,
    indent: 20,
    checkboxSize: "w-4 h-4",
    checkIcon: 10,
    gap: "gap-2",
    searchH: "h-8",
    searchText: "text-sm",
    searchPx: "px-3",
    headerPy: "py-2.5",
    headerPx: "px-4",
    footerPy: "py-2.5",
    footerPx: "px-4",
    badgeText: "text-xs",
  },
  lg: {
    rowH: "min-h-[42px]",
    rowPy: "py-1.5",
    rowPx: "px-4",
    text: "text-sm",
    sublabel: "text-xs",
    icon: 17,
    chevron: 14,
    indent: 24,
    checkboxSize: "w-4 h-4",
    checkIcon: 11,
    gap: "gap-2.5",
    searchH: "h-9",
    searchText: "text-sm",
    searchPx: "px-3.5",
    headerPy: "py-3",
    headerPx: "px-5",
    footerPy: "py-3",
    footerPx: "px-5",
    badgeText: "text-xs",
  },
  xl: {
    rowH: "min-h-[50px]",
    rowPy: "py-2",
    rowPx: "px-5",
    text: "text-base",
    sublabel: "text-sm",
    icon: 19,
    chevron: 15,
    indent: 28,
    checkboxSize: "w-4.5 h-4.5",
    checkIcon: 12,
    gap: "gap-3",
    searchH: "h-10",
    searchText: "text-base",
    searchPx: "px-4",
    headerPy: "py-3.5",
    headerPx: "px-6",
    footerPy: "py-3.5",
    footerPx: "px-6",
    badgeText: "text-sm",
  },
} as const;

const variantConfig = {
  default: {
    wrapper:
      "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm shadow-black/5 dark:shadow-black/20 overflow-hidden",
    header:
      "bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-700",
    footer:
      "bg-gray-50 dark:bg-gray-800/60 border-t border-gray-200 dark:border-gray-700",
    body:      "bg-white dark:bg-gray-900",
    rowBase:   "text-gray-700 dark:text-gray-300",
    rowHover:  "hover:bg-gray-50 dark:hover:bg-gray-800/50",
    rowActive: "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white",
    rowFocus:  "ring-2 ring-inset ring-gray-300 dark:ring-gray-600",
    rowDragOver: "bg-gray-100 dark:bg-gray-800 ring-2 ring-inset ring-gray-900 dark:ring-white",
    connector: "border-gray-200 dark:border-gray-700",
    sublabel:  "text-gray-400 dark:text-gray-500",
    lockColor: "text-gray-300 dark:text-gray-600",
    iconColor: "text-gray-400 dark:text-gray-500",
    chevronColor: "text-gray-400 dark:text-gray-500",
    searchBorder: "border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800",
    searchText: "text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600",
    checkboxUnchecked: "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 hover:border-gray-500 dark:hover:border-gray-400",
    checkboxChecked: "bg-gray-900 dark:bg-white border-gray-900 dark:border-white",
    checkboxIcon: "text-white dark:text-gray-900",
    highlight: "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200 rounded",
    emptyText: "text-gray-400 dark:text-gray-600",
  },
  filled: {
    wrapper:
      "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm shadow-black/5 dark:shadow-black/20 overflow-hidden",
    header:
      "bg-gray-900 dark:bg-gray-950 border-b border-gray-800 dark:border-gray-800",
    footer:
      "bg-gray-900 dark:bg-gray-950 border-t border-gray-800 dark:border-gray-800",
    body:      "bg-white dark:bg-gray-900",
    rowBase:   "text-gray-700 dark:text-gray-300",
    rowHover:  "hover:bg-gray-50 dark:hover:bg-gray-800/50",
    rowActive: "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white",
    rowFocus:  "ring-2 ring-inset ring-gray-300 dark:ring-gray-600",
    rowDragOver: "bg-gray-100 dark:bg-gray-800 ring-2 ring-inset ring-gray-900 dark:ring-white",
    connector: "border-gray-200 dark:border-gray-700",
    sublabel:  "text-gray-400 dark:text-gray-500",
    lockColor: "text-gray-300 dark:text-gray-600",
    iconColor: "text-gray-400 dark:text-gray-500",
    chevronColor: "text-gray-400 dark:text-gray-500",
    searchBorder: "border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800",
    searchText: "text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600",
    checkboxUnchecked: "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 hover:border-gray-500 dark:hover:border-gray-400",
    checkboxChecked: "bg-gray-900 dark:bg-white border-gray-900 dark:border-white",
    checkboxIcon: "text-white dark:text-gray-900",
    highlight: "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200 rounded",
    emptyText: "text-gray-400 dark:text-gray-600",
  },
  ghost: {
    wrapper:   "bg-transparent overflow-hidden",
    header:    "border-b border-gray-200 dark:border-gray-700",
    footer:    "border-t border-gray-200 dark:border-gray-700",
    body:      "bg-transparent",
    rowBase:   "text-gray-700 dark:text-gray-300",
    rowHover:  "hover:bg-gray-50 dark:hover:bg-gray-800/40",
    rowActive: "bg-gray-100 dark:bg-gray-800/60 text-gray-900 dark:text-white",
    rowFocus:  "ring-2 ring-inset ring-gray-200 dark:ring-gray-700",
    rowDragOver: "bg-gray-100 dark:bg-gray-800 ring-2 ring-inset ring-gray-900 dark:ring-white",
    connector: "border-gray-200 dark:border-gray-700",
    sublabel:  "text-gray-400 dark:text-gray-500",
    lockColor: "text-gray-300 dark:text-gray-600",
    iconColor: "text-gray-400 dark:text-gray-500",
    chevronColor: "text-gray-400 dark:text-gray-500",
    searchBorder: "border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60",
    searchText: "text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600",
    checkboxUnchecked: "border-gray-300 dark:border-gray-600 bg-transparent hover:border-gray-500 dark:hover:border-gray-400",
    checkboxChecked: "bg-gray-900 dark:bg-white border-gray-900 dark:border-white",
    checkboxIcon: "text-white dark:text-gray-900",
    highlight: "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200 rounded",
    emptyText: "text-gray-400 dark:text-gray-600",
  },
  outline: {
    wrapper:
      "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden",
    header:
      "border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900",
    footer:
      "border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900",
    body:      "bg-white dark:bg-gray-900",
    rowBase:   "text-gray-700 dark:text-gray-300",
    rowHover:  "hover:bg-gray-50 dark:hover:bg-gray-800/50",
    rowActive: "bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white",
    rowFocus:  "ring-2 ring-inset ring-gray-200 dark:ring-gray-700",
    rowDragOver: "bg-gray-50 dark:bg-gray-800 ring-2 ring-inset ring-gray-400 dark:ring-gray-500",
    connector: "border-gray-200 dark:border-gray-700",
    sublabel:  "text-gray-400 dark:text-gray-500",
    lockColor: "text-gray-300 dark:text-gray-600",
    iconColor: "text-gray-400 dark:text-gray-500",
    chevronColor: "text-gray-400 dark:text-gray-500",
    searchBorder: "border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800",
    searchText: "text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600",
    checkboxUnchecked: "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 hover:border-gray-500 dark:hover:border-gray-400",
    checkboxChecked: "bg-gray-900 dark:bg-white border-gray-900 dark:border-white",
    checkboxIcon: "text-white dark:text-gray-900",
    highlight: "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200 rounded",
    emptyText: "text-gray-400 dark:text-gray-600",
  },
} as const;

// ─── Highlight matched text ───────────────────────────────────────────────────

function HighlightText({
  text,
  query,
  highlightClass,
}: {
  text: string;
  query: string;
  highlightClass: string;
}) {
  if (!query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className={highlightClass}>{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

// ─── Checkbox ─────────────────────────────────────────────────────────────────

interface TreeCheckboxProps {
  checked: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  onChange: (e: React.MouseEvent) => void;
  size: TreeSize;
  variant: TreeVariant;
}

function TreeCheckbox({
  checked,
  indeterminate = false,
  disabled = false,
  onChange,
  size,
  variant,
}: TreeCheckboxProps) {
  const s = sizeConfig[size];
  const v = variantConfig[variant];

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={indeterminate ? "mixed" : checked}
      disabled={disabled}
      onClick={onChange}
      className={`
        shrink-0 ${s.checkboxSize} flex items-center justify-center
        rounded border transition-all duration-100
        focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:ring-offset-1
        ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
        ${checked || indeterminate ? v.checkboxChecked : v.checkboxUnchecked}
      `}
    >
      <AnimatePresence mode="wait" initial={false}>
        {indeterminate ? (
          <motion.span key="ind" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.1 }}>
            <Minus size={s.checkIcon} className={v.checkboxIcon} strokeWidth={3} />
          </motion.span>
        ) : checked ? (
          <motion.span key="chk" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.1 }}>
            <Check size={s.checkIcon} className={v.checkboxIcon} strokeWidth={3} />
          </motion.span>
        ) : null}
      </AnimatePresence>
    </button>
  );
}

// ─── Single Tree Node ─────────────────────────────────────────────────────────

export interface TreeNodeClassNames {
  row?: string;
  label?: string;
  sublabel?: string;
  icon?: string;
  chevron?: string;
  connector?: string;
  checkbox?: string;
  lockIcon?: string;
  trailing?: string;
  dragHandle?: string;
  loadingSpinner?: string;
  contentPanel?: string;
}

interface TreeNodeProps {
  node: TreeNodeData;
  depth: number;
  isLast: boolean;
  parentLines: boolean[]; // which ancestor levels have a continuing sibling
  showConnectors: boolean;
  classNames?: TreeNodeClassNames;
  renderNode?: (node: TreeNodeData, depth: number) => React.ReactNode;
  renderIcon?: (node: TreeNodeData, isExpanded: boolean) => React.ReactNode;
}

function TreeNode({
  node,
  depth,
  isLast,
  parentLines,
  showConnectors,
  classNames = {},
  renderNode,
  renderIcon,
}: TreeNodeProps) {
  const {
    state, size, variant,
    toggleExpand, isExpanded, toggleSelect, isSelected,
    toggleCheck, isChecked, isIndeterminate,
    focusNode, focusNext, focusPrev, focusFirst, focusLast,
    setDragOver, setDragging, onNodeClick, onNodeDrop,
    checkable, draggable, selectionMode,
  } = useTreeContext();

  const s = sizeConfig[size];
  const v = variantConfig[variant];
  const nodeRef = useRef<HTMLDivElement>(null);

  const expanded = isExpanded(node.id);
  const selected = isSelected(node.id);
  const checked  = isChecked(node.id);
  const indeterminate = isIndeterminate(node.id);
  const isFocused = state.focusedId === node.id;
  const isDragging = state.draggingId === node.id;
  const isDragOver = state.dragOverId === node.id;
  const isLoading = state.loadingIds.has(node.id);
  const hasChildren = (node.children && node.children.length > 0) || node.hasChildren;

  // Filter match
  const q = state.filterQuery;
  const labelStr = typeof node.label === "string" ? node.label : "";
  const nodeVisible = !q || labelStr.toLowerCase().includes(q.toLowerCase())
    || (node.children?.some((c) => {
      const cl = typeof c.label === "string" ? c.label.toLowerCase() : "";
      return cl.includes(q.toLowerCase());
    }) ?? false);

  // Scroll focused node into view
  useEffect(() => {
    if (isFocused && nodeRef.current) {
      nodeRef.current.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [isFocused]);

  const handleToggleExpand = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (node.locked || node.disabled || !hasChildren) return;
      toggleExpand(node.id);
    },
    [node, hasChildren, toggleExpand],
  );

  const handleRowClick = useCallback(() => {
    if (node.locked || node.disabled) return;
    focusNode(node.id);
    onNodeClick?.(node);
    if (selectionMode !== "none") toggleSelect(node.id);
    if (hasChildren) toggleExpand(node.id);
  }, [node, selectionMode, hasChildren, toggleSelect, toggleExpand, focusNode, onNodeClick]);

  const handleCheckChange = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (node.locked || node.disabled) return;
      toggleCheck(node.id);
    },
    [node, toggleCheck],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":   e.preventDefault(); focusNext(); break;
        case "ArrowUp":     e.preventDefault(); focusPrev(); break;
        case "ArrowRight":
          e.preventDefault();
          if (hasChildren && !expanded) toggleExpand(node.id);
          else if (hasChildren && expanded) focusNext();
          break;
        case "ArrowLeft":
          e.preventDefault();
          if (hasChildren && expanded) toggleExpand(node.id);
          break;
        case "Home":        e.preventDefault(); focusFirst(); break;
        case "End":         e.preventDefault(); focusLast();  break;
        case "Enter":
        case " ":
          e.preventDefault();
          handleRowClick();
          break;
        case "*":
          // Expand all siblings (standard tree pattern)
          e.preventDefault();
          break;
      }
    },
    [node, hasChildren, expanded, toggleExpand, focusNext, focusPrev, focusFirst, focusLast, handleRowClick],
  );

  if (!nodeVisible) return null;

  // ── Connector lines geometry ──────────────────────────────────────────────

  const indentPx = depth * s.indent;

  // ── Default icon ──────────────────────────────────────────────────────────

  const defaultIcon = renderIcon
    ? renderIcon(node, expanded)
    : node.icon
      ? <span className={v.iconColor}>{node.icon}</span>
      : hasChildren
        ? expanded
          ? <FolderOpen size={s.icon} className={v.iconColor} />
          : <Folder size={s.icon} className={v.iconColor} />
        : <FileText size={s.icon} className={v.iconColor} />;

  return (
    <div role="treeitem" aria-expanded={hasChildren ? expanded : undefined} aria-selected={selected} aria-disabled={node.disabled || node.locked}>
      {/* ── Row ── */}
      <div
        ref={nodeRef}
        tabIndex={isFocused || (!state.focusedId && depth === 0) ? 0 : -1}
        onKeyDown={handleKeyDown}
        onFocus={() => focusNode(node.id)}
        onClick={handleRowClick}
        draggable={draggable && !node.locked && !node.disabled}
        onDragStart={draggable ? (e) => { e.dataTransfer.effectAllowed = "move"; setDragging(node.id); } : undefined}
        onDragOver={draggable ? (e) => { e.preventDefault(); setDragOver(node.id); } : undefined}
        onDrop={draggable ? (e) => {
          e.preventDefault();
          if (state.draggingId && state.draggingId !== node.id) {
            onNodeDrop?.(state.draggingId, node.id);
          }
          setDragOver(null);
          setDragging(null);
        } : undefined}
        onDragEnd={draggable ? () => { setDragging(null); setDragOver(null); } : undefined}
        className={`
          relative flex items-center w-full select-none outline-none
          ${s.rowH} ${s.rowPy} ${s.gap}
          transition-colors duration-100 cursor-pointer
          ${v.rowBase}
          ${selected ? v.rowActive : v.rowHover}
          ${isFocused ? v.rowFocus : ""}
          ${isDragOver ? v.rowDragOver : ""}
          ${isDragging ? "opacity-40" : ""}
          ${node.disabled || node.locked ? "opacity-50 cursor-not-allowed" : ""}
          ${classNames.row ?? ""}
        `}
        style={{ paddingLeft: `calc(${s.rowPx.replace("px-", "")} * 0.25rem + ${indentPx}px)` }}
      >
        {/* Connector lines */}
        {showConnectors && depth > 0 && parentLines.map((hasLine, i) => (
          <span
            key={i}
            className={`absolute top-0 bottom-0 border-l ${v.connector} ${classNames.connector ?? ""}`}
            style={{ left: `calc(${s.rowPx.replace("px-", "")} * 0.25rem + ${i * s.indent + s.indent / 2}px)` }}
            aria-hidden="true"
          />
        ))}
        {showConnectors && depth > 0 && (
          <span
            className={`absolute border-l border-b ${v.connector} ${classNames.connector ?? ""}`}
            style={{
              left: `calc(${s.rowPx.replace("px-", "")} * 0.25rem + ${(depth - 1) * s.indent + s.indent / 2}px)`,
              top: 0,
              height: "50%",
              width: `${s.indent / 2}px`,
            }}
            aria-hidden="true"
          />
        )}

        {/* Drag handle */}
        {draggable && !node.locked && !node.disabled && (
          <span className={`shrink-0 ${v.chevronColor} cursor-grab active:cursor-grabbing ${classNames.dragHandle ?? ""}`} aria-hidden="true">
            <GripVertical size={s.chevron} />
          </span>
        )}

        {/* Checkbox */}
        {checkable && (
          <TreeCheckbox
            checked={checked}
            indeterminate={indeterminate}
            disabled={node.disabled || node.locked}
            onChange={handleCheckChange}
            size={size}
            variant={variant}
          />
        )}

        {/* Chevron */}
        <span
          onClick={handleToggleExpand}
          className={`
            shrink-0 flex items-center justify-center transition-colors duration-100
            ${hasChildren ? "cursor-pointer" : "opacity-0 pointer-events-none"}
            ${v.chevronColor} ${classNames.chevron ?? ""}
          `}
          aria-hidden="true"
          style={{ width: s.chevron + 4, height: s.chevron + 4 }}
        >
          {isLoading ? (
            <Loader2 size={s.chevron} className="animate-spin" />
          ) : (
            <motion.span
              animate={{ rotate: expanded ? 90 : 0 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="flex items-center justify-center"
            >
              <ChevronRight size={s.chevron} />
            </motion.span>
          )}
        </span>

        {/* Icon */}
        <span className={`shrink-0 ${classNames.icon ?? ""}`}>{defaultIcon}</span>

        {/* Label area */}
        <span className="flex-1 min-w-0 flex flex-col justify-center">
          <span className={`${s.text} leading-tight truncate font-medium ${classNames.label ?? ""}`}>
            {q && typeof node.label === "string" ? (
              <HighlightText text={node.label} query={q} highlightClass={v.highlight} />
            ) : node.label}
          </span>
          {node.sublabel && (
            <span className={`${s.sublabel} ${v.sublabel} leading-tight truncate ${classNames.sublabel ?? ""}`}>
              {node.sublabel}
            </span>
          )}
        </span>

        {/* Trailing slot */}
        {node.trailing && (
          <span className={`shrink-0 ${classNames.trailing ?? ""}`}>{node.trailing}</span>
        )}

        {/* Lock icon */}
        {node.locked && (
          <span className={`shrink-0 ${v.lockColor} ${classNames.lockIcon ?? ""}`} aria-label="Locked">
            <Lock size={s.chevron} />
          </span>
        )}
      </div>

      {/* ── Children ── */}
      <AnimatePresence initial={false}>
        {expanded && hasChildren && (
          <motion.div
            key="children"
            role="group"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {isLoading ? (
              <div className={`flex items-center ${s.gap} ${s.rowPy} ${v.sublabel}`}
                style={{ paddingLeft: `calc(${s.rowPx.replace("px-", "")} * 0.25rem + ${(depth + 1) * s.indent}px)` }}>
                <Loader2 size={s.chevron} className="animate-spin" />
                <span className={`${s.text}`}>Loading...</span>
              </div>
            ) : (
              node.children?.map((child, idx) => (
                <TreeNode
                  key={child.id}
                  node={child}
                  depth={depth + 1}
                  isLast={idx === (node.children!.length - 1)}
                  parentLines={[...parentLines, !isLast]}
                  showConnectors={showConnectors}
                  classNames={classNames}
                  renderNode={renderNode}
                  renderIcon={renderIcon}
                />
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Tree Toolbar (search + actions) ─────────────────────────────────────────

interface TreeToolbarProps {
  size: TreeSize;
  variant: TreeVariant;
  showSearch: boolean;
  searchPlaceholder?: string;
  toolbarClassName?: string;
  searchClassName?: string;
  toolbarContent?: React.ReactNode;
}

function TreeToolbar({
  size, variant, showSearch, searchPlaceholder = "Search...",
  toolbarClassName = "", searchClassName = "", toolbarContent,
}: TreeToolbarProps) {
  const { state, setFilter, expandAll, collapseAll } = useTreeContext();
  const s = sizeConfig[size];
  const v = variantConfig[variant];

  if (!showSearch && !toolbarContent) return null;

  return (
    <div className={`flex items-center gap-2 flex-wrap ${s.headerPx} py-2 border-b border-gray-100 dark:border-gray-800 ${toolbarClassName}`}>
      {showSearch && (
        <div className={`flex items-center gap-2 flex-1 min-w-0 ${s.searchH} ${s.searchPx} rounded-lg ${v.searchBorder} ${searchClassName}`}>
          <Search size={s.chevron} className="shrink-0 text-gray-400 dark:text-gray-500" />
          <input
            type="search"
            value={state.filterQuery}
            onChange={(e) => setFilter(e.target.value)}
            placeholder={searchPlaceholder}
            className={`flex-1 min-w-0 bg-transparent border-0 outline-none ring-0 ${s.searchText} ${v.searchText}`}
          />
          {state.filterQuery && (
            <button type="button" onClick={() => setFilter("")} className="shrink-0 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              <X size={s.chevron - 1} />
            </button>
          )}
        </div>
      )}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={expandAll}
          title="Expand all"
          className="p-1 rounded text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ChevronsUpDown size={s.chevron} />
        </button>
        <button
          type="button"
          onClick={collapseAll}
          title="Collapse all"
          className="p-1 rounded text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ChevronsDownUp size={s.chevron} />
        </button>
        {toolbarContent}
      </div>
    </div>
  );
}

// ─── Public Props ─────────────────────────────────────────────────────────────

export interface TreeProps extends Omit<TreeProviderProps, "children"> {
  /** Remove the card wrapper */
  bare?: boolean;
  /** Max height with overflow-y scroll */
  maxHeight?: string;
  /** Show search bar + expand/collapse all toolbar */
  showSearch?: boolean;
  /** Search input placeholder */
  searchPlaceholder?: string;
  /** Header slot — renders above the node list */
  header?: React.ReactNode;
  /** Footer slot — renders below the node list */
  footer?: React.ReactNode;
  /** Extra content in the toolbar row */
  toolbarContent?: React.ReactNode;
  /** Empty state content */
  emptyContent?: React.ReactNode;
  /** Custom full node renderer (replaces built-in row) */
  renderNode?: (node: TreeNodeData, depth: number) => React.ReactNode;
  /** Custom icon renderer per node */
  renderIcon?: (node: TreeNodeData, isExpanded: boolean) => React.ReactNode;
  // ── className overrides ────────────────────────────────────────────────────
  className?: string;
  wrapperClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
  bodyClassName?: string;
  toolbarClassName?: string;
  searchClassName?: string;
  nodeClassNames?: TreeNodeClassNames;
}

// ─── Tree Inner ───────────────────────────────────────────────────────────────

function TreeInner({
  bare = false,
  maxHeight,
  showSearch = false,
  searchPlaceholder,
  header,
  footer,
  toolbarContent,
  emptyContent,
  renderNode,
  renderIcon,
  className = "",
  wrapperClassName = "",
  headerClassName = "",
  footerClassName = "",
  bodyClassName = "",
  toolbarClassName = "",
  searchClassName = "",
  nodeClassNames = {},
}: Omit<TreeProps, keyof Omit<TreeProviderProps, "children">>) {
  const { nodes, state, size, variant, showConnectors } = useTreeContext();
  const s = sizeConfig[size];
  const v = variantConfig[variant];

  const q = state.filterQuery;

  // Check if there are any visible nodes under filter
  function anyVisible(list: TreeNodeData[]): boolean {
    for (const node of list) {
      const label = typeof node.label === "string" ? node.label.toLowerCase() : "";
      if (!q || label.includes(q.toLowerCase())) return true;
      if (node.children?.length && anyVisible(node.children)) return true;
    }
    return false;
  }
  const isEmpty = !anyVisible(nodes);

  const inner = (
    <div
      className={`flex flex-col w-full ${bare ? "" : v.wrapper} ${wrapperClassName} ${className}`}
      role="tree"
      aria-multiselectable={undefined}
    >
      {/* Header */}
      {header && (
        <div className={`${s.headerPx} ${s.headerPy} ${v.header} ${headerClassName}`}>
          {header}
        </div>
      )}

      {/* Toolbar */}
      {(showSearch || toolbarContent) && (
        <TreeToolbar
          size={size}
          variant={variant}
          showSearch={showSearch ?? false}
          searchPlaceholder={searchPlaceholder}
          toolbarClassName={toolbarClassName}
          searchClassName={searchClassName}
          toolbarContent={toolbarContent}
        />
      )}

      {/* Body */}
      <div
        className={`${v.body} ${bodyClassName} overflow-x-auto`}
        style={maxHeight ? { maxHeight, overflowY: "auto" } : undefined}
      >
        {isEmpty ? (
          <div className={`flex flex-col items-center justify-center py-12 ${s.text} ${v.emptyText}`}>
            {emptyContent ?? (
              <>
                <FolderOpen size={28} className="mb-3 opacity-40" />
                <span className="font-medium">
                  {q ? "No results found" : "No items"}
                </span>
              </>
            )}
          </div>
        ) : (
          <div className="py-1">
            {nodes.map((node, idx) => (
              <TreeNode
                key={node.id}
                node={node}
                depth={0}
                isLast={idx === nodes.length - 1}
                parentLines={[]}
                showConnectors={showConnectors}
                classNames={nodeClassNames}
                renderNode={renderNode}
                renderIcon={renderIcon}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {footer && (
        <div className={`${s.footerPx} ${s.footerPy} ${v.footer} ${footerClassName}`}>
          {footer}
        </div>
      )}
    </div>
  );

  return inner;
}

// ─── Public Tree ──────────────────────────────────────────────────────────────

/**
 * Tree — fully-featured, accessible, responsive hierarchical tree component.
 *
 * @example
 * ```tsx
 * <Tree
 *   nodes={[
 *     {
 *       id: "root",
 *       label: "Project",
 *       defaultExpanded: true,
 *       children: [
 *         { id: "src", label: "src", children: [
 *           { id: "index", label: "index.tsx" }
 *         ]},
 *         { id: "locked-node", label: "private", locked: true },
 *       ]
 *     }
 *   ]}
 *   variant="default"
 *   size="md"
 *   showSearch
 *   checkable
 *   header={<h3 className="font-semibold text-sm">File Explorer</h3>}
 *   footer={<span className="text-xs text-gray-400">3 items selected</span>}
 * />
 * ```
 */
export function Tree({
  nodes,
  size = "md",
  variant = "default",
  selectionMode = "single",
  checkable = false,
  draggable = false,
  showConnectors = true,
  defaultExpanded,
  defaultSelected,
  defaultChecked,
  onNodeClick,
  onNodeExpand,
  onNodeSelect,
  onNodeCheck,
  onNodeDrop,
  onLoadChildren,
  ...rest
}: TreeProps) {
  return (
    <TreeProvider
      nodes={nodes}
      size={size}
      variant={variant}
      selectionMode={selectionMode}
      checkable={checkable}
      draggable={draggable}
      showConnectors={showConnectors}
      defaultExpanded={defaultExpanded}
      defaultSelected={defaultSelected}
      defaultChecked={defaultChecked}
      onNodeClick={onNodeClick}
      onNodeExpand={onNodeExpand}
      onNodeSelect={onNodeSelect}
      onNodeCheck={onNodeCheck}
      onNodeDrop={onNodeDrop}
      onLoadChildren={onLoadChildren}
    >
      <TreeInner {...rest} />
    </TreeProvider>
  );
}

// ─── Exports ──────────────────────────────────────────────────────────────────

export { TreeProvider, useTreeContext };
export type { TreeNodeData, TreeSize, TreeVariant, TreeSelectionMode, TreeNodeClassNames };