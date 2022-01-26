import FS from "fs";
import path from 'path';
import {fileURLToPath} from 'url';
import fetch from 'node-fetch';

function generatePage(kanjiData, dirName) {
    const kanji = kanjiData.kanji;
    const kanjiNumber = kanjiData.newKanjiNumber;

    const meanings = kanjiData.meanings;
    const keyword = meanings[0];
    let keywordAlts = "";
    for (let i = 1; i < meanings.length; i++) {
        if (i !== 1) {
            keywordAlts += ", ";
        }
        keywordAlts += meanings[i];
    }
    console.log("keywordAlts: " + keywordAlts);
    console.log("generating " + kanjiNumber + ".md for kanji " + kanji);
    let pageString = 
    `---
layout: kanji-remain
v4: ${kanjiNumber}
kanji: ${kanji}
variantOf: 
variants: 
alternateFor: 
keyword: ${keyword}
keywordAlts: ${keywordAlts}
elementsTree: 
strokes: ${kanjiData.stroke_count}
on-yomi: ${kanjiData.on_readings}
kun-yomi: ${kanjiData.kun_readings}
comments: 
permalink: /${kanji}/
---`;
    const filename = `${dirName}/${kanjiNumber}.md`;
    console.log("filename: " + filename);
    FS.writeFile(filename, pageString, (err) => {if (err) console.log(err)});
}

async function init() {
    //let mainDir = __filename.replace(/_tools[\\|\/]createNewKanjiPage.mjs/, "");
    const __filename = fileURLToPath(import.meta.url);
    const dirname = path.dirname(__filename);
    const dirnamev1To6 = dirname.replace("_tools","rtk1-v6");
    const dirnameRtk3 = dirname.replace("_tools","rtk3-remain");

    const kanji = process.argv[2];
    if (!(kanji?.length > 0)) {
        console.log("usage: node _tools/createNewKanjiPage.mjs [kanji]");
        console.log("   or: npm run newkanji -- [kanji]");
        return;
    }

    const rtk3Files  = getFiles(dirnameRtk3);
    const v1To6Files = getFiles(dirnamev1To6);
    checkForDuplicateIn(dirnameRtk3, rtk3Files, kanji) // more likely to have duplicate, so check first
    checkForDuplicateIn(dirnamev1To6, v1To6Files, kanji);

    const kanjiData = await getKanjiData(kanji);
    console.log("kanjiData json: \n" + JSON.stringify(kanjiData));
    
    let newKanjiNumber = getNewKanjiNumber(rtk3Files);
    kanjiData.newKanjiNumber = newKanjiNumber
    console.log("newKanjiNumber: " + newKanjiNumber);

    generatePage(kanjiData, dirnameRtk3);
}

function getFiles(dirname) {
    const files = FS.readdirSync(dirname, function (err, files) {
        if (err) {
            console.log("readdir error: \n" + err);
        }
    });
    return files;
}

function checkForDuplicateIn(dirname, files, kanji) {
    for (const file of files) {
        const fileString = FS.readFileSync(`${dirname}/${file}`);
        //const regex = new RegExp(`/^kanji: ${kanji}/m`);
        //const matchExists = regex.test(fileString.toString()); // doesn't work
        const match = fileString.toString().match(/^kanji: ./m); // /m: multiline mode, needed for ^ = beginning of line
        // if (!match?.length) {
        //     console.log(".md lacking kanji: " + file);
        //     continue;
        // } // commented for speed
        const kanjiMatch = match[0];
        const existingKanji = kanjiMatch[kanjiMatch.length - 1];
        if (existingKanji === kanji) {
            console.log("error: kanji already exists in file " + file);
            console.log("exiting.");
            process.exit();
        }
    }
}

function getNewKanjiNumber(files) {
    let last = files[files.length-1];
    last = last.replace(".md","");
    //console.log("last: " + last);
    const nextKanjiNumber = Number.parseInt(last) + 1;
    return nextKanjiNumber;
}

async function getKanjiData(kanji) {
    const url = "https://kanjiapi.dev/v1/kanji/" + kanji;
    const res = await fetch(url)
        .then(data => {return data.json()})
        .then(res => {
            return res;
        });
    return res;
}

init()