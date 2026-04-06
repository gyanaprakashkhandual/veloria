import React, {
  useEffect,
  useRef,
  useCallback,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import {
  DrawerProvider,
  useDrawerContext,
  type DrawerProviderProps,
  type DrawerSize,
  type DrawerSide,
  type DrawerVariant,
} from "./Drawer.context";

// ─── Size Config ──────────────────────────────────────────────────────────────

const sizeConfig = {
  sm: {
    lateral: "w-72",       // left / right drawers
    stacked: "h-64",       // top / bottom drawers
    headerPx: "px-4",
    headerPy: "py-3",
    bodyPx: "px-4",
    bodyPy: "py-4",
    footerPx: "px-4",
    footerPy: "py-3",
    titleText: "text-sm",
    descText: "text-xs",
    closeSize: 15,
    closeDim: "w-7 h-7",
  },
  md: {
    lateral: "w-96",
    stacked: "h-80",
    headerPx: "px-5",
    headerPy: "py-4",
    bodyPx: "px-5",
    bodyPy: "py-5",
    footerPx: "px-5",
    footerPy: "py-4",
    titleText: "text-base",
    descText: "text-sm",
    closeSize: 16,
    closeDim: "w-8 h-8",
  },
  lg: {
    lateral: "w-[480px]",
    stacked: "h-96",
    headerPx: "px-6",
    headerPy: "py-5",
    bodyPx: "px-6",
    bodyPy: "py-6",
    footerPx: "px-6",
    footerPy: "py-5",
    titleText: "text-lg",
    descText: "text-sm",
    closeSize: 17,
    closeDim: "w-8 h-8",
  },
  xl: {
    lateral: "w-[600px]",
    stacked: "h-[480px]",
    headerPx: "px-7",
    headerPy: "py-6",
    bodyPx: "px-7",
    bodyPy: "py-7",
    footerPx: "px-7",
    footerPy: "py-6",
    titleText: "text-xl",
    descText: "text-base",
    closeSize: 18,
    closeDim: "w-9 h-9",
  },
  full: {
    lateral: "w-screen",
    stacked: "h-screen",
    headerPx: "px-8",
    headerPy: "py-6",
    bodyPx: "px-8",
    bodyPy: "py-8",
    footerPx: "px-8",
    footerPy: "py-6",
    titleText: "text-xl",
    descText: "text-base",
    closeSize: 18,
    closeDim: "w-9 h-9",
  },
};

// ─── Motion Variants ──────────────────────────────────────────────────────────

const slideVariants: Record<DrawerSide, { hidden: object; visible: object }> = {
  left:   { hidden: { x: "-100%" }, visible: { x: 0 } },
  right:  { hidden: { x: "100%"  }, visible: { x: 0 } },
  top:    { hidden: { y: "-100%" }, visible: { y: 0 } },
  bottom: { hidden: { y: "100%"  }, visible: { y: 0 } },
};

const backdropVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1 },
};

const transition = { type: "spring" as const, stiffness: 320, damping: 32 };
const backdropTransition = { duration: 0.2, ease: "easeOut" };

// ─── Positioning helpers ──────────────────────────────────────────────────────

function panelPositionClass(side: DrawerSide): string {
  return {
    left:   "inset-y-0 left-0",
    right:  "inset-y-0 right-0",
    top:    "inset-x-0 top-0",
    bottom: "inset-x-0 bottom-0",
  }[side];
}

function panelSizeClass(side: DrawerSide, size: DrawerSize): string {
  const s = sizeConfig[size];
  const isLateral = side === "left" || side === "right";
  if (size === "full") return isLateral ? "w-screen h-screen" : "w-screen h-screen";
  return isLateral ? `${s.lateral} h-full` : `w-full ${s.stacked}`;
}

function panelRoundedClass(side: DrawerSide): string {
  return {
    left:   "rounded-r-2xl",
    right:  "rounded-l-2xl",
    top:    "rounded-b-2xl",
    bottom: "rounded-t-2xl",
  }[side];
}

// ─── Focus Trap ───────────────────────────────────────────────────────────────

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])';

function useFocusTrap(ref: React.RefObject<HTMLElement | null>, active: boolean) {
  useEffect(() => {
    if (!active || !ref.current) return;

    const el = ref.current;
    const focusable = Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE));
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    first?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (focusable.length === 0) { e.preventDefault(); return; }
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };

    el.addEventListener("keydown", handleKeyDown);
    return () => el.removeEventListener("keydown", handleKeyDown);
  }, [active, ref]);
}

// ─── Body Scroll Lock ─────────────────────────────────────────────────────────

function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [active]);
}

// ─── Drawer Panel (inner) ─────────────────────────────────────────────────────

interface DrawerPanelProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  /** Hide the built-in close button */
  hideCloseButton?: boolean;
  /** Show a drag-handle hint (bottom/top drawers) */
  showHandle?: boolean;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  overlayClassName?: string;
  /** Clicking backdrop closes the drawer (default: true) */
  closeOnBackdropClick?: boolean;
  /** Pressing Escape closes the drawer (default: true) */
  closeOnEscape?: boolean;
}

function DrawerPanel({
  title,
  description,
  children,
  footer,
  hideCloseButton = false,
  showHandle = true,
  className = "",
  headerClassName = "",
  bodyClassName = "",
  footerClassName = "",
  overlayClassName = "",
  closeOnBackdropClick = true,
  closeOnEscape = true,
}: DrawerPanelProps) {
  const { state, close, panelRef } = useDrawerContext();
  const { size, side, variant, isOpen } = state;
  const s = sizeConfig[size];
  const isLateral = side === "left" || side === "right";
  const isStacked = !isLateral;

  useFocusTrap(panelRef as React.RefObject<HTMLElement | null>, isOpen);
  useScrollLock(isOpen && variant !== "push");

  // Escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, close, closeOnEscape]);

  const handleBackdropClick = useCallback(() => {
    if (closeOnBackdropClick) close();
  }, [close, closeOnBackdropClick]);

  const content = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          {variant !== "ghost" && (
            <motion.div
              key="drawer-backdrop"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={backdropTransition}
              onClick={handleBackdropClick}
              aria-hidden="true"
              className={`
                fixed inset-0 z-40
                bg-black/30 dark:bg-black/50
                backdrop-blur-[2px]
                ${overlayClassName}
              `}
            />
          )}

          {/* Panel */}
          <motion.div
            key="drawer-panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={typeof title === "string" ? title : undefined}
            variants={slideVariants[side]}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={transition}
            className={`
              fixed z-50
              ${panelPositionClass(side)}
              ${panelSizeClass(side, size)}
              ${size !== "full" ? panelRoundedClass(side) : ""}
              flex flex-col
              bg-white dark:bg-gray-900
              border
              ${side === "right"  ? "border-l" : ""}
              ${side === "left"   ? "border-r" : ""}
              ${side === "top"    ? "border-b" : ""}
              ${side === "bottom" ? "border-t" : ""}
              border-gray-200 dark:border-gray-700
              shadow-2xl shadow-black/15 dark:shadow-black/50
              outline-none
              ${className}
            `}
          >
            {/* Drag handle for top/bottom drawers */}
            {isStacked && showHandle && size !== "full" && (
              <div
                className={`
                  flex justify-center shrink-0
                  ${side === "bottom" ? "pt-3 pb-1" : "pb-3 pt-1"}
                `}
              >
                <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
              </div>
            )}

            {/* Header */}
            {(title || !hideCloseButton) && (
              <div
                className={`
                  flex items-start justify-between gap-3 shrink-0
                  ${s.headerPx} ${s.headerPy}
                  ${title && description ? "pb-0" : ""}
                  border-b border-gray-100 dark:border-gray-800
                  ${headerClassName}
                `}
              >
                <div className="flex-1 min-w-0">
                  {title && (
                    <h2
                      className={`
                        ${s.titleText} font-semibold
                        text-gray-900 dark:text-gray-100
                        leading-snug truncate
                      `}
                    >
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p
                      className={`
                        mt-1 ${s.descText}
                        text-gray-500 dark:text-gray-400
                        leading-relaxed
                      `}
                    >
                      {description}
                    </p>
                  )}
                </div>

                {!hideCloseButton && (
                  <button
                    type="button"
                    onClick={close}
                    aria-label="Close drawer"
                    className={`
                      shrink-0 ${s.closeDim}
                      flex items-center justify-center
                      rounded-lg
                      text-gray-400 dark:text-gray-500
                      hover:bg-gray-100 dark:hover:bg-gray-800
                      hover:text-gray-600 dark:hover:text-gray-300
                      transition-colors duration-100
                      focus-visible:outline-none
                      focus-visible:ring-2 focus-visible:ring-blue-500
                    `}
                  >
                    <X size={s.closeSize} />
                  </button>
                )}
              </div>
            )}

            {/* Body — scrollable */}
            <div
              className={`
                flex-1 min-h-0 overflow-y-auto overscroll-contain
                ${s.bodyPx} ${s.bodyPy}
                text-gray-700 dark:text-gray-300
                ${bodyClassName}
              `}
            >
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div
                className={`
                  shrink-0
                  ${s.footerPx} ${s.footerPy}
                  border-t border-gray-100 dark:border-gray-800
                  bg-gray-50/80 dark:bg-gray-900/80
                  ${size !== "full" ? panelRoundedClass(side) : ""}
                  ${footerClassName}
                `}
              >
                {footer}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  // Portal to body to escape stacking contexts
  return createPortal(content, document.body);
}

// ─── Drawer Trigger ───────────────────────────────────────────────────────────

export interface DrawerTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

export function DrawerTrigger({ children }: DrawerTriggerProps) {
  const { toggle, state } = useDrawerContext();

  return (
    <div
      onClick={() => { if (!state.disabled) toggle(); }}
      className={state.disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "cursor-pointer inline-flex"}
    >
      {children}
    </div>
  );
}

// ─── Drawer Close ─────────────────────────────────────────────────────────────

export interface DrawerCloseProps {
  children: React.ReactNode;
  className?: string;
}

export function DrawerClose({ children, className = "" }: DrawerCloseProps) {
  const { close } = useDrawerContext();
  return (
    <div onClick={close} className={`cursor-pointer inline-flex ${className}`}>
      {children}
    </div>
  );
}

// ─── Root Drawer Component ────────────────────────────────────────────────────

export interface DrawerProps extends Omit<DrawerProviderProps, "children"> {
  /** The trigger element — rendered inline, wrapped with click handler */
  trigger?: React.ReactNode;
  /** Drawer panel title */
  title?: React.ReactNode;
  /** Drawer panel description (below title) */
  description?: React.ReactNode;
  /** Main body content */
  children?: React.ReactNode;
  /** Sticky footer content */
  footer?: React.ReactNode;
  /** Hide the built-in × close button in the header */
  hideCloseButton?: boolean;
  /** Show drag handle (top/bottom drawers only) */
  showHandle?: boolean;
  /** Close drawer on backdrop click (default: true) */
  closeOnBackdropClick?: boolean;
  /** Close drawer on Escape key (default: true) */
  closeOnEscape?: boolean;
  /** Class on root wrapper */
  className?: string;
  /** Class on the drawer panel */
  panelClassName?: string;
  /** Class on the header section */
  headerClassName?: string;
  /** Class on the scrollable body section */
  bodyClassName?: string;
  /** Class on the footer section */
  footerClassName?: string;
  /** Class on the backdrop overlay */
  overlayClassName?: string;
}

export function Drawer({
  trigger,
  title,
  description,
  children,
  footer,
  hideCloseButton = false,
  showHandle = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  className = "",
  panelClassName = "",
  headerClassName = "",
  bodyClassName = "",
  footerClassName = "",
  overlayClassName = "",
  size = "md",
  side = "right",
  variant = "default",
  disabled = false,
  defaultOpen = false,
  onOpen,
  onClose,
}: DrawerProps) {
  return (
    <DrawerProvider
      size={size}
      side={side}
      variant={variant}
      disabled={disabled}
      defaultOpen={defaultOpen}
      onOpen={onOpen}
      onClose={onClose}
    >
      <div className={`inline-flex ${className}`}>
        {trigger && <DrawerTrigger>{trigger}</DrawerTrigger>}
      </div>

      <DrawerPanel
        title={title}
        description={description}
        footer={footer}
        hideCloseButton={hideCloseButton}
        showHandle={showHandle}
        closeOnBackdropClick={closeOnBackdropClick}
        closeOnEscape={closeOnEscape}
        className={panelClassName}
        headerClassName={headerClassName}
        bodyClassName={bodyClassName}
        footerClassName={footerClassName}
        overlayClassName={overlayClassName}
      >
        {children}
      </DrawerPanel>
    </DrawerProvider>
  );
}

// ─── Imperative / Controlled Drawer ──────────────────────────────────────────

/**
 * Fully controlled variant — manage open state externally.
 *
 * ```tsx
 * const [open, setOpen] = useState(false);
 * <ControlledDrawer open={open} onClose={() => setOpen(false)} ... />
 * ```
 */
export interface ControlledDrawerProps extends Omit<DrawerProps, "trigger" | "defaultOpen"> {
  open: boolean;
}

export function ControlledDrawer({ open, onClose, ...rest }: ControlledDrawerProps) {
  return (
    <Drawer
      {...rest}
      defaultOpen={open}
      onClose={onClose}
      key={open ? "open" : "closed"}
    />
  );
}

// ─── Composable Primitives ────────────────────────────────────────────────────

/**
 * Composable usage:
 *
 * ```tsx
 * <DrawerRoot side="left" size="lg">
 *   <DrawerTrigger><Button>Open</Button></DrawerTrigger>
 *   <DrawerContent title="Settings">
 *     <p>Content here</p>
 *     <DrawerFooter>
 *       <DrawerClose><Button>Cancel</Button></DrawerClose>
 *     </DrawerFooter>
 *   </DrawerContent>
 * </DrawerRoot>
 * ```
 */
export function DrawerRoot({
  children,
  ...providerProps
}: DrawerProviderProps) {
  return <DrawerProvider {...providerProps}>{children}</DrawerProvider>;
}

export interface DrawerContentProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  hideCloseButton?: boolean;
  showHandle?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  overlayClassName?: string;
}

export function DrawerContent(props: DrawerContentProps) {
  return <DrawerPanel {...props} />;
}

export interface DrawerFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function DrawerFooter({ children, className = "" }: DrawerFooterProps) {
  const { state } = useDrawerContext();
  const s = sizeConfig[state.size];

  return (
    <div className={`flex items-center gap-2 ${s.footerPx} ${s.footerPy} ${className}`}>
      {children}
    </div>
  );
}

// ─── Re-exports ───────────────────────────────────────────────────────────────

export { DrawerProvider, useDrawerContext };
export type { DrawerSize, DrawerSide, DrawerVariant };