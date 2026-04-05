import React, { useState } from "react";
import {
  Skeleton,
  SkeletonGroup,
  SkeletonProvider,
  useSkeletonContext,
  type SkeletonAnimation,
  type SkeletonRadius,
  type SkeletonSpeed,
  type SkeletonTheme,
} from "../../../ui/feedback/skeleton/Skeleton.ui";

// ─── Helper Components ──────────────────────────────────────────────────────

function AnimationShowcase() {
  const animations: SkeletonAnimation[] = ["pulse", "wave", "none"];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {animations.map((animation) => (
        <div key={animation} className="space-y-3 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-700 capitalize">{animation || "none"}</h4>
          <Skeleton
            animation={animation}
            height={80}
            width="100%"
            radius="md"
          />
          <Skeleton.Text lines={2} animation={animation} />
        </div>
      ))}
    </div>
  );
}

function ThemeShowcase() {
  const themes: SkeletonTheme[] = ["default", "muted", "strong"];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {themes.map((theme) => (
        <div key={theme} className="space-y-3 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-700 capitalize">{theme}</h4>
          <Skeleton theme={theme} height={80} width="100%" radius="md" />
          <Skeleton.Text lines={2} theme={theme} />
        </div>
      ))}
    </div>
  );
}

function RadiusShowcase() {
  const radii: SkeletonRadius[] = ["none", "sm", "md", "lg", "full"];

  return (
    <div className="flex flex-wrap gap-6 items-center">
      {radii.map((radius) => (
        <div key={radius} className="space-y-2 text-center">
          <Skeleton
            radius={radius}
            width={80}
            height={80}
            animation="pulse"
          />
          <p className="text-xs text-gray-500 capitalize">{radius}</p>
        </div>
      ))}
    </div>
  );
}

function SpeedShowcase() {
  const speeds: SkeletonSpeed[] = ["slow", "normal", "fast"];

  return (
    <div className="space-y-6">
      {speeds.map((speed) => (
        <div key={speed} className="space-y-2 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-700 capitalize">{speed}</h4>
          <Skeleton speed={speed} height={60} width="100%" radius="md" />
          <p className="text-xs text-gray-400">Animation duration: {speed === "slow" ? "2.2s" : speed === "normal" ? "1.5s" : "0.9s"}</p>
        </div>
      ))}
    </div>
  );
}

function TextShowcase() {
  return (
    <div className="space-y-6">
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">1 Line</h4>
        <Skeleton.Text lines={1} />
      </div>
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">2 Lines</h4>
        <Skeleton.Text lines={2} />
      </div>
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">3 Lines (Default)</h4>
        <Skeleton.Text lines={3} />
      </div>
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">4 Lines with Custom Last Line Width</h4>
        <Skeleton.Text lines={4} lastLineWidth="40%" />
      </div>
    </div>
  );
}

function RectShowcase() {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Small Rectangle</h4>
        <Skeleton.Rect width={120} height={60} />
      </div>
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Medium Rectangle</h4>
        <Skeleton.Rect width={200} height={100} />
      </div>
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Full Width Rectangle</h4>
        <Skeleton.Rect width="100%" height={120} />
      </div>
    </div>
  );
}

function CircleShowcase() {
  const sizes = [32, 48, 64, 80, 96];

  return (
    <div className="flex flex-wrap gap-6 items-center p-4 bg-gray-50 rounded-lg">
      {sizes.map((size) => (
        <div key={size} className="space-y-2 text-center">
          <Skeleton.Circle size={size} />
          <p className="text-xs text-gray-500">{size}px</p>
        </div>
      ))}
    </div>
  );
}

function ButtonShowcase() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-center p-4 bg-gray-50 rounded-lg">
        <Skeleton.Button width={80} height={32} />
        <Skeleton.Button width={100} height={36} />
        <Skeleton.Button width={120} height={40} />
        <Skeleton.Button width={140} height={44} />
      </div>
    </div>
  );
}

function AvatarShowcase() {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Avatar with 1 Text Line</h4>
        <Skeleton.Avatar avatarSize={48} lines={1} />
      </div>
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Avatar with 2 Text Lines (Default)</h4>
        <Skeleton.Avatar avatarSize={48} lines={2} />
      </div>
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Avatar with 3 Text Lines</h4>
        <Skeleton.Avatar avatarSize={56} lines={3} />
      </div>
    </div>
  );
}

function CardShowcase() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Card with Image</h4>
        <Skeleton.Card imageHeight={160} lines={3} />
      </div>
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Card with Tall Image</h4>
        <Skeleton.Card imageHeight={200} lines={2} />
      </div>
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Card with Many Lines</h4>
        <Skeleton.Card imageHeight={140} lines={5} />
      </div>
    </div>
  );
}

function TableShowcase() {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">3x3 Table</h4>
        <Skeleton.Table rows={3} columns={3} />
      </div>
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">4x5 Table</h4>
        <Skeleton.Table rows={4} columns={5} rowHeight={40} />
      </div>
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">6x2 Table with Custom Gap</h4>
        <Skeleton.Table rows={6} columns={2} gap="0.75rem" />
      </div>
    </div>
  );
}

function ListShowcase() {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">3 Items, 2 Lines Each</h4>
        <Skeleton.List items={3} lines={2} />
      </div>
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">5 Items, 1 Line Each</h4>
        <Skeleton.List items={5} lines={1} avatarSize={32} gap="0.75rem" />
      </div>
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">4 Items, 3 Lines Each</h4>
        <Skeleton.List items={4} lines={3} avatarSize={56} />
      </div>
    </div>
  );
}

function InputShowcase() {
  return (
    <div className="space-y-6">
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Input with Label</h4>
        <Skeleton.Input showLabel labelWidth="30%" />
      </div>
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Input without Label</h4>
        <Skeleton.Input showLabel={false} />
      </div>
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Custom Width Input</h4>
        <Skeleton.Input width="50%" height={44} />
      </div>
    </div>
  );
}

function ImageShowcase() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">16:9 Aspect Ratio</h4>
        <Skeleton.Image aspectRatio="16/9" />
      </div>
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">4:3 Aspect Ratio</h4>
        <Skeleton.Image aspectRatio="4/3" />
      </div>
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">1:1 Square</h4>
        <Skeleton.Image aspectRatio="1/1" />
      </div>
    </div>
  );
}

function SkeletonGroupShowcase() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <button
          onClick={() => setLoading(true)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            loading ? "bg-gray-900 text-white" : "bg-gray-200 text-gray-600"
          }`}
        >
          Show Skeleton
        </button>
        <button
          onClick={() => setLoading(false)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            !loading ? "bg-gray-900 text-white" : "bg-gray-200 text-gray-600"
          }`}
        >
          Show Content
        </button>
      </div>

      <SkeletonGroup loading={loading} animation="wave" radius="md">
        <div className="p-6 bg-white border border-gray-200 rounded-xl">
          <div className="flex items-center gap-4 mb-4">
            <img
              src="https://via.placeholder.com/48"
              alt="Avatar"
              className="w-12 h-12 rounded-full bg-gray-300"
            />
            <div>
              <h3 className="font-semibold text-gray-800">John Doe</h3>
              <p className="text-sm text-gray-500">john.doe@example.com</p>
            </div>
          </div>
          <p className="text-gray-600">
            This is the actual content that appears when loading is complete.
            The skeleton group handles the transition between skeleton and content.
          </p>
        </div>
      </SkeletonGroup>

      <p className="text-xs text-gray-400">
        Current state: {loading ? "Loading (showing skeleton)" : "Loaded (showing content)"}
      </p>
    </div>
  );
}

function ProviderControlledShowcase() {
  const [providerLoading, setProviderLoading] = useState(true);
  const [animation, setAnimation] = useState<SkeletonAnimation>("wave");
  const [theme, setTheme] = useState<SkeletonTheme>("default");

  return (
    <SkeletonProvider
      loading={providerLoading}
      animation={animation}
      theme={theme}
      radius="md"
      speed="normal"
    >
      <div className="space-y-4">
        <div className="flex flex-wrap gap-3 items-center">
          <button
            onClick={() => setProviderLoading(!providerLoading)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition"
          >
            {providerLoading ? "Load Content" : "Show Skeleton"}
          </button>

          <select
            value={animation}
            onChange={(e) => setAnimation(e.target.value as SkeletonAnimation)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="pulse">Pulse</option>
            <option value="wave">Wave</option>
            <option value="none">None</option>
          </select>

          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as SkeletonTheme)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="default">Default</option>
            <option value="muted">Muted</option>
            <option value="strong">Strong</option>
          </select>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <ProviderContent />
        </div>
      </div>
    </SkeletonProvider>
  );
}

function ProviderContent() {
  const { state, start, stop, toggle, setAnimation, setTheme, setRadius, setSpeed } = useSkeletonContext();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button onClick={start} className="px-3 py-1 bg-green-500 text-white rounded text-xs">Start</button>
        <button onClick={stop} className="px-3 py-1 bg-red-500 text-white rounded text-xs">Stop</button>
        <button onClick={toggle} className="px-3 py-1 bg-blue-500 text-white rounded text-xs">Toggle</button>
        <button onClick={() => setAnimation("wave")} className="px-3 py-1 bg-gray-500 text-white rounded text-xs">Wave</button>
        <button onClick={() => setAnimation("pulse")} className="px-3 py-1 bg-gray-500 text-white rounded text-xs">Pulse</button>
        <button onClick={() => setTheme("strong")} className="px-3 py-1 bg-gray-500 text-white rounded text-xs">Strong Theme</button>
        <button onClick={() => setRadius("full")} className="px-3 py-1 bg-gray-500 text-white rounded text-xs">Full Radius</button>
      </div>

      <div className="bg-gray-100 rounded-lg p-3 text-xs text-gray-600">
        <p>Loading: {state.loading ? "✅" : "❌"}</p>
        <p>Animation: {state.animation}</p>
        <p>Theme: {state.theme}</p>
        <p>Radius: {state.radius}</p>
        <p>Speed: {state.speed}</p>
      </div>

      {state.loading && (
        <div className="space-y-3">
          <Skeleton height={60} width="100%" />
          <Skeleton.Text lines={2} />
        </div>
      )}

      {!state.loading && (
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <p className="text-gray-700">Content loaded successfully!</p>
        </div>
      )}
    </div>
  );
}

// ─── Props Table ──────────────────────────────────────────────────────────────

function PropsTable() {
  return (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 overflow-x-auto">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Component Props</h3>

      <h4 className="text-md font-semibold text-gray-700 mb-2 mt-4">Common Props (all variants)</h4>
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
          <tr><td className="py-2 px-3 font-mono">animation</td><td className="py-2 px-3">pulse | wave | none</td><td className="py-2 px-3">wave</td><td className="py-2 px-3">Loading animation style</td></tr>
          <tr><td className="py-2 px-3 font-mono">radius</td><td className="py-2 px-3">none | sm | md | lg | full</td><td className="py-2 px-3">md</td><td className="py-2 px-3">Border radius of skeleton</td></tr>
          <tr><td className="py-2 px-3 font-mono">speed</td><td className="py-2 px-3">slow | normal | fast</td><td className="py-2 px-3">normal</td><td className="py-2 px-3">Animation duration</td></tr>
          <tr><td className="py-2 px-3 font-mono">theme</td><td className="py-2 px-3">default | muted | strong</td><td className="py-2 px-3">default</td><td className="py-2 px-3">Color intensity</td></tr>
        </tbody>
      </table>

      <h4 className="text-md font-semibold text-gray-700 mb-2">Component Variants</h4>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-2 px-3 font-semibold text-gray-700">Component</th>
            <th className="text-left py-2 px-3 font-semibold text-gray-700">Description</th>
           </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          <tr><td className="py-2 px-3 font-mono">Skeleton.Text</td><td className="py-2 px-3">Multiple lines of text-like bones</td></tr>
          <tr><td className="py-2 px-3 font-mono">Skeleton.Rect</td><td className="py-2 px-3">Generic rectangular block</td></tr>
          <tr><td className="py-2 px-3 font-mono">Skeleton.Circle</td><td className="py-2 px-3">Avatar/icon placeholder</td></tr>
          <tr><td className="py-2 px-3 font-mono">Skeleton.Button</td><td className="py-2 px-3">Button-shaped skeleton</td></tr>
          <tr><td className="py-2 px-3 font-mono">Skeleton.Avatar</td><td className="py-2 px-3">Circle + text lines combination</td></tr>
          <tr><td className="py-2 px-3 font-mono">Skeleton.Card</td><td className="py-2 px-3">Image + title + body lines</td></tr>
          <tr><td className="py-2 px-3 font-mono">Skeleton.Table</td><td className="py-2 px-3">Rows × columns of cells</td></tr>
          <tr><td className="py-2 px-3 font-mono">Skeleton.List</td><td className="py-2 px-3">Vertical list of avatar rows</td></tr>
          <tr><td className="py-2 px-3 font-mono">Skeleton.Input</td><td className="py-2 px-3">Form field with optional label</td></tr>
          <tr><td className="py-2 px-3 font-mono">Skeleton.Image</td><td className="py-2 px-3">Aspect-ratio image placeholder</td></tr>
          <tr><td className="py-2 px-3 font-mono">SkeletonGroup</td><td className="py-2 px-3">Wrapper that toggles between skeleton and content</td></tr>
        </tbody>
      </table>
    </div>
  );
}

// ─── Main Showcase Page ──────────────────────────────────────────────────────

export default function SkeletonShowcase() {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Skeleton Components</h1>
          <p className="text-gray-500 mt-1">
            A comprehensive showcase of all skeleton variants, animations, themes, and features
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Animations */}
        <section className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Animations</h2>
          <AnimationShowcase />
        </section>

        {/* Themes */}
        <section className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Themes</h2>
          <ThemeShowcase />
        </section>

        {/* Radii */}
        <section className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Border Radii</h2>
          <RadiusShowcase />
        </section>

        {/* Speeds */}
        <section className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Animation Speeds</h2>
          <SpeedShowcase />
        </section>

        {/* Skeleton.Text */}
        <section className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Skeleton.Text</h2>
          <TextShowcase />
        </section>

        {/* Skeleton.Rect */}
        <section className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Skeleton.Rect</h2>
          <RectShowcase />
        </section>

        {/* Skeleton.Circle */}
        <section className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Skeleton.Circle</h2>
          <CircleShowcase />
        </section>

        {/* Skeleton.Button */}
        <section className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Skeleton.Button</h2>
          <ButtonShowcase />
        </section>

        {/* Skeleton.Avatar */}
        <section className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Skeleton.Avatar</h2>
          <AvatarShowcase />
        </section>

        {/* Skeleton.Card */}
        <section className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Skeleton.Card</h2>
          <CardShowcase />
        </section>

        {/* Skeleton.Table */}
        <section className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Skeleton.Table</h2>
          <TableShowcase />
        </section>

        {/* Skeleton.List */}
        <section className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Skeleton.List</h2>
          <ListShowcase />
        </section>

        {/* Skeleton.Input */}
        <section className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Skeleton.Input</h2>
          <InputShowcase />
        </section>

        {/* Skeleton.Image */}
        <section className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Skeleton.Image</h2>
          <ImageShowcase />
        </section>

        {/* SkeletonGroup */}
        <section className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">SkeletonGroup</h2>
          <SkeletonGroupShowcase />
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
          Skeleton System — Supports multiple animations, themes, radii, speeds, and 10+ component variants
        </div>
      </div>
    </div>
  );
}