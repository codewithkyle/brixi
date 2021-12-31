# Borders

## Widths

**Format:**

```bash
.border-{size}
.border-{side}-{size}
```

**CSS:** `border-width`, `border-top-width`, `border-right-width`, `border-bottom-width`, `border-left-width`

**Defaults:**

```bash
widths: [0, 1, 2]
```

## Styles

**Format:**

```bash
.border-{style}
.border-{side}-{style}
```

**CSS:** `border-style`, `border-top-style`, `border-right-style`, `border-bottom-style`, `border-left-style`

**Defaults:**

```bash
styles: ["solid", "dashed", "dotted"]
```

## Colors

**Format:**

```bash
.border-{color}
.border-{color}-{shade}
.border-{side}-{color}
.border-{side}-{color}-{shade}
```

**CSS:** `border-color`, `border-top-color`, `border-right-color`, `border-bottom-color`, `border-left-color`

**Defaults:** see [Colors](https://github.com/codewithkyle/brixi/wiki/Colors)

## Radius

**Format:** `.radius-{size}`

**CSS:** `border-radius`

**Defaults:**

```bash
radius: [0.125, 0.25, 0.5]
```

## Examples

```html
<div class="border-1 border-solid border-grey-200">
    <!-- ...snip... -->
</div>

<div class="border-t-1 border-t-solid border-t-grey-200">
    <!-- ...snip... -->
</div>
```
