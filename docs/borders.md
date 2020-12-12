## Widths

**Format:** `.border-{side}-{size}`

**CSS:** `border-width, border-top-width, border-right-width, border-bottom-width, border-left-width`

**Defaults:**
```bash
widths: [0, 1, 2]
```

**Output:**
```css
.border-2{
    border-width: 2px;
}
.border-r-1{
    border-right-width: 1px;
}
```

## Styles

**Format:** `.border-{side}-{style}`

**CSS:** `border-style, border-top-style, border-right-style, border-bottom-style, border-left-style`

**Defaults:**
```bash
styles: ["solid", "dashed", "dotted"]
```

**Output:**
```css
.border-dashed{
    border-style: dashed;
}
.border-r-solid{
    border-right-style: solid;
}
```

## Radius

**Format:** `.radius-{size}`

**CSS:** `border-radius`

**Defaults:**
```bash
radius: [0.125, 0.25, 0.5]
```

**Output:**
```css
.radius-0.25{
    border-radius: 0.25rem;
}
```