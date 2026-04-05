import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, ExternalLink, Loader2 } from "lucide-react";
import {
  CardProvider,
  useCardContext,
  type CardProviderProps,
  type CardSize,
  type CardVariant,
  type CardRadius,
  type CardOrientation,
} from "./Card.context";

const sizeConfig = {
  sm: {
    padding: "p-3",
    headerPx: "px-3",
    headerPy: "py-2.5",
    footerPx: "px-3",
    footerPy: "py-2.5",
    bodyPx: "px-3",
    bodyPy: "py-2",
    titleText: "text-sm",
    subtitleText: "text-xs",
    bodyText: "text-xs",
    buttonText: "text-xs",
    buttonPx: "px-2.5",
    buttonPy: "py-1.5",
    iconSize: 13,
    closeSize: 14,
    gap: "gap-2",
    imageHeightV: "h-32",
    imageHeightH: "w-28",
    badgeText: "text-[10px]",
    badgePx: "px-1.5",
    badgePy: "py-0.5",
  },
  md: {
    padding: "p-4",
    headerPx: "px-4",
    headerPy: "py-3",
    footerPx: "px-4",
    footerPy: "py-3",
    bodyPx: "px-4",
    bodyPy: "py-3",
    titleText: "text-base",
    subtitleText: "text-sm",
    bodyText: "text-sm",
    buttonText: "text-sm",
    buttonPx: "px-3.5",
    buttonPy: "py-2",
    iconSize: 15,
    closeSize: 16,
    gap: "gap-3",
    imageHeightV: "h-44",
    imageHeightH: "w-36",
    badgeText: "text-xs",
    badgePx: "px-2",
    badgePy: "py-0.5",
  },
  lg: {
    padding: "p-5",
    headerPx: "px-5",
    headerPy: "py-3.5",
    footerPx: "px-5",
    footerPy: "py-3.5",
    bodyPx: "px-5",
    bodyPy: "py-3.5",
    titleText: "text-lg",
    subtitleText: "text-sm",
    bodyText: "text-sm",
    buttonText: "text-sm",
    buttonPx: "px-4",
    buttonPy: "py-2",
    iconSize: 16,
    closeSize: 17,
    gap: "gap-3",
    imageHeightV: "h-52",
    imageHeightH: "w-44",
    badgeText: "text-xs",
    badgePx: "px-2",
    badgePy: "py-0.5",
  },
  xl: {
    padding: "p-6",
    headerPx: "px-6",
    headerPy: "py-4",
    footerPx: "px-6",
    footerPy: "py-4",
    bodyPx: "px-6",
    bodyPy: "py-4",
    titleText: "text-xl",
    subtitleText: "text-base",
    bodyText: "text-base",
    buttonText: "text-base",
    buttonPx: "px-5",
    buttonPy: "py-2.5",
    iconSize: 18,
    closeSize: 19,
    gap: "gap-4",
    imageHeightV: "h-64",
    imageHeightH: "w-56",
    badgeText: "text-xs",
    badgePx: "px-2.5",
    badgePy: "py-1",
  },
};

const variantStyles: Record<CardVariant, string> = {
  default:
    "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm shadow-black/5 dark:shadow-black/30",
  outlined: "bg-transparent border border-gray-300 dark:border-gray-600",
  elevated:
    "bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-xl shadow-black/10 dark:shadow-black/50",
  filled:
    "bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700",
  ghost: "bg-transparent border border-transparent",
};

const radiusStyles: Record<CardRadius, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
};

const dividerClass = "border-t border-gray-100 dark:border-gray-800";

export interface CardBadgeProps {
  label: string;
  color?: "gray" | "red" | "amber" | "emerald" | "blue" | "violet" | "rose";
  className?: string;
}

const badgeColorMap: Record<NonNullable<CardBadgeProps["color"]>, string> = {
  gray: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400",
  red: "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400",
  amber: "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400",
  emerald:
    "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400",
  blue: "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400",
  violet:
    "bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400",
  rose: "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400",
};

export function CardBadge({
  label,
  color = "gray",
  className = "",
}: CardBadgeProps) {
  const { state } = useCardContext();
  const s = sizeConfig[state.size];
  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full ${s.badgeText} ${s.badgePx} ${s.badgePy} ${badgeColorMap[color]} ${className}`}
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
  overlay?: React.ReactNode;
}

export function CardImage({
  src,
  alt = "",
  objectFit = "cover",
  aspectRatio,
  className = "",
  overlay,
}: CardImageProps) {
  const { state } = useCardContext();
  const s = sizeConfig[state.size];
  const { radius } = state;
  const r = radiusStyles[radius];

  const isHorizontal = state.orientation === "horizontal";

  return (
    <div
      className={`relative overflow-hidden shrink-0 ${isHorizontal ? `${s.imageHeightH} self-stretch` : `w-full ${s.imageHeightV}`} ${!isHorizontal ? `${r} rounded-b-none` : `${r} rounded-r-none`} ${className}`}
      style={aspectRatio ? { aspectRatio, height: "auto" } : undefined}
    >
      <img
        src={src}
        alt={alt}
        className={`w-full h-full`}
        style={{ objectFit }}
      />
      {overlay && <div className="absolute inset-0">{overlay}</div>}
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
}: CardHeaderProps) {
  const { state, toggleCollapse, close } = useCardContext();
  const s = sizeConfig[state.size];

  return (
    <div
      className={`flex items-start gap-3 ${s.headerPx} ${s.headerPy} ${divider ? dividerClass : ""} ${collapsible ? "cursor-pointer select-none" : ""} ${className}`}
      onClick={collapsible ? toggleCollapse : undefined}
    >
      {leading && (
        <div className="shrink-0 flex items-center justify-center text-gray-400 dark:text-gray-500 mt-0.5">
          {leading}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          {title && (
            <span
              className={`block font-semibold text-gray-900 dark:text-white ${s.titleText} leading-snug`}
            >
              {title}
            </span>
          )}
          {badge && <CardBadge {...badge} />}
        </div>
        {subtitle && (
          <span
            className={`block ${s.subtitleText} text-gray-500 dark:text-gray-400 mt-0.5 leading-snug`}
          >
            {subtitle}
          </span>
        )}
      </div>

      <div className="shrink-0 flex items-center gap-1.5 ml-auto">
        {trailing}
        {collapsible && (
          <motion.span
            animate={{ rotate: state.isCollapsed ? -90 : 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="flex items-center text-gray-400 dark:text-gray-500"
          >
            <ChevronDown size={s.iconSize} />
          </motion.span>
        )}
        {state.isModal && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            className="flex items-center justify-center w-7 h-7 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X size={s.closeSize} />
          </button>
        )}
      </div>
    </div>
  );
}

export interface CardCloseButtonProps {
  className?: string;
  icon?: React.ReactNode;
}

export function CardCloseButton({
  className = "",
  icon,
}: CardCloseButtonProps) {
  const { state, close } = useCardContext();
  const s = sizeConfig[state.size];
  return (
    <button
      type="button"
      onClick={close}
      className={`flex items-center justify-center w-7 h-7 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${className}`}
    >
      {icon ?? <X size={s.closeSize} />}
    </button>
  );
}

export interface CardBodyProps {
  children?: React.ReactNode;
  noPadding?: boolean;
  className?: string;
}

export function CardBody({
  children,
  noPadding = false,
  className = "",
}: CardBodyProps) {
  const { state } = useCardContext();
  const s = sizeConfig[state.size];

  return (
    <AnimatePresence initial={false}>
      {!state.isCollapsed && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.22, ease: "easeInOut" }}
          style={{ overflow: "hidden" }}
        >
          <div
            className={`${s.bodyText} text-gray-600 dark:text-gray-300 leading-relaxed ${!noPadding ? `${s.bodyPx} ${s.bodyPy}` : ""} ${className}`}
          >
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export interface CardMediaProps {
  children?: React.ReactNode;
  noPadding?: boolean;
  className?: string;
}

export function CardMedia({
  children,
  noPadding = false,
  className = "",
}: CardMediaProps) {
  const { state } = useCardContext();
  const s = sizeConfig[state.size];

  return (
    <div
      className={`${!noPadding ? `${s.bodyPx} ${s.bodyPy}` : ""} ${className}`}
    >
      {children}
    </div>
  );
}

type FooterButtonVariant = "primary" | "secondary" | "ghost" | "danger";

const footerBtnVariant: Record<FooterButtonVariant, string> = {
  primary:
    "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-100 border border-transparent shadow-sm",
  secondary:
    "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 shadow-sm",
  ghost:
    "bg-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 border border-transparent",
  danger:
    "bg-red-600 dark:bg-red-500 text-white hover:bg-red-700 dark:hover:bg-red-400 border border-transparent shadow-sm",
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
}: CardFooterButtonProps) {
  const { state } = useCardContext();
  const s = sizeConfig[state.size];
  const isDisabled = disabled || loading || state.disabled;

  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 font-medium rounded-lg transition-colors duration-100 ${s.buttonText} ${s.buttonPx} ${s.buttonPy} ${footerBtnVariant[variant]} ${isDisabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
    >
      {loading ? (
        <Loader2 size={s.iconSize - 1} className="animate-spin shrink-0" />
      ) : leadingIcon ? (
        <span
          className="shrink-0 flex items-center"
          style={{ width: s.iconSize, height: s.iconSize }}
        >
          {leadingIcon}
        </span>
      ) : null}
      <span>{label}</span>
      {!loading && trailingIcon && (
        <span
          className="shrink-0 flex items-center"
          style={{ width: s.iconSize, height: s.iconSize }}
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
}

export function CardFooterLink({
  label,
  href,
  onClick,
  external = false,
  className = "",
}: CardFooterLinkProps) {
  const { state } = useCardContext();
  const s = sizeConfig[state.size];

  const cls = `inline-flex items-center gap-1 font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors ${s.buttonText} ${className}`;

  if (href) {
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={cls}
      >
        <span>{label}</span>
        {external && (
          <ExternalLink size={s.iconSize - 3} className="shrink-0" />
        )}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={cls}>
      <span>{label}</span>
      {external && <ExternalLink size={s.iconSize - 3} className="shrink-0" />}
    </button>
  );
}

export interface CardFooterProps {
  children?: React.ReactNode;
  align?: "left" | "right" | "between" | "center";
  divider?: boolean;
  className?: string;
}

export function CardFooter({
  children,
  align = "right",
  divider = true,
  className = "",
}: CardFooterProps) {
  const { state } = useCardContext();
  const s = sizeConfig[state.size];

  const alignClass = {
    left: "justify-start",
    right: "justify-end",
    between: "justify-between",
    center: "justify-center",
  }[align];

  return (
    <div
      className={`flex items-center flex-wrap gap-2 ${s.footerPx} ${s.footerPy} ${divider ? dividerClass : ""} ${alignClass} ${className}`}
    >
      {children}
    </div>
  );
}

export interface CardDividerProps {
  className?: string;
}

export function CardDivider({ className = "" }: CardDividerProps) {
  return <div className={`${dividerClass} ${className}`} />;
}

export interface CardSkeletonProps {
  lines?: number;
  showImage?: boolean;
  showHeader?: boolean;
  className?: string;
}

export function CardSkeleton({
  lines = 3,
  showImage = false,
  showHeader = true,
  className = "",
}: CardSkeletonProps) {
  const { state } = useCardContext();
  const s = sizeConfig[state.size];

  return (
    <div className={`animate-pulse ${className}`}>
      {showImage && (
        <div
          className={`w-full ${s.imageHeightV} bg-gray-100 dark:bg-gray-800`}
        />
      )}
      {showHeader && (
        <div className={`${s.headerPx} ${s.headerPy} ${dividerClass}`}>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/5 mb-2" />
          <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-3/5" />
        </div>
      )}
      <div className={`${s.bodyPx} ${s.bodyPy} flex flex-col gap-2`}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="h-3 bg-gray-100 dark:bg-gray-800 rounded"
            style={{ width: i === lines - 1 ? "60%" : "100%" }}
          />
        ))}
      </div>
    </div>
  );
}

export interface CardLoadingOverlayProps {
  className?: string;
}

export function CardLoadingOverlay({
  className = "",
}: CardLoadingOverlayProps) {
  const { state } = useCardContext();

  return (
    <AnimatePresence>
      {state.isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className={`absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm z-10 rounded-[inherit] ${className}`}
        >
          <Loader2
            size={24}
            className="animate-spin text-gray-400 dark:text-gray-500"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export interface CardRootProps {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  selectable?: boolean;
  selected?: boolean;
  style?: React.CSSProperties;
}

function CardRoot({
  children,
  className = "",
  onClick,
  hoverable = false,
  selectable = false,
  selected = false,
  style,
}: CardRootProps) {
  const { state, cardRef } = useCardContext();
  const s = sizeConfig[state.size];
  const { variant, radius } = state;

  const isHorizontal = state.orientation === "horizontal";

  const interactiveClass =
    hoverable || onClick
      ? "cursor-pointer transition-all duration-150 hover:shadow-md dark:hover:shadow-black/40 hover:-translate-y-px active:translate-y-0"
      : "";

  const selectedClass =
    selectable && selected ? "ring-2 ring-gray-900 dark:ring-white" : "";

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      style={style}
      className={`relative overflow-hidden ${isHorizontal ? "flex flex-row" : "flex flex-col"} ${variantStyles[variant]} ${radiusStyles[radius]} ${interactiveClass} ${selectedClass} ${className}`}
    >
      {children}
    </div>
  );
}

export interface CardModalOverlayProps {
  children?: React.ReactNode;
  blur?: boolean;
  className?: string;
}

export function CardModal({
  children,
  blur = true,
  className = "",
}: CardModalOverlayProps) {
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

  return (
    <AnimatePresence>
      {state.isOpen && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            className={`fixed inset-0 z-40 bg-black/40 ${blur ? "backdrop-blur-sm" : ""} ${className}`}
          />
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-md">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export interface CardProps extends Omit<CardProviderProps, "children"> {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  selectable?: boolean;
  selected?: boolean;
  isModal?: boolean;
  modalBlur?: boolean;
  style?: React.CSSProperties;
}

export function Card({
  children,
  className = "",
  onClick,
  hoverable = false,
  selectable = false,
  selected = false,
  isModal = false,
  modalBlur = true,
  style,
  ...providerProps
}: CardProps) {
  const inner = (
    <CardRoot
      className={className}
      onClick={onClick}
      hoverable={hoverable}
      selectable={selectable}
      selected={selected}
      style={style}
    >
      {children}
    </CardRoot>
  );

  return (
    <CardProvider {...providerProps} isModal={isModal}>
      {isModal ? <CardModal blur={modalBlur}>{inner}</CardModal> : inner}
    </CardProvider>
  );
}

export { CardProvider, useCardContext };
export type { CardSize, CardVariant, CardRadius, CardOrientation };
