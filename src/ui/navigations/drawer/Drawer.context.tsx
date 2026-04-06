/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useRef,
} from "react";

// ─── Public Types ─────────────────────────────────────────────────────────────

export type DrawerSize = "sm" | "md" | "lg" | "xl" | "full";
export type DrawerSide = "left" | "right" | "top" | "bottom";
export type DrawerVariant = "default" | "ghost" | "push";

// ─── State & Actions ──────────────────────────────────────────────────────────

export interface DrawerState {
  isOpen: boolean;
  size: DrawerSize;
  side: DrawerSide;
  variant: DrawerVariant;
  disabled: boolean;
}

type DrawerAction = { type: "OPEN" } | { type: "CLOSE" } | { type: "TOGGLE" };

function reducer(state: DrawerState, action: DrawerAction): DrawerState {
  switch (action.type) {
    case "OPEN":
      return { ...state, isOpen: true };
    case "CLOSE":
      return { ...state, isOpen: false };
    case "TOGGLE":
      return { ...state, isOpen: !state.isOpen };
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

export interface DrawerContextValue {
  state: DrawerState;
  dispatch: React.Dispatch<DrawerAction>;
  open: () => void;
  close: () => void;
  toggle: () => void;
  /** Ref on the drawer panel — used for focus trap & click-outside */
  panelRef: React.RefObject<HTMLDivElement | null>;
  onOpen?: () => void;
  onClose?: () => void;
}

const DrawerContext = createContext<DrawerContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export interface DrawerProviderProps {
  children: React.ReactNode;
  size?: DrawerSize;
  side?: DrawerSide;
  variant?: DrawerVariant;
  disabled?: boolean;
  defaultOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

export function DrawerProvider({
  children,
  size = "md",
  side = "right",
  variant = "default",
  disabled = false,
  defaultOpen = false,
  onOpen,
  onClose,
}: DrawerProviderProps) {
  const [state, dispatch] = useReducer(reducer, {
    isOpen: defaultOpen,
    size,
    side,
    variant,
    disabled,
  });

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

  return (
    <DrawerContext.Provider
      value={{
        state,
        dispatch,
        open,
        close,
        toggle,
        panelRef,
        onOpen,
        onClose,
      }}
    >
      {children}
    </DrawerContext.Provider>
  );
}

export function useDrawerContext(): DrawerContextValue {
  const ctx = useContext(DrawerContext);
  if (!ctx)
    throw new Error("useDrawerContext must be used within DrawerProvider");
  return ctx;
}
