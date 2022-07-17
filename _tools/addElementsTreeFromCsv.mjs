import FS from "fs";
import path from 'path';
import {fileURLToPath} from 'url';

async function init() {
    const __filename = fileURLToPath(import.meta.url);
    const dirname = path.dirname(__filename);
    const dirnamev1To6 = dirname.replace("_tools","rtk1-v6");
    const dirnameRtk3 = dirname.replace("_tools","rtk3-remain");

    const filesv1To6 = getFiles(dirnamev1To6);
    const filesRtk3 = getFiles(dirnameRtk3);

    const kanjiToElementsTree = readElementsTreeObject(dirname, "wtk_elementsTree_spreadsheet.tsv");

    insertInto(dirnamev1To6, filesv1To6, kanjiToElementsTree);
    //insertInto(dirnameRtk3, filesRtk3, kanjiToElementsTree);
}

function readElementsTreeObject(dirname, filename) {
    const fileString = FS.readFileSync(`${dirname}/${filename}`).toString();
    const rows = fileString.split("\n");
    const returnObject = {};
    for (let i = 1; i < rows.length; i++) {
        const columns = rows[i].split("\t");
        const kanji = columns[0].trim();
        const elementsTree = columns[3];
        if (elementsTree.trim().length === 0) {
            console.log("first invalid row: " + (i + 1));
            break;
        }
        returnObject[kanji] = elementsTree.trim();
    }
    return returnObject;
}

function insertInto(dirname, files, kanjiToElementsTree) {
    let loopCount = 0;
    let totalFilesWithElementsTree = 0;
    for (const filename of files) {
        const fileString = FS.readFileSync(`${dirname}/${filename}`).toString();
        const matches = fileString.match(/^elementsTree: .+$/m)
        if (matches) {
            console.log(`already has elementsTree: ${filename}: ${matches[0]}`);
            totalFilesWithElementsTree++;
            continue;
        }
        const elementsMatch = /\nelements:/g.exec(fileString);
        if (!elementsMatch) {
            console.warn(`error: file ${filename} doesn't have a "^elements" line`);
            continue;
        }
        const kanjiMatch = /\nkanji: (.)/g.exec(fileString)[1];
        const elementsTree = kanjiToElementsTree[kanjiMatch];
        if (!elementsTree) {
            console.log(`no elementsTree found for ${kanjiMatch}`);
            continue;
        }

        const elementsLineIndex = elementsMatch.index;
        const endOfElementsLineIndex = fileString.indexOf("\n", elementsLineIndex + 1);
        const newFileString = fileString.slice(0, endOfElementsLineIndex + 1) + `elementsTree: ${elementsTree}\n` + fileString.slice(endOfElementsLineIndex + 1);
        //console.log(newFileString);
        if (loopCount > 5) {
            break; // debug limit to not change 150 files at once
        }
        loopCount++;
        FS.writeFileSync(`${dirname}/${filename}`, newFileString);
    }
    console.log(`total files with elementsTree in ${dirname}: ${totalFilesWithElementsTree}`);
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