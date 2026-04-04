import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useRef,
} from "react";

export type WindowSize = "sm" | "md" | "lg" | "xl";

export type WindowPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "center-left"
  | "center"
  | "center-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right"
  | "above-element"
  | "below-element"
  | "auto";

export interface WindowTab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export interface WindowState {
  isOpen: boolean;
  activeTab: string | null;
  position: WindowPosition;
  size: WindowSize;
  disabled: boolean;
}

type WindowAction =
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "TOGGLE" }
  | { type: "SET_TAB"; payload: string }
  | { type: "SET_POSITION"; payload: WindowPosition };

function windowReducer(state: WindowState, action: WindowAction): WindowState {
  switch (action.type) {
    case "OPEN":
      return { ...state, isOpen: true };
    case "CLOSE":
      return { ...state, isOpen: false };
    case "TOGGLE":
      return { ...state, isOpen: !state.isOpen };
    case "SET_TAB":
      return { ...state, activeTab: action.payload };
    case "SET_POSITION":
      return { ...state, position: action.payload };
    default:
      return state;
  }
}

export interface WindowContextValue {
  state: WindowState;
  dispatch: React.Dispatch<WindowAction>;
  open: () => void;
  close: () => void;
  toggle: () => void;
  setTab: (id: string) => void;
  anchorRef: React.RefObject<HTMLElement | null>;
  onOpen?: () => void;
  onClose?: () => void;
}

const WindowContext = createContext<WindowContextValue | null>(null);

export interface WindowProviderProps {
  children: React.ReactNode;
  defaultTab?: string;
  position?: WindowPosition;
  size?: WindowSize;
  disabled?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

export function WindowProvider({
  children,
  defaultTab = null as unknown as string,
  position = "auto",
  size = "md",
  disabled = false,
  onOpen,
  onClose,
}: WindowProviderProps) {
  const [state, dispatch] = useReducer(windowReducer, {
    isOpen: false,
    activeTab: defaultTab,
    position,
    size,
    disabled,
  });

  const anchorRef = useRef<HTMLElement>(null);

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

  const setTab = useCallback((id: string) => {
    dispatch({ type: "SET_TAB", payload: id });
  }, []);

  return (
    <WindowContext.Provider
      value={{
        state,
        dispatch,
        open,
        close,
        toggle,
        setTab,
        anchorRef,
        onOpen,
        onClose,
      }}
    >
      {children}
    </WindowContext.Provider>
  );
}

export function useWindowContext(): WindowContextValue {
  const ctx = useContext(WindowContext);
  if (!ctx) throw new Error("useWindowContext must be used within WindowProvider");
  return ctx;
}