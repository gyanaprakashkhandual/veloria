export type TooltipSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

export type TooltipPlacement =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "top-left"
  | "top-right"
  | "top-center"
  | "bottom-left"
  | "bottom-right"
  | "bottom-center"
  | "left-top"
  | "left-bottom"
  | "right-top"
  | "right-bottom"
  | "center"
  | "auto";

export type TooltipTrigger = "hover" | "click";

interface Rect {
  top: number;
  bottom: number;
  left: number;
  right: number;
  width: number;
  height: number;
}

export const resolveAutoPlacement = (
  triggerRect: Rect,
  tooltipRect: Rect,
): TooltipPlacement => {
  const spaceBelow = window.innerHeight - triggerRect.bottom;
  const spaceAbove = triggerRect.top;
  const spaceRight = window.innerWidth - triggerRect.right;
  const spaceLeft = triggerRect.left;

  if (spaceBelow >= tooltipRect.height + 10) return "bottom";
  if (spaceAbove >= tooltipRect.height + 10) return "top";
  if (spaceRight >= tooltipRect.width + 10) return "right";
  if (spaceLeft >= tooltipRect.width + 10) return "left";
  return "bottom";
};

export const flipPlacement = (
  placement: TooltipPlacement,
  triggerRect: Rect,
  tooltipRect: Rect,
): TooltipPlacement => {
  if (placement === "auto")
    return resolveAutoPlacement(triggerRect, tooltipRect);

  const spaceBelow = window.innerHeight - triggerRect.bottom;
  const spaceAbove = triggerRect.top;
  const spaceRight = window.innerWidth - triggerRect.right;
  const spaceLeft = triggerRect.left;

  let p = placement as string;

  if (
    (p === "top" || p.startsWith("top-")) &&
    spaceAbove < tooltipRect.height + 10 &&
    spaceBelow > spaceAbove
  ) {
    p = p.replace("top", "bottom");
  } else if (
    (p === "bottom" || p.startsWith("bottom-")) &&
    spaceBelow < tooltipRect.height + 10 &&
    spaceAbove > spaceBelow
  ) {
    p = p.replace("bottom", "top");
  } else if (
    (p === "left" || p.startsWith("left-")) &&
    spaceLeft < tooltipRect.width + 10 &&
    spaceRight > spaceLeft
  ) {
    p = p.replace("left", "right");
  } else if (
    (p === "right" || p.startsWith("right-")) &&
    spaceRight < tooltipRect.width + 10 &&
    spaceLeft > spaceRight
  ) {
    p = p.replace("right", "left");
  }

  return p as TooltipPlacement;
};
