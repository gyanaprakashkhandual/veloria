import React, {
  useEffect,
  useRef,
  useCallback,
  useState,
  useLayoutEffect,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Link,
  Link2Off,
  Image,
  Table,
  Code,
  Quote,
  Minus,
  Undo,
  Redo,
  Maximize2,
  Minimize2,
  Type,
  Highlighter,
  Palette,
  ChevronDown,
  Subscript,
  Superscript,
  RemoveFormatting,
  GripHorizontal,
} from "lucide-react";
import {
  TextEditorProvider,
  useTextEditorContext,
  type TextEditorProviderProps,
  type TextEditorSize,
  type TextEditorVariant,
  type FontFamily,
  type TextAlign,
  type HeadingLevel,
} from "./Text.editor.context";

const sizeConfig = {
  sm: {
    toolbarPx: "px-1.5",
    toolbarPy: "py-1",
    toolbarGap: "gap-0.5",
    btnSize: "w-6 h-6",
    btnIcon: 12,
    selectText: "text-xs",
    selectPx: "px-1.5",
    selectH: "h-6",
    editorPx: "px-3",
    editorPy: "py-2",
    editorText: "text-sm",
    separatorMx: "mx-0.5",
    groupGap: "gap-0.5",
  },
  md: {
    toolbarPx: "px-2",
    toolbarPy: "py-1.5",
    toolbarGap: "gap-0.5",
    btnSize: "w-7 h-7",
    btnIcon: 14,
    selectText: "text-xs",
    selectPx: "px-2",
    selectH: "h-7",
    editorPx: "px-4",
    editorPy: "py-3",
    editorText: "text-sm",
    separatorMx: "mx-1",
    groupGap: "gap-0.5",
  },
  lg: {
    toolbarPx: "px-2.5",
    toolbarPy: "py-2",
    toolbarGap: "gap-1",
    btnSize: "w-8 h-8",
    btnIcon: 15,
    selectText: "text-sm",
    selectPx: "px-2.5",
    selectH: "h-8",
    editorPx: "px-5",
    editorPy: "py-4",
    editorText: "text-base",
    separatorMx: "mx-1",
    groupGap: "gap-0.5",
  },
  xl: {
    toolbarPx: "px-3",
    toolbarPy: "py-2",
    toolbarGap: "gap-1",
    btnSize: "w-9 h-9",
    btnIcon: 16,
    selectText: "text-sm",
    selectPx: "px-3",
    selectH: "h-9",
    editorPx: "px-6",
    editorPy: "py-5",
    editorText: "text-base",
    separatorMx: "mx-1.5",
    groupGap: "gap-1",
  },
};

const variantStyles: Record<TextEditorVariant, { wrapper: string; toolbar: string; editor: string }> = {
  default: {
    wrapper: "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700",
    toolbar: "bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-700",
    editor: "bg-white dark:bg-gray-900",
  },
  filled: {
    wrapper: "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
    toolbar: "bg-gray-100 dark:bg-gray-700/60 border-b border-gray-200 dark:border-gray-700",
    editor: "bg-gray-50 dark:bg-gray-800",
  },
  ghost: {
    wrapper: "bg-transparent border border-transparent",
    toolbar: "bg-transparent border-b border-gray-100 dark:border-gray-800",
    editor: "bg-transparent",
  },
  outline: {
    wrapper: "bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600",
    toolbar: "bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-700",
    editor: "bg-white dark:bg-gray-900",
  },
};

const focusedVariantStyles: Record<TextEditorVariant, string> = {
  default: "border-gray-400 dark:border-gray-500",
  filled: "border-gray-400 dark:border-gray-500",
  ghost: "border-gray-300 dark:border-gray-700",
  outline: "border-gray-900 dark:border-gray-300",
};

const fontFamilyMap: Record<FontFamily, string> = {
  sans: "font-sans",
  serif: "font-serif",
  mono: "font-mono",
};

const fontFamilyStyle: Record<FontFamily, string> = {
  sans: "ui-sans-serif, system-ui, sans-serif",
  serif: "ui-serif, Georgia, serif",
  mono: "ui-monospace, SFMono-Regular, monospace",
};

interface ToolbarBtnProps {
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  title: string;
  size: TextEditorSize;
  children: React.ReactNode;
  className?: string;
}

function ToolbarBtn({ active, disabled, onClick, title, size, children, className = "" }: ToolbarBtnProps) {
  const s = sizeConfig[size];
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onMouseDown={(e) => {
        e.preventDefault();
        if (!disabled) onClick();
      }}
      className={`
        inline-flex items-center justify-center ${s.btnSize} rounded-md
        transition-colors duration-100 shrink-0
        ${active
          ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
          : disabled
            ? "opacity-40 cursor-not-allowed text-gray-400 dark:text-gray-600"
            : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
        }
        ${className}
      `}
    >
      {children}
    </button>
  );
}

function Separator({ size }: { size: TextEditorSize }) {
  const s = sizeConfig[size];
  return (
    <div className={`${s.separatorMx} w-px self-stretch bg-gray-200 dark:bg-gray-700 shrink-0`} />
  );
}

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  title: string;
  size: TextEditorSize;
  icon: React.ReactNode;
  swatches: string[];
}

function ColorPicker({ value, onChange, title, size, icon, swatches }: ColorPickerProps) {
  const s = sizeConfig[size];
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        title={title}
        onMouseDown={(e) => {
          e.preventDefault();
          setOpen((v) => !v);
        }}
        className={`
          inline-flex items-center justify-center ${s.btnSize} rounded-md
          transition-colors duration-100 shrink-0 gap-0
          text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white
        `}
      >
        <span className="flex flex-col items-center justify-center gap-0">
          {icon}
          <span
            className="block rounded-sm"
            style={{ width: s.btnIcon, height: 3, backgroundColor: value, marginTop: 1 }}
          />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.13, ease: "easeOut" }}
            className="absolute top-full left-0 mt-1.5 z-50 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg shadow-black/10 dark:shadow-black/40 p-2.5"
            style={{ minWidth: 160 }}
          >
            <div className="grid grid-cols-7 gap-1 mb-2">
              {swatches.map((c) => (
                <button
                  key={c}
                  type="button"
                  title={c}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onChange(c);
                    setOpen(false);
                  }}
                  className="w-5 h-5 rounded-md border border-gray-200 dark:border-gray-700 transition-transform hover:scale-110 shrink-0"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <div className="flex items-center gap-2 border-t border-gray-100 dark:border-gray-800 pt-2">
              <input
                type="color"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-7 h-7 rounded cursor-pointer border-0 p-0"
                style={{ appearance: "none", WebkitAppearance: "none" }}
              />
              <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">{value}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface SelectDropdownProps {
  value: string;
  options: { value: string; label: string }[];
  onChange: (val: string) => void;
  size: TextEditorSize;
  width?: number;
}

function SelectDropdown({ value, options, onChange, size, width = 100 }: SelectDropdownProps) {
  const s = sizeConfig[size];
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = options.find((o) => o.value === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative" style={{ width }}>
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          setOpen((v) => !v);
        }}
        className={`
          w-full inline-flex items-center justify-between gap-1 ${s.selectPx} ${s.selectH}
          ${s.selectText} font-medium rounded-md transition-colors duration-100
          text-gray-700 dark:text-gray-300
          hover:bg-gray-200 dark:hover:bg-gray-700
          border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800
        `}
      >
        <span className="truncate">{current?.label ?? value}</span>
        <ChevronDown size={10} className="shrink-0 text-gray-400 dark:text-gray-500" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.13, ease: "easeOut" }}
            className="absolute top-full left-0 mt-1 z-50 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg shadow-black/10 dark:shadow-black/40 overflow-hidden"
            style={{ minWidth: width }}
          >
            <div className="p-1">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`
                    w-full flex items-center ${s.selectPx} py-1.5 rounded-md ${s.selectText} font-medium text-left transition-colors duration-100
                    ${value === opt.value
                      ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }
                  `}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const textColorSwatches = [
  "#000000", "#374151", "#6b7280", "#9ca3af", "#ffffff",
  "#dc2626", "#ea580c", "#d97706", "#16a34a", "#2563eb", "#7c3aed", "#db2777",
  "#fca5a5", "#fdba74", "#fde68a", "#6ee7b7", "#93c5fd", "#c4b5fd", "#f9a8d4",
  "#b91c1c", "#c2410c", "#b45309", "#15803d", "#1d4ed8", "#6d28d9", "#be185d",
];

const highlightSwatches = [
  "#fef08a", "#bbf7d0", "#bfdbfe", "#fecdd3", "#e9d5ff", "#fed7aa",
  "#fde68a", "#a7f3d0", "#93c5fd", "#fca5a5", "#ddd6fe", "#fdba74",
  "#fffbeb", "#f0fdf4", "#eff6ff", "#fff1f2", "#faf5ff", "#fff7ed",
  "#ffffff", "#f3f4f6", "#e5e7eb", "#d1d5db", "#9ca3af", "#6b7280",
  "#111827", "#374151",
];

const headingOptions = [
  { value: "p", label: "Paragraph" },
  { value: "h1", label: "Heading 1" },
  { value: "h2", label: "Heading 2" },
  { value: "h3", label: "Heading 3" },
  { value: "h4", label: "Heading 4" },
];

const fontSizeOptions = [
  { value: "10", label: "10" },
  { value: "12", label: "12" },
  { value: "14", label: "14" },
  { value: "16", label: "16" },
  { value: "18", label: "18" },
  { value: "20", label: "20" },
  { value: "24", label: "24" },
  { value: "28", label: "28" },
  { value: "32", label: "32" },
  { value: "36", label: "36" },
  { value: "48", label: "48" },
  { value: "60", label: "60" },
  { value: "72", label: "72" },
];

const fontFamilyOptions = [
  { value: "sans", label: "Sans" },
  { value: "serif", label: "Serif" },
  { value: "mono", label: "Mono" },
];

function ToolbarInner({ size }: { size: TextEditorSize }) {
  const {
    state,
    execCommand,
    setTextColor,
    setHighlightColor,
    setFontSize,
    setFontFamily,
    setTextAlign,
    setHeadingLevel,
    toggleMaximize,
    editorRef,
  } = useTextEditorContext();
  const s = sizeConfig[size];

  const handleBold = useCallback(() => execCommand("bold"), [execCommand]);
  const handleItalic = useCallback(() => execCommand("italic"), [execCommand]);
  const handleUnderline = useCallback(() => execCommand("underline"), [execCommand]);
  const handleStrike = useCallback(() => execCommand("strikeThrough"), [execCommand]);
  const handleSubscript = useCallback(() => execCommand("subscript"), [execCommand]);
  const handleSuperscript = useCallback(() => execCommand("superscript"), [execCommand]);
  const handleCode = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) return;
    const range = sel.getRangeAt(0);
    const code = document.createElement("code");
    code.style.fontFamily = "monospace";
    code.style.backgroundColor = "rgba(0,0,0,0.08)";
    code.style.padding = "0 3px";
    code.style.borderRadius = "3px";
    range.surroundContents(code);
  }, []);

  const handleAlign = useCallback((align: TextAlign) => {
    const cmdMap: Record<TextAlign, string> = {
      left: "justifyLeft",
      center: "justifyCenter",
      right: "justifyRight",
      justify: "justifyFull",
    };
    execCommand(cmdMap[align]);
    setTextAlign(align);
  }, [execCommand, setTextAlign]);

  const handleUL = useCallback(() => execCommand("insertUnorderedList"), [execCommand]);
  const handleOL = useCallback(() => execCommand("insertOrderedList"), [execCommand]);
  const handleBlockquote = useCallback(() => execCommand("formatBlock", "blockquote"), [execCommand]);
  const handleHR = useCallback(() => execCommand("insertHorizontalRule"), [execCommand]);

  const handleLink = useCallback(() => {
    const url = prompt("Enter URL:");
    if (url) execCommand("createLink", url);
  }, [execCommand]);

  const handleUnlink = useCallback(() => execCommand("unlink"), [execCommand]);

  const handleImage = useCallback(() => {
    const url = prompt("Enter image URL:");
    if (url) execCommand("insertImage", url);
  }, [execCommand]);

  const handleTable = useCallback(() => {
    const rows = 3;
    const cols = 3;
    let html = '<table style="border-collapse:collapse;width:100%;margin:8px 0">';
    for (let r = 0; r < rows; r++) {
      html += "<tr>";
      for (let c = 0; c < cols; c++) {
        html += r === 0
          ? '<th style="border:1px solid #d1d5db;padding:6px 10px;background:#f9fafb;font-weight:600;text-align:left">&nbsp;</th>'
          : '<td style="border:1px solid #d1d5db;padding:6px 10px">&nbsp;</td>';
      }
      html += "</tr>";
    }
    html += "</table><br>";
    execCommand("insertHTML", html);
  }, [execCommand]);

  const handleRemoveFormat = useCallback(() => execCommand("removeFormat"), [execCommand]);
  const handleUndo = useCallback(() => execCommand("undo"), [execCommand]);
  const handleRedo = useCallback(() => execCommand("redo"), [execCommand]);

  const handleTextColor = useCallback((color: string) => {
    setTextColor(color);
    execCommand("foreColor", color);
  }, [setTextColor, execCommand]);

  const handleHighlight = useCallback((color: string) => {
    setHighlightColor(color);
    execCommand("hiliteColor", color);
  }, [setHighlightColor, execCommand]);

  const handleFontSize = useCallback((val: string) => {
    setFontSize(parseInt(val));
    if (editorRef.current) {
      const sel = window.getSelection();
      if (sel && !sel.isCollapsed) {
        const range = sel.getRangeAt(0);
        const span = document.createElement("span");
        span.style.fontSize = `${val}px`;
        range.surroundContents(span);
      } else {
        editorRef.current.style.fontSize = `${val}px`;
      }
    }
  }, [setFontSize, editorRef]);

  const handleFontFamily = useCallback((val: string) => {
    const fam = val as FontFamily;
    setFontFamily(fam);
    execCommand("fontName", fontFamilyStyle[fam]);
  }, [setFontFamily, execCommand]);

  const handleHeading = useCallback((val: string) => {
    setHeadingLevel(val as HeadingLevel);
    execCommand("formatBlock", val === "p" ? "p" : val);
  }, [setHeadingLevel, execCommand]);

  const isBold = state.activeFormats.has("bold");
  const isItalic = state.activeFormats.has("italic");
  const isUnderline = state.activeFormats.has("underline");
  const isStrike = state.activeFormats.has("strikeThrough");
  const isSubscript = state.activeFormats.has("subscript");
  const isSuperscript = state.activeFormats.has("superscript");
  const isUL = state.activeFormats.has("insertUnorderedList");
  const isOL = state.activeFormats.has("insertOrderedList");

  return (
    <div className={`flex items-center flex-wrap ${s.toolbarPx} ${s.toolbarPy} ${s.toolbarGap} select-none`}>
      <ToolbarBtn size={size} title="Undo" onClick={handleUndo}>
        <Undo size={s.btnIcon} />
      </ToolbarBtn>
      <ToolbarBtn size={size} title="Redo" onClick={handleRedo}>
        <Redo size={s.btnIcon} />
      </ToolbarBtn>

      <Separator size={size} />

      <SelectDropdown
        value={state.headingLevel}
        options={headingOptions}
        onChange={handleHeading}
        size={size}
        width={size === "sm" ? 90 : size === "xl" ? 110 : 100}
      />

      <Separator size={size} />

      <SelectDropdown
        value={String(state.fontSize)}
        options={fontSizeOptions}
        onChange={handleFontSize}
        size={size}
        width={size === "sm" ? 48 : 56}
      />

      <SelectDropdown
        value={state.fontFamily}
        options={fontFamilyOptions}
        onChange={handleFontFamily}
        size={size}
        width={size === "sm" ? 58 : 68}
      />

      <Separator size={size} />

      <ToolbarBtn size={size} title="Bold" active={isBold} onClick={handleBold}>
        <Bold size={s.btnIcon} />
      </ToolbarBtn>
      <ToolbarBtn size={size} title="Italic" active={isItalic} onClick={handleItalic}>
        <Italic size={s.btnIcon} />
      </ToolbarBtn>
      <ToolbarBtn size={size} title="Underline" active={isUnderline} onClick={handleUnderline}>
        <Underline size={s.btnIcon} />
      </ToolbarBtn>
      <ToolbarBtn size={size} title="Strikethrough" active={isStrike} onClick={handleStrike}>
        <Strikethrough size={s.btnIcon} />
      </ToolbarBtn>
      <ToolbarBtn size={size} title="Subscript" active={isSubscript} onClick={handleSubscript}>
        <Subscript size={s.btnIcon} />
      </ToolbarBtn>
      <ToolbarBtn size={size} title="Superscript" active={isSuperscript} onClick={handleSuperscript}>
        <Superscript size={s.btnIcon} />
      </ToolbarBtn>
      <ToolbarBtn size={size} title="Inline Code" onClick={handleCode}>
        <Code size={s.btnIcon} />
      </ToolbarBtn>

      <Separator size={size} />

      <ColorPicker
        value={state.textColor}
        onChange={handleTextColor}
        title="Text Color"
        size={size}
        icon={<Palette size={s.btnIcon} />}
        swatches={textColorSwatches}
      />
      <ColorPicker
        value={state.highlightColor}
        onChange={handleHighlight}
        title="Highlight Color"
        size={size}
        icon={<Highlighter size={s.btnIcon} />}
        swatches={highlightSwatches}
      />

      <Separator size={size} />

      <ToolbarBtn size={size} title="Align Left" active={state.textAlign === "left"} onClick={() => handleAlign("left")}>
        <AlignLeft size={s.btnIcon} />
      </ToolbarBtn>
      <ToolbarBtn size={size} title="Align Center" active={state.textAlign === "center"} onClick={() => handleAlign("center")}>
        <AlignCenter size={s.btnIcon} />
      </ToolbarBtn>
      <ToolbarBtn size={size} title="Align Right" active={state.textAlign === "right"} onClick={() => handleAlign("right")}>
        <AlignRight size={s.btnIcon} />
      </ToolbarBtn>
      <ToolbarBtn size={size} title="Justify" active={state.textAlign === "justify"} onClick={() => handleAlign("justify")}>
        <AlignJustify size={s.btnIcon} />
      </ToolbarBtn>

      <Separator size={size} />

      <ToolbarBtn size={size} title="Bullet List" active={isUL} onClick={handleUL}>
        <List size={s.btnIcon} />
      </ToolbarBtn>
      <ToolbarBtn size={size} title="Numbered List" active={isOL} onClick={handleOL}>
        <ListOrdered size={s.btnIcon} />
      </ToolbarBtn>
      <ToolbarBtn size={size} title="Blockquote" onClick={handleBlockquote}>
        <Quote size={s.btnIcon} />
      </ToolbarBtn>
      <ToolbarBtn size={size} title="Horizontal Rule" onClick={handleHR}>
        <Minus size={s.btnIcon} />
      </ToolbarBtn>

      <Separator size={size} />

      <ToolbarBtn size={size} title="Insert Link" onClick={handleLink}>
        <Link size={s.btnIcon} />
      </ToolbarBtn>
      <ToolbarBtn size={size} title="Remove Link" onClick={handleUnlink}>
        <Link2Off size={s.btnIcon} />
      </ToolbarBtn>
      <ToolbarBtn size={size} title="Insert Image" onClick={handleImage}>
        <Image size={s.btnIcon} />
      </ToolbarBtn>
      <ToolbarBtn size={size} title="Insert Table" onClick={handleTable}>
        <Table size={s.btnIcon} />
      </ToolbarBtn>

      <Separator size={size} />

      <ToolbarBtn size={size} title="Remove Formatting" onClick={handleRemoveFormat}>
        <RemoveFormatting size={s.btnIcon} />
      </ToolbarBtn>

      <div className="ml-auto flex items-center gap-0.5">
        <ToolbarBtn size={size} title={state.isMaximized ? "Exit Fullscreen" : "Maximize"} onClick={toggleMaximize}>
          {state.isMaximized ? <Minimize2 size={s.btnIcon} /> : <Maximize2 size={s.btnIcon} />}
        </ToolbarBtn>
      </div>
    </div>
  );
}

function ResizeHandle({ size }: { size: TextEditorSize }) {
  const { state, setHeight, setResizing } = useTextEditorContext();
  const startY = useRef(0);
  const startH = useRef(0);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    startY.current = e.clientY;
    startH.current = state.height;
    setResizing(true);

    const onMove = (ev: MouseEvent) => {
      const delta = ev.clientY - startY.current;
      const next = Math.max(state.minHeight, Math.min(state.maxHeight, startH.current + delta));
      setHeight(next);
    };
    const onUp = () => {
      setResizing(false);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [state.height, state.minHeight, state.maxHeight, setHeight, setResizing]);

  return (
    <div
      onMouseDown={onMouseDown}
      className="flex items-center justify-center h-3 cursor-ns-resize select-none group"
      title="Drag to resize"
    >
      <GripHorizontal
        size={12}
        className="text-gray-300 dark:text-gray-700 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors duration-100"
      />
    </div>
  );
}

function EditorContent({ size, placeholder }: { size: TextEditorSize; placeholder?: string }) {
  const {
    state,
    editorRef,
    setFocused,
    setFormat,
    setCounts,
    onChangeCallback,
  } = useTextEditorContext();
  const s = sizeConfig[size];

  const syncFormats = useCallback(() => {
    const formats = [
      "bold", "italic", "underline", "strikeThrough",
      "subscript", "superscript", "insertUnorderedList", "insertOrderedList",
    ];
    formats.forEach((f) => {
      setFormat(f, document.queryCommandState(f));
    });
  }, [setFormat]);

  const handleInput = useCallback(() => {
    syncFormats();
    if (editorRef.current) {
      const text = editorRef.current.innerText ?? "";
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      setCounts(words, text.length);
      onChangeCallback?.(editorRef.current.innerHTML);
    }
  }, [syncFormats, editorRef, setCounts, onChangeCallback]);

  const handleKeyUp = useCallback(() => syncFormats(), [syncFormats]);
  const handleMouseUp = useCallback(() => syncFormats(), [syncFormats]);

  return (
    <div className="relative">
      {!state.isMaximized && (
        <div
          ref={editorRef as React.RefObject<HTMLDivElement>}
          contentEditable
          suppressContentEditableWarning
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onInput={handleInput}
          onKeyUp={handleKeyUp}
          onMouseUp={handleMouseUp}
          spellCheck
          className={`
            w-full outline-none ${s.editorPx} ${s.editorPy} ${s.editorText}
            text-gray-900 dark:text-gray-100
            overflow-y-auto
            [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-3 [&_h1]:mt-2
            [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-2 [&_h2]:mt-2
            [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mb-2 [&_h3]:mt-2
            [&_h4]:text-lg [&_h4]:font-semibold [&_h4]:mb-1.5 [&_h4]:mt-2
            [&_p]:mb-2 [&_p]:leading-relaxed
            [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:dark:border-gray-600
            [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-600 [&_blockquote]:dark:text-gray-400 [&_blockquote]:my-3
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-2 [&_ul]:space-y-1
            [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-2 [&_ol]:space-y-1
            [&_hr]:border-gray-200 [&_hr]:dark:border-gray-700 [&_hr]:my-4
            [&_a]:text-blue-600 [&_a]:dark:text-blue-400 [&_a]:underline
            [&_img]:max-w-full [&_img]:rounded-lg [&_img]:my-2
            [&_table]:border-collapse [&_table]:w-full [&_table]:my-3
            [&_td]:border [&_td]:border-gray-200 [&_td]:dark:border-gray-700 [&_td]:px-3 [&_td]:py-2
            [&_th]:border [&_th]:border-gray-200 [&_th]:dark:border-gray-700 [&_th]:px-3 [&_th]:py-2 [&_th]:font-semibold [&_th]:bg-gray-50 [&_th]:dark:bg-gray-800
            ${fontFamilyMap[state.fontFamily]}
          `}
          style={{ minHeight: state.height, maxHeight: state.height }}
        />
      )}
      {state.isMaximized && (
        <div
          ref={editorRef as React.RefObject<HTMLDivElement>}
          contentEditable
          suppressContentEditableWarning
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onInput={handleInput}
          onKeyUp={handleKeyUp}
          onMouseUp={handleMouseUp}
          spellCheck
          className={`
            w-full outline-none ${s.editorPx} ${s.editorPy} ${s.editorText}
            text-gray-900 dark:text-gray-100
            overflow-y-auto flex-1
            [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-3 [&_h1]:mt-2
            [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-2 [&_h2]:mt-2
            [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mb-2 [&_h3]:mt-2
            [&_h4]:text-lg [&_h4]:font-semibold [&_h4]:mb-1.5 [&_h4]:mt-2
            [&_p]:mb-2 [&_p]:leading-relaxed
            [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:dark:border-gray-600
            [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-600 [&_blockquote]:dark:text-gray-400 [&_blockquote]:my-3
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-2 [&_ul]:space-y-1
            [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-2 [&_ol]:space-y-1
            [&_hr]:border-gray-200 [&_hr]:dark:border-gray-700 [&_hr]:my-4
            [&_a]:text-blue-600 [&_a]:dark:text-blue-400 [&_a]:underline
            [&_img]:max-w-full [&_img]:rounded-lg [&_img]:my-2
            [&_table]:border-collapse [&_table]:w-full [&_table]:my-3
            [&_td]:border [&_td]:border-gray-200 [&_td]:dark:border-gray-700 [&_td]:px-3 [&_td]:py-2
            [&_th]:border [&_th]:border-gray-200 [&_th]:dark:border-gray-700 [&_th]:px-3 [&_th]:py-2 [&_th]:font-semibold [&_th]:bg-gray-50 [&_th]:dark:bg-gray-800
            ${fontFamilyMap[state.fontFamily]}
          `}
          style={{ height: "100%" }}
        />
      )}
      {placeholder && (
        <div
          className={`absolute top-0 left-0 pointer-events-none ${s.editorPx} ${s.editorPy} ${s.editorText} text-gray-400 dark:text-gray-600`}
          style={{ display: state.charCount === 0 ? "block" : "none" }}
        >
          {placeholder}
        </div>
      )}
    </div>
  );
}

function StatusBar({ size }: { size: TextEditorSize }) {
  const { state } = useTextEditorContext();
  const s = sizeConfig[size];
  return (
    <div className={`flex items-center justify-end gap-3 px-3 py-1 border-t border-gray-100 dark:border-gray-800`}>
      <span className={`${s.selectText} text-gray-400 dark:text-gray-600`}>
        {state.wordCount} {state.wordCount === 1 ? "word" : "words"}
      </span>
      <span className={`${s.selectText} text-gray-400 dark:text-gray-600`}>
        {state.charCount} {state.charCount === 1 ? "char" : "chars"}
      </span>
    </div>
  );
}

function TextEditorInner({
  size = "md",
  variant = "default",
  placeholder,
  className = "",
  toolbarClassName = "",
  editorClassName = "",
  startContent,
  endContent,
  showStatusBar = true,
}: TextEditorInnerProps) {
  const { state, containerRef } = useTextEditorContext();
  const vs = variantStyles[variant];
  const focusedClass = state.isFocused ? focusedVariantStyles[variant] : "";

  if (state.isMaximized) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-gray-900">
        <div className={`${vs.toolbar} ${toolbarClassName}`}>
          <ToolbarInner size={size} />
        </div>
        <div className="flex-1 overflow-y-auto">
          <EditorContent size={size} placeholder={placeholder} />
        </div>
        {showStatusBar && <StatusBar size={size} />}
        {endContent && <div>{endContent}</div>}
      </div>
    );
  }

  return (
    <div
      ref={containerRef as React.RefObject<HTMLDivElement>}
      className={`
        relative flex flex-col rounded-xl overflow-hidden
        transition-colors duration-150
        ${vs.wrapper}
        ${focusedClass}
        ${className}
      `}
    >
      {startContent && <div>{startContent}</div>}

      <div className={`${vs.toolbar} ${toolbarClassName}`}>
        <ToolbarInner size={size} />
      </div>

      <div className={`${vs.editor} ${editorClassName} flex-1`}>
        <EditorContent size={size} placeholder={placeholder} />
      </div>

      {showStatusBar && <StatusBar size={size} />}

      <ResizeHandle size={size} />

      {endContent && <div>{endContent}</div>}
    </div>
  );
}

export interface TextEditorInnerProps {
  size?: TextEditorSize;
  variant?: TextEditorVariant;
  placeholder?: string;
  className?: string;
  toolbarClassName?: string;
  editorClassName?: string;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  showStatusBar?: boolean;
}

export interface TextEditorProps extends TextEditorInnerProps, Omit<TextEditorProviderProps, "children"> {}

export function TextEditor({
  size = "md",
  variant = "default",
  placeholder = "Start writing...",
  minHeight = 200,
  maxHeight = 800,
  onChange,
  className,
  toolbarClassName,
  editorClassName,
  startContent,
  endContent,
  showStatusBar = true,
}: TextEditorProps) {
  return (
    <TextEditorProvider
      size={size}
      variant={variant}
      minHeight={minHeight}
      maxHeight={maxHeight}
      onChange={onChange}
    >
      <TextEditorInner
        size={size}
        variant={variant}
        placeholder={placeholder}
        className={className}
        toolbarClassName={toolbarClassName}
        editorClassName={editorClassName}
        startContent={startContent}
        endContent={endContent}
        showStatusBar={showStatusBar}
      />
    </TextEditorProvider>
  );
}

export { TextEditorProvider, useTextEditorContext };
export type { TextEditorSize, TextEditorVariant, FontFamily, TextAlign, HeadingLevel };