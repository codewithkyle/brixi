/**
 * Guide:
 *  1. Prepare values array
 *  2. update class/attribute
 *  3. add css props
 *  4. run npm run generate
 */

const fs = require("fs");
const values = [0, 0.125, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 4, 5, 6];

if (fs.existsSync("./_output.scss")) {
    fs.unlinkSync("./_output.scss");
}

let data = "";
for (let i = 0; i < values.length; i++) {
    // Class or attribute
    data += `\n[margin~="l-${values[i]}"]{\n`;

    // CSS props
    data += `\tmargin-left: ${values[i]}rem;\n`;

    // End
    data += "}";
}

fs.writeFileSync("./_output.scss", data);
