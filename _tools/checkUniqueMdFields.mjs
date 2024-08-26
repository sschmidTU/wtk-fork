/* Lists all unique fields from .md files, e.g. "kanji:", "elements: ", "elementsTree:", etc. */

import FS from "fs";
import path from 'path';
import {fileURLToPath} from 'url';

async function init() {
    const __filename = fileURLToPath(import.meta.url);
    const dirname = path.dirname(__filename);
    const dirnamev1To6 = dirname.replace("_tools","rtk1-v6");
    const dirnameRtk3 = dirname.replace("_tools","rtk3-remain");

    let fieldMap = {}; // fields like "kanji: ". if present, value true

    const filesv1To6 = getFiles(dirnamev1To6);
    const filesRtk3 = getFiles(dirnameRtk3);

    console.log("searching all md files for unique field names.")
    fieldMap = getUniqueMdFieldNames(dirnamev1To6, filesv1To6, fieldMap);
    fieldMap = getUniqueMdFieldNames(dirnameRtk3, filesRtk3, fieldMap);
    for (const fieldName of Object.keys(fieldMap)) {
        console.log(`found field ${fieldName}`);
    }
}

function getUniqueMdFieldNames(dirname, files, fieldMap) {
    const commonMistakes = [
        "variant:", // should be variants
        "elementTree:",
    ]
    for (const file of files) {
        const fileString = FS.readFileSync(`${dirname}/${file}`).toString();

        // also check that elementsTree exists
        const matchTree = fileString.matchAll(/\n[a-zA-Z0-9]+\:/g);
        // /m: multiline mode, needed for ^ = beginning of line, but doesn't work with matchAll, which needs /g
        for (const match of matchTree) {
            const matchTrimmed = match.toString().replace("\n",""); //.replace(":", "")
            if (!fieldMap[matchTrimmed]) {
                fieldMap[matchTrimmed] = true;
            }
            if (commonMistakes.includes(matchTrimmed)) {
                console.log("probably mistake: " + matchTrimmed);
            }
        }
    }
    return fieldMap;
}

function getFiles(dirname) {
    const files = FS.readdirSync(dirname, function (err, files) {
        if (err) {
            console.log("readdir error: \n" + err);
        }
    });
    return files;
}

init()