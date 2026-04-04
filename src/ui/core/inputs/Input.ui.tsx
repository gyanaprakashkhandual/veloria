import React, { useCallback, useId } from "react";
import { Eye, EyeOff, X, AlertCircle, CheckCircle, AlertTriangle, Search, Loader2 } from "lucide-react";
import {
  InputProvider,
  useInputContext,
  type InputProviderProps,
  type InputSize,
  type InputVariant,
  type InputStatus,
  type InputType,
} from "../../../context/inputs/Input.context";

const sizeConfig = {
  sm: {
    height: "h-7",
    px: "px-2.5",
    text: "text-xs",
    labelText: "text-[10px]",
    hintText: "text-[10px]",
    iconSize: 12,
    iconPx: "px-2",
    rounded: "rounded-md",
    gap: "gap-1",
    counterText: "text-[10px]",
    prefixText: "text-xs",
    prefixPx: "px-2.5",
  },
  md: {
    height: "h-9",
    px: "px-3",
    text: "text-sm",
    labelText: "text-xs",
    hintText: "text-xs",
    iconSize: 14,
    iconPx: "px-2.5",
    rounded: "rounded-lg",
    gap: "gap-1.5",
    counterText: "text-xs",
    prefixText: "text-sm",
    prefixPx: "px-3",
  },
  lg: {
    height: "h-10",
    px: "px-3.5",
    text: "text-sm",
    labelText: "text-xs",
    hintText: "text-xs",
    iconSize: 15,
    iconPx: "px-3",
    rounded: "rounded-lg",
    gap: "gap-1.5",
    counterText: "text-xs",
    prefixText: "text-sm",
    prefixPx: "px-3.5",
  },
  xl: {
    height: "h-11",
    px: "px-4",
    text: "text-base",
    labelText: "text-xs",
    hintText: "text-xs",
    iconSize: 16,
    iconPx: "px-3.5",
    rounded: "rounded-xl",
    gap: "gap-2",
    counterText: "text-xs",
    prefixText: "text-base",
    prefixPx: "px-4",
  },
};

const variantBase: Record<InputVariant, string> = {
  default: "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700",
  filled: "bg-gray-100 dark:bg-gray-800 border border-transparent",
  ghost: "bg-transparent border border-transparent",
};

const variantFocus: Record<InputVariant, string> = {
  default: "border-gray-400 dark:border-gray-500 ring-1 ring-gray-900 dark:ring-white",
  filled: "bg-gray-100 dark:bg-gray-800 border-gray-400 dark:border-gray-500 ring-1 ring-gray-900 dark:ring-white",
  ghost: "border-gray-300 dark:border-gray-600",
};

const variantHover: Record<InputVariant, string> = {
  default: "hover:border-gray-300 dark:hover:border-gray-600",
  filled: "hover:bg-gray-200/60 dark:hover:bg-gray-700/60",
  ghost: "hover:bg-gray-50 dark:hover:bg-gray-800/40",
};

const statusBorder: Record<InputStatus, string> = {
  default: "",
  error: "border-red-400 dark:border-red-500 ring-1 ring-red-400 dark:ring-red-500",
  warning: "border-amber-400 dark:border-amber-500 ring-1 ring-amber-400 dark:ring-amber-500",
  success: "border-emerald-400 dark:border-emerald-500 ring-1 ring-emerald-400 dark:ring-emerald-500",
};

const statusIconColor: Record<InputStatus, string> = {
  default: "",
  error: "text-red-500 dark:text-red-400",
  warning: "text-amber-500 dark:text-amber-400",
  success: "text-emerald-500 dark:text-emerald-400",
};

const statusHintColor: Record<InputStatus, string> = {
  default: "text-gray-400 dark:text-gray-500",
  error: "text-red-500 dark:text-red-400",
  warning: "text-amber-500 dark:text-amber-400",
  success: "text-emerald-500 dark:text-emerald-400",
};

function StatusIcon({ status, size }: { status: InputStatus; size: number }) {
  if (status === "error") return <AlertCircle size={size} className={statusIconColor.error} />;
  if (status === "warning") return <AlertTriangle size={size} className={statusIconColor.warning} />;
  if (status === "success") return <CheckCircle size={size} className={statusIconColor.success} />;
  return null;
}

interface InputCoreProps {
  size: InputSize;
  variant: InputVariant;
  placeholder?: string;
  name?: string;
  id?: string;
  autoFocus?: boolean;
  autoComplete?: string;
  spellCheck?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  prefix?: string;
  suffix?: string;
  loading?: boolean;
  clearable?: boolean;
  showStatusIcon?: boolean;
  inputClassName?: string;
  wrapperClassName?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

function InputCore({
  size,
  variant,
  placeholder,
  name,
  id,
  autoFocus,
  autoComplete,
  spellCheck,
  leadingIcon,
  trailingIcon,
  prefix,
  suffix,
  loading,
  clearable,
  showStatusIcon = true,
  inputClassName = "",
  wrapperClassName = "",
  onKeyDown,
}: InputCoreProps) {
  const { state, setValue, setFocused, setTouched, togglePassword, clear, inputRef, onEnter } = useInputContext();
  const s = sizeConfig[size];

  const isPassword = state.type === "password";
  const isSearch = state.type === "search";
  const resolvedType = isPassword
    ? state.showPassword ? "text" : "password"
    : state.type;

  const hasLeading = !!leadingIcon || (isSearch && !leadingIcon);
  const hasTrailingStatus = showStatusIcon && state.status !== "default";
  const hasTrailingClear = clearable && state.value.length > 0 && !state.disabled && !state.readOnly;
  const hasTrailingPassword = isPassword;
  const hasTrailingIcon = !!trailingIcon;
  const hasTrailingLoader = loading;

  const trailingSlots = [
    hasTrailingLoader,
    hasTrailingStatus,
    hasTrailingClear,
    hasTrailingPassword,
    hasTrailingIcon,
  ].filter(Boolean).length;

  const isFocused = state.focused;
  const isDisabled = state.disabled;

  const borderClass = state.status !== "default"
    ? statusBorder[state.status]
    : isFocused
      ? variantFocus[variant]
      : variantBase[variant] + " " + (!isDisabled ? variantHover[variant] : "");

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (state.readOnly) return;
      const val = state.maxLength !== null
        ? e.target.value.slice(0, state.maxLength)
        : e.target.value;
      setValue(val);
    },
    [setValue, state.readOnly, state.maxLength],
  );

  const handleFocus = useCallback(() => {
    setFocused(true);
  }, [setFocused]);

  const handleBlur = useCallback(() => {
    setFocused(false);
    setTouched();
  }, [setFocused, setTouched]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") onEnter?.(state.value);
      onKeyDown?.(e);
    },
    [onEnter, onKeyDown, state.value],
  );

  const paddingLeft = hasLeading || prefix
    ? prefix
      ? undefined
      : `calc(${s.iconSize}px + 1.5rem)`
    : undefined;

  const paddingRight = trailingSlots > 0 || suffix
    ? suffix
      ? undefined
      : `calc(${trailingSlots * (s.iconSize + 20)}px + 0.5rem)`
    : undefined;

  return (
    <div className={`relative flex items-stretch w-full ${s.rounded} transition-all duration-100 ${borderClass} ${isDisabled ? "opacity-50 cursor-not-allowed" : ""} ${wrapperClassName}`}>
      {prefix && (
        <span className={`shrink-0 flex items-center ${s.prefixPx} ${s.prefixText} text-gray-400 dark:text-gray-500 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 ${s.rounded} rounded-r-none select-none`}>
          {prefix}
        </span>
      )}

      {!prefix && hasLeading && (
        <span
          className="absolute left-0 top-0 bottom-0 flex items-center pointer-events-none"
          style={{ paddingLeft: `calc(${s.iconPx.replace("px-", "")} * 0.25rem)` }}
        >
          <span className="flex items-center justify-center text-gray-400 dark:text-gray-500" style={{ width: s.iconSize, height: s.iconSize }}>
            {leadingIcon ?? (isSearch ? <Search size={s.iconSize} /> : null)}
          </span>
        </span>
      )}

      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        id={id}
        name={name}
        type={resolvedType}
        value={state.value}
        placeholder={placeholder}
        disabled={state.disabled}
        readOnly={state.readOnly}
        autoFocus={autoFocus}
        autoComplete={autoComplete}
        spellCheck={spellCheck}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`
          flex-1 min-w-0 ${s.height} ${!prefix && !suffix ? s.px : "px-3"} ${s.text}
          bg-transparent outline-none border-0 ring-0
          text-gray-900 dark:text-white
          placeholder-gray-400 dark:placeholder-gray-600
          ${state.disabled ? "cursor-not-allowed" : ""}
          ${state.readOnly ? "cursor-default select-all" : ""}
          ${inputClassName}
        `}
        style={{
          paddingLeft: !prefix ? paddingLeft : undefined,
          paddingRight: !suffix ? paddingRight : undefined,
        }}
      />

      {suffix && (
        <span className={`shrink-0 flex items-center ${s.prefixPx} ${s.prefixText} text-gray-400 dark:text-gray-500 border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 ${s.rounded} rounded-l-none select-none`}>
          {suffix}
        </span>
      )}

      {!suffix && (hasTrailingLoader || hasTrailingStatus || hasTrailingClear || hasTrailingPassword || hasTrailingIcon) && (
        <span className="absolute right-0 top-0 bottom-0 flex items-center gap-1 pr-2.5 pointer-events-none">
          {hasTrailingLoader && (
            <span className="flex items-center justify-center text-gray-400 dark:text-gray-500 animate-spin" style={{ width: s.iconSize, height: s.iconSize }}>
              <Loader2 size={s.iconSize} />
            </span>
          )}

          {!hasTrailingLoader && hasTrailingStatus && (
            <span className="flex items-center justify-center" style={{ width: s.iconSize, height: s.iconSize }}>
              <StatusIcon status={state.status} size={s.iconSize} />
            </span>
          )}

          {hasTrailingClear && (
            <button
              type="button"
              tabIndex={-1}
              onClick={clear}
              className="pointer-events-auto flex items-center justify-center text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 transition-colors duration-100"
              style={{ width: s.iconSize, height: s.iconSize }}
            >
              <X size={s.iconSize - 1} />
            </button>
          )}

          {hasTrailingPassword && (
            <button
              type="button"
              tabIndex={-1}
              onClick={togglePassword}
              className="pointer-events-auto flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-100"
              style={{ width: s.iconSize, height: s.iconSize }}
            >
              {state.showPassword ? <EyeOff size={s.iconSize} /> : <Eye size={s.iconSize} />}
            </button>
          )}

          {hasTrailingIcon && !hasTrailingPassword && (
            <span className="flex items-center justify-center text-gray-400 dark:text-gray-500" style={{ width: s.iconSize, height: s.iconSize }}>
              {trailingIcon}
            </span>
          )}
        </span>
      )}
    </div>
  );
}

export interface InputProps extends Omit<InputProviderProps, "children"> {
  label?: string;
  hint?: string;
  placeholder?: string;
  name?: string;
  id?: string;
  autoFocus?: boolean;
  autoComplete?: string;
  spellCheck?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  prefix?: string;
  suffix?: string;
  loading?: boolean;
  clearable?: boolean;
  showStatusIcon?: boolean;
  showCharacterCount?: boolean;
  required?: boolean;
  optional?: boolean;
  className?: string;
  inputClassName?: string;
  wrapperClassName?: string;
  labelClassName?: string;
  hintClassName?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function Input({
  label,
  hint,
  placeholder,
  name,
  id,
  autoFocus,
  autoComplete,
  spellCheck,
  leadingIcon,
  trailingIcon,
  prefix,
  suffix,
  loading = false,
  clearable = false,
  showStatusIcon = true,
  showCharacterCount = false,
  required = false,
  optional = false,
  className = "",
  inputClassName = "",
  wrapperClassName = "",
  labelClassName = "",
  hintClassName = "",
  onKeyDown,
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
}: InputProps) {
  const uid = useId();
  const resolvedId = id ?? uid;
  const s = sizeConfig[size];

  return (
    <InputProvider
      defaultValue={defaultValue}
      size={size}
      variant={variant}
      status={status}
      type={type}
      disabled={disabled}
      readOnly={readOnly}
      maxLength={maxLength}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      onClear={onClear}
      onEnter={onEnter}
    >
      <InputInner
        label={label}
        hint={hint}
        placeholder={placeholder}
        name={name}
        id={resolvedId}
        autoFocus={autoFocus}
        autoComplete={autoComplete}
        spellCheck={spellCheck}
        leadingIcon={leadingIcon}
        trailingIcon={trailingIcon}
        prefix={prefix}
        suffix={suffix}
        loading={loading}
        clearable={clearable}
        showStatusIcon={showStatusIcon}
        showCharacterCount={showCharacterCount}
        required={required}
        optional={optional}
        size={size}
        variant={variant}
        className={className}
        inputClassName={inputClassName}
        wrapperClassName={wrapperClassName}
        labelClassName={labelClassName}
        hintClassName={hintClassName}
        onKeyDown={onKeyDown}
      />
    </InputProvider>
  );
}

interface InputInnerProps {
  label?: string;
  hint?: string;
  placeholder?: string;
  name?: string;
  id?: string;
  autoFocus?: boolean;
  autoComplete?: string;
  spellCheck?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  prefix?: string;
  suffix?: string;
  loading?: boolean;
  clearable?: boolean;
  showStatusIcon?: boolean;
  showCharacterCount?: boolean;
  required?: boolean;
  optional?: boolean;
  size: InputSize;
  variant: InputVariant;
  className?: string;
  inputClassName?: string;
  wrapperClassName?: string;
  labelClassName?: string;
  hintClassName?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

function InputInner({
  label,
  hint,
  placeholder,
  name,
  id,
  autoFocus,
  autoComplete,
  spellCheck,
  leadingIcon,
  trailingIcon,
  prefix,
  suffix,
  loading,
  clearable,
  showStatusIcon,
  showCharacterCount,
  required,
  optional,
  size,
  variant,
  className = "",
  inputClassName = "",
  wrapperClassName = "",
  labelClassName = "",
  hintClassName = "",
  onKeyDown,
}: InputInnerProps) {
  const { state } = useInputContext();
  const s = sizeConfig[size];

  const hasFooter = hint || (showCharacterCount && state.maxLength !== null);

  return (
    <div className={`flex flex-col w-full ${s.gap} ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label
            htmlFor={id}
            className={`block ${s.labelText} font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 ${labelClassName}`}
          >
            {label}
            {required && (
              <span className="ml-0.5 text-red-500 dark:text-red-400">*</span>
            )}
          </label>
          {optional && (
            <span className={`${s.hintText} text-gray-400 dark:text-gray-500`}>
              Optional
            </span>
          )}
        </div>
      )}

      <InputCore
        size={size}
        variant={variant}
        placeholder={placeholder}
        name={name}
        id={id}
        autoFocus={autoFocus}
        autoComplete={autoComplete}
        spellCheck={spellCheck}
        leadingIcon={leadingIcon}
        trailingIcon={trailingIcon}
        prefix={prefix}
        suffix={suffix}
        loading={loading}
        clearable={clearable}
        showStatusIcon={showStatusIcon}
        inputClassName={inputClassName}
        wrapperClassName={wrapperClassName}
        onKeyDown={onKeyDown}
      />

      {hasFooter && (
        <div className="flex items-start justify-between gap-2">
          {hint && (
            <span className={`${s.hintText} ${statusHintColor[state.status]} leading-snug ${hintClassName}`}>
              {hint}
            </span>
          )}
          {showCharacterCount && state.maxLength !== null && (
            <span className={`shrink-0 ml-auto ${s.counterText} text-gray-400 dark:text-gray-500 tabular-nums`}>
              {state.characterCount}/{state.maxLength}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export { InputProvider, useInputContext };
export type { InputSize, InputVariant, InputStatus, InputType };