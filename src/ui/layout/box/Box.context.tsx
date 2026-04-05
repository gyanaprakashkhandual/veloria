import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useRef,
  useEffect,
  useState,
} from "react";

export type BoxBreakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
export type BoxColorScheme = "light" | "dark" | "system";
export type BoxDirection = "ltr" | "rtl";

export type BoxSpacingScale =
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
  | 24
  | 28
  | 32
  | 36
  | 40
  | 44
  | 48
  | 52
  | 56
  | 60
  | 64
  | 72
  | 80
  | 96;

export type BoxShadow =
  | "none"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "inner"
  | "colored";

export type BoxRadius =
  | "none"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "full";

export type BoxBorderStyle = "solid" | "dashed" | "dotted" | "double" | "none";
export type BoxCursor =
  | "auto"
  | "default"
  | "pointer"
  | "wait"
  | "text"
  | "move"
  | "help"
  | "not-allowed"
  | "grab"
  | "grabbing"
  | "crosshair"
  | "zoom-in"
  | "zoom-out"
  | "col-resize"
  | "row-resize"
  | "ns-resize"
  | "ew-resize"
  | "none";

export type BoxOverflow = "auto" | "hidden" | "scroll" | "visible" | "clip";
export type BoxDisplay =
  | "block"
  | "inline-block"
  | "inline"
  | "flex"
  | "inline-flex"
  | "grid"
  | "inline-grid"
  | "contents"
  | "flow-root"
  | "list-item"
  | "table"
  | "table-cell"
  | "table-row"
  | "none";

export type BoxPosition =
  | "static"
  | "relative"
  | "absolute"
  | "fixed"
  | "sticky";

export type BoxFlexDirection =
  | "row"
  | "column"
  | "row-reverse"
  | "column-reverse";

export type BoxAlignItems =
  | "start"
  | "end"
  | "center"
  | "stretch"
  | "baseline"
  | "flex-start"
  | "flex-end";

export type BoxJustifyContent =
  | "start"
  | "end"
  | "center"
  | "stretch"
  | "between"
  | "around"
  | "evenly"
  | "flex-start"
  | "flex-end"
  | "space-between"
  | "space-around"
  | "space-evenly";

export type BoxFlexWrap = "nowrap" | "wrap" | "wrap-reverse";

export type BoxGridFlow =
  | "row"
  | "column"
  | "row dense"
  | "column dense"
  | "dense";

export type BoxTransitionPreset =
  | "none"
  | "all"
  | "colors"
  | "opacity"
  | "shadow"
  | "transform"
  | "default";

export type BoxVisibility = "visible" | "hidden" | "collapse";
export type BoxPointerEvents = "none" | "auto" | "all";
export type BoxUserSelect = "none" | "auto" | "all" | "text";
export type BoxMixBlendMode =
  | "normal"
  | "multiply"
  | "screen"
  | "overlay"
  | "darken"
  | "lighten"
  | "color-dodge"
  | "color-burn"
  | "hard-light"
  | "soft-light"
  | "difference"
  | "exclusion";

export type BoxTextAlign = "left" | "center" | "right" | "justify" | "start" | "end";
export type BoxVerticalAlign =
  | "baseline"
  | "top"
  | "middle"
  | "bottom"
  | "text-top"
  | "text-bottom"
  | "sub"
  | "super";

export interface BoxBreakpoints {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  "2xl": number;
}

export const DEFAULT_BOX_BREAKPOINTS: BoxBreakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

export const BOX_SHADOW_MAP: Record<BoxShadow, string> = {
  none: "none",
  xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  sm: "0 1px 3px 0 rgb(0 0 0 / 0.07), 0 1px 2px -1px rgb(0 0 0 / 0.07)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.08)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.08)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.09), 0 8px 10px -6px rgb(0 0 0 / 0.09)",
  "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.14)",
  "3xl": "0 35px 60px -15px rgb(0 0 0 / 0.18)",
  inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.06)",
  colored: "0 8px 30px -4px rgb(var(--box-shadow-color, 59 130 246) / 0.3)",
};

export const BOX_RADIUS_MAP: Record<BoxRadius, string> = {
  none: "0px",
  xs: "2px",
  sm: "4px",
  md: "6px",
  lg: "8px",
  xl: "12px",
  "2xl": "16px",
  "3xl": "24px",
  full: "9999px",
};

export const BOX_SPACING_MAP: Record<number, string> = {
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
  28: "112px",
  32: "128px",
  36: "144px",
  40: "160px",
  44: "176px",
  48: "192px",
  52: "208px",
  56: "224px",
  60: "240px",
  64: "256px",
  72: "288px",
  80: "320px",
  96: "384px",
};

export const BOX_TRANSITION_MAP: Record<BoxTransitionPreset, string> = {
  none: "none",
  all: "all 150ms cubic-bezier(0.4, 0, 0.2, 1)",
  colors:
    "color 150ms cubic-bezier(0.4, 0, 0.2, 1), background-color 150ms cubic-bezier(0.4, 0, 0.2, 1), border-color 150ms cubic-bezier(0.4, 0, 0.2, 1), text-decoration-color 150ms cubic-bezier(0.4, 0, 0.2, 1), fill 150ms cubic-bezier(0.4, 0, 0.2, 1), stroke 150ms cubic-bezier(0.4, 0, 0.2, 1)",
  opacity: "opacity 150ms cubic-bezier(0.4, 0, 0.2, 1)",
  shadow: "box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1)",
  transform: "transform 150ms cubic-bezier(0.4, 0, 0.2, 1)",
  default:
    "color 150ms cubic-bezier(0.4, 0, 0.2, 1), background-color 150ms cubic-bezier(0.4, 0, 0.2, 1), border-color 150ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1), opacity 150ms cubic-bezier(0.4, 0, 0.2, 1)",
};

export interface BoxState {
  currentBreakpoint: BoxBreakpoint;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isHovered: boolean;
  isFocused: boolean;
  isPressed: boolean;
  isInViewport: boolean;
  scrollY: number;
  boxWidth: number;
  boxHeight: number;
  colorScheme: BoxColorScheme;
  direction: BoxDirection;
}

type BoxAction =
  | { type: "SET_BREAKPOINT"; payload: BoxBreakpoint }
  | { type: "SET_HOVERED"; payload: boolean }
  | { type: "SET_FOCUSED"; payload: boolean }
  | { type: "SET_PRESSED"; payload: boolean }
  | { type: "SET_IN_VIEWPORT"; payload: boolean }
  | { type: "SET_SCROLL_Y"; payload: number }
  | { type: "SET_BOX_DIMENSIONS"; payload: { width: number; height: number } }
  | { type: "SET_COLOR_SCHEME"; payload: BoxColorScheme }
  | { type: "SET_DIRECTION"; payload: BoxDirection };

function getBreakpoint(
  width: number,
  breakpoints: BoxBreakpoints
): BoxBreakpoint {
  if (width >= breakpoints["2xl"]) return "2xl";
  if (width >= breakpoints.xl) return "xl";
  if (width >= breakpoints.lg) return "lg";
  if (width >= breakpoints.md) return "md";
  if (width >= breakpoints.sm) return "sm";
  return "xs";
}

function boxReducer(state: BoxState, action: BoxAction): BoxState {
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
    case "SET_HOVERED":
      return { ...state, isHovered: action.payload };
    case "SET_FOCUSED":
      return { ...state, isFocused: action.payload };
    case "SET_PRESSED":
      return { ...state, isPressed: action.payload };
    case "SET_IN_VIEWPORT":
      return { ...state, isInViewport: action.payload };
    case "SET_SCROLL_Y":
      return { ...state, scrollY: action.payload };
    case "SET_BOX_DIMENSIONS":
      return {
        ...state,
        boxWidth: action.payload.width,
        boxHeight: action.payload.height,
      };
    case "SET_COLOR_SCHEME":
      return { ...state, colorScheme: action.payload };
    case "SET_DIRECTION":
      return { ...state, direction: action.payload };
    default:
      return state;
  }
}

export interface BoxContextValue {
  state: BoxState;
  dispatch: React.Dispatch<BoxAction>;
  boxRef: React.RefObject<HTMLDivElement | null>;
  breakpoints: BoxBreakpoints;
}

const BoxContext = createContext<BoxContextValue | null>(null);

export interface BoxProviderProps {
  children: React.ReactNode;
  breakpoints?: Partial<BoxBreakpoints>;
  colorScheme?: BoxColorScheme;
  direction?: BoxDirection;
  trackViewport?: boolean;
  trackScroll?: boolean;
  trackDimensions?: boolean;
  onBreakpointChange?: (bp: BoxBreakpoint) => void;
  onViewportChange?: (inView: boolean) => void;
}

export function BoxProvider({
  children,
  breakpoints: customBreakpoints,
  colorScheme = "light",
  direction = "ltr",
  trackViewport = false,
  trackScroll = false,
  trackDimensions = false,
  onBreakpointChange,
  onViewportChange,
}: BoxProviderProps) {
  const breakpoints = { ...DEFAULT_BOX_BREAKPOINTS, ...customBreakpoints };

  const initialBreakpoint =
    typeof window !== "undefined"
      ? getBreakpoint(window.innerWidth, breakpoints)
      : "lg";

  const [state, dispatch] = useReducer(boxReducer, {
    currentBreakpoint: initialBreakpoint,
    isMobile: initialBreakpoint === "xs" || initialBreakpoint === "sm",
    isTablet: initialBreakpoint === "md",
    isDesktop:
      initialBreakpoint === "lg" ||
      initialBreakpoint === "xl" ||
      initialBreakpoint === "2xl",
    isHovered: false,
    isFocused: false,
    isPressed: false,
    isInViewport: false,
    scrollY: 0,
    boxWidth: 0,
    boxHeight: 0,
    colorScheme,
    direction,
  });

  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      const bp = getBreakpoint(window.innerWidth, breakpoints);
      if (bp !== state.currentBreakpoint) {
        dispatch({ type: "SET_BREAKPOINT", payload: bp });
        onBreakpointChange?.(bp);
      }
      if (trackDimensions && boxRef.current) {
        dispatch({
          type: "SET_BOX_DIMENSIONS",
          payload: {
            width: boxRef.current.offsetWidth,
            height: boxRef.current.offsetHeight,
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
    if (!trackViewport || !boxRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        dispatch({ type: "SET_IN_VIEWPORT", payload: entry.isIntersecting });
        onViewportChange?.(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    observer.observe(boxRef.current);
    return () => observer.disconnect();
  }, [trackViewport, onViewportChange]);

  return (
    <BoxContext.Provider value={{ state, dispatch, boxRef, breakpoints }}>
      {children}
    </BoxContext.Provider>
  );
}

export function useBoxContext(): BoxContextValue {
  const ctx = useContext(BoxContext);
  if (!ctx) throw new Error("useBoxContext must be used within BoxProvider");
  return ctx;
}

export function useBoxBreakpoint(): BoxBreakpoint {
  const ctx = useContext(BoxContext);
  const [bp, setBp] = useState<BoxBreakpoint>("lg");
  useEffect(() => {
    if (ctx) return;
    const update = () =>
      setBp(getBreakpoint(window.innerWidth, DEFAULT_BOX_BREAKPOINTS));
    window.addEventListener("resize", update, { passive: true });
    update();
    return () => window.removeEventListener("resize", update);
  }, [ctx]);
  return ctx ? ctx.state.currentBreakpoint : bp;
}

export function useBoxIsMobile(): boolean {
  return ["xs", "sm"].includes(useBoxBreakpoint());
}

export function useBoxIsTablet(): boolean {
  return useBoxBreakpoint() === "md";
}

export function useBoxIsDesktop(): boolean {
  return ["lg", "xl", "2xl"].includes(useBoxBreakpoint());
}

export function useBoxScrollY(): number {
  const ctx = useContext(BoxContext);
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    if (ctx) return;
    const handler = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [ctx]);
  return ctx ? ctx.state.scrollY : scrollY;
}

export function useBoxInViewport(): boolean {
  const ctx = useContext(BoxContext);
  return ctx ? ctx.state.isInViewport : false;
}

export function useBoxDimensions(): { width: number; height: number } {
  const ctx = useContext(BoxContext);
  return ctx
    ? { width: ctx.state.boxWidth, height: ctx.state.boxHeight }
    : { width: 0, height: 0 };
}

export function resolveSpacing(
  value: number | string | undefined
): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value === "string") return value;
  return BOX_SPACING_MAP[value] ?? `${value * 4}px`;
}

export function resolveResponsiveValue<T>(
  value: T | Partial<Record<BoxBreakpoint, T>> | undefined,
  breakpoint: BoxBreakpoint
): T | undefined {
  if (value === undefined) return undefined;
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    const bpOrder: BoxBreakpoint[] = ["2xl", "xl", "lg", "md", "sm", "xs"];
    const bpIndex = bpOrder.indexOf(breakpoint);
    for (let i = bpIndex; i < bpOrder.length; i++) {
      const v = (value as Partial<Record<BoxBreakpoint, T>>)[bpOrder[i]];
      if (v !== undefined) return v;
    }
    return undefined;
  }
  return value as T;
}

export {
  BoxContext
};