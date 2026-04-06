// TreeShowcase.tsx
import React, { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tree,
  type TreeNodeData,
  type TreeSize,
  type TreeVariant,
  type TreeSelectionMode,
  type TreeNodeClassNames,
} from "../../../ui/navigations/tree/Tree.ui";
import {
  Folder,
  FolderOpen,
  FileText,
  Image,
  Video,
  Music,
  Code,
  Database,
  Cloud,
  Server,
  Users,
  Settings,
  Home,
  Mail,
  Calendar,
  Star,
  Heart,
  Bookmark,
  Flag,
  Download,
  Upload,
  Plus,
  Minus,
  Trash2,
  Edit,
  Copy,
  ChevronRight,
  ChevronDown,
  Search,
  Filter,
  RefreshCw,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Globe,
  Zap,
  Sparkles,
  Shield,
  Award,
  Gift,
  Coffee,
  Camera,
  Map,
  Pin,
  Compass,
  Target,
  TrendingUp,
  BarChart,
  PieChart,
  LineChart,
  Activity,
  Bell,
  MessageCircle,
  Phone,
  Video as VideoIcon,
  Mic,
  Headphones,
  Speaker,
  Monitor,
  Cpu,
  HardDrive,
  Wifi,
  Bluetooth,
  Battery,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  CloudRain,
  CloudSnow,
  Wind,
  Thermometer,
} from "lucide-react";

// Sample file explorer data
const fileExplorerData: TreeNodeData[] = [
  {
    id: "projects",
    label: "Projects",
    icon: <Folder size={16} />,
    defaultExpanded: true,
    children: [
      {
        id: "web-app",
        label: "Web App",
        icon: <Folder size={16} />,
        defaultExpanded: true,
        children: [
          { id: "src", label: "src", icon: <Folder size={16} />, children: [
            { id: "components", label: "components", icon: <Folder size={16} />, children: [
              { id: "header", label: "Header.tsx", icon: <FileText size={16} />, sublabel: "2.3 KB" },
              { id: "footer", label: "Footer.tsx", icon: <FileText size={16} />, sublabel: "1.1 KB" },
              { id: "sidebar", label: "Sidebar.tsx", icon: <FileText size={16} />, sublabel: "3.2 KB" },
            ] },
            { id: "pages", label: "pages", icon: <Folder size={16} />, children: [
              { id: "home", label: "Home.tsx", icon: <FileText size={16} />, sublabel: "5.7 KB" },
              { id: "about", label: "About.tsx", icon: <FileText size={16} />, sublabel: "2.1 KB" },
              { id: "contact", label: "Contact.tsx", icon: <FileText size={16} />, sublabel: "3.4 KB" },
            ] },
            { id: "index", label: "index.tsx", icon: <FileText size={16} />, sublabel: "892 B" },
            { id: "app", label: "App.tsx", icon: <FileText size={16} />, sublabel: "4.2 KB" },
          ] },
          { id: "public", label: "public", icon: <Folder size={16} />, children: [
            { id: "index-html", label: "index.html", icon: <FileText size={16} />, sublabel: "1.2 KB" },
            { id: "favicon", label: "favicon.ico", icon: <FileText size={16} />, sublabel: "15 KB" },
          ] },
          { id: "package", label: "package.json", icon: <FileText size={16} />, sublabel: "2.1 KB" },
          { id: "readme", label: "README.md", icon: <FileText size={16} />, sublabel: "3.5 KB" },
        ],
      },
      {
        id: "mobile-app",
        label: "Mobile App",
        icon: <Folder size={16} />,
        children: [
          { id: "android", label: "android", icon: <Folder size={16} />, children: [
            { id: "main", label: "MainActivity.kt", icon: <FileText size={16} /> },
          ] },
          { id: "ios", label: "ios", icon: <Folder size={16} />, children: [
            { id: "view-controller", label: "ViewController.swift", icon: <FileText size={16} /> },
          ] },
        ],
      },
    ],
  },
  {
    id: "documents",
    label: "Documents",
    icon: <Folder size={16} />,
    children: [
      { id: "resume", label: "Resume.pdf", icon: <FileText size={16} />, sublabel: "245 KB" },
      { id: "cover-letter", label: "Cover Letter.docx", icon: <FileText size={16} />, sublabel: "128 KB" },
      { id: "portfolio", label: "Portfolio.pdf", icon: <FileText size={16} />, sublabel: "1.2 MB" },
    ],
  },
  {
    id: "images",
    label: "Images",
    icon: <Folder size={16} />,
    children: [
      { id: "profile", label: "profile.jpg", icon: <Image size={16} />, sublabel: "2.1 MB" },
      { id: "banner", label: "banner.png", icon: <Image size={16} />, sublabel: "3.4 MB" },
      { id: "gallery", label: "gallery", icon: <Folder size={16} />, children: [
        { id: "photo1", label: "photo1.jpg", icon: <Image size={16} />, sublabel: "1.8 MB" },
        { id: "photo2", label: "photo2.jpg", icon: <Image size={16} />, sublabel: "2.2 MB" },
        { id: "photo3", label: "photo3.jpg", icon: <Image size={16} />, sublabel: "1.5 MB" },
      ] },
    ],
  },
  {
    id: "media",
    label: "Media",
    icon: <Folder size={16} />,
    children: [
      { id: "videos", label: "videos", icon: <Video size={16} />, children: [
        { id: "intro", label: "intro.mp4", icon: <Video size={16} />, sublabel: "45 MB" },
        { id: "tutorial", label: "tutorial.mp4", icon: <Video size={16} />, sublabel: "128 MB" },
      ] },
      { id: "music", label: "music", icon: <Music size={16} />, children: [
        { id: "song1", label: "song1.mp3", icon: <Music size={16} />, sublabel: "3.5 MB" },
        { id: "song2", label: "song2.mp3", icon: <Music size={16} />, sublabel: "4.2 MB" },
      ] },
    ],
  },
  {
    id: "locked-folder",
    label: "Private Files",
    icon: <Folder size={16} />,
    locked: true,
    children: [
      { id: "secret", label: "secret.txt", icon: <FileText size={16} /> },
    ],
  },
];

// Sample organization chart data
const orgChartData: TreeNodeData[] = [
  {
    id: "ceo",
    label: "CEO",
    sublabel: "John Smith",
    icon: <Users size={16} />,
    defaultExpanded: true,
    children: [
      {
        id: "cto",
        label: "CTO",
        sublabel: "Alice Johnson",
        icon: <Users size={16} />,
        children: [
          { id: "frontend", label: "Frontend Lead", sublabel: "Bob Wilson", icon: <Users size={16} />, children: [
            { id: "frontend-dev1", label: "Frontend Developer", sublabel: "Carol Davis", icon: <Users size={16} /> },
            { id: "frontend-dev2", label: "Frontend Developer", sublabel: "David Brown", icon: <Users size={16} /> },
          ] },
          { id: "backend", label: "Backend Lead", sublabel: "Emma Lee", icon: <Users size={16} />, children: [
            { id: "backend-dev1", label: "Backend Developer", sublabel: "Frank Miller", icon: <Users size={16} /> },
          ] },
          { id: "devops", label: "DevOps Lead", sublabel: "Grace Taylor", icon: <Users size={16} /> },
        ],
      },
      {
        id: "cfo",
        label: "CFO",
        sublabel: "Henry Adams",
        icon: <Users size={16} />,
        children: [
          { id: "finance", label: "Finance Manager", sublabel: "Ivy Chen", icon: <Users size={16} /> },
          { id: "accounting", label: "Accounting Lead", sublabel: "Jack White", icon: <Users size={16} /> },
        ],
      },
      {
        id: "cmo",
        label: "CMO",
        sublabel: "Karen Black",
        icon: <Users size={16} />,
        children: [
          { id: "marketing", label: "Marketing Manager", sublabel: "Leo Green", icon: <Users size={16} /> },
          { id: "sales", label: "Sales Lead", sublabel: "Mona Grey", icon: <Users size={16} /> },
        ],
      },
    ],
  },
];

// Sample async loading data
const asyncData: TreeNodeData[] = [
  {
    id: "cloud-storage",
    label: "Cloud Storage",
    icon: <Cloud size={16} />,
    hasChildren: true,
    children: [],
  },
  {
    id: "database",
    label: "Database",
    icon: <Database size={16} />,
    hasChildren: true,
    children: [],
  },
  {
    id: "api",
    label: "API Endpoints",
    icon: <Server size={16} />,
    hasChildren: true,
    children: [],
  },
];

// Mock async load function
const loadAsyncChildren = async (nodeId: string): Promise<TreeNodeData[]> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const mockData: Record<string, TreeNodeData[]> = {
    "cloud-storage": [
      { id: "bucket1", label: "images-bucket", icon: <Folder size={16} />, sublabel: "1.2 GB" },
      { id: "bucket2", label: "documents-bucket", icon: <Folder size={16} />, sublabel: "3.4 GB" },
      { id: "bucket3", label: "backups-bucket", icon: <Folder size={16} />, sublabel: "5.6 GB" },
    ],
    "database": [
      { id: "users-table", label: "users", icon: <Database size={16} />, sublabel: "1,234 records" },
      { id: "orders-table", label: "orders", icon: <Database size={16} />, sublabel: "5,678 records" },
      { id: "products-table", label: "products", icon: <Database size={16} />, sublabel: "890 records" },
    ],
    "api": [
      { id: "auth", label: "auth", icon: <Server size={16} />, children: [
        { id: "login", label: "POST /login", icon: <Code size={16} /> },
        { id: "logout", label: "POST /logout", icon: <Code size={16} /> },
      ] },
      { id: "users", label: "users", icon: <Server size={16} />, children: [
        { id: "get-users", label: "GET /users", icon: <Code size={16} /> },
        { id: "post-users", label: "POST /users", icon: <Code size={16} /> },
      ] },
    ],
  };
  
  return mockData[nodeId] || [];
};

// Sample settings data
const settingsData: TreeNodeData[] = [
  {
    id: "appearance",
    label: "Appearance",
    icon: <Sun size={16} />,
    children: [
      { id: "theme", label: "Theme", icon: <Sun size={16} />, sublabel: "Light / Dark" },
      { id: "font", label: "Font Size", icon: <FileText size={16} />, sublabel: "Medium" },
      { id: "accent", label: "Accent Color", icon: <Sparkles size={16} />, sublabel: "Blue" },
    ],
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: <Bell size={16} />,
    children: [
      { id: "email", label: "Email Notifications", icon: <Mail size={16} /> },
      { id: "push", label: "Push Notifications", icon: <MessageCircle size={16} /> },
      { id: "sound", label: "Sound Alerts", icon: <Volume2 size={16} /> },
    ],
  },
  {
    id: "privacy",
    label: "Privacy & Security",
    icon: <Shield size={16} />,
    locked: true,
    children: [
      { id: "password", label: "Password", icon: <Lock size={16} /> },
      { id: "2fa", label: "Two-Factor Auth", icon: <Shield size={16} /> },
    ],
  },
];

// Main showcase component
export default function TreeShowcase() {
  const [selectedSize, setSelectedSize] = useState<TreeSize>("md");
  const [selectedVariant, setSelectedVariant] = useState<TreeVariant>("default");
  const [selectedSelectionMode, setSelectedSelectionMode] = useState<TreeSelectionMode>("single");
  const [checkable, setCheckable] = useState(false);
  const [draggable, setDraggable] = useState(false);
  const [showConnectors, setShowConnectors] = useState(true);
  const [showSearch, setShowSearch] = useState(true);
  const [maxHeight, setMaxHeight] = useState<string>("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  // Size options
  const sizes: { value: TreeSize; label: string }[] = [
    { value: "sm", label: "Small" },
    { value: "md", label: "Medium" },
    { value: "lg", label: "Large" },
    { value: "xl", label: "XL" },
  ];

  // Variant options
  const variants: { value: TreeVariant; label: string; description: string }[] = [
    { value: "default", label: "Default", description: "Subtle bordered cards" },
    { value: "filled", label: "Filled", description: "Dark header and footer" },
    { value: "ghost", label: "Ghost", description: "Minimal transparent style" },
    { value: "outline", label: "Outline", description: "Bordered with outline" },
  ];

  // Selection mode options
  const selectionModes: { value: TreeSelectionMode; label: string }[] = [
    { value: "none", label: "None" },
    { value: "single", label: "Single" },
    { value: "multiple", label: "Multiple" },
  ];

  // Handle node selection
  const handleNodeSelect = useCallback((node: TreeNodeData, selected: boolean) => {
    console.log("Node selected:", node.label, selected);
  }, []);

  // Handle node check
  const handleNodeCheck = useCallback((node: TreeNodeData, checked: boolean, checkedIds: string[]) => {
    setCheckedItems(checkedIds);
    console.log("Node checked:", node.label, checked, "Total checked:", checkedIds.length);
  }, []);

  // Handle node drop (drag and drop)
  const handleNodeDrop = useCallback((dragId: string, dropId: string) => {
    console.log("Node dropped:", dragId, "onto:", dropId);
    alert(`Moved "${dragId}" to "${dropId}"`);
  }, []);

  // Handle async load
  const handleLoadChildren = useCallback(async (node: TreeNodeData): Promise<TreeNodeData[]> => {
    console.log("Loading children for:", node.label);
    return loadAsyncChildren(node.id);
  }, []);

  // Reset settings
  const resetSettings = useCallback(() => {
    setSelectedSize("md");
    setSelectedVariant("default");
    setSelectedSelectionMode("single");
    setCheckable(false);
    setDraggable(false);
    setShowConnectors(true);
    setShowSearch(true);
    setMaxHeight("");
    setSelectedItems([]);
    setCheckedItems([]);
  }, []);

  // Custom node renderer example
  const customNodeRenderer = useCallback((node: TreeNodeData, depth: number) => {
    const hasChildren = node.children && node.children.length > 0;
    return (
      <div className="flex items-center gap-2 py-1">
        {hasChildren ? (
          <ChevronRight size={14} className="text-gray-400" />
        ) : (
          <div className="w-3.5" />
        )}
        {node.icon || (hasChildren ? <Folder size={14} /> : <FileText size={14} />)}
        <span className="text-sm">{node.label}</span>
        {node.sublabel && (
          <span className="text-xs text-gray-400 ml-2">{node.sublabel}</span>
        )}
      </div>
    );
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent flex items-center gap-2">
                <FolderOpen size={28} className="text-gray-700 dark:text-gray-300" />
                Tree Component System
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                A comprehensive hierarchical tree component with selection, checkboxes, drag-and-drop, async loading, and more
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={resetSettings}
                className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <RefreshCw size={14} />
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Controls Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 sticky top-24">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <Settings size={16} />
                Controls
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
                  <div className="space-y-1">
                    {variants.map(v => (
                      <button
                        key={v.value}
                        onClick={() => setSelectedVariant(v.value)}
                        className={`w-full px-2 py-1.5 text-xs rounded-md transition-all text-left ${
                          selectedVariant === v.value
                            ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                      >
                        <div className="font-medium">{v.label}</div>
                        <div className="text-[10px] opacity-70">{v.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selection Mode */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Selection Mode
                  </label>
                  <div className="flex gap-2">
                    {selectionModes.map(m => (
                      <button
                        key={m.value}
                        onClick={() => setSelectedSelectionMode(m.value)}
                        className={`flex-1 px-2 py-1 text-xs rounded-md transition-all ${
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
                    <span className="text-sm text-gray-700 dark:text-gray-300">Checkboxes</span>
                    <button
                      onClick={() => setCheckable(!checkable)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        checkable ? "bg-gray-900 dark:bg-gray-100" : "bg-gray-300 dark:bg-gray-700"
                      }`}
                    >
                      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        checkable ? "translate-x-4.5" : "translate-x-0.5"
                      }`} />
                    </button>
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Drag & Drop</span>
                    <button
                      onClick={() => setDraggable(!draggable)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        draggable ? "bg-gray-900 dark:bg-gray-100" : "bg-gray-300 dark:bg-gray-700"
                      }`}
                    >
                      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        draggable ? "translate-x-4.5" : "translate-x-0.5"
                      }`} />
                    </button>
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Connector Lines</span>
                    <button
                      onClick={() => setShowConnectors(!showConnectors)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        showConnectors ? "bg-gray-900 dark:bg-gray-100" : "bg-gray-300 dark:bg-gray-700"
                      }`}
                    >
                      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        showConnectors ? "translate-x-4.5" : "translate-x-0.5"
                      }`} />
                    </button>
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Search Bar</span>
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
                    <p>Total Nodes: ~45</p>
                    {selectedItems.length > 0 && (
                      <p>Selected: {selectedItems.length}</p>
                    )}
                    {checkedItems.length > 0 && checkable && (
                      <p>Checked: {checkedItems.length}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tree Display */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <FolderOpen size={18} />
                File Explorer
              </h2>
              
              <Tree
                nodes={fileExplorerData}
                size={selectedSize}
                variant={selectedVariant}
                selectionMode={selectedSelectionMode}
                checkable={checkable}
                draggable={draggable}
                showConnectors={showConnectors}
                showSearch={showSearch}
                searchPlaceholder="Search files..."
                maxHeight={maxHeight || "500px"}
                header={<div className="font-medium text-sm">📁 File Explorer</div>}
                footer={
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Total files: 24</span>
                    <span>Last modified: Today</span>
                  </div>
                }
                onNodeSelect={handleNodeSelect}
                onNodeCheck={handleNodeCheck}
                onNodeDrop={draggable ? handleNodeDrop : undefined}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Organization Chart Example */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
            <Users size={20} className="text-blue-500" />
            Organization Chart
          </h2>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <Tree
              nodes={orgChartData}
              size="lg"
              variant="outline"
              selectionMode="single"
              showConnectors={true}
              header={<div className="font-medium text-sm">👥 Company Structure</div>}
              className="w-full"
            />
          </div>
        </div>

        {/* Async Loading Example */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
            <Cloud size={20} className="text-cyan-500" />
            Async Loading (Click to expand)
          </h2>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <Tree
              nodes={asyncData}
              size="md"
              variant="default"
              selectionMode="none"
              showConnectors={true}
              onLoadChildren={handleLoadChildren}
              header={<div className="font-medium text-sm">☁️ Cloud Resources</div>}
              className="w-full"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
              Click on any folder to load its contents asynchronously (simulated 1.5s delay)
            </p>
          </div>
        </div>

        {/* Settings Example with Locked Node */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
            <Settings size={20} className="text-purple-500" />
            Settings Panel (with Locked Node)
          </h2>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <Tree
              nodes={settingsData}
              size="md"
              variant="filled"
              selectionMode="single"
              checkable={true}
              showConnectors={true}
              header={<div className="font-medium text-sm">⚙️ Application Settings</div>}
              footer={
                <div className="text-xs text-amber-600 dark:text-amber-400">
                  🔒 Privacy & Security section is locked
                </div>
              }
              className="w-full"
            />
          </div>
        </div>

        {/* Size Comparison */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
            <Eye size={20} className="text-indigo-500" />
            Size Comparison
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sizes.map(size => (
              <div key={size.value} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{size.label}</p>
                <Tree
                  nodes={[
                    { id: "root", label: "Root Folder", icon: <Folder size={14} />, children: [
                      { id: "child1", label: "Child Item 1", icon: <FileText size={14} /> },
                      { id: "child2", label: "Child Item 2", icon: <FileText size={14} /> },
                    ] },
                  ]}
                  size={size.value}
                  variant="default"
                  selectionMode="none"
                  showConnectors={true}
                  bare
                />
              </div>
            ))}
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={16} className="text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Multiple Selection</span>
            </div>
            <p className="text-xs text-blue-700 dark:text-blue-300">Single or multiple node selection</p>
          </div>
          
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-xl p-4 border border-emerald-100 dark:border-emerald-800">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={16} className="text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-medium text-emerald-900 dark:text-emerald-100">Checkboxes</span>
            </div>
            <p className="text-xs text-emerald-700 dark:text-emerald-300">Parent/child cascade checking</p>
          </div>
          
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-xl p-4 border border-amber-100 dark:border-amber-800">
            <div className="flex items-center gap-2 mb-2">
              <GripVertical size={16} className="text-amber-600 dark:text-amber-400" />
              <span className="text-sm font-medium text-amber-900 dark:text-amber-100">Drag & Drop</span>
            </div>
            <p className="text-xs text-amber-700 dark:text-amber-300">Reorder nodes via drag-drop</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl p-4 border border-purple-100 dark:border-purple-800">
            <div className="flex items-center gap-2 mb-2">
              <Cloud size={16} className="text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-purple-900 dark:text-purple-100">Async Loading</span>
            </div>
            <p className="text-xs text-purple-700 dark:text-purple-300">Lazy load child nodes</p>
          </div>
        </div>

        {/* Custom Renderer Example */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
            <Sparkles size={20} className="text-yellow-500" />
            Custom Node Renderer
          </h2>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <Tree
              nodes={[
                { id: "custom1", label: "Custom Styled Node", sublabel: "With custom renderer", icon: <Star size={14} /> },
                { id: "custom2", label: "Another Node", sublabel: "Different style", icon: <Heart size={14} /> },
              ]}
              size="md"
              variant="ghost"
              selectionMode="single"
              renderNode={customNodeRenderer}
              bare
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
              This tree uses a custom node renderer function
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper components for custom icons if needed
const GripVertical = ({ size }: { size?: number }) => (
  <svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="9" cy="12" r="1" />
    <circle cx="9" cy="5" r="1" />
    <circle cx="9" cy="19" r="1" />
    <circle cx="15" cy="12" r="1" />
    <circle cx="15" cy="5" r="1" />
    <circle cx="15" cy="19" r="1" />
  </svg>
);