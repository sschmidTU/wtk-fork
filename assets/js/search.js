---
---
var docs =
[
{%- for post in site.pages -%}
{%- if post.layout == 'kanji' or post.layout == 'kanji-remain' -%}
  {% include post.json %},
{%- endif -%}  
{%- endfor -%}
];


// add keywordWK info from wk_kanji data (wk_kanji_short_min.js)
for (const doc of docs) {
  if (wk_kanji[doc.kanji]) {
    doc.keywordWK = wk_kanji[doc.kanji].meanings[0].meaning; // see wk_kanji_short_min.js
  }
}
// TODO put all the keywordWK directly into the data so we don't have to do this every time.
//   though this just takes 1ms

// init lunr
var idx = lunr(function () {
  this.field('keyword', 10);
  this.field('keywordWK');
  this.field('elements');
  this.field('elementsWK');
});
// add each document to be index
for(var index in docs) {
  idx.add(docs[index]);
}
