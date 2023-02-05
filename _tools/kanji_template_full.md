---
layout: kanji-remain
v4: 30xx (use the latest number in rtk3-remain/ + 1)
kanji: (new kanji)
variantOf: (kanji)
variants: [kanji]
alternateFor: (kanji)
outdated: yes or no
keyword: (keyword)
keywordAlts: [keywords]
keywordRTK3: [keyword] // previously, (RTK3) was displayed here after the keyword, because this keyword is duplicated in RTK3, not unique anymore. could be done again in RTK mode.
elements: [elements] // old way to record elements, listing all subelements every time, which leads to duplicated info between kanji (e.g. sun = day)
elementsTree: [elements] // new/alternate way to add elements. A tree of elementsPure, e.g. l(sun, moon) = 明 = sun, day, moon, month etc in the old `elements` notation. if one element doesn't fit the tree structure, it's added to elementsPureExtra.
elementsPure: [elements] // main elements without subelements, e.g. 'white' instead of 'drop sun day' for 白い. this notation is also outdated in favor of elementsTree.
elementsPureExtra: [elements] // extra elements not contained in elementsTree or elementsPure. often present if elementsPureVague = yes
elementsPureVague: yes or no
elementsClose: elements that are not quite complete or slightly different here
structureVague: yes or no // e.g. 包 is not quite top-down, it's also entwined
similar: [kanji] // kanji that looks similar / similar elements
elementsWK: [elements/WK radicals]
chinese-elements-different: yes or no // only for major differences where elements would be entirely differently notated
chinese-font-difference: yes or no // for smaller font changes that don't quite change elements, e.g. 糸
strokes: (number)
on-yomi: [onyomi]
kun-yomi: [kunyomi]
usuallykana: yes or no // whether the word is usually written using kana alone, instead of using the kanji
ateji: yes or no
comments: (comments) - these are all the fields that are currently usable. usually only the ones in new_kanji_template are needed though. [] = list, comma separated. TODO write a script that lists all unique field names in .md files. Also to eliminate typos etc.
permalink: /(new kanji)/
---