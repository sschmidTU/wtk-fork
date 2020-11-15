![image](https://user-images.githubusercontent.com/33069673/99188880-882d2080-275e-11eb-9016-ff7fa09f4826.png)
https://sschmidtu.github.io/mr-kanji-search-wtk/ <br>
This is a web-based Kanji search engine for Wanikani radicals or RTK names, using multi-radical search.

![image](https://user-images.githubusercontent.com/33069673/99188399-04723480-275c-11eb-89fe-1e953056957a.png)

---
![image](https://user-images.githubusercontent.com/33069673/99188451-53b86500-275c-11eb-9e16-00d043123529.png)

![image](https://user-images.githubusercontent.com/33069673/99188470-75195100-275c-11eb-8f6f-6e3c4e6d0d13.png)


Live at: https://sschmidtu.github.io/mr-kanji-search-wtk/

If you have suggestions, if you can't find your Kanji using WK radicals or RTK names, please [open an issue](https://github.com/sschmidTU/mr-kanji-search-wtk/issues)
or comment on the Wanikani thread:
https://community.wanikani.com/t/multi-radical-kanji-search-web/46781

The [offline branch](https://github.com/sschmidTU/mr-kanji-search-wtk/tree/offline) can be used completely offline,<br>
though the kanji information is usually slightly outdated, see the footer in the offline version.

adapted from rtk-search, code by Học hành / Mạnh Tài: https://hochanh.github.io/rtk/index.html <br>
adapted for WK radicals and extra features like copy buttons, compounds, etc.<br>
also, extended dataset: rtk-search only had ~2200 of ~3000 Kanji indexed/searchable by elements, this has 3030+ and constantly growing (also adding new non-RTK kanji)

The website uses [Jekyll](https://jekyllrb.com/)/[Liquid](https://github.com/Shopify/liquid/wiki/Liquid-for-Designers) (scripts) in html, css and js files to generate code/HTML.<br>
The search indexer is [lunr](https://lunrjs.com/).

Contributions and feedback welcome!
