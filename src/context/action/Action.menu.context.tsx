/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useRef,
} from "react";

export type ActionMenuSize = "sm" | "md" | "lg" | "xl";
export type MenuAlign =
  | "bottom-left"
  | "bottom-right"
  | "top-left"
  | "top-right"
  | "auto";

export type ActionItemVariant = "default" | "danger" | "warning" | "success";

export interface ActionItem {
  id: string;
  label: string;
  description?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  trailingText?: string;
  variant?: ActionItemVariant;
  disabled?: boolean;
  dividerBefore?: boolean;
  header?: string;
  children?: ActionItem[];
  onClick?: () => void;
}

export interface ActionMenuState {
  isOpen: boolean;
  activeSubmenuPath: string[];
  size: ActionMenuSize;
  align: MenuAlign;
  disabled: boolean;
}

type ActionMenuAction =
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "TOGGLE" }
  | { type: "PUSH_SUBMENU"; payload: string }
  | { type: "POP_SUBMENU" }
  | { type: "RESET_SUBMENU" }
  | { type: "SET_SUBMENU_PATH"; payload: string[] };

function reducer(state: ActionMenuState, action: ActionMenuAction): ActionMenuState {
  switch (action.type) {
    case "OPEN":
      return { ...state, isOpen: true, activeSubmenuPath: [] };
    case "CLOSE":
      return { ...state, isOpen: false, activeSubmenuPath: [] };
    case "TOGGLE":
      return { ...state, isOpen: !state.isOpen, activeSubmenuPath: [] };
    case "PUSH_SUBMENU":
      return { ...state, activeSubmenuPath: [...state.activeSubmenuPath, action.payload] };
    case "POP_SUBMENU":
      return { ...state, activeSubmenuPath: state.activeSubmenuPath.slice(0, -1) };
    case "RESET_SUBMENU":
      return { ...state, activeSubmenuPath: [] };
    case "SET_SUBMENU_PATH":
      return { ...state, activeSubmenuPath: action.payload };
    default:
      return state;
  }
}

export interface ActionMenuContextValue {
  state: ActionMenuState;
  dispatch: React.Dispatch<ActionMenuAction>;
  open: () => void;
  close: () => void;
  toggle: () => void;
  pushSubmenu: (id: string) => void;
  popSubmenu: () => void;
  resetSubmenu: () => void;
  triggerRef: React.RefObject<HTMLDivElement | null>;
  onAction?: (item: ActionItem) => void;
}

const ActionMenuContext = createContext<ActionMenuContextValue | null>(null);

export interface ActionMenuProviderProps {
  children: React.ReactNode;
  size?: ActionMenuSize;
  align?: MenuAlign;
  disabled?: boolean;
  onAction?: (item: ActionItem) => void;
  onOpen?: () => void;
  onClose?: () => void;
}

export function ActionMenuProvider({
  children,
  size = "md",
  align = "auto",
  disabled = false,
  onAction,
  onOpen,
  onClose,
}: ActionMenuProviderProps) {
  const [state, dispatch] = useReducer(reducer, {
    isOpen: false,
    activeSubmenuPath: [],
    size,
    align,
    disabled,
  });

  const triggerRef = useRef<HTMLDivElement>(null);

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

  const pushSubmenu = useCallback((id: string) => {
    dispatch({ type: "PUSH_SUBMENU", payload: id });
  }, []);

  const popSubmenu = useCallback(() => {
    dispatch({ type: "POP_SUBMENU" });
  }, []);

  const resetSubmenu = useCallback(() => {
    dispatch({ type: "RESET_SUBMENU" });
  }, []);

  return (
    <ActionMenuContext.Provider
      value={{
        state,
        dispatch,
        open,
        close,
        toggle,
        pushSubmenu,
        popSubmenu,
        resetSubmenu,
        triggerRef,
        onAction,
      }}
    >
      {children}
    </ActionMenuContext.Provider>
  );
}

export function useActionMenuContext(): ActionMenuContextValue {
  const ctx = useContext(ActionMenuContext);
  if (!ctx) throw new Error("useActionMenuContext must be used within ActionMenuProvider");
  return ctx;
}