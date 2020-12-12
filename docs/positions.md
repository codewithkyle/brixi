## Custom Positions

**Format:** `.{side}-{size}`

**CSS:** `top, right, bottom, left`

**Defaults:**
```bash
positions: [0]
```

**Output:**
```css
.t-0{
    top: 0;
}
.r-0{
    right: 0;
}
.b-0{
    bottom: 0;
}
.l-0{
    left: 0;
}
```

## Default Positions

```css
.relative{
    position: relative !important;
}
.absolute{
    position: absolute !important;
}
.fixed{
    position: fixed !important;
}
.sticky{
    position: sticky !important;
}
.t-auto{
    top: auto !important;
}
.r-auto{
    right: auto !important;
}
.b-auto{
    bottom: auto !important;
}
.l-auto{
    left: auto !important;
}
.x-auto{
    right: auto !important;
    left: auto !important;
}
.y-auto{
    top: auto !important;
    bottom: auto !important;
}
.center{
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
}
.x-center{
    left: 50% !important;
    transform: translateX(-50%) !important;
}
.y-center{
    top: 50% !important;
    transform: translateY(-50%) !important;
}
```