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
      "ricepaddy": "rice field",
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
      "reason": "logic", //only kanji in WK
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
      // ---------------------------------- //
      "stick": "walking stick",
      "small drop": "valentine",
      "drop": "drop of",
      "fins": "animal legs",
      "legs": "human legs", // or fenceposts
      "lion": "straightened hook",
      "barb": "hook",
      "ground fins": "tool", // not ideal, this needs to be in combination
      "knife": "saber",
      "window": "mama",
      "triceratops": "little",
      "cliff": "cliff",
      "flood": "flood",
      "tsunami": "water",
      "boil": "fire",
      "angel": "pole",
      "flower": "flower",
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
      "guard": "devil",
      "alligator": "scorpion",
      "insect": "gnats",
      "pig": "sow",
      "wings": "piglet",
      "easy": "piggy bank",
      //"turkey": "turkey",
      //"feathers": "feathers",
      "mouth": "pent in",
      "canopy": "cave",
      "soul": "state of mind",
      "fingers": "finger",
      "lantern": "two hands",
      "weapon": "missile",
      "grave": "spool",
      "cleat": "vulture",
      "private": "elbow",
      "valley": "gully",
      "yakuza": "bone",
      "loiter": "going",
      "grain": "wheat",
      "water": "grains of rice",
      "leader": "person",
      //"flag": "flag",
      "key": "saw",
      "wolverine": "broom",
      "mutual": "broom",
      "rake": "comb",
      "blackjack": "salad",
      "yurt": "caverns",
      "gambler": "strawman",
      "dollar": "dollarsign",
      "beggar": "slingshot",
      "drop bear": "maestro",
      "building": "pinnacle",
      "hole": "miss universe",
      "poop": "cocoon",
      //"stamp": "stamp",
      "mama": "chop-seal small",
      "snake": "fingerprint",
      "limit": "silver",
      //"good": "good alt",
      "treasure": "sheaf",
      "barracks": "earthworm", // or mountain goat
      "spicy": "red pepper",
      "hotpepper": "ketchup",
      //"hot pepper": "ketchup",
      "vines": "cornucopia",
      "spring": "bonsai",
      "chinese": "scarecrow",
      "helicopter": "old west",
      "hook": "key",
      "korea": "locket",
      "dry": "potato",
      "squid": "awl",
      "sick": "sickness",
      "cage": "box",
      "tent": "teepee",
      "charcoal": "pop tent",
      "hair": "shape",
      "explosion": "sparkler",
      "red": "apple",
      "color": "mosaic",
      "crab": "bushel basket",
      "tophat": "shelf",
      "lineup": "row", // imperfect, top part missing
      "lifeguard": "funnel",
      "clan ground": "calling card",
      "wedding": "dog tag",
      "cape": "clothes hanger",
      "comb": "stapler",
      "seven slides": "lock of hair",
      "sickle": "animal tracks",
      "ground kick": "hairpin",
      "long": "mane hairpin",
      "grass": "owl",
      "football": "migrating ducks",
      "splinter": "talking cricket",
      "village": "computer", // or ri, p80. but rtk-search has computer instead of ri
      //"tiger": "tiger",
      //"deer": "deer",
      "slice": "sign of the hog",
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
