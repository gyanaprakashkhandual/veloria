/* eslint-disable react-refresh/only-export-components */
import React, { useEffect, useRef, useState } from "react";
import {
  CardProvider,
  useCardContext,
  type CardProviderProps,
  type CardSize,
  type CardVariant,
  type CardRadius,
  type CardOrientation,
} from "./Card.context";
import {
  IconX,
  IconChevronDown,
  IconExternalLink,
  IconLoader,
} from "./Card.icon";

const sizeConfig = {
  sm: {
    padding: "0.75rem",
    headerPx: "0.75rem",
    headerPy: "0.625rem",
    bodyPx: "0.75rem",
    bodyPy: "0.5rem",
    footerPx: "0.75rem",
    footerPy: "0.625rem",
    titleSize: "0.875rem",
    subtitleSize: "0.75rem",
    bodySize: "0.75rem",
    buttonSize: "0.75rem",
    buttonPx: "0.625rem",
    buttonPy: "0.375rem",
    iconSize: 13,
    closeSize: 14,
    gap: "0.5rem",
    imageHeightV: "8rem",
    imageHeightH: "7rem",
    badgeSize: "0.625rem",
    badgePx: "0.375rem",
    badgePy: "0.125rem",
  },
  md: {
    padding: "1rem",
    headerPx: "1rem",
    headerPy: "0.75rem",
    bodyPx: "1rem",
    bodyPy: "0.75rem",
    footerPx: "1rem",
    footerPy: "0.75rem",
    titleSize: "1rem",
    subtitleSize: "0.875rem",
    bodySize: "0.875rem",
    buttonSize: "0.875rem",
    buttonPx: "0.875rem",
    buttonPy: "0.5rem",
    iconSize: 15,
    closeSize: 16,
    gap: "0.75rem",
    imageHeightV: "11rem",
    imageHeightH: "9rem",
    badgeSize: "0.75rem",
    badgePx: "0.5rem",
    badgePy: "0.125rem",
  },
  lg: {
    padding: "1.25rem",
    headerPx: "1.25rem",
    headerPy: "0.875rem",
    bodyPx: "1.25rem",
    bodyPy: "0.875rem",
    footerPx: "1.25rem",
    footerPy: "0.875rem",
    titleSize: "1.125rem",
    subtitleSize: "0.875rem",
    bodySize: "0.875rem",
    buttonSize: "0.875rem",
    buttonPx: "1rem",
    buttonPy: "0.5rem",
    iconSize: 16,
    closeSize: 17,
    gap: "0.75rem",
    imageHeightV: "13rem",
    imageHeightH: "11rem",
    badgeSize: "0.75rem",
    badgePx: "0.5rem",
    badgePy: "0.125rem",
  },
  xl: {
    padding: "1.5rem",
    headerPx: "1.5rem",
    headerPy: "1rem",
    bodyPx: "1.5rem",
    bodyPy: "1rem",
    footerPx: "1.5rem",
    footerPy: "1rem",
    titleSize: "1.25rem",
    subtitleSize: "1rem",
    bodySize: "1rem",
    buttonSize: "1rem",
    buttonPx: "1.25rem",
    buttonPy: "0.625rem",
    iconSize: 18,
    closeSize: 19,
    gap: "1rem",
    imageHeightV: "16rem",
    imageHeightH: "14rem",
    badgeSize: "0.75rem",
    badgePx: "0.625rem",
    badgePy: "0.25rem",
  },
};

const variantStyles: Record<CardVariant, React.CSSProperties> = {
  default: {
    background: "var(--color-bg-primary)",
    border: "1px solid var(--color-border-primary)",
    boxShadow: "0 1px 3px var(--color-shadow-primary)",
  },
  outlined: {
    background: "transparent",
    border: "1px solid var(--color-border-secondary)",
  },
  elevated: {
    background: "var(--color-bg-primary)",
    border: "1px solid var(--color-border-primary)",
    boxShadow: "0 10px 25px var(--color-shadow-secondary)",
  },
  filled: {
    background: "var(--color-bg-secondary)",
    border: "1px solid var(--color-border-primary)",
  },
  ghost: {
    background: "transparent",
    border: "1px solid transparent",
  },
};

const radiusMap: Record<CardRadius, string> = {
  none: "0",
  sm: "0.25rem",
  md: "0.375rem",
  lg: "0.5rem",
  xl: "0.75rem",
  "2xl": "1rem",
};

const badgeColorMap: Record<string, React.CSSProperties> = {
  gray: {
    background: "var(--color-bg-tertiary)",
    color: "var(--color-text-quinary)",
  },
  red: {
    background: "var(--color-error-bg)",
    color: "var(--color-error-text)",
  },
  amber: {
    background: "var(--color-warning-bg)",
    color: "var(--color-warning-text)",
  },
  emerald: {
    background: "var(--color-success-bg)",
    color: "var(--color-success-text)",
  },
  blue: {
    background: "var(--color-info-bg)",
    color: "var(--color-info-text)",
  },
  violet: {
    background: "#f5f3ff",
    color: "#5b21b6",
  },
  rose: {
    background: "#fff1f2",
    color: "#be123c",
  },
};

const dividerStyle: React.CSSProperties = {
  borderTop: "1px solid var(--color-divider-primary)",
};

export interface CardBadgeProps {
  label: string;
  color?: "gray" | "red" | "amber" | "emerald" | "blue" | "violet" | "rose";
  className?: string;
  style?: React.CSSProperties;
}

export function CardBadge({
  label,
  color = "gray",
  className = "",
  style,
}: CardBadgeProps) {
  const { state } = useCardContext();
  const s = sizeConfig[state.size];
  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        fontWeight: 600,
        borderRadius: "9999px",
        fontSize: s.badgeSize,
        padding: `${s.badgePy} ${s.badgePx}`,
        ...badgeColorMap[color],
        ...style,
      }}
    >
      {label}
    </span>
  );
}

export interface CardImageProps {
  src: string;
  alt?: string;
  objectFit?: "cover" | "contain" | "fill" | "none";
  aspectRatio?: string;
  className?: string;
  style?: React.CSSProperties;
  overlay?: React.ReactNode;
}

export function CardImage({
  src,
  alt = "",
  objectFit = "cover",
  aspectRatio,
  className = "",
  style,
  overlay,
}: CardImageProps) {
  const { state } = useCardContext();
  const s = sizeConfig[state.size];
  const radius = radiusMap[state.radius];
  const isHorizontal = state.orientation === "horizontal";

  return (
    <div
      className={className}
      style={{
        position: "relative",
        overflow: "hidden",
        flexShrink: 0,
        ...(isHorizontal
          ? {
              width: s.imageHeightH,
              alignSelf: "stretch",
              borderRadius: `${radius} 0 0 ${radius}`,
            }
          : {
              width: "100%",
              height: s.imageHeightV,
              borderRadius: `${radius} ${radius} 0 0`,
            }),
        ...(aspectRatio ? { aspectRatio, height: "auto" } : {}),
        ...style,
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{ width: "100%", height: "100%", objectFit }}
      />
      {overlay && (
        <div style={{ position: "absolute", inset: 0 }}>{overlay}</div>
      )}
    </div>
  );
}

export interface CardHeaderProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  badge?: CardBadgeProps;
  collapsible?: boolean;
  divider?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function CardHeader({
  title,
  subtitle,
  leading,
  trailing,
  badge,
  collapsible = false,
  divider = true,
  className = "",
  style,
}: CardHeaderProps) {
  const { state, toggleCollapse, close } = useCardContext();
  const s = sizeConfig[state.size];

  return (
    <div
      className={className}
      onClick={collapsible ? toggleCollapse : undefined}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "0.75rem",
        padding: `${s.headerPy} ${s.headerPx}`,
        ...(divider ? dividerStyle : {}),
        ...(collapsible ? { cursor: "pointer", userSelect: "none" } : {}),
        ...style,
      }}
    >
      {leading && (
        <div
          style={{
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--color-text-muted)",
            marginTop: "0.125rem",
          }}
        >
          {leading}
        </div>
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            flexWrap: "wrap",
          }}
        >
          {title && (
            <span
              style={{
                display: "block",
                fontWeight: 600,
                color: "var(--color-text-primary)",
                fontSize: s.titleSize,
                lineHeight: 1.3,
              }}
            >
              {title}
            </span>
          )}
          {badge && <CardBadge {...badge} />}
        </div>
        {subtitle && (
          <span
            style={{
              display: "block",
              fontSize: s.subtitleSize,
              color: "var(--color-text-quinary)",
              marginTop: "0.125rem",
              lineHeight: 1.3,
            }}
          >
            {subtitle}
          </span>
        )}
      </div>

      <div
        style={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          gap: "0.375rem",
          marginLeft: "auto",
        }}
      >
        {trailing}
        {collapsible && (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              color: "var(--color-text-muted)",
              transition: "transform 0.2s ease-in-out",
              transform: state.isCollapsed ? "rotate(-90deg)" : "rotate(0deg)",
            }}
          >
            <IconChevronDown size={s.iconSize} />
          </span>
        )}
        {state.isModal && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "1.75rem",
              height: "1.75rem",
              borderRadius: "0.375rem",
              border: "none",
              background: "transparent",
              color: "var(--color-text-muted)",
              cursor: "pointer",
              transition: "background 0.1s, color 0.1s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "var(--color-bg-tertiary)";
              (e.currentTarget as HTMLButtonElement).style.color =
                "var(--color-text-primary)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "transparent";
              (e.currentTarget as HTMLButtonElement).style.color =
                "var(--color-text-muted)";
            }}
          >
            <IconX size={s.closeSize} />
          </button>
        )}
      </div>
    </div>
  );
}

export interface CardCloseButtonProps {
  className?: string;
  style?: React.CSSProperties;
  icon?: React.ReactNode;
}

export function CardCloseButton({
  className = "",
  style,
  icon,
}: CardCloseButtonProps) {
  const { state, close } = useCardContext();
  const s = sizeConfig[state.size];
  return (
    <button
      type="button"
      onClick={close}
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "1.75rem",
        height: "1.75rem",
        borderRadius: "0.375rem",
        border: "none",
        background: "transparent",
        color: "var(--color-text-muted)",
        cursor: "pointer",
        transition: "background 0.1s, color 0.1s",
        ...style,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background =
          "var(--color-bg-tertiary)";
        (e.currentTarget as HTMLButtonElement).style.color =
          "var(--color-text-primary)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "transparent";
        (e.currentTarget as HTMLButtonElement).style.color =
          "var(--color-text-muted)";
      }}
    >
      {icon ?? <IconX size={s.closeSize} />}
    </button>
  );
}

export interface CardBodyProps {
  children?: React.ReactNode;
  noPadding?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function CardBody({
  children,
  noPadding = false,
  className = "",
  style,
}: CardBodyProps) {
  const { state } = useCardContext();
  const s = sizeConfig[state.size];
  const [height, setHeight] = useState<number | "auto">(
    state.isCollapsed ? 0 : "auto",
  );
  const [opacity, setOpacity] = useState(state.isCollapsed ? 0 : 1);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!state.isCollapsed) {
      const el = innerRef.current;
      if (el) {
        setHeight(el.scrollHeight);
        setOpacity(1);
        const t = setTimeout(() => setHeight("auto"), 220);
        return () => clearTimeout(t);
      }
    } else {
      const el = innerRef.current;
      if (el) setHeight(el.scrollHeight);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setHeight(0);
          setOpacity(0);
        });
      });
    }
  }, [state.isCollapsed]);

  return (
    <div
      style={{
        overflow: "hidden",
        height: height === "auto" ? "auto" : `${height}px`,
        opacity,
        transition: "height 0.22s ease-in-out, opacity 0.22s ease-in-out",
      }}
    >
      <div
        ref={innerRef}
        className={className}
        style={{
          fontSize: s.bodySize,
          color: "var(--color-text-quaternary)",
          lineHeight: 1.7,
          ...(noPadding ? {} : { padding: `${s.bodyPy} ${s.bodyPx}` }),
          ...style,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export interface CardMediaProps {
  children?: React.ReactNode;
  noPadding?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function CardMedia({
  children,
  noPadding = false,
  className = "",
  style,
}: CardMediaProps) {
  const { state } = useCardContext();
  const s = sizeConfig[state.size];
  return (
    <div
      className={className}
      style={{
        ...(noPadding ? {} : { padding: `${s.bodyPy} ${s.bodyPx}` }),
        ...style,
      }}
    >
      {children}
    </div>
  );
}

type FooterButtonVariant = "primary" | "secondary" | "ghost" | "danger";

const footerBtnStyles: Record<FooterButtonVariant, React.CSSProperties> = {
  primary: {
    background: "var(--color-brand-primary)",
    color: "var(--color-text-inverse)",
    border: "1px solid transparent",
    boxShadow: "0 1px 2px var(--color-shadow-primary)",
  },
  secondary: {
    background: "var(--color-bg-primary)",
    color: "var(--color-text-tertiary)",
    border: "1px solid var(--color-border-primary)",
    boxShadow: "0 1px 2px var(--color-shadow-primary)",
  },
  ghost: {
    background: "transparent",
    color: "var(--color-text-quinary)",
    border: "1px solid transparent",
  },
  danger: {
    background: "var(--color-error-primary)",
    color: "var(--color-text-inverse)",
    border: "1px solid transparent",
    boxShadow: "0 1px 2px var(--color-shadow-primary)",
  },
};

export interface CardFooterButtonProps {
  label: string;
  onClick?: () => void;
  variant?: FooterButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function CardFooterButton({
  label,
  onClick,
  variant = "secondary",
  loading = false,
  disabled = false,
  leadingIcon,
  trailingIcon,
  className = "",
  style,
}: CardFooterButtonProps) {
  const { state } = useCardContext();
  const s = sizeConfig[state.size];
  const isDisabled = disabled || loading || state.disabled;

  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={onClick}
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.375rem",
        fontWeight: 500,
        borderRadius: "0.5rem",
        cursor: isDisabled ? "not-allowed" : "pointer",
        opacity: isDisabled ? 0.5 : 1,
        fontSize: s.buttonSize,
        padding: `${s.buttonPy} ${s.buttonPx}`,
        transition: "background 0.1s, opacity 0.1s",
        ...footerBtnStyles[variant],
        ...style,
      }}
    >
      {loading ? (
        <IconLoader size={s.iconSize - 1} />
      ) : leadingIcon ? (
        <span
          style={{
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            width: s.iconSize,
            height: s.iconSize,
          }}
        >
          {leadingIcon}
        </span>
      ) : null}
      <span>{label}</span>
      {!loading && trailingIcon && (
        <span
          style={{
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            width: s.iconSize,
            height: s.iconSize,
          }}
        >
          {trailingIcon}
        </span>
      )}
    </button>
  );
}

export interface CardFooterLinkProps {
  label: string;
  href?: string;
  onClick?: () => void;
  external?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function CardFooterLink({
  label,
  href,
  onClick,
  external = false,
  className = "",
  style,
}: CardFooterLinkProps) {
  const { state } = useCardContext();
  const s = sizeConfig[state.size];

  const baseStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.25rem",
    fontWeight: 500,
    fontSize: s.buttonSize,
    color: "var(--color-text-quinary)",
    textDecoration: "none",
    background: "none",
    border: "none",
    cursor: "pointer",
    transition: "color 0.1s",
    ...style,
  };

  const hoverHandlers = {
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
      (e.currentTarget as HTMLElement).style.color =
        "var(--color-text-primary)";
    },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
      (e.currentTarget as HTMLElement).style.color =
        "var(--color-text-quinary)";
    },
  };

  if (href) {
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={className}
        style={baseStyle}
        {...hoverHandlers}
      >
        <span>{label}</span>
        {external && <IconExternalLink size={s.iconSize - 3} />}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={className}
      style={baseStyle}
      {...hoverHandlers}
    >
      <span>{label}</span>
      {external && <IconExternalLink size={s.iconSize - 3} />}
    </button>
  );
}

export interface CardFooterProps {
  children?: React.ReactNode;
  align?: "left" | "right" | "between" | "center";
  divider?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function CardFooter({
  children,
  align = "right",
  divider = true,
  className = "",
  style,
}: CardFooterProps) {
  const { state } = useCardContext();
  const s = sizeConfig[state.size];

  const justifyMap: Record<string, string> = {
    left: "flex-start",
    right: "flex-end",
    between: "space-between",
    center: "center",
  };

  return (
    <div
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "0.5rem",
        padding: `${s.footerPy} ${s.footerPx}`,
        justifyContent: justifyMap[align],
        ...(divider ? dividerStyle : {}),
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export interface CardDividerProps {
  className?: string;
  style?: React.CSSProperties;
}

export function CardDivider({ className = "", style }: CardDividerProps) {
  return (
    <div
      className={className}
      style={{ borderTop: "1px solid var(--color-divider-primary)", ...style }}
    />
  );
}

export interface CardSkeletonProps {
  lines?: number;
  showImage?: boolean;
  showHeader?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function CardSkeleton({
  lines = 3,
  showImage = false,
  showHeader = true,
  className = "",
  style,
}: CardSkeletonProps) {
  const { state } = useCardContext();
  const s = sizeConfig[state.size];

  const skeletonBase: React.CSSProperties = {
    background: "var(--color-skeleton-base)",
    borderRadius: "0.25rem",
    animation: "card-pulse 1.5s ease-in-out infinite",
  };

  return (
    <div className={className} style={style}>
      {showImage && (
        <div
          style={{ width: "100%", height: s.imageHeightV, ...skeletonBase }}
        />
      )}
      {showHeader && (
        <div
          style={{
            padding: `${s.headerPy} ${s.headerPx}`,
            ...dividerStyle,
          }}
        >
          <div
            style={{
              height: "1rem",
              width: "40%",
              marginBottom: "0.5rem",
              ...skeletonBase,
            }}
          />
          <div style={{ height: "0.75rem", width: "60%", ...skeletonBase }} />
        </div>
      )}
      <div
        style={{
          padding: `${s.bodyPy} ${s.bodyPx}`,
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            style={{
              height: "0.75rem",
              width: i === lines - 1 ? "60%" : "100%",
              ...skeletonBase,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export interface CardLoadingOverlayProps {
  className?: string;
  style?: React.CSSProperties;
}

export function CardLoadingOverlay({
  className = "",
  style,
}: CardLoadingOverlayProps) {
  const { state } = useCardContext();

  if (!state.isLoading) return null;

  return (
    <div
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--color-overlay-light)",
        backdropFilter: "blur(2px)",
        zIndex: 10,
        borderRadius: "inherit",
        animation: "card-fade-in 0.15s ease-out both",
        ...style,
      }}
    >
      <IconLoader size={24} style={{ color: "var(--color-text-muted)" }} />
    </div>
  );
}

export interface CardRootProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  hoverable?: boolean;
  selectable?: boolean;
  selected?: boolean;
}

function CardRoot({
  children,
  className = "",
  style,
  onClick,
  hoverable = false,
  selectable = false,
  selected = false,
}: CardRootProps) {
  const { state, cardRef } = useCardContext();
  const { variant, radius, orientation } = state;
  const isHorizontal = orientation === "horizontal";
  const [hovered, setHovered] = useState(false);

  const interactive = hoverable || !!onClick;

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseEnter={() => interactive && setHovered(true)}
      onMouseLeave={() => interactive && setHovered(false)}
      className={className}
      style={{
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: isHorizontal ? "row" : "column",
        borderRadius: radiusMap[radius],
        ...variantStyles[variant],
        ...(interactive
          ? {
              cursor: "pointer",
              transition: "box-shadow 0.15s, transform 0.15s",
              ...(hovered
                ? {
                    boxShadow: "0 4px 12px var(--color-shadow-secondary)",
                    transform: "translateY(-1px)",
                  }
                : {}),
            }
          : {}),
        ...(selectable && selected
          ? {
              outline: "2px solid var(--color-border-focus)",
              outlineOffset: "0",
            }
          : {}),
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export interface CardModalProps {
  children?: React.ReactNode;
  blur?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function CardModal({
  children,
  blur = true,
  className = "",
  style,
}: CardModalProps) {
  const { state, close } = useCardContext();

  useEffect(() => {
    if (!state.isOpen || !state.isModal) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [state.isOpen, state.isModal, close]);

  if (!state.isModal) return <>{children}</>;
  if (!state.isOpen) return null;

  return (
    <>
      <div
        onClick={close}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 40,
          background: "var(--color-backdrop)",
          ...(blur ? { backdropFilter: "blur(4px)" } : {}),
          animation: "card-fade-in 0.2s ease-out both",
        }}
      />
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
          pointerEvents: "none",
        }}
      >
        <div
          className={className}
          style={{
            pointerEvents: "auto",
            width: "100%",
            maxWidth: "28rem",
            animation: "card-scale-in 0.2s ease-out both",
            ...style,
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
}

const KEYFRAMES = `
@keyframes card-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes card-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
@keyframes card-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes card-scale-in {
  from { opacity: 0; transform: scale(0.96) translateY(12px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
`;

function CardKeyframes() {
  return <style>{KEYFRAMES}</style>;
}

export interface CardProps extends Omit<CardProviderProps, "children"> {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  hoverable?: boolean;
  selectable?: boolean;
  selected?: boolean;
  isModal?: boolean;
  modalBlur?: boolean;
}

export function Card({
  children,
  className = "",
  style,
  onClick,
  hoverable = false,
  selectable = false,
  selected = false,
  isModal = false,
  modalBlur = true,
  ...providerProps
}: CardProps) {
  const inner = (
    <>
      <CardKeyframes />
      <CardRoot
        className={className}
        style={style}
        onClick={onClick}
        hoverable={hoverable}
        selectable={selectable}
        selected={selected}
      >
        {children}
      </CardRoot>
    </>
  );

  return (
    <CardProvider {...providerProps} isModal={isModal}>
      {isModal ? <CardModal blur={modalBlur}>{inner}</CardModal> : inner}
    </CardProvider>
  );
}

export { CardProvider, useCardContext };
export type { CardSize, CardVariant, CardRadius, CardOrientation };
