import React, { useEffect, useCallback, useId } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, CheckCircle2, Info, AlertCircle, MessageSquare } from "lucide-react";
import {
  DialogProvider,
  useDialogContext,
  type DialogProviderProps,
  type DialogSize,
  type DialogVariant,
  type DialogPosition,
} from "./Dialog.context";

const sizeConfig: Record<DialogSize, { maxWidth: string; padding: string; titleText: string; bodyText: string; gap: string }> = {
  sm: { maxWidth: "max-w-sm", padding: "p-4", titleText: "text-sm", bodyText: "text-xs", gap: "gap-3" },
  md: { maxWidth: "max-w-md", padding: "p-5", titleText: "text-base", bodyText: "text-sm", gap: "gap-4" },
  lg: { maxWidth: "max-w-lg", padding: "p-6", titleText: "text-lg", bodyText: "text-sm", gap: "gap-4" },
  xl: { maxWidth: "max-w-2xl", padding: "p-7", titleText: "text-xl", bodyText: "text-base", gap: "gap-5" },
  full: { maxWidth: "max-w-[95vw] w-full", padding: "p-8", titleText: "text-xl", bodyText: "text-base", gap: "gap-5" },
};

const variantConfig: Record<DialogVariant, {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  titleColor: string;
  confirmBtn: string;
}> = {
  default: {
    icon: <MessageSquare size={20} />,
    iconBg: "bg-gray-100 dark:bg-gray-800",
    iconColor: "text-gray-600 dark:text-gray-400",
    titleColor: "text-gray-900 dark:text-gray-100",
    confirmBtn: "bg-gray-900 hover:bg-gray-700 dark:bg-gray-100 dark:hover:bg-gray-300 text-white dark:text-gray-900",
  },
  danger: {
    icon: <AlertCircle size={20} />,
    iconBg: "bg-red-50 dark:bg-red-950/40",
    iconColor: "text-red-600 dark:text-red-400",
    titleColor: "text-gray-900 dark:text-gray-100",
    confirmBtn: "bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white",
  },
  warning: {
    icon: <AlertTriangle size={20} />,
    iconBg: "bg-amber-50 dark:bg-amber-950/40",
    iconColor: "text-amber-600 dark:text-amber-400",
    titleColor: "text-gray-900 dark:text-gray-100",
    confirmBtn: "bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white",
  },
  success: {
    icon: <CheckCircle2 size={20} />,
    iconBg: "bg-emerald-50 dark:bg-emerald-950/40",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    titleColor: "text-gray-900 dark:text-gray-100",
    confirmBtn: "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white",
  },
  info: {
    icon: <Info size={20} />,
    iconBg: "bg-blue-50 dark:bg-blue-950/40",
    iconColor: "text-blue-600 dark:text-blue-400",
    titleColor: "text-gray-900 dark:text-gray-100",
    confirmBtn: "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white",
  },
};

const positionConfig: Record<DialogPosition, { outer: string; motion: { y?: number; scale?: number } }> = {
  center: { outer: "items-center justify-center", motion: { scale: 0.96, y: 0 } },
  top: { outer: "items-start justify-center pt-16", motion: { scale: 1, y: -16 } },
  bottom: { outer: "items-end justify-center pb-16", motion: { scale: 1, y: 16 } },
};

const overlayMotion = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.18, ease: "easeOut" },
};

function buildPanelMotion(position: DialogPosition) {
  const { motion: m } = positionConfig[position];
  return {
    initial: { opacity: 0, scale: m.scale ?? 0.96, y: m.y ?? 0 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: m.scale ?? 0.96, y: m.y ?? 0 },
    transition: { duration: 0.18, ease: "easeOut" },
  };
};

export interface DialogHeaderProps {
  title: string;
  description?: string;
  showIcon?: boolean;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

export function DialogHeader({
  title,
  description,
  showIcon = true,
  className = "",
  titleClassName = "",
  descriptionClassName = "",
}: DialogHeaderProps) {
  const { state, close } = useDialogContext();
  const s = sizeConfig[state.size];
  const v = variantConfig[state.variant];

  return (
    <div className={`flex items-start gap-3 ${className}`}>
      {showIcon && (
        <div className={`shrink-0 flex items-center justify-center w-9 h-9 rounded-xl ${v.iconBg}`}>
          <span className={v.iconColor}>{v.icon}</span>
        </div>
      )}
      <div className="flex-1 min-w-0 pt-0.5">
        <h2 className={`font-semibold leading-snug ${s.titleText} ${v.titleColor} ${titleClassName}`}>
          {title}
        </h2>
        {description && (
          <p className={`mt-1 ${s.bodyText} text-gray-500 dark:text-gray-400 leading-relaxed ${descriptionClassName}`}>
            {description}
          </p>
        )}
      </div>
      {state.isDismissible && (
        <button
          type="button"
          onClick={close}
          aria-label="Close dialog"
          className="shrink-0 flex items-center justify-center w-7 h-7 rounded-lg text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-100"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
}

export interface DialogBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function DialogBody({ children, className = "" }: DialogBodyProps) {
  const { state } = useDialogContext();
  const s = sizeConfig[state.size];
  return (
    <div className={`${s.bodyText} text-gray-600 dark:text-gray-400 leading-relaxed ${className}`}>
      {children}
    </div>
  );
}

export interface DialogFooterProps {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "center" | "right" | "between";
}

export function DialogFooter({ children, className = "", align = "right" }: DialogFooterProps) {
  const alignClass = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
    between: "justify-between",
  }[align];

  return (
    <div className={`flex flex-wrap items-center gap-2.5 ${alignClass} ${className}`}>
      {children}
    </div>
  );
}

export interface DialogActionsProps {
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
  isDestructive?: boolean;
  confirmClassName?: string;
  cancelClassName?: string;
  align?: "left" | "center" | "right" | "between";
}

export function DialogActions({
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  isLoading = false,
  confirmClassName = "",
  cancelClassName = "",
  align = "right",
}: DialogActionsProps) {
  const { state, close } = useDialogContext();
  const v = variantConfig[state.variant];

  const handleCancel = useCallback(() => {
    onCancel?.();
    close();
  }, [onCancel, close]);

  const handleConfirm = useCallback(() => {
    onConfirm?.();
  }, [onConfirm]);

  return (
    <DialogFooter align={align}>
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
        className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-100 disabled:opacity-60 disabled:cursor-not-allowed ${v.confirmBtn} ${confirmClassName}`}
      >
        {isLoading && (
          <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {confirmLabel}
      </button>
    </DialogFooter>
  );
}

export interface DialogDividerProps {
  className?: string;
}

export function DialogDivider({ className = "" }: DialogDividerProps) {
  return <div className={`border-t border-gray-100 dark:border-gray-800 -mx-0 ${className}`} />;
}

interface DialogPanelProps {
  children: React.ReactNode;
  className?: string;
  panelClassName?: string;
}

function DialogPanel({ children, className = "", panelClassName = "" }: DialogPanelProps) {
  const { state } = useDialogContext();
  const s = sizeConfig[state.size];
  const v = variantConfig[state.variant];
  const p = positionConfig[state.position];
  const panelMotion = buildPanelMotion(state.position);

  return (
    <AnimatePresence>
      {state.isOpen && createPortal(
        <div
          className={`fixed inset-0 z-50 flex ${p.outer} ${className}`}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            {...overlayMotion}
            className="absolute inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-[2px]"
          />
          <motion.div
            {...panelMotion}
            className={`relative w-full ${s.maxWidth} bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl shadow-black/10 dark:shadow-black/40 overflow-hidden mx-4 ${panelClassName}`}
          >
            <div className={`flex flex-col ${s.gap} ${s.padding}`}>
              {children}
            </div>
          </motion.div>
        </div>,
        document.body
      )}
    </AnimatePresence>
  );
}

export interface FeedbackDialogProps extends Omit<DialogProviderProps, "children"> {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  isLoading?: boolean;
  showIcon?: boolean;
  footerAlign?: "left" | "center" | "right" | "between";
  size?: DialogSize;
  variant?: DialogVariant;
  position?: DialogPosition;
  isDismissible?: boolean;
  showDividers?: boolean;
  className?: string;
  panelClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  confirmClassName?: string;
  cancelClassName?: string;
  footer?: React.ReactNode;
}

export function FeedbackDialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  isLoading = false,
  showIcon = true,
  footerAlign = "right",
  size = "md",
  variant = "default",
  position = "center",
  isDismissible = true,
  showDividers = false,
  className = "",
  panelClassName = "",
  headerClassName = "",
  bodyClassName = "",
  titleClassName = "",
  descriptionClassName = "",
  confirmClassName = "",
  cancelClassName = "",
  footer,
}: FeedbackDialogProps) {
  return (
    <DialogProvider
      size={size}
      variant={variant}
      position={position}
      isDismissible={isDismissible}
      onClose={onClose}
    >
      <FeedbackDialogInner
        isOpen={isOpen}
        onClose={onClose}
        title={title}
        description={description}
        confirmLabel={confirmLabel}
        cancelLabel={cancelLabel}
        onConfirm={onConfirm}
        isLoading={isLoading}
        showIcon={showIcon}
        footerAlign={footerAlign}
        showDividers={showDividers}
        className={className}
        panelClassName={panelClassName}
        headerClassName={headerClassName}
        bodyClassName={bodyClassName}
        titleClassName={titleClassName}
        descriptionClassName={descriptionClassName}
        confirmClassName={confirmClassName}
        cancelClassName={cancelClassName}
        footer={footer}
      >
        {children}
      </FeedbackDialogInner>
    </DialogProvider>
  );
}

interface FeedbackDialogInnerProps extends Omit<FeedbackDialogProps, "size" | "variant" | "position" | "isDismissible"> {}

function FeedbackDialogInner({
  isOpen,
  title,
  description,
  children,
  confirmLabel,
  cancelLabel,
  onConfirm,
  isLoading,
  showIcon,
  footerAlign,
  showDividers,
  className,
  panelClassName,
  headerClassName,
  bodyClassName,
  titleClassName,
  descriptionClassName,
  confirmClassName,
  cancelClassName,
  footer,
}: FeedbackDialogInnerProps) {
  const { state, open, close } = useDialogContext();

  useEffect(() => {
    if (isOpen) open();
    else close();
  }, [isOpen]);

  useEffect(() => {
    if (!state.isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && state.isDismissible) close();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [state.isOpen, state.isDismissible, close]);

  const handleOverlayClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && state.isDismissible) close();
  }, [state.isDismissible, close]);

  return (
    <AnimatePresence>
      {state.isOpen && createPortal(
        <div
          className={`fixed inset-0 z-50 flex ${positionConfig[state.position].outer} ${className}`}
          role="dialog"
          aria-modal="true"
          onClick={handleOverlayClick}
        >
          <motion.div>
            {...overlayMotion}
            className="absolute inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-[2px]"
            onClick={handleOverlayClick}
          </motion.div>
          <motion.div
            {...buildPanelMotion(state.position)}
            className={`relative w-full ${sizeConfig[state.size].maxWidth} bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl shadow-black/10 dark:shadow-black/40 overflow-hidden mx-4 ${panelClassName}`}
          >
            <div className={`flex flex-col ${sizeConfig[state.size].gap} ${sizeConfig[state.size].padding}`}>
              <DialogHeader
                title={title}
                description={description}
                showIcon={showIcon}
                className={headerClassName}
                titleClassName={titleClassName}
                descriptionClassName={descriptionClassName}
              />
              {showDividers && <DialogDivider />}
              {children && (
                <DialogBody className={bodyClassName}>
                  {children}
                </DialogBody>
              )}
              {showDividers && <DialogDivider />}
              {footer ?? (
                <DialogActions
                  confirmLabel={confirmLabel}
                  cancelLabel={cancelLabel}
                  onConfirm={onConfirm}
                  isLoading={isLoading}
                  align={footerAlign}
                  confirmClassName={confirmClassName}
                  cancelClassName={cancelClassName}
                />
              )}
            </div>
          </motion.div>
        </div>,
        document.body
      )}
    </AnimatePresence>
  );
}

export interface DialogProps extends Omit<DialogProviderProps, "children"> {
  trigger: React.ReactNode;
  children: React.ReactNode;
  size?: DialogSize;
  variant?: DialogVariant;
  position?: DialogPosition;
  isDismissible?: boolean;
  className?: string;
  panelClassName?: string;
}

export function Dialog({
  trigger,
  children,
  size = "md",
  variant = "default",
  position = "center",
  isDismissible = true,
  className = "",
  panelClassName = "",
  ...providerProps
}: DialogProps) {
  return (
    <DialogProvider
      {...providerProps}
      size={size}
      variant={variant}
      position={position}
      isDismissible={isDismissible}
    >
      <DialogInner
        trigger={trigger}
        className={className}
        panelClassName={panelClassName}
      >
        {children}
      </DialogInner>
    </DialogProvider>
  );
}

interface DialogInnerProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  panelClassName?: string;
}

function DialogInner({ trigger, children, className = "", panelClassName = "" }: DialogInnerProps) {
  const { state, toggle, close } = useDialogContext();

  useEffect(() => {
    if (!state.isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && state.isDismissible) close();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [state.isOpen, state.isDismissible, close]);

  const handleOverlayClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && state.isDismissible) close();
  }, [state.isDismissible, close]);

  return (
    <>
      <div onClick={toggle} className="inline-block cursor-pointer">
        {trigger}
      </div>
      <AnimatePresence>
        {state.isOpen && createPortal(
          <div
            className={`fixed inset-0 z-50 flex ${positionConfig[state.position].outer} ${className}`}
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
              {...buildPanelMotion(state.position)}
              className={`relative w-full ${sizeConfig[state.size].maxWidth} bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl shadow-black/10 dark:shadow-black/40 overflow-hidden mx-4 ${panelClassName}`}
            >
              <div className={`flex flex-col ${sizeConfig[state.size].gap} ${sizeConfig[state.size].padding}`}>
                {children}
              </div>
            </motion.div>
          </div>,
          document.body
        )}
      </AnimatePresence>
    </>
  );
}

export {
  DialogProvider,
  useDialogContext,
  type DialogSize,
  type DialogVariant,
  type DialogPosition,
};