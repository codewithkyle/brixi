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

            // Opacity
            if (customConfig?.opacity) {
                this.config.opacity = customConfig.opacity;
            }

            if (customConfig?.prefixes) {
                this.config.prefixes = Object.assign(this.config.prefixes, customConfig.prefixes);
            }
        }

        this.config.outDir = path.resolve(cwd, this.config.outDir);
    }

    processMediaRules(classes, mediaRules, type) {
        for (const prefix in this.config.prefixes){
            if (this.config.prefixes[prefix].features.includes(type)){
                mediaRules[prefix] = {
                    rule: this.config.prefixes[prefix].rule,
                    classes: {},
                };
                for (const className in classes){
                    mediaRules[prefix].classes[`${prefix}\\:${className}`] = classes[className];
                }
            }
        }
    }

    generateCSS(classes, mediaRules) {
        let data = "";
        for (const className in classes) {
            data += `.${className}{\n`;
            data += classes[className];
            data += "}\n";
        }
        for (const rule in mediaRules) {
            data += `@media (${mediaRules[rule].rule}){\n`;
            for (const className in mediaRules[rule].classes) {
                data += `\t.${className}{\n`;
                data += `\t${mediaRules[rule].classes[className]}`;
                data += "\t}\n";
            }
            data += "}\n";
        }
        return data;
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

    generateAttributes(attr, classComponents, values, unit = "") {
        const classes = {};
        for (let i = 0; i < classComponents.length; i++) {
            for (let k = 0; k < values.length; k++) {
                const className = `${attr}${classComponents[i].prefix}-${values[k].toString().replace(/(\.)|(\/)/g, "\\.")}`;
                classes[className] = "";
                for (let p = 0; p < classComponents[i].css.length; p++) {
                    classes[className] += `\t${classComponents[i].css[p]}: ${values[k]}${unit};\n`;
                }
            }
        }
        return classes;
    }

    generateMargins() {
        return new Promise((resolve, reject) => {
            const classComponents = [
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

            const classes = this.generateAttributes("m", classComponents, this.config.margins, this.config.baseUnit);
            classes["m-auto"] = "\tmargin: auto;\n";
            classes["mx-auto"] = "\tmargin-left: auto;\n\tmargin-right: auto;\n";
            classes["my-auto"] = "\tmargin-top: auto;\n\tmargin-bottom: auto;\n";
            classes["mt-auto"] = "\tmargin-top: auto;\n";
            classes["mr-auto"] = "\tmargin-right: auto;\n";
            classes["mb-auto"] = "\tmargin-bottom: auto;\n";
            classes["ml-auto"] = "\tmargin-left: auto;\n";

            const mediaRules = {};

            this.processMediaRules(classes, mediaRules, "margins");
            const data = this.generateCSS(classes, mediaRules);

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
            const classComponents = [
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

            const classes = this.generateAttributes("p", classComponents, this.config.padding, this.config.baseUnit);
            const mediaRules = {};

            this.processMediaRules(classes, mediaRules, "paddings");
            const data = this.generateCSS(classes, mediaRules);

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
            const classComponents = [
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

            const classes = this.generateAttributes("", classComponents, this.config.positions);
            classes["relative"] = "\tposition: relative;\n";
            classes["absolute"] = "\tposition: absolute;\n";
            classes["fixed"] = "\tposition: fixed;\n";
            classes["sticky"] = "\tposition: sticky;\n";
            classes["t-auto"] = "\ttop: auto;\n";
            classes["r-auto"] = "\tright: auto;\n";
            classes["b-auto"] = "\tbottom: auto;\n";
            classes["l-auto"] = "\tleft: auto;\n";
            classes["x-auto"] = "\tright: auto;\n\tleft: auto;\n";
            classes["y-auto"] = "\ttop: auto;\n\tbottom: auto;\n";
            classes["center"] = "\ttop: 50%;\n\tleft: 50%;\n\ttransform: translate(-50%, -50%);\n";
            classes["x-center"] = "\tleft: 50%;\n\ttransform: translateX(-50%);\n";
            classes["y-center"] = "\ttop: 50%;\n\ttransform: translateY(-50%);\n";

            const mediaRules = {};

            this.processMediaRules(classes, mediaRules, "positions");
            const data = this.generateCSS(classes, mediaRules);

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
            const borderAttrs = ["border", "border-top", "border-right", "border-bottom", "border-left"];
            const borderType = ["border", "border-t", "border-r", "border-b", "border-l"];

            const classes = {};
            const mediaRules = {};

            /** Border styles */
            if (this.config.features.borderStyles) {
                const borders = this.config.borders.styles;
                for (let i = 0; i < borderType.length; i++) {
                    for (let b = 0; b < borders.length; b++) {
                        classes[`${borderType[i]}-${borders[b]}`] = `\t${borderAttrs[i]}-style: ${borders[b]};\n`;
                    }
                }
            }

            /** Border widths */
            if (this.config.features.borderWidths) {
                const widths = this.config.borders.widths;
                for (let i = 0; i < borderType.length; i++) {
                    for (let b = 0; b < widths.length; b++) {
                        classes[`${borderType[i]}-${widths[b]}`] = `\t${borderAttrs[i]}-width: ${widths[b]}${this.config.borders?.units ?? this.config.baseUnit};\n`;
                    }
                }
            }

            /** Border colors */
            if (this.config.features.borderColors) {
                for (let i = 0; i < borderType.length; i++) {
                    for (const [name, values] of Object.entries(this.config.colors)) {
                        if (typeof values === "object") {
                            for (const [shade, value] of Object.entries(values)) {
                                classes[`${borderType[i]}-${name}-${shade}`] = `\t${borderAttrs[i]}-color: var(--${name}-${shade});\n`;
                            }
                        } else {
                            classes[`${borderType[i]}-${name}`] = `\t${borderAttrs[i]}-color: var(--${name});\n`;
                        }
                    }
                }
            }

            /** Border radius */
            if (this.config.features.borderRadius) {
                const radius = this.config.borders.radius;
                for (let b = 0; b < radius.length; b++) {
                    classes[`radius-${radius[b].toString().replace(/(\.)/g, "\\.")}`] = `\tborder-radius: ${radius[b]}${this.config.baseUnit};\n`;
                }

                /** Inject custom 50% border radius */
                classes["radius-circle"] = "\tborder-radius: 50%;\n";
            }


            if (Object.keys(classes).length > 0) {
                this.processMediaRules(classes, mediaRules, "borders");
                const data = this.generateCSS(classes, mediaRules);

                fs.writeFile(path.join(this.temp, `borders.css`), data, (error) => {
                    if (error) {
                        reject(error);
                    }
                    resolve();
                });
            } else {
                resolve();
            }
        });
    }

    generateFonts() {
        return new Promise((resolve, reject) => {
            const classes = {};
            const mediaRules = {};

            if (this.config.features.fontFamilies) {
                for (const [name, value] of Object.entries(this.config.fonts.families)) {
                    classes[`font-${name}`] = `\tfont-family: var(--font-${name});\n`;
                }
            }

            if (this.config.features.fontWeights) {
                for (const [name, value] of Object.entries(this.config.fonts.weights)) {
                    classes[`font-${name}`] = `\tfont-weight: var(--font-${name});\n`;
                }
            }

            if (this.config.features.fontColors) {
                for (const [name, values] of Object.entries(this.config.colors)) {
                    if (typeof values === "object") {
                        for (const [shade, value] of Object.entries(values)) {
                            classes[`font-${name}-${shade}`] = `\tcolor: var(--${name}-${shade});\n`;
                        }
                    } else {
                        classes[`font-${name}`] = `\tcolor: var(--${name});\n`;
                    }
                }
            }

            if (this.config.features.fontSizes) {
                for (const [size, value] of Object.entries(this.config.fonts.sizes)) {
                    classes[`font-${size}`] = `\tfont-size: var(--font-${size});\n`;
                }
            }

            if (Object.keys(classes).length > 0) {
                this.processMediaRules(classes, mediaRules, "fonts");
                const data = this.generateCSS(classes, mediaRules);

                fs.writeFile(path.join(this.temp, `fonts.css`), data, (error) => {
                    if (error) {
                        reject(error);
                    }
                    resolve();
                });
            } else {
                resolve();
            }
        });
    }

    generateBackgroundColors() {
        return new Promise((resolve, reject) => {
            let classes = {};
            let mediaRules = {};

            for (const [name, values] of Object.entries(this.config.colors)) {
                if (typeof values === "object") {
                    for (const [shade, value] of Object.entries(values)) {
                        classes[`bg-${name}-${shade}`] = `\tbackground-color: var(--${name}-${shade});\n`;
                    }
                } else {
                    classes[`bg-${name}`] = `\tbackground-color: var(--${name});\n`;
                }
            }

            this.processMediaRules(classes, mediaRules, "backgrounds");
            const data = this.generateCSS(classes, mediaRules);

            fs.writeFile(path.join(this.temp, `backgrounds.css`), data, (error) => {
                if (error) {
                    reject(error);
                }
                resolve();
            });
        });
    }

    generateShadows() {
        return new Promise((resolve, reject) => {
            const classes = {};
            const mediaRules = {};

            for (const color in this.config.shadows.colors) {
                for (const size in this.config.shadows.sizes) {
                    classes[`shadow-${color}-${size}`] = `\tbox-shadow: var(--shadow-${color}-${size});\n`;
                }
            }

            this.processMediaRules(classes, mediaRules, "shadows");
            const data = this.generateCSS(classes, mediaRules);

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
            const classes = {};
            const mediaRules = {};

            for (const [name, value] of Object.entries(this.config.containers.screens)) {
                classes[`w-${name}`] = `\twidth: ${value}${this.config.containers?.units ?? this.config.baseUnit};\n`;
                classes[`max-w-${name}`] = `\tmax-width: ${value}${this.config.containers?.units ?? this.config.baseUnit};\n`;
            }

            const columns = this.config.containers.columns;
            for (let i = 0; i < columns.length; i++) {
                for (let k = 1; k < columns[i]; k++) {
                    classes[`w-${k}\\/${columns[i]}`] = `\twidth: ${(k / columns[i]) * 100}%;\n`;
                }
            }
           
            // Static classes
            classes["w-auto"] = `\twidth: auto;\n`;
            classes["w-full"] = `\twidth: 100%;\n`;
            classes["w-screen"] = `\twidth: 100vw;\n`;
            classes["min-w-full"] = `\tmin-width: 100%;\n`;
            classes["max-w-full"] = `\tmax-width: 100%;\n`;
            classes["max-w-screen"] = `\tmax-width: 100vw;\n`;
            classes["h-auto"] = `\theight: auto;\n`;
            classes["h-full"] = `\theight: 100%;\n`;
            classes["h-screen"] = `\theight: 100vh;\n`;
            classes["min-h-full"] = `\tmin-height: 100%;\n`;
            classes["max-h-full"] = `\tmax-height: 100%;\n`;
            classes["max-h-screen"] = `\tmax-height: 100vh;\n`;

            this.processMediaRules(classes, mediaRules, "containers");
            const data = this.generateCSS(classes, mediaRules);

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
                    data += `.${className.trim().replace(/\./g, "\\.").replace(/\//g, "\\/")}{\n`;
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

    generateOpacity() {
        return new Promise((resolve, reject) => {
            const classes = {};
            const mediaRules = {};

            for (const opacity of this.config.opacity) {
                classes[`o-${opacity * 100}`] = `\topacity: ${opacity};\n`;
            }

            this.processMediaRules(classes, mediaRules, "opacity");
            const data = this.generateCSS(classes, mediaRules);

            fs.writeFile(path.join(this.temp, "opacity.css"), data, (error) => {
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
            const classes = {};
            const mediaRules = {};

            const ratios = this.config.aspectRatios;
            for (let i = 0; i < ratios.length; i++) {
                const values = ratios[i].trim().split(/\:|\//);
                if (values.length === 2) {
                    classes[`ar-${values[0]}\\:${values[1]}`] = `\taspect-ratio: ${values[0]} / ${values[1]}\n`;
                }
            }

            this.processMediaRules(classes, mediaRules, "aspectRatios");
            const data = this.generateCSS(classes, mediaRules);

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

            await this.generateBorders();
            await this.generateFonts();

            if (this.config.features.alignment) {
                await this.copyFile("alignment");
            }

            if (this.config.features.whitespace) {
                await this.copyFile("whitespace");
            }

            if (this.config.features.textTransforms) {
                await this.copyFile("textTransform");
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
                await this.copyFile("lineHeights");
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

            if (this.config.features.opacity) {
                await this.generateOpacity();
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
                fs.rmSync(path.join(this.output, "src"), { recursive: true });
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
