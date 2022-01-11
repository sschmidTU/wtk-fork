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
    // TODO parse keyword, strokes, on-yomi, kun-yomi from jisho
    //console.log("pageString: \n" + pageString);
    const filename = `${dirName}/${kanjiNumber}.md`;
    console.log("filename: " + filename);
    FS.writeFile(filename, pageString, (err) => console.log(err));
}

async function init() {
    //let mainDir = __filename.replace(/_tools[\\|\/]createNewKanjiPage.mjs/, "");
    const __filename = fileURLToPath(import.meta.url);
    let dirname = path.dirname(__filename);
    dirname = dirname.replace("_tools","rtk3-remain");

    const kanji = process.argv[2];
    if (!(kanji?.length > 0)) {
        console.log("usage: node _tools/createNewKanjiPage.mjs [kanji]");
        console.log("   or: npm run newkanji -- [kanji]");
        return;
    }

    const kanjiData = await getKanjiData(kanji);
    console.log("kanjiData json: \n" + JSON.stringify(kanjiData));
    
    let newKanjiNumber = getNewKanjiNumber(dirname);
    kanjiData.newKanjiNumber = newKanjiNumber
    console.log("newKanjiNumber: " + newKanjiNumber);

    generatePage(kanjiData, dirname);
}

function getNewKanjiNumber(dirname) {
    const files = FS.readdirSync(dirname, function (err, files) {
        if (err) {
            console.log("readdir error: \n" + err);
        }
    });
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