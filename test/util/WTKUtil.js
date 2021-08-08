class WTKUtil {
  // @speed: this is super slow and unoptimized, algorithmically speaking, but over 2055 entries fast enough.
  // usage: paste this method in the WTKSearch class in the offline branch.
  //   or just load it into the console and supply wtk, using the ?console=1 url parameter
  find_unfindable_WK_Kanji(wtk, printUnifiedLogOutput = true) {
    const oldLogLevel = wtk.logLevel;
    wtk.logLevel = wtk.LogLevels.Silent;

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
        notFoundString += page.kanji;
      }
    }
    if (printUnifiedLogOutput) {
      let jsonString = JSON.stringify(notFound, null, 2); // 2: pretty print
      console.log(jsonString + '\n' + logOutput);
      console.log('not found concatenated: ' + notFoundString);
    }
    if (Object.keys(notFound).length === 0) {
      console.log("all WK kanji were found by name :)");
    }
    
    wtk.logLevel = oldLogLevel;
  }
}
