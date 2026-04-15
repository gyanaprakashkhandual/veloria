/* eslint-disable react-refresh/only-export-components */
import { useState, useCallback } from "react";
import type { CSSProperties, ReactNode } from "react";
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
import { UserIcon, CameraIcon, CheckIcon, PlusIcon } from "./Avatar.icon";
import "./Avatar.css";

const sizePx: Record<AvatarSize, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
  "2xl": 80,
};

const colorPalette = [
  "avatar-color-violet",
  "avatar-color-blue",
  "avatar-color-emerald",
  "avatar-color-amber",
  "avatar-color-rose",
  "avatar-color-indigo",
  "avatar-color-teal",
  "avatar-color-orange",
];

function getColorClass(name: string): string {
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
  fallbackIcon?: ReactNode;
  className?: string;
}

export function AvatarImage({
  src,
  alt = "",
  fallbackName,
  fallbackIcon,
  className = "",
}: AvatarImageProps) {
  const { setError } = useAvatarContext();
  const [imgError, setImgError] = useState(false);

  const handleError = useCallback(() => {
    setImgError(true);
    setError(true);
  }, [setError]);

  if (imgError) {
    if (fallbackName)
      return <AvatarInitials name={fallbackName} className={className} />;
    return (
      <span className={`avatar-icon-wrap ${className}`}>
        {fallbackIcon ?? <UserIcon />}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={handleError}
      draggable={false}
      className={`avatar-img ${className}`}
    />
  );
}

export interface AvatarInitialsProps {
  name: string;
  maxChars?: number;
  colorSeed?: string;
  customColorClass?: string;
  className?: string;
}

export function AvatarInitials({
  name,
  maxChars = 2,
  colorSeed,
  customColorClass,
  className = "",
}: AvatarInitialsProps) {
  const initials = getInitials(name, maxChars);
  const colorClass = customColorClass ?? getColorClass(colorSeed ?? name);
  return (
    <span className={`avatar-initials ${colorClass} ${className}`}>
      {initials}
    </span>
  );
}

export interface AvatarIconProps {
  icon?: ReactNode;
  colorClass?: string;
  className?: string;
}

export function AvatarIcon({
  icon,
  colorClass = "avatar-icon-default",
  className = "",
}: AvatarIconProps) {
  return (
    <span className={`avatar-icon-wrap ${colorClass} ${className}`}>
      {icon ?? <UserIcon />}
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
  const resolvedStatus = status ?? state.status;
  if (resolvedStatus === "none") return null;
  return (
    <span
      className={`avatar-status avatar-status-${resolvedStatus} avatar-presence-${state.presencePosition} avatar-size-${state.size}-status ${className}`}
    >
      {animated && resolvedStatus === "online" && (
        <span className="avatar-status-ping" />
      )}
    </span>
  );
}

export interface AvatarBadgeProps {
  content?: ReactNode;
  color?: "gray" | "red" | "emerald" | "blue" | "amber" | "violet";
  position?: PresencePosition;
  className?: string;
}

export function AvatarBadge({
  content,
  color = "red",
  position = "top-right",
  className = "",
}: AvatarBadgeProps) {
  const { state } = useAvatarContext();
  return (
    <span
      className={`avatar-badge avatar-badge-${color} avatar-presence-${position} avatar-size-${state.size}-badge ${className}`}
    >
      {content}
    </span>
  );
}

export interface AvatarVerifiedBadgeProps {
  position?: PresencePosition;
  icon?: ReactNode;
  colorClass?: string;
  className?: string;
}

export function AvatarVerifiedBadge({
  position = "bottom-right",
  icon,
  colorClass = "avatar-verified-default",
  className = "",
}: AvatarVerifiedBadgeProps) {
  const { state } = useAvatarContext();
  const px = sizePx[state.size];
  return (
    <span
      className={`avatar-verified avatar-presence-${position} ${colorClass} ${className}`}
      style={{ width: px * 0.35, height: px * 0.35 } as CSSProperties}
    >
      {icon ?? <CheckIcon size={px * 0.2} strokeWidth={3} />}
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
  const px = sizePx[state.size];
  return (
    <label className={`avatar-upload ${className}`}>
      <CameraIcon size={px * 0.25} />
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
  return (
    <span role="tooltip" className={`avatar-tooltip ${className}`}>
      {label}
    </span>
  );
}

export interface AvatarRingProps {
  colorClass?: string;
  animated?: boolean;
  className?: string;
}

export function AvatarRing({
  colorClass = "avatar-ring-default",
  animated = false,
  className = "",
}: AvatarRingProps) {
  return (
    <span
      className={`avatar-ring ${colorClass} ${animated ? "avatar-ring-animated" : ""} ${className}`}
    />
  );
}

export interface AvatarRootProps {
  children?: ReactNode;
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
}

export function AvatarRoot({
  children,
  onClick,
  className = "",
  style,
}: AvatarRootProps) {
  const { state, avatarRef } = useAvatarContext();
  const isClickable = !!onClick || state.isInteractive;
  return (
    <div
      ref={avatarRef}
      onClick={onClick}
      style={style}
      className={[
        "avatar-root",
        `avatar-size-${state.size}`,
        `avatar-shape-${state.shape}`,
        isClickable ? "avatar-interactive" : "",
        state.disabled ? "avatar-disabled" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}

export interface AvatarProps extends Omit<AvatarProviderProps, "children"> {
  src?: string;
  alt?: string;
  name?: string;
  icon?: ReactNode;
  status?: AvatarStatus;
  statusAnimated?: boolean;
  badge?: ReactNode;
  badgeCount?: number;
  badgeColor?: AvatarBadgeProps["color"];
  verified?: boolean;
  verifiedIcon?: ReactNode;
  ring?: boolean;
  ringColorClass?: string;
  ringAnimated?: boolean;
  tooltip?: string;
  uploadable?: boolean;
  onUpload?: (file: File) => void;
  onClick?: () => void;
  className?: string;
  rootClassName?: string;
  style?: CSSProperties;
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
  ringColorClass,
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
    <AvatarProvider
      {...providerProps}
      status={status}
      isInteractive={!!onClick || !!uploadable}
    >
      <AvatarRoot onClick={onClick} className={rootClassName} style={style}>
        <div className={`avatar-content ${className}`}>
          {src ? (
            <AvatarImage
              src={src}
              alt={alt ?? name ?? ""}
              fallbackName={name}
              fallbackIcon={icon}
            />
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
            content={
              badgeCount !== undefined
                ? badgeCount > 99
                  ? "99+"
                  : badgeCount
                : badge
            }
            color={badgeColor}
          />
        )}

        {verified && <AvatarVerifiedBadge icon={verifiedIcon} />}
        {ring && (
          <AvatarRing colorClass={ringColorClass} animated={ringAnimated} />
        )}
        {uploadable && <AvatarUploadOverlay onUpload={onUpload} />}
        {tooltip && <AvatarTooltip label={tooltip} />}
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
  return (
    <div
      className={`avatar-overflow avatar-size-${size} avatar-shape-${shape} ${className}`}
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
  return (
    <button
      type="button"
      onClick={onClick}
      className={`avatar-add avatar-size-${size} avatar-shape-${shape} ${className}`}
    >
      <PlusIcon />
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
  const visible = items.slice(0, max);
  const overflow = items.length - max;
  const defaultSpacing = spacing ?? -(sizePx[size] * 0.25);

  if (layout === "grid") {
    return (
      <div className={`avatar-group-grid ${className}`}>
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
          <div
            onClick={onOverflowClick}
            className={onOverflowClick ? "cursor-pointer" : ""}
          >
            <AvatarGroupOverflow count={overflow} size={size} shape={shape} />
          </div>
        )}
        {showAddButton && (
          <AvatarAddButton size={size} shape={shape} onClick={onAddClick} />
        )}
      </div>
    );
  }

  if (layout === "list") {
    return (
      <div className={`avatar-group-list ${className}`}>
        {visible.map((item, i) => (
          <div key={i} className="avatar-group-list-item">
            <Avatar
              src={item.src}
              name={item.name}
              alt={item.alt}
              status={item.status}
              size={size}
              shape={shape}
            />
            {item.name && (
              <span className="avatar-group-list-label">{item.name}</span>
            )}
          </div>
        ))}
        {overflow > 0 && (
          <div className="avatar-group-list-item">
            <div
              onClick={onOverflowClick}
              className={onOverflowClick ? "cursor-pointer" : ""}
            >
              <AvatarGroupOverflow count={overflow} size={size} shape={shape} />
            </div>
            <span className="avatar-group-list-more">+{overflow} more</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`avatar-group-stack ${className}`}>
      {visible.map((item, i) => (
        <div
          key={i}
          className={`avatar-stack-item avatar-shape-${shape}`}
          style={
            {
              marginLeft: i === 0 ? 0 : defaultSpacing,
              zIndex: visible.length - i,
            } as CSSProperties
          }
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
          style={{ marginLeft: defaultSpacing, zIndex: 0 } as CSSProperties}
          className={onOverflowClick ? "cursor-pointer relative" : "relative"}
        >
          <AvatarGroupOverflow count={overflow} size={size} shape={shape} />
        </div>
      )}
      {showAddButton && (
        <div style={{ marginLeft: 8 } as CSSProperties}>
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
  const isRight = labelPosition === "right";
  return (
    <div
      className={`avatar-with-label ${isRight ? "avatar-label-right" : "avatar-label-bottom"} ${wrapperClassName}`}
    >
      <Avatar {...avatarProps} />
      {(label || sublabel) && (
        <div className={isRight ? "" : "avatar-label-center"}>
          {label && (
            <p className={`avatar-label-primary ${labelClassName}`}>{label}</p>
          )}
          {sublabel && (
            <p className={`avatar-label-secondary ${sublabelClassName}`}>
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
export type {
  AvatarSize,
  AvatarShape,
  AvatarStatus,
  AvatarGroupLayout,
  PresencePosition,
};
