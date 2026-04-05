import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Camera, Check, Plus } from "lucide-react";
import {
  AvatarProvider,
  AvatarGroupProvider,
  useAvatarContext,
  useAvatarGroupContext,
  type AvatarProviderProps,
  type AvatarSize,
  type AvatarShape,
  type AvatarStatus,
  type AvatarGroupLayout,
  type PresencePosition,
} from "./Avatar.context";

const sizeConfig = {
  xs: {
    dim: "w-6 h-6",
    dimPx: 24,
    text: "text-[9px]",
    iconSize: 10,
    statusDim: "w-1.5 h-1.5",
    statusBorder: "ring-1",
    badgeText: "text-[8px]",
    badgeDim: "min-w-[14px] h-[14px]",
    badgePx: "px-0.5",
    tooltipText: "text-[10px]",
    ringWidth: "ring-1",
    uploadIconSize: 8,
    notifDim: "w-2 h-2",
  },
  sm: {
    dim: "w-8 h-8",
    dimPx: 32,
    text: "text-xs",
    iconSize: 13,
    statusDim: "w-2 h-2",
    statusBorder: "ring-[1.5px]",
    badgeText: "text-[9px]",
    badgeDim: "min-w-[16px] h-[16px]",
    badgePx: "px-1",
    tooltipText: "text-xs",
    ringWidth: "ring-[1.5px]",
    uploadIconSize: 10,
    notifDim: "w-2.5 h-2.5",
  },
  md: {
    dim: "w-10 h-10",
    dimPx: 40,
    text: "text-sm",
    iconSize: 16,
    statusDim: "w-2.5 h-2.5",
    statusBorder: "ring-2",
    badgeText: "text-[10px]",
    badgeDim: "min-w-[18px] h-[18px]",
    badgePx: "px-1",
    tooltipText: "text-xs",
    ringWidth: "ring-2",
    uploadIconSize: 12,
    notifDim: "w-3 h-3",
  },
  lg: {
    dim: "w-12 h-12",
    dimPx: 48,
    text: "text-base",
    iconSize: 20,
    statusDim: "w-3 h-3",
    statusBorder: "ring-2",
    badgeText: "text-[11px]",
    badgeDim: "min-w-[20px] h-[20px]",
    badgePx: "px-1.5",
    tooltipText: "text-xs",
    ringWidth: "ring-2",
    uploadIconSize: 14,
    notifDim: "w-3.5 h-3.5",
  },
  xl: {
    dim: "w-16 h-16",
    dimPx: 64,
    text: "text-xl",
    iconSize: 26,
    statusDim: "w-3.5 h-3.5",
    statusBorder: "ring-2",
    badgeText: "text-xs",
    badgeDim: "min-w-[22px] h-[22px]",
    badgePx: "px-1.5",
    tooltipText: "text-sm",
    ringWidth: "ring-[3px]",
    uploadIconSize: 16,
    notifDim: "w-4 h-4",
  },
  "2xl": {
    dim: "w-20 h-20",
    dimPx: 80,
    text: "text-2xl",
    iconSize: 32,
    statusDim: "w-4 h-4",
    statusBorder: "ring-[3px]",
    badgeText: "text-xs",
    badgeDim: "min-w-[24px] h-[24px]",
    badgePx: "px-2",
    tooltipText: "text-sm",
    ringWidth: "ring-[3px]",
    uploadIconSize: 20,
    notifDim: "w-4 h-4",
  },
};

const shapeStyles: Record<AvatarShape, string> = {
  circle: "rounded-full",
  square: "rounded-none",
  rounded: "rounded-xl",
};

const statusColorMap: Record<AvatarStatus, string> = {
  online: "bg-emerald-500",
  offline: "bg-gray-300 dark:bg-gray-600",
  away: "bg-amber-400",
  busy: "bg-red-500",
  none: "",
};

const statusRingMap: Record<AvatarStatus, string> = {
  online: "ring-white dark:ring-gray-900",
  offline: "ring-white dark:ring-gray-900",
  away: "ring-white dark:ring-gray-900",
  busy: "ring-white dark:ring-gray-900",
  none: "",
};

const presencePositionMap: Record<PresencePosition, string> = {
  "top-right": "top-0 right-0 translate-x-[20%] -translate-y-[20%]",
  "top-left": "top-0 left-0 -translate-x-[20%] -translate-y-[20%]",
  "bottom-right": "bottom-0 right-0 translate-x-[20%] translate-y-[20%]",
  "bottom-left": "bottom-0 left-0 -translate-x-[20%] translate-y-[20%]",
};

const colorPalette = [
  "bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300",
  "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300",
  "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300",
  "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300",
  "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300",
  "bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300",
  "bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300",
  "bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300",
];

function getColorFromName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colorPalette[Math.abs(hash) % colorPalette.length];
}

function getInitials(name: string, maxChars = 2): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, maxChars).toUpperCase();
  return parts
    .slice(0, maxChars)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

export interface AvatarImageProps {
  src: string;
  alt?: string;
  fallbackName?: string;
  fallbackIcon?: React.ReactNode;
  className?: string;
}

export function AvatarImage({
  src,
  alt = "",
  fallbackName,
  fallbackIcon,
  className = "",
}: AvatarImageProps) {
  const { state, setError } = useAvatarContext();
  const s = sizeConfig[state.size];
  const [imgError, setImgError] = useState(false);

  const handleError = useCallback(() => {
    setImgError(true);
    setError(true);
  }, [setError]);

  if (imgError) {
    if (fallbackName) {
      return (
        <AvatarInitials name={fallbackName} className={className} />
      );
    }
    return (
      <span className={`flex items-center justify-center w-full h-full text-gray-400 dark:text-gray-500 ${className}`}>
        {fallbackIcon ?? <User size={s.iconSize} />}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={handleError}
      draggable={false}
      className={`w-full h-full object-cover select-none ${className}`}
    />
  );
}

export interface AvatarInitialsProps {
  name: string;
  maxChars?: number;
  colorSeed?: string;
  customColor?: string;
  className?: string;
}

export function AvatarInitials({
  name,
  maxChars = 2,
  colorSeed,
  customColor,
  className = "",
}: AvatarInitialsProps) {
  const { state } = useAvatarContext();
  const s = sizeConfig[state.size];
  const initials = getInitials(name, maxChars);
  const colorClass = customColor ?? getColorFromName(colorSeed ?? name);

  return (
    <span
      className={`flex items-center justify-center w-full h-full font-semibold leading-none select-none ${s.text} ${colorClass} ${className}`}
    >
      {initials}
    </span>
  );
}

export interface AvatarIconProps {
  icon?: React.ReactNode;
  colorClass?: string;
  className?: string;
}

export function AvatarIcon({
  icon,
  colorClass = "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400",
  className = "",
}: AvatarIconProps) {
  const { state } = useAvatarContext();
  const s = sizeConfig[state.size];

  return (
    <span className={`flex items-center justify-center w-full h-full ${colorClass} ${className}`}>
      {icon ?? <User size={s.iconSize} />}
    </span>
  );
}

export interface AvatarStatusIndicatorProps {
  status?: AvatarStatus;
  animated?: boolean;
  className?: string;
}

export function AvatarStatusIndicator({
  status,
  animated = true,
  className = "",
}: AvatarStatusIndicatorProps) {
  const { state } = useAvatarContext();
  const s = sizeConfig[state.size];
  const resolvedStatus = status ?? state.status;

  if (resolvedStatus === "none") return null;

  return (
    <span
      className={`absolute ${presencePositionMap[state.presencePosition]} ${s.statusDim} ${s.statusBorder} ${statusColorMap[resolvedStatus]} ${statusRingMap[resolvedStatus]} rounded-full z-10 ${className}`}
    >
      {animated && resolvedStatus === "online" && (
        <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-60" />
      )}
    </span>
  );
}

export interface AvatarBadgeProps {
  content?: React.ReactNode;
  color?: "gray" | "red" | "emerald" | "blue" | "amber" | "violet";
  position?: PresencePosition;
  className?: string;
}

const badgeColorMap: Record<NonNullable<AvatarBadgeProps["color"]>, string> = {
  gray: "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200",
  red: "bg-red-500 text-white",
  emerald: "bg-emerald-500 text-white",
  blue: "bg-blue-500 text-white",
  amber: "bg-amber-400 text-white",
  violet: "bg-violet-500 text-white",
};

export function AvatarBadge({
  content,
  color = "red",
  position = "top-right",
  className = "",
}: AvatarBadgeProps) {
  const { state } = useAvatarContext();
  const s = sizeConfig[state.size];

  return (
    <span
      className={`absolute ${presencePositionMap[position]} ${s.badgeDim} ${s.badgePx} ${s.badgeText} font-bold flex items-center justify-center rounded-full ring-2 ring-white dark:ring-gray-900 z-10 ${badgeColorMap[color]} ${className}`}
    >
      {content}
    </span>
  );
}

export interface AvatarVerifiedBadgeProps {
  position?: PresencePosition;
  icon?: React.ReactNode;
  color?: string;
  className?: string;
}

export function AvatarVerifiedBadge({
  position = "bottom-right",
  icon,
  color = "bg-blue-500 text-white",
  className = "",
}: AvatarVerifiedBadgeProps) {
  const { state } = useAvatarContext();
  const s = sizeConfig[state.size];

  return (
    <span
      className={`absolute ${presencePositionMap[position]} ${s.statusDim} flex items-center justify-center rounded-full ring-2 ring-white dark:ring-gray-900 z-10 ${color} ${className}`}
      style={{ width: `calc(${sizeConfig[state.size].dimPx * 0.35}px)`, height: `calc(${sizeConfig[state.size].dimPx * 0.35}px)` }}
    >
      {icon ?? <Check size={sizeConfig[state.size].dimPx * 0.2} strokeWidth={3} />}
    </span>
  );
}

export interface AvatarUploadOverlayProps {
  onUpload?: (file: File) => void;
  accept?: string;
  className?: string;
}

export function AvatarUploadOverlay({
  onUpload,
  accept = "image/*",
  className = "",
}: AvatarUploadOverlayProps) {
  const { state } = useAvatarContext();
  const s = sizeConfig[state.size];

  return (
    <label
      className={`absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-150 cursor-pointer bg-black/40 rounded-[inherit] z-20 ${className}`}
    >
      <Camera size={s.uploadIconSize} className="text-white drop-shadow" />
      <input
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && onUpload) onUpload(file);
        }}
      />
    </label>
  );
}

export interface AvatarTooltipProps {
  label: string;
  className?: string;
}

export function AvatarTooltip({ label, className = "" }: AvatarTooltipProps) {
  const { state } = useAvatarContext();
  const s = sizeConfig[state.size];

  return (
    <span
      role="tooltip"
      className={`absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap ${s.tooltipText} font-medium text-white bg-gray-900 dark:bg-gray-700 rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-30 ${className}`}
    >
      {label}
    </span>
  );
}

export interface AvatarRingProps {
  color?: string;
  animated?: boolean;
  className?: string;
}

export function AvatarRing({
  color = "ring-gray-900 dark:ring-white",
  animated = false,
  className = "",
}: AvatarRingProps) {
  const { state } = useAvatarContext();
  const s = sizeConfig[state.size];

  return (
    <span
      className={`absolute inset-0 rounded-[inherit] ${s.ringWidth} ${color} pointer-events-none z-10 ${animated ? "animate-pulse" : ""} ${className}`}
    />
  );
}

export interface AvatarRootProps {
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export function AvatarRoot({
  children,
  onClick,
  className = "",
  style,
}: AvatarRootProps) {
  const { state, avatarRef } = useAvatarContext();
  const s = sizeConfig[state.size];
  const shapeClass = shapeStyles[state.shape];
  const isClickable = !!onClick || state.isInteractive;

  return (
    <div
      ref={avatarRef}
      onClick={onClick}
      style={style}
      className={`relative inline-flex shrink-0 overflow-hidden select-none group ${s.dim} ${shapeClass} ${isClickable ? "cursor-pointer" : ""} ${state.disabled ? "opacity-50 pointer-events-none" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

export interface AvatarProps extends Omit<AvatarProviderProps, "children"> {
  src?: string;
  alt?: string;
  name?: string;
  icon?: React.ReactNode;
  status?: AvatarStatus;
  statusAnimated?: boolean;
  badge?: React.ReactNode;
  badgeCount?: number;
  badgeColor?: AvatarBadgeProps["color"];
  verified?: boolean;
  verifiedIcon?: React.ReactNode;
  ring?: boolean;
  ringColor?: string;
  ringAnimated?: boolean;
  tooltip?: string;
  uploadable?: boolean;
  onUpload?: (file: File) => void;
  onClick?: () => void;
  className?: string;
  rootClassName?: string;
  style?: React.CSSProperties;
}

export function Avatar({
  src,
  alt,
  name,
  icon,
  status = "none",
  statusAnimated = true,
  badge,
  badgeCount,
  badgeColor = "red",
  verified = false,
  verifiedIcon,
  ring = false,
  ringColor,
  ringAnimated = false,
  tooltip,
  uploadable = false,
  onUpload,
  onClick,
  className = "",
  rootClassName = "",
  style,
  ...providerProps
}: AvatarProps) {
  return (
    <AvatarProvider {...providerProps} status={status} isInteractive={!!onClick || !!uploadable}>
      <AvatarRoot onClick={onClick} className={rootClassName} style={style}>
        <div className={`w-full h-full ${className}`}>
          {src ? (
            <AvatarImage src={src} alt={alt ?? name ?? ""} fallbackName={name} fallbackIcon={icon} />
          ) : name ? (
            <AvatarInitials name={name} />
          ) : (
            <AvatarIcon icon={icon} />
          )}
        </div>

        {status !== "none" && (
          <AvatarStatusIndicator animated={statusAnimated} />
        )}

        {(badge !== undefined || badgeCount !== undefined) && (
          <AvatarBadge
            content={badgeCount !== undefined ? (badgeCount > 99 ? "99+" : badgeCount) : badge}
            color={badgeColor}
          />
        )}

        {verified && (
          <AvatarVerifiedBadge icon={verifiedIcon} />
        )}

        {ring && (
          <AvatarRing color={ringColor} animated={ringAnimated} />
        )}

        {uploadable && (
          <AvatarUploadOverlay onUpload={onUpload} />
        )}

        {tooltip && (
          <AvatarTooltip label={tooltip} />
        )}
      </AvatarRoot>
    </AvatarProvider>
  );
}

export interface AvatarGroupOverflowProps {
  count: number;
  size: AvatarSize;
  shape: AvatarShape;
  className?: string;
}

export function AvatarGroupOverflow({
  count,
  size,
  shape,
  className = "",
}: AvatarGroupOverflowProps) {
  const s = sizeConfig[size];
  const shapeClass = shapeStyles[shape];

  return (
    <div
      className={`relative inline-flex shrink-0 items-center justify-center ${s.dim} ${shapeClass} bg-gray-100 dark:bg-gray-800 border-2 border-white dark:border-gray-900 ring-0 ${s.text} font-semibold text-gray-500 dark:text-gray-400 select-none ${className}`}
    >
      +{count > 99 ? "99" : count}
    </div>
  );
}

export interface AvatarAddButtonProps {
  size?: AvatarSize;
  shape?: AvatarShape;
  onClick?: () => void;
  className?: string;
}

export function AvatarAddButton({
  size = "md",
  shape = "circle",
  onClick,
  className = "",
}: AvatarAddButtonProps) {
  const s = sizeConfig[size];
  const shapeClass = shapeStyles[shape];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative inline-flex shrink-0 items-center justify-center ${s.dim} ${shapeClass} bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-500 dark:hover:text-gray-400 transition-colors cursor-pointer select-none ${className}`}
    >
      <Plus size={s.iconSize - 2} />
    </button>
  );
}

export interface AvatarGroupItemProps {
  src?: string;
  name?: string;
  alt?: string;
  status?: AvatarStatus;
  tooltip?: string;
  className?: string;
}

export interface AvatarGroupProps {
  items: AvatarGroupItemProps[];
  size?: AvatarSize;
  shape?: AvatarShape;
  layout?: AvatarGroupLayout;
  max?: number;
  spacing?: number;
  showAddButton?: boolean;
  onAddClick?: () => void;
  onOverflowClick?: () => void;
  className?: string;
}

export function AvatarGroup({
  items,
  size = "md",
  shape = "circle",
  layout = "stack",
  max = 5,
  spacing,
  showAddButton = false,
  onAddClick,
  onOverflowClick,
  className = "",
}: AvatarGroupProps) {
  const s = sizeConfig[size];
  const shapeClass = shapeStyles[shape];
  const visible = items.slice(0, max);
  const overflow = items.length - max;
  const defaultSpacing = spacing ?? -(sizeConfig[size].dimPx * 0.25);

  if (layout === "grid") {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {visible.map((item, i) => (
          <Avatar
            key={i}
            src={item.src}
            name={item.name}
            alt={item.alt}
            status={item.status}
            tooltip={item.tooltip}
            size={size}
            shape={shape}
          />
        ))}
        {overflow > 0 && (
          <div onClick={onOverflowClick} className={onOverflowClick ? "cursor-pointer" : ""}>
            <AvatarGroupOverflow count={overflow} size={size} shape={shape} />
          </div>
        )}
        {showAddButton && <AvatarAddButton size={size} shape={shape} onClick={onAddClick} />}
      </div>
    );
  }

  if (layout === "list") {
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        {visible.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <Avatar
              src={item.src}
              name={item.name}
              alt={item.alt}
              status={item.status}
              size={size}
              shape={shape}
            />
            {item.name && (
              <span className={`${s.tooltipText} font-medium text-gray-700 dark:text-gray-200`}>
                {item.name}
              </span>
            )}
          </div>
        ))}
        {overflow > 0 && (
          <div className="flex items-center gap-3">
            <div onClick={onOverflowClick} className={onOverflowClick ? "cursor-pointer" : ""}>
              <AvatarGroupOverflow count={overflow} size={size} shape={shape} />
            </div>
            <span className={`${s.tooltipText} text-gray-400 dark:text-gray-500`}>
              +{overflow} more
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center ${className}`}>
      {visible.map((item, i) => (
        <div
          key={i}
          className={`relative inline-flex shrink-0 ring-2 ring-white dark:ring-gray-900 ${shapeClass}`}
          style={{ marginLeft: i === 0 ? 0 : defaultSpacing, zIndex: visible.length - i }}
        >
          <Avatar
            src={item.src}
            name={item.name}
            alt={item.alt}
            status={item.status}
            tooltip={item.tooltip}
            size={size}
            shape={shape}
          />
        </div>
      ))}
      {overflow > 0 && (
        <div
          onClick={onOverflowClick}
          style={{ marginLeft: defaultSpacing, zIndex: 0 }}
          className={onOverflowClick ? "cursor-pointer relative" : "relative"}
        >
          <AvatarGroupOverflow count={overflow} size={size} shape={shape} />
        </div>
      )}
      {showAddButton && (
        <div style={{ marginLeft: 8 }}>
          <AvatarAddButton size={size} shape={shape} onClick={onAddClick} />
        </div>
      )}
    </div>
  );
}

export interface AvatarWithLabelProps extends AvatarProps {
  label?: string;
  sublabel?: string;
  labelPosition?: "right" | "bottom";
  labelClassName?: string;
  sublabelClassName?: string;
  wrapperClassName?: string;
}

export function AvatarWithLabel({
  label,
  sublabel,
  labelPosition = "right",
  labelClassName = "",
  sublabelClassName = "",
  wrapperClassName = "",
  ...avatarProps
}: AvatarWithLabelProps) {
  const size = avatarProps.size ?? "md";
  const s = sizeConfig[size];

  const isRight = labelPosition === "right";

  return (
    <div className={`inline-flex ${isRight ? "flex-row items-center gap-3" : "flex-col items-center gap-1.5"} ${wrapperClassName}`}>
      <Avatar {...avatarProps} />
      {(label || sublabel) && (
        <div className={isRight ? "" : "text-center"}>
          {label && (
            <p className={`font-semibold text-gray-900 dark:text-white leading-snug ${s.tooltipText} ${labelClassName}`}>
              {label}
            </p>
          )}
          {sublabel && (
            <p className={`text-gray-500 dark:text-gray-400 leading-snug ${s.badgeText} ${sublabelClassName}`}>
              {sublabel}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export {
  AvatarProvider,
  AvatarGroupProvider,
  useAvatarContext,
  useAvatarGroupContext,
};
export type { AvatarSize, AvatarShape, AvatarStatus, AvatarGroupLayout, PresencePosition };