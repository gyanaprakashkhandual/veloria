import React, { useState } from "react";
import {
  Message,
  MessageTrigger,
  MessageProvider,
  useMessageContext,
  type MessageVariant,
  type MessageSize,
  type MessagePosition,
  type MessageLayout,
  type MessageAction,
} from "../../../ui/feedback/message/Message.ui";

// ─── Helper Components ──────────────────────────────────────────────────────

function InlineMessageDemo() {
  const [visible, setVisible] = useState(true);
  const [variant, setVariant] = useState<MessageVariant>("info");
  const [size, setSize] = useState<MessageSize>("md");
  const [layout, setLayout] = useState<MessageLayout>("row");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <select
          value={variant}
          onChange={(e) => setVariant(e.target.value as MessageVariant)}
          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
        >
          <option value="default">Default</option>
          <option value="info">Info</option>
          <option value="success">Success</option>
          <option value="warning">Warning</option>
          <option value="danger">Danger</option>
        </select>
        <select
          value={size}
          onChange={(e) => setSize(e.target.value as MessageSize)}
          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
        >
          <option value="sm">Small</option>
          <option value="md">Medium</option>
          <option value="lg">Large</option>
          <option value="xl">Extra Large</option>
        </select>
        <select
          value={layout}
          onChange={(e) => setLayout(e.target.value as MessageLayout)}
          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
        >
          <option value="row">Row Layout</option>
          <option value="stack">Stack Layout</option>
        </select>
        <button
          onClick={() => setVisible(!visible)}
          className="px-4 py-1.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition text-sm"
        >
          {visible ? "Hide" : "Show"}
        </button>
      </div>
      {visible && (
        <Message
          title="Inline Message"
          description="This message appears inline within the content flow, not as a fixed overlay."
          variant={variant}
          size={size}
          layout={layout}
          position="inline"
          isDismissible
          onHide={() => setVisible(false)}
        />
      )}
    </div>
  );
}

function PositionShowcase() {
  const [activePosition, setActivePosition] = useState<MessagePosition | null>(null);
  const positions: MessagePosition[] = [
    "top-left", "top-center", "top-right",
    "bottom-left", "bottom-center", "bottom-right",
  ];

  const showPositionMessage = (position: MessagePosition) => {
    setActivePosition(position);
    setTimeout(() => setActivePosition(null), 3000);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {positions.map((position) => (
          <button
            key={position}
            onClick={() => showPositionMessage(position)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm capitalize"
          >
            {position.replace("-", " ")}
          </button>
        ))}
      </div>
      {activePosition && (
        <Message
          title={`Message at ${activePosition.replace("-", " ")}`}
          description="This message will auto-hide after 3 seconds."
          variant="info"
          position={activePosition}
          autoHide
          autoHideDuration={3000}
          onHide={() => setActivePosition(null)}
        />
      )}
    </div>
  );
}

function ActionButtonsDemo() {
  const [actionResult, setActionResult] = useState<string | null>(null);
  const [visible, setVisible] = useState(true);

  const actions: MessageAction[] = [
    {
      id: "undo",
      label: "Undo",
      onClick: () => setActionResult("Undo action triggered"),
      variant: "ghost",
    },
    {
      id: "view",
      label: "View Details",
      onClick: () => setActionResult("View details clicked"),
      variant: "primary",
    },
    {
      id: "dismiss",
      label: "Dismiss",
      onClick: () => setActionResult("Dismissed via action"),
      variant: "outline",
    },
  ];

  return (
    <div className="space-y-4">
      {actionResult && (
        <div className="bg-gray-100 rounded-lg p-3 text-sm text-gray-700">
          Action: {actionResult}
          <button
            onClick={() => setActionResult(null)}
            className="ml-3 text-xs text-gray-400 hover:text-gray-600"
          >
            Clear
          </button>
        </div>
      )}
      {visible && (
        <Message
          title="Message with Actions"
          description="This message includes multiple action buttons with different variants."
          variant="default"
          actions={actions}
          isDismissible
          onHide={() => setVisible(false)}
        />
      )}
      {!visible && (
        <button
          onClick={() => setVisible(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm"
        >
          Show Message Again
        </button>
      )}
    </div>
  );
}

function ModalDemo() {
  const [modalResult, setModalResult] = useState<string | null>(null);
  const [visible, setVisible] = useState(true);

  const modalProps = {
    title: "Confirm Action",
    description: "Are you sure you want to proceed with this action? This cannot be undone.",
    confirmLabel: "Yes, Proceed",
    cancelLabel: "Cancel",
    onConfirm: () => {
      setModalResult("Confirmed! Action was successful.");
    },
    onCancel: () => {
      setModalResult("Action cancelled by user.");
    },
    footerAlign: "right" as const,
  };

  return (
    <div className="space-y-4">
      {modalResult && (
        <div className={`rounded-lg p-3 text-sm ${modalResult.includes("Confirmed") ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-700"}`}>
          {modalResult}
          <button
            onClick={() => setModalResult(null)}
            className="ml-3 text-xs text-gray-400 hover:text-gray-600"
          >
            Clear
          </button>
        </div>
      )}
      {visible && (
        <Message
          title="Message with Modal"
          description="Click the 'View Details' button to open a confirmation modal."
          variant="warning"
          modalProps={modalProps}
          isDismissible
          onHide={() => setVisible(false)}
        />
      )}
      {!visible && (
        <button
          onClick={() => setVisible(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm"
        >
          Show Message Again
        </button>
      )}
    </div>
  );
}

function AutoHideDemo() {
  const [autoHideVisible, setAutoHideVisible] = useState(true);
  const [duration, setDuration] = useState(3000);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label className="text-sm text-gray-600">Auto-hide duration:</label>
        <select
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
        >
          <option value={2000}>2 seconds</option>
          <option value={3000}>3 seconds</option>
          <option value={5000}>5 seconds</option>
          <option value={8000}>8 seconds</option>
        </select>
      </div>
      {autoHideVisible && (
        <Message
          title="Auto-hiding Message"
          description={`This message will automatically disappear after ${duration / 1000} seconds.`}
          variant="success"
          autoHide
          autoHideDuration={duration}
          onHide={() => setAutoHideVisible(false)}
        />
      )}
      {!autoHideVisible && (
        <button
          onClick={() => setAutoHideVisible(true)}
          className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition text-sm"
        >
          Show Auto-hide Message
        </button>
      )}
    </div>
  );
}

function CustomContentDemo() {
  const [visible, setVisible] = useState(true);

  return (
    <div className="space-y-4">
      {visible && (
        <Message
          title="Upload Progress"
          description="Your files are being uploaded to the server."
          variant="info"
          isDismissible
          onHide={() => setVisible(false)}
        >
          <div className="mt-2">
            <div className="flex justify-between text-xs mb-1">
              <span>File1.pdf</span>
              <span>45%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div className="bg-blue-500 h-1.5 rounded-full w-[45%]" />
            </div>
            <div className="flex justify-between text-xs mt-2 mb-1">
              <span>File2.jpg</span>
              <span>78%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div className="bg-blue-500 h-1.5 rounded-full w-[78%]" />
            </div>
          </div>
        </Message>
      )}
    </div>
  );
}

function MessageTriggerDemo() {
  return (
    <div className="space-y-4">
      <MessageTrigger
        trigger={
          <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition text-sm">
            Click to Toggle Message
          </button>
        }
        title="Triggered Message"
        description="This message appears when you click the button above. Click the button again to dismiss it."
        variant="info"
        size="md"
        layout="row"
        isDismissible={false}
      />
      <p className="text-xs text-gray-400">
        The MessageTrigger component wraps a trigger element and toggles an inline message below it.
      </p>
    </div>
  );
}

function ControlledMessageDemo() {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState({ title: "", description: "", variant: "info" as MessageVariant });

  const showMessage = (variant: MessageVariant, title: string, description: string) => {
    setMessage({ title, description, variant });
    setIsVisible(true);
    setTimeout(() => setIsVisible(false), 4000);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => showMessage("success", "Success!", "Operation completed successfully.")}
          className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition text-sm"
        >
          Show Success
        </button>
        <button
          onClick={() => showMessage("danger", "Error!", "Something went wrong. Please try again.")}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
        >
          Show Error
        </button>
        <button
          onClick={() => showMessage("warning", "Warning!", "Please review your input before submitting.")}
          className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition text-sm"
        >
          Show Warning
        </button>
        <button
          onClick={() => showMessage("info", "Info", "New update available. Refresh to apply.")}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm"
        >
          Show Info
        </button>
      </div>
      {isVisible && (
        <Message
          title={message.title}
          description={message.description}
          variant={message.variant}
          position="inline"
          autoHide
          autoHideDuration={4000}
          onHide={() => setIsVisible(false)}
        />
      )}
    </div>
  );
}

function ProviderControlledDemo() {
  const [providerVariant, setProviderVariant] = useState<MessageVariant>("info");
  const [showProviderMessage, setShowProviderMessage] = useState(true);

  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
      <div className="flex flex-wrap gap-3 items-center mb-4">
        <select
          value={providerVariant}
          onChange={(e) => setProviderVariant(e.target.value as MessageVariant)}
          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white"
        >
          <option value="default">Default</option>
          <option value="info">Info</option>
          <option value="success">Success</option>
          <option value="warning">Warning</option>
          <option value="danger">Danger</option>
        </select>
        <button
          onClick={() => setShowProviderMessage(!showProviderMessage)}
          className="px-4 py-1.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition text-sm"
        >
          {showProviderMessage ? "Hide" : "Show"}
        </button>
      </div>
      {showProviderMessage && (
        <MessageProvider variant={providerVariant} size="md" position="inline" layout="row" isDismissible>
          <ProviderMessageContent />
        </MessageProvider>
      )}
    </div>
  );
}

function ProviderMessageContent() {
  const { state, hide, show, toggle, openModal, closeModal } = useMessageContext();

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button onClick={show} className="px-3 py-1 bg-green-500 text-white rounded text-sm">Show</button>
        <button onClick={hide} className="px-3 py-1 bg-red-500 text-white rounded text-sm">Hide</button>
        <button onClick={toggle} className="px-3 py-1 bg-blue-500 text-white rounded text-sm">Toggle</button>
        {state.hasModal && (
          <>
            <button onClick={openModal} className="px-3 py-1 bg-purple-500 text-white rounded text-sm">Open Modal</button>
            <button onClick={closeModal} className="px-3 py-1 bg-orange-500 text-white rounded text-sm">Close Modal</button>
          </>
        )}
      </div>
      <div className="text-xs text-gray-500">
        Status: {state.isVisible ? "Visible" : "Hidden"} | Modal: {state.isModalOpen ? "Open" : "Closed"}
      </div>
      {state.isVisible && (
        <div className="mt-2">
          <MessageInnerContent />
        </div>
      )}
    </div>
  );
}

function MessageInnerContent() {
  const { state } = useMessageContext();
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <p className="font-medium text-gray-800">Provider-controlled Message</p>
      <p className="text-sm text-gray-500 mt-1">
        This message is controlled by the MessageProvider context. The variant is set to:{" "}
        <span className="font-mono text-xs bg-gray-100 px-1 rounded">{state.variant}</span>
      </p>
    </div>
  );
}

// ─── Props Table ──────────────────────────────────────────────────────────────

function PropsTable() {
  return (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 overflow-x-auto">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Message Component Props</h3>
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
          <tr><td className="py-2 px-3 font-mono">title</td><td className="py-2 px-3">string</td><td className="py-2 px-3">required</td><td className="py-2 px-3">Main heading of the message</td></tr>
          <tr><td className="py-2 px-3 font-mono">description</td><td className="py-2 px-3">string</td><td className="py-2 px-3">-</td><td className="py-2 px-3">Optional secondary text</td></tr>
          <tr><td className="py-2 px-3 font-mono">variant</td><td className="py-2 px-3">default | info | success | warning | danger</td><td className="py-2 px-3">default</td><td className="py-2 px-3">Color scheme and icon</td></tr>
          <tr><td className="py-2 px-3 font-mono">size</td><td className="py-2 px-3">sm | md | lg | xl</td><td className="py-2 px-3">md</td><td className="py-2 px-3">Controls dimensions and typography</td></tr>
          <tr><td className="py-2 px-3 font-mono">position</td><td className="py-2 px-3">inline | top-left | top-center | top-right | bottom-left | bottom-center | bottom-right</td><td className="py-2 px-3">inline</td><td className="py-2 px-3">Where the message appears</td></tr>
          <tr><td className="py-2 px-3 font-mono">layout</td><td className="py-2 px-3">row | stack</td><td className="py-2 px-3">row</td><td className="py-2 px-3">Arrangement of content and actions</td></tr>
          <tr><td className="py-2 px-3 font-mono">isDismissible</td><td className="py-2 px-3">boolean</td><td className="py-2 px-3">true</td><td className="py-2 px-3">Show/hide close button</td></tr>
          <tr><td className="py-2 px-3 font-mono">showIcon</td><td className="py-2 px-3">boolean</td><td className="py-2 px-3">true</td><td className="py-2 px-3">Show/hide variant icon</td></tr>
          <tr><td className="py-2 px-3 font-mono">showAccentBar</td><td className="py-2 px-3">boolean</td><td className="py-2 px-3">true</td><td className="py-2 px-3">Show left accent bar</td></tr>
          <tr><td className="py-2 px-3 font-mono">actions</td><td className="py-2 px-3">MessageAction[]</td><td className="py-2 px-3">[]</td><td className="py-2 px-3">Array of action buttons</td></tr>
          <tr><td className="py-2 px-3 font-mono">modalProps</td><td className="py-2 px-3">MessageModalProps</td><td className="py-2 px-3">-</td><td className="py-2 px-3">Configuration for modal dialog</td></tr>
          <tr><td className="py-2 px-3 font-mono">autoHide</td><td className="py-2 px-3">boolean</td><td className="py-2 px-3">false</td><td className="py-2 px-3">Auto-dismiss after duration</td></tr>
          <tr><td className="py-2 px-3 font-mono">autoHideDuration</td><td className="py-2 px-3">number (ms)</td><td className="py-2 px-3">5000</td><td className="py-2 px-3">Duration for auto-hide</td></tr>
          <tr><td className="py-2 px-3 font-mono">children</td><td className="py-2 px-3">ReactNode</td><td className="py-2 px-3">-</td><td className="py-2 px-3">Custom content (e.g., progress bars)</td></tr>
        </tbody>
      </table>
    </div>
  );
}

// ─── Main Showcase Page ──────────────────────────────────────────────────────

export default function MessageShowcase() {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Message Component</h1>
          <p className="text-gray-500 mt-1">
            A comprehensive showcase of all message variants, sizes, positions, and features
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Variants Showcase */}
        <section className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Variants</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Message title="Default Message" description="Neutral message for general information." variant="default" position="inline" />
            <Message title="Info Message" description="Informational message with helpful tips." variant="info" position="inline" />
            <Message title="Success Message" description="Operation completed successfully!" variant="success" position="inline" />
            <Message title="Warning Message" description="Please review this before proceeding." variant="warning" position="inline" />
            <Message title="Danger Message" description="An error occurred while processing." variant="danger" position="inline" />
          </div>
        </section>

        {/* Sizes Showcase */}
        <section className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Sizes</h2>
          <div className="space-y-3">
            <Message title="Small Message" description="Compact size for minimal spaces." size="sm" variant="info" position="inline" />
            <Message title="Medium Message" description="Default size for standard use cases." size="md" variant="info" position="inline" />
            <Message title="Large Message" description="More prominent with larger text." size="lg" variant="info" position="inline" />
            <Message title="Extra Large Message" description="Maximum emphasis for important messages." size="xl" variant="info" position="inline" />
          </div>
        </section>

        {/* Layout Showcase */}
        <section className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Layouts</h2>
          <div className="space-y-4">
            <Message title="Row Layout" description="Content and actions arranged horizontally." layout="row" variant="default" position="inline" />
            <Message title="Stack Layout" description="Content and actions arranged vertically." layout="stack" variant="default" position="inline" />
          </div>
        </section>

        {/* Positions Showcase */}
        <section className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Fixed Positions</h2>
          <p className="text-sm text-gray-500 mb-4">These messages appear as fixed overlays and auto-hide after 3 seconds.</p>
          <PositionShowcase />
        </section>

        {/* Inline Message Demo */}
        <section className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Inline Message</h2>
          <p className="text-sm text-gray-500 mb-4">Inline messages appear within the content flow.</p>
          <InlineMessageDemo />
        </section>

        {/* Action Buttons */}
        <section className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Action Buttons</h2>
          <ActionButtonsDemo />
        </section>

        {/* Modal Integration */}
        <section className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Modal Integration</h2>
          <ModalDemo />
        </section>

        {/* Auto-hide Demo */}
        <section className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Auto-hide Messages</h2>
          <AutoHideDemo />
        </section>

        {/* Custom Content */}
        <section className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Custom Content</h2>
          <p className="text-sm text-gray-500 mb-4">You can render any custom content inside the message body.</p>
          <CustomContentDemo />
        </section>

        {/* MessageTrigger */}
        <section className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">MessageTrigger Component</h2>
          <MessageTriggerDemo />
        </section>

        {/* Controlled Messages */}
        <section className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Controlled Messages</h2>
          <p className="text-sm text-gray-500 mb-4">Programmatically control message visibility.</p>
          <ControlledMessageDemo />
        </section>

        {/* Provider Controlled */}
        <section className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Provider-controlled Message</h2>
          <p className="text-sm text-gray-500 mb-4">Use MessageProvider to control message state via context.</p>
          <ProviderControlledDemo />
        </section>

        {/* Props Table */}
        <PropsTable />

        {/* Footer */}
        <div className="text-center text-sm text-gray-400 py-6 border-t border-gray-100">
          Message System — Supports multiple variants, sizes, positions, actions, modals, and auto-hide functionality
        </div>
      </div>
    </div>
  );
}