import React, {
  forwardRef,
  useRef,
  useEffect,
  useCallback,
  useState,
  useMemo,
  CSSProperties,
  HTMLAttributes,
  MouseEvent,
  FocusEvent,
  KeyboardEvent,
  PointerEvent,
  TouchEvent,
  DragEvent,
  AnimationEvent,
  TransitionEvent,
  WheelEvent,
  UIEvent,
  ClipboardEvent,
} from "react";
import { motion, AnimatePresence, type HTMLMotionProps } from "framer-motion";
import {
  BoxProvider,
  useBoxContext,
  resolveSpacing,
  resolveResponsiveValue,
  BOX_SHADOW_MAP,
  BOX_RADIUS_MAP,
  BOX_TRANSITION_MAP,
  DEFAULT_BOX_BREAKPOINTS,
  type BoxProviderProps,
  type BoxBreakpoint,
  type BoxShadow,
  type BoxRadius,
  type BoxBorderStyle,
  type BoxCursor,
  type BoxOverflow,
  type BoxDisplay,
  type BoxPosition,
  type BoxFlexDirection,
  type BoxAlignItems,
  type BoxJustifyContent,
  type BoxFlexWrap,
  type BoxGridFlow,
  type BoxTransitionPreset,
  type BoxVisibility,
  type BoxPointerEvents,
  type BoxUserSelect,
  type BoxMixBlendMode,
  type BoxTextAlign,
  type BoxVerticalAlign,
  type BoxSpacingScale,
} from "./Box.context";

type ResponsiveProp<T> = T | Partial<Record<BoxBreakpoint, T>>;
type SpacingProp = BoxSpacingScale | string;
type ResponsiveSpacing = ResponsiveProp<SpacingProp>;

export interface BoxProps extends HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  component?: React.ElementType;

  display?: ResponsiveProp<BoxDisplay>;
  position?: ResponsiveProp<BoxPosition>;
  visibility?: BoxVisibility;
  overflow?: BoxOverflow;
  overflowX?: BoxOverflow;
  overflowY?: BoxOverflow;

  width?: string | number;
  height?: string | number;
  minWidth?: string | number;
  minHeight?: string | number;
  maxWidth?: string | number;
  maxHeight?: string | number;
  w?: string | number;
  h?: string | number;
  minW?: string | number;
  minH?: string | number;
  maxW?: string | number;
  maxH?: string | number;
  fullWidth?: boolean;
  fullHeight?: boolean;
  fullScreen?: boolean;
  fitContent?: boolean;
  fillAvailable?: boolean;

  p?: ResponsiveSpacing;
  px?: ResponsiveSpacing;
  py?: ResponsiveSpacing;
  pt?: ResponsiveSpacing;
  pr?: ResponsiveSpacing;
  pb?: ResponsiveSpacing;
  pl?: ResponsiveSpacing;
  padding?: ResponsiveSpacing;
  paddingX?: ResponsiveSpacing;
  paddingY?: ResponsiveSpacing;
  paddingTop?: ResponsiveSpacing;
  paddingRight?: ResponsiveSpacing;
  paddingBottom?: ResponsiveSpacing;
  paddingLeft?: ResponsiveSpacing;

  m?: ResponsiveSpacing;
  mx?: ResponsiveSpacing;
  my?: ResponsiveSpacing;
  mt?: ResponsiveSpacing;
  mr?: ResponsiveSpacing;
  mb?: ResponsiveSpacing;
  ml?: ResponsiveSpacing;
  margin?: ResponsiveSpacing;
  marginX?: ResponsiveSpacing;
  marginY?: ResponsiveSpacing;
  marginTop?: ResponsiveSpacing;
  marginRight?: ResponsiveSpacing;
  marginBottom?: ResponsiveSpacing;
  marginLeft?: ResponsiveSpacing;

  top?: string | number;
  right?: string | number;
  bottom?: string | number;
  left?: string | number;
  inset?: string | number;
  insetX?: string | number;
  insetY?: string | number;
  zIndex?: number | string;

  flex?: string | number;
  flexGrow?: number;
  flexShrink?: number;
  flexBasis?: string | number;
  flexDirection?: BoxFlexDirection;
  flexWrap?: BoxFlexWrap;
  alignItems?: BoxAlignItems;
  alignSelf?: BoxAlignItems | "auto";
  justifyContent?: BoxJustifyContent;
  justifySelf?: BoxJustifyContent | "auto";
  gap?: ResponsiveSpacing;
  gapX?: ResponsiveSpacing;
  gapY?: ResponsiveSpacing;
  order?: number;
  placeItems?: string;
  placeContent?: string;
  placeSelf?: string;

  gridColumn?: string;
  gridRow?: string;
  gridColumnStart?: number | string;
  gridColumnEnd?: number | string;
  gridRowStart?: number | string;
  gridRowEnd?: number | string;
  gridTemplateColumns?: string;
  gridTemplateRows?: string;
  gridAutoFlow?: BoxGridFlow;
  gridAutoColumns?: string;
  gridAutoRows?: string;
  colSpan?: number | "full";
  rowSpan?: number | "full";

  bg?: string;
  background?: string;
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  backgroundRepeat?: string;
  bgGradient?: string;
  color?: string;
  opacity?: number;

  shadow?: BoxShadow;
  boxShadow?: string;
  textShadow?: string;
  filter?: string;
  backdropFilter?: string;
  mixBlendMode?: BoxMixBlendMode;
  isolation?: "auto" | "isolate";
  willChange?: string;

  radius?: BoxRadius;
  borderRadius?: string;
  borderTopLeftRadius?: string;
  borderTopRightRadius?: string;
  borderBottomLeftRadius?: string;
  borderBottomRightRadius?: string;
  rounded?: boolean;
  square?: boolean;
  circle?: boolean;
  pill?: boolean;

  border?: string;
  borderWidth?: string | number;
  borderStyle?: BoxBorderStyle;
  borderColor?: string;
  borderTop?: string;
  borderRight?: string;
  borderBottom?: string;
  borderLeft?: string;
  borderTopWidth?: string | number;
  borderRightWidth?: string | number;
  borderBottomWidth?: string | number;
  borderLeftWidth?: string | number;
  outline?: string;
  outlineOffset?: string | number;

  cursor?: BoxCursor;
  userSelect?: BoxUserSelect;
  pointerEvents?: BoxPointerEvents;
  resize?: CSSProperties["resize"];
  appearance?: CSSProperties["appearance"];

  transition?: string;
  transitionPreset?: BoxTransitionPreset;
  transitionDuration?: string | number;
  transitionTimingFunction?: string;
  transitionDelay?: string | number;
  transform?: string;
  transformOrigin?: string;
  scale?: number | string;
  rotate?: number | string;
  translateX?: string | number;
  translateY?: string | number;
  skewX?: string | number;
  skewY?: string | number;

  textAlign?: BoxTextAlign;
  verticalAlign?: BoxVerticalAlign;
  whiteSpace?: CSSProperties["whiteSpace"];
  textOverflow?: CSSProperties["textOverflow"];
  wordBreak?: CSSProperties["wordBreak"];
  lineClamp?: number;
  truncate?: boolean;
  listStyle?: CSSProperties["listStyle"];
  listStyleType?: CSSProperties["listStyleType"];

  aspectRatio?: number | string;
  objectFit?: CSSProperties["objectFit"];
  objectPosition?: string;

  print?: CSSProperties;
  srOnly?: boolean;
  notSrOnly?: boolean;

  elevation?: 0 | 1 | 2 | 3 | 4 | 5;
  glass?: boolean;
  glassDark?: boolean;
  frosted?: boolean;
  outlined?: boolean;
  subtle?: boolean;
  inset?: string | number;

  responsive?: boolean;
  hideBelow?: BoxBreakpoint;
  hideAbove?: BoxBreakpoint;
  showOnly?: BoxBreakpoint[];

  trackViewport?: boolean;
  trackScroll?: boolean;
  trackDimensions?: boolean;
  trackHover?: boolean;
  trackFocus?: boolean;

  onHoverChange?: (hovered: boolean) => void;
  onFocusChange?: (focused: boolean) => void;
  onInViewChange?: (inView: boolean) => void;

  sx?: CSSProperties;
  css?: CSSProperties;
  style?: CSSProperties;
  className?: string;
  children?: React.ReactNode;

  tabIndex?: number;
  role?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  "aria-hidden"?: boolean | "true" | "false";
  "aria-live"?: "off" | "assertive" | "polite";
  "aria-atomic"?: boolean;
  "aria-expanded"?: boolean;
  "aria-controls"?: string;
  "aria-selected"?: boolean;
  "aria-checked"?: boolean | "mixed";
  "aria-pressed"?: boolean | "mixed";
  "aria-disabled"?: boolean;
  "aria-required"?: boolean;
  "aria-invalid"?: boolean | "grammar" | "spelling";
  "aria-multiline"?: boolean;
  "aria-multiselectable"?: boolean;
  "aria-readonly"?: boolean;
  "aria-busy"?: boolean;
  "aria-current"?: boolean | "page" | "step" | "location" | "date" | "time";
  "aria-haspopup"?:
    | boolean
    | "false"
    | "true"
    | "menu"
    | "listbox"
    | "tree"
    | "grid"
    | "dialog";
  "aria-orientation"?: "horizontal" | "vertical";
  "aria-posinset"?: number;
  "aria-setsize"?: number;
  "aria-level"?: number;
  "aria-valuemax"?: number;
  "aria-valuemin"?: number;
  "aria-valuenow"?: number;
  "aria-valuetext"?: string;
  "data-testid"?: string;
  id?: string;
  lang?: string;
  dir?: "ltr" | "rtl" | "auto";
  hidden?: boolean;
  draggable?: boolean | "true" | "false";
  contentEditable?: boolean | "true" | "false" | "inherit";
  spellCheck?: boolean;
  autoCorrect?: string;
  autoCapitalize?: string;

  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
  onDoubleClick?: (e: MouseEvent<HTMLDivElement>) => void;
  onMouseDown?: (e: MouseEvent<HTMLDivElement>) => void;
  onMouseUp?: (e: MouseEvent<HTMLDivElement>) => void;
  onMouseEnter?: (e: MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (e: MouseEvent<HTMLDivElement>) => void;
  onMouseMove?: (e: MouseEvent<HTMLDivElement>) => void;
  onMouseOver?: (e: MouseEvent<HTMLDivElement>) => void;
  onMouseOut?: (e: MouseEvent<HTMLDivElement>) => void;
  onContextMenu?: (e: MouseEvent<HTMLDivElement>) => void;
  onFocus?: (e: FocusEvent<HTMLDivElement>) => void;
  onBlur?: (e: FocusEvent<HTMLDivElement>) => void;
  onFocusIn?: (e: FocusEvent<HTMLDivElement>) => void;
  onFocusOut?: (e: FocusEvent<HTMLDivElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLDivElement>) => void;
  onKeyUp?: (e: KeyboardEvent<HTMLDivElement>) => void;
  onKeyPress?: (e: KeyboardEvent<HTMLDivElement>) => void;
  onPointerDown?: (e: PointerEvent<HTMLDivElement>) => void;
  onPointerUp?: (e: PointerEvent<HTMLDivElement>) => void;
  onPointerMove?: (e: PointerEvent<HTMLDivElement>) => void;
  onPointerEnter?: (e: PointerEvent<HTMLDivElement>) => void;
  onPointerLeave?: (e: PointerEvent<HTMLDivElement>) => void;
  onPointerCancel?: (e: PointerEvent<HTMLDivElement>) => void;
  onPointerOver?: (e: PointerEvent<HTMLDivElement>) => void;
  onPointerOut?: (e: PointerEvent<HTMLDivElement>) => void;
  onTouchStart?: (e: TouchEvent<HTMLDivElement>) => void;
  onTouchEnd?: (e: TouchEvent<HTMLDivElement>) => void;
  onTouchMove?: (e: TouchEvent<HTMLDivElement>) => void;
  onTouchCancel?: (e: TouchEvent<HTMLDivElement>) => void;
  onScroll?: (e: UIEvent<HTMLDivElement>) => void;
  onWheel?: (e: WheelEvent<HTMLDivElement>) => void;
  onDrag?: (e: DragEvent<HTMLDivElement>) => void;
  onDragStart?: (e: DragEvent<HTMLDivElement>) => void;
  onDragEnd?: (e: DragEvent<HTMLDivElement>) => void;
  onDragOver?: (e: DragEvent<HTMLDivElement>) => void;
  onDragEnter?: (e: DragEvent<HTMLDivElement>) => void;
  onDragLeave?: (e: DragEvent<HTMLDivElement>) => void;
  onDrop?: (e: DragEvent<HTMLDivElement>) => void;
  onAnimationStart?: (e: AnimationEvent<HTMLDivElement>) => void;
  onAnimationEnd?: (e: AnimationEvent<HTMLDivElement>) => void;
  onAnimationIteration?: (e: AnimationEvent<HTMLDivElement>) => void;
  onTransitionEnd?: (e: TransitionEvent<HTMLDivElement>) => void;
  onCopy?: (e: ClipboardEvent<HTMLDivElement>) => void;
  onCut?: (e: ClipboardEvent<HTMLDivElement>) => void;
  onPaste?: (e: ClipboardEvent<HTMLDivElement>) => void;
  onInput?: (e: UIEvent<HTMLDivElement>) => void;
  onSelect?: (e: UIEvent<HTMLDivElement>) => void;
}

const ELEVATION_SHADOWS: Record<number, string> = {
  0: "none",
  1: BOX_SHADOW_MAP.xs,
  2: BOX_SHADOW_MAP.sm,
  3: BOX_SHADOW_MAP.md,
  4: BOX_SHADOW_MAP.lg,
  5: BOX_SHADOW_MAP.xl,
};

const ALIGN_ITEMS_MAP: Record<string, string> = {
  start: "flex-start",
  end: "flex-end",
  center: "center",
  stretch: "stretch",
  baseline: "baseline",
  "flex-start": "flex-start",
  "flex-end": "flex-end",
};

const JUSTIFY_CONTENT_MAP: Record<string, string> = {
  start: "flex-start",
  end: "flex-end",
  center: "center",
  stretch: "stretch",
  between: "space-between",
  around: "space-around",
  evenly: "space-evenly",
  "flex-start": "flex-start",
  "flex-end": "flex-end",
  "space-between": "space-between",
  "space-around": "space-around",
  "space-evenly": "space-evenly",
};

function resolveDimension(v: string | number | undefined): string | undefined {
  if (v === undefined) return undefined;
  if (typeof v === "number") return `${v}px`;
  return v;
}

function resolveInset(v: string | number | undefined): string | undefined {
  if (v === undefined) return undefined;
  if (typeof v === "number") return `${v}px`;
  return v;
}

function resolveTransform(props: BoxProps): string | undefined {
  const parts: string[] = [];
  if (props.translateX !== undefined) {
    parts.push(
      `translateX(${typeof props.translateX === "number" ? `${props.translateX}px` : props.translateX})`
    );
  }
  if (props.translateY !== undefined) {
    parts.push(
      `translateY(${typeof props.translateY === "number" ? `${props.translateY}px` : props.translateY})`
    );
  }
  if (props.scale !== undefined) {
    parts.push(`scale(${props.scale})`);
  }
  if (props.rotate !== undefined) {
    parts.push(
      `rotate(${typeof props.rotate === "number" ? `${props.rotate}deg` : props.rotate})`
    );
  }
  if (props.skewX !== undefined) {
    parts.push(
      `skewX(${typeof props.skewX === "number" ? `${props.skewX}deg` : props.skewX})`
    );
  }
  if (props.skewY !== undefined) {
    parts.push(
      `skewY(${typeof props.skewY === "number" ? `${props.skewY}deg` : props.skewY})`
    );
  }
  if (props.transform) parts.push(props.transform);
  return parts.length > 0 ? parts.join(" ") : undefined;
}

function resolveAspectRatio(ratio: number | string | undefined): string | undefined {
  if (ratio === undefined) return undefined;
  if (typeof ratio === "number") return String(ratio);
  if (ratio.includes(":")) {
    const [a, b] = ratio.split(":");
    return `${Number(a) / Number(b)}`;
  }
  return ratio;
}

function resolveBorderRadius(props: BoxProps): string | undefined {
  if (props.circle) return "50%";
  if (props.pill) return BOX_RADIUS_MAP.full;
  if (props.rounded) return BOX_RADIUS_MAP.lg;
  if (props.square) return "0";
  if (props.radius) return BOX_RADIUS_MAP[props.radius];
  if (props.borderRadius) return props.borderRadius;
  return undefined;
}

function resolveGlassEffect(
  glass?: boolean,
  glassDark?: boolean,
  frosted?: boolean
): CSSProperties {
  if (frosted) {
    return {
      background: "rgba(255, 255, 255, 0.72)",
      backdropFilter: "blur(20px) saturate(180%)",
      WebkitBackdropFilter: "blur(20px) saturate(180%)",
      border: "1px solid rgba(255, 255, 255, 0.3)",
    };
  }
  if (glassDark) {
    return {
      background: "rgba(17, 25, 40, 0.65)",
      backdropFilter: "blur(16px) saturate(180%)",
      WebkitBackdropFilter: "blur(16px) saturate(180%)",
      border: "1px solid rgba(255, 255, 255, 0.08)",
    };
  }
  if (glass) {
    return {
      background: "rgba(255, 255, 255, 0.55)",
      backdropFilter: "blur(12px) saturate(160%)",
      WebkitBackdropFilter: "blur(12px) saturate(160%)",
      border: "1px solid rgba(255, 255, 255, 0.4)",
    };
  }
  return {};
}

function resolveOutlinedStyle(): CSSProperties {
  return {
    background: "transparent",
    border: "1px solid rgb(229 231 235)",
  };
}

function resolveSubtleStyle(): CSSProperties {
  return {
    background: "rgb(249 250 251)",
    border: "1px solid rgb(243 244 246)",
  };
}

function resolveLineClamp(lines: number): CSSProperties {
  return {
    display: "-webkit-box",
    WebkitLineClamp: lines,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  };
}

function resolveHideBreakpoint(
  hideBelow?: BoxBreakpoint,
  hideAbove?: BoxBreakpoint,
  showOnly?: BoxBreakpoint[]
): string {
  if (!hideBelow && !hideAbove && !showOnly) return "";

  const bpWidths: Record<BoxBreakpoint, number> = DEFAULT_BOX_BREAKPOINTS;
  const classes: string[] = [];

  if (hideBelow) {
    const map: Record<BoxBreakpoint, string> = {
      xs: "hidden",
      sm: "hidden sm:block",
      md: "hidden md:block",
      lg: "hidden lg:block",
      xl: "hidden xl:block",
      "2xl": "hidden 2xl:block",
    };
    classes.push(map[hideBelow] ?? "");
  }

  if (hideAbove) {
    const map: Record<BoxBreakpoint, string> = {
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

function buildBoxStyle(props: BoxProps, breakpoint: BoxBreakpoint): CSSProperties {
  const {
    display, position, visibility, overflow, overflowX, overflowY,
    width, height, minWidth, minHeight, maxWidth, maxHeight,
    w, h, minW, minH, maxW, maxH,
    fullWidth, fullHeight, fullScreen, fitContent, fillAvailable,
    p, px, py, pt, pr, pb, pl,
    padding, paddingX, paddingY, paddingTop, paddingRight, paddingBottom, paddingLeft,
    m, mx, my, mt, mr, mb, ml,
    margin, marginX, marginY, marginTop, marginRight, marginBottom, marginLeft,
    top, right, bottom, left,
    inset: insetProp, insetX, insetY,
    zIndex,
    flex, flexGrow, flexShrink, flexBasis, flexDirection, flexWrap,
    alignItems, alignSelf, justifyContent, justifySelf,
    gap, gapX, gapY, order, placeItems, placeContent, placeSelf,
    gridColumn, gridRow, gridColumnStart, gridColumnEnd,
    gridRowStart, gridRowEnd, gridTemplateColumns, gridTemplateRows,
    gridAutoFlow, gridAutoColumns, gridAutoRows, colSpan, rowSpan,
    bg, background, backgroundColor, backgroundImage,
    backgroundSize, backgroundPosition, backgroundRepeat, bgGradient, color, opacity,
    shadow, boxShadow, textShadow, filter, backdropFilter, mixBlendMode,
    isolation, willChange,
    radius, borderRadius: borderRadiusProp, borderTopLeftRadius, borderTopRightRadius,
    borderBottomLeftRadius, borderBottomRightRadius,
    rounded, square, circle, pill,
    border, borderWidth, borderStyle: borderStyleProp, borderColor,
    borderTop, borderRight, borderBottom: borderBottomProp, borderLeft,
    borderTopWidth, borderRightWidth, borderBottomWidth, borderLeftWidth,
    outline, outlineOffset,
    cursor, userSelect, pointerEvents, resize, appearance,
    transition, transitionPreset, transitionDuration, transitionTimingFunction, transitionDelay,
    transformOrigin,
    textAlign, verticalAlign, whiteSpace, textOverflow, wordBreak,
    lineClamp, truncate, listStyle, listStyleType,
    aspectRatio, objectFit, objectPosition,
    elevation, glass, glassDark, frosted, outlined, subtle,
    sx, css: cssProp, style,
  } = props;

  const resolveR = <T,>(v: ResponsiveProp<T> | undefined) =>
    resolveResponsiveValue<T>(v, breakpoint);

  const resolveS = (v: ResponsiveProp<BoxSpacingScale | string> | undefined) => {
    const resolved = resolveR(v);
    return resolveSpacing(resolved as number | string | undefined);
  };

  const effectiveDisplay = resolveR(display);
  const effectivePosition = resolveR(position);

  const resolvedBorderRadius = resolveBorderRadius(props);
  const glassStyle = resolveGlassEffect(glass, glassDark, frosted);
  const outlinedStyle = outlined ? resolveOutlinedStyle() : {};
  const subtleStyle = subtle ? resolveSubtleStyle() : {};
  const transformVal = resolveTransform(props);
  const lineClampStyle = lineClamp ? resolveLineClamp(lineClamp) : {};

  const pVal = resolveS(p ?? padding);
  const pxVal = resolveS(px ?? paddingX);
  const pyVal = resolveS(py ?? paddingY);
  const ptVal = resolveS(pt ?? paddingTop);
  const prVal = resolveS(pr ?? paddingRight);
  const pbVal = resolveS(pb ?? paddingBottom);
  const plVal = resolveS(pl ?? paddingLeft);

  const mVal = resolveS(m ?? margin);
  const mxVal = resolveS(mx ?? marginX);
  const myVal = resolveS(my ?? marginY);
  const mtVal = resolveS(mt ?? marginTop);
  const mrVal = resolveS(mr ?? marginRight);
  const mbVal = resolveS(mb ?? marginBottom);
  const mlVal = resolveS(ml ?? marginLeft);

  const gapVal = resolveS(gap);
  const gapXVal = resolveS(gapX);
  const gapYVal = resolveS(gapY);

  const resolvedShadow = shadow
    ? BOX_SHADOW_MAP[shadow]
    : elevation !== undefined
      ? ELEVATION_SHADOWS[elevation]
      : boxShadow;

  const resolvedTransition = transitionPreset
    ? BOX_TRANSITION_MAP[transitionPreset]
    : transition;

  const resolvedWidth =
    fullScreen || fullWidth
      ? "100%"
      : fitContent
        ? "fit-content"
        : fillAvailable
          ? "-webkit-fill-available"
          : resolveDimension(width ?? w);

  const resolvedHeight =
    fullScreen || fullHeight
      ? "100%"
      : fitContent
        ? "fit-content"
        : resolveDimension(height ?? h);

  const colSpanStyle =
    colSpan !== undefined
      ? { gridColumn: colSpan === "full" ? "1 / -1" : `span ${colSpan} / span ${colSpan}` }
      : gridColumn
        ? { gridColumn }
        : {};

  const rowSpanStyle =
    rowSpan !== undefined
      ? { gridRow: rowSpan === "full" ? "1 / -1" : `span ${rowSpan} / span ${rowSpan}` }
      : gridRow
        ? { gridRow }
        : {};

  const insetStyle: CSSProperties = {};
  if (insetProp !== undefined) {
    const v = resolveInset(insetProp as string | number);
    insetStyle.top = v;
    insetStyle.right = v;
    insetStyle.bottom = v;
    insetStyle.left = v;
  }
  if (insetX !== undefined) {
    const v = resolveInset(insetX as string | number);
    insetStyle.left = v;
    insetStyle.right = v;
  }
  if (insetY !== undefined) {
    const v = resolveInset(insetY as string | number);
    insetStyle.top = v;
    insetStyle.bottom = v;
  }

  const computedStyle: CSSProperties = {
    ...(effectiveDisplay && { display: effectiveDisplay }),
    ...(effectivePosition && { position: effectivePosition }),
    ...(visibility && { visibility }),
    ...(overflow && { overflow }),
    ...(overflowX && { overflowX }),
    ...(overflowY && { overflowY }),

    ...(resolvedWidth !== undefined && { width: resolvedWidth }),
    ...(resolvedHeight !== undefined && { height: resolvedHeight }),
    ...(resolveDimension(minWidth ?? minW) && { minWidth: resolveDimension(minWidth ?? minW) }),
    ...(resolveDimension(minHeight ?? minH) && { minHeight: resolveDimension(minHeight ?? minH) }),
    ...(resolveDimension(maxWidth ?? maxW) && { maxWidth: resolveDimension(maxWidth ?? maxW) }),
    ...(resolveDimension(maxHeight ?? maxH) && { maxHeight: resolveDimension(maxHeight ?? maxH) }),

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

    ...(top !== undefined && { top: resolveInset(top) }),
    ...(right !== undefined && { right: resolveInset(right) }),
    ...(bottom !== undefined && { bottom: resolveInset(bottom) }),
    ...(left !== undefined && { left: resolveInset(left) }),
    ...insetStyle,
    ...(zIndex !== undefined && { zIndex }),

    ...(flex !== undefined && { flex }),
    ...(flexGrow !== undefined && { flexGrow }),
    ...(flexShrink !== undefined && { flexShrink }),
    ...(flexBasis !== undefined && { flexBasis }),
    ...(flexDirection && { flexDirection }),
    ...(flexWrap && { flexWrap }),
    ...(alignItems && { alignItems: ALIGN_ITEMS_MAP[alignItems] ?? alignItems }),
    ...(alignSelf && { alignSelf: alignSelf === "auto" ? "auto" : (ALIGN_ITEMS_MAP[alignSelf] ?? alignSelf) }),
    ...(justifyContent && { justifyContent: JUSTIFY_CONTENT_MAP[justifyContent] ?? justifyContent }),
    ...(justifySelf && { justifySelf: justifySelf === "auto" ? "auto" : (JUSTIFY_CONTENT_MAP[justifySelf] ?? justifySelf) }),
    ...(gapVal && { gap: gapVal }),
    ...(gapXVal && { columnGap: gapXVal }),
    ...(gapYVal && { rowGap: gapYVal }),
    ...(order !== undefined && { order }),
    ...(placeItems && { placeItems }),
    ...(placeContent && { placeContent }),
    ...(placeSelf && { placeSelf }),

    ...colSpanStyle,
    ...rowSpanStyle,
    ...(gridColumnStart !== undefined && { gridColumnStart }),
    ...(gridColumnEnd !== undefined && { gridColumnEnd }),
    ...(gridRowStart !== undefined && { gridRowStart }),
    ...(gridRowEnd !== undefined && { gridRowEnd }),
    ...(gridTemplateColumns && { gridTemplateColumns }),
    ...(gridTemplateRows && { gridTemplateRows }),
    ...(gridAutoFlow && { gridAutoFlow }),
    ...(gridAutoColumns && { gridAutoColumns }),
    ...(gridAutoRows && { gridAutoRows }),

    ...(bgGradient && { backgroundImage: bgGradient }),
    ...(backgroundImage && !bgGradient && { backgroundImage }),
    ...(backgroundSize && { backgroundSize }),
    ...(backgroundPosition && { backgroundPosition }),
    ...(backgroundRepeat && { backgroundRepeat }),
    ...(bg && { backgroundColor: bg }),
    ...(backgroundColor && { backgroundColor }),
    ...(background && { background }),
    ...(color && { color }),
    ...(opacity !== undefined && { opacity }),

    ...(resolvedShadow && { boxShadow: resolvedShadow }),
    ...(textShadow && { textShadow }),
    ...(filter && { filter }),
    ...(backdropFilter && !glass && !glassDark && !frosted && { backdropFilter }),
    ...(mixBlendMode && { mixBlendMode }),
    ...(isolation && { isolation }),
    ...(willChange && { willChange }),

    ...(resolvedBorderRadius && { borderRadius: resolvedBorderRadius }),
    ...(borderTopLeftRadius && !resolvedBorderRadius && { borderTopLeftRadius }),
    ...(borderTopRightRadius && !resolvedBorderRadius && { borderTopRightRadius }),
    ...(borderBottomLeftRadius && !resolvedBorderRadius && { borderBottomLeftRadius }),
    ...(borderBottomRightRadius && !resolvedBorderRadius && { borderBottomRightRadius }),

    ...(border && { border }),
    ...(borderWidth !== undefined && { borderWidth: typeof borderWidth === "number" ? `${borderWidth}px` : borderWidth }),
    ...(borderStyleProp && { borderStyle: borderStyleProp }),
    ...(borderColor && { borderColor }),
    ...(borderTop && { borderTop }),
    ...(borderRight && { borderRight }),
    ...(borderBottomProp && { borderBottom: borderBottomProp }),
    ...(borderLeft && { borderLeft }),
    ...(borderTopWidth !== undefined && { borderTopWidth: typeof borderTopWidth === "number" ? `${borderTopWidth}px` : borderTopWidth }),
    ...(borderRightWidth !== undefined && { borderRightWidth: typeof borderRightWidth === "number" ? `${borderRightWidth}px` : borderRightWidth }),
    ...(borderBottomWidth !== undefined && { borderBottomWidth: typeof borderBottomWidth === "number" ? `${borderBottomWidth}px` : borderBottomWidth }),
    ...(borderLeftWidth !== undefined && { borderLeftWidth: typeof borderLeftWidth === "number" ? `${borderLeftWidth}px` : borderLeftWidth }),
    ...(outline && { outline }),
    ...(outlineOffset !== undefined && { outlineOffset: typeof outlineOffset === "number" ? `${outlineOffset}px` : outlineOffset }),

    ...(cursor && { cursor }),
    ...(userSelect && { userSelect }),
    ...(pointerEvents && { pointerEvents }),
    ...(resize && { resize }),
    ...(appearance && { appearance }),

    ...(resolvedTransition && { transition: resolvedTransition }),
    ...(transitionDuration !== undefined && { transitionDuration: typeof transitionDuration === "number" ? `${transitionDuration}ms` : transitionDuration }),
    ...(transitionTimingFunction && { transitionTimingFunction }),
    ...(transitionDelay !== undefined && { transitionDelay: typeof transitionDelay === "number" ? `${transitionDelay}ms` : transitionDelay }),
    ...(transformVal && { transform: transformVal }),
    ...(transformOrigin && { transformOrigin }),

    ...(textAlign && { textAlign }),
    ...(verticalAlign && { verticalAlign }),
    ...(whiteSpace && { whiteSpace }),
    ...(textOverflow && { textOverflow }),
    ...(wordBreak && { wordBreak }),
    ...lineClampStyle,
    ...(truncate && { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }),
    ...(listStyle && { listStyle }),
    ...(listStyleType && { listStyleType }),

    ...(aspectRatio !== undefined && { aspectRatio: resolveAspectRatio(aspectRatio) }),
    ...(objectFit && { objectFit }),
    ...(objectPosition && { objectPosition }),

    ...glassStyle,
    ...outlinedStyle,
    ...subtleStyle,
    ...cssProp,
    ...sx,
    ...style,
  };

  if (props.srOnly) {
    return {
      position: "absolute",
      width: "1px",
      height: "1px",
      padding: "0",
      margin: "-1px",
      overflow: "hidden",
      clip: "rect(0, 0, 0, 0)",
      whiteSpace: "nowrap",
      borderWidth: "0",
    };
  }

  return computedStyle;
}

export const Box = forwardRef<HTMLDivElement, BoxProps>(
  (
    {
      as: Tag = "div",
      component,
      hideBelow,
      hideAbove,
      showOnly,
      trackHover,
      trackFocus,
      onHoverChange,
      onFocusChange,
      onInViewChange,
      className = "",
      children,
      onClick,
      onDoubleClick,
      onMouseDown,
      onMouseUp,
      onMouseEnter,
      onMouseLeave,
      onMouseMove,
      onMouseOver,
      onMouseOut,
      onContextMenu,
      onFocus,
      onBlur,
      onFocusIn,
      onFocusOut,
      onKeyDown,
      onKeyUp,
      onKeyPress,
      onPointerDown,
      onPointerUp,
      onPointerMove,
      onPointerEnter,
      onPointerLeave,
      onPointerCancel,
      onPointerOver,
      onPointerOut,
      onTouchStart,
      onTouchEnd,
      onTouchMove,
      onTouchCancel,
      onScroll,
      onWheel,
      onDrag,
      onDragStart,
      onDragEnd,
      onDragOver,
      onDragEnter,
      onDragLeave,
      onDrop,
      onAnimationStart,
      onAnimationEnd,
      onAnimationIteration,
      onTransitionEnd,
      onCopy,
      onCut,
      onPaste,
      onInput,
      onSelect,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "aria-describedby": ariaDescribedBy,
      "aria-hidden": ariaHidden,
      "aria-live": ariaLive,
      "aria-atomic": ariaAtomic,
      "aria-expanded": ariaExpanded,
      "aria-controls": ariaControls,
      "aria-selected": ariaSelected,
      "aria-checked": ariaChecked,
      "aria-pressed": ariaPressed,
      "aria-disabled": ariaDisabled,
      "aria-required": ariaRequired,
      "aria-invalid": ariaInvalid,
      "aria-multiline": ariaMultiline,
      "aria-multiselectable": ariaMultiselectable,
      "aria-readonly": ariaReadonly,
      "aria-busy": ariaBusy,
      "aria-current": ariaCurrent,
      "aria-haspopup": ariaHaspopup,
      "aria-orientation": ariaOrientation,
      "aria-posinset": ariaPosinset,
      "aria-setsize": ariaSetsize,
      "aria-level": ariaLevel,
      "aria-valuemax": ariaValuemax,
      "aria-valuemin": ariaValuemin,
      "aria-valuenow": ariaValuenow,
      "aria-valuetext": ariaValuetext,
      "data-testid": dataTestId,
      id,
      lang,
      dir,
      hidden,
      draggable,
      contentEditable,
      spellCheck,
      autoCorrect,
      autoCapitalize,
      tabIndex,
      role,
      srOnly,
      notSrOnly,
      ...rest
    },
    ref
  ) => {
    const FinalTag = component ?? Tag;

    const [breakpoint, setBreakpoint] = useState<BoxBreakpoint>("lg");
    const [isHovered, setIsHovered] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const internalRef = useRef<HTMLDivElement>(null);
    const resolvedRef = (ref as React.RefObject<HTMLDivElement>) ?? internalRef;

    useEffect(() => {
      const update = () => {
        const w = window.innerWidth;
        const bp =
          w >= 1536
            ? "2xl"
            : w >= 1280
              ? "xl"
              : w >= 1024
                ? "lg"
                : w >= 768
                  ? "md"
                  : w >= 640
                    ? "sm"
                    : "xs";
        setBreakpoint(bp as BoxBreakpoint);
      };
      window.addEventListener("resize", update, { passive: true });
      update();
      return () => window.removeEventListener("resize", update);
    }, []);

    const computedStyle = useMemo(
      () => buildBoxStyle({ ...rest, srOnly, notSrOnly } as BoxProps, breakpoint),
      [rest, srOnly, notSrOnly, breakpoint, isHovered, isFocused]
    );

    const hideClass = resolveHideBreakpoint(hideBelow, hideAbove, showOnly);

    const handleMouseEnter = useCallback(
      (e: MouseEvent<HTMLDivElement>) => {
        if (trackHover) {
          setIsHovered(true);
          onHoverChange?.(true);
        }
        onMouseEnter?.(e);
      },
      [trackHover, onHoverChange, onMouseEnter]
    );

    const handleMouseLeave = useCallback(
      (e: MouseEvent<HTMLDivElement>) => {
        if (trackHover) {
          setIsHovered(false);
          onHoverChange?.(false);
        }
        onMouseLeave?.(e);
      },
      [trackHover, onHoverChange, onMouseLeave]
    );

    const handleFocus = useCallback(
      (e: FocusEvent<HTMLDivElement>) => {
        if (trackFocus) {
          setIsFocused(true);
          onFocusChange?.(true);
        }
        onFocus?.(e);
      },
      [trackFocus, onFocusChange, onFocus]
    );

    const handleBlur = useCallback(
      (e: FocusEvent<HTMLDivElement>) => {
        if (trackFocus) {
          setIsFocused(false);
          onFocusChange?.(false);
        }
        onBlur?.(e);
      },
      [trackFocus, onFocusChange, onBlur]
    );

    const combinedClassName = [hideClass, className].filter(Boolean).join(" ");

    return (
      <FinalTag
        ref={resolvedRef}
        id={id}
        lang={lang}
        dir={dir}
        hidden={hidden}
        draggable={draggable}
        contentEditable={contentEditable}
        spellCheck={spellCheck}
        autoCorrect={autoCorrect}
        autoCapitalize={autoCapitalize}
        tabIndex={tabIndex}
        role={role}
        className={combinedClassName || undefined}
        style={computedStyle}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={onMouseMove}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        onContextMenu={onContextMenu}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onKeyPress={onKeyPress}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerMove={onPointerMove}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onPointerCancel={onPointerCancel}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onTouchMove={onTouchMove}
        onTouchCancel={onTouchCancel}
        onScroll={onScroll}
        onWheel={onWheel}
        onDrag={onDrag}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onAnimationStart={onAnimationStart}
        onAnimationEnd={onAnimationEnd}
        onAnimationIteration={onAnimationIteration}
        onTransitionEnd={onTransitionEnd}
        onCopy={onCopy}
        onCut={onCut}
        onPaste={onPaste}
        onInput={onInput}
        onSelect={onSelect}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-hidden={ariaHidden}
        aria-live={ariaLive}
        aria-atomic={ariaAtomic}
        aria-expanded={ariaExpanded}
        aria-controls={ariaControls}
        aria-selected={ariaSelected}
        aria-checked={ariaChecked}
        aria-pressed={ariaPressed}
        aria-disabled={ariaDisabled}
        aria-required={ariaRequired}
        aria-invalid={ariaInvalid}
        aria-multiline={ariaMultiline}
        aria-multiselectable={ariaMultiselectable}
        aria-readonly={ariaReadonly}
        aria-busy={ariaBusy}
        aria-current={ariaCurrent}
        aria-haspopup={ariaHaspopup}
        aria-orientation={ariaOrientation}
        aria-posinset={ariaPosinset}
        aria-setsize={ariaSetsize}
        aria-level={ariaLevel}
        aria-valuemax={ariaValuemax}
        aria-valuemin={ariaValuemin}
        aria-valuenow={ariaValuenow}
        aria-valuetext={ariaValuetext}
        data-testid={dataTestId}
      >
        {children}
      </FinalTag>
    );
  }
);
Box.displayName = "Box";

export interface AnimatedBoxProps extends BoxProps {
  animate?: boolean;
  initial?: object;
  animateTo?: object;
  exit?: object;
  duration?: number;
  delay?: number;
  ease?: string | number[];
  whileHover?: object;
  whileTap?: object;
  whileFocus?: object;
  whileInView?: object;
  viewport?: object;
  layout?: boolean;
  layoutId?: string;
  animationVariant?: "fade" | "slide-up" | "slide-down" | "slide-left" | "slide-right" | "scale" | "blur" | "bounce";
}

const ANIMATION_PRESETS = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  "slide-up": {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  "slide-down": {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  "slide-left": {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
  "slide-right": {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.94 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.94 },
  },
  blur: {
    initial: { opacity: 0, filter: "blur(8px)" },
    animate: { opacity: 1, filter: "blur(0px)" },
    exit: { opacity: 0, filter: "blur(8px)" },
  },
  bounce: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  },
};

export const AnimatedBox = forwardRef<HTMLDivElement, AnimatedBoxProps>(
  (
    {
      animate: shouldAnimate = true,
      initial,
      animateTo,
      exit: exitProp,
      duration = 0.28,
      delay = 0,
      ease = "easeOut",
      whileHover,
      whileTap,
      whileFocus,
      whileInView,
      viewport,
      layout,
      layoutId,
      animationVariant = "fade",
      children,
      style = {},
      className = "",
      as,
      component,
      ...boxRest
    },
    ref
  ) => {
    const preset = ANIMATION_PRESETS[animationVariant];
    const [breakpoint, setBreakpoint] = useState<BoxBreakpoint>("lg");

    useEffect(() => {
      const update = () => {
        const w = window.innerWidth;
        const bp =
          w >= 1536 ? "2xl" : w >= 1280 ? "xl" : w >= 1024 ? "lg" : w >= 768 ? "md" : w >= 640 ? "sm" : "xs";
        setBreakpoint(bp as BoxBreakpoint);
      };
      window.addEventListener("resize", update, { passive: true });
      update();
      return () => window.removeEventListener("resize", update);
    }, []);

    const computedStyle = useMemo(
      () => buildBoxStyle(boxRest as BoxProps, breakpoint),
      [boxRest, breakpoint]
    );

    if (!shouldAnimate) {
      return (
        <Box ref={ref} as={as} component={component} className={className} style={{ ...computedStyle, ...style }} {...(boxRest as BoxProps)}>
          {children}
        </Box>
      );
    }

    return (
      <motion.div
        ref={ref as React.RefObject<HTMLDivElement>}
        initial={initial ?? preset.initial}
        animate={animateTo ?? preset.animate}
        exit={exitProp ?? preset.exit}
        transition={{ duration, delay, ease }}
        whileHover={whileHover}
        whileTap={whileTap}
        whileFocus={whileFocus}
        whileInView={whileInView}
        viewport={viewport}
        layout={layout}
        layoutId={layoutId}
        className={className}
        style={{ ...computedStyle, ...style }}
      >
        {children}
      </motion.div>
    );
  }
);
AnimatedBox.displayName = "AnimatedBox";

export interface AbsoluteBoxProps extends BoxProps {
  inset?: string | number;
  fill?: boolean;
  centerX?: boolean;
  centerY?: boolean;
  center?: boolean;
}

export const AbsoluteBox = forwardRef<HTMLDivElement, AbsoluteBoxProps>(
  ({ fill, centerX, centerY, center, style = {}, children, ...rest }, ref) => {
    const fillStyle: CSSProperties = fill
      ? { position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }
      : { position: "absolute" };

    const centerStyle: CSSProperties =
      center
        ? { top: "50%", left: "50%", transform: "translate(-50%, -50%)" }
        : centerX
          ? { left: "50%", transform: "translateX(-50%)" }
          : centerY
            ? { top: "50%", transform: "translateY(-50%)" }
            : {};

    return (
      <Box
        ref={ref}
        position="absolute"
        style={{ ...fillStyle, ...centerStyle, ...style }}
        {...rest}
      >
        {children}
      </Box>
    );
  }
);
AbsoluteBox.displayName = "AbsoluteBox";

export interface FixedBoxProps extends BoxProps {
  fill?: boolean;
}

export const FixedBox = forwardRef<HTMLDivElement, FixedBoxProps>(
  ({ fill, style = {}, children, ...rest }, ref) => {
    const fillStyle: CSSProperties = fill
      ? { position: "fixed", top: 0, right: 0, bottom: 0, left: 0 }
      : { position: "fixed" };

    return (
      <Box ref={ref} style={{ ...fillStyle, ...style }} {...rest}>
        {children}
      </Box>
    );
  }
);
FixedBox.displayName = "FixedBox";

export interface StickyBoxProps extends BoxProps {
  offsetTop?: number | string;
  offsetBottom?: number | string;
  side?: "top" | "bottom";
}

export const StickyBox = forwardRef<HTMLDivElement, StickyBoxProps>(
  ({ offsetTop, offsetBottom, side = "top", style = {}, children, ...rest }, ref) => {
    const stickyStyle: CSSProperties = {
      position: "sticky",
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
    };

    return (
      <Box ref={ref} style={{ ...stickyStyle, ...style }} {...rest}>
        {children}
      </Box>
    );
  }
);
StickyBox.displayName = "StickyBox";

export interface CenterBoxProps extends BoxProps {
  axis?: "both" | "horizontal" | "vertical";
  absolute?: boolean;
  inline?: boolean;
}

export const CenterBox = forwardRef<HTMLDivElement, CenterBoxProps>(
  ({ axis = "both", absolute = false, inline = false, style = {}, children, ...rest }, ref) => {
    const centerStyle: CSSProperties = absolute
      ? {
          position: "absolute",
          ...(axis !== "vertical" && { left: "50%" }),
          ...(axis !== "horizontal" && { top: "50%" }),
          transform:
            axis === "both"
              ? "translate(-50%, -50%)"
              : axis === "horizontal"
                ? "translateX(-50%)"
                : "translateY(-50%)",
        }
      : {
          display: inline ? "inline-flex" : "flex",
          ...(axis !== "vertical" && { justifyContent: "center" }),
          ...(axis !== "horizontal" && { alignItems: "center" }),
        };

    return (
      <Box ref={ref} style={{ ...centerStyle, ...style }} {...rest}>
        {children}
      </Box>
    );
  }
);
CenterBox.displayName = "CenterBox";

export interface GlassBoxProps extends BoxProps {
  variant?: "light" | "dark" | "frosted";
  intensity?: "low" | "medium" | "high";
}

export const GlassBox = forwardRef<HTMLDivElement, GlassBoxProps>(
  ({ variant = "light", intensity = "medium", style = {}, children, radius = "xl", ...rest }, ref) => {
    const blurMap = { low: "8px", medium: "16px", high: "24px" };
    const blur = blurMap[intensity];

    const glassStyle: CSSProperties =
      variant === "dark"
        ? {
            background: `rgba(17, 25, 40, ${intensity === "high" ? 0.75 : intensity === "medium" ? 0.65 : 0.5})`,
            backdropFilter: `blur(${blur}) saturate(180%)`,
            WebkitBackdropFilter: `blur(${blur}) saturate(180%)`,
            border: "1px solid rgba(255, 255, 255, 0.07)",
          }
        : variant === "frosted"
          ? {
              background: `rgba(255, 255, 255, ${intensity === "high" ? 0.85 : intensity === "medium" ? 0.72 : 0.55})`,
              backdropFilter: `blur(${blur}) saturate(200%)`,
              WebkitBackdropFilter: `blur(${blur}) saturate(200%)`,
              border: "1px solid rgba(255, 255, 255, 0.35)",
            }
          : {
              background: `rgba(255, 255, 255, ${intensity === "high" ? 0.7 : intensity === "medium" ? 0.55 : 0.4})`,
              backdropFilter: `blur(${blur}) saturate(160%)`,
              WebkitBackdropFilter: `blur(${blur}) saturate(160%)`,
              border: "1px solid rgba(255, 255, 255, 0.4)",
            };

    return (
      <Box
        ref={ref}
        radius={radius}
        style={{ ...glassStyle, ...style }}
        {...rest}
      >
        {children}
      </Box>
    );
  }
);
GlassBox.displayName = "GlassBox";

export interface SurfaceBoxProps extends BoxProps {
  variant?: "default" | "bordered" | "elevated" | "ghost" | "filled" | "tinted";
  interactive?: boolean;
}

const SURFACE_VARIANTS: Record<string, CSSProperties> = {
  default: {
    backgroundColor: "rgb(255 255 255)",
    border: "1px solid rgb(229 231 235)",
    boxShadow:
      "0 1px 3px 0 rgb(0 0 0 / 0.07), 0 1px 2px -1px rgb(0 0 0 / 0.07)",
  },
  bordered: {
    backgroundColor: "rgb(255 255 255)",
    border: "2px solid rgb(229 231 235)",
  },
  elevated: {
    backgroundColor: "rgb(255 255 255)",
    border: "1px solid rgb(243 244 246)",
    boxShadow:
      "0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.08)",
  },
  ghost: {
    backgroundColor: "transparent",
  },
  filled: {
    backgroundColor: "rgb(249 250 251)",
    border: "1px solid rgb(243 244 246)",
  },
  tinted: {
    backgroundColor: "rgb(239 246 255)",
    border: "1px solid rgb(219 234 254)",
  },
};

export const SurfaceBox = forwardRef<HTMLDivElement, SurfaceBoxProps>(
  (
    {
      variant = "default",
      interactive = false,
      radius = "xl",
      style = {},
      className = "",
      children,
      transitionPreset,
      ...rest
    },
    ref
  ) => {
    const surfaceStyle = SURFACE_VARIANTS[variant] ?? SURFACE_VARIANTS.default;
    const interactiveStyle: CSSProperties = interactive
      ? { cursor: "pointer", transition: BOX_TRANSITION_MAP.default }
      : {};

    return (
      <Box
        ref={ref}
        radius={radius}
        className={className}
        style={{ ...surfaceStyle, ...interactiveStyle, ...style }}
        {...rest}
      >
        {children}
      </Box>
    );
  }
);
SurfaceBox.displayName = "SurfaceBox";

export interface OverlayBoxProps extends BoxProps {
  blurred?: boolean;
  blurAmount?: number;
  dimAmount?: number;
  onClose?: () => void;
  closeOnClick?: boolean;
}

export const OverlayBox = forwardRef<HTMLDivElement, OverlayBoxProps>(
  (
    {
      blurred = false,
      blurAmount = 4,
      dimAmount = 0.4,
      onClose,
      closeOnClick = true,
      zIndex = 50,
      style = {},
      children,
      ...rest
    },
    ref
  ) => {
    const overlayStyle: CSSProperties = {
      position: "fixed",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      backgroundColor: `rgba(0, 0, 0, ${dimAmount})`,
      ...(blurred && {
        backdropFilter: `blur(${blurAmount}px)`,
        WebkitBackdropFilter: `blur(${blurAmount}px)`,
      }),
    };

    return (
      <Box
        ref={ref}
        zIndex={zIndex}
        onClick={closeOnClick ? onClose : undefined}
        style={{ ...overlayStyle, ...style }}
        {...rest}
      >
        {children}
      </Box>
    );
  }
);
OverlayBox.displayName = "OverlayBox";

export interface AspectRatioBoxProps extends BoxProps {
  ratio?: number | string;
}

export const AspectRatioBox = forwardRef<HTMLDivElement, AspectRatioBoxProps>(
  ({ ratio = 16 / 9, style = {}, children, ...rest }, ref) => {
    const numRatio =
      typeof ratio === "string"
        ? ratio.includes(":")
          ? Number(ratio.split(":")[0]) / Number(ratio.split(":")[1])
          : parseFloat(ratio)
        : ratio;

    return (
      <Box
        ref={ref}
        position="relative"
        style={{ paddingBottom: `${(1 / numRatio) * 100}%`, ...style }}
        {...rest}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        >
          {children}
        </div>
      </Box>
    );
  }
);
AspectRatioBox.displayName = "AspectRatioBox";

export interface TruncatedBoxProps extends BoxProps {
  lines?: number;
}

export const TruncatedBox = forwardRef<HTMLDivElement, TruncatedBoxProps>(
  ({ lines, style = {}, children, ...rest }, ref) => {
    const truncStyle: CSSProperties =
      lines && lines > 1
        ? {
            display: "-webkit-box",
            WebkitLineClamp: lines,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }
        : {
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          };

    return (
      <Box ref={ref} style={{ ...truncStyle, ...style }} {...rest}>
        {children}
      </Box>
    );
  }
);
TruncatedBox.displayName = "TruncatedBox";

export interface BleedBoxProps extends BoxProps {
  bleedX?: number | string;
  bleedY?: number | string;
  bleedTop?: number | string;
  bleedBottom?: number | string;
  bleedLeft?: number | string;
  bleedRight?: number | string;
}

export const BleedBox = forwardRef<HTMLDivElement, BleedBoxProps>(
  (
    {
      bleedX,
      bleedY,
      bleedTop,
      bleedBottom,
      bleedLeft,
      bleedRight,
      style = {},
      children,
      ...rest
    },
    ref
  ) => {
    const toNeg = (v: number | string) =>
      typeof v === "number" ? `${-v * 4}px` : `-${v}`;

    const bleedStyle: CSSProperties = {
      ...(bleedX !== undefined && {
        marginLeft: toNeg(bleedX),
        marginRight: toNeg(bleedX),
      }),
      ...(bleedY !== undefined && {
        marginTop: toNeg(bleedY),
        marginBottom: toNeg(bleedY),
      }),
      ...(bleedTop !== undefined && { marginTop: toNeg(bleedTop) }),
      ...(bleedBottom !== undefined && { marginBottom: toNeg(bleedBottom) }),
      ...(bleedLeft !== undefined && { marginLeft: toNeg(bleedLeft) }),
      ...(bleedRight !== undefined && { marginRight: toNeg(bleedRight) }),
    };

    return (
      <Box ref={ref} style={{ ...bleedStyle, ...style }} {...rest}>
        {children}
      </Box>
    );
  }
);
BleedBox.displayName = "BleedBox";

export interface ScrollableBoxProps extends BoxProps {
  scrollAxis?: "x" | "y" | "both" | "none";
  showScrollbar?: "always" | "hover" | "never";
  scrollbarSize?: "thin" | "default" | "none";
  onScrollEnd?: () => void;
}

export const ScrollableBox = forwardRef<HTMLDivElement, ScrollableBoxProps>(
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
      (e: UIEvent<HTMLDivElement>) => {
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
      <Box
        ref={ref}
        className={`${scrollbarClass} ${className}`}
        style={{ ...overflowStyle, ...style }}
        onScroll={handleScroll}
        {...rest}
      >
        {children}
      </Box>
    );
  }
);
ScrollableBox.displayName = "ScrollableBox";

export interface InteractiveBoxProps extends BoxProps {
  disabled?: boolean;
  loading?: boolean;
  pressed?: boolean;
  selected?: boolean;
  hoverStyle?: CSSProperties;
  activeStyle?: CSSProperties;
  focusStyle?: CSSProperties;
  disabledStyle?: CSSProperties;
}

export const InteractiveBox = forwardRef<HTMLDivElement, InteractiveBoxProps>(
  (
    {
      disabled = false,
      loading = false,
      pressed = false,
      selected = false,
      hoverStyle = {},
      activeStyle = {},
      focusStyle = {},
      disabledStyle = {},
      style = {},
      className = "",
      children,
      transitionPreset = "default",
      cursor,
      ...rest
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const dynamicStyle: CSSProperties = {
      transition: BOX_TRANSITION_MAP.default,
      cursor: disabled || loading ? "not-allowed" : cursor ?? "pointer",
      opacity: disabled || loading ? 0.5 : 1,
      userSelect: "none",
      outline: "none",
      ...(isHovered && !disabled && !loading ? hoverStyle : {}),
      ...(isActive && !disabled && !loading ? activeStyle : {}),
      ...(isFocused && !disabled && !loading ? focusStyle : {}),
      ...(disabled || loading ? disabledStyle : {}),
      ...style,
    };

    return (
      <Box
        ref={ref}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        aria-pressed={pressed}
        aria-selected={selected}
        aria-busy={loading}
        className={className}
        style={dynamicStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => { setIsHovered(false); setIsActive(false); }}
        onMouseDown={() => setIsActive(true)}
        onMouseUp={() => setIsActive(false)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !disabled) {
            setIsActive(true);
          }
        }}
        onKeyUp={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !disabled) {
            setIsActive(false);
            rest.onClick?.(e as unknown as MouseEvent<HTMLDivElement>);
          }
        }}
        {...rest}
      >
        {children}
      </Box>
    );
  }
);
InteractiveBox.displayName = "InteractiveBox";

export {
  BoxProvider,
  useBoxContext,
  BOX_SHADOW_MAP,
  BOX_RADIUS_MAP,
  BOX_TRANSITION_MAP,
};

export type {
  BoxProviderProps,
  BoxBreakpoint,
  BoxShadow,
  BoxRadius,
  BoxBorderStyle,
  BoxCursor,
  BoxOverflow,
  BoxDisplay,
  BoxPosition,
  BoxFlexDirection,
  BoxAlignItems,
  BoxJustifyContent,
  BoxFlexWrap,
  BoxGridFlow,
  BoxTransitionPreset,
  BoxVisibility,
  BoxPointerEvents,
  BoxUserSelect,
  BoxMixBlendMode,
  BoxTextAlign,
  BoxVerticalAlign,
  BoxSpacingScale,
};