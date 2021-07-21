// ==UserScript==
// @name          Wanikani Kanji+Data Extract: Kanji, Meanings, etc
// @namespace     https://www.wanikani.com
// @description   prints JSON of WK data: kanji and their meanings etc in the dashboard. See SETTINGS.
// @author        Saimin
// @version       0.2.0
// @include       /^https://(www|preview).wanikani.com/(dashboard)?$/
// @grant         none
// ==/UserScript==

(function() {
    'use strict';

	if (!window.wkof) {
		let response = confirm('Script requires WaniKani Open Framework.\n Click "OK" to be forwarded to installation instructions.');
		if (response) {
			window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
		}
		return;
    }

    const config = {
        wk_items: {
            options: {
                subjects: true,
            },
            filters: {
                item_type: 'kan'
            }
        }
    };

	wkof.include('ItemData');
	wkof.ready('ItemData').then(getItems).then(reportItems);

	function getItems() {
        const items = wkof.ItemData.get_items(config);
        return items;
		//return wkof.ItemData.get_items(config).then(filterToActiveAssignments);
    }
    
    function reportItems(items) {
        console.log('wkItems: ');
        console.dir(items);

        let processedItems = {};
        for (const item of items) {
            const data = item.data;
            const newItem = {
                id: data.id,
                kanji: data.characters,
                level: data.level,
                meanings: data.meanings,
                //readings: data.readings,
            }
			for (const meaning of newItem.meanings) {
				delete meaning.accepted_answer; // we don't need this
			}
            processedItems[newItem.kanji] = newItem;
        }
        console.log('processed items: ');
        const stringified = JSON.stringify(processedItems)
        //console.log(stringified);
        console.log(stringified.replace(/"([^"]+)":/g, '$1:'));
        //console.log(processedItems);
    }

})();