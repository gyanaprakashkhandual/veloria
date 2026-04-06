/* eslint-disable react-refresh/only-export-components */
import React, {
  useEffect,
  useRef,
  useCallback,
  useState,
  useMemo,
} from "react";
import { createPortal } from "react-dom";
import {
  DropdownProvider,
  useDropdownContext,
  type DropdownProviderProps,
  type DropdownOption,
  type DropdownSize,
  type DropdownMode,
  type DropdownAlign,
  type DropdownDivider,
  type DropdownOpenTrigger,
  type DropdownMenuState,
} from "./Dropdown.context";
import { sizeConfig, usePortalPosition } from "./utils/Dropdown.util";
import "./Dropdown.css";

const IcoChevronDown = ({ size }: { size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const IcoX = ({ size }: { size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IcoCheck = ({ size }: { size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IcoSearch = ({ size }: { size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const IcoChevronRight = ({ size }: { size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const IcoAlertCircle = ({ size }: { size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const IcoInbox = ({ size }: { size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
    <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
  </svg>
);

const IcoLoader = ({ size }: { size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="dd-loading-spinner"
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

function SkeletonItem({ size }: { size: DropdownSize }) {
  const s = sizeConfig[size];
  return (
    <div className="dd-skeleton-item" style={{ padding: s.itemPadding }}>
      <div
        className="dd-skeleton-icon"
        style={{ width: s.iconSize, height: s.iconSize }}
      />
      <div className="dd-skeleton-lines">
        <div className="dd-skeleton-line" />
        <div className="dd-skeleton-line dd-skeleton-line--short" />
      </div>
    </div>
  );
}

interface OptionTag {
  label: string;
  onRemove: () => void;
  size: DropdownSize;
}

function Tag({ label, onRemove, size }: OptionTag) {
  const s = sizeConfig[size];
  return (
    <span
      className="dd-tag"
      style={{
        fontSize: s.tagFontSize,
        padding: s.tagPadding,
        borderRadius: s.borderRadius,
      }}
    >
      <span className="dd-tag-label">{label}</span>
      <button
        type="button"
        className="dd-tag-remove"
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onRemove();
        }}
      >
        <IcoX size={s.tagCloseSize} />
      </button>
    </span>
  );
}

interface OptionRowProps {
  option: DropdownOption;
  size: DropdownSize;
  isFocused: boolean;
  isSelected: boolean;
  onMouseEnter: () => void;
  onClick: () => void;
  onClose: () => void;
  divider?: DropdownDivider;
  depth?: number;
}

function OptionRow({
  option,
  size,
  isFocused,
  isSelected,
  onMouseEnter,
  onClick,
  onClose,
  divider,
  depth = 0,
}: OptionRowProps) {
  const s = sizeConfig[size];
  const hasChildren = !!option.children?.length;
  const variant = option.variant ?? "default";
  const rowRef = useRef<HTMLDivElement>(null);
  const [submenuOpen, setSubmenuOpen] = useState(false);

  useEffect(() => {
    if (isFocused && rowRef.current) {
      rowRef.current.scrollIntoView({ block: "nearest" });
    }
  }, [isFocused]);

  const dividerStyle: React.CSSProperties = divider
    ? {
        height: divider.thickness ?? 1,
        background: divider.color ?? "var(--color-divider-primary)",
      }
    : {};

  if (option.customContent) {
    return <div className="dd-custom-content">{option.customContent}</div>;
  }

  return (
    <div
      ref={rowRef}
      className="dd-option-row"
      onMouseEnter={() => {
        onMouseEnter();
        if (hasChildren) setSubmenuOpen(true);
      }}
      onMouseLeave={() => {
        if (hasChildren) setSubmenuOpen(false);
      }}
    >
      {option.dividerBefore && depth === 0 && (
        <div
          className="dd-divider"
          style={divider ? dividerStyle : undefined}
        />
      )}

      <button
        type="button"
        disabled={option.disabled}
        onMouseDown={(e) => e.preventDefault()}
        onClick={option.disabled || hasChildren ? undefined : onClick}
        className={[
          "dd-option",
          `dd-option--${variant}`,
          isFocused ? "dd-option--focused" : "",
          isSelected ? "dd-option--selected" : "",
        ].join(" ")}
        style={{
          padding: s.itemPadding,
          fontSize: s.itemFontSize,
          borderRadius: s.borderRadius,
        }}
      >
        {option.leadingIcon && (
          <span
            className="dd-option-icon-lead"
            style={{ width: s.iconSize, height: s.iconSize }}
          >
            {option.leadingIcon}
          </span>
        )}

        <span className="dd-option-content">
          <span className="dd-option-label">{option.label}</span>
          {option.description && (
            <span
              className="dd-option-desc"
              style={{ fontSize: s.descFontSize }}
            >
              {option.description}
            </span>
          )}
        </span>

        {option.badge !== undefined && (
          <span
            className="dd-option-badge"
            style={{ fontSize: s.badgeFontSize }}
          >
            {option.badge}
          </span>
        )}

        {option.trailingText && (
          <span
            className="dd-option-trailing-text"
            style={{ fontSize: s.badgeFontSize }}
          >
            {option.trailingText}
          </span>
        )}

        {option.trailingIcon && !hasChildren && (
          <span
            className="dd-option-trailing-icon"
            style={{ width: s.iconSize - 2, height: s.iconSize - 2 }}
          >
            {option.trailingIcon}
          </span>
        )}

        {hasChildren ? (
          <span className="dd-option-chevron">
            <IcoChevronRight size={s.checkSize} />
          </span>
        ) : (
          <span
            className={`dd-option-check ${isSelected ? "dd-option-check--visible" : ""}`}
            style={{ width: s.checkSize, height: s.checkSize }}
          >
            <IcoCheck size={s.checkSize} />
          </span>
        )}
      </button>

      {hasChildren && submenuOpen && (
        <div className="dd-submenu-wrap dd-submenu-wrap--right dd-submenu-enter">
          <NestedPanel
            options={option.children!}
            size={size}
            onClose={onClose}
            divider={divider}
            depth={depth + 1}
          />
        </div>
      )}
    </div>
  );
}

interface NestedPanelProps {
  options: DropdownOption[];
  size: DropdownSize;
  onClose: () => void;
  divider?: DropdownDivider;
  depth?: number;
}

function NestedPanel({
  options,
  size,
  onClose,
  divider,
  depth = 0,
}: NestedPanelProps) {
  const { isSelected, toggleOption, state } = useDropdownContext();
  const s = sizeConfig[size];

  return (
    <div
      className="dd-panel"
      style={{ minWidth: s.panelWidth, borderRadius: s.borderRadius }}
    >
      <div
        className="dd-options"
        style={{ maxHeight: s.maxHeight, padding: s.menuPadding }}
      >
        {options.map((opt) => (
          <OptionRow
            key={opt.value}
            option={opt}
            size={size}
            isFocused={false}
            isSelected={isSelected(opt.value)}
            onMouseEnter={() => {}}
            onClick={() => {
              toggleOption(opt.value);
              if (state.mode === "single") onClose();
            }}
            onClose={onClose}
            divider={divider}
            depth={depth}
          />
        ))}
      </div>
    </div>
  );
}

interface DropdownPanelProps {
  options: DropdownOption[];
  searchable: boolean;
  searchPlaceholder: string;
  emptyLabel: string;
  emptyDescription?: string;
  showCloseButton?: boolean;
  menuState: DropdownMenuState;
  errorMessage: string;
  errorDescription?: string;
  divider?: DropdownDivider;
  panelClassName?: string;
  children?: React.ReactNode;
  onClose: () => void;
}

function DropdownPanel({
  options,
  searchable,
  searchPlaceholder,
  emptyLabel,
  emptyDescription,
  showCloseButton,
  menuState,
  errorMessage,
  errorDescription,
  divider,
  panelClassName = "",
  children,
  onClose,
}: DropdownPanelProps) {
  const {
    state,
    toggleOption,
    setSearch,
    setFocused,
    isSelected,
    triggerRef,
    panelRef,
    clear,
  } = useDropdownContext();

  const { isOpen, search, focusedIndex, size } = state;
  const s = sizeConfig[size];
  const searchRef = useRef<HTMLInputElement>(null);

  const pos = usePortalPosition(isOpen, triggerRef, panelRef, state.align);

  const filtered = useMemo(() => {
    if (!search.trim()) return options;
    const q = search.toLowerCase();
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        o.description?.toLowerCase().includes(q) ||
        o.value.toLowerCase().includes(q),
    );
  }, [options, search]);

  const grouped = useMemo(() => {
    const map = new Map<string, DropdownOption[]>();
    for (const opt of filtered) {
      const g = opt.group ?? "__none__";
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(opt);
    }
    return map;
  }, [filtered]);

  useEffect(() => {
    if (isOpen) {
      if (searchable) setTimeout(() => searchRef.current?.focus(), 10);
      setFocused(0);
    }
  }, [isOpen, searchable, setFocused]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      const t = e.target as Node;
      if (
        (panelRef.current && panelRef.current.contains(t)) ||
        (triggerRef.current && triggerRef.current.contains(t))
      )
        return;
      onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, onClose, panelRef, triggerRef]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocused(Math.min(focusedIndex + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocused(Math.max(focusedIndex - 1, 0));
      } else if (e.key === "Home") {
        e.preventDefault();
        setFocused(0);
      } else if (e.key === "End") {
        e.preventDefault();
        setFocused(filtered.length - 1);
      } else if (e.key === "Enter" || e.key === " ") {
        const opt = filtered[focusedIndex];
        if (opt && !opt.disabled) {
          e.preventDefault();
          toggleOption(opt.value);
        }
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose, focusedIndex, filtered, toggleOption, setFocused]);

  if (!isOpen) return null;

  const panelStyle: React.CSSProperties = {
    position: "fixed",
    zIndex: 9999,
    minWidth: pos.minWidth,
    borderRadius: s.borderRadius,
  };

  if (pos.top !== undefined) panelStyle.top = pos.top;
  if (pos.bottom !== undefined) panelStyle.bottom = pos.bottom;
  if (pos.left !== undefined) {
    if (state.align === "bottom-center" || state.align === "top-center") {
      panelStyle.left = pos.left;
      panelStyle.transform = "translateX(-50%)";
    } else {
      panelStyle.left = pos.left;
    }
  }
  if (pos.right !== undefined) panelStyle.right = pos.right;

  const panel = (
    <div
      ref={panelRef}
      className={`dd-panel dd-enter ${panelClassName}`}
      style={panelStyle}
      role="listbox"
      aria-multiselectable={state.mode === "multi"}
    >
      {(searchable || showCloseButton) && (
        <div
          className="dd-search-wrap"
          style={{ padding: `6px ${s.menuPadding}` }}
        >
          {searchable && (
            <div className="dd-search-inner">
              <span className="dd-search-icon">
                <IcoSearch size={s.searchIconSize} />
              </span>
              <input
                ref={searchRef}
                type="text"
                className="dd-search-input"
                value={state.search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                style={{ fontSize: s.searchFontSize }}
              />
              {state.search && (
                <button
                  type="button"
                  className="dd-search-clear"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setSearch("")}
                >
                  <IcoX size={s.searchIconSize - 1} />
                </button>
              )}
              {showCloseButton && (
                <button
                  type="button"
                  className="dd-close-btn"
                  onClick={onClose}
                  aria-label="Close"
                >
                  <IcoX size={s.searchIconSize} />
                </button>
              )}
            </div>
          )}
          {!searchable && showCloseButton && (
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="button"
                className="dd-close-btn"
                onClick={onClose}
                aria-label="Close"
              >
                <IcoX size={s.checkSize} />
              </button>
            </div>
          )}
        </div>
      )}

      <div
        className="dd-options"
        style={{ maxHeight: s.maxHeight, padding: s.menuPadding }}
      >
        {menuState === "loading" && (
          <>
            <SkeletonItem size={size} />
            <SkeletonItem size={size} />
            <SkeletonItem size={size} />
          </>
        )}

        {menuState === "error" && (
          <div className="dd-error-state">
            <span className="dd-error-icon">
              <IcoAlertCircle size={24} />
            </span>
            <span className="dd-error-text">{errorMessage}</span>
            {errorDescription && (
              <span className="dd-error-desc">{errorDescription}</span>
            )}
          </div>
        )}

        {menuState === "default" && filtered.length === 0 && (
          <div className="dd-empty">
            <span className="dd-empty-icon">
              <IcoInbox size={24} />
            </span>
            <span className="dd-empty-text">{emptyLabel}</span>
            {emptyDescription && (
              <span className="dd-empty-sub">{emptyDescription}</span>
            )}
          </div>
        )}

        {menuState === "default" &&
          filtered.length > 0 &&
          Array.from(grouped.entries()).map(([group, opts], gIdx) => (
            <React.Fragment key={group}>
              {group !== "__none__" && (
                <div
                  className={`dd-group-label ${gIdx > 0 ? "dd-group-label--bordered" : ""}`}
                  style={{ padding: s.groupPadding, fontSize: s.groupFontSize }}
                >
                  {group}
                </div>
              )}
              {opts.map((opt) => {
                const flatIdx = filtered.indexOf(opt);
                return (
                  <OptionRow
                    key={opt.value}
                    option={opt}
                    size={size}
                    isFocused={flatIdx === focusedIndex}
                    isSelected={isSelected(opt.value)}
                    onMouseEnter={() => setFocused(flatIdx)}
                    onClick={() => toggleOption(opt.value)}
                    onClose={onClose}
                    divider={divider}
                  />
                );
              })}
            </React.Fragment>
          ))}

        {menuState === "default" && children && <div>{children}</div>}
      </div>

      {state.mode === "multi" &&
        state.selected.size > 0 &&
        menuState === "default" && (
          <div
            className="dd-footer"
            style={{ padding: s.footerPadding, fontSize: s.footerFontSize }}
          >
            <span className="dd-footer-count">
              {state.selected.size} selected
            </span>
            <div style={{ display: "flex", gap: "4px" }}>
              <button
                type="button"
                className="dd-footer-clear"
                onMouseDown={(e) => e.preventDefault()}
                onClick={clear}
              >
                Clear
              </button>
              <button
                type="button"
                className="dd-footer-done"
                onMouseDown={(e) => e.preventDefault()}
                onClick={onClose}
              >
                Done
              </button>
            </div>
          </div>
        )}
    </div>
  );

  return createPortal(panel, document.body);
}

interface DropdownTriggerInnerProps {
  options: DropdownOption[];
  placeholder: string;
  clearable: boolean;
  triggerClassName?: string;
  onClose: () => void;
}

function DropdownTriggerInner({
  options,
  placeholder,
  clearable,
  triggerClassName = "",
}: DropdownTriggerInnerProps) {
  const { state, toggle, clear, triggerRef, isSelected, deselectOption } =
    useDropdownContext();
  const { size, disabled, loading, selected, mode, isOpen } = state;
  const s = sizeConfig[size];

  const selectedOptions = options.filter((o) => isSelected(o.value));
  const hasSelection = selected.size > 0;

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      clear();
    },
    [clear],
  );

  return (
    <div
      ref={triggerRef}
      role="combobox"
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      tabIndex={disabled ? -1 : 0}
      onClick={() => {
        if (!disabled && !loading) toggle();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
          e.preventDefault();
          if (!disabled && !loading) toggle();
        }
      }}
      className={[
        "dd-trigger",
        isOpen ? "dd-trigger--open" : "",
        disabled ? "dd-trigger--disabled" : "",
        triggerClassName,
      ].join(" ")}
      style={{
        height: s.triggerHeight,
        padding: s.triggerPadding,
        fontSize: s.triggerFontSize,
        borderRadius: s.borderRadius,
        gap: s.gap,
      }}
    >
      <div className="dd-trigger-value">
        {!hasSelection && (
          <span className="dd-trigger-placeholder">
            {loading ? "Loading…" : placeholder}
          </span>
        )}

        {hasSelection && mode === "single" && selectedOptions[0] && (
          <span className="dd-trigger-single">
            {selectedOptions[0].leadingIcon && (
              <span
                className="dd-trigger-icon-lead"
                style={{
                  width: s.triggerIconSize - 1,
                  height: s.triggerIconSize - 1,
                }}
              >
                {selectedOptions[0].leadingIcon}
              </span>
            )}
            <span className="dd-trigger-single-label">
              {selectedOptions[0].label}
            </span>
          </span>
        )}

        {hasSelection && mode === "multi" && (
          <>
            {selectedOptions.map((opt) => (
              <Tag
                key={opt.value}
                label={opt.label}
                size={size}
                onRemove={() => deselectOption(opt.value)}
              />
            ))}
          </>
        )}
      </div>

      <div className="dd-trigger-controls">
        {loading && (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              color: "var(--color-text-muted)",
            }}
          >
            <IcoLoader size={s.chevronSize - 1} />
          </span>
        )}

        {clearable && hasSelection && !loading && (
          <button
            type="button"
            className="dd-trigger-clear"
            onClick={handleClear}
            aria-label="Clear"
          >
            <IcoX size={s.clearSize} />
          </button>
        )}

        <span
          className={`dd-trigger-chevron ${isOpen ? "dd-trigger-chevron--open" : ""}`}
        >
          <IcoChevronDown size={s.chevronSize} />
        </span>
      </div>
    </div>
  );
}

export interface DropdownProps extends Omit<DropdownProviderProps, "children"> {
  options: DropdownOption[];
  placeholder?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  clearable?: boolean;
  emptyLabel?: string;
  emptyDescription?: string;
  showCloseButton?: boolean;
  openTrigger?: DropdownOpenTrigger;
  closeOnOutsideClick?: boolean;
  menuState?: DropdownMenuState;
  errorMessage?: string;
  errorDescription?: string;
  divider?: DropdownDivider;
  className?: string;
  triggerClassName?: string;
  panelClassName?: string;
  children?: React.ReactNode;
}

function DropdownInner({
  options,
  placeholder = "Select an option…",
  searchable = false,
  searchPlaceholder = "Search…",
  clearable = true,
  emptyLabel = "No options found",
  emptyDescription,
  showCloseButton = false,
  openTrigger = "click",
  menuState = "default",
  errorMessage = "Something went wrong",
  errorDescription,
  divider,
  triggerClassName = "",
  panelClassName = "",
  children,
}: Omit<DropdownProps, "className">) {
  const { state, open, close } = useDropdownContext();
  const wrapRef = useRef<HTMLDivElement>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClose = useCallback(() => {
    close();
  }, [close]);

  const handleMouseEnter = useCallback(() => {
    if (openTrigger !== "hover" || state.disabled) return;
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    open();
  }, [openTrigger, state.disabled, open]);

  const handleMouseLeave = useCallback(() => {
    if (openTrigger !== "hover") return;
    hoverTimerRef.current = setTimeout(() => close(), 80);
  }, [openTrigger, close]);

  return (
    <div
      ref={wrapRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ position: "relative", width: "100%" }}
    >
      <DropdownTriggerInner
        options={options}
        placeholder={placeholder}
        clearable={clearable}
        triggerClassName={triggerClassName}
        onClose={handleClose}
      />
      <DropdownPanel
        options={options}
        searchable={searchable}
        searchPlaceholder={searchPlaceholder}
        emptyLabel={emptyLabel}
        emptyDescription={emptyDescription}
        showCloseButton={showCloseButton}
        menuState={menuState}
        errorMessage={errorMessage}
        errorDescription={errorDescription}
        divider={divider}
        panelClassName={panelClassName}
        onClose={handleClose}
      >
        {children}
      </DropdownPanel>
    </div>
  );
}

export function Dropdown({
  className = "",
  size = "md",
  mode = "single",
  align = "auto",
  disabled = false,
  loading = false,
  defaultValue,
  onValueChange,
  onOpen,
  onClose,
  ...rest
}: DropdownProps) {
  return (
    <DropdownProvider
      size={size}
      mode={mode}
      align={align}
      disabled={disabled}
      loading={loading}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      onOpen={onOpen}
      onClose={onClose}
    >
      <div className={`dd-wrapper ${className}`}>
        <DropdownInner {...rest} />
      </div>
    </DropdownProvider>
  );
}

export interface ControlledDropdownProps extends Omit<
  DropdownProps,
  "defaultValue"
> {
  value: string | string[];
}

export function ControlledDropdown({
  value,
  ...rest
}: ControlledDropdownProps) {
  return (
    <Dropdown {...rest} defaultValue={value} key={JSON.stringify(value)} />
  );
}

export interface IconButtonTriggerProps {
  icon: React.ReactNode;
  size?: DropdownSize;
  variant?: "ghost" | "default";
  className?: string;
}

const iconBtnDim: Record<DropdownSize, string> = {
  xs: "26px",
  sm: "28px",
  md: "32px",
  lg: "36px",
  xl: "40px",
  "2xl": "44px",
  "3xl": "48px",
};

export function IconButtonTrigger({
  icon,
  size = "md",
  variant = "ghost",
  className = "",
}: IconButtonTriggerProps) {
  const s = sizeConfig[size];
  return (
    <button
      type="button"
      className={`dd-icon-btn-trigger dd-icon-btn-trigger--${variant} ${className}`}
      style={{ width: iconBtnDim[size], height: iconBtnDim[size] }}
    >
      <span
        style={{
          width: s.triggerIconSize,
          height: s.triggerIconSize,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </span>
    </button>
  );
}

export { DropdownProvider, useDropdownContext };
export type {
  DropdownOption,
  DropdownSize,
  DropdownMode,
  DropdownAlign,
  DropdownDivider,
  DropdownOpenTrigger,
  DropdownMenuState,
};
