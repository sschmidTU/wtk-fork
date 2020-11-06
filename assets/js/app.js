---
---
class App {
  lastCopyButtonClickedId  = -1;
  checkboxStrictQuery      = 'input[name=strictModeCheckbox]';
  checkboxRTKQuery         = 'input[name=rtkModeCheckbox]';
  checkboxStrictLabelQuery = '#strictModeLabel';
  maxResultSize            = 50;
  lastQuery                = '';
  lastQueries              = [];
  lastStrict               = false;
  lastRTK                  = false;

  search() {
    let query = $('#search-query').val().trim();
    query = query.toLowerCase(); // useful for mobile auto-correct. maybe check later if input like 'inX' is necessary

    const rtkMode = this.isRtkMode(); // used multiple times
    const strictMode = !rtkMode && this.isStrictMode(); // TODO fix strict mode for rtk mode, currently disabled in rtk mode.
    if (query === this.lastQuery && strictMode === this.lastStrict && rtkMode === this.lastRTK) {
      return;
    }
    
    var result  = $('#search-results');
    var entries = $('#search-results .entries');
    if (query.length <= 2) {
      result.hide();
      entries.empty();
      return;
    }
    this.lastQuery = query;
    //this.lastQueries.push(query);
    this.lastStrict = strictMode;
    this.lastRTK    = rtkMode;
    //if (this.lastQueries.length > 5) {
      // TODO do something with lastQueries, maybe push limit to 10 or so
      //this.lastQueries.shift(); // remove oldest query
    //}

    // replace spaces in WK radical names
    const space_replacements = { // maybe put into getter method as well
      "rice paddy": "ricepaddy",
      "older brother": "olderbrother",
      "younger brother": "youngerbrother",
      "to cut": "tocut", // custom radical from phonetic-semantic composition
      "coat rack": "coatrack",
      "older sister": "oldersister",
      "black hole": "blackhole",
      "turtle shell": "turtleshell",
      "long ago": "longago",
      "one sided": "onesided",
      "hot pepper": "hotpepper",
      "mona lisa": "monalisa",
      "top hat": "tophat",
      "death star": "deathstar",
      "not yet": "notyet", // officially jet in WK, but makes sense to distinguish from end/extremity (both jet in WK)
      "shamisen song": "shamisensong",
      "lip ring": "lipring",
    };
    if (!rtkMode) { // only do pre-replacements in WK mode
      for (let [key, value] of Object.entries(space_replacements)) {
        query = query.replace(key, value);
      }
    }

    // mapping from WK radicals to RTK elements. (format of the values is comma separated, no spaces between values)
    // WK radical input should be without spaces inside radicals, so "ricepaddy" instead of "rice paddy".
    const wk_replacements = this.get_wk_to_rtk_replacements();

    let rtkQueries = [];
    let outputRadicals = [];
    if (!rtkMode) {
      rtkQueries.push(''); // necessary for now - investigate
      const inputRadicals = query.split(' ');

      // create queries with each alternate RTK replacement (e.g. ricepaddy can be rice field, silage or sun)
      //   TODO the current method is crude and could be improved, but works for now.
      for (const inputRadical of inputRadicals) {
        if (inputRadical === '') { // can also happen for "blue     sun" for example, which won't be trimmed
          continue;
        }
        const radical = inputRadical.toLowerCase();
        if (wk_replacements[radical]) { // this is a WK radical that needs to be replaced
          const rtkVersions = wk_replacements[radical].split(',');
          const rtkKeywordLists = this.getRtkKeywordLists(rtkVersions);
          if (rtkKeywordLists.length === 1) {
            // if we only have one possible replacement, just add it to each query
            for (let i=0; i<rtkQueries.length; i++) {
              for (const keywordList of rtkKeywordLists) {
                for (const keyword of keywordList) {
                  rtkQueries[i] += keyword + ' ';
                  outputRadicals.push(keyword);
                }
              }
            }
          } else { // we have multiple possible rtk equaivalents
            const queryLength = rtkQueries.length; // necessary to not make for loop infinitely
            // create a new query for every possible replacement of the inputRadical
            let newQueries = [];
            for (let i=0; i<queryLength; i++) {
              const rtkQuery = rtkQueries[i];
              for (const keywordList of rtkKeywordLists) {
                // for each keywordList (list of keywords that can replace one WK radical), create a new query
                let newQuery = rtkQuery;
                for (const keyword of keywordList) {
                  newQuery += keyword + ' ';
                  outputRadicals.push(keyword);
                }
                newQueries.push(newQuery);
              }
            }
            rtkQueries = newQueries;
          }
        } else {
          // inputRadical doesn't need to be replaced, just add it to each query
          for (let i=0; i<rtkQueries.length; i++) {
            rtkQueries[i] += inputRadical + ' ';
            outputRadicals.push(inputRadical);
          }
        }
      }
      // our rtkQueries are finished
      // end if(!checkboxRTK.checked)
    } else {
      rtkQueries.push(query);
    }

    console.log(' '); // new line
    //var displayEntries = [];
    // if (query.trim().length <= 2) {
      result.hide();
      entries.empty();
    // }

    let idsAddedToResults = {};
    // search for each rtkQuery
    for (let i=0; i<rtkQueries.length; i++) {
      let query = rtkQueries[i];
      if (query.length < 2) {
        continue;
      }
      query = query.trim(); // maybe do that above, but for now don't restrict queries by length too much
      console.log('query ' + (i+1) + ': ' + query);

      // retrieve matching result with content
      var results = $.map(idx.search(query), function(result) {
        return $.grep(docs, function(entry) {
          // TODO handle multiple queries here instead of the query adding below
          if (entry.id === result.ref && !idsAddedToResults[entry.id]) {
            idsAddedToResults[entry.id] = 1; // id was added. use object=hash map instead of array for O(1) performance
            return true;
          }
          return false;
        })[0];
      });

      //entries.empty();

      const self = this;
      if (results && results.length > 0) {
        // TODO fix strictMode for RTK mode, need to get each radical (e.g. "pent in" would be detected as 2 currently);
        let matches = 0;
        //$.each(results, function(key, page) {
        for (const page of results) {
          let addToResults = !strictMode; // if not strict mode, add all results to query
          if (strictMode) {
            const elements = page.elements.split(',').map((val,_,__) => val.trim());
            const elementsWK = page.elementsWK?.split('.').map((val,_,__) => val.trim());
            for (const outputRadical of outputRadicals) {
              const trimmedRadical = outputRadical.trim();
              if (trimmedRadical !== '' && (
                    elements.includes(trimmedRadical) ||
                    !rtkMode && elementsWK?.includes(trimmedRadical) ||
                    // trimmedRadical === page.keyword || // probably too lenient for multiple radicals. for exact keyword hit, query covers it
                    // trimmedRadical === page.keywordWK ||
                    query === page.keyword ||
                    query === page.keywordWK
                  )
              ) {
                // in strict mode, only add result if it has at least one element match.
                // we could be even stricter and check that all elements match, but that rarely makes a difference,
                //   and costs quite a bit of performance and refactoring. see feat/stricterMode branch
                addToResults = true;
                break;
              }
            }
          }
          if (addToResults) {
            let kanjiName = page.keyword;
            if (!rtkMode && page.keywordWK && page.keywordWK.length > 0) {
              kanjiName = page.keywordWK;
            }
            let leftPaddingPercent = 28;
            if (document.getElementById('search-box').clientWidth < 500) {
              leftPaddingPercent = 5; // less padding on small screens (e.g. mobile, portrait mode). TODO cleaner solution
            }
            entries.append(
              '<div style="position: relative; left: ' + leftPaddingPercent + '%; text-align: center">'+
              // left: desktop: 37% for alignment with WK, 28% with kanji in chrome
              '<article>'+
              '  <h3 style="text-align: left">'+
              '    <a href="https://www.wanikani.com/kanji/'+page.kanji+'">WK</a>'+
              '    <button class="btnClip" id="cbCopyButton'+page.id+'" title="Copy this kanji to clipboard">📋</button>' +
              '    <a href="https://jisho.org/search/'+page.kanji+'">'+page.kanji+' '+kanjiName+'</a>'+
              '  </h3>'+
              '</article></div>'
            );
            document.getElementById('cbCopyButton'+page.id).onclick = function() {
              self.cbCopyButtonClick(page.id, page.kanji);
            }
            matches++;
            if (matches >= this.maxResultSize) {
              break; // performance: don't add more than maxResultSize (50) matches
            }
          }
        } // end for each page
        if (matches > 5) {
          const maxResultsReachedString = ' (only showing ' + this.maxResultSize + ')';
          // indent under query
          console.log('  matches: ' + results.length + (matches === this.maxResultSize ? maxResultsReachedString : ''));
       }
      }
    } // end for query
    // if (results.length == 0) {
    //   entries.append('<h4>Kanji not found :-(</h4>'); // sometimes fires too early
    // }
    result.show();

    return false;
  }

  cbCopyButtonClick(id, kanji) {
    //console.log("lastId, id: " + this.lastCopyButtonClickedId + "," + id);
    navigator.clipboard.writeText(kanji);
    const selectedClass = 'btnClipLastSelected';
    const copyButton = document.getElementById('cbCopyButton' + id);
    if (copyButton.classList.contains(selectedClass)) {
      copyButton.classList.remove(selectedClass);
    } else {
      copyButton.classList.add(selectedClass);
    }
    if (this.lastCopyButtonClickedId !== id && this.lastCopyButtonClickedId > -1) {
      document.getElementById('cbCopyButton' + this.lastCopyButtonClickedId)?.classList.remove(selectedClass);
    }
    this.lastCopyButtonClickedId = id;
  }

  getRtkKeywordLists(rtkVersions) {
    let keywords = [];
    for (const rtkVersion of rtkVersions) {
      keywords.push(rtkVersion.split('&'));
    }
    return keywords;
  }

  checked(checkboxQuery) {
    return $(checkboxQuery).prop('checked');
  }

  isStrictMode() {
    return this.checked(this.checkboxStrictQuery);
  }

  isRtkMode() {
    return this.checked(this.checkboxRTKQuery);
  }

  setupHTMLElements() {
    const checkboxStrictQuery = this.checkboxStrictQuery;
    const checkboxRTKQuery = this.checkboxRTKQuery;
    const checkboxStrictLabelQuery = this.checkboxStrictLabelQuery;
    const params = this.getUrlParameters();

    const self = this;
    $('#search-button').on('click', function() {
      return self.search();
    });
    
    $('#search-query').on('input', function() {
      return self.search();
    });

    // checkboxStrict.on('click', function() { // replaces click event completely
    $(checkboxStrictQuery).change(function() {
      return self.search(); // TODO optimization: don't search again when enabling strict mode, only re-filter. same for RTK checkbox
    });
    $(checkboxRTKQuery).change(function() {
      if (self.isRtkMode()) {
        $(checkboxStrictLabelQuery).prop('style')['text-decoration'] = 'line-through'; // strike-through
      } else {
        $(checkboxStrictLabelQuery).prop('style')['text-decoration'] = '';
      }
      return self.search();
    })

    if (params.strict === '1' || params.strict === 'true' && !this.isStrictMode()) {
      $(checkboxStrictQuery).click();
    }
    if (params.rtk === '1' || params.rtk === 'true' && !this.isRtkMode()) {
      $(checkboxRTKQuery).click();
    }
  }

  getUrlParameters() {
    let params = {};
    let parser = document.createElement('a');
    parser.href = window.location.href;
    const query = parser.search.substring(1);
    const vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
      const pair = vars[i].split('=');
      params[pair[0]] = decodeURIComponent(pair[1]);
    }
    return params;
  }

  get_wk_to_rtk_replacements() {
    return {
      "cross": "ten",
      "sun": "sun,mortar", // mortar (臼) is given as sun in WK
      //"moon": "moon" or month, but kanji with month always also have moon, and not vice versa
      "month": "moon", // catch cases where only moon is given, see above
      "ricepaddy": "rice field,silage", // or silage, p354. RTK says sun for 更 again
      "net": "eye", // own radical in WK, just horizontal eye in RTK
      "dare": "risk", // not a WK radical, WK: sun + eye
      "crystal": "sparkle",
      "products": "goods",
      "bathtub": "spine",
      "world": "generation",
      "dawn": "nightbreak", // p25
      "former": "olden times", //p27
      "self": "oneself",
      "middle": "inX",
      "grid": "measuring box", // p29, WK: slide+twenty
      "circle": "round",
      "toe": "divining rod,magic wand",
      //"specialty": "accupuncturist", // p31, also specialty in another variation in RTK. rtk-search doesn't know accupuncturist
      "fortune": "fortune-telling",
      "table": "table,eminent", // p33, collides with WK radical table and kanji table
      "morning": "mist", // p34
      "table": "wind", //wind/weather vain
      "prison": "bound up", //or bound up small
      //"horns": "horns", // also animal horns in RTK, but i tagged everything with horns as well
      "child": "child,newborn babe", // conflict: this is the kanji child in WK (former+legs), but there's also the RTK child radical
      "shamisensong": "pop song",
      "chastity": "upright",
      "member": "employee",
      "origin": "beginning",
      "geoduck": "page",
      "paragraph": "phrase", //p41
      "season": "decameron", //p41
      "pool": "ladle", //p42
      //"neck": "neck",
      "nose": "fish guts", //p44
      "fix": "straight up",
      "reality": "true", //p46
      "narwhal": "by ones side",
      "construction": "craft",
      "have": "possess", //p47
      // sword, blade, cut all same
      "call": "seduce",
      "scarecrow": "wealth", //p50
      "town": "village", //p51
      "lipring": "can",
      "finish": "complete", //p53, only kanji in WK
      "like": "fond", //p54, only kanji in WK
      "mother": "mama", //p54, only kanji in WK
      "olderbrother": "elder brother",
      "small": "little",
      "big": "large",
      "sunlight": "ray", //p61
      "fat": "plump",
      "container": "utensil", //wk: kanji only
      "strange": "exquisite", //wk: kanji only
      "conserve": "focus", //wk: kanji only
      "odd": "strange", //p63
      "river": "stream",
      "original": "meadow,spring", //p67, or spring, without the cliff
      "temple": "buddhist temple", //p75
      "flame": "inflammation",
      "head": "hood,belt,headWK", //p83, or belt, p161, or headWK
      "roof": "house", //p85
      "letter": "character", //only kanji in WK
      "protect": "guard",
      "mutual": "mutual,inter", // conflict with other mutual kanji in WK
      "omen": "portent", //p104
      "nature": "sort of thing",
      "announce": "revelation",
      "previous": "before", //p108
      "hat": "umbrella", //p109
      "suit": "fit", //p110
      "all": "all,whole", //p114, only kanji in WK. ambiguous in WK: both 皆 and 全 called 'all'.
      // "reason": "logic", //283, only kanji in WK, conflicgt with WK radical reason
      "master": "lord",
      "scooter": "road", //p122
      "winter": "walking legs,taskmaster", //p125, or taskmaster, p137
      "kiss": "each",
      "forehead": "crown", //p128
      "lid table": "whirlwind",
      "lid mouth": "tall",
      "lid": "top hat", //p130
      //"samurai": "gentleman", //p134 // actually gentleman is only for the gentleman kanji which also has samurai as element.
      "viking": "schoolhouse",
      "warn": "admonish",
      "ceremony": "arrow", //p143
      "drunkard": "fiesta",
      "tocut": "thanksgiving", //p145, "to cut" is not from WK but from Jisho/Phonetic-semantic composition
      "become": "turn into", //p146
      "bar": "float", //p148
      "plan": "undertake", //p150, only kanji in WK
      "coatrack": "mending,zoo", //p152, or zoo, p155. zoo has downward stroke (drop) after the top line
      "yoga": "stretch",
      "clothes": "garment", //p156
      "cloth": "linen", //only kanji in WK
      // "towel ground": "market",
      "oldersister": "elder sister",
      "belt": "sash", //p161
      "heaven": "heavens", //p164
      "stand": "stand up", // only relevant for strict mode
      "chapter": "badge", //p166
      "mohawk": "antique", //p167
      "scent": "aroma",
      "back": "stature", //p170
      "point": "delicious",
      "gun": "reclining",
      "blackhole": "double back", //p175
      //"black hole": "double back",
      "clown": "muzzle", //p178
      "death": "deceased", //p180
      //"monk": "boy"
      "guard": "devil", //p183
      "mask": "formerly",
      "king": "king,porter,jewel", // or porter, p185
      "alligator": "scorpion",
      "earth": "ground", //only kanji in WK
      "turtle": "tortoise", //p195
      "pig": "sow",
      "wings": "not", //p1128 or piglets, p197
      "easy": "piggy bank", //p197
      "hard": "harden", //p206
      "mouth": "mouth,pent in", //pent in p206
      "canopy": "cave",
      "storage": "warehouse", //p208
      "skewer": "shish kebab", //p210
      "feeling": "emotion", //p211
      "certain": "invariably", //p214
      "lantern": "two hands", //p219
      "stairs": "from", //p221
      "escalator": "reach out",
      "height": "length",
      "again": "grow late", //p223, or could also be 再      
      "stool": "crotch",
      "private": "elbow", //p229
      "machine": "pedestal",
      "past": "gone", //p231
      "meet": "meeting",
      "mole": "climax",
      "trash": "infant", //p232
      "skin": "pelt", //p239
      "wave": "waves",
      // "valley": "valley", // somewhat similar: gully (p237), though that could be boat too
      "yakuza": "bone", //p240
      "row": "file", //only kanji in WK
      "fault": "lose", //p244
      "servant": "retainer",
      "giant": "gigantic",
      "go": "going",
      "loiter": "going",
      "grain": "wheat", //p251
      "attach": "adhere", //p265
      "dynamite": "third class", //p267
      "shrimp": "shaku", //p276
      "jackhammer": "show", //p1167, lesson30
      "reason": "wherefore,sprout", //1186
      "turtleshell": "armor", //1194
      "humble": "speaketh", //1198
      // "axe": "axe", // axe works better with rtk-search anyways
      "key": "saw", //1221*
      "wolverine": "broom",//1224*
      "conflict": "content", //1238
      "buddy": "old boy", //1246
      "rake": "comb", //p290
      "box": "shovel", //p291
      "music": "bend", //1256
      "ladle": "big dipper",
      "task": "utilize", //1265
      "blackjack": "salad", //lesson32
      "longago": "once upon a time", //1268
      "yurt": "caverns", //p295
      "gladiator": "quarter", //p297
      "onesided": "one-sided", //1297
      "hills": "building blocks", //1299, also "of"
      "not": "negative",
      "arrow": "dart", //1305
      "spear": "halberd", //1311
      "dollar": "dollarsign", //p302
      "beggar": "slingshot", //p304
      "give": "bestow",
      "body": "somebody", //1337
      "come": "scissors", //p307
      "mix": "mingle", //1368
      "foot": "leg", //1372
      "bone": "skeleton", //1383
      "zoom": "jawbone", //p311, doesn't really exist on WK, zoom is a personal mnemonic. could be zoommustache as well
      "mustache": "hood&mouth", // mustache in itself seems to be "hood mouth" in RTK, see 尚
      "building": "pinnacle,city walls", //lesson35, or city walls (p394, when on the right)
      "pi": "paper punch", //p316, not a perfect match (roof legs instead of ground legs) TODO add alternate replacements
      "syrup": "goods tree", // e.g. 1469, syrup doesn't exist in RTK
      "poop": "cocoon", //p322
      "snake": "fingerprint", //p328
      "comb": "staples", //p329
      "alcohol": "sign of the bird", //1534
      "plate": "dish", //1555
      "peace": "call",
      "treasure": "sheaf,tucked under the arm", //p339 or arm maybe, p222
      "rocket": "sheik,top hat&villain&belt&elbow", //1605, sheik = 2047* (p12) in rtk3 = top hat villain belt elbow
      "dance": "ballerina", // or sometimes only sunglasses (right part of WK dance), RTK isn't clear on this (see shoeshine element). or dance in rtk-search
      "barracks": "earthworm,mountain goat,barracks", //p340 or mountain goat (p413), or barracks (2189)
      //"spicy": "spicy,red pepper", // spicy or maybe red pepper sometimes
      "hotpepper": "ketchup", //p341
      //"hot pepper": "ketchup",
      "vines": "cornucopia", //p342
      "womb": "rice seedling ground", //p343, RTK doesn't have womb as a radical
      "slice": "sign of the hog", //1637
      "angel": "resin,pole", //p345, or pole sometimes (missing the drop, e.g. needed for tea)
      "nurse": "grass skirt", //p346
      "life": "grow up,king,porter", //p347, or king/porter. sometimes grow up e.g. for poison, = life in WK. RTK life is 1675
      "signpost": "walking legs bushes", //p350, signpost doesn't exist in RTK
      "plow": "christmas tree", //p35̂1
      "spring": "bonsai",
      "boot": "cabbage", //p353
      "chinese": "scarecrow", //p353
      "dangle": "droop",
      "monalisa": "concurrently", //1723
      "injustice": "un-", //1760
      "hook": "key", //p363
      "korea": "locket", //p364
      "dry": "dry,potato,cornstalk", //1777, or potato (p366, needed for eaves/house counter), or cornstalk (p352, needed for dedicate)
      "surplus": "too much", //1786
      "squid": "awl", //p368
      "sick": "sickness", //lesson44
      "cage": "box", //p371
      "district": "ward", //1831
      "tent": "teepee", //p373
      "hair": "shape", //p374
      "scene": "scenery", //337
      "writing": "sentence", //1861
      "simultaneous": "adjusted", //1866
      "explosion": "sparkler",
      //"red: "apple", // just alternate name (?)
      "bed": "mosaic", //p380
      "certain": "so-and-so", //1896
      "crab": "bushel basket",
      "middle ground": "purse",
      "tophat": "shelf",
      "lineup": "row",
      "normal": "universal", //1925
      "yen": "circle", //1952
      "lifeguard": "funnel",
      "think": "think,scrapbook", //p391. scrapbook is from semantic-phonetic composition, needed e.g. for theory
      "energy": "reclining one fishhook", //energy doesn't exist in RTK
      //"energy treasure": "spirit", //2030, hard to match. there's also vapor for RTK
      "clan": "family name", //1970
      "clan ground": "calling card",
      "peoples": "people",
      "wedding": "dog tag",
      "cape": "clothes hanger",  //p397
      "pirate": "chihuahua with one human leg", //RTK1v6: p402 (2033), RTK3v4 2087: chihuahua with one human leg
      "face": "mask", //2039
      "catapult": "give", //2046
      "fang": "tusk", //2053
      "sickle": "animal tracks", // or grab, p228, which is covered by "cleat tree".
      "number": "turn", //2058
      "seven slides": "lock of hair",
      "slide seven": "lock of hair", //p407
      "sake": "doX", //2067
      "ground kick": "hairpin",
      "grass": "owl",
      "football": "migrating ducks", //p412
      "hill": "mount", //2112
      "can": "tin can",
      "badger": "skunk", //p416
      "landslide": "sign of the dragon", //2164
      "horns heaven": "golden calf",
      "demon": "ghost", //2175
      "rust": "cinnabar",
      "rust colored": "cinnabar",
      "tombstone": "line spool", // tombstone doesn't exist in RTK
      "root": "silver",
      "umbrella": "fishhook,umbrellaWK",
      "spider": "streetwalker",
      "horse": "team of horses",
      "jet": "not yet,extremity", // not yet is with the shorter top stroke, extremity with the longer (末 end kanji)
      "notyet": "not yet", // officially jet in WK, but makes sense to distinguish from end/extremity
      "end": "extremity", // officially jet in WK, but makes sense to distinguish from not yet
      "gate": "gates",
      "tooth": "teeth",
      "wing": "knot",
      // ---------------------------------- ^^ -------- //
      // ^ above checked with RTK physical edition, at least for WK radicals
      // ---- some WK radicals not existing in RTK ---- //
      "tombstone": "line spool", // tombstone doesn't exist in RTK
      "root": "silver",
      "business": "upside down in a row", // plus not yet or tree or husband, but doesn't make a difference for now. also not clear.
      "youngerbrother": "horns dollar",
      "guy": "good city walls",
      "penguin": "shredder&taskmaster",
      "frostbite": "dirt&walking legs",
      "satellite": "vulture king mountain",
      "bully": "ceiling&mouth&hood&human legs&street",
      "showy": "flowers silage ten",
      "mantis": "gnats drop insect belt",
      // --------------------------------------------
      "elf": "daring",
      "coral": "helping hand",
      "bear": "maestro without baton",
      "spikes": "row,upside down in a row",
      "pope": "ten eye",
      "ground": "one,floor,ceiling",
      "creeper": "one&mouth,mouth&floor",
      "measurement": "glue",
      "commander": "leader",
      "bookshelf": "scrapbook,tome",
      "tofu": "rag", // actually exists in RTK, indirectly, description of 旅
      "coffin": "old man",
      // -------- these don't exist in RTK, need to be tagged with elementsWK --------
      "barb": "barbWK", // hook not correct apparently. just use barbWK as elementsWK
      "leaf": "leafWK",
      "slide": "slideWK,fishhook,hook",
      // -----------------------------------------------------------------------------
      // -------- some extra WK radicals (Kanji keywords). e.g. 戻 = return kanji in WK, but doesn't exist as radical
      // -------- see issue #2 -------------------------------------------------------
      "return": "re-", // enables searching for 涙 with "return" in WK mode
      "common": "commonplace",
      "showy": "splendid",
      // "all": "all,whole", // all exists in RTK
      // "ash": "ash", // same in RTK
      // "hemp": "hemp", // same in RTK
      // -----------------------------------------------------------------------------
      "stick": "stick", // or 'walking stick', but all kanji are just annotated with stick right now.
      "small drop": "valentine",
      "drop": "drop,drops",
      "fins": "animal legs,eight",
      "legs": "human legs,fenceposts", // or fenceposts, p377
      "lion": "straightened hook",
      //"ground fins": "tool", // not ideal, this needs to be in combination
      "knife": "saber",
      "window": "breasts,mama", // FYI mama is only used for 2 kanji, mama and pierce
      "triceratops": "little",
      "cliff": "cliff,drag", // or drag, p396
      //"flood": "flood",
      "tsunami": "water",
      "boil": "fire",
      //"flower": "flower",
      "greenhouse": "graveyard",
      "icicle": "turtle",
      "animal": "pack of dogs",
      "slide dirt": "cow",
      "hat ground": "meeting",
      "deathstar": "meeting&moon&saber", // or meeting moon flood, but unnecessary for now
      // or meeting moon flood for 喩 metaphor, but nothing else for now, and 喻 metaphor has saber too
      //"death star": "convoy",
      "dirt mouth": "lidded crock",
      //"brush": "brush",
      "kick": "scarf", // the left part can also be plow sometimes
      "spirit": "cloak,altar",
      "cloud": "rising cloud",
      //"rain": "rain",
      //"ice": "ice",
      "heaven": "witch,sapling",
      "insect": "gnats",
      //"turkey": "turkey",
      //"feathers": "feathers",
      "soul": "state of mind",
      "fingers": "finger",
      "weapon": "missile",
      "grave": "spool",
      "cleat": "vulture",
      "water": "grains of rice",
      "leader": "person",
      //"flag": "flag",
      "gambler": "strawman",
      "drop bear": "maestro",
      "pi": "hole",
      "hole": "hole", // RTK doesn't differentiate between WK's pi and hole (added stick on top) 
      // hole, house, miss world or paper punch seem to be mostly the same, but inconsistent in rtk-search.
      //"stamp": "stamp",
      "mama": "chop-seal small",
      "limit": "silver",
      //"good": "good alt",
      "helicopter": "old west",
      "charcoal": "pup tent",
      "long": "mane&hairpin",
      "splinter": "talking cricket",
      "village": "computer", // or ri, p80. but rtk-search has computer instead of ri
      //"tiger": "tiger",
      //"deer": "deer",
    }
  }
}

$(document).ready(function() {
  const app = new App();

  app.setupHTMLElements();
});
