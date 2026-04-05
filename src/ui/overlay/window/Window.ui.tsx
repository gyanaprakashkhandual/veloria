import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import {
  WindowProvider,
  useWindowContext,
  type WindowProviderProps,
  type WindowPosition,
  type WindowSize,
  type WindowTab,
} from "./Window.context";

const sizeConfig = {
  sm: {
    width: 280,
    headerPx: "px-3",
    headerPy: "py-2.5",
    headerText: "text-xs",
    bodyPx: "px-3",
    bodyPy: "py-3",
    footerPx: "px-3",
    footerPy: "py-2.5",
    tabPx: "px-2.5",
    tabPy: "py-1.5",
    tabText: "text-xs",
    tabIconSize: 11,
    closeSize: 13,
    titleText: "text-xs",
    rounded: "rounded-xl",
    tabsGap: "gap-0.5",
  },
  md: {
    width: 360,
    headerPx: "px-4",
    headerPy: "py-3",
    headerText: "text-sm",
    bodyPx: "px-4",
    bodyPy: "py-4",
    footerPx: "px-4",
    footerPy: "py-3",
    tabPx: "px-3",
    tabPy: "py-1.5",
    tabText: "text-sm",
    tabIconSize: 13,
    closeSize: 14,
    titleText: "text-sm",
    rounded: "rounded-xl",
    tabsGap: "gap-0.5",
  },
  lg: {
    width: 480,
    headerPx: "px-5",
    headerPy: "py-3.5",
    headerText: "text-sm",
    bodyPx: "px-5",
    bodyPy: "py-5",
    footerPx: "px-5",
    footerPy: "py-3.5",
    tabPx: "px-3.5",
    tabPy: "py-2",
    tabText: "text-sm",
    tabIconSize: 14,
    closeSize: 15,
    titleText: "text-sm",
    rounded: "rounded-2xl",
    tabsGap: "gap-0.5",
  },
  xl: {
    width: 600,
    headerPx: "px-6",
    headerPy: "py-4",
    headerText: "text-base",
    bodyPx: "px-6",
    bodyPy: "py-6",
    footerPx: "px-6",
    footerPy: "py-4",
    tabPx: "px-4",
    tabPy: "py-2",
    tabText: "text-sm",
    tabIconSize: 15,
    closeSize: 16,
    titleText: "text-base",
    rounded: "rounded-2xl",
    tabsGap: "gap-1",
  },
};

type ResolvedPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "center-left"
  | "center"
  | "center-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right"
  | "above-element"
  | "below-element";

function useAutoPosition(
  open: boolean,
  anchorRef: React.RefObject<HTMLElement | null>,
  preferred: WindowPosition,
  windowWidth: number,
  windowHeight: number,
): ResolvedPosition {
  const [pos, setPos] = useState<ResolvedPosition>("below-element");

  useLayoutEffect(() => {
    if (!open) return;
    if (preferred !== "auto") {
      setPos(preferred as ResolvedPosition);
      return;
    }
    if (!anchorRef.current) {
      setPos("center");
      return;
    }
    const rect = anchorRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    if (spaceBelow >= windowHeight + 8) {
      setPos("below-element");
    } else if (spaceAbove >= windowHeight + 8) {
      setPos("above-element");
    } else {
      setPos("center");
    }
  }, [open, anchorRef, preferred, windowWidth, windowHeight]);

  return pos;
}

function resolvePositionStyle(
  pos: ResolvedPosition,
  anchorRef: React.RefObject<HTMLElement | null>,
  windowWidth: number,
): React.CSSProperties {
  if (pos === "below-element" || pos === "above-element") {
    const rect = anchorRef.current?.getBoundingClientRect();
    if (!rect)
      return {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)",
        zIndex: 100,
      };

    const leftClamped = Math.max(
      8,
      Math.min(rect.left, window.innerWidth - windowWidth - 8),
    );

    if (pos === "below-element") {
      return {
        position: "fixed",
        top: rect.bottom + 6,
        left: leftClamped,
        zIndex: 100,
      };
    }
    return {
      position: "fixed",
      bottom: window.innerHeight - rect.top + 6,
      left: leftClamped,
      zIndex: 100,
    };
  }

  const map: Record<ResolvedPosition, React.CSSProperties> = {
    "top-left": { position: "fixed", top: 16, left: 16, zIndex: 100 },
    "top-center": {
      position: "fixed",
      top: 16,
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 100,
    },
    "top-right": { position: "fixed", top: 16, right: 16, zIndex: 100 },
    "center-left": {
      position: "fixed",
      top: "50%",
      left: 16,
      transform: "translateY(-50%)",
      zIndex: 100,
    },
    center: {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%,-50%)",
      zIndex: 100,
    },
    "center-right": {
      position: "fixed",
      top: "50%",
      right: 16,
      transform: "translateY(-50%)",
      zIndex: 100,
    },
    "bottom-left": { position: "fixed", bottom: 16, left: 16, zIndex: 100 },
    "bottom-center": {
      position: "fixed",
      bottom: 16,
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 100,
    },
    "bottom-right": { position: "fixed", bottom: 16, right: 16, zIndex: 100 },
    "above-element": {},
    "below-element": {},
  };

  return (
    map[pos] ?? {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%,-50%)",
      zIndex: 100,
    }
  );
}

function motionVariants(pos: ResolvedPosition) {
  const fromBelow = {
    initial: { opacity: 0, y: -6, scale: 0.97 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -6, scale: 0.97 },
  };
  const fromAbove = {
    initial: { opacity: 0, y: 6, scale: 0.97 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 6, scale: 0.97 },
  };
  const fromCenter = {
    initial: { opacity: 0, scale: 0.96 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.96 },
  };

  if (pos === "below-element" || pos.startsWith("top")) return fromBelow;
  if (pos === "above-element" || pos.startsWith("bottom")) return fromAbove;
  return fromCenter;
}

export interface WindowProps {
  anchor: React.RefObject<HTMLElement | null>;
  children?: React.ReactNode;
  title?: string;
  size?: WindowSize;
  position?: WindowPosition;
  showClose?: boolean;
  tabs?: WindowTab[];
  activeTab?: string;
  onTabChange?: (id: string) => void;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  maxHeight?: number;
  className?: string;
  style?: React.CSSProperties;
  isOpen: boolean;
  onClose: () => void;
  closeOnOutsideClick?: boolean;
  closeOnEscape?: boolean;
}

export function Window({
  anchor,
  children,
  title,
  size = "md",
  position = "auto",
  showClose = true,
  tabs,
  activeTab,
  onTabChange,
  header,
  footer,
  maxHeight,
  className = "",
  style,
  isOpen,
  onClose,
  closeOnOutsideClick = true,
  closeOnEscape = true,
}: WindowProps) {
  const s = sizeConfig[size];
  const panelRef = useRef<HTMLDivElement>(null);
  const resolvedPos = useAutoPosition(
    isOpen,
    anchor,
    position,
    s.width,
    maxHeight ?? 400,
  );
  const posStyle = resolvePositionStyle(resolvedPos, anchor, s.width);
  const variants = motionVariants(resolvedPos);

  useEffect(() => {
    if (!isOpen) return;
    const handleMouse = (e: MouseEvent) => {
      if (!closeOnOutsideClick) return;
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        anchor.current &&
        !anchor.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handleMouse);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleMouse);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isOpen, onClose, closeOnOutsideClick, closeOnEscape, anchor]);

  const hasTabs = tabs && tabs.length > 0;
  const showHeader = !!(title || header || showClose || hasTabs);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={panelRef}
          {...variants}
          transition={{ duration: 0.15, ease: "easeOut" }}
          style={{ ...posStyle, width: s.width, ...style }}
          className={`
            bg-white dark:bg-gray-900
            border border-gray-200 dark:border-gray-700
            shadow-xl shadow-black/10 dark:shadow-black/50
            overflow-hidden flex flex-col
            ${s.rounded}
            ${className}
          `}
        >
          {showHeader && (
            <div
              className={`flex flex-col shrink-0 border-b border-gray-100 dark:border-gray-800`}
            >
              {(title || header || showClose) && (
                <div
                  className={`flex items-center gap-2 ${s.headerPx} ${s.headerPy}`}
                >
                  {header ? (
                    <div className="flex-1 min-w-0">{header}</div>
                  ) : title ? (
                    <span
                      className={`flex-1 min-w-0 font-semibold ${s.titleText} text-gray-900 dark:text-white truncate`}
                    >
                      {title}
                    </span>
                  ) : (
                    <div className="flex-1" />
                  )}
                  {showClose && (
                    <button
                      type="button"
                      onClick={onClose}
                      className="shrink-0 flex items-center justify-center w-6 h-6 rounded-md text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-100"
                    >
                      <X size={s.closeSize} />
                    </button>
                  )}
                </div>
              )}

              {hasTabs && (
                <div
                  className={`flex items-center ${s.headerPx} pb-0 pt-0 ${s.tabsGap} overflow-x-auto`}
                  style={{ paddingBottom: 0 }}
                >
                  {tabs!.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => onTabChange?.(tab.id)}
                        className={`
                          shrink-0 flex items-center gap-1.5 ${s.tabPx} ${s.tabPy} ${s.tabText}
                          font-medium rounded-t-lg transition-all duration-100 border-b-2 -mb-px
                          ${
                            isActive
                              ? "text-gray-900 dark:text-white border-gray-900 dark:border-white bg-transparent"
                              : "text-gray-400 dark:text-gray-500 border-transparent hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                          }
                        `}
                      >
                        {tab.icon && (
                          <span
                            className="shrink-0 flex items-center justify-center"
                            style={{
                              width: s.tabIconSize,
                              height: s.tabIconSize,
                            }}
                          >
                            {tab.icon}
                          </span>
                        )}
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {children && (
            <div
              className={`flex-1 overflow-y-auto ${s.bodyPx} ${s.bodyPy}`}
              style={maxHeight ? { maxHeight } : undefined}
            >
              {children}
            </div>
          )}

          {footer && (
            <div
              className={`shrink-0 border-t border-gray-100 dark:border-gray-800 ${s.footerPx} ${s.footerPy}`}
            >
              {footer}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export interface UseWindowReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  anchorRef: React.RefObject<HTMLElement | null>;
}

export function useWindow(): UseWindowReturn {
  const [isOpen, setIsOpen] = useState(false);
  const anchorRef = useRef<HTMLElement>(null);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  return { isOpen, open, close, toggle, anchorRef };
}

export { WindowProvider, useWindowContext };
export type { WindowPosition, WindowSize, WindowTab };
