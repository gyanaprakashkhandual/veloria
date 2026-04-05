import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useRef,
} from "react";

export type CardSize = "sm" | "md" | "lg" | "xl";
export type CardVariant = "default" | "outlined" | "elevated" | "filled" | "ghost";
export type CardRadius = "none" | "sm" | "md" | "lg" | "xl" | "2xl";
export type CardOrientation = "vertical" | "horizontal";

export interface CardState {
  isOpen: boolean;
  isLoading: boolean;
  isCollapsed: boolean;
  size: CardSize;
  variant: CardVariant;
  radius: CardRadius;
  orientation: CardOrientation;
  isModal: boolean;
  disabled: boolean;
}

type CardAction =
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "TOGGLE_COLLAPSE" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_DISABLED"; payload: boolean };

function reducer(state: CardState, action: CardAction): CardState {
  switch (action.type) {
    case "OPEN":
      return { ...state, isOpen: true };
    case "CLOSE":
      return { ...state, isOpen: false };
    case "TOGGLE_COLLAPSE":
      return { ...state, isCollapsed: !state.isCollapsed };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_DISABLED":
      return { ...state, disabled: action.payload };
    default:
      return state;
  }
}

export interface CardContextValue {
  state: CardState;
  dispatch: React.Dispatch<CardAction>;
  open: () => void;
  close: () => void;
  toggleCollapse: () => void;
  setLoading: (v: boolean) => void;
  cardRef: React.RefObject<HTMLDivElement | null>;
}

const CardContext = createContext<CardContextValue | null>(null);

export interface CardProviderProps {
  children: React.ReactNode;
  size?: CardSize;
  variant?: CardVariant;
  radius?: CardRadius;
  orientation?: CardOrientation;
  isModal?: boolean;
  defaultOpen?: boolean;
  defaultCollapsed?: boolean;
  disabled?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
}

export function CardProvider({
  children,
  size = "md",
  variant = "default",
  radius = "xl",
  orientation = "vertical",
  isModal = false,
  defaultOpen = true,
  defaultCollapsed = false,
  disabled = false,
  onClose,
  onOpen,
}: CardProviderProps) {
  const [state, dispatch] = useReducer(reducer, {
    isOpen: defaultOpen,
    isLoading: false,
    isCollapsed: defaultCollapsed,
    size,
    variant,
    radius,
    orientation,
    isModal,
    disabled,
  });

  const cardRef = useRef<HTMLDivElement>(null);

  const open = useCallback(() => {
    dispatch({ type: "OPEN" });
    onOpen?.();
  }, [onOpen]);

  const close = useCallback(() => {
    dispatch({ type: "CLOSE" });
    onClose?.();
  }, [onClose]);

  const toggleCollapse = useCallback(() => {
    dispatch({ type: "TOGGLE_COLLAPSE" });
  }, []);

  const setLoading = useCallback((v: boolean) => {
    dispatch({ type: "SET_LOADING", payload: v });
  }, []);

  return (
    <CardContext.Provider
      value={{ state, dispatch, open, close, toggleCollapse, setLoading, cardRef }}
    >
      {children}
    </CardContext.Provider>
  );
}

export function useCardContext(): CardContextValue {
  const ctx = useContext(CardContext);
  if (!ctx) throw new Error("useCardContext must be used within CardProvider");
  return ctx;
}