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
  GripVertical,
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

// ─── Size Config ────────────────────────────────────────────────────────────

const sizeConfig = {
  sm: {
    headerPx: "px-2.5", headerPy: "py-2", headerText: "text-xs",
    cellPx: "px-2.5", cellText: "text-xs", iconSize: 12,
    checkboxSize: "w-3.5 h-3.5", expandSize: "w-5 h-5",
    toolbarGap: "gap-2", toolbarPy: "py-2", toolbarPx: "px-3",
    searchH: "h-7", searchPx: "px-2.5", searchText: "text-xs",
    footerPx: "px-3", footerPy: "py-2", footerText: "text-xs",
  },
  md: {
    headerPx: "px-3.5", headerPy: "py-3", headerText: "text-sm",
    cellPx: "px-3.5", cellText: "text-sm", iconSize: 14,
    checkboxSize: "w-4 h-4", expandSize: "w-6 h-6",
    toolbarGap: "gap-3", toolbarPy: "py-2.5", toolbarPx: "px-4",
    searchH: "h-8", searchPx: "px-3", searchText: "text-sm",
    footerPx: "px-4", footerPy: "py-3", footerText: "text-sm",
  },
  lg: {
    headerPx: "px-4", headerPy: "py-3.5", headerText: "text-sm",
    cellPx: "px-4", cellText: "text-sm", iconSize: 15,
    checkboxSize: "w-4 h-4", expandSize: "w-6 h-6",
    toolbarGap: "gap-3", toolbarPy: "py-3", toolbarPx: "px-5",
    searchH: "h-9", searchPx: "px-3.5", searchText: "text-sm",
    footerPx: "px-5", footerPy: "py-3", footerText: "text-sm",
  },
  xl: {
    headerPx: "px-5", headerPy: "py-4", headerText: "text-sm",
    cellPx: "px-5", cellText: "text-sm", iconSize: 16,
    checkboxSize: "w-4.5 h-4.5", expandSize: "w-7 h-7",
    toolbarGap: "gap-4", toolbarPy: "py-3.5", toolbarPx: "px-6",
    searchH: "h-10", searchPx: "px-4", searchText: "text-base",
    footerPx: "px-6", footerPy: "py-3.5", footerText: "text-sm",
  },
};

const densityCellPy: Record<TableDensity, string> = {
  compact: "py-1.5",
  default: "py-3",
  comfortable: "py-4",
  spacious: "py-5",
};

const variantConfig: Record<TableVariant, {
  wrapper: string; header: string; headerCell: string;
  row: string; rowHover: string; rowSelected: string;
  cell: string; divider: string; footer: string; toolbar: string;
}> = {
  default: {
    wrapper: "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm shadow-black/5 dark:shadow-black/20",
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
    wrapper: "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm shadow-black/5 dark:shadow-black/20",
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
    wrapper: "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl",
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

// ─── Sort Icon ───────────────────────────────────────────────────────────────

function SortIcon({ columnId, iconSize }: { columnId: string; iconSize: number }) {
  const { state } = useTableContext();
  const { sortState } = state;
  const isActive = sortState.columnId === columnId;
  const direction = isActive ? sortState.direction : null;

  return (
    <span className="flex flex-col items-center justify-center shrink-0 ml-1">
      <AnimatePresence mode="wait" initial={false}>
        {!isActive || direction === null ? (
          <motion.span key="unsorted"
            initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }} transition={{ duration: 0.1 }}>
            <ChevronsUpDown size={iconSize} className="text-gray-300 dark:text-gray-600" />
          </motion.span>
        ) : direction === "asc" ? (
          <motion.span key="asc"
            initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }} transition={{ duration: 0.12 }}>
            <ChevronUp size={iconSize} className="text-gray-900 dark:text-white" />
          </motion.span>
        ) : (
          <motion.span key="desc"
            initial={{ opacity: 0, y: -3 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 3 }} transition={{ duration: 0.12 }}>
            <ChevronDown size={iconSize} className="text-gray-900 dark:text-white" />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

// ─── Checkbox ────────────────────────────────────────────────────────────────

interface CheckboxProps {
  checked: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  onChange: () => void;
  size: TableSize;
  ariaLabel?: string;
}

function Checkbox({ checked, indeterminate = false, disabled = false, onChange, size, ariaLabel }: CheckboxProps) {
  const s = sizeConfig[size];
  return (
    <button type="button" role="checkbox"
      aria-checked={indeterminate ? "mixed" : checked}
      aria-label={ariaLabel} disabled={disabled}
      onClick={(e) => { e.stopPropagation(); onChange(); }}
      className={`
        shrink-0 ${s.checkboxSize} flex items-center justify-center
        rounded border transition-all duration-100 focus:outline-none
        focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:ring-offset-1
        ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
        ${checked || indeterminate
          ? "bg-gray-900 dark:bg-white border-gray-900 dark:border-white"
          : "bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 hover:border-gray-500 dark:hover:border-gray-400"}
      `}>
      <AnimatePresence mode="wait" initial={false}>
        {indeterminate ? (
          <motion.span key="minus" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.1 }}>
            <Minus size={10} className="text-white dark:text-gray-900" strokeWidth={3} />
          </motion.span>
        ) : checked ? (
          <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.1 }}>
            <Check size={10} className="text-white dark:text-gray-900" strokeWidth={3} />
          </motion.span>
        ) : null}
      </AnimatePresence>
    </button>
  );
}

// ─── Column Resize Handle ────────────────────────────────────────────────────

interface ResizeHandleProps {
  columnId: string;
  minWidth?: number;
  maxWidth?: number;
}

function ResizeHandle({ columnId, minWidth = 60, maxWidth = 800 }: ResizeHandleProps) {
  const { setColumnWidth, state } = useTableContext();
  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(0);
  const thRef = useRef<HTMLElement | null>(null);
  const [isResizing, setIsResizing] = useState(false);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const th = (e.currentTarget as HTMLElement).closest("th");
    if (!th) return;
    thRef.current = th;
    startXRef.current = e.clientX;
    startWidthRef.current = th.getBoundingClientRect().width;
    setIsResizing(true);

    const onMouseMove = (ev: MouseEvent) => {
      const delta = ev.clientX - startXRef.current;
      const newWidth = Math.min(maxWidth, Math.max(minWidth, startWidthRef.current + delta));
      setColumnWidth(columnId, newWidth);
      if (thRef.current) thRef.current.style.width = `${newWidth}px`;
    };

    const onMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }, [columnId, minWidth, maxWidth, setColumnWidth]);

  return (
    <div
      onMouseDown={onMouseDown}
      className={`
        absolute right-0 top-0 h-full w-4 flex items-center justify-center
        cursor-col-resize z-20 group select-none
      `}
      aria-hidden="true"
    >
      <div className={`
        w-[2px] h-4/5 rounded-full transition-all duration-150
        ${isResizing
          ? "bg-gray-900 dark:bg-white scale-y-110"
          : "bg-gray-200 dark:bg-gray-700 group-hover:bg-gray-400 dark:group-hover:bg-gray-500"}
      `} />
    </div>
  );
}

// ─── Column Drag Reorder ─────────────────────────────────────────────────────

interface ColumnDragState {
  draggingId: string | null;
  overId: string | null;
}

// ─── Toolbar ─────────────────────────────────────────────────────────────────

interface TableToolbarProps {
  size: TableSize;
  variant: TableVariant;
  showSearch?: boolean;
  searchPlaceholder?: string;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  toolbarClassName?: string;
}

function TableToolbar({ size, variant, showSearch = true, searchPlaceholder = "Search...", startContent, endContent, toolbarClassName = "" }: TableToolbarProps) {
  const { state, setGlobalFilter } = useTableContext();
  const s = sizeConfig[size];
  const v = variantConfig[variant];
  if (!showSearch && !startContent && !endContent) return null;

  return (
    <div className={`flex items-center justify-between flex-wrap gap-2 ${s.toolbarPx} ${s.toolbarPy} ${v.toolbar} ${toolbarClassName}`}>
      <div className={`flex items-center ${s.toolbarGap} flex-wrap`}>
        {startContent}
        {showSearch && (
          <div className={`flex items-center gap-2 ${s.searchH} ${s.searchPx} rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 min-w-[180px]`}>
            <Search size={s.iconSize} className="shrink-0 text-gray-400 dark:text-gray-500" />
            <input type="search" value={state.filterState.globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder={searchPlaceholder}
              className={`flex-1 min-w-0 bg-transparent border-0 outline-none ring-0 ${s.searchText} text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600`}
            />
            {state.filterState.globalFilter && (
              <button type="button" onClick={() => setGlobalFilter("")}
                className="shrink-0 text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 transition-colors">
                <X size={s.iconSize - 2} />
              </button>
            )}
          </div>
        )}
      </div>
      {endContent && <div className={`flex items-center ${s.toolbarGap}`}>{endContent}</div>}
    </div>
  );
}

// ─── Header Cell (with resize + column drag) ─────────────────────────────────

interface TableHeaderCellProps<TData> {
  column: TableColumn<TData>;
  size: TableSize;
  variant: TableVariant;
  resizable?: boolean;
  columnDrag: ColumnDragState;
  onColumnDragStart: (id: string) => void;
  onColumnDragOver: (id: string) => void;
  onColumnDrop: () => void;
  onColumnDragEnd: () => void;
}

function TableHeaderCell<TData>({
  column, size, variant, resizable,
  columnDrag, onColumnDragStart, onColumnDragOver, onColumnDrop, onColumnDragEnd,
}: TableHeaderCellProps<TData>) {
  const { toggleSort, state } = useTableContext<TData>();
  const s = sizeConfig[size];
  const v = variantConfig[variant];
  const isSorted = state.sortState.columnId === column.id;
  const isFilled = variant === "filled";

  const isDraggingOver = columnDrag.overId === column.id && columnDrag.draggingId !== column.id;
  const isDragging = columnDrag.draggingId === column.id;

  const alignClass = column.align === "center" ? "text-center justify-center"
    : column.align === "right" ? "text-right justify-end"
    : "text-left justify-start";

  const colWidth = state.columnWidths[column.id];

  return (
    <th
      scope="col"
      draggable
      onDragStart={(e) => { e.dataTransfer.effectAllowed = "move"; onColumnDragStart(column.id); }}
      onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; onColumnDragOver(column.id); }}
      onDrop={(e) => { e.preventDefault(); onColumnDrop(); }}
      onDragEnd={onColumnDragEnd}
      style={{
        width: colWidth ? `${colWidth}px` : column.width,
        minWidth: column.minWidth,
        maxWidth: column.maxWidth,
        position: "relative",
      }}
      className={`
        ${s.headerPx} ${s.headerPy} ${s.headerText}
        ${v.headerCell} ${alignClass}
        ${column.sortable ? "select-none" : ""}
        ${column.headerClassName ?? ""}
        whitespace-nowrap transition-colors duration-100
        ${isDraggingOver ? "bg-gray-100 dark:bg-gray-700/60" : ""}
        ${isDragging ? "opacity-40" : ""}
      `}
    >
      {/* Drag handle */}
      <span
        className="inline-flex items-center justify-center mr-1 cursor-grab active:cursor-grabbing text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 transition-colors shrink-0"
        onMouseDown={(e) => e.stopPropagation()}
        aria-hidden="true"
      >
        <GripVertical size={s.iconSize - 1} />
      </span>

      {column.sortable ? (
        <button type="button" onClick={() => toggleSort(column.id)}
          className={`
            inline-flex items-center gap-0.5 ${alignClass}
            transition-colors duration-100 rounded focus:outline-none focus-visible:ring-2
            ${isFilled
              ? isSorted ? "text-white dark:text-gray-100" : "text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-100"
              : isSorted ? "text-gray-900 dark:text-white" : "hover:text-gray-700 dark:hover:text-gray-200"}
          `}>
          <span>{column.header}</span>
          <SortIcon columnId={column.id} iconSize={s.iconSize} />
        </button>
      ) : (
        <span className={`inline-flex items-center ${alignClass}`}>{column.header}</span>
      )}

      {/* Resize handle */}
      {(resizable || column.resizable) && (
        <ResizeHandle
          columnId={column.id}
          minWidth={typeof column.minWidth === "number" ? column.minWidth : 60}
          maxWidth={typeof column.maxWidth === "number" ? column.maxWidth : 800}
        />
      )}
    </th>
  );
}

// ─── Row (with row drag reorder) ─────────────────────────────────────────────

interface RowDragState {
  draggingId: string | null;
  overId: string | null;
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
  rowReorder?: boolean;
  rowDrag: RowDragState;
  onRowDragStart: (id: string) => void;
  onRowDragOver: (id: string) => void;
  onRowDrop: () => void;
  onRowDragEnd: () => void;
}

function TableRow<TData>({
  row, rowId, rowIndex, size, variant, density, selectionMode,
  striped = false, expandable = false, renderExpanded,
  rowClassName = "", cellClassName = "",
  rowReorder = false,
  rowDrag, onRowDragStart, onRowDragOver, onRowDrop, onRowDragEnd,
}: TableRowProps<TData>) {
  const { visibleColumns, isRowSelected, toggleRowSelection, isRowExpanded, toggleRowExpanded, onRowClick, onRowDoubleClick } = useTableContext<TData>();
  const s = sizeConfig[size];
  const v = variantConfig[variant];
  const isSelected = isRowSelected(rowId);
  const isExpanded = isRowExpanded(rowId);
  const isEven = rowIndex % 2 === 0;

  const isDraggingOver = rowDrag.overId === rowId && rowDrag.draggingId !== rowId;
  const isDragging = rowDrag.draggingId === rowId;

  const resolvedRowClass = typeof rowClassName === "function" ? rowClassName(row, rowId) : rowClassName;

  const handleRowClick = useCallback(() => {
    onRowClick?.(row, rowId);
    if (selectionMode !== "none") toggleRowSelection(rowId);
  }, [row, rowId, selectionMode, toggleRowSelection, onRowClick]);

  const handleRowDoubleClick = useCallback(() => {
    onRowDoubleClick?.(row, rowId);
  }, [row, rowId, onRowDoubleClick]);

  const colSpan = visibleColumns.length + (selectionMode !== "none" ? 1 : 0) + (expandable ? 1 : 0) + (rowReorder ? 1 : 0);

  return (
    <>
      <tr
        draggable={rowReorder}
        onDragStart={rowReorder ? (e) => { e.dataTransfer.effectAllowed = "move"; onRowDragStart(rowId); } : undefined}
        onDragOver={rowReorder ? (e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; onRowDragOver(rowId); } : undefined}
        onDrop={rowReorder ? (e) => { e.preventDefault(); onRowDrop(); } : undefined}
        onDragEnd={rowReorder ? onRowDragEnd : undefined}
        onClick={handleRowClick}
        onDoubleClick={handleRowDoubleClick}
        className={`
          ${v.row}
          ${isSelected ? v.rowSelected : striped && !isEven ? "bg-gray-50/60 dark:bg-gray-800/30" : ""}
          ${!isSelected && (onRowClick || selectionMode !== "none") ? v.rowHover : ""}
          ${onRowClick || selectionMode !== "none" ? "cursor-pointer" : ""}
          transition-all duration-100
          ${isDragging ? "opacity-40 scale-[0.99]" : ""}
          ${isDraggingOver ? "border-t-2 border-t-gray-900 dark:border-t-white" : ""}
          ${resolvedRowClass}
        `}
        aria-selected={selectionMode !== "none" ? isSelected : undefined}
      >
        {/* Row drag handle */}
        {rowReorder && (
          <td
            className={`${s.cellPx} ${densityCellPy[density]} w-8 shrink-0`}
            onClick={(e) => e.stopPropagation()}
          >
            <span className="flex items-center justify-center text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 cursor-grab active:cursor-grabbing transition-colors">
              <GripVertical size={s.iconSize} />
            </span>
          </td>
        )}

        {selectionMode !== "none" && (
          <td className={`${s.cellPx} ${densityCellPy[density]} w-10 shrink-0`} onClick={(e) => e.stopPropagation()}>
            <Checkbox checked={isSelected} onChange={() => toggleRowSelection(rowId)} size={size} ariaLabel={`Select row ${rowIndex + 1}`} />
          </td>
        )}

        {expandable && (
          <td className={`${s.cellPx} ${densityCellPy[density]} w-10 shrink-0`} onClick={(e) => { e.stopPropagation(); toggleRowExpanded(rowId); }}>
            <button type="button" className={`${s.expandSize} flex items-center justify-center rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-100`} aria-label={isExpanded ? "Collapse row" : "Expand row"}>
              <motion.span animate={{ rotate: isExpanded ? 90 : 0 }} transition={{ duration: 0.15, ease: "easeOut" }} className="flex items-center justify-center">
                <ChevronRight size={s.iconSize} />
              </motion.span>
            </button>
          </td>
        )}

        {visibleColumns.map((col) => {
          const rawValue = col.accessorFn ? col.accessorFn(row)
            : col.accessorKey ? (row as Record<string, unknown>)[col.accessorKey as string]
            : undefined;
          const cellContent = col.cell ? col.cell(rawValue, row, rowIndex) : (rawValue as React.ReactNode) ?? null;
          const alignClass = col.align === "center" ? "text-center" : col.align === "right" ? "text-right" : "text-left";
          const colWidth = undefined; // width handled at th level

          return (
            <td key={col.id}
              style={{ width: col.width, minWidth: col.minWidth, maxWidth: col.maxWidth }}
              className={`${s.cellPx} ${densityCellPy[density]} ${s.cellText} ${v.cell} ${alignClass} ${col.cellClassName ?? ""} ${cellClassName}`}>
              {cellContent}
            </td>
          );
        })}
      </tr>

      <AnimatePresence initial={false}>
        {expandable && isExpanded && renderExpanded && (
          <motion.tr key={`${rowId}-expanded`}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
            <td colSpan={colSpan} className="p-0">
              <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.18, ease: "easeOut" }} className="overflow-hidden">
                <div className={`${s.cellPx} ${densityCellPy[density]} bg-gray-50/60 dark:bg-gray-800/40 border-b border-gray-100 dark:border-gray-800`}>
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

// ─── Loading Overlay ──────────────────────────────────────────────────────────

function LoadingOverlay({ size, loadingContent }: { size: TableSize; loadingContent?: React.ReactNode }) {
  const s = sizeConfig[size];
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
      className="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-gray-900/70 backdrop-blur-[1px] z-10 rounded-xl">
      {loadingContent ?? (
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <Loader2 size={s.iconSize + 4} className="animate-spin" />
          <span className={`${s.searchText} font-medium`}>Loading...</span>
        </div>
      )}
    </motion.div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ size, emptyContent, colSpan }: { size: TableSize; variant: TableVariant; emptyContent?: React.ReactNode; colSpan: number }) {
  const s = sizeConfig[size];
  return (
    <tr>
      <td colSpan={colSpan}>
        <div className={`flex flex-col items-center justify-center py-12 ${s.searchText} text-gray-400 dark:text-gray-600`}>
          {emptyContent ?? (<><ArrowUpDown size={28} className="mb-3 opacity-40" /><span className="font-medium">No results found</span></>)}
        </div>
      </td>
    </tr>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

interface TableFooterProps<TData> {
  size: TableSize; variant: TableVariant; density: TableDensity;
  selectionMode: SelectionMode; expandable: boolean; rowReorder: boolean; footerClassName?: string;
}

function TableFooterRow<TData>({ size, variant, density, selectionMode, expandable, rowReorder, footerClassName = "" }: TableFooterProps<TData>) {
  const { visibleColumns } = useTableContext<TData>();
  const s = sizeConfig[size];
  const v = variantConfig[variant];
  const hasFooter = visibleColumns.some((col) => col.footer !== undefined);
  if (!hasFooter) return null;
  const isFilled = variant === "filled";

  return (
    <tfoot>
      <tr className={`${v.footer} ${footerClassName}`}>
        {rowReorder && <td className={`${s.cellPx} ${densityCellPy[density]}`} />}
        {selectionMode !== "none" && <td className={`${s.cellPx} ${densityCellPy[density]}`} />}
        {expandable && <td className={`${s.cellPx} ${densityCellPy[density]}`} />}
        {visibleColumns.map((col) => {
          const alignClass = col.align === "center" ? "text-center" : col.align === "right" ? "text-right" : "text-left";
          return (
            <td key={col.id} className={`${s.cellPx} ${densityCellPy[density]} ${s.footerText} font-semibold ${alignClass} ${isFilled ? "text-gray-200 dark:text-gray-300" : "text-gray-600 dark:text-gray-400"} ${col.footerClassName ?? ""}`}>
              {col.footer}
            </td>
          );
        })}
      </tr>
    </tfoot>
  );
}

// ─── Table Inner ──────────────────────────────────────────────────────────────

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
  /** Enable column resize via drag handles on column borders */
  resizableColumns?: boolean;
  /** Enable column reorder via drag-and-drop on column headers */
  columnReorder?: boolean;
  /** Enable row reorder via drag-and-drop on row grip handles */
  rowReorder?: boolean;
}

function TableInner<TData = Record<string, unknown>>({
  size = "md", variant = "default", density = "default", selectionMode = "none",
  striped = false, showSearch = false, searchPlaceholder,
  expandable = false, renderExpanded,
  loadingContent, emptyContent, caption,
  startContent, endContent, toolbarStartContent, toolbarEndContent, bottomContent,
  className = "", wrapperClassName = "", tableClassName = "",
  toolbarClassName = "", headerClassName = "", bodyClassName = "",
  footerClassName = "", rowClassName = "", cellClassName = "", bottomClassName = "",
  stickyHeader = false, maxHeight,
  resizableColumns = false,
  columnReorder = false,
  rowReorder = false,
}: Omit<TableProps<TData>, keyof Omit<TableProviderProps<TData>, "children">>) {
  const {
    visibleColumns, orderedData, getRowId,
    isAllSelected, isIndeterminate, selectAll, deselectAll,
    state, tableRef, setColumnOrder, setRowOrder,
  } = useTableContext<TData>();

  const s = sizeConfig[size];
  const v = variantConfig[variant];
  const hasToolbar = showSearch || !!toolbarStartContent || !!toolbarEndContent;

  const colSpan = visibleColumns.length
    + (selectionMode !== "none" ? 1 : 0)
    + (expandable ? 1 : 0)
    + (rowReorder ? 1 : 0);

  // ── Column Drag State ──
  const [colDrag, setColDrag] = useState<ColumnDragState>({ draggingId: null, overId: null });

  const onColumnDragStart = useCallback((id: string) => {
    setColDrag({ draggingId: id, overId: null });
  }, []);

  const onColumnDragOver = useCallback((id: string) => {
    setColDrag((prev) => ({ ...prev, overId: id }));
  }, []);

  const onColumnDrop = useCallback(() => {
    if (!colDrag.draggingId || !colDrag.overId || colDrag.draggingId === colDrag.overId) return;
    const currentOrder = state.columnOrder;
    const from = currentOrder.indexOf(colDrag.draggingId);
    const to = currentOrder.indexOf(colDrag.overId);
    if (from === -1 || to === -1) return;
    const next = [...currentOrder];
    next.splice(from, 1);
    next.splice(to, 0, colDrag.draggingId);
    setColumnOrder(next);
  }, [colDrag, state.columnOrder, setColumnOrder]);

  const onColumnDragEnd = useCallback(() => {
    setColDrag({ draggingId: null, overId: null });
  }, []);

  // ── Row Drag State ──
  const [rowDrag, setRowDrag] = useState<RowDragState>({ draggingId: null, overId: null });

  const onRowDragStart = useCallback((id: string) => {
    setRowDrag({ draggingId: id, overId: null });
  }, []);

  const onRowDragOver = useCallback((id: string) => {
    setRowDrag((prev) => ({ ...prev, overId: id }));
  }, []);

  const onRowDrop = useCallback(() => {
    if (!rowDrag.draggingId || !rowDrag.overId || rowDrag.draggingId === rowDrag.overId) return;
    const currentOrder = state.rowOrder;
    const from = currentOrder.indexOf(rowDrag.draggingId);
    const to = currentOrder.indexOf(rowDrag.overId);
    if (from === -1 || to === -1) return;
    const next = [...currentOrder];
    next.splice(from, 1);
    next.splice(to, 0, rowDrag.draggingId);
    setRowOrder(next);
  }, [rowDrag, state.rowOrder, setRowOrder]);

  const onRowDragEnd = useCallback(() => {
    setRowDrag({ draggingId: null, overId: null });
  }, []);

  // ── Filter ──
  const filteredData = state.filterState.globalFilter
    ? orderedData.filter((row) =>
        visibleColumns.some((col) => {
          const val = col.accessorFn ? col.accessorFn(row)
            : col.accessorKey ? (row as Record<string, unknown>)[col.accessorKey as string]
            : undefined;
          return String(val ?? "").toLowerCase().includes(state.filterState.globalFilter.toLowerCase());
        }),
      )
    : orderedData;

  const isEmpty = filteredData.length === 0 && !state.loading;

  return (
    <div className={`flex flex-col w-full ${className}`}>
      {startContent && <div className="mb-3">{startContent}</div>}

      <div className={`relative w-full overflow-hidden ${v.wrapper} ${wrapperClassName}`}>
        <AnimatePresence>
          {state.loading && <LoadingOverlay size={size} loadingContent={loadingContent} />}
        </AnimatePresence>

        {hasToolbar && (
          <TableToolbar size={size} variant={variant} showSearch={showSearch}
            searchPlaceholder={searchPlaceholder} startContent={toolbarStartContent}
            endContent={toolbarEndContent} toolbarClassName={toolbarClassName} />
        )}

        <div className="w-full overflow-x-auto" style={maxHeight ? { maxHeight, overflowY: "auto" } : undefined}>
          <table ref={tableRef} className={`w-full border-collapse ${tableClassName}`}
            aria-label={caption ? String(caption) : undefined}>
            {caption && <caption className="sr-only">{caption}</caption>}

            <thead className={`${v.header} ${headerClassName} ${stickyHeader ? "sticky top-0 z-10" : ""}`}>
              <tr>
                {/* Row reorder spacer in header */}
                {rowReorder && <th scope="col" className={`${s.headerPx} ${s.headerPy} w-8`} />}

                {selectionMode === "multiple" && (
                  <th scope="col" className={`${s.headerPx} ${s.headerPy} w-10`}>
                    <Checkbox checked={isAllSelected} indeterminate={isIndeterminate}
                      onChange={isAllSelected ? deselectAll : selectAll} size={size} ariaLabel="Select all rows" />
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
                    resizable={resizableColumns}
                    columnDrag={columnReorder ? colDrag : { draggingId: null, overId: null }}
                    onColumnDragStart={columnReorder ? onColumnDragStart : () => {}}
                    onColumnDragOver={columnReorder ? onColumnDragOver : () => {}}
                    onColumnDrop={columnReorder ? onColumnDrop : () => {}}
                    onColumnDragEnd={columnReorder ? onColumnDragEnd : () => {}}
                  />
                ))}
              </tr>
            </thead>

            <tbody className={`${v.divider} ${bodyClassName}`}>
              {isEmpty ? (
                <EmptyState size={size} variant={variant} emptyContent={emptyContent} colSpan={colSpan} />
              ) : (
                filteredData.map((row, idx) => {
                  const rowId = getRowId(row, idx);
                  return (
                    <TableRow
                      key={rowId}
                      row={row} rowId={rowId} rowIndex={idx}
                      size={size} variant={variant} density={density}
                      selectionMode={selectionMode} striped={striped}
                      expandable={expandable} renderExpanded={renderExpanded}
                      rowClassName={rowClassName} cellClassName={cellClassName}
                      rowReorder={rowReorder}
                      rowDrag={rowDrag}
                      onRowDragStart={onRowDragStart}
                      onRowDragOver={onRowDragOver}
                      onRowDrop={onRowDrop}
                      onRowDragEnd={onRowDragEnd}
                    />
                  );
                })
              )}
            </tbody>

            <TableFooterRow
              size={size} variant={variant} density={density}
              selectionMode={selectionMode} expandable={expandable}
              rowReorder={rowReorder} footerClassName={footerClassName}
            />
          </table>
        </div>

        {bottomContent && (
          <div className={`${s.footerPx} ${s.footerPy} border-t border-gray-100 dark:border-gray-800 ${bottomClassName}`}>
            {bottomContent}
          </div>
        )}
      </div>

      {endContent && <div className="mt-3">{endContent}</div>}
    </div>
  );
}

// ─── Public Table ─────────────────────────────────────────────────────────────

export function Table<TData = Record<string, unknown>>({
  columns, data, getRowId,
  size = "md", variant = "default", density = "default", selectionMode = "none",
  loading = false, totalItems, pageSize, currentPage,
  defaultSort, defaultGlobalFilter,
  onRowClick, onRowDoubleClick, onSortChange, onSelectionChange,
  onPageChange, onPageSizeChange, onFilterChange,
  onColumnOrderChange, onRowOrderChange,
  ...rest
}: TableProps<TData>) {
  return (
    <TableProvider
      columns={columns} data={data} getRowId={getRowId}
      size={size} variant={variant} density={density} selectionMode={selectionMode}
      loading={loading} totalItems={totalItems} pageSize={pageSize} currentPage={currentPage}
      defaultSort={defaultSort} defaultGlobalFilter={defaultGlobalFilter}
      onRowClick={onRowClick} onRowDoubleClick={onRowDoubleClick}
      onSortChange={onSortChange} onSelectionChange={onSelectionChange}
      onPageChange={onPageChange} onPageSizeChange={onPageSizeChange}
      onFilterChange={onFilterChange}
      onColumnOrderChange={onColumnOrderChange}
      onRowOrderChange={onRowOrderChange}
    >
      <TableInner size={size} variant={variant} density={density} selectionMode={selectionMode} {...rest} />
    </TableProvider>
  );
}

export { TableProvider, useTableContext };
export type { TableColumn, TableSize, TableVariant, TableDensity, SelectionMode, SortDirection };