import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useRef,
} from "react";

export type SnackbarSize = "xs" | "sm" | "md" | "lg";
export type SnackbarVariant = "default" | "filled" | "ghost" | "outline";
export type SnackbarSeverity = "info" | "success" | "warning" | "danger" | "neutral";
export type SnackbarPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export interface SnackbarAction {
  label: string;
  onClick: () => void;
  className?: string;
}

export interface SnackbarItem {
  id: string;
  message: React.ReactNode;
  description?: React.ReactNode;
  severity?: SnackbarSeverity;
  variant?: SnackbarVariant;
  size?: SnackbarSize;
  duration?: number;
  persistent?: boolean;
  closable?: boolean;
  icon?: React.ReactNode;
  action?: SnackbarAction;
  secondaryAction?: SnackbarAction;
  onClose?: () => void;
  className?: string;
  position?: SnackbarPosition;
}

export interface SnackbarState {
  items: SnackbarItem[];
  defaultPosition: SnackbarPosition;
  defaultDuration: number;
  defaultSize: SnackbarSize;
  defaultVariant: SnackbarVariant;
  maxVisible: number;
  pauseOnHover: boolean;
}

type SnackbarAction_ =
  | { type: "ADD"; payload: SnackbarItem }
  | { type: "REMOVE"; payload: string }
  | { type: "REMOVE_ALL" }
  | { type: "UPDATE"; payload: Partial<SnackbarItem> & { id: string } };

function snackbarReducer(
  state: SnackbarState,
  action: SnackbarAction_,
): SnackbarState {
  switch (action.type) {
    case "ADD": {
      const exists = state.items.find((i) => i.id === action.payload.id);
      if (exists) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.payload.id ? { ...i, ...action.payload } : i,
          ),
        };
      }
      const next = [...state.items, action.payload];
      return {
        ...state,
        items:
          state.maxVisible > 0 && next.length > state.maxVisible
            ? next.slice(next.length - state.maxVisible)
            : next,
      };
    }
    case "REMOVE":
      return {
        ...state,
        items: state.items.filter((i) => i.id !== action.payload),
      };
    case "REMOVE_ALL":
      return { ...state, items: [] };
    case "UPDATE":
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload.id ? { ...i, ...action.payload } : i,
        ),
      };
    default:
      return state;
  }
}

let _idCounter = 0;
function generateId(): string {
  return `snackbar-${++_idCounter}-${Date.now()}`;
}

export interface SnackbarContextValue {
  state: SnackbarState;
  dispatch: React.Dispatch<SnackbarAction_>;
  show: (item: Omit<SnackbarItem, "id"> & { id?: string }) => string;
  close: (id: string) => void;
  closeAll: () => void;
  update: (id: string, item: Partial<Omit<SnackbarItem, "id">>) => void;
  info: (message: React.ReactNode, options?: Partial<Omit<SnackbarItem, "id" | "message" | "severity">>) => string;
  success: (message: React.ReactNode, options?: Partial<Omit<SnackbarItem, "id" | "message" | "severity">>) => string;
  warning: (message: React.ReactNode, options?: Partial<Omit<SnackbarItem, "id" | "message" | "severity">>) => string;
  danger: (message: React.ReactNode, options?: Partial<Omit<SnackbarItem, "id" | "message" | "severity">>) => string;
  neutral: (message: React.ReactNode, options?: Partial<Omit<SnackbarItem, "id" | "message" | "severity">>) => string;
  promise: <T>(
    promiseFn: Promise<T>,
    options: {
      loading: React.ReactNode;
      success: React.ReactNode | ((data: T) => React.ReactNode);
      error: React.ReactNode | ((err: unknown) => React.ReactNode);
      id?: string;
    },
  ) => Promise<T>;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

const SnackbarContext = createContext<SnackbarContextValue | null>(null);

export interface SnackbarProviderProps {
  children: React.ReactNode;
  defaultPosition?: SnackbarPosition;
  defaultDuration?: number;
  defaultSize?: SnackbarSize;
  defaultVariant?: SnackbarVariant;
  maxVisible?: number;
  pauseOnHover?: boolean;
}

export function SnackbarProvider({
  children,
  defaultPosition = "bottom-right",
  defaultDuration = 4000,
  defaultSize = "md",
  defaultVariant = "default",
  maxVisible = 5,
  pauseOnHover = true,
}: SnackbarProviderProps) {
  const [state, dispatch] = useReducer(snackbarReducer, {
    items: [],
    defaultPosition,
    defaultDuration,
    defaultSize,
    defaultVariant,
    maxVisible,
    pauseOnHover,
  });

  const containerRef = useRef<HTMLDivElement>(null);

  const show = useCallback(
    (item: Omit<SnackbarItem, "id"> & { id?: string }): string => {
      const id = item.id ?? generateId();
      dispatch({ type: "ADD", payload: { ...item, id } });
      return id;
    },
    [],
  );

  const close = useCallback((id: string) => {
    dispatch({ type: "REMOVE", payload: id });
  }, []);

  const closeAll = useCallback(() => {
    dispatch({ type: "REMOVE_ALL" });
  }, []);

  const update = useCallback(
    (id: string, item: Partial<Omit<SnackbarItem, "id">>) => {
      dispatch({ type: "UPDATE", payload: { ...item, id } });
    },
    [],
  );

  const showWithSeverity = useCallback(
    (
      severity: SnackbarSeverity,
      message: React.ReactNode,
      options?: Partial<Omit<SnackbarItem, "id" | "message" | "severity">>,
    ): string => {
      return show({ message, severity, ...options });
    },
    [show],
  );

  const info = useCallback(
    (message: React.ReactNode, options?: Partial<Omit<SnackbarItem, "id" | "message" | "severity">>) =>
      showWithSeverity("info", message, options),
    [showWithSeverity],
  );

  const success = useCallback(
    (message: React.ReactNode, options?: Partial<Omit<SnackbarItem, "id" | "message" | "severity">>) =>
      showWithSeverity("success", message, options),
    [showWithSeverity],
  );

  const warning = useCallback(
    (message: React.ReactNode, options?: Partial<Omit<SnackbarItem, "id" | "message" | "severity">>) =>
      showWithSeverity("warning", message, options),
    [showWithSeverity],
  );

  const danger = useCallback(
    (message: React.ReactNode, options?: Partial<Omit<SnackbarItem, "id" | "message" | "severity">>) =>
      showWithSeverity("danger", message, options),
    [showWithSeverity],
  );

  const neutral = useCallback(
    (message: React.ReactNode, options?: Partial<Omit<SnackbarItem, "id" | "message" | "severity">>) =>
      showWithSeverity("neutral", message, options),
    [showWithSeverity],
  );

  const promise = useCallback(
    async <T,>(
      promiseFn: Promise<T>,
      options: {
        loading: React.ReactNode;
        success: React.ReactNode | ((data: T) => React.ReactNode);
        error: React.ReactNode | ((err: unknown) => React.ReactNode);
        id?: string;
      },
    ): Promise<T> => {
      const id = options.id ?? generateId();
      show({
        id,
        message: options.loading,
        severity: "neutral",
        persistent: true,
        closable: false,
      });
      try {
        const data = await promiseFn;
        const msg =
          typeof options.success === "function"
            ? options.success(data)
            : options.success;
        update(id, {
          message: msg,
          severity: "success",
          persistent: false,
          closable: true,
        });
        return data;
      } catch (err) {
        const msg =
          typeof options.error === "function"
            ? options.error(err)
            : options.error;
        update(id, {
          message: msg,
          severity: "danger",
          persistent: false,
          closable: true,
        });
        throw err;
      }
    },
    [show, update],
  );

  return (
    <SnackbarContext.Provider
      value={{
        state,
        dispatch,
        show,
        close,
        closeAll,
        update,
        info,
        success,
        warning,
        danger,
        neutral,
        promise,
        containerRef,
      }}
    >
      {children}
    </SnackbarContext.Provider>
  );
}

export function useSnackbar(): SnackbarContextValue {
  const ctx = useContext(SnackbarContext);
  if (!ctx)
    throw new Error("useSnackbar must be used within SnackbarProvider");
  return ctx;
}