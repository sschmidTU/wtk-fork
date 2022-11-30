import FS from "fs";
import path from 'path';
import {fileURLToPath} from 'url';

async function init() {
    const __filename = fileURLToPath(import.meta.url);
    const dirname = path.dirname(__filename);
    const dirnamev1To6 = dirname.replace("_tools","rtk1-v6");
    const dirnameRtk3 = dirname.replace("_tools","rtk3-remain");

    const kanjiMap = {}; // kanji: filename

    const filesv1To6 = getFiles(dirnamev1To6);
    const filesRtk3 = getFiles(dirnameRtk3);

    let duplicateCount = 0;
    duplicateCount += checkDirForDuplicates(dirnamev1To6, filesv1To6, kanjiMap);
    duplicateCount += checkDirForDuplicates(dirnameRtk3, filesRtk3, kanjiMap);
    if (duplicateCount === 0) {
        console.log("Done. No duplicates found.");
    } else {
        console.log("Done. Duplicates found: " + duplicateCount);
    }
}

function checkDirForDuplicates(dirname, files, kanjiMap) {
    let duplicateCount = 0;
    for (const file of files) {
        const fileString = FS.readFileSync(`${dirname}/${file}`);
        const match = fileString.toString().match(/^kanji: ./m); // /m: multiline mode, needed for ^ = beginning of line
        if (!match?.length) {
            console.log(".md lacking kanji: " + file);
            continue;
        }
        const kanjiMatch = match[0];
        const kanji = kanjiMatch[kanjiMatch.length - 1];
        //console.log("kanji: " + kanji);
        if (kanjiMap[kanji]) {
            duplicateCount++;
            console.log("error: kanji " + kanji + " in file " + file + " already existed in " + kanjiMap[kanji]);
        } else {
            kanjiMap[kanji] = file;
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