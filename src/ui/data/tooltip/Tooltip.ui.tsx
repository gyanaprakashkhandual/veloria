import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import "./Tooltip.css";
import { CopyIcon, CheckIcon } from "./Tooltip.icon";
import {
  type TooltipSize,
  type TooltipPlacement,
  type TooltipTrigger,
  flipPlacement,
} from "./Tooltip.context";

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  size?: TooltipSize;
  placement?: TooltipPlacement;
  trigger?: TooltipTrigger;
  delay?: number;
  maxWidth?: number;
  showArrow?: boolean;
  interactive?: boolean;
  header?: ReactNode;
  headerLeadingIcon?: ReactNode;
  headerTrailingIcon?: ReactNode;
  footer?: ReactNode;
  footerLeadingIcon?: ReactNode;
  footerTrailingIcon?: ReactNode;
  showCopyButton?: boolean;
  className?: string;
  disabled?: boolean;
}

export const Tooltip = ({
  content,
  children,
  size = "md",
  placement = "bottom",
  trigger = "hover",
  delay = 0,
  maxWidth = 240,
  showArrow = true,
  interactive = false,
  header,
  headerLeadingIcon,
  headerTrailingIcon,
  footer,
  footerLeadingIcon,
  footerTrailingIcon,
  showCopyButton = false,
  className = "",
  disabled = false,
}: TooltipProps) => {
  const [visible, setVisible] = useState(false);
  const [animClass, setAnimClass] = useState<
    "animating-in" | "animating-out" | ""
  >("");
  const [resolvedPlacement, setResolvedPlacement] =
    useState<TooltipPlacement>(placement);
  const [copied, setCopied] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const showTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const outTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = () => {
    if (showTimer.current) clearTimeout(showTimer.current);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    if (outTimer.current) clearTimeout(outTimer.current);
  };

  const show = useCallback(() => {
    if (disabled) return;
    clearTimers();
    showTimer.current = setTimeout(() => {
      setVisible(true);
      setAnimClass("animating-in");
    }, delay);
  }, [delay, disabled]);

  const hide = useCallback(() => {
    clearTimers();
    setAnimClass("animating-out");
    outTimer.current = setTimeout(() => {
      setVisible(false);
      setAnimClass("");
    }, 140);
  }, []);

  useEffect(() => {
    if (visible && wrapperRef.current && tooltipRef.current) {
      const triggerRect = wrapperRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const flipped = flipPlacement(placement, triggerRect, tooltipRect);
      setResolvedPlacement(flipped);
    }
  }, [visible, placement]);

  useEffect(() => {
    if (trigger === "click") {
      const handleOutside = (e: MouseEvent) => {
        if (
          wrapperRef.current &&
          !wrapperRef.current.contains(e.target as Node) &&
          tooltipRef.current &&
          !tooltipRef.current.contains(e.target as Node)
        ) {
          hide();
        }
      };
      document.addEventListener("mousedown", handleOutside);
      return () => document.removeEventListener("mousedown", handleOutside);
    }
  }, [trigger, hide]);

  useEffect(() => () => clearTimers(), []);

  const handleCopy = () => {
    const text =
      typeof content === "string"
        ? content
        : tooltipRef.current?.innerText || "";
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const triggerProps =
    trigger === "hover"
      ? {
          onMouseEnter: show,
          onMouseLeave: hide,
          onFocus: show,
          onBlur: hide,
        }
      : {
          onClick: () => (visible ? hide() : show()),
        };

  const tooltipHoverProps =
    interactive && trigger === "hover"
      ? {
          onMouseEnter: show,
          onMouseLeave: hide,
        }
      : {};

  const hasHeader = !!(header || headerLeadingIcon || headerTrailingIcon);
  const hasFooter = !!(footer || footerLeadingIcon || footerTrailingIcon);

  return (
    <div className="tooltip-wrapper" ref={wrapperRef} {...triggerProps}>
      {children}

      {visible && (
        <div
          ref={tooltipRef}
          role="tooltip"
          className={[
            "tooltip-box",
            `tooltip-box--${size}`,
            `placement-${resolvedPlacement}`,
            animClass,
            interactive ? "interactive" : "",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          style={{ maxWidth: `${maxWidth}px` }}
          {...tooltipHoverProps}
        >
          {showArrow && <span className="tooltip-arrow" />}

          {hasHeader && (
            <div className="tooltip-header">
              {headerLeadingIcon && (
                <span className="tooltip-icon-leading">
                  {headerLeadingIcon}
                </span>
              )}
              <span>{header}</span>
              {headerTrailingIcon && (
                <span className="tooltip-icon-trailing">
                  {headerTrailingIcon}
                </span>
              )}
            </div>
          )}

          <div
            className={`tooltip-body${!hasHeader ? " tooltip-body--no-header" : ""}`}
          >
            <span>{content}</span>
            {showCopyButton && (
              <button
                className={`tooltip-copy-btn${copied ? " copied" : ""}`}
                onClick={handleCopy}
                title={copied ? "Copied!" : "Copy"}
                style={{
                  marginLeft: "8px",
                  display: "inline-flex",
                  verticalAlign: "middle",
                }}
              >
                {copied ? <CheckIcon size={12} /> : <CopyIcon size={12} />}
              </button>
            )}
          </div>

          {hasFooter && (
            <div className="tooltip-footer">
              {footerLeadingIcon && (
                <span className="tooltip-icon-leading">
                  {footerLeadingIcon}
                </span>
              )}
              <span>{footer}</span>
              {footerTrailingIcon && (
                <span className="tooltip-icon-trailing">
                  {footerTrailingIcon}
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
