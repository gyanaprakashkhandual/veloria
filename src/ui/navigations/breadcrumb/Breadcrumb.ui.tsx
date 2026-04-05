import React, { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import {
  BreadcrumbProvider,
  useBreadcrumbContext,
  type BreadcrumbProviderProps,
  type BreadcrumbItem,
  type BreadcrumbSize,
  type BreadcrumbVariant,
  type BreadcrumbSeparatorType,
} from "./Breadcrumb.context";

const sizeConfig = {
  sm: {
    text: "text-xs",
    iconSize: 12,
    itemPx: "px-1.5",
    itemPy: "py-0.5",
    separatorSize: 10,
    collapsedPx: "px-1.5",
    collapsedPy: "py-0.5",
    collapsedText: "text-xs",
    dotSize: "w-1 h-1",
    gap: "gap-0.5",
    iconGap: "gap-1",
    roundedItem: "rounded-md",
  },
  md: {
    text: "text-sm",
    iconSize: 14,
    itemPx: "px-2",
    itemPy: "py-1",
    separatorSize: 12,
    collapsedPx: "px-2",
    collapsedPy: "py-1",
    collapsedText: "text-sm",
    dotSize: "w-1.5 h-1.5",
    gap: "gap-1",
    iconGap: "gap-1.5",
    roundedItem: "rounded-lg",
  },
  lg: {
    text: "text-sm",
    iconSize: 15,
    itemPx: "px-2.5",
    itemPy: "py-1.5",
    separatorSize: 13,
    collapsedPx: "px-2.5",
    collapsedPy: "py-1.5",
    collapsedText: "text-sm",
    dotSize: "w-1.5 h-1.5",
    gap: "gap-1",
    iconGap: "gap-2",
    roundedItem: "rounded-lg",
  },
  xl: {
    text: "text-base",
    iconSize: 16,
    itemPx: "px-3",
    itemPy: "py-1.5",
    separatorSize: 14,
    collapsedPx: "px-3",
    collapsedPy: "py-1.5",
    collapsedText: "text-base",
    dotSize: "w-2 h-2",
    gap: "gap-1.5",
    iconGap: "gap-2",
    roundedItem: "rounded-xl",
  },
};

const variantItemStyles: Record<
  BreadcrumbVariant,
  { active: string; inactive: string; disabled: string; collapsed: string }
> = {
  default: {
    active:
      "text-gray-900 dark:text-white font-semibold cursor-default",
    inactive:
      "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 font-medium",
    disabled: "text-gray-300 dark:text-gray-600 cursor-not-allowed font-medium",
    collapsed:
      "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800",
  },
  filled: {
    active:
      "bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold",
    inactive:
      "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white font-medium",
    disabled:
      "text-gray-300 dark:text-gray-600 cursor-not-allowed font-medium",
    collapsed:
      "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white",
  },
  ghost: {
    active: "text-gray-900 dark:text-white font-semibold cursor-default",
    inactive:
      "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium",
    disabled: "text-gray-300 dark:text-gray-600 cursor-not-allowed font-medium",
    collapsed:
      "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white",
  },
  underline: {
    active:
      "text-gray-900 dark:text-white font-semibold border-b-2 border-gray-900 dark:border-white cursor-default",
    inactive:
      "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-b-2 hover:border-gray-400 dark:hover:border-gray-500 font-medium",
    disabled:
      "text-gray-300 dark:text-gray-600 cursor-not-allowed font-medium",
    collapsed:
      "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white",
  },
};

function BreadcrumbSeparator({
  type,
  size,
  customSeparator,
}: {
  type: BreadcrumbSeparatorType;
  size: BreadcrumbSize;
  customSeparator?: React.ReactNode;
}) {
  const s = sizeConfig[size];

  if (type === "custom" && customSeparator) {
    return (
      <span className="shrink-0 flex items-center text-gray-300 dark:text-gray-600 select-none">
        {customSeparator}
      </span>
    );
  }

  if (type === "dot") {
    return (
      <span
        className={`shrink-0 ${s.dotSize} rounded-full bg-gray-300 dark:bg-gray-600 select-none`}
      />
    );
  }

  if (type === "arrow") {
    return (
      <svg
        width={s.separatorSize}
        height={s.separatorSize}
        viewBox="0 0 12 12"
        fill="none"
        className="shrink-0 text-gray-300 dark:text-gray-600 select-none"
      >
        <path
          d="M2 6h8M7 3l3 3-3 3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (type === "slash") {
    return (
      <span
        className={`shrink-0 text-gray-300 dark:text-gray-600 select-none font-light`}
        style={{ fontSize: s.separatorSize + 2 }}
      >
        /
      </span>
    );
  }

  return (
    <ChevronRight
      size={s.separatorSize}
      className="shrink-0 text-gray-300 dark:text-gray-600 select-none"
    />
  );
}

interface BreadcrumbItemNodeProps {
  item: BreadcrumbItem;
  isLast: boolean;
  size: BreadcrumbSize;
  variant: BreadcrumbVariant;
  separatorType: BreadcrumbSeparatorType;
  customSeparator?: React.ReactNode;
  itemClassName?: string;
  activeItemClassName?: string;
}

function BreadcrumbItemNode({
  item,
  isLast,
  size,
  variant,
  separatorType,
  customSeparator,
  itemClassName = "",
  activeItemClassName = "",
}: BreadcrumbItemNodeProps) {
  const { setActive, onItemClick } = useBreadcrumbContext();
  const s = sizeConfig[size];
  const styles = variantItemStyles[variant];

  const handleClick = useCallback(() => {
    if (item.disabled || isLast) return;
    item.onClick?.();
    onItemClick?.(item);
    setActive(item.id);
  }, [item, isLast, onItemClick, setActive]);

  const itemStyle = item.disabled
    ? styles.disabled
    : isLast
      ? styles.active
      : styles.inactive;

  const transitionClass =
    variant !== "underline"
      ? "transition-colors duration-100"
      : "transition-all duration-100";

  return (
    <li className="flex items-center shrink-0">
      <div className={`flex items-center ${s.gap}`}>
        {item.href && !isLast && !item.disabled ? (
          <a
            href={item.href}
            onClick={(e) => {
              e.preventDefault();
              handleClick();
            }}
            aria-current={isLast ? "page" : undefined}
            className={`
              flex items-center ${s.iconGap} ${s.itemPx} ${s.itemPy} ${s.roundedItem}
              ${s.text} ${transitionClass}
              ${itemStyle}
              ${itemClassName}
              ${isLast ? activeItemClassName : ""}
            `}
          >
            {item.icon && (
              <span
                className="shrink-0 flex items-center"
                style={{ width: s.iconSize, height: s.iconSize }}
              >
                {item.icon}
              </span>
            )}
            <span className="truncate">{item.label}</span>
          </a>
        ) : (
          <button
            type="button"
            disabled={item.disabled || isLast}
            onClick={handleClick}
            aria-current={isLast ? "page" : undefined}
            className={`
              flex items-center ${s.iconGap} ${s.itemPx} ${s.itemPy} ${s.roundedItem}
              ${s.text} ${transitionClass}
              ${item.disabled || isLast ? "cursor-default" : "cursor-pointer"}
              ${itemStyle}
              ${itemClassName}
              ${isLast ? activeItemClassName : ""}
            `}
          >
            {item.icon && (
              <span
                className="shrink-0 flex items-center"
                style={{ width: s.iconSize, height: s.iconSize }}
              >
                {item.icon}
              </span>
            )}
            <span className="truncate">{item.label}</span>
          </button>
        )}

        {!isLast && (
          <BreadcrumbSeparator
            type={separatorType}
            size={size}
            customSeparator={customSeparator}
          />
        )}
      </div>
    </li>
  );
}

interface CollapsedEllipsisProps {
  size: BreadcrumbSize;
  variant: BreadcrumbVariant;
  collapsedItems: BreadcrumbItem[];
  separatorType: BreadcrumbSeparatorType;
  customSeparator?: React.ReactNode;
}

function CollapsedEllipsis({
  size,
  variant,
  collapsedItems,
  separatorType,
  customSeparator,
}: CollapsedEllipsisProps) {
  const { toggleCollapsed } = useBreadcrumbContext();
  const s = sizeConfig[size];
  const styles = variantItemStyles[variant];

  return (
    <li className="flex items-center shrink-0">
      <div className={`flex items-center ${s.gap}`}>
        <button
          type="button"
          onClick={toggleCollapsed}
          title={`Show ${collapsedItems.map((i) => i.label).join(", ")}`}
          className={`
            flex items-center justify-center ${s.collapsedPx} ${s.collapsedPy} ${s.roundedItem}
            ${s.collapsedText} transition-colors duration-100
            ${styles.collapsed}
          `}
        >
          <MoreHorizontal size={s.iconSize + 2} />
        </button>
        <BreadcrumbSeparator
          type={separatorType}
          size={size}
          customSeparator={customSeparator}
        />
      </div>
    </li>
  );
}

interface BreadcrumbInnerProps {
  items: BreadcrumbItem[];
  size: BreadcrumbSize;
  variant: BreadcrumbVariant;
  separatorType: BreadcrumbSeparatorType;
  customSeparator?: React.ReactNode;
  maxItems?: number;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  className?: string;
  listClassName?: string;
  itemClassName?: string;
  activeItemClassName?: string;
  separatorClassName?: string;
}

function BreadcrumbInner({
  items,
  size,
  variant,
  separatorType,
  customSeparator,
  maxItems,
  startContent,
  endContent,
  className = "",
  listClassName = "",
  itemClassName = "",
  activeItemClassName = "",
}: BreadcrumbInnerProps) {
  const { state } = useBreadcrumbContext();
  const s = sizeConfig[size];

  const shouldCollapse =
    maxItems !== undefined && items.length > maxItems && state.collapsed;

  let visibleItems: BreadcrumbItem[] = items;
  let collapsedItems: BreadcrumbItem[] = [];

  if (shouldCollapse && maxItems !== undefined) {
    const keepStart = 1;
    const keepEnd = maxItems - 1;
    visibleItems = [
      ...items.slice(0, keepStart),
      ...items.slice(items.length - keepEnd),
    ];
    collapsedItems = items.slice(keepStart, items.length - keepEnd);
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center w-full ${className}`}
    >
      {startContent && (
        <div className={`shrink-0 flex items-center mr-2`}>{startContent}</div>
      )}

      <ol
        className={`flex items-center flex-wrap ${s.gap} min-w-0 ${listClassName}`}
      >
        <AnimatePresence initial={false} mode="popLayout">
          {shouldCollapse ? (
            <>
              <motion.span
                key={visibleItems[0].id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="contents"
              >
                <BreadcrumbItemNode
                  item={visibleItems[0]}
                  isLast={false}
                  size={size}
                  variant={variant}
                  separatorType={separatorType}
                  customSeparator={customSeparator}
                  itemClassName={itemClassName}
                  activeItemClassName={activeItemClassName}
                />
              </motion.span>

              <motion.span
                key="ellipsis"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="contents"
              >
                <CollapsedEllipsis
                  size={size}
                  variant={variant}
                  collapsedItems={collapsedItems}
                  separatorType={separatorType}
                  customSeparator={customSeparator}
                />
              </motion.span>

              {visibleItems.slice(1).map((item, idx) => {
                const globalIdx = items.indexOf(item);
                const isLast = globalIdx === items.length - 1;
                return (
                  <motion.span
                    key={item.id}
                    initial={{ opacity: 0, x: 6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 6 }}
                    transition={{
                      duration: 0.15,
                      ease: "easeOut",
                      delay: idx * 0.03,
                    }}
                    className="contents"
                  >
                    <BreadcrumbItemNode
                      item={item}
                      isLast={isLast}
                      size={size}
                      variant={variant}
                      separatorType={separatorType}
                      customSeparator={customSeparator}
                      itemClassName={itemClassName}
                      activeItemClassName={activeItemClassName}
                    />
                  </motion.span>
                );
              })}
            </>
          ) : (
            items.map((item, idx) => {
              const isLast = idx === items.length - 1;
              return (
                <motion.span
                  key={item.id}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  transition={{
                    duration: 0.15,
                    ease: "easeOut",
                    delay: idx * 0.04,
                  }}
                  className="contents"
                >
                  <BreadcrumbItemNode
                    item={item}
                    isLast={isLast}
                    size={size}
                    variant={variant}
                    separatorType={separatorType}
                    customSeparator={customSeparator}
                    itemClassName={itemClassName}
                    activeItemClassName={activeItemClassName}
                  />
                </motion.span>
              );
            })
          )}
        </AnimatePresence>
      </ol>

      {endContent && (
        <div className={`shrink-0 flex items-center ml-2`}>{endContent}</div>
      )}
    </nav>
  );
}

export interface BreadcrumbProps
  extends Omit<BreadcrumbProviderProps, "children"> {
  items: BreadcrumbItem[];
  size?: BreadcrumbSize;
  variant?: BreadcrumbVariant;
  separatorType?: BreadcrumbSeparatorType;
  customSeparator?: React.ReactNode;
  maxItems?: number;
  defaultCollapsed?: boolean;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  className?: string;
  listClassName?: string;
  itemClassName?: string;
  activeItemClassName?: string;
  separatorClassName?: string;
}

export function Breadcrumb({
  items,
  size = "md",
  variant = "default",
  separatorType = "chevron",
  customSeparator,
  maxItems,
  defaultCollapsed = true,
  startContent,
  endContent,
  className = "",
  listClassName = "",
  itemClassName = "",
  activeItemClassName = "",
  separatorClassName = "",
  onItemClick,
  onCollapsedChange,
  defaultActiveId,
}: BreadcrumbProps) {
  return (
    <BreadcrumbProvider
      defaultActiveId={defaultActiveId}
      defaultCollapsed={
        maxItems !== undefined && items.length > maxItems
          ? defaultCollapsed
          : false
      }
      size={size}
      variant={variant}
      onItemClick={onItemClick}
      onCollapsedChange={onCollapsedChange}
    >
      <BreadcrumbInner
        items={items}
        size={size}
        variant={variant}
        separatorType={separatorType}
        customSeparator={customSeparator}
        maxItems={maxItems}
        startContent={startContent}
        endContent={endContent}
        className={className}
        listClassName={listClassName}
        itemClassName={itemClassName}
        activeItemClassName={activeItemClassName}
        separatorClassName={separatorClassName}
      />
    </BreadcrumbProvider>
  );
}

export { BreadcrumbProvider, useBreadcrumbContext };
export type { BreadcrumbItem, BreadcrumbSize, BreadcrumbVariant, BreadcrumbSeparatorType };