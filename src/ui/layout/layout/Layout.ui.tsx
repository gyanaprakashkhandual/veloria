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
  X,
  ChevronLeft,
  ChevronRight,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import {
  PageLayoutProvider,
  usePageLayoutContext,
  type PageLayoutProviderProps,
  type SidebarPosition,
  type SidebarVariant,
} from "./Layout.context";

type ResponsiveValue<T> = T | { base?: T; sm?: T; md?: T; lg?: T; xl?: T };

type OverflowValue = "auto" | "hidden" | "scroll" | "visible" | "clip";
type DisplayValue =
  | "block"
  | "inline-block"
  | "flex"
  | "inline-flex"
  | "grid"
  | "inline-grid"
  | "contents"
  | "none";
type PositionValue = "static" | "relative" | "absolute" | "fixed" | "sticky";
type FlexDirection = "row" | "column" | "row-reverse" | "column-reverse";
type FlexAlign =
  | "start"
  | "end"
  | "center"
  | "stretch"
  | "baseline"
  | "between"
  | "around"
  | "evenly";
type FlexWrap = "nowrap" | "wrap" | "wrap-reverse";

const alignMap: Record<string, string> = {
  start: "items-start",
  end: "items-end",
  center: "items-center",
  stretch: "items-stretch",
  baseline: "items-baseline",
};

const justifyMap: Record<string, string> = {
  start: "justify-start",
  end: "justify-end",
  center: "justify-center",
  stretch: "justify-stretch",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
};

const directionMap: Record<string, string> = {
  row: "flex-row",
  column: "flex-col",
  "row-reverse": "flex-row-reverse",
  "column-reverse": "flex-col-reverse",
};

const wrapMap: Record<string, string> = {
  nowrap: "flex-nowrap",
  wrap: "flex-wrap",
  "wrap-reverse": "flex-wrap-reverse",
};

const gapMap: Record<string | number, string> = {
  0: "gap-0",
  1: "gap-1",
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  5: "gap-5",
  6: "gap-6",
  7: "gap-7",
  8: "gap-8",
  10: "gap-10",
  12: "gap-12",
  16: "gap-16",
  px: "gap-px",
  "0.5": "gap-0.5",
  "1.5": "gap-1.5",
  "2.5": "gap-2.5",
  "3.5": "gap-3.5",
};

function resolveGap(gap: number | string | undefined): string {
  if (gap === undefined) return "";
  if (gapMap[gap]) return gapMap[gap];
  return "";
}

export interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  display?: DisplayValue;
  position?: PositionValue;
  overflow?: OverflowValue;
  overflowX?: OverflowValue;
  overflowY?: OverflowValue;
  width?: string | number;
  height?: string | number;
  minWidth?: string | number;
  minHeight?: string | number;
  maxWidth?: string | number;
  maxHeight?: string | number;
  padding?: string | number;
  paddingX?: string | number;
  paddingY?: string | number;
  margin?: string | number;
  marginX?: string | number;
  marginY?: string | number;
  top?: string | number;
  right?: string | number;
  bottom?: string | number;
  left?: string | number;
  zIndex?: number | string;
  flex?: string | number;
  flexGrow?: number;
  flexShrink?: number;
  flexBasis?: string | number;
  borderRadius?: string;
  background?: string;
  border?: string;
  boxShadow?: string;
  cursor?: string;
  userSelect?: CSSProperties["userSelect"];
  pointerEvents?: CSSProperties["pointerEvents"];
  opacity?: number;
  transition?: string;
  className?: string;
  style?: CSSProperties;
  children?: React.ReactNode;
  fullWidth?: boolean;
  fullHeight?: boolean;
  srOnly?: boolean;
}

export const Box = forwardRef<HTMLDivElement, BoxProps>(
  (
    {
      as: Tag = "div",
      display,
      position,
      overflow,
      overflowX,
      overflowY,
      width,
      height,
      minWidth,
      minHeight,
      maxWidth,
      maxHeight,
      padding,
      paddingX,
      paddingY,
      margin,
      marginX,
      marginY,
      top,
      right,
      bottom,
      left,
      zIndex,
      flex,
      flexGrow,
      flexShrink,
      flexBasis,
      borderRadius,
      background,
      border,
      boxShadow,
      cursor,
      userSelect,
      pointerEvents,
      opacity,
      transition,
      fullWidth,
      fullHeight,
      srOnly,
      className = "",
      style = {},
      children,
      ...rest
    },
    ref,
  ) => {
    const inlineStyle: CSSProperties = {
      ...(display && { display }),
      ...(position && { position }),
      ...(overflow && { overflow }),
      ...(overflowX && { overflowX }),
      ...(overflowY && { overflowY }),
      ...(width !== undefined && { width }),
      ...(height !== undefined && { height }),
      ...(minWidth !== undefined && { minWidth }),
      ...(minHeight !== undefined && { minHeight }),
      ...(maxWidth !== undefined && { maxWidth }),
      ...(maxHeight !== undefined && { maxHeight }),
      ...(padding !== undefined && { padding }),
      ...(paddingX !== undefined && {
        paddingLeft: paddingX,
        paddingRight: paddingX,
      }),
      ...(paddingY !== undefined && {
        paddingTop: paddingY,
        paddingBottom: paddingY,
      }),
      ...(margin !== undefined && { margin }),
      ...(marginX !== undefined && {
        marginLeft: marginX,
        marginRight: marginX,
      }),
      ...(marginY !== undefined && {
        marginTop: marginY,
        marginBottom: marginY,
      }),
      ...(top !== undefined && { top }),
      ...(right !== undefined && { right }),
      ...(bottom !== undefined && { bottom }),
      ...(left !== undefined && { left }),
      ...(zIndex !== undefined && { zIndex }),
      ...(flex !== undefined && { flex }),
      ...(flexGrow !== undefined && { flexGrow }),
      ...(flexShrink !== undefined && { flexShrink }),
      ...(flexBasis !== undefined && { flexBasis }),
      ...(borderRadius && { borderRadius }),
      ...(background && { background }),
      ...(border && { border }),
      ...(boxShadow && { boxShadow }),
      ...(cursor && { cursor }),
      ...(userSelect && { userSelect }),
      ...(pointerEvents && { pointerEvents }),
      ...(opacity !== undefined && { opacity }),
      ...(transition && { transition }),
      ...style,
    };

    const classes = [
      fullWidth ? "w-full" : "",
      fullHeight ? "h-full" : "",
      srOnly ? "sr-only" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <Tag
        ref={ref}
        className={classes || undefined}
        style={inlineStyle}
        {...rest}
      >
        {children}
      </Tag>
    );
  },
);
Box.displayName = "Box";

export interface FlexProps extends Omit<BoxProps, "display"> {
  direction?: FlexDirection;
  align?: FlexAlign;
  justify?: FlexAlign;
  wrap?: FlexWrap;
  gap?: number | string;
  gapX?: number | string;
  gapY?: number | string;
  inline?: boolean;
}

export const Flex = forwardRef<HTMLDivElement, FlexProps>(
  (
    {
      direction = "row",
      align,
      justify,
      wrap,
      gap,
      gapX,
      gapY,
      inline = false,
      className = "",
      style = {},
      children,
      ...rest
    },
    ref,
  ) => {
    const classes = [
      inline ? "inline-flex" : "flex",
      directionMap[direction] ?? "",
      align ? (alignMap[align] ?? "") : "",
      justify ? (justifyMap[justify] ?? "") : "",
      wrap ? (wrapMap[wrap] ?? "") : "",
      gap !== undefined ? resolveGap(gap) : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const inlineStyle: CSSProperties = {
      ...(gapX !== undefined && {
        columnGap: typeof gapX === "number" ? `${gapX * 4}px` : gapX,
      }),
      ...(gapY !== undefined && {
        rowGap: typeof gapY === "number" ? `${gapY * 4}px` : gapY,
      }),
      ...style,
    };

    return (
      <Box ref={ref} className={classes} style={inlineStyle} {...rest}>
        {children}
      </Box>
    );
  },
);
Flex.displayName = "Flex";

export interface StackProps extends Omit<FlexProps, "direction"> {
  direction?: "vertical" | "horizontal";
  divider?: React.ReactNode;
  spacing?: number | string;
}

export const Stack = forwardRef<HTMLDivElement, StackProps>(
  (
    {
      direction = "vertical",
      divider,
      spacing,
      gap,
      children,
      className = "",
      ...rest
    },
    ref,
  ) => {
    const flexDir: FlexDirection = direction === "vertical" ? "column" : "row";
    const effectiveGap = spacing ?? gap ?? 3;

    const childArray = React.Children.toArray(children).filter(Boolean);

    if (divider) {
      return (
        <Flex
          ref={ref}
          direction={flexDir}
          gap={effectiveGap}
          className={className}
          {...rest}
        >
          {childArray.map((child, i) => (
            <React.Fragment key={i}>
              {child}
              {i < childArray.length - 1 && divider}
            </React.Fragment>
          ))}
        </Flex>
      );
    }

    return (
      <Flex
        ref={ref}
        direction={flexDir}
        gap={effectiveGap}
        className={className}
        {...rest}
      >
        {children}
      </Flex>
    );
  },
);
Stack.displayName = "Stack";

export interface GridProps extends Omit<BoxProps, "display"> {
  columns?: number | string;
  rows?: number | string;
  gap?: number | string;
  gapX?: number | string;
  gapY?: number | string;
  autoFlow?: "row" | "column" | "row dense" | "column dense";
  autoColumns?: string;
  autoRows?: string;
  templateColumns?: string;
  templateRows?: string;
  align?: "start" | "end" | "center" | "stretch";
  justify?:
    | "start"
    | "end"
    | "center"
    | "stretch"
    | "between"
    | "around"
    | "evenly";
  placeItems?: string;
  placeContent?: string;
  inline?: boolean;
  minChildWidth?: string;
  responsive?: boolean;
}

export const Grid = forwardRef<HTMLDivElement, GridProps>(
  (
    {
      columns,
      rows,
      gap,
      gapX,
      gapY,
      autoFlow,
      autoColumns,
      autoRows,
      templateColumns,
      templateRows,
      align,
      justify,
      placeItems,
      placeContent,
      inline = false,
      minChildWidth,
      responsive = false,
      className = "",
      style = {},
      children,
      ...rest
    },
    ref,
  ) => {
    const gridTemplateColumns = templateColumns
      ? templateColumns
      : minChildWidth
        ? `repeat(auto-fit, minmax(${minChildWidth}, 1fr))`
        : columns
          ? typeof columns === "number"
            ? `repeat(${columns}, minmax(0, 1fr))`
            : columns
          : undefined;

    const gridTemplateRows = templateRows
      ? templateRows
      : rows
        ? typeof rows === "number"
          ? `repeat(${rows}, minmax(0, 1fr))`
          : rows
        : undefined;

    const inlineStyle: CSSProperties = {
      display: inline ? "inline-grid" : "grid",
      ...(gridTemplateColumns && { gridTemplateColumns }),
      ...(gridTemplateRows && { gridTemplateRows }),
      ...(autoFlow && { gridAutoFlow: autoFlow }),
      ...(autoColumns && { gridAutoColumns: autoColumns }),
      ...(autoRows && { gridAutoRows: autoRows }),
      ...(align && { alignItems: align }),
      ...(justify && { justifyContent: justify }),
      ...(placeItems && { placeItems }),
      ...(placeContent && { placeContent }),
      ...(gapX !== undefined && {
        columnGap: typeof gapX === "number" ? `${gapX * 4}px` : gapX,
      }),
      ...(gapY !== undefined && {
        rowGap: typeof gapY === "number" ? `${gapY * 4}px` : gapY,
      }),
      ...style,
    };

    const classes = [gap !== undefined ? resolveGap(gap) : "", className]
      .filter(Boolean)
      .join(" ");

    return (
      <Box
        ref={ref}
        className={classes || undefined}
        style={inlineStyle}
        {...rest}
      >
        {children}
      </Box>
    );
  },
);
Grid.displayName = "Grid";

export interface GridItemProps extends BoxProps {
  colSpan?: number | "full";
  rowSpan?: number | "full";
  colStart?: number | "auto";
  colEnd?: number | "auto";
  rowStart?: number | "auto";
  rowEnd?: number | "auto";
  area?: string;
  placeSelf?: string;
  alignSelf?: string;
  justifySelf?: string;
}

export const GridItem = forwardRef<HTMLDivElement, GridItemProps>(
  (
    {
      colSpan,
      rowSpan,
      colStart,
      colEnd,
      rowStart,
      rowEnd,
      area,
      placeSelf,
      alignSelf,
      justifySelf,
      style = {},
      children,
      ...rest
    },
    ref,
  ) => {
    const inlineStyle: CSSProperties = {
      ...(colSpan !== undefined && {
        gridColumn:
          colSpan === "full" ? "1 / -1" : `span ${colSpan} / span ${colSpan}`,
      }),
      ...(rowSpan !== undefined && {
        gridRow:
          rowSpan === "full" ? "1 / -1" : `span ${rowSpan} / span ${rowSpan}`,
      }),
      ...(colStart !== undefined && { gridColumnStart: colStart }),
      ...(colEnd !== undefined && { gridColumnEnd: colEnd }),
      ...(rowStart !== undefined && { gridRowStart: rowStart }),
      ...(rowEnd !== undefined && { gridRowEnd: rowEnd }),
      ...(area && { gridArea: area }),
      ...(placeSelf && { placeSelf }),
      ...(alignSelf && { alignSelf }),
      ...(justifySelf && { justifySelf }),
      ...style,
    };

    return (
      <Box ref={ref} style={inlineStyle} {...rest}>
        {children}
      </Box>
    );
  },
);
GridItem.displayName = "GridItem";

export interface CenterProps extends BoxProps {
  axis?: "both" | "horizontal" | "vertical";
  absolute?: boolean;
}

export const Center = forwardRef<HTMLDivElement, CenterProps>(
  (
    {
      axis = "both",
      absolute = false,
      className = "",
      style = {},
      children,
      ...rest
    },
    ref,
  ) => {
    const baseStyle: CSSProperties = absolute
      ? {
          position: "absolute",
          ...(axis === "both" || axis === "horizontal"
            ? { left: "50%", transform: "translateX(-50%)" }
            : {}),
          ...(axis === "both" || axis === "vertical"
            ? {
                top: "50%",
                transform:
                  axis === "both"
                    ? "translate(-50%, -50%)"
                    : "translateY(-50%)",
              }
            : {}),
          ...style,
        }
      : {
          display: "flex",
          alignItems:
            axis === "both" || axis === "vertical" ? "center" : undefined,
          justifyContent:
            axis === "both" || axis === "horizontal" ? "center" : undefined,
          ...style,
        };

    return (
      <Box ref={ref} className={className} style={baseStyle} {...rest}>
        {children}
      </Box>
    );
  },
);
Center.displayName = "Center";

export interface SpacerProps {
  size?: number | string;
  axis?: "horizontal" | "vertical" | "both";
  className?: string;
  style?: CSSProperties;
}

export const Spacer = forwardRef<HTMLDivElement, SpacerProps>(
  ({ size, axis = "vertical", className = "", style = {} }, ref) => {
    const inlineStyle: CSSProperties = {
      display: "block",
      ...(axis === "vertical" || axis === "both"
        ? {
            height:
              size !== undefined
                ? typeof size === "number"
                  ? `${size * 4}px`
                  : size
                : "auto",
          }
        : {}),
      ...(axis === "horizontal" || axis === "both"
        ? {
            width:
              size !== undefined
                ? typeof size === "number"
                  ? `${size * 4}px`
                  : size
                : "auto",
          }
        : {}),
      ...(axis === "both" && size === undefined ? { flex: 1 } : {}),
      ...(size === undefined && axis !== "both" ? { flex: 1 } : {}),
      ...style,
    };

    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={className}
        style={inlineStyle}
      />
    );
  },
);
Spacer.displayName = "Spacer";

export interface ContainerProps extends BoxProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "full" | "prose";
  centered?: boolean;
  paddingX?: string | number;
  paddingY?: string | number;
  fluid?: boolean;
}

const containerSizeMap: Record<string, string> = {
  xs: "480px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
  full: "100%",
  prose: "65ch",
};

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  (
    {
      size = "xl",
      centered = true,
      paddingX,
      paddingY,
      fluid = false,
      className = "",
      style = {},
      children,
      ...rest
    },
    ref,
  ) => {
    const inlineStyle: CSSProperties = {
      width: "100%",
      maxWidth: fluid ? "100%" : containerSizeMap[size],
      ...(centered && { marginLeft: "auto", marginRight: "auto" }),
      ...(paddingX !== undefined && {
        paddingLeft:
          typeof paddingX === "number" ? `${paddingX * 4}px` : paddingX,
        paddingRight:
          typeof paddingX === "number" ? `${paddingX * 4}px` : paddingX,
      }),
      ...(paddingY !== undefined && {
        paddingTop:
          typeof paddingY === "number" ? `${paddingY * 4}px` : paddingY,
        paddingBottom:
          typeof paddingY === "number" ? `${paddingY * 4}px` : paddingY,
      }),
      ...style,
    };

    const defaultPadding = paddingX === undefined ? "px-4 sm:px-6 lg:px-8" : "";

    return (
      <Box
        ref={ref}
        className={`${defaultPadding} ${className}`.trim()}
        style={inlineStyle}
        {...rest}
      >
        {children}
      </Box>
    );
  },
);
Container.displayName = "Container";

export interface AspectRatioProps extends BoxProps {
  ratio?: number | string;
}

export const AspectRatio = forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ ratio = 16 / 9, className = "", style = {}, children, ...rest }, ref) => {
    const numericRatio =
      typeof ratio === "string" ? eval(ratio.replace(":", "/")) : ratio;
    const paddingBottom = `${(1 / numericRatio) * 100}%`;

    return (
      <Box
        ref={ref}
        className={`relative w-full overflow-hidden ${className}`}
        style={{ paddingBottom, ...style }}
        {...rest}
      >
        <div className="absolute inset-0 w-full h-full">{children}</div>
      </Box>
    );
  },
);
AspectRatio.displayName = "AspectRatio";

export interface StickyProps extends BoxProps {
  offsetTop?: number | string;
  offsetBottom?: number | string;
  offsetLeft?: number | string;
  offsetRight?: number | string;
  side?: "top" | "bottom" | "left" | "right";
  zIndex?: number | string;
  stretch?: boolean;
}

export const Sticky = forwardRef<HTMLDivElement, StickyProps>(
  (
    {
      offsetTop,
      offsetBottom,
      offsetLeft,
      offsetRight,
      side = "top",
      zIndex = 10,
      stretch = false,
      className = "",
      style = {},
      children,
      ...rest
    },
    ref,
  ) => {
    const inlineStyle: CSSProperties = {
      position: "sticky",
      zIndex,
      ...(side === "top" && {
        top:
          offsetTop !== undefined
            ? typeof offsetTop === "number"
              ? `${offsetTop}px`
              : offsetTop
            : 0,
      }),
      ...(side === "bottom" && {
        bottom:
          offsetBottom !== undefined
            ? typeof offsetBottom === "number"
              ? `${offsetBottom}px`
              : offsetBottom
            : 0,
      }),
      ...(side === "left" && {
        left:
          offsetLeft !== undefined
            ? typeof offsetLeft === "number"
              ? `${offsetLeft}px`
              : offsetLeft
            : 0,
      }),
      ...(side === "right" && {
        right:
          offsetRight !== undefined
            ? typeof offsetRight === "number"
              ? `${offsetRight}px`
              : offsetRight
            : 0,
      }),
      ...(stretch && { alignSelf: "flex-start" }),
      ...style,
    };

    return (
      <Box ref={ref} className={className} style={inlineStyle} {...rest}>
        {children}
      </Box>
    );
  },
);
Sticky.displayName = "Sticky";

export interface ScrollAreaProps extends BoxProps {
  axis?: "x" | "y" | "both" | "none";
  showScrollbar?: "always" | "hover" | "never";
  fadeEdges?: boolean;
  fadeSize?: number;
  scrollbarSize?: "thin" | "default" | "none";
  onScrollEnd?: () => void;
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
}

export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(
  (
    {
      axis = "y",
      showScrollbar = "hover",
      fadeEdges = false,
      fadeSize = 32,
      scrollbarSize = "thin",
      onScrollEnd,
      onScroll,
      className = "",
      style = {},
      children,
      maxHeight,
      maxWidth,
      ...rest
    },
    ref,
  ) => {
    const innerRef = useRef<HTMLDivElement>(null);
    const [atStart, setAtStart] = useState(true);
    const [atEnd, setAtEnd] = useState(false);

    const handleScroll = useCallback(
      (e: React.UIEvent<HTMLDivElement>) => {
        const el = e.currentTarget;
        if (axis === "y" || axis === "both") {
          setAtStart(el.scrollTop <= 0);
          setAtEnd(
            Math.abs(el.scrollHeight - el.scrollTop - el.clientHeight) < 2,
          );
        } else {
          setAtStart(el.scrollLeft <= 0);
          setAtEnd(
            Math.abs(el.scrollWidth - el.scrollLeft - el.clientWidth) < 2,
          );
        }
        onScroll?.(e);
        if (onScrollEnd) {
          const isAtEnd =
            axis === "y" || axis === "both"
              ? Math.abs(el.scrollHeight - el.scrollTop - el.clientHeight) < 2
              : Math.abs(el.scrollWidth - el.scrollLeft - el.clientWidth) < 2;
          if (isAtEnd) onScrollEnd();
        }
      },
      [axis, onScroll, onScrollEnd],
    );

    const overflowStyle: CSSProperties = {
      overflowX: axis === "x" || axis === "both" ? "auto" : "hidden",
      overflowY: axis === "y" || axis === "both" ? "auto" : "hidden",
      ...(maxHeight !== undefined && { maxHeight }),
      ...(maxWidth !== undefined && { maxWidth }),
    };

    const scrollbarClass =
      scrollbarSize === "none"
        ? "scrollbar-none [&::-webkit-scrollbar]:hidden"
        : scrollbarSize === "thin"
          ? [
              showScrollbar === "never"
                ? "[&::-webkit-scrollbar]:hidden"
                : showScrollbar === "hover"
                  ? "[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-gray-300 dark:hover:[&::-webkit-scrollbar-thumb]:bg-gray-600"
                  : "[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-gray-600",
            ].join(" ")
          : [
              showScrollbar === "never"
                ? "[&::-webkit-scrollbar]:hidden"
                : showScrollbar === "hover"
                  ? "[&::-webkit-scrollbar]:w-2.5 [&::-webkit-scrollbar]:h-2.5 [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-gray-300 dark:hover:[&::-webkit-scrollbar-thumb]:bg-gray-600"
                  : "[&::-webkit-scrollbar]:w-2.5 [&::-webkit-scrollbar]:h-2.5 [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-gray-600",
            ].join(" ");

    return (
      <Box
        ref={ref}
        className={`relative ${className}`}
        style={{ maxHeight, maxWidth, ...style }}
        {...rest}
      >
        {fadeEdges && !atStart && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute z-10"
            style={
              axis === "y" || axis === "both"
                ? {
                    top: 0,
                    left: 0,
                    right: 0,
                    height: fadeSize,
                    background:
                      "linear-gradient(to bottom, var(--fade-from, white), transparent)",
                  }
                : {
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: fadeSize,
                    background:
                      "linear-gradient(to right, var(--fade-from, white), transparent)",
                  }
            }
          />
        )}
        <div
          ref={innerRef}
          onScroll={handleScroll}
          className={`w-full h-full ${scrollbarClass}`}
          style={{ ...overflowStyle }}
        >
          {children}
        </div>
        {fadeEdges && !atEnd && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute z-10"
            style={
              axis === "y" || axis === "both"
                ? {
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: fadeSize,
                    background:
                      "linear-gradient(to top, var(--fade-from, white), transparent)",
                  }
                : {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    width: fadeSize,
                    background:
                      "linear-gradient(to left, var(--fade-from, white), transparent)",
                  }
            }
          />
        )}
      </Box>
    );
  },
);
ScrollArea.displayName = "ScrollArea";

export interface DividerProps {
  orientation?: "horizontal" | "vertical";
  label?: React.ReactNode;
  labelPosition?: "start" | "center" | "end";
  thickness?: number;
  dashed?: boolean;
  decorative?: boolean;
  className?: string;
  style?: CSSProperties;
  labelClassName?: string;
}

export const Divider = forwardRef<HTMLDivElement, DividerProps>(
  (
    {
      orientation = "horizontal",
      label,
      labelPosition = "center",
      thickness = 1,
      dashed = false,
      decorative = true,
      className = "",
      style = {},
      labelClassName = "",
    },
    ref,
  ) => {
    const borderStyle: CSSProperties =
      orientation === "horizontal"
        ? {
            borderTopWidth: thickness,
            borderTopStyle: dashed ? "dashed" : "solid",
            borderTopColor: "inherit",
          }
        : {
            borderLeftWidth: thickness,
            borderLeftStyle: dashed ? "dashed" : "solid",
            borderLeftColor: "inherit",
          };

    if (orientation === "vertical") {
      return (
        <div
          ref={ref}
          role={decorative ? "presentation" : "separator"}
          aria-orientation="vertical"
          className={`inline-block self-stretch border-gray-200 dark:border-gray-700 ${className}`}
          style={{ ...borderStyle, ...style }}
        />
      );
    }

    if (!label) {
      return (
        <div
          ref={ref}
          role={decorative ? "presentation" : "separator"}
          aria-orientation="horizontal"
          className={`w-full border-gray-200 dark:border-gray-700 ${className}`}
          style={{ ...borderStyle, ...style }}
        />
      );
    }

    const labelAlignClass =
      labelPosition === "start"
        ? "justify-start"
        : labelPosition === "end"
          ? "justify-end"
          : "justify-center";

    return (
      <div
        ref={ref}
        role={decorative ? "presentation" : "separator"}
        className={`flex items-center gap-3 w-full ${className}`}
        style={style}
      >
        {labelPosition !== "start" && (
          <div
            className="flex-1 border-gray-200 dark:border-gray-700"
            style={borderStyle}
          />
        )}
        <span
          className={`shrink-0 text-xs font-medium text-gray-400 dark:text-gray-500 select-none ${labelClassName}`}
        >
          {label}
        </span>
        {labelPosition !== "end" && (
          <div
            className="flex-1 border-gray-200 dark:border-gray-700"
            style={borderStyle}
          />
        )}
      </div>
    );
  },
);
Divider.displayName = "Divider";

export interface BleedProps extends BoxProps {
  x?: number | string;
  y?: number | string;
  top?: number | string;
  bottom?: number | string;
  left?: number | string;
  right?: number | string;
}

export const Bleed = forwardRef<HTMLDivElement, BleedProps>(
  ({ x, y, top, bottom, left, right, style = {}, children, ...rest }, ref) => {
    const toNeg = (v: number | string) =>
      typeof v === "number" ? `${-v * 4}px` : `-${v}`;

    const inlineStyle: CSSProperties = {
      ...(x !== undefined && { marginLeft: toNeg(x), marginRight: toNeg(x) }),
      ...(y !== undefined && { marginTop: toNeg(y), marginBottom: toNeg(y) }),
      ...(top !== undefined && { marginTop: toNeg(top) }),
      ...(bottom !== undefined && { marginBottom: toNeg(bottom) }),
      ...(left !== undefined && { marginLeft: toNeg(left) }),
      ...(right !== undefined && { marginRight: toNeg(right) }),
      ...style,
    };

    return (
      <Box ref={ref} style={inlineStyle} {...rest}>
        {children}
      </Box>
    );
  },
);
Bleed.displayName = "Bleed";

export interface PanelProps extends BoxProps {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  variant?: "default" | "bordered" | "elevated" | "ghost" | "filled";
  scrollable?: boolean;
  maxBodyHeight?: string | number;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  noPadding?: boolean;
}

const panelVariantStyles: Record<string, string> = {
  default:
    "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm shadow-black/5 dark:shadow-black/20",
  bordered:
    "bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl",
  elevated:
    "bg-white dark:bg-gray-900 rounded-xl shadow-lg shadow-black/10 dark:shadow-black/40 border border-gray-100 dark:border-gray-800",
  ghost: "rounded-xl",
  filled:
    "bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800",
};

export const Panel = forwardRef<HTMLDivElement, PanelProps>(
  (
    {
      header,
      footer,
      variant = "default",
      scrollable = false,
      maxBodyHeight,
      headerClassName = "",
      bodyClassName = "",
      footerClassName = "",
      noPadding = false,
      className = "",
      children,
      ...rest
    },
    ref,
  ) => {
    return (
      <Box
        ref={ref}
        className={`flex flex-col overflow-hidden ${panelVariantStyles[variant]} ${className}`}
        {...rest}
      >
        {header && (
          <div
            className={`shrink-0 px-4 py-3 border-b border-gray-100 dark:border-gray-800 ${headerClassName}`}
          >
            {header}
          </div>
        )}
        {scrollable ? (
          <ScrollArea
            axis="y"
            className="flex-1 min-h-0"
            maxHeight={maxBodyHeight}
          >
            <div className={noPadding ? "" : `p-4 ${bodyClassName}`}>
              {children}
            </div>
          </ScrollArea>
        ) : (
          <div
            className={`flex-1 min-h-0 ${noPadding ? "" : `p-4 ${bodyClassName}`}`}
            style={
              maxBodyHeight
                ? {
                    maxHeight:
                      typeof maxBodyHeight === "number"
                        ? `${maxBodyHeight}px`
                        : maxBodyHeight,
                    overflowY: "auto",
                  }
                : undefined
            }
          >
            {children}
          </div>
        )}
        {footer && (
          <div
            className={`shrink-0 px-4 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-900/60 ${footerClassName}`}
          >
            {footer}
          </div>
        )}
      </Box>
    );
  },
);
Panel.displayName = "Panel";

export interface PageHeaderProps extends BoxProps {
  sticky?: boolean;
  offsetTop?: number;
  bordered?: boolean;
  blurred?: boolean;
  transparent?: boolean;
  zIndex?: number;
  height?: number | string;
  className?: string;
}

export function PageHeader({
  sticky = false,
  offsetTop = 0,
  bordered = true,
  blurred = false,
  transparent = false,
  zIndex = 40,
  height,
  className = "",
  style = {},
  children,
  ...rest
}: PageHeaderProps) {
  const headerStyle: CSSProperties = {
    ...(sticky && { position: "sticky", top: offsetTop, zIndex }),
    ...(height !== undefined && {
      height: typeof height === "number" ? `${height}px` : height,
    }),
    ...style,
  };

  return (
    <header
      className={`
        w-full flex items-center shrink-0
        ${transparent ? "" : "bg-white dark:bg-gray-900"}
        ${blurred ? "backdrop-blur-md bg-white/80 dark:bg-gray-900/80" : ""}
        ${bordered ? "border-b border-gray-200 dark:border-gray-800" : ""}
        ${className}
      `}
      style={headerStyle}
      {...(rest as React.HTMLAttributes<HTMLElement>)}
    >
      {children}
    </header>
  );
}

export interface PageFooterProps extends BoxProps {
  sticky?: boolean;
  bordered?: boolean;
  className?: string;
}

export function PageFooter({
  sticky = false,
  bordered = true,
  className = "",
  style = {},
  children,
  ...rest
}: PageFooterProps) {
  return (
    <footer
      className={`
        w-full shrink-0 bg-white dark:bg-gray-900
        ${bordered ? "border-t border-gray-200 dark:border-gray-800" : ""}
        ${sticky ? "sticky bottom-0 z-30" : ""}
        ${className}
      `}
      style={style}
      {...(rest as React.HTMLAttributes<HTMLElement>)}
    >
      {children}
    </footer>
  );
}

export interface SidebarProps {
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  bordered?: boolean;
  scrollable?: boolean;
}

function SidebarInner({
  children,
  className = "",
  headerClassName = "",
  bodyClassName = "",
  footerClassName = "",
  header,
  footer,
  bordered = true,
  scrollable = true,
}: SidebarProps) {
  const { state, sidebarRef } = usePageLayoutContext();
  const {
    sidebarCollapsed,
    sidebarWidth,
    sidebarCollapsedWidth,
    sidebarPosition,
  } = state;

  const effectiveWidth = sidebarCollapsed
    ? sidebarCollapsedWidth
    : sidebarWidth;
  const borderClass = bordered
    ? sidebarPosition === "left"
      ? "border-r border-gray-200 dark:border-gray-800"
      : "border-l border-gray-200 dark:border-gray-800"
    : "";

  return (
    <aside
      ref={sidebarRef as React.RefObject<HTMLElement>}
      className={`
        flex flex-col shrink-0 h-full bg-white dark:bg-gray-900
        transition-all duration-200 ease-in-out
        ${borderClass}
        ${className}
      `}
      style={{ width: effectiveWidth }}
    >
      {header && (
        <div
          className={`shrink-0 border-b border-gray-100 dark:border-gray-800 ${headerClassName}`}
        >
          {header}
        </div>
      )}
      {scrollable ? (
        <ScrollArea axis="y" className="flex-1 min-h-0">
          <div className={bodyClassName}>{children}</div>
        </ScrollArea>
      ) : (
        <div className={`flex-1 min-h-0 overflow-hidden ${bodyClassName}`}>
          {children}
        </div>
      )}
      {footer && (
        <div
          className={`shrink-0 border-t border-gray-100 dark:border-gray-800 ${footerClassName}`}
        >
          {footer}
        </div>
      )}
    </aside>
  );
}

export interface PageLayoutProps extends PageLayoutProviderProps {
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  sidebarProps?: Omit<SidebarProps, "children">;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
  sidebarClassName?: string;
  mainClassName?: string;
  footerClassName?: string;
  contentClassName?: string;
  headerSticky?: boolean;
  headerBordered?: boolean;
  headerBlurred?: boolean;
  headerHeight?: number;
  footerSticky?: boolean;
  footerBordered?: boolean;
  mainScrollable?: boolean;
  showSidebarToggle?: boolean;
  sidebarOverlayClassName?: string;
}

export function PageLayout({
  header,
  sidebar,
  sidebarProps,
  footer,
  children,
  className = "",
  headerClassName = "",
  sidebarClassName = "",
  mainClassName = "",
  footerClassName = "",
  contentClassName = "",
  headerSticky = true,
  headerBordered = true,
  headerBlurred = false,
  headerHeight,
  footerSticky = false,
  footerBordered = true,
  mainScrollable = true,
  showSidebarToggle = false,
  sidebarOverlayClassName = "",
  ...providerProps
}: PageLayoutProps) {
  return (
    <PageLayoutProvider {...providerProps}>
      <PageLayoutInner
        header={header}
        sidebar={sidebar}
        sidebarProps={sidebarProps}
        footer={footer}
        className={className}
        headerClassName={headerClassName}
        sidebarClassName={sidebarClassName}
        mainClassName={mainClassName}
        footerClassName={footerClassName}
        contentClassName={contentClassName}
        headerSticky={headerSticky}
        headerBordered={headerBordered}
        headerBlurred={headerBlurred}
        headerHeight={headerHeight}
        footerSticky={footerSticky}
        footerBordered={footerBordered}
        mainScrollable={mainScrollable}
        showSidebarToggle={showSidebarToggle}
        sidebarOverlayClassName={sidebarOverlayClassName}
      >
        {children}
      </PageLayoutInner>
    </PageLayoutProvider>
  );
}

function PageLayoutInner({
  header,
  sidebar,
  sidebarProps,
  footer,
  children,
  className,
  headerClassName,
  sidebarClassName,
  mainClassName,
  footerClassName,
  contentClassName,
  headerSticky,
  headerBordered,
  headerBlurred,
  headerHeight,
  footerSticky,
  footerBordered,
  mainScrollable,
  showSidebarToggle,
  sidebarOverlayClassName,
}: Omit<PageLayoutProps, keyof PageLayoutProviderProps>) {
  const { state, closeSidebar, mainRef } = usePageLayoutContext();
  const { sidebarOpen, sidebarVariant, sidebarPosition, isMobile } = state;

  const isOverlay = sidebarVariant === "overlay" || isMobile;
  const hasSidebar = !!sidebar;

  const overlayMotion = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.18 },
  };

  const sidebarMotion = {
    initial: { x: sidebarPosition === "left" ? "-100%" : "100%" },
    animate: { x: 0 },
    exit: { x: sidebarPosition === "left" ? "-100%" : "100%" },
    transition: { duration: 0.22, ease: "easeOut" },
  };

  return (
    <div
      className={`flex flex-col w-full h-full min-h-0 bg-gray-50 dark:bg-gray-950 ${className}`}
    >
      {header && (
        <PageHeader
          sticky={headerSticky}
          bordered={headerBordered}
          blurred={headerBlurred}
          height={headerHeight}
          className={headerClassName}
        >
          {header}
        </PageHeader>
      )}

      <div className="flex flex-1 min-h-0 overflow-hidden relative">
        {hasSidebar &&
          !isOverlay &&
          sidebarOpen &&
          sidebarPosition === "left" && (
            <SidebarInner
              {...sidebarProps}
              className={`${sidebarClassName} ${sidebarProps?.className ?? ""}`}
            >
              {sidebar}
            </SidebarInner>
          )}

        <AnimatePresence>
          {hasSidebar && isOverlay && sidebarOpen && (
            <>
              <motion.div
                {...overlayMotion}
                className={`absolute inset-0 z-40 bg-black/30 dark:bg-black/50 backdrop-blur-[1px] ${sidebarOverlayClassName}`}
                onClick={closeSidebar}
              />
              <motion.div
                {...sidebarMotion}
                className={`absolute ${sidebarPosition === "left" ? "left-0" : "right-0"} top-0 bottom-0 z-50`}
              >
                <SidebarInner
                  {...sidebarProps}
                  className={`h-full shadow-xl shadow-black/10 dark:shadow-black/40 ${sidebarClassName} ${sidebarProps?.className ?? ""}`}
                >
                  {sidebar}
                </SidebarInner>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <main
          ref={mainRef as React.RefObject<HTMLElement>}
          className={`
            flex-1 min-w-0 flex flex-col
            ${mainScrollable ? "overflow-y-auto" : "overflow-hidden"}
            ${mainClassName}
          `}
        >
          <div className={`flex-1 ${contentClassName}`}>{children}</div>
        </main>

        {hasSidebar &&
          !isOverlay &&
          sidebarOpen &&
          sidebarPosition === "right" && (
            <SidebarInner
              {...sidebarProps}
              className={`${sidebarClassName} ${sidebarProps?.className ?? ""}`}
            >
              {sidebar}
            </SidebarInner>
          )}
      </div>

      {footer && (
        <PageFooter
          sticky={footerSticky}
          bordered={footerBordered}
          className={footerClassName}
        >
          {footer}
        </PageFooter>
      )}
    </div>
  );
}

export interface SidebarToggleProps {
  className?: string;
  iconSize?: number;
  variant?: "ghost" | "bordered";
}

export function SidebarToggle({
  className = "",
  iconSize = 18,
  variant = "ghost",
}: SidebarToggleProps) {
  const { toggleSidebar, toggleCollapseSidebar, state } =
    usePageLayoutContext();
  const { sidebarOpen, sidebarCollapsed, isMobile } = state;

  const handleClick = isMobile ? toggleSidebar : toggleCollapseSidebar;

  const variantClass =
    variant === "bordered"
      ? "border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm"
      : "hover:bg-gray-100 dark:hover:bg-gray-800";

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
      className={`
        flex items-center justify-center w-8 h-8 rounded-lg
        text-gray-500 dark:text-gray-400
        transition-colors duration-100
        ${variantClass}
        ${className}
      `}
    >
      {isMobile ? (
        sidebarOpen ? (
          <X size={iconSize} />
        ) : (
          <Menu size={iconSize} />
        )
      ) : sidebarCollapsed ? (
        <PanelLeftOpen size={iconSize} />
      ) : (
        <PanelLeftClose size={iconSize} />
      )}
    </button>
  );
}

export interface VisuallyHiddenProps {
  children: React.ReactNode;
  focusable?: boolean;
  className?: string;
}

export function VisuallyHidden({
  children,
  focusable = false,
  className = "",
}: VisuallyHiddenProps) {
  return (
    <span
      className={`
        absolute w-px h-px p-0 -m-px overflow-hidden
        whitespace-nowrap border-0 clip-[rect(0,0,0,0)]
        ${focusable ? "focus:relative focus:w-auto focus:h-auto focus:m-0 focus:overflow-visible focus:whitespace-normal" : ""}
        ${className}
      `}
      style={{ clip: "rect(0,0,0,0)" }}
    >
      {children}
    </span>
  );
}

export interface TruncateProps extends BoxProps {
  lines?: number;
}

export const Truncate = forwardRef<HTMLDivElement, TruncateProps>(
  ({ lines, className = "", style = {}, children, ...rest }, ref) => {
    const truncateStyle: CSSProperties =
      lines && lines > 1
        ? {
            display: "-webkit-box",
            WebkitLineClamp: lines,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            ...style,
          }
        : {
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            ...style,
          };

    return (
      <Box ref={ref} className={className} style={truncateStyle} {...rest}>
        {children}
      </Box>
    );
  },
);
Truncate.displayName = "Truncate";

export { PageLayoutProvider, usePageLayoutContext };

export type { PageLayoutProviderProps, SidebarPosition, SidebarVariant };
