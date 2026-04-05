import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useRef,
} from "react";

export type MessageVariant = "default" | "danger" | "warning" | "success" | "info";
export type MessageSize = "sm" | "md" | "lg" | "xl";
export type MessagePosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right"
  | "inline";
export type MessageLayout = "row" | "stack";

export interface MessageAction {
  id: string;
  label: string;
  onClick: () => void;
  variant?: "primary" | "ghost" | "outline";
  disabled?: boolean;
  leadingIcon?: React.ReactNode;
}

export interface MessageState {
  isVisible: boolean;
  variant: MessageVariant;
  size: MessageSize;
  position: MessagePosition;
  layout: MessageLayout;
  isDismissible: boolean;
  hasModal: boolean;
  isModalOpen: boolean;
}

type MessageAction_ =
  | { type: "SHOW" }
  | { type: "HIDE" }
  | { type: "TOGGLE" }
  | { type: "OPEN_MODAL" }
  | { type: "CLOSE_MODAL" }
  | { type: "TOGGLE_MODAL" };

function reducer(state: MessageState, action: MessageAction_): MessageState {
  switch (action.type) {
    case "SHOW":
      return { ...state, isVisible: true };
    case "HIDE":
      return { ...state, isVisible: false, isModalOpen: false };
    case "TOGGLE":
      return { ...state, isVisible: !state.isVisible };
    case "OPEN_MODAL":
      return { ...state, isModalOpen: true };
    case "CLOSE_MODAL":
      return { ...state, isModalOpen: false };
    case "TOGGLE_MODAL":
      return { ...state, isModalOpen: !state.isModalOpen };
    default:
      return state;
  }
}

export interface MessageContextValue {
  state: MessageState;
  dispatch: React.Dispatch<MessageAction_>;
  show: () => void;
  hide: () => void;
  toggle: () => void;
  openModal: () => void;
  closeModal: () => void;
  toggleModal: () => void;
  anchorRef: React.RefObject<HTMLDivElement | null>;
}

const MessageContext = createContext<MessageContextValue | null>(null);

export interface MessageProviderProps {
  children: React.ReactNode;
  variant?: MessageVariant;
  size?: MessageSize;
  position?: MessagePosition;
  layout?: MessageLayout;
  isDismissible?: boolean;
  hasModal?: boolean;
  onShow?: () => void;
  onHide?: () => void;
  onModalOpen?: () => void;
  onModalClose?: () => void;
}

export function MessageProvider({
  children,
  variant = "default",
  size = "md",
  position = "inline",
  layout = "row",
  isDismissible = true,
  hasModal = false,
  onShow,
  onHide,
  onModalOpen,
  onModalClose,
}: MessageProviderProps) {
  const [state, dispatch] = useReducer(reducer, {
    isVisible: true,
    variant,
    size,
    position,
    layout,
    isDismissible,
    hasModal,
    isModalOpen: false,
  });

  const anchorRef = useRef<HTMLDivElement>(null);

  const show = useCallback(() => {
    dispatch({ type: "SHOW" });
    onShow?.();
  }, [onShow]);

  const hide = useCallback(() => {
    dispatch({ type: "HIDE" });
    onHide?.();
  }, [onHide]);

  const toggle = useCallback(() => {
    if (state.isVisible) {
      dispatch({ type: "HIDE" });
      onHide?.();
    } else {
      dispatch({ type: "SHOW" });
      onShow?.();
    }
  }, [state.isVisible, onShow, onHide]);

  const openModal = useCallback(() => {
    dispatch({ type: "OPEN_MODAL" });
    onModalOpen?.();
  }, [onModalOpen]);

  const closeModal = useCallback(() => {
    dispatch({ type: "CLOSE_MODAL" });
    onModalClose?.();
  }, [onModalClose]);

  const toggleModal = useCallback(() => {
    if (state.isModalOpen) {
      dispatch({ type: "CLOSE_MODAL" });
      onModalClose?.();
    } else {
      dispatch({ type: "OPEN_MODAL" });
      onModalOpen?.();
    }
  }, [state.isModalOpen, onModalOpen, onModalClose]);

  return (
    <MessageContext.Provider
      value={{
        state,
        dispatch,
        show,
        hide,
        toggle,
        openModal,
        closeModal,
        toggleModal,
        anchorRef,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
}

export function useMessageContext(): MessageContextValue {
  const ctx = useContext(MessageContext);
  if (!ctx) throw new Error("useMessageContext must be used within MessageProvider");
  return ctx;
}