# Managing Colors

Use the `colors` object in the `brixi.config.js` file. Colors can be a single value or a group of shades.

```bash
colors: {
    white: "#ffffff",
    black: "#000000",
    primary: {
        100: "#EBF8FF",
        200: "#BEE3F8",
        300: "#90CDF4",
        400: "#63B3ED",
        500: "#4299E1",
        600: "#3182CE",
        700: "#2B6CB0",
        800: "#2C5282",
        900: "#2A4365",
    }
}
```

Convert a single primary color into several shades using [Colortron 9000](https://colorpalette.app/). You can also check your color palette's accessibility [here](https://accessiblecolors.app/).

> **Note**: Starting in v0.6 only the colors provided in the `colors` object will be used. If you're project doesn't use a custom config or your `colors` object is excluded the default colors will be used. If you need to mix the default colors with custom colors you'll need to copy and paste the color values out of the default config into your custom config. This change was required for reducing the output file size.
