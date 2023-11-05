module.exports = {
    prefixes: {
        dark: {
            features: ["backgrounds", "fonts", "borders"],
            rule: "prefers-color-scheme: dark",
        },
        sm: {
            features: ["containers", "display", "margins", "padding", "textTransforms"],
            rule: "min-width: 411px",
        },
        md: {
            features: ["containers", "display", "margins", "padding", "flexbox"],
            rule: "min-width: 768px",
        }
    },
};
