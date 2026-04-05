import {
  Play,
  Download,
  LayoutGrid,
  Code2,
  BookOpen,
  Bell,
  Globe,
  Gauge,
  ShieldCheck,
  FileText,
  ScrollText,
  MousePointerClick,
  Table2,
  MessageSquare,
  Layers,
  Navigation,
  BarChart2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavItem = {
  label: string;
  icon?: LucideIcon;
  path?: string;
  badge?: string;
  badgeColor?: string;
  external?: boolean;
  children?: NavItem[];
};

export type SidebarSection = {
  title?: string;
  items: NavItem[];
};

export const sidebarData: SidebarSection[] = [
  {
    items: [
      {
        label: "Documentation",
        icon: FileText,
        path: "/docs",
      },
      {
        label: "Themes",
        icon: LayoutGrid,
        path: "/themes",
        badge: "Hot",
        badgeColor: "orange",
      },
      {
        label: "GitHub",
        icon: Globe,
        path: "https://github.com",
        external: true,
      },
    ],
  },
  {
    title: "Menu",
    items: [
      {
        label: "Getting Started",
        icon: Play,
        path: "/docs/getting-started",
      },
      {
        label: "Installation",
        icon: Download,
        path: "/docs/installation",
      },
      {
        label: "Inputs",
        icon: MousePointerClick,
        children: [
          { label: "Buttons", path: "/docs/inputs/buttons" },
          { label: "Text Fields", path: "/docs/inputs/text-fields" },
          { label: "Date Picker", path: "/docs/inputs/date-picker" },
          { label: "Time Picker", path: "/docs/inputs/time-picker" },
          { label: "Option Menu", path: "/docs/inputs/option-menu" },
          { label: "Autocomplete", path: "/docs/inputs/autocomplete" },
          { label: "Check Box", path: "/docs/inputs/check-box" },
          { label: "Radio Buttons", path: "/docs/inputs/radio-buttons" },
          { label: "Toggle Button", path: "/docs/inputs/toggle-button" },
          { label: "Slider", path: "/docs/inputs/slider" },
          { label: "Switch", path: "/docs/inputs/switch" },
          { label: "Colors", path: "/docs/inputs/colors" },
          { label: "Text Editor", path: "/docs/inputs/text-editor" },
        ],
      },
      {
        label: "Data",
        icon: Table2,
        children: [
          { label: "Table", path: "/docs/data/table" },
          { label: "List", path: "/docs/data/list" },
          { label: "Avatar", path: "/docs/data/avatar" },
          { label: "Tooltip", path: "/docs/data/tooltip" },
          { label: "Chip", path: "/docs/data/chip" },
          { label: "Image", path: "/docs/data/image" },
          { label: "Card", path: "/docs/data/card" },
        ],
      },
      {
        label: "Feedback",
        icon: MessageSquare,
        children: [
          { label: "Loader", path: "/docs/feedback/loader" },
          { label: "Skeleton", path: "/docs/feedback/skeleton" },
          { label: "Alerts", path: "/docs/feedback/alerts" },
          { label: "Snackbar", path: "/docs/feedback/snackbar" },
          { label: "Dialog", path: "/docs/feedback/dialog" },
          { label: "Message", path: "/docs/feedback/message" },
        ],
      },
      {
        label: "Overlays",
        icon: Layers,
        children: [
          { label: "Connect Window", path: "/docs/overlays/connect-window" },
          { label: "Confirm Window", path: "/docs/overlays/confirm-window" },
          {
            label: "Authentication Window",
            path: "/docs/overlays/authentication-window",
          },
          { label: "Message Window", path: "/docs/overlays/message-window" },
          { label: "Backdrop", path: "/docs/overlays/backdrop" },
        ],
      },
      {
        label: "Navigation",
        icon: Navigation,
        children: [
          { label: "Navbar", path: "/docs/navigation/navbar" },
          { label: "Sidebar", path: "/docs/navigation/sidebar" },
          { label: "Toolbar", path: "/docs/navigation/toolbar" },
          { label: "Tabs", path: "/docs/navigation/tabs" },
          { label: "Stepper", path: "/docs/navigation/stepper" },
          { label: "Tree", path: "/docs/navigation/tree" },
          { label: "Breadcrumb", path: "/docs/navigation/breadcrumb" },
          { label: "Link", path: "/docs/navigation/link" },
          { label: "Drawer", path: "/docs/navigation/drawer" },
          { label: "Action Menu", path: "/docs/navigation/action-menu" },
          { label: "Pagination", path: "/docs/navigation/pagination" },
          { label: "Speed Dial", path: "/docs/navigation/speed-dial" },
          { label: "Dropdown", path: "/docs/navigation/dropdown" },
        ],
      },
      {
        label: "Layout",
        icon: LayoutGrid,
        children: [
          { label: "Layout", path: "/docs/layout/layout" },
          { label: "Container", path: "/docs/layout/container" },
          { label: "Grid", path: "/docs/layout/grid" },
          { label: "Box", path: "/docs/layout/box" },
        ],
      },
      {
        label: "Forms",
        icon: Code2,
        children: [
          { label: "Login", path: "/docs/forms/login" },
          { label: "Register", path: "/docs/forms/register" },
          { label: "Forgot Password", path: "/docs/forms/forgot-password" },
          { label: "Reset Password", path: "/docs/forms/reset-password" },
          { label: "OTP", path: "/docs/forms/otp" },
        ],
      },
      {
        label: "Charts",
        icon: BarChart2,
        children: [
          { label: "Pie Chart", path: "/docs/charts/pie-chart" },
          { label: "Bar Chart", path: "/docs/charts/bar-chart" },
          { label: "Stick Chart", path: "/docs/charts/stick-chart" },
          { label: "Table Chart", path: "/docs/charts/table-chart" },
          { label: "Container", path: "/docs/charts/container" },
          { label: "Card", path: "/docs/charts/card" },
        ],
      },
      {
        label: "API Reference",
        icon: BookOpen,
        path: "/docs/api-reference",
      },
      {
        label: "Webhooks",
        icon: Bell,
        path: "/docs/webhooks",
      },
      {
        label: "Third-Party Integrations",
        icon: Globe,
        path: "/docs/integrations",
      },
      {
        label: "Rate Limits",
        icon: Gauge,
        path: "/docs/rate-limits",
      },
      {
        label: "Security Best Practices",
        icon: ShieldCheck,
        path: "/docs/security",
      },
      {
        label: "Changelog",
        icon: ScrollText,
        path: "/docs/changelog",
      },
    ],
  },
];
