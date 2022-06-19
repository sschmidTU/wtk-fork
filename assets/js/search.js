// docs (kanji data) is now loaded from docs.js in index.html

for (const doc of docs) {
  if (wk_kanji[doc.kanji]) {
    // add keywordWK (kwWK) info from wk_kanji data (wk_kanji_short_min.js)
    doc.kwWK = wk_kanji[doc.kanji].meanings[0].meaning; // see wk_kanji_short_min.js
  }
  if (doc.elT) {
    // create doc.el (elements) from doc.elT (elementsTree)
    doc.elP = doc.elT.replaceAll("l(", "").replaceAll("t(","").replaceAll("o(","").replaceAll(")","");
    // construct el (elements) from elP (elementsPure)
    // TODO move this to a script that changes the .md files, instead of having visitors do this every time
    let elP = doc.elP;
    if (doc.elPx) {
      elP += `, ${doc.elPx}`;
    }
    const elementsPure = elP.split(",");
    let newElementsField = "";
    const newElementsObject = {}; // the elements already added. to avoid duplicates.
    for (const element of elementsPure) {
      let elementTrimmed = element.trim();

      // check for number (of occurences) at the end, e.g. 'tree3' or 'jackhammer2' (WK).
      //   copied code from wtksearch.js -> functionize? but 2 return values
      let numberChar = elementTrimmed.charAt(elementTrimmed.length - 1);
      let occurences = Number.parseInt(numberChar, 10);
      if (isNaN(occurences)) {
        numberChar = elementTrimmed.charAt(0);
        occurences = Number.parseInt(numberChar, 10); // also check prefix number, e.g. '2tree'
      }
      if (!isNaN(occurences)) {
        elementTrimmed = elementTrimmed.replace(numberChar, ''); // remove occurences for now, add again later
      }
      const occurencesString = occurences > 0 ? occurences.toString() : "";

      if (elementsDict[elementTrimmed]) {
        const newSubElements = elementsDict[elementTrimmed].elements.trim();
        for (const subElement of newSubElements.split(",")) {
          const subElementTrimmed = subElement?.trim();
          if (!subElementTrimmed || subElementTrimmed.length === 0 || newElementsObject[subElementTrimmed]) {
            continue;
          }
          if (newElementsField.length > 0) {
            newElementsField += ", ";
          }
          newElementsField += subElementTrimmed + occurencesString;
          newElementsObject[subElementTrimmed] = true;
        }
      } else {
        // shouldn't happen; need to add element to elementsData.txt and node elementsDataToJson.js
        console.log(`Error: element ${elementTrimmed} for kanji ${doc.kanji} wasn't found in elementsDict.`);
      }
    }
    if (doc.el) {
      // check old and new elements
      const oldElementsObject = {};
      const oldElements = doc.el.split(",");
      for (const oldElement of oldElements) {
        oldElementsObject[oldElement.trim()] = true;
      }
      console.dir(oldElementsObject);
      for (const oldElement of Object.keys(oldElementsObject)) {
        if (!newElementsObject[oldElement]) {
          console.log(`${doc.kanji}: new elements created from elT missing old element: ${oldElement}`);
        }
      }
      for (const newElement of Object.keys(newElementsObject)) {
        if (!oldElementsObject[newElement]) {
          console.log(`${doc.kanji}: old elements missing new element created from elT: ${newElement}`);
        }
      }
    }
    doc.el = newElementsField;
    //console.log("new elements field: " + newElementsField); //debug
    if (!doc.el) {
      // this shouldn't happen
      console.log("missing elements for " + doc.kanji); //debug
    }
  }
}
// TODO put all the keywordWK directly into the data so we don't have to do this every time.
//   though this just takes 1ms. Also it would increase the size of search.js by quite a bit.

// init lunr
var idx = lunr(function () {
  this.field('kw', 10);
  this.field('kwWK');
  this.field('el');
  this.field('elWK');
});
// add each document to be index
for(var index in docs) {
  idx.add(docs[index]);
}
