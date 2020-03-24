module.exports = {
    output: "sass",
    outDir: "./brixi",
    fonts: {
        base: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
        serif: "Georgia, Cambria, 'Times New Roman', Times, serif",
        mono: "Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    },
    colors: {
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
        },
        danger: {
            100: "#FFF5F5",
            200: "#FED7D7",
            300: "#FEB2B2",
            400: "#FC8181",
            500: "#F56565",
            600: "#E53E3E",
            700: "#C53030",
            800: "#9B2C2C",
            900: "#742A2A",
        },
        warning: {
            100: "#FFFFF0",
            200: "#FEFCBF",
            300: "#FAF089",
            400: "#F6E05E",
            500: "#ECC94B",
            600: "#D69E2E",
            700: "#B7791F",
            800: "#975A16",
            900: "#744210",
        },
        success: {
            100: "#F0FFF4",
            200: "#C6F6D5",
            300: "#9AE6B4",
            400: "#68D391",
            500: "#48BB78",
            600: "#38A169",
            700: "#2F855A",
            800: "#276749",
            900: "#22543D",
        },
        grey: {
            100: "#F7FAFC",
            200: "#EDF2F7",
            300: "#E2E8F0",
            400: "#CBD5E0",
            500: "#A0AEC0",
            600: "#718096",
            700: "#4A5568",
            800: "#2D3748",
            900: "#1A202C",
        },
        neutral: {
            100: "#f5f5f5",
            200: "#eeeeee",
            300: "#e0e0e0",
            400: "#bdbdbd",
            500: "#9e9e9e",
            600: "#757575",
            700: "#616161",
            800: "#424242",
            900: "#212121",
        },
    },
    margins: [0, 0.125, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 4, 5, 6],
    padding: [0, 0.125, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 4, 5, 6],
    positions: [0],
    borders: {
        styles: ["solid", "dashed", "dotted"],
        widths: [0, 1, 2],
    },
};
