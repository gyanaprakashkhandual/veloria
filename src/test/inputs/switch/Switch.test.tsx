import React, { useState } from "react";
import {
  Switch,
  SwitchGroup,
  IconSwitch,
  CardSwitch,
  InlineLabelSwitch,
  SwitchProvider,
  useSwitchContext,
  type SwitchSize,
  type SwitchVariant,
  type SwitchShape,
} from "../../../ui/inputs/switch/Switch.ui";

// ─── Helper Components ──────────────────────────────────────────────────────

function VariantShowcase() {
  const [solidChecked, setSolidChecked] = useState(false);
  const [outlineChecked, setOutlineChecked] = useState(false);
  const [softChecked, setSoftChecked] = useState(false);
  const [ghostChecked, setGhostChecked] = useState(false);

  const variants: { variant: SwitchVariant; checked: boolean; setChecked: (v: boolean) => void }[] = [
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
          <Switch
            variant={variant}
            checked={checked}
            onChange={setChecked}
            label={`${variant.charAt(0).toUpperCase() + variant.slice(1)} Switch`}
            description={`This is a ${variant} variant switch`}
          />
          <p className="text-xs text-gray-500">State: {checked ? "ON" : "OFF"}</p>
        </div>
      ))}
    </div>
  );
}

function SizeShowcase() {
  const sizes: SwitchSize[] = ["2xs", "xs", "sm", "md", "lg", "xl", "2xl"];
  const [checkedStates, setCheckedStates] = useState<Record<SwitchSize, boolean>>({
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
          <Switch
            size={size}
            checked={checkedStates[size]}
            onChange={(val) => setCheckedStates((prev) => ({ ...prev, [size]: val }))}
            label={`${size.toUpperCase()} Switch`}
          />
        </div>
      ))}
    </div>
  );
}

function ShapeShowcase() {
  const shapes: SwitchShape[] = ["pill", "rounded", "square"];
  const [checkedStates, setCheckedStates] = useState<Record<SwitchShape, boolean>>({
    pill: false,
    rounded: false,
    square: false,
  });

  return (
    <div className="flex flex-wrap gap-8">
      {shapes.map((shape) => (
        <div key={shape} className="space-y-3 text-center">
          <h4 className="text-sm font-semibold text-gray-700 capitalize">{shape}</h4>
          <Switch
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
        <Switch
          labelPlacement="right"
          label="Wi-Fi Settings"
          description="Connect to wireless networks"
          checked={rightChecked}
          onChange={setRightChecked}
        />
      </div>
      <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700">Label Left</h4>
        <Switch
          labelPlacement="left"
          label="Dark Mode"
          description="Enable dark theme across the app"
          checked={leftChecked}
          onChange={setLeftChecked}
        />
      </div>
    </div>
  );
}

function LoadingStateShowcase() {
  const [loadingChecked, setLoadingChecked] = useState(false);
  const [loadingEnabled, setLoadingEnabled] = useState(true);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Switch
          loading={loadingEnabled}
          checked={loadingChecked}
          onChange={setLoadingChecked}
          label="Loading State Switch"
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
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-gray-700">Disabled Switch</h4>
        <Switch disabled label="Disabled Switch" description="This switch cannot be interacted with" />
      </div>
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-gray-700">Disabled but Checked</h4>
        <Switch
          disabled
          checked={disabledChecked}
          onChange={setDisabledChecked}
          label="Disabled Checked Switch"
          description="This switch is disabled and checked"
        />
      </div>
    </div>
  );
}

function SwitchGroupShowcase() {
  const [groupValues, setGroupValues] = useState({
    notifications: true,
    emailAlerts: false,
    smsAlerts: true,
    pushNotifications: false,
  });

  return (
    <div className="space-y-6">
      <SwitchGroup
        values={groupValues}
        onChange={setGroupValues}
        label="Notification Preferences"
        description="Choose how you want to receive updates"
        orientation="vertical"
      >
        <Switch name="notifications" label="Enable Notifications" description="Receive all notifications" />
        <Switch name="emailAlerts" label="Email Alerts" description="Get updates via email" />
        <Switch name="smsAlerts" label="SMS Alerts" description="Get updates via text message" />
        <Switch name="pushNotifications" label="Push Notifications" description="Browser push notifications" />
      </SwitchGroup>

      <div className="bg-gray-100 rounded-lg p-3">
        <p className="text-xs text-gray-600 font-mono">Current State: {JSON.stringify(groupValues)}</p>
      </div>
    </div>
  );
}

function IconSwitchShowcase() {
  const [darkMode, setDarkMode] = useState(false);
  const [muted, setMuted] = useState(true);
  const [wifiEnabled, setWifiEnabled] = useState(false);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="space-y-3 text-center p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700">Dark Mode</h4>
        <IconSwitch
          iconOff={
            <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
          iconOn={
            <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          }
          checked={darkMode}
          onChange={setDarkMode}
          aria-label="Toggle dark mode"
        />
        <p className="text-xs text-gray-500">{darkMode ? "Dark mode on" : "Light mode on"}</p>
      </div>

      <div className="space-y-3 text-center p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700">Volume</h4>
        <IconSwitch
          iconOff={
            <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          }
          iconOn={
            <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          }
          checked={muted}
          onChange={setMuted}
          aria-label="Toggle mute"
        />
        <p className="text-xs text-gray-500">{muted ? "Muted" : "Unmuted"}</p>
      </div>

      <div className="space-y-3 text-center p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700">Wi-Fi</h4>
        <IconSwitch
          iconOff={
            <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a5 5 0 010-7.072m0 0l-2.829 2.829M5.636 5.636a9 9 0 00-1.414 1.414" />
            </svg>
          }
          iconOn={
            <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
            </svg>
          }
          checked={wifiEnabled}
          onChange={setWifiEnabled}
          aria-label="Toggle Wi-Fi"
        />
        <p className="text-xs text-gray-500">{wifiEnabled ? "Wi-Fi on" : "Wi-Fi off"}</p>
      </div>
    </div>
  );
}

function CardSwitchShowcase() {
  const [selectedPlan, setSelectedPlan] = useState("basic");

  return (
    <div className="space-y-4">
      <CardSwitch
        title="Basic Plan"
        subtitle="$10/month - Essential features for individuals"
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        }
        checked={selectedPlan === "basic"}
        onChange={() => setSelectedPlan("basic")}
      />
      <CardSwitch
        title="Pro Plan"
        subtitle="$20/month - Advanced features for teams"
        badge="Popular"
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        }
        checked={selectedPlan === "pro"}
        onChange={() => setSelectedPlan("pro")}
      />
      <CardSwitch
        title="Enterprise Plan"
        subtitle="Custom pricing - Full platform access"
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21h18M3 10h18M5 6l7-3 7 3M5 10v10m14-10v10M9 21h6" />
          </svg>
        }
        checked={selectedPlan === "enterprise"}
        onChange={() => setSelectedPlan("enterprise")}
      />
      <div className="bg-gray-100 rounded-lg p-3 mt-3">
        <p className="text-sm text-gray-700">Selected Plan: <span className="font-semibold capitalize">{selectedPlan}</span></p>
      </div>
    </div>
  );
}

function InlineLabelSwitchShowcase() {
  const [notifications, setNotifications] = useState(true);
  const [autoUpdate, setAutoUpdate] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <span className="text-sm font-medium text-gray-700">Notifications</span>
        <InlineLabelSwitch
          labelOn="ON"
          labelOff="OFF"
          checked={notifications}
          onChange={setNotifications}
        />
      </div>
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <span className="text-sm font-medium text-gray-700">Auto-update Apps</span>
        <InlineLabelSwitch
          labelOn="ON"
          labelOff="OFF"
          checked={autoUpdate}
          onChange={setAutoUpdate}
        />
      </div>
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <span className="text-sm font-medium text-gray-700">Two-Factor Authentication</span>
        <InlineLabelSwitch
          labelOn="ON"
          labelOff="OFF"
          size="lg"
          checked={twoFactor}
          onChange={setTwoFactor}
        />
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
        <p className="text-xs text-blue-600 mt-1">Value is managed by React state: {controlledValue ? "ON" : "OFF"}</p>
      </div>

      <Switch
        checked={controlledValue}
        onChange={(val) => {
          setControlledValue(val);
          setLastAction(`Changed to: ${val ? "ON" : "OFF"}`);
        }}
        label="Controlled Switch"
        description="External state management"
      />

      <div className="flex gap-3">
        <button
          onClick={() => {
            setControlledValue(true);
            setLastAction("Set to ON via button");
          }}
          className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition"
        >
          Set ON
        </button>
        <button
          onClick={() => {
            setControlledValue(false);
            setLastAction("Set to OFF via button");
          }}
          className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition"
        >
          Set OFF
        </button>
      </div>

      {lastAction && (
        <div className="text-xs text-gray-500 bg-gray-100 rounded-lg p-2">
          Last action: {lastAction}
        </div>
      )}

      <div className="border-t border-gray-200 pt-4">
        <p className="text-sm text-gray-600 mb-3">Uncontrolled Component</p>
        <Switch
          defaultChecked={true}
          label="Uncontrolled Switch"
          description="Internal state management"
        />
      </div>
    </div>
  );
}

// ─── Props Table ──────────────────────────────────────────────────────────────

function PropsTable() {
  return (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 overflow-x-auto">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Component Props</h3>

      <h4 className="text-md font-semibold text-gray-700 mb-2 mt-4">Switch Props</h4>
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
          <tr><td className="py-2 px-3 font-mono">size</td><td className="py-2 px-3">2xs | xs | sm | md | lg | xl | 2xl</td><td className="py-2 px-3">md</td><td className="py-2 px-3">Controls switch dimensions</td></tr>
          <tr><td className="py-2 px-3 font-mono">variant</td><td className="py-2 px-3">solid | outline | soft | ghost</td><td className="py-2 px-3">solid</td><td className="py-2 px-3">Visual style of the switch</td></tr>
          <tr><td className="py-2 px-3 font-mono">shape</td><td className="py-2 px-3">pill | rounded | square</td><td className="py-2 px-3">pill</td><td className="py-2 px-3">Corner radius style</td></tr>
          <tr><td className="py-2 px-3 font-mono">checked</td><td className="py-2 px-3">boolean</td><td className="py-2 px-3">-</td><td className="py-2 px-3">Controlled checked state</td></tr>
          <tr><td className="py-2 px-3 font-mono">defaultChecked</td><td className="py-2 px-3">boolean</td><td className="py-2 px-3">false</td><td className="py-2 px-3">Uncontrolled initial state</td></tr>
          <tr><td className="py-2 px-3 font-mono">disabled</td><td className="py-2 px-3">boolean</td><td className="py-2 px-3">false</td><td className="py-2 px-3">Disables interaction</td></tr>
          <tr><td className="py-2 px-3 font-mono">loading</td><td className="py-2 px-3">boolean</td><td className="py-2 px-3">false</td><td className="py-2 px-3">Shows spinner animation</td></tr>
          <tr><td className="py-2 px-3 font-mono">label</td><td className="py-2 px-3">ReactNode</td><td className="py-2 px-3">-</td><td className="py-2 px-3">Main label text</td></tr>
          <tr><td className="py-2 px-3 font-mono">description</td><td className="py-2 px-3">string</td><td className="py-2 px-3">-</td><td className="py-2 px-3">Secondary descriptive text</td></tr>
          <tr><td className="py-2 px-3 font-mono">labelPlacement</td><td className="py-2 px-3">right | left</td><td className="py-2 px-3">right</td><td className="py-2 px-3">Position of label</td></tr>
        </tbody>
      </table>

      <h4 className="text-md font-semibold text-gray-700 mb-2">SwitchGroup Props</h4>
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
          <tr><td className="py-2 px-3 font-mono">values</td><td className="py-2 px-3">Record&lt;string, boolean&gt;</td><td className="py-2 px-3">-</td><td className="py-2 px-3">Controlled group values</td></tr>
          <tr><td className="py-2 px-3 font-mono">defaultValues</td><td className="py-2 px-3">Record&lt;string, boolean&gt;</td><td className="py-2 px-3">{}</td><td className="py-2 px-3">Uncontrolled default values</td></tr>
          <tr><td className="py-2 px-3 font-mono">orientation</td><td className="py-2 px-3">horizontal | vertical</td><td className="py-2 px-3">vertical</td><td className="py-2 px-3">Layout direction</td></tr>
          <tr><td className="py-2 px-3 font-mono">label</td><td className="py-2 px-3">string</td><td className="py-2 px-3">-</td><td className="py-2 px-3">Group title</td></tr>
        </tbody>
      </table>
    </div>
  );
}

// ─── Main Showcase Page ──────────────────────────────────────────────────────

export default function SwitchShowcase() {
  return (
    <SwitchProvider>
      <div className="min-h-screen bg-white text-black">
        {/* Header */}
        <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Switch Components</h1>
            <p className="text-gray-500 mt-1">
              A comprehensive showcase of all switch variants, sizes, shapes, and features
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

          {/* Switch Group */}
          <section className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Switch Group</h2>
            <SwitchGroupShowcase />
          </section>

          {/* Icon Switch */}
          <section className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Icon Switch</h2>
            <IconSwitchShowcase />
          </section>

          {/* Card Switch */}
          <section className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Card Switch</h2>
            <CardSwitchShowcase />
          </section>

          {/* Inline Label Switch */}
          <section className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Inline Label Switch</h2>
            <InlineLabelSwitchShowcase />
          </section>

          {/* Controlled vs Uncontrolled */}
          <section className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Controlled vs Uncontrolled</h2>
            <ControlledVsUncontrolledShowcase />
          </section>

          {/* Props Table */}
          <PropsTable />

          {/* Footer */}
          <div className="text-center text-sm text-gray-400 py-6 border-t border-gray-100">
            Switch System — Supports multiple variants, sizes, shapes, icon switches, card switches, and group management
          </div>
        </div>
      </div>
    </SwitchProvider>
  );
}