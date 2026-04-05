/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useRef,
} from "react";

export type OptionSize = "sm" | "md" | "lg" | "xl";
export type SelectionMode = "single" | "multi";
export type MenuPosition =
  | "bottom-left"
  | "bottom-right"
  | "top-left"
  | "top-right"
  | "auto";

export interface OptionItem {
  value: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
  disabled?: boolean;
  dividerBefore?: boolean;
  header?: string;
  children?: OptionItem[];
}

export interface OptionState {
  isOpen: boolean;
  selected: string[];
  search: string;
  expandedItems: string[];
  activeSubmenu: string | null;
  size: OptionSize;
  selectionMode: SelectionMode;
  position: MenuPosition;
  showSearch: boolean;
  disabled: boolean;
  readOnly: boolean;
  placeholder: string;
  maxSelections: number | null;
  closeOnSelect: boolean;
}

type OptionAction =
  | { type: "SET_OPEN"; payload: boolean }
  | { type: "TOGGLE_OPEN" }
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SELECT_ITEM"; payload: string }
  | { type: "DESELECT_ITEM"; payload: string }
  | { type: "TOGGLE_ITEM"; payload: string }
  | { type: "CLEAR_SELECTION" }
  | { type: "SET_SELECTION"; payload: string[] }
  | { type: "TOGGLE_EXPAND"; payload: string }
  | { type: "SET_ACTIVE_SUBMENU"; payload: string | null }
  | { type: "CLOSE" };

function optionReducer(state: OptionState, action: OptionAction): OptionState {
  switch (action.type) {
    case "SET_OPEN":
      return {
        ...state,
        isOpen: action.payload,
        search: action.payload ? state.search : "",
      };
    case "TOGGLE_OPEN":
      return {
        ...state,
        isOpen: !state.isOpen,
        search: state.isOpen ? "" : state.search,
        activeSubmenu: null,
      };
    case "SET_SEARCH":
      return { ...state, search: action.payload };
    case "SELECT_ITEM": {
      if (state.selectionMode === "single") {
        return {
          ...state,
          selected: [action.payload],
          isOpen: state.closeOnSelect ? false : state.isOpen,
          search: state.closeOnSelect ? "" : state.search,
        };
      }
      if (state.selected.includes(action.payload)) return state;
      if (
        state.maxSelections !== null &&
        state.selected.length >= state.maxSelections
      )
        return state;
      return { ...state, selected: [...state.selected, action.payload] };
    }
    case "DESELECT_ITEM":
      return {
        ...state,
        selected: state.selected.filter((v) => v !== action.payload),
      };
    case "TOGGLE_ITEM": {
      if (state.selectionMode === "single") {
        const already = state.selected.includes(action.payload);
        return {
          ...state,
          selected: already ? [] : [action.payload],
          isOpen: state.closeOnSelect && !already ? false : state.isOpen,
          search: state.closeOnSelect && !already ? "" : state.search,
        };
      }
      if (state.selected.includes(action.payload)) {
        return {
          ...state,
          selected: state.selected.filter((v) => v !== action.payload),
        };
      }
      if (
        state.maxSelections !== null &&
        state.selected.length >= state.maxSelections
      )
        return state;
      return { ...state, selected: [...state.selected, action.payload] };
    }
    case "CLEAR_SELECTION":
      return { ...state, selected: [] };
    case "SET_SELECTION":
      return { ...state, selected: action.payload };
    case "TOGGLE_EXPAND": {
      const isExpanded = state.expandedItems.includes(action.payload);
      return {
        ...state,
        expandedItems: isExpanded
          ? state.expandedItems.filter((v) => v !== action.payload)
          : [...state.expandedItems, action.payload],
      };
    }
    case "SET_ACTIVE_SUBMENU":
      return { ...state, activeSubmenu: action.payload };
    case "CLOSE":
      return { ...state, isOpen: false, search: "", activeSubmenu: null };
    default:
      return state;
  }
}

export interface OptionContextValue {
  state: OptionState;
  dispatch: React.Dispatch<OptionAction>;
  open: () => void;
  close: () => void;
  toggle: () => void;
  selectItem: (value: string) => void;
  deselectItem: (value: string) => void;
  toggleItem: (value: string) => void;
  clearSelection: () => void;
  setSearch: (val: string) => void;
  toggleExpand: (value: string) => void;
  isSelected: (value: string) => boolean;
  isExpanded: (value: string) => boolean;
  getSelectedLabels: (items: OptionItem[]) => string[];
  triggerRef: React.RefObject<HTMLDivElement | null>;
  onChange?: (selected: string[]) => void;
  onOpen?: () => void;
  onClose?: () => void;
}

const OptionContext = createContext<OptionContextValue | null>(null);

export interface OptionProviderProps {
  children: React.ReactNode;
  defaultSelected?: string[];
  size?: OptionSize;
  selectionMode?: SelectionMode;
  position?: MenuPosition;
  showSearch?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  maxSelections?: number | null;
  closeOnSelect?: boolean;
  onChange?: (selected: string[]) => void;
  onOpen?: () => void;
  onClose?: () => void;
}

export function OptionProvider({
  children,
  defaultSelected = [],
  size = "md",
  selectionMode = "single",
  position = "auto",
  showSearch = false,
  disabled = false,
  readOnly = false,
  placeholder = "Select an option",
  maxSelections = null,
  closeOnSelect = true,
  onChange,
  onOpen,
  onClose,
}: OptionProviderProps) {
  const initialState: OptionState = {
    isOpen: false,
    selected: defaultSelected,
    search: "",
    expandedItems: [],
    activeSubmenu: null,
    size,
    selectionMode,
    position,
    showSearch,
    disabled,
    readOnly,
    placeholder,
    maxSelections,
    closeOnSelect,
  };

  const [state, dispatch] = useReducer(optionReducer, initialState);
  const triggerRef = useRef<HTMLDivElement>(null);

  const open = useCallback(() => {
    if (disabled || readOnly) return;
    dispatch({ type: "SET_OPEN", payload: true });
    onOpen?.();
  }, [disabled, readOnly, onOpen]);

  const close = useCallback(() => {
    dispatch({ type: "CLOSE" });
    onClose?.();
  }, [onClose]);

  const toggle = useCallback(() => {
    if (disabled || readOnly) return;
    if (state.isOpen) {
      dispatch({ type: "CLOSE" });
      onClose?.();
    } else {
      dispatch({ type: "SET_OPEN", payload: true });
      onOpen?.();
    }
  }, [disabled, readOnly, state.isOpen, onOpen, onClose]);

  const selectItem = useCallback(
    (value: string) => {
      dispatch({ type: "SELECT_ITEM", payload: value });
      const next =
        selectionMode === "single" ? [value] : [...state.selected, value];
      onChange?.(next);
      if (selectionMode === "single" && closeOnSelect) onClose?.();
    },
    [state.selected, selectionMode, closeOnSelect, onChange, onClose],
  );

  const deselectItem = useCallback(
    (value: string) => {
      dispatch({ type: "DESELECT_ITEM", payload: value });
      onChange?.(state.selected.filter((v) => v !== value));
    },
    [state.selected, onChange],
  );

  const toggleItem = useCallback(
    (value: string) => {
      const isAlreadySelected = state.selected.includes(value);
      dispatch({ type: "TOGGLE_ITEM", payload: value });
      if (selectionMode === "single") {
        onChange?.(isAlreadySelected ? [] : [value]);
        if (!isAlreadySelected && closeOnSelect) onClose?.();
      } else {
        const next = isAlreadySelected
          ? state.selected.filter((v) => v !== value)
          : [...state.selected, value];
        onChange?.(next);
      }
    },
    [state.selected, selectionMode, closeOnSelect, onChange, onClose],
  );

  const clearSelection = useCallback(() => {
    dispatch({ type: "CLEAR_SELECTION" });
    onChange?.([]);
  }, [onChange]);

  const setSearch = useCallback((val: string) => {
    dispatch({ type: "SET_SEARCH", payload: val });
  }, []);

  const toggleExpand = useCallback((value: string) => {
    dispatch({ type: "TOGGLE_EXPAND", payload: value });
  }, []);

  const isSelected = useCallback(
    (value: string) => state.selected.includes(value),
    [state.selected],
  );

  const isExpanded = useCallback(
    (value: string) => state.expandedItems.includes(value),
    [state.expandedItems],
  );

  const flattenItems = (items: OptionItem[]): OptionItem[] =>
    items.flatMap((item) => [
      item,
      ...(item.children ? flattenItems(item.children) : []),
    ]);

  const getSelectedLabels = useCallback(
    (items: OptionItem[]): string[] => {
      const flat = flattenItems(items);
      return state.selected.map(
        (v) => flat.find((i) => i.value === v)?.label ?? v,
      );
    },
    [state.selected],
  );

  return (
    <OptionContext.Provider
      value={{
        state,
        dispatch,
        open,
        close,
        toggle,
        selectItem,
        deselectItem,
        toggleItem,
        clearSelection,
        setSearch,
        toggleExpand,
        isSelected,
        isExpanded,
        getSelectedLabels,
        triggerRef,
        onChange,
        onOpen,
        onClose,
      }}
    >
      {children}
    </OptionContext.Provider>
  );
}

export function useOptionContext(): OptionContextValue {
  const ctx = useContext(OptionContext);
  if (!ctx)
    throw new Error("useOptionContext must be used within OptionProvider");
  return ctx;
}
