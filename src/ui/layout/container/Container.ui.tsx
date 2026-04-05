import React, {
  forwardRef,
  useRef,
  useEffect,
  useCallback,
  useState,
  CSSProperties,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ContainerProvider,
  useContainerContext,
  CONTAINER_MAX_WIDTHS,
  type ContainerProviderProps,
  type ContainerSize,
  type ContainerAlign,
  type ContainerVariant,
  type ContainerBreakpoint,
} from "./Container.context";

type ResponsiveProp<T> = T | Partial<Record<ContainerBreakpoint, T>>;

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  size?: ContainerSize;
  align?: ContainerAlign;
  variant?: ContainerVariant;
  fluid?: boolean;
  fullWidth?: boolean;
  fullHeight?: boolean;
  centered?: boolean;
  paddingX?: string | number;
  paddingY?: string | number;
  padding?: string | number;
  disableGutters?: boolean;
  fixed?: boolean;
  maxWidth?: string | number | false;
  minWidth?: string | number;
  minHeight?: string | number;
  maxHeight?: string | number;
  width?: string | number;
  height?: string | number;
  background?: string;
  border?: string;
  borderRadius?: string;
  boxShadow?: string;
  overflow?: CSSProperties["overflow"];
  overflowX?: CSSProperties["overflowX"];
  overflowY?: CSSProperties["overflowY"];
  position?: CSSProperties["position"];
  display?: CSSProperties["display"];
  zIndex?: number | string;
  flex?: string | number;
  flexGrow?: number;
  flexShrink?: number;
  flexBasis?: string | number;
  opacity?: number;
  transition?: string;
  cursor?: CSSProperties["cursor"];
  userSelect?: CSSProperties["userSelect"];
  pointerEvents?: CSSProperties["pointerEvents"];
  className?: string;
  style?: CSSProperties;
  children?: React.ReactNode;
  srOnly?: boolean;
  component?: React.ElementType;
  role?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  tabIndex?: number;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
  onFocus?: React.FocusEventHandler<HTMLDivElement>;
  onBlur?: React.FocusEventHandler<HTMLDivElement>;
  sx?: CSSProperties;
  elevation?: 0 | 1 | 2 | 3 | 4 | 5;
  square?: boolean;
  noPadding?: boolean;
  responsive?: boolean;
  responsivePadding?: boolean;
  testId?: string;
}

const ALIGN_STYLE_MAP: Record<ContainerAlign, CSSProperties> = {
  left: { marginLeft: 0, marginRight: "auto" },
  center: { marginLeft: "auto", marginRight: "auto" },
  right: { marginLeft: "auto", marginRight: 0 },
};

const ELEVATION_SHADOWS: Record<number, string> = {
  0: "none",
  1: "0 1px 3px 0 rgb(0 0 0 / 0.07), 0 1px 2px -1px rgb(0 0 0 / 0.07)",
  2: "0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.08)",
  3: "0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.08)",
  4: "0 20px 25px -5px rgb(0 0 0 / 0.09), 0 8px 10px -6px rgb(0 0 0 / 0.09)",
  5: "0 25px 50px -12px rgb(0 0 0 / 0.15)",
};

const DEFAULT_PADDING_X = "1rem";

function resolveMaxWidth(
  size?: ContainerSize,
  maxWidth?: string | number | false,
  fluid?: boolean,
  variant?: ContainerVariant
): string | undefined {
  if (maxWidth === false) return undefined;
  if (maxWidth !== undefined) {
    return typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth;
  }
  if (fluid || variant === "fluid" || variant === "full-bleed") return "100%";
  if (size) return CONTAINER_MAX_WIDTHS[size];
  return CONTAINER_MAX_WIDTHS["xl"];
}

function resolveResponsivePaddingX(
  paddingX?: string | number,
  disableGutters?: boolean,
  noPadding?: boolean,
  responsivePadding?: boolean
): CSSProperties {
  if (disableGutters || noPadding) return {};
  if (paddingX !== undefined) {
    const val = typeof paddingX === "number" ? `${paddingX}px` : paddingX;
    return { paddingLeft: val, paddingRight: val };
  }
  if (responsivePadding) {
    return { paddingLeft: "clamp(1rem, 4vw, 2rem)", paddingRight: "clamp(1rem, 4vw, 2rem)" };
  }
  return { paddingLeft: DEFAULT_PADDING_X, paddingRight: DEFAULT_PADDING_X };
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  (
    {
      as: Tag = "div",
      component,
      size = "xl",
      align = "center",
      variant = "default",
      fluid = false,
      fullWidth = false,
      fullHeight = false,
      centered,
      paddingX,
      paddingY,
      padding,
      disableGutters = false,
      fixed = false,
      maxWidth,
      minWidth,
      minHeight,
      maxHeight,
      width,
      height,
      background,
      border,
      borderRadius,
      boxShadow,
      overflow,
      overflowX,
      overflowY,
      position,
      display,
      zIndex,
      flex,
      flexGrow,
      flexShrink,
      flexBasis,
      opacity,
      transition,
      cursor,
      userSelect,
      pointerEvents,
      className = "",
      style = {},
      children,
      srOnly = false,
      elevation,
      square = false,
      noPadding = false,
      responsive = false,
      responsivePadding = false,
      testId,
      sx,
      role,
      tabIndex,
      onClick,
      onMouseEnter,
      onMouseLeave,
      onFocus,
      onBlur,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "aria-describedby": ariaDescribedBy,
      ...rest
    },
    ref
  ) => {
    const FinalTag = component ?? Tag;

    const effectiveAlign = centered !== undefined ? (centered ? "center" : "left") : align;
    const resolvedMaxWidth = resolveMaxWidth(size, maxWidth, fluid, variant);
    const paddingXStyles = resolveResponsivePaddingX(paddingX, disableGutters, noPadding, responsivePadding);

    const paddingYVal =
      paddingY !== undefined
        ? typeof paddingY === "number"
          ? `${paddingY}px`
          : paddingY
        : undefined;

    const inlineStyle: CSSProperties = {
      width: fullWidth ? "100%" : width,
      maxWidth: resolvedMaxWidth,
      minWidth: minWidth !== undefined ? (typeof minWidth === "number" ? `${minWidth}px` : minWidth) : undefined,
      height: fullHeight ? "100%" : height,
      minHeight: minHeight !== undefined ? (typeof minHeight === "number" ? `${minHeight}px` : minHeight) : undefined,
      maxHeight: maxHeight !== undefined ? (typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight) : undefined,
      ...ALIGN_STYLE_MAP[effectiveAlign],
      ...paddingXStyles,
      ...(paddingYVal && { paddingTop: paddingYVal, paddingBottom: paddingYVal }),
      ...(padding !== undefined && { padding: typeof padding === "number" ? `${padding}px` : padding }),
      ...(display && { display }),
      ...(position && { position }),
      ...(overflow && { overflow }),
      ...(overflowX && { overflowX }),
      ...(overflowY && { overflowY }),
      ...(zIndex !== undefined && { zIndex }),
      ...(flex !== undefined && { flex }),
      ...(flexGrow !== undefined && { flexGrow }),
      ...(flexShrink !== undefined && { flexShrink }),
      ...(flexBasis !== undefined && { flexBasis }),
      ...(background && { background }),
      ...(border && { border }),
      ...(borderRadius !== undefined ? { borderRadius } : !square ? {} : { borderRadius: 0 }),
      ...(boxShadow && { boxShadow }),
      ...(elevation !== undefined && !boxShadow && { boxShadow: ELEVATION_SHADOWS[elevation] }),
      ...(opacity !== undefined && { opacity }),
      ...(transition && { transition }),
      ...(cursor && { cursor }),
      ...(userSelect && { userSelect }),
      ...(pointerEvents && { pointerEvents }),
      ...sx,
      ...style,
    };

    const classes = [
      srOnly ? "sr-only" : "",
      variant === "full-bleed" ? "!max-w-none !px-0" : "",
      responsive ? "w-full" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <FinalTag
        ref={ref}
        className={classes || undefined}
        style={inlineStyle}
        role={role}
        tabIndex={tabIndex}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onFocus={onFocus}
        onBlur={onBlur}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        data-testid={testId}
        {...rest}
      >
        {children}
      </FinalTag>
    );
  }
);
Container.displayName = "Container";

export interface SectionContainerProps extends ContainerProps {
  as?: "section" | "article" | "aside" | "main" | "header" | "footer" | "nav" | "div";
  paddingSection?: string | number;
}

export const SectionContainer = forwardRef<HTMLDivElement, SectionContainerProps>(
  (
    {
      as = "section",
      paddingSection,
      paddingY,
      style = {},
      children,
      ...rest
    },
    ref
  ) => {
    const sectionPadding = paddingSection ?? paddingY ?? "4rem";
    const val = typeof sectionPadding === "number" ? `${sectionPadding}px` : sectionPadding;

    return (
      <Container
        ref={ref}
        as={as}
        paddingY={val}
        style={style}
        {...rest}
      >
        {children}
      </Container>
    );
  }
);
SectionContainer.displayName = "SectionContainer";

export interface FluidContainerProps extends ContainerProps {}

export const FluidContainer = forwardRef<HTMLDivElement, FluidContainerProps>(
  ({ children, ...rest }, ref) => {
    return (
      <Container ref={ref} fluid maxWidth={false} size="full" {...rest}>
        {children}
      </Container>
    );
  }
);
FluidContainer.displayName = "FluidContainer";

export interface NarrowContainerProps extends ContainerProps {
  size?: Extract<ContainerSize, "xs" | "sm" | "md" | "prose">;
}

export const NarrowContainer = forwardRef<HTMLDivElement, NarrowContainerProps>(
  ({ size = "md", children, ...rest }, ref) => {
    return (
      <Container ref={ref} size={size} {...rest}>
        {children}
      </Container>
    );
  }
);
NarrowContainer.displayName = "NarrowContainer";

export interface WideContainerProps extends ContainerProps {
  size?: Extract<ContainerSize, "xl" | "2xl" | "3xl" | "4xl">;
}

export const WideContainer = forwardRef<HTMLDivElement, WideContainerProps>(
  ({ size = "2xl", children, ...rest }, ref) => {
    return (
      <Container ref={ref} size={size} {...rest}>
        {children}
      </Container>
    );
  }
);
WideContainer.displayName = "WideContainer";

export interface ProseContainerProps extends ContainerProps {}

export const ProseContainer = forwardRef<HTMLDivElement, ProseContainerProps>(
  ({ children, ...rest }, ref) => {
    return (
      <Container ref={ref} size="prose" {...rest}>
        {children}
      </Container>
    );
  }
);
ProseContainer.displayName = "ProseContainer";

export interface PageContainerProps extends ContainerProps {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  headerClassName?: string;
  footerClassName?: string;
  headerStyle?: CSSProperties;
  footerStyle?: CSSProperties;
  headerBordered?: boolean;
  footerBordered?: boolean;
  stickyHeader?: boolean;
  stickyFooter?: boolean;
  scrollable?: boolean;
  gap?: string | number;
}

export const PageContainer = forwardRef<HTMLDivElement, PageContainerProps>(
  (
    {
      header,
      footer,
      headerClassName = "",
      footerClassName = "",
      headerStyle = {},
      footerStyle = {},
      headerBordered = true,
      footerBordered = true,
      stickyHeader = false,
      stickyFooter = false,
      scrollable = false,
      gap,
      children,
      style = {},
      className = "",
      ...rest
    },
    ref
  ) => {
    const gapVal =
      gap !== undefined
        ? typeof gap === "number"
          ? `${gap}px`
          : gap
        : undefined;

    return (
      <div
        ref={ref}
        className={`flex flex-col w-full ${scrollable ? "h-full overflow-hidden" : ""} ${className}`}
        style={style}
      >
        {header && (
          <div
            className={`shrink-0 ${stickyHeader ? "sticky top-0 z-30" : ""} bg-white dark:bg-gray-900 ${headerBordered ? "border-b border-gray-200 dark:border-gray-800" : ""} ${headerClassName}`}
            style={headerStyle}
          >
            <Container {...rest}>{header}</Container>
          </div>
        )}
        <div
          className={`flex-1 min-h-0 ${scrollable ? "overflow-y-auto" : ""}`}
          style={gapVal ? { padding: gapVal } : undefined}
        >
          <Container {...rest}>{children}</Container>
        </div>
        {footer && (
          <div
            className={`shrink-0 ${stickyFooter ? "sticky bottom-0 z-30" : ""} bg-white dark:bg-gray-900 ${footerBordered ? "border-t border-gray-200 dark:border-gray-800" : ""} ${footerClassName}`}
            style={footerStyle}
          >
            <Container {...rest}>{footer}</Container>
          </div>
        )}
      </div>
    );
  }
);
PageContainer.displayName = "PageContainer";

export interface InsetContainerProps extends ContainerProps {
  bleedX?: string | number;
  bleedY?: string | number;
}

export const InsetContainer = forwardRef<HTMLDivElement, InsetContainerProps>(
  ({ bleedX, bleedY, style = {}, children, ...rest }, ref) => {
    const toNeg = (v: string | number) =>
      typeof v === "number" ? `${-v}px` : `-${v}`;

    const insetStyle: CSSProperties = {
      ...(bleedX !== undefined && {
        marginLeft: toNeg(bleedX),
        marginRight: toNeg(bleedX),
      }),
      ...(bleedY !== undefined && {
        marginTop: toNeg(bleedY),
        marginBottom: toNeg(bleedY),
      }),
      ...style,
    };

    return (
      <Container ref={ref} style={insetStyle} {...rest}>
        {children}
      </Container>
    );
  }
);
InsetContainer.displayName = "InsetContainer";

export interface AnimatedContainerProps extends ContainerProps {
  animate?: boolean;
  animationVariant?: "fade" | "slide-up" | "slide-down" | "slide-left" | "slide-right" | "scale" | "blur";
  duration?: number;
  delay?: number;
  once?: boolean;
}

const ANIMATION_VARIANTS = {
  "fade": {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  "slide-up": {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 24 },
  },
  "slide-down": {
    initial: { opacity: 0, y: -24 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -24 },
  },
  "slide-left": {
    initial: { opacity: 0, x: 24 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 24 },
  },
  "slide-right": {
    initial: { opacity: 0, x: -24 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -24 },
  },
  "scale": {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
  "blur": {
    initial: { opacity: 0, filter: "blur(8px)" },
    animate: { opacity: 1, filter: "blur(0px)" },
    exit: { opacity: 0, filter: "blur(8px)" },
  },
};

export const AnimatedContainer = forwardRef<HTMLDivElement, AnimatedContainerProps>(
  (
    {
      animate = true,
      animationVariant = "fade",
      duration = 0.3,
      delay = 0,
      once = true,
      children,
      style = {},
      className = "",
      ...rest
    },
    ref
  ) => {
    const variants = ANIMATION_VARIANTS[animationVariant];

    if (!animate) {
      return (
        <Container ref={ref} className={className} style={style} {...rest}>
          {children}
        </Container>
      );
    }

    return (
      <AnimatePresence>
        <motion.div
          initial={variants.initial}
          animate={variants.animate}
          exit={variants.exit}
          transition={{ duration, delay, ease: "easeOut" }}
          className={className}
          style={style}
        >
          <Container {...rest}>{children}</Container>
        </motion.div>
      </AnimatePresence>
    );
  }
);
AnimatedContainer.displayName = "AnimatedContainer";

export interface ResponsiveContainerProps extends ContainerProps {
  sizes?: Partial<Record<ContainerBreakpoint, ContainerSize>>;
  paddings?: Partial<Record<ContainerBreakpoint, string | number>>;
}

export const ResponsiveContainer = forwardRef<HTMLDivElement, ResponsiveContainerProps>(
  ({ sizes, paddings, style = {}, children, ...rest }, ref) => {
    const [currentSize, setCurrentSize] = useState<ContainerSize>(rest.size ?? "xl");
    const [currentPaddingX, setCurrentPaddingX] = useState<string | number | undefined>(rest.paddingX);

    useEffect(() => {
      if (!sizes && !paddings) return;

      const breakpointOrder: ContainerBreakpoint[] = ["2xl", "xl", "lg", "md", "sm", "xs"];

      const update = () => {
        const w = window.innerWidth;
        const bpWidths: Record<ContainerBreakpoint, number> = {
          xs: 0, sm: 640, md: 768, lg: 1024, xl: 1280, "2xl": 1536,
        };

        if (sizes) {
          for (const bp of breakpointOrder) {
            if (w >= bpWidths[bp] && sizes[bp]) {
              setCurrentSize(sizes[bp]!);
              break;
            }
          }
        }

        if (paddings) {
          for (const bp of breakpointOrder) {
            if (w >= bpWidths[bp] && paddings[bp] !== undefined) {
              setCurrentPaddingX(paddings[bp]);
              break;
            }
          }
        }
      };

      window.addEventListener("resize", update, { passive: true });
      update();
      return () => window.removeEventListener("resize", update);
    }, [sizes, paddings]);

    return (
      <Container
        ref={ref}
        size={currentSize}
        paddingX={currentPaddingX}
        style={style}
        {...rest}
      >
        {children}
      </Container>
    );
  }
);
ResponsiveContainer.displayName = "ResponsiveContainer";

export interface ConstrainedContainerProps extends ContainerProps {
  aspectRatio?: number | string;
  minAspectRatio?: number;
  maxAspectRatio?: number;
}

export const ConstrainedContainer = forwardRef<HTMLDivElement, ConstrainedContainerProps>(
  ({ aspectRatio, minAspectRatio, maxAspectRatio, style = {}, children, ...rest }, ref) => {
    const numRatio =
      aspectRatio !== undefined
        ? typeof aspectRatio === "string"
          ? eval(aspectRatio.replace(":", "/"))
          : aspectRatio
        : undefined;

    const constrainedStyle: CSSProperties = {
      ...(numRatio && {
        position: "relative",
        paddingBottom: `${(1 / numRatio) * 100}%`,
      }),
      ...style,
    };

    return (
      <Container ref={ref} style={constrainedStyle} {...rest}>
        {numRatio ? (
          <div style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
            {children}
          </div>
        ) : (
          children
        )}
      </Container>
    );
  }
);
ConstrainedContainer.displayName = "ConstrainedContainer";

export interface ContainerGroupProps {
  children: React.ReactNode;
  gap?: string | number;
  direction?: "row" | "column";
  wrap?: boolean;
  align?: CSSProperties["alignItems"];
  justify?: CSSProperties["justifyContent"];
  className?: string;
  style?: CSSProperties;
}

export const ContainerGroup = forwardRef<HTMLDivElement, ContainerGroupProps>(
  (
    {
      children,
      gap = "1.5rem",
      direction = "column",
      wrap = false,
      align,
      justify,
      className = "",
      style = {},
    },
    ref
  ) => {
    const gapVal = typeof gap === "number" ? `${gap}px` : gap;

    return (
      <div
        ref={ref}
        className={className}
        style={{
          display: "flex",
          flexDirection: direction,
          gap: gapVal,
          flexWrap: wrap ? "wrap" : "nowrap",
          alignItems: align,
          justifyContent: justify,
          width: "100%",
          ...style,
        }}
      >
        {children}
      </div>
    );
  }
);
ContainerGroup.displayName = "ContainerGroup";

export interface ContainerDividerProps {
  thickness?: number;
  dashed?: boolean;
  label?: React.ReactNode;
  labelPosition?: "start" | "center" | "end";
  className?: string;
  style?: CSSProperties;
}

export const ContainerDivider = forwardRef<HTMLDivElement, ContainerDividerProps>(
  (
    {
      thickness = 1,
      dashed = false,
      label,
      labelPosition = "center",
      className = "",
      style = {},
    },
    ref
  ) => {
    const borderStyle: CSSProperties = {
      borderTopWidth: thickness,
      borderTopStyle: dashed ? "dashed" : "solid",
      borderTopColor: "inherit",
    };

    if (!label) {
      return (
        <div
          ref={ref}
          role="separator"
          className={`w-full border-gray-200 dark:border-gray-700 ${className}`}
          style={{ ...borderStyle, ...style }}
        />
      );
    }

    return (
      <div
        ref={ref}
        className={`flex items-center gap-3 w-full ${className}`}
        style={style}
      >
        {labelPosition !== "start" && (
          <div className="flex-1 border-gray-200 dark:border-gray-700" style={borderStyle} />
        )}
        <span className="shrink-0 text-xs font-medium text-gray-400 dark:text-gray-500 select-none">
          {label}
        </span>
        {labelPosition !== "end" && (
          <div className="flex-1 border-gray-200 dark:border-gray-700" style={borderStyle} />
        )}
      </div>
    );
  }
);
ContainerDivider.displayName = "ContainerDivider";

export interface ContainerSpacerProps {
  size?: string | number;
  axis?: "horizontal" | "vertical" | "both";
  className?: string;
  style?: CSSProperties;
}

export const ContainerSpacer = forwardRef<HTMLDivElement, ContainerSpacerProps>(
  ({ size, axis = "vertical", className = "", style = {} }, ref) => {
    const val =
      size !== undefined
        ? typeof size === "number"
          ? `${size}px`
          : size
        : undefined;

    const spacerStyle: CSSProperties = {
      display: "block",
      ...(axis === "vertical" || axis === "both"
        ? { height: val ?? "auto", ...(val === undefined && { flexGrow: 1 }) }
        : {}),
      ...(axis === "horizontal" || axis === "both"
        ? { width: val ?? "auto", ...(val === undefined && { flexGrow: 1 }) }
        : {}),
      ...style,
    };

    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={className}
        style={spacerStyle}
      />
    );
  }
);
ContainerSpacer.displayName = "ContainerSpacer";

export interface ContainerOverlayProps extends ContainerProps {
  blurred?: boolean;
  blurAmount?: number;
  dimAmount?: number;
  onClose?: () => void;
  closeOnClick?: boolean;
  zIndex?: number;
}

export const ContainerOverlay = forwardRef<HTMLDivElement, ContainerOverlayProps>(
  (
    {
      blurred = false,
      blurAmount = 4,
      dimAmount = 0.4,
      onClose,
      closeOnClick = true,
      zIndex = 50,
      children,
      className = "",
      style = {},
      ...rest
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`fixed inset-0 ${className}`}
        style={{
          zIndex,
          backgroundColor: `rgba(0,0,0,${dimAmount})`,
          backdropFilter: blurred ? `blur(${blurAmount}px)` : undefined,
          ...style,
        }}
        onClick={closeOnClick ? onClose : undefined}
        {...(rest as React.HTMLAttributes<HTMLDivElement>)}
      >
        {children}
      </div>
    );
  }
);
ContainerOverlay.displayName = "ContainerOverlay";

export interface ContainerScrollAreaProps extends ContainerProps {
  scrollAxis?: "x" | "y" | "both" | "none";
  showScrollbar?: "always" | "hover" | "never";
  scrollbarSize?: "thin" | "default" | "none";
  onScrollEnd?: () => void;
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
}

export const ContainerScrollArea = forwardRef<HTMLDivElement, ContainerScrollAreaProps>(
  (
    {
      scrollAxis = "y",
      showScrollbar = "hover",
      scrollbarSize = "thin",
      onScrollEnd,
      onScroll,
      maxHeight,
      maxWidth,
      children,
      className = "",
      style = {},
      ...rest
    },
    ref
  ) => {
    const overflowStyle: CSSProperties = {
      overflowX: scrollAxis === "x" || scrollAxis === "both" ? "auto" : "hidden",
      overflowY: scrollAxis === "y" || scrollAxis === "both" ? "auto" : "hidden",
    };

    const scrollbarClass =
      scrollbarSize === "none"
        ? "[&::-webkit-scrollbar]:hidden"
        : scrollbarSize === "thin"
          ? showScrollbar === "hover"
            ? "[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-gray-300 dark:hover:[&::-webkit-scrollbar-thumb]:bg-gray-600"
            : "[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-gray-600"
          : "[&::-webkit-scrollbar]:w-2.5 [&::-webkit-scrollbar]:h-2.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-gray-600";

    const handleScroll = useCallback(
      (e: React.UIEvent<HTMLDivElement>) => {
        onScroll?.(e);
        if (onScrollEnd) {
          const el = e.currentTarget;
          const isAtEnd =
            scrollAxis === "y" || scrollAxis === "both"
              ? Math.abs(el.scrollHeight - el.scrollTop - el.clientHeight) < 2
              : Math.abs(el.scrollWidth - el.scrollLeft - el.clientWidth) < 2;
          if (isAtEnd) onScrollEnd();
        }
      },
      [scrollAxis, onScroll, onScrollEnd]
    );

    return (
      <Container
        ref={ref}
        maxHeight={maxHeight}
        maxWidth={maxWidth}
        className={`${scrollbarClass} ${className}`}
        style={{ ...overflowStyle, ...style }}
        onScroll={handleScroll}
        {...rest}
      >
        {children}
      </Container>
    );
  }
);
ContainerScrollArea.displayName = "ContainerScrollArea";

export {
  ContainerProvider,
  useContainerContext,
  CONTAINER_MAX_WIDTHS,
};

export type {
  ContainerProviderProps,
  ContainerSize,
  ContainerAlign,
  ContainerVariant,
  ContainerBreakpoint,
};