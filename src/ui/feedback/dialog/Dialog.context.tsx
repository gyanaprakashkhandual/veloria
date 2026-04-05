import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useRef,
} from "react";

export type DialogSize = "sm" | "md" | "lg" | "xl" | "full";
export type DialogVariant = "default" | "danger" | "warning" | "success" | "info";
export type DialogPosition = "center" | "top" | "bottom";

export interface DialogState {
  isOpen: boolean;
  size: DialogSize;
  variant: DialogVariant;
  position: DialogPosition;
  isDismissible: boolean;
}

type DialogAction =
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "TOGGLE" };

function reducer(state: DialogState, action: DialogAction): DialogState {
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

export interface DialogContextValue {
  state: DialogState;
  dispatch: React.Dispatch<DialogAction>;
  open: () => void;
  close: () => void;
  toggle: () => void;
  triggerRef: React.RefObject<HTMLElement | null>;
}

const DialogContext = createContext<DialogContextValue | null>(null);

export interface DialogProviderProps {
  children: React.ReactNode;
  size?: DialogSize;
  variant?: DialogVariant;
  position?: DialogPosition;
  isDismissible?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

export function DialogProvider({
  children,
  size = "md",
  variant = "default",
  position = "center",
  isDismissible = true,
  onOpen,
  onClose,
}: DialogProviderProps) {
  const [state, dispatch] = useReducer(reducer, {
    isOpen: false,
    size,
    variant,
    position,
    isDismissible,
  });

  const triggerRef = useRef<HTMLElement>(null);

  const open = useCallback(() => {
    dispatch({ type: "OPEN" });
    onOpen?.();
  }, [onOpen]);

  const close = useCallback(() => {
    dispatch({ type: "CLOSE" });
    onClose?.();
  }, [onClose]);

  const toggle = useCallback(() => {
    if (state.isOpen) {
      dispatch({ type: "CLOSE" });
      onClose?.();
    } else {
      dispatch({ type: "OPEN" });
      onOpen?.();
    }
  }, [state.isOpen, onOpen, onClose]);

  return (
    <DialogContext.Provider
      value={{ state, dispatch, open, close, toggle, triggerRef }}
    >
      {children}
    </DialogContext.Provider>
  );
}

export function useDialogContext(): DialogContextValue {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error("useDialogContext must be used within DialogProvider");
  return ctx;
}