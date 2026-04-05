import React, { useState } from "react";
import {
  Radio,
  RadioGroup,
  CardRadio,
  SegmentedRadio,
  RadioProvider,
  useRadioContext,
  type RadioSize,
  type RadioVariant,
  type RadioOrientation,
} from "../../../ui/inputs/radio/Radio.ui";

// ─── Helper Components ──────────────────────────────────────────────────────

function VariantShowcase() {
  const [selected, setSelected] = useState({
    solid: "option1",
    outline: "option1",
    soft: "option1",
    ghost: "option1",
  });

  const variants: RadioVariant[] = ["solid", "outline", "soft", "ghost"];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {variants.map((variant) => (
        <div key={variant} className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700 capitalize">{variant}</h4>
          <RadioGroup
            name={`variant-${variant}`}
            value={selected[variant]}
            onChange={(val) => setSelected((prev) => ({ ...prev, [variant]: val }))}
            variant={variant}
          >
            <Radio value="option1" label="Default Option" description="This is the default choice" />
            <Radio value="option2" label="Alternative Option" description="This is an alternative" />
            <Radio value="option3" label="Disabled Option" description="Cannot be selected" disabled />
          </RadioGroup>
        </div>
      ))}
    </div>
  );
}

function SizeShowcase() {
  const sizes: RadioSize[] = ["2xs", "xs", "sm", "md", "lg", "xl", "2xl"];
  const [selected, setSelected] = useState<Record<RadioSize, string>>({
    "2xs": "1",
    xs: "1",
    sm: "1",
    md: "1",
    lg: "1",
    xl: "1",
    "2xl": "1",
  });

  return (
    <div className="space-y-4">
      {sizes.map((size) => (
        <div key={size} className="flex items-center gap-6 p-3 bg-gray-50 rounded-lg">
          <div className="w-20 text-sm font-medium text-gray-600 capitalize">{size}</div>
          <RadioGroup
            name={`size-${size}`}
            value={selected[size]}
            onChange={(val) => setSelected((prev) => ({ ...prev, [size]: val }))}
            size={size}
          >
            <Radio value="1" label={`Option 1`} />
            <Radio value="2" label={`Option 2`} />
            <Radio value="3" label={`Option 3`} />
          </RadioGroup>
        </div>
      ))}
    </div>
  );
}

function OrientationShowcase() {
  const [verticalSelected, setVerticalSelected] = useState("option1");
  const [horizontalSelected, setHorizontalSelected] = useState("option1");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-700">Vertical Orientation</h4>
        <RadioGroup
          name="vertical"
          value={verticalSelected}
          onChange={setVerticalSelected}
          orientation="vertical"
          label="Choose an option"
          description="Options are stacked vertically"
        >
          <Radio value="option1" label="Vertical Option 1" description="First choice" />
          <Radio value="option2" label="Vertical Option 2" description="Second choice" />
          <Radio value="option3" label="Vertical Option 3" description="Third choice" />
        </RadioGroup>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-700">Horizontal Orientation</h4>
        <RadioGroup
          name="horizontal"
          value={horizontalSelected}
          onChange={setHorizontalSelected}
          orientation="horizontal"
          label="Choose an option"
          description="Options are arranged in a row"
        >
          <Radio value="option1" label="Option 1" />
          <Radio value="option2" label="Option 2" />
          <Radio value="option3" label="Option 3" />
        </RadioGroup>
      </div>
    </div>
  );
}

function LabelPlacementShowcase() {
  const [rightSelected, setRightSelected] = useState("option1");
  const [leftSelected, setLeftSelected] = useState("option1");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-700">Label Right (Default)</h4>
        <RadioGroup name="right-placement" value={rightSelected} onChange={setRightSelected}>
          <Radio value="option1" label="Label on the right" description="This is the default placement" />
          <Radio value="option2" label="Another option" description="Label stays on the right" />
        </RadioGroup>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-700">Label Left</h4>
        <RadioGroup name="left-placement" value={leftSelected} onChange={setLeftSelected}>
          <Radio value="option1" label="Label on the left" labelPlacement="left" description="Label appears before the radio" />
          <Radio value="option2" label="Another option" labelPlacement="left" description="Also on the left side" />
        </RadioGroup>
      </div>
    </div>
  );
}

function CardRadioShowcase() {
  const [selectedCard, setSelectedCard] = useState("basic");
  const [selectedPlan, setSelectedPlan] = useState("pro");
  const [selectedPayment, setSelectedPayment] = useState("card");

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Basic Card Radio</h4>
        <RadioGroup name="card-basic" value={selectedCard} onChange={setSelectedCard} orientation="horizontal">
          <CardRadio value="basic" label="Basic Plan" description="$10/month" />
          <CardRadio value="pro" label="Pro Plan" description="$20/month" badge="Popular" />
          <CardRadio value="enterprise" label="Enterprise" description="Custom pricing" disabled />
        </RadioGroup>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Card Radio with Icons</h4>
        <RadioGroup name="card-icons" value={selectedPlan} onChange={setSelectedPlan} orientation="horizontal">
          <CardRadio
            value="starter"
            label="Starter"
            description="For individuals"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
          />
          <CardRadio
            value="pro"
            label="Professional"
            description="For teams"
            badge="Popular"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            }
          />
          <CardRadio
            value="enterprise"
            label="Enterprise"
            description="For large organizations"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21h18M3 10h18M5 6l7-3 7 3M5 10v10m14-10v10M9 21h6" />
              </svg>
            }
          />
        </RadioGroup>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Payment Method Selection</h4>
        <RadioGroup name="payment" value={selectedPayment} onChange={setSelectedPayment} orientation="vertical">
          <CardRadio
            value="card"
            label="Credit / Debit Card"
            description="Visa, Mastercard, American Express"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            }
          />
          <CardRadio
            value="paypal"
            label="PayPal"
            description="Fast and secure"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <CardRadio
            value="crypto"
            label="Cryptocurrency"
            description="Bitcoin, Ethereum, USDC"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            }
          />
        </RadioGroup>
      </div>
    </div>
  );
}

function SegmentedRadioShowcase() {
  const [view, setView] = useState("grid");
  const [alignment, setAlignment] = useState("left");
  const [size, setSize] = useState<RadioSize>("md");
  const [fullWidthValue, setFullWidthValue] = useState("option1");

  const viewOptions = [
    { value: "grid", label: "Grid View", icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ) },
    { value: "list", label: "List View", icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    ) },
    { value: "detail", label: "Detail View", icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
      </svg>
    ) },
  ];

  const alignmentOptions = [
    { value: "left", label: "Left", icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8M4 18h16" />
      </svg>
    ) },
    { value: "center", label: "Center", icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M8 12h8M4 18h16" />
      </svg>
    ) },
    { value: "right", label: "Right", icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M12 12h8M4 18h16" />
      </svg>
    ) },
  ];

  const simpleOptions = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3", disabled: true },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">View Toggle (with Icons)</h4>
        <SegmentedRadio
          name="view"
          options={viewOptions}
          value={view}
          onChange={setView}
          size="md"
        />
        <p className="text-xs text-gray-500 mt-2">Current view: {view}</p>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Alignment Selector</h4>
        <SegmentedRadio
          name="alignment"
          options={alignmentOptions}
          value={alignment}
          onChange={setAlignment}
          size="lg"
        />
        <p className="text-xs text-gray-500 mt-2">Current alignment: {alignment}</p>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Size Variants</h4>
        <div className="space-y-3">
          {(["2xs", "xs", "sm", "md", "lg", "xl", "2xl"] as RadioSize[]).map((s) => (
            <div key={s} className="flex items-center gap-4">
              <span className="w-12 text-xs text-gray-500 capitalize">{s}</span>
              <SegmentedRadio
                name={`size-${s}`}
                options={simpleOptions}
                value={fullWidthValue}
                onChange={setFullWidthValue}
                size={s}
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Full Width Segmented Control</h4>
        <SegmentedRadio
          name="fullwidth"
          options={simpleOptions}
          value={fullWidthValue}
          onChange={setFullWidthValue}
          fullWidth
        />
      </div>
    </div>
  );
}

function FormValidationShowcase() {
  const [selected, setSelected] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!selected) {
      setError("Please select an option");
      setSubmitted(false);
    } else {
      setError("");
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <div className="space-y-4">
      <RadioGroup
        name="validation"
        value={selected}
        onChange={setSelected}
        label="Choose your preference"
        description="This selection is required"
        error={error}
      >
        <Radio value="option1" label="Option A" description="This is the first choice" />
        <Radio value="option2" label="Option B" description="This is the second choice" />
        <Radio value="option3" label="Option C" description="This is the third choice" />
      </RadioGroup>

      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm"
      >
        Submit Selection
      </button>

      {submitted && (
        <div className="bg-emerald-50 text-emerald-700 rounded-lg p-3 text-sm">
          Successfully submitted: {selected}
        </div>
      )}
    </div>
  );
}

function DisabledShowcase() {
  const [selected, setSelected] = useState("enabled");

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Disabled Radio Group</h4>
        <RadioGroup name="disabled-group" value="option1" disabled>
          <Radio value="option1" label="Disabled Option 1" />
          <Radio value="option2" label="Disabled Option 2" />
          <Radio value="option3" label="Disabled Option 3" />
        </RadioGroup>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Mixed Enabled/Disabled</h4>
        <RadioGroup name="mixed" value={selected} onChange={setSelected}>
          <Radio value="enabled" label="Enabled Option" />
          <Radio value="disabled" label="Disabled Option" disabled />
          <Radio value="enabled2" label="Another Enabled Option" />
        </RadioGroup>
      </div>
    </div>
  );
}

function ControlledVsUncontrolledShowcase() {
  const [controlledValue, setControlledValue] = useState("option1");
  const [lastAction, setLastAction] = useState("");

  return (
    <div className="space-y-6">
      <div className="p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700">Controlled Component</p>
        <p className="text-xs text-blue-600 mt-1">Value is managed by React state: {controlledValue}</p>
      </div>

      <RadioGroup
        name="controlled"
        value={controlledValue}
        onChange={(val) => {
          setControlledValue(val);
          setLastAction(`Changed to: ${val}`);
        }}
        label="Controlled Radio Group"
      >
        <Radio value="option1" label="Option 1" />
        <Radio value="option2" label="Option 2" />
        <Radio value="option3" label="Option 3" />
      </RadioGroup>

      <button
        onClick={() => {
          setControlledValue("option3");
          setLastAction("Reset to Option 3 via button");
        }}
        className="px-3 py-1.5 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600 transition"
      >
        Set to Option 3
      </button>

      {lastAction && (
        <div className="text-xs text-gray-500 bg-gray-100 rounded-lg p-2">
          Last action: {lastAction}
        </div>
      )}

      <div className="border-t border-gray-200 pt-4">
        <p className="text-sm text-gray-600 mb-2">Uncontrolled Component</p>
        <RadioGroup
          name="uncontrolled"
          defaultValue="option2"
          label="Uncontrolled Radio Group"
          description="Internal state management"
        >
          <Radio value="option1" label="Option 1" />
          <Radio value="option2" label="Option 2 (default)" />
          <Radio value="option3" label="Option 3" />
        </RadioGroup>
      </div>
    </div>
  );
}

// ─── Props Table ──────────────────────────────────────────────────────────────

function PropsTable() {
  return (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 overflow-x-auto">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Component Props</h3>
      
      <h4 className="text-md font-semibold text-gray-700 mb-2 mt-4">Radio Props</h4>
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
          <tr><td className="py-2 px-3 font-mono">size</td><td className="py-2 px-3">2xs | xs | sm | md | lg | xl | 2xl</td><td className="py-2 px-3">md</td><td className="py-2 px-3">Controls radio size and typography</td></tr>
          <tr><td className="py-2 px-3 font-mono">variant</td><td className="py-2 px-3">solid | outline | soft | ghost</td><td className="py-2 px-3">solid</td><td className="py-2 px-3">Visual style of the radio</td></tr>
          <tr><td className="py-2 px-3 font-mono">label</td><td className="py-2 px-3">ReactNode</td><td className="py-2 px-3">-</td><td className="py-2 px-3">Main label text</td></tr>
          <tr><td className="py-2 px-3 font-mono">description</td><td className="py-2 px-3">string</td><td className="py-2 px-3">-</td><td className="py-2 px-3">Secondary descriptive text</td></tr>
          <tr><td className="py-2 px-3 font-mono">labelPlacement</td><td className="py-2 px-3">right | left</td><td className="py-2 px-3">right</td><td className="py-2 px-3">Position of label relative to radio</td></tr>
          <tr><td className="py-2 px-3 font-mono">disabled</td><td className="py-2 px-3">boolean</td><td className="py-2 px-3">false</td><td className="py-2 px-3">Disables the radio</td></tr>
        </tbody>
      </table>

      <h4 className="text-md font-semibold text-gray-700 mb-2">RadioGroup Props</h4>
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
          <tr><td className="py-2 px-3 font-mono">name</td><td className="py-2 px-3">string</td><td className="py-2 px-3">required</td><td className="py-2 px-3">Name attribute for radio inputs</td></tr>
          <tr><td className="py-2 px-3 font-mono">value</td><td className="py-2 px-3">string</td><td className="py-2 px-3">-</td><td className="py-2 px-3">Controlled component value</td></tr>
          <tr><td className="py-2 px-3 font-mono">defaultValue</td><td className="py-2 px-3">string</td><td className="py-2 px-3">-</td><td className="py-2 px-3">Uncontrolled initial value</td></tr>
          <tr><td className="py-2 px-3 font-mono">orientation</td><td className="py-2 px-3">vertical | horizontal</td><td className="py-2 px-3">vertical</td><td className="py-2 px-3">Layout direction</td></tr>
          <tr><td className="py-2 px-3 font-mono">label</td><td className="py-2 px-3">string</td><td className="py-2 px-3">-</td><td className="py-2 px-3">Group legend label</td></tr>
          <tr><td className="py-2 px-3 font-mono">error</td><td className="py-2 px-3">string</td><td className="py-2 px-3">-</td><td className="py-2 px-3">Error message</td></tr>
        </tbody>
      </table>
    </div>
  );
}

// ─── Main Showcase Page ──────────────────────────────────────────────────────

export default function RadioShowcase() {
  return (
    <RadioProvider>
      <div className="min-h-screen bg-white text-black">
        {/* Header */}
        <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Radio Components</h1>
            <p className="text-gray-500 mt-1">
              A comprehensive showcase of all radio variants, sizes, orientations, and features
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
          {/* Variants Showcase */}
          <section className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Variants</h2>
            <VariantShowcase />
          </section>

          {/* Sizes Showcase */}
          <section className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Sizes</h2>
            <SizeShowcase />
          </section>

          {/* Orientation Showcase */}
          <section className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Orientations</h2>
            <OrientationShowcase />
          </section>

          {/* Label Placement Showcase */}
          <section className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Label Placement</h2>
            <LabelPlacementShowcase />
          </section>

          {/* Card Radio Showcase */}
          <section className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Card Radio</h2>
            <CardRadioShowcase />
          </section>

          {/* Segmented Radio Showcase */}
          <section className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Segmented Radio</h2>
            <SegmentedRadioShowcase />
          </section>

          {/* Form Validation */}
          <section className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Form Validation</h2>
            <FormValidationShowcase />
          </section>

          {/* Disabled States */}
          <section className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Disabled States</h2>
            <DisabledShowcase />
          </section>

          {/* Controlled vs Uncontrolled */}
          <section className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Controlled vs Uncontrolled</h2>
            <ControlledVsUncontrolledShowcase />
          </section>

          {/* Props Table */}
          <PropsTable />

          {/* Footer */}
          <div className="text-center text-sm text-gray-400 py-6 border-t border-gray-100">
            Radio System — Supports multiple variants, sizes, orientations, card layouts, and segmented controls
          </div>
        </div>
      </div>
    </RadioProvider>
  );
}