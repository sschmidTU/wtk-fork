class WTKUtil {
  // @speed: this is super slow and unoptimized, algorithmically speaking, but over 2055 entries fast enough.
  findUnfindableKanji(wtk, printUnifiedLogOutput = true) {
    // 
    let notFound = {};
    let notFoundString = '';
    let logOutput = '';
    for (const [kanji, page] of Object.entries(wk_kanji)) {
      const meaning = page.meanings[0].meaning.toLowerCase();
      const results = wtk.search(meaning, {forceSearch: false, allowRepeatedQueries: true, updateHTMLElements: false});
      let found = results.list?.find((value) => value.kanji === kanji);
      if (!found) {
        const logMsg = 'couldnt find ' + page.kanji + ' by ' + meaning;
        console.log(logMsg);
        logOutput += logMsg + '\n';
        notFound[meaning] = 1;
        notFoundString
      }
    }
    if (printUnifiedLogOutput) {
      let jsonString = JSON.stringify(notFound, null, 2); // 2: pretty print
      console.log(jsonString + '\n' + logOutput);
    }
  }
}
