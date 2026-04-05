/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useRef,
} from "react";

export type ColorPickerSize = "sm" | "md" | "lg" | "xl";
export type ColorPickerVariant = "default" | "filled" | "ghost" | "outline";
export type ColorMode = "hex" | "rgb" | "hsl";
export type ColorPickerView = "swatches" | "spectrum" | "custom";

export interface RGBColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface HSLColor {
  h: number;
  s: number;
  l: number;
  a: number;
}

export interface ColorValue {
  hex: string;
  rgb: RGBColor;
  hsl: HSLColor;
}

export interface RecentColor {
  hex: string;
  label?: string;
}

export interface ColorPaletteGroup {
  label: string;
  colors: string[];
}

export interface ColorPickerState {
  isOpen: boolean;
  value: ColorValue;
  activeView: ColorPickerView;
  activeMode: ColorMode;
  recentColors: RecentColor[];
  hue: number;
  saturation: number;
  lightness: number;
  alpha: number;
  spectrumX: number;
  spectrumY: number;
  inputHex: string;
  inputR: string;
  inputG: string;
  inputB: string;
  inputH: string;
  inputS: string;
  inputL: string;
  inputA: string;
  disabled: boolean;
  size: ColorPickerSize;
  variant: ColorPickerVariant;
}

type ColorPickerAction =
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "TOGGLE" }
  | { type: "SET_VALUE"; payload: ColorValue }
  | { type: "SET_VIEW"; payload: ColorPickerView }
  | { type: "SET_MODE"; payload: ColorMode }
  | { type: "ADD_RECENT"; payload: RecentColor }
  | { type: "SET_HUE"; payload: number }
  | { type: "SET_SPECTRUM"; payload: { x: number; y: number } }
  | { type: "SET_ALPHA"; payload: number }
  | { type: "SET_INPUT_HEX"; payload: string }
  | { type: "SET_INPUT_RGB"; payload: { r?: string; g?: string; b?: string } }
  | { type: "SET_INPUT_HSL"; payload: { h?: string; s?: string; l?: string } }
  | { type: "SET_INPUT_A"; payload: string };

function hexToRgb(hex: string): RGBColor {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const num = parseInt(full, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
    a: 1,
  };
}

function rgbToHsl(
  r: number,
  g: number,
  b: number,
): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToRgb(
  h: number,
  s: number,
  l: number,
): { r: number; g: number; b: number } {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return {
    r: Math.round(f(0) * 255),
    g: Math.round(f(8) * 255),
    b: Math.round(f(4) * 255),
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
}

export function hexToColorValue(hex: string, alpha = 1): ColorValue {
  const rgb = hexToRgb(hex);
  rgb.a = alpha;
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  return { hex: hex.toLowerCase(), rgb, hsl: { ...hsl, a: alpha } };
}

export function hslToColorValue(
  h: number,
  s: number,
  l: number,
  a = 1,
): ColorValue {
  const { r, g, b } = hslToRgb(h, s, l);
  const hex = rgbToHex(r, g, b);
  return { hex, rgb: { r, g, b, a }, hsl: { h, s, l, a } };
}

export function rgbToColorValue(
  r: number,
  g: number,
  b: number,
  a = 1,
): ColorValue {
  const hex = rgbToHex(r, g, b);
  const hsl = rgbToHsl(r, g, b);
  return { hex, rgb: { r, g, b, a }, hsl: { ...hsl, a } };
}

function spectrumToHsl(
  x: number,
  y: number,
  hue: number,
): { s: number; l: number } {
  const s = Math.round(x * 100);
  const l = Math.round((1 - y) * (100 - x * 50));
  return { s: Math.max(0, Math.min(100, s)), l: Math.max(0, Math.min(100, l)) };
}

function hslToSpectrum(
  h: number,
  s: number,
  l: number,
): { x: number; y: number } {
  const x = s / 100;
  const maxL = 100 - x * 50;
  const y = maxL > 0 ? 1 - l / maxL : 0;
  return { x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) };
}

const initialHex = "#3b82f6";
const initialRgb = hexToRgb(initialHex);
const initialHsl = rgbToHsl(initialRgb.r, initialRgb.g, initialRgb.b);
const initialSpectrum = hslToSpectrum(initialHsl.h, initialHsl.s, initialHsl.l);

function buildInputs(cv: ColorValue) {
  return {
    inputHex: cv.hex,
    inputR: String(cv.rgb.r),
    inputG: String(cv.rgb.g),
    inputB: String(cv.rgb.b),
    inputH: String(cv.hsl.h),
    inputS: String(cv.hsl.s),
    inputL: String(cv.hsl.l),
    inputA: String(Math.round(cv.rgb.a * 100)),
  };
}

function reducer(
  state: ColorPickerState,
  action: ColorPickerAction,
): ColorPickerState {
  switch (action.type) {
    case "OPEN":
      return { ...state, isOpen: true };
    case "CLOSE":
      return { ...state, isOpen: false };
    case "TOGGLE":
      return { ...state, isOpen: !state.isOpen };
    case "SET_VALUE": {
      const cv = action.payload;
      const sp = hslToSpectrum(cv.hsl.h, cv.hsl.s, cv.hsl.l);
      return {
        ...state,
        value: cv,
        hue: cv.hsl.h,
        saturation: cv.hsl.s,
        lightness: cv.hsl.l,
        alpha: cv.rgb.a,
        spectrumX: sp.x,
        spectrumY: sp.y,
        ...buildInputs(cv),
      };
    }
    case "SET_VIEW":
      return { ...state, activeView: action.payload };
    case "SET_MODE":
      return { ...state, activeMode: action.payload };
    case "ADD_RECENT": {
      const next = [
        action.payload,
        ...state.recentColors.filter((c) => c.hex !== action.payload.hex),
      ].slice(0, 14);
      return { ...state, recentColors: next };
    }
    case "SET_HUE": {
      const h = action.payload;
      const { s, l } = spectrumToHsl(state.spectrumX, state.spectrumY, h);
      const cv = hslToColorValue(h, s, l, state.alpha);
      return {
        ...state,
        hue: h,
        saturation: s,
        lightness: l,
        value: cv,
        ...buildInputs(cv),
      };
    }
    case "SET_SPECTRUM": {
      const { x, y } = action.payload;
      const { s, l } = spectrumToHsl(x, y, state.hue);
      const cv = hslToColorValue(state.hue, s, l, state.alpha);
      return {
        ...state,
        spectrumX: x,
        spectrumY: y,
        saturation: s,
        lightness: l,
        value: cv,
        ...buildInputs(cv),
      };
    }
    case "SET_ALPHA": {
      const a = action.payload;
      const cv = {
        ...state.value,
        rgb: { ...state.value.rgb, a },
        hsl: { ...state.value.hsl, a },
      };
      return {
        ...state,
        alpha: a,
        value: cv,
        inputA: String(Math.round(a * 100)),
      };
    }
    case "SET_INPUT_HEX":
      return { ...state, inputHex: action.payload };
    case "SET_INPUT_RGB":
      return {
        ...state,
        inputR: action.payload.r ?? state.inputR,
        inputG: action.payload.g ?? state.inputG,
        inputB: action.payload.b ?? state.inputB,
      };
    case "SET_INPUT_HSL":
      return {
        ...state,
        inputH: action.payload.h ?? state.inputH,
        inputS: action.payload.s ?? state.inputS,
        inputL: action.payload.l ?? state.inputL,
      };
    case "SET_INPUT_A":
      return { ...state, inputA: action.payload };
    default:
      return state;
  }
}

export interface ColorPickerContextValue {
  state: ColorPickerState;
  dispatch: React.Dispatch<ColorPickerAction>;
  anchorRef: React.RefObject<HTMLDivElement | null>;
  open: () => void;
  close: () => void;
  toggle: () => void;
  setView: (view: ColorPickerView) => void;
  setMode: (mode: ColorMode) => void;
  setHue: (hue: number) => void;
  setSpectrum: (x: number, y: number) => void;
  setAlpha: (a: number) => void;
  commitHex: (hex: string) => void;
  commitRgb: (r: number, g: number, b: number) => void;
  commitHsl: (h: number, s: number, l: number) => void;
  selectColor: (hex: string) => void;
  addRecent: (hex: string) => void;
  onChangeCallback?: (value: ColorValue) => void;
  hexToColorValue: typeof hexToColorValue;
  hslToColorValue: typeof hslToColorValue;
  rgbToColorValue: typeof rgbToColorValue;
}

const ColorPickerContext = createContext<ColorPickerContextValue | null>(null);

export interface ColorPickerProviderProps {
  children: React.ReactNode;
  value?: string;
  defaultValue?: string;
  size?: ColorPickerSize;
  variant?: ColorPickerVariant;
  disabled?: boolean;
  onChange?: (value: ColorValue) => void;
  onOpen?: () => void;
  onClose?: () => void;
}

export function ColorPickerProvider({
  children,
  value: controlledValue,
  defaultValue = initialHex,
  size = "md",
  variant = "default",
  disabled = false,
  onChange,
  onOpen,
  onClose,
}: ColorPickerProviderProps) {
  const startHex = controlledValue ?? defaultValue;
  const startCv = hexToColorValue(startHex);
  const startSp = hslToSpectrum(startCv.hsl.h, startCv.hsl.s, startCv.hsl.l);

  const [state, dispatch] = useReducer(reducer, {
    isOpen: false,
    value: startCv,
    activeView: "swatches",
    activeMode: "hex",
    recentColors: [],
    hue: startCv.hsl.h,
    saturation: startCv.hsl.s,
    lightness: startCv.hsl.l,
    alpha: 1,
    spectrumX: startSp.x,
    spectrumY: startSp.y,
    disabled,
    size,
    variant,
    ...buildInputs(startCv),
  });

  const anchorRef = useRef<HTMLDivElement>(null);

  const open = useCallback(() => {
    if (disabled) return;
    dispatch({ type: "OPEN" });
    onOpen?.();
  }, [disabled, onOpen]);

  const close = useCallback(() => {
    dispatch({ type: "CLOSE" });
    onClose?.();
  }, [onClose]);

  const toggle = useCallback(() => {
    if (disabled) return;
    if (state.isOpen) {
      dispatch({ type: "CLOSE" });
      onClose?.();
    } else {
      dispatch({ type: "OPEN" });
      onOpen?.();
    }
  }, [disabled, state.isOpen, onOpen, onClose]);

  const setView = useCallback(
    (view: ColorPickerView) => dispatch({ type: "SET_VIEW", payload: view }),
    [],
  );
  const setMode = useCallback(
    (mode: ColorMode) => dispatch({ type: "SET_MODE", payload: mode }),
    [],
  );
  const setHue = useCallback(
    (hue: number) => dispatch({ type: "SET_HUE", payload: hue }),
    [],
  );
  const setSpectrum = useCallback(
    (x: number, y: number) =>
      dispatch({ type: "SET_SPECTRUM", payload: { x, y } }),
    [],
  );
  const setAlpha = useCallback(
    (a: number) => dispatch({ type: "SET_ALPHA", payload: a }),
    [],
  );

  const commitHex = useCallback(
    (hex: string) => {
      const clean = hex.startsWith("#") ? hex : "#" + hex;
      if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(clean)) return;
      const cv = hexToColorValue(clean, state.alpha);
      dispatch({ type: "SET_VALUE", payload: cv });
      onChange?.(cv);
    },
    [state.alpha, onChange],
  );

  const commitRgb = useCallback(
    (r: number, g: number, b: number) => {
      const cv = rgbToColorValue(r, g, b, state.alpha);
      dispatch({ type: "SET_VALUE", payload: cv });
      onChange?.(cv);
    },
    [state.alpha, onChange],
  );

  const commitHsl = useCallback(
    (h: number, s: number, l: number) => {
      const cv = hslToColorValue(h, s, l, state.alpha);
      dispatch({ type: "SET_VALUE", payload: cv });
      onChange?.(cv);
    },
    [state.alpha, onChange],
  );

  const selectColor = useCallback(
    (hex: string) => {
      const cv = hexToColorValue(hex, state.alpha);
      dispatch({ type: "SET_VALUE", payload: cv });
      onChange?.(cv);
    },
    [state.alpha, onChange],
  );

  const addRecent = useCallback((hex: string) => {
    dispatch({ type: "ADD_RECENT", payload: { hex } });
  }, []);

  return (
    <ColorPickerContext.Provider
      value={{
        state,
        dispatch,
        anchorRef,
        open,
        close,
        toggle,
        setView,
        setMode,
        setHue,
        setSpectrum,
        setAlpha,
        commitHex,
        commitRgb,
        commitHsl,
        selectColor,
        addRecent,
        onChangeCallback: onChange,
        hexToColorValue,
        hslToColorValue,
        rgbToColorValue,
      }}
    >
      {children}
    </ColorPickerContext.Provider>
  );
}

export function useColorPickerContext(): ColorPickerContextValue {
  const ctx = useContext(ColorPickerContext);
  if (!ctx)
    throw new Error(
      "useColorPickerContext must be used within ColorPickerProvider",
    );
  return ctx;
}

export { spectrumToHsl, hslToSpectrum, hexToRgb, rgbToHex, hslToRgb, rgbToHsl };
