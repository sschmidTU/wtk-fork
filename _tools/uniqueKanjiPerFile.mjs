import FS from "fs";
import path from 'path';
import {fileURLToPath} from 'url';

// usage: node uniqueKanjiPerFile.mjs
//   in a directory where there are text files with kanji
//   adjust sub-directories below (use "" for directory where script is executed)

async function init() {
    const __filename = fileURLToPath(import.meta.url);
    let dirname = path.dirname(__filename);
    const subDirectories = [
        "/../assets/js/",
        //"/../rtk1-v6/",
        //"/../rtk3-remain/"
    ];
    //getUniqueKanjiPerDirectoryPerFile(dirname, subDirectories);
    getUniqueKanjiAcrossFiles(dirname, subDirectories);
}

/** Counts unique kanji per directory, so if there are 3 files with the same single kanji, total unique kanji = 1. */
function getUniqueKanjiAcrossFiles(dirname, subDirectories) {
    let uniqueKanji = {};
    for (const subDirectory of subDirectories) {
        console.log("directory: " + subDirectory)
        const dirname_nx = dirname + subDirectory;
        const files_nx = getFiles(dirname_nx);
        uniqueKanji = getUniqueKanjiPerFile(dirname_nx, files_nx, uniqueKanji);
        console.log(`unique kanji across all files in ${subDirectory}: ${Object.keys(uniqueKanji).length}`);
        uniqueKanji = {};
    }
}

function getUniqueKanjiPerDirectoryPerFile(dirname, subDirectories) {
    for (const subDirectory of subDirectories) {
        console.log("directory: " + subDirectory)
        const dirname_nx = dirname + subDirectory;
        const files_nx = getFiles(dirname_nx);
        getUniqueKanjiPerFile(dirname_nx, files_nx, {});
    }
}

function getUniqueKanjiPerFile(dirname, files, uniqueKanji = {}) {
    // uniqueKanji can already contain found kanji, e.g. in other files.
    for (const file of files) {
        let uniqueKanjiInFile = {};
        const fileString = FS.readFileSync(`${dirname}/${file}`).toString();
    
        for (const char of fileString) {
            if (char >= '\u4e00' && char <= '\u9fff') { // is kanji?
                if (!uniqueKanji[char]) {
                    uniqueKanji[char] = true;
                }
                if (!uniqueKanjiInFile[char]) {
                    uniqueKanjiInFile[char] = true;
                }
            }
        }
        console.log(`unique kanji in ${file}: ${Object.keys(uniqueKanjiInFile).length}`);
    }
    return uniqueKanji;
}

function getFiles(dirname) {
    const files = FS.readdirSync(dirname, function (err, files) {
        if (err) {
            console.log("readdir error: \n" + err);
        }
    });
    return files;
}

init();
