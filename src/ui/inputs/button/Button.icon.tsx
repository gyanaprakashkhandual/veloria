import React from "react";

interface IconProps {
  size?: number;
  strokeWidth?: number;
  className?: string;
  style?: React.CSSProperties;
}

const iconBase = (
  size: number,
  strokeWidth: number,
  children: React.ReactNode,
  className?: string,
  style?: React.CSSProperties,
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
    aria-hidden="true"
    focusable="false"
  >
    {children}
  </svg>
);

export function SpinnerIcon({
  size = 16,
  strokeWidth = 2,
  className,
  style,
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ animation: "btn-spin 700ms linear infinite", ...style }}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

export function ChevronDownIcon({
  size = 16,
  strokeWidth = 2,
  className,
  style,
}: IconProps) {
  return iconBase(
    size,
    strokeWidth,
    <polyline points="6 9 12 15 18 9" />,
    className,
    style,
  );
}

export function ChevronUpIcon({
  size = 16,
  strokeWidth = 2,
  className,
  style,
}: IconProps) {
  return iconBase(
    size,
    strokeWidth,
    <polyline points="18 15 12 9 6 15" />,
    className,
    style,
  );
}

export function ChevronRightIcon({
  size = 16,
  strokeWidth = 2,
  className,
  style,
}: IconProps) {
  return iconBase(
    size,
    strokeWidth,
    <polyline points="9 18 15 12 9 6" />,
    className,
    style,
  );
}

export function ChevronLeftIcon({
  size = 16,
  strokeWidth = 2,
  className,
  style,
}: IconProps) {
  return iconBase(
    size,
    strokeWidth,
    <polyline points="15 18 9 12 15 6" />,
    className,
    style,
  );
}

export function PlusIcon({
  size = 16,
  strokeWidth = 2,
  className,
  style,
}: IconProps) {
  return iconBase(
    size,
    strokeWidth,
    <>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </>,
    className,
    style,
  );
}

export function MinusIcon({
  size = 16,
  strokeWidth = 2,
  className,
  style,
}: IconProps) {
  return iconBase(
    size,
    strokeWidth,
    <line x1="5" y1="12" x2="19" y2="12" />,
    className,
    style,
  );
}

export function XIcon({
  size = 16,
  strokeWidth = 2,
  className,
  style,
}: IconProps) {
  return iconBase(
    size,
    strokeWidth,
    <>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </>,
    className,
    style,
  );
}

export function CheckIcon({
  size = 16,
  strokeWidth = 2,
  className,
  style,
}: IconProps) {
  return iconBase(
    size,
    strokeWidth,
    <polyline points="20 6 9 17 4 12" />,
    className,
    style,
  );
}

export function ArrowRightIcon({
  size = 16,
  strokeWidth = 2,
  className,
  style,
}: IconProps) {
  return iconBase(
    size,
    strokeWidth,
    <>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </>,
    className,
    style,
  );
}

export function ArrowLeftIcon({
  size = 16,
  strokeWidth = 2,
  className,
  style,
}: IconProps) {
  return iconBase(
    size,
    strokeWidth,
    <>
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </>,
    className,
    style,
  );
}

export function ExternalLinkIcon({
  size = 16,
  strokeWidth = 2,
  className,
  style,
}: IconProps) {
  return iconBase(
    size,
    strokeWidth,
    <>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </>,
    className,
    style,
  );
}

export function DownloadIcon({
  size = 16,
  strokeWidth = 2,
  className,
  style,
}: IconProps) {
  return iconBase(
    size,
    strokeWidth,
    <>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </>,
    className,
    style,
  );
}

export function UploadIcon({
  size = 16,
  strokeWidth = 2,
  className,
  style,
}: IconProps) {
  return iconBase(
    size,
    strokeWidth,
    <>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </>,
    className,
    style,
  );
}

export function TrashIcon({
  size = 16,
  strokeWidth = 2,
  className,
  style,
}: IconProps) {
  return iconBase(
    size,
    strokeWidth,
    <>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </>,
    className,
    style,
  );
}

export function EditIcon({
  size = 16,
  strokeWidth = 2,
  className,
  style,
}: IconProps) {
  return iconBase(
    size,
    strokeWidth,
    <>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </>,
    className,
    style,
  );
}

export function SearchIcon({
  size = 16,
  strokeWidth = 2,
  className,
  style,
}: IconProps) {
  return iconBase(
    size,
    strokeWidth,
    <>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </>,
    className,
    style,
  );
}

export function CopyIcon({
  size = 16,
  strokeWidth = 2,
  className,
  style,
}: IconProps) {
  return iconBase(
    size,
    strokeWidth,
    <>
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </>,
    className,
    style,
  );
}

export function RefreshIcon({
  size = 16,
  strokeWidth = 2,
  className,
  style,
}: IconProps) {
  return iconBase(
    size,
    strokeWidth,
    <>
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </>,
    className,
    style,
  );
}

export function FilterIcon({
  size = 16,
  strokeWidth = 2,
  className,
  style,
}: IconProps) {
  return iconBase(
    size,
    strokeWidth,
    <>
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </>,
    className,
    style,
  );
}

export function ShareIcon({
  size = 16,
  strokeWidth = 2,
  className,
  style,
}: IconProps) {
  return iconBase(
    size,
    strokeWidth,
    <>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </>,
    className,
    style,
  );
}

export function StarIcon({
  size = 16,
  strokeWidth = 2,
  className,
  style,
}: IconProps) {
  return iconBase(
    size,
    strokeWidth,
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />,
    className,
    style,
  );
}

export function HeartIcon({
  size = 16,
  strokeWidth = 2,
  className,
  style,
}: IconProps) {
  return iconBase(
    size,
    strokeWidth,
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />,
    className,
    style,
  );
}

export function BoldIcon({
  size = 16,
  strokeWidth = 2.5,
  className,
  style,
}: IconProps) {
  return iconBase(
    size,
    strokeWidth,
    <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />,
    className,
    style,
  );
}

export function ItalicIcon({
  size = 16,
  strokeWidth = 2,
  className,
  style,
}: IconProps) {
  return iconBase(
    size,
    strokeWidth,
    <>
      <line x1="19" y1="4" x2="10" y2="4" />
      <line x1="14" y1="20" x2="5" y2="20" />
      <line x1="15" y1="4" x2="9" y2="20" />
    </>,
    className,
    style,
  );
}

export function AlignLeftIcon({
  size = 16,
  strokeWidth = 2,
  className,
  style,
}: IconProps) {
  return iconBase(
    size,
    strokeWidth,
    <>
      <line x1="17" y1="10" x2="3" y2="10" />
      <line x1="21" y1="6" x2="3" y2="6" />
      <line x1="21" y1="14" x2="3" y2="14" />
      <line x1="17" y1="18" x2="3" y2="18" />
    </>,
    className,
    style,
  );
}

export function AlignCenterIcon({
  size = 16,
  strokeWidth = 2,
  className,
  style,
}: IconProps) {
  return iconBase(
    size,
    strokeWidth,
    <>
      <line x1="18" y1="10" x2="6" y2="10" />
      <line x1="21" y1="6" x2="3" y2="6" />
      <line x1="21" y1="14" x2="3" y2="14" />
      <line x1="18" y1="18" x2="6" y2="18" />
    </>,
    className,
    style,
  );
}

export function AlignRightIcon({
  size = 16,
  strokeWidth = 2,
  className,
  style,
}: IconProps) {
  return iconBase(
    size,
    strokeWidth,
    <>
      <line x1="21" y1="10" x2="7" y2="10" />
      <line x1="21" y1="6" x2="3" y2="6" />
      <line x1="21" y1="14" x2="3" y2="14" />
      <line x1="21" y1="18" x2="7" y2="18" />
    </>,
    className,
    style,
  );
}

export function GridIcon({
  size = 16,
  strokeWidth = 2,
  className,
  style,
}: IconProps) {
  return iconBase(
    size,
    strokeWidth,
    <>
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </>,
    className,
    style,
  );
}

export function ListIcon({
  size = 16,
  strokeWidth = 2,
  className,
  style,
}: IconProps) {
  return iconBase(
    size,
    strokeWidth,
    <>
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </>,
    className,
    style,
  );
}

export function SettingsIcon({
  size = 16,
  strokeWidth = 2,
  className,
  style,
}: IconProps) {
  return iconBase(
    size,
    strokeWidth,
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </>,
    className,
    style,
  );
}

export function MenuIcon({
  size = 16,
  strokeWidth = 2,
  className,
  style,
}: IconProps) {
  return iconBase(
    size,
    strokeWidth,
    <>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </>,
    className,
    style,
  );
}

export function MoreHorizontalIcon({
  size = 16,
  strokeWidth = 2,
  className,
  style,
}: IconProps) {
  return iconBase(
    size,
    strokeWidth,
    <>
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </>,
    className,
    style,
  );
}

export function MoreVerticalIcon({
  size = 16,
  strokeWidth = 2,
  className,
  style,
}: IconProps) {
  return iconBase(
    size,
    strokeWidth,
    <>
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="19" r="1" />
    </>,
    className,
    style,
  );
}
