/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useRef,
} from "react";

export type PickerMode = "date" | "time" | "datetime";
export type PickerSize = "sm" | "md" | "lg" | "xl";
export type DropdownPosition =
  | "bottom-left"
  | "bottom-right"
  | "top-left"
  | "top-right";

export interface DateTimeValue {
  date: string;
  time: string;
}

export interface PickerState {
  dateValue: string;
  timeValue: string;
  openPicker: "date" | "time" | null;
  viewYear: number;
  viewMonth: number;
  isDisabled: boolean;
  isReadOnly: boolean;
  mode: PickerMode;
  size: PickerSize;
  minDate: string;
  maxDate: string;
  disabledDates: string[];
  disabledDaysOfWeek: number[];
  dropdownPosition: DropdownPosition | "auto";
}

type PickerAction =
  | { type: "SET_DATE"; payload: string }
  | { type: "SET_TIME"; payload: string }
  | { type: "SET_OPEN_PICKER"; payload: "date" | "time" | null }
  | { type: "SET_VIEW_YEAR"; payload: number }
  | { type: "SET_VIEW_MONTH"; payload: number }
  | { type: "PREV_MONTH" }
  | { type: "NEXT_MONTH" }
  | { type: "CLEAR" }
  | { type: "CLEAR_DATE" }
  | { type: "CLEAR_TIME" }
  | { type: "SET_DISABLED"; payload: boolean }
  | { type: "SET_READONLY"; payload: boolean };

function pickerReducer(state: PickerState, action: PickerAction): PickerState {
  switch (action.type) {
    case "SET_DATE":
      return { ...state, dateValue: action.payload };
    case "SET_TIME":
      return { ...state, timeValue: action.payload };
    case "SET_OPEN_PICKER":
      return { ...state, openPicker: action.payload };
    case "SET_VIEW_YEAR":
      return { ...state, viewYear: action.payload };
    case "SET_VIEW_MONTH":
      return { ...state, viewMonth: action.payload };
    case "PREV_MONTH": {
      if (state.viewMonth === 0)
        return { ...state, viewMonth: 11, viewYear: state.viewYear - 1 };
      return { ...state, viewMonth: state.viewMonth - 1 };
    }
    case "NEXT_MONTH": {
      if (state.viewMonth === 11)
        return { ...state, viewMonth: 0, viewYear: state.viewYear + 1 };
      return { ...state, viewMonth: state.viewMonth + 1 };
    }
    case "CLEAR":
      return { ...state, dateValue: "", timeValue: "", openPicker: null };
    case "CLEAR_DATE":
      return { ...state, dateValue: "" };
    case "CLEAR_TIME":
      return { ...state, timeValue: "" };
    case "SET_DISABLED":
      return { ...state, isDisabled: action.payload };
    case "SET_READONLY":
      return { ...state, isReadOnly: action.payload };
    default:
      return state;
  }
}

export interface DateTimeContextValue {
  state: PickerState;
  dispatch: React.Dispatch<PickerAction>;
  setDate: (val: string) => void;
  setTime: (val: string) => void;
  openDatePicker: () => void;
  openTimePicker: () => void;
  closePicker: () => void;
  prevMonth: () => void;
  nextMonth: () => void;
  clear: () => void;
  clearDate: () => void;
  clearTime: () => void;
  getValue: () => DateTimeValue;
  triggerRef: React.RefObject<HTMLDivElement | null>;
  onDateChange?: (val: string) => void;
  onTimeChange?: (val: string) => void;
  onChange?: (val: DateTimeValue) => void;
}

const DateTimeContext = createContext<DateTimeContextValue | null>(null);

export interface DateTimeProviderProps {
  children: React.ReactNode;
  defaultDate?: string;
  defaultTime?: string;
  mode?: PickerMode;
  size?: PickerSize;
  minDate?: string;
  maxDate?: string;
  disabledDates?: string[];
  disabledDaysOfWeek?: number[];
  disabled?: boolean;
  readOnly?: boolean;
  dropdownPosition?: DropdownPosition | "auto";
  onDateChange?: (val: string) => void;
  onTimeChange?: (val: string) => void;
  onChange?: (val: DateTimeValue) => void;
}

export function DateTimeProvider({
  children,
  defaultDate = "",
  defaultTime = "",
  mode = "datetime",
  size = "md",
  minDate = "",
  maxDate = "",
  disabledDates = [],
  disabledDaysOfWeek = [],
  disabled = false,
  readOnly = false,
  dropdownPosition = "auto",
  onDateChange,
  onTimeChange,
  onChange,
}: DateTimeProviderProps) {
  const today = new Date();
  const parsedDefault = defaultDate ? new Date(defaultDate) : null;

  const initialState: PickerState = {
    dateValue: defaultDate,
    timeValue: defaultTime,
    openPicker: null,
    viewYear: parsedDefault?.getFullYear() ?? today.getFullYear(),
    viewMonth: parsedDefault?.getMonth() ?? today.getMonth(),
    isDisabled: disabled,
    isReadOnly: readOnly,
    mode,
    size,
    minDate,
    maxDate,
    disabledDates,
    disabledDaysOfWeek,
    dropdownPosition,
  };

  const [state, dispatch] = useReducer(pickerReducer, initialState);
  const triggerRef = useRef<HTMLDivElement>(null);

  const setDate = useCallback(
    (val: string) => {
      dispatch({ type: "SET_DATE", payload: val });
      onDateChange?.(val);
      onChange?.({ date: val, time: state.timeValue });
    },
    [onDateChange, onChange, state.timeValue],
  );

  const setTime = useCallback(
    (val: string) => {
      dispatch({ type: "SET_TIME", payload: val });
      onTimeChange?.(val);
      onChange?.({ date: state.dateValue, time: val });
    },
    [onTimeChange, onChange, state.dateValue],
  );

  const openDatePicker = useCallback(() => {
    if (state.isDisabled || state.isReadOnly) return;
    dispatch({ type: "SET_OPEN_PICKER", payload: "date" });
  }, [state.isDisabled, state.isReadOnly]);

  const openTimePicker = useCallback(() => {
    if (state.isDisabled || state.isReadOnly) return;
    dispatch({ type: "SET_OPEN_PICKER", payload: "time" });
  }, [state.isDisabled, state.isReadOnly]);

  const closePicker = useCallback(() => {
    dispatch({ type: "SET_OPEN_PICKER", payload: null });
  }, []);

  const prevMonth = useCallback(() => {
    dispatch({ type: "PREV_MONTH" });
  }, []);

  const nextMonth = useCallback(() => {
    dispatch({ type: "NEXT_MONTH" });
  }, []);

  const clear = useCallback(() => {
    dispatch({ type: "CLEAR" });
    onChange?.({ date: "", time: "" });
  }, [onChange]);

  const clearDate = useCallback(() => {
    dispatch({ type: "CLEAR_DATE" });
    onDateChange?.("");
    onChange?.({ date: "", time: state.timeValue });
  }, [onDateChange, onChange, state.timeValue]);

  const clearTime = useCallback(() => {
    dispatch({ type: "CLEAR_TIME" });
    onTimeChange?.("");
    onChange?.({ date: state.dateValue, time: "" });
  }, [onTimeChange, onChange, state.dateValue]);

  const getValue = useCallback(
    (): DateTimeValue => ({
      date: state.dateValue,
      time: state.timeValue,
    }),
    [state.dateValue, state.timeValue],
  );

  return (
    <DateTimeContext.Provider
      value={{
        state,
        dispatch,
        setDate,
        setTime,
        openDatePicker,
        openTimePicker,
        closePicker,
        prevMonth,
        nextMonth,
        clear,
        clearDate,
        clearTime,
        getValue,
        triggerRef,
        onDateChange,
        onTimeChange,
        onChange,
      }}
    >
      {children}
    </DateTimeContext.Provider>
  );
}

export function useDateTimeContext(): DateTimeContextValue {
  const ctx = useContext(DateTimeContext);
  if (!ctx)
    throw new Error("useDateTimeContext must be used within DateTimeProvider");
  return ctx;
}
