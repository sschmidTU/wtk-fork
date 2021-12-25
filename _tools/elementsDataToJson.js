//nodejs script, call 'node thisScript.js'
// outputs json for elementsDict.js
const fs = require('fs');
let mainDir = __filename.replace(/_tools[\\|\/]elementsDataToJson.js/, "");
fs.readFile(mainDir + "_tools/elements_data.txt", "utf8" , (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    processFile(data);
});

function processFile(fileString) {
    const returnJson = {};
    const rows = fileString.split("\n");
    // skip first row
    for (let i=1; i < rows.length; i++) {
        if (rows[i].trim().startsWith("//")) {
            continue;
        }
        const decommented = rows[i].split("//")[0];
        if (decommented === "") {
            console.log(`empty (or last) row ̀${i+1}.`);
            continue;
        }
        const columns = decommented.split(";");

        // validate columns
        let invalidRow = false;
        if (columns.length < 4) {
            invalidRow = true;
        } else {
            for (let col = 0; col < columns.length; col++) {
                if (columns[col].trim() == "") {
                    invalidRow = true;
                    break;
                }
            }
        }
        if (invalidRow) {
            console.warn(`invalid line ${i+1} in elements_data: \n${rows[i]}`);
            return;
        }

        // process columns
        const rtkName = columns[0];
        const wkNames = columns[2].split("&").map((radical) => radical.trim());
        returnJson[rtkName] = {
            kanji: columns[1].trim(),
            wkNames: wkNames,
            elements: columns[3].trim()
        };
    }
    const stringified = JSON.stringify(returnJson);
    //const stringified = JSON.stringify(returnJson, undefined, 2); //2: pretty print
    console.log(stringified);
    const fileStart = "const elementsDict =\n";
    fs.writeFile(mainDir + "assets/js/elementsDict.js", fileStart + stringified + ";\n", () => {
        return; //callback, unnecessary
    });
}
