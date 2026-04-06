/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";

export type ToolbarSize = "sm" | "md" | "lg" | "xl";
export type ToolbarVariant = "default" | "ghost" | "outline" | "filled";
export type ToolbarOrientation = "horizontal" | "vertical";

export interface ToolbarState {
  size: ToolbarSize;
  variant: ToolbarVariant;
  orientation: ToolbarOrientation;
  disabled: boolean;
  activeItems: Set<string>;
}

type ToolbarAction =
  | { type: "SET_ACTIVE"; payload: string }
  | { type: "UNSET_ACTIVE"; payload: string }
  | { type: "TOGGLE_ACTIVE"; payload: string }
  | { type: "CLEAR_ACTIVE" };

function reducer(state: ToolbarState, action: ToolbarAction): ToolbarState {
  switch (action.type) {
    case "SET_ACTIVE": {
      const next = new Set(state.activeItems);
      next.add(action.payload);
      return { ...state, activeItems: next };
    }
    case "UNSET_ACTIVE": {
      const next = new Set(state.activeItems);
      next.delete(action.payload);
      return { ...state, activeItems: next };
    }
    case "TOGGLE_ACTIVE": {
      const next = new Set(state.activeItems);
      next.has(action.payload) ? next.delete(action.payload) : next.add(action.payload);
      return { ...state, activeItems: next };
    }
    case "CLEAR_ACTIVE":
      return { ...state, activeItems: new Set() };
    default:
      return state;
  }
}

export interface ToolbarContextValue {
  state: ToolbarState;
  dispatch: React.Dispatch<ToolbarAction>;
  setActive: (id: string) => void;
  unsetActive: (id: string) => void;
  toggleActive: (id: string) => void;
  clearActive: () => void;
  isActive: (id: string) => boolean;
}

const ToolbarContext = createContext<ToolbarContextValue | null>(null);

export interface ToolbarProviderProps {
  children: React.ReactNode;
  size?: ToolbarSize;
  variant?: ToolbarVariant;
  orientation?: ToolbarOrientation;
  disabled?: boolean;
  defaultActiveIds?: string[];
}

export function ToolbarProvider({
  children,
  size = "md",
  variant = "default",
  orientation = "horizontal",
  disabled = false,
  defaultActiveIds = [],
}: ToolbarProviderProps) {
  const [state, dispatch] = useReducer(reducer, {
    size,
    variant,
    orientation,
    disabled,
    activeItems: new Set(defaultActiveIds),
  });

  const setActive = useCallback((id: string) => dispatch({ type: "SET_ACTIVE", payload: id }), []);
  const unsetActive = useCallback((id: string) => dispatch({ type: "UNSET_ACTIVE", payload: id }), []);
  const toggleActive = useCallback((id: string) => dispatch({ type: "TOGGLE_ACTIVE", payload: id }), []);
  const clearActive = useCallback(() => dispatch({ type: "CLEAR_ACTIVE" }), []);
  const isActive = useCallback((id: string) => state.activeItems.has(id), [state.activeItems]);

  return (
    <ToolbarContext.Provider value={{ state, dispatch, setActive, unsetActive, toggleActive, clearActive, isActive }}>
      {children}
    </ToolbarContext.Provider>
  );
}

export function useToolbarContext(): ToolbarContextValue {
  const ctx = useContext(ToolbarContext);
  if (!ctx) throw new Error("useToolbarContext must be used within ToolbarProvider");
  return ctx;
}