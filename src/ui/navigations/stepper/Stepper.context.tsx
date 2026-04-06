import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useRef,
} from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type StepperSize = "sm" | "md" | "lg" | "xl";
export type StepperVariant = "default" | "filled" | "ghost" | "outline";
export type StepperOrientation = "horizontal" | "vertical";
export type StepperLabelPlacement = "right" | "bottom";
export type StepStatus = "pending" | "active" | "completed" | "error" | "warning" | "skipped";

export interface StepItem {
  /** Unique identifier */
  id: string;
  /** Step title */
  title: React.ReactNode;
  /** Optional subtitle shown below the title */
  subtitle?: React.ReactNode;
  /** Optional description shown in vertical layout or expanded panel */
  description?: React.ReactNode;
  /** Override the step icon (replaces number/check) */
  icon?: React.ReactNode;
  /** Override icon for completed state */
  completedIcon?: React.ReactNode;
  /** Override icon for error state */
  errorIcon?: React.ReactNode;
  /** Override icon for warning state */
  warningIcon?: React.ReactNode;
  /** Show an "Optional" badge */
  optional?: boolean;
  /** Disable this individual step (cannot be clicked) */
  disabled?: boolean;
  /** Force a specific status regardless of active index */
  status?: StepStatus;
  /** Custom content rendered below this step in vertical mode */
  content?: React.ReactNode;
}

export interface StepperState {
  activeStep: number;
  completedSteps: Set<number>;
  errorSteps: Set<number>;
  warningSteps: Set<number>;
  skippedSteps: Set<number>;
  visitedSteps: Set<number>;
}

type StepperAction =
  | { type: "GO_TO"; payload: number }
  | { type: "NEXT" }
  | { type: "PREV" }
  | { type: "COMPLETE_STEP"; payload: number }
  | { type: "UNCOMPLETE_STEP"; payload: number }
  | { type: "SET_ERROR"; payload: number }
  | { type: "CLEAR_ERROR"; payload: number }
  | { type: "SET_WARNING"; payload: number }
  | { type: "CLEAR_WARNING"; payload: number }
  | { type: "SKIP_STEP"; payload: number }
  | { type: "RESET" };

function stepperReducer(state: StepperState, action: StepperAction, totalSteps: number): StepperState {
  switch (action.type) {
    case "GO_TO": {
      const next = Math.max(0, Math.min(action.payload, totalSteps - 1));
      const visited = new Set(state.visitedSteps);
      visited.add(next);
      return { ...state, activeStep: next, visitedSteps: visited };
    }
    case "NEXT": {
      const next = Math.min(state.activeStep + 1, totalSteps - 1);
      const completed = new Set(state.completedSteps);
      completed.add(state.activeStep);
      const visited = new Set(state.visitedSteps);
      visited.add(next);
      return { ...state, activeStep: next, completedSteps: completed, visitedSteps: visited };
    }
    case "PREV": {
      const prev = Math.max(state.activeStep - 1, 0);
      const visited = new Set(state.visitedSteps);
      visited.add(prev);
      return { ...state, activeStep: prev, visitedSteps: visited };
    }
    case "COMPLETE_STEP": {
      const completed = new Set(state.completedSteps);
      completed.add(action.payload);
      return { ...state, completedSteps: completed };
    }
    case "UNCOMPLETE_STEP": {
      const completed = new Set(state.completedSteps);
      completed.delete(action.payload);
      return { ...state, completedSteps: completed };
    }
    case "SET_ERROR": {
      const errors = new Set(state.errorSteps);
      errors.add(action.payload);
      return { ...state, errorSteps: errors };
    }
    case "CLEAR_ERROR": {
      const errors = new Set(state.errorSteps);
      errors.delete(action.payload);
      return { ...state, errorSteps: errors };
    }
    case "SET_WARNING": {
      const warnings = new Set(state.warningSteps);
      warnings.add(action.payload);
      return { ...state, warningSteps: warnings };
    }
    case "CLEAR_WARNING": {
      const warnings = new Set(state.warningSteps);
      warnings.delete(action.payload);
      return { ...state, warningSteps: warnings };
    }
    case "SKIP_STEP": {
      const skipped = new Set(state.skippedSteps);
      skipped.add(action.payload);
      const visited = new Set(state.visitedSteps);
      const next = Math.min(action.payload + 1, totalSteps - 1);
      visited.add(next);
      return { ...state, skippedSteps: skipped, activeStep: next, visitedSteps: visited };
    }
    case "RESET":
      return {
        activeStep: 0,
        completedSteps: new Set(),
        errorSteps: new Set(),
        warningSteps: new Set(),
        skippedSteps: new Set(),
        visitedSteps: new Set([0]),
      };
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

export interface StepperContextValue {
  state: StepperState;
  steps: StepItem[];
  totalSteps: number;
  isFirst: boolean;
  isLast: boolean;
  isCompleted: boolean;
  getStepStatus: (index: number) => StepStatus;
  goTo: (index: number) => void;
  next: () => void;
  prev: () => void;
  completeStep: (index: number) => void;
  uncompleteStep: (index: number) => void;
  setError: (index: number) => void;
  clearError: (index: number) => void;
  setWarning: (index: number) => void;
  clearWarning: (index: number) => void;
  skipStep: (index: number) => void;
  reset: () => void;
  // Config
  size: StepperSize;
  variant: StepperVariant;
  orientation: StepperOrientation;
  labelPlacement: StepperLabelPlacement;
  linear: boolean;
  clickable: boolean;
}

const StepperContext = createContext<StepperContextValue | null>(null);

export interface StepperProviderProps {
  children: React.ReactNode;
  steps: StepItem[];
  defaultStep?: number;
  activeStep?: number; // controlled
  size?: StepperSize;
  variant?: StepperVariant;
  orientation?: StepperOrientation;
  labelPlacement?: StepperLabelPlacement;
  /** If true, steps can only be navigated sequentially */
  linear?: boolean;
  /** If true, completed/visited steps are clickable */
  clickable?: boolean;
  onStepChange?: (index: number, step: StepItem) => void;
  onComplete?: () => void;
}

export function StepperProvider({
  children,
  steps,
  defaultStep = 0,
  activeStep: controlledActive,
  size = "md",
  variant = "default",
  orientation = "horizontal",
  labelPlacement = "right",
  linear = false,
  clickable = true,
  onStepChange,
  onComplete,
}: StepperProviderProps) {
  const totalSteps = steps.length;

  const [state, dispatch] = useReducer(
    (s: StepperState, a: StepperAction) => stepperReducer(s, a, totalSteps),
    {
      activeStep: controlledActive ?? defaultStep,
      completedSteps: new Set<number>(),
      errorSteps: new Set<number>(),
      warningSteps: new Set<number>(),
      skippedSteps: new Set<number>(),
      visitedSteps: new Set<number>([controlledActive ?? defaultStep]),
    },
  );

  // Controlled mode sync
  const activeStep = controlledActive !== undefined ? controlledActive : state.activeStep;

  const getStepStatus = useCallback(
    (index: number): StepStatus => {
      const step = steps[index];
      // Explicit per-step override wins
      if (step?.status) return step.status;
      if (state.errorSteps.has(index)) return "error";
      if (state.warningSteps.has(index)) return "warning";
      if (state.skippedSteps.has(index)) return "skipped";
      if (state.completedSteps.has(index)) return "completed";
      if (index === activeStep) return "active";
      return "pending";
    },
    [steps, state, activeStep],
  );

  const goTo = useCallback(
    (index: number) => {
      if (steps[index]?.disabled) return;
      dispatch({ type: "GO_TO", payload: index });
      onStepChange?.(index, steps[index]);
    },
    [steps, onStepChange],
  );

  const next = useCallback(() => {
    if (activeStep >= totalSteps - 1) {
      onComplete?.();
      return;
    }
    dispatch({ type: "NEXT" });
    const nextIdx = Math.min(activeStep + 1, totalSteps - 1);
    onStepChange?.(nextIdx, steps[nextIdx]);
  }, [activeStep, totalSteps, steps, onStepChange, onComplete]);

  const prev = useCallback(() => {
    dispatch({ type: "PREV" });
    const prevIdx = Math.max(activeStep - 1, 0);
    onStepChange?.(prevIdx, steps[prevIdx]);
  }, [activeStep, steps, onStepChange]);

  const completeStep = useCallback((index: number) => {
    dispatch({ type: "COMPLETE_STEP", payload: index });
  }, []);

  const uncompleteStep = useCallback((index: number) => {
    dispatch({ type: "UNCOMPLETE_STEP", payload: index });
  }, []);

  const setError = useCallback((index: number) => {
    dispatch({ type: "SET_ERROR", payload: index });
  }, []);

  const clearError = useCallback((index: number) => {
    dispatch({ type: "CLEAR_ERROR", payload: index });
  }, []);

  const setWarning = useCallback((index: number) => {
    dispatch({ type: "SET_WARNING", payload: index });
  }, []);

  const clearWarning = useCallback((index: number) => {
    dispatch({ type: "CLEAR_WARNING", payload: index });
  }, []);

  const skipStep = useCallback(
    (index: number) => {
      dispatch({ type: "SKIP_STEP", payload: index });
      const nextIdx = Math.min(index + 1, totalSteps - 1);
      onStepChange?.(nextIdx, steps[nextIdx]);
    },
    [totalSteps, steps, onStepChange],
  );

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
    onStepChange?.(0, steps[0]);
  }, [steps, onStepChange]);

  const isFirst = activeStep === 0;
  const isLast = activeStep === totalSteps - 1;
  const isCompleted = totalSteps > 0 && [...Array(totalSteps).keys()].every(
    (i) => state.completedSteps.has(i) || state.skippedSteps.has(i),
  );

  return (
    <StepperContext.Provider
      value={{
        state: { ...state, activeStep },
        steps,
        totalSteps,
        isFirst,
        isLast,
        isCompleted,
        getStepStatus,
        goTo,
        next,
        prev,
        completeStep,
        uncompleteStep,
        setError,
        clearError,
        setWarning,
        clearWarning,
        skipStep,
        reset,
        size,
        variant,
        orientation,
        labelPlacement,
        linear,
        clickable,
      }}
    >
      {children}
    </StepperContext.Provider>
  );
}

export function useStepperContext(): StepperContextValue {
  const ctx = useContext(StepperContext);
  if (!ctx) throw new Error("useStepperContext must be used within StepperProvider");
  return ctx;
}