/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useRef,
} from "react";

export type DropdownSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
export type DropdownMode = "single" | "multi";
export type DropdownAlign =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "top-left"
  | "top-right"
  | "top-center"
  | "bottom-left"
  | "bottom-right"
  | "bottom-center"
  | "auto";
export type DropdownOpenTrigger = "click" | "hover";
export type DropdownMenuState = "default" | "loading" | "error";

export interface DropdownDivider {
  thickness?: number;
  color?: string;
}

export interface DropdownOption {
  value: string;
  label: string;
  description?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  trailingText?: string;
  badge?: number | string;
  disabled?: boolean;
  group?: string;
  dividerBefore?: boolean;
  variant?: "default" | "danger" | "warning" | "success" | "info";
  children?: DropdownOption[];
  customContent?: React.ReactNode;
}

export interface DropdownState {
  isOpen: boolean;
  selected: Set<string>;
  search: string;
  focusedIndex: number;
  size: DropdownSize;
  mode: DropdownMode;
  align: DropdownAlign;
  disabled: boolean;
  loading: boolean;
}

export type DropdownAction =
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "TOGGLE" }
  | { type: "SELECT"; payload: string }
  | { type: "DESELECT"; payload: string }
  | { type: "TOGGLE_OPTION"; payload: string }
  | { type: "CLEAR" }
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_FOCUSED"; payload: number }
  | { type: "SET_SELECTED"; payload: Set<string> };

function reducer(state: DropdownState, action: DropdownAction): DropdownState {
  switch (action.type) {
    case "OPEN":
      return { ...state, isOpen: true, focusedIndex: -1 };
    case "CLOSE":
      return { ...state, isOpen: false, search: "", focusedIndex: -1 };
    case "TOGGLE":
      return state.isOpen
        ? { ...state, isOpen: false, search: "", focusedIndex: -1 }
        : { ...state, isOpen: true, focusedIndex: -1 };
    case "SELECT": {
      if (state.mode === "single") {
        return {
          ...state,
          selected: new Set([action.payload]),
          isOpen: false,
          search: "",
          focusedIndex: -1,
        };
      }
      const next = new Set(state.selected);
      next.add(action.payload);
      return { ...state, selected: next };
    }
    case "DESELECT": {
      const next = new Set(state.selected);
      next.delete(action.payload);
      return { ...state, selected: next };
    }
    case "TOGGLE_OPTION": {
      const next = new Set(state.selected);
      if (next.has(action.payload)) next.delete(action.payload);
      else next.add(action.payload);
      if (state.mode === "single") {
        return {
          ...state,
          selected: next,
          isOpen: false,
          search: "",
          focusedIndex: -1,
        };
      }
      return { ...state, selected: next };
    }
    case "CLEAR":
      return { ...state, selected: new Set(), search: "", focusedIndex: -1 };
    case "SET_SEARCH":
      return { ...state, search: action.payload, focusedIndex: 0 };
    case "SET_FOCUSED":
      return { ...state, focusedIndex: action.payload };
    case "SET_SELECTED":
      return { ...state, selected: action.payload };
    default:
      return state;
  }
}

export interface DropdownContextValue {
  state: DropdownState;
  dispatch: React.Dispatch<DropdownAction>;
  open: () => void;
  close: () => void;
  toggle: () => void;
  selectOption: (value: string) => void;
  deselectOption: (value: string) => void;
  toggleOption: (value: string) => void;
  clear: () => void;
  setSearch: (q: string) => void;
  setFocused: (idx: number) => void;
  isSelected: (value: string) => boolean;
  triggerRef: React.RefObject<HTMLDivElement | null>;
  panelRef: React.RefObject<HTMLDivElement | null>;
  onValueChange?: (value: string | string[]) => void;
}

const DropdownContext = createContext<DropdownContextValue | null>(null);

export interface DropdownProviderProps {
  children: React.ReactNode;
  size?: DropdownSize;
  mode?: DropdownMode;
  align?: DropdownAlign;
  disabled?: boolean;
  loading?: boolean;
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  onOpen?: () => void;
  onClose?: () => void;
}

export function DropdownProvider({
  children,
  size = "md",
  mode = "single",
  align = "auto",
  disabled = false,
  loading = false,
  defaultValue,
  onValueChange,
  onOpen,
  onClose,
}: DropdownProviderProps) {
  const initialSelected = defaultValue
    ? new Set(Array.isArray(defaultValue) ? defaultValue : [defaultValue])
    : new Set<string>();

  const [state, dispatch] = useReducer(reducer, {
    isOpen: false,
    selected: initialSelected,
    search: "",
    focusedIndex: -1,
    size,
    mode,
    align,
    disabled,
    loading,
  });

  const triggerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const open = useCallback(() => {
    if (disabled) return;
    dispatch({ type: "OPEN" });
    onOpen?.();
  }, [disabled, onOpen]);

  const close = useCallback(() => {
    dispatch({ type: "CLOSE" });
    onClose?.();
  }, [onClose]);

  const toggle = useCallback(() => {
    if (disabled) return;
    if (state.isOpen) {
      dispatch({ type: "CLOSE" });
      onClose?.();
    } else {
      dispatch({ type: "OPEN" });
      onOpen?.();
    }
  }, [disabled, state.isOpen, onOpen, onClose]);

  const selectOption = useCallback(
    (value: string) => {
      dispatch({ type: "SELECT", payload: value });
      const next = mode === "single" ? value : [...state.selected, value];
      onValueChange?.(next);
    },
    [mode, state.selected, onValueChange],
  );

  const deselectOption = useCallback(
    (value: string) => {
      dispatch({ type: "DESELECT", payload: value });
      const next = [...state.selected].filter((v) => v !== value);
      onValueChange?.(next);
    },
    [state.selected, onValueChange],
  );

  const toggleOption = useCallback(
    (value: string) => {
      dispatch({ type: "TOGGLE_OPTION", payload: value });
      const wasSelected = state.selected.has(value);
      if (mode === "single") {
        onValueChange?.(wasSelected ? "" : value);
      } else {
        const next = wasSelected
          ? [...state.selected].filter((v) => v !== value)
          : [...state.selected, value];
        onValueChange?.(next);
      }
    },
    [mode, state.selected, onValueChange],
  );

  const clear = useCallback(() => {
    dispatch({ type: "CLEAR" });
    onValueChange?.(mode === "single" ? "" : []);
  }, [mode, onValueChange]);

  const setSearch = useCallback(
    (q: string) => dispatch({ type: "SET_SEARCH", payload: q }),
    [],
  );
  const setFocused = useCallback(
    (idx: number) => dispatch({ type: "SET_FOCUSED", payload: idx }),
    [],
  );
  const isSelected = useCallback(
    (value: string) => state.selected.has(value),
    [state.selected],
  );

  return (
    <DropdownContext.Provider
      value={{
        state,
        dispatch,
        open,
        close,
        toggle,
        selectOption,
        deselectOption,
        toggleOption,
        clear,
        setSearch,
        setFocused,
        isSelected,
        triggerRef,
        panelRef,
        onValueChange,
      }}
    >
      {children}
    </DropdownContext.Provider>
  );
}

export function useDropdownContext(): DropdownContextValue {
  const ctx = useContext(DropdownContext);
  if (!ctx)
    throw new Error("useDropdownContext must be used within DropdownProvider");
  return ctx;
}
