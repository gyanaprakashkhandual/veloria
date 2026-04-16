# Button Component — Full Specification

A production-grade, fully featured Button component for a UI component library (comparable to MUI / PrimeReact). This document covers every feature, variant, prop, behavior, and design consideration.

---

## Table of Contents

1. [Overview](#overview)
2. [Sizes](#sizes)
3. [Variants](#variants)
4. [States](#states)
5. [Icon Support](#icon-support)
6. [Button Group](#button-group)
7. [Loading Behavior](#loading-behavior)
8. [Props API](#props-api)
9. [className Override System](#classname-override-system)
10. [Accessibility](#accessibility)
11. [Theming & Tokens](#theming--tokens)
12. [Keyboard Navigation](#keyboard-navigation)
13. [Events & Callbacks](#events--callbacks)
14. [Edge Cases & Constraints](#edge-cases--constraints)
15. [Animation & Transition Behavior](#animation--transition-behavior)
16. [Component Architecture](#component-architecture)

---

## Overview

The `Button` component is a flexible, composable interactive primitive that handles a wide range of use cases — from primary call-to-action buttons to icon-only controls, destructive confirmations, and toggle buttons. It supports seven size variants, five visual variants, multiple states, icon placement, loading feedback, and full accessibility. Every visual element is overridable via `classNames` props.

---

## Sizes

The component ships with seven size variants. Sizes affect height, font size, padding, border radius, and icon dimensions proportionally.

| Size Token | Height | Font Size | Padding (H) | Border Radius | Use Case                         |
| ---------- | ------ | --------- | ----------- | ------------- | -------------------------------- |
| `xs`       | 24px   | 11px      | 8px         | 4px           | Dense tables, compact toolbars   |
| `sm`       | 32px   | 12px      | 12px        | 5px           | Sidebars, secondary actions      |
| `md`       | 40px   | 14px      | 16px        | 6px           | Default — general UI             |
| `lg`       | 48px   | 16px      | 20px        | 7px           | Prominent actions, forms         |
| `xl`       | 56px   | 18px      | 24px        | 8px           | Hero / landing page CTAs         |
| `2xl`      | 64px   | 20px      | 28px        | 10px          | Kiosk / large touch UI           |
| `3xl`      | 80px   | 24px      | 36px        | 12px          | Accessibility-first, TV, display |

**Prop:** `size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl"` — default `"md"`

---

## Variants

### 1. Solid (Filled)

The primary visual style. The button has a fully filled background using the active color token.

- Background: `--btn-color-primary`
- Text: `--btn-color-primary-text`
- Hover: darkens background by 10%
- Active: darkens background by 20%
- Used for the most important action on a page or in a section

---

### 2. Outline

A bordered button with a transparent background. Conveys secondary importance.

- Background: transparent
- Border: 1.5px solid current color token
- Hover: light fill using color at 10% opacity
- Used alongside a solid button as a secondary action

---

### 3. Ghost

No border, no background. Appears as plain text until hovered.

- Background: transparent; no border
- Hover: background fills at 8% opacity
- Used for low-priority actions, in-line controls, toolbars
- Prop: `variant="ghost"`

---

### 4. Soft

A low-contrast filled style using a light tint of the active color.

- Background: color at 12% opacity
- Text: full color token
- Hover: background increases to 20% opacity
- Used for secondary or tertiary actions where solid feels too heavy

---

### 5. Link

Renders as a styled anchor-like element with no background or border.

- Appears as colored text with an underline on hover
- Maintains button semantics and keyboard behavior
- Can accept an `href` to render as an `<a>` tag
- Prop: `variant="link"`

---

## States

### Default

The resting, interactive state. Full color and opacity, responsive to hover and focus.

---

### Hover

Visual feedback when the cursor is over the button. Adjusts background, border, or text depending on the variant.

---

### Focus

Visible focus ring for keyboard navigation.

- Uses `outline` with `--btn-color-focus-ring` token
- `outline-offset: 2px`
- Must never be suppressed — meets WCAG 2.1 AA

---

### Active / Pressed

The state when the button is clicked or tapped but not yet released.

- Background darkens; slight scale transform: `scale(0.98)`

---

### Disabled

The button is non-interactive.

- `aria-disabled="true"` on the element
- Pointer events removed
- Opacity reduced to 40%
- Focus is skipped (`tabIndex={-1}`) unless `focusableWhenDisabled={true}` is set
- Tooltip support via `disabledReason?: string` to explain why the button is disabled
- Prop: `disabled={true}`, `disabledReason?: string`

---

### Loading

The button is awaiting an async operation. See [Loading Behavior](#loading-behavior) for full details.

- Prop: `loading={true}`

---

### Selected / Active Toggle

The button acts as a toggle and is currently in the "on" state.

- Background uses `--btn-color-selected-bg`
- Used in button groups, filter bars, view toggles
- Prop: `selected={true}`, `onSelectedChange?: (selected: boolean) => void`

---

## Icon Support

Buttons support leading icons, trailing icons, and icon-only modes.

### Leading Icon

An icon placed to the left of the label text.

- Prop: `startIcon?: React.ReactNode`
- Gap between icon and label: proportional to `size`

---

### Trailing Icon

An icon placed to the right of the label text.

- Prop: `endIcon?: React.ReactNode`
- Common use: chevron for dropdown buttons, external link indicators

---

### Icon Only

The button renders with no text — only an icon. The width equals the height, making it square.

- Prop: `iconOnly={true}` or omit `children` when `startIcon` is provided
- Always requires an accessible label: `aria-label` or `tooltip`
- Minimum touch target: 44x44px on mobile regardless of visual size
- Square aspect ratio enforced via CSS

---

## Button Group

Multiple buttons rendered as a connected unit sharing borders and a consistent visual language.

- Removes individual border radii on internal buttons; only first and last receive rounded corners
- Internal borders collapse to 1px shared borders
- Supports mixed variants within the group (e.g., solid + ghost)
- Supports `orientation?: "horizontal" | "vertical"`
- Prop: wrap buttons in `<ButtonGroup>` component
- Prop on group: `size`, `variant`, `disabled`, `orientation`, `spacing?: "compact" | "separated"`

When `spacing="separated"`, buttons retain their individual border radii and are spaced with a gap rather than merged.

---

## Loading Behavior

When `loading={true}`:

- A spinner is displayed — either replacing the leading icon, or appearing inline before the label
- The button is made non-interactive (equivalent to `disabled`) but retains visual weight
- `aria-busy="true"` is set on the element
- Original dimensions are preserved — the button does not resize during loading
- Label is optionally replaced by a custom `loadingText?: string`
- Spinner inherits the button's current text color
- Prop: `loading={true}`, `loadingText?: string`, `loadingPlacement?: "start" | "center"`

When `loadingPlacement="center"`, both the label and spinner are replaced by a centered spinner. When `"start"`, the spinner appears in the leading icon position alongside the label.

---

## Props API

```typescript
interface ButtonProps {
  // Core
  variant?: "solid" | "outline" | "ghost" | "soft" | "link";
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  children?: React.ReactNode;

  // Color / Intent
  colorScheme?: "primary" | "neutral" | "success" | "warning" | "danger";

  // State
  disabled?: boolean;
  disabledReason?: string;
  focusableWhenDisabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  loadingPlacement?: "start" | "center";
  selected?: boolean;

  // Icons
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  iconOnly?: boolean;

  // Toggle behavior
  isToggle?: boolean;
  defaultSelected?: boolean;
  onSelectedChange?: (selected: boolean) => void;

  // Polymorphic rendering
  as?: React.ElementType; // render as "a", "div", custom component
  href?: string; // renders as <a> when provided
  target?: string;
  rel?: string;
  type?: "button" | "submit" | "reset";

  // Layout
  fullWidth?: boolean; // stretches to fill container width
  justify?: "start" | "center" | "end" | "between"; // internal content alignment

  // Events
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onFocus?: React.FocusEventHandler<HTMLButtonElement>;
  onBlur?: React.FocusEventHandler<HTMLButtonElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLButtonElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLButtonElement>;

  // Accessibility
  id?: string;
  name?: string;
  value?: string;
  form?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-expanded"?: boolean;
  "aria-haspopup"?: boolean | "menu" | "listbox" | "dialog";
  "aria-controls"?: string;
  "aria-pressed"?: boolean;

  // Styling
  className?: string;
  classNames?: ButtonClassNames;
  style?: React.CSSProperties;
  styles?: ButtonStyles;
  unstyled?: boolean;
}
```

---

### ButtonGroup Props

```typescript
interface ButtonGroupProps {
  children: React.ReactNode;

  // Shared overrides applied to all child buttons
  size?: ButtonProps["size"];
  variant?: ButtonProps["variant"];
  colorScheme?: ButtonProps["colorScheme"];
  disabled?: boolean;

  // Layout
  orientation?: "horizontal" | "vertical";
  spacing?: "compact" | "separated";
  fullWidth?: boolean;

  // Styling
  className?: string;
  classNames?: { root?: string; divider?: string };
  style?: React.CSSProperties;
}
```

---

## className Override System

Every visual region of the component accepts its own `className` override through the `classNames` prop object.

```typescript
interface ButtonClassNames {
  // Root element
  root?: string;

  // Content wrapper (flex container inside root)
  inner?: string;

  // Label text span
  label?: string;

  // Icons
  startIcon?: string;
  endIcon?: string;

  // Loading spinner wrapper
  spinner?: string;

  // Focus ring (when using a custom focus implementation)
  focusRing?: string;
}
```

Additionally, inline style overrides are supported via a parallel `styles` prop with the same key structure, each accepting a `React.CSSProperties` object.

The `unstyled={true}` prop strips all built-in CSS from every element, giving integrators a clean base for building fully custom designs on top of the component's logic layer.

---

## Accessibility

The component is built to WCAG 2.1 AA standard, with optional AAA enhancements.

- Renders as a native `<button>` by default — inherits all browser accessibility behaviors
- `type="button"` set by default to prevent accidental form submission
- `aria-disabled="true"` used alongside pointer-event removal (avoids removing from tab order for screen reader users unless explicitly set)
- `aria-busy="true"` during loading state
- `aria-pressed` managed automatically when `isToggle={true}`
- `aria-label` required (and enforced with a console warning) when `iconOnly={true}` and no visible label is present
- Focus ring visible at all times during keyboard navigation; never suppressed with `outline: none`
- Minimum touch target 44x44px enforced on mobile via padding compensation
- High contrast mode support via CSS `forced-colors` media query
- `prefers-reduced-motion` disables transform transitions

---

## Theming & Tokens

The component exposes a set of CSS custom properties for easy theming integration.

```css
/* Color */
--btn-color-primary
--btn-color-primary-hover
--btn-color-primary-active
--btn-color-primary-text
--btn-color-primary-soft-bg
--btn-color-neutral
--btn-color-neutral-hover
--btn-color-neutral-text
--btn-color-success
--btn-color-warning
--btn-color-danger
--btn-color-selected-bg
--btn-color-selected-text

/* Focus */
--btn-color-focus-ring
--btn-focus-ring-width
--btn-focus-ring-offset

/* Typography */
--btn-font-family
--btn-font-weight
--btn-letter-spacing

/* Shape */
--btn-radius-xs
--btn-radius-sm
--btn-radius-md
--btn-radius-lg
--btn-radius-xl
--btn-radius-2xl
--btn-radius-3xl

/* Spacing */
--btn-padding-xs
--btn-padding-sm
--btn-padding-md
--btn-padding-lg
--btn-padding-xl
--btn-padding-2xl
--btn-padding-3xl

/* Motion */
--btn-transition-duration
--btn-transition-easing
--btn-active-scale

/* Opacity */
--btn-disabled-opacity
--btn-loading-opacity
```

All tokens can be set at the design-system level (`:root`) or scoped to a wrapper element for component-level overrides.

---

## Keyboard Navigation

| Key           | Action                                        |
| ------------- | --------------------------------------------- |
| `Enter`       | Activates the button (fires `onClick`)        |
| `Space`       | Activates the button (fires `onClick`)        |
| `Tab`         | Moves focus to the next focusable element     |
| `Shift + Tab` | Moves focus to the previous focusable element |

When inside a `ButtonGroup` with `orientation="horizontal"`:

| Key           | Action                                          |
| ------------- | ----------------------------------------------- |
| `Arrow Right` | Moves focus to the next button in the group     |
| `Arrow Left`  | Moves focus to the previous button in the group |

When inside a `ButtonGroup` with `orientation="vertical"`:

| Key          | Action                                          |
| ------------ | ----------------------------------------------- |
| `Arrow Down` | Moves focus to the next button in the group     |
| `Arrow Up`   | Moves focus to the previous button in the group |

Focus wraps at the ends of a button group when `loop={true}` is set on `ButtonGroup`.

---

## Events & Callbacks

```typescript
onClick(event); // fires on click or keyboard activation (Enter/Space)
onFocus(event); // native focus event
onBlur(event); // native blur event
onKeyDown(event); // native keydown event; fires before default activation
onMouseEnter(event); // pointer enters button bounds
onMouseLeave(event); // pointer leaves button bounds
onSelectedChange(selected); // fires when toggle state changes (isToggle mode)
```

---

## Edge Cases & Constraints

- **Form submission**: Buttons inside a `<form>` with `type="submit"` trigger form submission; default type is `"button"` to prevent accidental submissions
- **Polymorphic `as` prop**: When rendered as `<a>`, keyboard behavior is preserved — both `Enter` and `Space` activate the element (native anchors only respond to `Enter`). This is handled via `onKeyDown`
- **`href` shorthand**: Providing `href` automatically switches the underlying element to `<a>` without needing to set `as="a"` explicitly
- **Loading + disabled**: When both `loading` and `disabled` are true, `disabled` takes visual precedence (loading spinner is not shown)
- **Icon-only without aria-label**: A console warning is emitted in development when `iconOnly={true}` is used without an `aria-label` or `aria-labelledby`
- **Full-width in flex containers**: `fullWidth={true}` sets `width: 100%`; behavior inside flex/grid containers depends on the parent layout
- **Children as function**: `children` must be a valid React node — render prop pattern is not supported on this primitive
- **ButtonGroup + individual props**: Props set directly on a child `Button` inside a `ButtonGroup` take precedence over group-level shared props
- **Controlled vs. uncontrolled toggle**: If `selected` is provided, the toggle is controlled and `defaultSelected` is ignored; if only `defaultSelected` is provided it is uncontrolled

---

## Animation & Transition Behavior

All animations respect `prefers-reduced-motion`. Default transitions:

| Interaction            | Animation                                                    |
| ---------------------- | ------------------------------------------------------------ |
| Hover enter            | Background color transition over `--btn-transition-duration` |
| Hover exit             | Background color transition back                             |
| Active / pressed       | `scale(0.98)` transform + background darken                  |
| Focus ring appear      | Fade in over 100ms                                           |
| Loading spinner appear | Fade in + rotate continuous                                  |
| Disabled state         | Opacity transition to `--btn-disabled-opacity`               |
| Selected toggle on     | Background color crossfade                                   |
| Selected toggle off    | Background color crossfade                                   |
| Icon swap on loading   | Fade out icon, fade in spinner                               |

Duration and easing are controlled via `--btn-transition-duration` and `--btn-transition-easing` tokens.

---

## Component Architecture

The library exposes both a high-level composite component and low-level primitives for maximum composability.

### High-Level Component

```tsx
<Button
  variant="solid"
  colorScheme="primary"
  size="md"
  startIcon={<PlusIcon />}
  loading={false}
  onClick={handleClick}
>
  Create Project
</Button>
```

### Toggle Button

```tsx
<Button
  isToggle
  defaultSelected={false}
  onSelectedChange={(selected) => console.log(selected)}
  variant="outline"
>
  Bold
</Button>
```

### Button Group

```tsx
<ButtonGroup size="sm" variant="outline" spacing="compact">
  <Button>Day</Button>
  <Button>Week</Button>
  <Button selected>Month</Button>
</ButtonGroup>
```

### Polymorphic Link Button

```tsx
<Button variant="link" href="/dashboard">
  Go to Dashboard
</Button>
```

### Low-Level Primitives (Headless / Composable)

For teams that want full control over rendering while keeping the logic:

```
Button.Root         — state provider and root element
Button.Label        — the text content wrapper
Button.StartIcon    — leading icon slot
Button.EndIcon      — trailing icon slot
Button.Spinner      — the loading indicator slot
```

All primitives accept `className`, `style`, and forward refs. They are unstyled by default when used individually — styles come from the composite component's stylesheet unless overridden.

---

_End of Specification_
