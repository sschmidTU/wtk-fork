//nodejs script, call 'node thisScript.js'
// outputs json for elementsDict.js
const fs = require('fs')
fs.readFile('./elements_data.txt', 'utf8' , (err, data) => {
    if (err) {
      console.error(err)
      return
    }
    processFile(data)
});

function processFile(fileString) {
    const returnJson = {};
    const rows = fileString.split("\n");
    // skip first row
    for (let i=1; i < rows.length; i++) {
        const columns = rows[i].split(";");
        const rtkName = columns[0];
        returnJson[rtkName] = {
            kanji: columns[1].trim(),
            wkName: columns[2].trim(),
            elements: columns[3].trim()
        };
    }
    console.log(JSON.stringify(returnJson));
    //console.log(JSON.stringify(returnJson, undefined, 2)); //2: pretty print
}

