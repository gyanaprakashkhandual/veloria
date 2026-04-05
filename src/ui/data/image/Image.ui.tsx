import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  forwardRef,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Download,
  Maximize2,
  Minimize2,
  RotateCw,
  ImageOff,
  Expand,
} from "lucide-react";
import {
  ImageProvider,
  useImageContext,
  type ImageProviderProps,
  type ImageStatus,
  type ImageFit,
  type ImageRadius,
  type ImageAspectRatio,
  type ImageOverlayTrigger,
  type LightboxTransition,
} from "./Image.context";

const radiusStyles: Record<ImageRadius, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  full: "rounded-full",
};

const aspectRatioStyles: Record<string, string> = {
  auto: "",
  square: "aspect-square",
  video: "aspect-video",
  portrait: "aspect-[3/4]",
  wide: "aspect-[16/9]",
  cinema: "aspect-[21/9]",
};

const fitStyles: Record<ImageFit, string> = {
  cover: "object-cover",
  contain: "object-contain",
  fill: "object-fill",
  none: "object-none",
  "scale-down": "object-scale-down",
};

function resolveAspectRatio(ratio: ImageAspectRatio): { className: string; style?: React.CSSProperties } {
  if (aspectRatioStyles[ratio] !== undefined) {
    return { className: aspectRatioStyles[ratio] };
  }
  return { className: "", style: { aspectRatio: ratio } };
}

export interface ImageSkeletonProps {
  radius?: ImageRadius;
  className?: string;
}

export function ImageSkeleton({ radius = "md", className = "" }: ImageSkeletonProps) {
  return (
    <div className={`w-full h-full bg-gray-100 dark:bg-gray-800 animate-pulse ${radiusStyles[radius]} ${className}`} />
  );
}

export interface ImageErrorStateProps {
  icon?: React.ReactNode;
  message?: string;
  radius?: ImageRadius;
  className?: string;
  onRetry?: () => void;
}

export function ImageErrorState({
  icon,
  message = "Failed to load",
  radius = "md",
  className = "",
  onRetry,
}: ImageErrorStateProps) {
  return (
    <div className={`w-full h-full flex flex-col items-center justify-center gap-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 ${radiusStyles[radius]} ${className}`}>
      <span className="text-gray-300 dark:text-gray-700">
        {icon ?? <ImageOff size={28} />}
      </span>
      <span className="text-xs text-gray-400 dark:text-gray-600 font-medium">{message}</span>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors mt-0.5"
        >
          Retry
        </button>
      )}
    </div>
  );
}

export interface ImageOverlayProps {
  children?: React.ReactNode;
  trigger?: ImageOverlayTrigger;
  gradient?: "top" | "bottom" | "both" | "none" | string;
  blur?: boolean;
  className?: string;
}

export function ImageOverlay({
  children,
  trigger = "hover",
  gradient = "bottom",
  blur = false,
  className = "",
}: ImageOverlayProps) {
  const gradientMap: Record<string, string> = {
    none: "",
    top: "bg-gradient-to-b from-black/60 to-transparent",
    bottom: "bg-gradient-to-t from-black/70 via-black/20 to-transparent",
    both: "bg-gradient-to-b from-black/50 via-transparent to-black/50",
  };

  const gradientClass = gradientMap[gradient] ?? gradient;

  const visibilityClass =
    trigger === "always"
      ? "opacity-100"
      : trigger === "hover"
        ? "opacity-0 group-hover:opacity-100"
        : "opacity-0 pointer-events-none";

  return (
    <div
      className={`absolute inset-0 transition-opacity duration-200 ${gradientClass} ${visibilityClass} ${blur ? "backdrop-blur-sm" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

export interface ImageCaptionProps {
  text: string;
  position?: "inside-bottom" | "inside-top" | "outside-bottom" | "outside-top";
  trigger?: ImageOverlayTrigger;
  className?: string;
}

export function ImageCaption({
  text,
  position = "outside-bottom",
  trigger = "always",
  className = "",
}: ImageCaptionProps) {
  const isInside = position.startsWith("inside");
  const isTop = position.endsWith("top");

  const visibilityClass =
    trigger === "hover" ? "opacity-0 group-hover:opacity-100 transition-opacity duration-200" : "opacity-100";

  if (!isInside) {
    return (
      <p className={`text-xs text-gray-500 dark:text-gray-400 mt-1.5 leading-snug ${className}`}>
        {text}
      </p>
    );
  }

  return (
    <div
      className={`absolute ${isTop ? "top-0 left-0 right-0" : "bottom-0 left-0 right-0"} z-10 px-3 py-2 ${visibilityClass} ${className}`}
    >
      <p className="text-xs text-white/90 leading-snug font-medium drop-shadow">{text}</p>
    </div>
  );
}

export interface ImageBadgeProps {
  label: string;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  color?: "gray" | "red" | "emerald" | "blue" | "amber" | "violet" | "rose";
  className?: string;
}

const badgeColorMap: Record<NonNullable<ImageBadgeProps["color"]>, string> = {
  gray: "bg-gray-900/80 text-white",
  red: "bg-red-500/90 text-white",
  emerald: "bg-emerald-500/90 text-white",
  blue: "bg-blue-500/90 text-white",
  amber: "bg-amber-400/90 text-gray-900",
  violet: "bg-violet-500/90 text-white",
  rose: "bg-rose-500/90 text-white",
};

const badgePositionMap: Record<NonNullable<ImageBadgeProps["position"]>, string> = {
  "top-left": "top-2 left-2",
  "top-right": "top-2 right-2",
  "bottom-left": "bottom-2 left-2",
  "bottom-right": "bottom-2 right-2",
};

export function ImageBadge({
  label,
  position = "top-left",
  color = "gray",
  className = "",
}: ImageBadgeProps) {
  return (
    <span
      className={`absolute z-10 ${badgePositionMap[position]} px-2 py-0.5 text-[10px] font-bold rounded-full backdrop-blur-sm ${badgeColorMap[color]} ${className}`}
    >
      {label}
    </span>
  );
}

export interface ImageActionBarProps {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onDownload?: () => void;
  onExpand?: () => void;
  onFullscreen?: () => void;
  isZoomed?: boolean;
  isFullscreen?: boolean;
  trigger?: ImageOverlayTrigger;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  className?: string;
}

const actionBarPositionMap: Record<NonNullable<ImageActionBarProps["position"]>, string> = {
  "top-right": "top-2 right-2",
  "top-left": "top-2 left-2",
  "bottom-right": "bottom-2 right-2",
  "bottom-left": "bottom-2 left-2",
};

export function ImageActionBar({
  onZoomIn,
  onZoomOut,
  onDownload,
  onExpand,
  onFullscreen,
  isZoomed = false,
  isFullscreen = false,
  trigger = "hover",
  position = "top-right",
  className = "",
}: ImageActionBarProps) {
  const visibilityClass =
    trigger === "hover" ? "opacity-0 group-hover:opacity-100 transition-opacity duration-200" :
    trigger === "never" ? "hidden" : "opacity-100";

  const actions = [
    onZoomIn && { icon: <ZoomIn size={13} />, onClick: onZoomIn, label: "Zoom in" },
    onZoomOut && isZoomed && { icon: <ZoomOut size={13} />, onClick: onZoomOut, label: "Zoom out" },
    onDownload && { icon: <Download size={13} />, onClick: onDownload, label: "Download" },
    onExpand && { icon: <Expand size={13} />, onClick: onExpand, label: "Expand" },
    onFullscreen && { icon: isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />, onClick: onFullscreen, label: "Fullscreen" },
  ].filter(Boolean) as { icon: React.ReactNode; onClick: () => void; label: string }[];

  if (actions.length === 0) return null;

  return (
    <div className={`absolute z-20 flex items-center gap-1 ${actionBarPositionMap[position]} ${visibilityClass} ${className}`}>
      {actions.map((action) => (
        <button
          key={action.label}
          type="button"
          onClick={(e) => { e.stopPropagation(); action.onClick(); }}
          aria-label={action.label}
          className="w-7 h-7 flex items-center justify-center rounded-md bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-colors"
        >
          {action.icon}
        </button>
      ))}
    </div>
  );
}

export interface ImageBlurHashProps {
  hash?: string;
  color?: string;
  className?: string;
}

export function ImagePlaceholder({ color = "#f3f4f6", className = "" }: ImageBlurHashProps) {
  return (
    <div
      className={`absolute inset-0 transition-opacity duration-300 ${className}`}
      style={{ backgroundColor: color }}
    />
  );
}

export interface BaseImageProps {
  src: string;
  alt?: string;
  fit?: ImageFit;
  radius?: ImageRadius;
  aspectRatio?: ImageAspectRatio;
  placeholderColor?: string;
  placeholderSrc?: string;
  fallback?: React.ReactNode;
  fallbackMessage?: string;
  onLoad?: () => void;
  onError?: () => void;
  onRetry?: () => void;
  lazy?: boolean;
  priority?: boolean;
  draggable?: boolean;
  className?: string;
  wrapperClassName?: string;
  style?: React.CSSProperties;
  wrapperStyle?: React.CSSProperties;
}

function BaseImageInner({
  src,
  alt = "",
  fit = "cover",
  radius = "md",
  aspectRatio = "auto",
  placeholderColor,
  placeholderSrc,
  fallback,
  fallbackMessage,
  onRetry,
  lazy = true,
  priority = false,
  draggable = false,
  className = "",
  wrapperClassName = "",
  style,
  wrapperStyle,
}: BaseImageProps) {
  const { state, setStatus } = useImageContext();
  const [currentSrc, setCurrentSrc] = useState(src);
  const [retryCount, setRetryCount] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setCurrentSrc(src);
    setStatus("loading");
  }, [src, setStatus]);

  const handleLoad = useCallback(() => {
    setStatus("loaded");
  }, [setStatus]);

  const handleError = useCallback(() => {
    if (placeholderSrc && currentSrc !== placeholderSrc) {
      setCurrentSrc(placeholderSrc);
    } else {
      setStatus("error");
    }
  }, [placeholderSrc, currentSrc, setStatus]);

  const handleRetry = useCallback(() => {
    setRetryCount((c) => c + 1);
    setCurrentSrc(`${src}?retry=${retryCount + 1}`);
    setStatus("loading");
    onRetry?.();
  }, [src, retryCount, setStatus, onRetry]);

  const { className: arClass, style: arStyle } = resolveAspectRatio(aspectRatio);
  const radiusClass = radiusStyles[radius];

  return (
    <div
      className={`relative overflow-hidden ${radiusClass} ${arClass} ${wrapperClassName}`}
      style={{ ...arStyle, ...wrapperStyle }}
    >
      {state.status === "loading" && (
        <div className="absolute inset-0">
          {placeholderColor
            ? <ImagePlaceholder color={placeholderColor} />
            : <ImageSkeleton radius={radius} />
          }
        </div>
      )}

      {state.status === "error" ? (
        fallback ?? (
          <ImageErrorState
            radius={radius}
            message={fallbackMessage}
            onRetry={onRetry ? handleRetry : undefined}
          />
        )
      ) : (
        <img
          ref={imgRef}
          src={currentSrc}
          alt={alt}
          loading={priority ? "eager" : lazy ? "lazy" : "eager"}
          draggable={draggable}
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full transition-opacity duration-300 ${fitStyles[fit]} ${state.status === "loaded" ? "opacity-100" : "opacity-0"} ${className}`}
          style={style}
        />
      )}
    </div>
  );
}

export interface ImageProps extends BaseImageProps, Omit<ImageProviderProps, "children"> {
  caption?: string;
  captionPosition?: ImageCaptionProps["position"];
  captionTrigger?: ImageOverlayTrigger;
  badge?: ImageBadgeProps;
  overlay?: ImageOverlayProps;
  actionBar?: Omit<ImageActionBarProps, "onExpand" | "isFullscreen" | "onFullscreen">;
  lightbox?: boolean;
  lightboxSrc?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export function Image({
  caption,
  captionPosition = "outside-bottom",
  captionTrigger = "always",
  badge,
  overlay,
  actionBar,
  lightbox = false,
  lightboxSrc,
  onClick,
  hoverable = false,
  onLoad,
  onError,
  onLightboxOpen,
  onLightboxClose,
  wrapperClassName = "",
  ...baseProps
}: ImageProps) {
  return (
    <ImageProvider onLoad={onLoad} onError={onError} onLightboxOpen={onLightboxOpen} onLightboxClose={onLightboxClose}>
      <ImageInner
        caption={caption}
        captionPosition={captionPosition}
        captionTrigger={captionTrigger}
        badge={badge}
        overlay={overlay}
        actionBar={actionBar}
        lightbox={lightbox}
        lightboxSrc={lightboxSrc}
        onClick={onClick}
        hoverable={hoverable}
        wrapperClassName={wrapperClassName}
        {...baseProps}
      />
    </ImageProvider>
  );
}

function ImageInner({
  caption,
  captionPosition = "outside-bottom",
  captionTrigger,
  badge,
  overlay,
  actionBar,
  lightbox = false,
  lightboxSrc,
  onClick,
  hoverable = false,
  wrapperClassName = "",
  ...baseProps
}: Omit<ImageProps, keyof ImageProviderProps>) {
  const { openLightbox } = useImageContext();

  const handleClick = useCallback(() => {
    if (lightbox) openLightbox(0);
    onClick?.();
  }, [lightbox, openLightbox, onClick]);

  const isInsideCaption = caption && captionPosition?.startsWith("inside");
  const isOutsideCaption = caption && captionPosition?.startsWith("outside");

  return (
    <div className={`inline-block w-full ${wrapperClassName}`}>
      <div
        className={`relative group ${(lightbox || hoverable || onClick) ? "cursor-pointer" : ""} ${hoverable ? "transition-transform duration-200 hover:scale-[1.01]" : ""}`}
        onClick={handleClick}
      >
        <BaseImageInner {...baseProps} />

        {badge && <ImageBadge {...badge} />}

        {overlay && (
          <ImageOverlay {...overlay} />
        )}

        {isInsideCaption && (
          <ImageCaption text={caption} position={captionPosition} trigger={captionTrigger} />
        )}

        {actionBar && (
          <ImageActionBar
            {...actionBar}
            onExpand={lightbox ? () => openLightbox(0) : undefined}
          />
        )}

        {lightbox && (
          <LightboxViewer
            images={[{ src: lightboxSrc ?? baseProps.src, alt: baseProps.alt }]}
          />
        )}
      </div>

      {isOutsideCaption && (
        <ImageCaption text={caption} position={captionPosition} trigger={captionTrigger} />
      )}
    </div>
  );
}

export interface LightboxImage {
  src: string;
  alt?: string;
  caption?: string;
}

export interface LightboxViewerProps {
  images: LightboxImage[];
  transition?: LightboxTransition;
  showThumbnails?: boolean;
  showCounter?: boolean;
  showDownload?: boolean;
  showZoom?: boolean;
  showRotate?: boolean;
  className?: string;
}

export function LightboxViewer({
  images,
  transition = "fade",
  showThumbnails = false,
  showCounter = true,
  showDownload = true,
  showZoom = true,
  showRotate = false,
  className = "",
}: LightboxViewerProps) {
  const { state, closeLightbox, setLightboxIndex, toggleZoom, setZoom } = useImageContext();
  const [rotation, setRotation] = useState(0);
  const [dragStartX, setDragStartX] = useState<number | null>(null);

  const currentImage = images[state.lightboxIndex];
  const hasPrev = state.lightboxIndex > 0;
  const hasNext = state.lightboxIndex < images.length - 1;

  const goNext = useCallback(() => {
    if (hasNext) { setLightboxIndex(state.lightboxIndex + 1); setRotation(0); }
  }, [hasNext, state.lightboxIndex, setLightboxIndex]);

  const goPrev = useCallback(() => {
    if (hasPrev) { setLightboxIndex(state.lightboxIndex - 1); setRotation(0); }
  }, [hasPrev, state.lightboxIndex, setLightboxIndex]);

  const handleDownload = useCallback(() => {
    const a = document.createElement("a");
    a.href = currentImage.src;
    a.download = currentImage.alt ?? "image";
    a.click();
  }, [currentImage]);

  useEffect(() => {
    if (!state.isLightboxOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [state.isLightboxOpen, closeLightbox, goNext, goPrev]);

  const motionProps = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.2 },
    },
    slide: {
      initial: { opacity: 0, x: 40 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -40 },
      transition: { duration: 0.2, ease: "easeOut" },
    },
    zoom: {
      initial: { opacity: 0, scale: 0.92 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.92 },
      transition: { duration: 0.2, ease: "easeOut" },
    },
  }[transition];

  return (
    <AnimatePresence>
      {state.isLightboxOpen && (
        <>
          <motion.div
            key="lb-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm"
            onClick={closeLightbox}
          />

          <motion.div
            key="lb-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-4 pointer-events-none ${className}`}
          >
            <div className="pointer-events-auto w-full max-w-5xl flex flex-col items-center gap-3">
              <div className="w-full flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  {showCounter && images.length > 1 && (
                    <span className="text-xs font-semibold text-white/60">
                      {state.lightboxIndex + 1} / {images.length}
                    </span>
                  )}
                  {currentImage.caption && (
                    <span className="text-xs text-white/70">{currentImage.caption}</span>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  {showZoom && (
                    <button
                      type="button"
                      onClick={toggleZoom}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
                    >
                      {state.isZoomed ? <ZoomOut size={15} /> : <ZoomIn size={15} />}
                    </button>
                  )}
                  {showRotate && (
                    <button
                      type="button"
                      onClick={() => setRotation((r) => r + 90)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
                    >
                      <RotateCw size={15} />
                    </button>
                  )}
                  {showDownload && (
                    <button
                      type="button"
                      onClick={handleDownload}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
                    >
                      <Download size={15} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={closeLightbox}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>

              <div className="relative w-full flex items-center justify-center">
                {hasPrev && (
                  <button
                    type="button"
                    onClick={goPrev}
                    className="absolute left-0 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors -translate-x-1"
                  >
                    <ChevronLeft size={18} />
                  </button>
                )}

                <div
                  className="relative overflow-hidden rounded-xl max-h-[70vh] max-w-full"
                  style={{ cursor: state.isZoomed ? "zoom-out" : "zoom-in" }}
                  onClick={toggleZoom}
                  onMouseDown={(e) => setDragStartX(e.clientX)}
                  onMouseUp={(e) => {
                    if (dragStartX !== null && Math.abs(e.clientX - dragStartX) > 40) {
                      e.clientX < dragStartX ? goNext() : goPrev();
                    }
                    setDragStartX(null);
                  }}
                >
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={`${state.lightboxIndex}-${currentImage.src}`}
                      {...motionProps}
                      src={currentImage.src}
                      alt={currentImage.alt ?? ""}
                      draggable={false}
                      className="max-h-[70vh] max-w-full object-contain select-none transition-transform duration-300"
                      style={{
                        transform: `scale(${state.zoomScale}) rotate(${rotation}deg)`,
                        transformOrigin: "center center",
                      }}
                    />
                  </AnimatePresence>
                </div>

                {hasNext && (
                  <button
                    type="button"
                    onClick={goNext}
                    className="absolute right-0 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors translate-x-1"
                  >
                    <ChevronRight size={18} />
                  </button>
                )}
              </div>

              {showThumbnails && images.length > 1 && (
                <div className="flex items-center gap-2 flex-wrap justify-center mt-1">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => { setLightboxIndex(i); setRotation(0); }}
                      className={`w-12 h-12 rounded-lg overflow-hidden shrink-0 ring-2 transition-all ${i === state.lightboxIndex ? "ring-white opacity-100" : "ring-transparent opacity-50 hover:opacity-80"}`}
                    >
                      <img src={img.src} alt={img.alt ?? ""} className="w-full h-full object-cover" draggable={false} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export interface ImageGalleryProps {
  images: LightboxImage[];
  columns?: 2 | 3 | 4 | 5;
  gap?: "sm" | "md" | "lg";
  radius?: ImageRadius;
  fit?: ImageFit;
  aspectRatio?: ImageAspectRatio;
  lightbox?: boolean;
  lightboxOptions?: Omit<LightboxViewerProps, "images">;
  hoverable?: boolean;
  badge?: (img: LightboxImage, index: number) => ImageBadgeProps | undefined;
  overlay?: ImageOverlayProps;
  className?: string;
  itemClassName?: string;
}

export function ImageGallery({
  images,
  columns = 3,
  gap = "md",
  radius = "lg",
  fit = "cover",
  aspectRatio = "square",
  lightbox = true,
  lightboxOptions,
  hoverable = true,
  badge,
  overlay,
  className = "",
  itemClassName = "",
}: ImageGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const [state, setState] = useState({
    isLightboxOpen: false,
    lightboxIndex: 0,
    isZoomed: false,
    zoomScale: 1,
    isFullscreen: false,
    status: "idle" as ImageStatus,
  });

  const gapMap = { sm: "gap-1.5", md: "gap-3", lg: "gap-4" };
  const colMap = { 2: "grid-cols-2", 3: "grid-cols-2 sm:grid-cols-3", 4: "grid-cols-2 sm:grid-cols-4", 5: "grid-cols-2 sm:grid-cols-3 md:grid-cols-5" };

  return (
    <ImageProvider
      onLightboxOpen={() => {}}
      onLightboxClose={() => {}}
    >
      <GalleryInner
        images={images}
        columns={columns}
        gap={gap}
        radius={radius}
        fit={fit}
        aspectRatio={aspectRatio}
        lightbox={lightbox}
        lightboxOptions={lightboxOptions}
        hoverable={hoverable}
        badge={badge}
        overlay={overlay}
        className={className}
        itemClassName={itemClassName}
      />
    </ImageProvider>
  );
}

interface GalleryInnerProps extends Omit<ImageGalleryProps, "images"> {
  images: LightboxImage[];
}

function GalleryInner({
  images,
  columns = 3,
  gap = "md",
  radius = "lg",
  fit = "cover",
  aspectRatio = "square",
  lightbox = true,
  lightboxOptions,
  hoverable = true,
  badge,
  overlay,
  className = "",
  itemClassName = "",
}: GalleryInnerProps) {
  const { openLightbox, setLightboxIndex } = useImageContext();

  const gapMap = { sm: "gap-1.5", md: "gap-3", lg: "gap-4" };
  const colMap: Record<number, string> = {
    2: "grid-cols-2",
    3: "grid-cols-2 sm:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-4",
    5: "grid-cols-2 sm:grid-cols-3 md:grid-cols-5",
  };

  return (
    <div className={`w-full ${className}`}>
      <div className={`grid ${colMap[columns]} ${gapMap[gap]}`}>
        {images.map((img, i) => {
          const imgBadge = badge?.(img, i);
          const { className: arClass, style: arStyle } = resolveAspectRatio(aspectRatio);

          return (
            <div
              key={i}
              className={`relative group overflow-hidden ${radiusStyles[radius]} ${arClass} ${hoverable ? "cursor-pointer transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-black/10 dark:hover:shadow-black/40" : ""} ${itemClassName}`}
              style={arStyle}
              onClick={() => { if (lightbox) { setLightboxIndex(i); openLightbox(i); } }}
            >
              <img
                src={img.src}
                alt={img.alt ?? ""}
                loading="lazy"
                draggable={false}
                className={`w-full h-full ${fitStyles[fit]} transition-transform duration-300 ${hoverable ? "group-hover:scale-105" : ""}`}
              />
              {imgBadge && <ImageBadge {...imgBadge} />}
              {overlay && <ImageOverlay {...overlay} />}
            </div>
          );
        })}
      </div>

      {lightbox && (
        <LightboxViewer images={images} {...lightboxOptions} />
      )}
    </div>
  );
}

export interface ImageCompareProps {
  before: { src: string; alt?: string; label?: string };
  after: { src: string; alt?: string; label?: string };
  radius?: ImageRadius;
  aspectRatio?: ImageAspectRatio;
  initialPosition?: number;
  className?: string;
}

export function ImageCompare({
  before,
  after,
  radius = "xl",
  aspectRatio = "video",
  initialPosition = 50,
  className = "",
}: ImageCompareProps) {
  const [position, setPosition] = useState(initialPosition);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { className: arClass, style: arStyle } = resolveAspectRatio(aspectRatio);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    setPosition(x * 100);
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent | TouchEvent) => {
      updatePosition("touches" in e ? e.touches[0].clientX : e.clientX);
    };
    const onUp = () => setDragging(false);
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    document.addEventListener("touchmove", onMove as EventListener);
    document.addEventListener("touchend", onUp);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("touchmove", onMove as EventListener);
      document.removeEventListener("touchend", onUp);
    };
  }, [dragging, updatePosition]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden select-none ${radiusStyles[radius]} ${arClass} ${className}`}
      style={arStyle}
    >
      <img src={after.src} alt={after.alt ?? ""} draggable={false} className="absolute inset-0 w-full h-full object-cover" />

      <div className="absolute inset-0 overflow-hidden" style={{ width: `${position}%` }}>
        <img src={before.src} alt={before.alt ?? ""} draggable={false} className="absolute inset-0 w-full h-full object-cover" style={{ width: containerRef.current ? `${containerRef.current.offsetWidth}px` : "100%" }} />
      </div>

      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_8px_rgba(0,0,0,0.4)] cursor-col-resize z-10 flex items-center justify-center"
        style={{ left: `${position}%`, transform: "translateX(-50%)" }}
        onMouseDown={(e) => { e.preventDefault(); setDragging(true); }}
        onTouchStart={(e) => { e.preventDefault(); setDragging(true); }}
      >
        <div className="w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
          <div className="flex gap-0.5">
            <ChevronLeft size={10} className="text-gray-500 -mr-0.5" />
            <ChevronRight size={10} className="text-gray-500 -ml-0.5" />
          </div>
        </div>
      </div>

      {before.label && (
        <span className="absolute bottom-2 left-3 text-[10px] font-bold text-white bg-black/50 rounded-md px-2 py-0.5 backdrop-blur-sm z-10">
          {before.label}
        </span>
      )}
      {after.label && (
        <span className="absolute bottom-2 right-3 text-[10px] font-bold text-white bg-black/50 rounded-md px-2 py-0.5 backdrop-blur-sm z-10">
          {after.label}
        </span>
      )}
    </div>
  );
}

export interface ImageZoomableProps extends BaseImageProps {
  maxZoom?: number;
  caption?: string;
  className?: string;
}

export function ImageZoomable({
  maxZoom = 3,
  caption,
  wrapperClassName = "",
  ...baseProps
}: ImageZoomableProps) {
  return (
    <ImageProvider>
      <ImageZoomableInner maxZoom={maxZoom} caption={caption} wrapperClassName={wrapperClassName} {...baseProps} />
    </ImageProvider>
  );
}

function ImageZoomableInner({ maxZoom = 3, caption, ...baseProps }: ImageZoomableProps) {
  const { state, toggleZoom } = useImageContext();

  return (
    <div className="w-full">
      <div
        className="overflow-hidden cursor-zoom-in"
        style={state.isZoomed ? { cursor: "zoom-out" } : {}}
        onClick={toggleZoom}
      >
        <div
          className="transition-transform duration-300 origin-center"
          style={{ transform: `scale(${state.zoomScale})` }}
        >
          <BaseImageInner {...baseProps} />
        </div>
      </div>
      {caption && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">{caption}</p>}
    </div>
  );
}

export {
  ImageProvider,
  useImageContext,
};
export type {
  ImageStatus,
  ImageFit,
  ImageRadius,
  ImageAspectRatio,
  ImageOverlayTrigger,
  LightboxTransition,
};