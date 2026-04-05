import React, {
  useEffect,
  useCallback,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Maximize2, Minimize2 } from "lucide-react";
import {
  BackdropProvider,
  useBackdropContext,
  type BackdropProviderProps,
  type BackdropVariant,
  type BackdropBlur,
  type BackdropEnterAnimation,
  type BackdropPlacement,
  type BackdropSize,
  type BackdropScrollBehavior,
} from "./Backdrop.context";

const sizeMap: Record<BackdropSize, string> = {
  xs:   "max-w-xs w-full",
  sm:   "max-w-sm w-full",
  md:   "max-w-md w-full",
  lg:   "max-w-lg w-full",
  xl:   "max-w-xl w-full",
  "2xl":"max-w-2xl w-full",
  "3xl":"max-w-3xl w-full",
  "4xl":"max-w-4xl w-full",
  "5xl":"max-w-5xl w-full",
  full: "w-full h-full max-w-none rounded-none",
  auto: "w-auto",
};

const blurMap: Record<BackdropBlur, string> = {
  none: "",
  sm:   "backdrop-blur-sm",
  md:   "backdrop-blur-md",
  lg:   "backdrop-blur-lg",
  xl:   "backdrop-blur-xl",
};

const variantBackdropStyle: Record<BackdropVariant, string> = {
  dark:        "bg-black/60",
  light:       "bg-white/60",
  blur:        "bg-black/30 backdrop-blur-md",
  frosted:     "bg-white/20 backdrop-blur-xl",
  transparent: "bg-transparent",
  color:       "",
};

const placementOuter: Record<BackdropPlacement, string> = {
  center:       "items-center justify-center",
  top:          "items-start justify-center pt-8 sm:pt-16",
  bottom:       "items-end justify-center pb-8 sm:pb-16",
  left:         "items-center justify-start",
  right:        "items-center justify-end",
  "top-left":   "items-start justify-start p-4 sm:p-8",
  "top-right":  "items-start justify-end p-4 sm:p-8",
  "bottom-left":"items-end justify-start p-4 sm:p-8",
  "bottom-right":"items-end justify-end p-4 sm:p-8",
};

const placementRadius: Record<BackdropPlacement, string> = {
  center:        "rounded-xl",
  top:           "rounded-b-xl",
  bottom:        "rounded-t-xl",
  left:          "rounded-r-xl",
  right:         "rounded-l-xl",
  "top-left":    "rounded-xl",
  "top-right":   "rounded-xl",
  "bottom-left": "rounded-xl",
  "bottom-right":"rounded-xl",
};

const placementSizeOverride: Partial<Record<BackdropPlacement, string>> = {
  left:  "h-full max-w-none rounded-none",
  right: "h-full max-w-none rounded-none",
};

const animationVariants: Record<BackdropEnterAnimation, { initial: object; animate: object; exit: object }> = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit:    { opacity: 0 },
  },
  zoom: {
    initial: { opacity: 0, scale: 0.92 },
    animate: { opacity: 1, scale: 1 },
    exit:    { opacity: 0, scale: 0.92 },
  },
  "slide-up": {
    initial: { opacity: 0, y: 32 },
    animate: { opacity: 1, y: 0 },
    exit:    { opacity: 0, y: 32 },
  },
  "slide-down": {
    initial: { opacity: 0, y: -32 },
    animate: { opacity: 1, y: 0 },
    exit:    { opacity: 0, y: -32 },
  },
  "slide-left": {
    initial: { opacity: 0, x: 64 },
    animate: { opacity: 1, x: 0 },
    exit:    { opacity: 0, x: 64 },
  },
  "slide-right": {
    initial: { opacity: 0, x: -64 },
    animate: { opacity: 1, x: 0 },
    exit:    { opacity: 0, x: -64 },
  },
  flip: {
    initial: { opacity: 0, rotateX: -15, scale: 0.95 },
    animate: { opacity: 1, rotateX: 0, scale: 1 },
    exit:    { opacity: 0, rotateX: -15, scale: 0.95 },
  },
  none: {
    initial: {},
    animate: {},
    exit:    {},
  },
};

const backdropMotion = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit:    { opacity: 0 },
  transition: { duration: 0.18, ease: "easeOut" },
};

function BackdropOverlay({
  className = "",
  contentClassName = "",
  headerClassName = "",
  bodyClassName = "",
  footerClassName = "",
  closeButtonClassName = "",
  header,
  footer,
  children,
  showCloseButton = true,
  showFullscreenButton = false,
  hideHeader = false,
  hideFooter = false,
  scrollBehavior,
}: BackdropOverlayProps) {
  const {
    state,
    dispatch,
    contentRef,
    close,
    onCloseCallback,
    onBackdropClickCallback,
  } = useBackdropContext();

  const [localFullscreen, setLocalFullscreen] = useState(state.isFullScreen);

  const handleAnimationComplete = useCallback(() => {
    if (state.isClosing) {
      dispatch({ type: "CLOSE" });
      dispatch({ type: "UNMOUNT" });
      onCloseCallback?.();
      document.body.style.overflow = "";
    }
  }, [state.isClosing, dispatch, onCloseCallback]);

  const handleBackdropClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    onBackdropClickCallback?.();
    if (state.closeOnBackdropClick && state.isDismissable) {
      close();
    }
  }, [state.closeOnBackdropClick, state.isDismissable, close, onBackdropClickCallback]);

  useEffect(() => {
    if (!state.closeOnEsc || !state.isDismissable) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [state.closeOnEsc, state.isDismissable, close]);

  const scroll = scrollBehavior ?? state.scrollBehavior;
  const anim = animationVariants[state.enterAnimation];
  const isFullscreen = localFullscreen || state.size === "full";

  const backdropBg = state.backdropColor
    ? ""
    : variantBackdropStyle[state.variant];

  const backdropStyle: React.CSSProperties = state.backdropColor
    ? { backgroundColor: state.backdropColor }
    : {};

  const radiusClass = isFullscreen
    ? "rounded-none"
    : placementRadius[state.placement];

  const contentSize = isFullscreen
    ? "w-full h-full max-w-none"
    : placementSizeOverride[state.placement] ?? sizeMap[state.size];

  const outerAlign = isFullscreen
    ? "items-center justify-center"
    : placementOuter[state.placement];

  const panelMotionProps = state.enterAnimation === "none"
    ? {}
    : { ...anim, transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] } };

  return createPortal(
    <AnimatePresence onExitComplete={handleAnimationComplete}>
      {(state.isOpen || state.isClosing) && (
        <div
          className="fixed inset-0 z-50 flex overflow-hidden"
          style={{ perspective: "1200px" }}
        >
          {state.hasBackdrop && (
            <motion.div
              {...backdropMotion}
              animate={state.isClosing ? { opacity: 0 } : { opacity: 1 }}
              className={`absolute inset-0 ${backdropBg} ${blurMap[state.blur]}`}
              style={backdropStyle}
              aria-hidden="true"
            />
          )}

          <div
            className={`relative flex w-full h-full ${outerAlign} ${scroll === "outside" ? "overflow-y-auto" : ""} p-4 sm:p-6`}
            onClick={handleBackdropClick}
          >
            <motion.div
              ref={contentRef as React.RefObject<HTMLDivElement>}
              key="backdrop-content"
              initial={panelMotionProps.initial ?? {}}
              animate={state.isClosing
                ? (panelMotionProps.exit ?? { opacity: 0 })
                : (panelMotionProps.animate ?? { opacity: 1 })
              }
              transition={panelMotionProps.transition}
              className={`
                relative flex flex-col
                bg-white dark:bg-gray-900
                border border-gray-200 dark:border-gray-700
                shadow-2xl shadow-black/20 dark:shadow-black/60
                ${radiusClass}
                ${contentSize}
                ${scroll === "inside" ? "max-h-[calc(100vh-3rem)] sm:max-h-[calc(100vh-6rem)]" : ""}
                ${isFullscreen ? "m-0" : ""}
                ${contentClassName}
              `}
              onClick={(e) => e.stopPropagation()}
            >
              {!hideHeader && (header || showCloseButton || showFullscreenButton) && (
                <div
                  className={`
                    flex items-center justify-between shrink-0
                    px-5 py-4 border-b border-gray-100 dark:border-gray-800
                    ${headerClassName}
                  `}
                >
                  <div className="flex-1 min-w-0">
                    {header}
                  </div>
                  <div className="flex items-center gap-1 ml-3 shrink-0">
                    {showFullscreenButton && (
                      <button
                        type="button"
                        onClick={() => setLocalFullscreen((v) => !v)}
                        title={localFullscreen ? "Exit fullscreen" : "Fullscreen"}
                        className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-100"
                      >
                        {localFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                      </button>
                    )}
                    {showCloseButton && state.isDismissable && (
                      <button
                        type="button"
                        onClick={close}
                        title="Close"
                        className={`
                          inline-flex items-center justify-center w-7 h-7 rounded-lg
                          text-gray-400 dark:text-gray-500
                          hover:bg-gray-100 dark:hover:bg-gray-800
                          hover:text-gray-600 dark:hover:text-gray-300
                          transition-colors duration-100
                          ${closeButtonClassName}
                        `}
                      >
                        <X size={15} />
                      </button>
                    )}
                  </div>
                </div>
              )}

              <div
                className={`
                  flex-1 min-h-0
                  ${scroll === "inside" ? "overflow-y-auto" : ""}
                  px-5 py-4
                  ${bodyClassName}
                `}
              >
                {children}
              </div>

              {!hideFooter && footer && (
                <div
                  className={`
                    shrink-0 flex items-center justify-end gap-2
                    px-5 py-4 border-t border-gray-100 dark:border-gray-800
                    ${footerClassName}
                  `}
                >
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export interface BackdropProps {
  isOpen?: boolean;
  defaultOpen?: boolean;
  variant?: BackdropVariant;
  blur?: BackdropBlur;
  enterAnimation?: BackdropEnterAnimation;
  placement?: BackdropPlacement;
  size?: BackdropSize;
  scrollBehavior?: BackdropScrollBehavior;
  closeOnBackdropClick?: boolean;
  closeOnEsc?: boolean;
  isDismissable?: boolean;
  hasBackdrop?: boolean;
  isFullScreen?: boolean;
  backdropColor?: string;
  onOpen?: () => void;
  onClose?: () => void;
  onBackdropClick?: () => void;
  children?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  showCloseButton?: boolean;
  showFullscreenButton?: boolean;
  hideHeader?: boolean;
  hideFooter?: boolean;
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  closeButtonClassName?: string;
  trigger?: React.ReactNode;
}

interface BackdropOverlayProps {
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  closeButtonClassName?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  showCloseButton?: boolean;
  showFullscreenButton?: boolean;
  hideHeader?: boolean;
  hideFooter?: boolean;
  scrollBehavior?: BackdropScrollBehavior;
  children?: React.ReactNode;
}

function BackdropTriggerWrapper({
  trigger,
  children,
}: {
  trigger?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { toggle } = useBackdropContext();
  return (
    <>
      {trigger && (
        <div onClick={toggle} className="inline-block cursor-pointer">
          {trigger}
        </div>
      )}
      {children}
    </>
  );
}

export function Backdrop({
  isOpen,
  defaultOpen,
  variant = "dark",
  blur = "sm",
  enterAnimation = "fade",
  placement = "center",
  size = "md",
  scrollBehavior = "inside",
  closeOnBackdropClick = true,
  closeOnEsc = true,
  isDismissable = true,
  hasBackdrop = true,
  isFullScreen = false,
  backdropColor = "",
  onOpen,
  onClose,
  onBackdropClick,
  children,
  header,
  footer,
  showCloseButton = true,
  showFullscreenButton = false,
  hideHeader = false,
  hideFooter = false,
  className = "",
  contentClassName = "",
  headerClassName = "",
  bodyClassName = "",
  footerClassName = "",
  closeButtonClassName = "",
  trigger,
}: BackdropProps) {
  return (
    <BackdropProvider
      isOpen={isOpen}
      defaultOpen={defaultOpen}
      variant={variant}
      blur={blur}
      enterAnimation={enterAnimation}
      placement={placement}
      size={size}
      scrollBehavior={scrollBehavior}
      closeOnBackdropClick={closeOnBackdropClick}
      closeOnEsc={closeOnEsc}
      isDismissable={isDismissable}
      hasBackdrop={hasBackdrop}
      isFullScreen={isFullScreen}
      backdropColor={backdropColor}
      onOpen={onOpen}
      onClose={onClose}
      onBackdropClick={onBackdropClick}
    >
      <BackdropTriggerWrapper trigger={trigger}>
        <BackdropOverlay
          contentClassName={contentClassName}
          headerClassName={headerClassName}
          bodyClassName={bodyClassName}
          footerClassName={footerClassName}
          closeButtonClassName={closeButtonClassName}
          header={header}
          footer={footer}
          showCloseButton={showCloseButton}
          showFullscreenButton={showFullscreenButton}
          hideHeader={hideHeader}
          hideFooter={hideFooter}
          scrollBehavior={scrollBehavior}
        >
          {children}
        </BackdropOverlay>
      </BackdropTriggerWrapper>
    </BackdropProvider>
  );
}

export function useBackdrop() {
  const { open, close, toggle, state } = useBackdropContext();
  return { open, close, toggle, isOpen: state.isOpen };
}

export { BackdropProvider, useBackdropContext };
export type {
  BackdropVariant,
  BackdropBlur,
  BackdropEnterAnimation,
  BackdropPlacement,
  BackdropSize,
  BackdropScrollBehavior,
};