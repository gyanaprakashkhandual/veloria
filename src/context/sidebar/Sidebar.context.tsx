import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useRef,
  useEffect,
} from "react";

export type SidebarSize = "sm" | "md" | "lg";
export type SidebarVariant = "default" | "filled" | "ghost" | "glass";
export type SidebarPosition = "left" | "right";
export type SidebarState_Mode = "expanded" | "collapsed" | "hidden";

export interface SidebarItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
  disabled?: boolean;
  dividerBefore?: boolean;
  header?: string;
  href?: string;
  children?: SidebarItem[];
  onClick?: () => void;
}

export interface SidebarState {
  mode: SidebarState_Mode;
  activeItem: string | null;
  expandedItems: string[];
  searchValue: string;
  searchOpen: boolean;
  size: SidebarSize;
  variant: SidebarVariant;
  mobileOpen: boolean;
}

type SidebarAction =
  | { type: "SET_MODE"; payload: SidebarState_Mode }
  | { type: "CYCLE_MODE" }
  | { type: "SET_ACTIVE"; payload: string | null }
  | { type: "TOGGLE_EXPAND"; payload: string }
  | { type: "SET_EXPANDED"; payload: string[] }
  | { type: "SET_SEARCH"; payload: string }
  | { type: "TOGGLE_SEARCH" }
  | { type: "CLOSE_SEARCH" }
  | { type: "TOGGLE_MOBILE" }
  | { type: "CLOSE_MOBILE" };

const STORAGE_KEY = "sidebar_state";

function loadPersistedState(): Partial<SidebarState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Partial<SidebarState>;
  } catch {
    return {};
  }
}

function persistState(state: SidebarState) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        mode: state.mode,
        activeItem: state.activeItem,
        expandedItems: state.expandedItems,
      }),
    );
  } catch {}
}

function sidebarReducer(state: SidebarState, action: SidebarAction): SidebarState {
  switch (action.type) {
    case "SET_MODE":
      return { ...state, mode: action.payload };
    case "CYCLE_MODE": {
      const cycle: Record<SidebarState_Mode, SidebarState_Mode> = {
        expanded: "collapsed",
        collapsed: "hidden",
        hidden: "expanded",
      };
      return { ...state, mode: cycle[state.mode] };
    }
    case "SET_ACTIVE":
      return { ...state, activeItem: action.payload };
    case "TOGGLE_EXPAND": {
      const already = state.expandedItems.includes(action.payload);
      return {
        ...state,
        expandedItems: already
          ? state.expandedItems.filter((v) => v !== action.payload)
          : [...state.expandedItems, action.payload],
      };
    }
    case "SET_EXPANDED":
      return { ...state, expandedItems: action.payload };
    case "SET_SEARCH":
      return { ...state, searchValue: action.payload };
    case "TOGGLE_SEARCH":
      return {
        ...state,
        searchOpen: !state.searchOpen,
        searchValue: !state.searchOpen ? state.searchValue : "",
      };
    case "CLOSE_SEARCH":
      return { ...state, searchOpen: false, searchValue: "" };
    case "TOGGLE_MOBILE":
      return { ...state, mobileOpen: !state.mobileOpen };
    case "CLOSE_MOBILE":
      return { ...state, mobileOpen: false };
    default:
      return state;
  }
}

export interface SidebarContextValue {
  state: SidebarState;
  dispatch: React.Dispatch<SidebarAction>;
  setMode: (mode: SidebarState_Mode) => void;
  cycleMode: () => void;
  expand: () => void;
  collapse: () => void;
  hide: () => void;
  setActiveItem: (id: string | null) => void;
  toggleExpand: (id: string) => void;
  isExpanded: (id: string) => boolean;
  isActive: (id: string) => boolean;
  setSearch: (val: string) => void;
  toggleSearch: () => void;
  closeSearch: () => void;
  toggleMobile: () => void;
  closeMobile: () => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  isCollapsed: boolean;
  isHidden: boolean;
  isFullyOpen: boolean;
  onActiveChange?: (id: string) => void;
  onModeChange?: (mode: SidebarState_Mode) => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export interface SidebarProviderProps {
  children: React.ReactNode;
  defaultActiveItem?: string | null;
  defaultMode?: SidebarState_Mode;
  size?: SidebarSize;
  variant?: SidebarVariant;
  persistToStorage?: boolean;
  enableKeyboardShortcut?: boolean;
  onActiveChange?: (id: string) => void;
  onModeChange?: (mode: SidebarState_Mode) => void;
}

export function SidebarProvider({
  children,
  defaultActiveItem = null,
  defaultMode = "expanded",
  size = "md",
  variant = "default",
  persistToStorage = true,
  enableKeyboardShortcut = true,
  onActiveChange,
  onModeChange,
}: SidebarProviderProps) {
  const persisted = persistToStorage ? loadPersistedState() : {};

  const [state, dispatch] = useReducer(sidebarReducer, {
    mode: persisted.mode ?? defaultMode,
    activeItem: persisted.activeItem ?? defaultActiveItem,
    expandedItems: persisted.expandedItems ?? [],
    searchValue: "",
    searchOpen: false,
    size,
    variant,
    mobileOpen: false,
  });

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (persistToStorage) persistState(state);
  }, [state.mode, state.activeItem, state.expandedItems, persistToStorage]);

  const setMode = useCallback(
    (mode: SidebarState_Mode) => {
      dispatch({ type: "SET_MODE", payload: mode });
      onModeChange?.(mode);
    },
    [onModeChange],
  );

  const cycleMode = useCallback(() => {
    dispatch({ type: "CYCLE_MODE" });
    const cycle: Record<SidebarState_Mode, SidebarState_Mode> = {
      expanded: "collapsed",
      collapsed: "hidden",
      hidden: "expanded",
    };
    onModeChange?.(cycle[state.mode]);
  }, [state.mode, onModeChange]);

  const expand = useCallback(() => setMode("expanded"), [setMode]);
  const collapse = useCallback(() => setMode("collapsed"), [setMode]);
  const hide = useCallback(() => setMode("hidden"), [setMode]);

  const setActiveItem = useCallback(
    (id: string | null) => {
      dispatch({ type: "SET_ACTIVE", payload: id });
      if (id) onActiveChange?.(id);
    },
    [onActiveChange],
  );

  const toggleExpand = useCallback((id: string) => {
    dispatch({ type: "TOGGLE_EXPAND", payload: id });
  }, []);

  const isExpanded = useCallback(
    (id: string) => state.expandedItems.includes(id),
    [state.expandedItems],
  );

  const isActive = useCallback(
    (id: string) => state.activeItem === id,
    [state.activeItem],
  );

  const setSearch = useCallback((val: string) => {
    dispatch({ type: "SET_SEARCH", payload: val });
  }, []);

  const toggleSearch = useCallback(() => {
    dispatch({ type: "TOGGLE_SEARCH" });
    setTimeout(() => searchInputRef.current?.focus(), 60);
  }, []);

  const closeSearch = useCallback(() => {
    dispatch({ type: "CLOSE_SEARCH" });
  }, []);

  const toggleMobile = useCallback(() => {
    dispatch({ type: "TOGGLE_MOBILE" });
  }, []);

  const closeMobile = useCallback(() => {
    dispatch({ type: "CLOSE_MOBILE" });
  }, []);

  useEffect(() => {
    if (!enableKeyboardShortcut) return;
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "b") {
        e.preventDefault();
        dispatch({ type: "CYCLE_MODE" });
        const cycle: Record<SidebarState_Mode, SidebarState_Mode> = {
          expanded: "collapsed",
          collapsed: "hidden",
          hidden: "expanded",
        };
        onModeChange?.(cycle[state.mode]);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [enableKeyboardShortcut, state.mode, onModeChange]);

  const isCollapsed = state.mode === "collapsed";
  const isHidden = state.mode === "hidden";
  const isFullyOpen = state.mode === "expanded";

  return (
    <SidebarContext.Provider
      value={{
        state,
        dispatch,
        setMode,
        cycleMode,
        expand,
        collapse,
        hide,
        setActiveItem,
        toggleExpand,
        isExpanded,
        isActive,
        setSearch,
        toggleSearch,
        closeSearch,
        toggleMobile,
        closeMobile,
        searchInputRef,
        isCollapsed,
        isHidden,
        isFullyOpen,
        onActiveChange,
        onModeChange,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebarContext(): SidebarContextValue {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebarContext must be used within SidebarProvider");
  return ctx;
}