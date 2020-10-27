---
---
$(function() {
	$('#search-button').on('click', function() {
    return search();
  });
  
  $('#search-query').on('keyup', function() {
    return search();
  });

  function search() {
    var query   = $('#search-query').val();
    var wk_replacements = {
      "cross": "ten",
      "moon": "month",
      "ricepaddy": "rice field", // or silage, p354
      "net": "eye", // own radical in WK, just horizontal eye in RTK
      "dare": "risk", // not a WK radical, WK: sun + eye
      "crystal": "sparkle",
      "products": "goods",
      "bathtub": "spine",
      "world": "generation",
      "dawn": "nightbreak", // p25
      "former": "olden times", //p27
      "self": "oneself",
      "middle": "in",
      "grid": "measuring box", // p29, WK: slide+twenty
      "circle": "round",
      "toe": "divining rod",
      //"speciaty": "accupuncturist", // p31, also specialty in another variation in RTK
      "fortune": "fortune-telling",
      //"table": "eminent", // p33, collides with WK radical table and kanji table
      "morning": "mist", // p34
      "table": "wind", //wind/weather vain
      "prison": "bound up", //or bound up small
      //"horns": "horns",
      //"child": "newborn babe", // conflict: this is the kanji child in WK (former+legs), but there's also the RTK child radical
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
      "original": "meadow", //p67, or spring, without the cliff
      "temple": "buddhist temple", //p75
      "flame": "inflammation",
      "head": "hood", //p83, or belt, p161
      "roof": "house", //p85
      "letter": "character", //only kanji in WK
      "protect": "guard",
      //"mutual": "inter", // conflict with other mutual kanji in WK
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
      "winter": "walking legs", //p125, or taskmaster, p137
      "kiss": "each",
      "forehead": "crown", //p128
      "lid table": "whirlwind",
      "lid mouth": "tall",
      "lid": "top hat", //p130
      "samurai": "gentleman", //p134
      "viking": "schoolhouse",
      "warn": "admonish",
      "ceremony": "arrow", //p143
      "drunkard": "fiesta",
      "tocut": "thanksgiving", //p145, "to cut" is not from WK but from Jisho/Phonetic-semantic composition
      "become": "turn into", //p146
      // ^ up until here checked with RTK physical edition, at least for WK radicals
      "bar": "float", //p148
      "plan": "undertake", //p150, only kanji in WK
      "coatrack": "mending", //p152, or zoo, p155
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
      "black hole": "double back",
      "clown": "muzzle", //p178
      "death": "deceased", //p180
      //"monk": "boy"
      "guard": "devil", //p183
      "mask": "formerly",
      //"king": "king", // or porter, p185
      "alligator": "scorpion",
      "earth": "ground", //only kanji in WK
      "turtle": "tortoise", //p195
      "pig": "sow",
      "wings": "not", //p1128 or piglets, p197
      "easy": "piggy bank", //p197
      "hard": "harden", //p206
      "mouth": "pent in", //p206
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
      "stool": "or again",
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
      "reason": "wherefore", //1186
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
      "long ago": "once upon a time", //1268
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
      "building": "pinnacle", //lesson35, or city walls (p394, when on the right)
      "pi": "paper punch", //p316, not a perfect match (roof legs instead of ground legs)
      "syrup": "goods tree", // e.g. 1469, syrup doesn't exist in RTK
      "poop": "cocoon", //p322
      "snake": "fingerprint", //p328
      "comb": "staples", //p329
      "alcohol": "sign of the bird", //1534
      "plate": "dish", //1555
      "peace": "call",
      "treasure": "sheaf", //p339 or arm maybe, p222
      "rocket": "top hat villain", //1605 rocket doesn't exist in RTK. RTK says top hat villain belt elbow, but who knows if all these tags apply
      "barracks": "earthworm", //p340 or mountain goat (p413), or barracks (2189)
      //"spicy": "spicy", // or maybe red pepper sometimes
      "hotpepper": "ketchup", //p341
      //"hot pepper": "ketchup",
      "vines": "cornucopia", //p342
      "womb": "rice seedling", //p343, RTK doesn't have womb as a radical
      "slice": "sign of the hog", //1637
      "angel": "resin", //p345, or maybe pole sometimes (missing the drop)
      "nurse": "grass skirt", //p346
      // "life": "grow up", //p347, sometimes, e.g. for poison, which is life in WK and group up in RTK. RTK life is 1675
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
      //"dry": "dry", 1777, or potato (p366), or cornstalk, p352
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
      //"think": "scrapbook", //p391, or think
      "clan": "family name", //1970
      "clan ground": "calling card",
      "peoples": "people",
      "wedding": "dog tag",
      "cape": "clothes hanger",  //p397
      "energy treasure": "spirit", //2030, hard to match. there's also vapor for RTK
      "pirate": "crown leg", //p402 (2033), pirate doesn't exist in RTK.
      "face": "mask", //2039
      "catapult": "give", //2046
      "fang": "tusk", //2053
      "sickle": "animal tracks", // or grab, p228
      "number": "turn", //2058
      "seven slides": "lock of hair",
      "slide seven": "lock of hair", //p407
      "sake": "do", //2067
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
      // ---------------------------------- ^^ ------- //
      "stick": "walking stick",
      "small drop": "valentine",
      "drop": "drop of",
      "fins": "animal legs",
      "legs": "human legs", // or fenceposts, p377
      "lion": "straightened hook",
      "barb": "hook",
      "ground fins": "tool", // not ideal, this needs to be in combination
      "knife": "saber",
      "window": "mama",
      "triceratops": "little",
      //"cliff": "cliff", // or drag, p396
      //"flood": "flood",
      "tsunami": "water",
      "boil": "fire",
      //"flower": "flower",
      "greenhouse": "graveyard",
      "icicle": "turtle",
      "animal": "pack of dogs",
      "slide dirt": "cow",
      "hat ground": "meeting",
      "deathstar": "convoy",
      "death star": "convoy",
      "dirt mouth": "lidded crock",
      //"brush": "brush",
      "kick": "scarf",
      "spirit": "cloak",
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
      "mutual": "broom",
      "gambler": "strawman",
      "drop bear": "maestro",
      "hole": "miss universe",
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
    query = " " + query + " "; // add spaces to trigger replacement for last radical and prevent partial hit ("turkey" -> "tursaw") for first
    var inputRadicals = query.split(" ");
    var rtkQuery = "";
    for (const inputRadical of inputRadicals) {
      const radical = inputRadical.toLowerCase();
      if (wk_replacements[radical]) {
        rtkQuery += wk_replacements[radical];
      } else {
        rtkQuery += inputRadical;
      }
      rtkQuery += " ";
    }
    // for (const [key, value] of Object.entries(wk_replacements)) {
    //   query = query.replace(" " + key + " ", " " + value + " ");
    // }
    console.log("changed query: " + rtkQuery);
    query = rtkQuery;
    var result  = $('#search-results');
    var entries = $('#search-results .entries');

    if (query.length <= 2) {
      result.hide();
      entries.empty();
    } else {
      // retrieve matching result with content
      var results = $.map(idx.search(query), function(result) {
        return $.grep(docs, function(entry) {
          return entry.id === result.ref;
        })[0];
      });

      entries.empty();

      if (results && results.length > 0) {
        $.each(results, function(key, page) {
          entries.append(
            '<div style="position: relative; left: 30%; text-align: center">'+
            '<article>'+
          '  <h3 style="text-align: left">'+
          '    <a href="https://www.wanikani.com/kanji/'+page.kanji+'">WK</a>'+
          '    <button id="cbCopyButton" onclick="navigator.clipboard.writeText(\''+page.kanji+'\')">📋</button>' +
          '    <a href="https://jisho.org/search/'+page.kanji+'">'+page.kanji+' '+page.keyword+'</a>'+
          '  </h3>'+
          '</article></div>');
        });
      } else {
        entries.append('<h4>Kanji not found :-(</h4>');
      }

      result.show();
    }

    return false;
  }
});
