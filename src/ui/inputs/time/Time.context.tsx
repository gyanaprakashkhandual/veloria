/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useRef,
} from "react";

export type PickerMode =
  | "date"
  | "time"
  | "datetime"
  | "dateRange"
  | "timeRange"
  | "dateTimeRange"
  | "multiDate";

export type PickerSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

export type DropdownPosition =
  | "bottom-left"
  | "bottom-right"
  | "top-left"
  | "top-right";

export type PickerVariant = "popover" | "static";

export interface DateTimeValue {
  date: string;
  time: string;
}

export interface DateRangeValue {
  start: string;
  end: string;
}

export interface TimeRangeValue {
  start: string;
  end: string;
}

export interface DateTimeRangeValue {
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
}

export interface HighlightedDate {
  date: string;
  label?: string;
  color?: string;
}

export interface Preset {
  label: string;
  getValue: () => DateRangeValue | DateTimeValue | string;
}

export interface PickerState {
  dateValue: string;
  timeValue: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  multiDates: string[];
  hoverDate: string;
  rangeSelectStep: "start" | "end";
  openPicker:
    | "date"
    | "time"
    | "startDate"
    | "endDate"
    | "startTime"
    | "endTime"
    | null;
  viewYear: number;
  viewMonth: number;
  endViewYear: number;
  endViewMonth: number;
  yearGridOpen: boolean;
  monthGridOpen: boolean;
  isDisabled: boolean;
  isReadOnly: boolean;
  mode: PickerMode;
  size: PickerSize;
  variant: PickerVariant;
  minDate: string;
  maxDate: string;
  disabledDates: string[];
  disabledDaysOfWeek: number[];
  highlightedDates: HighlightedDate[];
  dropdownPosition: DropdownPosition | "auto";
  showWeekNumbers: boolean;
  showOutsideDays: boolean;
  firstDayOfWeek: number;
  timeFormat: "12h" | "24h";
  showSeconds: boolean;
  minuteStep: number;
  secondStep: number;
  clearable: boolean;
  showPresets: boolean;
  error: boolean;
  errorMessage: string;
  timezone: string;
  minRange: number;
  maxRange: number;
}

type PickerAction =
  | { type: "SET_DATE"; payload: string }
  | { type: "SET_TIME"; payload: string }
  | { type: "SET_START_DATE"; payload: string }
  | { type: "SET_END_DATE"; payload: string }
  | { type: "SET_START_TIME"; payload: string }
  | { type: "SET_END_TIME"; payload: string }
  | { type: "SET_HOVER_DATE"; payload: string }
  | { type: "SET_RANGE_STEP"; payload: "start" | "end" }
  | { type: "TOGGLE_MULTI_DATE"; payload: string }
  | { type: "SET_OPEN_PICKER"; payload: PickerState["openPicker"] }
  | { type: "SET_VIEW_YEAR"; payload: number }
  | { type: "SET_VIEW_MONTH"; payload: number }
  | { type: "SET_END_VIEW_YEAR"; payload: number }
  | { type: "SET_END_VIEW_MONTH"; payload: number }
  | { type: "PREV_MONTH" }
  | { type: "NEXT_MONTH" }
  | { type: "PREV_END_MONTH" }
  | { type: "NEXT_END_MONTH" }
  | { type: "SET_YEAR_GRID_OPEN"; payload: boolean }
  | { type: "SET_MONTH_GRID_OPEN"; payload: boolean }
  | { type: "CLEAR" }
  | { type: "CLEAR_DATE" }
  | { type: "CLEAR_TIME" }
  | { type: "CLEAR_RANGE" }
  | { type: "SET_DISABLED"; payload: boolean }
  | { type: "SET_READONLY"; payload: boolean }
  | { type: "SET_ERROR"; payload: { error: boolean; message?: string } };

function pickerReducer(state: PickerState, action: PickerAction): PickerState {
  switch (action.type) {
    case "SET_DATE":
      return { ...state, dateValue: action.payload };
    case "SET_TIME":
      return { ...state, timeValue: action.payload };
    case "SET_START_DATE":
      return { ...state, startDate: action.payload };
    case "SET_END_DATE":
      return { ...state, endDate: action.payload };
    case "SET_START_TIME":
      return { ...state, startTime: action.payload };
    case "SET_END_TIME":
      return { ...state, endTime: action.payload };
    case "SET_HOVER_DATE":
      return { ...state, hoverDate: action.payload };
    case "SET_RANGE_STEP":
      return { ...state, rangeSelectStep: action.payload };
    case "TOGGLE_MULTI_DATE": {
      const exists = state.multiDates.includes(action.payload);
      return {
        ...state,
        multiDates: exists
          ? state.multiDates.filter((d) => d !== action.payload)
          : [...state.multiDates, action.payload],
      };
    }
    case "SET_OPEN_PICKER":
      return { ...state, openPicker: action.payload };
    case "SET_VIEW_YEAR":
      return { ...state, viewYear: action.payload };
    case "SET_VIEW_MONTH":
      return { ...state, viewMonth: action.payload };
    case "SET_END_VIEW_YEAR":
      return { ...state, endViewYear: action.payload };
    case "SET_END_VIEW_MONTH":
      return { ...state, endViewMonth: action.payload };
    case "PREV_MONTH":
      if (state.viewMonth === 0)
        return { ...state, viewMonth: 11, viewYear: state.viewYear - 1 };
      return { ...state, viewMonth: state.viewMonth - 1 };
    case "NEXT_MONTH":
      if (state.viewMonth === 11)
        return { ...state, viewMonth: 0, viewYear: state.viewYear + 1 };
      return { ...state, viewMonth: state.viewMonth + 1 };
    case "PREV_END_MONTH":
      if (state.endViewMonth === 0)
        return {
          ...state,
          endViewMonth: 11,
          endViewYear: state.endViewYear - 1,
        };
      return { ...state, endViewMonth: state.endViewMonth - 1 };
    case "NEXT_END_MONTH":
      if (state.endViewMonth === 11)
        return {
          ...state,
          endViewMonth: 0,
          endViewYear: state.endViewYear + 1,
        };
      return { ...state, endViewMonth: state.endViewMonth + 1 };
    case "SET_YEAR_GRID_OPEN":
      return { ...state, yearGridOpen: action.payload };
    case "SET_MONTH_GRID_OPEN":
      return { ...state, monthGridOpen: action.payload };
    case "CLEAR":
      return {
        ...state,
        dateValue: "",
        timeValue: "",
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        multiDates: [],
        openPicker: null,
        rangeSelectStep: "start",
      };
    case "CLEAR_DATE":
      return { ...state, dateValue: "" };
    case "CLEAR_TIME":
      return { ...state, timeValue: "" };
    case "CLEAR_RANGE":
      return {
        ...state,
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        rangeSelectStep: "start",
      };
    case "SET_DISABLED":
      return { ...state, isDisabled: action.payload };
    case "SET_READONLY":
      return { ...state, isReadOnly: action.payload };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload.error,
        errorMessage: action.payload.message ?? "",
      };
    default:
      return state;
  }
}

export interface DateTimeContextValue {
  state: PickerState;
  dispatch: React.Dispatch<PickerAction>;
  setDate: (val: string) => void;
  setTime: (val: string) => void;
  setStartDate: (val: string) => void;
  setEndDate: (val: string) => void;
  setStartTime: (val: string) => void;
  setEndTime: (val: string) => void;
  toggleMultiDate: (val: string) => void;
  openDatePicker: () => void;
  openTimePicker: () => void;
  openStartDatePicker: () => void;
  openEndDatePicker: () => void;
  openStartTimePicker: () => void;
  openEndTimePicker: () => void;
  closePicker: () => void;
  prevMonth: () => void;
  nextMonth: () => void;
  prevEndMonth: () => void;
  nextEndMonth: () => void;
  clear: () => void;
  clearDate: () => void;
  clearTime: () => void;
  clearRange: () => void;
  getValue: () => DateTimeValue;
  getRangeValue: () => DateRangeValue;
  getTimeRangeValue: () => TimeRangeValue;
  getDateTimeRangeValue: () => DateTimeRangeValue;
  triggerRef: React.RefObject<HTMLDivElement | null>;
  onDateChange?: (val: string) => void;
  onTimeChange?: (val: string) => void;
  onChange?: (val: DateTimeValue) => void;
  onRangeChange?: (val: DateRangeValue) => void;
  onTimeRangeChange?: (val: TimeRangeValue) => void;
  onDateTimeRangeChange?: (val: DateTimeRangeValue) => void;
  onMultiDateChange?: (val: string[]) => void;
}

const DateTimeContext = createContext<DateTimeContextValue | null>(null);

export interface DateTimeProviderProps {
  children: React.ReactNode;
  defaultDate?: string;
  defaultTime?: string;
  defaultStartDate?: string;
  defaultEndDate?: string;
  defaultStartTime?: string;
  defaultEndTime?: string;
  defaultMultiDates?: string[];
  mode?: PickerMode;
  size?: PickerSize;
  variant?: PickerVariant;
  minDate?: string;
  maxDate?: string;
  minRange?: number;
  maxRange?: number;
  disabledDates?: string[];
  disabledDaysOfWeek?: number[];
  highlightedDates?: HighlightedDate[];
  disabled?: boolean;
  readOnly?: boolean;
  dropdownPosition?: DropdownPosition | "auto";
  showWeekNumbers?: boolean;
  showOutsideDays?: boolean;
  firstDayOfWeek?: number;
  timeFormat?: "12h" | "24h";
  showSeconds?: boolean;
  minuteStep?: number;
  secondStep?: number;
  clearable?: boolean;
  showPresets?: boolean;
  error?: boolean;
  errorMessage?: string;
  timezone?: string;
  onDateChange?: (val: string) => void;
  onTimeChange?: (val: string) => void;
  onChange?: (val: DateTimeValue) => void;
  onRangeChange?: (val: DateRangeValue) => void;
  onTimeRangeChange?: (val: TimeRangeValue) => void;
  onDateTimeRangeChange?: (val: DateTimeRangeValue) => void;
  onMultiDateChange?: (val: string[]) => void;
}

export function DateTimeProvider({
  children,
  defaultDate = "",
  defaultTime = "",
  defaultStartDate = "",
  defaultEndDate = "",
  defaultStartTime = "",
  defaultEndTime = "",
  defaultMultiDates = [],
  mode = "datetime",
  size = "md",
  variant = "popover",
  minDate = "",
  maxDate = "",
  minRange = 0,
  maxRange = 0,
  disabledDates = [],
  disabledDaysOfWeek = [],
  highlightedDates = [],
  disabled = false,
  readOnly = false,
  dropdownPosition = "auto",
  showWeekNumbers = false,
  showOutsideDays = true,
  firstDayOfWeek = 0,
  timeFormat = "12h",
  showSeconds = false,
  minuteStep = 5,
  secondStep = 5,
  clearable = true,
  showPresets = false,
  error = false,
  errorMessage = "",
  timezone = "",
  onDateChange,
  onTimeChange,
  onChange,
  onRangeChange,
  onTimeRangeChange,
  onDateTimeRangeChange,
  onMultiDateChange,
}: DateTimeProviderProps) {
  const today = new Date();
  const parsedDefault = defaultDate ? new Date(defaultDate) : null;
  const parsedStart = defaultStartDate ? new Date(defaultStartDate) : null;

  const initialState: PickerState = {
    dateValue: defaultDate,
    timeValue: defaultTime,
    startDate: defaultStartDate,
    endDate: defaultEndDate,
    startTime: defaultStartTime,
    endTime: defaultEndTime,
    multiDates: defaultMultiDates,
    hoverDate: "",
    rangeSelectStep: "start",
    openPicker: null,
    viewYear:
      parsedDefault?.getFullYear() ??
      parsedStart?.getFullYear() ??
      today.getFullYear(),
    viewMonth:
      parsedDefault?.getMonth() ?? parsedStart?.getMonth() ?? today.getMonth(),
    endViewYear: today.getFullYear(),
    endViewMonth: today.getMonth() === 11 ? 0 : today.getMonth() + 1,
    yearGridOpen: false,
    monthGridOpen: false,
    isDisabled: disabled,
    isReadOnly: readOnly,
    mode,
    size,
    variant,
    minDate,
    maxDate,
    minRange,
    maxRange,
    disabledDates,
    disabledDaysOfWeek,
    highlightedDates,
    dropdownPosition,
    showWeekNumbers,
    showOutsideDays,
    firstDayOfWeek,
    timeFormat,
    showSeconds,
    minuteStep,
    secondStep,
    clearable,
    showPresets,
    error,
    errorMessage,
    timezone,
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

  const setStartDate = useCallback(
    (val: string) => {
      dispatch({ type: "SET_START_DATE", payload: val });
      onRangeChange?.({ start: val, end: state.endDate });
      onDateTimeRangeChange?.({
        startDate: val,
        startTime: state.startTime,
        endDate: state.endDate,
        endTime: state.endTime,
      });
    },
    [
      onRangeChange,
      onDateTimeRangeChange,
      state.endDate,
      state.startTime,
      state.endTime,
    ],
  );

  const setEndDate = useCallback(
    (val: string) => {
      dispatch({ type: "SET_END_DATE", payload: val });
      onRangeChange?.({ start: state.startDate, end: val });
      onDateTimeRangeChange?.({
        startDate: state.startDate,
        startTime: state.startTime,
        endDate: val,
        endTime: state.endTime,
      });
    },
    [
      onRangeChange,
      onDateTimeRangeChange,
      state.startDate,
      state.startTime,
      state.endTime,
    ],
  );

  const setStartTime = useCallback(
    (val: string) => {
      dispatch({ type: "SET_START_TIME", payload: val });
      onTimeRangeChange?.({ start: val, end: state.endTime });
      onDateTimeRangeChange?.({
        startDate: state.startDate,
        startTime: val,
        endDate: state.endDate,
        endTime: state.endTime,
      });
    },
    [
      onTimeRangeChange,
      onDateTimeRangeChange,
      state.endTime,
      state.startDate,
      state.endDate,
    ],
  );

  const setEndTime = useCallback(
    (val: string) => {
      dispatch({ type: "SET_END_TIME", payload: val });
      onTimeRangeChange?.({ start: state.startTime, end: val });
      onDateTimeRangeChange?.({
        startDate: state.startDate,
        startTime: state.startTime,
        endDate: state.endDate,
        endTime: val,
      });
    },
    [
      onTimeRangeChange,
      onDateTimeRangeChange,
      state.startTime,
      state.startDate,
      state.endDate,
    ],
  );

  const toggleMultiDate = useCallback(
    (val: string) => {
      dispatch({ type: "TOGGLE_MULTI_DATE", payload: val });
      const updated = state.multiDates.includes(val)
        ? state.multiDates.filter((d) => d !== val)
        : [...state.multiDates, val];
      onMultiDateChange?.(updated);
    },
    [state.multiDates, onMultiDateChange],
  );

  const openDatePicker = useCallback(() => {
    if (state.isDisabled || state.isReadOnly) return;
    dispatch({ type: "SET_OPEN_PICKER", payload: "date" });
  }, [state.isDisabled, state.isReadOnly]);

  const openTimePicker = useCallback(() => {
    if (state.isDisabled || state.isReadOnly) return;
    dispatch({ type: "SET_OPEN_PICKER", payload: "time" });
  }, [state.isDisabled, state.isReadOnly]);

  const openStartDatePicker = useCallback(() => {
    if (state.isDisabled || state.isReadOnly) return;
    dispatch({ type: "SET_OPEN_PICKER", payload: "startDate" });
  }, [state.isDisabled, state.isReadOnly]);

  const openEndDatePicker = useCallback(() => {
    if (state.isDisabled || state.isReadOnly) return;
    dispatch({ type: "SET_OPEN_PICKER", payload: "endDate" });
  }, [state.isDisabled, state.isReadOnly]);

  const openStartTimePicker = useCallback(() => {
    if (state.isDisabled || state.isReadOnly) return;
    dispatch({ type: "SET_OPEN_PICKER", payload: "startTime" });
  }, [state.isDisabled, state.isReadOnly]);

  const openEndTimePicker = useCallback(() => {
    if (state.isDisabled || state.isReadOnly) return;
    dispatch({ type: "SET_OPEN_PICKER", payload: "endTime" });
  }, [state.isDisabled, state.isReadOnly]);

  const closePicker = useCallback(() => {
    dispatch({ type: "SET_OPEN_PICKER", payload: null });
    dispatch({ type: "SET_YEAR_GRID_OPEN", payload: false });
    dispatch({ type: "SET_MONTH_GRID_OPEN", payload: false });
  }, []);

  const prevMonth = useCallback(() => dispatch({ type: "PREV_MONTH" }), []);
  const nextMonth = useCallback(() => dispatch({ type: "NEXT_MONTH" }), []);
  const prevEndMonth = useCallback(
    () => dispatch({ type: "PREV_END_MONTH" }),
    [],
  );
  const nextEndMonth = useCallback(
    () => dispatch({ type: "NEXT_END_MONTH" }),
    [],
  );

  const clear = useCallback(() => {
    dispatch({ type: "CLEAR" });
    onChange?.({ date: "", time: "" });
    onRangeChange?.({ start: "", end: "" });
    onTimeRangeChange?.({ start: "", end: "" });
    onDateTimeRangeChange?.({
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
    });
    onMultiDateChange?.([]);
  }, [
    onChange,
    onRangeChange,
    onTimeRangeChange,
    onDateTimeRangeChange,
    onMultiDateChange,
  ]);

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

  const clearRange = useCallback(() => {
    dispatch({ type: "CLEAR_RANGE" });
    onRangeChange?.({ start: "", end: "" });
    onTimeRangeChange?.({ start: "", end: "" });
    onDateTimeRangeChange?.({
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
    });
  }, [onRangeChange, onTimeRangeChange, onDateTimeRangeChange]);

  const getValue = useCallback(
    (): DateTimeValue => ({ date: state.dateValue, time: state.timeValue }),
    [state.dateValue, state.timeValue],
  );

  const getRangeValue = useCallback(
    (): DateRangeValue => ({ start: state.startDate, end: state.endDate }),
    [state.startDate, state.endDate],
  );

  const getTimeRangeValue = useCallback(
    (): TimeRangeValue => ({ start: state.startTime, end: state.endTime }),
    [state.startTime, state.endTime],
  );

  const getDateTimeRangeValue = useCallback(
    (): DateTimeRangeValue => ({
      startDate: state.startDate,
      startTime: state.startTime,
      endDate: state.endDate,
      endTime: state.endTime,
    }),
    [state.startDate, state.startTime, state.endDate, state.endTime],
  );

  return (
    <DateTimeContext.Provider
      value={{
        state,
        dispatch,
        setDate,
        setTime,
        setStartDate,
        setEndDate,
        setStartTime,
        setEndTime,
        toggleMultiDate,
        openDatePicker,
        openTimePicker,
        openStartDatePicker,
        openEndDatePicker,
        openStartTimePicker,
        openEndTimePicker,
        closePicker,
        prevMonth,
        nextMonth,
        prevEndMonth,
        nextEndMonth,
        clear,
        clearDate,
        clearTime,
        clearRange,
        getValue,
        getRangeValue,
        getTimeRangeValue,
        getDateTimeRangeValue,
        triggerRef,
        onDateChange,
        onTimeChange,
        onChange,
        onRangeChange,
        onTimeRangeChange,
        onDateTimeRangeChange,
        onMultiDateChange,
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
