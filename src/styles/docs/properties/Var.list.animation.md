# CSS Animation Design Token Properties

> Production-level motion tokens for consistent, purposeful animation systems.

---

## Duration — Primitive Scale

```css
--duration-0
--duration-50
--duration-75
--duration-100
--duration-150
--duration-200
--duration-250
--duration-300
--duration-350
--duration-400
--duration-500
--duration-600
--duration-700
--duration-800
--duration-900
--duration-1000
--duration-1200
--duration-1500
--duration-2000
--duration-2500
--duration-3000
```

---

## Duration — Semantic

```css
--duration-instant
--duration-fastest
--duration-faster
--duration-fast
--duration-normal
--duration-slow
--duration-slower
--duration-slowest

--duration-micro
--duration-short
--duration-medium
--duration-long
--duration-xlong
```

---

## Duration — Role-Based

```css
--duration-fade
--duration-reveal
--duration-enter
--duration-exit
--duration-expand
--duration-collapse
--duration-slide
--duration-morph
--duration-bounce
--duration-spin
--duration-pulse
--duration-skeleton
--duration-toast
--duration-tooltip
--duration-modal
--duration-drawer
--duration-dropdown
--duration-page-transition
```

---

## Easing — Primitive (Cubic Bezier)

```css
--easing-linear
--easing-ease
--easing-ease-in
--easing-ease-out
--easing-ease-in-out
--easing-step-start
--easing-step-end
```

---

## Easing — Standard Curves

```css
--easing-standard
--easing-standard-decelerate
--easing-standard-accelerate

--easing-emphasized
--easing-emphasized-decelerate
--easing-emphasized-accelerate
```

---

## Easing — Expressive

```css
--easing-spring
--easing-spring-soft
--easing-spring-medium
--easing-spring-stiff
--easing-spring-bouncy

--easing-bounce-in
--easing-bounce-out
--easing-bounce-in-out

--easing-back-in
--easing-back-out
--easing-back-in-out

--easing-elastic-in
--easing-elastic-out
--easing-elastic-in-out
```

---

## Easing — Role-Based

```css
--easing-enter
--easing-exit
--easing-move
--easing-morph
--easing-fade
--easing-expand
--easing-collapse
```

---

## Delay — Primitive Scale

```css
--delay-0
--delay-50
--delay-75
--delay-100
--delay-150
--delay-200
--delay-250
--delay-300
--delay-400
--delay-500
--delay-600
--delay-700
--delay-800
--delay-1000
```

---

## Delay — Semantic

```css
--delay-none
--delay-short
--delay-medium
--delay-long

--delay-stagger-xs
--delay-stagger-sm
--delay-stagger-md
--delay-stagger-lg
--delay-stagger-xl
```

---

## Iteration Count

```css
--iteration-once
--iteration-twice
--iteration-thrice
--iteration-infinite
```

---

## Direction

```css
--direction-normal
--direction-reverse
--direction-alternate
--direction-alternate-reverse
```

---

## Fill Mode

```css
--fill-mode-none
--fill-mode-forwards
--fill-mode-backwards
--fill-mode-both
```

---

## Play State

```css
--play-state-running
--play-state-paused
```

---

## Transform — Translate Primitives

```css
--translate-xs
--translate-sm
--translate-md
--translate-lg
--translate-xl
--translate-2xl
--translate-3xl
--translate-full
--translate-half
```

---

## Transform — Scale Primitives

```css
--scale-0
--scale-50
--scale-75
--scale-90
--scale-95
--scale-100
--scale-105
--scale-110
--scale-125
--scale-150
```

---

## Transform — Rotate Primitives

```css
--rotate-0
--rotate-1
--rotate-2
--rotate-3
--rotate-6
--rotate-12
--rotate-45
--rotate-90
--rotate-180
--rotate-270
--rotate-360
```

---

## Transform — Skew Primitives

```css
--skew-0
--skew-1
--skew-2
--skew-3
--skew-6
--skew-12
```

---

## Transform Origin

```css
--transform-origin-center
--transform-origin-top
--transform-origin-top-right
--transform-origin-right
--transform-origin-bottom-right
--transform-origin-bottom
--transform-origin-bottom-left
--transform-origin-left
--transform-origin-top-left
```

---

## Keyframe — Named Animations

```css
--animation-fade-in
--animation-fade-out
--animation-fade-in-up
--animation-fade-in-down
--animation-fade-in-left
--animation-fade-in-right
--animation-fade-out-up
--animation-fade-out-down
--animation-fade-out-left
--animation-fade-out-right

--animation-slide-in-up
--animation-slide-in-down
--animation-slide-in-left
--animation-slide-in-right
--animation-slide-out-up
--animation-slide-out-down
--animation-slide-out-left
--animation-slide-out-right

--animation-scale-in
--animation-scale-out
--animation-scale-in-up
--animation-scale-in-down

--animation-expand-vertical
--animation-collapse-vertical
--animation-expand-horizontal
--animation-collapse-horizontal

--animation-spin
--animation-spin-reverse
--animation-pulse
--animation-bounce
--animation-ping
--animation-shake
--animation-wobble
--animation-jello
--animation-rubber-band
--animation-flash
--animation-blink

--animation-skeleton
--animation-shimmer
--animation-progress
--animation-ticker
```

---

## Transition — Composite (Property + Duration + Easing)

```css
--transition-none
--transition-all
--transition-colors
--transition-opacity
--transition-transform
--transition-shadow
--transition-border
--transition-background
--transition-size
--transition-spacing

--transition-fade
--transition-slide
--transition-scale
--transition-morph
--transition-expand
--transition-collapse
--transition-enter
--transition-exit
```

---

## Motion Preference (Accessibility)

```css
--motion-safe-duration
--motion-safe-easing
--motion-reduce-duration
--motion-reduce-easing
--motion-no-preference-duration
--motion-no-preference-easing
```
