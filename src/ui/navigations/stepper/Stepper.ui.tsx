import React, { useCallback, useRef, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, AlertTriangle, Minus, ChevronRight, ChevronDown } from "lucide-react";
import {
  StepperProvider,
  useStepperContext,
  type StepperProviderProps,
  type StepItem,
  type StepperSize,
  type StepperVariant,
  type StepperOrientation,
  type StepperLabelPlacement,
  type StepStatus,
} from "./Stepper.context";

// ─── Design Tokens ────────────────────────────────────────────────────────────

const sizeConfig = {
  sm: {
    indicatorSize: "w-6 h-6",
    indicatorText: "text-xs",
    iconSize: 12,
    titleText: "text-xs",
    subtitleText: "text-[10px]",
    descriptionText: "text-xs",
    connectorH: "h-px",
    connectorV: "w-px min-h-[24px]",
    connectorVMin: 24,
    gapH: "gap-1",
    gapV: "gap-2",
    labelGap: "gap-0.5",
    optionalText: "text-[9px]",
    stepGapH: "gap-0",
    paddingV: "pl-8",
    contentGapV: "mt-1.5 mb-3",
  },
  md: {
    indicatorSize: "w-8 h-8",
    indicatorText: "text-sm",
    iconSize: 14,
    titleText: "text-sm",
    subtitleText: "text-xs",
    descriptionText: "text-sm",
    connectorH: "h-px",
    connectorV: "w-px min-h-[32px]",
    connectorVMin: 32,
    gapH: "gap-2",
    gapV: "gap-3",
    labelGap: "gap-0.5",
    optionalText: "text-[10px]",
    stepGapH: "gap-0",
    paddingV: "pl-11",
    contentGapV: "mt-2 mb-4",
  },
  lg: {
    indicatorSize: "w-10 h-10",
    indicatorText: "text-base",
    iconSize: 16,
    titleText: "text-base",
    subtitleText: "text-sm",
    descriptionText: "text-sm",
    connectorH: "h-px",
    connectorV: "w-px min-h-[40px]",
    connectorVMin: 40,
    gapH: "gap-2.5",
    gapV: "gap-3.5",
    labelGap: "gap-1",
    optionalText: "text-xs",
    stepGapH: "gap-0",
    paddingV: "pl-14",
    contentGapV: "mt-2.5 mb-5",
  },
  xl: {
    indicatorSize: "w-12 h-12",
    indicatorText: "text-lg",
    iconSize: 18,
    titleText: "text-base",
    subtitleText: "text-sm",
    descriptionText: "text-sm",
    connectorH: "h-px",
    connectorV: "w-px min-h-[48px]",
    connectorVMin: 48,
    gapH: "gap-3",
    gapV: "gap-4",
    labelGap: "gap-1",
    optionalText: "text-xs",
    stepGapH: "gap-0",
    paddingV: "pl-16",
    contentGapV: "mt-3 mb-6",
  },
} as const;

// ─── Variant Config ───────────────────────────────────────────────────────────

const variantConfig = {
  default: {
    wrapper: "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm shadow-black/5 dark:shadow-black/20 p-6",
    // Step indicator states
    indicator: {
      pending:   "bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500",
      active:    "bg-gray-900 dark:bg-white border-2 border-gray-900 dark:border-white text-white dark:text-gray-900",
      completed: "bg-gray-900 dark:bg-white border-2 border-gray-900 dark:border-white text-white dark:text-gray-900",
      error:     "bg-red-50 dark:bg-red-950 border-2 border-red-500 dark:border-red-400 text-red-500 dark:text-red-400",
      warning:   "bg-amber-50 dark:bg-amber-950 border-2 border-amber-500 dark:border-amber-400 text-amber-600 dark:text-amber-400",
      skipped:   "bg-white dark:bg-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-300 dark:text-gray-600",
    },
    // Connector
    connectorBase:      "bg-gray-200 dark:bg-gray-700",
    connectorCompleted: "bg-gray-900 dark:bg-white",
    connectorActive:    "bg-gray-900 dark:bg-white",
    connectorError:     "bg-red-400 dark:bg-red-500",
    // Title
    titlePending:   "text-gray-400 dark:text-gray-500",
    titleActive:    "text-gray-900 dark:text-white font-semibold",
    titleCompleted: "text-gray-700 dark:text-gray-300",
    titleError:     "text-red-500 dark:text-red-400 font-semibold",
    titleWarning:   "text-amber-600 dark:text-amber-400 font-semibold",
    titleSkipped:   "text-gray-300 dark:text-gray-600 line-through",
    // Subtitle
    subtitleColor: "text-gray-400 dark:text-gray-500",
    // Optional badge
    optionalBadge: "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-700",
    // Content panel
    contentPanel: "bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800 p-4",
  },
  filled: {
    wrapper: "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm shadow-black/5 dark:shadow-black/20 p-6",
    indicator: {
      pending:   "bg-gray-100 dark:bg-gray-800 border-2 border-transparent text-gray-400 dark:text-gray-500",
      active:    "bg-gray-900 dark:bg-white border-2 border-transparent text-white dark:text-gray-900",
      completed: "bg-gray-700 dark:bg-gray-200 border-2 border-transparent text-white dark:text-gray-900",
      error:     "bg-red-500 dark:bg-red-500 border-2 border-transparent text-white",
      warning:   "bg-amber-500 dark:bg-amber-500 border-2 border-transparent text-white",
      skipped:   "bg-gray-100 dark:bg-gray-800 border-2 border-transparent text-gray-300 dark:text-gray-600",
    },
    connectorBase:      "bg-gray-200 dark:bg-gray-700",
    connectorCompleted: "bg-gray-900 dark:bg-white",
    connectorActive:    "bg-gray-900 dark:bg-white",
    connectorError:     "bg-red-400 dark:bg-red-500",
    titlePending:   "text-gray-400 dark:text-gray-500",
    titleActive:    "text-gray-900 dark:text-white font-semibold",
    titleCompleted: "text-gray-700 dark:text-gray-300",
    titleError:     "text-red-500 dark:text-red-400 font-semibold",
    titleWarning:   "text-amber-600 dark:text-amber-400 font-semibold",
    titleSkipped:   "text-gray-300 dark:text-gray-600 line-through",
    subtitleColor:  "text-gray-400 dark:text-gray-500",
    optionalBadge:  "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-700",
    contentPanel:   "bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800 p-4",
  },
  ghost: {
    wrapper: "bg-transparent p-0",
    indicator: {
      pending:   "bg-transparent border-2 border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500",
      active:    "bg-gray-900 dark:bg-white border-2 border-gray-900 dark:border-white text-white dark:text-gray-900",
      completed: "bg-transparent border-2 border-gray-400 dark:border-gray-500 text-gray-500 dark:text-gray-400",
      error:     "bg-transparent border-2 border-red-500 dark:border-red-400 text-red-500 dark:text-red-400",
      warning:   "bg-transparent border-2 border-amber-500 dark:border-amber-400 text-amber-600 dark:text-amber-400",
      skipped:   "bg-transparent border-2 border-dashed border-gray-200 dark:border-gray-700 text-gray-300 dark:text-gray-600",
    },
    connectorBase:      "bg-gray-200 dark:bg-gray-700",
    connectorCompleted: "bg-gray-500 dark:bg-gray-400",
    connectorActive:    "bg-gray-900 dark:bg-white",
    connectorError:     "bg-red-400 dark:bg-red-500",
    titlePending:   "text-gray-400 dark:text-gray-500",
    titleActive:    "text-gray-900 dark:text-white font-semibold",
    titleCompleted: "text-gray-600 dark:text-gray-400",
    titleError:     "text-red-500 dark:text-red-400 font-semibold",
    titleWarning:   "text-amber-600 dark:text-amber-400 font-semibold",
    titleSkipped:   "text-gray-300 dark:text-gray-600 line-through",
    subtitleColor:  "text-gray-400 dark:text-gray-500",
    optionalBadge:  "bg-transparent text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-700",
    contentPanel:   "bg-transparent border-l-2 border-gray-200 dark:border-gray-700 pl-4",
  },
  outline: {
    wrapper: "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6",
    indicator: {
      pending:   "bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500",
      active:    "bg-white dark:bg-gray-900 border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white",
      completed: "bg-white dark:bg-gray-900 border-2 border-gray-400 dark:border-gray-500 text-gray-500 dark:text-gray-400",
      error:     "bg-white dark:bg-gray-900 border-2 border-red-500 dark:border-red-400 text-red-500 dark:text-red-400",
      warning:   "bg-white dark:bg-gray-900 border-2 border-amber-500 dark:border-amber-400 text-amber-600 dark:text-amber-400",
      skipped:   "bg-white dark:bg-gray-900 border-2 border-dashed border-gray-200 dark:border-gray-700 text-gray-300 dark:text-gray-600",
    },
    connectorBase:      "bg-gray-200 dark:bg-gray-700",
    connectorCompleted: "bg-gray-400 dark:bg-gray-500",
    connectorActive:    "bg-gray-900 dark:bg-white",
    connectorError:     "bg-red-400 dark:bg-red-500",
    titlePending:   "text-gray-400 dark:text-gray-500",
    titleActive:    "text-gray-900 dark:text-white font-semibold",
    titleCompleted: "text-gray-600 dark:text-gray-400",
    titleError:     "text-red-500 dark:text-red-400 font-semibold",
    titleWarning:   "text-amber-600 dark:text-amber-400 font-semibold",
    titleSkipped:   "text-gray-300 dark:text-gray-600 line-through",
    subtitleColor:  "text-gray-400 dark:text-gray-500",
    optionalBadge:  "bg-white dark:bg-gray-900 text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-700",
    contentPanel:   "bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 p-4",
  },
} as const;

// ─── Status Icon ──────────────────────────────────────────────────────────────

function StatusIcon({
  status,
  step,
  index,
  iconSize,
}: {
  status: StepStatus;
  step: StepItem;
  index: number;
  iconSize: number;
}) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={status}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="flex items-center justify-center"
      >
        {status === "completed" && (step.completedIcon ?? <Check size={iconSize} strokeWidth={2.5} />)}
        {status === "error" && (step.errorIcon ?? <X size={iconSize} strokeWidth={2.5} />)}
        {status === "warning" && (step.warningIcon ?? <AlertTriangle size={iconSize} strokeWidth={2.5} />)}
        {status === "skipped" && <Minus size={iconSize} strokeWidth={2} />}
        {(status === "active" || status === "pending") && (
          step.icon ?? <span className="font-semibold tabular-nums leading-none">{index + 1}</span>
        )}
      </motion.span>
    </AnimatePresence>
  );
}

// ─── Connector ────────────────────────────────────────────────────────────────

interface ConnectorProps {
  fromIndex: number;
  orientation: StepperOrientation;
  size: StepperSize;
  variant: StepperVariant;
  connectorClassName?: string;
}

function Connector({ fromIndex, orientation, size, variant, connectorClassName = "" }: ConnectorProps) {
  const { getStepStatus } = useStepperContext();
  const s = sizeConfig[size];
  const v = variantConfig[variant];
  const status = getStepStatus(fromIndex);
  const isCompleted = status === "completed" || status === "skipped";
  const isError = status === "error";

  const fillColor = isError
    ? v.connectorError
    : isCompleted
      ? v.connectorCompleted
      : v.connectorBase;

  if (orientation === "horizontal") {
    return (
      <div className={`flex-1 relative ${s.connectorH} ${v.connectorBase} overflow-hidden ${connectorClassName}`}>
        <motion.div
          className={`absolute inset-0 origin-left ${fillColor}`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isCompleted || isError ? 1 : 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
        />
      </div>
    );
  }

  return (
    <div className={`relative ${s.connectorV} ml-auto mr-auto flex-shrink-0 ${v.connectorBase} overflow-hidden ${connectorClassName}`}
      style={{ marginLeft: "auto", marginRight: "auto" }}>
      <motion.div
        className={`absolute inset-0 origin-top ${fillColor}`}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: isCompleted || isError ? 1 : 0 }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
      />
    </div>
  );
}

// ─── Step Indicator ───────────────────────────────────────────────────────────

interface StepIndicatorProps {
  step: StepItem;
  index: number;
  size: StepperSize;
  variant: StepperVariant;
  indicatorClassName?: string;
}

function StepIndicator({ step, index, size, variant, indicatorClassName = "" }: StepIndicatorProps) {
  const { getStepStatus } = useStepperContext();
  const s = sizeConfig[size];
  const v = variantConfig[variant];
  const status = getStepStatus(index);

  return (
    <div
      className={`
        relative shrink-0 rounded-full flex items-center justify-center
        transition-all duration-200 select-none
        ${s.indicatorSize} ${s.indicatorText}
        ${v.indicator[status]}
        ${step.disabled ? "opacity-40" : ""}
        ${indicatorClassName}
      `}
      aria-hidden="true"
    >
      <StatusIcon status={status} step={step} index={index} iconSize={s.iconSize} />

      {/* Pulse ring on active */}
      {status === "active" && (
        <motion.span
          className="absolute inset-0 rounded-full border-2 border-gray-900 dark:border-white"
          animate={{ scale: [1, 1.35], opacity: [0.5, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
        />
      )}
    </div>
  );
}

// ─── Step Label ───────────────────────────────────────────────────────────────

interface StepLabelProps {
  step: StepItem;
  index: number;
  size: StepperSize;
  variant: StepperVariant;
  orientation: StepperOrientation;
  titleClassName?: string;
  subtitleClassName?: string;
  optionalClassName?: string;
}

function StepLabel({
  step, index, size, variant, orientation,
  titleClassName = "", subtitleClassName = "", optionalClassName = "",
}: StepLabelProps) {
  const { getStepStatus } = useStepperContext();
  const s = sizeConfig[size];
  const v = variantConfig[variant];
  const status = getStepStatus(index);

  const titleColorMap: Record<StepStatus, string> = {
    pending:   v.titlePending,
    active:    v.titleActive,
    completed: v.titleCompleted,
    error:     v.titleError,
    warning:   v.titleWarning,
    skipped:   v.titleSkipped,
  };

  return (
    <div className={`flex flex-col ${s.labelGap} ${orientation === "horizontal" ? "items-center text-center" : "items-start text-left"} min-w-0`}>
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className={`${s.titleText} ${titleColorMap[status]} leading-tight transition-colors duration-200 truncate ${titleClassName}`}>
          {step.title}
        </span>
        {step.optional && (
          <span className={`${s.optionalText} px-1.5 py-0.5 rounded-full font-medium tracking-wide ${v.optionalBadge} ${optionalClassName}`}>
            Optional
          </span>
        )}
      </div>
      {step.subtitle && (
        <span className={`${s.subtitleText} ${v.subtitleColor} leading-tight truncate ${subtitleClassName}`}>
          {step.subtitle}
        </span>
      )}
    </div>
  );
}

// ─── Single Step (Horizontal) ─────────────────────────────────────────────────

interface HorizontalStepProps {
  step: StepItem;
  index: number;
  isLast: boolean;
  size: StepperSize;
  variant: StepperVariant;
  labelPlacement: StepperLabelPlacement;
  stepClassName?: string;
  indicatorClassName?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  optionalClassName?: string;
  connectorClassName?: string;
}

function HorizontalStep({
  step, index, isLast, size, variant, labelPlacement,
  stepClassName = "", indicatorClassName = "", titleClassName = "",
  subtitleClassName = "", optionalClassName = "", connectorClassName = "",
}: HorizontalStepProps) {
  const { goTo, clickable, linear, state, getStepStatus } = useStepperContext();
  const status = getStepStatus(index);
  const isActive = status === "active";
  const isCompleted = status === "completed" || status === "skipped";
  const canClick = clickable && !step.disabled && !linear
    ? true
    : clickable && !step.disabled && (isCompleted || state.visitedSteps.has(index));

  const handleClick = useCallback(() => {
    if (canClick) goTo(index);
  }, [canClick, goTo, index]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleClick(); }
  }, [handleClick]);

  const stepEl = (
    <div
      className={`
        flex flex-col items-center gap-1.5
        ${canClick ? "cursor-pointer group" : "cursor-default"}
        ${step.disabled ? "pointer-events-none" : ""}
        ${stepClassName}
      `}
      role="tab"
      aria-selected={isActive}
      aria-disabled={step.disabled}
      tabIndex={canClick ? 0 : -1}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <StepIndicator step={step} index={index} size={size} variant={variant} indicatorClassName={indicatorClassName} />
      {labelPlacement === "bottom" && (
        <StepLabel step={step} index={index} size={size} variant={variant} orientation="horizontal"
          titleClassName={titleClassName} subtitleClassName={subtitleClassName} optionalClassName={optionalClassName} />
      )}
    </div>
  );

  if (isLast) {
    return (
      <div className="flex flex-col items-center gap-1.5">
        {stepEl}
        {labelPlacement === "right" && (
          <StepLabel step={step} index={index} size={size} variant={variant} orientation="horizontal"
            titleClassName={titleClassName} subtitleClassName={subtitleClassName} optionalClassName={optionalClassName} />
        )}
      </div>
    );
  }

  return (
    <div className="flex items-start flex-1 min-w-0">
      <div className="flex flex-col items-center gap-1.5 shrink-0">
        <StepIndicator step={step} index={index} size={size} variant={variant} indicatorClassName={indicatorClassName} />
        {labelPlacement === "bottom" && (
          <StepLabel step={step} index={index} size={size} variant={variant} orientation="horizontal"
            titleClassName={titleClassName} subtitleClassName={subtitleClassName} optionalClassName={optionalClassName} />
        )}
      </div>
      <div className="flex items-center flex-1 self-start pt-3.5">
        <Connector fromIndex={index} orientation="horizontal" size={size} variant={variant} connectorClassName={connectorClassName} />
      </div>
    </div>
  );
}

// ─── Single Step (Vertical) ───────────────────────────────────────────────────

interface VerticalStepProps {
  step: StepItem;
  index: number;
  isLast: boolean;
  size: StepperSize;
  variant: StepperVariant;
  stepClassName?: string;
  indicatorClassName?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  optionalClassName?: string;
  connectorClassName?: string;
  contentPanelClassName?: string;
}

function VerticalStep({
  step, index, isLast, size, variant,
  stepClassName = "", indicatorClassName = "", titleClassName = "",
  subtitleClassName = "", optionalClassName = "", connectorClassName = "",
  contentPanelClassName = "",
}: VerticalStepProps) {
  const { goTo, clickable, linear, state, getStepStatus } = useStepperContext();
  const s = sizeConfig[size];
  const v = variantConfig[variant];
  const status = getStepStatus(index);
  const isActive = status === "active";
  const isCompleted = status === "completed" || status === "skipped";
  const canClick = clickable && !step.disabled && !linear
    ? true
    : clickable && !step.disabled && (isCompleted || state.visitedSteps.has(index));

  const handleClick = useCallback(() => {
    if (canClick) goTo(index);
  }, [canClick, goTo, index]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleClick(); }
  }, [handleClick]);

  return (
    <div className={`flex gap-3 ${stepClassName}`}>
      {/* Left column: indicator + connector */}
      <div className="flex flex-col items-center shrink-0">
        <div
          role="tab"
          aria-selected={isActive}
          aria-disabled={step.disabled}
          tabIndex={canClick ? 0 : -1}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          className={`${canClick ? "cursor-pointer" : "cursor-default"} ${step.disabled ? "pointer-events-none" : ""}`}
        >
          <StepIndicator step={step} index={index} size={size} variant={variant} indicatorClassName={indicatorClassName} />
        </div>
        {!isLast && (
          <div className={`flex-1 ${s.connectorV} my-1 ${v.connectorBase} overflow-hidden relative ${connectorClassName}`}>
            <motion.div
              className={`absolute inset-0 origin-top ${isCompleted ? v.connectorCompleted : v.connectorBase}`}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: isCompleted ? 1 : 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
            />
          </div>
        )}
      </div>

      {/* Right column: label + content */}
      <div className={`flex-1 min-w-0 ${isLast ? "pb-0" : "pb-4"}`}>
        <div
          role="tab"
          aria-selected={isActive}
          aria-disabled={step.disabled}
          tabIndex={canClick ? 0 : -1}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          className={`${canClick ? "cursor-pointer" : "cursor-default"} ${step.disabled ? "pointer-events-none" : ""}`}
        >
          <StepLabel step={step} index={index} size={size} variant={variant} orientation="vertical"
            titleClassName={titleClassName} subtitleClassName={subtitleClassName} optionalClassName={optionalClassName} />
        </div>

        {/* Step content (description or custom content) */}
        <AnimatePresence initial={false}>
          {isActive && (step.content || step.description) && (
            <motion.div
              key="content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className={`${s.contentGapV} ${v.contentPanel} ${contentPanelClassName}`}>
                {step.content ?? (
                  <p className={`${s.descriptionText} text-gray-500 dark:text-gray-400 leading-relaxed`}>
                    {step.description}
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Stepper Inner ────────────────────────────────────────────────────────────

export interface StepperProps extends Omit<StepperProviderProps, "children"> {
  /** Bare rendering without the wrapper card */
  bare?: boolean;
  /** Extra class on the outermost wrapper div */
  className?: string;
  /** Override wrapper card classes */
  wrapperClassName?: string;
  /** Override the step list container */
  stepsClassName?: string;
  /** Override each step row/column wrapper */
  stepClassName?: string;
  /** Override the indicator circle */
  indicatorClassName?: string;
  /** Override title text */
  titleClassName?: string;
  /** Override subtitle text */
  subtitleClassName?: string;
  /** Override optional badge */
  optionalClassName?: string;
  /** Override the connector line */
  connectorClassName?: string;
  /** Override the content panel in vertical mode */
  contentPanelClassName?: string;
  /** Render navigation controls (next/back buttons) */
  showNavigation?: boolean;
  /** Custom navigation renderer — receives context helpers */
  renderNavigation?: (ctx: {
    activeStep: number;
    totalSteps: number;
    isFirst: boolean;
    isLast: boolean;
    isCompleted: boolean;
    next: () => void;
    prev: () => void;
    reset: () => void;
  }) => React.ReactNode;
  /** Custom step indicator renderer */
  renderIndicator?: (step: StepItem, index: number, status: StepStatus) => React.ReactNode;
}

function StepperInner({
  bare = false,
  className = "",
  wrapperClassName = "",
  stepsClassName = "",
  stepClassName = "",
  indicatorClassName = "",
  titleClassName = "",
  subtitleClassName = "",
  optionalClassName = "",
  connectorClassName = "",
  contentPanelClassName = "",
  showNavigation = false,
  renderNavigation,
}: Omit<StepperProps, keyof Omit<StepperProviderProps, "children">>) {
  const {
    steps, totalSteps, state, isFirst, isLast, isCompleted,
    next, prev, reset,
    size, variant, orientation, labelPlacement,
    getStepStatus,
  } = useStepperContext();

  const v = variantConfig[variant];

  const navCtx = {
    activeStep: state.activeStep,
    totalSteps,
    isFirst,
    isLast,
    isCompleted,
    next,
    prev,
    reset,
  };

  const stepsEl =
    orientation === "horizontal" ? (
      <div
        className={`flex items-start w-full ${stepsClassName}`}
        role="tablist"
        aria-orientation="horizontal"
      >
        {steps.map((step, index) => (
          <HorizontalStep
            key={step.id}
            step={step}
            index={index}
            isLast={index === totalSteps - 1}
            size={size}
            variant={variant}
            labelPlacement={labelPlacement}
            stepClassName={stepClassName}
            indicatorClassName={indicatorClassName}
            titleClassName={titleClassName}
            subtitleClassName={subtitleClassName}
            optionalClassName={optionalClassName}
            connectorClassName={connectorClassName}
          />
        ))}
      </div>
    ) : (
      <div
        className={`flex flex-col w-full ${stepsClassName}`}
        role="tablist"
        aria-orientation="vertical"
      >
        {steps.map((step, index) => (
          <VerticalStep
            key={step.id}
            step={step}
            index={index}
            isLast={index === totalSteps - 1}
            size={size}
            variant={variant}
            stepClassName={stepClassName}
            indicatorClassName={indicatorClassName}
            titleClassName={titleClassName}
            subtitleClassName={subtitleClassName}
            optionalClassName={optionalClassName}
            connectorClassName={connectorClassName}
            contentPanelClassName={contentPanelClassName}
          />
        ))}
      </div>
    );

  const navEl = renderNavigation
    ? renderNavigation(navCtx)
    : showNavigation
      ? <DefaultNavigation size={size} variant={variant} navCtx={navCtx} />
      : null;

  const inner = (
    <div className={`flex flex-col gap-6 w-full ${className}`}>
      {stepsEl}
      {navEl && <div className="w-full">{navEl}</div>}
    </div>
  );

  if (bare) return inner;

  return (
    <div className={`w-full ${v.wrapper} ${wrapperClassName}`}>
      {inner}
    </div>
  );
}

// ─── Default Navigation ───────────────────────────────────────────────────────

const navSizeConfig = {
  sm: { btn: "px-3 py-1.5 text-xs rounded-md gap-1", icon: 12 },
  md: { btn: "px-4 py-2 text-sm rounded-lg gap-1.5", icon: 14 },
  lg: { btn: "px-5 py-2.5 text-sm rounded-lg gap-2", icon: 15 },
  xl: { btn: "px-6 py-3 text-base rounded-xl gap-2", icon: 16 },
};

function DefaultNavigation({
  size,
  variant,
  navCtx,
}: {
  size: StepperSize;
  variant: StepperVariant;
  navCtx: ReturnType<typeof useStepperContext>["state"] & {
    isFirst: boolean; isLast: boolean; isCompleted: boolean;
    next: () => void; prev: () => void; reset: () => void;
    activeStep: number; totalSteps: number;
  };
}) {
  const n = navSizeConfig[size];

  const baseBtn = `inline-flex items-center font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 dark:focus-visible:ring-white focus-visible:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed ${n.btn}`;
  const primaryBtn = `${baseBtn} bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-100`;
  const secondaryBtn = `${baseBtn} bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800`;

  return (
    <div className="flex items-center justify-between gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
      <button type="button" onClick={navCtx.prev} disabled={navCtx.isFirst} className={secondaryBtn}>
        <ChevronRight size={n.icon} className="rotate-180" />
        Back
      </button>
      <span className="text-sm text-gray-400 dark:text-gray-500 tabular-nums">
        {navCtx.activeStep + 1} / {navCtx.totalSteps}
      </span>
      {navCtx.isCompleted ? (
        <button type="button" onClick={navCtx.reset} className={secondaryBtn}>
          Reset
        </button>
      ) : navCtx.isLast ? (
        <button type="button" onClick={navCtx.next} className={primaryBtn}>
          Finish
          <Check size={n.icon} strokeWidth={2.5} />
        </button>
      ) : (
        <button type="button" onClick={navCtx.next} className={primaryBtn}>
          Next
          <ChevronRight size={n.icon} />
        </button>
      )}
    </div>
  );
}

// ─── Public Stepper ───────────────────────────────────────────────────────────

/**
 * Stepper — a fully-featured, accessible, responsive step indicator component.
 *
 * @example
 * ```tsx
 * <Stepper
 *   steps={[
 *     { id: "1", title: "Account", subtitle: "Your details" },
 *     { id: "2", title: "Profile", optional: true },
 *     { id: "3", title: "Review" },
 *   ]}
 *   orientation="horizontal"
 *   variant="default"
 *   size="md"
 *   showNavigation
 * />
 * ```
 */
export function Stepper({
  steps,
  defaultStep,
  activeStep,
  size = "md",
  variant = "default",
  orientation = "horizontal",
  labelPlacement = "bottom",
  linear = false,
  clickable = true,
  onStepChange,
  onComplete,
  ...rest
}: StepperProps) {
  return (
    <StepperProvider
      steps={steps}
      defaultStep={defaultStep}
      activeStep={activeStep}
      size={size}
      variant={variant}
      orientation={orientation}
      labelPlacement={labelPlacement}
      linear={linear}
      clickable={clickable}
      onStepChange={onStepChange}
      onComplete={onComplete}
    >
      <StepperInner size={size} variant={variant} orientation={orientation} {...rest} />
    </StepperProvider>
  );
}

// ─── Exports ──────────────────────────────────────────────────────────────────

export { StepperProvider, useStepperContext };
export type { StepItem, StepperSize, StepperVariant, StepperOrientation, StepperLabelPlacement, StepStatus };