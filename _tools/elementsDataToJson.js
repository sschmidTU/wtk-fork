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
        if (columns.length < 3 || columns.length > 5) {
            invalidRow = true;
        } else {
            // only check last row: we can have empty row for rtk subelements, but have wk subelements (e.g. going) - maybe not necessary though
            if (columns[columns.length - 1].trim() === "") {
                invalidRow = true;
            }
            // for (let col = 0; col < columns.length; col++) {
            //     if (columns[col].trim() == "") {
            //         invalidRow = true;
            //         break;
            //     }
            // }
        }
        if (invalidRow) {
            console.warn(`invalid line ${i+1} in elements_data: \n${rows[i]}`);
            return;
        }

        // process columns
        const rtkNames = columns[0].split("=");
        const mainName = rtkNames[0];
        const synonyms = [];
        for (let j = 1; j < rtkNames.length; j++) {
            synonyms.push(rtkNames[j]);
        }
        const kanji = columns[1].trim();
        const wkNames = columns[2].split("&").map((radical) => radical.trim());
        let mainElements = []; // main elements only, no subelements
        let subElements = [];
        if (columns.length > 3) {
            mainElements = removeStructure(columns[3]).split(",").map(a => a.trim())
            subElements = [...mainElements]; // shallow copy
            for (const subElement of subElements) {
                if (/.+[0-9]+/.test(subElement)) {
                    const occurenceFreeElement = subElement.replaceAll(/[0-9]/g,"");
                    if (!subElements.includes(occurenceFreeElement)) {
                        //console.log(`adding occurenceFreeElement ${occurenceFreeElement} for subElement ${subElement} to mainName ${mainName}.`);
                        subElements.push(occurenceFreeElement);
                    }
                }
            }
            //console.log(`subElements for ${mainName}: ${subElements.toString()}`);
            //const elementsProcessed = processElements(columns[3]);
        }
        for (const subelement of subElements) {
            if (subelement === mainName) {
                console.log("duplicate subelement: " + subelement);
            }
            if (subelement.includes("=")) {
                console.log(`subelement contains '=': ${subelement}`);
            }
        }
        const elementsWK = columns.length > 4 ? columns[4] : undefined;
        if (elementsWK && !elementsWK.includes("WK")) { // TODO check each elementWK
            console.warn(`invalid line ${i+1} in elements_data (column 5 doesn't have an elementWK): \n${rows[i]}`);
            return;
        }
        
        returnJson[mainName] = {
            //elements: elementsProcessed,
            elements: mainElements,
            elementsWK: elementsWK,
            kanji: kanji,
            subElements: subElements,
            synonyms: synonyms,
            wkNames: wkNames,
        };
    }

    for (const element of Object.keys(returnJson)) {
        const elementObject = returnJson[element];
        let subElementsChecked = {}; // this doesn't seem to catch many repeated checks for now, but whatever
        // need to use an indexed for loop, because .subElements expands during the loop.
        for (let i=0; i<elementObject.subElements.length; i++) {
            const subElement = elementObject.subElements[i];
            if (subElementsChecked[subElement] || !returnJson[subElement]) {
                //console.log(`skipping ${subElement} for ${element}`);
                subElementsChecked[subElement] = true;
                continue;
            }
            const subsubelements = returnJson[subElement].subElements;
            for (const sub3element of subsubelements) {
                if (!elementObject.subElements.includes(sub3element)) {
                    //console.log(`adding sub3element ${sub3element} for ${element}`);
                    elementObject.subElements.push(sub3element);
                    if (/.+[0-9]+/.test(sub3element)) {
                        const occurenceFreeElement = sub3element.replaceAll(/[0-9]/g,"");
                        //console.log(`adding occurenceFreeElement ${occurenceFreeElement} for sub3element ${sub3element} to element ${element}.`);
                        elementObject.subElements.push(occurenceFreeElement);
                    }
                }
            }
            for (const synonym of returnJson[subElement].synonyms) {
                if (!elementObject.subElements.includes(synonym)) {
                    elementObject.subElements.push(synonym);
                }
            }
            subElementsChecked[subElement] = true;
        }
        // add own synonyms. these don't need to be checked for subelements.
        for (const synonym of elementObject.synonyms) {
            elementObject.subElements.push(synonym);
        }
    }
    //const stringified = JSON.stringify(returnJson);
    const stringified = JSON.stringify(returnJson, undefined, 2); //2: pretty print. use for debug (elementsDict_debug.js)
    //console.log(stringified);
    const fileStart = "const elementsDict =\n";
    fs.writeFile(mainDir + "assets/js/elementsDict.js", fileStart + stringified + ";\n", () => {
        return; //callback, unnecessary
    });
}

function removeStructure(elementsTreeString) {
    return elementsTreeString.replaceAll(/[trlb][trlb]\(/g, "")
        .replaceAll("l(", "").replaceAll("t(","").replaceAll("o(","").replaceAll("c(","")
        .replaceAll(")","");
}

function processElements(elementsRaw) {
    let returnString = "";
    let elementArray = [];
    let commaSeparated = elementsRaw;
    commaSeparated = elementsRaw.split(",");

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
