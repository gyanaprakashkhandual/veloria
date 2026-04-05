import React, { useState, useCallback } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ExternalLink,
  Search,
  LayoutGrid,
  X,
  Menu,
} from "lucide-react";
import { sidebarData, type NavItem } from "../data/Sidebar.data";

// ─── Types ───────────────────────────────────────────────────────────────────

interface NavItemProps {
  item: NavItem;
  depth?: number;
  onNavigate?: () => void;
}

// ─── Badge ────────────────────────────────────────────────────────────────────

const Badge: React.FC<{ label: string; color: string }> = ({
  label,
  color,
}) => {
  const colorMap: Record<string, string> = {
    orange: "bg-orange-500 text-white",
    blue: "bg-blue-500 text-white",
    green: "bg-green-500 text-white",
    red: "bg-red-500 text-white",
  };

  return (
    <span
      className={`ml-auto text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-full ${
        colorMap[color] ?? "bg-gray-200 text-gray-700"
      }`}
    >
      {label}
    </span>
  );
};

// ─── Recursive Nav Item ───────────────────────────────────────────────────────

const NavItemComponent: React.FC<NavItemProps> = ({
  item,
  depth = 0,
  onNavigate,
}) => {
  const location = useLocation();
  const hasChildren = item.children && item.children.length > 0;

  // Auto-open if a child is currently active
  const isChildActive = useCallback(
    (navItem: NavItem): boolean => {
      if (navItem.path && location.pathname.startsWith(navItem.path))
        return true;
      return navItem.children?.some(isChildActive) ?? false;
    },
    [location.pathname],
  );

  const [open, setOpen] = useState(() => hasChildren && isChildActive(item));

  const isActive = item.path !== undefined && location.pathname === item.path;

  const Icon = item.icon;

  const indentClass =
    depth === 0
      ? "pl-3"
      : depth === 1
        ? "pl-6"
        : depth === 2
          ? "pl-9"
          : "pl-12";

  const baseItemClass = `
    group flex items-center gap-2.5 w-full text-left
    rounded-lg transition-colors duration-150 cursor-pointer select-none
    text-sm font-medium
  `;

  // ── Section header (depth ≥ 1, has children, no path) ──
  if (hasChildren && !item.path && depth >= 1) {
    return (
      <div className="mt-2">
        <p
          className={`${indentClass} mb-1 text-[11px] font-semibold uppercase tracking-widest text-gray-400`}
        >
          {item.label}
        </p>
        <div>
          {item.children!.map((child, idx) => (
            <NavItemComponent
              key={idx}
              item={child}
              depth={depth + 1}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </div>
    );
  }

  // ── Collapsible item ──
  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setOpen((prev) => !prev)}
          className={`
            ${baseItemClass}
            ${indentClass} pr-3 py-2
            ${open ? "text-gray-900" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}
          `}
          aria-expanded={open}
        >
          {Icon && (
            <Icon
              size={16}
              className={`shrink-0 transition-colors ${
                open
                  ? "text-gray-800"
                  : "text-gray-400 group-hover:text-gray-600"
              }`}
            />
          )}
          <span className="flex-1 text-left leading-snug">{item.label}</span>
          {item.badge && (
            <Badge label={item.badge} color={item.badgeColor ?? "gray"} />
          )}
          <motion.span
            animate={{ rotate: open ? 90 : 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="shrink-0"
          >
            <ChevronRight
              size={14}
              className="text-gray-400 group-hover:text-gray-600"
            />
          </motion.span>
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="children"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              {item.children!.map((child, idx) => (
                <NavItemComponent
                  key={idx}
                  item={child}
                  depth={depth + 1}
                  onNavigate={onNavigate}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ── External link ──
  if (item.external && item.path) {
    return (
      <a
        href={item.path}
        target="_blank"
        rel="noopener noreferrer"
        className={`
          ${baseItemClass}
          ${indentClass} pr-3 py-2
          text-gray-600 hover:text-gray-900 hover:bg-gray-100
        `}
      >
        {Icon && (
          <Icon
            size={16}
            className="shrink-0 text-gray-400 group-hover:text-gray-600"
          />
        )}
        <span className="flex-1 leading-snug">{item.label}</span>
        {item.badge && (
          <Badge label={item.badge} color={item.badgeColor ?? "gray"} />
        )}
        <ExternalLink size={12} className="shrink-0 text-gray-400" />
      </a>
    );
  }

  // ── Regular nav link ──
  if (item.path) {
    return (
      <NavLink
        to={item.path}
        end
        onClick={onNavigate}
        className={({ isActive: active }) => `
          ${baseItemClass}
          ${indentClass} pr-3 py-2
          ${
            active
              ? "bg-gray-100 text-gray-900"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          }
        `}
      >
        {({ isActive: active }) => (
          <>
            {Icon && (
              <Icon
                size={16}
                className={`shrink-0 ${
                  active
                    ? "text-gray-800"
                    : "text-gray-400 group-hover:text-gray-600"
                }`}
              />
            )}
            <span className="flex-1 leading-snug">{item.label}</span>
            {item.badge && (
              <Badge label={item.badge} color={item.badgeColor ?? "gray"} />
            )}
          </>
        )}
      </NavLink>
    );
  }

  return null;
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const Sidebar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  const SidebarContent = (
    <div className="flex flex-col h-full overflow-hidden bg-white">
      {/* Header */}
      <div className="shrink-0 px-4 pt-5 pb-3 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center shrink-0">
              <LayoutGrid size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 leading-tight">
                Documentation
              </p>
              <p className="text-[11px] text-gray-400 leading-tight">v1.2.3</p>
            </div>
          </div>
          {/* Mobile close */}
          <button
            className="lg:hidden p-1 rounded-md text-gray-500 hover:bg-gray-100"
            onClick={closeMobile}
          >
            <X size={18} />
          </button>
        </div>

        {/* Search */}
        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors text-sm text-gray-400 group">
          <Search size={14} className="shrink-0" />
          <span className="flex-1 text-left text-[13px]">Search</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-mono bg-white border border-gray-200 rounded px-1.5 py-0.5 text-gray-400 shadow-sm">
            ⌥F
          </kbd>
        </button>
      </div>

      {/* Nav */}
      <nav
        className="flex-1 overflow-y-auto overscroll-contain py-3 px-2 space-y-0.5 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent"
        style={{ scrollbarWidth: "thin" }}
      >
        {sidebarData.map((section, sIdx) => (
          <div key={sIdx} className={sIdx > 0 ? "mt-4" : ""}>
            {section.title && (
              <p className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                {section.title}
              </p>
            )}
            {section.items.map((item, iIdx) => (
              <NavItemComponent
                key={iIdx}
                item={item}
                depth={0}
                onNavigate={closeMobile}
              />
            ))}
          </div>
        ))}
      </nav>
    </div>
  );

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 sticky top-0 h-screen border-r border-gray-100 bg-white">
        {SidebarContent}
      </aside>

      {/* ── Mobile toggle button ── */}
      <button
        className="lg:hidden fixed bottom-5 left-4 z-50 flex items-center justify-center w-11 h-11 rounded-full bg-gray-900 text-white shadow-lg"
        onClick={() => setMobileOpen(true)}
        aria-label="Open sidebar"
      >
        <Menu size={20} />
      </button>

      {/* ── Mobile overlay ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
              onClick={closeMobile}
            />

            {/* Drawer */}
            <motion.aside
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="lg:hidden fixed inset-y-0 left-0 z-50 w-72 shadow-2xl border-r border-gray-100"
            >
              {SidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
