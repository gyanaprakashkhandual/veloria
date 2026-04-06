// TableShowcase.tsx
import React, { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Table,
  type TableColumn,
  type TableSize,
  type TableVariant,
  type TableDensity,
  type SelectionMode,
} from "../../../ui/data/table/Table.ui";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  Archive,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Eye,
  Download,
  Upload,
  Settings,
  Filter,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Star,
  Heart,
  Bookmark,
  Flag,
  Users,
  DollarSign,
  ShoppingCart,
  Package,
  Truck,
  Check,
  X,
  Plus,
  Minus,
} from "lucide-react";

// Sample data types
interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive" | "pending" | "suspended";
  lastActive: string;
  location: string;
  projects: number;
  revenue: number;
  avatar?: string;
}

interface OrderData {
  id: string;
  customer: string;
  product: string;
  amount: number;
  status: "completed" | "processing" | "pending" | "cancelled";
  date: string;
  tracking: string;
}

// Generate sample user data
const generateUsers = (count: number): UserData[] => {
  const names = ["Alice Johnson", "Bob Smith", "Carol Davis", "David Wilson", "Emma Brown", "Frank Miller", "Grace Lee", "Henry Taylor", "Ivy Chen", "Jack Wilson"];
  const roles = ["Admin", "User", "Moderator", "Editor", "Viewer"];
  const statuses: ("active" | "inactive" | "pending" | "suspended")[] = ["active", "inactive", "pending", "suspended"];
  const locations = ["New York", "London", "Tokyo", "Paris", "Berlin", "Sydney", "Toronto", "Singapore"];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `user-${i + 1}`,
    name: names[i % names.length] + (Math.floor(i / names.length) + 1),
    email: `user${i + 1}@example.com`,
    role: roles[i % roles.length],
    status: statuses[i % statuses.length],
    lastActive: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    location: locations[i % locations.length],
    projects: Math.floor(Math.random() * 50),
    revenue: Math.floor(Math.random() * 100000),
  }));
};

// Generate sample order data
const generateOrders = (count: number): OrderData[] => {
  const customers = ["Alice Johnson", "Bob Smith", "Carol Davis", "David Wilson", "Emma Brown"];
  const products = ["Laptop Pro", "Wireless Mouse", "Keyboard", "Monitor", "Headphones", "Desk Chair"];
  const statuses: ("completed" | "processing" | "pending" | "cancelled")[] = ["completed", "processing", "pending", "cancelled"];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `ORD-${String(i + 1).padStart(4, '0')}`,
    customer: customers[i % customers.length],
    product: products[i % products.length],
    amount: Math.floor(Math.random() * 1000) + 50,
    status: statuses[i % statuses.length],
    date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    tracking: `TRK${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
  }));
};

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const config: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
    active: { color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400", icon: <CheckCircle size={12} />, label: "Active" },
    inactive: { color: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400", icon: <XCircle size={12} />, label: "Inactive" },
    pending: { color: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400", icon: <Clock size={12} />, label: "Pending" },
    suspended: { color: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400", icon: <AlertCircle size={12} />, label: "Suspended" },
    completed: { color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400", icon: <CheckCircle size={12} />, label: "Completed" },
    processing: { color: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400", icon: <RefreshCw size={12} />, label: "Processing" },
    cancelled: { color: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400", icon: <XCircle size={12} />, label: "Cancelled" },
  };
  const c = config[status] || config.inactive;
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${c.color}`}>
      {c.icon}
      {c.label}
    </span>
  );
};

// Action buttons component
const ActionButtons = ({ row, onEdit, onDelete }: { row: any; onEdit?: (row: any) => void; onDelete?: (row: any) => void }) => (
  <div className="flex items-center gap-1">
    <button
      onClick={(e) => { e.stopPropagation(); onEdit?.(row); }}
      className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    >
      <Edit size={14} className="text-gray-500 dark:text-gray-400" />
    </button>
    <button
      onClick={(e) => { e.stopPropagation(); onDelete?.(row); }}
      className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
    >
      <Trash2 size={14} className="text-gray-500 dark:text-gray-400 hover:text-red-500" />
    </button>
  </div>
);

// Main showcase component
export default function TableShowcase() {
  const [users, setUsers] = useState(() => generateUsers(50));
  const [orders] = useState(() => generateOrders(30));
  const [selectedSize, setSelectedSize] = useState<TableSize>("md");
  const [selectedVariant, setSelectedVariant] = useState<TableVariant>("default");
  const [selectedDensity, setSelectedDensity] = useState<TableDensity>("default");
  const [selectedSelectionMode, setSelectedSelectionMode] = useState<SelectionMode>("multiple");
  const [striped, setStriped] = useState(false);
  const [resizableColumns, setResizableColumns] = useState(true);
  const [columnReorder, setColumnReorder] = useState(true);
  const [rowReorder, setRowReorder] = useState(false);
  const [expandable, setExpandable] = useState(true);
  const [stickyHeader, setStickyHeader] = useState(false);
  const [showSearch, setShowSearch] = useState(true);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [sortState, setSortState] = useState<any>(null);
  const [filterState, setFilterState] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Define columns for users table
  const userColumns: TableColumn<UserData>[] = useMemo(() => [
    {
      id: "name",
      header: "User",
      accessorKey: "name",
      sortable: true,
      width: 200,
      cell: (value, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-medium">
            {row.name.charAt(0)}
          </div>
          <div>
            <div className="font-medium text-gray-900 dark:text-white">{row.name}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      id: "role",
      header: "Role",
      accessorKey: "role",
      sortable: true,
      width: 120,
      cell: (value) => (
        <span className="inline-flex px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-xs font-medium">
          {value}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      sortable: true,
      width: 120,
      cell: (value) => <StatusBadge status={value as string} />,
    },
    {
      id: "location",
      header: "Location",
      accessorKey: "location",
      sortable: true,
      width: 120,
      cell: (value) => (
        <div className="flex items-center gap-1">
          <MapPin size={12} className="text-gray-400" />
          <span>{value}</span>
        </div>
      ),
    },
    {
      id: "projects",
      header: "Projects",
      accessorKey: "projects",
      sortable: true,
      width: 100,
      align: "right",
    },
    {
      id: "revenue",
      header: "Revenue",
      accessorKey: "revenue",
      sortable: true,
      width: 120,
      align: "right",
      cell: (value) => (
        <span className="font-medium text-emerald-600 dark:text-emerald-400">
          ${(value as number).toLocaleString()}
        </span>
      ),
    },
    {
      id: "lastActive",
      header: "Last Active",
      accessorKey: "lastActive",
      sortable: true,
      width: 120,
    },
    {
      id: "actions",
      header: "",
      width: 80,
      align: "center",
      cell: (_, row) => (
        <ActionButtons
          row={row}
          onEdit={(r) => console.log("Edit", r)}
          onDelete={(r) => console.log("Delete", r)}
        />
      ),
    },
  ], []);

  // Define columns for orders table
  const orderColumns: TableColumn<OrderData>[] = useMemo(() => [
    {
      id: "id",
      header: "Order ID",
      accessorKey: "id",
      sortable: true,
      width: 120,
      cell: (value) => (
        <span className="font-mono text-sm font-medium">{value}</span>
      ),
    },
    {
      id: "customer",
      header: "Customer",
      accessorKey: "customer",
      sortable: true,
      width: 180,
    },
    {
      id: "product",
      header: "Product",
      accessorKey: "product",
      sortable: true,
      width: 150,
    },
    {
      id: "amount",
      header: "Amount",
      accessorKey: "amount",
      sortable: true,
      width: 120,
      align: "right",
      cell: (value) => (
        <span className="font-medium">${(value as number).toLocaleString()}</span>
      ),
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      sortable: true,
      width: 120,
      cell: (value) => <StatusBadge status={value as string} />,
    },
    {
      id: "date",
      header: "Date",
      accessorKey: "date",
      sortable: true,
      width: 120,
    },
    {
      id: "tracking",
      header: "Tracking",
      accessorKey: "tracking",
      width: 140,
      cell: (value) => (
        <span className="font-mono text-xs">{value}</span>
      ),
    },
  ], []);

  // Handle selection change
  const handleSelectionChange = useCallback((selectedIds: string[]) => {
    setSelectedRows(selectedIds);
    console.log("Selected rows:", selectedIds);
  }, []);

  // Handle sort change
  const handleSortChange = useCallback((sort: any) => {
    setSortState(sort);
    console.log("Sort changed:", sort);
  }, []);

  // Handle filter change
  const handleFilterChange = useCallback((filter: any) => {
    setFilterState(filter);
    console.log("Filter changed:", filter);
  }, []);

  // Simulate loading
  const simulateLoading = useCallback(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  }, []);

  // Reset all settings
  const resetSettings = useCallback(() => {
    setSelectedSize("md");
    setSelectedVariant("default");
    setSelectedDensity("default");
    setSelectedSelectionMode("multiple");
    setStriped(false);
    setResizableColumns(true);
    setColumnReorder(true);
    setRowReorder(false);
    setExpandable(true);
    setStickyHeader(false);
    setShowSearch(true);
  }, []);

  // Table size options
  const sizes: { value: TableSize; label: string }[] = [
    { value: "sm", label: "Small" },
    { value: "md", label: "Medium" },
    { value: "lg", label: "Large" },
    { value: "xl", label: "XL" },
  ];

  // Variant options
  const variants: { value: TableVariant; label: string }[] = [
    { value: "default", label: "Default" },
    { value: "filled", label: "Filled" },
    { value: "ghost", label: "Ghost" },
    { value: "outline", label: "Outline" },
  ];

  // Density options
  const densities: { value: TableDensity; label: string }[] = [
    { value: "compact", label: "Compact" },
    { value: "default", label: "Default" },
    { value: "comfortable", label: "Comfortable" },
    { value: "spacious", label: "Spacious" },
  ];

  // Selection mode options
  const selectionModes: { value: SelectionMode; label: string }[] = [
    { value: "none", label: "None" },
    { value: "single", label: "Single" },
    { value: "multiple", label: "Multiple" },
  ];

  // Expanded row renderer
  const renderExpandedRow = useCallback((row: UserData, rowId: string) => (
    <div className="p-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">User ID</p>
          <p className="text-sm font-mono">{row.id}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Email</p>
          <p className="text-sm">{row.email}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Location</p>
          <p className="text-sm">{row.location}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Projects</p>
          <p className="text-sm">{row.projects}</p>
        </div>
      </div>
    </div>
  ), []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-[1600px] mx-auto px-6 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent flex items-center gap-2">
                <Users size={28} className="text-gray-700 dark:text-gray-300" />
                Table Component System
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                A comprehensive data table with sorting, filtering, selection, expansion, reordering, and more
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={simulateLoading}
                className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <RefreshCw size={14} />
                Simulate Loading
              </button>
              <button
                onClick={resetSettings}
                className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <Settings size={14} />
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 py-8">
        {/* Controls Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 sticky top-24">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <Settings size={16} />
                Table Controls
              </h2>
              
              <div className="space-y-4">
                {/* Size Control */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Size
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {sizes.map(s => (
                      <button
                        key={s.value}
                        onClick={() => setSelectedSize(s.value)}
                        className={`px-2 py-1 text-xs rounded-md transition-all ${
                          selectedSize === s.value
                            ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Variant Control */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Variant
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {variants.map(v => (
                      <button
                        key={v.value}
                        onClick={() => setSelectedVariant(v.value)}
                        className={`px-2 py-1 text-xs rounded-md transition-all ${
                          selectedVariant === v.value
                            ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Density Control */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Density
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {densities.map(d => (
                      <button
                        key={d.value}
                        onClick={() => setSelectedDensity(d.value)}
                        className={`px-2 py-1 text-xs rounded-md transition-all ${
                          selectedDensity === d.value
                            ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selection Mode */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Selection Mode
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {selectionModes.map(m => (
                      <button
                        key={m.value}
                        onClick={() => setSelectedSelectionMode(m.value)}
                        className={`px-2 py-1 text-xs rounded-md transition-all ${
                          selectedSelectionMode === m.value
                            ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Feature Toggles */}
                <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-800">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Striped Rows</span>
                    <button
                      onClick={() => setStriped(!striped)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        striped ? "bg-gray-900 dark:bg-gray-100" : "bg-gray-300 dark:bg-gray-700"
                      }`}
                    >
                      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        striped ? "translate-x-4.5" : "translate-x-0.5"
                      }`} />
                    </button>
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Resizable Columns</span>
                    <button
                      onClick={() => setResizableColumns(!resizableColumns)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        resizableColumns ? "bg-gray-900 dark:bg-gray-100" : "bg-gray-300 dark:bg-gray-700"
                      }`}
                    >
                      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        resizableColumns ? "translate-x-4.5" : "translate-x-0.5"
                      }`} />
                    </button>
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Column Reorder</span>
                    <button
                      onClick={() => setColumnReorder(!columnReorder)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        columnReorder ? "bg-gray-900 dark:bg-gray-100" : "bg-gray-300 dark:bg-gray-700"
                      }`}
                    >
                      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        columnReorder ? "translate-x-4.5" : "translate-x-0.5"
                      }`} />
                    </button>
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Row Reorder</span>
                    <button
                      onClick={() => setRowReorder(!rowReorder)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        rowReorder ? "bg-gray-900 dark:bg-gray-100" : "bg-gray-300 dark:bg-gray-700"
                      }`}
                    >
                      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        rowReorder ? "translate-x-4.5" : "translate-x-0.5"
                      }`} />
                    </button>
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Expandable Rows</span>
                    <button
                      onClick={() => setExpandable(!expandable)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        expandable ? "bg-gray-900 dark:bg-gray-100" : "bg-gray-300 dark:bg-gray-700"
                      }`}
                    >
                      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        expandable ? "translate-x-4.5" : "translate-x-0.5"
                      }`} />
                    </button>
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Sticky Header</span>
                    <button
                      onClick={() => setStickyHeader(!stickyHeader)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        stickyHeader ? "bg-gray-900 dark:bg-gray-100" : "bg-gray-300 dark:bg-gray-700"
                      }`}
                    >
                      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        stickyHeader ? "translate-x-4.5" : "translate-x-0.5"
                      }`} />
                    </button>
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Show Search</span>
                    <button
                      onClick={() => setShowSearch(!showSearch)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        showSearch ? "bg-gray-900 dark:bg-gray-100" : "bg-gray-300 dark:bg-gray-700"
                      }`}
                    >
                      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        showSearch ? "translate-x-4.5" : "translate-x-0.5"
                      }`} />
                    </button>
                  </label>
                </div>

                {/* Stats */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <p>Total Users: {users.length}</p>
                    <p>Selected Rows: {selectedRows.length}</p>
                    {sortState?.columnId && (
                      <p>Sorted by: {sortState.columnId} ({sortState.direction})</p>
                    )}
                    {filterState?.globalFilter && (
                      <p>Filter: {filterState.globalFilter}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Table Display */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <Users size={18} />
                Users Table
              </h2>
              
              <Table
                columns={userColumns}
                data={users}
                size={selectedSize}
                variant={selectedVariant}
                density={selectedDensity}
                selectionMode={selectedSelectionMode}
                striped={striped}
                showSearch={showSearch}
                searchPlaceholder="Search users..."
                expandable={expandable}
                renderExpanded={renderExpandedRow}
                resizableColumns={resizableColumns}
                columnReorder={columnReorder}
                rowReorder={rowReorder}
                stickyHeader={stickyHeader}
                maxHeight={stickyHeader ? "500px" : undefined}
                loading={loading}
                onSelectionChange={handleSelectionChange}
                onSortChange={handleSortChange}
                onFilterChange={handleFilterChange}
                onRowClick={(row) => console.log("Row clicked:", row)}
                toolbarStartContent={
                  <div className="flex items-center gap-2">
                    <button className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                      <Download size={12} />
                    </button>
                    <button className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                      <Upload size={12} />
                    </button>
                  </div>
                }
                toolbarEndContent={
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {users.length} users
                    </span>
                  </div>
                }
                bottomContent={
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Showing {users.length} of {users.length} users
                    </span>
                    <div className="flex gap-1">
                      <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <ChevronLeft size={14} />
                      </button>
                      <span className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 rounded">1</span>
                      <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                }
              />
            </div>
          </div>
        </div>

        {/* Orders Table Example */}
        <div className="mt-8">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <ShoppingCart size={18} />
              Orders Table (Read-only Example)
            </h2>
            
            <Table
              columns={orderColumns}
              data={orders}
              size="md"
              variant="default"
              density="comfortable"
              selectionMode="none"
              striped={true}
              showSearch={true}
              searchPlaceholder="Search orders..."
              resizableColumns={true}
              className="w-full"
            />
          </div>
        </div>

        {/* Feature Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <Filter size={16} className="text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Sorting & Filtering</span>
            </div>
            <p className="text-xs text-blue-700 dark:text-blue-300">Multi-column sort with global search</p>
          </div>
          
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-xl p-4 border border-emerald-100 dark:border-emerald-800">
            <div className="flex items-center gap-2 mb-2">
              <Check size={16} className="text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-medium text-emerald-900 dark:text-emerald-100">Row Selection</span>
            </div>
            <p className="text-xs text-emerald-700 dark:text-emerald-300">Single or multiple row selection</p>
          </div>
          
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-xl p-4 border border-amber-100 dark:border-amber-800">
            <div className="flex items-center gap-2 mb-2">
              <Package size={16} className="text-amber-600 dark:text-amber-400" />
              <span className="text-sm font-medium text-amber-900 dark:text-amber-100">Expandable Rows</span>
            </div>
            <p className="text-xs text-amber-700 dark:text-amber-300">Expand/collapse for additional details</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl p-4 border border-purple-100 dark:border-purple-800">
            <div className="flex items-center gap-2 mb-2">
              <GripVertical size={16} className="text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-purple-900 dark:text-purple-100">Drag & Drop</span>
            </div>
            <p className="text-xs text-purple-700 dark:text-purple-300">Column and row reordering</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper component for GripVertical if needed
const GripVertical = ({ size }: { size?: number }) => (
  <svg
    width={size || 24}
    height={size || 24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="9" cy="12" r="1" />
    <circle cx="9" cy="5" r="1" />
    <circle cx="9" cy="19" r="1" />
    <circle cx="15" cy="12" r="1" />
    <circle cx="15" cy="5" r="1" />
    <circle cx="15" cy="19" r="1" />
  </svg>
);