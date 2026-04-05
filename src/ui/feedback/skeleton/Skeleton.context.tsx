/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SkeletonAnimation = "pulse" | "wave" | "none";
export type SkeletonRadius  = "none" | "sm" | "md" | "lg" | "full";
export type SkeletonSpeed   = "slow" | "normal" | "fast";
export type SkeletonTheme   = "default" | "muted" | "strong";

export interface SkeletonState {
  loading:   boolean;
  animation: SkeletonAnimation;
  radius:    SkeletonRadius;
  speed:     SkeletonSpeed;
  theme:     SkeletonTheme;
  disabled:  boolean;
}

type SkeletonAction =
  | { type: "START" }
  | { type: "STOP" }
  | { type: "TOGGLE" }
  | { type: "SET_ANIMATION"; payload: SkeletonAnimation }
  | { type: "SET_RADIUS";    payload: SkeletonRadius }
  | { type: "SET_SPEED";     payload: SkeletonSpeed }
  | { type: "SET_THEME";     payload: SkeletonTheme };

function reducer(state: SkeletonState, action: SkeletonAction): SkeletonState {
  switch (action.type) {
    case "START":
      return { ...state, loading: true };
    case "STOP":
      return { ...state, loading: false };
    case "TOGGLE":
      return { ...state, loading: !state.loading };
    case "SET_ANIMATION":
      return { ...state, animation: action.payload };
    case "SET_RADIUS":
      return { ...state, radius: action.payload };
    case "SET_SPEED":
      return { ...state, speed: action.payload };
    case "SET_THEME":
      return { ...state, theme: action.payload };
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

export interface SkeletonContextValue {
  state:        SkeletonState;
  dispatch:     React.Dispatch<SkeletonAction>;
  start:        () => void;
  stop:         () => void;
  toggle:       () => void;
  setAnimation: (a: SkeletonAnimation) => void;
  setRadius:    (r: SkeletonRadius)    => void;
  setSpeed:     (s: SkeletonSpeed)     => void;
  setTheme:     (t: SkeletonTheme)     => void;
}

const SkeletonContext = createContext<SkeletonContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export interface SkeletonProviderProps {
  children:        React.ReactNode;
  /** Whether children are in a loading state */
  loading?:        boolean;
  animation?:      SkeletonAnimation;
  radius?:         SkeletonRadius;
  speed?:          SkeletonSpeed;
  theme?:          SkeletonTheme;
  disabled?:       boolean;
  onStart?:        () => void;
  onStop?:         () => void;
}

export function SkeletonProvider({
  children,
  loading   = true,
  animation = "wave",
  radius    = "md",
  speed     = "normal",
  theme     = "default",
  disabled  = false,
  onStart,
  onStop,
}: SkeletonProviderProps) {
  const [state, dispatch] = useReducer(reducer, {
    loading,
    animation,
    radius,
    speed,
    theme,
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
    if (state.loading) {
      dispatch({ type: "STOP" });
      onStop?.();
    } else {
      dispatch({ type: "START" });
      onStart?.();
    }
  }, [disabled, state.loading, onStart, onStop]);

  const setAnimation = useCallback(
    (a: SkeletonAnimation) => dispatch({ type: "SET_ANIMATION", payload: a }),
    [],
  );
  const setRadius = useCallback(
    (r: SkeletonRadius) => dispatch({ type: "SET_RADIUS", payload: r }),
    [],
  );
  const setSpeed = useCallback(
    (s: SkeletonSpeed) => dispatch({ type: "SET_SPEED", payload: s }),
    [],
  );
  const setTheme = useCallback(
    (t: SkeletonTheme) => dispatch({ type: "SET_THEME", payload: t }),
    [],
  );

  return (
    <SkeletonContext.Provider
      value={{ state, dispatch, start, stop, toggle, setAnimation, setRadius, setSpeed, setTheme }}
    >
      {children}
    </SkeletonContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useSkeletonContext(): SkeletonContextValue {
  const ctx = useContext(SkeletonContext);
  if (!ctx) throw new Error("useSkeletonContext must be used within SkeletonProvider");
  return ctx;
}