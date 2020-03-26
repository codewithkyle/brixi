#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const glob = require("glob");
const semver = require("semver");
const sass = require("node-sass");
const yargs = require("yargs").argv;
const minify = require("minify");
const ora = require("ora");

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
        this.output = path.join(__dirname, "output");
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
            this.config = Object.assign(this.config, customConfig);
        }

        this.config.output = this.config.output.toLowerCase().trim();
        if (this.config.output !== "css" && this.config.output !== "scss" && this.config.output !== "sass") {
            this.config.output = "scss";
        }
    }

    minifyCSS() {
        return new Promise((resolve, reject) => {
            glob(`${this.output}/*.css`, (error, files) => {
                if (error) {
                    reject(error);
                }

                let minified = 0;
                for (let i = 0; i < files.length; i++) {
                    minify(files[i]).then((css) => {
                        fs.unlink(files[i], (error) => {
                            if (error) {
                                reject(error);
                            }

                            fs.writeFile(files[i], css, (error) => {
                                if (error) {
                                    reject(error);
                                }

                                minified++;
                                if (minified === files.length) {
                                    resolve();
                                }
                            });
                        });
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
                for (const [shade, value] of Object.entries(values)) {
                    data += `\t--${name}-${shade}: ${value};\n`;
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

            /** Box shadows */
            for (const [name, value] of Object.entries(this.config.shadows)) {
                data += `\t--shadow-${name}: ${value};\n`;
            }

            data += "}\n";

            fs.writeFile(path.join(this.output, `variables.${this.config.output}`), data, (error) => {
                if (error) {
                    reject(error);
                }
                resolve();
            });
        });
    }

    generateAttributes(attr, classes, values, unit = "") {
        let data = "";
        for (let i = 0; i < classes.length; i++) {
            for (let k = 0; k < values.length; k++) {
                data += `[${attr}~="${classes[i].prefix}-${values[k]}"]{\n`;
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
            data += this.generateAttributes("margin", classes, this.config.margins, "rem");

            fs.writeFile(path.join(this.output, `margins.${this.config.output}`), data, (error) => {
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

            data += this.generateAttributes("padding", classes, this.config.padding, "rem");

            fs.writeFile(path.join(this.output, `paddings.${this.config.output}`), data, (error) => {
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
            data += this.generateAttributes("position", classes, this.config.positions);

            fs.writeFile(path.join(this.output, `positions.${this.config.output}`), data, (error) => {
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

            /** Border styles */
            const borders = this.config.borders.styles;
            for (let a = 0; a < borderAttrs.length; a++) {
                for (let i = 0; i < borders.length; i++) {
                    data += `[${borderAttrs[a]}~="${borders[i]}"]{\n`;
                    data += `\t${borderAttrs[a]}-style: ${borders[i]};\n`;
                    data += "}\n";
                }
            }

            /** Border widths */
            const widths = this.config.borders.widths;
            for (let a = 0; a < borderAttrs.length; a++) {
                for (let i = 0; i < widths.length; i++) {
                    data += `[${borderAttrs[a]}~="${widths[i]}"]{\n`;
                    data += `\t${borderAttrs[a]}-width: ${widths[i]}px;\n`;
                    data += "}\n";
                }
            }

            /** Border colors */
            for (let a = 0; a < borderAttrs.length; a++) {
                for (const [name, values] of Object.entries(this.config.colors)) {
                    for (const [shade, value] of Object.entries(values)) {
                        data += `[${borderAttrs[a]}~="${name}-${shade}"]{\n`;
                        data += `\t${borderAttrs[a]}-color: ${value};\n`;
                        data += "}\n";
                    }
                }
            }

            // TODO: Border radius

            fs.writeFile(path.join(this.output, `borders.${this.config.output}`), data, (error) => {
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

            fs.writeFile(path.join(this.output, `fonts.${this.config.output}`), data, (error) => {
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
                for (const [shade, value] of Object.entries(values)) {
                    data += `.font-${name}-${shade}{\n`;
                    data += `\tcolor: var(--${name}-${shade});\n`;
                    data += "}\n";
                }
            }

            fs.writeFile(path.join(this.output, `font-colors.${this.config.output}`), data, (error) => {
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
                for (const [shade, value] of Object.entries(values)) {
                    data += `.bg-${name}-${shade}{\n`;
                    data += `\tbackground-color: var(--${name}-${shade});\n`;
                    data += "}\n";
                }
            }

            fs.writeFile(path.join(this.output, `background-colors.${this.config.output}`), data, (error) => {
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

            for (const [name, values] of Object.entries(this.config.shadows)) {
                data += `.shadow-${name}{\n`;
                data += `\tbox-shadow: var(--shadow-${name});\n`;
                data += "}\n";
            }

            fs.writeFile(path.join(this.output, `shadows.${this.config.output}`), data, (error) => {
                if (error) {
                    reject(error);
                }
                resolve();
            });
        });
    }

    copyText() {
        return new Promise((resolve, reject) => {
            fs.readFile(path.join(__dirname, "src/text.css"), (error, buffer) => {
                if (error) {
                    reject(error);
                }
                fs.writeFile(path.join(this.output, `text.${this.config.output}`), buffer, (error) => {
                    if (error) {
                        reject(error);
                    }
                    resolve();
                });
            });
        });
    }

    copyCursor() {
        return new Promise((resolve, reject) => {
            fs.readFile(path.join(__dirname, "src/cursor.css"), (error, buffer) => {
                if (error) {
                    reject(error);
                }
                fs.writeFile(path.join(this.output, `cursor.${this.config.output}`), buffer, (error) => {
                    if (error) {
                        reject(error);
                    }
                    resolve();
                });
            });
        });
    }

    generateContainers() {
        return new Promise((resolve, reject) => {
            let data = "";

            for (const [name, value] of Object.entries(this.config.containers.screens)) {
                data += `.w-${name}{\n`;
                data += `\twidth: ${value}px;\n`;
                data += "}\n";

                data += `.max-w-${name}{\n`;
                data += `\tmax-width: ${value}px;\n`;
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

            fs.writeFile(path.join(this.output, `containers.${this.config.output}`), data, (error) => {
                if (error) {
                    reject(error);
                }
                resolve();
            });
        });
    }

    async run() {
        try {
            if (fs.existsSync(this.output)) {
                fs.rmdirSync(this.output, { recursive: true });
            }
            fs.mkdirSync(this.output);
            await this.generateVariables();
            await this.generateMargins();
            await this.generatePaddings();
            await this.generatePositions();
            await this.generateBorders();
            await this.generateFonts();
            await this.generateFontColors();
            await this.generateBackgroundColors();
            // TODO: Copy flex
            // TODO: Copy grid
            await this.copyText();
            await this.generateShadows();
            await this.generateContainers();
            await this.copyCursor();
            if (this.config.minify && this.config.output === "css") {
                await this.minifyCSS();
            }
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
