import React, { useState } from "react";
import {
  Loader,
  LoaderOverlay,
  InlineSpinner,
  LoaderProvider,
  ControlledLoader,
  useLoaderContext,
  type LoaderSize,
  type LoaderVariant,
  type LoaderSpeed,
  type LoaderTrack,
  type LoaderType,
} from "../../../ui/feedback/loader/Loader.ui";

// ─── Demo Helper Components ──────────────────────────────────────────────────

function ControlledDemo() {
  const { start, stop, toggle, state, setLabel } = useLoaderContext();
  const [customLabel, setCustomLabel] = useState("Custom loading...");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <button
          onClick={start}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Start
        </button>
        <button
          onClick={stop}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Stop
        </button>
        <button
          onClick={toggle}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
        >
          Toggle
        </button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium">Custom Label:</span>
        <input
          type="text"
          value={customLabel}
          onChange={(e) => setCustomLabel(e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded-md text-sm"
        />
        <button
          onClick={() => setLabel(customLabel)}
          className="px-3 py-1 bg-green-500 text-white rounded-md text-sm hover:bg-green-600 transition"
        >
          Apply Label
        </button>
        <button
          onClick={() => setLabel(undefined)}
          className="px-3 py-1 bg-gray-400 text-white rounded-md text-sm hover:bg-gray-500 transition"
        >
          Remove Label
        </button>
      </div>
      <div className="p-6 bg-gray-50 rounded-xl flex justify-center">
        <ControlledLoader
          type="spinner"
          labelPlacement="right"
          className="bg-white px-6 py-4 rounded-lg shadow-sm"
        />
      </div>
      <div className="text-sm text-gray-500">
        Status: {state.isLoading ? "Loading..." : "Idle"} | Label: {state.label || "none"}
      </div>
    </div>
  );
}

// ─── Overlay Demo Component ──────────────────────────────────────────────────

function OverlayDemoCard() {
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayProps, setOverlayProps] = useState({
    type: "spinner" as LoaderType,
    size: "lg" as LoaderSize,
    variant: "primary" as LoaderVariant,
    label: "Processing...",
  });

  return (
    <div className="relative">
      <div className="relative min-h-[300px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden border border-gray-200">
        {/* Card content that gets overlayed */}
        <div className="p-6">
          <h4 className="font-semibold text-gray-700 mb-2">Card Content</h4>
          <p className="text-gray-500 text-sm">
            This content will be dimmed when the overlay is active. The overlay
            provides a semi-transparent backdrop with a centered loader.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="h-20 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-20 bg-gray-200 rounded-lg animate-pulse" />
          </div>
        </div>

        {/* Overlay */}
        <LoaderOverlay
          loading={showOverlay}
          {...overlayProps}
          overlayClassName="rounded-xl"
        />
      </div>

      {/* Controls */}
      <div className="mt-4 flex flex-wrap gap-3 items-center">
        <button
          onClick={() => setShowOverlay(!showOverlay)}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            showOverlay
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {showOverlay ? "Hide Overlay" : "Show Overlay"}
        </button>

        <select
          value={overlayProps.type}
          onChange={(e) => setOverlayProps({ ...overlayProps, type: e.target.value as LoaderType })}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="spinner">Spinner</option>
          <option value="dots">Dots</option>
          <option value="pulse">Pulse</option>
          <option value="bar">Bar</option>
        </select>

        <select
          value={overlayProps.variant}
          onChange={(e) => setOverlayProps({ ...overlayProps, variant: e.target.value as LoaderVariant })}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="default">Default</option>
          <option value="primary">Primary</option>
          <option value="success">Success</option>
          <option value="warning">Warning</option>
          <option value="danger">Danger</option>
        </select>
      </div>
    </div>
  );
}

// ─── Main Showcase Page ──────────────────────────────────────────────────────

export default function LoaderShowcase() {
  const [globalSize, setGlobalSize] = useState<LoaderSize>("md");
  const [globalVariant, setGlobalVariant] = useState<LoaderVariant>("default");
  const [globalSpeed, setGlobalSpeed] = useState<LoaderSpeed>("normal");
  const [globalTrack, setGlobalTrack] = useState<LoaderTrack>("visible");
  const [globalLabelPlacement, setGlobalLabelPlacement] = useState<"right" | "left" | "bottom" | "top">("right");

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Loader Components</h1>
          <p className="text-gray-500 mt-1">
            A comprehensive showcase of all loader variants, sizes, colors, and features
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Global Controls */}
        <section className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Global Controls</h2>
          <p className="text-sm text-gray-500 mb-4">
            Adjust these controls to see how loaders respond to different configurations
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
              <select
                value={globalSize}
                onChange={(e) => setGlobalSize(e.target.value as LoaderSize)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
              >
                <option value="xs">XS (Extra Small)</option>
                <option value="sm">SM (Small)</option>
                <option value="md">MD (Medium)</option>
                <option value="lg">LG (Large)</option>
                <option value="xl">XL (Extra Large)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Variant</label>
              <select
                value={globalVariant}
                onChange={(e) => setGlobalVariant(e.target.value as LoaderVariant)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
              >
                <option value="default">Default (Gray)</option>
                <option value="primary">Primary (Blue)</option>
                <option value="success">Success (Green)</option>
                <option value="warning">Warning (Amber)</option>
                <option value="danger">Danger (Red)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Speed</label>
              <select
                value={globalSpeed}
                onChange={(e) => setGlobalSpeed(e.target.value as LoaderSpeed)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
              >
                <option value="slow">Slow</option>
                <option value="normal">Normal</option>
                <option value="fast">Fast</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Track Ring</label>
              <select
                value={globalTrack}
                onChange={(e) => setGlobalTrack(e.target.value as LoaderTrack)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
              >
                <option value="visible">Visible</option>
                <option value="hidden">Hidden</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Label Position</label>
              <select
                value={globalLabelPlacement}
                onChange={(e) => setGlobalLabelPlacement(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
              >
                <option value="right">Right</option>
                <option value="left">Left</option>
                <option value="bottom">Bottom</option>
                <option value="top">Top</option>
              </select>
            </div>
          </div>
        </section>

        {/* Type Variants Showcase */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Loader Types</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(["spinner", "dots", "pulse", "bar"] as LoaderType[]).map((type) => (
              <div key={type} className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center">
                <h3 className="font-medium text-gray-700 capitalize mb-4">{type}</h3>
                <div className="flex justify-center py-4">
                  <Loader
                    loading={true}
                    size={globalSize}
                    variant={globalVariant}
                    speed={globalSpeed}
                    track={globalTrack}
                    type={type}
                    label={`${type} loader`}
                    labelPlacement={globalLabelPlacement}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Type: {type} | Size: {globalSize} | Variant: {globalVariant}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Size Variants Showcase */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Size Variants</h2>
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <div className="flex flex-wrap items-center justify-around gap-6">
              {(["xs", "sm", "md", "lg", "xl"] as LoaderSize[]).map((size) => (
                <div key={size} className="text-center">
                  <div className="flex justify-center">
                    <Loader
                      loading={true}
                      size={size}
                      variant="primary"
                      type="spinner"
                      label={size.toUpperCase()}
                      labelPlacement="bottom"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2 capitalize">{size}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Color Variants Showcase */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Color Variants</h2>
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <div className="flex flex-wrap items-center justify-around gap-8">
              {(["default", "primary", "success", "warning", "danger"] as LoaderVariant[]).map((variant) => (
                <div key={variant} className="text-center">
                  <Loader
                    loading={true}
                    size="lg"
                    variant={variant}
                    type="spinner"
                    label={variant}
                    labelPlacement="bottom"
                  />
                  <p className="text-xs text-gray-500 mt-2 capitalize">{variant}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Label Placements */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Label Placements</h2>
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <div className="flex flex-wrap items-center justify-around gap-8">
              {(["right", "left", "bottom", "top"] as const).map((placement) => (
                <div key={placement} className="text-center">
                  <Loader
                    loading={true}
                    size="md"
                    variant="primary"
                    type="spinner"
                    label={`${placement} label`}
                    labelPlacement={placement}
                  />
                  <p className="text-xs text-gray-500 mt-2 capitalize">{placement}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Speed Demo */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Animation Speeds</h2>
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <div className="flex flex-wrap items-center justify-around gap-8">
              {(["slow", "normal", "fast"] as LoaderSpeed[]).map((speed) => (
                <div key={speed} className="text-center">
                  <Loader
                    loading={true}
                    size="lg"
                    variant="primary"
                    speed={speed}
                    type="spinner"
                    label={speed}
                    labelPlacement="bottom"
                  />
                  <p className="text-xs text-gray-500 mt-2 capitalize">{speed}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Track Ring Toggle */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Track Ring (Spinner & Bar)</h2>
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <div className="flex flex-wrap items-center justify-around gap-8">
              <div className="text-center">
                <Loader
                  loading={true}
                  size="lg"
                  variant="primary"
                  track="visible"
                  type="spinner"
                  label="Track Visible"
                  labelPlacement="bottom"
                />
                <p className="text-xs text-gray-500 mt-2">Track Visible</p>
              </div>
              <div className="text-center">
                <Loader
                  loading={true}
                  size="lg"
                  variant="primary"
                  track="hidden"
                  type="spinner"
                  label="Track Hidden"
                  labelPlacement="bottom"
                />
                <p className="text-xs text-gray-500 mt-2">Track Hidden</p>
              </div>
              <div className="text-center">
                <Loader
                  loading={true}
                  size="lg"
                  variant="primary"
                  track="visible"
                  type="bar"
                  label="Bar with Track"
                  labelPlacement="bottom"
                />
                <p className="text-xs text-gray-500 mt-2">Bar with Track</p>
              </div>
              <div className="text-center">
                <Loader
                  loading={true}
                  size="lg"
                  variant="primary"
                  track="hidden"
                  type="bar"
                  label="Bar without Track"
                  labelPlacement="bottom"
                />
                <p className="text-xs text-gray-500 mt-2">Bar without Track</p>
              </div>
            </div>
          </div>
        </section>

        {/* Inline Spinner */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Inline Spinner</h2>
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <p className="text-gray-600 mb-4">
              Perfect for inline use within text or buttons:
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <InlineSpinner size="xs" variant="default" />
                <span className="text-sm">Loading inline content (XS)</span>
              </div>
              <div className="flex items-center gap-2">
                <InlineSpinner size="sm" variant="primary" />
                <span className="text-sm">Loading inline content (SM)</span>
              </div>
              <div className="flex items-center gap-2">
                <InlineSpinner size="md" variant="success" />
                <span className="text-sm">Loading inline content (MD)</span>
              </div>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                <InlineSpinner size="sm" variant="default" className="text-white" />
                Saving...
              </button>
            </div>
          </div>
        </section>

        {/* Controlled Loader Demo */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Controlled Loader (with Provider)</h2>
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <LoaderProvider
              size={globalSize}
              variant={globalVariant}
              track={globalTrack}
              speed={globalSpeed}
              defaultLoading={false}
            >
              <ControlledDemo />
            </LoaderProvider>
          </div>
        </section>

        {/* Overlay Loader Demo */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Overlay Loader</h2>
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <OverlayDemoCard />
            <p className="text-sm text-gray-500 mt-4">
              The overlay creates a semi-transparent backdrop that covers the parent element,
              perfect for loading states on cards, modals, or full-page content.
            </p>
          </div>
        </section>

        {/* Full Page Overlay Demo */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Full Screen Overlay</h2>
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <FullScreenOverlayDemo />
            <p className="text-sm text-gray-500 mt-4">
              Use <code className="px-1 py-0.5 bg-gray-200 rounded">fullScreen</code> prop to create
              a fixed overlay that covers the entire viewport.
            </p>
          </div>
        </section>

        {/* Props Table */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Component Props</h2>
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 overflow-x-auto">
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
                <tr><td className="py-2 px-3 font-mono text-gray-800">loading</td><td className="py-2 px-3">boolean</td><td className="py-2 px-3">true</td><td className="py-2 px-3">Show/hide the loader</td></tr>
                <tr><td className="py-2 px-3 font-mono text-gray-800">size</td><td className="py-2 px-3">xs | sm | md | lg | xl</td><td className="py-2 px-3">md</td><td className="py-2 px-3">Controls the loader dimensions</td></tr>
                <tr><td className="py-2 px-3 font-mono text-gray-800">variant</td><td className="py-2 px-3">default | primary | success | warning | danger</td><td className="py-2 px-3">default</td><td className="py-2 px-3">Color scheme of the loader</td></tr>
                <tr><td className="py-2 px-3 font-mono text-gray-800">type</td><td className="py-2 px-3">spinner | dots | pulse | bar</td><td className="py-2 px-3">spinner</td><td className="py-2 px-3">Visual style of the loader</td></tr>
                <tr><td className="py-2 px-3 font-mono text-gray-800">speed</td><td className="py-2 px-3">slow | normal | fast</td><td className="py-2 px-3">normal</td><td className="py-2 px-3">Animation duration</td></tr>
                <tr><td className="py-2 px-3 font-mono text-gray-800">track</td><td className="py-2 px-3">visible | hidden</td><td className="py-2 px-3">visible</td><td className="py-2 px-3">Show background track (spinner/bar)</td></tr>
                <tr><td className="py-2 px-3 font-mono text-gray-800">label</td><td className="py-2 px-3">string</td><td className="py-2 px-3">undefined</td><td className="py-2 px-3">Optional text label</td></tr>
                <tr><td className="py-2 px-3 font-mono text-gray-800">labelPlacement</td><td className="py-2 px-3">right | left | bottom | top</td><td className="py-2 px-3">right</td><td className="py-2 px-3">Position of the label relative to loader</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

// Full Screen Overlay Demo Component
function FullScreenOverlayDemo() {
  const [showFullScreen, setShowFullScreen] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowFullScreen(true)}
        className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
      >
        Show Full Screen Overlay
      </button>
      <LoaderOverlay
        loading={showFullScreen}
        fullScreen
        size="xl"
        variant="primary"
        type="spinner"
        label="Loading full screen content..."
        onClose={() => setShowFullScreen(false)}
      />
      {showFullScreen && (
        <button
          onClick={() => setShowFullScreen(false)}
          className="fixed bottom-6 right-6 z-[60] px-4 py-2 bg-white text-gray-800 rounded-lg shadow-lg hover:bg-gray-100 transition"
        >
          Close Overlay
        </button>
      )}
    </>
  );
}