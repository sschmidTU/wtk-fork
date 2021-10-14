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
        const elementTrimmed = element.trim();
        if (elementsDict[elementTrimmed]) {
          const newSubElements = elementsDict[elementTrimmed].elements;
          if (newElementsField.length > 0) {
            newElementsField += ", ";
          }
          newElementsField += newSubElements.trim();
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
