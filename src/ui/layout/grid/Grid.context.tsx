import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useRef,
  useEffect,
  useState,
} from "react";

export type GridBreakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
export type GridDirection = "ltr" | "rtl";
export type GridColorScheme = "light" | "dark" | "system";

export type GridColumns =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | "none";

export type GridAutoFlow =
  | "row"
  | "column"
  | "row dense"
  | "column dense"
  | "dense";

export type GridAlignItems =
  | "start"
  | "end"
  | "center"
  | "stretch"
  | "baseline";

export type GridJustifyItems =
  | "start"
  | "end"
  | "center"
  | "stretch";

export type GridAlignContent =
  | "start"
  | "end"
  | "center"
  | "stretch"
  | "between"
  | "around"
  | "evenly";

export type GridJustifyContent =
  | "start"
  | "end"
  | "center"
  | "stretch"
  | "between"
  | "around"
  | "evenly";

export type GridSpacingScale =
  | 0
  | 0.5
  | 1
  | 1.5
  | 2
  | 2.5
  | 3
  | 3.5
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 14
  | 16
  | 20
  | 24;

export type GridDensity = "compact" | "standard" | "comfortable" | "spacious";
export type GridVariant =
  | "default"
  | "masonry"
  | "mosaic"
  | "asymmetric"
  | "auto-fill"
  | "auto-fit";

export interface GridBreakpoints {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  "2xl": number;
}

export const DEFAULT_GRID_BREAKPOINTS: GridBreakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

export const GRID_SPACING_MAP: Record<number, string> = {
  0: "0px",
  0.5: "2px",
  1: "4px",
  1.5: "6px",
  2: "8px",
  2.5: "10px",
  3: "12px",
  3.5: "14px",
  4: "16px",
  5: "20px",
  6: "24px",
  7: "28px",
  8: "32px",
  9: "36px",
  10: "40px",
  11: "44px",
  12: "48px",
  14: "56px",
  16: "64px",
  20: "80px",
  24: "96px",
};

export const GRID_DENSITY_GAP: Record<GridDensity, string> = {
  compact: "8px",
  standard: "16px",
  comfortable: "24px",
  spacious: "32px",
};

export const GRID_DENSITY_PADDING: Record<GridDensity, string> = {
  compact: "8px",
  standard: "16px",
  comfortable: "24px",
  spacious: "32px",
};

export const GRID_ALIGN_ITEMS_MAP: Record<GridAlignItems, string> = {
  start: "start",
  end: "end",
  center: "center",
  stretch: "stretch",
  baseline: "baseline",
};

export const GRID_JUSTIFY_ITEMS_MAP: Record<GridJustifyItems, string> = {
  start: "start",
  end: "end",
  center: "center",
  stretch: "stretch",
};

export const GRID_ALIGN_CONTENT_MAP: Record<GridAlignContent, string> = {
  start: "start",
  end: "end",
  center: "center",
  stretch: "stretch",
  between: "space-between",
  around: "space-around",
  evenly: "space-evenly",
};

export const GRID_JUSTIFY_CONTENT_MAP: Record<GridJustifyContent, string> = {
  start: "start",
  end: "end",
  center: "center",
  stretch: "stretch",
  between: "space-between",
  around: "space-around",
  evenly: "space-evenly",
};

export type ResponsiveGridProp<T> = T | Partial<Record<GridBreakpoint, T>>;

export interface GridResponsiveColumns {
  xs?: GridColumns;
  sm?: GridColumns;
  md?: GridColumns;
  lg?: GridColumns;
  xl?: GridColumns;
  "2xl"?: GridColumns;
}

export interface GridState {
  currentBreakpoint: GridBreakpoint;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  containerWidth: number;
  containerHeight: number;
  isInViewport: boolean;
  scrollY: number;
  density: GridDensity;
  direction: GridDirection;
  colorScheme: GridColorScheme;
}

type GridAction =
  | { type: "SET_BREAKPOINT"; payload: GridBreakpoint }
  | { type: "SET_CONTAINER_DIMENSIONS"; payload: { width: number; height: number } }
  | { type: "SET_IN_VIEWPORT"; payload: boolean }
  | { type: "SET_SCROLL_Y"; payload: number }
  | { type: "SET_DENSITY"; payload: GridDensity }
  | { type: "SET_DIRECTION"; payload: GridDirection }
  | { type: "SET_COLOR_SCHEME"; payload: GridColorScheme };

function getBreakpoint(
  width: number,
  breakpoints: GridBreakpoints
): GridBreakpoint {
  if (width >= breakpoints["2xl"]) return "2xl";
  if (width >= breakpoints.xl) return "xl";
  if (width >= breakpoints.lg) return "lg";
  if (width >= breakpoints.md) return "md";
  if (width >= breakpoints.sm) return "sm";
  return "xs";
}

function gridReducer(state: GridState, action: GridAction): GridState {
  switch (action.type) {
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
    case "SET_CONTAINER_DIMENSIONS":
      return {
        ...state,
        containerWidth: action.payload.width,
        containerHeight: action.payload.height,
      };
    case "SET_IN_VIEWPORT":
      return { ...state, isInViewport: action.payload };
    case "SET_SCROLL_Y":
      return { ...state, scrollY: action.payload };
    case "SET_DENSITY":
      return { ...state, density: action.payload };
    case "SET_DIRECTION":
      return { ...state, direction: action.payload };
    case "SET_COLOR_SCHEME":
      return { ...state, colorScheme: action.payload };
    default:
      return state;
  }
}

export interface GridContextValue {
  state: GridState;
  dispatch: React.Dispatch<GridAction>;
  setDensity: (density: GridDensity) => void;
  gridRef: React.RefObject<HTMLDivElement | null>;
  breakpoints: GridBreakpoints;
}

const GridContext = createContext<GridContextValue | null>(null);

export interface GridProviderProps {
  children: React.ReactNode;
  breakpoints?: Partial<GridBreakpoints>;
  defaultDensity?: GridDensity;
  colorScheme?: GridColorScheme;
  direction?: GridDirection;
  trackViewport?: boolean;
  trackScroll?: boolean;
  trackDimensions?: boolean;
  onBreakpointChange?: (bp: GridBreakpoint) => void;
  onViewportChange?: (inView: boolean) => void;
}

export function GridProvider({
  children,
  breakpoints: customBreakpoints,
  defaultDensity = "standard",
  colorScheme = "light",
  direction = "ltr",
  trackViewport = false,
  trackScroll = false,
  trackDimensions = false,
  onBreakpointChange,
  onViewportChange,
}: GridProviderProps) {
  const breakpoints = { ...DEFAULT_GRID_BREAKPOINTS, ...customBreakpoints };

  const initialBreakpoint =
    typeof window !== "undefined"
      ? getBreakpoint(window.innerWidth, breakpoints)
      : "lg";

  const [state, dispatch] = useReducer(gridReducer, {
    currentBreakpoint: initialBreakpoint,
    isMobile: initialBreakpoint === "xs" || initialBreakpoint === "sm",
    isTablet: initialBreakpoint === "md",
    isDesktop:
      initialBreakpoint === "lg" ||
      initialBreakpoint === "xl" ||
      initialBreakpoint === "2xl",
    containerWidth: typeof window !== "undefined" ? window.innerWidth : 1280,
    containerHeight: typeof window !== "undefined" ? window.innerHeight : 800,
    isInViewport: false,
    scrollY: 0,
    density: defaultDensity,
    direction,
    colorScheme,
  });

  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      const bp = getBreakpoint(window.innerWidth, breakpoints);
      if (bp !== state.currentBreakpoint) {
        dispatch({ type: "SET_BREAKPOINT", payload: bp });
        onBreakpointChange?.(bp);
      }
      if (trackDimensions && gridRef.current) {
        dispatch({
          type: "SET_CONTAINER_DIMENSIONS",
          payload: {
            width: gridRef.current.offsetWidth,
            height: gridRef.current.offsetHeight,
          },
        });
      }
    };

    window.addEventListener("resize", handleResize, { passive: true });
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [state.currentBreakpoint, breakpoints, trackDimensions, onBreakpointChange]);

  useEffect(() => {
    if (!trackScroll) return;
    const handler = () =>
      dispatch({ type: "SET_SCROLL_Y", payload: window.scrollY });
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [trackScroll]);

  useEffect(() => {
    if (!trackViewport || !gridRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        dispatch({ type: "SET_IN_VIEWPORT", payload: entry.isIntersecting });
        onViewportChange?.(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    observer.observe(gridRef.current);
    return () => observer.disconnect();
  }, [trackViewport, onViewportChange]);

  const setDensity = useCallback((density: GridDensity) => {
    dispatch({ type: "SET_DENSITY", payload: density });
  }, []);

  return (
    <GridContext.Provider
      value={{ state, dispatch, setDensity, gridRef, breakpoints }}
    >
      {children}
    </GridContext.Provider>
  );
}

export function useGridContext(): GridContextValue {
  const ctx = useContext(GridContext);
  if (!ctx) throw new Error("useGridContext must be used within GridProvider");
  return ctx;
}

export function useGridBreakpoint(): GridBreakpoint {
  const ctx = useContext(GridContext);
  const [bp, setBp] = useState<GridBreakpoint>("lg");
  useEffect(() => {
    if (ctx) return;
    const update = () =>
      setBp(getBreakpoint(window.innerWidth, DEFAULT_GRID_BREAKPOINTS));
    window.addEventListener("resize", update, { passive: true });
    update();
    return () => window.removeEventListener("resize", update);
  }, [ctx]);
  return ctx ? ctx.state.currentBreakpoint : bp;
}

export function useGridIsMobile(): boolean {
  const bp = useGridBreakpoint();
  return bp === "xs" || bp === "sm";
}

export function useGridIsTablet(): boolean {
  return useGridBreakpoint() === "md";
}

export function useGridIsDesktop(): boolean {
  const bp = useGridBreakpoint();
  return bp === "lg" || bp === "xl" || bp === "2xl";
}

export function useGridDensity(): GridDensity {
  const ctx = useContext(GridContext);
  return ctx ? ctx.state.density : "standard";
}

export function useGridContainerWidth(): number {
  const ctx = useContext(GridContext);
  return ctx ? ctx.state.containerWidth : 0;
}

export function useGridInViewport(): boolean {
  const ctx = useContext(GridContext);
  return ctx ? ctx.state.isInViewport : false;
}

export function resolveGridSpacing(
  value: number | string | undefined
): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value === "string") return value;
  return GRID_SPACING_MAP[value] ?? `${value * 4}px`;
}

export function resolveResponsiveGridProp<T>(
  value: ResponsiveGridProp<T> | undefined,
  breakpoint: GridBreakpoint
): T | undefined {
  if (value === undefined) return undefined;
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    const bpOrder: GridBreakpoint[] = ["2xl", "xl", "lg", "md", "sm", "xs"];
    const bpIndex = bpOrder.indexOf(breakpoint);
    for (let i = bpIndex; i < bpOrder.length; i++) {
      const v = (value as Partial<Record<GridBreakpoint, T>>)[bpOrder[i]];
      if (v !== undefined) return v;
    }
    return undefined;
  }
  return value as T;
}

export function buildGridTemplateColumns(
  columns: GridColumns | undefined,
  minChildWidth?: string,
  variant?: GridVariant
): string | undefined {
  if (minChildWidth) {
    if (variant === "auto-fill") {
      return `repeat(auto-fill, minmax(${minChildWidth}, 1fr))`;
    }
    return `repeat(auto-fit, minmax(${minChildWidth}, 1fr))`;
  }
  if (columns === undefined || columns === "none") return undefined;
  return `repeat(${columns}, minmax(0, 1fr))`;
}

export {
  GridContext
};