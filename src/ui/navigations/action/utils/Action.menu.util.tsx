/* eslint-disable react-hooks/exhaustive-deps */
import { useLayoutEffect, useState } from "react";
import type { MenuAlign, ActionMenuSize } from "../Action.menu.context";

export type ResolvedAlign =
  | "bottom-left"
  | "bottom-right"
  | "top-left"
  | "top-right"
  | "bottom-center"
  | "top-center"
  | "left"
  | "right";

export type SubmenuSide = "right" | "left";

export const sizeConfig: Record<
  ActionMenuSize,
  {
    menuWidth: number;
    itemPadding: string;
    itemFontSize: string;
    iconSize: number;
    trailingFontSize: string;
    headerFontSize: string;
    descFontSize: string;
    chevronSize: number;
    triggerPadding: string;
    triggerFontSize: string;
    triggerIconSize: number;
    menuPadding: string;
    borderRadius: string;
    gap: string;
  }
> = {
  xs: {
    menuWidth: 148,
    itemPadding: "4px 8px",
    itemFontSize: "var(--font-size-xs)",
    iconSize: 12,
    trailingFontSize: "10px",
    headerFontSize: "9px",
    descFontSize: "10px",
    chevronSize: 9,
    triggerPadding: "4px 8px",
    triggerFontSize: "var(--font-size-xs)",
    triggerIconSize: 12,
    menuPadding: "3px",
    borderRadius: "var(--radius-lg)",
    gap: "4px",
  },
  sm: {
    menuWidth: 176,
    itemPadding: "5px 10px",
    itemFontSize: "var(--font-size-xs)",
    iconSize: 13,
    trailingFontSize: "10px",
    headerFontSize: "10px",
    descFontSize: "10px",
    chevronSize: 10,
    triggerPadding: "5px 10px",
    triggerFontSize: "var(--font-size-xs)",
    triggerIconSize: 13,
    menuPadding: "4px",
    borderRadius: "var(--radius-lg)",
    gap: "4px",
  },
  md: {
    menuWidth: 220,
    itemPadding: "7px 10px",
    itemFontSize: "var(--font-size-sm)",
    iconSize: 15,
    trailingFontSize: "var(--font-size-xs)",
    headerFontSize: "10px",
    descFontSize: "var(--font-size-xs)",
    chevronSize: 12,
    triggerPadding: "7px 12px",
    triggerFontSize: "var(--font-size-sm)",
    triggerIconSize: 15,
    menuPadding: "4px",
    borderRadius: "var(--radius-xl)",
    gap: "4px",
  },
  lg: {
    menuWidth: 256,
    itemPadding: "9px 12px",
    itemFontSize: "var(--font-size-sm)",
    iconSize: 16,
    trailingFontSize: "var(--font-size-xs)",
    headerFontSize: "11px",
    descFontSize: "var(--font-size-xs)",
    chevronSize: 13,
    triggerPadding: "9px 14px",
    triggerFontSize: "var(--font-size-sm)",
    triggerIconSize: 16,
    menuPadding: "5px",
    borderRadius: "var(--radius-xl)",
    gap: "4px",
  },
  xl: {
    menuWidth: 288,
    itemPadding: "10px 14px",
    itemFontSize: "var(--font-size-sm)",
    iconSize: 17,
    trailingFontSize: "var(--font-size-sm)",
    headerFontSize: "var(--font-size-xs)",
    descFontSize: "var(--font-size-xs)",
    chevronSize: 14,
    triggerPadding: "10px 16px",
    triggerFontSize: "var(--font-size-md)",
    triggerIconSize: 17,
    menuPadding: "6px",
    borderRadius: "var(--radius-2xl)",
    gap: "5px",
  },
  "2xl": {
    menuWidth: 320,
    itemPadding: "12px 16px",
    itemFontSize: "var(--font-size-md)",
    iconSize: 18,
    trailingFontSize: "var(--font-size-sm)",
    headerFontSize: "var(--font-size-xs)",
    descFontSize: "var(--font-size-sm)",
    chevronSize: 15,
    triggerPadding: "12px 18px",
    triggerFontSize: "var(--font-size-md)",
    triggerIconSize: 18,
    menuPadding: "6px",
    borderRadius: "var(--radius-2xl)",
    gap: "6px",
  },
  "3xl": {
    menuWidth: 360,
    itemPadding: "14px 18px",
    itemFontSize: "var(--font-size-md)",
    iconSize: 20,
    trailingFontSize: "var(--font-size-sm)",
    headerFontSize: "var(--font-size-sm)",
    descFontSize: "var(--font-size-sm)",
    chevronSize: 16,
    triggerPadding: "14px 20px",
    triggerFontSize: "var(--font-size-lg)",
    triggerIconSize: 20,
    menuPadding: "8px",
    borderRadius: "var(--radius-3xl)",
    gap: "6px",
  },
};

export function useAutoAlign(
  open: boolean,
  anchorRef: React.RefObject<HTMLElement | null>,
  preferred: MenuAlign,
  menuWidth: number,
  menuHeight: number,
): ResolvedAlign {
  const [align, setAlign] = useState<ResolvedAlign>("bottom-left");

  useLayoutEffect(() => {
    if (!open || !anchorRef.current) return;
    if (preferred !== "auto") {
      setAlign(preferred as ResolvedAlign);
      return;
    }
    const rect = anchorRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const spaceRight = window.innerWidth - rect.left;
    const vert =
      spaceBelow >= menuHeight || spaceBelow >= spaceAbove ? "bottom" : "top";
    const horiz = spaceRight >= menuWidth ? "left" : "right";
    setAlign(`${vert}-${horiz}` as ResolvedAlign);
  }, [open, anchorRef, preferred, menuWidth, menuHeight]);

  return align;
}

export function useSubmenuSide(
  itemRef: React.RefObject<HTMLElement | null>,
  menuWidth: number,
): SubmenuSide {
  const [side, setSide] = useState<SubmenuSide>("right");

  useLayoutEffect(() => {
    if (!itemRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    setSide(window.innerWidth - rect.right >= menuWidth ? "right" : "left");
  });

  return side;
}

export function resolvedAlignToStyle(
  align: ResolvedAlign,
): React.CSSProperties {
  const base: React.CSSProperties = { position: "absolute", zIndex: 9999 };
  switch (align) {
    case "bottom-left":
      return { ...base, top: "calc(100% + 6px)", left: 0 };
    case "bottom-right":
      return { ...base, top: "calc(100% + 6px)", right: 0 };
    case "bottom-center":
      return {
        ...base,
        top: "calc(100% + 6px)",
        left: "50%",
        transform: "translateX(-50%)",
      };
    case "top-left":
      return { ...base, bottom: "calc(100% + 6px)", left: 0 };
    case "top-right":
      return { ...base, bottom: "calc(100% + 6px)", right: 0 };
    case "top-center":
      return {
        ...base,
        bottom: "calc(100% + 6px)",
        left: "50%",
        transform: "translateX(-50%)",
      };
    case "left":
      return { ...base, right: "calc(100% + 6px)", top: 0 };
    case "right":
      return { ...base, left: "calc(100% + 6px)", top: 0 };
    default:
      return { ...base, top: "calc(100% + 6px)", left: 0 };
  }
}
