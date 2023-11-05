# Brixi

A lightweight highly configurable utility-first CSS framework.

## Installation

Install the npm package

```sh
npm i -S brixi
```

Add the startup script to your `package.json` file

```json
"brixi": "brixi"
```

Run the script

```sh
npm run brixi
```

Or use the CDN version:

```html
<link href="https://unpkg.com/brixi@^0.8/brixi.min.css" rel="stylesheet" />
```

## Configuration

Below is the default config file. Any value can be overridden by adding a `brixi.config.js` file to your project's root directory.

> **Note**: the config below has all features enabled by default. We recommend using a opt-in pattern to keep the bundle size small.

```javascript
module.exports = {
    outDir: "./brixi",
    important: true,
    output: "production",
    baseUnit: "rem",
    features: {
        aspectRatios: true,
        containers: true,
        cursors: true,
        flexbox: true,
        grid: true,
        lineHeight: true,
        margin: true,
        padding: true,
        scroll: true,
        shadows: true,
        positions: true,
        backgrounds: true,
        transparentBackgrounds: true,
        alignment: true,
        whitespace: true,
        textTransforms: true,
        display: true,
        opacity: true,
        fontColors: true,
        fontSizes: true,
        fontWeights: true,
        fontFamilies: true,
        borderRadius: true,
        borderWidths: true,
        borderColors: true,
        transparentBorderColors: true,
        borderStyles: true,
    },
    fonts: {
        units: "rem",
        families: {
            "sans-serif": "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
            serif: "Georgia, Cambria, 'Times New Roman', Times, serif",
            mono: "Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
        },
        weights: {
            hairline: 100,
            thin: 200,
            light: 300,
            regular: 400,
            medium: 500,
            semibold: 600,
            bold: 700,
            heavy: 800,
            black: 900,
        },
        sizes: {
            xs: 0.75,
            sm: 0.875,
            base: 1,
            md: 1.125,
            lg: 1.25,
            xl: 1.5,
            "2xl": 2,
            "3xl": 3,
            "4xl": 4,
        },
    },
    colors: {
        white: "#ffffff",
        black: "#000000",
        "slate": {
            50: "#F8FAFC",
            100: "#F1F5F9",
            200: "#E2E8F0",
            300: "#CBD5E1",
            400: "#94A3B8",
            500: "#64748B",
            600: "#475569",
            700: "#334155",
            800: "#1E293B",
            900: "#0F172A",
            950: "#020617",
        },
        "steel": {
            50: "#F9FAFB",
            100: "#F3F4F6",
            200: "#E5E7EB",
            300: "#D1D5DB",
            400: "#9CA3AF",
            500: "#6B7280",
            600: "#4B5563",
            700: "#374151",
            800: "#1F2937",
            900: "#111827",
            950: "#030712",
        },
        grey: {
            50: "#FAFAFA",
            100: "#F4F4F5",
            200: "#E4E4E7",
            300: "#D4D4D8",
            400: "#A1A1AA",
            500: "#71717A",
            600: "#52525B",
            700: "#3F3F46",
            800: "#27272A",
            900: "#18181B",
            950: "#09090b",
        },
        neutral: {
            50: "#FAFAFA",
            100: "#F5F5F5",
            200: "#E5E5E5",
            300: "#D4D4D4",
            400: "#A3A3A3",
            500: "#737373",
            600: "#525252",
            700: "#404040",
            800: "#262626",
            900: "#171717",
            950: "#0a0a0a",
        },
        "stone": {
            50: "#FAFAF9",
            100: "#F5F5F4",
            200: "#E7E5E4",
            300: "#D6D3D1",
            400: "#A8A29E",
            500: "#78716C",
            600: "#57534E",
            700: "#44403C",
            800: "#292524",
            900: "#1C1917",
            950: "#0c0a09",
        },
        red: {
            50: "#FEF2F2",
            100: "#FEE2E2",
            200: "#FECACA",
            300: "#FCA5A5",
            400: "#F87171",
            500: "#EF4444",
            600: "#DC2626",
            700: "#B91C1C",
            800: "#991B1B",
            900: "#7F1D1D",
            950: "#450a0a",
        },
        orange: {
            50: "#FFF7ED",
            100: "#FFEDD5",
            200: "#FED7AA",
            300: "#FDBA74",
            400: "#FB923C",
            500: "#F97316",
            600: "#EA580C",
            700: "#C2410C",
            800: "#9A3412",
            900: "#7C2D12",
            950: "#431407",
        },
        amber: {
            50: "#FFFBEB",
            100: "#FEF3C7",
            200: "#FDE68A",
            300: "#FCD34D",
            400: "#FBBF24",
            500: "#F59E0B",
            600: "#D97706",
            700: "#B45309",
            800: "#92400E",
            900: "#78350F",
            950: "#451a03",
        },
        yellow: {
            50: "#FEFCE8",
            100: "#FEF9C3",
            200: "#FEF08A",
            300: "#FDE047",
            400: "#FACC15",
            500: "#EAB308",
            600: "#CA8A04",
            700: "#A16207",
            800: "#854D0E",
            900: "#713F12",
            950: "#422006",
        },
        lime: {
            50: "#F7FEE7",
            100: "#ECFCCB",
            200: "#D9F99D",
            300: "#BEF264",
            400: "#A3E635",
            500: "#84CC16",
            600: "#65A30D",
            700: "#4D7C0F",
            800: "#3F6212",
            900: "#365314",
            950: "#1a2e05",
        },
        green: {
            50: "#F0FDF4",
            100: "#DCFCE7",
            200: "#BBF7D0",
            300: "#86EFAC",
            400: "#4ADE80",
            500: "#22C55E",
            600: "#16A34A",
            700: "#15803D",
            800: "#166534",
            900: "#14532D",
            950: "#052e16",
        },
        emerald: {
            50: "#ECFDF5",
            100: "#D1FAE5",
            200: "#A7F3D0",
            300: "#6EE7B7",
            400: "#34D399",
            500: "#10B981",
            600: "#059669",
            700: "#047857",
            800: "#065F46",
            900: "#064E3B",
            950: "#022c22",
        },
        teal: {
            50: "#F0FDFA",
            100: "#CCFBF1",
            200: "#99F6E4",
            300: "#5EEAD4",
            400: "#2DD4BF",
            500: "#14B8A6",
            600: "#0D9488",
            700: "#0F766E",
            800: "#115E59",
            900: "#134E4A",
            950: "#042f2e",
        },
        cyan: {
            50: "#ECFEFF",
            100: "#CFFAFE",
            200: "#A5F3FC",
            300: "#67E8F9",
            400: "#22D3EE",
            500: "#06B6D4",
            600: "#0891B2",
            700: "#0E7490",
            800: "#155E75",
            900: "#164E63",
            950: "#083344",
        },
        sky: {
            50: "#F0F9FF",
            100: "#E0F2FE",
            200: "#BAE6FD",
            300: "#7DD3FC",
            400: "#38BDF8",
            500: "#0EA5E9",
            600: "#0284C7",
            700: "#0369A1",
            800: "#075985",
            900: "#0C4A6E",
            950: "#082f49",
        },
        blue: {
            50: "#EFF6FF",
            100: "#DBEAFE",
            200: "#BFDBFE",
            300: "#93C5FD",
            400: "#60A5FA",
            500: "#3B82F6",
            600: "#2563EB",
            700: "#1D4ED8",
            800: "#1E40AF",
            900: "#1E3A8A",
            950: "#172554",
        },
        indigo: {
            50: "#EEF2FF",
            100: "#E0E7FF",
            200: "#C7D2FE",
            300: "#A5B4FC",
            400: "#818CF8",
            500: "#6366F1",
            600: "#4F46E5",
            700: "#4338CA",
            800: "#3730A3",
            900: "#312E81",
            950: "#1e1b4b",
        },
        violet: {
            50: "#F5F3FF",
            100: "#EDE9FE",
            200: "#DDD6FE",
            300: "#C4B5FD",
            400: "#A78BFA",
            500: "#8B5CF6",
            600: "#7C3AED",
            700: "#6D28D9",
            800: "#5B21B6",
            900: "#4C1D95",
            950: "#2e1065",
        },
        purple: {
            50: "#FAF5FF",
            100: "#F3E8FF",
            200: "#E9D5FF",
            300: "#D8B4FE",
            400: "#C084FC",
            500: "#A855F7",
            600: "#9333EA",
            700: "#7E22CE",
            800: "#6B21A8",
            900: "#581C87",
            950: "#3b0764",
        },
        fuchsia: {
            50: "#FDF4FF",
            100: "#FAE8FF",
            200: "#F5D0FE",
            300: "#F0ABFC",
            400: "#E879F9",
            500: "#D946EF",
            600: "#C026D3",
            700: "#A21CAF",
            800: "#86198F",
            900: "#701A75",
            950: "#4a044e",
        },
        pink: {
            50: "#FDF2F8",
            100: "#FCE7F3",
            200: "#FBCFE8",
            300: "#F9A8D4",
            400: "#F472B6",
            500: "#EC4899",
            600: "#DB2777",
            700: "#BE185D",
            800: "#9D174D",
            900: "#831843",
            950: "#500724",
        },
        rose: {
            50: "#FFF1F2",
            100: "#FFE4E6",
            200: "#FECDD3",
            300: "#FDA4AF",
            400: "#FB7185",
            500: "#F43F5E",
            600: "#E11D48",
            700: "#BE123C",
            800: "#9F1239",
            900: "#881337",
            950: "#4c0519",
        },
    },
    margins: [0, 0.125, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 4, 5, 6],
    padding: [0, 0.125, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 4, 5, 6],
    positions: [0],
    borders: {
        units: "px",
        styles: ["solid", "dashed", "dotted"],
        widths: [0, 1, 2],
        radius: [0.125, 0.25, 0.5],
    },
    shadows: {
        colors: {
            black: "0deg 0% 0%",
        },
        sizes: {
            sm: `
                0px 1px 3px hsl(var(--shadow-color) / 0.15)
            `,
            md: `
                0px 2px 2px hsl(var(--shadow-color) / 0.05),
                0px 4px 4px hsl(var(--shadow-color) / 0.05),
                0px 8px 8px hsl(var(--shadow-color) / 0.1)
            `,
            lg: `
                0px 2px 2px hsl(var(--shadow-color) / 0.05),
                0px 4px 4px hsl(var(--shadow-color) / 0.05),
                0px 8px 8px hsl(var(--shadow-color) / 0.05),
                0px 16px 16px hsl(var(--shadow-color) / 0.05),
                0px 32px 32px hsl(var(--shadow-color) / 0.05)
            `,
            xl: `
                0px 2px 2px hsl(var(--shadow-color) / 0.05),
                0px 4px 4px hsl(var(--shadow-color) / 0.05),
                0px 8px 8px hsl(var(--shadow-color) / 0.05),
                0px 16px 16px hsl(var(--shadow-color) / 0.05),
                0px 32px 32px hsl(var(--shadow-color) / 0.05),
                0px 48px 48px hsl(var(--shadow-color) / 0.05),
                0px 64px 64px hsl(var(--shadow-color) / 0.05)
            `,
        },
    },
    containers: {
        units: "px",
        screens: {
            320: 320,
            411: 411,
            768: 768,
            1024: 1024,
            1280: 1280,
            1920: 1920,
        },
        columns: [2, 3, 4],
    },
    gaps: [1, 1.5, 2],
    easings: {
        "in-out": "0.4, 0.0, 0.2, 1",
        in: "0.0, 0.0, 0.2, 1",
        out: "0.4, 0.0, 1, 1",
        bounce: "0.175, 0.885, 0.32, 1.275",
    },
    aspectRatios: ["16:9", "4:3", "1:1"],
    variables: {},
    themes: {},
    classes: {},
    opacity: [0.05, 0.1, 0.15, 0.3, 0.6, 0.87],
    prefixes: {},
};
```

## License

MIT Licensed. Default colors from [Tailwind CSS](https://tailwindcss.com/). Shadows based on [this blog post](https://www.joshwcomeau.com/css/designing-shadows/) by Joshua Comeau.
