import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useRef,
} from "react";

export type NavbarSize = "sm" | "md" | "lg";
export type NavbarVariant = "default" | "filled" | "ghost" | "glass";
export type NavbarPosition = "static" | "sticky" | "fixed" | "relative";
export type NavbarTheme = "light" | "dark" | "system";

export interface NavItem {
  id: string;
  label: string;
  href?: string;
  icon?: React.ReactNode;
  badge?: string | number;
  disabled?: boolean;
  children?: NavItem[];
  onClick?: () => void;
}

export interface NavbarState {
  mobileOpen: boolean;
  activeTab: string | null;
  searchOpen: boolean;
  searchValue: string;
  theme: NavbarTheme;
  size: NavbarSize;
  variant: NavbarVariant;
  scrolled: boolean;
}

type NavbarAction =
  | { type: "TOGGLE_MOBILE" }
  | { type: "CLOSE_MOBILE" }
  | { type: "SET_ACTIVE_TAB"; payload: string | null }
  | { type: "TOGGLE_SEARCH" }
  | { type: "CLOSE_SEARCH" }
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_THEME"; payload: NavbarTheme }
  | { type: "SET_SCROLLED"; payload: boolean };

function navbarReducer(state: NavbarState, action: NavbarAction): NavbarState {
  switch (action.type) {
    case "TOGGLE_MOBILE":
      return { ...state, mobileOpen: !state.mobileOpen };
    case "CLOSE_MOBILE":
      return { ...state, mobileOpen: false };
    case "SET_ACTIVE_TAB":
      return { ...state, activeTab: action.payload };
    case "TOGGLE_SEARCH":
      return {
        ...state,
        searchOpen: !state.searchOpen,
        searchValue: !state.searchOpen ? state.searchValue : "",
      };
    case "CLOSE_SEARCH":
      return { ...state, searchOpen: false, searchValue: "" };
    case "SET_SEARCH":
      return { ...state, searchValue: action.payload };
    case "SET_THEME":
      return { ...state, theme: action.payload };
    case "SET_SCROLLED":
      return { ...state, scrolled: action.payload };
    default:
      return state;
  }
}

export interface NavbarContextValue {
  state: NavbarState;
  dispatch: React.Dispatch<NavbarAction>;
  toggleMobile: () => void;
  closeMobile: () => void;
  setActiveTab: (id: string | null) => void;
  toggleSearch: () => void;
  closeSearch: () => void;
  setSearch: (val: string) => void;
  setTheme: (theme: NavbarTheme) => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  onSearch?: (value: string) => void;
  onTabChange?: (id: string) => void;
  onThemeChange?: (theme: NavbarTheme) => void;
}

const NavbarContext = createContext<NavbarContextValue | null>(null);

export interface NavbarProviderProps {
  children: React.ReactNode;
  defaultActiveTab?: string | null;
  defaultTheme?: NavbarTheme;
  size?: NavbarSize;
  variant?: NavbarVariant;
  onSearch?: (value: string) => void;
  onTabChange?: (id: string) => void;
  onThemeChange?: (theme: NavbarTheme) => void;
}

export function NavbarProvider({
  children,
  defaultActiveTab = null,
  defaultTheme = "system",
  size = "md",
  variant = "default",
  onSearch,
  onTabChange,
  onThemeChange,
}: NavbarProviderProps) {
  const [state, dispatch] = useReducer(navbarReducer, {
    mobileOpen: false,
    activeTab: defaultActiveTab,
    searchOpen: false,
    searchValue: "",
    theme: defaultTheme,
    size,
    variant,
    scrolled: false,
  });

  const searchInputRef = useRef<HTMLInputElement>(null);

  const toggleMobile = useCallback(
    () => dispatch({ type: "TOGGLE_MOBILE" }),
    [],
  );
  const closeMobile = useCallback(() => dispatch({ type: "CLOSE_MOBILE" }), []);

  const setActiveTab = useCallback(
    (id: string | null) => {
      dispatch({ type: "SET_ACTIVE_TAB", payload: id });
      if (id) onTabChange?.(id);
    },
    [onTabChange],
  );

  const toggleSearch = useCallback(() => {
    dispatch({ type: "TOGGLE_SEARCH" });
    setTimeout(() => searchInputRef.current?.focus(), 60);
  }, []);

  const closeSearch = useCallback(() => dispatch({ type: "CLOSE_SEARCH" }), []);

  const setSearch = useCallback(
    (val: string) => {
      dispatch({ type: "SET_SEARCH", payload: val });
      onSearch?.(val);
    },
    [onSearch],
  );

  const setTheme = useCallback(
    (theme: NavbarTheme) => {
      dispatch({ type: "SET_THEME", payload: theme });
      onThemeChange?.(theme);
    },
    [onThemeChange],
  );

  return (
    <NavbarContext.Provider
      value={{
        state,
        dispatch,
        toggleMobile,
        closeMobile,
        setActiveTab,
        toggleSearch,
        closeSearch,
        setSearch,
        setTheme,
        searchInputRef,
        onSearch,
        onTabChange,
        onThemeChange,
      }}
    >
      {children}
    </NavbarContext.Provider>
  );
}

export function useNavbarContext(): NavbarContextValue {
  const ctx = useContext(NavbarContext);
  if (!ctx)
    throw new Error("useNavbarContext must be used within NavbarProvider");
  return ctx;
}
