/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useRef,
} from "react";

// ─── Public Types ─────────────────────────────────────────────────────────────

export type TabsSize = "sm" | "md" | "lg" | "xl";
export type TabsVariant = "underline" | "pill" | "card" | "filled";
export type TabsOrientation = "horizontal" | "vertical";

export interface TabsDef {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number | boolean;
  disabled?: boolean;
  /** Whether this tab can be closed (shows × button) */
  closeable?: boolean;
  /** Tooltip text */
  tooltip?: string;
}

// ─── State & Actions ──────────────────────────────────────────────────────────

export interface TabsState {
  activeId: string;
  closedIds: Set<string>;
  size: TabsSize;
  variant: TabsVariant;
  orientation: TabsOrientation;
  disabled: boolean;
}

type TabsAction =
  | { type: "SET_ACTIVE"; payload: string }
  | { type: "CLOSE_TAB"; payload: string }
  | { type: "REOPEN_TAB"; payload: string }
  | { type: "CLOSE_ALL" };

function reducer(state: TabsState, action: TabsAction): TabsState {
  switch (action.type) {
    case "SET_ACTIVE":
      return { ...state, activeId: action.payload };
    case "CLOSE_TAB": {
      const next = new Set(state.closedIds);
      next.add(action.payload);
      return { ...state, closedIds: next };
    }
    case "REOPEN_TAB": {
      const next = new Set(state.closedIds);
      next.delete(action.payload);
      return { ...state, closedIds: next };
    }
    case "CLOSE_ALL":
      return { ...state, closedIds: new Set() };
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

export interface TabsContextValue {
  state: TabsState;
  dispatch: React.Dispatch<TabsAction>;
  setActive: (id: string) => void;
  closeTab: (id: string) => void;
  reopenTab: (id: string) => void;
  isActive: (id: string) => boolean;
  isClosed: (id: string) => boolean;
  /** Ref attached to the tab list for scroll/indicator measurements */
  listRef: React.RefObject<HTMLDivElement | null>;
  onTabChange?: (id: string) => void;
  onTabClose?: (id: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export interface TabsProviderProps {
  children: React.ReactNode;
  defaultActiveId: string;
  size?: TabsSize;
  variant?: TabsVariant;
  orientation?: TabsOrientation;
  disabled?: boolean;
  onTabChange?: (id: string) => void;
  onTabClose?: (id: string) => void;
}

export function TabsProvider({
  children,
  defaultActiveId,
  size = "md",
  variant = "underline",
  orientation = "horizontal",
  disabled = false,
  onTabChange,
  onTabClose,
}: TabsProviderProps) {
  const [state, dispatch] = useReducer(reducer, {
    activeId: defaultActiveId,
    closedIds: new Set<string>(),
    size,
    variant,
    orientation,
    disabled,
  });

  const listRef = useRef<HTMLDivElement>(null);

  const setActive = useCallback(
    (id: string) => {
      dispatch({ type: "SET_ACTIVE", payload: id });
      onTabChange?.(id);
    },
    [onTabChange],
  );

  const closeTab = useCallback(
    (id: string) => {
      dispatch({ type: "CLOSE_TAB", payload: id });
      onTabClose?.(id);
    },
    [onTabClose],
  );

  const reopenTab = useCallback((id: string) => {
    dispatch({ type: "REOPEN_TAB", payload: id });
  }, []);

  const isActive = useCallback(
    (id: string) => state.activeId === id,
    [state.activeId],
  );

  const isClosed = useCallback(
    (id: string) => state.closedIds.has(id),
    [state.closedIds],
  );

  return (
    <TabsContext.Provider
      value={{
        state,
        dispatch,
        setActive,
        closeTab,
        reopenTab,
        isActive,
        isClosed,
        listRef,
        onTabChange,
        onTabClose,
      }}
    >
      {children}
    </TabsContext.Provider>
  );
}

export function useTabsContext(): TabsContextValue {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("useTabsContext must be used within TabsProvider");
  return ctx;
}