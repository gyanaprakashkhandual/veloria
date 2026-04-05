import React, { useState } from "react";
import {
  SnackbarRoot,
  useSnackbar,
  type SnackbarSize,
  type SnackbarVariant,
  type SnackbarSeverity,
  type SnackbarPosition,
  type SnackbarAction,
} from "../../../ui/feedback/snackbar/Snackbar.ui";

// ─── Demo Helper Components ──────────────────────────────────────────────────

function ControlPanel() {
  const snackbar = useSnackbar();
  const [size, setSize] = useState<SnackbarSize>("md");
  const [variant, setVariant] = useState<SnackbarVariant>("default");
  const [position, setPosition] = useState<SnackbarPosition>("bottom-right");
  const [duration, setDuration] = useState(4000);
  const [withDescription, setWithDescription] = useState(false);
  const [withAction, setWithAction] = useState(false);
  const [persistent, setPersistent] = useState(false);
  const [customIcon, setCustomIcon] = useState(false);

  const showSnackbar = (severity: SnackbarSeverity, message: string) => {
    const actions: SnackbarAction[] = withAction
      ? [
          {
            label: "Undo",
            onClick: () => console.log("Undo clicked"),
          },
          {
            label: "View",
            onClick: () => console.log("View clicked"),
          },
        ]
      : [];

    snackbar.show({
      message,
      description: withDescription ? "This is additional context about the operation." : undefined,
      severity,
      size,
      variant,
      position,
      duration: persistent ? undefined : duration,
      persistent,
      closable: true,
      icon: customIcon ? (
        <span className="text-lg">🎉</span>
      ) : undefined,
      action: actions[0],
      secondaryAction: actions[1],
      onClose: () => console.log(`${severity} snackbar closed`),
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Quick Controls</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
          <select
            value={size}
            onChange={(e) => setSize(e.target.value as SnackbarSize)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
          >
            <option value="xs">XS</option>
            <option value="sm">SM</option>
            <option value="md">MD</option>
            <option value="lg">LG</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Variant</label>
          <select
            value={variant}
            onChange={(e) => setVariant(e.target.value as SnackbarVariant)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
          >
            <option value="default">Default</option>
            <option value="filled">Filled</option>
            <option value="ghost">Ghost</option>
            <option value="outline">Outline</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
          <select
            value={position}
            onChange={(e) => setPosition(e.target.value as SnackbarPosition)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
          >
            <option value="top-left">Top Left</option>
            <option value="top-center">Top Center</option>
            <option value="top-right">Top Right</option>
            <option value="bottom-left">Bottom Left</option>
            <option value="bottom-center">Bottom Center</option>
            <option value="bottom-right">Bottom Right</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Duration (ms)</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            disabled={persistent}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white disabled:bg-gray-100"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={withDescription}
            onChange={(e) => setWithDescription(e.target.checked)}
            className="rounded border-gray-300"
          />
          With Description
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={withAction}
            onChange={(e) => setWithAction(e.target.checked)}
            className="rounded border-gray-300"
          />
          With Actions (Undo/View)
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={persistent}
            onChange={(e) => setPersistent(e.target.checked)}
            className="rounded border-gray-300"
          />
          Persistent (No Auto-dismiss)
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={customIcon}
            onChange={(e) => setCustomIcon(e.target.checked)}
            className="rounded border-gray-300"
          />
          Custom Icon (🎉)
        </label>
      </div>

      <div className="border-t border-gray-100 pt-4">
        <p className="text-sm text-gray-500 mb-3">Quick Actions:</p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => showSnackbar("info", "This is an informational message")}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm"
          >
            Info
          </button>
          <button
            onClick={() => showSnackbar("success", "Operation completed successfully!")}
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition text-sm"
          >
            Success
          </button>
          <button
            onClick={() => showSnackbar("warning", "Please review your input before proceeding")}
            className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition text-sm"
          >
            Warning
          </button>
          <button
            onClick={() => showSnackbar("danger", "An error occurred while processing your request")}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
          >
            Danger
          </button>
          <button
            onClick={() => showSnackbar("neutral", "New update available. Refresh to apply.")}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition text-sm"
          >
            Neutral
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Size Showcase ───────────────────────────────────────────────────────────

function SizeShowcase() {
  const snackbar = useSnackbar();
  const sizes: SnackbarSize[] = ["xs", "sm", "md", "lg"];

  return (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Size Variants</h3>
      <div className="flex flex-wrap gap-4">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() =>
              snackbar.show({
                message: `This is a ${size.toUpperCase()} sized snackbar`,
                description: "Showing how different sizes affect the layout and typography",
                severity: "info",
                size,
                variant: "default",
                duration: 3000,
              })
            }
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition capitalize text-sm"
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Variant Showcase ────────────────────────────────────────────────────────

function VariantShowcase() {
  const snackbar = useSnackbar();
  const variants: SnackbarVariant[] = ["default", "filled", "ghost", "outline"];

  return (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Style Variants</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {variants.map((variant) => (
          <button
            key={variant}
            onClick={() =>
              snackbar.show({
                message: `${variant.charAt(0).toUpperCase() + variant.slice(1)} variant snackbar`,
                description: "Each variant has its own visual style",
                severity: "success",
                variant,
                duration: 3000,
              })
            }
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition capitalize text-sm"
          >
            {variant}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Position Showcase ───────────────────────────────────────────────────────

function PositionShowcase() {
  const snackbar = useSnackbar();
  const positions: SnackbarPosition[] = [
    "top-left",
    "top-center",
    "top-right",
    "bottom-left",
    "bottom-center",
    "bottom-right",
  ];

  return (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Position Showcase</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {positions.map((position) => (
          <button
            key={position}
            onClick={() =>
              snackbar.show({
                message: `Snackbar at ${position.replace("-", " ")} position`,
                severity: "neutral",
                position,
                duration: 2500,
              })
            }
            className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition text-xs capitalize"
          >
            {position.replace("-", " ")}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Promise Demo ────────────────────────────────────────────────────────────

function PromiseDemo() {
  const snackbar = useSnackbar();

  const simulateAsyncOperation = (shouldSucceed: boolean) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (shouldSucceed) {
          resolve({ data: "Operation completed!" });
        } else {
          reject(new Error("Something went wrong"));
        }
      }, 2000);
    });
  };

  const handlePromiseSuccess = async () => {
    await snackbar.promise(simulateAsyncOperation(true), {
      loading: "Processing your request...",
      success: (data) => `Success! ${data.data}`,
      error: "Failed to process request",
    });
  };

  const handlePromiseError = async () => {
    try {
      await snackbar.promise(simulateAsyncOperation(false), {
        loading: "Saving changes...",
        success: "Changes saved!",
        error: (err) => `Error: ${(err as Error).message}`,
      });
    } catch {
      // Error already handled by snackbar
    }
  };

  return (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Promise Integration</h3>
      <p className="text-sm text-gray-500 mb-4">
        Snackbar can track promise states (loading → success/error) automatically
      </p>
      <div className="flex gap-4">
        <button
          onClick={handlePromiseSuccess}
          className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition text-sm"
        >
          Simulate Success
        </button>
        <button
          onClick={handlePromiseError}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
        >
          Simulate Error
        </button>
      </div>
    </div>
  );
}

// ─── Convenience Methods Demo ────────────────────────────────────────────────

function ConvenienceMethodsDemo() {
  const snackbar = useSnackbar();

  return (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Convenience Methods</h3>
      <p className="text-sm text-gray-500 mb-4">
        Use built-in severity methods for cleaner code
      </p>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => snackbar.info("Informational message with info()")}
          className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-sm"
        >
          snackbar.info()
        </button>
        <button
          onClick={() => snackbar.success("Success message with success()")}
          className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition text-sm"
        >
          snackbar.success()
        </button>
        <button
          onClick={() => snackbar.warning("Warning message with warning()")}
          className="px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition text-sm"
        >
          snackbar.warning()
        </button>
        <button
          onClick={() => snackbar.danger("Error message with danger()")}
          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm"
        >
          snackbar.danger()
        </button>
        <button
          onClick={() => snackbar.neutral("Neutral message with neutral()")}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm"
        >
          snackbar.neutral()
        </button>
      </div>
    </div>
  );
}

// ─── Batch Operations Demo ───────────────────────────────────────────────────

function BatchOperationsDemo() {
  const snackbar = useSnackbar();
  const [batchIds, setBatchIds] = useState<string[]>([]);

  const showBatch = () => {
    const ids: string[] = [];
    for (let i = 1; i <= 3; i++) {
      const id = snackbar.show({
        message: `Batch message ${i}`,
        description: `This is notification ${i} in the batch`,
        severity: "info",
        duration: 10000,
        persistent: true,
      });
      ids.push(id);
    }
    setBatchIds(ids);
  };

  const closeAll = () => {
    snackbar.closeAll();
    setBatchIds([]);
  };

  const closeFirst = () => {
    if (batchIds[0]) {
      snackbar.close(batchIds[0]);
      setBatchIds((prev) => prev.slice(1));
    }
  };

  return (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Batch Operations</h3>
      <p className="text-sm text-gray-500 mb-4">
        Programmatically control multiple snackbars
      </p>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={showBatch}
          className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition text-sm"
        >
          Show 3 Persistent Snackbars
        </button>
        <button
          onClick={closeFirst}
          disabled={batchIds.length === 0}
          className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Close First
        </button>
        <button
          onClick={closeAll}
          disabled={batchIds.length === 0}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Close All ({batchIds.length})
        </button>
      </div>
    </div>
  );
}

// ─── Update Demo ─────────────────────────────────────────────────────────────

function UpdateDemo() {
  const snackbar = useSnackbar();
  const [currentId, setCurrentId] = useState<string | null>(null);

  const showUpdatable = () => {
    const id = snackbar.show({
      message: "Download starting...",
      severity: "info",
      duration: 10000,
      persistent: true,
    });
    setCurrentId(id);

    // Simulate progress
    setTimeout(() => {
      snackbar.update(id, {
        message: "Downloading: 50% complete",
        description: "Please wait while we fetch your files",
      });
    }, 2000);

    setTimeout(() => {
      snackbar.update(id, {
        message: "Download complete!",
        description: "Your files are ready",
        severity: "success",
        persistent: false,
        duration: 3000,
      });
      setCurrentId(null);
    }, 4000);
  };

  return (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Dynamic Updates</h3>
      <p className="text-sm text-gray-500 mb-4">
        Update snackbar content, severity, and behavior in real-time
      </p>
      <button
        onClick={showUpdatable}
        disabled={currentId !== null}
        className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {currentId ? "Updating..." : "Show Download Progress"}
      </button>
    </div>
  );
}

// ─── Props Table ─────────────────────────────────────────────────────────────

function PropsTable() {
  return (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 overflow-x-auto">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">SnackbarItem Props</h3>
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
          <tr><td className="py-2 px-3 font-mono">message</td><td className="py-2 px-3">ReactNode</td><td className="py-2 px-3">required</td><td className="py-2 px-3">Main content of the snackbar</td></tr>
          <tr><td className="py-2 px-3 font-mono">description</td><td className="py-2 px-3">ReactNode</td><td className="py-2 px-3">-</td><td className="py-2 px-3">Optional secondary text</td></tr>
          <tr><td className="py-2 px-3 font-mono">severity</td><td className="py-2 px-3">info | success | warning | danger | neutral</td><td className="py-2 px-3">neutral</td><td className="py-2 px-3">Determines icon and color scheme</td></tr>
          <tr><td className="py-2 px-3 font-mono">variant</td><td className="py-2 px-3">default | filled | ghost | outline</td><td className="py-2 px-3">default</td><td className="py-2 px-3">Visual style of the snackbar</td></tr>
          <tr><td className="py-2 px-3 font-mono">size</td><td className="py-2 px-3">xs | sm | md | lg</td><td className="py-2 px-3">md</td><td className="py-2 px-3">Controls dimensions and typography</td></tr>
          <tr><td className="py-2 px-3 font-mono">position</td><td className="py-2 px-3">top-left | top-center | top-right | bottom-left | bottom-center | bottom-right</td><td className="py-2 px-3">bottom-right</td><td className="py-2 px-3">Where the snackbar appears</td></tr>
          <tr><td className="py-2 px-3 font-mono">duration</td><td className="py-2 px-3">number (ms)</td><td className="py-2 px-3">4000</td><td className="py-2 px-3">Auto-dismiss time. Ignored if persistent</td></tr>
          <tr><td className="py-2 px-3 font-mono">persistent</td><td className="py-2 px-3">boolean</td><td className="py-2 px-3">false</td><td className="py-2 px-3">If true, snackbar won't auto-dismiss</td></tr>
          <tr><td className="py-2 px-3 font-mono">closable</td><td className="py-2 px-3">boolean</td><td className="py-2 px-3">true</td><td className="py-2 px-3">Show/hide close button</td></tr>
          <tr><td className="py-2 px-3 font-mono">icon</td><td className="py-2 px-3">ReactNode</td><td className="py-2 px-3">-</td><td className="py-2 px-3">Custom icon (overrides severity icon)</td></tr>
          <tr><td className="py-2 px-3 font-mono">action</td><td className="py-2 px-3">SnackbarAction</td><td className="py-2 px-3">-</td><td className="py-2 px-3">Primary action button</td></tr>
          <tr><td className="py-2 px-3 font-mono">secondaryAction</td><td className="py-2 px-3">SnackbarAction</td><td className="py-2 px-3">-</td><td className="py-2 px-3">Secondary action button</td></tr>
          <tr><td className="py-2 px-3 font-mono">onClose</td><td className="py-2 px-3">()  void</td><td className="py-2 px-3">-</td><td className="py-2 px-3">Callback when snackbar closes</td></tr>
        </tbody>
      </table>
    </div>
  );
}

// ─── Main Showcase Page ──────────────────────────────────────────────────────

export default function SnackbarShowcase() {
  return (
    <SnackbarRoot
      defaultPosition="bottom-right"
      defaultDuration={4000}
      defaultSize="md"
      defaultVariant="default"
      maxVisible={5}
      pauseOnHover={true}
    >
      <div className="min-h-screen bg-white text-black">
        {/* Header */}
        <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Snackbar Component</h1>
            <p className="text-gray-500 mt-1">
              A comprehensive showcase of all snackbar variants, sizes, positions, and features
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Main Control Panel */}
          <ControlPanel />

          {/* Feature Showcases */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SizeShowcase />
            <VariantShowcase />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PositionShowcase />
            <ConvenienceMethodsDemo />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PromiseDemo />
            <UpdateDemo />
          </div>

          <BatchOperationsDemo />

          {/* Props Documentation */}
          <PropsTable />

          {/* Footer Note */}
          <div className="text-center text-sm text-gray-400 py-6 border-t border-gray-100">
            Snackbar System — Supports auto-dismiss, hover pause, promise tracking, batch operations, and dynamic updates
          </div>
        </div>
      </div>
    </SnackbarRoot>
  );
}