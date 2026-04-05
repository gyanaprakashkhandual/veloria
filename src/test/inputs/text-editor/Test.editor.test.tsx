"use client";

import React, { useState } from "react";
import {
  FileText,
  Code2,
  BookOpen,
  MessageSquare,
  Newspaper,
  Pencil,
  BarChart2,
  Mail,
  ClipboardList,
  Layers,
} from "lucide-react";

// ─── Inline context & provider (self-contained) ───────────────────────────────
import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bold, Italic, Underline, Strikethrough,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Link, Link2Off, Image, Table,
  Quote, Minus, Undo, Redo, Maximize2, Minimize2,
  Highlighter, Palette, ChevronDown,
  Subscript, Superscript, RemoveFormatting, GripHorizontal, Code,
} from "lucide-react";

// ─── Bring in the real TextEditor ────────────────────────────────────────────
// In your project this would be:
// import { TextEditor } from "@/ui/editors/text/Text.editor";
// For this showcase we inline everything.

// ════════════════════════════════════════════════════════════════════
// TEXT EDITOR CONTEXT  (Text.editor.context.tsx inlined)
// ════════════════════════════════════════════════════════════════════

const TextEditorContext = createContext(null);

function editorReducer(state, action) {
  switch (action.type) {
    case "SET_FOCUSED": return { ...state, isFocused: action.payload };
    case "TOGGLE_MAXIMIZE": return { ...state, isMaximized: !state.isMaximized };
    case "SET_RESIZING": return { ...state, isResizing: action.payload };
    case "SET_FORMAT": {
      const next = new Set(state.activeFormats);
      action.payload.active ? next.add(action.payload.key) : next.delete(action.payload.key);
      return { ...state, activeFormats: next };
    }
    case "SET_FONT_SIZE": return { ...state, fontSize: action.payload };
    case "SET_FONT_FAMILY": return { ...state, fontFamily: action.payload };
    case "SET_TEXT_ALIGN": return { ...state, textAlign: action.payload };
    case "SET_TEXT_COLOR": return { ...state, textColor: action.payload };
    case "SET_HIGHLIGHT_COLOR": return { ...state, highlightColor: action.payload };
    case "SET_HEADING_LEVEL": return { ...state, headingLevel: action.payload };
    case "SET_COUNTS": return { ...state, wordCount: action.payload.wordCount, charCount: action.payload.charCount };
    case "SET_HEIGHT": return { ...state, height: action.payload };
    default: return state;
  }
}

function TextEditorProvider({ children, size = "md", variant = "default", minHeight = 200, maxHeight = 800, onChange }) {
  const [state, dispatch] = useReducer(editorReducer, {
    isFocused: false, isMaximized: false, isResizing: false,
    activeFormats: new Set(), fontSize: 14, fontFamily: "sans",
    textAlign: "left", textColor: "#000000", highlightColor: "#fef08a",
    headingLevel: "p", size, variant, wordCount: 0, charCount: 0,
    height: minHeight, minHeight, maxHeight,
  });
  const editorRef = useRef(null);
  const containerRef = useRef(null);
  const setFocused = useCallback((v) => dispatch({ type: "SET_FOCUSED", payload: v }), []);
  const toggleMaximize = useCallback(() => dispatch({ type: "TOGGLE_MAXIMIZE" }), []);
  const setResizing = useCallback((v) => dispatch({ type: "SET_RESIZING", payload: v }), []);
  const setFormat = useCallback((key, active) => dispatch({ type: "SET_FORMAT", payload: { key, active } }), []);
  const setFontSize = useCallback((s) => dispatch({ type: "SET_FONT_SIZE", payload: s }), []);
  const setFontFamily = useCallback((f) => dispatch({ type: "SET_FONT_FAMILY", payload: f }), []);
  const setTextAlign = useCallback((a) => dispatch({ type: "SET_TEXT_ALIGN", payload: a }), []);
  const setTextColor = useCallback((c) => dispatch({ type: "SET_TEXT_COLOR", payload: c }), []);
  const setHighlightColor = useCallback((c) => dispatch({ type: "SET_HIGHLIGHT_COLOR", payload: c }), []);
  const setHeadingLevel = useCallback((l) => dispatch({ type: "SET_HEADING_LEVEL", payload: l }), []);
  const setCounts = useCallback((w, c) => dispatch({ type: "SET_COUNTS", payload: { wordCount: w, charCount: c } }), []);
  const setHeight = useCallback((h) => dispatch({ type: "SET_HEIGHT", payload: h }), []);
  const execCommand = useCallback((cmd, val) => { editorRef.current?.focus(); document.execCommand(cmd, false, val); }, []);
  return (
    <TextEditorContext.Provider value={{
      state, dispatch, editorRef, containerRef,
      setFocused, toggleMaximize, setResizing, setFormat,
      setFontSize, setFontFamily, setTextAlign, setTextColor,
      setHighlightColor, setHeadingLevel, setCounts, setHeight,
      execCommand, onChangeCallback: onChange,
    }}>
      {children}
    </TextEditorContext.Provider>
  );
}
function useTextEditorContext() {
  const ctx = useContext(TextEditorContext);
  if (!ctx) throw new Error("Must be inside TextEditorProvider");
  return ctx;
}

// ════════════════════════════════════════════════════════════════════
// TEXT EDITOR COMPONENT  (Text.editor.tsx inlined)
// ════════════════════════════════════════════════════════════════════

const sizeConfig = {
  sm:  { toolbarPx:"px-1.5", toolbarPy:"py-1",   toolbarGap:"gap-0.5", btnSize:"w-6 h-6", btnIcon:12, selectText:"text-xs",  selectPx:"px-1.5", selectH:"h-6", editorPx:"px-3", editorPy:"py-2", editorText:"text-sm",   separatorMx:"mx-0.5" },
  md:  { toolbarPx:"px-2",   toolbarPy:"py-1.5", toolbarGap:"gap-0.5", btnSize:"w-7 h-7", btnIcon:14, selectText:"text-xs",  selectPx:"px-2",   selectH:"h-7", editorPx:"px-4", editorPy:"py-3", editorText:"text-sm",   separatorMx:"mx-1" },
  lg:  { toolbarPx:"px-2.5", toolbarPy:"py-2",   toolbarGap:"gap-1",   btnSize:"w-8 h-8", btnIcon:15, selectText:"text-sm",  selectPx:"px-2.5", selectH:"h-8", editorPx:"px-5", editorPy:"py-4", editorText:"text-base",  separatorMx:"mx-1" },
  xl:  { toolbarPx:"px-3",   toolbarPy:"py-2",   toolbarGap:"gap-1",   btnSize:"w-9 h-9", btnIcon:16, selectText:"text-sm",  selectPx:"px-3",   selectH:"h-9", editorPx:"px-6", editorPy:"py-5", editorText:"text-base",  separatorMx:"mx-1.5" },
};

const variantStyles = {
  default: { wrapper:"bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700", toolbar:"bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-700", editor:"bg-white dark:bg-gray-900" },
  filled:  { wrapper:"bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700",  toolbar:"bg-gray-100 dark:bg-gray-700/60 border-b border-gray-200 dark:border-gray-700", editor:"bg-gray-50 dark:bg-gray-800" },
  ghost:   { wrapper:"bg-transparent border border-transparent", toolbar:"bg-transparent border-b border-gray-100 dark:border-gray-800", editor:"bg-transparent" },
  outline: { wrapper:"bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600", toolbar:"bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-700", editor:"bg-white dark:bg-gray-900" },
};
const focusedVariantStyles = { default:"border-gray-400 dark:border-gray-500", filled:"border-gray-400 dark:border-gray-500", ghost:"border-gray-300 dark:border-gray-700", outline:"border-gray-900 dark:border-gray-300" };
const fontFamilyMap = { sans:"font-sans", serif:"font-serif", mono:"font-mono" };
const fontFamilyStyle = { sans:"ui-sans-serif, system-ui, sans-serif", serif:"ui-serif, Georgia, serif", mono:"ui-monospace, SFMono-Regular, monospace" };

function ToolbarBtn({ active, disabled, onClick, title, size, children }) {
  const s = sizeConfig[size];
  return (
    <button type="button" title={title} disabled={disabled}
      onMouseDown={(e) => { e.preventDefault(); if (!disabled) onClick(); }}
      className={`inline-flex items-center justify-center ${s.btnSize} rounded-md transition-colors duration-100 shrink-0 ${active ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900" : disabled ? "opacity-40 cursor-not-allowed text-gray-400" : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"}`}
    >{children}</button>
  );
}
function Separator({ size }) {
  const s = sizeConfig[size];
  return <div className={`${s.separatorMx} w-px self-stretch bg-gray-200 dark:bg-gray-700 shrink-0`} />;
}

const textColorSwatches = ["#000000","#374151","#6b7280","#9ca3af","#ffffff","#dc2626","#ea580c","#d97706","#16a34a","#2563eb","#7c3aed","#db2777","#fca5a5","#fdba74","#fde68a","#6ee7b7","#93c5fd","#c4b5fd","#f9a8d4","#b91c1c","#c2410c","#b45309","#15803d","#1d4ed8","#6d28d9","#be185d"];
const highlightSwatches = ["#fef08a","#bbf7d0","#bfdbfe","#fecdd3","#e9d5ff","#fed7aa","#fde68a","#a7f3d0","#93c5fd","#fca5a5","#ddd6fe","#fdba74","#fffbeb","#f0fdf4","#eff6ff","#fff1f2","#faf5ff","#fff7ed","#ffffff","#f3f4f6","#e5e7eb","#d1d5db","#9ca3af","#6b7280","#111827","#374151"];
const headingOptions = [{ value:"p",label:"Paragraph" },{ value:"h1",label:"Heading 1" },{ value:"h2",label:"Heading 2" },{ value:"h3",label:"Heading 3" },{ value:"h4",label:"Heading 4" }];
const fontSizeOptions = ["10","12","14","16","18","20","24","28","32","36","48","60","72"].map(v => ({ value:v, label:v }));
const fontFamilyOptions = [{ value:"sans",label:"Sans" },{ value:"serif",label:"Serif" },{ value:"mono",label:"Mono" }];

function ColorPicker({ value, onChange, title, size, icon, swatches }) {
  const s = sizeConfig[size];
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div ref={ref} className="relative">
      <button type="button" title={title} onMouseDown={(e) => { e.preventDefault(); setOpen(v => !v); }}
        className={`inline-flex items-center justify-center ${s.btnSize} rounded-md transition-colors duration-100 shrink-0 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700`}>
        <span className="flex flex-col items-center justify-center gap-0">
          {icon}
          <span className="block rounded-sm" style={{ width: s.btnIcon, height: 3, backgroundColor: value, marginTop: 1 }} />
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity:0, y:-4, scale:0.97 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:-4, scale:0.97 }} transition={{ duration:0.13 }}
            className="absolute top-full left-0 mt-1.5 z-50 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-2.5" style={{ minWidth:160 }}>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {swatches.map(c => (
                <button key={c} type="button" onMouseDown={(e) => { e.preventDefault(); onChange(c); setOpen(false); }}
                  className="w-5 h-5 rounded-md border border-gray-200 dark:border-gray-700 hover:scale-110 transition-transform"
                  style={{ backgroundColor: c }} />
              ))}
            </div>
            <div className="flex items-center gap-2 border-t border-gray-100 dark:border-gray-800 pt-2">
              <input type="color" value={value} onChange={e => onChange(e.target.value)} className="w-7 h-7 rounded cursor-pointer border-0 p-0" />
              <span className="text-xs text-gray-500 font-mono">{value}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SelectDropdown({ value, options, onChange, size, width = 100 }) {
  const s = sizeConfig[size];
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = options.find(o => o.value === value);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div ref={ref} className="relative" style={{ width }}>
      <button type="button" onMouseDown={(e) => { e.preventDefault(); setOpen(v => !v); }}
        className={`w-full inline-flex items-center justify-between gap-1 ${s.selectPx} ${s.selectH} ${s.selectText} font-medium rounded-md transition-colors duration-100 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800`}>
        <span className="truncate">{current?.label ?? value}</span>
        <ChevronDown size={10} className="shrink-0 text-gray-400" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity:0, y:-4, scale:0.97 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:-4, scale:0.97 }} transition={{ duration:0.13 }}
            className="absolute top-full left-0 mt-1 z-50 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden" style={{ minWidth: width }}>
            <div className="p-1">
              {options.map(opt => (
                <button key={opt.value} type="button" onMouseDown={(e) => { e.preventDefault(); onChange(opt.value); setOpen(false); }}
                  className={`w-full flex items-center ${s.selectPx} py-1.5 rounded-md ${s.selectText} font-medium text-left transition-colors duration-100 ${value === opt.value ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900" : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"}`}>
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

function ToolbarInner({ size }) {
  const { state, execCommand, setTextColor, setHighlightColor, setFontSize, setFontFamily, setTextAlign, setHeadingLevel, toggleMaximize, editorRef } = useTextEditorContext();
  const s = sizeConfig[size];
  const handleBold = useCallback(() => execCommand("bold"), [execCommand]);
  const handleItalic = useCallback(() => execCommand("italic"), [execCommand]);
  const handleUnderline = useCallback(() => execCommand("underline"), [execCommand]);
  const handleStrike = useCallback(() => execCommand("strikeThrough"), [execCommand]);
  const handleSubscript = useCallback(() => execCommand("subscript"), [execCommand]);
  const handleSuperscript = useCallback(() => execCommand("superscript"), [execCommand]);
  const handleCode = useCallback(() => {
    const sel = window.getSelection(); if (!sel || sel.isCollapsed) return;
    const range = sel.getRangeAt(0); const code = document.createElement("code");
    code.style.fontFamily="monospace"; code.style.backgroundColor="rgba(0,0,0,0.08)"; code.style.padding="0 3px"; code.style.borderRadius="3px";
    range.surroundContents(code);
  }, []);
  const handleAlign = useCallback((align) => {
    const m = { left:"justifyLeft", center:"justifyCenter", right:"justifyRight", justify:"justifyFull" };
    execCommand(m[align]); setTextAlign(align);
  }, [execCommand, setTextAlign]);
  const handleUL = useCallback(() => execCommand("insertUnorderedList"), [execCommand]);
  const handleOL = useCallback(() => execCommand("insertOrderedList"), [execCommand]);
  const handleBlockquote = useCallback(() => execCommand("formatBlock", "blockquote"), [execCommand]);
  const handleHR = useCallback(() => execCommand("insertHorizontalRule"), [execCommand]);
  const handleLink = useCallback(() => { const url = prompt("Enter URL:"); if (url) execCommand("createLink", url); }, [execCommand]);
  const handleUnlink = useCallback(() => execCommand("unlink"), [execCommand]);
  const handleImage = useCallback(() => { const url = prompt("Enter image URL:"); if (url) execCommand("insertImage", url); }, [execCommand]);
  const handleTable = useCallback(() => {
    let html = '<table style="border-collapse:collapse;width:100%;margin:8px 0">';
    for (let r=0;r<3;r++) { html+="<tr>"; for (let c=0;c<3;c++) html += r===0 ? '<th style="border:1px solid #d1d5db;padding:6px 10px;background:#f9fafb;font-weight:600">&nbsp;</th>' : '<td style="border:1px solid #d1d5db;padding:6px 10px">&nbsp;</td>'; html+="</tr>"; }
    html+="</table><br>"; execCommand("insertHTML", html);
  }, [execCommand]);
  const handleRemoveFormat = useCallback(() => execCommand("removeFormat"), [execCommand]);
  const handleUndo = useCallback(() => execCommand("undo"), [execCommand]);
  const handleRedo = useCallback(() => execCommand("redo"), [execCommand]);
  const handleTextColor = useCallback((c) => { setTextColor(c); execCommand("foreColor", c); }, [setTextColor, execCommand]);
  const handleHighlight = useCallback((c) => { setHighlightColor(c); execCommand("hiliteColor", c); }, [setHighlightColor, execCommand]);
  const handleFontSize = useCallback((val) => {
    setFontSize(parseInt(val));
    if (editorRef.current) {
      const sel = window.getSelection();
      if (sel && !sel.isCollapsed) { const range = sel.getRangeAt(0); const span = document.createElement("span"); span.style.fontSize=`${val}px`; range.surroundContents(span); }
      else editorRef.current.style.fontSize=`${val}px`;
    }
  }, [setFontSize, editorRef]);
  const handleFontFamily = useCallback((val) => { setFontFamily(val); execCommand("fontName", fontFamilyStyle[val]); }, [setFontFamily, execCommand]);
  const handleHeading = useCallback((val) => { setHeadingLevel(val); execCommand("formatBlock", val === "p" ? "p" : val); }, [setHeadingLevel, execCommand]);
  return (
    <div className={`flex items-center flex-wrap ${s.toolbarPx} ${s.toolbarPy} ${s.toolbarGap} select-none`}>
      <ToolbarBtn size={size} title="Undo" onClick={handleUndo}><Undo size={s.btnIcon} /></ToolbarBtn>
      <ToolbarBtn size={size} title="Redo" onClick={handleRedo}><Redo size={s.btnIcon} /></ToolbarBtn>
      <Separator size={size} />
      <SelectDropdown value={state.headingLevel} options={headingOptions} onChange={handleHeading} size={size} width={size==="sm"?90:100} />
      <Separator size={size} />
      <SelectDropdown value={String(state.fontSize)} options={fontSizeOptions} onChange={handleFontSize} size={size} width={size==="sm"?48:56} />
      <SelectDropdown value={state.fontFamily} options={fontFamilyOptions} onChange={handleFontFamily} size={size} width={size==="sm"?58:68} />
      <Separator size={size} />
      <ToolbarBtn size={size} title="Bold" active={state.activeFormats.has("bold")} onClick={handleBold}><Bold size={s.btnIcon} /></ToolbarBtn>
      <ToolbarBtn size={size} title="Italic" active={state.activeFormats.has("italic")} onClick={handleItalic}><Italic size={s.btnIcon} /></ToolbarBtn>
      <ToolbarBtn size={size} title="Underline" active={state.activeFormats.has("underline")} onClick={handleUnderline}><Underline size={s.btnIcon} /></ToolbarBtn>
      <ToolbarBtn size={size} title="Strikethrough" active={state.activeFormats.has("strikeThrough")} onClick={handleStrike}><Strikethrough size={s.btnIcon} /></ToolbarBtn>
      <ToolbarBtn size={size} title="Subscript" active={state.activeFormats.has("subscript")} onClick={handleSubscript}><Subscript size={s.btnIcon} /></ToolbarBtn>
      <ToolbarBtn size={size} title="Superscript" active={state.activeFormats.has("superscript")} onClick={handleSuperscript}><Superscript size={s.btnIcon} /></ToolbarBtn>
      <ToolbarBtn size={size} title="Inline Code" onClick={handleCode}><Code size={s.btnIcon} /></ToolbarBtn>
      <Separator size={size} />
      <ColorPicker value={state.textColor} onChange={handleTextColor} title="Text Color" size={size} icon={<Palette size={s.btnIcon} />} swatches={textColorSwatches} />
      <ColorPicker value={state.highlightColor} onChange={handleHighlight} title="Highlight" size={size} icon={<Highlighter size={s.btnIcon} />} swatches={highlightSwatches} />
      <Separator size={size} />
      <ToolbarBtn size={size} title="Align Left" active={state.textAlign==="left"} onClick={()=>handleAlign("left")}><AlignLeft size={s.btnIcon} /></ToolbarBtn>
      <ToolbarBtn size={size} title="Align Center" active={state.textAlign==="center"} onClick={()=>handleAlign("center")}><AlignCenter size={s.btnIcon} /></ToolbarBtn>
      <ToolbarBtn size={size} title="Align Right" active={state.textAlign==="right"} onClick={()=>handleAlign("right")}><AlignRight size={s.btnIcon} /></ToolbarBtn>
      <ToolbarBtn size={size} title="Justify" active={state.textAlign==="justify"} onClick={()=>handleAlign("justify")}><AlignJustify size={s.btnIcon} /></ToolbarBtn>
      <Separator size={size} />
      <ToolbarBtn size={size} title="Bullet List" active={state.activeFormats.has("insertUnorderedList")} onClick={handleUL}><List size={s.btnIcon} /></ToolbarBtn>
      <ToolbarBtn size={size} title="Numbered List" active={state.activeFormats.has("insertOrderedList")} onClick={handleOL}><ListOrdered size={s.btnIcon} /></ToolbarBtn>
      <ToolbarBtn size={size} title="Blockquote" onClick={handleBlockquote}><Quote size={s.btnIcon} /></ToolbarBtn>
      <ToolbarBtn size={size} title="Horizontal Rule" onClick={handleHR}><Minus size={s.btnIcon} /></ToolbarBtn>
      <Separator size={size} />
      <ToolbarBtn size={size} title="Insert Link" onClick={handleLink}><Link size={s.btnIcon} /></ToolbarBtn>
      <ToolbarBtn size={size} title="Remove Link" onClick={handleUnlink}><Link2Off size={s.btnIcon} /></ToolbarBtn>
      <ToolbarBtn size={size} title="Insert Image" onClick={handleImage}><Image size={s.btnIcon} /></ToolbarBtn>
      <ToolbarBtn size={size} title="Insert Table" onClick={handleTable}><Table size={s.btnIcon} /></ToolbarBtn>
      <Separator size={size} />
      <ToolbarBtn size={size} title="Remove Formatting" onClick={handleRemoveFormat}><RemoveFormatting size={s.btnIcon} /></ToolbarBtn>
      <div className="ml-auto flex items-center gap-0.5">
        <ToolbarBtn size={size} title={state.isMaximized ? "Exit Fullscreen" : "Maximize"} onClick={toggleMaximize}>
          {state.isMaximized ? <Minimize2 size={s.btnIcon} /> : <Maximize2 size={s.btnIcon} />}
        </ToolbarBtn>
      </div>
    </div>
  );
}

function ResizeHandle({ size }) {
  const { state, setHeight, setResizing } = useTextEditorContext();
  const startY = useRef(0); const startH = useRef(0);
  const onMouseDown = useCallback((e) => {
    e.preventDefault(); startY.current = e.clientY; startH.current = state.height; setResizing(true);
    const onMove = (ev) => { const delta = ev.clientY - startY.current; setHeight(Math.max(state.minHeight, Math.min(state.maxHeight, startH.current + delta))); };
    const onUp = () => { setResizing(false); window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
    window.addEventListener("mousemove", onMove); window.addEventListener("mouseup", onUp);
  }, [state.height, state.minHeight, state.maxHeight, setHeight, setResizing]);
  return (
    <div onMouseDown={onMouseDown} className="flex items-center justify-center h-3 cursor-ns-resize select-none group" title="Drag to resize">
      <GripHorizontal size={12} className="text-gray-300 dark:text-gray-700 group-hover:text-gray-500 transition-colors duration-100" />
    </div>
  );
}

const editorContentClasses = `
  w-full outline-none text-gray-900 dark:text-gray-100 overflow-y-auto
  [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-3 [&_h1]:mt-2
  [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-2 [&_h2]:mt-2
  [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mb-2 [&_h3]:mt-2
  [&_h4]:text-lg [&_h4]:font-semibold [&_h4]:mb-1.5 [&_h4]:mt-2
  [&_p]:mb-2 [&_p]:leading-relaxed
  [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:dark:border-gray-600 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-600 [&_blockquote]:dark:text-gray-400 [&_blockquote]:my-3
  [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-2 [&_ul]:space-y-1
  [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-2 [&_ol]:space-y-1
  [&_hr]:border-gray-200 [&_hr]:dark:border-gray-700 [&_hr]:my-4
  [&_a]:text-blue-600 [&_a]:dark:text-blue-400 [&_a]:underline
  [&_img]:max-w-full [&_img]:rounded-lg [&_img]:my-2
  [&_table]:border-collapse [&_table]:w-full [&_table]:my-3
  [&_td]:border [&_td]:border-gray-200 [&_td]:dark:border-gray-700 [&_td]:px-3 [&_td]:py-2
  [&_th]:border [&_th]:border-gray-200 [&_th]:dark:border-gray-700 [&_th]:px-3 [&_th]:py-2 [&_th]:font-semibold [&_th]:bg-gray-50 [&_th]:dark:bg-gray-800
`;

function EditorContent({ size, placeholder }) {
  const { state, editorRef, setFocused, setFormat, setCounts, onChangeCallback } = useTextEditorContext();
  const s = sizeConfig[size];
  const syncFormats = useCallback(() => {
    ["bold","italic","underline","strikeThrough","subscript","superscript","insertUnorderedList","insertOrderedList"]
      .forEach(f => setFormat(f, document.queryCommandState(f)));
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
  return (
    <div className="relative">
      <div ref={editorRef} contentEditable suppressContentEditableWarning
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        onInput={handleInput} onKeyUp={syncFormats} onMouseUp={syncFormats}
        spellCheck
        className={`${editorContentClasses} ${s.editorPx} ${s.editorPy} ${s.editorText} ${fontFamilyMap[state.fontFamily]}`}
        style={{ minHeight: state.height, maxHeight: state.height }}
      />
      {placeholder && (
        <div className={`absolute top-0 left-0 pointer-events-none ${s.editorPx} ${s.editorPy} ${s.editorText} text-gray-400 dark:text-gray-600`}
          style={{ display: state.charCount === 0 ? "block" : "none" }}>
          {placeholder}
        </div>
      )}
    </div>
  );
}

function StatusBar({ size }) {
  const { state } = useTextEditorContext();
  const s = sizeConfig[size];
  return (
    <div className="flex items-center justify-end gap-3 px-3 py-1 border-t border-gray-100 dark:border-gray-800">
      <span className={`${s.selectText} text-gray-400 dark:text-gray-600`}>{state.wordCount} {state.wordCount===1?"word":"words"}</span>
      <span className={`${s.selectText} text-gray-400 dark:text-gray-600`}>{state.charCount} {state.charCount===1?"char":"chars"}</span>
    </div>
  );
}

function TextEditorInner({ size="md", variant="default", placeholder, className="", toolbarClassName="", editorClassName="", startContent, endContent, showStatusBar=true }) {
  const { state, containerRef } = useTextEditorContext();
  const vs = variantStyles[variant];
  const focusedClass = state.isFocused ? focusedVariantStyles[variant] : "";
  if (state.isMaximized) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-gray-900">
        <div className={`${vs.toolbar} ${toolbarClassName}`}><ToolbarInner size={size} /></div>
        <div className="flex-1 overflow-y-auto"><EditorContent size={size} placeholder={placeholder} /></div>
        {showStatusBar && <StatusBar size={size} />}
      </div>
    );
  }
  return (
    <div ref={containerRef} className={`relative flex flex-col rounded-xl overflow-hidden transition-colors duration-150 ${vs.wrapper} ${focusedClass} ${className}`}>
      {startContent && <div>{startContent}</div>}
      <div className={`${vs.toolbar} ${toolbarClassName}`}><ToolbarInner size={size} /></div>
      <div className={`${vs.editor} ${editorClassName} flex-1`}><EditorContent size={size} placeholder={placeholder} /></div>
      {showStatusBar && <StatusBar size={size} />}
      <ResizeHandle size={size} />
      {endContent && <div>{endContent}</div>}
    </div>
  );
}

function TextEditor({ size="md", variant="default", placeholder="Start writing...", minHeight=200, maxHeight=800, onChange, className, toolbarClassName, editorClassName, startContent, endContent, showStatusBar=true }) {
  return (
    <TextEditorProvider size={size} variant={variant} minHeight={minHeight} maxHeight={maxHeight} onChange={onChange}>
      <TextEditorInner size={size} variant={variant} placeholder={placeholder} className={className} toolbarClassName={toolbarClassName} editorClassName={editorClassName} startContent={startContent} endContent={endContent} showStatusBar={showStatusBar} />
    </TextEditorProvider>
  );
}

// ════════════════════════════════════════════════════════════════════
// SHOWCASE PAGE
// ════════════════════════════════════════════════════════════════════

function PageSection({ title, children }) {
  return (
    <section className="mb-16">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-[11px] font-semibold tracking-widest uppercase text-gray-400 dark:text-gray-500 whitespace-nowrap">
          {title}
        </h2>
        <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
      </div>
      {children}
    </section>
  );
}

function DemoFrame({ label, badge, children, noPad = false }) {
  return (
    <div className="flex flex-col gap-0 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden bg-gray-50 dark:bg-gray-950">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
        <span className="text-xs font-medium text-gray-400 dark:text-gray-500">{label}</span>
        {badge && (
          <span className="text-[10px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </div>
      <div className={noPad ? "" : "p-4"}>
        {children}
      </div>
    </div>
  );
}

function EventLog({ events }) {
  if (!events.length) return null;
  return (
    <div className="mt-2 flex flex-col gap-1">
      {events.slice(-3).map((e, i) => (
        <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
          <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">{e}</span>
        </div>
      ))}
    </div>
  );
}

function AuthorTagSlot() {
  return (
    <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60">
      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
        JD
      </div>
      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Jane Doe</span>
      <span className="text-[10px] text-gray-300 dark:text-gray-700">·</span>
      <span className="text-xs text-gray-400 dark:text-gray-600">Draft</span>
    </div>
  );
}

function TitleSlot() {
  return (
    <div className="px-4 pt-4 pb-0">
      <input
        type="text"
        placeholder="Untitled document…"
        defaultValue="My First Document"
        className="w-full text-xl font-semibold text-gray-800 dark:text-gray-100 bg-transparent border-none outline-none placeholder:text-gray-300 dark:placeholder:text-gray-700"
      />
    </div>
  );
}

function WordCountBadge({ count }) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
      <BarChart2 size={11} className="text-gray-400" />
      <span className="text-[11px] text-gray-400 dark:text-gray-600 font-medium">
        {count} words written
      </span>
    </div>
  );
}

export default function TextEditorShowcase() {
  const [changeEvents, setChangeEvents] = useState([]);
  const [wordCount, setWordCount] = useState(0);

  const logChange = useCallback((html) => {
    const text = html.replace(/<[^>]+>/g, " ").trim();
    const words = text ? text.split(/\s+/).length : 0;
    setWordCount(words);
    setChangeEvents(prev => [...prev, `onChange → ${words} word${words !== 1 ? "s" : ""}`]);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

      {/* Page header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 pt-12 pb-10">
        <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 dark:text-gray-500 mb-2">
          Component showcase
        </p>
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-3">
          TextEditor
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-lg leading-relaxed">
          All variants, sizes, custom slots, resize behavior, status bar, and
          real-world usage patterns for the{" "}
          <code className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
            TextEditor
          </code>{" "}
          component.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-8 pb-20">

        {/* 1. Variants */}
        <PageSection title="Variants">
          <div className="flex flex-col gap-4">
            <DemoFrame label='variant="default"'>
              <TextEditor variant="default" size="md" placeholder="Start writing…" minHeight={140} showStatusBar={true} />
            </DemoFrame>

            <DemoFrame label='variant="filled"'>
              <TextEditor variant="filled" size="md" placeholder="Write something here…" minHeight={140} showStatusBar={true} />
            </DemoFrame>

            <DemoFrame label='variant="ghost"'>
              <TextEditor variant="ghost" size="md" placeholder="Ghost style — borderless feel…" minHeight={140} showStatusBar={true} />
            </DemoFrame>

            <DemoFrame label='variant="outline"'>
              <TextEditor variant="outline" size="md" placeholder="Outline style — 2px border, more emphasis…" minHeight={140} showStatusBar={true} />
            </DemoFrame>
          </div>
        </PageSection>

        {/* 2. Sizes */}
        <PageSection title="Sizes">
          <div className="flex flex-col gap-4">
            {["sm", "md", "lg", "xl"].map((sz) => (
              <DemoFrame key={sz} label={`size="${sz}"`}>
                <TextEditor variant="default" size={sz} placeholder={`Compact toolbar and editor at size="${sz}"…`} minHeight={110} showStatusBar={false} />
              </DemoFrame>
            ))}
          </div>
        </PageSection>

        {/* 3. Status bar */}
        <PageSection title="Status bar">
          <div className="flex flex-col gap-4">
            <DemoFrame label="showStatusBar={true} — word & character count" badge="default">
              <TextEditor variant="default" size="md" placeholder="Type something to see the word and character count update…" minHeight={140} showStatusBar={true} />
            </DemoFrame>
            <DemoFrame label="showStatusBar={false} — no footer">
              <TextEditor variant="default" size="md" placeholder="Clean look without status bar…" minHeight={140} showStatusBar={false} />
            </DemoFrame>
          </div>
        </PageSection>

        {/* 4. Resize */}
        <PageSection title="Resizable editor">
          <div className="flex flex-col gap-4">
            <DemoFrame label="Drag the grip handle at the bottom to resize" badge="interactive">
              <TextEditor variant="default" size="md" placeholder="Drag the grip at the bottom edge to make the editor taller or shorter…" minHeight={120} maxHeight={600} showStatusBar={true} />
            </DemoFrame>
          </div>
        </PageSection>

        {/* 5. startContent slot */}
        <PageSection title="startContent slot">
          <div className="flex flex-col gap-4">
            <DemoFrame label="Author tag above the toolbar" noPad>
              <TextEditor
                variant="default" size="md"
                placeholder="Write your post…"
                minHeight={140} showStatusBar={true}
                startContent={<AuthorTagSlot />}
              />
            </DemoFrame>
            <DemoFrame label="Document title input before the toolbar" noPad>
              <TextEditor
                variant="default" size="md"
                placeholder="Body text goes here…"
                minHeight={130} showStatusBar={true}
                startContent={<TitleSlot />}
              />
            </DemoFrame>
          </div>
        </PageSection>

        {/* 6. endContent slot */}
        <PageSection title="endContent slot">
          <div className="flex flex-col gap-4">
            <DemoFrame label="Custom word-count footer below the editor" noPad>
              <TextEditor
                variant="default" size="md"
                placeholder="Type to see the word count update in the footer…"
                minHeight={140} showStatusBar={false}
                onChange={(html) => {
                  const text = html.replace(/<[^>]+>/g, " ").trim();
                  setWordCount(text ? text.split(/\s+/).length : 0);
                }}
                endContent={<WordCountBadge count={wordCount} />}
              />
            </DemoFrame>

            <DemoFrame label="Action buttons footer (Save / Discard)" noPad>
              <TextEditor
                variant="outline" size="md"
                placeholder="Draft your message…"
                minHeight={140} showStatusBar={true}
                endContent={
                  <div className="flex items-center justify-end gap-2 px-4 py-2.5 border-t border-gray-100 dark:border-gray-800">
                    <button type="button" className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
                      Discard
                    </button>
                    <button type="button" className="px-3 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-semibold rounded-lg hover:bg-gray-700 dark:hover:bg-gray-100 transition-colors">
                      Save draft
                    </button>
                  </div>
                }
              />
            </DemoFrame>
          </div>
        </PageSection>

        {/* 7. onChange callback */}
        <PageSection title="onChange callback">
          <div className="flex flex-col gap-4">
            <DemoFrame label="onChange fires on every keystroke — emits HTML" badge="stateful">
              <TextEditor variant="default" size="md" placeholder="Start typing to see onChange events below…" minHeight={130} showStatusBar={true} onChange={logChange} />
            </DemoFrame>
            <EventLog events={changeEvents} />
          </div>
        </PageSection>

        {/* 8. Real-world presets */}
        <PageSection title="Real-world presets">
          <div className="flex flex-col gap-4">

            <DemoFrame label="Blog post editor — lg size + author slot + save actions" noPad>
              <TextEditor
                variant="default" size="lg"
                placeholder="Tell your story…"
                minHeight={200} showStatusBar={true}
                startContent={<AuthorTagSlot />}
                endContent={
                  <div className="flex items-center gap-2 px-5 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/40">
                    <span className="text-xs text-gray-400 dark:text-gray-600 mr-auto flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
                      Unsaved changes
                    </span>
                    <button type="button" className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 transition-colors">Cancel</button>
                    <button type="button" className="px-4 py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold rounded-lg transition-colors">Publish</button>
                  </div>
                }
              />
            </DemoFrame>

            <DemoFrame label="Code / technical doc — md + mono font + filled variant" noPad>
              <TextEditor
                variant="filled" size="md"
                placeholder="Paste your technical notes here…"
                minHeight={160} showStatusBar={true}
                startContent={
                  <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800/80">
                    <Code2 size={13} className="text-gray-400 dark:text-gray-500" />
                    <span className="text-xs font-medium text-gray-400 dark:text-gray-500">Technical Notes</span>
                  </div>
                }
              />
            </DemoFrame>

            <DemoFrame label="Email compose — sm + ghost + minimal chrome" noPad>
              <TextEditor
                variant="ghost" size="sm"
                placeholder="Compose your email body…"
                minHeight={160} showStatusBar={false}
                startContent={
                  <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100 dark:border-gray-800">
                    <Mail size={12} className="text-gray-400" />
                    <input type="text" placeholder="Subject…" defaultValue="Re: Q3 Planning"
                      className="flex-1 text-xs font-medium text-gray-700 dark:text-gray-300 bg-transparent border-none outline-none placeholder:text-gray-300 dark:placeholder:text-gray-700" />
                  </div>
                }
                endContent={
                  <div className="flex items-center gap-2 px-3 py-2 border-t border-gray-100 dark:border-gray-800">
                    <button type="button" className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5">
                      <Mail size={11} /> Send
                    </button>
                    <button type="button" className="px-2.5 py-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors">Save draft</button>
                  </div>
                }
              />
            </DemoFrame>

            <DemoFrame label="Meeting notes — xl + title slot + resizable" noPad>
              <TextEditor
                variant="default" size="xl"
                placeholder="Type your meeting notes…"
                minHeight={220} maxHeight={700} showStatusBar={true}
                startContent={
                  <div className="px-6 pt-5 pb-0 bg-white dark:bg-gray-900 border-b-0">
                    <input type="text" placeholder="Meeting title…" defaultValue="Weekly Sync · April 2026"
                      className="w-full text-2xl font-bold text-gray-900 dark:text-white bg-transparent border-none outline-none placeholder:text-gray-200 dark:placeholder:text-gray-800 mb-1" />
                    <p className="text-xs text-gray-400 dark:text-gray-600 pb-3">Sunday, April 05 · Attendees: 6</p>
                  </div>
                }
              />
            </DemoFrame>

            <DemoFrame label="Minimal inline note — sm + no status bar + no resize chrome" noPad>
              <TextEditor
                variant="ghost" size="sm"
                placeholder="Quick note…"
                minHeight={90} showStatusBar={false}
              />
            </DemoFrame>

          </div>
        </PageSection>

      </div>
    </div>
  );
}