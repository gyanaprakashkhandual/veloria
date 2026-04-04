import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useRef,
} from "react";

export type BreadcrumbSize = "sm" | "md" | "lg" | "xl";
export type BreadcrumbVariant = "default" | "filled" | "ghost" | "underline";
export type BreadcrumbSeparatorType = "slash" | "chevron" | "dot" | "arrow" | "custom";

export interface BreadcrumbItem {
  id: string;
  label: string;
  href?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}

export interface BreadcrumbState {
  activeId: string | null;
  collapsed: boolean;
  size: BreadcrumbSize;
  variant: BreadcrumbVariant;
}

type BreadcrumbAction =
  | { type: "SET_ACTIVE"; payload: string | null }
  | { type: "SET_COLLAPSED"; payload: boolean }
  | { type: "TOGGLE_COLLAPSED" };

function breadcrumbReducer(
  state: BreadcrumbState,
  action: BreadcrumbAction,
): BreadcrumbState {
  switch (action.type) {
    case "SET_ACTIVE":
      return { ...state, activeId: action.payload };
    case "SET_COLLAPSED":
      return { ...state, collapsed: action.payload };
    case "TOGGLE_COLLAPSED":
      return { ...state, collapsed: !state.collapsed };
    default:
      return state;
  }
}

export interface BreadcrumbContextValue {
  state: BreadcrumbState;
  dispatch: React.Dispatch<BreadcrumbAction>;
  setActive: (id: string | null) => void;
  setCollapsed: (collapsed: boolean) => void;
  toggleCollapsed: () => void;
  containerRef: React.RefObject<HTMLElement | null>;
  onItemClick?: (item: BreadcrumbItem) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextValue | null>(null);

export interface BreadcrumbProviderProps {
  children: React.ReactNode;
  defaultActiveId?: string | null;
  defaultCollapsed?: boolean;
  size?: BreadcrumbSize;
  variant?: BreadcrumbVariant;
  onItemClick?: (item: BreadcrumbItem) => void;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export function BreadcrumbProvider({
  children,
  defaultActiveId = null,
  defaultCollapsed = false,
  size = "md",
  variant = "default",
  onItemClick,
  onCollapsedChange,
}: BreadcrumbProviderProps) {
  const [state, dispatch] = useReducer(breadcrumbReducer, {
    activeId: defaultActiveId,
    collapsed: defaultCollapsed,
    size,
    variant,
  });

  const containerRef = useRef<HTMLElement>(null);

  const setActive = useCallback((id: string | null) => {
    dispatch({ type: "SET_ACTIVE", payload: id });
  }, []);

  const setCollapsed = useCallback(
    (collapsed: boolean) => {
      dispatch({ type: "SET_COLLAPSED", payload: collapsed });
      onCollapsedChange?.(collapsed);
    },
    [onCollapsedChange],
  );

  const toggleCollapsed = useCallback(() => {
    dispatch({ type: "TOGGLE_COLLAPSED" });
    onCollapsedChange?.(!state.collapsed);
  }, [state.collapsed, onCollapsedChange]);

  return (
    <BreadcrumbContext.Provider
      value={{
        state,
        dispatch,
        setActive,
        setCollapsed,
        toggleCollapsed,
        containerRef,
        onItemClick,
      }}
    >
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumbContext(): BreadcrumbContextValue {
  const ctx = useContext(BreadcrumbContext);
  if (!ctx)
    throw new Error(
      "useBreadcrumbContext must be used within BreadcrumbProvider",
    );
  return ctx;
}