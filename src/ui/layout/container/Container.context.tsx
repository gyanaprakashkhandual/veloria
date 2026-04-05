import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useRef,
  useEffect,
  useState,
} from "react";

export type ContainerSize =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "full"
  | "prose"
  | "screen-sm"
  | "screen-md"
  | "screen-lg"
  | "screen-xl";

export type ContainerAlign = "left" | "center" | "right";
export type ContainerVariant =
  | "default"
  | "fluid"
  | "narrow"
  | "wide"
  | "full-bleed";
export type ContainerBreakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

export interface ContainerBreakpoints {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  "2xl": number;
}

const DEFAULT_BREAKPOINTS: ContainerBreakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

export const CONTAINER_MAX_WIDTHS: Record<ContainerSize, string> = {
  xs: "480px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
  "3xl": "1792px",
  "4xl": "2048px",
  full: "100%",
  prose: "65ch",
  "screen-sm": "100vw",
  "screen-md": "100vw",
  "screen-lg": "100vw",
  "screen-xl": "100vw",
};

export interface ContainerState {
  size: ContainerSize;
  align: ContainerAlign;
  variant: ContainerVariant;
  currentBreakpoint: ContainerBreakpoint;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isFluid: boolean;
  containerWidth: number;
  scrollY: number;
  isInViewport: boolean;
}

type ContainerAction =
  | { type: "SET_SIZE"; payload: ContainerSize }
  | { type: "SET_ALIGN"; payload: ContainerAlign }
  | { type: "SET_VARIANT"; payload: ContainerVariant }
  | { type: "SET_BREAKPOINT"; payload: ContainerBreakpoint }
  | { type: "SET_FLUID"; payload: boolean }
  | { type: "SET_CONTAINER_WIDTH"; payload: number }
  | { type: "SET_SCROLL_Y"; payload: number }
  | { type: "SET_IN_VIEWPORT"; payload: boolean };

function getBreakpoint(
  width: number,
  breakpoints: ContainerBreakpoints
): ContainerBreakpoint {
  if (width >= breakpoints["2xl"]) return "2xl";
  if (width >= breakpoints.xl) return "xl";
  if (width >= breakpoints.lg) return "lg";
  if (width >= breakpoints.md) return "md";
  if (width >= breakpoints.sm) return "sm";
  return "xs";
}

function reducer(
  state: ContainerState,
  action: ContainerAction
): ContainerState {
  switch (action.type) {
    case "SET_SIZE":
      return { ...state, size: action.payload };
    case "SET_ALIGN":
      return { ...state, align: action.payload };
    case "SET_VARIANT":
      return {
        ...state,
        variant: action.payload,
        isFluid: action.payload === "fluid" || action.payload === "full-bleed",
      };
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
    case "SET_FLUID":
      return { ...state, isFluid: action.payload };
    case "SET_CONTAINER_WIDTH":
      return { ...state, containerWidth: action.payload };
    case "SET_SCROLL_Y":
      return { ...state, scrollY: action.payload };
    case "SET_IN_VIEWPORT":
      return { ...state, isInViewport: action.payload };
    default:
      return state;
  }
}

export interface ContainerContextValue {
  state: ContainerState;
  dispatch: React.Dispatch<ContainerAction>;
  setSize: (size: ContainerSize) => void;
  setAlign: (align: ContainerAlign) => void;
  setVariant: (variant: ContainerVariant) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  breakpoints: ContainerBreakpoints;
}

const ContainerContext = createContext<ContainerContextValue | null>(null);

export interface ContainerProviderProps {
  children: React.ReactNode;
  defaultSize?: ContainerSize;
  defaultAlign?: ContainerAlign;
  defaultVariant?: ContainerVariant;
  breakpoints?: Partial<ContainerBreakpoints>;
  onBreakpointChange?: (breakpoint: ContainerBreakpoint) => void;
  onSizeChange?: (size: ContainerSize) => void;
  trackViewport?: boolean;
  trackScroll?: boolean;
}

export function ContainerProvider({
  children,
  defaultSize = "xl",
  defaultAlign = "center",
  defaultVariant = "default",
  breakpoints: customBreakpoints,
  onBreakpointChange,
  onSizeChange,
  trackViewport = false,
  trackScroll = false,
}: ContainerProviderProps) {
  const breakpoints = { ...DEFAULT_BREAKPOINTS, ...customBreakpoints };

  const initialBreakpoint =
    typeof window !== "undefined"
      ? getBreakpoint(window.innerWidth, breakpoints)
      : "lg";

  const isMobileInitial =
    initialBreakpoint === "xs" || initialBreakpoint === "sm";

  const [state, dispatch] = useReducer(reducer, {
    size: defaultSize,
    align: defaultAlign,
    variant: defaultVariant,
    currentBreakpoint: initialBreakpoint,
    isMobile: isMobileInitial,
    isTablet: initialBreakpoint === "md",
    isDesktop:
      initialBreakpoint === "lg" ||
      initialBreakpoint === "xl" ||
      initialBreakpoint === "2xl",
    isFluid: defaultVariant === "fluid" || defaultVariant === "full-bleed",
    containerWidth: typeof window !== "undefined" ? window.innerWidth : 1280,
    scrollY: 0,
    isInViewport: false,
  });

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      const bp = getBreakpoint(window.innerWidth, breakpoints);
      if (bp !== state.currentBreakpoint) {
        dispatch({ type: "SET_BREAKPOINT", payload: bp });
        onBreakpointChange?.(bp);
      }
      if (containerRef.current) {
        dispatch({
          type: "SET_CONTAINER_WIDTH",
          payload: containerRef.current.offsetWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize, { passive: true });
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [state.currentBreakpoint, breakpoints, onBreakpointChange]);

  useEffect(() => {
    if (!trackScroll) return;
    const handleScroll = () => {
      dispatch({ type: "SET_SCROLL_Y", payload: window.scrollY });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [trackScroll]);

  useEffect(() => {
    if (!trackViewport || !containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        dispatch({ type: "SET_IN_VIEWPORT", payload: entry.isIntersecting });
      },
      { threshold: 0.1 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [trackViewport]);

  const setSize = useCallback(
    (size: ContainerSize) => {
      dispatch({ type: "SET_SIZE", payload: size });
      onSizeChange?.(size);
    },
    [onSizeChange]
  );

  const setAlign = useCallback((align: ContainerAlign) => {
    dispatch({ type: "SET_ALIGN", payload: align });
  }, []);

  const setVariant = useCallback((variant: ContainerVariant) => {
    dispatch({ type: "SET_VARIANT", payload: variant });
  }, []);

  return (
    <ContainerContext.Provider
      value={{
        state,
        dispatch,
        setSize,
        setAlign,
        setVariant,
        containerRef,
        breakpoints,
      }}
    >
      {children}
    </ContainerContext.Provider>
  );
}

export function useContainerContext(): ContainerContextValue {
  const ctx = useContext(ContainerContext);
  if (!ctx)
    throw new Error(
      "useContainerContext must be used within ContainerProvider"
    );
  return ctx;
}

export function useContainerBreakpoint(): ContainerBreakpoint {
  const ctx = useContext(ContainerContext);
  const [bp, setBp] = useState<ContainerBreakpoint>("lg");

  useEffect(() => {
    if (ctx) return;
    const update = () =>
      setBp(getBreakpoint(window.innerWidth, DEFAULT_BREAKPOINTS));
    window.addEventListener("resize", update, { passive: true });
    update();
    return () => window.removeEventListener("resize", update);
  }, [ctx]);

  return ctx ? ctx.state.currentBreakpoint : bp;
}

export function useContainerIsMobile(): boolean {
  const bp = useContainerBreakpoint();
  return bp === "xs" || bp === "sm";
}

export function useContainerIsTablet(): boolean {
  const bp = useContainerBreakpoint();
  return bp === "md";
}

export function useContainerIsDesktop(): boolean {
  const bp = useContainerBreakpoint();
  return bp === "lg" || bp === "xl" || bp === "2xl";
}

export function useContainerWidth(): number {
  const ctx = useContext(ContainerContext);
  return ctx ? ctx.state.containerWidth : 0;
}

export function useContainerScrollY(): number {
  const ctx = useContext(ContainerContext);
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    if (ctx) return;
    const handler = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [ctx]);
  return ctx ? ctx.state.scrollY : scrollY;
}

export function useContainerInViewport(): boolean {
  const ctx = useContext(ContainerContext);
  return ctx ? ctx.state.isInViewport : false;
}

export { ContainerContext, DEFAULT_BREAKPOINTS, getBreakpoint };