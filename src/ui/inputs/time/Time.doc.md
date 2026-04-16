# Date & Time Component — Full Specification

A production-grade, fully featured Date & Time picker component for a UI component library (comparable to MUI / PrimeReact). This document covers every feature, variant, prop, behavior, and design consideration.

---

## Table of Contents

1. [Overview](#overview)
2. [Sizes](#sizes)
3. [Use Cases / Modes](#use-cases--modes)
4. [Responsive Behavior & Positioning](#responsive-behavior--positioning)
5. [Feature Set](#feature-set)
6. [Props API](#props-api)
7. [className Override System](#classname-override-system)
8. [Accessibility](#accessibility)
9. [Theming & Tokens](#theming--tokens)
10. [Localization & Internationalization](#localization--internationalization)
11. [Keyboard Navigation](#keyboard-navigation)
12. [Events & Callbacks](#events--callbacks)
13. [Validation & Error Handling](#validation--error-handling)
14. [Edge Cases & Constraints](#edge-cases--constraints)
15. [Animation & Transition Behavior](#animation--transition-behavior)
16. [Component Architecture](#component-architecture)

---

## Overview

The `DateTimePicker` component is a flexible, composable input primitive that handles single dates, single times, date ranges, time ranges, and combined date-time ranges. It supports static (inline) rendering, popover-based rendering, read-only displays, disabled states, and all major responsive scenarios. Every visual element is overridable via `className` props.

---

## Sizes

The component ships with seven size variants. Sizes affect trigger height, font size, calendar cell size, input padding, and popup dimensions proportionally.

| Size Token | Trigger Height | Font Size | Calendar Cell | Use Case                         |
| ---------- | -------------- | --------- | ------------- | -------------------------------- |
| `xs`       | 24px           | 11px      | 24px          | Dense tables, compact toolbars   |
| `sm`       | 32px           | 12px      | 28px          | Sidebars, secondary forms        |
| `md`       | 40px           | 14px      | 36px          | Default — general forms          |
| `lg`       | 48px           | 16px      | 40px          | Prominent form fields            |
| `xl`       | 56px           | 18px      | 44px          | Hero / landing page inputs       |
| `2xl`      | 64px           | 20px      | 48px          | Kiosk / large touch UI           |
| `3xl`      | 80px           | 24px      | 56px          | Accessibility-first, TV, display |

**Prop:** `size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl"` — default `"md"`

---

## Use Cases / Modes

### 1. Only Date

Renders a single date input. The picker opens a calendar view only. No time selector is shown.

- Displays: Month/Year header, weekday labels, day grid
- Output: `Date` object or ISO date string `YYYY-MM-DD`
- Relevant props: `mode="date"`, `value`, `onChange`, `minDate`, `maxDate`

---

### 2. Only Time

Renders a single time input. The picker opens a time wheel / clock view only. No calendar is shown.

- Displays: Hour column, Minute column, optional Second column, optional AM/PM toggle
- Supports: 12-hour and 24-hour format
- Output: `string` in `HH:mm` or `HH:mm:ss` format
- Relevant props: `mode="time"`, `timeFormat`, `showSeconds`, `minuteStep`, `secondStep`

---

### 3. Only Start and End Date (Date Range)

Renders two date inputs (Start Date / End Date) sharing a single popover with a dual-panel calendar.

- Left panel: month containing the start date
- Right panel: next month (or month containing end date)
- Hovering over days highlights the range preview
- Clicking selects start; second click selects end; third click resets start
- Output: `{ start: Date | null, end: Date | null }`
- Relevant props: `mode="dateRange"`, `value`, `onChange`, `minDate`, `maxDate`, `minRange`, `maxRange`

---

### 4. Only Start Time and End Time (Time Range)

Renders two time inputs (Start Time / End Time) sharing a single popover with two time selectors side by side.

- Validates that start time is before end time
- Supports overnight ranges (e.g. 22:00 – 06:00) via `allowOvernightRange` prop
- Output: `{ start: string | null, end: string | null }`
- Relevant props: `mode="timeRange"`, `allowOvernightRange`, `timeFormat`, `showSeconds`

---

### 5. Start Date + Start Time and End Date + End Time (Full DateTime Range)

Renders four inputs grouped as two pairs. Each pair shares a popover with a calendar and time selector stacked or side-by-side.

- Validates full datetime order: start datetime must be before end datetime
- Supports same-day ranges with time precision
- Output: `{ start: Date | null, end: Date | null }` (full timestamps)
- Relevant props: `mode="dateTimeRange"`, all date and time range props combined

---

### 6. Read-Only

The trigger renders as a styled display element, not an interactive input. The popover never opens.

- Screen readers announce the value with `aria-readonly="true"`
- No hover/focus states that imply interactivity
- Visually distinct from disabled (no reduced opacity) — appears as formatted text in a bordered container
- Relevant prop: `readOnly={true}`

---

### 7. Disabled

The entire component is non-interactive. Input and trigger are grayed out.

- `aria-disabled="true"` on the root
- Pointer events disabled; tab focus skipped (`tabIndex={-1}`)
- Tooltip support: optionally show a reason via `disabledReason` prop
- Relevant prop: `disabled={true}`, `disabledReason?: string`

---

### 8. Static (Inline)

The calendar / time picker renders inline in the document flow — no trigger button, no popover. Used for embedding directly in a form section, sidebar, or panel.

- No trigger element rendered
- Full height of the picker content always visible
- Supports all modes (date, time, range, datetime range)
- Relevant prop: `static={true}` or `variant="static"`

---

## Responsive Behavior & Positioning

### Position: Top

The popover opens upward from the trigger element.

- Used when the trigger is near the bottom of the viewport
- Arrow/caret points downward
- Prop: `position="top"`

---

### Position: Bottom

The popover opens downward from the trigger element (default).

- Arrow/caret points upward
- Prop: `position="bottom"`

---

### Auto Calculate Position

The component detects available space in all four directions and chooses the best placement automatically at open time and on scroll/resize.

- Uses `IntersectionObserver` + `getBoundingClientRect()` to measure space
- Re-calculates on `window.resize` and `scroll` events while open
- Falls back gracefully: prefers bottom, then top, then right, then left
- Prop: `position="auto"` (default)

---

### Completely Responsive

On small viewports (below a configurable `mobileBreakpoint`, default `640px`) the popover transforms into a bottom sheet / modal drawer.

- Full-width bottom sheet with handle bar
- Smooth slide-up animation
- Background overlay with tap-to-close
- Calendar cells enlarge for touch targets (minimum 44x44px per WCAG)
- Prop: `mobileBreakpoint?: number`, `mobileDisplay?: "sheet" | "modal" | "fullscreen"`

---

## Feature Set

### Calendar Features

- Month navigation: previous / next month buttons
- Year navigation: click the year label to open a year grid (range: `minYear` to `maxYear`)
- Month navigation: click the month label to open a month grid
- Week numbers: optional column on the left side — `showWeekNumbers={true}`
- Today highlight: current date receives a distinct visual marker
- Outside days: days from adjacent months shown in muted style — `showOutsideDays={true}`
- Disabled dates: pass an array `disabledDates`, a date range, or a callback `disableDateFn: (date: Date) => boolean`
- Highlighted dates: mark special dates (holidays, events) with custom labels — `highlightedDates: HighlightedDate[]`
- Multiple selection: select non-contiguous dates — `mode="multiDate"`, output: `Date[]`
- First day of week: configurable — `firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6` (0 = Sunday)

---

### Time Selector Features

- Hour / Minute / Second columns (scroll or click)
- AM / PM toggle for 12-hour format
- Minute step increments: `minuteStep?: number` (e.g. 5, 10, 15, 30)
- Second step increments: `secondStep?: number`
- Clock face view vs. column scroll view — `timePickerVariant?: "columns" | "clock"`
- Now / Current time shortcut button
- Keyboard: arrow keys to increment/decrement

---

### Input Field Features

- Manual text entry with format mask (e.g. `DD/MM/YYYY`)
- Format configurable: `dateFormat?: string`, `timeFormat?: "12h" | "24h"`
- Placeholder text per segment
- Clear button (visible when value is present) — `clearable={true}`
- Inline label and floating label support
- Helper text below input — `helperText?: string`
- Error state with message — `error={true}`, `errorMessage?: string`
- Character-by-character validation as user types
- Paste support with smart format detection

---

### Preset / Shortcut Panel

A sidebar or footer panel with quick-select options.

- Built-in presets: Today, Yesterday, This Week, Last Week, This Month, Last Month, This Quarter, Last Quarter, This Year, Last Year
- Custom presets: `presets?: Preset[]` where `Preset = { label: string, getValue: () => DateValue }`
- Position: left panel (for range pickers) or footer strip (for single pickers)
- Prop: `showPresets={true}`

---

### Footer Actions

- Apply button: confirms selection (for controlled apply flow) — `showApplyButton={true}`
- Cancel button: reverts to previous value
- Clear button: resets to null
- Prop: `footerActions?: "auto" | "always" | "never"`

---

### Timezone Support

- Display and select dates in specific timezones
- Timezone selector dropdown within the popover
- Prop: `timezone?: string` (IANA timezone, e.g. `"Asia/Kolkata"`), `showTimezoneSelector={true}`

---

## Props API

```typescript
interface DateTimePickerProps {
  // Core
  mode?:
    | "date"
    | "time"
    | "dateTime"
    | "dateRange"
    | "timeRange"
    | "dateTimeRange"
    | "multiDate";
  value?: DateValue | DateRangeValue | Date[] | null;
  defaultValue?: DateValue | DateRangeValue | Date[] | null;
  onChange?: (value: DateValue | DateRangeValue | Date[] | null) => void;

  // Size
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

  // State
  disabled?: boolean;
  disabledReason?: string;
  readOnly?: boolean;
  loading?: boolean;

  // Display variant
  variant?: "popover" | "static";
  static?: boolean; // alias for variant="static"

  // Positioning
  position?: "top" | "bottom" | "left" | "right" | "auto";
  mobileBreakpoint?: number;
  mobileDisplay?: "sheet" | "modal" | "fullscreen";

  // Date constraints
  minDate?: Date | string;
  maxDate?: Date | string;
  disabledDates?: (Date | string)[];
  disableDateFn?: (date: Date) => boolean;
  highlightedDates?: HighlightedDate[];
  minRange?: number; // minimum days in range
  maxRange?: number; // maximum days in range

  // Time options
  timeFormat?: "12h" | "24h";
  showSeconds?: boolean;
  minuteStep?: number;
  secondStep?: number;
  timePickerVariant?: "columns" | "clock";
  allowOvernightRange?: boolean;

  // Calendar display
  showWeekNumbers?: boolean;
  showOutsideDays?: boolean;
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  numberOfMonths?: number; // for range pickers, default 2

  // Format
  dateFormat?: string;
  locale?: string;
  timezone?: string;
  showTimezoneSelector?: boolean;

  // UI features
  clearable?: boolean;
  showPresets?: boolean;
  presets?: Preset[];
  footerActions?: "auto" | "always" | "never";
  showApplyButton?: boolean;
  label?: string;
  placeholder?: string | { start?: string; end?: string };
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  required?: boolean;

  // Events
  onOpen?: () => void;
  onClose?: () => void;
  onMonthChange?: (date: Date) => void;
  onYearChange?: (year: number) => void;
  onApply?: (value: DateValue | DateRangeValue) => void;
  onClear?: () => void;

  // Accessibility
  id?: string;
  name?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;

  // Styling
  className?: string;
  classNames?: DateTimePickerClassNames;
  style?: React.CSSProperties;
  styles?: DateTimePickerStyles;
  unstyled?: boolean; // strips all default styles
}
```

---

## className Override System

Every visual region of the component accepts its own `className` override through the `classNames` prop object. This enables deep styling without `!important` hacks or specificity battles.

```typescript
interface DateTimePickerClassNames {
  // Root wrapper
  root?: string;

  // Trigger / Input area
  trigger?: string;
  triggerInput?: string;
  triggerSeparator?: string; // the "to" separator in range mode
  triggerClearButton?: string;
  triggerPlaceholder?: string;

  // Label
  label?: string;
  requiredIndicator?: string;
  helperText?: string;
  errorMessage?: string;

  // Popover / Panel
  popover?: string;
  popoverArrow?: string;
  overlay?: string; // mobile sheet backdrop

  // Calendar
  calendar?: string;
  calendarHeader?: string;
  calendarNavButton?: string;
  calendarMonthLabel?: string;
  calendarYearLabel?: string;
  calendarWeekdays?: string;
  calendarWeekdayCell?: string;
  calendarGrid?: string;
  calendarCell?: string;
  calendarCellInner?: string;
  calendarCellToday?: string;
  calendarCellSelected?: string;
  calendarCellRangeStart?: string;
  calendarCellRangeEnd?: string;
  calendarCellInRange?: string;
  calendarCellDisabled?: string;
  calendarCellOutside?: string; // days from adjacent months
  calendarCellHighlighted?: string;
  calendarCellHover?: string;
  calendarWeekNumber?: string;

  // Month / Year grid overlay
  monthGrid?: string;
  monthGridCell?: string;
  yearGrid?: string;
  yearGridCell?: string;

  // Time selector
  timePicker?: string;
  timeColumn?: string;
  timeColumnLabel?: string;
  timeCell?: string;
  timeCellSelected?: string;
  amPmToggle?: string;
  amPmButton?: string;

  // Presets panel
  presetsPanel?: string;
  presetButton?: string;
  presetButtonActive?: string;

  // Footer
  footer?: string;
  applyButton?: string;
  cancelButton?: string;
  clearButton?: string;

  // Timezone selector
  timezoneSelector?: string;

  // Dividers
  divider?: string;
}
```

Additionally, inline style overrides are supported via a parallel `styles` prop with the same key structure, each accepting a `React.CSSProperties` object.

The `unstyled={true}` prop strips all built-in CSS from every element, giving integrators a clean base for building fully custom designs on top of the component's logic layer.

---

## Accessibility

The component is built to WCAG 2.1 AA standard, with optional AAA enhancements.

- Full keyboard navigation (see Keyboard Navigation section)
- `role="dialog"` on the popover with `aria-modal="true"`
- `role="grid"` on the calendar with `aria-label` describing the current month
- Each day cell: `role="gridcell"`, `aria-selected`, `aria-disabled`, `aria-current="date"` for today
- Live region (`aria-live="polite"`) announces month/year changes and selected values
- Focus trap inside popover when open
- Focus returns to trigger on close
- Minimum touch target size: 44x44px on mobile
- High contrast mode support via CSS `forced-colors` media query
- `prefers-reduced-motion` media query disables all transitions

---

## Theming & Tokens

The component exposes a set of CSS custom properties for easy theming integration.

```css
--dtp-color-primary
--dtp-color-primary-hover
--dtp-color-primary-text
--dtp-color-surface
--dtp-color-surface-elevated
--dtp-color-border
--dtp-color-border-focus
--dtp-color-text
--dtp-color-text-muted
--dtp-color-text-disabled
--dtp-color-range-bg
--dtp-color-today-ring
--dtp-color-error
--dtp-color-error-bg
--dtp-radius-sm
--dtp-radius-md
--dtp-radius-lg
--dtp-shadow-popover
--dtp-font-family
--dtp-font-size-base
--dtp-transition-duration
--dtp-transition-easing
--dtp-z-index-popover
```

All tokens can be set at the design-system level (`:root`) or scoped to a wrapper element for component-level overrides.

---

## Localization & Internationalization

- Locale prop: `locale?: string` (BCP 47 tag, e.g. `"en-US"`, `"hi-IN"`, `"de-DE"`, `"ar-SA"`)
- All day/month names rendered via `Intl.DateTimeFormat`
- RTL layout supported via CSS logical properties; automatically activates when locale or `dir="rtl"` is detected
- Calendar systems: Gregorian (default); optional support for ISO week calendar
- Number formatting respects locale (e.g. Arabic-Indic numerals)
- Date format mask respects locale order (MM/DD/YYYY vs DD/MM/YYYY vs YYYY-MM-DD)
- All user-visible strings overridable via `messages` prop for custom translation:

```typescript
messages?: {
  today?: string;
  clear?: string;
  apply?: string;
  cancel?: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  selectYear?: string;
  selectMonth?: string;
  // ... all labels
}
```

---

## Keyboard Navigation

| Key                    | Action                                                                     |
| ---------------------- | -------------------------------------------------------------------------- |
| `Enter` / `Space`      | Open picker from trigger; confirm selection                                |
| `Escape`               | Close popover; revert to previous value                                    |
| `Tab`                  | Move focus between trigger, clear button, popover sections, footer buttons |
| `Arrow Left` / `Right` | Move focus to previous / next day in calendar                              |
| `Arrow Up` / `Down`    | Move focus to same weekday in previous / next week; scroll time columns    |
| `Page Up`              | Go to previous month                                                       |
| `Page Down`            | Go to next month                                                           |
| `Shift + Page Up`      | Go to previous year                                                        |
| `Shift + Page Down`    | Go to next year                                                            |
| `Home`                 | Jump to first day of current week                                          |
| `End`                  | Jump to last day of current week                                           |
| `Ctrl/Cmd + Home`      | Jump to first day of current month                                         |
| `Ctrl/Cmd + End`       | Jump to last day of current month                                          |

In time column: `Arrow Up` / `Down` increments / decrements the focused unit by one step.

---

## Events & Callbacks

```typescript
onChange(value); // fires on every committed selection change
onOpen(); // fires when popover opens
onClose(); // fires when popover closes (with or without value change)
onApply(value); // fires only when Apply button is clicked (controlled flow)
onClear(); // fires when value is cleared
onMonthChange(date); // fires when visible month changes
onYearChange(year); // fires when visible year changes
onFocus(event); // native focus event on the trigger
onBlur(event); // native blur event on the trigger
onKeyDown(event); // native keydown event
```

---

## Validation & Error Handling

The component can validate input and surface errors both inline and via callbacks.

- **Min/Max date**: Selecting outside bounds shows error state; out-of-range dates are disabled in calendar
- **Min/Max range**: For range pickers, enforces minimum and maximum number of days selectable
- **Invalid manual input**: If the user types an invalid date string, `error={true}` is set internally and `errorMessage` shown
- **Required field**: If `required={true}` and value is null on blur, error state activates
- **Time order**: In time range mode, warns if end time precedes start time (unless `allowOvernightRange`)
- **DateTime order**: In dateTimeRange mode, prevents end datetime from being set before start datetime

All validation can be overridden or extended via `validate?: (value: DateValue) => string | null` — return a string to show a custom error, null for valid.

---

## Edge Cases & Constraints

- **Daylight Saving Time transitions**: Uses `Intl` and avoids raw UTC offset arithmetic to handle DST-safe date math
- **Leap years**: February correctly shows 29 days on leap years
- **Month boundary in ranges**: Clicking the same day twice in range mode selects a single-day range
- **Year overflow in navigation**: Year grid clamps to `minYear` / `maxYear`
- **Scroll behavior**: When picker opens near the viewport edge, it does not cause page scroll jump; uses `position: fixed` with calculated coordinates
- **Popover within scrollable container**: Attaches to `document.body` via portal to avoid `overflow: hidden` clipping
- **Multiple instances**: Each instance maintains independent open/close state; opening one does not close others unless `closeOthersOnOpen` behavior is needed
- **Controlled vs. Uncontrolled**: Supports both patterns — if `value` is provided it is controlled; if only `defaultValue` is provided it is uncontrolled

---

## Animation & Transition Behavior

All animations respect `prefers-reduced-motion`. Default transitions:

| Interaction             | Animation                                    |
| ----------------------- | -------------------------------------------- |
| Popover open (bottom)   | Fade in + translate Y from -8px to 0         |
| Popover open (top)      | Fade in + translate Y from +8px to 0         |
| Mobile sheet open       | Slide up from bottom                         |
| Month change (forward)  | Slide left                                   |
| Month change (backward) | Slide right                                  |
| Year/Month grid open    | Fade in + scale from 0.95                    |
| Time column scroll      | Smooth scroll snap                           |
| Range hover highlight   | Instant fill (no animation, for performance) |
| Clear button appear     | Fade in                                      |

Duration and easing are controlled via `--dtp-transition-duration` and `--dtp-transition-easing` tokens.

---

## Component Architecture

The library exposes both a high-level composite component and low-level primitives for maximum composability.

### High-Level Component

```tsx
<DateTimePicker
  mode="dateTimeRange"
  size="md"
  value={value}
  onChange={setValue}
  showPresets
  position="auto"
  clearable
  classNames={{ calendarCellSelected: "my-selected-day" }}
/>
```

### Low-Level Primitives (Headless / Composable)

For teams that want full control over rendering while keeping the logic:

```
DateTimePicker.Root        — state provider
DateTimePicker.Trigger     — the input / button that opens the picker
DateTimePicker.Popover     — the floating panel wrapper
DateTimePicker.Calendar    — the calendar grid
DateTimePicker.CalendarHeader
DateTimePicker.CalendarGrid
DateTimePicker.TimePicker  — the time column/clock view
DateTimePicker.Presets     — the shortcuts panel
DateTimePicker.Footer      — apply / cancel / clear actions
DateTimePicker.TimezonePicker
```

All primitives accept `className`, `style`, and forward refs. They are unstyled by default when used individually — styles come from the composite component's stylesheet unless overridden.

---

_End of Specification_
