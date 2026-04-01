# Alert Component

A fully-featured, animated alert/toast notification system built with **React**, **Framer Motion**, and **Tailwind CSS**. Supports 5 alert types, 9 positions, actions, links, custom icons, and auto-dismiss.

---

## Installation

Ensure the following dependencies are installed:

```bash
npm install framer-motion lucide-react
```

---

## Setup

Wrap your app with `AlertProvider` and place `AlertContainer` at the root level:

```tsx
import { AlertProvider } from "@/context/alert/Alert.context";
import AlertContainer from "@/components/ui/Alert.ui";

export default function App({ children }) {
  return (
    <AlertProvider>
      {children}
      <AlertContainer />
    </AlertProvider>
  );
}
```

---

## Usage

```tsx
import { useAlert } from "@/context/alert/Alert.context";

function MyComponent() {
  const { addAlert, removeAlert, clearAll } = useAlert();

  const showSuccess = () => {
    addAlert({
      type: "success",
      title: "Saved!",
      message: "Your changes have been saved successfully.",
      duration: 4000,
      position: "top-right",
    });
  };

  return <button onClick={showSuccess}>Save</button>;
}
```

---

## Alert Types

| Type      | Color  | Icon           | Use Case                        |
| --------- | ------ | -------------- | ------------------------------- |
| `success` | Green  | ✅ CheckCircle | Confirmations, completions      |
| `error`   | Red    | ❌ XCircle     | Failures, validation errors     |
| `warning` | Yellow | ⚠️ AlertCircle | Cautions, destructive actions   |
| `info`    | Blue   | ℹ️ Info        | Neutral information             |
| `message` | Gray   | 💬 Info        | General messages, notifications |

---

## Positions

9 placement options + `auto` (defaults to `top-right`):

```
top-left      top-center      top-right
middle-left   middle-center   middle-right
bottom-left   bottom-center   bottom-right
auto  →  top-right
```

---

## AlertConfig Options

| Prop              | Type                 | Default       | Description                            |
| ----------------- | -------------------- | ------------- | -------------------------------------- |
| `type`            | `AlertType`          | —             | Alert variant                          |
| `title`           | `string`             | —             | Bold heading text                      |
| `message`         | `string`             | —             | Supporting body text                   |
| `duration`        | `number` (ms)        | `5000`        | `0` = persistent (no auto-dismiss)     |
| `position`        | `AlertPosition`      | `"top-right"` | Where the alert appears on screen      |
| `showCloseButton` | `boolean`            | `true`        | Show the `×` dismiss button            |
| `action`          | `{ label, onClick }` | —             | Primary action button                  |
| `link`            | `{ label, href }`    | —             | Anchor link button                     |
| `customClassName` | `string`             | —             | Extra Tailwind classes on the wrapper  |
| `icon`            | `ReactNode`          | —             | Override the default type icon         |
| `onClose`         | `() => void`         | —             | Callback fired when alert is dismissed |

---

## Context API

```tsx
const { alerts, addAlert, removeAlert, clearAll } = useAlert();
```

| Method        | Signature                                     | Returns    |
| ------------- | --------------------------------------------- | ---------- |
| `addAlert`    | `(config: Omit<AlertConfig, "id">) => string` | Alert `id` |
| `removeAlert` | `(id: string) => void`                        | —          |
| `clearAll`    | `() => void`                                  | —          |

---

## Examples

### With Action Button

```tsx
addAlert({
  type: "warning",
  title: "Delete file?",
  message: "This action cannot be undone.",
  duration: 0,
  action: {
    label: "Delete",
    onClick: () => handleDelete(),
  },
});
```

### With Link

```tsx
addAlert({
  type: "info",
  title: "Update available",
  message: "Version 2.0 is ready.",
  link: { label: "Release notes", href: "/changelog" },
});
```

### Persistent Alert

```tsx
addAlert({
  type: "error",
  title: "Connection lost",
  message: "Check your network and try again.",
  duration: 0, // won't auto-dismiss
  showCloseButton: true,
});
```

### Custom Icon

```tsx
import { Rocket } from "lucide-react";

addAlert({
  type: "success",
  title: "Deployed!",
  icon: <Rocket className="w-5 h-5" />,
});
```

---

## Animation

Alerts animate in/out using Framer Motion springs:

```ts
transition: { type: "spring", stiffness: 300, damping: 30 }
```

`AnimatePresence` handles exit animations automatically when alerts are removed.

---

## Notes

- Multiple alerts stack per position group with `gap-3` spacing.
- The `AlertContainer` renders outside normal document flow using `position: fixed` and `z-50`.
- Alerts with `duration > 0` return an `id` for manual early dismissal via `removeAlert(id)`.
