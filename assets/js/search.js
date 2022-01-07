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
  if (!doc.el) {
    //console.log("missing el for: " + doc.kanji); //debug
    if (doc.elT) {
      doc.elP = doc.elT.replaceAll("l(", "").replaceAll("t(","").replaceAll("o(","").replaceAll(")","");
    }
    if (doc.elP) {
      // construct el (elements) from elP (elementsPure)
      // TODO move this to a script that changes the .md files, instead of having visitors do this every time
      let elP = doc.elP;
      if (doc.elPx) {
        elP += `, ${doc.elPx}`;
      }
      const elementsPure = elP.split(",");
      let newElementsField = "";
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

        if (elementsDict[elementTrimmed]) {
          const newSubElements = elementsDict[elementTrimmed].elements.trim();
          for (const subElement of newSubElements.split(",")) {
            if (!subElement || subElement.length === 0) {
              continue;
            }
            if (newElementsField.length > 0) {
              newElementsField += ", ";
            }
            newElementsField += subElement + occurences ?? "";
          }
        } else {
          // shouldn't happen; need to add element to elementsData.txt and node elementsDataToJson.js
          console.log(`Error: element ${elementTrimmed} for kanji ${doc.kanji} wasn't found in elementsDict.`);
        }
      }
      doc.el = newElementsField;
      //console.log("new elements field: " + newElementsField); //debug
    } else {
      // this shouldn't happen, having neither elements nor elementsPure
      console.log("missing elements/elementsPure for " + doc.kanji); //debug
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
