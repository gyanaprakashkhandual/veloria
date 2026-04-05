import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useLayoutEffect,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Search,
  Sun,
  Moon,
  Monitor,
  ChevronDown,
  ChevronRight,
  Bell,
  Badge,
} from "lucide-react";
import {
  NavbarProvider,
  useNavbarContext,
  type NavbarProviderProps,
  type NavItem,
  type NavbarSize,
  type NavbarVariant,
  type NavbarPosition,
  type NavbarTheme,
} from "../../../context/navbar/Navbar.context";

const sizeConfig = {
  sm: {
    height: "h-12",
    px: "px-3",
    logoText: "text-sm",
    navText: "text-xs",
    navPx: "px-2.5",
    navPy: "py-1",
    iconSize: 14,
    searchHeight: "h-7",
    searchPx: "px-2.5",
    searchText: "text-xs",
    mobileItemPx: "px-3",
    mobileItemPy: "py-2",
    mobileText: "text-sm",
    dropdownText: "text-xs",
    dropdownPx: "px-2.5",
    dropdownPy: "py-1.5",
    badgeText: "text-[9px]",
    gap: "gap-0.5",
    outerGap: "gap-2",
  },
  md: {
    height: "h-14",
    px: "px-4",
    logoText: "text-sm",
    navText: "text-sm",
    navPx: "px-3",
    navPy: "py-1.5",
    iconSize: 16,
    searchHeight: "h-8",
    searchPx: "px-3",
    searchText: "text-sm",
    mobileItemPx: "px-4",
    mobileItemPy: "py-2.5",
    mobileText: "text-sm",
    dropdownText: "text-sm",
    dropdownPx: "px-3",
    dropdownPy: "py-1.5",
    badgeText: "text-[10px]",
    gap: "gap-1",
    outerGap: "gap-2",
  },
  lg: {
    height: "h-16",
    px: "px-6",
    logoText: "text-base",
    navText: "text-sm",
    navPx: "px-3.5",
    navPy: "py-2",
    iconSize: 17,
    searchHeight: "h-9",
    searchPx: "px-3.5",
    searchText: "text-sm",
    mobileItemPx: "px-5",
    mobileItemPy: "py-3",
    mobileText: "text-base",
    dropdownText: "text-sm",
    dropdownPx: "px-3.5",
    dropdownPy: "py-2",
    badgeText: "text-[10px]",
    gap: "gap-1",
    outerGap: "gap-3",
  },
};

const variantStyles: Record<NavbarVariant, string> = {
  default:
    "bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800",
  filled:
    "bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700",
  ghost: "bg-transparent border-b border-transparent",
  glass:
    "bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-b border-gray-200/60 dark:border-gray-700/60",
};

const variantScrolled: Record<NavbarVariant, string> = {
  default:
    "bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm shadow-black/5",
  filled:
    "bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm shadow-black/5",
  ghost:
    "bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800 shadow-sm shadow-black/5",
  glass:
    "bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/80 dark:border-gray-700/80 shadow-sm shadow-black/5",
};

const themeIcons: Record<NavbarTheme, React.ReactNode> = {
  light: <Sun size={15} />,
  dark: <Moon size={15} />,
  system: <Monitor size={15} />,
};

const themeLabels: Record<NavbarTheme, string> = {
  light: "Light",
  dark: "Dark",
  system: "System",
};

function NavDropdown({
  item,
  size,
}: {
  item: NavItem;
  size: NavbarSize;
}) {
  const s = sizeConfig[size];
  const { state, setActiveTab } = useNavbarContext();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isActive = state.activeTab === item.id;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        disabled={item.disabled}
        onClick={() => setOpen((v) => !v)}
        className={`
          flex items-center gap-1 ${s.navPx} ${s.navPy} rounded-lg ${s.navText} font-medium
          transition-colors duration-100
          ${item.disabled ? "opacity-40 cursor-not-allowed text-gray-400 dark:text-gray-600" : ""}
          ${isActive
            ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
          }
        `}
      >
        {item.icon && (
          <span className="flex items-center" style={{ width: s.iconSize - 2, height: s.iconSize - 2 }}>
            {item.icon}
          </span>
        )}
        <span>{item.label}</span>
        <ChevronDown
          size={s.iconSize - 4}
          className={`transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.13, ease: "easeOut" }}
            className="absolute top-full left-0 mt-1.5 min-w-[180px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg shadow-black/10 dark:shadow-black/40 overflow-hidden z-50"
          >
            <div className="p-1">
              {item.children!.map((child) => (
                <button
                  key={child.id}
                  type="button"
                  disabled={child.disabled}
                  onClick={() => {
                    child.onClick?.();
                    setActiveTab(child.id);
                    setOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-2 ${s.dropdownPx} ${s.dropdownPy} rounded-md
                    ${s.dropdownText} font-medium text-left transition-colors duration-100
                    ${child.disabled
                      ? "opacity-40 cursor-not-allowed text-gray-400 dark:text-gray-600"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }
                  `}
                >
                  {child.icon && (
                    <span className="shrink-0 text-gray-400 dark:text-gray-500 flex items-center" style={{ width: s.iconSize - 2, height: s.iconSize - 2 }}>
                      {child.icon}
                    </span>
                  )}
                  <span className="flex-1 truncate">{child.label}</span>
                  {child.badge !== undefined && (
                    <span className={`shrink-0 ${s.badgeText} font-semibold px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400`}>
                      {child.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavTabItem({
  item,
  size,
}: {
  item: NavItem;
  size: NavbarSize;
}) {
  const s = sizeConfig[size];
  const { state, setActiveTab } = useNavbarContext();
  const isActive = state.activeTab === item.id;

  if (item.children?.length) return <NavDropdown item={item} size={size} />;

  return (
    <button
      type="button"
      disabled={item.disabled}
      onClick={() => {
        item.onClick?.();
        setActiveTab(item.id);
      }}
      className={`
        relative flex items-center gap-1.5 ${s.navPx} ${s.navPy} rounded-lg ${s.navText} font-medium
        transition-colors duration-100 select-none
        ${item.disabled ? "opacity-40 cursor-not-allowed text-gray-400 dark:text-gray-600" : ""}
        ${isActive
          ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
        }
      `}
    >
      {item.icon && (
        <span className="flex items-center shrink-0" style={{ width: s.iconSize - 2, height: s.iconSize - 2 }}>
          {item.icon}
        </span>
      )}
      <span>{item.label}</span>
      {item.badge !== undefined && (
        <span className={`shrink-0 ${s.badgeText} font-semibold px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/20 text-white dark:bg-black/20 dark:text-gray-900" : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"}`}>
          {item.badge}
        </span>
      )}
    </button>
  );
}

function ThemeDropdown({ size }: { size: NavbarSize }) {
  const s = sizeConfig[size];
  const { state, setTheme } = useNavbarContext();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const themes: NavbarTheme[] = ["light", "dark", "system"];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`
          flex items-center justify-center w-8 h-8 rounded-lg
          text-gray-500 dark:text-gray-400
          hover:bg-gray-100 dark:hover:bg-gray-800
          hover:text-gray-700 dark:hover:text-gray-200
          transition-colors duration-100
        `}
        title="Change theme"
      >
        <span className="flex items-center justify-center" style={{ width: s.iconSize, height: s.iconSize }}>
          {themeIcons[state.theme]}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.13, ease: "easeOut" }}
            className="absolute top-full right-0 mt-1.5 w-36 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg shadow-black/10 dark:shadow-black/40 overflow-hidden z-50"
          >
            <div className="p-1">
              {themes.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setTheme(t);
                    setOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-2.5 ${s.dropdownPx} ${s.dropdownPy} rounded-md
                    ${s.dropdownText} font-medium text-left transition-colors duration-100
                    ${state.theme === t
                      ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }
                  `}
                >
                  <span className="shrink-0 flex items-center" style={{ width: 14, height: 14 }}>
                    {themeIcons[t]}
                  </span>
                  <span>{themeLabels[t]}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SearchBar({ size }: { size: NavbarSize }) {
  const s = sizeConfig[size];
  const { state, setSearch, closeSearch } = useNavbarContext();
  const { searchInputRef } = useNavbarContext();

  return (
    <motion.div
      initial={{ opacity: 0, width: 0 }}
      animate={{ opacity: 1, width: "auto" }}
      exit={{ opacity: 0, width: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="overflow-hidden"
    >
      <div className={`flex items-center gap-2 ${s.searchHeight} ${s.searchPx} rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 min-w-[180px] sm:min-w-[240px]`}>
        <Search size={s.iconSize - 3} className="shrink-0 text-gray-400 dark:text-gray-500" />
        <input
          ref={searchInputRef as React.RefObject<HTMLInputElement>}
          type="search"
          value={state.searchValue}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Escape") closeSearch(); }}
          placeholder="Search..."
          className={`flex-1 min-w-0 bg-transparent border-0 outline-none ring-0 ${s.searchText} text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600`}
        />
        {state.searchValue && (
          <button type="button" onClick={() => setSearch("")} className="shrink-0 text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 transition-colors">
            <X size={s.iconSize - 4} />
          </button>
        )}
      </div>
    </motion.div>
  );
}

function MobileMenuPanel({
  items,
  size,
  extraMobileContent,
  showThemeToggle,
}: {
  items: NavItem[];
  size: NavbarSize;
  extraMobileContent?: React.ReactNode;
  showThemeToggle: boolean;
}) {
  const s = sizeConfig[size];
  const { state, setActiveTab, closeMobile, setTheme } = useNavbarContext();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const themes: NavbarTheme[] = ["light", "dark", "system"];

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id],
    );
  };

  const renderItems = (list: NavItem[], depth = 0) =>
    list.map((item) => {
      const isActive = state.activeTab === item.id;
      const hasChildren = !!item.children?.length;
      const isExpanded = expandedItems.includes(item.id);

      return (
        <React.Fragment key={item.id}>
          <button
            type="button"
            disabled={item.disabled}
            onClick={() => {
              if (hasChildren) {
                toggleExpand(item.id);
                return;
              }
              item.onClick?.();
              setActiveTab(item.id);
              closeMobile();
            }}
            className={`
              w-full flex items-center gap-3 ${s.mobileItemPx} ${s.mobileItemPy} ${s.mobileText} font-medium
              transition-colors duration-100 text-left
              ${depth > 0 ? "pl-10" : ""}
              ${item.disabled ? "opacity-40 cursor-not-allowed text-gray-400 dark:text-gray-600" : ""}
              ${isActive && !hasChildren
                ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              }
            `}
          >
            {item.icon && (
              <span className={`shrink-0 flex items-center ${isActive && !hasChildren ? "opacity-100" : "opacity-50"}`} style={{ width: s.iconSize, height: s.iconSize }}>
                {item.icon}
              </span>
            )}
            <span className="flex-1 truncate">{item.label}</span>
            {item.badge !== undefined && (
              <span className={`shrink-0 ${s.badgeText} font-semibold px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/20 text-white dark:bg-black/20 dark:text-gray-900" : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"}`}>
                {item.badge}
              </span>
            )}
            {hasChildren && (
              <ChevronDown
                size={s.iconSize - 3}
                className={`shrink-0 text-gray-400 dark:text-gray-500 transition-transform duration-150 ${isExpanded ? "rotate-180" : ""}`}
              />
            )}
          </button>

          <AnimatePresence initial={false}>
            {hasChildren && isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="overflow-hidden"
              >
                {renderItems(item.children!, depth + 1)}
              </motion.div>
            )}
          </AnimatePresence>
        </React.Fragment>
      );
    });

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="overflow-hidden border-t border-gray-100 dark:border-gray-800"
    >
      <div className="p-2 space-y-0.5">
        {renderItems(items)}
      </div>

      {showThemeToggle && (
        <div className="px-2 pb-2">
          <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
            <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Theme
            </p>
            <div className="flex items-center gap-1 px-1">
              {themes.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTheme(t)}
                  className={`
                    flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-medium transition-colors duration-100
                    ${state.theme === t
                      ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }
                  `}
                >
                  <span style={{ width: 12, height: 12 }} className="flex items-center justify-center">{themeIcons[t]}</span>
                  <span>{themeLabels[t]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {extraMobileContent && (
        <div className="px-2 pb-2 border-t border-gray-100 dark:border-gray-800 pt-2">
          {extraMobileContent}
        </div>
      )}
    </motion.div>
  );
}

export interface NavbarProps {
  logo?: React.ReactNode;
  logoText?: string;
  items?: NavItem[];
  size?: NavbarSize;
  variant?: NavbarVariant;
  position?: NavbarPosition;
  showSearch?: boolean;
  showHamburger?: boolean;
  showThemeToggle?: boolean;
  startContent?: React.ReactNode;
  centerContent?: React.ReactNode;
  endContent?: React.ReactNode;
  extraMobileContent?: React.ReactNode;
  scrollThreshold?: number;
  maxWidth?: string;
  className?: string;
  innerClassName?: string;
  logoClassName?: string;
  tabsClassName?: string;
  actionsClassName?: string;
  onLogoClick?: () => void;
  defaultActiveTab?: string | null;
  defaultTheme?: NavbarTheme;
  onSearch?: (value: string) => void;
  onTabChange?: (id: string) => void;
  onThemeChange?: (theme: NavbarTheme) => void;
}

function NavbarInner({
  logo,
  logoText,
  items = [],
  size = "md",
  variant = "default",
  position = "sticky",
  showSearch = true,
  showHamburger = true,
  showThemeToggle = true,
  startContent,
  centerContent,
  endContent,
  extraMobileContent,
  scrollThreshold = 10,
  maxWidth = "max-w-screen-xl",
  className = "",
  innerClassName = "",
  logoClassName = "",
  tabsClassName = "",
  actionsClassName = "",
  onLogoClick,
}: Omit<NavbarProps, keyof NavbarProviderProps>) {
  const { state, toggleMobile, toggleSearch } = useNavbarContext();
  const s = sizeConfig[size];

  useEffect(() => {
    const handleScroll = () => {
      useNavbarContext;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollThreshold]);

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > scrollThreshold);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollThreshold]);

  const positionClass: Record<NavbarPosition, string> = {
    static: "relative",
    sticky: "sticky top-0",
    fixed: "fixed top-0 left-0 right-0",
    relative: "relative",
  };

  const currentVariantStyle = scrolled ? variantScrolled[variant] : variantStyles[variant];

  return (
    <div className={`${positionClass[position]} z-40 w-full transition-all duration-200 ${currentVariantStyle} ${className}`}>
      <div className={`w-full mx-auto ${maxWidth}`}>
        <div className={`flex items-center ${s.height} ${s.px} gap-3`}>
          <div className={`flex items-center shrink-0 ${logoClassName}`}>
            {showHamburger && items.length > 0 && (
              <button
                type="button"
                onClick={toggleMobile}
                className={`
                  md:hidden flex items-center justify-center w-8 h-8 rounded-lg mr-2
                  text-gray-500 dark:text-gray-400
                  hover:bg-gray-100 dark:hover:bg-gray-800
                  hover:text-gray-700 dark:hover:text-gray-200
                  transition-colors duration-100
                `}
              >
                {state.mobileOpen ? <X size={s.iconSize} /> : <Menu size={s.iconSize} />}
              </button>
            )}

            {(logo || logoText) && (
              <button
                type="button"
                onClick={onLogoClick}
                className={`flex items-center gap-2 ${s.logoText} font-bold text-gray-900 dark:text-white hover:opacity-80 transition-opacity duration-100 ${!onLogoClick ? "cursor-default pointer-events-none" : ""}`}
              >
                {logo}
                {logoText && <span>{logoText}</span>}
              </button>
            )}

            {startContent && <div className="ml-3">{startContent}</div>}
          </div>

          {items.length > 0 && (
            <nav className={`hidden md:flex items-center ${s.gap} flex-1 ${tabsClassName}`}>
              {centerContent ? (
                <div className="flex-1 flex justify-center">{centerContent}</div>
              ) : (
                items.map((item) => (
                  <NavTabItem key={item.id} item={item} size={size} />
                ))
              )}
            </nav>
          )}

          {!items.length && centerContent && (
            <div className="flex-1 flex justify-center">{centerContent}</div>
          )}

          {!items.length && !centerContent && <div className="flex-1" />}

          <div className={`flex items-center ${s.gap} ml-auto shrink-0 ${actionsClassName}`}>
            <AnimatePresence>
              {state.searchOpen && showSearch && <SearchBar size={size} />}
            </AnimatePresence>

            {showSearch && (
              <button
                type="button"
                onClick={toggleSearch}
                className={`
                  flex items-center justify-center w-8 h-8 rounded-lg
                  transition-colors duration-100
                  ${state.searchOpen
                    ? "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200"
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200"
                  }
                `}
              >
                {state.searchOpen ? <X size={s.iconSize} /> : <Search size={s.iconSize} />}
              </button>
            )}

            {showThemeToggle && <ThemeDropdown size={size} />}

            {endContent}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {state.mobileOpen && showHamburger && items.length > 0 && (
          <div className={`md:hidden w-full mx-auto ${maxWidth}`}>
            <MobileMenuPanel
              items={items}
              size={size}
              extraMobileContent={extraMobileContent}
              showThemeToggle={showThemeToggle}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Navbar({
  defaultActiveTab = null,
  defaultTheme = "system",
  size = "md",
  variant = "default",
  onSearch,
  onTabChange,
  onThemeChange,
  ...rest
}: NavbarProps) {
  return (
    <NavbarProvider
      defaultActiveTab={defaultActiveTab}
      defaultTheme={defaultTheme}
      size={size}
      variant={variant}
      onSearch={onSearch}
      onTabChange={onTabChange}
      onThemeChange={onThemeChange}
    >
      <NavbarInner size={size} variant={variant} {...rest} />
    </NavbarProvider>
  );
}

export { NavbarProvider, useNavbarContext };
export type { NavItem, NavbarSize, NavbarVariant, NavbarPosition, NavbarTheme };