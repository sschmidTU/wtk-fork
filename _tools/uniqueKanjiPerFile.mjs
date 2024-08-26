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
    
    for (const subDirectory of subDirectories) {
        console.log("directory: " + subDirectory)
        const dirname_nx = dirname + subDirectory;
        const files_nx = getFiles(dirname_nx);
        getUniqueKanjiPerFile(dirname_nx, files_nx);
    }
}

function getUniqueKanjiPerFile(dirname, files) {
    for (const file of files) {
        const fileString = FS.readFileSync(`${dirname}/${file}`).toString();
    
        let uniqueKanji = {};
        for (const char of fileString) {
            if (char >= '\u4e00' && char <= '\u9fff') {
                if (!uniqueKanji[char]) {
                    uniqueKanji[char] = true;
                }
            }
        }
        console.log(`unique kanji in ${file}: ${Object.keys(uniqueKanji).length}`);
    }
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
