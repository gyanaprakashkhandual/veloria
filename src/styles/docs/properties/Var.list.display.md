# CSS Display & Layout Design Token Properties

> Production-level display, layout, and structural tokens for scalable UI systems.

---

## Display

```css
--display-none
--display-block
--display-inline
--display-inline-block
--display-flex
--display-inline-flex
--display-grid
--display-inline-grid
--display-flow-root
--display-contents
--display-table
--display-table-row
--display-table-cell
--display-list-item
```

---

## Visibility

```css
--visibility-visible
--visibility-hidden
--visibility-collapse
```

---

## Overflow

```css
--overflow-auto
--overflow-hidden
--overflow-visible
--overflow-scroll
--overflow-clip

--overflow-x-auto
--overflow-x-hidden
--overflow-x-visible
--overflow-x-scroll

--overflow-y-auto
--overflow-y-hidden
--overflow-y-visible
--overflow-y-scroll
```

---

## Position

```css
--position-static
--position-relative
--position-absolute
--position-fixed
--position-sticky
```

---

## Inset / Placement

```css
--inset-auto
--inset-full
--inset-0

--top-auto
--top-0
--top-full
--top-half

--right-auto
--right-0
--right-full
--right-half

--bottom-auto
--bottom-0
--bottom-full
--bottom-half

--left-auto
--left-0
--left-full
--left-half
```

---

## Flexbox — Container

```css
--flex-direction-row
--flex-direction-row-reverse
--flex-direction-column
--flex-direction-column-reverse

--flex-wrap-nowrap
--flex-wrap-wrap
--flex-wrap-wrap-reverse

--justify-content-start
--justify-content-end
--justify-content-center
--justify-content-between
--justify-content-around
--justify-content-evenly
--justify-content-stretch

--align-items-start
--align-items-end
--align-items-center
--align-items-baseline
--align-items-stretch

--align-content-start
--align-content-end
--align-content-center
--align-content-between
--align-content-around
--align-content-evenly
--align-content-stretch

--gap-flex-xs
--gap-flex-sm
--gap-flex-md
--gap-flex-lg
--gap-flex-xl
--gap-flex-2xl
```

---

## Flexbox — Item

```css
--flex-1
--flex-auto
--flex-none
--flex-initial

--flex-grow-0
--flex-grow-1

--flex-shrink-0
--flex-shrink-1

--flex-basis-auto
--flex-basis-full
--flex-basis-half
--flex-basis-third
--flex-basis-quarter

--align-self-auto
--align-self-start
--align-self-end
--align-self-center
--align-self-baseline
--align-self-stretch

--justify-self-auto
--justify-self-start
--justify-self-end
--justify-self-center
--justify-self-stretch

--order-first
--order-last
--order-none
```

---

## Grid — Container

```css
--grid-cols-1
--grid-cols-2
--grid-cols-3
--grid-cols-4
--grid-cols-5
--grid-cols-6
--grid-cols-7
--grid-cols-8
--grid-cols-9
--grid-cols-10
--grid-cols-11
--grid-cols-12
--grid-cols-none
--grid-cols-auto
--grid-cols-subgrid

--grid-rows-1
--grid-rows-2
--grid-rows-3
--grid-rows-4
--grid-rows-5
--grid-rows-6
--grid-rows-none
--grid-rows-auto
--grid-rows-subgrid

--grid-auto-flow-row
--grid-auto-flow-column
--grid-auto-flow-dense
--grid-auto-flow-row-dense
--grid-auto-flow-column-dense

--grid-auto-cols-auto
--grid-auto-cols-min
--grid-auto-cols-max
--grid-auto-cols-fr

--grid-auto-rows-auto
--grid-auto-rows-min
--grid-auto-rows-max
--grid-auto-rows-fr

--gap-grid-xs
--gap-grid-sm
--gap-grid-md
--gap-grid-lg
--gap-grid-xl
--gap-grid-2xl

--column-gap-xs
--column-gap-sm
--column-gap-md
--column-gap-lg
--column-gap-xl

--row-gap-xs
--row-gap-sm
--row-gap-md
--row-gap-lg
--row-gap-xl
```

---

## Grid — Item

```css
--col-span-1
--col-span-2
--col-span-3
--col-span-4
--col-span-5
--col-span-6
--col-span-7
--col-span-8
--col-span-9
--col-span-10
--col-span-11
--col-span-12
--col-span-full
--col-span-auto

--col-start-1
--col-start-2
--col-start-3
--col-start-4
--col-start-auto

--col-end-1
--col-end-2
--col-end-3
--col-end-4
--col-end-auto

--row-span-1
--row-span-2
--row-span-3
--row-span-4
--row-span-5
--row-span-6
--row-span-full
--row-span-auto

--row-start-1
--row-start-2
--row-start-3
--row-start-auto

--row-end-1
--row-end-2
--row-end-3
--row-end-auto
```

---

## Width

```css
--width-auto
--width-full
--width-screen
--width-min
--width-max
--width-fit

--width-xs
--width-sm
--width-md
--width-lg
--width-xl
--width-2xl
--width-3xl
--width-4xl
--width-5xl
--width-6xl
--width-7xl
```

---

## Min Width

```css
--min-width-0
--min-width-full
--min-width-min
--min-width-max
--min-width-fit

--min-width-xs
--min-width-sm
--min-width-md
--min-width-lg
--min-width-xl
```

---

## Max Width

```css
--max-width-none
--max-width-full
--max-width-screen
--max-width-min
--max-width-max
--max-width-fit
--max-width-prose

--max-width-xs
--max-width-sm
--max-width-md
--max-width-lg
--max-width-xl
--max-width-2xl
--max-width-3xl
--max-width-4xl
--max-width-5xl
--max-width-6xl
--max-width-7xl
```

---

## Height

```css
--height-auto
--height-full
--height-screen
--height-svh
--height-dvh
--height-lvh
--height-min
--height-max
--height-fit

--height-xs
--height-sm
--height-md
--height-lg
--height-xl
--height-2xl
--height-3xl
```

---

## Min Height

```css
--min-height-0
--min-height-full
--min-height-screen
--min-height-svh
--min-height-dvh
--min-height-min
--min-height-max
--min-height-fit

--min-height-xs
--min-height-sm
--min-height-md
--min-height-lg
```

---

## Max Height

```css
--max-height-none
--max-height-full
--max-height-screen
--max-height-svh
--max-height-dvh
--max-height-min
--max-height-max
--max-height-fit

--max-height-xs
--max-height-sm
--max-height-md
--max-height-lg
--max-height-xl
--max-height-2xl
```

---

## Aspect Ratio

```css
--aspect-ratio-auto
--aspect-ratio-square
--aspect-ratio-video
--aspect-ratio-portrait
--aspect-ratio-landscape
--aspect-ratio-golden
--aspect-ratio-ultrawide
--aspect-ratio-4-3
--aspect-ratio-3-2
--aspect-ratio-2-1
```

---

## Object Fit

```css
--object-fit-contain
--object-fit-cover
--object-fit-fill
--object-fit-none
--object-fit-scale-down
```

---

## Object Position

```css
--object-position-center
--object-position-top
--object-position-top-right
--object-position-right
--object-position-bottom-right
--object-position-bottom
--object-position-bottom-left
--object-position-left
--object-position-top-left
```

---

## Float & Clear

```css
--float-left
--float-right
--float-none
--float-inline-start
--float-inline-end

--clear-left
--clear-right
--clear-both
--clear-none
--clear-inline-start
--clear-inline-end
```

---

## Columns (Multi-column Layout)

```css
--columns-1
--columns-2
--columns-3
--columns-4
--columns-5
--columns-6
--columns-auto
--columns-xs
--columns-sm
--columns-md
--columns-lg
--columns-xl

--column-fill-auto
--column-fill-balance
--column-fill-balance-all

--column-rule-width-sm
--column-rule-width-md
--column-rule-width-lg

--column-rule-style-solid
--column-rule-style-dashed
--column-rule-style-dotted
```

---

## Box Sizing

```css
--box-sizing-border-box
--box-sizing-content-box
```

---

## Box Decoration Break

```css
--box-decoration-clone
--box-decoration-slice
```

---

## Isolation

```css
--isolation-auto
--isolation-isolate
```

---

## Pointer Events

```css
--pointer-events-auto
--pointer-events-none
```

---

## User Select

```css
--user-select-none
--user-select-text
--user-select-all
--user-select-auto
```

---

## Cursor

```css
--cursor-auto
--cursor-default
--cursor-pointer
--cursor-wait
--cursor-text
--cursor-move
--cursor-not-allowed
--cursor-crosshair
--cursor-grab
--cursor-grabbing
--cursor-zoom-in
--cursor-zoom-out
--cursor-help
--cursor-progress
--cursor-cell
--cursor-col-resize
--cursor-row-resize
--cursor-ns-resize
--cursor-ew-resize
--cursor-none
```

---

## Resize

```css
--resize-none
--resize-both
--resize-horizontal
--resize-vertical
```

---

## Appearance

```css
--appearance-none
--appearance-auto
```
