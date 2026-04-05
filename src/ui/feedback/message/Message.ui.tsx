import React, { useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  AlertTriangle,
  CheckCircle2,
  Info,
  AlertCircle,
  MessageSquare,
  ChevronRight,
  Maximize2,
} from "lucide-react";
import {
  MessageProvider,
  useMessageContext,
  type MessageProviderProps,
  type MessageVariant,
  type MessageSize,
  type MessagePosition,
  type MessageLayout,
  type MessageAction,
} from "./Message.context";

const sizeConfig: Record<
  MessageSize,
  {
    padding: string;
    iconSize: number;
    titleText: string;
    bodyText: string;
    gap: string;
    actionPx: string;
    actionPy: string;
    actionText: string;
    iconWrap: string;
    closeSize: number;
    closeWrap: string;
    accentBar: string;
    modalWidth: string;
    modalPadding: string;
    modalTitleText: string;
    modalBodyText: string;
    modalGap: string;
  }
> = {
  sm: {
    padding: "px-3 py-2.5",
    iconSize: 14,
    titleText: "text-xs",
    bodyText: "text-[11px]",
    gap: "gap-2",
    actionPx: "px-2.5",
    actionPy: "py-1",
    actionText: "text-[11px]",
    iconWrap: "w-6 h-6",
    closeSize: 13,
    closeWrap: "w-5 h-5",
    accentBar: "w-0.5",
    modalWidth: "max-w-sm",
    modalPadding: "p-4",
    modalTitleText: "text-sm",
    modalBodyText: "text-xs",
    modalGap: "gap-3",
  },
  md: {
    padding: "px-4 py-3",
    iconSize: 16,
    titleText: "text-sm",
    bodyText: "text-xs",
    gap: "gap-2.5",
    actionPx: "px-3",
    actionPy: "py-1.5",
    actionText: "text-xs",
    iconWrap: "w-7 h-7",
    closeSize: 14,
    closeWrap: "w-6 h-6",
    accentBar: "w-0.5",
    modalWidth: "max-w-md",
    modalPadding: "p-5",
    modalTitleText: "text-base",
    modalBodyText: "text-sm",
    modalGap: "gap-4",
  },
  lg: {
    padding: "px-5 py-4",
    iconSize: 18,
    titleText: "text-sm",
    bodyText: "text-sm",
    gap: "gap-3",
    actionPx: "px-3.5",
    actionPy: "py-1.5",
    actionText: "text-sm",
    iconWrap: "w-8 h-8",
    closeSize: 15,
    closeWrap: "w-6 h-6",
    accentBar: "w-1",
    modalWidth: "max-w-lg",
    modalPadding: "p-6",
    modalTitleText: "text-lg",
    modalBodyText: "text-sm",
    modalGap: "gap-4",
  },
  xl: {
    padding: "px-6 py-5",
    iconSize: 20,
    titleText: "text-base",
    bodyText: "text-sm",
    gap: "gap-3.5",
    actionPx: "px-4",
    actionPy: "py-2",
    actionText: "text-sm",
    iconWrap: "w-9 h-9",
    closeSize: 16,
    closeWrap: "w-7 h-7",
    accentBar: "w-1",
    modalWidth: "max-w-2xl",
    modalPadding: "p-7",
    modalTitleText: "text-xl",
    modalBodyText: "text-base",
    modalGap: "gap-5",
  },
};

const variantConfig: Record<
  MessageVariant,
  {
    icon: React.ReactNode;
    iconLg: React.ReactNode;
    wrapperBg: string;
    border: string;
    accentBar: string;
    iconBg: string;
    iconColor: string;
    titleColor: string;
    bodyColor: string;
    closeBtnHover: string;
    primaryBtn: string;
    ghostBtn: string;
    outlineBtn: string;
    modalIconBg: string;
    modalConfirmBtn: string;
  }
> = {
  default: {
    icon: <MessageSquare />,
    iconLg: <MessageSquare />,
    wrapperBg: "bg-white dark:bg-gray-900",
    border: "border-gray-200 dark:border-gray-700",
    accentBar: "bg-gray-300 dark:bg-gray-600",
    iconBg: "bg-gray-100 dark:bg-gray-800",
    iconColor: "text-gray-600 dark:text-gray-400",
    titleColor: "text-gray-900 dark:text-gray-100",
    bodyColor: "text-gray-500 dark:text-gray-400",
    closeBtnHover: "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300",
    primaryBtn: "bg-gray-900 hover:bg-gray-700 dark:bg-gray-100 dark:hover:bg-gray-300 text-white dark:text-gray-900",
    ghostBtn: "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
    outlineBtn: "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800",
    modalIconBg: "bg-gray-100 dark:bg-gray-800",
    modalConfirmBtn: "bg-gray-900 hover:bg-gray-700 dark:bg-gray-100 dark:hover:bg-gray-300 text-white dark:text-gray-900",
  },
  danger: {
    icon: <AlertCircle />,
    iconLg: <AlertCircle />,
    wrapperBg: "bg-red-50 dark:bg-red-950/30",
    border: "border-red-200 dark:border-red-900/60",
    accentBar: "bg-red-500 dark:bg-red-400",
    iconBg: "bg-red-100 dark:bg-red-900/50",
    iconColor: "text-red-600 dark:text-red-400",
    titleColor: "text-red-900 dark:text-red-100",
    bodyColor: "text-red-700 dark:text-red-300",
    closeBtnHover: "hover:bg-red-100 dark:hover:bg-red-900/40 text-red-400 dark:text-red-500 hover:text-red-600 dark:hover:text-red-300",
    primaryBtn: "bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white",
    ghostBtn: "text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/40",
    outlineBtn: "border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 hover:border-red-400 dark:hover:border-red-600 hover:bg-red-50 dark:hover:bg-red-950/40",
    modalIconBg: "bg-red-50 dark:bg-red-950/40",
    modalConfirmBtn: "bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white",
  },
  warning: {
    icon: <AlertTriangle />,
    iconLg: <AlertTriangle />,
    wrapperBg: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-amber-200 dark:border-amber-900/60",
    accentBar: "bg-amber-500 dark:bg-amber-400",
    iconBg: "bg-amber-100 dark:bg-amber-900/50",
    iconColor: "text-amber-600 dark:text-amber-400",
    titleColor: "text-amber-900 dark:text-amber-100",
    bodyColor: "text-amber-700 dark:text-amber-300",
    closeBtnHover: "hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-400 dark:text-amber-500 hover:text-amber-600 dark:hover:text-amber-300",
    primaryBtn: "bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white",
    ghostBtn: "text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40",
    outlineBtn: "border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 hover:border-amber-400 dark:hover:border-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40",
    modalIconBg: "bg-amber-50 dark:bg-amber-950/40",
    modalConfirmBtn: "bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white",
  },
  success: {
    icon: <CheckCircle2 />,
    iconLg: <CheckCircle2 />,
    wrapperBg: "bg-emerald-50 dark:bg-emerald-950/30",
    border: "border-emerald-200 dark:border-emerald-900/60",
    accentBar: "bg-emerald-500 dark:bg-emerald-400",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/50",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    titleColor: "text-emerald-900 dark:text-emerald-100",
    bodyColor: "text-emerald-700 dark:text-emerald-300",
    closeBtnHover: "hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-400 dark:text-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-300",
    primaryBtn: "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white",
    ghostBtn: "text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40",
    outlineBtn: "border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 hover:border-emerald-400 dark:hover:border-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40",
    modalIconBg: "bg-emerald-50 dark:bg-emerald-950/40",
    modalConfirmBtn: "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white",
  },
  info: {
    icon: <Info />,
    iconLg: <Info />,
    wrapperBg: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-200 dark:border-blue-900/60",
    accentBar: "bg-blue-500 dark:bg-blue-400",
    iconBg: "bg-blue-100 dark:bg-blue-900/50",
    iconColor: "text-blue-600 dark:text-blue-400",
    titleColor: "text-blue-900 dark:text-blue-100",
    bodyColor: "text-blue-700 dark:text-blue-300",
    closeBtnHover: "hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-400 dark:text-blue-500 hover:text-blue-600 dark:hover:text-blue-300",
    primaryBtn: "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white",
    ghostBtn: "text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40",
    outlineBtn: "border border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40",
    modalIconBg: "bg-blue-50 dark:bg-blue-950/40",
    modalConfirmBtn: "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white",
  },
};

const positionStyles: Record<
  MessagePosition,
  { container: string; isFixed: boolean; motion: object }
> = {
  inline: {
    container: "relative w-full",
    isFixed: false,
    motion: { initial: { opacity: 0, y: -6, scale: 0.98 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -6, scale: 0.98 }, transition: { duration: 0.15, ease: "easeOut" } },
  },
  "top-left": {
    container: "fixed top-4 left-4 z-50 w-full max-w-sm",
    isFixed: true,
    motion: { initial: { opacity: 0, x: -16, scale: 0.97 }, animate: { opacity: 1, x: 0, scale: 1 }, exit: { opacity: 0, x: -16, scale: 0.97 }, transition: { duration: 0.16, ease: "easeOut" } },
  },
  "top-center": {
    container: "fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg",
    isFixed: true,
    motion: { initial: { opacity: 0, y: -16, scale: 0.97 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -16, scale: 0.97 }, transition: { duration: 0.16, ease: "easeOut" } },
  },
  "top-right": {
    container: "fixed top-4 right-4 z-50 w-full max-w-sm",
    isFixed: true,
    motion: { initial: { opacity: 0, x: 16, scale: 0.97 }, animate: { opacity: 1, x: 0, scale: 1 }, exit: { opacity: 0, x: 16, scale: 0.97 }, transition: { duration: 0.16, ease: "easeOut" } },
  },
  "bottom-left": {
    container: "fixed bottom-4 left-4 z-50 w-full max-w-sm",
    isFixed: true,
    motion: { initial: { opacity: 0, x: -16, scale: 0.97 }, animate: { opacity: 1, x: 0, scale: 1 }, exit: { opacity: 0, x: -16, scale: 0.97 }, transition: { duration: 0.16, ease: "easeOut" } },
  },
  "bottom-center": {
    container: "fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg",
    isFixed: true,
    motion: { initial: { opacity: 0, y: 16, scale: 0.97 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 16, scale: 0.97 }, transition: { duration: 0.16, ease: "easeOut" } },
  },
  "bottom-right": {
    container: "fixed bottom-4 right-4 z-50 w-full max-w-sm",
    isFixed: true,
    motion: { initial: { opacity: 0, x: 16, scale: 0.97 }, animate: { opacity: 1, x: 0, scale: 1 }, exit: { opacity: 0, x: 16, scale: 0.97 }, transition: { duration: 0.16, ease: "easeOut" } },
  },
};

const overlayMotion = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.18, ease: "easeOut" },
};

const modalPanelMotion = {
  initial: { opacity: 0, scale: 0.96, y: 4 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.96, y: 4 },
  transition: { duration: 0.18, ease: "easeOut" },
};

export interface MessageModalProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
  showIcon?: boolean;
  className?: string;
  panelClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  confirmClassName?: string;
  cancelClassName?: string;
  footerAlign?: "left" | "center" | "right" | "between";
  footer?: React.ReactNode;
}

function MessageModal({
  title,
  description,
  children,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  isLoading = false,
  showIcon = true,
  className = "",
  panelClassName = "",
  titleClassName = "",
  descriptionClassName = "",
  confirmClassName = "",
  cancelClassName = "",
  footerAlign = "right",
  footer,
}: MessageModalProps) {
  const { state, closeModal } = useMessageContext();
  const v = variantConfig[state.variant];
  const s = sizeConfig[state.size];

  const handleCancel = useCallback(() => {
    onCancel?.();
    closeModal();
  }, [onCancel, closeModal]);

  const handleConfirm = useCallback(() => {
    onConfirm?.();
  }, [onConfirm]);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) closeModal();
    },
    [closeModal]
  );

  useEffect(() => {
    if (!state.isModalOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [state.isModalOpen, closeModal]);

  const footerAlignClass = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
    between: "justify-between",
  }[footerAlign];

  return (
    <AnimatePresence>
      {state.isModalOpen &&
        createPortal(
          <div
            className={`fixed inset-0 z-[60] flex items-center justify-center ${className}`}
            role="dialog"
            aria-modal="true"
            onClick={handleOverlayClick}
          >
            <motion.div
              {...overlayMotion}
              className="absolute inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-[2px]"
              onClick={handleOverlayClick}
            />
            <motion.div
              {...modalPanelMotion}
              className={`relative w-full ${s.modalWidth} mx-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl shadow-black/10 dark:shadow-black/40 overflow-hidden ${panelClassName}`}
            >
              <div className={`flex flex-col ${s.modalGap} ${s.modalPadding}`}>
                <div className="flex items-start gap-3">
                  {showIcon && (
                    <div
                      className={`shrink-0 flex items-center justify-center w-9 h-9 rounded-xl ${v.modalIconBg}`}
                    >
                      <span className={`${v.iconColor}`} style={{ width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {React.cloneElement(v.iconLg as React.ReactElement, { size: 20 })}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <h2
                      className={`font-semibold leading-snug ${s.modalTitleText} text-gray-900 dark:text-gray-100 ${titleClassName}`}
                    >
                      {title}
                    </h2>
                    {description && (
                      <p
                        className={`mt-1 ${s.modalBodyText} text-gray-500 dark:text-gray-400 leading-relaxed ${descriptionClassName}`}
                      >
                        {description}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={closeModal}
                    aria-label="Close"
                    className="shrink-0 flex items-center justify-center w-7 h-7 rounded-lg text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-100"
                  >
                    <X size={15} />
                  </button>
                </div>

                {children && (
                  <div className={`${s.modalBodyText} text-gray-600 dark:text-gray-400 leading-relaxed`}>
                    {children}
                  </div>
                )}

                <div className="border-t border-gray-100 dark:border-gray-800" />

                {footer ?? (
                  <div className={`flex flex-wrap items-center gap-2.5 ${footerAlignClass}`}>
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={isLoading}
                      className={`inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-100 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed ${cancelClassName}`}
                    >
                      {cancelLabel}
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirm}
                      disabled={isLoading}
                      className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-100 disabled:opacity-60 disabled:cursor-not-allowed ${v.modalConfirmBtn} ${confirmClassName}`}
                    >
                      {isLoading && (
                        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      )}
                      {confirmLabel}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>,
          document.body
        )}
    </AnimatePresence>
  );
}

export interface MessageProps {
  title: string;
  description?: string;
  variant?: MessageVariant;
  size?: MessageSize;
  position?: MessagePosition;
  layout?: MessageLayout;
  isDismissible?: boolean;
  showIcon?: boolean;
  showAccentBar?: boolean;
  actions?: MessageAction[];
  modalProps?: MessageModalProps;
  autoHide?: boolean;
  autoHideDuration?: number;
  onHide?: () => void;
  onShow?: () => void;
  className?: string;
  wrapperClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  iconClassName?: string;
  actionsClassName?: string;
  children?: React.ReactNode;
}

function MessageInner({
  title,
  description,
  showIcon = true,
  showAccentBar = true,
  actions = [],
  modalProps,
  autoHide = false,
  autoHideDuration = 5000,
  className = "",
  wrapperClassName = "",
  titleClassName = "",
  descriptionClassName = "",
  iconClassName = "",
  actionsClassName = "",
  children,
}: Omit<MessageProps, "variant" | "size" | "position" | "layout" | "isDismissible" | "onHide" | "onShow">) {
  const { state, hide, openModal } = useMessageContext();
  const { variant, size, position, layout, isDismissible } = state;

  const v = variantConfig[variant];
  const s = sizeConfig[size];
  const p = positionStyles[position];

  useEffect(() => {
    if (!autoHide) return;
    const timer = setTimeout(() => hide(), autoHideDuration);
    return () => clearTimeout(timer);
  }, [autoHide, autoHideDuration, hide]);

  const isStack = layout === "stack";

  const iconEl = (
    <div
      className={`shrink-0 flex items-center justify-center rounded-lg ${s.iconWrap} ${v.iconBg} ${iconClassName}`}
    >
      <span className={v.iconColor} style={{ width: s.iconSize, height: s.iconSize, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {React.cloneElement(v.icon as React.ReactElement, { size: s.iconSize })}
      </span>
    </div>
  );

  const textEl = (
    <div className="flex-1 min-w-0">
      <p className={`font-semibold leading-snug ${s.titleText} ${v.titleColor} ${titleClassName}`}>
        {title}
      </p>
      {description && (
        <p className={`mt-0.5 leading-relaxed ${s.bodyText} ${v.bodyColor} ${descriptionClassName}`}>
          {description}
        </p>
      )}
      {children && (
        <div className={`mt-1.5 ${s.bodyText} ${v.bodyColor}`}>{children}</div>
      )}
    </div>
  );

  const actionsEl = actions.length > 0 || modalProps ? (
    <div className={`flex flex-wrap items-center gap-2 ${actionsClassName}`}>
      {modalProps && (
        <button
          type="button"
          onClick={openModal}
          className={`inline-flex items-center gap-1.5 ${s.actionPx} ${s.actionPy} rounded-lg ${s.actionText} font-medium transition-colors duration-100 ${v.primaryBtn}`}
        >
          <Maximize2 size={s.iconSize - 4} />
          {modalProps.title ? "View Details" : "Open"}
        </button>
      )}
      {actions.map((action) => {
        const btnVariant = action.variant ?? "ghost";
        const btnStyles = {
          primary: v.primaryBtn,
          ghost: v.ghostBtn,
          outline: v.outlineBtn,
        }[btnVariant];

        return (
          <button
            key={action.id}
            type="button"
            disabled={action.disabled}
            onClick={action.onClick}
            className={`inline-flex items-center gap-1.5 ${s.actionPx} ${s.actionPy} rounded-lg ${s.actionText} font-medium transition-colors duration-100 disabled:opacity-50 disabled:cursor-not-allowed ${btnStyles}`}
          >
            {action.leadingIcon && (
              <span style={{ width: s.iconSize - 4, height: s.iconSize - 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {action.leadingIcon}
              </span>
            )}
            {action.label}
            {btnVariant === "ghost" && !action.leadingIcon && (
              <ChevronRight size={s.iconSize - 4} className="opacity-60" />
            )}
          </button>
        );
      })}
    </div>
  ) : null;

  const closeBtn = isDismissible ? (
    <button
      type="button"
      onClick={hide}
      aria-label="Dismiss message"
      className={`shrink-0 flex items-center justify-center rounded-lg transition-colors duration-100 ${s.closeWrap} ${v.closeBtnHover}`}
    >
      <X size={s.closeSize} />
    </button>
  ) : null;

  const content = isStack ? (
    <div className={`flex flex-col gap-2 flex-1 min-w-0`}>
      <div className="flex items-start gap-2.5">
        {showIcon && iconEl}
        {textEl}
        {closeBtn}
      </div>
      {actionsEl && <div className="pl-0">{actionsEl}</div>}
    </div>
  ) : (
    <>
      {showIcon && iconEl}
      {textEl}
      {actionsEl}
      {closeBtn}
    </>
  );

  const card = (
    <div
      className={`
        relative flex overflow-hidden rounded-xl border
        ${s.gap} ${s.padding}
        ${v.wrapperBg} ${v.border}
        shadow-sm shadow-black/5 dark:shadow-black/20
        ${isStack ? "flex-col" : "flex-row items-center"}
        ${wrapperClassName}
      `}
    >
      {showAccentBar && (
        <div
          className={`absolute left-0 top-0 bottom-0 ${s.accentBar} ${v.accentBar} rounded-l-xl`}
        />
      )}
      <div className={`${showAccentBar ? "pl-2" : ""} flex w-full ${isStack ? "flex-col gap-2" : "flex-row items-center gap-2.5"}`}>
        {content}
      </div>
    </div>
  );

  const positionCfg = positionStyles[position];

  if (positionCfg.isFixed) {
    return createPortal(
      <AnimatePresence>
        {state.isVisible && (
          <motion.div
            {...(positionCfg.motion as object)}
            className={`${positionCfg.container} ${className}`}
          >
            {card}
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
    );
  }

  return (
    <AnimatePresence>
      {state.isVisible && (
        <motion.div
          {...(positionCfg.motion as object)}
          className={`${positionCfg.container} ${className}`}
        >
          {card}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Message({
  variant = "default",
  size = "md",
  position = "inline",
  layout = "row",
  isDismissible = true,
  onHide,
  onShow,
  modalProps,
  ...rest
}: MessageProps) {
  return (
    <MessageProvider
      variant={variant}
      size={size}
      position={position}
      layout={layout}
      isDismissible={isDismissible}
      hasModal={!!modalProps}
      onHide={onHide}
      onShow={onShow}
    >
      <MessageInner {...rest} modalProps={modalProps} />
      {modalProps && <MessageModal {...modalProps} />}
    </MessageProvider>
  );
}

export interface MessageTriggerProps extends Omit<MessageProps, "position"> {
  position?: MessagePosition;
  defaultVisible?: boolean;
  trigger: React.ReactNode;
  triggerClassName?: string;
}

export function MessageTrigger({
  trigger,
  triggerClassName = "",
  defaultVisible = false,
  ...messageProps
}: MessageTriggerProps) {
  const [visible, setVisible] = React.useState(defaultVisible);

  return (
    <div className="inline-flex flex-col gap-2 w-full">
      <div className={`inline-block ${triggerClassName}`} onClick={() => setVisible((v) => !v)}>
        {trigger}
      </div>
      <AnimatePresence>
        {visible && (
          <Message
            {...messageProps}
            position="inline"
            onHide={() => {
              setVisible(false);
              messageProps.onHide?.();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export {
  MessageProvider,
  useMessageContext,
  type MessageVariant,
  type MessageSize,
  type MessagePosition,
  type MessageLayout,
  type MessageAction,
};