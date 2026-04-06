import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useRef,
} from "react";

export type TableSize = "sm" | "md" | "lg" | "xl";
export type TableVariant = "default" | "filled" | "ghost" | "outline";
export type TableDensity = "compact" | "default" | "comfortable" | "spacious";
export type SortDirection = "asc" | "desc" | null;
export type SelectionMode = "none" | "single" | "multiple";

export interface TableColumn<TData = Record<string, unknown>> {
  id: string;
  header: React.ReactNode;
  accessorKey?: keyof TData;
  accessorFn?: (row: TData) => React.ReactNode;
  cell?: (value: unknown, row: TData, rowIndex: number) => React.ReactNode;
  footer?: React.ReactNode;
  width?: number | string;
  minWidth?: number | string;
  maxWidth?: number | string;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  resizable?: boolean;
  pinned?: "left" | "right" | false;
  hidden?: boolean;
  headerClassName?: string;
  cellClassName?: string;
  footerClassName?: string;
  meta?: Record<string, unknown>;
}

export interface TableSortState {
  columnId: string | null;
  direction: SortDirection;
}

export interface TableFilterState {
  globalFilter: string;
  columnFilters: Record<string, string>;
}

export interface TablePaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
}

export interface TableState {
  sortState: TableSortState;
  filterState: TableFilterState;
  selectedRows: Set<string>;
  expandedRows: Set<string>;
  columnVisibility: Record<string, boolean>;
  columnOrder: string[];
  columnWidths: Record<string, number>;
  pinnedLeft: string[];
  pinnedRight: string[];
  pagination: TablePaginationState;
  loading: boolean;
  selectionMode: SelectionMode;
  size: TableSize;
  variant: TableVariant;
  density: TableDensity;
  rowOrder: string[]; // tracks reordered row ids
}

type TableAction =
  | { type: "SET_SORT"; payload: { columnId: string; direction: SortDirection } }
  | { type: "CLEAR_SORT" }
  | { type: "SET_GLOBAL_FILTER"; payload: string }
  | { type: "SET_COLUMN_FILTER"; payload: { columnId: string; value: string } }
  | { type: "CLEAR_COLUMN_FILTER"; payload: string }
  | { type: "CLEAR_ALL_FILTERS" }
  | { type: "SELECT_ROW"; payload: string }
  | { type: "DESELECT_ROW"; payload: string }
  | { type: "TOGGLE_ROW_SELECTION"; payload: string }
  | { type: "SELECT_ALL"; payload: string[] }
  | { type: "DESELECT_ALL" }
  | { type: "TOGGLE_ROW_EXPANDED"; payload: string }
  | { type: "EXPAND_ALL"; payload: string[] }
  | { type: "COLLAPSE_ALL" }
  | { type: "SET_COLUMN_VISIBILITY"; payload: { columnId: string; visible: boolean } }
  | { type: "SET_COLUMN_ORDER"; payload: string[] }
  | { type: "SET_COLUMN_WIDTH"; payload: { columnId: string; width: number } }
  | { type: "SET_ROW_ORDER"; payload: string[] }
  | { type: "SET_PAGE"; payload: number }
  | { type: "SET_PAGE_SIZE"; payload: number }
  | { type: "SET_TOTAL_ITEMS"; payload: number }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "RESET" };

function tableReducer(state: TableState, action: TableAction): TableState {
  switch (action.type) {
    case "SET_SORT":
      return {
        ...state,
        sortState: {
          columnId: action.payload.columnId,
          direction: action.payload.direction,
        },
      };
    case "CLEAR_SORT":
      return { ...state, sortState: { columnId: null, direction: null } };
    case "SET_GLOBAL_FILTER":
      return {
        ...state,
        filterState: { ...state.filterState, globalFilter: action.payload },
        pagination: { ...state.pagination, currentPage: 1 },
      };
    case "SET_COLUMN_FILTER":
      return {
        ...state,
        filterState: {
          ...state.filterState,
          columnFilters: {
            ...state.filterState.columnFilters,
            [action.payload.columnId]: action.payload.value,
          },
        },
        pagination: { ...state.pagination, currentPage: 1 },
      };
    case "CLEAR_COLUMN_FILTER": {
      const { [action.payload]: _, ...rest } = state.filterState.columnFilters;
      return {
        ...state,
        filterState: { ...state.filterState, columnFilters: rest },
      };
    }
    case "CLEAR_ALL_FILTERS":
      return {
        ...state,
        filterState: { globalFilter: "", columnFilters: {} },
        pagination: { ...state.pagination, currentPage: 1 },
      };
    case "SELECT_ROW": {
      const next = new Set(
        state.selectionMode === "single" ? [] : state.selectedRows,
      );
      next.add(action.payload);
      return { ...state, selectedRows: next };
    }
    case "DESELECT_ROW": {
      const next = new Set(state.selectedRows);
      next.delete(action.payload);
      return { ...state, selectedRows: next };
    }
    case "TOGGLE_ROW_SELECTION": {
      const next = new Set(
        state.selectionMode === "single" ? [] : state.selectedRows,
      );
      if (next.has(action.payload)) next.delete(action.payload);
      else next.add(action.payload);
      return { ...state, selectedRows: next };
    }
    case "SELECT_ALL":
      return { ...state, selectedRows: new Set(action.payload) };
    case "DESELECT_ALL":
      return { ...state, selectedRows: new Set() };
    case "TOGGLE_ROW_EXPANDED": {
      const next = new Set(state.expandedRows);
      if (next.has(action.payload)) next.delete(action.payload);
      else next.add(action.payload);
      return { ...state, expandedRows: next };
    }
    case "EXPAND_ALL":
      return { ...state, expandedRows: new Set(action.payload) };
    case "COLLAPSE_ALL":
      return { ...state, expandedRows: new Set() };
    case "SET_COLUMN_VISIBILITY":
      return {
        ...state,
        columnVisibility: {
          ...state.columnVisibility,
          [action.payload.columnId]: action.payload.visible,
        },
      };
    case "SET_COLUMN_ORDER":
      return { ...state, columnOrder: action.payload };
    case "SET_COLUMN_WIDTH":
      return {
        ...state,
        columnWidths: {
          ...state.columnWidths,
          [action.payload.columnId]: action.payload.width,
        },
      };
    case "SET_ROW_ORDER":
      return { ...state, rowOrder: action.payload };
    case "SET_PAGE":
      return {
        ...state,
        pagination: { ...state.pagination, currentPage: action.payload },
      };
    case "SET_PAGE_SIZE":
      return {
        ...state,
        pagination: {
          ...state.pagination,
          pageSize: action.payload,
          currentPage: 1,
        },
      };
    case "SET_TOTAL_ITEMS":
      return {
        ...state,
        pagination: { ...state.pagination, totalItems: action.payload },
      };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "RESET":
      return {
        ...state,
        sortState: { columnId: null, direction: null },
        filterState: { globalFilter: "", columnFilters: {} },
        selectedRows: new Set(),
        expandedRows: new Set(),
        columnWidths: {},
        pagination: { ...state.pagination, currentPage: 1 },
      };
    default:
      return state;
  }
}

export interface TableContextValue<TData = Record<string, unknown>> {
  state: TableState;
  dispatch: React.Dispatch<TableAction>;
  columns: TableColumn<TData>[];
  data: TData[];
  getRowId: (row: TData, index: number) => string;
  setSort: (columnId: string, direction: SortDirection) => void;
  toggleSort: (columnId: string) => void;
  clearSort: () => void;
  setGlobalFilter: (value: string) => void;
  setColumnFilter: (columnId: string, value: string) => void;
  clearColumnFilter: (columnId: string) => void;
  clearAllFilters: () => void;
  selectRow: (rowId: string) => void;
  deselectRow: (rowId: string) => void;
  toggleRowSelection: (rowId: string) => void;
  selectAll: () => void;
  deselectAll: () => void;
  isRowSelected: (rowId: string) => boolean;
  isAllSelected: boolean;
  isIndeterminate: boolean;
  toggleRowExpanded: (rowId: string) => void;
  isRowExpanded: (rowId: string) => boolean;
  setColumnVisibility: (columnId: string, visible: boolean) => void;
  setColumnOrder: (order: string[]) => void;
  setColumnWidth: (columnId: string, width: number) => void;
  setRowOrder: (order: string[]) => void;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setTotalItems: (total: number) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
  visibleColumns: TableColumn<TData>[];
  orderedData: TData[];
  tableRef: React.RefObject<HTMLTableElement | null>;
  onRowClick?: (row: TData, rowId: string) => void;
  onRowDoubleClick?: (row: TData, rowId: string) => void;
  onSortChange?: (state: TableSortState) => void;
  onSelectionChange?: (selectedIds: string[]) => void;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onFilterChange?: (filterState: TableFilterState) => void;
  onColumnOrderChange?: (order: string[]) => void;
  onRowOrderChange?: (order: string[]) => void;
}

const TableContext = createContext<TableContextValue<any> | null>(null);

export interface TableProviderProps<TData = Record<string, unknown>> {
  children: React.ReactNode;
  columns: TableColumn<TData>[];
  data: TData[];
  getRowId?: (row: TData, index: number) => string;
  size?: TableSize;
  variant?: TableVariant;
  density?: TableDensity;
  selectionMode?: SelectionMode;
  defaultSort?: TableSortState;
  defaultGlobalFilter?: string;
  totalItems?: number;
  pageSize?: number;
  currentPage?: number;
  loading?: boolean;
  onRowClick?: (row: TData, rowId: string) => void;
  onRowDoubleClick?: (row: TData, rowId: string) => void;
  onSortChange?: (state: TableSortState) => void;
  onSelectionChange?: (selectedIds: string[]) => void;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onFilterChange?: (filterState: TableFilterState) => void;
  onColumnOrderChange?: (order: string[]) => void;
  onRowOrderChange?: (order: string[]) => void;
}

export function TableProvider<TData = Record<string, unknown>>({
  children,
  columns,
  data,
  getRowId = (_row: TData, index: number) => String(index),
  size = "md",
  variant = "default",
  density = "default",
  selectionMode = "none",
  defaultSort = { columnId: null, direction: null },
  defaultGlobalFilter = "",
  totalItems,
  pageSize = 10,
  currentPage = 1,
  loading = false,
  onRowClick,
  onRowDoubleClick,
  onSortChange,
  onSelectionChange,
  onPageChange,
  onPageSizeChange,
  onFilterChange,
  onColumnOrderChange,
  onRowOrderChange,
}: TableProviderProps<TData>) {
const initialRowOrder = data?.map((row, i) =>
  getRowId(row, i)
) || [];

  const [state, dispatch] = useReducer(tableReducer, {
    sortState: defaultSort,
    filterState: { globalFilter: defaultGlobalFilter, columnFilters: {} },
    selectedRows: new Set<string>(),
    expandedRows: new Set<string>(),
    columnVisibility: {},
    columnOrder: columns.map((c) => c.id),
    columnWidths: {},
    pinnedLeft: columns.filter((c) => c.pinned === "left").map((c) => c.id),
    pinnedRight: columns.filter((c) => c.pinned === "right").map((c) => c.id),
    pagination: {
      currentPage,
      pageSize,
      totalItems: totalItems ?? data.length,
    },
    loading,
    selectionMode,
    size,
    variant,
    density,
    rowOrder: initialRowOrder,
  });

  const tableRef = useRef<HTMLTableElement>(null);

  const setSort = useCallback(
    (columnId: string, direction: SortDirection) => {
      dispatch({ type: "SET_SORT", payload: { columnId, direction } });
      onSortChange?.({ columnId, direction });
    },
    [onSortChange],
  );

  const toggleSort = useCallback(
    (columnId: string) => {
      const isSameColumn = state.sortState.columnId === columnId;
      const nextDirection: SortDirection = !isSameColumn
        ? "asc"
        : state.sortState.direction === "asc"
          ? "desc"
          : state.sortState.direction === "desc"
            ? null
            : "asc";
      if (nextDirection === null) {
        dispatch({ type: "CLEAR_SORT" });
        onSortChange?.({ columnId: null, direction: null });
      } else {
        dispatch({ type: "SET_SORT", payload: { columnId, direction: nextDirection } });
        onSortChange?.({ columnId, direction: nextDirection });
      }
    },
    [state.sortState, onSortChange],
  );

  const clearSort = useCallback(() => {
    dispatch({ type: "CLEAR_SORT" });
    onSortChange?.({ columnId: null, direction: null });
  }, [onSortChange]);

  const setGlobalFilter = useCallback(
    (value: string) => {
      dispatch({ type: "SET_GLOBAL_FILTER", payload: value });
      onFilterChange?.({ ...state.filterState, globalFilter: value });
    },
    [state.filterState, onFilterChange],
  );

  const setColumnFilter = useCallback(
    (columnId: string, value: string) => {
      dispatch({ type: "SET_COLUMN_FILTER", payload: { columnId, value } });
      onFilterChange?.({
        ...state.filterState,
        columnFilters: { ...state.filterState.columnFilters, [columnId]: value },
      });
    },
    [state.filterState, onFilterChange],
  );

  const clearColumnFilter = useCallback((columnId: string) => {
    dispatch({ type: "CLEAR_COLUMN_FILTER", payload: columnId });
  }, []);

  const clearAllFilters = useCallback(() => {
    dispatch({ type: "CLEAR_ALL_FILTERS" });
    onFilterChange?.({ globalFilter: "", columnFilters: {} });
  }, [onFilterChange]);

  const allRowIds = data.map((row, i) => getRowId(row, i));

  const selectRow = useCallback((rowId: string) => {
    dispatch({ type: "SELECT_ROW", payload: rowId });
  }, []);

  const deselectRow = useCallback((rowId: string) => {
    dispatch({ type: "DESELECT_ROW", payload: rowId });
  }, []);

  const toggleRowSelection = useCallback(
    (rowId: string) => {
      dispatch({ type: "TOGGLE_ROW_SELECTION", payload: rowId });
      const next = new Set(selectionMode === "single" ? [] : state.selectedRows);
      if (next.has(rowId)) next.delete(rowId);
      else next.add(rowId);
      onSelectionChange?.(Array.from(next));
    },
    [state.selectedRows, selectionMode, onSelectionChange],
  );

  const selectAll = useCallback(() => {
    dispatch({ type: "SELECT_ALL", payload: allRowIds });
    onSelectionChange?.(allRowIds);
  }, [allRowIds, onSelectionChange]);

  const deselectAll = useCallback(() => {
    dispatch({ type: "DESELECT_ALL" });
    onSelectionChange?.([]);
  }, [onSelectionChange]);

  const isRowSelected = useCallback(
    (rowId: string) => state.selectedRows.has(rowId),
    [state.selectedRows],
  );

  const isAllSelected =
    allRowIds.length > 0 && allRowIds.every((id) => state.selectedRows.has(id));

  const isIndeterminate =
    !isAllSelected && allRowIds.some((id) => state.selectedRows.has(id));

  const toggleRowExpanded = useCallback((rowId: string) => {
    dispatch({ type: "TOGGLE_ROW_EXPANDED", payload: rowId });
  }, []);

  const isRowExpanded = useCallback(
    (rowId: string) => state.expandedRows.has(rowId),
    [state.expandedRows],
  );

  const setColumnVisibility = useCallback((columnId: string, visible: boolean) => {
    dispatch({ type: "SET_COLUMN_VISIBILITY", payload: { columnId, visible } });
  }, []);

  const setColumnOrder = useCallback(
    (order: string[]) => {
      dispatch({ type: "SET_COLUMN_ORDER", payload: order });
      onColumnOrderChange?.(order);
    },
    [onColumnOrderChange],
  );

  const setColumnWidth = useCallback((columnId: string, width: number) => {
    dispatch({ type: "SET_COLUMN_WIDTH", payload: { columnId, width } });
  }, []);

  const setRowOrder = useCallback(
    (order: string[]) => {
      dispatch({ type: "SET_ROW_ORDER", payload: order });
      onRowOrderChange?.(order);
    },
    [onRowOrderChange],
  );

  const setPage = useCallback(
    (page: number) => {
      dispatch({ type: "SET_PAGE", payload: page });
      onPageChange?.(page);
    },
    [onPageChange],
  );

  const setPageSize = useCallback(
    (size: number) => {
      dispatch({ type: "SET_PAGE_SIZE", payload: size });
      onPageSizeChange?.(size);
    },
    [onPageSizeChange],
  );

  const setTotalItems = useCallback((total: number) => {
    dispatch({ type: "SET_TOTAL_ITEMS", payload: total });
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: "SET_LOADING", payload: loading });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  // Derive visibleColumns respecting columnOrder
  const visibleColumns = state.columnOrder
    .map((id) => columns.find((c) => c.id === id))
    .filter((col): col is TableColumn<TData> =>
      !!col && !col.hidden && state.columnVisibility[col.id] !== false,
    );

  // Derive orderedData respecting rowOrder
  const rowIdToData = new Map<string, TData>(
    data.map((row, i) => [getRowId(row, i), row]),
  );
  const orderedData = state.rowOrder
    .map((id) => rowIdToData.get(id))
    .filter((row): row is TData => row !== undefined);

  return (
    <TableContext.Provider
      value={{
        state,
        dispatch,
        columns,
        data,
        getRowId,
        setSort,
        toggleSort,
        clearSort,
        setGlobalFilter,
        setColumnFilter,
        clearColumnFilter,
        clearAllFilters,
        selectRow,
        deselectRow,
        toggleRowSelection,
        selectAll,
        deselectAll,
        isRowSelected,
        isAllSelected,
        isIndeterminate,
        toggleRowExpanded,
        isRowExpanded,
        setColumnVisibility,
        setColumnOrder,
        setColumnWidth,
        setRowOrder,
        setPage,
        setPageSize,
        setTotalItems,
        setLoading,
        reset,
        visibleColumns,
        orderedData,
        tableRef,
        onRowClick,
        onRowDoubleClick,
        onSortChange,
        onSelectionChange,
        onPageChange,
        onPageSizeChange,
        onFilterChange,
        onColumnOrderChange,
        onRowOrderChange,
      }}
    >
      {children}
    </TableContext.Provider>
  );
}

export function useTableContext<TData = Record<string, unknown>>(): TableContextValue<TData> {
  const ctx = useContext(TableContext);
  if (!ctx) throw new Error("useTableContext must be used within TableProvider");
  return ctx as TableContextValue<TData>;
}