// ListShowcase.tsx
import React, { useState, useCallback } from "react";
import {
  List,
  ListToolbar,
  type ListItemData,
  type ListSize,
  type ListVariant,
  type ListDensity,
  type ListSelectionMode,
} from "../../../ui/data/list/List.ui";
import {
  Star,
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
  Bell,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  Bookmark,
  Heart,
  Eye,
  Share2,
  Download,
  Upload,
  Settings,
  Home,
  FileText,
  Image,
  Video,
  Music,
  Code,
  Globe,
  Lock,
  Unlock,
  Plus,
  Minus,
  Filter,
} from "lucide-react";

// Sample data generator
const generateItems = (count: number): ListItemData[] => {
  const statuses = ["active", "pending", "completed", "archived"];
  const priorities = ["low", "medium", "high"];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `item-${i + 1}`,
    label: `Project ${String.fromCharCode(65 + (i % 26))}${i + 1}`,
    description: `This is a detailed description for project ${i + 1}. It includes various metadata and information about the project status.`,
    metadata: new Date(Date.now() - i * 86400000).toLocaleDateString(),
    leadingIcon: i % 3 === 0 ? <Star /> : i % 3 === 1 ? <Heart /> : <Bookmark />,
    avatar: i % 4 === 0 ? {
      src: `https://i.pravatar.cc/150?img=${i + 1}`,
      alt: `User ${i + 1}`,
    } : undefined,
    badge: i % 5 === 0 ? {
      label: statuses[i % statuses.length],
      variant: i % 3 === 0 ? "success" : i % 3 === 1 ? "warning" : "info",
    } : undefined,
    variant: i % 10 === 0 ? "danger" : i % 10 === 5 ? "warning" : "default",
    disabled: i === 3 || i === 7,
    loading: false,
    actions: (
      <div className="flex gap-1">
        <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors">
          <Edit size={14} />
        </button>
        <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors">
          <Copy size={14} />
        </button>
        <button className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors">
          <Trash2 size={14} />
        </button>
      </div>
    ),
    data: { priority: priorities[i % 3], status: statuses[i % statuses.length] },
  }));
};

// Main showcase component
export default function ListShowcase() {
  const [items, setItems] = useState(() => generateItems(20));
  const [size, setSize] = useState<ListSize>("md");
  const [variant, setVariant] = useState<ListVariant>("bordered");
  const [density, setDensity] = useState<ListDensity>("comfortable");
  const [selectionMode, setSelectionMode] = useState<ListSelectionMode>("checkbox");
  const [isReorderable, setIsReorderable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Filter and sort items
  const filteredItems = useCallback(() => {
    let filtered = [...items];
    
    // Filter by search
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Sort items
    if (sortBy === "name") {
      filtered.sort((a, b) => a.label.localeCompare(b.label));
    } else if (sortBy === "date") {
      filtered.sort((a, b) => (b.metadata || "").localeCompare(a.metadata || ""));
    } else if (sortBy === "status") {
      filtered.sort((a, b) => {
        const statusA = a.badge?.label || "";
        const statusB = b.badge?.label || "";
        return statusA.localeCompare(statusB);
      });
    }
    
    return filtered;
  }, [items, searchTerm, sortBy]);

  const displayItems = filteredItems();

  // Handle selection change
  const handleSelectionChange = useCallback((selectedIds: string[]) => {
    setSelectedItems(selectedIds);
    console.log("Selected items:", selectedIds);
  }, []);

  // Handle reorder
  const handleReorder = useCallback((reorderedItems: ListItemData[]) => {
    setItems(reorderedItems);
    console.log("Items reordered");
  }, []);

  // Handle item click
  const handleItemClick = useCallback((item: ListItemData) => {
    console.log("Clicked item:", item);
  }, []);

  // Simulate loading
  const simulateLoading = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  // Reset all settings
  const resetSettings = useCallback(() => {
    setSize("md");
    setVariant("bordered");
    setDensity("comfortable");
    setSelectionMode("checkbox");
    setIsReorderable(false);
    setSearchTerm("");
    setSortBy("default");
  }, []);

  // Sort options for toolbar
  const sortOptions = [
    { label: "Default", value: "default" },
    { label: "Name", value: "name" },
    { label: "Date", value: "date" },
    { label: "Status", value: "status" },
  ];

  // Custom toolbar actions
  const toolbarActions = (
    <div className="flex gap-2">
      <button
        onClick={() => console.log("Export clicked")}
        className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-1"
      >
        <Download size={12} />
        Export
      </button>
      <button
        onClick={() => console.log("Import clicked")}
        className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-1"
      >
        <Upload size={12} />
        Import
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
                List Component Showcase
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                A comprehensive, feature-rich list component with animations and accessibility
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={resetSettings}
                className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Reset Settings
              </button>
              <button
                onClick={simulateLoading}
                className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                Simulate Loading
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Controls Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 sticky top-20">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <Settings size={18} />
                Controls
              </h2>
              
              <div className="space-y-4">
                {/* Size Control */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Size
                  </label>
                  <div className="flex gap-2">
                    {(["sm", "md", "lg", "xl"] as ListSize[]).map(s => (
                      <button
                        key={s}
                        onClick={() => setSize(s)}
                        className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                          size === s
                            ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                      >
                        {s.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Variant Control */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Variant
                  </label>
                  <div className="space-y-2">
                    {(["default", "bordered", "card", "ghost", "divided"] as ListVariant[]).map(v => (
                      <button
                        key={v}
                        onClick={() => setVariant(v)}
                        className={`w-full px-3 py-2 text-sm rounded-lg transition-all text-left ${
                          variant === v
                            ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                      >
                        {v.charAt(0).toUpperCase() + v.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Density Control */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Density
                  </label>
                  <div className="flex gap-2">
                    {(["compact", "comfortable", "spacious"] as ListDensity[]).map(d => (
                      <button
                        key={d}
                        onClick={() => setDensity(d)}
                        className={`flex-1 px-3 py-1.5 text-sm rounded-lg transition-all ${
                          density === d
                            ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                      >
                        {d.charAt(0).toUpperCase() + d.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selection Mode */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Selection Mode
                  </label>
                  <div className="space-y-2">
                    {(["none", "single", "multiple", "checkbox"] as ListSelectionMode[]).map(m => (
                      <button
                        key={m}
                        onClick={() => setSelectionMode(m)}
                        className={`w-full px-3 py-2 text-sm rounded-lg transition-all text-left ${
                          selectionMode === m
                            ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                      >
                        {m.charAt(0).toUpperCase() + m.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reorderable Toggle */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Reorderable
                  </label>
                  <button
                    onClick={() => setIsReorderable(!isReorderable)}
                    className={`w-full px-3 py-2 text-sm rounded-lg transition-all ${
                      isReorderable
                        ? "bg-green-500 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {isReorderable ? "Enabled" : "Disabled"}
                  </button>
                </div>

                {/* Stats */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <p>Total Items: {items.length}</p>
                    <p>Filtered Items: {displayItems.length}</p>
                    <p>Selected: {selectedItems.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* List Component */}
          <div className="lg:col-span-3">
            <List
              items={displayItems}
              size={size}
              variant={variant}
              density={density}
              selectionMode={selectionMode}
              isReorderable={isReorderable}
              isLoading={isLoading}
              onItemClick={handleItemClick}
              onSelectionChange={handleSelectionChange}
              onReorder={handleReorder}
              toolbar={
                <ListToolbar
                  showSearch={true}
                  showSelectAll={selectionMode === "checkbox"}
                  showCount={true}
                  searchPlaceholder="Search projects..."
                  searchValue={searchTerm}
                  onSearchChange={setSearchTerm}
                  sortOptions={sortOptions}
                  sortValue={sortBy}
                  onSortChange={setSortBy}
                  actions={toolbarActions}
                />
              }
              empty={{
                icon: <FolderOpen size={48} />,
                title: "No items found",
                description: "Try adjusting your search or filters to find what you're looking for.",
                action: (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                  >
                    Clear Search
                  </button>
                ),
              }}
              footer={
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Showing {displayItems.length} of {items.length} items
                  </span>
                  <div className="flex gap-2">
                    <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors">
                      <ChevronLeft size={16} />
                    </button>
                    <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors">
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              }
              className="shadow-lg"
              wrapperClassName="transition-all duration-300"
              listClassName="transition-all duration-300"
            />
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Star className="text-blue-600 dark:text-blue-400" size={20} />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Rich Features</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-center gap-2">
                <CheckCircle size={14} className="text-green-500" />
                Multiple selection modes
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={14} className="text-green-500" />
                Drag and drop reordering
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={14} className="text-green-500" />
                Avatar and icon support
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={14} className="text-green-500" />
                Badges and metadata
              </li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Settings className="text-purple-600 dark:text-purple-400" size={20} />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Customization</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-center gap-2">
                <CheckCircle size={14} className="text-green-500" />
                5 visual variants
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={14} className="text-green-500" />
                4 density options
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={14} className="text-green-500" />
                4 size variants
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={14} className="text-green-500" />
                Dark mode support
              </li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Eye className="text-green-600 dark:text-green-400" size={20} />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Accessibility</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-center gap-2">
                <CheckCircle size={14} className="text-green-500" />
                Keyboard navigation
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={14} className="text-green-500" />
                ARIA attributes
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={14} className="text-green-500" />
                Focus management
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={14} className="text-green-500" />
                Screen reader support
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper components for icons
const FolderOpen = ({ size }: { size?: number }) => (
  <svg
    width={size || 24}
    height={size || 24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7l-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Z" />
    <path d="M2 10h20" />
  </svg>
);

const ChevronLeft = ({ size }: { size?: number }) => (
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
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const ChevronRight = ({ size }: { size?: number }) => (
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
    <path d="M9 18l6-6-6-6" />
  </svg>
);