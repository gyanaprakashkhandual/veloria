import React, {
  useCallback,
  useRef,
  useState,
  useEffect,
  useMemo,
} from "react";
import { motion, AnimatePresence, Reorder, useDragControls } from "framer-motion";
import {
  GripVertical,
  Check,
  ChevronRight,
  Loader2,
  Search,
  X,
  ChevronsUpDown,
  ArrowUpDown,
} from "lucide-react";
import {
  ListProvider,
  useListContext,
  type ListProviderProps,
  type ListItemData,
  type ListSize,
  type ListVariant,
  type ListDensity,
  type ListSelectionMode,
  type ListItemVariant,
} from "./List.context";

const sizeConfig: Record<
  ListSize,
  {
    itemPx: string;
    itemPy: string;
    itemText: string;
    descText: string;
    metaText: string;
    iconSize: number;
    avatarSize: string;
    avatarText: string;
    badgePx: string;
    badgePy: string;
    badgeText: string;
    checkSize: number;
    checkBox: string;
    headerText: string;
    headerPx: string;
    headerPy: string;
    gripSize: number;
    gap: string;
    searchPx: string;
    searchPy: string;
    searchText: string;
    searchIconSize: number;
    emptyPy: string;
    emptyIconSize: number;
    emptyText: string;
    emptySubText: string;
    toolbarPx: string;
    toolbarPy: string;
    toolbarText: string;
  }
> = {
  sm: {
    itemPx: "px-2.5",
    itemPy: "py-1.5",
    itemText: "text-xs",
    descText: "text-[10px]",
    metaText: "text-[10px]",
    iconSize: 14,
    avatarSize: "w-6 h-6",
    avatarText: "text-[10px]",
    badgePx: "px-1.5",
    badgePy: "py-0.5",
    badgeText: "text-[9px]",
    checkSize: 12,
    checkBox: "w-3.5 h-3.5",
    headerText: "text-[9px]",
    headerPx: "px-2.5",
    headerPy: "py-1",
    gripSize: 13,
    gap: "gap-1.5",
    searchPx: "px-2.5",
    searchPy: "py-1.5",
    searchText: "text-xs",
    searchIconSize: 13,
    emptyPy: "py-8",
    emptyIconSize: 28,
    emptyText: "text-xs",
    emptySubText: "text-[10px]",
    toolbarPx: "px-2.5",
    toolbarPy: "py-1.5",
    toolbarText: "text-[10px]",
  },
  md: {
    itemPx: "px-3",
    itemPy: "py-2",
    itemText: "text-sm",
    descText: "text-xs",
    metaText: "text-xs",
    iconSize: 16,
    avatarSize: "w-8 h-8",
    avatarText: "text-xs",
    badgePx: "px-2",
    badgePy: "py-0.5",
    badgeText: "text-[10px]",
    checkSize: 13,
    checkBox: "w-4 h-4",
    headerText: "text-[10px]",
    headerPx: "px-3",
    headerPy: "py-1.5",
    gripSize: 15,
    gap: "gap-2",
    searchPx: "px-3",
    searchPy: "py-2",
    searchText: "text-sm",
    searchIconSize: 15,
    emptyPy: "py-12",
    emptyIconSize: 36,
    emptyText: "text-sm",
    emptySubText: "text-xs",
    toolbarPx: "px-3",
    toolbarPy: "py-2",
    toolbarText: "text-xs",
  },
  lg: {
    itemPx: "px-4",
    itemPy: "py-2.5",
    itemText: "text-sm",
    descText: "text-xs",
    metaText: "text-xs",
    iconSize: 17,
    avatarSize: "w-9 h-9",
    avatarText: "text-sm",
    badgePx: "px-2",
    badgePy: "py-0.5",
    badgeText: "text-xs",
    checkSize: 14,
    checkBox: "w-4 h-4",
    headerText: "text-[10px]",
    headerPx: "px-4",
    headerPy: "py-2",
    gripSize: 16,
    gap: "gap-2.5",
    searchPx: "px-4",
    searchPy: "py-2.5",
    searchText: "text-sm",
    searchIconSize: 16,
    emptyPy: "py-14",
    emptyIconSize: 40,
    emptyText: "text-sm",
    emptySubText: "text-xs",
    toolbarPx: "px-4",
    toolbarPy: "py-2",
    toolbarText: "text-sm",
  },
  xl: {
    itemPx: "px-5",
    itemPy: "py-3",
    itemText: "text-base",
    descText: "text-sm",
    metaText: "text-sm",
    iconSize: 18,
    avatarSize: "w-10 h-10",
    avatarText: "text-sm",
    badgePx: "px-2.5",
    badgePy: "py-1",
    badgeText: "text-xs",
    checkSize: 15,
    checkBox: "w-4.5 h-4.5",
    headerText: "text-xs",
    headerPx: "px-5",
    headerPy: "py-2",
    gripSize: 17,
    gap: "gap-3",
    searchPx: "px-5",
    searchPy: "py-3",
    searchText: "text-base",
    searchIconSize: 17,
    emptyPy: "py-16",
    emptyIconSize: 44,
    emptyText: "text-base",
    emptySubText: "text-sm",
    toolbarPx: "px-5",
    toolbarPy: "py-2.5",
    toolbarText: "text-sm",
  },
};

const densityModifier: Record<ListDensity, string> = {
  compact: "scale-y-[0.82] origin-top",
  comfortable: "",
  spacious: "scale-y-[1.25] origin-top",
};

const variantWrappers: Record<
  ListVariant,
  { outer: string; inner: string; itemDivider: string }
> = {
  default: {
    outer: "bg-white dark:bg-gray-900 rounded-xl overflow-hidden",
    inner: "",
    itemDivider: "",
  },
  bordered: {
    outer:
      "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm shadow-black/5 dark:shadow-black/20",
    inner: "",
    itemDivider: "",
  },
  card: {
    outer: "space-y-1.5",
    inner: "",
    itemDivider: "",
  },
  ghost: {
    outer: "",
    inner: "",
    itemDivider: "",
  },
  divided: {
    outer: "bg-white dark:bg-gray-900 rounded-xl overflow-hidden",
    inner: "divide-y divide-gray-100 dark:divide-gray-800",
    itemDivider: "",
  },
};

const itemVariantStyles: Record<
  ListItemVariant,
  {
    base: string;
    selected: string;
    hover: string;
    active: string;
    labelColor: string;
    descColor: string;
    metaColor: string;
    iconColor: string;
    badgeBg: string;
  }
> = {
  default: {
    base: "text-gray-700 dark:text-gray-300",
    selected: "bg-gray-100 dark:bg-gray-800",
    hover: "hover:bg-gray-50 dark:hover:bg-gray-800/70",
    active: "bg-gray-100 dark:bg-gray-800 ring-1 ring-gray-300 dark:ring-gray-600",
    labelColor: "text-gray-800 dark:text-gray-200",
    descColor: "text-gray-500 dark:text-gray-400",
    metaColor: "text-gray-400 dark:text-gray-500",
    iconColor: "text-gray-400 dark:text-gray-500",
    badgeBg: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400",
  },
  danger: {
    base: "text-red-700 dark:text-red-400",
    selected: "bg-red-50 dark:bg-red-950/40",
    hover: "hover:bg-red-50 dark:hover:bg-red-950/30",
    active: "bg-red-50 dark:bg-red-950/40 ring-1 ring-red-200 dark:ring-red-800",
    labelColor: "text-red-800 dark:text-red-300",
    descColor: "text-red-500 dark:text-red-400",
    metaColor: "text-red-400 dark:text-red-500",
    iconColor: "text-red-400 dark:text-red-500",
    badgeBg: "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300",
  },
  warning: {
    base: "text-amber-700 dark:text-amber-400",
    selected: "bg-amber-50 dark:bg-amber-950/40",
    hover: "hover:bg-amber-50 dark:hover:bg-amber-950/30",
    active: "bg-amber-50 dark:bg-amber-950/40 ring-1 ring-amber-200 dark:ring-amber-800",
    labelColor: "text-amber-800 dark:text-amber-300",
    descColor: "text-amber-500 dark:text-amber-400",
    metaColor: "text-amber-400 dark:text-amber-500",
    iconColor: "text-amber-400 dark:text-amber-500",
    badgeBg: "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300",
  },
  success: {
    base: "text-emerald-700 dark:text-emerald-400",
    selected: "bg-emerald-50 dark:bg-emerald-950/40",
    hover: "hover:bg-emerald-50 dark:hover:bg-emerald-950/30",
    active: "bg-emerald-50 dark:bg-emerald-950/40 ring-1 ring-emerald-200 dark:ring-emerald-800",
    labelColor: "text-emerald-800 dark:text-emerald-300",
    descColor: "text-emerald-500 dark:text-emerald-400",
    metaColor: "text-emerald-400 dark:text-emerald-500",
    iconColor: "text-emerald-400 dark:text-emerald-500",
    badgeBg: "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300",
  },
  info: {
    base: "text-blue-700 dark:text-blue-400",
    selected: "bg-blue-50 dark:bg-blue-950/40",
    hover: "hover:bg-blue-50 dark:hover:bg-blue-950/30",
    active: "bg-blue-50 dark:bg-blue-950/40 ring-1 ring-blue-200 dark:ring-blue-800",
    labelColor: "text-blue-800 dark:text-blue-300",
    descColor: "text-blue-500 dark:text-blue-400",
    metaColor: "text-blue-400 dark:text-blue-500",
    iconColor: "text-blue-400 dark:text-blue-500",
    badgeBg: "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300",
  },
};

const badgeVariantStyles: Record<string, string> = {
  default: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400",
  danger: "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300",
  warning: "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300",
  success: "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300",
  info: "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300",
};

interface AvatarProps {
  avatar: NonNullable<ListItemData["avatar"]>;
  size: ListSize;
  variant: ListItemVariant;
}

function Avatar({ avatar, size, variant }: AvatarProps) {
  const s = sizeConfig[size];
  const v = itemVariantStyles[variant];
  const [imgError, setImgError] = useState(false);

  if (avatar.src && !imgError) {
    return (
      <img
        src={avatar.src}
        alt={avatar.alt ?? ""}
        onError={() => setImgError(true)}
        className={`${s.avatarSize} rounded-full object-cover shrink-0 ring-1 ring-gray-200 dark:ring-gray-700`}
      />
    );
  }

  const initials = avatar.fallback
    ? avatar.fallback
    : avatar.alt
    ? avatar.alt
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  return (
    <div
      className={`${s.avatarSize} rounded-full shrink-0 flex items-center justify-center font-semibold ${s.avatarText} ${v.selected} ${v.iconColor}`}
    >
      {initials}
    </div>
  );
}

interface DragHandleProps {
  dragControls: ReturnType<typeof useDragControls>;
  size: ListSize;
}

function DragHandle({ dragControls, size }: DragHandleProps) {
  const s = sizeConfig[size];
  return (
    <div
      className="shrink-0 flex items-center cursor-grab active:cursor-grabbing text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 touch-none select-none transition-colors duration-100"
      onPointerDown={(e) => dragControls.start(e)}
    >
      <GripVertical size={s.gripSize} />
    </div>
  );
}

interface CheckboxProps {
  checked: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  onChange: () => void;
  size: ListSize;
}

function Checkbox({ checked, indeterminate, disabled, onChange, size }: CheckboxProps) {
  const s = sizeConfig[size];
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={indeterminate ? "mixed" : checked}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      className={`
        shrink-0 ${s.checkBox} rounded flex items-center justify-center border-2 transition-all duration-100
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-1
        ${
          checked || indeterminate
            ? "bg-gray-900 dark:bg-gray-100 border-gray-900 dark:border-gray-100"
            : "bg-transparent border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
        }
        ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      {indeterminate ? (
        <span className="w-2 h-0.5 bg-white dark:bg-gray-900 rounded-full" />
      ) : checked ? (
        <Check size={s.checkSize - 2} className="text-white dark:text-gray-900" strokeWidth={3} />
      ) : null}
    </button>
  );
}

interface ListItemRowProps {
  item: ListItemData;
  index: number;
  isCard: boolean;
  className?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  metadataClassName?: string;
  actionsClassName?: string;
}

function ListItemRow({
  item,
  index,
  isCard,
  className = "",
  labelClassName = "",
  descriptionClassName = "",
  metadataClassName = "",
  actionsClassName = "",
}: ListItemRowProps) {
  const {
    state,
    toggleSelect,
    setActive,
    setFocused,
    onItemClick,
    dispatch,
  } = useListContext();

  const { size, variant, selectionMode, isReorderable, activeId } = state;
  const s = sizeConfig[size];
  const itemVariant = item.variant ?? "default";
  const v = itemVariantStyles[itemVariant];
  const isSelected = state.selectedIds.has(item.id);
  const isActive = activeId === item.id;
  const dragControls = useDragControls();
  const isDragging = state.dragState.draggingId === item.id;
  const isOver = state.dragState.overId === item.id;

  const handleClick = useCallback(() => {
    if (item.disabled) return;
    if (selectionMode !== "none") toggleSelect(item.id);
    setActive(item.id);
    onItemClick?.(item);
  }, [item, selectionMode, toggleSelect, setActive, onItemClick]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (item.disabled) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick();
      }
    },
    [item.disabled, handleClick]
  );

  const isClickable =
    selectionMode !== "none" || !!onItemClick || !!item.href;

  const itemContent = (
    <div
      className={`
        flex items-center ${s.gap} ${s.itemPx} ${s.itemPy}
        transition-colors duration-100 outline-none group relative w-full
        ${isCard ? "rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm shadow-black/5 dark:shadow-black/20" : ""}
        ${isCard && isSelected ? "ring-1 ring-gray-400 dark:ring-gray-500 border-gray-400 dark:border-gray-500" : ""}
        ${!isCard && isSelected ? v.selected : ""}
        ${!isCard && isActive && !isSelected ? v.active : ""}
        ${isClickable && !item.disabled && !isCard ? v.hover : ""}
        ${isClickable && !item.disabled && isCard ? "hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md" : ""}
        ${item.disabled ? "opacity-40 cursor-not-allowed" : isClickable ? "cursor-pointer" : "cursor-default"}
        ${isDragging ? "opacity-50 scale-[1.02] z-10 shadow-lg" : ""}
        ${isOver && !isDragging ? "ring-1 ring-blue-400 dark:ring-blue-500" : ""}
        ${className}
      `}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable && !item.disabled ? 0 : undefined}
      aria-selected={isSelected}
      aria-disabled={item.disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onFocus={() => setFocused(item.id)}
      onBlur={() => setFocused(null)}
    >
      {isReorderable && <DragHandle dragControls={dragControls} size={size} />}

      {selectionMode === "checkbox" && (
        <Checkbox
          checked={isSelected}
          disabled={item.disabled}
          onChange={() => toggleSelect(item.id)}
          size={size}
        />
      )}

      {selectionMode === "single" && isSelected && !item.leadingIcon && !item.avatar && (
        <Check
          size={s.iconSize - 2}
          className="shrink-0 text-gray-700 dark:text-gray-300"
          strokeWidth={2.5}
        />
      )}

      {item.avatar ? (
        <Avatar avatar={item.avatar} size={size} variant={itemVariant} />
      ) : item.leadingIcon ? (
        <span
          className={`shrink-0 flex items-center justify-center ${v.iconColor}`}
          style={{ width: s.iconSize, height: s.iconSize }}
        >
          {React.cloneElement(item.leadingIcon as React.ReactElement, {
            size: s.iconSize,
          })}
        </span>
      ) : null}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={`block truncate font-medium ${s.itemText} ${v.labelColor} ${labelClassName}`}
          >
            {item.label}
          </span>
          {item.badge && (
            <span
              className={`shrink-0 inline-flex items-center font-semibold rounded-full ${s.badgePx} ${s.badgePy} ${s.badgeText} uppercase tracking-wide ${badgeVariantStyles[item.badge.variant ?? "default"]}`}
            >
              {item.badge.label}
            </span>
          )}
        </div>
        {item.description && (
          <span
            className={`block truncate ${s.descText} ${v.descColor} mt-0.5 font-normal ${descriptionClassName}`}
          >
            {item.description}
          </span>
        )}
      </div>

      {item.metadata && (
        <span
          className={`shrink-0 ${s.metaText} ${v.metaColor} font-normal whitespace-nowrap ${metadataClassName}`}
        >
          {item.metadata}
        </span>
      )}

      {item.loading && (
        <Loader2
          size={s.iconSize - 2}
          className="shrink-0 animate-spin text-gray-400 dark:text-gray-500"
        />
      )}

      {item.actions && !item.loading && (
        <div
          className={`shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-100 ${actionsClassName}`}
          onClick={(e) => e.stopPropagation()}
        >
          {item.actions}
        </div>
      )}

      {item.trailingIcon && !item.loading && !item.actions && (
        <span
          className={`shrink-0 flex items-center justify-center ${v.iconColor}`}
          style={{ width: s.iconSize - 2, height: s.iconSize - 2 }}
        >
          {React.cloneElement(item.trailingIcon as React.ReactElement, {
            size: s.iconSize - 2,
          })}
        </span>
      )}

      {isClickable && !item.trailingIcon && !item.loading && !item.actions && selectionMode === "none" && (
        <ChevronRight
          size={s.iconSize - 3}
          className={`shrink-0 ${v.iconColor} opacity-0 group-hover:opacity-100 transition-opacity duration-100`}
        />
      )}
    </div>
  );

  if (isReorderable) {
    return (
      <Reorder.Item
        value={item}
        dragListener={false}
        dragControls={dragControls}
        as="li"
        className="list-none"
        onDragStart={() =>
          dispatch({
            type: "SET_DRAG_STATE",
            payload: { draggingId: item.id, isDragging: true },
          })
        }
        onDragEnd={() => dispatch({ type: "RESET_DRAG" })}
        layout
        transition={{ duration: 0.18 }}
      >
        {itemContent}
      </Reorder.Item>
    );
  }

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.15 }}
      className="list-none"
    >
      {itemContent}
    </motion.li>
  );
}

export interface ListToolbarProps {
  showSearch?: boolean;
  showSelectAll?: boolean;
  showCount?: boolean;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  searchValue?: string;
  sortOptions?: { label: string; value: string }[];
  onSortChange?: (value: string) => void;
  sortValue?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function ListToolbar({
  showSearch = false,
  showSelectAll = false,
  showCount = false,
  searchPlaceholder = "Search...",
  onSearchChange,
  searchValue = "",
  sortOptions,
  onSortChange,
  sortValue,
  actions,
  className = "",
}: ListToolbarProps) {
  const { state, selectAll, deselectAll } = useListContext();
  const { size, selectionMode, selectedIds, items } = state;
  const s = sizeConfig[size];
  const allSelected =
    selectedIds.size === items.filter((i) => !i.disabled).length &&
    items.length > 0;
  const someSelected = selectedIds.size > 0 && !allSelected;

  return (
    <div
      className={`flex flex-wrap items-center gap-2 border-b border-gray-100 dark:border-gray-800 ${s.toolbarPx} ${s.toolbarPy} bg-gray-50/60 dark:bg-gray-900/60 ${className}`}
    >
      {showSelectAll && selectionMode === "checkbox" && (
        <Checkbox
          checked={allSelected}
          indeterminate={someSelected}
          onChange={allSelected ? deselectAll : selectAll}
          size={size}
        />
      )}

      {showSearch && (
        <div className="relative flex-1 min-w-[120px]">
          <Search
            size={s.searchIconSize}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none"
          />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder={searchPlaceholder}
            className={`w-full pl-8 pr-8 ${s.searchPy} ${s.searchText} bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 transition-all duration-100`}
          />
          {searchValue && (
            <button
              type="button"
              onClick={() => onSearchChange?.("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X size={s.searchIconSize - 2} />
            </button>
          )}
        </div>
      )}

      {sortOptions && sortOptions.length > 0 && (
        <div className="relative">
          <select
            value={sortValue}
            onChange={(e) => onSortChange?.(e.target.value)}
            className={`appearance-none pl-3 pr-7 ${s.searchPy} ${s.searchText} bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 transition-all duration-100 cursor-pointer`}
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ArrowUpDown
            size={s.searchIconSize - 3}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none"
          />
        </div>
      )}

      {showCount && (
        <span className={`${s.toolbarText} text-gray-500 dark:text-gray-400 ml-auto`}>
          {selectedIds.size > 0
            ? `${selectedIds.size} of ${items.length} selected`
            : `${items.length} item${items.length !== 1 ? "s" : ""}`}
        </span>
      )}

      {actions && (
        <div className="flex items-center gap-1.5 ml-auto">{actions}</div>
      )}
    </div>
  );
}

export interface ListEmptyProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function ListEmpty({
  icon,
  title = "No items",
  description,
  action,
  className = "",
}: ListEmptyProps) {
  const { state } = useListContext();
  const s = sizeConfig[state.size];

  return (
    <li
      className={`list-none flex flex-col items-center justify-center text-center ${s.emptyPy} px-6 ${className}`}
    >
      {icon && (
        <span
          className="text-gray-300 dark:text-gray-700 mb-3"
          style={{ fontSize: s.emptyIconSize }}
        >
          {icon}
        </span>
      )}
      <p className={`font-semibold ${s.emptyText} text-gray-500 dark:text-gray-400`}>
        {title}
      </p>
      {description && (
        <p className={`mt-1 ${s.emptySubText} text-gray-400 dark:text-gray-500 max-w-xs`}>
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </li>
  );
}

export interface ListSectionHeaderProps {
  label: string;
  className?: string;
}

export function ListSectionHeader({ label, className = "" }: ListSectionHeaderProps) {
  const { state } = useListContext();
  const s = sizeConfig[state.size];

  return (
    <li
      className={`list-none ${s.headerPx} ${s.headerPy} ${s.headerText} font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 select-none ${className}`}
    >
      {label}
    </li>
  );
}

export interface ListLoadingProps {
  rows?: number;
  className?: string;
}

export function ListLoading({ rows = 4, className = "" }: ListLoadingProps) {
  const { state } = useListContext();
  const s = sizeConfig[state.size];

  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <li
          key={i}
          className={`list-none flex items-center ${s.gap} ${s.itemPx} ${s.itemPy} ${className}`}
        >
          <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 animate-pulse shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div
              className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse"
              style={{ width: `${55 + (i % 3) * 15}%` }}
            />
            <div
              className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse"
              style={{ width: `${35 + (i % 2) * 20}%` }}
            />
          </div>
          <div className="w-12 h-3 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse shrink-0" />
        </li>
      ))}
    </>
  );
}

export interface ListDividerProps {
  className?: string;
}

export function ListDivider({ className = "" }: ListDividerProps) {
  return (
    <li className={`list-none border-t border-gray-100 dark:border-gray-800 my-1 ${className}`} />
  );
}

interface ListInnerProps {
  toolbar?: React.ReactNode;
  empty?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  wrapperClassName?: string;
  listClassName?: string;
  itemClassName?: string;
  itemLabelClassName?: string;
  itemDescriptionClassName?: string;
  itemMetadataClassName?: string;
  itemActionsClassName?: string;
  renderItem?: (item: ListItemData, index: number) => React.ReactNode;
}

function ListInner({
  toolbar,
  empty,
  footer,
  className = "",
  wrapperClassName = "",
  listClassName = "",
  itemClassName = "",
  itemLabelClassName = "",
  itemDescriptionClassName = "",
  itemMetadataClassName = "",
  itemActionsClassName = "",
  renderItem,
}: ListInnerProps) {
  const { state, reorderItems } = useListContext();
  const { items, variant, size, isLoading, isReorderable } = state;
  const vw = variantWrappers[variant];
  const isCard = variant === "card";
  const s = sizeConfig[size];

  const handleReorder = useCallback(
    (newOrder: ListItemData[]) => {
      const fromIndex = state.items.findIndex(
        (item) => item.id !== newOrder[state.items.indexOf(item)]?.id
      );
      state.items.forEach((item, i) => {
        if (item.id !== newOrder[i]?.id) {
          const newIdx = newOrder.findIndex((ni) => ni.id === item.id);
          if (newIdx !== -1 && newIdx !== i) {
            reorderItems(i, newIdx);
          }
        }
      });
    },
    [state.items, reorderItems]
  );

  const isEmpty = !isLoading && items.length === 0;

  const listEl = isReorderable ? (
    <Reorder.Group
      axis="y"
      values={items}
      onReorder={(newOrder) => {
        const fromIdx = items.findIndex(
          (item, i) => item.id !== (newOrder[i] as ListItemData)?.id
        );
        if (fromIdx !== -1) {
          const newIdx = (newOrder as ListItemData[]).findIndex(
            (ni) => ni.id === items[fromIdx].id
          );
          reorderItems(fromIdx, newIdx);
        }
      }}
      as="ul"
      className={`${vw.inner} ${isCard ? "space-y-1.5 p-1" : "p-1"} ${listClassName}`}
    >
      {isLoading && <ListLoading />}
      {!isLoading && isEmpty && (
        empty ?? (
          <ListEmpty
            title="No items yet"
            description="Nothing to display here."
          />
        )
      )}
      {!isLoading &&
        items.map((item, index) =>
          renderItem ? (
            <React.Fragment key={item.id}>
              {renderItem(item, index)}
            </React.Fragment>
          ) : (
            <React.Fragment key={item.id}>
              {item.dividerBefore && index > 0 && <ListDivider />}
              {item.header && <ListSectionHeader label={item.header} />}
              <ListItemRow
                item={item}
                index={index}
                isCard={isCard}
                className={itemClassName}
                labelClassName={itemLabelClassName}
                descriptionClassName={itemDescriptionClassName}
                metadataClassName={itemMetadataClassName}
                actionsClassName={itemActionsClassName}
              />
            </React.Fragment>
          )
        )}
    </Reorder.Group>
  ) : (
    <ul
      className={`${vw.inner} ${isCard ? "space-y-1.5 p-1" : "p-1"} ${listClassName}`}
      role="listbox"
      aria-multiselectable={state.selectionMode === "multiple" || state.selectionMode === "checkbox"}
    >
      <AnimatePresence initial={false}>
        {isLoading && <ListLoading />}
        {!isLoading && isEmpty && (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {empty ?? (
              <ListEmpty
                title="No items yet"
                description="Nothing to display here."
              />
            )}
          </motion.div>
        )}
        {!isLoading &&
          items.map((item, index) =>
            renderItem ? (
              <React.Fragment key={item.id}>
                {renderItem(item, index)}
              </React.Fragment>
            ) : (
              <React.Fragment key={item.id}>
                {item.dividerBefore && index > 0 && <ListDivider />}
                {item.header && <ListSectionHeader label={item.header} />}
                <ListItemRow
                  item={item}
                  index={index}
                  isCard={isCard}
                  className={itemClassName}
                  labelClassName={itemLabelClassName}
                  descriptionClassName={itemDescriptionClassName}
                  metadataClassName={itemMetadataClassName}
                  actionsClassName={itemActionsClassName}
                />
              </React.Fragment>
            )
          )}
      </AnimatePresence>
    </ul>
  );

  return (
    <div className={`w-full ${vw.outer} ${wrapperClassName} ${className}`}>
      {toolbar}
      {listEl}
      {footer && (
        <div className={`border-t border-gray-100 dark:border-gray-800 ${s.toolbarPx} ${s.toolbarPy} bg-gray-50/60 dark:bg-gray-900/60`}>
          {footer}
        </div>
      )}
    </div>
  );
}

export interface ListProps extends Omit<ListProviderProps, "children"> {
  toolbar?: React.ReactNode;
  empty?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  wrapperClassName?: string;
  listClassName?: string;
  itemClassName?: string;
  itemLabelClassName?: string;
  itemDescriptionClassName?: string;
  itemMetadataClassName?: string;
  itemActionsClassName?: string;
  renderItem?: (item: ListItemData, index: number) => React.ReactNode;
}

export function List({
  items,
  size = "md",
  variant = "bordered",
  density = "comfortable",
  selectionMode = "none",
  isReorderable = false,
  isLoading = false,
  defaultSelectedIds = [],
  defaultActiveId = null,
  onItemClick,
  onSelectionChange,
  onReorder,
  toolbar,
  empty,
  footer,
  className = "",
  wrapperClassName = "",
  listClassName = "",
  itemClassName = "",
  itemLabelClassName = "",
  itemDescriptionClassName = "",
  itemMetadataClassName = "",
  itemActionsClassName = "",
  renderItem,
}: ListProps) {
  return (
    <ListProvider
      items={items}
      size={size}
      variant={variant}
      density={density}
      selectionMode={selectionMode}
      isReorderable={isReorderable}
      isLoading={isLoading}
      defaultSelectedIds={defaultSelectedIds}
      defaultActiveId={defaultActiveId}
      onItemClick={onItemClick}
      onSelectionChange={onSelectionChange}
      onReorder={onReorder}
    >
      <ListInner
        toolbar={toolbar}
        empty={empty}
        footer={footer}
        className={className}
        wrapperClassName={wrapperClassName}
        listClassName={listClassName}
        itemClassName={itemClassName}
        itemLabelClassName={itemLabelClassName}
        itemDescriptionClassName={itemDescriptionClassName}
        itemMetadataClassName={itemMetadataClassName}
        itemActionsClassName={itemActionsClassName}
        renderItem={renderItem}
      />
    </ListProvider>
  );
}

export {
  ListProvider,
  useListContext,
  type ListItemData,
  type ListSize,
  type ListVariant,
  type ListDensity,
  type ListSelectionMode,
  type ListItemVariant,
};