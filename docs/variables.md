# CSS Variables

This is the only required file and will always be generated.

## Colors

Colors are generated in two formats:

1. single colors
1. shades.

**Format:**

```bash
--{name}: {value};
--{name}-{shade}: {value};
```

**Output:**

```css
--white: #fff;

--primary-100: #ebf8ff;
--primary-200: #bee3f8;
--primary-300: #90cdf4;
```

## Font Families

**Format:** `--font-{name}: {value}`

**Output:**

```css
--font-sans-serif: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
--font-serif: Georgia, Cambria, "Times New Roman", Times, serif;
--font-mono: Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
```

## Font Weights

**Format:** `--font-{name}: {value}`

**Output:**

```css
--font-hairline: 100;
--font-thin: 200;
--font-light: 300;
```

## Font Size

**Format:** `--font-{name}: {value}`

**Output:**

```css
--font-sm: 0.875rem;
--font-base: 1rem;
--font-md: 1.125rem;
```

## Shadows

[See shadows page](/box-shadows) for details.

## Easing

**Format:** `--ease-{name}: {value};`

**Output:**

```css
--ease-in: cubic-bezier(0, 0, 0.2, 1);
--ease-out: cubic-bezier(0.4, 0, 1, 1);
--ease-bounce: cubic-bezier(0.175, 0.885, 0.32, 1.275);
```

## Custom Variables

Custom variables can be added to the `variables` section of your config file.

**Config:**

```javascript
variables: {
    "brand-hue": 200,
    "brand-saturation": 100%,
    "brand-lightness": 50%,
}
```

**Output:**

```css
:root {
    --brand-hue: 200;
    --brand-saturation: 100%;
    --brand-lightness: 50%;
}
```
