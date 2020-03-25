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

/**
 * TODO:
 *  3. genreate margins
 *  4. generate paddings
 *  5. generate positions
 *  6. generate borders
 *  7. generate colors
 */
class Brixi {
    constructor() {
        this.spinner = ora("Assembling Brixi").start();
        this.config = defaultConfig;
        if (customConfig) {
            this.config = Object.assign(this.config, customConfig);
        }
        this.output = path.join(__dirname, "output");
        this.run();
    }

    generate(attr, classes, values) {
        let data = "";
        for (let i = 0; i < classes.length; i++) {
            for (let k = 0; k < values.length; k++) {
                data += `[${attr}~="${classes[i].prefix}-${values[k]}"]{\n`;
                for (let p = 0; p < classes[i].css.length; p++) {
                    data += `\t${classes[i].css[p]}: ${values[k]}rem;\n`;
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

            const staticData = fs.readFileSync(path.join(__dirname, "src/margin.scss"));
            data += staticData;
            data += this.generate("margin", classes, this.config.margins);

            fs.writeFile(path.join(this.output, "margin.scss"), data, (error) => {
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

            data += this.generate("padding", classes, this.config.padding);

            fs.writeFile(path.join(this.output, "padding.scss"), data, (error) => {
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

            const staticData = fs.readFileSync(path.join(__dirname, "src/position.scss"));
            data += staticData;
            data += this.generate("position", classes, this.config.positions);

            fs.writeFile(path.join(this.output, "position.scss"), data, (error) => {
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
            await this.generateMargins();
            await this.generatePaddings();
            await this.generatePositions();
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
