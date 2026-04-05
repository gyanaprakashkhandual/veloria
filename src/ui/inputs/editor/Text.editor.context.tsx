import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useRef,
} from "react";

export type TextEditorSize = "sm" | "md" | "lg" | "xl";
export type TextEditorVariant = "default" | "filled" | "ghost" | "outline";
export type FontFamily = "sans" | "serif" | "mono";
export type TextAlign = "left" | "center" | "right" | "justify";
export type HeadingLevel = "p" | "h1" | "h2" | "h3" | "h4";

export interface TextEditorState {
  isFocused: boolean;
  isMaximized: boolean;
  isResizing: boolean;
  activeFormats: Set<string>;
  fontSize: number;
  fontFamily: FontFamily;
  textAlign: TextAlign;
  textColor: string;
  highlightColor: string;
  headingLevel: HeadingLevel;
  size: TextEditorSize;
  variant: TextEditorVariant;
  wordCount: number;
  charCount: number;
  height: number;
  minHeight: number;
  maxHeight: number;
}

type TextEditorAction =
  | { type: "SET_FOCUSED"; payload: boolean }
  | { type: "TOGGLE_MAXIMIZE" }
  | { type: "SET_RESIZING"; payload: boolean }
  | { type: "TOGGLE_FORMAT"; payload: string }
  | { type: "SET_FORMAT"; payload: { key: string; active: boolean } }
  | { type: "SET_FONT_SIZE"; payload: number }
  | { type: "SET_FONT_FAMILY"; payload: FontFamily }
  | { type: "SET_TEXT_ALIGN"; payload: TextAlign }
  | { type: "SET_TEXT_COLOR"; payload: string }
  | { type: "SET_HIGHLIGHT_COLOR"; payload: string }
  | { type: "SET_HEADING_LEVEL"; payload: HeadingLevel }
  | { type: "SET_COUNTS"; payload: { wordCount: number; charCount: number } }
  | { type: "SET_HEIGHT"; payload: number }
  | { type: "CLEAR_FORMATS" };

function reducer(state: TextEditorState, action: TextEditorAction): TextEditorState {
  switch (action.type) {
    case "SET_FOCUSED":
      return { ...state, isFocused: action.payload };
    case "TOGGLE_MAXIMIZE":
      return { ...state, isMaximized: !state.isMaximized };
    case "SET_RESIZING":
      return { ...state, isResizing: action.payload };
    case "TOGGLE_FORMAT": {
      const next = new Set(state.activeFormats);
      if (next.has(action.payload)) next.delete(action.payload);
      else next.add(action.payload);
      return { ...state, activeFormats: next };
    }
    case "SET_FORMAT": {
      const next = new Set(state.activeFormats);
      if (action.payload.active) next.add(action.payload.key);
      else next.delete(action.payload.key);
      return { ...state, activeFormats: next };
    }
    case "SET_FONT_SIZE":
      return { ...state, fontSize: action.payload };
    case "SET_FONT_FAMILY":
      return { ...state, fontFamily: action.payload };
    case "SET_TEXT_ALIGN":
      return { ...state, textAlign: action.payload };
    case "SET_TEXT_COLOR":
      return { ...state, textColor: action.payload };
    case "SET_HIGHLIGHT_COLOR":
      return { ...state, highlightColor: action.payload };
    case "SET_HEADING_LEVEL":
      return { ...state, headingLevel: action.payload };
    case "SET_COUNTS":
      return { ...state, wordCount: action.payload.wordCount, charCount: action.payload.charCount };
    case "SET_HEIGHT":
      return { ...state, height: action.payload };
    case "CLEAR_FORMATS":
      return { ...state, activeFormats: new Set() };
    default:
      return state;
  }
}

export interface TextEditorContextValue {
  state: TextEditorState;
  dispatch: React.Dispatch<TextEditorAction>;
  editorRef: React.RefObject<HTMLDivElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  setFocused: (v: boolean) => void;
  toggleMaximize: () => void;
  setResizing: (v: boolean) => void;
  toggleFormat: (format: string) => void;
  setFormat: (key: string, active: boolean) => void;
  setFontSize: (size: number) => void;
  setFontFamily: (family: FontFamily) => void;
  setTextAlign: (align: TextAlign) => void;
  setTextColor: (color: string) => void;
  setHighlightColor: (color: string) => void;
  setHeadingLevel: (level: HeadingLevel) => void;
  setCounts: (wordCount: number, charCount: number) => void;
  setHeight: (height: number) => void;
  execCommand: (command: string, value?: string) => void;
  onChangeCallback?: (html: string) => void;
}

const TextEditorContext = createContext<TextEditorContextValue | null>(null);

export interface TextEditorProviderProps {
  children: React.ReactNode;
  size?: TextEditorSize;
  variant?: TextEditorVariant;
  minHeight?: number;
  maxHeight?: number;
  onChange?: (html: string) => void;
}

export function TextEditorProvider({
  children,
  size = "md",
  variant = "default",
  minHeight = 200,
  maxHeight = 800,
  onChange,
}: TextEditorProviderProps) {
  const [state, dispatch] = useReducer(reducer, {
    isFocused: false,
    isMaximized: false,
    isResizing: false,
    activeFormats: new Set<string>(),
    fontSize: 14,
    fontFamily: "sans",
    textAlign: "left",
    textColor: "#000000",
    highlightColor: "#ffff00",
    headingLevel: "p",
    size,
    variant,
    wordCount: 0,
    charCount: 0,
    height: minHeight,
    minHeight,
    maxHeight,
  });

  const editorRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const setFocused = useCallback((v: boolean) => dispatch({ type: "SET_FOCUSED", payload: v }), []);
  const toggleMaximize = useCallback(() => dispatch({ type: "TOGGLE_MAXIMIZE" }), []);
  const setResizing = useCallback((v: boolean) => dispatch({ type: "SET_RESIZING", payload: v }), []);
  const toggleFormat = useCallback((format: string) => dispatch({ type: "TOGGLE_FORMAT", payload: format }), []);
  const setFormat = useCallback((key: string, active: boolean) => dispatch({ type: "SET_FORMAT", payload: { key, active } }), []);
  const setFontSize = useCallback((size: number) => dispatch({ type: "SET_FONT_SIZE", payload: size }), []);
  const setFontFamily = useCallback((family: FontFamily) => dispatch({ type: "SET_FONT_FAMILY", payload: family }), []);
  const setTextAlign = useCallback((align: TextAlign) => dispatch({ type: "SET_TEXT_ALIGN", payload: align }), []);
  const setTextColor = useCallback((color: string) => dispatch({ type: "SET_TEXT_COLOR", payload: color }), []);
  const setHighlightColor = useCallback((color: string) => dispatch({ type: "SET_HIGHLIGHT_COLOR", payload: color }), []);
  const setHeadingLevel = useCallback((level: HeadingLevel) => dispatch({ type: "SET_HEADING_LEVEL", payload: level }), []);
  const setCounts = useCallback((wordCount: number, charCount: number) => dispatch({ type: "SET_COUNTS", payload: { wordCount, charCount } }), []);
  const setHeight = useCallback((height: number) => dispatch({ type: "SET_HEIGHT", payload: height }), []);

  const execCommand = useCallback((command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
  }, []);

  return (
    <TextEditorContext.Provider
      value={{
        state,
        dispatch,
        editorRef,
        containerRef,
        setFocused,
        toggleMaximize,
        setResizing,
        toggleFormat,
        setFormat,
        setFontSize,
        setFontFamily,
        setTextAlign,
        setTextColor,
        setHighlightColor,
        setHeadingLevel,
        setCounts,
        setHeight,
        execCommand,
        onChangeCallback: onChange,
      }}
    >
      {children}
    </TextEditorContext.Provider>
  );
}

export function useTextEditorContext(): TextEditorContextValue {
  const ctx = useContext(TextEditorContext);
  if (!ctx) throw new Error("useTextEditorContext must be used within TextEditorProvider");
  return ctx;
}