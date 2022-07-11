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

    insertInto(dirnamev1To6, filesv1To6);
    insertInto(dirnameRtk3, filesRtk3);
}

function insertInto(dirname, files) {
    let totalFilesWithElementsTree = 0;
    for (const filename of files) {
        const fileString = FS.readFileSync(`${dirname}/${filename}`).toString();
        const matches = fileString.match(/^elementsTree: .+$/m)
        if (matches) {
            console.log(`match found for ${filename}: ${matches[0]}`);
            totalFilesWithElementsTree++;
            continue;
        }
        // TODO insert elementsTree line from csv/tsv
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