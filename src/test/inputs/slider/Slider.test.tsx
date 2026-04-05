import React, { useState } from "react";
import {
  Slider,
  RangeSlider,
  SliderProvider,
  useSliderContext,
  type SliderSize,
  type SliderVariant,
  type SliderOrientation,
  type SliderMark,
} from "../../../ui/inputs/slider/Slider.ui";

// ─── Helper Components ──────────────────────────────────────────────────────

function VariantShowcase() {
  const [solidValue, setSolidValue] = useState(45);
  const [outlineValue, setOutlineValue] = useState(45);
  const [softValue, setSoftValue] = useState(45);
  const [ghostValue, setGhostValue] = useState(45);

  const variants: { variant: SliderVariant; value: number; setValue: (v: number) => void }[] = [
    { variant: "solid", value: solidValue, setValue: setSolidValue },
    { variant: "outline", value: outlineValue, setValue: setOutlineValue },
    { variant: "soft", value: softValue, setValue: setSoftValue },
    { variant: "ghost", value: ghostValue, setValue: setGhostValue },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {variants.map(({ variant, value, setValue }) => (
        <div key={variant} className="space-y-3 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-700 capitalize">{variant}</h4>
          <Slider
            variant={variant}
            value={value}
            onChange={setValue}
            label={`${variant.charAt(0).toUpperCase() + variant.slice(1)} Slider`}
            showValue
            formatValue={(v) => `${v}%`}
          />
          <p className="text-xs text-gray-500">Value: {value}%</p>
        </div>
      ))}
    </div>
  );
}

function SizeShowcase() {
  const sizes: SliderSize[] = ["2xs", "xs", "sm", "md", "lg", "xl", "2xl"];
  const [values, setValues] = useState<Record<SliderSize, number>>({
    "2xs": 30,
    xs: 30,
    sm: 30,
    md: 30,
    lg: 30,
    xl: 30,
    "2xl": 30,
  });

  return (
    <div className="space-y-6">
      {sizes.map((size) => (
        <div key={size} className="flex items-center gap-6 p-3 bg-gray-50 rounded-lg">
          <div className="w-16 text-sm font-medium text-gray-600 capitalize">{size}</div>
          <div className="flex-1">
            <Slider
              size={size}
              value={values[size]}
              onChange={(val) => setValues((prev) => ({ ...prev, [size]: val }))}
              showValue
              formatValue={(v) => `${v}%`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function OrientationShowcase() {
  const [horizontalValue, setHorizontalValue] = useState(60);
  const [verticalValue, setVerticalValue] = useState(40);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700">Horizontal Orientation</h4>
        <Slider
          orientation="horizontal"
          value={horizontalValue}
          onChange={setHorizontalValue}
          label="Volume"
          showValue
          formatValue={(v) => `${v}%`}
        />
        <p className="text-xs text-gray-500">Value: {horizontalValue}%</p>
      </div>

      <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700">Vertical Orientation</h4>
        <div className="flex justify-center">
          <Slider
            orientation="vertical"
            value={verticalValue}
            onChange={setVerticalValue}
            label="Brightness"
            showValue
            formatValue={(v) => `${v}%`}
            className="h-48"
          />
        </div>
        <p className="text-xs text-gray-500 text-center">Value: {verticalValue}%</p>
      </div>
    </div>
  );
}

function MarksShowcase() {
  const [value, setValue] = useState(50);
  const [rangeValue, setRangeValue] = useState<[number, number]>([30, 70]);

  const marks: SliderMark[] = [
    { value: 0, label: "0%" },
    { value: 25, label: "25%" },
    { value: 50, label: "50%" },
    { value: 75, label: "75%" },
    { value: 100, label: "100%" },
  ];

  const customMarks: SliderMark[] = [
    { value: 0, label: "Cold" },
    { value: 50, label: "Warm" },
    { value: 100, label: "Hot" },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700">Single Slider with Marks</h4>
        <Slider
          value={value}
          onChange={setValue}
          marks={marks}
          showMarks
          label="Temperature"
          showValue
          formatValue={(v) => `${v}°`}
        />
      </div>

      <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700">Range Slider with Custom Marks</h4>
        <RangeSlider
          value={rangeValue}
          onChange={setRangeValue}
          marks={customMarks}
          showMarks
          label="Spiciness Level"
          showValue
          formatValue={(v) => `${v}%`}
        />
      </div>

      <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700">Auto Marks (min/max only)</h4>
        <Slider
          value={value}
          onChange={setValue}
          showMarks
          label="Range"
          description="Shows only min and max marks"
        />
      </div>
    </div>
  );
}

function TooltipShowcase() {
  const [value, setValue] = useState(65);
  const [rangeValue, setRangeValue] = useState<[number, number]>([25, 75]);

  return (
    <div className="space-y-8">
      <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700">Slider with Tooltip</h4>
        <Slider
          value={value}
          onChange={setValue}
          showTooltip
          label="Volume Control"
          showValue
          formatValue={(v) => `${v} dB`}
        />
        <p className="text-xs text-gray-500">Hover or drag to see tooltip</p>
      </div>

      <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700">Range Slider with Tooltip</h4>
        <RangeSlider
          value={rangeValue}
          onChange={setRangeValue}
          showTooltip
          label="Price Range"
          showValue
          formatValue={(v) => `$${v}`}
        />
        <p className="text-xs text-gray-500">Hover over either thumb to see tooltip</p>
      </div>
    </div>
  );
}

function DisabledShowcase() {
  const [disabledValue, setDisabledValue] = useState(75);
  const [rangeValue, setRangeValue] = useState<[number, number]>([20, 80]);

  return (
    <div className="space-y-6">
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Disabled Slider</h4>
        <Slider
          value={disabledValue}
          onChange={setDisabledValue}
          disabled
          label="Disabled Slider"
          description="This slider cannot be interacted with"
          showValue
        />
      </div>

      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Disabled Range Slider</h4>
        <RangeSlider
          value={rangeValue}
          onChange={setRangeValue}
          disabled
          label="Disabled Range Slider"
          description="This range slider cannot be interacted with"
          showValue
        />
      </div>
    </div>
  );
}

function StepAndBoundsShowcase() {
  const [value1, setValue1] = useState(50);
  const [value2, setValue2] = useState(5);
  const [value3, setValue3] = useState(100);
  const [rangeValue, setRangeValue] = useState<[number, number]>([10, 90]);

  return (
    <div className="space-y-6">
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Step Size: 1 (Default)</h4>
        <Slider
          value={value1}
          onChange={setValue1}
          min={0}
          max={100}
          step={1}
          label="Fine Control"
          showValue
        />
      </div>

      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Step Size: 10</h4>
        <Slider
          value={value2}
          onChange={setValue2}
          min={0}
          max={100}
          step={10}
          label="Coarse Control"
          showValue
          formatValue={(v) => `${v}%`}
        />
        <p className="text-xs text-gray-500 mt-1">Values snap to increments of 10</p>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Custom Bounds: 0 - 200</h4>
        <Slider
          value={value3}
          onChange={setValue3}
          min={0}
          max={200}
          step={5}
          label="Extended Range"
          showValue
          formatValue={(v) => `${v}`}
        />
      </div>

      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Range Slider with Min Distance</h4>
        <RangeSlider
          value={rangeValue}
          onChange={setRangeValue}
          min={0}
          max={100}
          minDistance={15}
          label="Selection Range"
          description="Minimum 15 units between thumbs"
          showValue
          formatValue={(v) => `${v}%`}
        />
      </div>
    </div>
  );
}

function CustomFormatShowcase() {
  const [price, setPrice] = useState(50);
  const [rating, setRating] = useState(3.5);
  const [rangePrice, setRangePrice] = useState<[number, number]>([20, 80]);
  const [rangeRating, setRangeRating] = useState<[number, number]>([2.5, 4.5]);

  return (
    <div className="space-y-6">
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Currency Format</h4>
        <Slider
          value={price}
          onChange={setPrice}
          min={0}
          max={100}
          label="Price"
          showValue
          formatValue={(v) => `$${v}.00`}
        />
      </div>

      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Rating Format (1-5 stars)</h4>
        <Slider
          value={rating}
          onChange={setRating}
          min={0}
          max={5}
          step={0.5}
          label="Rating"
          showValue
          formatValue={(v) => `${v} ★`}
        />
      </div>

      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Currency Range</h4>
        <RangeSlider
          value={rangePrice}
          onChange={setRangePrice}
          min={0}
          max={100}
          label="Price Range"
          showValue
          formatValue={(v) => `$${v}`}
        />
      </div>

      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Rating Range</h4>
        <RangeSlider
          value={rangeRating}
          onChange={setRangeRating}
          min={0}
          max={5}
          step={0.5}
          label="Rating Range"
          showValue
          formatValue={(v) => `${v} ★`}
        />
      </div>
    </div>
  );
}

function CallbackShowcase() {
  const [value, setValue] = useState(50);
  const [lastChange, setLastChange] = useState<string>("");
  const [lastChangeEnd, setLastChangeEnd] = useState<string>("");

  const [rangeValue, setRangeValue] = useState<[number, number]>([30, 70]);
  const [rangeLastChange, setRangeLastChange] = useState<string>("");
  const [rangeLastChangeEnd, setRangeLastChangeEnd] = useState<string>("");

  return (
    <div className="space-y-8">
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Slider Callbacks</h4>
        <Slider
          value={value}
          onChange={(val) => {
            setValue(val);
            setLastChange(`onChange: ${val}`);
          }}
          onChangeEnd={(val) => {
            setLastChangeEnd(`onChangeEnd: ${val}`);
          }}
          label="Volume"
          showValue
        />
        <div className="mt-3 space-y-1 text-xs font-mono">
          <p className="text-gray-600">{lastChange}</p>
          <p className="text-gray-500">{lastChangeEnd}</p>
        </div>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Range Slider Callbacks</h4>
        <RangeSlider
          value={rangeValue}
          onChange={(val) => {
            setRangeValue(val);
            setRangeLastChange(`onChange: [${val[0]}, ${val[1]}]`);
          }}
          onChangeEnd={(val) => {
            setRangeLastChangeEnd(`onChangeEnd: [${val[0]}, ${val[1]}]`);
          }}
          label="Price Range"
          showValue
        />
        <div className="mt-3 space-y-1 text-xs font-mono">
          <p className="text-gray-600">{rangeLastChange}</p>
          <p className="text-gray-500">{rangeLastChangeEnd}</p>
        </div>
      </div>
    </div>
  );
}

function RangeSliderShowcase() {
  const [basicRange, setBasicRange] = useState<[number, number]>([20, 80]);
  const [tightRange, setTightRange] = useState<[number, number]>([45, 55]);
  const [wideRange, setWideRange] = useState<[number, number]>([10, 90]);

  return (
    <div className="space-y-6">
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Basic Range Slider</h4>
        <RangeSlider
          value={basicRange}
          onChange={setBasicRange}
          label="Selection Range"
          description="Select a value range"
          showValue
          formatValue={(v) => `${v}%`}
        />
      </div>

      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Tight Range with Min Distance</h4>
        <RangeSlider
          value={tightRange}
          onChange={setTightRange}
          min={0}
          max={100}
          minDistance={5}
          label="Narrow Selection"
          description="Minimum 5 units apart"
          showValue
          formatValue={(v) => `${v}%`}
        />
      </div>

      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Wide Range with Custom Bounds</h4>
        <RangeSlider
          value={wideRange}
          onChange={setWideRange}
          min={0}
          max={200}
          step={5}
          label="Extended Range"
          description="0 to 200 range"
          showValue
          formatValue={(v) => `${v}`}
        />
      </div>
    </div>
  );
}

function RealWorldExample() {
  const [volume, setVolume] = useState(65);
  const [bass, setBass] = useState(50);
  const [treble, setTreble] = useState(50);
  const [frequency, setFrequency] = useState<[number, number]>([40, 16000]);
  const [equalizer, setEqualizer] = useState<[number, number]>([60, 80]);

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
      <h3 className="text-base font-semibold text-gray-800">Audio Equalizer Demo</h3>

      <div className="space-y-4">
        <Slider
          value={volume}
          onChange={setVolume}
          label="Volume"
          showValue
          formatValue={(v) => `${v}%`}
        />

        <div className="grid grid-cols-2 gap-4">
          <Slider
            value={bass}
            onChange={setBass}
            label="Bass"
            showValue
            formatValue={(v) => `${v}%`}
          />
          <Slider
            value={treble}
            onChange={setTreble}
            label="Treble"
            showValue
            formatValue={(v) => `${v}%`}
          />
        </div>

        <RangeSlider
          value={frequency}
          onChange={setFrequency}
          min={20}
          max={20000}
          step={10}
          label="Frequency Range (Hz)"
          showValue
          formatValue={(v) => v >= 1000 ? `${v / 1000}kHz` : `${v}Hz`}
        />

        <RangeSlider
          value={equalizer}
          onChange={setEqualizer}
          label="Equalizer Range"
          showValue
          formatValue={(v) => `${v}%`}
        />
      </div>

      <div className="bg-white rounded-lg p-3 text-sm text-gray-600">
        <p>🎵 Audio Settings: Volume {volume}%, Bass {bass}%, Treble {treble}%</p>
        <p>🎚️ Frequency: {frequency[0] >= 1000 ? `${frequency[0] / 1000}kHz` : `${frequency[0]}Hz`} - {frequency[1] >= 1000 ? `${frequency[1] / 1000}kHz` : `${frequency[1]}Hz`}</p>
        <p>⚡ Equalizer: {equalizer[0]}% - {equalizer[1]}%</p>
      </div>
    </div>
  );
}

// ─── Props Table ──────────────────────────────────────────────────────────────

function PropsTable() {
  return (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 overflow-x-auto">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Component Props</h3>

      <h4 className="text-md font-semibold text-gray-700 mb-2 mt-4">Slider Props</h4>
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
          <tr><td className="py-2 px-3 font-mono">size</td><td className="py-2 px-3">2xs | xs | sm | md | lg | xl | 2xl</td><td className="py-2 px-3">md</td><td className="py-2 px-3">Controls slider dimensions</td></tr>
          <tr><td className="py-2 px-3 font-mono">variant</td><td className="py-2 px-3">solid | outline | soft | ghost</td><td className="py-2 px-3">solid</td><td className="py-2 px-3">Visual style of the slider</td></tr>
          <tr><td className="py-2 px-3 font-mono">orientation</td><td className="py-2 px-3">horizontal | vertical</td><td className="py-2 px-3">horizontal</td><td className="py-2 px-3">Slider direction</td></tr>
          <tr><td className="py-2 px-3 font-mono">min / max</td><td className="py-2 px-3">number</td><td className="py-2 px-3">0 / 100</td><td className="py-2 px-3">Range boundaries</td></tr>
          <tr><td className="py-2 px-3 font-mono">step</td><td className="py-2 px-3">number</td><td className="py-2 px-3">1</td><td className="py-2 px-3">Increment granularity</td></tr>
          <tr><td className="py-2 px-3 font-mono">showTooltip</td><td className="py-2 px-3">boolean</td><td className="py-2 px-3">false</td><td className="py-2 px-3">Show value tooltip on hover</td></tr>
          <tr><td className="py-2 px-3 font-mono">showValue</td><td className="py-2 px-3">boolean</td><td className="py-2 px-3">false</td><td className="py-2 px-3">Show numeric value label</td></tr>
          <tr><td className="py-2 px-3 font-mono">showMarks</td><td className="py-2 px-3">boolean</td><td className="py-2 px-3">false</td><td className="py-2 px-3">Show tick marks</td></tr>
          <tr><td className="py-2 px-3 font-mono">marks</td><td className="py-2 px-3">SliderMark[]</td><td className="py-2 px-3">-</td><td className="py-2 px-3">Custom mark configuration</td></tr>
          <tr><td className="py-2 px-3 font-mono">disabled</td><td className="py-2 px-3">boolean</td><td className="py-2 px-3">false</td><td className="py-2 px-3">Disables interaction</td></tr>
          <tr><td className="py-2 px-3 font-mono">formatValue</td><td className="py-2 px-3">(v) string</td><td className="py-2 px-3">String(v)</td><td className="py-2 px-3">Custom formatting function</td></tr>
          <tr><td className="py-2 px-3 font-mono">onChange</td><td className="py-2 px-3">(value) void</td><td className="py-2 px-3">-</td><td className="py-2 px-3">Live change callback</td></tr>
          <tr><td className="py-2 px-3 font-mono">onChangeEnd</td><td className="py-2 px-3">(value)  void</td><td className="py-2 px-3">-</td><td className="py-2 px-3">Callback on drag end</td></tr>
        </tbody>
      </table>

      <h4 className="text-md font-semibold text-gray-700 mb-2">RangeSlider Props</h4>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-2 px-3 font-semibold text-gray-700">Prop</th>
            <th className="text-left py-2 px-3 font-semibold text-gray-700">Type</th>
            <th className="text-left py-2 px-3 font-semibold text-gray-700">Default</th>
            <th className="text-left py-2 px-3 font-semibold text-gray-700">Description</th>
           </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          <tr><td className="py-2 px-3 font-mono">value</td><td className="py-2 px-3">[number, number]</td><td className="py-2 px-3">-</td><td className="py-2 px-3">Controlled range values</td></tr>
          <tr><td className="py-2 px-3 font-mono">defaultValue</td><td className="py-2 px-3">[number, number]</td><td className="py-2 px-3">[20, 80]</td><td className="py-2 px-3">Uncontrolled initial range</td></tr>
          <tr><td className="py-2 px-3 font-mono">minDistance</td><td className="py-2 px-3">number</td><td className="py-2 px-3">0</td><td className="py-2 px-3">Minimum distance between thumbs</td></tr>
        </tbody>
      </table>
    </div>
  );
}

// ─── Main Showcase Page ──────────────────────────────────────────────────────

export default function SliderShowcase() {
  return (
    <SliderProvider>
      <div className="min-h-screen bg-white text-black">
        {/* Header */}
        <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Slider Components</h1>
            <p className="text-gray-500 mt-1">
              A comprehensive showcase of all slider variants, sizes, orientations, and features
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

          {/* Orientation Showcase */}
          <section className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Orientations</h2>
            <OrientationShowcase />
          </section>

          {/* Marks Showcase */}
          <section className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Marks & Labels</h2>
            <MarksShowcase />
          </section>

          {/* Tooltip Showcase */}
          <section className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Tooltip</h2>
            <TooltipShowcase />
          </section>

          {/* Disabled State */}
          <section className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Disabled State</h2>
            <DisabledShowcase />
          </section>

          {/* Step and Bounds */}
          <section className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Step Size & Bounds</h2>
            <StepAndBoundsShowcase />
          </section>

          {/* Custom Format */}
          <section className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Custom Formatting</h2>
            <CustomFormatShowcase />
          </section>

          {/* Callbacks */}
          <section className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Callbacks</h2>
            <CallbackShowcase />
          </section>

          {/* Range Slider */}
          <section className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Range Slider</h2>
            <RangeSliderShowcase />
          </section>

          {/* Real World Example */}
          <section className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Real World Example</h2>
            <RealWorldExample />
          </section>

          {/* Props Table */}
          <PropsTable />

          {/* Footer */}
          <div className="text-center text-sm text-gray-400 py-6 border-t border-gray-100">
            Slider System — Supports multiple variants, sizes, orientations, marks, tooltips, and range selection
          </div>
        </div>
      </div>
    </SliderProvider>
  );
}