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
            { label: "Text Fields", path: "/test/components/inputs" },
            { label: "Date Picker", path: "/test/components/date-and-time" },
            { label: "Buttons", path: "/test/components/buttons" },
          { label: "Time Picker", path: "/test/components/time-picker" },
          { label: "Option Menu", path: "/test/components/option-menu" },
          { label: "Autocomplete", path: "/test/components/autocomplete" },
          { label: "Check Box", path: "/test/components/check-box" },
          { label: "Radio Buttons", path: "/test/components/radio-buttons" },
          { label: "Toggle Button", path: "/test/components/toggle-button" },
          { label: "Slider", path: "/test/components/slider" },
          { label: "Switch", path: "/test/components/switch" },
          { label: "Colors", path: "/test/components/colors" },
          { label: "Text Editor", path: "/test/components/text-editor" },
        ],
      },
      {
        label: "Data",
        icon: Table2,
        children: [
          { label: "Table", path: "/test/components/table" },
          { label: "List", path: "/test/components/list" },
          { label: "Avatar", path: "/test/components/avatar" },
          { label: "Tooltip", path: "/test/components/tooltip" },
          { label: "Chip", path: "/test/components/chip" },
          { label: "Image", path: "/test/components/image" },
          { label: "Card", path: "/test/components/card" },
        ],
      },
      {
        label: "Feedback",
        icon: MessageSquare,
        children: [
          { label: "Loader", path: "/test/components/loader" },
          { label: "Skeleton", path: "/test/components/skeleton" },
          { label: "Alerts", path: "/test/components/alerts" },
          { label: "Snackbar", path: "/test/components/snackbar" },
          { label: "Dialog", path: "/test/components/dialog" },
          { label: "Message", path: "/test/components/message" },
        ],
      },
      {
        label: "Overlays",
        icon: Layers,
        children: [
          { label: "Connect Window", path: "/test/components//connect-window" },
          { label: "Confirm Window", path: "/test/components//confirm-window" },
          {
            label: "Authentication Window",
            path: "/test/components//authentication-window",
          },
          { label: "Message Window", path: "/test/components//message-window" },
          { label: "Backdrop", path: "/test/components//backdrop" },
        ],
      },
      {
        label: "Navigation",
        icon: Navigation,
        children: [
          { label: "Navbar", path: "/test/components/navbar" },
          { label: "Sidebar", path: "/test/components/sidebar" },
          { label: "Toolbar", path: "/test/components/toolbar" },
          { label: "Tabs", path: "/test/components/tabs" },
          { label: "Stepper", path: "/test/components/stepper" },
          { label: "Tree", path: "/test/components/tree" },
          { label: "Breadcrumb", path: "/test/components/breadcrumb" },
          { label: "Link", path: "/test/components/link" },
          { label: "Drawer", path: "/test/components/drawer" },
          { label: "Action Menu", path: "/test/components/action-menu" },
          { label: "Pagination", path: "/test/components/pagination" },
          { label: "Speed Dial", path: "/test/components/speed-dial" },
          { label: "Dropdown", path: "/test/components/dropdown" },
        ],
      },
      {
        label: "Layout",
        icon: LayoutGrid,
        children: [
          { label: "Layout", path: "/test/components/layout" },
          { label: "Container", path: "/test/components/container" },
          { label: "Grid", path: "/test/components/grid" },
          { label: "Box", path: "/test/components/box" },
        ],
      },
      {
        label: "Forms",
        icon: Code2,
        children: [
          { label: "Login", path: "/test/components/login" },
          { label: "Register", path: "/test/components/register" },
          { label: "Forgot Password", path: "/test/components/forgot-password" },
          { label: "Reset Password", path: "/test/components/reset-password" },
          { label: "OTP", path: "/test/components/otp" },
        ],
      },
      {
        label: "Charts",
        icon: BarChart2,
        children: [
          { label: "Pie Chart", path: "/test/components/pie-chart" },
          { label: "Bar Chart", path: "/test/components/bar-chart" },
          { label: "Stick Chart", path: "/test/components/stick-chart" },
          { label: "Table Chart", path: "/test/components/table-chart" },
          { label: "Container", path: "/test/components/container" },
          { label: "Card", path: "/test/components/card" },
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
