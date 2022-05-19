# WTK-Search

![image](https://user-images.githubusercontent.com/33069673/169421950-992b9e33-b6f6-4197-8e6b-c8003cb49a1d.png)
https://sschmidtu.github.io/mr-kanji-search-wtk/ <br>
WTK-Search is a web-based Kanji search engine for Wanikani radicals or RTK names, using multi-radical search.

## Examples

![image](https://user-images.githubusercontent.com/33069673/99188399-04723480-275c-11eb-89fe-1e953056957a.png)

---

![image](https://user-images.githubusercontent.com/33069673/108462460-ee08d700-727c-11eb-9a0e-9ffc8ba15dfd.png)

---

![image](https://user-images.githubusercontent.com/33069673/99188451-53b86500-275c-11eb-9e16-00d043123529.png)

![image](https://user-images.githubusercontent.com/33069673/99188470-75195100-275c-11eb-8f6f-6e3c4e6d0d13.png)

---
If you use RTK element names, check the *RTK* checkbox:<br>
![image](https://user-images.githubusercontent.com/33069673/99189292-cd525200-2760-11eb-98be-d04f4bf1aa1d.png)

You can 'remember' the RTK option with a link like this: https://sschmidtu.github.io/mr-kanji-search-wtk/?rtk=1

## Instructions

* Enter Wanikani radicals or RTK keywords separated by spaces to search. No need to press enter or click Search.
* If the radical occurs multiple times, you can add the number to its name.
<img src="https://user-images.githubusercontent.com/33069673/165801827-87fecccf-d5dc-4815-897a-99979e842a3a.png" height="250">

* Press the clipboard (:clipboard:) button to copy a Kanji to the clipboard
* If there are no search results, first check for typos and the exact Wanikani radical name.
Then try using other or simpler radicals.
If the radicals were correct, either the kanji is missing info on my end or it doesn’t exist at all in my data (yet!).
You can use traditional methods to find your kanji, like [by handwriting (jisho.org)](https://jisho.org/#handwriting), then tell me and i’ll try to fix/add it.
You can also write me a mail: a link with a mail template will appear on unsuccessful queries.
* Enter one or multiple kanji in the search box to see their name and whether they are findable:
![image](https://user-images.githubusercontent.com/33069673/165802230-95e0640c-139a-4883-86e8-028a1b0941f5.png)
* You can even enter whole sentences (or texts!) to see all the included kanji:
<img src="https://user-images.githubusercontent.com/33069673/165802737-71a0ca08-8e13-4789-95b4-44b1ce7f8f0f.png" height="300">

* The [offline branch](https://github.com/sschmidTU/mr-kanji-search-wtk/tree/offline) can be used completely offline,<br>
though the kanji information is usually slightly outdated, see the footer in the offline version.

## Feedback

If you have suggestions for improvements, if you can't find your Kanji using WK radicals or RTK names, please leave a comment in [the Discussions section](https://github.com/sschmidTU/mr-kanji-search-wtk/discussions/21), [open an issue](https://github.com/sschmidTU/mr-kanji-search-wtk/issues),
or comment on the Wanikani thread:
https://community.wanikani.com/t/multi-radical-kanji-search-web/46781

## Technical Info

adapted from rtk-search, code by Học hành / Mạnh Tài: https://hochanh.github.io/rtk/index.html <br>
adapted for WK radicals and extra features like copy buttons, compounds, etc.<br>
also, extended dataset: rtk-search only had ~2200 of ~3000 Kanji indexed/searchable by elements, this has 3060+ and constantly growing (also adding new non-RTK kanji)

The website uses [Jekyll](https://jekyllrb.com/)/[Liquid](https://github.com/Shopify/liquid/wiki/Liquid-for-Designers) (scripts) in html, css and js files to generate code/HTML.<br>
The search indexer is [lunr](https://lunrjs.com/).

The kanji's elements (radicals) are internally catalogued by the RTK names, which in the end are used for searching. (in WK mode, WK names are converted to RTK names)

Contributions and feedback welcome! (See Discussions or Issues section)
