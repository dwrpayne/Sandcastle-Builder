# Sandcastle Builder

xkcd: 1190: Time: The Game

## Credits

Code by Eternal Density (and probably other OTTers)

Graphics likely by GLR and OTTers, when they are added

Parts of code and the clockface image by ChronosDragon.

Icons by ChronosDragon and BlitzGirl.

Inspired by Orteil's Cookie Clicker

Not for any commercial use!

## Changelog

### 0.998
- Missing a kitty delays the next kitty, increasing as you miss more but resetting when you click one or click for sand.
- VITSSÅGEN, JA!
- More tool badges
- Valued Customer and Fractals Forever made harder
- BFJ and FC more expensive
- Exa, Yotta and Zeta postfixes
- More BlitzGirl icons!
- Removed accidental overpowering of BKJ: forgot to remove some code when I reversed how its power works


### 0.997
- New Department Boost: Blixtnedslag Förmögenhet, JA! available after you get Blixtnedslag Kattungar, JA! powered up enough
- Nerfed Cooperation to 5% per bucket pair, rather than 10%. Combined with The Forty it made Cuegan far more powerful than Bags
- BKJ! now decays by 5 for a missed kitty

### 0.996
- Actions now get their own colour rather than being toggles
- New Cuegan boost (finally did The Forty which was suggested ages ago)
- 2 Flag boosts to ninjas

### 0.9952
- Ensure index page loads fresh .js files rather than cached

### 0.9951
- Mustard

### 0.995
- You must understand this line before you can understand it
- No Sell boost. Finally.
- Prevent negative click sand if you sell lots of bags
- BKJ! loses power a little quicker for missed kitties

### 0.994
- Updated version number to 0.993
- No, to 0.994 actually :P
- Added another boost for clicking, this one relating to Bags

### 0.993
- 2 new Bucket boosts!

### 0.992
- Fixed Balancing Act
- NPB Navigation Code now only prevent time-travellers when it's activated
- BKJ! counting logic is flipped around, and loses 1 power when you miss a redacted.

### 0.991
- Changed condition for Fractal Sandcastles, so people who are past the Recursion Period don't have to go back for it
- And a related badge
- Badges for spending a lot
- Boost for Scaffolds and flags
- Fixed Novikov price
- Ch*rpies
- Fixed department crash

### 0.99
- Fixed printing numbers with decimal parts which round up to whole numbers (1.99 should become 2 not 1.100)
- Nerfed Not Lucky a little
- Navigational Code destroys Time-Travelled Bots and prevents more when active
- Fixed incorrect incursion factor calculation
- Maximum 30 Time-Travelled Bots
- No notification if Judgement Dip Bots destroy 0 castles because you have none
- Ensure Judgement Dip level can't be negative
- Double or Nothing decreases in power rather than just dying
- New Boost: Novikov Self-Consistency Principle. Will help Time Travellers against the Bot incursion
- Made *bot Boosts even more expensive because Luggagebot was cheaper than Embaggening
- Nerfed Embaggening to only count Cuegans over 14.
- Fractal Sandcastles: Dug Sand turns into more Castles (incrementally). Also reduces the Blast Furnace Castle Cost
- Badge Not Found
- Another Badge which lets you keep Fractal Sandcastles when you Molpy Down!
- Factored out some boost and badge rendering code for reuse.
- Toggle button to show just the tagged boosts and badges
- Better detection of when to unlock Chromatic Heresy: don't need to add new tagged items to a long OR condition
- Finally decided there's too much stuff in this version to call it 0.983

### 0.982
- Icons for *bot Boosts
- Updated *bot Boosts' descriptions to match long-ago buff
- Rename Washbot to Surfbot because it's more molpish
- Double or Nothing isn't available after 10 locks

### 0.981
- Multiplied *bot Boost sand prices by 10
- Show/Hide Loot subkittegories

### 0.98
- Update Colour Scheme when Molpy Down
- Display correct Judgement Dip level during Coma Molpy Style
- Don't pop up Judgement Dip notifications when it hasn't changed (it thought it had changed because of how CMS changed the numbers)
- Made the boosts available in Judgement Dip only require the boost 2 levels before, rather than the one immediate previous
- (e.g. you only need Minigun for Big Splash to be available in the Department, before you needed Stacked)
- First log entry was repeated at the bottom
- Some layout improvements to fit large numbers better
- Large numbers are shortened: Kilo, Mega, Giga, Tera, Peta for 1,000s, 1,000,000s, 1,000,000,000s, 1,000,000,000,000s, and 1,000,000,000,000,000s
- Stats view shows full length numbers for when you want exact figures
- Huge Buckets now costs '2 Castles' rather than '1 Castles' so I don't have to write a conditional s
- Blixtnedslag Kattungar, JA! (after you buy this, every additional redundakitty will add 1 to the blitzing multiplier)
- Buffed Not Lucky some more
- Wipeout now actually checks if 500 castles have been destroyed by waves rather than 200 wasted.
- New icons! For many purchased boosts (also better Cuegan), by BlitzGirl

### 0.979
- Now anyone can definitely get the leopard badge by entering 'F5' in the right place
- scrumptious donuts

### 0.978
- Added a way for touchscreen-leopard users to type stuff in (or rather, just handled the events for the existing already existing method :P)
- Added a boost to avert Judgement Dip
- Scrumptious Donuts

### 0.977
- A whole raft of new Boosts in the Department, available as Judgement Dip progresses to higher levels

### 0.976
- Added leopard stuff including badge

### 0.975
- Occasional pants

### 0.974
- When loading, hide Redacted to prevent savescumming
- Fixed chromatic CSS for boosts in shop
- New boost for time travellers: Flux Turbine
- Found the Sand Tool sell code didn't do quite what I thought

### 0.973
- Removed some references to old hover stuff
- More buttons
- Added some (not all yet) Boost stats
- Sometimes stats will show some extra info on a boost before you buy it
- Made Precise Placement cost a lot more: I think I never changed it after copypasting
- Heresy

### 0.972
- Judgement Dip notifications logged
- Prevent DON savescumming
- Description hover now works in firefox (probably Safari too, let me know)

### 0.971
- Not Lucky reward general increase, sand tools benefit more than castle tools
- Fixed Ninja Penance not decrementing when used
- Bag Burning Boost: helps fight the NewPixBots
- Totally revamped the hover code
- Half second delay on show description, full second on hide
- That means you can move the mouse over the badges and boosts at a reasonable speed without them popping up

### 0.97
- fixed Dip heresy
- fixed Where is All this coming from boost not unlocking
- made *bot boosts a bit harder to get, more expensive, and locked them all :P
- moved Bot Efficience back to being before Recursivebot
- *bot boosts now also boost their related tool, by 4.
- Judgement Dip triggers reworked
- Judgement Dip destruction now occures only every 50mNP
- Prevent infinite sandcastle gain loop via timetravel
- Prevent free timetravel

### 0.963
- an inoccuous boost rename
- track total castles built wiped by Molpy Down
- fixed tracking highest NP visited (oops, that would have been messing with Time Travel)
- a several new badges, mostly for Time Travel use
- actually increment number of time travels!
- added a way to help finance time travel
- and a time travel boost to help even more!

### 0.962
- 10 NewPixBot boosts
- a Wave boost
- changed how redundakitties are clicked

### 0.961
- Encheapened Embaggening, with refund
- Hide higher end shop items until you buy the cheaper ones

### 0.96
- Even more ChronosDragon icons
- fiddled with a bunch of CSS and a few of the shades on badge headings
- removed [available] and [earned] on badges because they are redundant (and waste space)
- clock visibility is set properly after loading
- added 2 bag boosts

### 0.952
- Fixed 2 typos, one causing weird description, one causing failure to load Factory Automation

### 0.951
- Options visibility toggle had some lines flipped around somehow
- Keep track of number of times time travel is used
- Reset some more stuff on Coma which I forgot to add
- Three new boosts relating to the department and newpixbots

### 0.95
- Ninja forgiveness now uses boost power property so you don't need Hope for Penance to work
- ChronosDragon's epic icons of epicosious treefulosity

### 0.943
- typo: bag->bags
- typo: added missing 'Style' from lyrics
- new boost: kitties galore
- typo: ; being output in notification log

### 0.942
- time delay before descriptions vanish
- links in boost descriptions work
- temp boosts with countdowns will continue updating without descriptions vanishing (until they finish)
- a new boost is finally working! (it may be very handy to some and has a neat easteregg)
- another new boost for those who molpy down
- and a completely new boost to help with ninja stealth when the pix grow long

### 0.9411
- high level sand click badges now bases on sand dug by clicks, not clicks
- this should have been in the previous version but forgot to list it and it didn't work anyway.

### 0.941
- removed some version-specific lock-on-load for badges which were made more expensive long ago
- Overcompensating description fixed, ensure it's 105%
- ensure Erosion can't make Wave's destruction negative
- notificaction/sandnumber text 8 points smaller
- always show option descriptions, refresh them if visible after load/import

### 0.94
- track highest NP visited (doesn't reset with Molpy Down)
- some treeish new boosts - not finished/available yet
- notifications logged to stats page
- took a newline out of the Counter box so there's room for numbers to get big and take up multiple lines
- buffed Erosion so it's relevant if you have Rivers
- Department reward selcection algorithm is more treeish
- buffed the Not Lucky reward
- implemented mrob27's export riverification idea

### 0.936
- export to textfield
- favicon

### 0.935
- gave overcompensating the proper power value when loading old saves

### 0.934
- option for click numbers
- notifications move better

### 0.933
- layout nicification

### 0.932
- padding

### 0.931
- added 2 longpix boosts

- fiddles with some department stuff a little

### 0.93
- sand particles!
- when redacted were supposedly vanishing they weren't actually causing refreshes so they stuck around.

### 0.924:
- badge for experiencing the longpix

### 0.9231:
- disabled having the department activate 100% every redactedreward even when it's not bought

### 0.923:
- bigger buckets x2 sand is now applied BEFORE Helpful Hands, True Colours, and so on
- fixed some reversed logic, a missing return from the random list element function, and a missing .length, so now the Department should work.
- implemented grapevine. Cos it didn't actually do anything before. oops.

### 0.922:
- improved import/export prompt messages

### 0.921:
- upped some prices

### 0.92:
- no longer saving the redacted timing numbers: wasn't necessary
- added some redacted related badges
- added kitnip, which affects redacted timing
- department of redundancy department!
- changed 'Where is this coming from?' to 'Where is all this coming from?'
- when starting, define newpixnumber BEFORE trying to use it to set the ONG date (prevents erroneous ONGs)
- added some boosts for the department and a normal one for click boosting
- price factor stuff
- if export string is over 2000, split into multiple prompts.
- (should replace that entirely, soon. cos it doesn't work on my phone.)

### 0.913
- made temporary boosts system more extensible: counter and power variables are stored in the boost
- fixed incorrect blitzing power: was showing the time for the power
- made setting the css class of redacted items much neater and less chirpy
- temp boost notifications reshow on load with the remaining time
- temp boost countdown display updates when hovered
- prevent any badges from being earned before badges are loaded, to prevent renotifying.

### 0.912
- new boost to show something that already exists

### 0.911
- added new tools
- made True Colours boost unlock later
- moved more stuff into data.js
- new badge

### 0.91
- moved shop items into other js file to enriven the main js file.
- enriven means to make more riverish
- REDACTED=BeanishToCuegish("UmVkdW5kYWtpdHRpZXM=");
- Added REDACTED

### 0.904
- ninja unstealthed notification only appears if you have 1+ stealth
- fixed important logic mustard which was preventing ninja unstealth messages and unlocks on click

### 0.903
- save and load now keeps track of whether NBP have activated so you don't erroneously destealth when clicking

### 0.902
- when loading a save in longpix, ensure the ONG is on whole-hours
- some more ninja related boosts and badges
- destroy and build castles notifications

### 0.901
- demustard, mustard detection
- newpixbot delay stat
- made notification shadow white for light theme

### 0.9
- notifications!
- more badges!

### 0.89
- many sand rate badges and another badge
- 2 click boosts
- added sand per click stat
- renamed sand per click variables because they aren't mouse sand per mNP, duh
- scaffold boost

### 0.88
- colour scheme option!
- added light theme
- tweaked the dark theme a bit

### 0.87
- per tool stats (click stats, then hover over tool)

### 0.86
- fixed minor issue with Erosion (*sigh*) and nerfed it a little
- downgrade jQuery to 10.1.2 for IE users

### 0.8532
- seriously?
- so it wasn't fixing because the variable was Molpy.castlesDestroyed not Molpy.totalCastlesDestroyed.

### 0.8531
- oh.

### 0.853
- found the mustard was using this.totalCastlesDestroyed where 'this' was not valid.
- fixed hopefully all the mustard values

### 0.852
- fixed a castles=NaN mustard (though I still don't know what caused it, HELP!)

### 0.851
- erosion Boost is not applied if you don't have it
- castle tool descriptions have more flavour, build/destroy numbers are autofilled with actual values

### 0.85
- multiplier stat

### 0.84
- time since last save stat

### 0.831
- loading options was mustard all along, breaking autosave after loading.

### 0.83
- stats
- loadcount doesn't increment if no cookie is found on startup (only affects new games and me testing locally :P)
- number of badges earned is actually incremented when loading

### 0.82
- ninja stealth-related stuff only given if you have active newpixbots (if you buy none, no stealth)
- incrementing ninja stealth always gives 1 free castle!
- upgraders get half their current newpix number in castles cos I'm nice
- clock!

### 0.81
- removed autosave. kinda
- added a new badge and boost!

### 0.8
- options button
- AUTOSAVE defaulting to every 10mNP (18 seconds)
- space above descriptions on everything

### 0.73
- refactor so on-buy-item boost unlocks are checked on loading
- fixed Getting Sick of Clicking badge, and unearn if given wrongly
- added redundant badges
- added more ninja badges
- added first ONG price rollback badge
- added wave erosion boost and wipeout badge
- fixed Level Up description: it's for ladders not flags

### 0.721
- fix Ladder mustard

### 0.72
- Kindom - > Kingdom
- litle - > little
- Ninja status display needs to clear
- Glass Factory zeros
- Unearn GF if given wrongfully
- Buff Molpies.
- Buff flags and ladders a little
- Buff Scaffold and wave also
- Make Level Up far more expensive (was missing a zero)
- Add more boosts for Cuegan, Newpixbots, trebuchets
- Boost to give castles when incrementing ninja stealth based on its level

### 0.716
- actually changed the version number

### 0.715
- fixed 2 descriptions

### 0.71
- 2 ladder related boosts
- fixed overflow when newpix is expanded

### 0.7
- badges
- molpies boost gives extra spNP% based on badges
- improved stand tool production formatting
- coma resets badges
- added ninja state to save
