import React, { useState } from "react";
import {
  Checkbox,
  CheckboxGroup,
  CardCheckbox,
  CheckboxProvider,
  useCheckboxContext,
  type CheckboxSize,
  type CheckboxVariant,
  type CheckboxShape,
} from "../../../ui/inputs/checkbox/Checkbox.ui";

// ─── Helper Components ──────────────────────────────────────────────────────

function VariantShowcase() {
  const [solidChecked, setSolidChecked] = useState(false);
  const [outlineChecked, setOutlineChecked] = useState(false);
  const [softChecked, setSoftChecked] = useState(false);
  const [ghostChecked, setGhostChecked] = useState(false);

  const variants: { variant: CheckboxVariant; checked: boolean; setChecked: (v: boolean) => void }[] = [
    { variant: "solid", checked: solidChecked, setChecked: setSolidChecked },
    { variant: "outline", checked: outlineChecked, setChecked: setOutlineChecked },
    { variant: "soft", checked: softChecked, setChecked: setSoftChecked },
    { variant: "ghost", checked: ghostChecked, setChecked: setGhostChecked },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {variants.map(({ variant, checked, setChecked }) => (
        <div key={variant} className="space-y-3 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-700 capitalize">{variant}</h4>
          <Checkbox
            variant={variant}
            checked={checked}
            onChange={setChecked}
            label={`${variant.charAt(0).toUpperCase() + variant.slice(1)} Checkbox`}
            description={`This is a ${variant} variant checkbox`}
          />
          <p className="text-xs text-gray-500">State: {checked ? "Checked" : "Unchecked"}</p>
        </div>
      ))}
    </div>
  );
}

function SizeShowcase() {
  const sizes: CheckboxSize[] = ["2xs", "xs", "sm", "md", "lg", "xl", "2xl"];
  const [checkedStates, setCheckedStates] = useState<Record<CheckboxSize, boolean>>({
    "2xs": false,
    xs: false,
    sm: false,
    md: false,
    lg: false,
    xl: false,
    "2xl": false,
  });

  return (
    <div className="space-y-4">
      {sizes.map((size) => (
        <div key={size} className="flex items-center gap-6 p-3 bg-gray-50 rounded-lg">
          <div className="w-16 text-sm font-medium text-gray-600 capitalize">{size}</div>
          <Checkbox
            size={size}
            checked={checkedStates[size]}
            onChange={(val) => setCheckedStates((prev) => ({ ...prev, [size]: val }))}
            label={`${size.toUpperCase()} Checkbox`}
          />
        </div>
      ))}
    </div>
  );
}

function ShapeShowcase() {
  const shapes: CheckboxShape[] = ["rounded", "square", "circle"];
  const [checkedStates, setCheckedStates] = useState<Record<CheckboxShape, boolean>>({
    rounded: false,
    square: false,
    circle: false,
  });

  return (
    <div className="flex flex-wrap gap-8">
      {shapes.map((shape) => (
        <div key={shape} className="space-y-3 text-center">
          <h4 className="text-sm font-semibold text-gray-700 capitalize">{shape}</h4>
          <Checkbox
            shape={shape}
            checked={checkedStates[shape]}
            onChange={(val) => setCheckedStates((prev) => ({ ...prev, [shape]: val }))}
            label={`${shape} shape`}
          />
        </div>
      ))}
    </div>
  );
}

function LabelPlacementShowcase() {
  const [rightChecked, setRightChecked] = useState(false);
  const [leftChecked, setLeftChecked] = useState(false);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700">Label Right (Default)</h4>
        <Checkbox
          labelPlacement="right"
          label="Remember me"
          description="Stay logged in on this device"
          checked={rightChecked}
          onChange={setRightChecked}
        />
      </div>
      <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700">Label Left</h4>
        <Checkbox
          labelPlacement="left"
          label="Agree to terms"
          description="Accept terms and conditions"
          checked={leftChecked}
          onChange={setLeftChecked}
        />
      </div>
    </div>
  );
}

function IndeterminateShowcase() {
  const [parentChecked, setParentChecked] = useState(false);
  const [child1, setChild1] = useState(false);
  const [child2, setChild2] = useState(false);
  const [child3, setChild3] = useState(false);

  const isIndeterminate = (child1 || child2 || child3) && !(child1 && child2 && child3);

  const handleParentChange = (checked: boolean) => {
    setParentChecked(checked);
    setChild1(checked);
    setChild2(checked);
    setChild3(checked);
  };

  const handleChildChange = () => {
    const allChecked = child1 && child2 && child3;
    const anyChecked = child1 || child2 || child3;
    setParentChecked(allChecked);
  };

  React.useEffect(() => {
    handleChildChange();
  }, [child1, child2, child3]);

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <h4 className="text-sm font-semibold text-gray-700">Indeterminate State Example</h4>
      <Checkbox
        checked={parentChecked}
        indeterminate={isIndeterminate}
        onChange={handleParentChange}
        label="Select All Permissions"
        description="Toggle all options below"
      />
      <div className="ml-6 pl-4 border-l-2 border-gray-200 space-y-2">
        <Checkbox checked={child1} onChange={setChild1} label="Read Permission" />
        <Checkbox checked={child2} onChange={setChild2} label="Write Permission" />
        <Checkbox checked={child3} onChange={setChild3} label="Delete Permission" />
      </div>
      <p className="text-xs text-gray-500">
        {isIndeterminate
          ? "Parent is indeterminate (some children checked)"
          : parentChecked
          ? "All children checked"
          : "No children checked"}
      </p>
    </div>
  );
}

function LoadingStateShowcase() {
  const [loadingChecked, setLoadingChecked] = useState(false);
  const [loadingEnabled, setLoadingEnabled] = useState(true);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
        <Checkbox
          loading={loadingEnabled}
          checked={loadingChecked}
          onChange={setLoadingChecked}
          label="Loading State Checkbox"
          description="Shows a spinner while loading"
        />
        <button
          onClick={() => setLoadingEnabled(!loadingEnabled)}
          className="px-3 py-1 bg-gray-500 text-white rounded-lg text-xs hover:bg-gray-600 transition"
        >
          Toggle Loading
        </button>
      </div>
      <p className="text-xs text-gray-500">Loading: {loadingEnabled ? "Enabled" : "Disabled"}</p>
    </div>
  );
}

function DisabledShowcase() {
  const [disabledChecked, setDisabledChecked] = useState(true);

  return (
    <div className="space-y-6">
      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700">Disabled Checkbox</h4>
        <Checkbox disabled label="Disabled Checkbox" description="This checkbox cannot be interacted with" />
      </div>
      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700">Disabled but Checked</h4>
        <Checkbox
          disabled
          checked={disabledChecked}
          onChange={setDisabledChecked}
          label="Disabled Checked Checkbox"
          description="This checkbox is disabled and checked"
        />
      </div>
    </div>
  );
}

function CheckboxGroupShowcase() {
  const [groupValues, setGroupValues] = useState(["option1"]);

  return (
    <div className="space-y-6">
      <CheckboxGroup
        value={groupValues}
        onChange={setGroupValues}
        label="Select Your Interests"
        description="Choose the categories you're interested in"
        orientation="vertical"
      >
        <Checkbox value="option1" label="Technology" description="Latest tech news and updates" />
        <Checkbox value="option2" label="Design" description="UI/UX design inspiration" />
        <Checkbox value="option3" label="Business" description="Entrepreneurship and startups" />
        <Checkbox value="option4" label="Science" description="Scientific discoveries" />
      </CheckboxGroup>

      <div className="bg-gray-100 rounded-lg p-3">
        <p className="text-xs text-gray-600 font-mono">Selected Values: {JSON.stringify(groupValues)}</p>
      </div>
    </div>
  );
}

function CardCheckboxShowcase() {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(["feature1"]);

  return (
    <div className="space-y-4">
      <CardCheckbox
        value="feature1"
        label="Dark Mode"
        description="Enable dark theme across the application"
        checked={selectedFeatures.includes("feature1")}
        onChange={(checked) => {
          if (checked) {
            setSelectedFeatures([...selectedFeatures, "feature1"]);
          } else {
            setSelectedFeatures(selectedFeatures.filter((v) => v !== "feature1"));
          }
        }}
        cardClassName="w-full"
      />
      <CardCheckbox
        value="feature2"
        label="Notifications"
        description="Receive push notifications"
        checked={selectedFeatures.includes("feature2")}
        onChange={(checked) => {
          if (checked) {
            setSelectedFeatures([...selectedFeatures, "feature2"]);
          } else {
            setSelectedFeatures(selectedFeatures.filter((v) => v !== "feature2"));
          }
        }}
        cardClassName="w-full"
      />
      <CardCheckbox
        value="feature3"
        label="Auto-save"
        description="Automatically save your work"
        checked={selectedFeatures.includes("feature3")}
        onChange={(checked) => {
          if (checked) {
            setSelectedFeatures([...selectedFeatures, "feature3"]);
          } else {
            setSelectedFeatures(selectedFeatures.filter((v) => v !== "feature3"));
          }
        }}
        cardClassName="w-full"
      />
      <div className="bg-gray-100 rounded-lg p-3 mt-3">
        <p className="text-sm text-gray-700">Selected Features: <span className="font-semibold">{selectedFeatures.join(", ") || "None"}</span></p>
      </div>
    </div>
  );
}

function HorizontalGroupShowcase() {
  const [selectedColors, setSelectedColors] = useState<string[]>(["blue"]);

  return (
    <div className="space-y-4">
      <CheckboxGroup
        value={selectedColors}
        onChange={setSelectedColors}
        label="Color Preferences"
        description="Select your favorite colors"
        orientation="horizontal"
      >
        <Checkbox value="red" label="Red" />
        <Checkbox value="blue" label="Blue" />
        <Checkbox value="green" label="Green" />
        <Checkbox value="yellow" label="Yellow" />
        <Checkbox value="purple" label="Purple" />
      </CheckboxGroup>
      <div className="bg-gray-100 rounded-lg p-3">
        <p className="text-xs text-gray-600">Selected Colors: {selectedColors.join(", ") || "None"}</p>
      </div>
    </div>
  );
}

function ControlledVsUncontrolledShowcase() {
  const [controlledValue, setControlledValue] = useState(false);
  const [lastAction, setLastAction] = useState("");

  return (
    <div className="space-y-6">
      <div className="p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700">Controlled Component</p>
        <p className="text-xs text-blue-600 mt-1">Value is managed by React state: {controlledValue ? "Checked" : "Unchecked"}</p>
      </div>

      <Checkbox
        checked={controlledValue}
        onChange={(val) => {
          setControlledValue(val);
          setLastAction(`Changed to: ${val ? "Checked" : "Unchecked"}`);
        }}
        label="Controlled Checkbox"
        description="External state management"
      />

      <div className="flex gap-3">
        <button
          onClick={() => {
            setControlledValue(true);
            setLastAction("Set to Checked via button");
          }}
          className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition"
        >
          Check
        </button>
        <button
          onClick={() => {
            setControlledValue(false);
            setLastAction("Set to Unchecked via button");
          }}
          className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition"
        >
          Uncheck
        </button>
      </div>

      {lastAction && (
        <div className="text-xs text-gray-500 bg-gray-100 rounded-lg p-2">
          Last action: {lastAction}
        </div>
      )}

      <div className="border-t border-gray-200 pt-4">
        <p className="text-sm text-gray-600 mb-3">Uncontrolled Component</p>
        <Checkbox
          defaultChecked={true}
          label="Uncontrolled Checkbox"
          description="Internal state management"
        />
      </div>
    </div>
  );
}

function ProviderControlledShowcase() {
  const [providerChecked, setProviderChecked] = useState(false);
  const [variant, setVariant] = useState<CheckboxVariant>("solid");
  const [size, setSize] = useState<CheckboxSize>("md");
  const [shape, setShape] = useState<CheckboxShape>("rounded");

  return (
    <CheckboxProvider>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-3 items-center p-4 bg-gray-50 rounded-lg">
          <select
            value={variant}
            onChange={(e) => setVariant(e.target.value as CheckboxVariant)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
          >
            <option value="solid">Solid</option>
            <option value="outline">Outline</option>
            <option value="soft">Soft</option>
            <option value="ghost">Ghost</option>
          </select>

          <select
            value={size}
            onChange={(e) => setSize(e.target.value as CheckboxSize)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
          >
            <option value="2xs">2XS</option>
            <option value="xs">XS</option>
            <option value="sm">SM</option>
            <option value="md">MD</option>
            <option value="lg">LG</option>
            <option value="xl">XL</option>
            <option value="2xl">2XL</option>
          </select>

          <select
            value={shape}
            onChange={(e) => setShape(e.target.value as CheckboxShape)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
          >
            <option value="rounded">Rounded</option>
            <option value="square">Square</option>
            <option value="circle">Circle</option>
          </select>
        </div>

        <ProviderContent variant={variant} size={size} shape={shape} />
      </div>
    </CheckboxProvider>
  );
}

function ProviderContent({ variant, size, shape }: { variant: CheckboxVariant; size: CheckboxSize; shape: CheckboxShape }) {
  const [checked, setChecked] = useState(false);

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <Checkbox
        variant={variant}
        size={size}
        shape={shape}
        checked={checked}
        onChange={setChecked}
        label="Provider-controlled Checkbox"
        description={`Variant: ${variant}, Size: ${size}, Shape: ${shape}`}
      />
      <p className="text-xs text-gray-500 mt-2">State: {checked ? "Checked ✓" : "Unchecked"}</p>
    </div>
  );
}

// ─── Props Table ──────────────────────────────────────────────────────────────

function PropsTable() {
  return (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 overflow-x-auto">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Component Props</h3>

      <h4 className="text-md font-semibold text-gray-700 mb-2 mt-4">Checkbox Props</h4>
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
          <tr><td className="py-2 px-3 font-mono">size</td><td className="py-2 px-3">2xs | xs | sm | md | lg | xl | 2xl</td><td className="py-2 px-3">md</td><td className="py-2 px-3">Controls checkbox dimensions</td></tr>
          <tr><td className="py-2 px-3 font-mono">variant</td><td className="py-2 px-3">solid | outline | soft | ghost</td><td className="py-2 px-3">solid</td><td className="py-2 px-3">Visual style of the checkbox</td></tr>
          <tr><td className="py-2 px-3 font-mono">shape</td><td className="py-2 px-3">rounded | square | circle</td><td className="py-2 px-3">rounded</td><td className="py-2 px-3">Corner radius style</td></tr>
          <tr><td className="py-2 px-3 font-mono">checked</td><td className="py-2 px-3">boolean</td><td className="py-2 px-3">-</td><td className="py-2 px-3">Controlled checked state</td></tr>
          <tr><td className="py-2 px-3 font-mono">defaultChecked</td><td className="py-2 px-3">boolean</td><td className="py-2 px-3">false</td><td className="py-2 px-3">Uncontrolled initial state</td></tr>
          <tr><td className="py-2 px-3 font-mono">indeterminate</td><td className="py-2 px-3">boolean</td><td className="py-2 px-3">false</td><td className="py-2 px-3">Shows indeterminate state (dash)</td></tr>
          <tr><td className="py-2 px-3 font-mono">disabled</td><td className="py-2 px-3">boolean</td><td className="py-2 px-3">false</td><td className="py-2 px-3">Disables interaction</td></tr>
          <tr><td className="py-2 px-3 font-mono">loading</td><td className="py-2 px-3">boolean</td><td className="py-2 px-3">false</td><td className="py-2 px-3">Shows spinner animation</td></tr>
          <tr><td className="py-2 px-3 font-mono">label</td><td className="py-2 px-3">ReactNode</td><td className="py-2 px-3">-</td><td className="py-2 px-3">Main label text</td></tr>
          <tr><td className="py-2 px-3 font-mono">description</td><td className="py-2 px-3">string</td><td className="py-2 px-3">-</td><td className="py-2 px-3">Secondary descriptive text</td></tr>
          <tr><td className="py-2 px-3 font-mono">labelPlacement</td><td className="py-2 px-3">right | left</td><td className="py-2 px-3">right</td><td className="py-2 px-3">Position of label</td></tr>
        </tbody>
      </table>

      <h4 className="text-md font-semibold text-gray-700 mb-2">CheckboxGroup Props</h4>
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
          <tr><td className="py-2 px-3 font-mono">value</td><td className="py-2 px-3">string[]</td><td className="py-2 px-3">-</td><td className="py-2 px-3">Controlled group values</td></tr>
          <tr><td className="py-2 px-3 font-mono">defaultValue</td><td className="py-2 px-3">string[]</td><td className="py-2 px-3">[]</td><td className="py-2 px-3">Uncontrolled default values</td></tr>
          <tr><td className="py-2 px-3 font-mono">orientation</td><td className="py-2 px-3">horizontal | vertical</td><td className="py-2 px-3">vertical</td><td className="py-2 px-3">Layout direction</td></tr>
          <tr><td className="py-2 px-3 font-mono">label</td><td className="py-2 px-3">string</td><td className="py-2 px-3">-</td><td className="py-2 px-3">Group legend title</td></tr>
        </tbody>
      </table>
    </div>
  );
}

// ─── Main Showcase Page ──────────────────────────────────────────────────────

export default function CheckboxShowcase() {
  return (
    <CheckboxProvider>
      <div className="min-h-screen bg-white text-black">
        {/* Header */}
        <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Checkbox Components</h1>
            <p className="text-gray-500 mt-1">
              A comprehensive showcase of all checkbox variants, sizes, shapes, and features
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

          {/* Shapes Showcase */}
          <section className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Shapes</h2>
            <ShapeShowcase />
          </section>

          {/* Label Placement */}
          <section className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Label Placement</h2>
            <LabelPlacementShowcase />
          </section>

          {/* Indeterminate State */}
          <section className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Indeterminate State</h2>
            <IndeterminateShowcase />
          </section>

          {/* Loading State */}
          <section className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Loading State</h2>
            <LoadingStateShowcase />
          </section>

          {/* Disabled State */}
          <section className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Disabled State</h2>
            <DisabledShowcase />
          </section>

          {/* Checkbox Group */}
          <section className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Checkbox Group (Vertical)</h2>
            <CheckboxGroupShowcase />
          </section>

          {/* Horizontal Group */}
          <section className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Checkbox Group (Horizontal)</h2>
            <HorizontalGroupShowcase />
          </section>

          {/* Card Checkbox */}
          <section className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Card Checkbox</h2>
            <CardCheckboxShowcase />
          </section>

          {/* Controlled vs Uncontrolled */}
          <section className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Controlled vs Uncontrolled</h2>
            <ControlledVsUncontrolledShowcase />
          </section>

          {/* Provider Controlled */}
          <section className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Provider Controlled</h2>
            <ProviderControlledShowcase />
          </section>

          {/* Props Table */}
          <PropsTable />

          {/* Footer */}
          <div className="text-center text-sm text-gray-400 py-6 border-t border-gray-100">
            Checkbox System — Supports multiple variants, sizes, shapes, indeterminate states, loading states, and group management
          </div>
        </div>
      </div>
    </CheckboxProvider>
  );
}