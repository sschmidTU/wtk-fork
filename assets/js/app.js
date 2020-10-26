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
      "net": "eye",
      "stick": "walking stick",
      "drop": "drop of",
      "specialty": "acupuncturist",
      "toe": "divining rod",
      "morning": "mist",
      "fins": "animal legs",
      "legs": "human legs", // or fenceposts
      "table": "wind", //wind/weather vain
      "prison": "bound up", //or bound up small
      "horns": "horns",
      "lion": "straightened hook",
      "barb": "hook",
      "ground fins": "tool", // not ideal, this needs to be in combination
      "narwhal": "by ones side",
      "knife": "saber",
      "scarecrow": "wealth",
      "window": "mama",
      "triceratops": "little",
      "cliff": "cliff",
      "flood": "flood",
      "river": "stream",
      "tsunami": "water",
      "original": "spring", // not perfect match, wk has cliff added
      "boil": "fire",
      "head": "hood",
      "roof": "house",
      "angel": "pole",
      "flower": "flower",
      "greenhouse": "graveyard",
      "icicle": "turtle",
      "animal": "pack of dogs",
      "slide dirt": "cow",
      "hat ground": "meeting",
      "hat": "umbrella",
      "scooter": "road",
      "winter": "walking legs",
      "death star": "convoy",
      "forehead": "crown",
      "lid table": "whirlwind",
      "lid mouth": "tall",
      "lid": "top hat",
      "dirt mouth": "lidded crock",
      "viking": "schoolhouse",
      //"brush": "brush",
      "ceremony": "arrow",
      "drunkard": "fiesta",
      "bar": "float",
      "coat rack": "mending",
      "yoga": "stretch",
      "kick": "scarf",
      "spirit": "cloak",
      "cloud": "rising cloud",
      //"rain": "rain",
      //"ice": "ice",
      "heaven": "witch",
      "mohawk": "antique",
      "gun": "reclining",
      "blackhole": "double back",
      "clown": "muzzle",
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
      "small drop": "valentine",
      "drop": "drop of",
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
      "barracks": "earthworm",
      "spicy": "red pepper",
      "hotpepper": "ketchup",
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
      "village": "computer",
      //"tiger": "tiger",
      //"deer": "deer",
      "slice": "sign of the hog",
    }
    query = " " + query + " "; // add spaces to trigger replacement for last radical and prevent partial hit ("turkey" -> "tursaw") for first
    var inputRadicals = query.split(" ");
    var rtkQuery = "";
    for (const inputRadical of inputRadicals) {
      if (wk_replacements[inputRadical]) {
        rtkQuery += wk_replacements[inputRadical];
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
