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
      "net": "eye",
      "stick": "walking stick",
      "drop": "drop of",
      "specialty": "acupuncturist",
      "toe": "divining rod",
      "morning": "mist",
      "fins": "animal legs",
      "legs": "human legs",
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
      "brush": "brush",
      "ceremony": "arrow"
    }
    for (const [key, value] of Object.entries(wk_replacements)) {
      query = query.replace(key + " ", value + " ");
      console.log("changed query: " + query);
    }
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
          entries.append('<article>'+
          '  <h3>'+
          '    <a href="./'+page.kanji.charAt(0)+'/index.html">'+page.kanji+' '+page.keyword+'</a>'+
          '  </h3>'+
          '</article>');
        });
      } else {
        entries.append('<h4>Kanji not found :-(</h4>');
      }

      result.show();
    }

    return false;
  }
});
