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
        const decommented = rows[i].split("//")[0];
        if (decommented === "") {
            console.log(`empty (or last) row ̀${i+1}.`);
            continue;
        }
        const columns = decommented.split(";");
        const rtkName = columns[0];
        returnJson[rtkName] = {
            kanji: columns[1].trim(),
            wkName: columns[2].trim(),
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
