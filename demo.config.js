module.exports = {
    prefixes: {
        dark: {
            features: ["backgrounds", "fonts", "borders", "shadows", "opacity"],
            rule: "prefers-color-scheme: dark",
        },
        xs: {
            features: ["containers", "display", "margins", "padding", "flexbox", "alignment", "whitespace", "aspectRatios"],
            rule: "min-width: 411px",
        },
        sm: {
            features: ["containers", "display", "margins", "padding", "flexbox", "alignment", "whitespace", "aspectRatios"],
            rule: "min-width: 768px",
        },
        md: {
            features: ["containers", "display", "margins", "padding", "flexbox", "alignment", "whitespace", "aspectRatios"],
            rule: "min-width: 1024px",
        },
        lg: {
            features: ["containers", "display", "margins", "padding", "flexbox", "alignment", "whitespace", "aspectRatios"],
            rule: "min-width: 1280px",
        },
        xl: {
            features: ["containers", "display", "margins", "padding", "flexbox", "alignment", "whitespace", "aspectRatios"],
            rule: "min-width: 1920px",
        },
    },
};
