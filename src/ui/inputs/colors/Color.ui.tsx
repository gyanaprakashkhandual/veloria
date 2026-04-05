import React, {
  useEffect,
  useRef,
  useCallback,
  useState,
  useLayoutEffect,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, Pipette, RotateCcw } from "lucide-react";
import {
  ColorPickerProvider,
  useColorPickerContext,
  type ColorPickerProviderProps,
  type ColorPickerSize,
  type ColorPickerVariant,
  type ColorPickerView,
  type ColorMode,
  type ColorValue,
  spectrumToHsl,
  hslToColorValue,
  hexToColorValue,
  rgbToColorValue,
} from "./Color.context";

const sizeConfig = {
  sm: {
    panelWidth: 240,
    swatchSize: "w-5 h-5",
    swatchGrid: 10,
    triggerH: "h-7",
    triggerPx: "px-2",
    triggerText: "text-xs",
    triggerSwatch: "w-4 h-4",
    tabText: "text-[10px]",
    tabPx: "px-2",
    tabPy: "py-1",
    labelText: "text-[10px]",
    inputH: "h-6",
    inputText: "text-xs",
    inputPx: "px-1.5",
    sliderH: "h-3",
    spectrumH: 140,
    hueH: 10,
    alphaH: 10,
    panelPx: "px-2.5",
    panelPy: "py-2",
    sectionGap: "gap-2",
    btnText: "text-[10px]",
    btnPx: "px-2",
    btnPy: "py-1",
    recentSize: "w-5 h-5",
  },
  md: {
    panelWidth: 272,
    swatchSize: "w-6 h-6",
    swatchGrid: 10,
    triggerH: "h-8",
    triggerPx: "px-2.5",
    triggerText: "text-sm",
    triggerSwatch: "w-5 h-5",
    tabText: "text-xs",
    tabPx: "px-3",
    tabPy: "py-1.5",
    labelText: "text-xs",
    inputH: "h-7",
    inputText: "text-xs",
    inputPx: "px-2",
    sliderH: "h-3",
    spectrumH: 160,
    hueH: 12,
    alphaH: 12,
    panelPx: "px-3",
    panelPy: "py-2.5",
    sectionGap: "gap-2.5",
    btnText: "text-xs",
    btnPx: "px-2.5",
    btnPy: "py-1.5",
    recentSize: "w-6 h-6",
  },
  lg: {
    panelWidth: 304,
    swatchSize: "w-7 h-7",
    swatchGrid: 10,
    triggerH: "h-9",
    triggerPx: "px-3",
    triggerText: "text-sm",
    triggerSwatch: "w-6 h-6",
    tabText: "text-xs",
    tabPx: "px-3.5",
    tabPy: "py-2",
    labelText: "text-xs",
    inputH: "h-8",
    inputText: "text-sm",
    inputPx: "px-2.5",
    sliderH: "h-3.5",
    spectrumH: 180,
    hueH: 14,
    alphaH: 14,
    panelPx: "px-3.5",
    panelPy: "py-3",
    sectionGap: "gap-3",
    btnText: "text-sm",
    btnPx: "px-3",
    btnPy: "py-2",
    recentSize: "w-7 h-7",
  },
  xl: {
    panelWidth: 336,
    swatchSize: "w-8 h-8",
    swatchGrid: 10,
    triggerH: "h-10",
    triggerPx: "px-3.5",
    triggerText: "text-base",
    triggerSwatch: "w-7 h-7",
    tabText: "text-sm",
    tabPx: "px-4",
    tabPy: "py-2",
    labelText: "text-sm",
    inputH: "h-9",
    inputText: "text-sm",
    inputPx: "px-3",
    sliderH: "h-4",
    spectrumH: 200,
    hueH: 16,
    alphaH: 16,
    panelPx: "px-4",
    panelPy: "py-3.5",
    sectionGap: "gap-3.5",
    btnText: "text-sm",
    btnPx: "px-3.5",
    btnPy: "py-2.5",
    recentSize: "w-8 h-8",
  },
};

const variantTrigger: Record<ColorPickerVariant, string> = {
  default: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm",
  filled: "bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600",
  ghost: "bg-transparent border border-transparent hover:bg-gray-100 dark:hover:bg-gray-800",
  outline: "bg-transparent border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500",
};

const GOOGLE_DOC_PALETTE: { label: string; colors: string[] }[] = [
  {
    label: "Theme Colors",
    colors: [
      "#000000", "#ffffff", "#eeece1", "#1f497d", "#4f81bd", "#c0504d", "#9bbb59", "#8064a2", "#4bacc6", "#f79646",
      "#7f7f7f", "#bfbfbf", "#ddd9c3", "#c6d9f0", "#dbe5f1", "#f2dcdb", "#ebf1dd", "#e5e0ec", "#dbeef3", "#fdeada",
      "#595959", "#a5a5a5", "#c4bd97", "#8db3e2", "#b8cce4", "#e6b8b7", "#d7e3bc", "#ccc1d9", "#b7dde8", "#fbd5b5",
      "#3f3f3f", "#8c8c8c", "#938953", "#548dd4", "#95b3d7", "#d99694", "#c3d69b", "#b2a2c7", "#92cddc", "#fabf8f",
      "#262626", "#7f7f7f", "#494429", "#17375e", "#366092", "#953734", "#76923c", "#5f497a", "#31849b", "#e36c09",
    ],
  },
  {
    label: "Standard Colors",
    colors: [
      "#c00000", "#ff0000", "#ffc000", "#ffff00", "#92d050", "#00b050", "#00b0f0", "#0070c0", "#002060", "#7030a0",
    ],
  },
];

const RECENT_PLACEHOLDER: string[] = [];

function checkerBg() {
  return {
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Crect width='4' height='4' fill='%23ccc'/%3E%3Crect x='4' y='4' width='4' height='4' fill='%23ccc'/%3E%3Crect x='4' width='4' height='4' fill='%23fff'/%3E%3Crect y='4' width='4' height='4' fill='%23fff'/%3E%3C/svg%3E\")",
    backgroundSize: "8px 8px",
  };
}

interface SwatchProps {
  color: string;
  size: ColorPickerSize;
  active?: boolean;
  onClick: () => void;
  title?: string;
  className?: string;
}

function Swatch({ color, size, active, onClick, title, className = "" }: SwatchProps) {
  const s = sizeConfig[size];
  const isLight = (() => {
    try {
      const hex = color.replace("#", "");
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return (r * 299 + g * 587 + b * 114) / 1000 > 128;
    } catch { return false; }
  })();

  return (
    <button
      type="button"
      title={title ?? color}
      onClick={onClick}
      className={`
        relative ${s.swatchSize} rounded-sm transition-transform duration-100 hover:scale-110 hover:z-10
        border border-black/10 dark:border-white/10 shrink-0 flex items-center justify-center
        ${className}
      `}
      style={{ backgroundColor: color }}
    >
      {active && (
        <Check size={10} className={isLight ? "text-black/70" : "text-white/90"} strokeWidth={3} />
      )}
    </button>
  );
}

interface SliderProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (v: number) => void;
  gradient: string;
  size: ColorPickerSize;
  className?: string;
  thumbColor?: string;
  checkerboard?: boolean;
}

function Slider({ value, min = 0, max = 1, step = 0.001, onChange, gradient, size, className = "", thumbColor, checkerboard }: SliderProps) {
  const s = sizeConfig[size];
  const trackRef = useRef<HTMLDivElement>(null);

  const getVal = useCallback((clientX: number) => {
    if (!trackRef.current) return value;
    const rect = trackRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return min + pct * (max - min);
  }, [value, min, max]);

  const handlePointer = useCallback((e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    onChange(getVal(e.clientX));
  }, [getVal, onChange]);

  const handleMove = useCallback((e: React.PointerEvent) => {
    if (e.buttons !== 1) return;
    onChange(getVal(e.clientX));
  }, [getVal, onChange]);

  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div
      ref={trackRef}
      className={`relative rounded-full cursor-pointer ${s.sliderH} ${className}`}
      style={checkerboard ? { ...checkerBg(), backgroundSize: "8px 8px" } : {}}
      onPointerDown={handlePointer}
      onPointerMove={handleMove}
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{ background: gradient }}
      />
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-white shadow-md shadow-black/30 transition-none"
        style={{ left: `${pct}%`, backgroundColor: thumbColor ?? "#fff" }}
      />
    </div>
  );
}

interface SpectrumProps {
  size: ColorPickerSize;
}

function SpectrumPicker({ size }: SpectrumProps) {
  const { state, setSpectrum } = useColorPickerContext();
  const s = sizeConfig[size];
  const canvasRef = useRef<HTMLDivElement>(null);

  const getXY = useCallback((clientX: number, clientY: number): { x: number; y: number } => {
    if (!canvasRef.current) return { x: state.spectrumX, y: state.spectrumY };
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)),
      y: Math.max(0, Math.min(1, (clientY - rect.top) / rect.height)),
    };
  }, [state.spectrumX, state.spectrumY]);

  const handlePointer = useCallback((e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const { x, y } = getXY(e.clientX, e.clientY);
    setSpectrum(x, y);
  }, [getXY, setSpectrum]);

  const handleMove = useCallback((e: React.PointerEvent) => {
    if (e.buttons !== 1) return;
    const { x, y } = getXY(e.clientX, e.clientY);
    setSpectrum(x, y);
  }, [getXY, setSpectrum]);

  const hueColor = `hsl(${state.hue}, 100%, 50%)`;

  return (
    <div
      ref={canvasRef}
      className="relative w-full rounded-lg cursor-crosshair overflow-hidden select-none"
      style={{ height: s.spectrumH }}
      onPointerDown={handlePointer}
      onPointerMove={handleMove}
    >
      <div className="absolute inset-0" style={{ background: `linear-gradient(to right, #fff, ${hueColor})` }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent, #000)" }} />
      <div
        className="absolute w-4 h-4 rounded-full border-2 border-white shadow-md shadow-black/40 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          left: `${state.spectrumX * 100}%`,
          top: `${state.spectrumY * 100}%`,
          backgroundColor: state.value.hex,
        }}
      />
    </div>
  );
}

function HueSlider({ size }: { size: ColorPickerSize }) {
  const { state, setHue } = useColorPickerContext();
  const s = sizeConfig[size];
  const trackRef = useRef<HTMLDivElement>(null);

  const getHue = useCallback((clientX: number) => {
    if (!trackRef.current) return state.hue;
    const rect = trackRef.current.getBoundingClientRect();
    return Math.max(0, Math.min(360, ((clientX - rect.left) / rect.width) * 360));
  }, [state.hue]);

  const handlePointer = useCallback((e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setHue(getHue(e.clientX));
  }, [getHue, setHue]);

  const handleMove = useCallback((e: React.PointerEvent) => {
    if (e.buttons !== 1) return;
    setHue(getHue(e.clientX));
  }, [getHue, setHue]);

  return (
    <div
      ref={trackRef}
      className={`relative w-full rounded-full cursor-pointer select-none ${s.sliderH}`}
      style={{
        background: "linear-gradient(to right,#f00 0%,#ff0 17%,#0f0 33%,#0ff 50%,#00f 67%,#f0f 83%,#f00 100%)",
      }}
      onPointerDown={handlePointer}
      onPointerMove={handleMove}
    >
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-white shadow-md shadow-black/30"
        style={{ left: `${(state.hue / 360) * 100}%`, backgroundColor: `hsl(${state.hue},100%,50%)` }}
      />
    </div>
  );
}

function AlphaSlider({ size }: { size: ColorPickerSize }) {
  const { state, setAlpha } = useColorPickerContext();
  const s = sizeConfig[size];
  const trackRef = useRef<HTMLDivElement>(null);

  const getAlpha = useCallback((clientX: number) => {
    if (!trackRef.current) return state.alpha;
    const rect = trackRef.current.getBoundingClientRect();
    return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  }, [state.alpha]);

  const handlePointer = useCallback((e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setAlpha(getAlpha(e.clientX));
  }, [getAlpha, setAlpha]);

  const handleMove = useCallback((e: React.PointerEvent) => {
    if (e.buttons !== 1) return;
    setAlpha(getAlpha(e.clientX));
  }, [getAlpha, setAlpha]);

  const hex = state.value.hex;
  const grad = `linear-gradient(to right, transparent, ${hex})`;

  return (
    <div
      ref={trackRef}
      className={`relative w-full rounded-full cursor-pointer select-none ${s.sliderH}`}
      style={{ ...checkerBg() }}
      onPointerDown={handlePointer}
      onPointerMove={handleMove}
    >
      <div className="absolute inset-0 rounded-full" style={{ background: grad }} />
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-white shadow-md shadow-black/30"
        style={{
          left: `${state.alpha * 100}%`,
          backgroundColor: `rgba(${state.value.rgb.r},${state.value.rgb.g},${state.value.rgb.b},${state.alpha})`,
        }}
      />
    </div>
  );
}

function ColorInputs({ size }: { size: ColorPickerSize }) {
  const { state, setMode, commitHex, commitRgb, commitHsl, dispatch } = useColorPickerContext();
  const s = sizeConfig[size];
  const modes: ColorMode[] = ["hex", "rgb", "hsl"];

  const handleHexBlur = () => commitHex(state.inputHex);
  const handleHexKey = (e: React.KeyboardEvent) => { if (e.key === "Enter") commitHex(state.inputHex); };

  const handleRgbBlur = () => {
    const r = Math.max(0, Math.min(255, parseInt(state.inputR) || 0));
    const g = Math.max(0, Math.min(255, parseInt(state.inputG) || 0));
    const b = Math.max(0, Math.min(255, parseInt(state.inputB) || 0));
    commitRgb(r, g, b);
  };

  const handleHslBlur = () => {
    const h = Math.max(0, Math.min(360, parseInt(state.inputH) || 0));
    const s2 = Math.max(0, Math.min(100, parseInt(state.inputS) || 0));
    const l = Math.max(0, Math.min(100, parseInt(state.inputL) || 0));
    commitHsl(h, s2, l);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5">
        {state.activeMode === "hex" && (
          <div className="flex-1 flex items-center gap-1">
            <div className="flex-1 relative">
              <span className={`absolute left-2 top-1/2 -translate-y-1/2 ${s.inputText} text-gray-400 dark:text-gray-500 pointer-events-none`}>#</span>
              <input
                value={state.inputHex.replace("#", "")}
                onChange={(e) => dispatch({ type: "SET_INPUT_HEX", payload: "#" + e.target.value })}
                onBlur={handleHexBlur}
                onKeyDown={handleHexKey}
                maxLength={6}
                className={`w-full ${s.inputH} ${s.inputText} pl-5 ${s.inputPx} rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none focus:border-gray-400 dark:focus:border-gray-500 transition-colors font-mono uppercase`}
              />
            </div>
            <div className="w-16 relative">
              <input
                value={state.inputA}
                onChange={(e) => dispatch({ type: "SET_INPUT_A", payload: e.target.value })}
                onBlur={() => {
                  const a = Math.max(0, Math.min(100, parseInt(state.inputA) || 0)) / 100;
                  dispatch({ type: "SET_ALPHA", payload: a } as any);
                }}
                maxLength={3}
                className={`w-full ${s.inputH} ${s.inputText} ${s.inputPx} pr-5 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none focus:border-gray-400 dark:focus:border-gray-500 transition-colors font-mono text-center`}
              />
              <span className={`absolute right-1.5 top-1/2 -translate-y-1/2 ${s.inputText} text-gray-400 dark:text-gray-500 pointer-events-none`}>%</span>
            </div>
          </div>
        )}

        {state.activeMode === "rgb" && (
          <div className="flex-1 flex items-center gap-1">
            {[
              { label: "R", val: state.inputR, key: "r" as const },
              { label: "G", val: state.inputG, key: "g" as const },
              { label: "B", val: state.inputB, key: "b" as const },
            ].map(({ label, val, key }) => (
              <div key={key} className="flex-1 relative">
                <input
                  value={val}
                  onChange={(e) => dispatch({ type: "SET_INPUT_RGB", payload: { [key]: e.target.value } })}
                  onBlur={handleRgbBlur}
                  onKeyDown={(e) => { if (e.key === "Enter") handleRgbBlur(); }}
                  maxLength={3}
                  className={`w-full ${s.inputH} ${s.inputText} ${s.inputPx} pt-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none focus:border-gray-400 dark:focus:border-gray-500 transition-colors font-mono text-center`}
                />
                <span className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 text-[9px] text-gray-400 dark:text-gray-600 font-medium leading-none pointer-events-none`}>{label}</span>
              </div>
            ))}
          </div>
        )}

        {state.activeMode === "hsl" && (
          <div className="flex-1 flex items-center gap-1">
            {[
              { label: "H", val: state.inputH, key: "h" as const, max: 360 },
              { label: "S", val: state.inputS, key: "s" as const, max: 100 },
              { label: "L", val: state.inputL, key: "l" as const, max: 100 },
            ].map(({ label, val, key }) => (
              <div key={key} className="flex-1 relative">
                <input
                  value={val}
                  onChange={(e) => dispatch({ type: "SET_INPUT_HSL", payload: { [key]: e.target.value } })}
                  onBlur={handleHslBlur}
                  onKeyDown={(e) => { if (e.key === "Enter") handleHslBlur(); }}
                  maxLength={3}
                  className={`w-full ${s.inputH} ${s.inputText} ${s.inputPx} pt-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none focus:border-gray-400 dark:focus:border-gray-500 transition-colors font-mono text-center`}
                />
                <span className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 text-[9px] text-gray-400 dark:text-gray-600 font-medium leading-none pointer-events-none`}>{label}</span>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            const idx = modes.indexOf(state.activeMode);
            setMode(modes[(idx + 1) % modes.length]);
          }}
          className={`shrink-0 ${s.inputH} px-1.5 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${s.inputText} font-medium uppercase`}
        >
          {state.activeMode}
        </button>
      </div>
    </div>
  );
}

function SwatchesView({ size }: { size: ColorPickerSize }) {
  const { state, selectColor, addRecent } = useColorPickerContext();
  const s = sizeConfig[size];

  const handleSelect = (hex: string) => {
    selectColor(hex);
    addRecent(hex);
  };

  return (
    <div className={`flex flex-col ${s.sectionGap}`}>
      {GOOGLE_DOC_PALETTE.map((group) => (
        <div key={group.label}>
          <p className={`${s.labelText} font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1.5`}>
            {group.label}
          </p>
          <div className="flex flex-wrap gap-0.5">
            {group.colors.map((c) => (
              <Swatch
                key={c}
                color={c}
                size={size}
                active={state.value.hex === c.toLowerCase()}
                onClick={() => handleSelect(c)}
              />
            ))}
          </div>
        </div>
      ))}

      {state.recentColors.length > 0 && (
        <div>
          <p className={`${s.labelText} font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1.5`}>
            Recent
          </p>
          <div className="flex flex-wrap gap-0.5">
            {state.recentColors.map((rc) => (
              <Swatch
                key={rc.hex}
                color={rc.hex}
                size={size}
                active={state.value.hex === rc.hex}
                onClick={() => handleSelect(rc.hex)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SpectrumView({ size }: { size: ColorPickerSize }) {
  const { state, setHue, setAlpha, selectColor, addRecent } = useColorPickerContext();
  const s = sizeConfig[size];

  return (
    <div className={`flex flex-col ${s.sectionGap}`}>
      <SpectrumPicker size={size} />
      <HueSlider size={size} />
      <AlphaSlider size={size} />
      <ColorInputs size={size} />
    </div>
  );
}

function CustomView({ size }: { size: ColorPickerSize }) {
  const { state, selectColor, addRecent, dispatch } = useColorPickerContext();
  const s = sizeConfig[size];
  const [customHex, setCustomHex] = useState(state.value.hex);

  return (
    <div className={`flex flex-col ${s.sectionGap}`}>
      <div>
        <label className={`${s.labelText} font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-1.5`}>
          Custom Color
        </label>
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 shrink-0"
            style={{ backgroundColor: customHex }}
          />
          <input
            type="color"
            value={customHex}
            onChange={(e) => {
              setCustomHex(e.target.value);
              selectColor(e.target.value);
            }}
            className="flex-1 h-8 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer"
          />
        </div>
      </div>

      <div>
        <label className={`${s.labelText} font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-1.5`}>
          Hex
        </label>
        <div className="flex items-center gap-2">
          <span className={`${s.inputText} text-gray-400 dark:text-gray-500`}>#</span>
          <input
            value={customHex.replace("#", "").toUpperCase()}
            onChange={(e) => {
              const v = "#" + e.target.value.replace(/[^0-9a-fA-F]/g, "").slice(0, 6);
              setCustomHex(v);
              if (v.length === 7) selectColor(v);
            }}
            maxLength={6}
            className={`flex-1 ${s.inputH} ${s.inputText} ${s.inputPx} rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none focus:border-gray-400 dark:focus:border-gray-500 transition-colors font-mono uppercase`}
          />
          <button
            type="button"
            onClick={() => { selectColor(customHex); addRecent(customHex); }}
            className={`${s.btnPx} ${s.btnPy} ${s.btnText} font-medium rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors`}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

type ResolvedPanelAlign = "bottom-left" | "bottom-right" | "top-left" | "top-right";

function usePanelAlign(
  open: boolean,
  anchorRef: React.RefObject<HTMLElement | null>,
  panelWidth: number,
): ResolvedPanelAlign {
  const [align, setAlign] = useState<ResolvedPanelAlign>("bottom-left");

  useLayoutEffect(() => {
    if (!open || !anchorRef.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceRight = window.innerWidth - rect.left;
    const vert = spaceBelow >= 320 ? "bottom" : "top";
    const horiz = spaceRight >= panelWidth ? "left" : "right";
    setAlign(`${vert}-${horiz}` as ResolvedPanelAlign);
  }, [open, anchorRef, panelWidth]);

  return align;
}

function alignToStyle(align: ResolvedPanelAlign): React.CSSProperties {
  const base: React.CSSProperties = { position: "absolute", zIndex: 50 };
  if (align === "bottom-left") return { ...base, top: "100%", left: 0, marginTop: 6 };
  if (align === "bottom-right") return { ...base, top: "100%", right: 0, marginTop: 6 };
  if (align === "top-left") return { ...base, bottom: "100%", left: 0, marginBottom: 6 };
  return { ...base, bottom: "100%", right: 0, marginBottom: 6 };
}

const views: { id: ColorPickerView; label: string }[] = [
  { id: "swatches", label: "Swatches" },
  { id: "spectrum", label: "Spectrum" },
  { id: "custom", label: "Custom" },
];

function ColorPanel({ size, panelClassName = "" }: { size: ColorPickerSize; panelClassName?: string }) {
  const { state, setView, selectColor, addRecent, close } = useColorPickerContext();
  const s = sizeConfig[size];

  const { r, g, b, a } = state.value.rgb;
  const previewBg = `rgba(${r},${g},${b},${a})`;

  return (
    <div
      className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl shadow-black/10 dark:shadow-black/50 overflow-hidden ${panelClassName}`}
      style={{ width: s.panelWidth }}
    >
      <div className={`${s.panelPx} pt-2.5 pb-0`}>
        <div className="flex items-center gap-0.5 border-b border-gray-100 dark:border-gray-800 mb-0">
          {views.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setView(v.id)}
              className={`
                ${s.tabPx} ${s.tabPy} ${s.tabText} font-medium rounded-t-lg transition-colors duration-100
                ${state.activeView === v.id
                  ? "text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 border-b-2 border-gray-900 dark:border-white"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                }
              `}
            >
              {v.label}
            </button>
          ))}

          <div className="ml-auto flex items-center gap-1.5 pb-1">
            <div className="flex items-center gap-1">
              <div className="w-6 h-6 rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden" style={checkerBg()}>
                <div className="w-full h-full rounded-md" style={{ backgroundColor: previewBg }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`${s.panelPx} ${s.panelPy}`}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={state.activeView}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
          >
            {state.activeView === "swatches" && <SwatchesView size={size} />}
            {state.activeView === "spectrum" && <SpectrumView size={size} />}
            {state.activeView === "custom" && <CustomView size={size} />}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className={`${s.panelPx} pb-2.5 border-t border-gray-100 dark:border-gray-800 pt-2 flex items-center justify-between gap-2`}>
        <button
          type="button"
          onClick={() => { selectColor("#000000"); }}
          className={`inline-flex items-center gap-1 ${s.btnPx} ${s.btnPy} ${s.btnText} font-medium rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200 transition-colors`}
        >
          <RotateCcw size={11} />
          Reset
        </button>
        <button
          type="button"
          onClick={() => { addRecent(state.value.hex); close(); }}
          className={`inline-flex items-center gap-1 ${s.btnPx} ${s.btnPy} ${s.btnText} font-medium rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors`}
        >
          <Check size={11} />
          Apply
        </button>
      </div>
    </div>
  );
}

export interface ColorPickerTriggerProps {
  size?: ColorPickerSize;
  variant?: ColorPickerVariant;
  showLabel?: boolean;
  showHex?: boolean;
  showArrow?: boolean;
  label?: string;
  className?: string;
  swatchClassName?: string;
}

export function ColorPickerTrigger({
  size = "md",
  variant = "default",
  showLabel = false,
  showHex = true,
  showArrow = true,
  label,
  className = "",
  swatchClassName = "",
}: ColorPickerTriggerProps) {
  const { state, toggle } = useColorPickerContext();
  const s = sizeConfig[size];
  const { r, g, b, a } = state.value.rgb;
  const previewBg = `rgba(${r},${g},${b},${a})`;

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={state.disabled}
      className={`
        inline-flex items-center gap-2 ${s.triggerH} ${s.triggerPx} rounded-lg
        font-medium transition-colors duration-100
        text-gray-700 dark:text-gray-200
        ${state.disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${variantTrigger[variant]}
        ${className}
      `}
    >
      <div
        className={`${s.triggerSwatch} rounded-md border border-black/10 dark:border-white/10 shrink-0 overflow-hidden ${swatchClassName}`}
        style={checkerBg()}
      >
        <div className="w-full h-full" style={{ backgroundColor: previewBg }} />
      </div>
      {(showLabel || label) && (
        <span className={`${s.triggerText} shrink-0`}>{label ?? "Color"}</span>
      )}
      {showHex && (
        <span className={`${s.triggerText} font-mono text-gray-500 dark:text-gray-400 uppercase`}>
          {state.value.hex}
        </span>
      )}
      {showArrow && (
        <ChevronDown size={12} className={`shrink-0 text-gray-400 dark:text-gray-500 transition-transform duration-150 ${state.isOpen ? "rotate-180" : ""}`} />
      )}
    </button>
  );
}

export interface ColorPickerInlineProps {
  size?: ColorPickerSize;
  panelClassName?: string;
}

export function ColorPickerInline({ size = "md", panelClassName = "" }: ColorPickerInlineProps) {
  return <ColorPanel size={size} panelClassName={panelClassName} />;
}

export interface ColorPickerProps {
  value?: string;
  defaultValue?: string;
  size?: ColorPickerSize;
  variant?: ColorPickerVariant;
  disabled?: boolean;
  showLabel?: boolean;
  showHex?: boolean;
  showArrow?: boolean;
  label?: string;
  onChange?: (value: ColorValue) => void;
  onOpen?: () => void;
  onClose?: () => void;
  className?: string;
  triggerClassName?: string;
  panelClassName?: string;
  swatchClassName?: string;
  trigger?: React.ReactNode;
}

function ColorPickerInner({
  size = "md",
  variant = "default",
  showLabel = false,
  showHex = true,
  showArrow = true,
  label,
  className = "",
  triggerClassName = "",
  panelClassName = "",
  swatchClassName = "",
  trigger,
}: Omit<ColorPickerProps, keyof ColorPickerProviderProps>) {
  const { state, toggle, close, anchorRef } = useColorPickerContext();
  const s = sizeConfig[size];
  const wrapRef = useRef<HTMLDivElement>(null);
  const align = usePanelAlign(
    state.isOpen,
    anchorRef as React.RefObject<HTMLElement | null>,
    s.panelWidth,
  );

  useEffect(() => {
    if (!state.isOpen) return;
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) close();
    };
    const keyHandler = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", keyHandler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", keyHandler);
    };
  }, [state.isOpen, close]);

  return (
    <div ref={wrapRef} className={`relative inline-block ${className}`}>
      <div ref={anchorRef as React.RefObject<HTMLDivElement>}>
        {trigger ? (
          <div onClick={state.disabled ? undefined : toggle} className={state.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}>
            {trigger}
          </div>
        ) : (
          <ColorPickerTrigger
            size={size}
            variant={variant}
            showLabel={showLabel}
            showHex={showHex}
            showArrow={showArrow}
            label={label}
            className={triggerClassName}
            swatchClassName={swatchClassName}
          />
        )}
      </div>

      <AnimatePresence>
        {state.isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -4 }}
            transition={{ duration: 0.13, ease: "easeOut" }}
            style={alignToStyle(align)}
          >
            <ColorPanel size={size} panelClassName={panelClassName} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ColorPicker({
  value,
  defaultValue,
  size = "md",
  variant = "default",
  disabled = false,
  onChange,
  onOpen,
  onClose,
  ...rest
}: ColorPickerProps) {
  return (
    <ColorPickerProvider
      value={value}
      defaultValue={defaultValue}
      size={size}
      variant={variant}
      disabled={disabled}
      onChange={onChange}
      onOpen={onOpen}
      onClose={onClose}
    >
      <ColorPickerInner size={size} variant={variant} {...rest} />
    </ColorPickerProvider>
  );
}

export { ColorPickerProvider, useColorPickerContext };
export type { ColorPickerSize, ColorPickerVariant, ColorMode, ColorPickerView, ColorValue };