import React, { useState } from "react";
import {
  ColorPicker,
  ColorPickerInline,
  ColorPickerProvider,
  useColorPickerContext,
  type ColorPickerSize,
  type ColorPickerVariant,
  type ColorMode,
  type ColorPickerView,
  type ColorValue,
} from "../../../ui/inputs/colors/Color.ui";

// ─── Helper Components ──────────────────────────────────────────────────────

function VariantShowcase() {
  const [selectedColors, setSelectedColors] = useState({
    default: "#3b82f6",
    filled: "#3b82f6",
    ghost: "#3b82f6",
    outline: "#3b82f6",
  });

  const variants: ColorPickerVariant[] = ["default", "filled", "ghost", "outline"];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {variants.map((variant) => (
        <div key={variant} className="space-y-3 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-700 capitalize">{variant}</h4>
          <ColorPicker
            variant={variant}
            value={selectedColors[variant]}
            onChange={(cv) => setSelectedColors((prev) => ({ ...prev, [variant]: cv.hex }))}
            showLabel
            label={variant}
          />
          <p className="text-xs text-gray-500 font-mono">{selectedColors[variant]}</p>
        </div>
      ))}
    </div>
  );
}

function SizeShowcase() {
  const sizes: ColorPickerSize[] = ["sm", "md", "lg", "xl"];
  const [values, setValues] = useState<Record<ColorPickerSize, string>>({
    sm: "#3b82f6",
    md: "#3b82f6",
    lg: "#3b82f6",
    xl: "#3b82f6",
  });

  return (
    <div className="space-y-6">
      {sizes.map((size) => (
        <div key={size} className="flex items-center gap-6 p-4 bg-gray-50 rounded-lg">
          <div className="w-16 text-sm font-medium text-gray-600 capitalize">{size}</div>
          <div className="flex-1">
            <ColorPicker
              size={size}
              value={values[size]}
              onChange={(cv) => setValues((prev) => ({ ...prev, [size]: cv.hex }))}
              showHex
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function TriggerCustomizationShowcase() {
  const [color, setColor] = useState("#3b82f6");

  return (
    <div className="space-y-6">
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">With Label Only</h4>
        <ColorPicker
          value={color}
          onChange={(cv) => setColor(cv.hex)}
          showLabel
          label="Pick a color"
          showHex={false}
          showArrow={false}
        />
      </div>

      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">With Hex Only</h4>
        <ColorPicker
          value={color}
          onChange={(cv) => setColor(cv.hex)}
          showLabel={false}
          showHex
          showArrow={false}
        />
      </div>

      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">With Arrow Only</h4>
        <ColorPicker
          value={color}
          onChange={(cv) => setColor(cv.hex)}
          showLabel={false}
          showHex={false}
          showArrow
        />
      </div>

      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Custom Trigger</h4>
        <ColorPicker
          value={color}
          onChange={(cv) => setColor(cv.hex)}
          trigger={
            <div className="flex items-center gap-3 cursor-pointer group">
              <div
                className="w-10 h-10 rounded-full border-2 border-gray-300 shadow-md transition-transform group-hover:scale-105"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm font-medium text-gray-700">Custom Trigger</span>
            </div>
          }
        />
      </div>
    </div>
  );
}

function InlinePickerShowcase() {
  const [color, setColor] = useState("#3b82f6");

  return (
    <div className="space-y-4">
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Inline Color Picker</h4>
        <ColorPickerInline
          value={color}
          onChange={(cv) => setColor(cv.hex)}
          size="md"
        />
      </div>
      <div className="bg-gray-100 rounded-lg p-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg border border-gray-300" style={{ backgroundColor: color }} />
        <span className="text-sm font-mono">{color}</span>
        <span className="text-xs text-gray-500">Selected color updates in real-time</span>
      </div>
    </div>
  );
}

function ViewShowcase() {
  const [activeView, setActiveView] = useState<ColorPickerView>("swatches");
  const [color, setColor] = useState("#3b82f6");

  return (
    <div className="space-y-4">
      <div className="flex gap-3 mb-4">
        {(["swatches", "spectrum", "custom"] as ColorPickerView[]).map((view) => (
          <button
            key={view}
            onClick={() => setActiveView(view)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeView === view
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </button>
        ))}
      </div>
      <div className="p-4 bg-gray-50 rounded-lg">
        <ColorPickerProvider value={color} onChange={(cv) => setColor(cv.hex)}>
          <div className="inline-block">
            <ColorPickerInline size="md" />
          </div>
        </ColorPickerProvider>
      </div>
      <div className="text-sm text-gray-600">
        Currently viewing: <span className="font-semibold">{activeView}</span> view
      </div>
    </div>
  );
}

function DisabledShowcase() {
  const [color, setColor] = useState("#3b82f6");

  return (
    <div className="space-y-6">
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Disabled Picker</h4>
        <ColorPicker
          value={color}
          onChange={setColor}
          disabled
          showLabel
          label="Disabled Color Picker"
        />
        <p className="text-xs text-gray-400 mt-2">This color picker cannot be interacted with</p>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Disabled with Custom Trigger</h4>
        <ColorPicker
          value={color}
          onChange={setColor}
          disabled
          trigger={
            <div className="flex items-center gap-3 opacity-50">
              <div className="w-8 h-8 rounded-md border border-gray-300" style={{ backgroundColor: color }} />
              <span className="text-sm text-gray-500">Disabled Picker</span>
            </div>
          }
        />
      </div>
    </div>
  );
}

function ControlledPickerShowcase() {
  const [controlledColor, setControlledColor] = useState("#3b82f6");
  const [lastChange, setLastChange] = useState<string>("");

  const presets = [
    { name: "Blue", hex: "#3b82f6" },
    { name: "Red", hex: "#ef4444" },
    { name: "Green", hex: "#22c55e" },
    { name: "Purple", hex: "#a855f7" },
    { name: "Orange", hex: "#f97316" },
    { name: "Pink", hex: "#ec4899" },
  ];

  return (
    <div className="space-y-4">
      <div className="p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700">Controlled Component</p>
        <p className="text-xs text-blue-600 mt-1">Value is managed by React state</p>
      </div>

      <div className="flex flex-wrap gap-3">
        {presets.map((preset) => (
          <button
            key={preset.hex}
            onClick={() => {
              setControlledColor(preset.hex);
              setLastChange(`Set to ${preset.name} (${preset.hex})`);
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            style={{ backgroundColor: preset.hex, color: "#fff" }}
          >
            {preset.name}
          </button>
        ))}
      </div>

      <ColorPicker
        value={controlledColor}
        onChange={(cv) => {
          setControlledColor(cv.hex);
          setLastChange(`Changed to ${cv.hex}`);
        }}
        showLabel
        label="Controlled Color Picker"
        showHex
      />

      {lastChange && (
        <div className="text-xs text-gray-500 bg-gray-100 rounded-lg p-2">
          Last action: {lastChange}
        </div>
      )}
    </div>
  );
}

function CallbackShowcase() {
  const [color, setColor] = useState("#3b82f6");
  const [openState, setOpenState] = useState(false);
  const [changeLog, setChangeLog] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setChangeLog((prev) => [msg, ...prev].slice(0, 5));
  };

  return (
    <div className="space-y-4">
      <ColorPicker
        value={color}
        onChange={(cv) => {
          setColor(cv.hex);
          addLog(`onChange: ${cv.hex}`);
        }}
        onOpen={() => {
          setOpenState(true);
          addLog("onOpen: Picker opened");
        }}
        onClose={() => {
          setOpenState(false);
          addLog("onClose: Picker closed");
        }}
        showLabel
        label="Picker with Callbacks"
      />

      <div className="bg-gray-100 rounded-lg p-3">
        <p className="text-xs font-semibold text-gray-600 mb-2">Callback Log:</p>
        <div className="space-y-1">
          {changeLog.map((log, i) => (
            <p key={i} className="text-xs font-mono text-gray-500">{log}</p>
          ))}
          {changeLog.length === 0 && (
            <p className="text-xs text-gray-400">No events yet. Interact with the picker above.</p>
          )}
        </div>
      </div>

      <div className="text-xs text-gray-500">
        Picker is currently: <span className="font-semibold">{openState ? "OPEN" : "CLOSED"}</span>
      </div>
    </div>
  );
}

function RealWorldShowcase() {
  const [primaryColor, setPrimaryColor] = useState("#3b82f6");
  const [secondaryColor, setSecondaryColor] = useState("#10b981");
  const [accentColor, setAccentColor] = useState("#8b5cf6");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");

  const getContrastColor = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? "#000000" : "#ffffff";
  };

  const primaryContrast = getContrastColor(primaryColor);
  const secondaryContrast = getContrastColor(secondaryColor);
  const accentContrast = getContrastColor(accentColor);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-700">Theme Colors</h4>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1">Primary Color</label>
              <ColorPicker
                value={primaryColor}
                onChange={(cv) => setPrimaryColor(cv.hex)}
                size="sm"
                showHex
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Secondary Color</label>
              <ColorPicker
                value={secondaryColor}
                onChange={(cv) => setSecondaryColor(cv.hex)}
                size="sm"
                showHex
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Accent Color</label>
              <ColorPicker
                value={accentColor}
                onChange={(cv) => setAccentColor(cv.hex)}
                size="sm"
                showHex
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Background Color</label>
              <ColorPicker
                value={backgroundColor}
                onChange={(cv) => setBackgroundColor(cv.hex)}
                size="sm"
                showHex
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 p-4 rounded-lg" style={{ backgroundColor: backgroundColor }}>
          <h4 className="text-sm font-semibold" style={{ color: primaryColor }}>Theme Preview</h4>
          <div className="space-y-3">
            <button
              className="w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ backgroundColor: primaryColor, color: primaryContrast }}
            >
              Primary Button
            </button>
            <button
              className="w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ backgroundColor: secondaryColor, color: secondaryContrast }}
            >
              Secondary Button
            </button>
            <div className="flex gap-2">
              <span
                className="px-2 py-1 rounded-full text-xs font-medium"
                style={{ backgroundColor: accentColor, color: accentContrast }}
              >
                Accent Badge
              </span>
              <span className="text-xs" style={{ color: primaryColor }}>
                Colored Text
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AlphaTransparencyShowcase() {
  const [color, setColor] = useState("#3b82f6");

  return (
    <div className="space-y-6">
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Color Picker with Alpha Channel</h4>
        <p className="text-xs text-gray-500 mb-4">
          Use the Spectrum view to access the alpha slider for transparency
        </p>
        <ColorPicker
          value={color}
          onChange={(cv) => setColor(cv.hex)}
          showLabel
          label="Transparent Color"
          showHex
        />
      </div>

      <div className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-lg p-4">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg p-4">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            The color picker supports alpha transparency. Try selecting a color with transparency
            in the Spectrum view using the alpha slider at the bottom.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Props Table ──────────────────────────────────────────────────────────────

function PropsTable() {
  return (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 overflow-x-auto">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Component Props</h3>

      <h4 className="text-md font-semibold text-gray-700 mb-2 mt-4">ColorPicker Props</h4>
      <table className="w-full text-sm mb-6">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-2 px-3 font-semibold text-gray-700">Prop</th>
            <th className="text-left py-2 px-3 font-semibold text-gray-700">Type</th>
            <th className="text-left py-2 px-3 font-semibold text-gray-700">Default</th>
            <th className="text-left py-2 px-3 font-semibold text-gray-700">Description</th>
           </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          <tr><td className="py-2 px-3 font-mono">value</td><td className="py-2 px-3">string</td><td className="py-2 px-3">-</td><td className="py-2 px-3">Controlled hex color value</td></tr>
          <tr><td className="py-2 px-3 font-mono">defaultValue</td><td className="py-2 px-3">string</td><td className="py-2 px-3">#3b82f6</td><td className="py-2 px-3">Uncontrolled initial color</td></tr>
          <tr><td className="py-2 px-3 font-mono">size</td><td className="py-2 px-3">sm | md | lg | xl</td><td className="py-2 px-3">md</td><td className="py-2 px-3">Controls picker dimensions</td></tr>
          <tr><td className="py-2 px-3 font-mono">variant</td><td className="py-2 px-3">default | filled | ghost | outline</td><td className="py-2 px-3">default</td><td className="py-2 px-3">Visual style of the trigger</td></tr>
          <tr><td className="py-2 px-3 font-mono">disabled</td><td className="py-2 px-3">boolean</td><td className="py-2 px-3">false</td><td className="py-2 px-3">Disables the color picker</td></tr>
          <tr><td className="py-2 px-3 font-mono">showLabel</td><td className="py-2 px-3">boolean</td><td className="py-2 px-3">false</td><td className="py-2 px-3">Show label text on trigger</td></tr>
          <tr><td className="py-2 px-3 font-mono">showHex</td><td className="py-2 px-3">boolean</td><td className="py-2 px-3">true</td><td className="py-2 px-3">Show hex value on trigger</td></tr>
          <tr><td className="py-2 px-3 font-mono">showArrow</td><td className="py-2 px-3">boolean</td><td className="py-2 px-3">true</td><td className="py-2 px-3">Show dropdown arrow</td></tr>
          <tr><td className="py-2 px-3 font-mono">label</td><td className="py-2 px-3">string</td><td className="py-2 px-3">Color</td><td className="py-2 px-3">Label text when showLabel is true</td></tr>
          <tr><td className="py-2 px-3 font-mono">trigger</td><td className="py-2 px-3">ReactNode</td><td className="py-2 px-3">-</td><td className="py-2 px-3">Custom trigger element</td></tr>
          <tr><td className="py-2 px-3 font-mono">onChange</td><td className="py-2 px-3">(value) = void</td><td className="py-2 px-3">-</td><td className="py-2 px-3">Callback when color changes</td></tr>
          <tr><td className="py-2 px-3 font-mono">onOpen / onClose</td><td className="py-2 px-3">() = void</td><td className="py-2 px-3">-</td><td className="py-2 px-3">Picker open/close callbacks</td></tr>
        </tbody>
      </table>

      <h4 className="text-md font-semibold text-gray-700 mb-2">ColorPicker Views</h4>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-2 px-3 font-semibold text-gray-700">View</th>
            <th className="text-left py-2 px-3 font-semibold text-gray-700">Description</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          <tr><td className="py-2 px-3 font-mono">swatches</td><td className="py-2 px-3">Predefined color palette from Google Docs</td></tr>
          <tr><td className="py-2 px-3 font-mono">spectrum</td><td className="py-2 px-3">Full color spectrum with hue, saturation, lightness, and alpha controls</td></tr>
          <tr><td className="py-2 px-3 font-mono">custom</td><td className="py-2 px-3">Custom color input with hex field and native color picker</td></tr>
        </tbody>
      </table>
    </div>
  );
}

// ─── Main Showcase Page ──────────────────────────────────────────────────────

export default function ColorPickerShowcase() {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Color Picker Component</h1>
          <p className="text-gray-500 mt-1">
            A comprehensive showcase of all color picker variants, sizes, views, and features
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Variants Showcase */}
        <section className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Variants</h2>
          <VariantShowcase />
        </section>

        {/* Sizes Showcase */}
        <section className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Sizes</h2>
          <SizeShowcase />
        </section>

        {/* Trigger Customization */}
        <section className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Trigger Customization</h2>
          <TriggerCustomizationShowcase />
        </section>

        {/* Inline Picker */}
        <section className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Inline Picker</h2>
          <InlinePickerShowcase />
        </section>

        {/* Views */}
        <section className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Picker Views</h2>
          <ViewShowcase />
        </section>

        {/* Disabled State */}
        <section className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Disabled State</h2>
          <DisabledShowcase />
        </section>

        {/* Controlled vs Uncontrolled */}
        <section className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Controlled Component</h2>
          <ControlledPickerShowcase />
        </section>

        {/* Callbacks */}
        <section className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Callbacks</h2>
          <CallbackShowcase />
        </section>

        {/* Alpha Transparency */}
        <section className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Alpha Channel (Transparency)</h2>
          <AlphaTransparencyShowcase />
        </section>

        {/* Real World Example */}
        <section className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Real World Example</h2>
          <RealWorldShowcase />
        </section>

        {/* Props Table */}
        <PropsTable />

        {/* Footer */}
        <div className="text-center text-sm text-gray-400 py-6 border-t border-gray-100">
          Color Picker System — Supports multiple variants, sizes, views (swatches/spectrum/custom), alpha transparency, and full color conversion (HEX/RGB/HSL)
        </div>
      </div>
    </div>
  );
}