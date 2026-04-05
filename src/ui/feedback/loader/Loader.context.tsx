/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type LoaderSize = "xs" | "sm" | "md" | "lg" | "xl";
export type LoaderVariant = "default" | "primary" | "success" | "warning" | "danger";
export type LoaderTrack = "visible" | "hidden";
export type LoaderSpeed = "slow" | "normal" | "fast";

export interface LoaderState {
  isLoading: boolean;
  size: LoaderSize;
  variant: LoaderVariant;
  track: LoaderTrack;
  speed: LoaderSpeed;
  label?: string;
  disabled: boolean;
}

type LoaderAction =
  | { type: "START" }
  | { type: "STOP" }
  | { type: "TOGGLE" }
  | { type: "SET_LABEL"; payload: string | undefined }
  | { type: "SET_SIZE"; payload: LoaderSize }
  | { type: "SET_VARIANT"; payload: LoaderVariant };

function reducer(state: LoaderState, action: LoaderAction): LoaderState {
  switch (action.type) {
    case "START":
      return { ...state, isLoading: true };
    case "STOP":
      return { ...state, isLoading: false };
    case "TOGGLE":
      return { ...state, isLoading: !state.isLoading };
    case "SET_LABEL":
      return { ...state, label: action.payload };
    case "SET_SIZE":
      return { ...state, size: action.payload };
    case "SET_VARIANT":
      return { ...state, variant: action.payload };
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

export interface LoaderContextValue {
  state: LoaderState;
  dispatch: React.Dispatch<LoaderAction>;
  start: () => void;
  stop: () => void;
  toggle: () => void;
  setLabel: (label: string | undefined) => void;
}

const LoaderContext = createContext<LoaderContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export interface LoaderProviderProps {
  children: React.ReactNode;
  size?: LoaderSize;
  variant?: LoaderVariant;
  track?: LoaderTrack;
  speed?: LoaderSpeed;
  label?: string;
  defaultLoading?: boolean;
  disabled?: boolean;
  onStart?: () => void;
  onStop?: () => void;
}

export function LoaderProvider({
  children,
  size = "md",
  variant = "default",
  track = "visible",
  speed = "normal",
  label,
  defaultLoading = false,
  disabled = false,
  onStart,
  onStop,
}: LoaderProviderProps) {
  const [state, dispatch] = useReducer(reducer, {
    isLoading: defaultLoading,
    size,
    variant,
    track,
    speed,
    label,
    disabled,
  });

  const start = useCallback(() => {
    if (disabled) return;
    dispatch({ type: "START" });
    onStart?.();
  }, [disabled, onStart]);

  const stop = useCallback(() => {
    dispatch({ type: "STOP" });
    onStop?.();
  }, [onStop]);

  const toggle = useCallback(() => {
    if (disabled) return;
    if (state.isLoading) {
      dispatch({ type: "STOP" });
      onStop?.();
    } else {
      dispatch({ type: "START" });
      onStart?.();
    }
  }, [disabled, state.isLoading, onStart, onStop]);

  const setLabel = useCallback((label: string | undefined) => {
    dispatch({ type: "SET_LABEL", payload: label });
  }, []);

  return (
    <LoaderContext.Provider value={{ state, dispatch, start, stop, toggle, setLabel }}>
      {children}
    </LoaderContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useLoaderContext(): LoaderContextValue {
  const ctx = useContext(LoaderContext);
  if (!ctx) throw new Error("useLoaderContext must be used within LoaderProvider");
  return ctx;
}