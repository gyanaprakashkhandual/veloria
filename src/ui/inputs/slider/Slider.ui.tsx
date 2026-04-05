import React, { forwardRef, useRef, useCallback, useState, useId } from "react";
import {
  useSliderContext,
  useSliderState,
  useRangeSliderState,
  SliderProvider,
  type SliderSize,
  type SliderVariant,
  type SliderOrientation,
  type SliderMark,
} from "./Slide.context";

function cx(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getPercent(value: number, min: number, max: number) {
  return ((value - min) / (max - min)) * 100;
}

export interface SliderProps {
  size?: SliderSize;
  variant?: SliderVariant;
  orientation?: SliderOrientation;
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  disabled?: boolean;
  showTooltip?: boolean;
  showValue?: boolean;
  showMarks?: boolean;
  marks?: SliderMark[];
  label?: string;
  description?: string;
  formatValue?: (value: number) => string;
  onChange?: (value: number) => void;
  onChangeEnd?: (value: number) => void;
  className?: string;
  trackClassName?: string;
  thumbClassName?: string;
  id?: string;
  "aria-label"?: string;
}

export const Slider = forwardRef<HTMLDivElement, SliderProps>(
  (
    {
      size = "md",
      variant = "solid",
      orientation = "horizontal",
      min = 0,
      max = 100,
      step = 1,
      value: valueProp,
      defaultValue = 0,
      disabled = false,
      showTooltip = false,
      showValue = false,
      showMarks = false,
      marks,
      label,
      description,
      formatValue = (v) => String(v),
      onChange,
      onChangeEnd,
      className,
      trackClassName,
      thumbClassName,
      id: idProp,
      "aria-label": ariaLabel,
    },
    ref,
  ) => {
    const { resolveSize, resolveVariant } = useSliderContext();
    const s = resolveSize(size);
    const v = resolveVariant(variant);
    const generatedId = useId();
    const labelId = idProp ?? generatedId;

    const { value, setValue } = useSliderState(
      valueProp,
      defaultValue,
      min,
      max,
      step,
      onChange,
    );

    const trackRef = useRef<HTMLDivElement>(null);
    const dragging = useRef(false);
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const percent = getPercent(value, min, max);

    const getValueFromEvent = useCallback(
      (clientPos: number) => {
        if (!trackRef.current) return value;
        const rect = trackRef.current.getBoundingClientRect();
        const ratio =
          orientation === "horizontal"
            ? (clientPos - rect.left) / rect.width
            : 1 - (clientPos - rect.top) / rect.height;
        return clamp(
          Math.round((ratio * (max - min)) / step) * step + min,
          min,
          max,
        );
      },
      [value, min, max, step, orientation],
    );

    const handlePointerDown = useCallback(
      (e: React.PointerEvent) => {
        if (disabled) return;
        e.currentTarget.setPointerCapture(e.pointerId);
        dragging.current = true;
        setTooltipVisible(true);
        setValue(
          getValueFromEvent(
            orientation === "horizontal" ? e.clientX : e.clientY,
          ),
        );
      },
      [disabled, getValueFromEvent, setValue, orientation],
    );

    const handlePointerMove = useCallback(
      (e: React.PointerEvent) => {
        if (!dragging.current || disabled) return;
        setValue(
          getValueFromEvent(
            orientation === "horizontal" ? e.clientX : e.clientY,
          ),
        );
      },
      [disabled, getValueFromEvent, setValue, orientation],
    );

    const handlePointerUp = useCallback(
      (e: React.PointerEvent) => {
        dragging.current = false;
        setTooltipVisible(false);
        onChangeEnd?.(value);
      },
      [value, onChangeEnd],
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (disabled) return;
        const actions: Record<string, number> = {
          ArrowRight: step,
          ArrowUp: step,
          ArrowLeft: -step,
          ArrowDown: -step,
          Home: min - value,
          End: max - value,
          PageUp: step * 10,
          PageDown: -step * 10,
        };
        const delta = actions[e.key];
        if (delta !== undefined) {
          e.preventDefault();
          setValue(value + delta);
        }
      },
      [disabled, value, min, max, step, setValue],
    );

    const resolvedMarks: SliderMark[] =
      marks ?? (showMarks ? [{ value: min }, { value: max }] : []);

    const isVertical = orientation === "vertical";

    return (
      <div
        ref={ref}
        className={cx(
          "flex",
          isVertical ? "flex-row items-start gap-3" : "flex-col gap-1.5",
          className,
        )}
      >
        {(label || showValue) && (
          <div className="flex items-center justify-between">
            {label && (
              <label
                htmlFor={labelId}
                className={cx(
                  s.label,
                  "text-zinc-800 dark:text-zinc-200 select-none",
                )}
              >
                {label}
              </label>
            )}
            {showValue && (
              <span
                className={cx(
                  s.valueLabel,
                  "text-zinc-500 dark:text-zinc-400 tabular-nums",
                )}
              >
                {formatValue(value)}
              </span>
            )}
          </div>
        )}

        {description && (
          <p className="text-xs text-zinc-400 dark:text-zinc-500 -mt-0.5">
            {description}
          </p>
        )}

        <div
          className={cx(
            "relative flex items-center justify-center",
            isVertical ? "flex-col" : "flex-row",
            isVertical ? "h-48 w-auto" : "w-full h-auto",
            disabled ? "opacity-50 cursor-not-allowed" : "",
          )}
        >
          <div
            ref={trackRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className={cx(
              "relative cursor-pointer",
              isVertical
                ? cx("w-auto h-full flex items-center justify-center", s.track.replace("h-", "w-"))
                : cx("w-full flex items-center", s.track),
            )}
            style={isVertical ? { width: s.trackThickness } : { height: s.trackThickness }}
          >
            <div
              className={cx(
                "absolute inset-0",
                v.track,
                isVertical ? "w-full" : "h-full",
              )}
            />

            <div
              className={cx("absolute", v.fill)}
              style={
                isVertical
                  ? {
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: `${percent}%`,
                    }
                  : {
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: `${percent}%`,
                    }
              }
            />

            {resolvedMarks.map((mark) => {
              const markPercent = getPercent(mark.value, min, max);
              const isActive = mark.value <= value;
              return (
                <div
                  key={mark.value}
                  className="absolute flex flex-col items-center"
                  style={
                    isVertical
                      ? {
                          bottom: `${markPercent}%`,
                          left: "50%",
                          transform: "translateX(-50%)",
                        }
                      : {
                          left: `${markPercent}%`,
                          top: "50%",
                          transform: "translate(-50%, -50%)",
                        }
                  }
                >
                  <div
                    className={cx(
                      s.markDot,
                      isActive ? v.markActive : v.mark,
                    )}
                  />
                  {mark.label && (
                    <span
                      className={cx(
                        s.markLabel,
                        "text-zinc-400 dark:text-zinc-500 select-none absolute",
                        isVertical ? "left-4 -translate-y-1/2" : "top-4",
                      )}
                    >
                      {mark.label}
                    </span>
                  )}
                </div>
              );
            })}

            <div
              role="slider"
              id={labelId}
              aria-label={ariaLabel ?? label}
              aria-valuemin={min}
              aria-valuemax={max}
              aria-valuenow={value}
              aria-orientation={orientation}
              aria-disabled={disabled}
              tabIndex={disabled ? -1 : 0}
              onKeyDown={handleKeyDown}
              onMouseEnter={() => showTooltip && setTooltipVisible(true)}
              onMouseLeave={() => !dragging.current && setTooltipVisible(false)}
              className={cx(
                "absolute z-10 flex items-center justify-center",
                s.thumb,
                v.thumb,
                !disabled ? v.thumbHover : "",
                v.thumbFocus,
                !disabled ? v.thumbActive : "",
                disabled ? v.thumbDisabled : "",
                thumbClassName,
              )}
              style={
                isVertical
                  ? {
                      bottom: `calc(${percent}% - ${s.thumbSize / 2}px)`,
                      left: "50%",
                      transform: "translateX(-50%)",
                    }
                  : {
                      left: `calc(${percent}% - ${s.thumbSize / 2}px)`,
                      top: "50%",
                      transform: "translateY(-50%)",
                    }
              }
            >
              {(showTooltip || tooltipVisible) && tooltipVisible && (
                <div
                  className={cx(
                    "absolute z-20 pointer-events-none",
                    "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900",
                    "rounded-md font-medium whitespace-nowrap shadow-sm",
                    s.tooltip,
                    isVertical
                      ? "left-full ml-2 top-1/2 -translate-y-1/2"
                      : "bottom-full mb-2 left-1/2 -translate-x-1/2",
                  )}
                >
                  {formatValue(value)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  },
);

Slider.displayName = "Slider";

export interface RangeSliderProps {
  size?: SliderSize;
  variant?: SliderVariant;
  min?: number;
  max?: number;
  step?: number;
  value?: [number, number];
  defaultValue?: [number, number];
  disabled?: boolean;
  showTooltip?: boolean;
  showValue?: boolean;
  showMarks?: boolean;
  marks?: SliderMark[];
  label?: string;
  description?: string;
  minDistance?: number;
  formatValue?: (value: number) => string;
  onChange?: (value: [number, number]) => void;
  onChangeEnd?: (value: [number, number]) => void;
  className?: string;
  "aria-label"?: string;
}

export const RangeSlider = forwardRef<HTMLDivElement, RangeSliderProps>(
  (
    {
      size = "md",
      variant = "solid",
      min = 0,
      max = 100,
      step = 1,
      value: valueProp,
      defaultValue = [20, 80],
      disabled = false,
      showTooltip = false,
      showValue = false,
      showMarks = false,
      marks,
      label,
      description,
      minDistance = 0,
      formatValue = (v) => String(v),
      onChange,
      onChangeEnd,
      className,
      "aria-label": ariaLabel,
    },
    ref,
  ) => {
    const { resolveSize, resolveVariant } = useSliderContext();
    const s = resolveSize(size);
    const v = resolveVariant(variant);

    const { value, setValue } = useRangeSliderState(
      valueProp,
      defaultValue,
      min,
      max,
      step,
      onChange,
    );

    const trackRef = useRef<HTMLDivElement>(null);
    const activeThumb = useRef<0 | 1 | null>(null);
    const [tooltipVisible, setTooltipVisible] = useState<[boolean, boolean]>([false, false]);

    const getValueFromEvent = useCallback(
      (clientX: number): number => {
        if (!trackRef.current) return min;
        const rect = trackRef.current.getBoundingClientRect();
        const ratio = (clientX - rect.left) / rect.width;
        return clamp(
          Math.round((ratio * (max - min)) / step) * step + min,
          min,
          max,
        );
      },
      [min, max, step],
    );

    const handleTrackPointerDown = useCallback(
      (e: React.PointerEvent) => {
        if (disabled) return;
        const clickValue = getValueFromEvent(e.clientX);
        const distToLow = Math.abs(clickValue - value[0]);
        const distToHigh = Math.abs(clickValue - value[1]);
        activeThumb.current = distToLow <= distToHigh ? 0 : 1;
        e.currentTarget.setPointerCapture(e.pointerId);

        const next: [number, number] = [...value] as [number, number];
        next[activeThumb.current!] = clickValue;
        if (next[0] > next[1] - minDistance) {
          if (activeThumb.current === 0) next[0] = next[1] - minDistance;
          else next[1] = next[0] + minDistance;
        }
        setValue(next);
      },
      [disabled, getValueFromEvent, value, minDistance, setValue],
    );

    const handlePointerMove = useCallback(
      (e: React.PointerEvent) => {
        if (activeThumb.current === null || disabled) return;
        const nextVal = getValueFromEvent(e.clientX);
        const next: [number, number] = [...value] as [number, number];
        next[activeThumb.current] = nextVal;
        if (next[0] > next[1] - minDistance) {
          if (activeThumb.current === 0) next[0] = next[1] - minDistance;
          else next[1] = next[0] + minDistance;
        }
        next[0] = clamp(next[0], min, max);
        next[1] = clamp(next[1], min, max);
        setValue(next);
      },
      [disabled, getValueFromEvent, value, min, max, minDistance, setValue],
    );

    const handlePointerUp = useCallback(() => {
      activeThumb.current = null;
      onChangeEnd?.(value);
    }, [value, onChangeEnd]);

    const handleKeyDown = useCallback(
      (index: 0 | 1) => (e: React.KeyboardEvent) => {
        if (disabled) return;
        const actions: Record<string, number> = {
          ArrowRight: step,
          ArrowUp: step,
          ArrowLeft: -step,
          ArrowDown: -step,
          Home: min - value[index],
          End: max - value[index],
        };
        const delta = actions[e.key];
        if (delta !== undefined) {
          e.preventDefault();
          const next: [number, number] = [...value] as [number, number];
          next[index] = clamp(next[index] + delta, min, max);
          if (next[0] > next[1] - minDistance) {
            if (index === 0) next[0] = next[1] - minDistance;
            else next[1] = next[0] + minDistance;
          }
          setValue(next);
        }
      },
      [disabled, value, min, max, step, minDistance, setValue],
    );

    const lowPercent = getPercent(value[0], min, max);
    const highPercent = getPercent(value[1], min, max);
    const resolvedMarks: SliderMark[] =
      marks ?? (showMarks ? [{ value: min }, { value: max }] : []);

    return (
      <div className={cx("flex flex-col gap-1.5", className)}>
        {(label || showValue) && (
          <div className="flex items-center justify-between">
            {label && (
              <span
                className={cx(s.label, "text-zinc-800 dark:text-zinc-200 select-none")}
              >
                {label}
              </span>
            )}
            {showValue && (
              <span
                className={cx(
                  s.valueLabel,
                  "text-zinc-500 dark:text-zinc-400 tabular-nums",
                )}
              >
                {formatValue(value[0])} – {formatValue(value[1])}
              </span>
            )}
          </div>
        )}

        {description && (
          <p className="text-xs text-zinc-400 dark:text-zinc-500 -mt-0.5">
            {description}
          </p>
        )}

        <div
          className={cx(
            "relative w-full flex items-center cursor-pointer",
            s.track,
            disabled ? "opacity-50 cursor-not-allowed" : "",
          )}
          style={{ height: s.trackThickness }}
          ref={trackRef}
          onPointerDown={handleTrackPointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          <div className={cx("absolute inset-0", v.track)} />

          <div
            className={cx("absolute", v.fill)}
            style={{
              left: `${lowPercent}%`,
              right: `${100 - highPercent}%`,
              top: 0,
              bottom: 0,
            }}
          />

          {resolvedMarks.map((mark) => {
            const markPercent = getPercent(mark.value, min, max);
            const isActive = mark.value >= value[0] && mark.value <= value[1];
            return (
              <div
                key={mark.value}
                className="absolute flex flex-col items-center"
                style={{
                  left: `${markPercent}%`,
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div className={cx(s.markDot, isActive ? v.markActive : v.mark)} />
                {mark.label && (
                  <span
                    className={cx(
                      s.markLabel,
                      "text-zinc-400 dark:text-zinc-500 select-none absolute top-4",
                    )}
                  >
                    {mark.label}
                  </span>
                )}
              </div>
            );
          })}

          {([0, 1] as const).map((index) => {
            const percent = index === 0 ? lowPercent : highPercent;
            const isTooltipVisible = tooltipVisible[index];
            return (
              <div
                key={index}
                role="slider"
                aria-label={ariaLabel ? `${ariaLabel} ${index === 0 ? "minimum" : "maximum"}` : undefined}
                aria-valuemin={min}
                aria-valuemax={max}
                aria-valuenow={value[index]}
                tabIndex={disabled ? -1 : 0}
                onKeyDown={handleKeyDown(index)}
                onMouseEnter={() => {
                  if (showTooltip)
                    setTooltipVisible((prev) => {
                      const next: [boolean, boolean] = [...prev] as [boolean, boolean];
                      next[index] = true;
                      return next;
                    });
                }}
                onMouseLeave={() => {
                  setTooltipVisible((prev) => {
                    const next: [boolean, boolean] = [...prev] as [boolean, boolean];
                    next[index] = false;
                    return next;
                  });
                }}
                className={cx(
                  "absolute z-10 flex items-center justify-center",
                  s.thumb,
                  v.thumb,
                  !disabled ? v.thumbHover : "",
                  v.thumbFocus,
                  !disabled ? v.thumbActive : "",
                  disabled ? v.thumbDisabled : "",
                )}
                style={{
                  left: `calc(${percent}% - ${s.thumbSize / 2}px)`,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                {isTooltipVisible && (
                  <div
                    className={cx(
                      "absolute z-20 pointer-events-none bottom-full mb-2 left-1/2 -translate-x-1/2",
                      "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900",
                      "rounded-md font-medium whitespace-nowrap shadow-sm",
                      s.tooltip,
                    )}
                  >
                    {formatValue(value[index])}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  },
);

RangeSlider.displayName = "RangeSlider";

export { SliderProvider, useSliderContext };
export type { SliderSize, SliderVariant, SliderOrientation, SliderMark };