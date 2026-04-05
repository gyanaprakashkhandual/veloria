import React, {
  forwardRef,
  useRef,
  useEffect,
  useCallback,
  useState,
  useMemo,
  CSSProperties,
  HTMLAttributes,
  Children,
  isValidElement,
  cloneElement,
  ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GridProvider,
  useGridContext,
  useGridBreakpoint,
  resolveGridSpacing,
  resolveResponsiveGridProp,
  buildGridTemplateColumns,
  GRID_SPACING_MAP,
  GRID_DENSITY_GAP,
  GRID_DENSITY_PADDING,
  GRID_ALIGN_ITEMS_MAP,
  GRID_JUSTIFY_ITEMS_MAP,
  GRID_ALIGN_CONTENT_MAP,
  GRID_JUSTIFY_CONTENT_MAP,
  DEFAULT_GRID_BREAKPOINTS,
  type GridProviderProps,
  type GridBreakpoint,
  type GridColumns,
  type GridAutoFlow,
  type GridAlignItems,
  type GridJustifyItems,
  type GridAlignContent,
  type GridJustifyContent,
  type GridSpacingScale,
  type GridDensity,
  type GridVariant,
  type ResponsiveGridProp,
  type GridResponsiveColumns,
} from "./Grid.context";

type SpacingProp = GridSpacingScale | string;
type ResponsiveSpacing = ResponsiveGridProp<SpacingProp>;

function resolveDimension(v: string | number | undefined): string | undefined {
  if (v === undefined) return undefined;
  if (typeof v === "number") return `${v}px`;
  return v;
}

function resolveSpacingValue(v: ResponsiveSpacing | undefined, bp: GridBreakpoint): string | undefined {
  const resolved = resolveResponsiveGridProp(v, bp);
  return resolveGridSpacing(resolved as number | string | undefined);
}

function resolveColumnsValue(
  v: ResponsiveGridProp<GridColumns> | undefined,
  bp: GridBreakpoint
): GridColumns | undefined {
  return resolveResponsiveGridProp(v, bp);
}

function resolveCurrentBreakpoint(): GridBreakpoint {
  if (typeof window === "undefined") return "lg";
  const w = window.innerWidth;
  if (w >= 1536) return "2xl";
  if (w >= 1280) return "xl";
  if (w >= 1024) return "lg";
  if (w >= 768) return "md";
  if (w >= 640) return "sm";
  return "xs";
}

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  component?: React.ElementType;

  columns?: ResponsiveGridProp<GridColumns>;
  rows?: ResponsiveGridProp<number | string>;
  templateColumns?: string;
  templateRows?: string;
  autoFlow?: GridAutoFlow;
  autoColumns?: string;
  autoRows?: string;
  minChildWidth?: string;

  gap?: ResponsiveSpacing;
  gapX?: ResponsiveSpacing;
  gapY?: ResponsiveSpacing;
  rowGap?: ResponsiveSpacing;
  columnGap?: ResponsiveSpacing;
  spacing?: ResponsiveSpacing;
  spacingX?: ResponsiveSpacing;
  spacingY?: ResponsiveSpacing;

  alignItems?: GridAlignItems;
  justifyItems?: GridJustifyItems;
  alignContent?: GridAlignContent;
  justifyContent?: GridJustifyContent;
  placeItems?: string;
  placeContent?: string;

  width?: string | number;
  height?: string | number;
  minWidth?: string | number;
  minHeight?: string | number;
  maxWidth?: string | number;
  maxHeight?: string | number;
  fullWidth?: boolean;
  fullHeight?: boolean;

  padding?: ResponsiveSpacing;
  paddingX?: ResponsiveSpacing;
  paddingY?: ResponsiveSpacing;
  paddingTop?: ResponsiveSpacing;
  paddingRight?: ResponsiveSpacing;
  paddingBottom?: ResponsiveSpacing;
  paddingLeft?: ResponsiveSpacing;

  margin?: ResponsiveSpacing;
  marginX?: ResponsiveSpacing;
  marginY?: ResponsiveSpacing;
  marginTop?: ResponsiveSpacing;
  marginRight?: ResponsiveSpacing;
  marginBottom?: ResponsiveSpacing;
  marginLeft?: ResponsiveSpacing;

  background?: string;
  backgroundColor?: string;
  bg?: string;
  border?: string;
  borderRadius?: string;
  borderColor?: string;
  boxShadow?: string;
  overflow?: CSSProperties["overflow"];
  overflowX?: CSSProperties["overflowX"];
  overflowY?: CSSProperties["overflowY"];
  position?: CSSProperties["position"];
  zIndex?: number | string;
  opacity?: number;

  display?: "grid" | "inline-grid";
  inline?: boolean;

  dense?: boolean;
  variant?: GridVariant;
  density?: GridDensity;
  responsive?: boolean;
  equalHeight?: boolean;
  equalWidth?: boolean;
  reversed?: boolean;

  hideBelow?: GridBreakpoint;
  hideAbove?: GridBreakpoint;

  sx?: CSSProperties;
  style?: CSSProperties;
  className?: string;
  children?: ReactNode;

  role?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  tabIndex?: number;
  id?: string;
  "data-testid"?: string;
}

function buildGridStyle(props: GridProps, breakpoint: GridBreakpoint): CSSProperties {
  const {
    columns, rows, templateColumns, templateRows,
    autoFlow, autoColumns, autoRows, minChildWidth,
    gap, gapX, gapY, rowGap, columnGap, spacing, spacingX, spacingY,
    alignItems, justifyItems, alignContent, justifyContent, placeItems, placeContent,
    width, height, minWidth, minHeight, maxWidth, maxHeight, fullWidth, fullHeight,
    padding, paddingX, paddingY, paddingTop, paddingRight, paddingBottom, paddingLeft,
    margin, marginX, marginY, marginTop, marginRight, marginBottom, marginLeft,
    background, backgroundColor, bg, border, borderRadius, borderColor, boxShadow,
    overflow, overflowX, overflowY, position, zIndex, opacity,
    inline, dense, variant, density,
    sx, style,
  } = props;

  const resolveS = (v: ResponsiveSpacing | undefined) => resolveSpacingValue(v, breakpoint);
  const resolveC = (v: ResponsiveGridProp<GridColumns> | undefined) => resolveColumnsValue(v, breakpoint);
  const resolveR = <T,>(v: ResponsiveGridProp<T> | undefined) => resolveResponsiveGridProp(v, breakpoint);

  const effectiveColumns = resolveC(columns);
  const effectiveRows = resolveR(rows);

  let gridTemplateColumns: string | undefined;
  if (templateColumns) {
    gridTemplateColumns = templateColumns;
  } else if (minChildWidth) {
    gridTemplateColumns = buildGridTemplateColumns(undefined, minChildWidth, variant);
  } else if (effectiveColumns !== undefined) {
    gridTemplateColumns = buildGridTemplateColumns(effectiveColumns, undefined, variant);
  }

  let gridTemplateRows: string | undefined;
  if (templateRows) {
    gridTemplateRows = templateRows;
  } else if (effectiveRows !== undefined) {
    gridTemplateRows =
      typeof effectiveRows === "number"
        ? `repeat(${effectiveRows}, minmax(0, 1fr))`
        : effectiveRows;
  }

  const effectiveGap = resolveS(gap ?? spacing);
  const effectiveGapX = resolveS(gapX ?? spacingX ?? columnGap);
  const effectiveGapY = resolveS(gapY ?? spacingY ?? rowGap);

  const densityGap = density ? GRID_DENSITY_GAP[density] : undefined;
  const densityPadding = density ? GRID_DENSITY_PADDING[density] : undefined;

  const pVal = resolveS(padding);
  const pxVal = resolveS(paddingX);
  const pyVal = resolveS(paddingY);
  const ptVal = resolveS(paddingTop);
  const prVal = resolveS(paddingRight);
  const pbVal = resolveS(paddingBottom);
  const plVal = resolveS(paddingLeft);

  const mVal = resolveS(margin);
  const mxVal = resolveS(marginX);
  const myVal = resolveS(marginY);
  const mtVal = resolveS(marginTop);
  const mrVal = resolveS(marginRight);
  const mbVal = resolveS(marginBottom);
  const mlVal = resolveS(marginLeft);

  const autoFlowVal = dense
    ? autoFlow
      ? `${autoFlow} dense`
      : "row dense"
    : autoFlow;

  return {
    display: inline ? "inline-grid" : "grid",
    ...(gridTemplateColumns && { gridTemplateColumns }),
    ...(gridTemplateRows && { gridTemplateRows }),
    ...(autoFlowVal && { gridAutoFlow: autoFlowVal }),
    ...(autoColumns && { gridAutoColumns: autoColumns }),
    ...(autoRows && { gridAutoRows: autoRows }),

    ...(effectiveGap && { gap: effectiveGap }),
    ...(!effectiveGap && densityGap && { gap: densityGap }),
    ...(effectiveGapX && { columnGap: effectiveGapX }),
    ...(effectiveGapY && { rowGap: effectiveGapY }),

    ...(alignItems && { alignItems: GRID_ALIGN_ITEMS_MAP[alignItems] }),
    ...(justifyItems && { justifyItems: GRID_JUSTIFY_ITEMS_MAP[justifyItems] }),
    ...(alignContent && { alignContent: GRID_ALIGN_CONTENT_MAP[alignContent] }),
    ...(justifyContent && { justifyContent: GRID_JUSTIFY_CONTENT_MAP[justifyContent] }),
    ...(placeItems && { placeItems }),
    ...(placeContent && { placeContent }),

    width: fullWidth ? "100%" : resolveDimension(width),
    ...(resolveDimension(height) && { height: fullHeight ? "100%" : resolveDimension(height) }),
    ...(resolveDimension(minWidth) && { minWidth: resolveDimension(minWidth) }),
    ...(resolveDimension(minHeight) && { minHeight: resolveDimension(minHeight) }),
    ...(resolveDimension(maxWidth) && { maxWidth: resolveDimension(maxWidth) }),
    ...(resolveDimension(maxHeight) && { maxHeight: resolveDimension(maxHeight) }),

    ...(pVal && { padding: pVal }),
    ...(!pVal && densityPadding && { padding: densityPadding }),
    ...(pxVal && { paddingLeft: pxVal, paddingRight: pxVal }),
    ...(pyVal && { paddingTop: pyVal, paddingBottom: pyVal }),
    ...(ptVal && { paddingTop: ptVal }),
    ...(prVal && { paddingRight: prVal }),
    ...(pbVal && { paddingBottom: pbVal }),
    ...(plVal && { paddingLeft: plVal }),

    ...(mVal && { margin: mVal }),
    ...(mxVal && { marginLeft: mxVal, marginRight: mxVal }),
    ...(myVal && { marginTop: myVal, marginBottom: myVal }),
    ...(mtVal && { marginTop: mtVal }),
    ...(mrVal && { marginRight: mrVal }),
    ...(mbVal && { marginBottom: mbVal }),
    ...(mlVal && { marginLeft: mlVal }),

    ...(bg && { backgroundColor: bg }),
    ...(backgroundColor && { backgroundColor }),
    ...(background && { background }),
    ...(border && { border }),
    ...(borderRadius && { borderRadius }),
    ...(borderColor && { borderColor }),
    ...(boxShadow && { boxShadow }),
    ...(overflow && { overflow }),
    ...(overflowX && { overflowX }),
    ...(overflowY && { overflowY }),
    ...(position && { position }),
    ...(zIndex !== undefined && { zIndex }),
    ...(opacity !== undefined && { opacity }),

    ...sx,
    ...style,
  };
}

function resolveVisibilityClass(
  hideBelow?: GridBreakpoint,
  hideAbove?: GridBreakpoint
): string {
  const classes: string[] = [];
  if (hideBelow) {
    const map: Record<GridBreakpoint, string> = {
      xs: "hidden",
      sm: "hidden sm:grid",
      md: "hidden md:grid",
      lg: "hidden lg:grid",
      xl: "hidden xl:grid",
      "2xl": "hidden 2xl:grid",
    };
    classes.push(map[hideBelow] ?? "");
  }
  if (hideAbove) {
    const map: Record<GridBreakpoint, string> = {
      xs: "xs:hidden",
      sm: "sm:hidden",
      md: "md:hidden",
      lg: "lg:hidden",
      xl: "xl:hidden",
      "2xl": "2xl:hidden",
    };
    classes.push(map[hideAbove] ?? "");
  }
  return classes.join(" ");
}

export const Grid = forwardRef<HTMLDivElement, GridProps>(
  (
    {
      as: Tag = "div",
      component,
      hideBelow,
      hideAbove,
      className = "",
      children,
      reversed,
      equalHeight,
      equalWidth,
      role,
      tabIndex,
      id,
      "data-testid": dataTestId,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "aria-describedby": ariaDescribedBy,
      onClick,
      onMouseEnter,
      onMouseLeave,
      onFocus,
      onBlur,
      ...rest
    },
    ref
  ) => {
    const FinalTag = component ?? Tag;
    const [breakpoint, setBreakpoint] = useState<GridBreakpoint>(resolveCurrentBreakpoint);

    useEffect(() => {
      const update = () => setBreakpoint(resolveCurrentBreakpoint());
      window.addEventListener("resize", update, { passive: true });
      update();
      return () => window.removeEventListener("resize", update);
    }, []);

    const computedStyle = useMemo(
      () => buildGridStyle(rest as GridProps, breakpoint),
      [rest, breakpoint]
    );

    if (equalHeight) {
      computedStyle.alignItems = computedStyle.alignItems ?? "stretch";
    }
    if (equalWidth) {
      computedStyle.justifyItems = computedStyle.justifyItems ?? "stretch";
    }

    const visibilityClass = resolveVisibilityClass(hideBelow, hideAbove);
    const combinedClass = [visibilityClass, className].filter(Boolean).join(" ");

    const resolvedChildren = reversed
      ? Children.toArray(children).reverse()
      : children;

    return (
      <FinalTag
        ref={ref}
        id={id}
        role={role}
        tabIndex={tabIndex}
        className={combinedClass || undefined}
        style={computedStyle}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onFocus={onFocus}
        onBlur={onBlur}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        data-testid={dataTestId}
      >
        {resolvedChildren}
      </FinalTag>
    );
  }
);
Grid.displayName = "Grid";

export interface GridItemProps extends HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  component?: React.ElementType;

  colSpan?: ResponsiveGridProp<number | "full" | "auto">;
  rowSpan?: ResponsiveGridProp<number | "full" | "auto">;
  colStart?: ResponsiveGridProp<number | "auto">;
  colEnd?: ResponsiveGridProp<number | "auto">;
  rowStart?: ResponsiveGridProp<number | "auto">;
  rowEnd?: ResponsiveGridProp<number | "auto">;
  area?: string;

  alignSelf?: GridAlignItems | "auto";
  justifySelf?: GridJustifyItems | "auto";
  placeSelf?: string;
  order?: ResponsiveGridProp<number>;

  width?: string | number;
  height?: string | number;
  minWidth?: string | number;
  minHeight?: string | number;
  maxWidth?: string | number;
  maxHeight?: string | number;
  fullWidth?: boolean;
  fullHeight?: boolean;

  padding?: ResponsiveSpacing;
  paddingX?: ResponsiveSpacing;
  paddingY?: ResponsiveSpacing;
  paddingTop?: ResponsiveSpacing;
  paddingRight?: ResponsiveSpacing;
  paddingBottom?: ResponsiveSpacing;
  paddingLeft?: ResponsiveSpacing;

  margin?: ResponsiveSpacing;
  marginX?: ResponsiveSpacing;
  marginY?: ResponsiveSpacing;
  marginTop?: ResponsiveSpacing;
  marginRight?: ResponsiveSpacing;
  marginBottom?: ResponsiveSpacing;
  marginLeft?: ResponsiveSpacing;

  background?: string;
  backgroundColor?: string;
  bg?: string;
  border?: string;
  borderRadius?: string;
  boxShadow?: string;
  overflow?: CSSProperties["overflow"];
  position?: CSSProperties["position"];
  zIndex?: number | string;
  opacity?: number;
  display?: CSSProperties["display"];
  flex?: string | number;
  flexDirection?: CSSProperties["flexDirection"];
  alignItems?: CSSProperties["alignItems"];
  justifyContent?: CSSProperties["justifyContent"];
  gap?: ResponsiveSpacing;

  hidden?: boolean;
  hideBelow?: GridBreakpoint;
  hideAbove?: GridBreakpoint;

  sx?: CSSProperties;
  style?: CSSProperties;
  className?: string;
  children?: ReactNode;

  role?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  tabIndex?: number;
  id?: string;
  "data-testid"?: string;
}

function buildGridItemStyle(props: GridItemProps, breakpoint: GridBreakpoint): CSSProperties {
  const {
    colSpan, rowSpan, colStart, colEnd, rowStart, rowEnd, area,
    alignSelf, justifySelf, placeSelf, order,
    width, height, minWidth, minHeight, maxWidth, maxHeight, fullWidth, fullHeight,
    padding, paddingX, paddingY, paddingTop, paddingRight, paddingBottom, paddingLeft,
    margin, marginX, marginY, marginTop, marginRight, marginBottom, marginLeft,
    background, backgroundColor, bg, border, borderRadius, boxShadow,
    overflow, position, zIndex, opacity, display, flex, flexDirection, alignItems, justifyContent, gap,
    hidden,
    sx, style,
  } = props;

  const resolveS = (v: ResponsiveSpacing | undefined) => resolveSpacingValue(v, breakpoint);
  const resolveR = <T,>(v: ResponsiveGridProp<T> | undefined) => resolveResponsiveGridProp(v, breakpoint);

  const effectiveColSpan = resolveR(colSpan);
  const effectiveRowSpan = resolveR(rowSpan);
  const effectiveColStart = resolveR(colStart);
  const effectiveColEnd = resolveR(colEnd);
  const effectiveRowStart = resolveR(rowStart);
  const effectiveRowEnd = resolveR(rowEnd);
  const effectiveOrder = resolveR(order);

  const gridColumnVal = effectiveColSpan !== undefined
    ? effectiveColSpan === "full"
      ? "1 / -1"
      : effectiveColSpan === "auto"
        ? "auto"
        : `span ${effectiveColSpan} / span ${effectiveColSpan}`
    : undefined;

  const gridRowVal = effectiveRowSpan !== undefined
    ? effectiveRowSpan === "full"
      ? "1 / -1"
      : effectiveRowSpan === "auto"
        ? "auto"
        : `span ${effectiveRowSpan} / span ${effectiveRowSpan}`
    : undefined;

  const pVal = resolveS(padding);
  const pxVal = resolveS(paddingX);
  const pyVal = resolveS(paddingY);
  const ptVal = resolveS(paddingTop);
  const prVal = resolveS(paddingRight);
  const pbVal = resolveS(paddingBottom);
  const plVal = resolveS(paddingLeft);

  const mVal = resolveS(margin);
  const mxVal = resolveS(marginX);
  const myVal = resolveS(marginY);
  const mtVal = resolveS(marginTop);
  const mrVal = resolveS(marginRight);
  const mbVal = resolveS(marginBottom);
  const mlVal = resolveS(marginLeft);

  const gapVal = resolveS(gap);

  return {
    ...(hidden && { display: "none" }),
    ...(gridColumnVal && { gridColumn: gridColumnVal }),
    ...(gridRowVal && { gridRow: gridRowVal }),
    ...(effectiveColStart !== undefined && { gridColumnStart: effectiveColStart }),
    ...(effectiveColEnd !== undefined && { gridColumnEnd: effectiveColEnd }),
    ...(effectiveRowStart !== undefined && { gridRowStart: effectiveRowStart }),
    ...(effectiveRowEnd !== undefined && { gridRowEnd: effectiveRowEnd }),
    ...(area && { gridArea: area }),
    ...(alignSelf && { alignSelf: alignSelf === "auto" ? "auto" : (GRID_ALIGN_ITEMS_MAP[alignSelf as GridAlignItems] ?? alignSelf) }),
    ...(justifySelf && { justifySelf: justifySelf === "auto" ? "auto" : (GRID_JUSTIFY_ITEMS_MAP[justifySelf as GridJustifyItems] ?? justifySelf) }),
    ...(placeSelf && { placeSelf }),
    ...(effectiveOrder !== undefined && { order: effectiveOrder }),

    width: fullWidth ? "100%" : resolveDimension(width),
    ...(resolveDimension(height) && { height: fullHeight ? "100%" : resolveDimension(height) }),
    ...(resolveDimension(minWidth) && { minWidth: resolveDimension(minWidth) }),
    ...(resolveDimension(minHeight) && { minHeight: resolveDimension(minHeight) }),
    ...(resolveDimension(maxWidth) && { maxWidth: resolveDimension(maxWidth) }),
    ...(resolveDimension(maxHeight) && { maxHeight: resolveDimension(maxHeight) }),

    ...(pVal && { padding: pVal }),
    ...(pxVal && { paddingLeft: pxVal, paddingRight: pxVal }),
    ...(pyVal && { paddingTop: pyVal, paddingBottom: pyVal }),
    ...(ptVal && { paddingTop: ptVal }),
    ...(prVal && { paddingRight: prVal }),
    ...(pbVal && { paddingBottom: pbVal }),
    ...(plVal && { paddingLeft: plVal }),

    ...(mVal && { margin: mVal }),
    ...(mxVal && { marginLeft: mxVal, marginRight: mxVal }),
    ...(myVal && { marginTop: myVal, marginBottom: myVal }),
    ...(mtVal && { marginTop: mtVal }),
    ...(mrVal && { marginRight: mrVal }),
    ...(mbVal && { marginBottom: mbVal }),
    ...(mlVal && { marginLeft: mlVal }),

    ...(bg && { backgroundColor: bg }),
    ...(backgroundColor && { backgroundColor }),
    ...(background && { background }),
    ...(border && { border }),
    ...(borderRadius && { borderRadius }),
    ...(boxShadow && { boxShadow }),
    ...(overflow && { overflow }),
    ...(position && { position }),
    ...(zIndex !== undefined && { zIndex }),
    ...(opacity !== undefined && { opacity }),
    ...(display && { display }),
    ...(flex !== undefined && { flex }),
    ...(flexDirection && { flexDirection }),
    ...(alignItems && { alignItems }),
    ...(justifyContent && { justifyContent }),
    ...(gapVal && { gap: gapVal }),

    ...sx,
    ...style,
  };
}

export const GridItem = forwardRef<HTMLDivElement, GridItemProps>(
  (
    {
      as: Tag = "div",
      component,
      hideBelow,
      hideAbove,
      className = "",
      children,
      role,
      tabIndex,
      id,
      "data-testid": dataTestId,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      onClick,
      onMouseEnter,
      onMouseLeave,
      onFocus,
      onBlur,
      ...rest
    },
    ref
  ) => {
    const FinalTag = component ?? Tag;
    const [breakpoint, setBreakpoint] = useState<GridBreakpoint>(resolveCurrentBreakpoint);

    useEffect(() => {
      const update = () => setBreakpoint(resolveCurrentBreakpoint());
      window.addEventListener("resize", update, { passive: true });
      update();
      return () => window.removeEventListener("resize", update);
    }, []);

    const computedStyle = useMemo(
      () => buildGridItemStyle(rest as GridItemProps, breakpoint),
      [rest, breakpoint]
    );

    const visibilityClass = resolveVisibilityClass(hideBelow, hideAbove);
    const combinedClass = [visibilityClass, className].filter(Boolean).join(" ");

    return (
      <FinalTag
        ref={ref}
        id={id}
        role={role}
        tabIndex={tabIndex}
        className={combinedClass || undefined}
        style={computedStyle}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onFocus={onFocus}
        onBlur={onBlur}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        data-testid={dataTestId}
      >
        {children}
      </FinalTag>
    );
  }
);
GridItem.displayName = "GridItem";

export interface SimpleGridProps extends Omit<GridProps, "columns"> {
  columns?: ResponsiveGridProp<GridColumns>;
  minChildWidth?: string;
}

export const SimpleGrid = forwardRef<HTMLDivElement, SimpleGridProps>(
  ({ columns, minChildWidth, gap = 4, children, ...rest }, ref) => {
    return (
      <Grid
        ref={ref}
        columns={columns}
        minChildWidth={minChildWidth}
        gap={gap}
        {...rest}
      >
        {children}
      </Grid>
    );
  }
);
SimpleGrid.displayName = "SimpleGrid";

export interface ResponsiveGridProps extends Omit<GridProps, "columns"> {
  xs?: GridColumns;
  sm?: GridColumns;
  md?: GridColumns;
  lg?: GridColumns;
  xl?: GridColumns;
  "2xl"?: GridColumns;
}

export const ResponsiveGrid = forwardRef<HTMLDivElement, ResponsiveGridProps>(
  (
    {
      xs = 1,
      sm,
      md,
      lg,
      xl,
      "2xl": xxl,
      gap = 4,
      children,
      ...rest
    },
    ref
  ) => {
    const columns: ResponsiveGridProp<GridColumns> = {
      xs,
      ...(sm !== undefined && { sm }),
      ...(md !== undefined && { md }),
      ...(lg !== undefined && { lg }),
      ...(xl !== undefined && { xl }),
      ...(xxl !== undefined && { "2xl": xxl }),
    };

    return (
      <Grid ref={ref} columns={columns} gap={gap} {...rest}>
        {children}
      </Grid>
    );
  }
);
ResponsiveGrid.displayName = "ResponsiveGrid";

export interface MasonryGridProps extends Omit<GridProps, "variant" | "columns"> {
  columns?: ResponsiveGridProp<GridColumns>;
  itemSelector?: string;
}

export const MasonryGrid = forwardRef<HTMLDivElement, MasonryGridProps>(
  ({ columns = { xs: 1, sm: 2, md: 3, lg: 4 }, gap = 4, style = {}, children, ...rest }, ref) => {
    const [breakpoint, setBreakpoint] = useState<GridBreakpoint>(resolveCurrentBreakpoint);

    useEffect(() => {
      const update = () => setBreakpoint(resolveCurrentBreakpoint());
      window.addEventListener("resize", update, { passive: true });
      update();
      return () => window.removeEventListener("resize", update);
    }, []);

    const effectiveCols = resolveResponsiveGridProp(columns, breakpoint) ?? 3;
    const gapVal = resolveGridSpacing(gap as number | string) ?? "16px";

    return (
      <div
        ref={ref}
        style={{
          columnCount: effectiveCols as number,
          columnGap: gapVal,
          ...style,
        }}
        {...(rest as HTMLAttributes<HTMLDivElement>)}
      >
        {Children.map(children, (child, i) => (
          <div
            key={i}
            style={{
              breakInside: "avoid",
              marginBottom: gapVal,
              display: "block",
            }}
          >
            {child}
          </div>
        ))}
      </div>
    );
  }
);
MasonryGrid.displayName = "MasonryGrid";

export interface AutoGridProps extends Omit<GridProps, "columns" | "minChildWidth"> {
  minItemWidth?: string;
  maxColumns?: number;
  fillMode?: "fill" | "fit";
}

export const AutoGrid = forwardRef<HTMLDivElement, AutoGridProps>(
  (
    {
      minItemWidth = "240px",
      maxColumns,
      fillMode = "fit",
      gap = 4,
      style = {},
      children,
      ...rest
    },
    ref
  ) => {
    const template =
      fillMode === "fill"
        ? `repeat(auto-fill, minmax(${minItemWidth}, 1fr))`
        : `repeat(auto-fit, minmax(${minItemWidth}, 1fr))`;

    const limitedTemplate = maxColumns
      ? `repeat(${maxColumns}, minmax(${minItemWidth}, 1fr))`
      : template;

    return (
      <Grid
        ref={ref}
        templateColumns={template}
        gap={gap}
        style={style}
        {...rest}
      >
        {children}
      </Grid>
    );
  }
);
AutoGrid.displayName = "AutoGrid";

export interface DashboardGridProps extends Omit<GridProps, "columns"> {
  areas?: string;
  areasMobile?: string;
  areasTablet?: string;
}

export const DashboardGrid = forwardRef<HTMLDivElement, DashboardGridProps>(
  (
    {
      areas,
      areasMobile,
      areasTablet,
      gap = 4,
      style = {},
      children,
      ...rest
    },
    ref
  ) => {
    const [breakpoint, setBreakpoint] = useState<GridBreakpoint>(resolveCurrentBreakpoint);

    useEffect(() => {
      const update = () => setBreakpoint(resolveCurrentBreakpoint());
      window.addEventListener("resize", update, { passive: true });
      update();
      return () => window.removeEventListener("resize", update);
    }, []);

    const isMobile = breakpoint === "xs" || breakpoint === "sm";
    const isTablet = breakpoint === "md";

    const effectiveAreas = isMobile && areasMobile
      ? areasMobile
      : isTablet && areasTablet
        ? areasTablet
        : areas;

    const gridStyle: CSSProperties = {
      ...(effectiveAreas && { gridTemplateAreas: effectiveAreas }),
      ...style,
    };

    return (
      <Grid ref={ref} gap={gap} style={gridStyle} {...rest}>
        {children}
      </Grid>
    );
  }
);
DashboardGrid.displayName = "DashboardGrid";

export interface AnimatedGridProps extends GridProps {
  animate?: boolean;
  stagger?: number;
  staggerDirection?: "forward" | "reverse";
  animationVariant?: "fade" | "slide-up" | "slide-down" | "scale" | "blur";
  duration?: number;
  delay?: number;
}

const GRID_ANIMATION_VARIANTS = {
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  "slide-up": {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
  "slide-down": {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1 },
  },
  blur: {
    hidden: { opacity: 0, filter: "blur(8px)" },
    visible: { opacity: 1, filter: "blur(0px)" },
  },
};

export const AnimatedGrid = forwardRef<HTMLDivElement, AnimatedGridProps>(
  (
    {
      animate: shouldAnimate = true,
      stagger = 0.06,
      staggerDirection = "forward",
      animationVariant = "fade",
      duration = 0.28,
      delay = 0,
      children,
      style = {},
      className = "",
      ...rest
    },
    ref
  ) => {
    const [breakpoint, setBreakpoint] = useState<GridBreakpoint>(resolveCurrentBreakpoint);

    useEffect(() => {
      const update = () => setBreakpoint(resolveCurrentBreakpoint());
      window.addEventListener("resize", update, { passive: true });
      update();
      return () => window.removeEventListener("resize", update);
    }, []);

    const computedStyle = useMemo(
      () => buildGridStyle(rest as GridProps, breakpoint),
      [rest, breakpoint]
    );

    const childArray = Children.toArray(children);
    const orderedChildren =
      staggerDirection === "reverse" ? [...childArray].reverse() : childArray;

    const itemVariant = GRID_ANIMATION_VARIANTS[animationVariant];

    if (!shouldAnimate) {
      return (
        <Grid ref={ref} className={className} style={{ ...computedStyle, ...style }} {...rest}>
          {children}
        </Grid>
      );
    }

    return (
      <motion.div
        ref={ref as React.RefObject<HTMLDivElement>}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: stagger,
              delayChildren: delay,
            },
          },
        }}
        className={className}
        style={{ ...computedStyle, ...style }}
      >
        {orderedChildren.map((child, i) => (
          <motion.div
            key={i}
            variants={{
              hidden: itemVariant.hidden,
              visible: {
                ...itemVariant.visible,
                transition: { duration, ease: "easeOut" },
              },
            }}
          >
            {child}
          </motion.div>
        ))}
      </motion.div>
    );
  }
);
AnimatedGrid.displayName = "AnimatedGrid";

export interface InfiniteGridProps extends GridProps {
  onLoadMore?: () => void;
  hasMore?: boolean;
  loadingIndicator?: ReactNode;
  threshold?: number;
}

export const InfiniteGrid = forwardRef<HTMLDivElement, InfiniteGridProps>(
  (
    {
      onLoadMore,
      hasMore = false,
      loadingIndicator,
      threshold = 200,
      children,
      ...rest
    },
    ref
  ) => {
    const sentinelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!hasMore || !onLoadMore || !sentinelRef.current) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) onLoadMore();
        },
        { rootMargin: `${threshold}px` }
      );
      observer.observe(sentinelRef.current);
      return () => observer.disconnect();
    }, [hasMore, onLoadMore, threshold]);

    return (
      <div>
        <Grid ref={ref} {...rest}>
          {children}
        </Grid>
        {hasMore && (
          <div ref={sentinelRef} style={{ height: "1px", width: "100%" }}>
            {loadingIndicator}
          </div>
        )}
      </div>
    );
  }
);
InfiniteGrid.displayName = "InfiniteGrid";

export interface GridAreaProps extends HTMLAttributes<HTMLDivElement> {
  area: string;
  as?: React.ElementType;
  style?: CSSProperties;
  className?: string;
  children?: ReactNode;
}

export const GridArea = forwardRef<HTMLDivElement, GridAreaProps>(
  ({ area, as: Tag = "div", style = {}, className = "", children, ...rest }, ref) => {
    return (
      <Tag
        ref={ref}
        className={className || undefined}
        style={{ gridArea: area, ...style }}
        {...rest}
      >
        {children}
      </Tag>
    );
  }
);
GridArea.displayName = "GridArea";

export interface GridContainerProps extends GridProps {
  container?: boolean;
  maxWidth?: string | number;
  centered?: boolean;
}

export const GridContainer = forwardRef<HTMLDivElement, GridContainerProps>(
  (
    {
      container = true,
      maxWidth = "1280px",
      centered = true,
      style = {},
      children,
      ...rest
    },
    ref
  ) => {
    const containerStyle: CSSProperties = container
      ? {
          width: "100%",
          maxWidth: resolveDimension(maxWidth),
          ...(centered && { marginLeft: "auto", marginRight: "auto" }),
        }
      : {};

    return (
      <Grid
        ref={ref}
        style={{ ...containerStyle, ...style }}
        {...rest}
      >
        {children}
      </Grid>
    );
  }
);
GridContainer.displayName = "GridContainer";

export interface SplitGridProps extends Omit<GridProps, "columns"> {
  ratio?: [number, number];
  reverseOnMobile?: boolean;
  mobileBreakpoint?: GridBreakpoint;
}

export const SplitGrid = forwardRef<HTMLDivElement, SplitGridProps>(
  (
    {
      ratio = [1, 1],
      reverseOnMobile = false,
      mobileBreakpoint = "md",
      gap = 6,
      style = {},
      children,
      ...rest
    },
    ref
  ) => {
    const [breakpoint, setBreakpoint] = useState<GridBreakpoint>(resolveCurrentBreakpoint);

    useEffect(() => {
      const update = () => setBreakpoint(resolveCurrentBreakpoint());
      window.addEventListener("resize", update, { passive: true });
      update();
      return () => window.removeEventListener("resize", update);
    }, []);

    const bpWidths: Record<GridBreakpoint, number> = DEFAULT_GRID_BREAKPOINTS;
    const isBelowBreakpoint = bpWidths[breakpoint] < bpWidths[mobileBreakpoint];

    const totalParts = ratio[0] + ratio[1];
    const template = isBelowBreakpoint
      ? "1fr"
      : `${ratio[0]}fr ${ratio[1]}fr`;

    const gapVal = resolveGridSpacing(gap as number | string) ?? "24px";
    const childArray = Children.toArray(children);
    const orderedChildren = reverseOnMobile && isBelowBreakpoint
      ? [...childArray].reverse()
      : childArray;

    return (
      <div
        ref={ref}
        style={{
          display: "grid",
          gridTemplateColumns: template,
          gap: gapVal,
          ...style,
        }}
        {...(rest as HTMLAttributes<HTMLDivElement>)}
      >
        {orderedChildren}
      </div>
    );
  }
);
SplitGrid.displayName = "SplitGrid";

export interface GridDividerProps {
  orientation?: "horizontal" | "vertical";
  thickness?: number;
  dashed?: boolean;
  color?: string;
  className?: string;
  style?: CSSProperties;
  colSpan?: number | "full";
  rowSpan?: number | "full";
}

export const GridDivider = forwardRef<HTMLDivElement, GridDividerProps>(
  (
    {
      orientation = "horizontal",
      thickness = 1,
      dashed = false,
      color,
      colSpan = "full",
      rowSpan,
      className = "",
      style = {},
    },
    ref
  ) => {
    const gridItemStyle: CSSProperties = {
      ...(colSpan !== undefined && {
        gridColumn: colSpan === "full" ? "1 / -1" : `span ${colSpan} / span ${colSpan}`,
      }),
      ...(rowSpan !== undefined && {
        gridRow: rowSpan === "full" ? "1 / -1" : `span ${rowSpan} / span ${rowSpan}`,
      }),
    };

    const borderStyle: CSSProperties =
      orientation === "horizontal"
        ? {
            borderTopWidth: thickness,
            borderTopStyle: dashed ? "dashed" : "solid",
            borderTopColor: color ?? "rgb(229 231 235)",
            width: "100%",
          }
        : {
            borderLeftWidth: thickness,
            borderLeftStyle: dashed ? "dashed" : "solid",
            borderLeftColor: color ?? "rgb(229 231 235)",
            height: "100%",
            alignSelf: "stretch",
          };

    return (
      <div
        ref={ref}
        role="separator"
        className={className}
        style={{ ...gridItemStyle, ...borderStyle, ...style }}
      />
    );
  }
);
GridDivider.displayName = "GridDivider";

export interface GridSpacerProps {
  colSpan?: number | "full";
  rowSpan?: number | "full";
  style?: CSSProperties;
  className?: string;
}

export const GridSpacer = forwardRef<HTMLDivElement, GridSpacerProps>(
  ({ colSpan, rowSpan, style = {}, className = "" }, ref) => {
    const spacerStyle: CSSProperties = {
      ...(colSpan !== undefined && {
        gridColumn: colSpan === "full" ? "1 / -1" : `span ${colSpan} / span ${colSpan}`,
      }),
      ...(rowSpan !== undefined && {
        gridRow: rowSpan === "full" ? "1 / -1" : `span ${rowSpan} / span ${rowSpan}`,
      }),
      ...style,
    };

    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={className || undefined}
        style={spacerStyle}
      />
    );
  }
);
GridSpacer.displayName = "GridSpacer";

export interface GridOverlayProps extends GridProps {
  blurred?: boolean;
  blurAmount?: number;
  dimAmount?: number;
}

export const GridOverlay = forwardRef<HTMLDivElement, GridOverlayProps>(
  (
    {
      blurred = false,
      blurAmount = 4,
      dimAmount = 0.4,
      style = {},
      children,
      ...rest
    },
    ref
  ) => {
    const overlayStyle: CSSProperties = {
      position: "fixed",
      inset: 0,
      backgroundColor: `rgba(0,0,0,${dimAmount})`,
      ...(blurred && {
        backdropFilter: `blur(${blurAmount}px)`,
        WebkitBackdropFilter: `blur(${blurAmount}px)`,
      }),
    };

    return (
      <Grid ref={ref} style={{ ...overlayStyle, ...style }} {...rest}>
        {children}
      </Grid>
    );
  }
);
GridOverlay.displayName = "GridOverlay";

export interface GridScrollAreaProps extends GridProps {
  scrollAxis?: "x" | "y" | "both";
  showScrollbar?: "always" | "hover" | "never";
  scrollbarSize?: "thin" | "default" | "none";
  onScrollEnd?: () => void;
}

export const GridScrollArea = forwardRef<HTMLDivElement, GridScrollAreaProps>(
  (
    {
      scrollAxis = "y",
      showScrollbar = "hover",
      scrollbarSize = "thin",
      onScrollEnd,
      onScroll,
      style = {},
      className = "",
      children,
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
        onScroll?.(e as any);
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
      <Grid
        ref={ref}
        className={`${scrollbarClass} ${className}`}
        style={{ ...overflowStyle, ...style }}
        onScroll={handleScroll as any}
        {...rest}
      >
        {children}
      </Grid>
    );
  }
);
GridScrollArea.displayName = "GridScrollArea";

export {
  GridProvider,
  useGridContext,
  useGridBreakpoint,
  GRID_SPACING_MAP,
  GRID_DENSITY_GAP,
  GRID_DENSITY_PADDING,
  GRID_ALIGN_ITEMS_MAP,
  GRID_JUSTIFY_ITEMS_MAP,
  GRID_ALIGN_CONTENT_MAP,
  GRID_JUSTIFY_CONTENT_MAP,
};

export type {
  GridProviderProps,
  GridBreakpoint,
  GridColumns,
  GridAutoFlow,
  GridAlignItems,
  GridJustifyItems,
  GridAlignContent,
  GridJustifyContent,
  GridSpacingScale,
  GridDensity,
  GridVariant,
  ResponsiveGridProp,
  GridResponsiveColumns,
};