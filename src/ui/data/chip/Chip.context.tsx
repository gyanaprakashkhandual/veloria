import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useRef,
} from "react";

export type ChipSize = "xs" | "sm" | "md" | "lg" | "xl";
export type ChipVariant =
  | "filled"
  | "outlined"
  | "soft"
  | "ghost"
  | "elevated";
export type ChipColor =
  | "gray"
  | "red"
  | "amber"
  | "emerald"
  | "blue"
  | "violet"
  | "rose"
  | "indigo"
  | "teal"
  | "orange"
  | "pink"
  | "cyan";
export type ChipShape = "rounded" | "pill" | "square";
export type ChipStatus = "default" | "active" | "disabled" | "loading";

export interface ChipState {
  size: ChipSize;
  variant: ChipVariant;
  color: ChipColor;
  shape: ChipShape;
  status: ChipStatus;
  isSelected: boolean;
  isDismissed: boolean;
  isExpanded: boolean;
  maxLines: number;
  isTruncated: boolean;
}

type ChipAction =
  | { type: "SELECT" }
  | { type: "DESELECT" }
  | { type: "TOGGLE_SELECT" }
  | { type: "DISMISS" }
  | { type: "RESTORE" }
  | { type: "TOGGLE_EXPAND" }
  | { type: "SET_TRUNCATED"; payload: boolean }
  | { type: "SET_STATUS"; payload: ChipStatus };

function reducer(state: ChipState, action: ChipAction): ChipState {
  switch (action.type) {
    case "SELECT":
      return { ...state, isSelected: true };
    case "DESELECT":
      return { ...state, isSelected: false };
    case "TOGGLE_SELECT":
      return { ...state, isSelected: !state.isSelected };
    case "DISMISS":
      return { ...state, isDismissed: true };
    case "RESTORE":
      return { ...state, isDismissed: false };
    case "TOGGLE_EXPAND":
      return { ...state, isExpanded: !state.isExpanded };
    case "SET_TRUNCATED":
      return { ...state, isTruncated: action.payload };
    case "SET_STATUS":
      return { ...state, status: action.payload };
    default:
      return state;
  }
}

export interface ChipContextValue {
  state: ChipState;
  dispatch: React.Dispatch<ChipAction>;
  select: () => void;
  deselect: () => void;
  toggleSelect: () => void;
  dismiss: () => void;
  restore: () => void;
  toggleExpand: () => void;
  setTruncated: (v: boolean) => void;
  setStatus: (s: ChipStatus) => void;
  chipRef: React.RefObject<HTMLDivElement | null>;
}

const ChipContext = createContext<ChipContextValue | null>(null);

export interface ChipProviderProps {
  children: React.ReactNode;
  size?: ChipSize;
  variant?: ChipVariant;
  color?: ChipColor;
  shape?: ChipShape;
  status?: ChipStatus;
  defaultSelected?: boolean;
  maxLines?: number;
  onDismiss?: () => void;
  onSelect?: (selected: boolean) => void;
}

export function ChipProvider({
  children,
  size = "md",
  variant = "soft",
  color = "gray",
  shape = "pill",
  status = "default",
  defaultSelected = false,
  maxLines = 1,
  onDismiss,
  onSelect,
}: ChipProviderProps) {
  const [state, dispatch] = useReducer(reducer, {
    size,
    variant,
    color,
    shape,
    status,
    isSelected: defaultSelected,
    isDismissed: false,
    isExpanded: false,
    maxLines,
    isTruncated: false,
  });

  const chipRef = useRef<HTMLDivElement>(null);

  const select = useCallback(() => {
    dispatch({ type: "SELECT" });
    onSelect?.(true);
  }, [onSelect]);

  const deselect = useCallback(() => {
    dispatch({ type: "DESELECT" });
    onSelect?.(false);
  }, [onSelect]);

  const toggleSelect = useCallback(() => {
    dispatch({ type: "TOGGLE_SELECT" });
    onSelect?.(!state.isSelected);
  }, [onSelect, state.isSelected]);

  const dismiss = useCallback(() => {
    dispatch({ type: "DISMISS" });
    onDismiss?.();
  }, [onDismiss]);

  const restore = useCallback(() => {
    dispatch({ type: "RESTORE" });
  }, []);

  const toggleExpand = useCallback(() => {
    dispatch({ type: "TOGGLE_EXPAND" });
  }, []);

  const setTruncated = useCallback((v: boolean) => {
    dispatch({ type: "SET_TRUNCATED", payload: v });
  }, []);

  const setStatus = useCallback((s: ChipStatus) => {
    dispatch({ type: "SET_STATUS", payload: s });
  }, []);

  return (
    <ChipContext.Provider
      value={{
        state,
        dispatch,
        select,
        deselect,
        toggleSelect,
        dismiss,
        restore,
        toggleExpand,
        setTruncated,
        setStatus,
        chipRef,
      }}
    >
      {children}
    </ChipContext.Provider>
  );
}

export function useChipContext(): ChipContextValue {
  const ctx = useContext(ChipContext);
  if (!ctx) throw new Error("useChipContext must be used within ChipProvider");
  return ctx;
}

export interface ChipGroupContextValue {
  size: ChipSize;
  variant: ChipVariant;
  color: ChipColor;
  shape: ChipShape;
  selectedIds: string[];
  multiSelect: boolean;
  onChipSelect: (id: string, selected: boolean) => void;
  onChipDismiss: (id: string) => void;
}

const ChipGroupContext = createContext<ChipGroupContextValue | null>(null);

export function ChipGroupProvider({
  children,
  size = "md",
  variant = "soft",
  color = "gray",
  shape = "pill",
  selectedIds = [],
  multiSelect = true,
  onChipSelect,
  onChipDismiss,
}: ChipGroupContextValue & { children: React.ReactNode }) {
  return (
    <ChipGroupContext.Provider
      value={{ size, variant, color, shape, selectedIds, multiSelect, onChipSelect, onChipDismiss }}
    >
      {children}
    </ChipGroupContext.Provider>
  );
}

export function useChipGroupContext(): ChipGroupContextValue | null {
  return useContext(ChipGroupContext);
}