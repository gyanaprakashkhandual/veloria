import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SkeletonProvider,
  useSkeletonContext,
  type SkeletonProviderProps,
  type SkeletonAnimation,
  type SkeletonRadius,
  type SkeletonSpeed,
  type SkeletonTheme,
} from "./Skeleton.context";

// ─── Theme Config ─────────────────────────────────────────────────────────────
// Mirrors variantStyles from Action.menu.ui.tsx

const themeBase: Record<SkeletonTheme, string> = {
  default: "bg-gray-200 dark:bg-gray-700",
  muted:   "bg-gray-100 dark:bg-gray-800",
  strong:  "bg-gray-300 dark:bg-gray-600",
};

const themeWaveHighlight: Record<SkeletonTheme, string> = {
  default: "from-transparent via-white/50 dark:via-white/10 to-transparent",
  muted:   "from-transparent via-white/60 dark:via-white/8  to-transparent",
  strong:  "from-transparent via-white/40 dark:via-white/12 to-transparent",
};

// ─── Radius Config ────────────────────────────────────────────────────────────

const radiusClass: Record<SkeletonRadius, string> = {
  none: "rounded-none",
  sm:   "rounded-sm",
  md:   "rounded-md",
  lg:   "rounded-lg",
  full: "rounded-full",
};

// ─── Speed Config ─────────────────────────────────────────────────────────────

const speedDuration: Record<SkeletonSpeed, number> = {
  slow:   2.2,
  normal: 1.5,
  fast:   0.9,
};

// ─── Keyframes injected once ──────────────────────────────────────────────────
// We use a <style> tag instead of Tailwind keyframes so the file stays self-contained.

const KEYFRAMES_ID = "__skeleton_kf__";

function ensureKeyframes() {
  if (typeof document === "undefined") return;
  if (document.getElementById(KEYFRAMES_ID)) return;
  const style = document.createElement("style");
  style.id = KEYFRAMES_ID;
  style.textContent = `
    @keyframes sk-wave {
      0%   { transform: translateX(-100%); }
      100% { transform: translateX(200%); }
    }
    @keyframes sk-pulse {
      0%, 100% { opacity: 1; }
      50%       { opacity: .45; }
    }
  `;
  document.head.appendChild(style);
}

// ─── Base Bone ────────────────────────────────────────────────────────────────
// The atomic unit — every skeleton type is built from this.

interface BoneProps {
  width?:     string | number;
  height?:    string | number;
  animation:  SkeletonAnimation;
  radius:     SkeletonRadius;
  speed:      SkeletonSpeed;
  theme:      SkeletonTheme;
  className?: string;
  style?:     React.CSSProperties;
}

function Bone({
  width,
  height,
  animation,
  radius,
  speed,
  theme,
  className = "",
  style,
}: BoneProps) {
  ensureKeyframes();

  const duration = speedDuration[speed];

  const animationStyle: React.CSSProperties =
    animation === "pulse"
      ? { animation: `sk-pulse ${duration}s ease-in-out infinite` }
      : {};

  return (
    <span
      aria-hidden="true"
      className={`
        relative block overflow-hidden
        ${themeBase[theme]}
        ${radiusClass[radius]}
        ${className}
      `}
      style={{ width, height, display: "block", ...animationStyle, ...style }}
    >
      {animation === "wave" && (
        <span
          className={`
            absolute inset-0
            bg-gradient-to-r ${themeWaveHighlight[theme]}
          `}
          style={{
            animation: `sk-wave ${duration}s ease-in-out infinite`,
            width: "50%",
          }}
        />
      )}
    </span>
  );
}

// ─── Shared resolved props helper ─────────────────────────────────────────────

interface ResolvedSkeletonProps {
  animation: SkeletonAnimation;
  radius:    SkeletonRadius;
  speed:     SkeletonSpeed;
  theme:     SkeletonTheme;
}

/** Merge context defaults with per-instance overrides */
function useResolved(overrides: Partial<ResolvedSkeletonProps>): ResolvedSkeletonProps {
  const { state } = useSkeletonContext();
  return {
    animation: overrides.animation ?? state.animation,
    radius:    overrides.radius    ?? state.radius,
    speed:     overrides.speed     ?? state.speed,
    theme:     overrides.theme     ?? state.theme,
  };
}

// ─── 1. Skeleton.Text ─────────────────────────────────────────────────────────
// Renders N lines of text-shaped bones, last line shorter (MUI default behaviour)

export interface SkeletonTextProps {
  lines?:       number;
  /** Width of the last line as % of full width — matches MUI's ~70% default */
  lastLineWidth?: string;
  lineHeight?:  string | number;
  gap?:         string | number;
  animation?:   SkeletonAnimation;
  radius?:      SkeletonRadius;
  speed?:       SkeletonSpeed;
  theme?:       SkeletonTheme;
  className?:   string;
  lineClassName?: string;
}

export function SkeletonText({
  lines          = 3,
  lastLineWidth  = "60%",
  lineHeight     = "1em",
  gap            = "0.5em",
  animation,
  radius,
  speed,
  theme,
  className      = "",
  lineClassName  = "",
}: SkeletonTextProps) {
  const r = useResolved({ animation, radius, speed, theme });

  return (
    <span className={`block w-full ${className}`} role="presentation">
      {Array.from({ length: lines }).map((_, i) => (
        <Bone
          key={i}
          width={i === lines - 1 && lines > 1 ? lastLineWidth : "100%"}
          height={lineHeight}
          animation={r.animation}
          radius={r.radius}
          speed={r.speed}
          theme={r.theme}
          className={lineClassName}
          style={{ marginBottom: i < lines - 1 ? gap : 0 }}
        />
      ))}
    </span>
  );
}

// ─── 2. Skeleton.Rect ─────────────────────────────────────────────────────────
// Generic rectangular block — use for cards, images, banners

export interface SkeletonRectProps {
  width?:     string | number;
  height?:    string | number;
  animation?: SkeletonAnimation;
  radius?:    SkeletonRadius;
  speed?:     SkeletonSpeed;
  theme?:     SkeletonTheme;
  className?: string;
  style?:     React.CSSProperties;
}

export function SkeletonRect({
  width     = "100%",
  height    = 120,
  animation,
  radius,
  speed,
  theme,
  className = "",
  style,
}: SkeletonRectProps) {
  const r = useResolved({ animation, radius, speed, theme });
  return (
    <Bone
      width={width}
      height={height}
      animation={r.animation}
      radius={r.radius}
      speed={r.speed}
      theme={r.theme}
      className={className}
      style={style}
    />
  );
}

// ─── 3. Skeleton.Circle ───────────────────────────────────────────────────────
// Avatar / icon placeholder — always radius="full"

export interface SkeletonCircleProps {
  size?:      string | number;
  animation?: SkeletonAnimation;
  speed?:     SkeletonSpeed;
  theme?:     SkeletonTheme;
  className?: string;
}

export function SkeletonCircle({
  size      = 40,
  animation,
  speed,
  theme,
  className = "",
}: SkeletonCircleProps) {
  const r = useResolved({ animation, radius: "full", speed, theme });
  return (
    <Bone
      width={size}
      height={size}
      animation={r.animation}
      radius="full"
      speed={r.speed}
      theme={r.theme}
      className={`shrink-0 ${className}`}
    />
  );
}

// ─── 4. Skeleton.Button ───────────────────────────────────────────────────────
// Matches common button dimensions

export interface SkeletonButtonProps {
  width?:     string | number;
  height?:    string | number;
  animation?: SkeletonAnimation;
  radius?:    SkeletonRadius;
  speed?:     SkeletonSpeed;
  theme?:     SkeletonTheme;
  className?: string;
}

export function SkeletonButton({
  width     = 96,
  height    = 36,
  animation,
  radius    = "lg",
  speed,
  theme,
  className = "",
}: SkeletonButtonProps) {
  const r = useResolved({ animation, radius, speed, theme });
  return (
    <Bone
      width={width}
      height={height}
      animation={r.animation}
      radius={r.radius}
      speed={r.speed}
      theme={r.theme}
      className={`inline-block ${className}`}
    />
  );
}

// ─── 5. Skeleton.Avatar (with optional text lines) ────────────────────────────
// MUI-style avatar + text side-by-side row

export interface SkeletonAvatarProps {
  avatarSize?:  string | number;
  lines?:       number;
  gap?:         string | number;
  animation?:   SkeletonAnimation;
  radius?:      SkeletonRadius;
  speed?:       SkeletonSpeed;
  theme?:       SkeletonTheme;
  className?:   string;
  avatarClassName?: string;
  textClassName?:   string;
}

export function SkeletonAvatar({
  avatarSize    = 44,
  lines         = 2,
  gap           = "0.75rem",
  animation,
  radius,
  speed,
  theme,
  className     = "",
  avatarClassName = "",
  textClassName   = "",
}: SkeletonAvatarProps) {
  const r = useResolved({ animation, radius, speed, theme });

  return (
    <span
      className={`flex items-center ${className}`}
      style={{ gap }}
      role="presentation"
    >
      <SkeletonCircle
        size={avatarSize}
        animation={r.animation}
        speed={r.speed}
        theme={r.theme}
        className={avatarClassName}
      />
      <span className="flex-1 min-w-0">
        <SkeletonText
          lines={lines}
          animation={r.animation}
          radius={r.radius}
          speed={r.speed}
          theme={r.theme}
          className={textClassName}
        />
      </span>
    </span>
  );
}

// ─── 6. Skeleton.Card ─────────────────────────────────────────────────────────
// Image + title + body lines — common card pattern

export interface SkeletonCardProps {
  imageHeight?:  string | number;
  lines?:        number;
  gap?:          string | number;
  animation?:    SkeletonAnimation;
  radius?:       SkeletonRadius;
  speed?:        SkeletonSpeed;
  theme?:        SkeletonTheme;
  className?:    string;
  imageClassName?: string;
  bodyClassName?:  string;
}

export function SkeletonCard({
  imageHeight  = 180,
  lines        = 3,
  gap          = "0.75rem",
  animation,
  radius       = "md",
  speed,
  theme,
  className    = "",
  imageClassName = "",
  bodyClassName  = "",
}: SkeletonCardProps) {
  const r = useResolved({ animation, radius, speed, theme });

  return (
    <span
      className={`block w-full overflow-hidden ${radiusClass[r.radius]} ${className}`}
      role="presentation"
    >
      <SkeletonRect
        width="100%"
        height={imageHeight}
        animation={r.animation}
        radius="none"
        speed={r.speed}
        theme={r.theme}
        className={imageClassName}
      />
      <span className={`block p-4 ${bodyClassName}`} style={{ display: "block" }}>
        {/* Title bone — slightly taller */}
        <Bone
          width="55%"
          height="1.1em"
          animation={r.animation}
          radius={r.radius}
          speed={r.speed}
          theme={r.theme}
          style={{ marginBottom: gap }}
        />
        <SkeletonText
          lines={lines}
          animation={r.animation}
          radius={r.radius}
          speed={r.speed}
          theme={r.theme}
        />
      </span>
    </span>
  );
}

// ─── 7. Skeleton.Table ────────────────────────────────────────────────────────
// Rows × columns of rectangular cells

export interface SkeletonTableProps {
  rows?:       number;
  columns?:    number;
  rowHeight?:  string | number;
  gap?:        string | number;
  animation?:  SkeletonAnimation;
  radius?:     SkeletonRadius;
  speed?:      SkeletonSpeed;
  theme?:      SkeletonTheme;
  className?:  string;
  rowClassName?:  string;
  cellClassName?: string;
}

export function SkeletonTable({
  rows        = 4,
  columns     = 4,
  rowHeight   = 36,
  gap         = "0.5rem",
  animation,
  radius      = "sm",
  speed,
  theme,
  className   = "",
  rowClassName  = "",
  cellClassName = "",
}: SkeletonTableProps) {
  const r = useResolved({ animation, radius, speed, theme });

  return (
    <span
      className={`block w-full ${className}`}
      role="presentation"
      style={{ display: "flex", flexDirection: "column", gap }}
    >
      {Array.from({ length: rows }).map((_, ri) => (
        <span
          key={ri}
          className={`flex w-full ${rowClassName}`}
          style={{ gap, display: "flex" }}
        >
          {Array.from({ length: columns }).map((_, ci) => (
            <Bone
              key={ci}
              width="100%"
              height={rowHeight}
              animation={r.animation}
              radius={r.radius}
              speed={r.speed}
              theme={r.theme}
              className={`flex-1 ${cellClassName}`}
            />
          ))}
        </span>
      ))}
    </span>
  );
}

// ─── 8. Skeleton.List ─────────────────────────────────────────────────────────
// Vertical list of avatar rows — sidebar / feed pattern

export interface SkeletonListProps {
  items?:       number;
  avatarSize?:  string | number;
  lines?:       number;
  gap?:         string | number;
  animation?:   SkeletonAnimation;
  radius?:      SkeletonRadius;
  speed?:       SkeletonSpeed;
  theme?:       SkeletonTheme;
  className?:   string;
  itemClassName?: string;
}

export function SkeletonList({
  items         = 4,
  avatarSize    = 40,
  lines         = 2,
  gap           = "1rem",
  animation,
  radius,
  speed,
  theme,
  className     = "",
  itemClassName = "",
}: SkeletonListProps) {
  const r = useResolved({ animation, radius, speed, theme });

  return (
    <span
      className={`block w-full ${className}`}
      role="presentation"
      style={{ display: "flex", flexDirection: "column", gap }}
    >
      {Array.from({ length: items }).map((_, i) => (
        <SkeletonAvatar
          key={i}
          avatarSize={avatarSize}
          lines={lines}
          animation={r.animation}
          radius={r.radius}
          speed={r.speed}
          theme={r.theme}
          className={itemClassName}
        />
      ))}
    </span>
  );
}

// ─── 9. Skeleton.Input ────────────────────────────────────────────────────────
// Form field with optional label bone above

export interface SkeletonInputProps {
  width?:       string | number;
  height?:      string | number;
  showLabel?:   boolean;
  labelWidth?:  string | number;
  gap?:         string | number;
  animation?:   SkeletonAnimation;
  radius?:      SkeletonRadius;
  speed?:       SkeletonSpeed;
  theme?:       SkeletonTheme;
  className?:   string;
}

export function SkeletonInput({
  width      = "100%",
  height     = 38,
  showLabel  = true,
  labelWidth = "35%",
  gap        = "0.4rem",
  animation,
  radius     = "md",
  speed,
  theme,
  className  = "",
}: SkeletonInputProps) {
  const r = useResolved({ animation, radius, speed, theme });

  return (
    <span
      className={`block ${className}`}
      style={{ display: "flex", flexDirection: "column", gap, width }}
      role="presentation"
    >
      {showLabel && (
        <Bone
          width={labelWidth}
          height="0.75em"
          animation={r.animation}
          radius={r.radius}
          speed={r.speed}
          theme={r.theme}
        />
      )}
      <Bone
        width="100%"
        height={height}
        animation={r.animation}
        radius={r.radius}
        speed={r.speed}
        theme={r.theme}
      />
    </span>
  );
}

// ─── 10. Skeleton.Image ───────────────────────────────────────────────────────
// Aspect-ratio aware image placeholder (uses padding-bottom trick)

export interface SkeletonImageProps {
  width?:      string | number;
  aspectRatio?: string;
  animation?:  SkeletonAnimation;
  radius?:     SkeletonRadius;
  speed?:      SkeletonSpeed;
  theme?:      SkeletonTheme;
  className?:  string;
}

export function SkeletonImage({
  width       = "100%",
  aspectRatio = "16/9",
  animation,
  radius      = "md",
  speed,
  theme,
  className   = "",
}: SkeletonImageProps) {
  const r = useResolved({ animation, radius, speed, theme });

  return (
    <span
      className={`block ${radiusClass[r.radius]} overflow-hidden ${themeBase[r.theme]} relative ${className}`}
      style={{ width, aspectRatio, display: "block" }}
      role="presentation"
    >
      <Bone
        width="100%"
        height="100%"
        animation={r.animation}
        radius="none"
        speed={r.speed}
        theme={r.theme}
        style={{ position: "absolute", inset: 0 }}
      />
    </span>
  );
}

// ─── Compound Skeleton (root + namespace) ─────────────────────────────────────

export interface SkeletonProps {
  /** Delegates to SkeletonRect when used as a standalone element */
  width?:     string | number;
  height?:    string | number;
  animation?: SkeletonAnimation;
  radius?:    SkeletonRadius;
  speed?:     SkeletonSpeed;
  theme?:     SkeletonTheme;
  className?: string;
  style?:     React.CSSProperties;
}

export function Skeleton(props: SkeletonProps) {
  return <SkeletonRect {...props} />;
}

// Attach named exports as static properties for compound usage
Skeleton.Text    = SkeletonText;
Skeleton.Rect    = SkeletonRect;
Skeleton.Circle  = SkeletonCircle;
Skeleton.Button  = SkeletonButton;
Skeleton.Avatar  = SkeletonAvatar;
Skeleton.Card    = SkeletonCard;
Skeleton.Table   = SkeletonTable;
Skeleton.List    = SkeletonList;
Skeleton.Input   = SkeletonInput;
Skeleton.Image   = SkeletonImage;

// ─── Wrapper: SkeletonGroup ───────────────────────────────────────────────────
// Wraps children in a provider; when loading=false, fades children in.

export interface SkeletonGroupProps extends SkeletonProviderProps {
  children:          React.ReactNode;
  /** Content to show when NOT loading — optional */
  fallback?:         React.ReactNode;
  containerClassName?: string;
}

export function SkeletonGroup({
  children,
  fallback,
  containerClassName = "",
  ...providerProps
}: SkeletonGroupProps) {
  return (
    <SkeletonProvider {...providerProps}>
      <SkeletonGroupInner
        fallback={fallback}
        containerClassName={containerClassName}
      >
        {children}
      </SkeletonGroupInner>
    </SkeletonProvider>
  );
}

interface SkeletonGroupInnerProps {
  children:            React.ReactNode;
  fallback?:           React.ReactNode;
  containerClassName?: string;
}

function SkeletonGroupInner({
  children,
  fallback,
  containerClassName = "",
}: SkeletonGroupInnerProps) {
  const { state } = useSkeletonContext();

  return (
    <div className={`relative ${containerClassName}`}>
      <AnimatePresence mode="wait">
        {state.loading ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {fallback ?? children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Re-exports ───────────────────────────────────────────────────────────────

export { SkeletonProvider, useSkeletonContext };
export type { SkeletonAnimation, SkeletonRadius, SkeletonSpeed, SkeletonTheme };