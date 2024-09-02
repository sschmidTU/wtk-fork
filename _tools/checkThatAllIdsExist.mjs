import FS from "fs";
import path from 'path';
import {fileURLToPath} from 'url';

/** Checks whether all ids 1 to x exist in .md files (if we have x kanji),
 * e.g. "v4: 3040" if we have 3050 kanji
 * Also checks for id duplicates */

async function init() {
    const __filename = fileURLToPath(import.meta.url);
    const dirname = path.dirname(__filename);
    const dirnamev1To6 = dirname.replace("_tools","rtk1-v6");
    const dirnameRtk3 = dirname.replace("_tools","rtk3-remain");

    const idMap = {}; // kanji: filename

    const filesv1To6 = getFiles(dirnamev1To6);
    const filesRtk3 = getFiles(dirnameRtk3);

    let duplicateCount = 0;
    duplicateCount += checkDirForDuplicates(dirnamev1To6, filesv1To6, idMap);
    duplicateCount += checkDirForDuplicates(dirnameRtk3, filesRtk3, idMap);
    const totalIds = filesv1To6.length + filesRtk3.length;
    for (let i=1; i < totalIds; i++) {
        if (!idMap[i]) {
            console.log(`id ${i} missing`);
        }
    }
    if (duplicateCount === 0) {
        console.log("Done. No duplicates found.");
    } else {
        console.log("Done. Duplicates found: " + duplicateCount);
    }
}

function checkDirForDuplicates(dirname, files, idMap) {
    let duplicateCount = 0;
    for (const file of files) {
        const fileString = FS.readFileSync(`${dirname}/${file}`).toString();

        // also check that elementsTree exists
        const matchTree = fileString.match(/^elementsTree/m); // /m: multiline mode, needed for ^ = beginning of line
        if (!matchTree?.length) {
            console.log(".md lacking elementsTree: " + file);
        }
        const matchId = fileString.match(/v4\: [0-9]+[\n\r]/g);
        if (!matchId?.length) {
            console.log(".md lacking v4 id: " + file);
            continue;
        }
        const idMatch = matchId[0];
        const id = Number(idMatch.substring(4).replace("\n","").replace("\r",""));
        //console.log("kanji: " + kanji);
        if (idMap[id]) {
            duplicateCount++;
            console.log("error: id " + id + " in file " + file + " duplicate.");
        } else {
            idMap[id] = true;
        }
    }
    return duplicateCount;
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