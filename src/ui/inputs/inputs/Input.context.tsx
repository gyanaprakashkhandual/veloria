import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useRef,
} from "react";

export type InputSize = "sm" | "md" | "lg" | "xl";
export type InputVariant = "default" | "filled" | "ghost";
export type InputStatus = "default" | "error" | "warning" | "success";
export type InputType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "tel"
  | "url"
  | "search"
  | "date"
  | "time"
  | "datetime-local";

export interface InputState {
  value: string;
  focused: boolean;
  touched: boolean;
  dirty: boolean;
  disabled: boolean;
  readOnly: boolean;
  status: InputStatus;
  size: InputSize;
  variant: InputVariant;
  type: InputType;
  showPassword: boolean;
  characterCount: number;
  maxLength: number | null;
}

type InputAction =
  | { type: "SET_VALUE"; payload: string }
  | { type: "SET_FOCUSED"; payload: boolean }
  | { type: "SET_TOUCHED" }
  | { type: "SET_STATUS"; payload: InputStatus }
  | { type: "TOGGLE_PASSWORD" }
  | { type: "CLEAR" }
  | { type: "SET_DISABLED"; payload: boolean }
  | { type: "SET_READONLY"; payload: boolean };

function inputReducer(state: InputState, action: InputAction): InputState {
  switch (action.type) {
    case "SET_VALUE":
      return {
        ...state,
        value: action.payload,
        dirty: true,
        characterCount: action.payload.length,
      };
    case "SET_FOCUSED":
      return { ...state, focused: action.payload };
    case "SET_TOUCHED":
      return { ...state, touched: true };
    case "SET_STATUS":
      return { ...state, status: action.payload };
    case "TOGGLE_PASSWORD":
      return { ...state, showPassword: !state.showPassword };
    case "CLEAR":
      return { ...state, value: "", dirty: false, touched: false, characterCount: 0 };
    case "SET_DISABLED":
      return { ...state, disabled: action.payload };
    case "SET_READONLY":
      return { ...state, readOnly: action.payload };
    default:
      return state;
  }
}

export interface InputContextValue {
  state: InputState;
  dispatch: React.Dispatch<InputAction>;
  setValue: (value: string) => void;
  setFocused: (focused: boolean) => void;
  setTouched: () => void;
  setStatus: (status: InputStatus) => void;
  togglePassword: () => void;
  clear: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onClear?: () => void;
  onEnter?: (value: string) => void;
}

const InputContext = createContext<InputContextValue | null>(null);

export interface InputProviderProps {
  children: React.ReactNode;
  defaultValue?: string;
  size?: InputSize;
  variant?: InputVariant;
  status?: InputStatus;
  type?: InputType;
  disabled?: boolean;
  readOnly?: boolean;
  maxLength?: number | null;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onClear?: () => void;
  onEnter?: (value: string) => void;
}

export function InputProvider({
  children,
  defaultValue = "",
  size = "md",
  variant = "default",
  status = "default",
  type = "text",
  disabled = false,
  readOnly = false,
  maxLength = null,
  onChange,
  onFocus,
  onBlur,
  onClear,
  onEnter,
}: InputProviderProps) {
  const [state, dispatch] = useReducer(inputReducer, {
    value: defaultValue,
    focused: false,
    touched: false,
    dirty: false,
    disabled,
    readOnly,
    status,
    size,
    variant,
    type,
    showPassword: false,
    characterCount: defaultValue.length,
    maxLength,
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const setValue = useCallback(
    (value: string) => {
      dispatch({ type: "SET_VALUE", payload: value });
      onChange?.(value);
    },
    [onChange],
  );

  const setFocused = useCallback(
    (focused: boolean) => {
      dispatch({ type: "SET_FOCUSED", payload: focused });
      if (focused) onFocus?.();
      else onBlur?.();
    },
    [onFocus, onBlur],
  );

  const setTouched = useCallback(() => {
    dispatch({ type: "SET_TOUCHED" });
  }, []);

  const setStatus = useCallback((s: InputStatus) => {
    dispatch({ type: "SET_STATUS", payload: s });
  }, []);

  const togglePassword = useCallback(() => {
    dispatch({ type: "TOGGLE_PASSWORD" });
  }, []);

  const clear = useCallback(() => {
    dispatch({ type: "CLEAR" });
    onChange?.("");
    onClear?.();
    inputRef.current?.focus();
  }, [onChange, onClear]);

  return (
    <InputContext.Provider
      value={{
        state,
        dispatch,
        setValue,
        setFocused,
        setTouched,
        setStatus,
        togglePassword,
        clear,
        inputRef,
        onChange,
        onFocus,
        onBlur,
        onClear,
        onEnter,
      }}
    >
      {children}
    </InputContext.Provider>
  );
}

export function useInputContext(): InputContextValue {
  const ctx = useContext(InputContext);
  if (!ctx) throw new Error("useInputContext must be used within InputProvider");
  return ctx;
}