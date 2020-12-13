# CSS Variables

This is the only required file and will always be generated.

## Colors

Colors are generated in two formats: single colors and shades.

**Format:**
```bash
--{name}: {value};
--{name}-{shade}: {value};
```

**Output:**
```css
--white: #fff;

--primary-100: #EBF8FF;
--primary-200: #BEE3F8;
--primary-300: #90CDF4;
```

## Font Families

**Format:** `--font-{name}: {value}`

**Output:**
```css
--font-base: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
--font-serif: Georgia, Cambria, 'Times New Roman', Times, serif;
--font-mono: Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
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

**Format:** `--shadow-{name}: {value}`

**Output:**
```css
--shadow-xs: 0 0 0 1px rgba(0, 0, 0, 0.05);
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
```

## Easing

**Format:** `--ease-{name}: {value};`

**Output:**
```css
--ease-in: cubic-bezier(0.0, 0.0, 0.2, 1);
--ease-out: cubic-bezier(0.4, 0.0, 1, 1);
--ease-bounce: cubic-bezier(0.175, 0.885, 0.32, 1.275);
```