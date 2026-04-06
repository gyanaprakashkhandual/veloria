/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";

// ─── Shared Types ─────────────────────────────────────────────────────────────

export type SpeedDialSize = "sm" | "md" | "lg" | "xl";
export type SpeedDialVariant = "default" | "ghost" | "outline" | "filled";
export type SpeedDialShape = "circle" | "rounded" | "square";
export type SpeedDialDirection = "up" | "down" | "left" | "right";
export type SpeedDialPlacement =
  | "bottom-right"
  | "bottom-left"
  | "top-right"
  | "top-left"
  | "none"; // unpositioned — use inside a container
export type SpeedDialLabelPosition = "left" | "right" | "none";
export type SpeedDialOpenOn = "click" | "hover" | "both";

export interface SpeedDialAction {
  id: string;
  /** Icon node rendered inside the action button */
  icon: React.ReactNode;
  /** Label shown beside the action button */
  label?: string;
  /** Tooltip text (used when labelPosition is "none") */
  tooltip?: string;
  /** Badge count or boolean dot */
  badge?: number | boolean;
  /** Disable this specific action */
  disabled?: boolean;
  /** Variant override for this action */
  variant?: SpeedDialVariant;
  /** Nested sub-dial actions */
  subActions?: SpeedDialAction[];
  /** Click handler */
  onClick?: (id: string) => void;
  /** Fully custom render — receives helpers */
  render?: (props: SpeedDialActionRenderProps) => React.ReactNode;
}

export interface SpeedDialActionRenderProps {
  id: string;
  isOpen: boolean;
  size: SpeedDialSize;
  disabled: boolean;
  close: () => void;
}

// ─── State & Reducer ──────────────────────────────────────────────────────────

export interface SpeedDialState {
  isOpen: boolean;
  activeSubDial: string | null;
  focusedIndex: number;
  size: SpeedDialSize;
  variant: SpeedDialVariant;
  shape: SpeedDialShape;
  direction: SpeedDialDirection;
  placement: SpeedDialPlacement;
  labelPosition: SpeedDialLabelPosition;
  openOn: SpeedDialOpenOn;
  disabled: boolean;
  closeOnAction: boolean;
  persistent: boolean;
  backdrop: boolean;
}

type SpeedDialAction_ =
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "TOGGLE" }
  | { type: "SET_ACTIVE_SUBDIAL"; payload: string | null }
  | { type: "SET_FOCUSED_INDEX"; payload: number };

function reducer(state: SpeedDialState, action: SpeedDialAction_): SpeedDialState {
  switch (action.type) {
    case "OPEN":
      return { ...state, isOpen: true, activeSubDial: null, focusedIndex: -1 };
    case "CLOSE":
      return { ...state, isOpen: false, activeSubDial: null, focusedIndex: -1 };
    case "TOGGLE":
      return {
        ...state,
        isOpen: !state.isOpen,
        activeSubDial: null,
        focusedIndex: -1,
      };
    case "SET_ACTIVE_SUBDIAL":
      return { ...state, activeSubDial: action.payload };
    case "SET_FOCUSED_INDEX":
      return { ...state, focusedIndex: action.payload };
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

export interface SpeedDialContextValue {
  state: SpeedDialState;
  dispatch: React.Dispatch<SpeedDialAction_>;
  open: () => void;
  close: () => void;
  toggle: () => void;
  setActiveSubDial: (id: string | null) => void;
  setFocusedIndex: (idx: number) => void;
  onAction?: (action: SpeedDialAction) => void;
  onOpen?: () => void;
  onClose?: () => void;
}

const SpeedDialContext = createContext<SpeedDialContextValue | null>(null);

export interface SpeedDialProviderProps {
  children: React.ReactNode;
  size?: SpeedDialSize;
  variant?: SpeedDialVariant;
  shape?: SpeedDialShape;
  direction?: SpeedDialDirection;
  placement?: SpeedDialPlacement;
  labelPosition?: SpeedDialLabelPosition;
  openOn?: SpeedDialOpenOn;
  disabled?: boolean;
  closeOnAction?: boolean;
  persistent?: boolean;
  backdrop?: boolean;
  onAction?: (action: SpeedDialAction) => void;
  onOpen?: () => void;
  onClose?: () => void;
}

export function SpeedDialProvider({
  children,
  size = "md",
  variant = "default",
  shape = "circle",
  direction = "up",
  placement = "bottom-right",
  labelPosition = "left",
  openOn = "click",
  disabled = false,
  closeOnAction = true,
  persistent = false,
  backdrop = false,
  onAction,
  onOpen,
  onClose,
}: SpeedDialProviderProps) {
  const [state, dispatch] = useReducer(reducer, {
    isOpen: false,
    activeSubDial: null,
    focusedIndex: -1,
    size,
    variant,
    shape,
    direction,
    placement,
    labelPosition,
    openOn,
    disabled,
    closeOnAction,
    persistent,
    backdrop,
  });

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

  const setActiveSubDial = useCallback((id: string | null) => {
    dispatch({ type: "SET_ACTIVE_SUBDIAL", payload: id });
  }, []);

  const setFocusedIndex = useCallback((idx: number) => {
    dispatch({ type: "SET_FOCUSED_INDEX", payload: idx });
  }, []);

  return (
    <SpeedDialContext.Provider
      value={{
        state,
        dispatch,
        open,
        close,
        toggle,
        setActiveSubDial,
        setFocusedIndex,
        onAction,
        onOpen,
        onClose,
      }}
    >
      {children}
    </SpeedDialContext.Provider>
  );
}

export function useSpeedDialContext(): SpeedDialContextValue {
  const ctx = useContext(SpeedDialContext);
  if (!ctx)
    throw new Error("useSpeedDialContext must be used within SpeedDialProvider");
  return ctx;
}