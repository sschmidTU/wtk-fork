---
---
$(function() {
  const params = getUrlParameters(); // get URL parameters, e.g. ?strict=1&rtk=0

  const checkboxStrictQuery = 'input[name=strictModeCheckbox]';
  const checkboxRTKQuery    = 'input[name=rtkModeCheckbox]';
  const checkboxStrictLabelQuery = '#strictModeLabel';
  setupHTMLElements(checkboxStrictQuery, checkboxRTKQuery, checkboxStrictLabelQuery, params)
  
  function search() {
    let query = $('#search-query').val();

    if (query === 'v' || query === 'version') {
      console.log('wtk-search 1.0.5.0');
    }
    query = query.toLowerCase(); // useful for mobile auto-correct. maybe check later if input like 'inX' is necessary

    var result  = $('#search-results');
    var entries = $('#search-results .entries');
    // this should have trim(), but maybe this isn't necessary, so let's allow a workaround of adding spaces
    if (query.length <= 2) {
      result.hide();
      entries.empty();
      return;
    }

    // replace spaces in WK radical names
    const space_replacements = {
      "rice paddy": "ricepaddy",
      "older brother": "olderbrother",
      "younger brother": "youngerbrother",
      "to cut": "tocut",
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
      "shamisen song": "shamisensong",
      "lip ring": "lipring",
    };
    if (!checked(checkboxRTKQuery)) { // only do pre-replacements in WK mode
      for (let [key, value] of Object.entries(space_replacements)) {
        query = query.replace(key, value);
      }
    }

    // mapping from WK radicals to RTK elements. (format of the values is comma separated, no spaces between values)
    // WK radical input should be without spaces inside radicals, so "ricepaddy" instead of "rice paddy".
    var wk_replacements = {
      "cross": "ten",
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
      "toe": "divining rod,wand",
      //"specialty": "accupuncturist", // p31, also specialty in another variation in RTK. rtk-search doesn't know accupuncturist
      "fortune": "fortune-telling",
      "table": "table,eminent", // p33, collides with WK radical table and kanji table
      "morning": "mist", // p34
      "table": "wind", //wind/weather vain
      "prison": "bound up", //or bound up small
      //"horns": "horns",
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
      "all": "whole", //p114, only kanji in WK
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
      "coatrack": "mending,zoo", //p152, or zoo, p155
      "coat rack": "mending",
      "yoga": "stretch",
      "clothes": "garment", //p156
      "cloth": "linen", //only kanji in WK
      // "towel ground": "market",
      "oldersister": "elder sister",
      "belt": "sash", //p161
      "heaven": "heavens", //p164
      // "stand": "stand up", // makes no difference for rtk-search
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
      "king": "king,porter", // or porter, p185
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
      "mustache": "jawbone,helmet,hood&mouth", // mustache in itself seems to be "hood mouth" in RTK, see 尚
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
      "rocket": "top hat villain", //1605 rocket doesn't exist in RTK. RTK says top hat villain belt elbow, but who knows if all these tags apply
      "barracks": "earthworm,mountain goat,barracks", //p340 or mountain goat (p413), or barracks (2189)
      //"spicy": "spicy,red pepper", // spicy or maybe red pepper sometimes
      "hotpepper": "ketchup", //p341
      //"hot pepper": "ketchup",
      "vines": "cornucopia", //p342
      "womb": "rice seedling ground", //p343, RTK doesn't have womb as a radical
      "slice": "sign of the hog", //1637
      "angel": "resin,pole", //p345, or sometimes pole sometimes (missing the drop, e.g. needed for tea)
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
      "pirate": "crown leg", //p402 (2033), pirate doesn't exist in RTK.
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
      // ---------------------------------- ^^ ------- //
      // ^ above checked with RTK physical edition, at least for WK radicals
      // ---- some WK radicals not existing in RTK ---- //
      "tombstone": "line spool", // tombstone doesn't exist in RTK
      "root": "silver",
      "business": "in a row upside down", // plus not yet, but doesn't make a difference
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
      "spikes": "row",
      "pope": "ten eye",
      "ground": "one",
      "creeper": "one mouth",
      "measurement": "glue",
      "commander": "leader",
      "bookshelf": "scrapbook,tome",
      "tofu": "rag", // actually exists in RTK, indirectly, description of 旅
      "coffin": "old man",
      // -------- these don't exist in RTK, need to be tagged with elementsWK --------
      "barb": "barbWK", // hook not correct apparently. just use barbWK as elementsWK
      "leaf": "leafWK",
      "slide": "slideWK",
      // -----------------------------------------------------------------------------
      "stick": "walking stick,stick",
      "small drop": "valentine",
      "drop": "drop of",
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
      "kick": "scarf",
      "spirit": "cloak,altar",
      "cloud": "rising cloud",
      //"rain": "rain",
      //"ice": "ice",
      "heaven": "witch",
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
      "charcoal": "pop tent",
      "long": "mane hairpin",
      "splinter": "talking cricket",
      "village": "computer", // or ri, p80. but rtk-search has computer instead of ri
      //"tiger": "tiger",
      //"deer": "deer",
    }
    let rtkQueries = [];
    let outputRadicals = [];
    if (!checked(checkboxRTKQuery)) {
      rtkQueries.push(""); // necessary for now - investigate
      query = " " + query + " "; // add spaces to trigger replacement for last radical and prevent partial hit ("turkey" -> "tursaw") for first
      const inputRadicals = query.split(" ");
  
      // create queries with each alternate RTK replacement (e.g. ricepaddy can be rice field, silage or sun)
      //   TODO the current method is crude and could be improved, but works for now.
      for (const inputRadical of inputRadicals) {
        const radical = inputRadical.toLowerCase();
        if (wk_replacements[radical]) { // this is a WK radical that needs to be replaced
          const rtkVersions = wk_replacements[radical].split(",");
          const rtkKeywordLists = getRtkKeywordLists(rtkVersions);
          if (rtkKeywordLists.length === 1) {
            // if we only have one possible replacement, just add it to each query
            for (let i=0; i<rtkQueries.length; i++) {
              for (const keywordList of rtkKeywordLists) {
                for (const keyword of keywordList) {
                  rtkQueries[i] += keyword + " ";
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
                  newQuery += keyword + " ";
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

    console.log(" "); // new line
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
      console.log("query " + (i+1) + ": " + query);

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

      if (results && results.length > 0) {
        const rtkMode = checked(checkboxRTKQuery);
        // TODO fix strictMode for RTK mode, need to get each radical (e.g. "pent in" would be detected as 2 currently);
        const strictMode = !rtkMode && strictModeCheckbox && checked(checkboxStrictQuery);
        let matches = 0;
        $.each(results, function(key, page) {
          let addToResults = !strictMode; // if not strict mode, add all results to query
          if (strictMode) {
            const elements = page.elements.split(',').map((val,_,__) => val.trim());
            for (const outputRadical of outputRadicals) {
              const trimmedRadical = outputRadical.trim();
              if (trimmedRadical !== '' && (
                    elements.includes(trimmedRadical) ||
                    trimmedRadical === page.keyword ||
                    trimmedRadical === page.keywordWK
                  )
              ) {
                //console.log('outputRadical: ' + trimmedRadical);
                addToResults = true; // in strict mode, only add result if it has an exact element match
                break;
              }
            }
          }
          if (addToResults) {
            let kanjiName = page.keyword;
            if (!checked(checkboxRTKQuery) && page.keywordWK && page.keywordWK.length > 0) {
              kanjiName = page.keywordWK;
            }
            entries.append(
              '<div style="position: relative; left: 28%; text-align: center">'+ // left: 37% for alignment with WK, 28% with kanji in chrome
              '<article>'+
              '  <h3 style="text-align: left">'+
              '    <a href="https://www.wanikani.com/kanji/'+page.kanji+'">WK</a>'+
              '    <button id="cbCopyButton" onclick="navigator.clipboard.writeText(\''+page.kanji+'\')">📋</button>' +
              '    <a href="https://jisho.org/search/'+page.kanji+'">'+page.kanji+' '+kanjiName+'</a>'+
              '  </h3>'+
              '</article></div>'
            );
            matches++;
          }
        }); // end each pages
        if (matches > 5) {
          console.log('  matches: ' + matches); // indent under query
        }
      }
    } // end for query
    // if (results.length == 0) {
    //   entries.append('<h4>Kanji not found :-(</h4>'); // sometimes fires too early
    // }
    result.show();

    return false;
  }

  function getRtkKeywordLists(rtkVersions) {
    let keywords = [];
    for (const rtkVersion of rtkVersions) {
      keywords.push(rtkVersion.split('&'));
    }
    return keywords;
  }

  function checked(checkboxQuery) {
    return $(checkboxQuery).prop("checked");
  }

  function setupHTMLElements(checkboxStrictQuery, checkboxRTKQuery, checkboxStrictLabelQuery) {
    $('#search-button').on('click', function() {
      return search();
    });
    
    $('#search-query').on('input', function() {
      return search();
    });

    // checkboxStrict.on('click', function() { // replaces click event completely
    $(checkboxStrictQuery).change(function() {
      return search(); // TODO optimization: don't search again when enabling strict mode, only re-filter. same for RTK checkbox
    });
    $(checkboxRTKQuery).change(function() {
      if (checked(checkboxRTKQuery)) {
        $(checkboxStrictLabelQuery).prop("style")["text-decoration"] = 'line-through'; // strike-through
      } else {
        $(checkboxStrictLabelQuery).prop("style")["text-decoration"] = '';
      }
      return search();
    })

    if (params.strict === "1" || params.strict === "true" && !checked(checkboxStrictQuery)) {
      $(checkboxStrictQuery).click();
    }
    if (params.rtk === "1" || params.rtk === "true" && !checked(checkboxRTKQuery)) {
      $(checkboxRTKQuery).click();
    }
  }

  function getUrlParameters() {
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
});
