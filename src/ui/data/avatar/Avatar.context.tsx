import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useRef,
} from "react";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
export type AvatarShape = "circle" | "square" | "rounded";
export type AvatarStatus = "online" | "offline" | "away" | "busy" | "none";
export type AvatarVariant = "image" | "initials" | "icon" | "fallback";
export type AvatarGroupLayout = "stack" | "grid" | "list";
export type PresencePosition = "top-right" | "top-left" | "bottom-right" | "bottom-left";

export interface AvatarState {
  size: AvatarSize;
  shape: AvatarShape;
  status: AvatarStatus;
  variant: AvatarVariant;
  isLoading: boolean;
  hasError: boolean;
  isInteractive: boolean;
  presencePosition: PresencePosition;
  disabled: boolean;
}

type AvatarAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: boolean }
  | { type: "SET_STATUS"; payload: AvatarStatus }
  | { type: "SET_VARIANT"; payload: AvatarVariant };

function reducer(state: AvatarState, action: AvatarAction): AvatarState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, hasError: action.payload };
    case "SET_STATUS":
      return { ...state, status: action.payload };
    case "SET_VARIANT":
      return { ...state, variant: action.payload };
    default:
      return state;
  }
}

export interface AvatarContextValue {
  state: AvatarState;
  dispatch: React.Dispatch<AvatarAction>;
  setLoading: (v: boolean) => void;
  setError: (v: boolean) => void;
  setStatus: (v: AvatarStatus) => void;
  avatarRef: React.RefObject<HTMLDivElement | null>;
}

const AvatarContext = createContext<AvatarContextValue | null>(null);

export interface AvatarProviderProps {
  children: React.ReactNode;
  size?: AvatarSize;
  shape?: AvatarShape;
  status?: AvatarStatus;
  variant?: AvatarVariant;
  isInteractive?: boolean;
  presencePosition?: PresencePosition;
  disabled?: boolean;
}

export function AvatarProvider({
  children,
  size = "md",
  shape = "circle",
  status = "none",
  variant = "image",
  isInteractive = false,
  presencePosition = "bottom-right",
  disabled = false,
}: AvatarProviderProps) {
  const [state, dispatch] = useReducer(reducer, {
    size,
    shape,
    status,
    variant,
    isLoading: false,
    hasError: false,
    isInteractive,
    presencePosition,
    disabled,
  });

  const avatarRef = useRef<HTMLDivElement>(null);

  const setLoading = useCallback((v: boolean) => {
    dispatch({ type: "SET_LOADING", payload: v });
  }, []);

  const setError = useCallback((v: boolean) => {
    dispatch({ type: "SET_ERROR", payload: v });
  }, []);

  const setStatus = useCallback((v: AvatarStatus) => {
    dispatch({ type: "SET_STATUS", payload: v });
  }, []);

  return (
    <AvatarContext.Provider value={{ state, dispatch, setLoading, setError, setStatus, avatarRef }}>
      {children}
    </AvatarContext.Provider>
  );
}

export function useAvatarContext(): AvatarContextValue {
  const ctx = useContext(AvatarContext);
  if (!ctx) throw new Error("useAvatarContext must be used within AvatarProvider");
  return ctx;
}

export interface AvatarGroupContextValue {
  size: AvatarSize;
  shape: AvatarShape;
  layout: AvatarGroupLayout;
  max: number;
  total: number;
  spacing: number;
}

const AvatarGroupContext = createContext<AvatarGroupContextValue | null>(null);

export function AvatarGroupProvider({
  children,
  size = "md",
  shape = "circle",
  layout = "stack",
  max = 5,
  total = 0,
  spacing = -8,
}: AvatarGroupContextValue & { children: React.ReactNode }) {
  return (
    <AvatarGroupContext.Provider value={{ size, shape, layout, max, total, spacing }}>
      {children}
    </AvatarGroupContext.Provider>
  );
}

export function useAvatarGroupContext(): AvatarGroupContextValue | null {
  return useContext(AvatarGroupContext);
}