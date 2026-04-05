import React, { useCallback, useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronRight,
  Search,
  X,
  Loader2,
  ArrowUpDown,
  Check,
  Minus,
} from "lucide-react";
import {
  TableProvider,
  useTableContext,
  type TableProviderProps,
  type TableColumn,
  type TableSize,
  type TableVariant,
  type TableDensity,
  type SelectionMode,
  type SortDirection,
} from "./Table.context";

const sizeConfig = {
  sm: {
    headerPx: "px-2.5",
    headerPy: "py-2",
    headerText: "text-xs",
    cellPx: "px-2.5",
    cellText: "text-xs",
    iconSize: 12,
    checkboxSize: "w-3.5 h-3.5",
    expandSize: "w-5 h-5",
    toolbarGap: "gap-2",
    toolbarPy: "py-2",
    toolbarPx: "px-3",
    searchH: "h-7",
    searchPx: "px-2.5",
    searchText: "text-xs",
    footerPx: "px-3",
    footerPy: "py-2",
    footerText: "text-xs",
  },
  md: {
    headerPx: "px-3.5",
    headerPy: "py-3",
    headerText: "text-sm",
    cellPx: "px-3.5",
    cellText: "text-sm",
    iconSize: 14,
    checkboxSize: "w-4 h-4",
    expandSize: "w-6 h-6",
    toolbarGap: "gap-3",
    toolbarPy: "py-2.5",
    toolbarPx: "px-4",
    searchH: "h-8",
    searchPx: "px-3",
    searchText: "text-sm",
    footerPx: "px-4",
    footerPy: "py-3",
    footerText: "text-sm",
  },
  lg: {
    headerPx: "px-4",
    headerPy: "py-3.5",
    headerText: "text-sm",
    cellPx: "px-4",
    cellText: "text-sm",
    iconSize: 15,
    checkboxSize: "w-4 h-4",
    expandSize: "w-6 h-6",
    toolbarGap: "gap-3",
    toolbarPy: "py-3",
    toolbarPx: "px-5",
    searchH: "h-9",
    searchPx: "px-3.5",
    searchText: "text-sm",
    footerPx: "px-5",
    footerPy: "py-3",
    footerText: "text-sm",
  },
  xl: {
    headerPx: "px-5",
    headerPy: "py-4",
    headerText: "text-sm",
    cellPx: "px-5",
    cellText: "text-sm",
    iconSize: 16,
    checkboxSize: "w-4.5 h-4.5",
    expandSize: "w-7 h-7",
    toolbarGap: "gap-4",
    toolbarPy: "py-3.5",
    toolbarPx: "px-6",
    searchH: "h-10",
    searchPx: "px-4",
    searchText: "text-base",
    footerPx: "px-6",
    footerPy: "py-3.5",
    footerText: "text-sm",
  },
};

const densityCellPy: Record<TableDensity, string> = {
  compact: "py-1.5",
  default: "py-3",
  comfortable: "py-4",
  spacious: "py-5",
};

const variantConfig: Record<
  TableVariant,
  {
    wrapper: string;
    header: string;
    headerCell: string;
    row: string;
    rowHover: string;
    rowSelected: string;
    cell: string;
    divider: string;
    footer: string;
    toolbar: string;
  }
> = {
  default: {
    wrapper:
      "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm shadow-black/5 dark:shadow-black/20",
    header: "bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-700",
    headerCell: "text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider",
    row: "border-b border-gray-100 dark:border-gray-800 last:border-b-0",
    rowHover: "hover:bg-gray-50 dark:hover:bg-gray-800/50",
    rowSelected: "bg-gray-100 dark:bg-gray-800",
    cell: "text-gray-700 dark:text-gray-300",
    divider: "divide-y divide-gray-100 dark:divide-gray-800",
    footer: "bg-gray-50 dark:bg-gray-800/60 border-t border-gray-200 dark:border-gray-700",
    toolbar: "bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700",
  },
  filled: {
    wrapper:
      "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm shadow-black/5 dark:shadow-black/20",
    header: "bg-gray-900 dark:bg-gray-950 border-b border-gray-900 dark:border-gray-800",
    headerCell: "text-gray-200 dark:text-gray-300 font-semibold uppercase tracking-wider",
    row: "border-b border-gray-100 dark:border-gray-800 last:border-b-0",
    rowHover: "hover:bg-gray-50 dark:hover:bg-gray-800/50",
    rowSelected: "bg-gray-100 dark:bg-gray-800",
    cell: "text-gray-700 dark:text-gray-300",
    divider: "divide-y divide-gray-100 dark:divide-gray-800",
    footer: "bg-gray-900 dark:bg-gray-950 border-t border-gray-900 dark:border-gray-800",
    toolbar: "bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700",
  },
  ghost: {
    wrapper: "bg-transparent",
    header: "border-b border-gray-200 dark:border-gray-700",
    headerCell: "text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider",
    row: "border-b border-gray-100 dark:border-gray-800 last:border-b-0",
    rowHover: "hover:bg-gray-50 dark:hover:bg-gray-800/40",
    rowSelected: "bg-gray-100 dark:bg-gray-800/60",
    cell: "text-gray-700 dark:text-gray-300",
    divider: "divide-y divide-gray-100 dark:divide-gray-800",
    footer: "border-t border-gray-200 dark:border-gray-700",
    toolbar: "border-b border-gray-200 dark:border-gray-700",
  },
  outline: {
    wrapper:
      "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl",
    header: "border-b border-gray-200 dark:border-gray-700",
    headerCell: "text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider",
    row: "border-b border-gray-200 dark:border-gray-700 last:border-b-0",
    rowHover: "hover:bg-gray-50 dark:hover:bg-gray-800/50",
    rowSelected: "bg-gray-50 dark:bg-gray-800",
    cell: "text-gray-700 dark:text-gray-300",
    divider: "divide-y divide-gray-200 dark:divide-gray-700",
    footer: "border-t border-gray-200 dark:border-gray-700",
    toolbar: "border-b border-gray-200 dark:border-gray-700",
  },
};

function SortIcon({
  columnId,
  iconSize,
}: {
  columnId: string;
  iconSize: number;
}) {
  const { state } = useTableContext();
  const { sortState } = state;
  const isActive = sortState.columnId === columnId;
  const direction = isActive ? sortState.direction : null;

  return (
    <span className="flex flex-col items-center justify-center shrink-0 ml-1">
      <AnimatePresence mode="wait" initial={false}>
        {!isActive || direction === null ? (
          <motion.span
            key="unsorted"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.1 }}
          >
            <ChevronsUpDown
              size={iconSize}
              className="text-gray-300 dark:text-gray-600"
            />
          </motion.span>
        ) : direction === "asc" ? (
          <motion.span
            key="asc"
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            transition={{ duration: 0.12 }}
          >
            <ChevronUp
              size={iconSize}
              className="text-gray-900 dark:text-white"
            />
          </motion.span>
        ) : (
          <motion.span
            key="desc"
            initial={{ opacity: 0, y: -3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 3 }}
            transition={{ duration: 0.12 }}
          >
            <ChevronDown
              size={iconSize}
              className="text-gray-900 dark:text-white"
            />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

interface CheckboxProps {
  checked: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  onChange: () => void;
  size: TableSize;
  ariaLabel?: string;
}

function Checkbox({
  checked,
  indeterminate = false,
  disabled = false,
  onChange,
  size,
  ariaLabel,
}: CheckboxProps) {
  const s = sizeConfig[size];

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={indeterminate ? "mixed" : checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      className={`
        shrink-0 ${s.checkboxSize} flex items-center justify-center
        rounded border transition-all duration-100 focus:outline-none
        focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:ring-offset-1
        ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
        ${
          checked || indeterminate
            ? "bg-gray-900 dark:bg-white border-gray-900 dark:border-white"
            : "bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 hover:border-gray-500 dark:hover:border-gray-400"
        }
      `}
    >
      <AnimatePresence mode="wait" initial={false}>
        {indeterminate ? (
          <motion.span
            key="minus"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.1 }}
          >
            <Minus size={10} className="text-white dark:text-gray-900" strokeWidth={3} />
          </motion.span>
        ) : checked ? (
          <motion.span
            key="check"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.1 }}
          >
            <Check size={10} className="text-white dark:text-gray-900" strokeWidth={3} />
          </motion.span>
        ) : null}
      </AnimatePresence>
    </button>
  );
}

interface TableToolbarProps {
  size: TableSize;
  variant: TableVariant;
  showSearch?: boolean;
  searchPlaceholder?: string;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  toolbarClassName?: string;
}

function TableToolbar({
  size,
  variant,
  showSearch = true,
  searchPlaceholder = "Search...",
  startContent,
  endContent,
  toolbarClassName = "",
}: TableToolbarProps) {
  const { state, setGlobalFilter } = useTableContext();
  const s = sizeConfig[size];
  const v = variantConfig[variant];

  if (!showSearch && !startContent && !endContent) return null;

  return (
    <div
      className={`flex items-center justify-between flex-wrap gap-2 ${s.toolbarPx} ${s.toolbarPy} ${v.toolbar} ${toolbarClassName}`}
    >
      <div className={`flex items-center ${s.toolbarGap} flex-wrap`}>
        {startContent}
        {showSearch && (
          <div
            className={`flex items-center gap-2 ${s.searchH} ${s.searchPx} rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 min-w-[180px]`}
          >
            <Search
              size={s.iconSize}
              className="shrink-0 text-gray-400 dark:text-gray-500"
            />
            <input
              type="search"
              value={state.filterState.globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder={searchPlaceholder}
              className={`flex-1 min-w-0 bg-transparent border-0 outline-none ring-0 ${s.searchText} text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600`}
            />
            {state.filterState.globalFilter && (
              <button
                type="button"
                onClick={() => setGlobalFilter("")}
                className="shrink-0 text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 transition-colors"
              >
                <X size={s.iconSize - 2} />
              </button>
            )}
          </div>
        )}
      </div>
      {endContent && (
        <div className={`flex items-center ${s.toolbarGap}`}>{endContent}</div>
      )}
    </div>
  );
}

interface TableHeaderCellProps<TData> {
  column: TableColumn<TData>;
  size: TableSize;
  variant: TableVariant;
}

function TableHeaderCell<TData>({
  column,
  size,
  variant,
}: TableHeaderCellProps<TData>) {
  const { toggleSort, state } = useTableContext<TData>();
  const s = sizeConfig[size];
  const v = variantConfig[variant];
  const isSorted = state.sortState.columnId === column.id;

  const alignClass =
    column.align === "center"
      ? "text-center justify-center"
      : column.align === "right"
        ? "text-right justify-end"
        : "text-left justify-start";

  const isFilled = variant === "filled";

  return (
    <th
      scope="col"
      style={{
        width: column.width,
        minWidth: column.minWidth,
        maxWidth: column.maxWidth,
      }}
      className={`
        ${s.headerPx} ${s.headerPy} ${s.headerText}
        ${v.headerCell}
        ${alignClass}
        ${column.sortable ? "select-none" : ""}
        ${column.headerClassName ?? ""}
        whitespace-nowrap
      `}
    >
      {column.sortable ? (
        <button
          type="button"
          onClick={() => toggleSort(column.id)}
          className={`
            inline-flex items-center gap-0.5 ${alignClass}
            transition-colors duration-100 rounded
            focus:outline-none focus-visible:ring-2
            ${
              isFilled
                ? isSorted
                  ? "text-white dark:text-gray-100"
                  : "text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-100"
                : isSorted
                  ? "text-gray-900 dark:text-white"
                  : "hover:text-gray-700 dark:hover:text-gray-200"
            }
          `}
        >
          <span>{column.header}</span>
          <SortIcon columnId={column.id} iconSize={s.iconSize} />
        </button>
      ) : (
        <span className={`inline-flex items-center ${alignClass}`}>
          {column.header}
        </span>
      )}
    </th>
  );
}

interface TableRowProps<TData> {
  row: TData;
  rowId: string;
  rowIndex: number;
  size: TableSize;
  variant: TableVariant;
  density: TableDensity;
  selectionMode: SelectionMode;
  striped?: boolean;
  expandable?: boolean;
  renderExpanded?: (row: TData, rowId: string) => React.ReactNode;
  rowClassName?: string | ((row: TData, rowId: string) => string);
  cellClassName?: string;
}

function TableRow<TData>({
  row,
  rowId,
  rowIndex,
  size,
  variant,
  density,
  selectionMode,
  striped = false,
  expandable = false,
  renderExpanded,
  rowClassName = "",
  cellClassName = "",
}: TableRowProps<TData>) {
  const {
    visibleColumns,
    isRowSelected,
    toggleRowSelection,
    isRowExpanded,
    toggleRowExpanded,
    onRowClick,
    onRowDoubleClick,
    state,
  } = useTableContext<TData>();

  const s = sizeConfig[size];
  const v = variantConfig[variant];
  const isSelected = isRowSelected(rowId);
  const isExpanded = isRowExpanded(rowId);
  const isEven = rowIndex % 2 === 0;

  const resolvedRowClass =
    typeof rowClassName === "function" ? rowClassName(row, rowId) : rowClassName;

  const handleRowClick = useCallback(() => {
    onRowClick?.(row, rowId);
    if (selectionMode !== "none") toggleRowSelection(rowId);
  }, [row, rowId, selectionMode, toggleRowSelection, onRowClick]);

  const handleRowDoubleClick = useCallback(() => {
    onRowDoubleClick?.(row, rowId);
  }, [row, rowId, onRowDoubleClick]);

  const colSpan =
    visibleColumns.length +
    (selectionMode !== "none" ? 1 : 0) +
    (expandable ? 1 : 0);

  return (
    <>
      <tr
        onClick={handleRowClick}
        onDoubleClick={handleRowDoubleClick}
        className={`
          ${v.row}
          ${isSelected ? v.rowSelected : striped && !isEven ? "bg-gray-50/60 dark:bg-gray-800/30" : ""}
          ${!isSelected && onRowClick || selectionMode !== "none" ? v.rowHover : ""}
          ${onRowClick || selectionMode !== "none" ? "cursor-pointer" : ""}
          transition-colors duration-100
          ${resolvedRowClass}
        `}
        aria-selected={selectionMode !== "none" ? isSelected : undefined}
      >
        {selectionMode !== "none" && (
          <td
            className={`${s.cellPx} ${densityCellPy[density]} w-10 shrink-0`}
            onClick={(e) => e.stopPropagation()}
          >
            <Checkbox
              checked={isSelected}
              onChange={() => toggleRowSelection(rowId)}
              size={size}
              ariaLabel={`Select row ${rowIndex + 1}`}
            />
          </td>
        )}

        {expandable && (
          <td
            className={`${s.cellPx} ${densityCellPy[density]} w-10 shrink-0`}
            onClick={(e) => {
              e.stopPropagation();
              toggleRowExpanded(rowId);
            }}
          >
            <button
              type="button"
              className={`
                ${s.expandSize} flex items-center justify-center rounded-md
                text-gray-400 dark:text-gray-500
                hover:text-gray-700 dark:hover:text-gray-200
                hover:bg-gray-100 dark:hover:bg-gray-800
                transition-colors duration-100
              `}
              aria-label={isExpanded ? "Collapse row" : "Expand row"}
            >
              <motion.span
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="flex items-center justify-center"
              >
                <ChevronRight size={s.iconSize} />
              </motion.span>
            </button>
          </td>
        )}

        {visibleColumns.map((col) => {
          const rawValue = col.accessorFn
            ? col.accessorFn(row)
            : col.accessorKey
              ? (row as Record<string, unknown>)[col.accessorKey as string]
              : undefined;

          const cellContent = col.cell
            ? col.cell(rawValue, row, rowIndex)
            : (rawValue as React.ReactNode) ?? null;

          const alignClass =
            col.align === "center"
              ? "text-center"
              : col.align === "right"
                ? "text-right"
                : "text-left";

          return (
            <td
              key={col.id}
              style={{
                width: col.width,
                minWidth: col.minWidth,
                maxWidth: col.maxWidth,
              }}
              className={`
                ${s.cellPx} ${densityCellPy[density]} ${s.cellText}
                ${v.cell} ${alignClass}
                ${col.cellClassName ?? ""}
                ${cellClassName}
              `}
            >
              {cellContent}
            </td>
          );
        })}
      </tr>

      <AnimatePresence initial={false}>
        {expandable && isExpanded && renderExpanded && (
          <motion.tr
            key={`${rowId}-expanded`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <td colSpan={colSpan} className="p-0">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <div
                  className={`${s.cellPx} ${densityCellPy[density]} bg-gray-50/60 dark:bg-gray-800/40 border-b border-gray-100 dark:border-gray-800`}
                >
                  {renderExpanded(row, rowId)}
                </div>
              </motion.div>
            </td>
          </motion.tr>
        )}
      </AnimatePresence>
    </>
  );
}

interface LoadingOverlayProps {
  size: TableSize;
  loadingContent?: React.ReactNode;
}

function LoadingOverlay({ size, loadingContent }: LoadingOverlayProps) {
  const s = sizeConfig[size];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-gray-900/70 backdrop-blur-[1px] z-10 rounded-xl"
    >
      {loadingContent ?? (
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <Loader2 size={s.iconSize + 4} className="animate-spin" />
          <span className={`${s.searchText} font-medium`}>Loading...</span>
        </div>
      )}
    </motion.div>
  );
}

interface EmptyStateProps {
  size: TableSize;
  variant: TableVariant;
  emptyContent?: React.ReactNode;
  colSpan: number;
}

function EmptyState({ size, emptyContent, colSpan }: EmptyStateProps) {
  const s = sizeConfig[size];

  return (
    <tr>
      <td colSpan={colSpan}>
        <div
          className={`flex flex-col items-center justify-center py-12 ${s.searchText} text-gray-400 dark:text-gray-600`}
        >
          {emptyContent ?? (
            <>
              <ArrowUpDown size={28} className="mb-3 opacity-40" />
              <span className="font-medium">No results found</span>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}

interface TableFooterProps<TData> {
  size: TableSize;
  variant: TableVariant;
  density: TableDensity;
  selectionMode: SelectionMode;
  expandable: boolean;
  footerClassName?: string;
}

function TableFooterRow<TData>({
  size,
  variant,
  density,
  selectionMode,
  expandable,
  footerClassName = "",
}: TableFooterProps<TData>) {
  const { visibleColumns } = useTableContext<TData>();
  const s = sizeConfig[size];
  const v = variantConfig[variant];
  const hasFooter = visibleColumns.some((col) => col.footer !== undefined);

  if (!hasFooter) return null;

  const isFilled = variant === "filled";

  return (
    <tfoot>
      <tr className={`${v.footer} ${footerClassName}`}>
        {selectionMode !== "none" && <td className={`${s.cellPx} ${densityCellPy[density]}`} />}
        {expandable && <td className={`${s.cellPx} ${densityCellPy[density]}`} />}
        {visibleColumns.map((col) => {
          const alignClass =
            col.align === "center"
              ? "text-center"
              : col.align === "right"
                ? "text-right"
                : "text-left";

          return (
            <td
              key={col.id}
              className={`
                ${s.cellPx} ${densityCellPy[density]} ${s.footerText}
                font-semibold ${alignClass}
                ${isFilled ? "text-gray-200 dark:text-gray-300" : "text-gray-600 dark:text-gray-400"}
                ${col.footerClassName ?? ""}
              `}
            >
              {col.footer}
            </td>
          );
        })}
      </tr>
    </tfoot>
  );
}

export interface TableProps<TData = Record<string, unknown>>
  extends Omit<TableProviderProps<TData>, "children"> {
  size?: TableSize;
  variant?: TableVariant;
  density?: TableDensity;
  selectionMode?: SelectionMode;
  striped?: boolean;
  showSearch?: boolean;
  searchPlaceholder?: string;
  expandable?: boolean;
  renderExpanded?: (row: TData, rowId: string) => React.ReactNode;
  loadingContent?: React.ReactNode;
  emptyContent?: React.ReactNode;
  caption?: React.ReactNode;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  toolbarStartContent?: React.ReactNode;
  toolbarEndContent?: React.ReactNode;
  bottomContent?: React.ReactNode;
  className?: string;
  wrapperClassName?: string;
  tableClassName?: string;
  toolbarClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  rowClassName?: string | ((row: TData, rowId: string) => string);
  cellClassName?: string;
  bottomClassName?: string;
  stickyHeader?: boolean;
  maxHeight?: string;
}

function TableInner<TData = Record<string, unknown>>({
  size = "md",
  variant = "default",
  density = "default",
  selectionMode = "none",
  striped = false,
  showSearch = false,
  searchPlaceholder,
  expandable = false,
  renderExpanded,
  loadingContent,
  emptyContent,
  caption,
  startContent,
  endContent,
  toolbarStartContent,
  toolbarEndContent,
  bottomContent,
  className = "",
  wrapperClassName = "",
  tableClassName = "",
  toolbarClassName = "",
  headerClassName = "",
  bodyClassName = "",
  footerClassName = "",
  rowClassName = "",
  cellClassName = "",
  bottomClassName = "",
  stickyHeader = false,
  maxHeight,
}: Omit<
  TableProps<TData>,
  keyof Omit<TableProviderProps<TData>, "children">
>) {
  const {
    visibleColumns,
    data,
    getRowId,
    isAllSelected,
    isIndeterminate,
    selectAll,
    deselectAll,
    state,
    tableRef,
  } = useTableContext<TData>();

  const s = sizeConfig[size];
  const v = variantConfig[variant];

  const hasToolbar =
    showSearch || !!toolbarStartContent || !!toolbarEndContent;

  const colSpan =
    visibleColumns.length +
    (selectionMode !== "none" ? 1 : 0) +
    (expandable ? 1 : 0);

  const isEmpty = data.length === 0 && !state.loading;

  const filteredData = state.filterState.globalFilter
    ? data.filter((row) =>
        visibleColumns.some((col) => {
          const val = col.accessorFn
            ? col.accessorFn(row)
            : col.accessorKey
              ? (row as Record<string, unknown>)[col.accessorKey as string]
              : undefined;
          return String(val ?? "")
            .toLowerCase()
            .includes(state.filterState.globalFilter.toLowerCase());
        }),
      )
    : data;

  return (
    <div className={`flex flex-col w-full ${className}`}>
      {startContent && <div className="mb-3">{startContent}</div>}

      <div className={`relative w-full overflow-hidden ${v.wrapper} ${wrapperClassName}`}>
        <AnimatePresence>
          {state.loading && (
            <LoadingOverlay size={size} loadingContent={loadingContent} />
          )}
        </AnimatePresence>

        {hasToolbar && (
          <TableToolbar
            size={size}
            variant={variant}
            showSearch={showSearch}
            searchPlaceholder={searchPlaceholder}
            startContent={toolbarStartContent}
            endContent={toolbarEndContent}
            toolbarClassName={toolbarClassName}
          />
        )}

        <div
          className="w-full overflow-x-auto"
          style={maxHeight ? { maxHeight, overflowY: "auto" } : undefined}
        >
          <table
            ref={tableRef}
            className={`w-full border-collapse ${tableClassName}`}
            aria-label={caption ? String(caption) : undefined}
          >
            {caption && (
              <caption className="sr-only">{caption}</caption>
            )}

            <thead
              className={`${v.header} ${headerClassName} ${stickyHeader ? "sticky top-0 z-10" : ""}`}
            >
              <tr>
                {selectionMode === "multiple" && (
                  <th
                    scope="col"
                    className={`${s.headerPx} ${s.headerPy} w-10`}
                  >
                    <Checkbox
                      checked={isAllSelected}
                      indeterminate={isIndeterminate}
                      onChange={isAllSelected ? deselectAll : selectAll}
                      size={size}
                      ariaLabel="Select all rows"
                    />
                  </th>
                )}

                {selectionMode === "single" && (
                  <th scope="col" className={`${s.headerPx} ${s.headerPy} w-10`} />
                )}

                {expandable && (
                  <th scope="col" className={`${s.headerPx} ${s.headerPy} w-10`} />
                )}

                {visibleColumns.map((col) => (
                  <TableHeaderCell
                    key={col.id}
                    column={col}
                    size={size}
                    variant={variant}
                  />
                ))}
              </tr>
            </thead>

            <tbody className={`${v.divider} ${bodyClassName}`}>
              {isEmpty ? (
                <EmptyState
                  size={size}
                  variant={variant}
                  emptyContent={emptyContent}
                  colSpan={colSpan}
                />
              ) : (
                filteredData.map((row, idx) => {
                  const rowId = getRowId(row, idx);
                  return (
                    <TableRow
                      key={rowId}
                      row={row}
                      rowId={rowId}
                      rowIndex={idx}
                      size={size}
                      variant={variant}
                      density={density}
                      selectionMode={selectionMode}
                      striped={striped}
                      expandable={expandable}
                      renderExpanded={renderExpanded}
                      rowClassName={rowClassName}
                      cellClassName={cellClassName}
                    />
                  );
                })
              )}
            </tbody>

            <TableFooterRow
              size={size}
              variant={variant}
              density={density}
              selectionMode={selectionMode}
              expandable={expandable}
              footerClassName={footerClassName}
            />
          </table>
        </div>

        {bottomContent && (
          <div
            className={`${s.footerPx} ${s.footerPy} border-t border-gray-100 dark:border-gray-800 ${bottomClassName}`}
          >
            {bottomContent}
          </div>
        )}
      </div>

      {endContent && <div className="mt-3">{endContent}</div>}
    </div>
  );
}

export function Table<TData = Record<string, unknown>>({
  columns,
  data,
  getRowId,
  size = "md",
  variant = "default",
  density = "default",
  selectionMode = "none",
  loading = false,
  totalItems,
  pageSize,
  currentPage,
  defaultSort,
  defaultGlobalFilter,
  onRowClick,
  onRowDoubleClick,
  onSortChange,
  onSelectionChange,
  onPageChange,
  onPageSizeChange,
  onFilterChange,
  ...rest
}: TableProps<TData>) {
  return (
    <TableProvider
      columns={columns}
      data={data}
      getRowId={getRowId}
      size={size}
      variant={variant}
      density={density}
      selectionMode={selectionMode}
      loading={loading}
      totalItems={totalItems}
      pageSize={pageSize}
      currentPage={currentPage}
      defaultSort={defaultSort}
      defaultGlobalFilter={defaultGlobalFilter}
      onRowClick={onRowClick}
      onRowDoubleClick={onRowDoubleClick}
      onSortChange={onSortChange}
      onSelectionChange={onSelectionChange}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      onFilterChange={onFilterChange}
    >
      <TableInner
        size={size}
        variant={variant}
        density={density}
        selectionMode={selectionMode}
        {...rest}
      />
    </TableProvider>
  );
}

export { TableProvider, useTableContext };
export type {
  TableColumn,
  TableSize,
  TableVariant,
  TableDensity,
  SelectionMode,
  SortDirection,
};