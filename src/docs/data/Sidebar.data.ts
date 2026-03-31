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
        label: "Components",
        icon: LayoutGrid,
        children: [
          {
            label: "General",
            children: [
              { label: "Accordion", path: "/docs/components/accordion" },
              { label: "Alert", path: "/docs/components/alert" },
              // { label: "Alert Dialog", path: "/docs/components/alert-dialog" },
              // { label: "Avatar", path: "/docs/components/avatar" },
              // { label: "Badge", path: "/docs/components/badge" },
              // { label: "Button", path: "/docs/components/button" },
              // { label: "Card", path: "/docs/components/card" },
              // { label: "Checkbox", path: "/docs/components/checkbox" },
              // { label: "Collapsible", path: "/docs/components/collapsible" },
              // { label: "Command", path: "/docs/components/command" },
              // { label: "Context Menu", path: "/docs/components/context-menu" },
              // { label: "Dialog", path: "/docs/components/dialog" },
              // { label: "Drawer", path: "/docs/components/drawer" },
              // { label: "Dropdown Menu", path: "/docs/components/dropdown-menu" },
            ],
          },
          {
            label: "Forms",
            children: [
              // { label: "Form", path: "/docs/components/form" },
              // { label: "Input", path: "/docs/components/input" },
              // { label: "Label", path: "/docs/components/label" },
              // { label: "Radio Group", path: "/docs/components/radio-group" },
              // { label: "Select", path: "/docs/components/select" },
              // { label: "Slider", path: "/docs/components/slider" },
              // { label: "Switch", path: "/docs/components/switch" },
              // { label: "Textarea", path: "/docs/components/textarea" },
            ],
          },
          {
            label: "Navigation",
            children: [
              // { label: "Breadcrumb", path: "/docs/components/breadcrumb" },
              // { label: "Menu Bar", path: "/docs/components/menu-bar" },
              // { label: "Navigation Menu", path: "/docs/components/navigation-menu" },
              // { label: "Pagination", path: "/docs/components/pagination" },
              // { label: "Sidebar", path: "/docs/components/sidebar" },
              // { label: "Tabs", path: "/docs/components/tabs" },
            ],
          },
          {
            label: "Display",
            children: [
              // { label: "Aspect Ratio", path: "/docs/components/aspect-ratio" },
              // { label: "Calendar", path: "/docs/components/calendar" },
              // { label: "Carousel", path: "/docs/components/carousel" },
              // { label: "Chart", path: "/docs/components/chart" },
              // { label: "Data Table", path: "/docs/components/data-table" },
              // { label: "Date Picker", path: "/docs/components/date-picker" },
              // { label: "Progress", path: "/docs/components/progress" },
              // { label: "Skeleton", path: "/docs/components/skeleton" },
              // { label: "Sonner", path: "/docs/components/sonner" },
              // { label: "Table", path: "/docs/components/table" },
              // { label: "Tooltip", path: "/docs/components/tooltip" },
            ],
          },
          {
            label: "Overlay",
            children: [
              // { label: "Hover Card", path: "/docs/components/hover-card" },
              // { label: "Popover", path: "/docs/components/popover" },
              // { label: "Sheet", path: "/docs/components/sheet" },
              // { label: "Toast", path: "/docs/components/toast" },
            ],
          },
        ],
      },
      {
        label: "API Reference",
        icon: Code2,
        children: [
          {
            label: "Core",
            children: [
              // { label: "Authentication", path: "/docs/api/authentication" },
              // { label: "Endpoints", path: "/docs/api/endpoints" },
              // { label: "Errors", path: "/docs/api/errors" },
              // { label: "Pagination", path: "/docs/api/pagination" },
              // { label: "Rate Limiting", path: "/docs/api/rate-limiting" },
              // { label: "Versioning", path: "/docs/api/versioning" },
            ],
          },
          {
            label: "Resources",
            children: [
              // { label: "Users", path: "/docs/api/users" },
              // { label: "Projects", path: "/docs/api/projects" },
              // { label: "Teams", path: "/docs/api/teams" },
              // { label: "Tokens", path: "/docs/api/tokens" },
              // { label: "Webhooks", path: "/docs/api/webhooks" },
            ],
          },
        ],
      },
      {
        label: "Guides",
        icon: BookOpen,
        children: [
          // { label: "Theming", path: "/docs/guides/theming" },
          // { label: "Dark Mode", path: "/docs/guides/dark-mode" },
          // { label: "Accessibility", path: "/docs/guides/accessibility" },
          // { label: "Animations", path: "/docs/guides/animations" },
          // { label: "Figma", path: "/docs/guides/figma" },
          // { label: "Next.js", path: "/docs/guides/nextjs" },
          // { label: "Vite", path: "/docs/guides/vite" },
          // { label: "Remix", path: "/docs/guides/remix" },
          // { label: "Astro", path: "/docs/guides/astro" },
        ],
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
        label: "Documentation",
        icon: FileText,
        path: "/docs/documentation",
      },
      {
        label: "Changelog",
        icon: ScrollText,
        path: "/docs/changelog",
      },
    ],
  },
];
