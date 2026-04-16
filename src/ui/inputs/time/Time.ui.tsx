import React, { useState, useEffect, useCallback, useRef, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  DateTimeProvider,
  useDateTimeContext,
  type DateTimeProviderProps,
  type PickerMode,
  type PickerSize,
  type DropdownPosition,
  type DateTimeValue,
} from "./Time.context";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS_OF_WEEK = ["Su","Mo","Tu","We","Th","Fr","Sa"];

function toDateString(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function parseDate(str: string): Date | null {
  if (!str) return null;
  const d = new Date(str + "T00:00:00");
  return isNaN(d.getTime()) ? null : d;
}

function formatDateDisplay(str: string): string {
  const d = parseDate(str);
  if (!d) return str;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatTimeDisplay(str: string): string {
  if (!str) return str;
  const [h, m] = str.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
}

const sizeConfig = {
  sm: {
    calendarWidth: "w-52",
    timeWidth: "w-44",
    triggerHeight: "h-7",
    triggerText: "text-xs",
    triggerPx: "px-2.5",
    iconSize: 11,
    labelText: "text-[10px]",
    dayText: "text-[10px]",
    headerText: "text-[11px]",
    cellText: "text-[10px]",
    gap: "gap-y-0",
    navBtn: "w-6 h-6",
  },
  md: {
    calendarWidth: "w-64",
    timeWidth: "w-56",
    triggerHeight: "h-9",
    triggerText: "text-sm",
    triggerPx: "px-3",
    iconSize: 13,
    labelText: "text-xs",
    dayText: "text-[10px]",
    headerText: "text-xs",
    cellText: "text-xs",
    gap: "gap-y-0.5",
    navBtn: "w-7 h-7",
  },
  lg: {
    calendarWidth: "w-72",
    timeWidth: "w-64",
    triggerHeight: "h-10",
    triggerText: "text-sm",
    triggerPx: "px-3.5",
    iconSize: 14,
    labelText: "text-xs",
    dayText: "text-[11px]",
    headerText: "text-sm",
    cellText: "text-xs",
    gap: "gap-y-1",
    navBtn: "w-8 h-8",
  },
  xl: {
    calendarWidth: "w-80",
    timeWidth: "w-72",
    triggerHeight: "h-11",
    triggerText: "text-base",
    triggerPx: "px-4",
    iconSize: 16,
    labelText: "text-sm",
    dayText: "text-xs",
    headerText: "text-sm",
    cellText: "text-sm",
    gap: "gap-y-1",
    navBtn: "w-9 h-9",
  },
};

function useAutoPosition(
  open: boolean,
  anchorRef: React.RefObject<HTMLDivElement | null>,
  preferredPosition: DropdownPosition | "auto",
): DropdownPosition {
  const [pos, setPos] = useState<DropdownPosition>("bottom-left");

  useLayoutEffect(() => {
    if (!open || !anchorRef.current) return;
    if (preferredPosition !== "auto") {
      setPos(preferredPosition);
      return;
    }
    const rect = anchorRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const spaceRight = window.innerWidth - rect.left;
    const vertical = spaceBelow >= 320 || spaceBelow >= spaceAbove ? "bottom" : "top";
    const horizontal = spaceRight >= 260 ? "left" : "right";
    setPos(`${vertical}-${horizontal}` as DropdownPosition);
  }, [open, anchorRef, preferredPosition]);

  return pos;
}

function positionClasses(pos: DropdownPosition): string {
  switch (pos) {
    case "bottom-left": return "top-full left-0 mt-1.5";
    case "bottom-right": return "top-full right-0 mt-1.5";
    case "top-left": return "bottom-full left-0 mb-1.5";
    case "top-right": return "bottom-full right-0 mb-1.5";
  }
}

interface CalendarPickerProps {
  size: PickerSize;
}

function CalendarPicker({ size }: CalendarPickerProps) {
  const { state, setDate, closePicker, prevMonth, nextMonth } = useDateTimeContext();
  const { dateValue, viewYear, viewMonth, minDate, maxDate, disabledDates, disabledDaysOfWeek } = state;
  const s = sizeConfig[size];
  const today = new Date();
  const selected = parseDate(dateValue);
  const min = parseDate(minDate);
  const max = parseDate(maxDate);
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  return (
    <motion.div
      initial={{ opacity: 0, y: -6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.98 }}
      transition={{ duration: 0.16, ease: "easeOut" }}
      className={`${s.calendarWidth} bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg shadow-black/10 dark:shadow-black/40 p-3 select-none`}
    >
      <div className="flex items-center justify-between mb-2 px-1">
        <button
          type="button"
          onClick={prevMonth}
          className={`${s.navBtn} flex items-center justify-center rounded-md text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors`}
        >
          <ChevronLeft size={s.iconSize - 1} />
        </button>
        <span className={`${s.headerText} font-semibold text-gray-900 dark:text-white`}>
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          className={`${s.navBtn} flex items-center justify-center rounded-md text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors`}
        >
          <ChevronRight size={s.iconSize - 1} />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {DAYS_OF_WEEK.map((d) => (
          <div key={d} className={`text-center ${s.dayText} font-semibold text-gray-400 dark:text-gray-500 py-1`}>
            {d}
          </div>
        ))}
      </div>

      <div className={`grid grid-cols-7 ${s.gap}`}>
        {cells.map((day, i) => {
          if (day === null) return <div key={`e-${i}`} />;
          const thisDate = new Date(viewYear, viewMonth, day);
          const dateStr = toDateString(thisDate);
          const isSelected = selected && toDateString(selected) === dateStr;
          const isToday = toDateString(today) === dateStr;
          const isDisabledByMin = min ? thisDate < min : false;
          const isDisabledByMax = max ? thisDate > max : false;
          const isDisabledByDate = disabledDates.includes(dateStr);
          const isDisabledByDow = disabledDaysOfWeek.includes(thisDate.getDay());
          const isDisabled = isDisabledByMin || isDisabledByMax || isDisabledByDate || isDisabledByDow;

          return (
            <button
              key={dateStr}
              type="button"
              disabled={isDisabled}
              onClick={() => { setDate(dateStr); closePicker(); }}
              className={`
                w-full aspect-square flex items-center justify-center rounded-md ${s.cellText} font-medium transition-all
                ${isDisabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}
                ${isSelected
                  ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm"
                  : isToday
                    ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-bold ring-1 ring-gray-300 dark:ring-gray-600"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }
              `}
            >
              {day}
            </button>
          );
        })}
      </div>

      {dateValue && (
        <button
          type="button"
          onClick={() => { setDate(""); }}
          className={`mt-2 w-full text-center ${s.cellText} text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors py-1`}
        >
          Clear date
        </button>
      )}
    </motion.div>
  );
}

interface TimePickerInnerProps {
  size: PickerSize;
}

function TimePickerInner({ size }: TimePickerInnerProps) {
  const { state, setTime } = useDateTimeContext();
  const { timeValue } = state;
  const s = sizeConfig[size];

  const [hour, setHourState] = useState<number>(12);
  const [minute, setMinuteState] = useState<number>(0);
  const [ampm, setAmpmState] = useState<"AM" | "PM">("AM");

  useEffect(() => {
    if (timeValue) {
      const [h, m] = timeValue.split(":").map(Number);
      setAmpmState(h >= 12 ? "PM" : "AM");
      setHourState(h % 12 || 12);
      setMinuteState(m);
    }
  }, []);

  const emit = useCallback((h: number, m: number, ap: "AM" | "PM") => {
    let h24 = h % 12;
    if (ap === "PM") h24 += 12;
    setTime(`${String(h24).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
  }, [setTime]);

  const setH = (h: number) => { setHourState(h); emit(h, minute, ampm); };
  const setM = (m: number) => { setMinuteState(m); emit(hour, m, ampm); };
  const setAP = (ap: "AM" | "PM") => { setAmpmState(ap); emit(hour, minute, ap); };

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  return (
    <motion.div
      initial={{ opacity: 0, y: -6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.98 }}
      transition={{ duration: 0.16, ease: "easeOut" }}
      className={`${s.timeWidth} bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg shadow-black/10 dark:shadow-black/40 p-3 select-none`}
    >
      <div className="flex gap-1.5 mb-3">
        {(["AM", "PM"] as const).map((ap) => (
          <button
            key={ap}
            type="button"
            onClick={() => setAP(ap)}
            className={`flex-1 py-1.5 rounded-md ${s.cellText} font-semibold transition-all ${
              ampm === ap
                ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            {ap}
          </button>
        ))}
      </div>

      <p className={`${s.dayText} font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1.5 px-0.5`}>
        Hour
      </p>
      <div className="grid grid-cols-6 gap-1 mb-3">
        {hours.map((h) => (
          <button
            key={h}
            type="button"
            onClick={() => setH(h)}
            className={`h-7 rounded-md ${s.cellText} font-medium transition-all ${
              hour === h
                ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            {h}
          </button>
        ))}
      </div>

      <p className={`${s.dayText} font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1.5 px-0.5`}>
        Minute
      </p>
      <div className="grid grid-cols-6 gap-1">
        {minutes.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setM(m)}
            className={`h-7 rounded-md ${s.cellText} font-medium transition-all ${
              minute === m
                ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            {String(m).padStart(2, "0")}
          </button>
        ))}
      </div>

      {timeValue && (
        <button
          type="button"
          onClick={() => setTime("")}
          className={`mt-2 w-full text-center ${s.cellText} text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors py-1`}
        >
          Clear time
        </button>
      )}
    </motion.div>
  );
}

interface DateFieldInnerProps {
  label?: string;
  placeholder?: string;
  size: PickerSize;
}

function DateFieldInner({ label, placeholder = "Pick a date", size }: DateFieldInnerProps) {
  const { state, openDatePicker, closePicker, setDate } = useDateTimeContext();
  const { dateValue, openPicker, isDisabled, isReadOnly, dropdownPosition } = state;
  const s = sizeConfig[size];
  const ref = useRef<HTMLDivElement>(null);
  const isOpen = openPicker === "date";
  const pos = useAutoPosition(isOpen, ref, dropdownPosition);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) closePicker();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [closePicker]);

  return (
    <div ref={ref} className="relative w-full">
      {label && (
        <label className={`block ${s.labelText} font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider`}>
          {label}
        </label>
      )}
      <button
        type="button"
        disabled={isDisabled}
        onClick={() => isOpen ? closePicker() : openDatePicker()}
        className={`
          w-full ${s.triggerHeight} flex items-center gap-2 ${s.triggerPx} rounded-lg border ${s.triggerText} transition-all text-left
          bg-white dark:bg-gray-800
          ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
          ${isReadOnly ? "cursor-default" : ""}
          ${isOpen
            ? "border-gray-400 dark:border-gray-500 ring-1 ring-gray-900 dark:ring-white"
            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
          }
        `}
      >
        <Calendar size={s.iconSize} className="text-gray-400 dark:text-gray-500 shrink-0" />
        <span className={dateValue ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-gray-500"}>
          {dateValue ? formatDateDisplay(dateValue) : placeholder}
        </span>
        {dateValue && !isDisabled && !isReadOnly && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setDate(""); }}
            className="ml-auto text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 transition-colors"
          >
            <X size={s.iconSize - 2} />
          </button>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className={`absolute z-50 ${positionClasses(pos)}`}>
            <CalendarPicker size={size} />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface TimeFieldInnerProps {
  label?: string;
  placeholder?: string;
  size: PickerSize;
}

function TimeFieldInner({ label, placeholder = "Pick a time", size }: TimeFieldInnerProps) {
  const { state, openTimePicker, closePicker, setTime } = useDateTimeContext();
  const { timeValue, openPicker, isDisabled, isReadOnly, dropdownPosition } = state;
  const s = sizeConfig[size];
  const ref = useRef<HTMLDivElement>(null);
  const isOpen = openPicker === "time";
  const pos = useAutoPosition(isOpen, ref, dropdownPosition);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) closePicker();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [closePicker]);

  return (
    <div ref={ref} className="relative w-full">
      {label && (
        <label className={`block ${s.labelText} font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider`}>
          {label}
        </label>
      )}
      <button
        type="button"
        disabled={isDisabled}
        onClick={() => isOpen ? closePicker() : openTimePicker()}
        className={`
          w-full ${s.triggerHeight} flex items-center gap-2 ${s.triggerPx} rounded-lg border ${s.triggerText} transition-all text-left
          bg-white dark:bg-gray-800
          ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
          ${isReadOnly ? "cursor-default" : ""}
          ${isOpen
            ? "border-gray-400 dark:border-gray-500 ring-1 ring-gray-900 dark:ring-white"
            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
          }
        `}
      >
        <Clock size={s.iconSize} className="text-gray-400 dark:text-gray-500 shrink-0" />
        <span className={timeValue ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-gray-500"}>
          {timeValue ? formatTimeDisplay(timeValue) : placeholder}
        </span>
        {timeValue && !isDisabled && !isReadOnly && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setTime(""); }}
            className="ml-auto text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 transition-colors"
          >
            <X size={s.iconSize - 2} />
          </button>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className={`absolute z-50 ${positionClasses(pos)}`}>
            <TimePickerInner size={size} />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export interface DateTimePickerProps extends Omit<DateTimeProviderProps, "children"> {
  mode?: PickerMode;
  size?: PickerSize;
  dateLabel?: string;
  timeLabel?: string;
  datePlaceholder?: string;
  timePlaceholder?: string;
  className?: string;
  layout?: "horizontal" | "vertical";
}

export function DateTimePicker({
  mode = "datetime",
  size = "md",
  dateLabel,
  timeLabel,
  datePlaceholder,
  timePlaceholder,
  className = "",
  layout = "horizontal",
  ...providerProps
}: DateTimePickerProps) {
  return (
    <DateTimeProvider {...providerProps} mode={mode} size={size}>
      <div
        className={`
          ${layout === "horizontal" && mode === "datetime" ? "flex flex-wrap gap-3 items-end" : "flex flex-col gap-3"}
          ${className}
        `}
      >
        {(mode === "date" || mode === "datetime") && (
          <div className={mode === "datetime" && layout === "horizontal" ? "flex-1 min-w-0" : "w-full"}>
            <DateFieldInner label={dateLabel} placeholder={datePlaceholder} size={size} />
          </div>
        )}
        {(mode === "time" || mode === "datetime") && (
          <div className={mode === "datetime" && layout === "horizontal" ? "flex-1 min-w-0" : "w-full"}>
            <TimeFieldInner label={timeLabel} placeholder={timePlaceholder} size={size} />
          </div>
        )}
      </div>
    </DateTimeProvider>
  );
}

export interface StandaloneDatePickerProps extends Omit<DateTimeProviderProps, "children"> {
  size?: PickerSize;
  label?: string;
  placeholder?: string;
  className?: string;
}

export function StandaloneDatePicker({
  size = "md",
  label,
  placeholder,
  className = "",
  ...providerProps
}: StandaloneDatePickerProps) {
  return (
    <DateTimeProvider {...providerProps} mode="date" size={size}>
      <div className={className}>
        <DateFieldInner label={label} placeholder={placeholder} size={size} />
      </div>
    </DateTimeProvider>
  );
}

export interface StandaloneTimePickerProps extends Omit<DateTimeProviderProps, "children"> {
  size?: PickerSize;
  label?: string;
  placeholder?: string;
  className?: string;
}

export function StandaloneTimePicker({
  size = "md",
  label,
  placeholder,
  className = "",
  ...providerProps
}: StandaloneTimePickerProps) {
  return (
    <DateTimeProvider {...providerProps} mode="time" size={size}>
      <div className={className}>
        <TimeFieldInner label={label} placeholder={placeholder} size={size} />
      </div>
    </DateTimeProvider>
  );
}

export { DateTimeProvider, useDateTimeContext };
export type { PickerMode, PickerSize, DropdownPosition, DateTimeValue };