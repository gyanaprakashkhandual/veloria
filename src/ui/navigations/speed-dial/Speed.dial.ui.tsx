import React, {
  useRef,
  useEffect,
  useCallback,
  useState,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";
import {
  SpeedDialProvider,
  useSpeedDialContext,
  type SpeedDialProviderProps,
  type SpeedDialAction,
  type SpeedDialSize,
  type SpeedDialVariant,
  type SpeedDialShape,
  type SpeedDialDirection,
  type SpeedDialPlacement,
  type SpeedDialLabelPosition,
  type SpeedDialOpenOn,
} from "./Speed.dial.context";

// ─── Size Config ─────────────────────────────────────────────────────────────

const sizeConfig = {
  sm: {
    triggerDim: "w-10 h-10",
    triggerIcon: 16,
    actionDim: "w-8 h-8",
    actionIcon: 13,
    labelText: "text-[11px]",
    labelPx: "px-2",
    labelPy: "py-0.5",
    gap: 8,
    badgeSize: "w-3.5 h-3.5 text-[8px]",
    subActionDim: "w-7 h-7",
    subActionIcon: 11,
    tooltipText: "text-[10px]",
  },
  md: {
    triggerDim: "w-12 h-12",
    triggerIcon: 20,
    actionDim: "w-10 h-10",
    actionIcon: 15,
    labelText: "text-xs",
    labelPx: "px-2.5",
    labelPy: "py-1",
    gap: 10,
    badgeSize: "w-4 h-4 text-[9px]",
    subActionDim: "w-8 h-8",
    subActionIcon: 13,
    tooltipText: "text-[11px]",
  },
  lg: {
    triggerDim: "w-14 h-14",
    triggerIcon: 22,
    actionDim: "w-11 h-11",
    actionIcon: 16,
    labelText: "text-xs",
    labelPx: "px-3",
    labelPy: "py-1",
    gap: 12,
    badgeSize: "w-4 h-4 text-[9px]",
    subActionDim: "w-9 h-9",
    subActionIcon: 14,
    tooltipText: "text-xs",
  },
  xl: {
    triggerDim: "w-16 h-16",
    triggerIcon: 24,
    actionDim: "w-12 h-12",
    actionIcon: 18,
    labelText: "text-sm",
    labelPx: "px-3",
    labelPy: "py-1.5",
    gap: 14,
    badgeSize: "w-4.5 h-4.5 text-[10px]",
    subActionDim: "w-10 h-10",
    subActionIcon: 15,
    tooltipText: "text-xs",
  },
};

// ─── Shape Config ─────────────────────────────────────────────────────────────

const shapeConfig: Record<SpeedDialShape, string> = {
  circle: "rounded-full",
  rounded: "rounded-xl",
  square: "rounded-none",
};

// ─── Variant Config ───────────────────────────────────────────────────────────

const triggerVariantConfig: Record<SpeedDialVariant, string> = {
  default:
    "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 shadow-lg shadow-black/20 dark:shadow-black/40 hover:bg-gray-800 dark:hover:bg-gray-200",
  ghost:
    "bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 shadow-md hover:bg-white dark:hover:bg-gray-900",
  outline:
    "bg-transparent border-2 border-gray-800 dark:border-gray-200 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800",
  filled:
    "bg-blue-600 dark:bg-blue-500 text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700 dark:hover:bg-blue-600",
};

const actionVariantConfig: Record<SpeedDialVariant, string> = {
  default:
    "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 shadow-md shadow-black/10 dark:shadow-black/30 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600",
  ghost:
    "bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border border-gray-200/60 dark:border-gray-700/60 text-gray-700 dark:text-gray-300 shadow-sm hover:bg-white/90 dark:hover:bg-gray-900/90",
  outline:
    "bg-transparent border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-500 dark:hover:border-gray-400",
  filled:
    "bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 shadow-md hover:bg-gray-700 dark:hover:bg-gray-300",
};

// ─── Placement Config ─────────────────────────────────────────────────────────

const placementConfig: Record<SpeedDialPlacement, string> = {
  "bottom-right": "fixed bottom-6 right-6",
  "bottom-left": "fixed bottom-6 left-6",
  "top-right": "fixed top-6 right-6",
  "top-left": "fixed top-6 left-6",
  none: "relative",
};

// ─── Motion Helpers ───────────────────────────────────────────────────────────

function getActionMotion(
  direction: SpeedDialDirection,
  index: number,
  total: number,
) {
  const stagger = index * 0.04;
  const reverseStagger = (total - 1 - index) * 0.03;

  const offset = 16;
  const initial: Record<string, number | string> = { opacity: 0, scale: 0.7 };
  const animate: Record<string, number | string> = { opacity: 1, scale: 1 };
  const exit: Record<string, number | string> = { opacity: 0, scale: 0.7 };

  if (direction === "up") { initial.y = offset; exit.y = offset; }
  if (direction === "down") { initial.y = -offset; exit.y = -offset; }
  if (direction === "left") { initial.x = offset; exit.x = offset; }
  if (direction === "right") { initial.x = -offset; exit.x = -offset; }

  return {
    initial,
    animate,
    exit,
    transition: {
      duration: 0.2,
      ease: [0.25, 0.46, 0.45, 0.94],
      delay: stagger,
    },
    exitTransition: { duration: 0.15, ease: "easeIn", delay: reverseStagger },
  };
}

function getActionsLayoutStyle(
  direction: SpeedDialDirection,
  gap: number,
): React.CSSProperties {
  const base: React.CSSProperties = {
    position: "absolute",
    display: "flex",
    alignItems: "center",
    gap,
  };
  if (direction === "up")
    return { ...base, flexDirection: "column-reverse", bottom: "100%", left: "50%", transform: "translateX(-50%)", paddingBottom: gap };
  if (direction === "down")
    return { ...base, flexDirection: "column", top: "100%", left: "50%", transform: "translateX(-50%)", paddingTop: gap };
  if (direction === "left")
    return { ...base, flexDirection: "row-reverse", right: "100%", top: "50%", transform: "translateY(-50%)", paddingRight: gap };
  // right
  return { ...base, flexDirection: "row", left: "100%", top: "50%", transform: "translateY(-50%)", paddingLeft: gap };
}

// ─── Badge ────────────────────────────────────────────────────────────────────

function Badge({ value, sizeKey }: { value: number | boolean; sizeKey: SpeedDialSize }) {
  const s = sizeConfig[sizeKey];
  const isNum = typeof value === "number";
  return (
    <span
      className={`
        absolute -top-1 -right-1 z-10 flex items-center justify-center
        rounded-full bg-red-500 text-white font-bold leading-none
        ${s.badgeSize}
      `}
    >
      {isNum && value > 0 ? (value > 99 ? "99+" : value) : ""}
    </span>
  );
}

// ─── Tooltip ─────────────────────────────────────────────────────────────────

function ActionTooltip({
  label,
  labelPosition,
  children,
  sizeKey,
}: {
  label: string;
  labelPosition: SpeedDialLabelPosition;
  children: React.ReactNode;
  sizeKey: SpeedDialSize;
}) {
  const s = sizeConfig[sizeKey];

  if (labelPosition === "none") {
    // Floating tooltip
    return (
      <div className="relative flex items-center group">
        {children}
        <span
          className={`
            pointer-events-none absolute z-50 whitespace-nowrap
            bg-gray-900 dark:bg-gray-700 text-white
            ${s.tooltipText} font-medium px-2.5 py-1 rounded-lg
            shadow-lg opacity-0 group-hover:opacity-100
            transition-opacity duration-150
            right-[calc(100%+8px)]
          `}
        >
          {label}
        </span>
      </div>
    );
  }

  // Inline label chip
  const labelEl = (
    <motion.span
      initial={{ opacity: 0, x: labelPosition === "left" ? 6 : -6 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: labelPosition === "left" ? 6 : -6 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className={`
        shrink-0 whitespace-nowrap
        bg-white dark:bg-gray-900
        border border-gray-200 dark:border-gray-700
        text-gray-700 dark:text-gray-300
        ${s.labelText} font-semibold
        ${s.labelPx} ${s.labelPy}
        rounded-lg shadow-md shadow-black/10 dark:shadow-black/30
        pointer-events-none select-none
      `}
    >
      {label}
    </motion.span>
  );

  return (
    <div
      className={`flex items-center gap-2 ${labelPosition === "right" ? "flex-row" : "flex-row-reverse"}`}
    >
      {children}
      {labelEl}
    </div>
  );
}

// ─── SubDial ──────────────────────────────────────────────────────────────────

function SubDial({
  parentId,
  subActions,
  direction,
}: {
  parentId: string;
  subActions: SpeedDialAction[];
  direction: SpeedDialDirection;
}) {
  const { state } = useSpeedDialContext();
  const s = sizeConfig[state.size];
  const isOpen = state.activeSubDial === parentId;

  // Sub-dial always opens perpendicular or same direction
  const subDir: SpeedDialDirection =
    direction === "up" || direction === "down" ? "right" : "up";

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={getActionsLayoutStyle(subDir, s.gap / 1.2)}>
          {subActions.map((sub, idx) => {
            const m = getActionMotion(subDir, idx, subActions.length);
            return (
              <motion.div
                key={sub.id}
                initial={m.initial}
                animate={m.animate}
                exit={m.exit}
                transition={m.transition}
              >
                <SubActionButton action={sub} />
              </motion.div>
            );
          })}
        </div>
      )}
    </AnimatePresence>
  );
}

// ─── Sub Action Button ────────────────────────────────────────────────────────

function SubActionButton({ action }: { action: SpeedDialAction }) {
  const { state, close } = useSpeedDialContext();
  const s = sizeConfig[state.size];
  const variant = action.variant ?? state.variant;
  const disabled = state.disabled || !!action.disabled;

  const handleClick = useCallback(() => {
    if (disabled) return;
    action.onClick?.(action.id);
    if (state.closeOnAction && !state.persistent) close();
  }, [action, disabled, state.closeOnAction, state.persistent, close]);

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={handleClick}
      aria-label={action.label ?? action.id}
      className={`
        relative flex items-center justify-center
        ${s.subActionDim}
        ${shapeConfig[state.shape]}
        ${actionVariantConfig[variant]}
        transition-all duration-150
        ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer active:scale-95"}
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
      `}
    >
      <span
        className="flex items-center justify-center"
        style={{ width: s.subActionIcon, height: s.subActionIcon }}
      >
        {action.icon}
      </span>
      {action.badge !== undefined && action.badge !== false && (
        <Badge value={action.badge} sizeKey={state.size} />
      )}
    </button>
  );
}

// ─── Action Button ────────────────────────────────────────────────────────────

function ActionButton({
  action,
  index,
  total,
}: {
  action: SpeedDialAction;
  index: number;
  total: number;
}) {
  const { state, close, setActiveSubDial, onAction } = useSpeedDialContext();
  const s = sizeConfig[state.size];
  const variant = action.variant ?? state.variant;
  const disabled = state.disabled || !!action.disabled;
  const hasSubDial = !!action.subActions?.length;
  const isSubOpen = state.activeSubDial === action.id;

  const handleClick = useCallback(() => {
    if (disabled) return;

    if (hasSubDial) {
      setActiveSubDial(isSubOpen ? null : action.id);
      return;
    }

    action.onClick?.(action.id);
    onAction?.(action);
    if (state.closeOnAction && !state.persistent) close();
  }, [
    action,
    disabled,
    hasSubDial,
    isSubOpen,
    setActiveSubDial,
    onAction,
    state.closeOnAction,
    state.persistent,
    close,
  ]);

  const btn = (
    <div className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={handleClick}
        aria-label={action.label ?? action.id}
        aria-expanded={hasSubDial ? isSubOpen : undefined}
        aria-haspopup={hasSubDial ? "true" : undefined}
        className={`
          relative flex items-center justify-center
          ${s.actionDim}
          ${shapeConfig[state.shape]}
          ${actionVariantConfig[variant]}
          transition-all duration-150
          ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer active:scale-95 hover:scale-105"}
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
        `}
      >
        <span
          className="flex items-center justify-center"
          style={{ width: s.actionIcon, height: s.actionIcon }}
        >
          <motion.span
            animate={{ rotate: hasSubDial && isSubOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center"
          >
            {action.icon}
          </motion.span>
        </span>
        {action.badge !== undefined && action.badge !== false && (
          <Badge value={action.badge} sizeKey={state.size} />
        )}
      </button>

      {/* Sub-dial */}
      {hasSubDial && (
        <SubDial
          parentId={action.id}
          subActions={action.subActions!}
          direction={state.direction}
        />
      )}
    </div>
  );

  const labelPos = state.labelPosition;
  const labelStr = action.label ?? action.tooltip ?? "";

  if (!labelStr) return btn;

  return (
    <ActionTooltip label={labelStr} labelPosition={labelPos} sizeKey={state.size}>
      {btn}
    </ActionTooltip>
  );
}

// ─── Trigger Button ───────────────────────────────────────────────────────────

interface TriggerProps {
  customTrigger?: React.ReactNode;
  openIcon?: React.ReactNode;
  closeIcon?: React.ReactNode;
}

function TriggerButton({ customTrigger, openIcon, closeIcon }: TriggerProps) {
  const { state, toggle, open, close } = useSpeedDialContext();
  const s = sizeConfig[state.size];

  const handleClick = useCallback(() => toggle(), [toggle]);
  const handleMouseEnter = useCallback(() => {
    if (state.openOn === "hover" || state.openOn === "both") open();
  }, [state.openOn, open]);
  const handleMouseLeave = useCallback(() => {
    if (state.openOn === "hover") close();
  }, [state.openOn, close]);

  if (customTrigger) {
    return (
      <div
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="cursor-pointer"
      >
        {customTrigger}
      </div>
    );
  }

  return (
    <button
      type="button"
      disabled={state.disabled}
      onClick={state.openOn === "click" || state.openOn === "both" ? handleClick : undefined}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label={state.isOpen ? "Close speed dial" : "Open speed dial"}
      aria-expanded={state.isOpen}
      className={`
        relative flex items-center justify-center
        ${s.triggerDim}
        ${shapeConfig[state.shape]}
        ${triggerVariantConfig[state.variant]}
        transition-all duration-200
        ${state.disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer active:scale-95"}
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
      `}
    >
      <AnimatePresence mode="wait" initial={false}>
        {state.isOpen ? (
          <motion.span
            key="close"
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="flex items-center justify-center"
          >
            {closeIcon ?? <X size={s.triggerIcon} />}
          </motion.span>
        ) : (
          <motion.span
            key="open"
            initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="flex items-center justify-center"
          >
            {openIcon ?? <Plus size={s.triggerIcon} />}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

// ─── Backdrop ─────────────────────────────────────────────────────────────────

function Backdrop() {
  const { state, close } = useSpeedDialContext();

  return (
    <AnimatePresence>
      {state.isOpen && state.backdrop && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={close}
          className="fixed inset-0 z-40 bg-black/20 dark:bg-black/40 backdrop-blur-[2px]"
          aria-hidden="true"
        />
      )}
    </AnimatePresence>
  );
}

// ─── SpeedDial Inner ──────────────────────────────────────────────────────────

interface SpeedDialInnerProps {
  actions: SpeedDialAction[];
  trigger?: React.ReactNode;
  openIcon?: React.ReactNode;
  closeIcon?: React.ReactNode;
  className?: string;
  containerClassName?: string;
}

function SpeedDialInner({
  actions,
  trigger,
  openIcon,
  closeIcon,
  className = "",
  containerClassName = "",
}: SpeedDialInnerProps) {
  const { state, close, open } = useSpeedDialContext();
  const s = sizeConfig[state.size];
  const wrapRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!state.isOpen) return;
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [state.isOpen, close]);

  // Keyboard navigation
  useEffect(() => {
    if (!state.isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [state.isOpen, close]);

  // Hover mode: close when leaving the whole component
  const handleMouseLeave = useCallback(() => {
    if (state.openOn === "hover") close();
  }, [state.openOn, close]);

  const handleMouseEnter = useCallback(() => {
    if (state.openOn === "hover" || state.openOn === "both") open();
  }, [state.openOn, open]);

  return (
    <>
      <Backdrop />
      <div
        className={`${placementConfig[state.placement]} z-50 ${containerClassName}`}
      >
        <div
          ref={wrapRef}
          className={`relative flex items-center justify-center ${className}`}
          onMouseLeave={handleMouseLeave}
          onMouseEnter={
            state.openOn === "hover" || state.openOn === "both"
              ? handleMouseEnter
              : undefined
          }
        >
          {/* Actions */}
          <div style={getActionsLayoutStyle(state.direction, s.gap)}>
            <AnimatePresence>
              {state.isOpen &&
                actions.map((action, idx) => {
                  const m = getActionMotion(
                    state.direction,
                    idx,
                    actions.length,
                  );
                  return (
                    <motion.div
                      key={action.id}
                      initial={m.initial}
                      animate={m.animate}
                      exit={m.exit}
                      transition={
                        state.isOpen ? m.transition : m.exitTransition
                      }
                    >
                      {action.render ? (
                        action.render({
                          id: action.id,
                          isOpen: state.isOpen,
                          size: state.size,
                          disabled: state.disabled || !!action.disabled,
                          close,
                        })
                      ) : (
                        <ActionButton
                          action={action}
                          index={idx}
                          total={actions.length}
                        />
                      )}
                    </motion.div>
                  );
                })}
            </AnimatePresence>
          </div>

          {/* Trigger */}
          <TriggerButton
            customTrigger={trigger}
            openIcon={openIcon}
            closeIcon={closeIcon}
          />
        </div>
      </div>
    </>
  );
}

// ─── Public API ───────────────────────────────────────────────────────────────

export interface SpeedDialProps
  extends Omit<SpeedDialProviderProps, "children"> {
  /** The action items to render */
  actions: SpeedDialAction[];
  /** Custom trigger element — replaces default FAB */
  trigger?: React.ReactNode;
  /** Icon shown on trigger when closed */
  openIcon?: React.ReactNode;
  /** Icon shown on trigger when open */
  closeIcon?: React.ReactNode;
  /** Classes applied to the inner wrapper (relative positioned) */
  className?: string;
  /** Classes applied to the placement container */
  containerClassName?: string;
}

export function SpeedDial({
  actions,
  trigger,
  openIcon,
  closeIcon,
  className,
  containerClassName,
  size = "md",
  variant = "default",
  shape = "circle",
  direction = "up",
  placement = "bottom-right",
  labelPosition = "left",
  openOn = "click",
  disabled = false,
  closeOnAction = true,
  persistent = false,
  backdrop = false,
  onAction,
  onOpen,
  onClose,
}: SpeedDialProps) {
  return (
    <SpeedDialProvider
      size={size}
      variant={variant}
      shape={shape}
      direction={direction}
      placement={placement}
      labelPosition={labelPosition}
      openOn={openOn}
      disabled={disabled}
      closeOnAction={closeOnAction}
      persistent={persistent}
      backdrop={backdrop}
      onAction={onAction}
      onOpen={onOpen}
      onClose={onClose}
    >
      <SpeedDialInner
        actions={actions}
        trigger={trigger}
        openIcon={openIcon}
        closeIcon={closeIcon}
        className={className}
        containerClassName={containerClassName}
      />
    </SpeedDialProvider>
  );
}

// ─── Re-exports ───────────────────────────────────────────────────────────────

export { SpeedDialProvider, useSpeedDialContext };
export type {
  SpeedDialAction,
  SpeedDialSize,
  SpeedDialVariant,
  SpeedDialShape,
  SpeedDialDirection,
  SpeedDialPlacement,
  SpeedDialLabelPosition,
  SpeedDialOpenOn,
};