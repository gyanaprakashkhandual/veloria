import {
  useLayoutEffect,
  useEffect,
  useState,
  useCallback,
} from "react";
import type { DropdownSize, DropdownAlign } from "../Dropdown.context.tsx";

export type ResolvedAlign =
  | "bottom-left"
  | "bottom-right"
  | "top-left"
  | "top-right"
  | "bottom-center"
  | "top-center"
  | "left"
  | "right";

export interface PanelPosition {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  minWidth: number;
  transformOrigin: string;
}

export const sizeConfig: Record<
  DropdownSize,
  {
    panelWidth: number;
    triggerHeight: string;
    triggerPadding: string;
    triggerFontSize: string;
    triggerIconSize: number;
    itemPadding: string;
    itemFontSize: string;
    iconSize: number;
    checkSize: number;
    chevronSize: number;
    clearSize: number;
    badgeFontSize: string;
    groupFontSize: string;
    groupPadding: string;
    descFontSize: string;
    searchPadding: string;
    searchFontSize: string;
    searchIconSize: number;
    tagFontSize: string;
    tagPadding: string;
    tagCloseSize: number;
    maxHeight: string;
    menuPadding: string;
    borderRadius: string;
    gap: string;
    footerPadding: string;
    footerFontSize: string;
  }
> = {
  xs: {
    panelWidth: 160,
    triggerHeight: "28px",
    triggerPadding: "0 8px",
    triggerFontSize: "var(--font-size-xs)",
    triggerIconSize: 12,
    itemPadding: "4px 8px",
    itemFontSize: "var(--font-size-xs)",
    iconSize: 12,
    checkSize: 11,
    chevronSize: 12,
    clearSize: 11,
    badgeFontSize: "9px",
    groupFontSize: "9px",
    groupPadding: "6px 8px 2px",
    descFontSize: "10px",
    searchPadding: "6px 6px",
    searchFontSize: "var(--font-size-xs)",
    searchIconSize: 12,
    tagFontSize: "10px",
    tagPadding: "1px 5px",
    tagCloseSize: 9,
    maxHeight: "200px",
    menuPadding: "3px",
    borderRadius: "var(--radius-lg)",
    gap: "4px",
    footerPadding: "5px 8px",
    footerFontSize: "10px",
  },
  sm: {
    panelWidth: 192,
    triggerHeight: "32px",
    triggerPadding: "0 10px",
    triggerFontSize: "var(--font-size-xs)",
    triggerIconSize: 13,
    itemPadding: "5px 10px",
    itemFontSize: "var(--font-size-xs)",
    iconSize: 13,
    checkSize: 12,
    chevronSize: 13,
    clearSize: 12,
    badgeFontSize: "10px",
    groupFontSize: "10px",
    groupPadding: "8px 10px 2px",
    descFontSize: "10px",
    searchPadding: "7px 8px",
    searchFontSize: "var(--font-size-xs)",
    searchIconSize: 13,
    tagFontSize: "10px",
    tagPadding: "1px 6px",
    tagCloseSize: 10,
    maxHeight: "220px",
    menuPadding: "4px",
    borderRadius: "var(--radius-lg)",
    gap: "4px",
    footerPadding: "6px 10px",
    footerFontSize: "10px",
  },
  md: {
    panelWidth: 240,
    triggerHeight: "36px",
    triggerPadding: "0 12px",
    triggerFontSize: "var(--font-size-sm)",
    triggerIconSize: 15,
    itemPadding: "7px 10px",
    itemFontSize: "var(--font-size-sm)",
    iconSize: 15,
    checkSize: 13,
    chevronSize: 15,
    clearSize: 13,
    badgeFontSize: "var(--font-size-xs)",
    groupFontSize: "10px",
    groupPadding: "10px 10px 3px",
    descFontSize: "var(--font-size-xs)",
    searchPadding: "8px 8px",
    searchFontSize: "var(--font-size-sm)",
    searchIconSize: 14,
    tagFontSize: "var(--font-size-xs)",
    tagPadding: "2px 8px",
    tagCloseSize: 10,
    maxHeight: "260px",
    menuPadding: "4px",
    borderRadius: "var(--radius-xl)",
    gap: "4px",
    footerPadding: "7px 10px",
    footerFontSize: "var(--font-size-xs)",
  },
  lg: {
    panelWidth: 280,
    triggerHeight: "40px",
    triggerPadding: "0 14px",
    triggerFontSize: "var(--font-size-sm)",
    triggerIconSize: 16,
    itemPadding: "9px 12px",
    itemFontSize: "var(--font-size-sm)",
    iconSize: 16,
    checkSize: 14,
    chevronSize: 16,
    clearSize: 14,
    badgeFontSize: "var(--font-size-xs)",
    groupFontSize: "11px",
    groupPadding: "11px 12px 3px",
    descFontSize: "var(--font-size-xs)",
    searchPadding: "9px 10px",
    searchFontSize: "var(--font-size-sm)",
    searchIconSize: 15,
    tagFontSize: "var(--font-size-xs)",
    tagPadding: "2px 8px",
    tagCloseSize: 11,
    maxHeight: "288px",
    menuPadding: "5px",
    borderRadius: "var(--radius-xl)",
    gap: "4px",
    footerPadding: "9px 12px",
    footerFontSize: "var(--font-size-xs)",
  },
  xl: {
    panelWidth: 320,
    triggerHeight: "44px",
    triggerPadding: "0 16px",
    triggerFontSize: "var(--font-size-md)",
    triggerIconSize: 17,
    itemPadding: "10px 14px",
    itemFontSize: "var(--font-size-sm)",
    iconSize: 17,
    checkSize: 15,
    chevronSize: 17,
    clearSize: 14,
    badgeFontSize: "var(--font-size-xs)",
    groupFontSize: "var(--font-size-xs)",
    groupPadding: "12px 14px 3px",
    descFontSize: "var(--font-size-xs)",
    searchPadding: "10px 12px",
    searchFontSize: "var(--font-size-sm)",
    searchIconSize: 16,
    tagFontSize: "var(--font-size-xs)",
    tagPadding: "3px 9px",
    tagCloseSize: 11,
    maxHeight: "320px",
    menuPadding: "6px",
    borderRadius: "var(--radius-2xl)",
    gap: "5px",
    footerPadding: "10px 14px",
    footerFontSize: "var(--font-size-xs)",
  },
  "2xl": {
    panelWidth: 360,
    triggerHeight: "48px",
    triggerPadding: "0 18px",
    triggerFontSize: "var(--font-size-md)",
    triggerIconSize: 18,
    itemPadding: "12px 16px",
    itemFontSize: "var(--font-size-md)",
    iconSize: 18,
    checkSize: 16,
    chevronSize: 18,
    clearSize: 15,
    badgeFontSize: "var(--font-size-xs)",
    groupFontSize: "var(--font-size-xs)",
    groupPadding: "13px 16px 4px",
    descFontSize: "var(--font-size-sm)",
    searchPadding: "11px 14px",
    searchFontSize: "var(--font-size-md)",
    searchIconSize: 17,
    tagFontSize: "var(--font-size-sm)",
    tagPadding: "3px 10px",
    tagCloseSize: 12,
    maxHeight: "360px",
    menuPadding: "6px",
    borderRadius: "var(--radius-2xl)",
    gap: "6px",
    footerPadding: "11px 16px",
    footerFontSize: "var(--font-size-sm)",
  },
  "3xl": {
    panelWidth: 400,
    triggerHeight: "54px",
    triggerPadding: "0 20px",
    triggerFontSize: "var(--font-size-lg)",
    triggerIconSize: 20,
    itemPadding: "14px 18px",
    itemFontSize: "var(--font-size-md)",
    iconSize: 20,
    checkSize: 18,
    chevronSize: 20,
    clearSize: 16,
    badgeFontSize: "var(--font-size-sm)",
    groupFontSize: "var(--font-size-sm)",
    groupPadding: "14px 18px 4px",
    descFontSize: "var(--font-size-sm)",
    searchPadding: "12px 16px",
    searchFontSize: "var(--font-size-md)",
    searchIconSize: 18,
    tagFontSize: "var(--font-size-sm)",
    tagPadding: "4px 12px",
    tagCloseSize: 13,
    maxHeight: "400px",
    menuPadding: "8px",
    borderRadius: "var(--radius-3xl)",
    gap: "6px",
    footerPadding: "13px 18px",
    footerFontSize: "var(--font-size-sm)",
  },
};

export function usePortalPosition(
  open: boolean,
  triggerRef: React.RefObject<HTMLElement | null>,
  panelRef: React.RefObject<HTMLElement | null>,
  preferred: DropdownAlign,
): PanelPosition {
  const [pos, setPos] = useState<PanelPosition>({
    top: 0,
    left: 0,
    minWidth: 0,
    transformOrigin: "top left",
  });

  const calculate = useCallback(() => {
    if (!open || !triggerRef.current) return;
    const trigger = triggerRef.current.getBoundingClientRect();
    const panelH = panelRef.current?.offsetHeight ?? 300;
    const panelW = panelRef.current?.offsetWidth ?? 240;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const GAP = 6;

    let resolved = preferred;

    if (preferred === "auto") {
      const spaceBelow = vh - trigger.bottom - GAP;
      const spaceAbove = trigger.top - GAP;
      const spaceRight = vw - trigger.left;
      const vert =
        spaceBelow >= panelH || spaceBelow >= spaceAbove ? "bottom" : "top";
      const horiz = spaceRight >= panelW ? "left" : "right";
      resolved = `${vert}-${horiz}` as DropdownAlign;
    }

    const result: PanelPosition = {
      minWidth: trigger.width,
      transformOrigin: "top left",
    };

    if (resolved === "top" || resolved === "bottom") {
      resolved = resolved === "top" ? "top-left" : "bottom-left";
    }

    if (resolved.startsWith("bottom")) {
      result.top = trigger.bottom + GAP + window.scrollY;
      result.transformOrigin = "top";
    } else if (resolved.startsWith("top")) {
      result.bottom = vh - trigger.top + GAP - window.scrollY;
      result.transformOrigin = "bottom";
    } else if (resolved === "left") {
      result.top = trigger.top + window.scrollY;
      result.right = vw - trigger.left - window.scrollX + GAP;
      result.transformOrigin = "right center";
      return result;
    } else if (resolved === "right") {
      result.top = trigger.top + window.scrollY;
      result.left = trigger.right + window.scrollX + GAP;
      result.transformOrigin = "left center";
      return result;
    }

    if (resolved.endsWith("left")) {
      result.left = trigger.left + window.scrollX;
      result.transformOrigin += " left";
    } else if (resolved.endsWith("right")) {
      result.right = vw - trigger.right - window.scrollX;
      result.transformOrigin += " right";
    } else if (resolved.endsWith("center")) {
      result.left = trigger.left + trigger.width / 2 + window.scrollX;
      result.transformOrigin += " center";
    }

    setPos(result);
  }, [open, triggerRef, panelRef, preferred]);

  useLayoutEffect(() => {
    calculate();
  }, [calculate]);

  useEffect(() => {
    if (!open) return;
    window.addEventListener("scroll", calculate, true);
    window.addEventListener("resize", calculate);
    return () => {
      window.removeEventListener("scroll", calculate, true);
      window.removeEventListener("resize", calculate);
    };
  }, [open, calculate]);

  return pos;
}
