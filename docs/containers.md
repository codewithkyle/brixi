# Containers

## Width

```css
.w-auto {
    width: auto;
}
.w-full {
    width: 100%;
}
.w-screen {
    width: 100vw;
}
```

## Height

```css
.h-auto {
    height: auto;
}
.h-full {
    height: 100%;
}
.h-screen {
    height: 100vh;
}
```

## Min & Max

```css
.min-w-full {
    min-width: 100%;
}
.max-w-full {
    max-width: 100%;
}
.max-w-screen {
    max-width: 100vw;
}
.min-h-full {
    min-height: 100%;
}
.max-h-full {
    max-height: 100%;
}
.max-h-screen {
    max-height: 100vh;
}
```

## Custom Width

**Format:** `.w-{name}`

**CSS:** `width`, `max-width`, `min-width`

**Defaults:**

```bash
411: 411
765: 768
1024: 1024
1280: 1280
1920: 1920
3840: 3840
```

**Example:**

```html
<div class="w-1920 min-w-411">
    <!-- ...snip... -->
</div>
```

## Fractions

**Format:** `.w-{width}/{total}`

**CSS:** `width`

**Defaults:**

```bash
columns: [2, 3, 4]
```

**Example:**

```html
<div class="w-1/2">
    <!-- ...snip... -->
</div>
```
