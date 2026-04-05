import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useRef,
} from "react";

export type ListSize = "sm" | "md" | "lg" | "xl";
export type ListVariant = "default" | "bordered" | "card" | "ghost" | "divided";
export type ListDensity = "compact" | "comfortable" | "spacious";
export type ListSelectionMode = "none" | "single" | "multiple" | "checkbox";
export type ListItemVariant =
  | "default"
  | "danger"
  | "warning"
  | "success"
  | "info";

export interface ListItemData {
  id: string;
  label: string;
  description?: string;
  metadata?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  avatar?: { src?: string; alt?: string; fallback?: string };
  badge?: {
    label: string;
    variant?: "default" | "danger" | "warning" | "success" | "info";
  };
  variant?: ListItemVariant;
  disabled?: boolean;
  loading?: boolean;
  href?: string;
  header?: string;
  dividerBefore?: boolean;
  actions?: React.ReactNode;
  data?: Record<string, unknown>;
}

export interface ListState {
  items: ListItemData[];
  selectedIds: Set<string>;
  activeId: string | null;
  focusedId: string | null;
  dragState: {
    draggingId: string | null;
    overId: string | null;
    isDragging: boolean;
  };
  size: ListSize;
  variant: ListVariant;
  density: ListDensity;
  selectionMode: ListSelectionMode;
  isReorderable: boolean;
  isLoading: boolean;
}

type ListAction =
  | { type: "SET_ITEMS"; payload: ListItemData[] }
  | { type: "REORDER_ITEMS"; payload: { fromIndex: number; toIndex: number } }
  | { type: "SELECT_ITEM"; payload: string }
  | { type: "DESELECT_ITEM"; payload: string }
  | { type: "TOGGLE_SELECT"; payload: string }
  | { type: "SELECT_ALL" }
  | { type: "DESELECT_ALL" }
  | { type: "SET_ACTIVE"; payload: string | null }
  | { type: "SET_FOCUSED"; payload: string | null }
  | { type: "SET_DRAG_STATE"; payload: Partial<ListState["dragState"]> }
  | { type: "RESET_DRAG" }
  | { type: "SET_LOADING"; payload: boolean };

function arrayReorder<T>(arr: T[], from: number, to: number): T[] {
  const result = [...arr];
  const [removed] = result.splice(from, 1);
  result.splice(to, 0, removed);
  return result;
}

function reducer(state: ListState, action: ListAction): ListState {
  switch (action.type) {
    case "SET_ITEMS":
      return { ...state, items: action.payload };

    case "REORDER_ITEMS": {
      const { fromIndex, toIndex } = action.payload;
      if (fromIndex === toIndex) return state;
      return { ...state, items: arrayReorder(state.items, fromIndex, toIndex) };
    }

    case "SELECT_ITEM": {
      if (state.selectionMode === "none") return state;
      if (state.selectionMode === "single") {
        return { ...state, selectedIds: new Set([action.payload]) };
      }
      const next = new Set(state.selectedIds);
      next.add(action.payload);
      return { ...state, selectedIds: next };
    }

    case "DESELECT_ITEM": {
      const next = new Set(state.selectedIds);
      next.delete(action.payload);
      return { ...state, selectedIds: next };
    }

    case "TOGGLE_SELECT": {
      if (state.selectionMode === "none") return state;
      if (state.selectionMode === "single") {
        const isSelected = state.selectedIds.has(action.payload);
        return {
          ...state,
          selectedIds: isSelected ? new Set() : new Set([action.payload]),
        };
      }
      const next = new Set(state.selectedIds);
      if (next.has(action.payload)) next.delete(action.payload);
      else next.add(action.payload);
      return { ...state, selectedIds: next };
    }

    case "SELECT_ALL": {
      const allIds = state.items.filter((i) => !i.disabled).map((i) => i.id);
      return { ...state, selectedIds: new Set(allIds) };
    }

    case "DESELECT_ALL":
      return { ...state, selectedIds: new Set() };

    case "SET_ACTIVE":
      return { ...state, activeId: action.payload };

    case "SET_FOCUSED":
      return { ...state, focusedId: action.payload };

    case "SET_DRAG_STATE":
      return {
        ...state,
        dragState: { ...state.dragState, ...action.payload },
      };

    case "RESET_DRAG":
      return {
        ...state,
        dragState: { draggingId: null, overId: null, isDragging: false },
      };

    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    default:
      return state;
  }
}

export interface ListContextValue {
  state: ListState;
  dispatch: React.Dispatch<ListAction>;
  selectItem: (id: string) => void;
  deselectItem: (id: string) => void;
  toggleSelect: (id: string) => void;
  selectAll: () => void;
  deselectAll: () => void;
  setActive: (id: string | null) => void;
  setFocused: (id: string | null) => void;
  reorderItems: (fromIndex: number, toIndex: number) => void;
  setItems: (items: ListItemData[]) => void;
  listRef: React.RefObject<HTMLUListElement | null>;
  onItemClick?: (item: ListItemData) => void;
  onSelectionChange?: (selectedIds: string[]) => void;
  onReorder?: (items: ListItemData[]) => void;
}

const ListContext = createContext<ListContextValue | null>(null);

export interface ListProviderProps {
  children: React.ReactNode;
  items: ListItemData[];
  size?: ListSize;
  variant?: ListVariant;
  density?: ListDensity;
  selectionMode?: ListSelectionMode;
  isReorderable?: boolean;
  isLoading?: boolean;
  defaultSelectedIds?: string[];
  defaultActiveId?: string | null;
  onItemClick?: (item: ListItemData) => void;
  onSelectionChange?: (selectedIds: string[]) => void;
  onReorder?: (items: ListItemData[]) => void;
}

export function ListProvider({
  children,
  items,
  size = "md",
  variant = "default",
  density = "comfortable",
  selectionMode = "none",
  isReorderable = false,
  isLoading = false,
  defaultSelectedIds = [],
  defaultActiveId = null,
  onItemClick,
  onSelectionChange,
  onReorder,
}: ListProviderProps) {
  const [state, dispatch] = useReducer(reducer, {
    items,
    selectedIds: new Set(defaultSelectedIds),
    activeId: defaultActiveId,
    focusedId: null,
    dragState: { draggingId: null, overId: null, isDragging: false },
    size,
    variant,
    density,
    selectionMode,
    isReorderable,
    isLoading,
  });

  const listRef = useRef<HTMLUListElement>(null);

  const selectItem = useCallback(
    (id: string) => {
      dispatch({ type: "SELECT_ITEM", payload: id });
      if (onSelectionChange) {
        const next =
          selectionMode === "single" ? [id] : [...state.selectedIds, id];
        onSelectionChange(next);
      }
    },
    [selectionMode, state.selectedIds, onSelectionChange],
  );

  const deselectItem = useCallback(
    (id: string) => {
      dispatch({ type: "DESELECT_ITEM", payload: id });
      if (onSelectionChange) {
        const next = [...state.selectedIds].filter((x) => x !== id);
        onSelectionChange(next);
      }
    },
    [state.selectedIds, onSelectionChange],
  );

  const toggleSelect = useCallback(
    (id: string) => {
      dispatch({ type: "TOGGLE_SELECT", payload: id });
      if (onSelectionChange) {
        const next = new Set(state.selectedIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        if (selectionMode === "single") {
          onSelectionChange(next.has(id) ? [] : [id]);
        } else {
          onSelectionChange([...next]);
        }
      }
    },
    [state.selectedIds, selectionMode, onSelectionChange],
  );

  const selectAll = useCallback(() => {
    dispatch({ type: "SELECT_ALL" });
    if (onSelectionChange) {
      onSelectionChange(
        state.items.filter((i) => !i.disabled).map((i) => i.id),
      );
    }
  }, [state.items, onSelectionChange]);

  const deselectAll = useCallback(() => {
    dispatch({ type: "DESELECT_ALL" });
    onSelectionChange?.([]);
  }, [onSelectionChange]);

  const setActive = useCallback((id: string | null) => {
    dispatch({ type: "SET_ACTIVE", payload: id });
  }, []);

  const setFocused = useCallback((id: string | null) => {
    dispatch({ type: "SET_FOCUSED", payload: id });
  }, []);

  const reorderItems = useCallback(
    (fromIndex: number, toIndex: number) => {
      dispatch({ type: "REORDER_ITEMS", payload: { fromIndex, toIndex } });
      if (onReorder) {
        const next = arrayReorder(state.items, fromIndex, toIndex);
        onReorder(next);
      }
    },
    [state.items, onReorder],
  );

  const setItems = useCallback((items: ListItemData[]) => {
    dispatch({ type: "SET_ITEMS", payload: items });
  }, []);

  return (
    <ListContext.Provider
      value={{
        state,
        dispatch,
        selectItem,
        deselectItem,
        toggleSelect,
        selectAll,
        deselectAll,
        setActive,
        setFocused,
        reorderItems,
        setItems,
        listRef,
        onItemClick,
        onSelectionChange,
        onReorder,
      }}
    >
      {children}
    </ListContext.Provider>
  );
}

export function useListContext(): ListContextValue {
  const ctx = useContext(ListContext);
  if (!ctx) throw new Error("useListContext must be used within ListProvider");
  return ctx;
}
