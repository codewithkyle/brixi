#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const glob = require("glob");
const semver = require("semver");
const yargs = require("yargs").argv;
const minify = require("minify");
const ora = require("ora");
var convert = require('color-convert');

const cwd = process.cwd();
const defaultConfig = require("./config.js");

/** Verify Nodejs version */
const packageJson = require(path.join(__dirname, "package.json"));
const version = packageJson.engines.node;
if (!semver.satisfies(process.version, version)) {
    const rawVersion = version.replace(/[^\d\.]*/, "");
    console.log(`Brixi requires at least Node v${rawVersion} and you're using Node ${process.version}`);
    process.exit(1);
}

class Brixi {
    constructor() {
        this.spinner = ora("Assembling Brixi").start();
        this.config = defaultConfig;
        this.wrangleConfigs();
        this.temp = path.join(__dirname, "temp");
        this.output = path.join(__dirname, "output");
        this.important = this.config.important;

        if (yargs.debug) {
            console.log(this.config);
        }

        this.run();
    }

    wrangleConfigs() {
        let customConfig = null;
        const configArgs = yargs.c || yargs.config || null;
        let pathToCustomConfig;
        if (configArgs) {
            pathToCustomConfig = path.resolve(cwd, configArgs);
            if (fs.existsSync(pathToCustomConfig)) {
                customConfig = require(pathToCustomConfig);
            } else {
                console.log(`Unabled to find custom config file at ${pathToCustomConfig}`);
                process.exit(1);
            }
        } else {
            pathToCustomConfig = path.join(cwd, "brixi.config.js");
            if (fs.existsSync(pathToCustomConfig)) {
                customConfig = require(pathToCustomConfig);
            } else {
                pathToCustomConfig = path.join(cwd, "brixi.js");
                if (fs.existsSync(pathToCustomConfig)) {
                    customConfig = require(pathToCustomConfig);
                }
            }
        }

        if (customConfig) {
            // General info
            if (customConfig?.outDir) {
                this.config.outDir = customConfig.outDir;
            }
            if (customConfig?.important) {
                this.config.important = customConfig.important;
            }
            if (customConfig?.output) {
                this.config.output = customConfig.output;
            }
            if (customConfig?.baseUnit) {
                this.config.baseUnit = customConfig.baseUnit;
            }
            if (customConfig?.features) {
                this.config.features = Object.assign(this.config.features, customConfig.features);
            }

            // Fonts
            if (customConfig?.fonts) {
                if (customConfig.fonts?.units) {
                    this.config.fonts.units = customConfig.fonts.units;
                }
                if (customConfig.fonts?.families) {
                    this.config.fonts.families = Object.assign(this.config.fonts.families, customConfig.fonts.families);
                }
                if (customConfig.fonts?.weights) {
                    this.config.fonts.weights = Object.assign(this.config.fonts.weights, customConfig.fonts.weights);
                }
                if (customConfig.fonts?.sizes) {
                    this.config.fonts.sizes = Object.assign(this.config.fonts.sizes, customConfig.fonts.sizes);
                }
            }

            // Colours
            if (customConfig?.colors) {
                this.config.colors = customConfig.colors;
            }

            // Margins
            if (customConfig?.margins) {
                this.config.margins = customConfig.margins;
            }

            // Padding
            if (customConfig?.padding) {
                this.config.padding = customConfig.padding;
            }

            // Positions
            if (customConfig?.positions) {
                this.config.positions = customConfig.positions;
            }

            // Borders
            if (customConfig?.borders) {
                this.config.borders = Object.assign(this.config.borders, customConfig.borders);
            }

            // Shadows
            if (customConfig?.shadows) {
                if (customConfig.shadows?.sizes) {
                    this.config.shadows.sizes = Object.assign(this.config.shadows.sizes, customConfig.shadows.sizes);
                }
                if (customConfig.shadows?.colors) {
                    this.config.shadows.colors = Object.assign(this.config.shadows.colors, customConfig.shadows.colors);
                }
            }

            // Containers
            if (customConfig?.containers) {
                this.config.containers = Object.assign(this.config.containers, customConfig.containers);
            }

            // Gaps
            if (customConfig?.gaps) {
                this.config.gaps = customConfig.gaps;
            }

            // Easings
            if (customConfig?.easings) {
                this.config.easings = customConfig.easings;
            }

            // Aspect ratios
            if (customConfig?.aspectRatios) {
                this.config.aspectRatios = customConfig.aspectRatios;
            }

            // Variables
            if (customConfig?.variables) {
                this.config.variables = Object.assign(this.config.variables, customConfig.variables);
            }

            // Themes
            if (customConfig?.themes) {
                this.config.themes = Object.assign(this.config.themes, customConfig.themes);
            }

            // Customer classes
            if (customConfig?.classes) {
                this.config.classes = customConfig.classes;
            }
        }

        this.config.outDir = path.resolve(cwd, this.config.outDir);
    }

    copyCSS() {
        return new Promise((resolve, reject) => {
            glob(`${this.temp}/*.css`, (error, files) => {
                if (error) {
                    reject(error);
                }

                let copied = 0;
                for (let i = 0; i < files.length; i++) {
                    const filename = files[i].replace(/.*[\/\\]/, "");
                    fs.copyFile(files[i], path.join(this.output, "src", filename), (error) => {
                        if (error) {
                            reject(error);
                        }
                        copied++;
                        if (copied === files.length) {
                            resolve();
                        }
                    });
                }
            });
        });
    }

    minifyCSS() {
        return new Promise((resolve, reject) => {
            glob(`${this.output}/src/*.css`, (error, files) => {
                if (error) {
                    reject(error);
                }

                let data = "";
                let minified = 0;
                for (let i = 0; i < files.length; i++) {
                    minify(files[i]).then((css) => {
                        data += css;
                        minified++;
                        if (minified === files.length) {
                            resolve(data);
                        }
                    });
                }
            });
        });
    }

    generateVariables() {
        return new Promise((resolve, reject) => {
            let data = ":root{\n";

            /** Colors */
            for (const [name, values] of Object.entries(this.config.colors)) {
                if (typeof values === "object") {
                    for (const [shade, value] of Object.entries(values)) {
                        data += `\t--${name}-${shade}: ${value};\n`;
                        const rgb = convert.hex.rgb(value);
                        data += `\t--${name}-${shade}-rgb: ${rgb[0]}, ${rgb[1]}, ${rgb[2]};\n`;
                        const hsl = convert.hex.hsl(value);
                        data += `\t--${name}-${shade}-hsl: ${hsl[0]} ${hsl[1]}% ${hsl[2]}%;\n`;
                    }
                } else {
                    data += `\t--${name}: ${values};\n`;
                    const rgb = convert.hex.rgb(values);
                    data += `\t--${name}-rgb: ${rgb[0]}, ${rgb[1]}, ${rgb[2]};\n`;
                    const hsl = convert.hex.hsl(values);
                    data += `\t--${name}-hsl: ${hsl[0]} ${hsl[1]}% ${hsl[2]}%;\n`;
                }

                data += "\n";
            }

            /** Fonts */
            for (const [name, value] of Object.entries(this.config.fonts.families)) {
                data += `\t--font-${name}: ${value};\n`;
            }

            data += "\n";

            for (const [name, value] of Object.entries(this.config.fonts.weights)) {
                data += `\t--font-${name}: ${value};\n`;
            }

            data += "\n";

            /** Font sizes */
            for (const [name, value] of Object.entries(this.config.fonts.sizes)) {
                data += `\t--font-${name}: ${value}${this.config.fonts?.units ?? this.config.baseUnit};\n`;
            }

            data += "\n";

            /** Box shadows */
            for (const color in this.config.shadows.colors) {
                const hsl = this.config.shadows.colors[color];
                for (const size in this.config.shadows.sizes) {
                    data += `\t--shadow-${color}-${size}: ${this.config.shadows.sizes[size]
                        .replace(/var\(--shadow-color\)/gi, hsl)
                        .replace(/\t|\n|\r/g, "")
                        .replace(/\s+/g, " ")
                        .trim()};\n`;
                }
            }

            data += "\n";

            /** Easing */
            for (const [name, value] of Object.entries(this.config.easings)) {
                data += `\t--ease-${name}: cubic-bezier(${value});\n`;
            }

            /** Custom variables */
            for (const variable in this.config.variables) {
                data += `\t--${variable}: ${this.config.variables[variable]};\n`;
            }

            /** End of general */
            data += "}\n";

            /** Themes */
            for (const theme in this.config.themes) {
                data += `:root[theme="${theme}"]{\n`;
                for (const variable in this.config.themes[theme]) {
                    data += `\t--${variable}: ${this.config.themes[theme][variable]};\n`;
                }
                data += "}\n";

                if (theme === "dark" || theme === "light") {
                    data += `@media (prefers-color-scheme: ${theme}) {\n`;
                    data += `\t:root[theme="auto"]{\n`;
                    for (const variable in this.config.themes[theme]) {
                        data += `\t\t--${variable}: ${this.config.themes[theme][variable]};\n`;
                    }
                    data += "\t}\n}\n";
                }
            }

            fs.writeFile(path.join(this.temp, `variables.css`), data, (error) => {
                if (error) {
                    reject(error);
                }
                resolve();
            });
        });
    }

    makeImportant() {
        return new Promise((resolve, reject) => {
            glob(`${this.output}/**/*.css`, (error, files) => {
                if (error) {
                    reject(error);
                }

                let updated = 0;
                for (let i = 0; i < files.length; i++) {
                    if (!files[i].match(/variables/g)) {
                        fs.readFile(files[i], (error, buffer) => {
                            if (error) {
                                reject(error);
                            }
                            const data = buffer.toString().replace(/\;/g, " !important;");
                            fs.writeFile(files[i], data, (error) => {
                                if (error) {
                                    reject(error);
                                }
                                updated++;
                                if (updated === files.length) {
                                    resolve();
                                }
                            });
                        });
                    } else {
                        updated++;
                        if (updated === files.length) {
                            resolve();
                        }
                    }
                }
            });
        });
    }

    generateAttributes(attr, classes, values, unit = "") {
        let data = "";
        for (let i = 0; i < classes.length; i++) {
            for (let k = 0; k < values.length; k++) {
                data += `.${attr}${classes[i].prefix}-${values[k].toString().replace(/(\.)|(\/)/g, "\\.")}{\n`;
                for (let p = 0; p < classes[i].css.length; p++) {
                    data += `\t${classes[i].css[p]}: ${values[k]}${unit};\n`;
                }
                data += "}\n";
            }
        }
        return data;
    }

    generateMargins() {
        return new Promise((resolve, reject) => {
            let data = "";
            const classes = [
                {
                    prefix: "",
                    css: ["margin"],
                },
                {
                    prefix: "t",
                    css: ["margin-top"],
                },
                {
                    prefix: "r",
                    css: ["margin-right"],
                },
                {
                    prefix: "b",
                    css: ["margin-bottom"],
                },
                {
                    prefix: "l",
                    css: ["margin-left"],
                },
                {
                    prefix: "x",
                    css: ["margin-left", "margin-right"],
                },
                {
                    prefix: "y",
                    css: ["margin-top", "margin-bottom"],
                },
            ];

            const staticData = fs.readFileSync(path.join(__dirname, "src/margin.css"));
            data += staticData;
            data += this.generateAttributes("m", classes, this.config.margins, this.config.baseUnit);

            fs.writeFile(path.join(this.temp, `margins.css`), data, (error) => {
                if (error) {
                    reject(error);
                }
                resolve();
            });
        });
    }

    generatePaddings() {
        return new Promise((resolve, reject) => {
            let data = "";
            const classes = [
                {
                    prefix: "",
                    css: ["padding"],
                },
                {
                    prefix: "t",
                    css: ["padding-top"],
                },
                {
                    prefix: "r",
                    css: ["padding-right"],
                },
                {
                    prefix: "b",
                    css: ["padding-bottom"],
                },
                {
                    prefix: "l",
                    css: ["padding-left"],
                },
                {
                    prefix: "x",
                    css: ["padding-left", "padding-right"],
                },
                {
                    prefix: "y",
                    css: ["padding-top", "padding-bottom"],
                },
            ];

            data += this.generateAttributes("p", classes, this.config.padding, this.config.baseUnit);

            fs.writeFile(path.join(this.temp, `padding.css`), data, (error) => {
                if (error) {
                    reject(error);
                }
                resolve();
            });
        });
    }

    generatePositions() {
        return new Promise((resolve, reject) => {
            let data = "";
            const classes = [
                {
                    prefix: "t",
                    css: ["top"],
                },
                {
                    prefix: "r",
                    css: ["right"],
                },
                {
                    prefix: "b",
                    css: ["bottom"],
                },
                {
                    prefix: "l",
                    css: ["left"],
                },
            ];

            const staticData = fs.readFileSync(path.join(__dirname, "src/position.css"));
            data += staticData;
            data += this.generateAttributes("", classes, this.config.positions);

            fs.writeFile(path.join(this.temp, `positions.css`), data, (error) => {
                if (error) {
                    reject(error);
                }
                resolve();
            });
        });
    }

    generateBorders() {
        return new Promise((resolve, reject) => {
            let data = "";

            const borderAttrs = ["border", "border-top", "border-right", "border-bottom", "border-left"];
            const borderType = ["border", "border-t", "border-r", "border-b", "border-l"];

            /** Border styles */
            const borders = this.config.borders.styles;
            for (let i = 0; i < borderType.length; i++) {
                for (let b = 0; b < borders.length; b++) {
                    data += `.${borderType[i]}-${borders[b]}{\n`;
                    data += `\t${borderAttrs[i]}-style: ${borders[b]};\n`;
                    data += "}\n";
                }
            }

            /** Border widths */
            const widths = this.config.borders.widths;
            for (let i = 0; i < borderType.length; i++) {
                for (let b = 0; b < widths.length; b++) {
                    data += `.${borderType[i]}-${widths[b]}{\n`;
                    data += `\t${borderAttrs[i]}-width: ${widths[b]}${this.config.borders?.units ?? this.config.baseUnit};\n`;
                    data += "}\n";
                }
            }

            /** Border colors */
            for (let i = 0; i < borderType.length; i++) {
                for (const [name, values] of Object.entries(this.config.colors)) {
                    if (typeof values === "object") {
                        for (const [shade, value] of Object.entries(values)) {
                            data += `.${borderType[i]}-${name}-${shade}{\n`;
                            data += `\t${borderAttrs[i]}-color: var(--${name}-${shade});\n`;
                            data += "}\n";
                        }
                    } else {
                        data += `.${borderType[i]}-${name}{\n`;
                        data += `\t${borderAttrs[i]}-color: var(--${name});\n`;
                        data += "}\n";
                    }
                }
            }

            /** Border radius */
            const radius = this.config.borders.radius;
            for (let b = 0; b < radius.length; b++) {
                data += `.radius-${radius[b].toString().replace(/(\.)/g, "\\.")}{\n`;
                data += `\tborder-radius: ${radius[b]}${this.config.baseUnit};\n`;
                data += "}\n";
            }

            /** Inject custom 50% border radius */
            data += ".radius-circle{\n\tborder-radius: 50%;\n}\n";

            fs.writeFile(path.join(this.temp, `borders.css`), data, (error) => {
                if (error) {
                    reject(error);
                }
                resolve();
            });
        });
    }

    generateFonts() {
        return new Promise((resolve, reject) => {
            let data = "";

            for (const [name, value] of Object.entries(this.config.fonts.families)) {
                data += `.font-${name}{\n`;
                data += `\tfont-family: var(--font-${name});\n`;
                data += "}\n";
            }

            for (const [name, value] of Object.entries(this.config.fonts.weights)) {
                data += `.font-${name}{\n`;
                data += `\tfont-weight: var(--font-${name});\n`;
                data += "}\n";
            }

            fs.writeFile(path.join(this.temp, `fonts.css`), data, (error) => {
                if (error) {
                    reject(error);
                }
                resolve();
            });
        });
    }

    generateFontColors() {
        return new Promise((resolve, reject) => {
            let data = "";

            for (const [name, values] of Object.entries(this.config.colors)) {
                if (typeof values === "object") {
                    for (const [shade, value] of Object.entries(values)) {
                        data += `.font-${name}-${shade}{\n`;
                        data += `\tcolor: var(--${name}-${shade});\n`;
                        data += "}\n";
                    }
                } else {
                    data += `.font-${name}{\n`;
                    data += `\tcolor: var(--${name});\n`;
                    data += "}\n";
                }
            }

            fs.writeFile(path.join(this.temp, `font-colors.css`), data, (error) => {
                if (error) {
                    reject(error);
                }
                resolve();
            });
        });
    }

    generateFontSizes() {
        return new Promise((resolve, reject) => {
            let data = "";

            for (const [size, value] of Object.entries(this.config.fonts.sizes)) {
                data += `.font-${size}{\n`;
                data += `\tfont-size: var(--font-${size});\n`;
                data += "}\n";
            }

            fs.writeFile(path.join(this.temp, `font-sizes.css`), data, (error) => {
                if (error) {
                    reject(error);
                }
                resolve();
            });
        });
    }

    generateBackgroundColors() {
        return new Promise((resolve, reject) => {
            let data = "";

            for (const [name, values] of Object.entries(this.config.colors)) {
                if (typeof values === "object") {
                    for (const [shade, value] of Object.entries(values)) {
                        data += `.bg-${name}-${shade}{\n`;
                        data += `\tbackground-color: var(--${name}-${shade});\n`;
                        data += "}\n";
                    }
                } else {
                    data += `.bg-${name}{\n`;
                    data += `\tbackground-color: var(--${name});\n`;
                    data += "}\n";
                }
            }

            fs.writeFile(path.join(this.temp, `background-colors.css`), data, (error) => {
                if (error) {
                    reject(error);
                }
                resolve();
            });
        });
    }

    generateShadows() {
        return new Promise((resolve, reject) => {
            let data = "";

            for (const color in this.config.shadows.colors) {
                for (const size in this.config.shadows.sizes) {
                    data += `.shadow-${color}-${size}{\n`;
                    data += `\tbox-shadow: var(--shadow-${color}-${size});\n`;
                    data += "}\n";
                }
            }

            fs.writeFile(path.join(this.temp, `shadows.css`), data, (error) => {
                if (error) {
                    reject(error);
                }
                resolve();
            });
        });
    }

    generateContainers() {
        return new Promise((resolve, reject) => {
            let data = "";

            for (const [name, value] of Object.entries(this.config.containers.screens)) {
                data += `.w-${name}{\n`;
                data += `\twidth: ${value}${this.config.containers?.units ?? this.config.baseUnit};\n`;
                data += "}\n";

                data += `.max-w-${name}{\n`;
                data += `\tmax-width: ${value}${this.config.containers?.units ?? this.config.baseUnit};\n`;
                data += "}\n";
            }

            const columns = this.config.containers.columns;
            for (let i = 0; i < columns.length; i++) {
                for (let k = 1; k < columns[i]; k++) {
                    data += `.w-${k}\\/${columns[i]}{\n`;
                    data += `\twidth: ${(k / columns[i]) * 100}%;\n`;
                    data += "}\n";
                }
            }

            const staticData = fs.readFileSync(path.join(__dirname, "src/container.css"));
            data += staticData.toString();

            fs.writeFile(path.join(this.temp, `containers.css`), data, (error) => {
                if (error) {
                    reject(error);
                }
                resolve();
            });
        });
    }

    generateCustomClasses() {
        return new Promise((resolve, reject) => {
            let data = "";

            for (const [className, css] of Object.entries(this.config.classes)) {
                if (typeof css === "string") {
                    data += `.${className.trim().replace(/\./g, "\\.").replace(/\//g, "\\/")}{\n}`;
                    data += `${css.replace(/\;$/, "")};\n`;
                    data += "}\n";
                }
            }

            fs.writeFile(path.join(this.temp, "custom.css"), data, (error) => {
                if (error) {
                    reject(error);
                }
                resolve();
            });
        });
    }

    generateGrid() {
        return new Promise((resolve, reject) => {
            let data = "";

            const gaps = this.config.gaps;
            for (let i = 0; i < gaps.length; i++) {
                data += `[grid~="gap-${gaps[i]}"]{\n`;
                data += `\tgap: ${gaps[i]}${this.config.baseUnit};\n`;
                data += "}\n";
            }

            const staticData = fs.readFileSync(path.join(__dirname, "src/grid.css"));
            data += staticData.toString();

            fs.writeFile(path.join(this.temp, `grid.css`), data, (error) => {
                if (error) {
                    reject(error);
                }
                resolve();
            });
        });
    }

    generateAspectRatios() {
        return new Promise((resolve, reject) => {
            let data = "";
            const ratios = this.config.aspectRatios;
            for (let i = 0; i < ratios.length; i++) {
                const values = ratios[i].trim().split(/\:|\//);
                if (values.length === 2) {
                    data += `@supports not (aspect-ratio: 1 / 1){\n`;
                    data += `\t.ar-${values[0]}\\:${values[1]}::before{\n`;
                    data += `\t\tcontent:"";\n`;
                    data += `\t\twidth: 100%;\n`;
                    data += `\t\tdisplay: block;\n`;
                    data += `\t\tpadding-bottom: ${(values[1] / values[0]) * 100}%;\n`;
                    data += `\t}\n`;
                    data += `}\n`;

                    data += `@supports (aspect-ratio: 1 / 1){\n`;
                    data += `\t.ar-${values[0]}\\:${values[1]}{\n`;
                    data += `\t\taspect-ratio: ${values[0]} / ${values[1]}\n`;
                    data += `\t}\n`;
                    data += `}\n`;
                }
            }
            fs.writeFile(path.join(this.temp, "aspect-ratios.css"), data, (error) => {
                if (error) {
                    reject();
                }
                resolve();
            });
        });
    }

    copyFile(fileName) {
        return new Promise((resolve, reject) => {
            fs.readFile(path.join(__dirname, `src/${fileName}.css`), (error, buffer) => {
                if (error) {
                    reject(error);
                }
                fs.writeFile(path.join(this.temp, `${fileName}.css`), buffer, (error) => {
                    if (error) {
                        reject(error);
                    }
                    resolve();
                });
            });
        });
    }

    async run() {
        try {
            /** Setup */
            if (fs.existsSync(this.temp)) {
                fs.rmSync(this.temp, { recursive: true });
            }
            fs.mkdirSync(this.temp);
            if (fs.existsSync(this.output)) {
                fs.rmSync(this.output, { recursive: true });
            }
            fs.mkdirSync(this.output);
            fs.mkdirSync(path.join(this.output, "src"));

            /** CSS Generators */
            await this.generateVariables();

            if (this.config.features.margin) {
                await this.generateMargins();
            }

            if (this.config.features.padding) {
                await this.generatePaddings();
            }

            if (this.config.features.positions) {
                await this.generatePositions();
            }

            if (this.config.features.borders) {
                await this.generateBorders();
            }

            if (this.config.features.fonts) {
                await this.generateFonts();
                await this.generateFontColors();
                await this.generateFontSizes();
            }

            if (this.config.features.alignment) {
                await this.copyFile("alignment");
            }

            if (this.config.features.whitespace) {
                await this.copyFile("whitespace");
            }

            if (this.config.features.textTransforms) {
                await this.copyFile("text-transform");
            }

            if (this.config.features.backgrounds) {
                await this.generateBackgroundColors();
            }

            if (this.config.features.grid) {
                await this.generateGrid();
            }

            if (this.config.features.flexbox) {
                await this.copyFile("flexbox");
            }

            if (this.config.features.shadows) {
                await this.generateShadows();
            }

            if (this.config.features.containers) {
                await this.generateContainers();
            }

            if (this.config.features.cursors) {
                await this.copyFile("cursor");
            }

            if (this.config.features.lineHeight) {
                await this.copyFile("line-heights");
            }

            if (this.config.features.scroll) {
                await this.copyFile("scrolling");
            }

            if (this.config.features.aspectRatios) {
                await this.generateAspectRatios();
            }

            if (this.config.features.display) {
                await this.copyFile("display");
            }

            if (Object.keys(this.config.classes).length) {
                await this.generateCustomClasses();
            }

            await this.copyCSS();

            if (this.config.important) {
                await this.makeImportant();
            }

            if (fs.existsSync(this.config.outDir)) {
                fs.rmSync(this.config.outDir, { recursive: true });
            }

            if (this.config.output === "production") {
                const prodCSS = await this.minifyCSS();
                fs.writeFileSync(path.join(this.output, "brixi.css"), prodCSS);
                fs.rmSync(path.join(this.output, "src"), { recursive: true });
            } else {
                const sourceFiles = glob.sync(`${this.output}/src/*.css`);
                for (let i = 0; i < sourceFiles.length; i++) {
                    const filename = sourceFiles[i].replace(/.*[\\\/]/, "");
                    fs.renameSync(sourceFiles[i], path.join(this.output, filename));
                }
                fs.rmSync(path.join(this.output, "src"));
            }

            fs.renameSync(this.output, this.config.outDir);
            fs.rmSync(this.temp, { recursive: true });

            this.spinner.succeed();
            process.exit(0);
        } catch (error) {
            this.spinner.fail("Brixi build failed, see errors below.");
            console.log(error);
            process.exit(1);
        }
    }
}
new Brixi();
