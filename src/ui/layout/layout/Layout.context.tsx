import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useRef,
  useEffect,
} from "react";

export type LayoutBreakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
export type LayoutDirection = "ltr" | "rtl";
export type LayoutColorScheme = "light" | "dark" | "system";
export type SidebarPosition = "left" | "right";
export type SidebarVariant = "push" | "overlay" | "mini";

export interface LayoutBreakpoints {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  "2xl": number;
}

const DEFAULT_BREAKPOINTS: LayoutBreakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

export interface PageLayoutState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  sidebarWidth: number;
  sidebarCollapsedWidth: number;
  sidebarPosition: SidebarPosition;
  sidebarVariant: SidebarVariant;
  headerHeight: number;
  footerHeight: number;
  currentBreakpoint: LayoutBreakpoint;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  scrollY: number;
  direction: LayoutDirection;
}

type PageLayoutAction =
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "OPEN_SIDEBAR" }
  | { type: "CLOSE_SIDEBAR" }
  | { type: "COLLAPSE_SIDEBAR" }
  | { type: "EXPAND_SIDEBAR" }
  | { type: "TOGGLE_COLLAPSE_SIDEBAR" }
  | { type: "SET_SIDEBAR_WIDTH"; payload: number }
  | { type: "SET_HEADER_HEIGHT"; payload: number }
  | { type: "SET_FOOTER_HEIGHT"; payload: number }
  | { type: "SET_BREAKPOINT"; payload: LayoutBreakpoint }
  | { type: "SET_SCROLL_Y"; payload: number }
  | { type: "SET_DIRECTION"; payload: LayoutDirection };

function getBreakpoint(
  width: number,
  breakpoints: LayoutBreakpoints
): LayoutBreakpoint {
  if (width >= breakpoints["2xl"]) return "2xl";
  if (width >= breakpoints.xl) return "xl";
  if (width >= breakpoints.lg) return "lg";
  if (width >= breakpoints.md) return "md";
  if (width >= breakpoints.sm) return "sm";
  return "xs";
}

function reducer(
  state: PageLayoutState,
  action: PageLayoutAction
): PageLayoutState {
  switch (action.type) {
    case "TOGGLE_SIDEBAR":
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case "OPEN_SIDEBAR":
      return { ...state, sidebarOpen: true };
    case "CLOSE_SIDEBAR":
      return { ...state, sidebarOpen: false };
    case "COLLAPSE_SIDEBAR":
      return { ...state, sidebarCollapsed: true };
    case "EXPAND_SIDEBAR":
      return { ...state, sidebarCollapsed: false };
    case "TOGGLE_COLLAPSE_SIDEBAR":
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };
    case "SET_SIDEBAR_WIDTH":
      return { ...state, sidebarWidth: action.payload };
    case "SET_HEADER_HEIGHT":
      return { ...state, headerHeight: action.payload };
    case "SET_FOOTER_HEIGHT":
      return { ...state, footerHeight: action.payload };
    case "SET_BREAKPOINT":
      return {
        ...state,
        currentBreakpoint: action.payload,
        isMobile: action.payload === "xs" || action.payload === "sm",
        isTablet: action.payload === "md",
        isDesktop:
          action.payload === "lg" ||
          action.payload === "xl" ||
          action.payload === "2xl",
      };
    case "SET_SCROLL_Y":
      return { ...state, scrollY: action.payload };
    case "SET_DIRECTION":
      return { ...state, direction: action.payload };
    default:
      return state;
  }
}

export interface PageLayoutContextValue {
  state: PageLayoutState;
  dispatch: React.Dispatch<PageLayoutAction>;
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
  collapseSidebar: () => void;
  expandSidebar: () => void;
  toggleCollapseSidebar: () => void;
  headerRef: React.RefObject<HTMLElement | null>;
  footerRef: React.RefObject<HTMLElement | null>;
  sidebarRef: React.RefObject<HTMLElement | null>;
  mainRef: React.RefObject<HTMLElement | null>;
  breakpoints: LayoutBreakpoints;
}

const PageLayoutContext = createContext<PageLayoutContextValue | null>(null);

export interface PageLayoutProviderProps {
  children: React.ReactNode;
  sidebarWidth?: number;
  sidebarCollapsedWidth?: number;
  sidebarPosition?: SidebarPosition;
  sidebarVariant?: SidebarVariant;
  defaultSidebarOpen?: boolean;
  defaultSidebarCollapsed?: boolean;
  headerHeight?: number;
  footerHeight?: number;
  direction?: LayoutDirection;
  breakpoints?: Partial<LayoutBreakpoints>;
  onSidebarChange?: (open: boolean) => void;
  onBreakpointChange?: (breakpoint: LayoutBreakpoint) => void;
}

export function PageLayoutProvider({
  children,
  sidebarWidth = 240,
  sidebarCollapsedWidth = 56,
  sidebarPosition = "left",
  sidebarVariant = "push",
  defaultSidebarOpen = true,
  defaultSidebarCollapsed = false,
  headerHeight = 56,
  footerHeight = 48,
  direction = "ltr",
  breakpoints: customBreakpoints,
  onSidebarChange,
  onBreakpointChange,
}: PageLayoutProviderProps) {
  const breakpoints = { ...DEFAULT_BREAKPOINTS, ...customBreakpoints };

  const initialBreakpoint =
    typeof window !== "undefined"
      ? getBreakpoint(window.innerWidth, breakpoints)
      : "lg";

  const isMobileInitial =
    initialBreakpoint === "xs" || initialBreakpoint === "sm";

  const [state, dispatch] = useReducer(reducer, {
    sidebarOpen: isMobileInitial ? false : defaultSidebarOpen,
    sidebarCollapsed: defaultSidebarCollapsed,
    sidebarWidth,
    sidebarCollapsedWidth,
    sidebarPosition,
    sidebarVariant,
    headerHeight,
    footerHeight,
    currentBreakpoint: initialBreakpoint,
    isMobile: isMobileInitial,
    isTablet: initialBreakpoint === "md",
    isDesktop:
      initialBreakpoint === "lg" ||
      initialBreakpoint === "xl" ||
      initialBreakpoint === "2xl",
    scrollY: 0,
    direction,
  });

  const headerRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleResize = () => {
      const bp = getBreakpoint(window.innerWidth, breakpoints);
      if (bp !== state.currentBreakpoint) {
        dispatch({ type: "SET_BREAKPOINT", payload: bp });
        onBreakpointChange?.(bp);
        if (bp === "xs" || bp === "sm") {
          dispatch({ type: "CLOSE_SIDEBAR" });
        }
      }
    };

    const handleScroll = () => {
      dispatch({ type: "SET_SCROLL_Y", payload: window.scrollY });
    };

    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [state.currentBreakpoint, breakpoints, onBreakpointChange]);

  const toggleSidebar = useCallback(() => {
    dispatch({ type: "TOGGLE_SIDEBAR" });
    onSidebarChange?.(!state.sidebarOpen);
  }, [state.sidebarOpen, onSidebarChange]);

  const openSidebar = useCallback(() => {
    dispatch({ type: "OPEN_SIDEBAR" });
    onSidebarChange?.(true);
  }, [onSidebarChange]);

  const closeSidebar = useCallback(() => {
    dispatch({ type: "CLOSE_SIDEBAR" });
    onSidebarChange?.(false);
  }, [onSidebarChange]);

  const collapseSidebar = useCallback(() => {
    dispatch({ type: "COLLAPSE_SIDEBAR" });
  }, []);

  const expandSidebar = useCallback(() => {
    dispatch({ type: "EXPAND_SIDEBAR" });
  }, []);

  const toggleCollapseSidebar = useCallback(() => {
    dispatch({ type: "TOGGLE_COLLAPSE_SIDEBAR" });
  }, []);

  return (
    <PageLayoutContext.Provider
      value={{
        state,
        dispatch,
        toggleSidebar,
        openSidebar,
        closeSidebar,
        collapseSidebar,
        expandSidebar,
        toggleCollapseSidebar,
        headerRef,
        footerRef,
        sidebarRef,
        mainRef,
        breakpoints,
      }}
    >
      {children}
    </PageLayoutContext.Provider>
  );
}

export function usePageLayoutContext(): PageLayoutContextValue {
  const ctx = useContext(PageLayoutContext);
  if (!ctx)
    throw new Error(
      "usePageLayoutContext must be used within PageLayoutProvider"
    );
  return ctx;
}

export function useBreakpoint(): LayoutBreakpoint {
  const ctx = useContext(PageLayoutContext);
  if (!ctx) {
    const [bp, setBp] = React.useState<LayoutBreakpoint>("lg");
    useEffect(() => {
      const update = () =>
        setBp(getBreakpoint(window.innerWidth, DEFAULT_BREAKPOINTS));
      window.addEventListener("resize", update, { passive: true });
      update();
      return () => window.removeEventListener("resize", update);
    }, []);
    return bp;
  }
  return ctx.state.currentBreakpoint;
}

export function useIsMobile(): boolean {
  const bp = useBreakpoint();
  return bp === "xs" || bp === "sm";
}

export function useIsTablet(): boolean {
  const bp = useBreakpoint();
  return bp === "md";
}

export function useIsDesktop(): boolean {
  const bp = useBreakpoint();
  return bp === "lg" || bp === "xl" || bp === "2xl";
}

export function useScrollY(): number {
  const ctx = useContext(PageLayoutContext);
  const [scrollY, setScrollY] = React.useState(0);
  useEffect(() => {
    if (ctx) return;
    const handler = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [ctx]);
  return ctx ? ctx.state.scrollY : scrollY;
}