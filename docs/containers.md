### Width

```css
.w-auto{
    width: auto;
}
.w-full{
    width: 100%;
}
.w-screen{
    width: 100vw;
}
```

## Height

```css
.h-auto{
    height: auto;
}
.h-full{
    height: 100%;
}
.h-screen{
    height: 100vh;
}
```

## Min & Max

```css
.min-w-full{
    min-width: 100%;
}
.max-w-full{
    max-width: 100%;
}
.max-w-screen{
    max-width: 100vw;
}
.min-h-full{
    min-height: 100%;
}
.max-h-full{
    max-height: 100%;
}
.max-h-screen{
    max-height: 100vh;
}
```

## Custom Width

**Format:** `.w-{name}`

**CSS:** `width & max-width`

**Defaults:**
```bash
mobile: 411
tablet: 768
laptop: 1024
desktop: 1280
hd: 1920
4k: 3840
```

**Output:**
```css
.w-tablet{
    width: 768px;
}
.max-w-4k{
    max-width: 3840px;
}
```

## Fractions

**Format:** `.w-{width}/{total}`

**CSS:** `width`

**Defaults:**
```bash
columns: [2, 3, 4]
```

**Output:**
```css
.w-1/2{
    width: 50%;
}
.w-3/4{
    width: 75%;
}
```