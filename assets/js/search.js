---
---
var docs =
[
{%- for post in site.pages -%}
{%- if post.layout == 'kanji' or post.layout == 'kanji-remain' -%}
  {%- include post.json -%},
{%- endif -%}  
{%- endfor -%}
];


for (const doc of docs) {
  if (wk_kanji[doc.kanji]) {
    // add keywordWK (kwWK) info from wk_kanji data (wk_kanji_short_min.js)
    doc.kwWK = wk_kanji[doc.kanji].meanings[0].meaning; // see wk_kanji_short_min.js
  }
  if (doc.elT) {
    // create doc.el (elements) from doc.elT (elementsTree)
    doc.elP = removeStructure(doc.elT);
    // TODO move this to a script that changes the .md files, instead of having visitors do this every time
    let elP = doc.elP;
    if (doc.elPx) {
      elP += `, ${doc.elPx}`;
    }
    const elementsPure = elP.split(",");
    let newElementsField = "";
    const newElementsObject = {};
    const occurences = {};
    for (const element of elementsPure) {
      let elementTrimmed = element.trim();
      newElementsObject[elementTrimmed] = true; // save potentially with occurences
      if (!occurences[elementTrimmed]) {
        occurences[elementTrimmed] = 1;
      } else {
        occurences[elementTrimmed]++;
      }
      elementTrimmed = elementTrimmed.replaceAll(/[0-9]/g,""); // remove occurences

      if (elementsDict[elementTrimmed]) {
        const newSubElements = elementsDict[elementTrimmed].subElements;
        for (const subElement of newSubElements) {
          newElementsObject[subElement] = true;
        }
      } else {
        // shouldn't happen; need to add element to elementsData.txt and node elementsDataToJson.js
        console.log(`Error: element ${elementTrimmed} for kanji ${doc.kanji} wasn't found in elementsDict.`);
      }
    }
    for (const subElement of Object.keys(newElementsObject)) {
      if (newElementsField.length > 0) {
        newElementsField += ", ";
      }
      newElementsField += subElement;
    }
    // add elements with occurences (e.g. moon2) that occur multiple times in elementsTree
    for (const occurenceKey of Object.keys(occurences)) {
      if (/[0-9]/.test(occurenceKey)) {
        //console.log("skipping already occurenced element " + occurenceKey);
        continue;
      }
      const occurenceCount = occurences[occurenceKey];
      if (occurenceCount > 1) {
        const occurencedElement = occurenceKey + occurenceCount;
        if (!doc.elPx?.includes(occurencedElement)) {
          //console.log(`adding new occurenced element ${occurencedElement} to ${doc.kanji}.elementsPureExtra`);
          doc.elP += ", " + occurencedElement;
          newElementsField += ", " + occurencedElement;
          if (elementsDict[occurenceKey]) {
            const synonyms = elementsDict[occurenceKey].synonyms
            for (const synonym of synonyms) {
              const occurencedSynonym = synonym + occurenceCount;
              if (!newElementsField.includes(occurencedSynonym)) {
                newElementsField += ", " + occurencedSynonym;
              }
            }
            // also add occurenced subelements? might get too much
            // const newSubElements = elementsDict[elementTrimmed].subElements;
            // for (const newSubElement of newSubElements) {
            //   const occurencedSubElement = newSubElement + occurenceCount;
            //   if (!newElementsField.includes(occurencedSubElement)) {
            //     newElementsField += ", " + occurencedSubElement;
            //   }
            // }
          }
        }
      }
    }
    const compareOldAndNewElements = false;
    if (compareOldAndNewElements && doc.el) {
      //console.log("comparing old and new elements for " + doc.kanji);
      // check old and new elements
      const oldElementsObject = {};
      const oldElements = doc.el.split(",");
      for (const oldElement of oldElements) {
        oldElementsObject[oldElement.trim()] = true;
      }
      //console.dir(oldElementsObject);
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
  } // end if doc.elT
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

function removeStructure(elementsTreeString) {
  return elementsTreeString.replaceAll(/[trlb][trlb]\(/g, "")
      .replaceAll("l(", "").replaceAll("t(","").replaceAll("o(","").replaceAll("c(","")
      .replaceAll(")","");
}
