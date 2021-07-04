# Custom Themes

Custom themes allow you to override any CSS variable based on the `<html>` elements `[theme]` attribute. Note that the `dark` and `light` themes can be explicitly set using the `[theme]` attribute but also can be set by a user's OS when the `[theme="auto"]` attribute is used.

**Config:**
```javascript
themes: {
    dark: {
        dashboard: "var(--neutral-700)",
    },
    light: {
        dashboard: "var(--neutral-300)",
    },
    brand: {
        dashboard: "var(--red-700)",
    }
}
```

**Output:**
```css
:root[theme="brand"]{
    --dashboard: var(--red-700);
}

:root[theme="dark"] {
    --dashboard: var(--neutral-700);
}
@media (prefers-color-scheme: dark) {
    :root[theme="auto"] {
        --dashboard: var(--neutral-700);
    }
}


:root[theme="light"] {
        --dashboard: var(--neutral-300);
}
@media (prefers-color-scheme: light) {
    :root[theme="auto"] {
        --dashboard: var(--neutral-300);
    }
}
```

> **Note**: the `dashboard` variable is not a default variable within Brixi. If you would like to use the`bg-dashboard` class you would need to provide a fallback value in the `colors` section of the config.