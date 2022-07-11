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
        if (columns.length < 4 || columns.length > 5) {
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
        const elementsProcessed = processElements(columns[3]);
        const elementsWK = columns.length > 4 ? columns[4] : undefined;
        if (elementsWK && !elementsWK.includes("WK")) { // TODO check each elementWK
            console.warn(`invalid line ${i+1} in elements_data (column 5 doesn't have an elementWK): \n${rows[i]}`);
            return;
        }
        returnJson[rtkName] = {
            kanji: columns[1].trim(),
            wkNames: wkNames,
            elements: elementsProcessed,
            elementsWK: elementsWK
        };
    }
    const stringified = JSON.stringify(returnJson);
    //const stringified = JSON.stringify(returnJson, undefined, 2); //2: pretty print. use for debug (elementsDict_debug.js)
    //console.log(stringified);
    const fileStart = "const elementsDict =\n";
    fs.writeFile(mainDir + "assets/js/elementsDict.js", fileStart + stringified + ";\n", () => {
        return; //callback, unnecessary
    });
}

function processElements(elementsRaw) {
    let returnString = "";
    let elementArray = [];
    let elementsStructureRemoved = elementsRaw.replaceAll("l(", "").replaceAll("t(","").replaceAll("o(","").replaceAll(")","");
    let commaSeparated = elementsRaw.split(",");

    // put elements/synonyms into elementArray
    for (const elementUnit of commaSeparated) {
        const synonyms = elementUnit.split("=");
        for (const synonym of synonyms) {
            elementArray.push(synonym.trim());
        }
    }

    // turn elementArray into string (like "say, words, mouth")
    for (let i = 0; i < elementArray.length; i++) {
        if (i > 0) { 
            returnString += ", ";
        }
        returnString += elementArray[i];
    }
    return returnString;
}
