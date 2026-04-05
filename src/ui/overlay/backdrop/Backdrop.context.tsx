import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useRef,
  useEffect,
} from "react";

export type BackdropBlur = "none" | "sm" | "md" | "lg" | "xl";
export type BackdropVariant = "dark" | "light" | "blur" | "frosted" | "transparent" | "color";
export type BackdropEnterAnimation =
  | "fade"
  | "zoom"
  | "slide-up"
  | "slide-down"
  | "slide-left"
  | "slide-right"
  | "flip"
  | "none";
export type BackdropPlacement =
  | "center"
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";
export type BackdropScrollBehavior = "inside" | "outside";
export type BackdropSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full" | "auto";

export interface BackdropState {
  isOpen: boolean;
  isClosing: boolean;
  isMounted: boolean;
  variant: BackdropVariant;
  blur: BackdropBlur;
  enterAnimation: BackdropEnterAnimation;
  placement: BackdropPlacement;
  size: BackdropSize;
  scrollBehavior: BackdropScrollBehavior;
  closeOnBackdropClick: boolean;
  closeOnEsc: boolean;
  isDismissable: boolean;
  hasBackdrop: boolean;
  isFullScreen: boolean;
  motionPreset: BackdropEnterAnimation;
  backdropColor: string;
  stackIndex: number;
}

type BackdropAction =
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "START_CLOSE" }
  | { type: "UNMOUNT" }
  | { type: "SET_VARIANT"; payload: BackdropVariant }
  | { type: "SET_BLUR"; payload: BackdropBlur }
  | { type: "SET_ANIMATION"; payload: BackdropEnterAnimation }
  | { type: "SET_PLACEMENT"; payload: BackdropPlacement }
  | { type: "SET_SIZE"; payload: BackdropSize }
  | { type: "SET_FULLSCREEN"; payload: boolean }
  | { type: "SET_STACK_INDEX"; payload: number };

function reducer(state: BackdropState, action: BackdropAction): BackdropState {
  switch (action.type) {
    case "OPEN":
      return { ...state, isOpen: true, isClosing: false, isMounted: true };
    case "START_CLOSE":
      return { ...state, isClosing: true };
    case "CLOSE":
      return { ...state, isOpen: false, isClosing: false };
    case "UNMOUNT":
      return { ...state, isMounted: false };
    case "SET_VARIANT":
      return { ...state, variant: action.payload };
    case "SET_BLUR":
      return { ...state, blur: action.payload };
    case "SET_ANIMATION":
      return { ...state, enterAnimation: action.payload, motionPreset: action.payload };
    case "SET_PLACEMENT":
      return { ...state, placement: action.payload };
    case "SET_SIZE":
      return { ...state, size: action.payload };
    case "SET_FULLSCREEN":
      return { ...state, isFullScreen: action.payload };
    case "SET_STACK_INDEX":
      return { ...state, stackIndex: action.payload };
    default:
      return state;
  }
}

export interface BackdropContextValue {
  state: BackdropState;
  dispatch: React.Dispatch<BackdropAction>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  open: () => void;
  close: () => void;
  toggle: () => void;
  onOpenCallback?: () => void;
  onCloseCallback?: () => void;
  onBackdropClickCallback?: () => void;
}

const BackdropContext = createContext<BackdropContextValue | null>(null);

export interface BackdropProviderProps {
  children: React.ReactNode;
  isOpen?: boolean;
  defaultOpen?: boolean;
  variant?: BackdropVariant;
  blur?: BackdropBlur;
  enterAnimation?: BackdropEnterAnimation;
  placement?: BackdropPlacement;
  size?: BackdropSize;
  scrollBehavior?: BackdropScrollBehavior;
  closeOnBackdropClick?: boolean;
  closeOnEsc?: boolean;
  isDismissable?: boolean;
  hasBackdrop?: boolean;
  isFullScreen?: boolean;
  backdropColor?: string;
  onOpen?: () => void;
  onClose?: () => void;
  onBackdropClick?: () => void;
}

export function BackdropProvider({
  children,
  isOpen: controlledOpen,
  defaultOpen = false,
  variant = "dark",
  blur = "sm",
  enterAnimation = "fade",
  placement = "center",
  size = "md",
  scrollBehavior = "inside",
  closeOnBackdropClick = true,
  closeOnEsc = true,
  isDismissable = true,
  hasBackdrop = true,
  isFullScreen = false,
  backdropColor = "",
  onOpen,
  onClose,
  onBackdropClick,
}: BackdropProviderProps) {
  const isControlled = controlledOpen !== undefined;

  const [state, dispatch] = useReducer(reducer, {
    isOpen: isControlled ? controlledOpen! : defaultOpen,
    isClosing: false,
    isMounted: isControlled ? controlledOpen! : defaultOpen,
    variant,
    blur,
    enterAnimation,
    placement,
    size,
    scrollBehavior,
    closeOnBackdropClick,
    closeOnEsc,
    isDismissable,
    hasBackdrop,
    isFullScreen,
    motionPreset: enterAnimation,
    backdropColor,
    stackIndex: 0,
  });

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isControlled) {
      if (controlledOpen && !state.isOpen) {
        dispatch({ type: "OPEN" });
      } else if (!controlledOpen && state.isOpen) {
        dispatch({ type: "START_CLOSE" });
      }
    }
  }, [controlledOpen, isControlled, state.isOpen]);

  useEffect(() => {
    if (!state.isOpen && !state.isClosing) return;
    if (state.isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [state.isOpen, state.isClosing]);

  const open = useCallback(() => {
    dispatch({ type: "OPEN" });
    onOpen?.();
  }, [onOpen]);

  const close = useCallback(() => {
    dispatch({ type: "START_CLOSE" });
  }, []);

  const toggle = useCallback(() => {
    if (state.isOpen) {
      dispatch({ type: "START_CLOSE" });
    } else {
      dispatch({ type: "OPEN" });
      onOpen?.();
    }
  }, [state.isOpen, onOpen]);

  return (
    <BackdropContext.Provider
      value={{
        state,
        dispatch,
        contentRef,
        open,
        close,
        toggle,
        onOpenCallback: onOpen,
        onCloseCallback: onClose,
        onBackdropClickCallback: onBackdropClick,
      }}
    >
      {children}
    </BackdropContext.Provider>
  );
}

export function useBackdropContext(): BackdropContextValue {
  const ctx = useContext(BackdropContext);
  if (!ctx) throw new Error("useBackdropContext must be used within BackdropProvider");
  return ctx;
}