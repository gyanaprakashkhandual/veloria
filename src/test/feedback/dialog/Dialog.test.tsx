import React, { useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogActions,
  DialogDivider,
  FeedbackDialog,
  DialogProvider,
  useDialogContext,
  type DialogSize,
  type DialogVariant,
  type DialogPosition,
} from "../../../ui/feedback/dialog/Dialog.ui";

// ─── Helper Components ──────────────────────────────────────────────────────

function BasicDialogExample() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition text-sm"
      >
        Open Basic Dialog
      </button>

      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Basic Dialog"
        description="This is a simple dialog with basic functionality."
      >
        <DialogBody>
          <p>You can put any content here. The dialog handles the overlay, animations, and escape key events automatically.</p>
        </DialogBody>
        <DialogActions
          onConfirm={() => setIsOpen(false)}
          onCancel={() => setIsOpen(false)}
          confirmLabel="OK"
          cancelLabel="Cancel"
        />
      </Dialog>
    </div>
  );
}

function VariantShowcase() {
  const [openVariant, setOpenVariant] = useState<DialogVariant | null>(null);
  const variants: DialogVariant[] = ["default", "info", "success", "warning", "danger"];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {variants.map((variant) => (
        <button
          key={variant}
          onClick={() => setOpenVariant(variant)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
            variant === "default"
              ? "bg-gray-900 text-white hover:bg-gray-700"
              : variant === "info"
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : variant === "success"
              ? "bg-emerald-500 text-white hover:bg-emerald-600"
              : variant === "warning"
              ? "bg-amber-500 text-white hover:bg-amber-600"
              : "bg-red-500 text-white hover:bg-red-600"
          }`}
        >
          {variant}
        </button>
      ))}

      <FeedbackDialog
        isOpen={openVariant !== null}
        onClose={() => setOpenVariant(null)}
        title={`${openVariant?.charAt(0).toUpperCase()}${openVariant?.slice(1)} Dialog`}
        description={`This is a ${openVariant} variant dialog with appropriate icon and button styling.`}
        variant={openVariant || "default"}
        onConfirm={() => setOpenVariant(null)}
        confirmLabel="Confirm"
        cancelLabel="Cancel"
      />
    </div>
  );
}

function SizeShowcase() {
  const [openSize, setOpenSize] = useState<DialogSize | null>(null);
  const sizes: DialogSize[] = ["sm", "md", "lg", "xl", "full"];

  return (
    <div className="flex flex-wrap gap-3">
      {sizes.map((size) => (
        <button
          key={size}
          onClick={() => setOpenSize(size)}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition text-sm capitalize"
        >
          {size}
        </button>
      ))}

      <FeedbackDialog
        isOpen={openSize !== null}
        onClose={() => setOpenSize(null)}
        title={`${openSize?.toUpperCase()} Size Dialog`}
        description={`This dialog has the ${openSize} size configuration. The width changes based on the selected size.`}
        size={openSize || "md"}
        onConfirm={() => setOpenSize(null)}
      >
        <p className="text-sm text-gray-600 dark:text-gray-400">
          This is additional content inside the dialog body. The dialog automatically adjusts its padding and typography based on the size prop.
        </p>
      </FeedbackDialog>
    </div>
  );
}

function PositionShowcase() {
  const [openPosition, setOpenPosition] = useState<DialogPosition | null>(null);
  const positions: DialogPosition[] = ["center", "top", "bottom"];

  return (
    <div className="flex flex-wrap gap-3">
      {positions.map((position) => (
        <button
          key={position}
          onClick={() => setOpenPosition(position)}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition text-sm capitalize"
        >
          {position}
        </button>
      ))}

      <FeedbackDialog
        isOpen={openPosition !== null}
        onClose={() => setOpenPosition(null)}
        title={`${openPosition?.charAt(0).toUpperCase()}${openPosition?.slice(1)} Position Dialog`}
        description={`This dialog appears from the ${openPosition} of the screen.`}
        position={openPosition || "center"}
        onConfirm={() => setOpenPosition(null)}
      />
    </div>
  );
}

function CompoundComponentsShowcase() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition text-sm"
      >
        Open Compound Dialog
      </button>

      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        size="lg"
        variant="info"
      >
        <DialogHeader
          title="Compound Components"
          description="Using DialogHeader, DialogBody, and DialogFooter separately"
          showIcon
        />
        <DialogDivider />
        <DialogBody>
          <p className="mb-2">This dialog demonstrates the compound component pattern:</p>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <li>DialogHeader - Customizable title and description</li>
            <li>DialogDivider - Separator between sections</li>
            <li>DialogBody - Main content area</li>
            <li>DialogFooter - Action buttons with flexible alignment</li>
          </ul>
        </DialogBody>
        <DialogDivider />
        <DialogFooter align="right">
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm"
          >
            Cancel
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm"
          >
            Confirm
          </button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

function CustomFooterShowcase() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition text-sm"
      >
        Open Custom Footer Dialog
      </button>

      <FeedbackDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Custom Footer"
        description="This dialog uses a completely custom footer with multiple action buttons."
        footer={
          <div className="flex flex-wrap gap-3 justify-between items-center">
            <div className="flex gap-2">
              <button className="text-xs text-gray-400 hover:text-gray-600">Learn More</button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition text-sm"
              >
                Save Changes
              </button>
            </div>
          </div>
        }
      />
    </div>
  );
}

function LoadingStateShowcase() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsOpen(false);
    }, 2000);
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition text-sm"
      >
        Open Loading Dialog
      </button>

      <FeedbackDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Confirm Action"
        description="This action may take a few seconds to complete."
        onConfirm={handleConfirm}
        isLoading={isLoading}
        confirmLabel={isLoading ? "Processing..." : "Confirm"}
        cancelLabel="Cancel"
      >
        <p className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 p-3 rounded-lg">
          ⚠️ This action cannot be undone. Please confirm you want to proceed.
        </p>
      </FeedbackDialog>
    </div>
  );
}

function FormDialogShowcase() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleConfirm = () => {
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsOpen(false);
      setFormData({ name: "", email: "" });
    }, 1500);
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition text-sm"
      >
        Open Form Dialog
      </button>

      <FeedbackDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="User Information"
        description="Please fill out the form below"
        onConfirm={handleConfirm}
        confirmLabel={submitted ? "Submitted!" : "Submit"}
        cancelLabel="Cancel"
        isLoading={submitted}
      >
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="Enter your email"
            />
          </div>
          {submitted && (
            <p className="text-xs text-emerald-600 dark:text-emerald-400">✓ Form submitted successfully!</p>
          )}
        </div>
      </FeedbackDialog>
    </div>
  );
}

function NonDismissibleShowcase() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition text-sm"
      >
        Open Non-Dismissible Dialog
      </button>

      <FeedbackDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Important Notice"
        description="This dialog cannot be dismissed by clicking the overlay or pressing Escape."
        isDismissible={false}
        onConfirm={() => setIsOpen(false)}
        confirmLabel="I Understand"
        showIcon
        variant="warning"
      >
        <p className="text-sm text-gray-600 dark:text-gray-400">
          You must click the confirm button to close this dialog. This is useful for
          critical actions or important information that requires user acknowledgment.
        </p>
      </FeedbackDialog>
    </div>
  );
}

function ProviderControlledShowcase() {
  const [isOpen, setIsOpen] = useState(false);
  const [variant, setVariant] = useState<DialogVariant>("default");
  const [size, setSize] = useState<DialogSize>("md");

  return (
    <DialogProvider>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-3 items-center">
          <button
            onClick={() => setIsOpen(true)}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition text-sm"
          >
            Open Provider Dialog
          </button>

          <select
            value={variant}
            onChange={(e) => setVariant(e.target.value as DialogVariant)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="default">Default Variant</option>
            <option value="info">Info Variant</option>
            <option value="success">Success Variant</option>
            <option value="warning">Warning Variant</option>
            <option value="danger">Danger Variant</option>
          </select>

          <select
            value={size}
            onChange={(e) => setSize(e.target.value as DialogSize)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
            <option value="xl">Extra Large</option>
            <option value="full">Full Width</option>
          </select>
        </div>

        <FeedbackDialog
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Provider Controlled Dialog"
          description={`This dialog uses variant: ${variant} and size: ${size}`}
          variant={variant}
          size={size}
          onConfirm={() => setIsOpen(false)}
        >
          <p className="text-sm text-gray-600 dark:text-gray-400">
            The dialog state is controlled by the context provider, but the visual
            properties are passed as props to the FeedbackDialog component.
          </p>
        </FeedbackDialog>
      </div>
    </DialogProvider>
  );
}

// ─── Props Table ──────────────────────────────────────────────────────────────

function PropsTable() {
  return (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 overflow-x-auto">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Component Props</h3>

      <h4 className="text-md font-semibold text-gray-700 mb-2 mt-4">FeedbackDialog Props</h4>
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
          <tr><td className="py-2 px-3 font-mono">isOpen</td><td className="py-2 px-3">boolean</td><td className="py-2 px-3">required</td><td className="py-2 px-3">Controls dialog visibility</td></tr>
          <tr><td className="py-2 px-3 font-mono">onClose</td><td className="py-2 px-3">()  void</td><td className="py-2 px-3">required</td><td className="py-2 px-3">Callback when dialog closes</td></tr>
          <tr><td className="py-2 px-3 font-mono">title</td><td className="py-2 px-3">string</td><td className="py-2 px-3">required</td><td className="py-2 px-3">Dialog title text</td></tr>
          <tr><td className="py-2 px-3 font-mono">description</td><td className="py-2 px-3">string</td><td className="py-2 px-3">-</td><td className="py-2 px-3">Optional description text</td></tr>
          <tr><td className="py-2 px-3 font-mono">size</td><td className="py-2 px-3">sm | md | lg | xl | full</td><td className="py-2 px-3">md</td><td className="py-2 px-3">Dialog width</td></tr>
          <tr><td className="py-2 px-3 font-mono">variant</td><td className="py-2 px-3">default | info | success | warning | danger</td><td className="py-2 px-3">default</td><td className="py-2 px-3">Visual style and icon</td></tr>
          <tr><td className="py-2 px-3 font-mono">position</td><td className="py-2 px-3">center | top | bottom</td><td className="py-2 px-3">center</td><td className="py-2 px-3">Dialog position on screen</td></tr>
          <tr><td className="py-2 px-3 font-mono">isDismissible</td><td className="py-2 px-3">boolean</td><td className="py-2 px-3">true</td><td className="py-2 px-3">Allow close via overlay/Escape</td></tr>
          <tr><td className="py-2 px-3 font-mono">confirmLabel</td><td className="py-2 px-3">string</td><td className="py-2 px-3">Confirm</td><td className="py-2 px-3">Confirm button text</td></tr>
          <tr><td className="py-2 px-3 font-mono">cancelLabel</td><td className="py-2 px-3">string</td><td className="py-2 px-3">Cancel</td><td className="py-2 px-3">Cancel button text</td></tr>
          <tr><td className="py-2 px-3 font-mono">onConfirm</td><td className="py-2 px-3">()  void</td><td className="py-2 px-3">-</td><td className="py-2 px-3">Confirm button callback</td></tr>
          <tr><td className="py-2 px-3 font-mono">isLoading</td><td className="py-2 px-3">boolean</td><td className="py-2 px-3">false</td><td className="py-2 px-3">Show loading spinner on confirm</td></tr>
          <tr><td className="py-2 px-3 font-mono">showIcon</td><td className="py-2 px-3">boolean</td><td className="py-2 px-3">true</td><td className="py-2 px-3">Show variant icon in header</td></tr>
          <tr><td className="py-2 px-3 font-mono">footerAlign</td><td className="py-2 px-3">left | center | right | between</td><td className="py-2 px-3">right</td><td className="py-2 px-3">Action button alignment</td></tr>
          <tr><td className="py-2 px-3 font-mono">showDividers</td><td className="py-2 px-3">boolean</td><td className="py-2 px-3">false</td><td className="py-2 px-3">Show separator lines</td></tr>
          <tr><td className="py-2 px-3 font-mono">footer</td><td className="py-2 px-3">ReactNode</td><td className="py-2 px-3">-</td><td className="py-2 px-3">Custom footer content</td></tr>
        </tbody>
      </table>

      <h4 className="text-md font-semibold text-gray-700 mb-2">Compound Components</h4>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-2 px-3 font-semibold text-gray-700">Component</th>
            <th className="text-left py-2 px-3 font-semibold text-gray-700">Description</th>
           </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          <tr><td className="py-2 px-3 font-mono">DialogHeader</td><td className="py-2 px-3">Title, description, and close button</td></tr>
          <tr><td className="py-2 px-3 font-mono">DialogBody</td><td className="py-2 px-3">Main content area</td></tr>
          <tr><td className="py-2 px-3 font-mono">DialogFooter</td><td className="py-2 px-3">Container for action buttons</td></tr>
          <tr><td className="py-2 px-3 font-mono">DialogActions</td><td className="py-2 px-3">Pre-built confirm/cancel buttons</td></tr>
          <tr><td className="py-2 px-3 font-mono">DialogDivider</td><td className="py-2 px-3">Separator line</td></tr>
        </tbody>
      </table>
    </div>
  );
}

// ─── Main Showcase Page ──────────────────────────────────────────────────────

export default function DialogShowcase() {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Dialog Components</h1>
          <p className="text-gray-500 mt-1">
            A comprehensive showcase of all dialog variants, sizes, positions, and features
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Basic Dialog */}
        <section className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Basic Dialog</h2>
          <BasicDialogExample />
        </section>

        {/* Variants */}
        <section className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Variants</h2>
          <VariantShowcase />
        </section>

        {/* Sizes */}
        <section className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Sizes</h2>
          <SizeShowcase />
        </section>

        {/* Positions */}
        <section className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Positions</h2>
          <PositionShowcase />
        </section>

        {/* Compound Components */}
        <section className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Compound Components</h2>
          <CompoundComponentsShowcase />
        </section>

        {/* Custom Footer */}
        <section className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Custom Footer</h2>
          <CustomFooterShowcase />
        </section>

        {/* Loading State */}
        <section className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Loading State</h2>
          <LoadingStateShowcase />
        </section>

        {/* Form Dialog */}
        <section className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Form Dialog</h2>
          <FormDialogShowcase />
        </section>

        {/* Non-Dismissible */}
        <section className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Non-Dismissible Dialog</h2>
          <NonDismissibleShowcase />
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
          Dialog System — Supports multiple variants, sizes, positions, loading states, and compound component patterns
        </div>
      </div>
    </div>
  );
}