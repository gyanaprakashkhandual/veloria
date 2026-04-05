import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LoaderProvider,
  useLoaderContext,
  type LoaderProviderProps,
  type LoaderSize,
  type LoaderVariant,
  type LoaderTrack,
  type LoaderSpeed,
} from "./Loader.context";

// ─── Size Config ──────────────────────────────────────────────────────────────

const sizeConfig: Record<
  LoaderSize,
  {
    spinnerSize: number;
    strokeWidth: number;
    labelText: string;
    gap: string;
    wrapperSize: string;
  }
> = {
  xs: {
    spinnerSize: 14,
    strokeWidth: 2,
    labelText: "text-[10px]",
    gap: "gap-1.5",
    wrapperSize: "w-3.5 h-3.5",
  },
  sm: {
    spinnerSize: 18,
    strokeWidth: 2,
    labelText: "text-xs",
    gap: "gap-2",
    wrapperSize: "w-[18px] h-[18px]",
  },
  md: {
    spinnerSize: 24,
    strokeWidth: 2.5,
    labelText: "text-sm",
    gap: "gap-2.5",
    wrapperSize: "w-6 h-6",
  },
  lg: {
    spinnerSize: 32,
    strokeWidth: 3,
    labelText: "text-base",
    gap: "gap-3",
    wrapperSize: "w-8 h-8",
  },
  xl: {
    spinnerSize: 44,
    strokeWidth: 3.5,
    labelText: "text-lg",
    gap: "gap-3.5",
    wrapperSize: "w-11 h-11",
  },
};

// ─── Variant Config ───────────────────────────────────────────────────────────

const variantSpinnerColor: Record<LoaderVariant, string> = {
  default: "text-gray-500 dark:text-gray-400",
  primary: "text-blue-500 dark:text-blue-400",
  success: "text-emerald-500 dark:text-emerald-400",
  warning: "text-amber-500 dark:text-amber-400",
  danger: "text-red-500 dark:text-red-400",
};

const variantLabelColor: Record<LoaderVariant, string> = {
  default: "text-gray-500 dark:text-gray-400",
  primary: "text-blue-600 dark:text-blue-400",
  success: "text-emerald-600 dark:text-emerald-400",
  warning: "text-amber-600 dark:text-amber-400",
  danger: "text-red-600 dark:text-red-400",
};

const variantTrackColor: Record<LoaderVariant, string> = {
  default: "text-gray-200 dark:text-gray-700",
  primary: "text-blue-100 dark:text-blue-950/60",
  success: "text-emerald-100 dark:text-emerald-950/60",
  warning: "text-amber-100 dark:text-amber-950/60",
  danger: "text-red-100 dark:text-red-950/60",
};

// ─── Speed Config ─────────────────────────────────────────────────────────────

const speedDuration: Record<LoaderSpeed, number> = {
  slow: 1.4,
  normal: 0.9,
  fast: 0.55,
};

// ─── SVG Spinner ──────────────────────────────────────────────────────────────

interface SpinnerProps {
  size: LoaderSize;
  variant: LoaderVariant;
  track: LoaderTrack;
  speed: LoaderSpeed;
  className?: string;
}

function Spinner({ size, variant, track, speed, className = "" }: SpinnerProps) {
  const s = sizeConfig[size];
  const r = (s.spinnerSize - s.strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * r;
  const dashArray = `${circumference * 0.72} ${circumference * 0.28}`;
  const duration = speedDuration[speed];
  const center = s.spinnerSize / 2;

  return (
    <motion.svg
      width={s.spinnerSize}
      height={s.spinnerSize}
      viewBox={`0 0 ${s.spinnerSize} ${s.spinnerSize}`}
      fill="none"
      className={`shrink-0 ${className}`}
      animate={{ rotate: 360 }}
      transition={{
        repeat: Infinity,
        ease: "linear",
        duration,
      }}
      aria-hidden="true"
    >
      {/* Track ring */}
      {track === "visible" && (
        <circle
          cx={center}
          cy={center}
          r={r}
          stroke="currentColor"
          strokeWidth={s.strokeWidth}
          className={variantTrackColor[variant]}
        />
      )}
      {/* Spinning arc */}
      <circle
        cx={center}
        cy={center}
        r={r}
        stroke="currentColor"
        strokeWidth={s.strokeWidth}
        strokeLinecap="round"
        strokeDasharray={dashArray}
        className={variantSpinnerColor[variant]}
      />
    </motion.svg>
  );
}

// ─── Dots Variant ─────────────────────────────────────────────────────────────

interface DotsProps {
  size: LoaderSize;
  variant: LoaderVariant;
  speed: LoaderSpeed;
  className?: string;
}

function Dots({ size, variant, speed, className = "" }: DotsProps) {
  const s = sizeConfig[size];
  const dotSize = Math.max(4, Math.round(s.spinnerSize * 0.22));
  const duration = speedDuration[speed] * 0.8;

  return (
    <div
      className={`flex items-center ${s.gap} ${className}`}
      aria-hidden="true"
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className={`rounded-full block ${variantSpinnerColor[variant]}`}
          style={{
            width: dotSize,
            height: dotSize,
            background: "currentColor",
          }}
          animate={{ opacity: [0.25, 1, 0.25], scale: [0.8, 1, 0.8] }}
          transition={{
            repeat: Infinity,
            ease: "easeInOut",
            duration,
            delay: i * (duration / 3),
          }}
        />
      ))}
    </div>
  );
}

// ─── Pulse Variant ────────────────────────────────────────────────────────────

interface PulseProps {
  size: LoaderSize;
  variant: LoaderVariant;
  speed: LoaderSpeed;
  className?: string;
}

function Pulse({ size, variant, speed, className = "" }: PulseProps) {
  const s = sizeConfig[size];
  const duration = speedDuration[speed] * 1.1;

  return (
    <div
      className={`relative flex items-center justify-center ${s.wrapperSize} ${className}`}
      aria-hidden="true"
    >
      {/* Outer ping */}
      <motion.span
        className={`absolute inset-0 rounded-full ${variantSpinnerColor[variant]}`}
        style={{ background: "currentColor", opacity: 0 }}
        animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
        transition={{ repeat: Infinity, ease: "easeOut", duration }}
      />
      {/* Inner dot */}
      <span
        className={`rounded-full block ${variantSpinnerColor[variant]}`}
        style={{
          width: Math.round(s.spinnerSize * 0.35),
          height: Math.round(s.spinnerSize * 0.35),
          background: "currentColor",
        }}
      />
    </div>
  );
}

// ─── Bar Variant ──────────────────────────────────────────────────────────────

interface BarProps {
  size: LoaderSize;
  variant: LoaderVariant;
  track: LoaderTrack;
  speed: LoaderSpeed;
  className?: string;
}

function Bar({ size, variant, track, speed, className = "" }: BarProps) {
  const s = sizeConfig[size];
  const height = Math.max(3, Math.round(s.spinnerSize * 0.14));
  const width = s.spinnerSize * 3;
  const duration = speedDuration[speed] * 1.2;

  return (
    <div
      className={`overflow-hidden rounded-full ${track === "visible" ? variantTrackColor[variant] : "bg-transparent"} ${className}`}
      style={{ width, height, background: track === "visible" ? "currentColor" : "transparent" }}
      aria-hidden="true"
    >
      {track === "visible" && (
        <div
          className={`${variantTrackColor[variant]} w-full h-full rounded-full`}
          style={{ background: "currentColor" }}
        />
      )}
      <motion.div
        className={`${variantSpinnerColor[variant]} h-full rounded-full -mt-full`}
        style={{
          background: "currentColor",
          width: "45%",
          marginTop: track === "visible" ? -height : 0,
        }}
        animate={{ x: [-width * 0.55, width] }}
        transition={{
          repeat: Infinity,
          ease: [0.4, 0, 0.6, 1],
          duration,
        }}
      />
    </div>
  );
}

// ─── Loader Types ─────────────────────────────────────────────────────────────

export type LoaderType = "spinner" | "dots" | "pulse" | "bar";

// ─── Core Loader Component (reads from context) ───────────────────────────────

interface LoaderCoreProps {
  type?: LoaderType;
  className?: string;
  labelClassName?: string;
  spinnerClassName?: string;
  labelPlacement?: "right" | "left" | "bottom" | "top";
}

function LoaderCore({
  type = "spinner",
  className = "",
  labelClassName = "",
  spinnerClassName = "",
  labelPlacement = "right",
}: LoaderCoreProps) {
  const { state } = useLoaderContext();
  const { isLoading, size, variant, track, speed, label } = state;
  const s = sizeConfig[size];

  const isVertical = labelPlacement === "bottom" || labelPlacement === "top";
  const reverseOrder = labelPlacement === "left" || labelPlacement === "top";

  const renderVisual = () => {
    if (type === "dots") {
      return <Dots size={size} variant={variant} speed={speed} className={spinnerClassName} />;
    }
    if (type === "pulse") {
      return <Pulse size={size} variant={variant} speed={speed} className={spinnerClassName} />;
    }
    if (type === "bar") {
      return (
        <Bar
          size={size}
          variant={variant}
          track={track}
          speed={speed}
          className={spinnerClassName}
        />
      );
    }
    return (
      <Spinner
        size={size}
        variant={variant}
        track={track}
        speed={speed}
        className={spinnerClassName}
      />
    );
  };

  const visual = renderVisual();
  const labelEl = label ? (
    <span
      className={`font-medium leading-none ${s.labelText} ${variantLabelColor[variant]} ${labelClassName}`}
    >
      {label}
    </span>
  ) : null;

  const content = (
    <div
      className={`inline-flex items-center ${isVertical ? "flex-col" : "flex-row"} ${s.gap} ${reverseOrder ? (isVertical ? "flex-col-reverse" : "flex-row-reverse") : ""} ${className}`}
      role="status"
      aria-live="polite"
      aria-label={label ?? "Loading"}
    >
      {visual}
      {labelEl}
      <span className="sr-only">{label ?? "Loading…"}</span>
    </div>
  );

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          key="loader"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
        >
          {content}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Standalone Loader (no context needed) ────────────────────────────────────

export interface LoaderProps {
  /** Show or hide the loader */
  loading?: boolean;
  size?: LoaderSize;
  variant?: LoaderVariant;
  track?: LoaderTrack;
  speed?: LoaderSpeed;
  type?: LoaderType;
  label?: string;
  labelPlacement?: "right" | "left" | "bottom" | "top";
  className?: string;
  labelClassName?: string;
  spinnerClassName?: string;
}

export function Loader({
  loading = true,
  size = "md",
  variant = "default",
  track = "visible",
  speed = "normal",
  type = "spinner",
  label,
  labelPlacement = "right",
  className = "",
  labelClassName = "",
  spinnerClassName = "",
}: LoaderProps) {
  return (
    <LoaderProvider
      size={size}
      variant={variant}
      track={track}
      speed={speed}
      label={label}
      defaultLoading={loading}
    >
      <LoaderCore
        type={type}
        className={className}
        labelClassName={labelClassName}
        spinnerClassName={spinnerClassName}
        labelPlacement={labelPlacement}
      />
    </LoaderProvider>
  );
}

// ─── Controlled Loader (uses external context) ────────────────────────────────

export interface ControlledLoaderProps extends LoaderCoreProps {
  type?: LoaderType;
}

export function ControlledLoader(props: ControlledLoaderProps) {
  return <LoaderCore {...props} />;
}

// ─── Overlay Loader ───────────────────────────────────────────────────────────

export interface LoaderOverlayProps extends LoaderProps {
  /** Element to cover — defaults to filling parent */
  fullScreen?: boolean;
  overlayClassName?: string;
}

export function LoaderOverlay({
  loading = true,
  size = "lg",
  variant = "primary",
  track = "visible",
  speed = "normal",
  type = "spinner",
  label,
  labelPlacement = "bottom",
  fullScreen = false,
  className = "",
  labelClassName = "",
  spinnerClassName = "",
  overlayClassName = "",
}: LoaderOverlayProps) {
  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={`
            flex items-center justify-center
            bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm
            ${fullScreen ? "fixed inset-0 z-50" : "absolute inset-0 z-10 rounded-[inherit]"}
            ${overlayClassName}
          `}
        >
          <Loader
            loading={loading}
            size={size}
            variant={variant}
            track={track}
            speed={speed}
            type={type}
            label={label}
            labelPlacement={labelPlacement}
            className={className}
            labelClassName={labelClassName}
            spinnerClassName={spinnerClassName}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Inline Spinner (zero-config convenience) ─────────────────────────────────

export interface InlineSpinnerProps {
  size?: LoaderSize;
  variant?: LoaderVariant;
  className?: string;
}

export function InlineSpinner({
  size = "sm",
  variant = "default",
  className = "",
}: InlineSpinnerProps) {
  const s = sizeConfig[size];
  return (
    <Spinner
      size={size}
      variant={variant}
      track="visible"
      speed="normal"
      className={`inline-block align-middle ${className}`}
    />
  );
}

// ─── Re-exports ───────────────────────────────────────────────────────────────

export { LoaderProvider, useLoaderContext };
export type { LoaderSize, LoaderVariant, LoaderTrack, LoaderSpeed };