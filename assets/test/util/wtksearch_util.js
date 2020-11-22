class WTKUtil {
    // @speed: this is super slow and unoptimized, algorithmically speaking, but over 2055 entries fast enough.
    find_wk_kanji_unfindable_by_name(wtk) {
        let notFound = {};
        for (const [wkname, replacements] of Object.entries(wtk.get_wk_to_rtk_replacements())) {
          for (const [kanji, page] of Object.entries(wk_kanji)) {
            const kwWK = page.meanings[0].meaning.toLowerCase();
            if (kwWK === wkname) {
              //console.log('wk kanji name that is always replaced found: ' + kanji + ', kw: ' + kwWK + ', replacements: ' + replacements);
              const results = wtk.search(wkname, {forceSearch: true, updateHTMLElements: false});
              let found = results.list.find((value) => value.kanji === kanji);
              if (!found) {
                console.log('couldnt find ' + page.kanji + ' by ' + wkname);
                notFound[wkname] = 1;
              }
            }
          }
        }
        let jsonString = JSON.stringify(notFound);
        console.dir(jsonString);
        for (const [wkname, _] of Object.entries(wtk.get_space_replacements())) {
          for (const [kanji, page] of Object.entries(wk_kanji)) {
            const kwWK = page.meanings[0].meaning.toLowerCase();
            if (kwWK === wkname) {
              const results = wtk.search(wkname, {forceSearch: true, updateHTMLElements: false});
              let found = results.list.find((value) => value.kanji === kanji);
              if (!found) {
                console.log('couldnt find ' + page.kanji + ' by ' + wkname);
                notFound[wkname] = 1;
              }
              //console.log('wk kanji spacy name that is always replaced found: ' + kanji + ', kw: ' + kwWK);
            }
          }
        }
    }
}
