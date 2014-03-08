Molpy.DefineGUI = function() {
	function InnerMolpify(number, raftcastle, shrinkify) {
		if(isNaN(number)) return 'Mustard';
		if(!isFinite(parseFloat(number))) return 'Infinite';
		if(number < 0) return '-' + InnerMolpify(-number, raftcastle, shrinkify);
		var molp = '';

		if(shrinkify == 2)
			shrinkify = 0;
		else if(Molpy && !shrinkify) shrinkify = !Molpy.options.science;

		if(shrinkify) {
			for( var i in postfixes) {
				var p = postfixes[i];
				if(number >= p.limit) {
					return InnerMolpify(number / p.divisor, raftcastle, 1) + p.postfix[Molpy.options.longpostfix];
				}
			}
		} else {
			if(number == 3) return 'Math.floor(Math.PI)';
			if(number == 4) return 'Math.ceil(Math.PI)';
		}

		if(raftcastle > 0) {
			var numCopy = number;
			//get the right number of decimal places to stick on the end:
			var raft = numCopy * Math.pow(10, raftcastle) - Math.floor(numCopy) * Math.pow(10, raftcastle);
			var sraft = Math.floor(raft) + '';
			if((sraft).length > raftcastle) {
				numCopy++;
				sraft = ''; //rounded decimal part up to 1
			} else if(raft) while(sraft.length < raftcastle) {
				sraft = '0' + sraft; //needs leading zeroes because it's a number like 1.01
			}
			molp = InnerMolpify(numCopy, 0, shrinkify) + (raft ? ('.' + sraft) : ''); //stick them on the end if there are any
		} else {
			number = Math.floor(number);
			//drop the decimal bit
			var sep = (number + '').indexOf('e') == -1; //true if not in exponential notation
			number = (number + '').split('').reverse(); //convert to string, then array of chars, then backwards
			for( var i in number) {
				if(sep && i % 3 == 0 && i > 0) molp = ',' + molp;//stick commas in every 3rd spot but not 0th
				molp = number[i] + molp;
			}
			if(!sep) {
				var dot = molp.indexOf('.') + 1;
				var exp = molp.indexOf('e');
				molp = molp.slice(0, dot) + molp.slice(dot, exp).slice(0, 6) + molp.slice(exp);//truncate after 6 decimal places
			}
		}
		return molp;
	}

	Molpy.IsChildOf = function(child, parent) {
		if(!child) return;
		var current = child;
		while(current = current.parentNode) {
			if(current == parent) return 1;
		}
	}
	
	Molpy.onMouseOver = function(e) {
		// Can add argument later if we want
		// Calls change to $().mouseover({arg1: 1, arg2: 3}, Molpy.onMouseOver)
		// and are referenced thus: e.data.arg1, e.data.arg2
		Molpy.mouseIsOver = e.data.overID;
		if(Molpy.Boosts['Expando'].IsEnabled) return;
		$(this).find('.description').show();
		if(!Molpy.Boosts['Expando'].unlocked) Molpy.UnlockBoost('Expando');
	}
	
	Molpy.onMouseOut = function(e) {
		if(Molpy.mouseIsOver == e.data.overID) Molpy.mouseIsOver = null;
		if(Molpy.Boosts['Expando'].IsEnabled) return;
		$(this).find('.description').hide();
	}

	Molpy.Onhover = function(me, event) {
		if(me.hoverOnCounter > 0 || Molpy.Boosts['Expando'].power) {

			if(me.earned && me.np ) {
				if (Molpy.previewNP != me.np && me.alias.indexOf('monumg') == 0) {
					Molpy.previewNP = me.np;
					Molpy.UpdateBeach(me.np);
				} else 	if(me.alias.indexOf('monums') == 0) {
					g('img-monums' + me.np).style.backgroundImage = Molpy.Url(Molpy.ThumbNewPixFor(Math.abs(me.np)));
				}
			}
			return;
		}
		me.hoverOnCounter = Math.ceil(Molpy.fps / 2);
		me.hoverOffCounter = -1;
	}
	Molpy.Onunhover = function(me, event) {
		if(Molpy.IsChildOf(event.relatedTarget, event.currentTarget)) return;
		me.hoverOffCounter = Math.ceil(Molpy.fps * 1.5);
		me.hoverOnCounter = -1;

		if(me.earned && me.np && Molpy.previewNP == me.np && Molpy.Boosts['Expando'].power
			&& me.alias.indexOf('monumg') == 0) {
			Molpy.previewNP = 0;
			Molpy.UpdateBeach();
		}
	}

	Molpy.ShowhideButton = function(key) {
		return '<input type="Button" value="' + (Molpy.activeLayout.lootVis[key] ? 'Hide' : 'Show') + '" onclick="Molpy.ShowhideToggle(\'' + key + '\')"></input>'
	}
	Molpy.ShowhideToggle = function(key, val) {
		if(val == undefined) {
			Molpy.activeLayout.lootVis[key] = !Molpy.activeLayout.lootVis[key];
		} else {
			Molpy.activeLayout.lootVis[key] = val == true;
		}
		if(Molpy.activeLayout.lootVis[key]) {
			if(key == 'tagged') {
				for( var k in Molpy.activeLayout.lootVis) {
					Molpy.activeLayout.lootVis[k] = k == key; //when showing tagged, hide all others
				}
			} else {
				Molpy.activeLayout.lootVis.tagged = 0; //hide tagged when showing anything else
			}
		}
		Molpy.lootNeedRepaint = 1;
	}
	Molpy.ShowGroup = function(group, tagged) {
		if(Molpy.redactedDrawType[Molpy.redactedDrawType.length - 1] != 'hide1') {
			if(!Molpy.activeLayout.lootVis[group]) {
				if(tagged) {
					if(!Molpy.activeLayout.lootVis.tagged) {
						Molpy.ShowhideToggle('tagged');
					}
				} else {
					Molpy.ShowhideToggle(group);
				}
			}
		}
	}

	Molpy.priceComparisons = ['GlassBlocks', 'Sand', 'Castles'];
	Molpy.NameSort = function(a, b) {
		var n1 = a.name;
		var n2 = b.name;
		return n1 > n2;
	}
	Molpy.PriceSort = function(a, b) {
		var p1 = a.CalcPrice(a.price);
		var p2 = b.CalcPrice(b.price);
		for( var i in Molpy.priceComparisons) {
			var stuff = Molpy.priceComparisons[i];
			var s1 = p1[stuff] || 0;
			var s2 = p2[stuff] || 0;
			if(s1 > s2)
				return 1;
			else if(s1 < s2) return -1;
		}
		return a.name > b.name;
	}
	Molpy.ClassNameSort = function(a, b) {
		var at = a.className || 'z';
		var bt = b.className || 'z';
		var ag = a.group;
		var bg = b.group;
		var an = a.name;
		var bn = b.name
		if(at > bt)
			return 1;
		else if(at < bt)
			return -1;
		else if(ag > bg)
			return 1;
		else if(ag < bg)
			return -1;
		else if(an > bn)
			return 1;
		else if(an < bn)
			return -1;
		else
			return 0;
	}
	Molpy.FormatPrice = function(monies, item) {
		return Molpify(Math.floor(EvalMaybeFunction(monies, item, 1) * Molpy.priceFactor), 1);
	}

	Molpy.ToggleView = function(name, val) {
		if(!name) return;
		var sh = Molpy.activeLayout.boxVis;
		if(val == undefined) {
			sh[name] = !sh[name];
		} else {
			sh[name] = val == true;//ensure boolean for jQuery
		}
		$('#' + 'section' + name).toggleClass('hidden', !sh[name]);
		$('#toggle' + name).toggleClass('depressed', sh[name]);
		if(name == 'Export')
			$('.exportButton').toggleClass('depressed', sh[name]);
		if(sh[name]) {
			var refresh = Molpy['Refresh' + name];
			if(refresh) refresh();
		} else {
			var cleanup = Molpy['Cleanup' + name];
			if(cleanup) cleanup();
		}
	}

	Molpy.selectedFave = 'None';
	Molpy.SelectFave = function(f) {
		Molpy.selectedFave = f.options[f.selectedIndex].value;
		$('#faveControls').toggleClass('hidden', Molpy.selectedFave == 'None');
		$('#toggleFave').toggleClass('depressed', Molpy.activeLayout.faves[Molpy.selectedFave].vis == true);
	}

	Molpy.ConfigureFave = function(n) {
		if(n == undefined) n = Molpy.selectedFave;
		var f = Molpy.activeLayout.faves[n];
		var def = 'Chromatic Heresy';
		if(f.boost) def = f.boost.name;
		var name = prompt('Enter the name of the boost or badge you wish to display as Favourite ' + n + '.\nNames are case sensitive.\nLeave blank to disable.', def);

		if(name == undefined) return;
		if(name) {
			item = Molpy.Boosts[name];
			if(!item) {
				item = Molpy.Boosts[Molpy.BoostAKA[name]];
			}
			if(!item) {
				item = Molpy.Badges[name];
			}
			if(!item) {
				item = Molpy.Badges[Molpy.BadgeAKA[name]];
			}
			if(item) {
				if(!(item.bought || item.earned)) {
					Molpy.Notify('You do not own ' + item.name);
				} else {
					f.boost = item;
					Molpy.Notify('You have chosen ' + item.name + ' as Favourite ' + n, 1);
					Molpy.UnlockBoost('Sand');
					Molpy.UnlockBoost('Castles');
				}
			}
		} else {
			f.boost = 0;
		}
		f.BoostToScreen();
	}

	Molpy.ToggleFave = function(n, val) {
		if(n == undefined) n = Molpy.selectedFave;

		var name = 'sectionFave' + n;
		var f = Molpy.activeLayout.faves;
		if(val == undefined) {
			f[n].vis = !f[n].vis;
		} else {
			f[n].vis = val == true;//ensure boolean for jQuery
		}
		if(f[n].vis && f[n].boost) f[n].boost.Refresh();
		$('#' + name).toggleClass('hidden', !f[n].vis);
		$('#toggleFave').toggleClass('depressed', f[n].vis);
	}

	Molpy.ToggleViews = function(views) {
		var primary = views[0];
		var vis = Molpy.activeLayout.boxVis;
		Molpy.ToggleView(primary);
		if(vis[primary]) {
			for( var i in views) {
				if(+i) Molpy.ToggleView(views[i], false);
			}
		} else {
			Molpy.ToggleView(views[1], true);
		}
	}

	Molpy.RefreshStats = function() {
		if(!Molpy.molpish) return;
		Molpy.EarnBadge('Far End of the Bell Curve');
		Molpy.allNeedRepaint = 1;
		Molpy.UpdateFaves(1);
	}
	Molpy.CleanupStats = Molpy.RefreshStats;

	Molpy.RefreshExport = function() {
		if(!Molpy.molpish) return;
		_gaq && _gaq.push(['_trackEvent', 'Export', 'Begin']);
		var threads = Molpy.ToNeedlePulledThing();
		_gaq && _gaq.push(['_trackEvent', 'Export', 'Complete']);
		var thread = '';
		for( var i in threads) {
			thread += threads[i]
		}
		g('exporttext').value = Molpy.CuegishToBeanish(thread);
	}
	Molpy.RefreshLayouts = function() {
		if(!Molpy.molpish) return;
		Molpy.layoutNeedRepaint = 1;
	}
	Molpy.RefreshQuickLayout = Molpy.RefreshLayouts;

	Molpy.UpdateColourScheme = function() {
		var heresy = '';
		if(g('game')) {
			if(Molpy.Got('Chromatic Heresy') && Molpy.Boosts['Chromatic Heresy'].power > 0) {
				heresy = ' heresy'
			}
			Molpy.UpdateBeach();
		}

		if(Molpy.options.colourscheme) {
			document.body.className = 'lightscheme' + heresy;
		} else {
			document.body.className = 'darkscheme' + heresy;
		}
	}

	Molpy.AdjustFade = function() {
		var val = '';
		if(Molpy.options.fade) {
			for( var i in fadeProps) {
				if(+i) val += ', ';
				val += fadeProps[i] + ' ' + Molpy.options.fade / 2 + 's ease-out';
			}
		}
		var fc = $(fadeClasses);
		for( var j in vendors)
			fc.css(vendors[j] + 'transition', val);

		if(Molpy.options.fade) {
			val = ',background-image ' + Molpy.options.fade / 2 + 's ease-out';
		}
		var fc = $('#beach');
		for( var j in vendors)
			fc.css(vendors[j] + 'transition', 'opacity 0.1s ease-out,' + vendors[j] + 'transform 0.1s ease-out' + val);
	}

	if(!g('game')) {
		Molpy.Load();
		if(g('indexversion')) {
			g('indexversion').innerHTML = 'The Game of Time. Version ' + Molpy.version;
		} else {
			Molpy.StartIdle = function() {
				if(!Molpy.supportsLocalStorage) {
					g('idlescore').innerHTML = 'localstorage not supported';
					return;
				}
				var score = parseFloat(localStorage['idlescore']) || 0;
				var prestige = parseFloat(localStorage['idleprestige']) || 0;
				if(!Molpy.forcedReload) {
					prestige += score;
					score = 0;
				}
				g('idlescore').innerHTML = 'Score: ' + Molpify(score, 3);
				g('idleprestige').innerHTML = 'Prestige: ' + Molpify(prestige, 3);
				localStorage['idlescore'] = score;
				localStorage['idleprestige'] = prestige;
				setTimeout(Molpy.Idle, 1000);
			}
			Molpy.Idle = function() {
				var score = parseFloat(localStorage['idlescore']) || 0;
				var prestige = parseFloat(localStorage['idleprestige']) || 0;
				inc = 1 + Math.max(0, Math.floor(Math.log(prestige) * Math.LOG2E));
				score += inc;
				g('idlescore').innerHTML = 'Score: ' + Molpify(score, 3);
				localStorage['idlescore'] = score;
				if(score % 1000 == 0) _gaq && _gaq.push(['_trackEvent', 'PureIdle', 'Milestone', '' + score]);
				setTimeout(Molpy.Idle, 1000);
			}
		}
		return;
	}

	createClockHand();

	var fadeClasses = 'body , .floatbox , .lootbox , .minifloatbox , .floatsquare , .infobox , .icon , .descshow , .deschide , .badge.shop h1, #toolSTitle, #toolCTitle, #boostTitle';
	var vendors = ['-webkit-', '-moz-', '-o-', '-ms-', ''];
	var fadeProps = ['color', 'border-color', 'background-color', 'background-image'];

	Molpy.unlockedGroups = {};
	Molpy.PaintLootToggle = function(gr, kind) {
		var str = '';
		if(Molpy.unlockedGroups[gr]) {
			var type = kind == 4 ? 'boost' : 'badge';
			var id = Molpy.groupNames[gr][2] || '';
			if(id) id = ' id="' + id + '"';
			var r = (Molpy.redactedVisible == kind && Molpy.redactedGr == gr);
			if(r) id = '';
			str += '<div class="floatsquare loot ' + (r ? 'redacted-area ' : '') + type + '"><h3>' + Molpy.groupNames[gr][1]
				+ '</h3><br>' + Molpy.ShowhideButton(gr) + '<div class="icon' + (r ? ' redacted"' : '"') + id + '></div></div>';
		}
		return str;
	}
	
	Molpy.RepaintLootSelection = function() {
		var str = '';
		var groups = ['boosts', 'stuff', 'land', 'ninj', 'cyb', 'hpt', 'bean', 'chron', 'ceil', 'drac', 'prize'];
		for( var i in groups) {
			str += Molpy.PaintLootToggle(groups[i], 4);
		}
		if(Molpy.BadgesOwned) {
			var r = Molpy.redactedVisible == 5 && Molpy.redactedGr == 'badges';
			str += '<div class="floatsquare badge loot' + (r ? ' redacted-area' : '') + '"><h3>Badges<br>Earned</h3>'
				+ Molpy.ShowhideButton('badges') + '<div class="icon ' + (r ? 'redacted' : '') + '"></div></div>';
		}
		var groups = ['discov', 'monums', 'monumg', 'diamm'];
		for( var i in groups) {
			str += Molpy.PaintLootToggle(groups[i], 5);
		}
		if(Molpy.BadgeN - Molpy.BadgesOwned) {
			var r = Molpy.redactedVisible == 6;
			str += '<div class="floatsquare badge shop' + (r ? ' redacted-area' : '') + '"><h3>Badges<br>Available</h3>'
				+ Molpy.ShowhideButton('badgesav') + '<div class="icon ' + (r ? 'redacted' : '') + '"></div></div>';
		}
		if(Molpy.Boosts['Chromatic Heresy'].unlocked) {
			str += '<div class="floatsquare boost loot alert"><h3>Tagged<br>Items</h3>' + Molpy.ShowhideButton('tagged')
				+ '<div id="tagged" class="icon ' + (Molpy.redactedVisible == 7 ? 'redacted' : '') + '"></div></div>';
		}

		g('lootselection').innerHTML = str;
	}

	Molpy.redactedDiv = null;
	Molpy.redactedW = Molpy.BeanishToCuegish("UmVkdW5kYW50");
	Molpy.redactedWord = Molpy.BeanishToCuegish("UmVkdW5kYWtpdHR5");
	Molpy.redactedWords = Molpy.BeanishToCuegish("UmVkdW5kYWtpdHRpZXM=");
	Molpy.redactedBrackets = Molpy.BeanishToCuegish("JTI1NUJyZWR1bmRhbnQlMjU1RA==");
	Molpy.redactedSpoilerValue = Molpy.BeanishToCuegish("JTI1M0NpZnJhbWUlMjUyMHNyYyUyNTNEJTI1MjJodHRwJTI1M0ElMjUyRiUyNTJGd3d3LnlvdXR1YmUuY29tJTI1MkZlbWJlZCUyNTJGYkJ5ZWNDRDR0SjAlMjUzRmF1dG9wbGF5JTI1M0QxJTI1MjIlMjUyMHdpZHRoJTI1M0QlMjUyMjEwMCUyNTIyJTI1MjBoZWlnaHQlMjUzRCUyNTIyNjglMjUyMiUyNTIwZnJhbWVib3JkZXIlMjUzRCUyNTIyMCUyNTIyJTI1MjBhbGxvd2Z1bGxzY3JlZW4lMjUzRSUyNTNDJTI1MkZpZnJhbWUlMjUzRQ==");
	Molpy.redactedDrawType = [];
	Molpy.redactedDivList = {
			1: $('#sandtools'),
			2: $('#castletools'),
			3: $('#boosts'),
			4: $('#loot'), // in a boost group
			5: $('#loot'), // in a badge  group
			6: $('#loot'), // in badges available
			7: $('#loot')}; // in tagged list
	Molpy.redactedTitleList = {
			1: $('#toolSTitle'),
			2: $('#toolCTitle'),
			3: $('#boostTitle'),
			4: $('#lootTitle'),
			5: $('#lootTitle'),
			6: $('#lootTitle'),
			7: $('#lootTitle')};
	
	Molpy.RedactedHTML = function(heading, level) {
		level = level || 0;
		var drawType = Molpy.redactedDrawType[level];
		var spoiler = '';
		var label = 'Hide';
		if(drawType == 'show') label = 'Show';
		heading = heading ? '<h1>' + Molpy.redactedBrackets + '</h1>' : '';
		var countdown = (level == 0 ? '&nbsp;<span id="redactedcountdown" class="faded">' + Molpify(Molpy.redactedToggle - Molpy.redactedCountup) + '</span>' : '');
		var str = '<div id="redacteditem">' + heading + '<div class="icon redacted"></div><h2">' + Molpy.redactedWord
			+ countdown + '</h2><div><b>Spoiler:</b><input type="button" value="' + label + '" onclick="Molpy.ClickRedacted(' + level + ')"</input>';
		if(drawType == 'recur') {
			str += Molpy.RedactedHTML(heading, level + 1);
		} else if(drawType == 'hide1') {
			str += Molpy.redactedSpoilerValue;
		} else if(drawType == 'hide2') {
			str += Molpy.PuzzleGens.redacted.StringifyStatements();
		}

		return str + '</div></div>';
	}
	
	Molpy.getRedactedDiv = function(heading, level, forceNew) {
		if(!Molpy.redactedDiv || forceNew)
			if(forceNew)
				Molpy.redactedDiv.remove();
			Molpy.redactedDiv = $(Molpy.RedactedHTML(heading, level));
		
		return Molpy.redactedDiv;
	}
	
	Molpy.removeGroupFromDispObjectsCategory = function(group, category) {
		for(var i in group) {
			var thing = group[i];
			var index = $.inArray(Molpy.dispObjects[category], thing);
			if(index > -1) {
				Molpy.removeDiv(thing);
				Molpy.dispObjects[category].splice(index, 1);
			}
		}
	}
	

	Molpy.removeAllObjectDivs = function() {
		for(var i in Molpy.SandTool)
			Molpy.removeDiv(Molpy.SandTool[i]);
		for(var i in Molpy.CastleTool)
			Molpy.removeDiv(Molpy.CastleTool[i]);
		for(var i in Molpy.Boosts)
			Molpy.removeDiv(Molpy.Boosts[i]);
		for(var i in Molpy.Badges)
			Molpy.removeDiv(Molpy.Badges[i]);
	}
	
	Molpy.removeAllDisplayedDivs = function() {
		for(var grp in Molpy.dispObjects) {
			Molpy.removeGroupDivs(Molpy.dispObjects[grp]);
		}
	}
	
	Molpy.removeGroupDivs = function(group) {
		for(var obj in group) {
			Molpy.removeDiv(group[obj]);
		}
	}
	
	Molpy.removeDiv = function(object) {
		if(object.hasDiv()) {
			object.divElement.remove();
			object.divElement = null;
		}
	}
	
	Molpy.repaintAll = function() {
		Molpy.allNeedRepaint = 0;
	 	Molpy.CalcPriceFactor();
	 	Molpy.repaintLoot();
	 	Molpy.repaintShop();
	 	Molpy.repaintTools();
	 	Moply.repaintFaves();
	}
	
	
	Molpy.repaintLoot = function() {
		Molpy.lootNeedRepaint = 0;
		
		//clear out all the old loot stuff
		Molpy.removeGroupDivs(Molpy.dispObjects.boosts);
		Molpy.removeGroupDivs(Molpy.dispObjects.badges);
		Molpy.removeGroupDivs(Molpy.dispObjects.tagged);
		Molpy.dispObjects.boosts = [];
		Molpy.dispObjects.badges = [];
		Molpy.dispObjects.tagged = [];
		
		var taggedList = [];
		
		// Setup Boost list for use
		var boostList = [];
		for(var i in Molpy.Boosts) {
			var me = Molpy.Boosts[i];
			if(me.bought && Molpy.activeLayout.lootVis[me.group]) boostList.push(me);
			if(me.bought && me.className) taggedList.push(me);
		}
		
		if(Molpy.options.boostsort > 0)
			boostList.sort(Molpy.NameSort);
		else
			boostList.sort(Molpy.PriceSort);
		
		// Setup Badge list for use
		var badgeList = [];
		var badgeAvList = [];
		var monumentList = [];
		for( var i in Molpy.Badges) {
			var me = Molpy.Badges[i];
			// Badges Available are a special case
			if(!me.earned && me.group == 'badges' && Molpy.activeLayout.lootVis.badgesav)
				badgeAvList.push(me);
			else if(me.earned){
				if(Molpy.activeLayout.lootVis[me.group]) {
					if(me.group == 'badges')
						badgeList.push(me);
					// Do the discvoery/monument checks explicity just in case other badge types are added later
					if(me.group == 'discov'
					   || me.group == 'monums'
					   || me.group == 'monumg'
					   || me.group == 'diamm')
						monumentList.push(me);
				}
				if(me.className) taggedList.push(me);
			}
		}
		
		//repack it all into a single sorted Badge List
		badgeList = badgeList.concat(badgeAvList, monumentList);
		
		//TODO somewhere here is where pagnation and filtering type stuff would probably go
		
		if(Molpy.activeLayout.lootVis.tagged)
			Molpy.addGroupToDiv($('#loot'), taggedList, taggedList.length - 1, 'tagged', {autoAdd: true, recalc: false});
		else {
			Molpy.addGroupToDiv($('#loot'), boostList, boostList.length - 1, 'boosts', {autoAdd: true, recalc: false});
			Molpy.addGroupToDiv($('#loot'), badgeList, badgeList.length - 1, 'badges', {autoAdd: true, recalc: false});
		}
		
		Molpy.UnlockBoost('Chromatic Heresy');
	}
	

	Molpy.repaintShop = function() {
		Molpy.shopNeedRepaint = 0;
		
		Molpy.removeGroupDivs(Molpy.dispObjects.shop);
		Molpy.dispObjects.shop = [];

		var shopList = [];
		for( var i in Molpy.Boosts) {
			var boost = Molpy.Boosts[i];
			if(!boost.bought && boost.unlocked) shopList.push(boost);
		}
	
		if(Molpy.options.boostsort > 0)
			shopList.sort(Molpy.NameSort);
		else
			shopList.sort(Molpy.PriceSort);
		
		Molpy.addGroupToDiv($('#boosts'), shopList, shopList.length - 1, 'shop', {autoAdd: true, recalc: true});
	}
	
	Molpy.repaintTools = function(args) {
		if(!args) args = {};
		Molpy.toolsNeedRepaint = 0;
		
		Molpy.removeGroupDivs(Molpy.dispObjects.tools);
		Molpy.dispObjects.tools = [];
		
		Molpy.CalcPriceFactor();
		
		Molpy.repaintSandTools({skipClear: true, recalc: false});
		Molpy.repaintCastleTools({skipClear: true, recalc: false});
	}
	
	Molpy.repaintSandTools = function(args) {
		if(!args) args = {};
		Molpy.sandToolsNeedRepaint = 0;
		
		// Remove all Sand Tools from dispObjects for a fresh start
		if(!args.skipClear) {
			Molpy.removeGroupFromDispObjectsCategory(Molpy.SandTools, 'tools');
		}
		
		var toolsUnlocked = 1;
		for(var i in Molpy.SandToolsById){
			if(Molpy.SandToolsById[i].bought >= Molpy.SandToolsById[i].nextThreshold) toolsUnlocked ++;	
		}
		var max = Math.min(toolsUnlocked -1 , Molpy.SandToolsN - 1);
		
		var dorecalc = args.recalc == false ? false : true;
		Molpy.addGroupToDiv($('#sandtools'), Molpy.SandToolsById, max, 'tools', {autoAdd: true, recalc: dorecalc});
	}
	
	Molpy.repaintCastleTools = function(args) {
		if(!args) args = {};
		Molpy.castleToolsNeedRepaint = 0;
		
		// Remove all Castle Tools from dispObjects for a fresh start
		if(!args.skipClear) {
			Molpy.removeGroupFromDispObjectsCategory(Molpy.CastleTools, 'tools');
		}
		
		var toolsUnlocked = 1;
		for(var i in Molpy.CastleToolsById){
			if(Molpy.CastleToolsById[i].bought >= Molpy.CastleToolsById[i].nextThreshold) toolsUnlocked ++;	
		}
		var max = Math.min(toolsUnlocked - 1, Molpy.CastleToolsN - 1);
		
		var dorecalc = args.recalc == false ? false : true;
		Molpy.addGroupToDiv($('#castletools'), Molpy.CastleToolsById, max, 'tools', {autoAdd: true, recalc: dorecalc});
	}
	
	Molpy.repaintBoosts = function() {
		Molpy.boostNeedRepaint = 0;
		Molpy.badgesNeedRepaint = 0; // This includes all badge calls
		Molpy.repaintShop();
		Molpy.repaintLoot();
		Molpy.repaintFaves();
	}
	
	Molpy.repaintBadges = function() {
		Molpy.badgeNeedRepaint = 0;
		Molpy.repaintLoot();
		Molpy.repaintFaves();
	}
	
	Molpy.repaintFaves = function() {
		Molpy.favesNeedRepaint = 0;
		//Molpy.dispObjects.faves = [];
	}
	
	Molpy.repaintRedacted = function() {
		if(Molpy.redactedVisible == 0) return; // Don't repaint because redacted is not active
		
		var redDiv = Molpy.redactedDivList[Molpy.redactedVisible];
		
		// Make sure the div is an open one, if not, re jump and set it again
		if(!redDiv.is(':visible')) {
			Molpy.RedactedJump();
			if(Molpy.redactedVisible == 0) return; // No available spots to spawn
			redDiv = Molpy.redactedDivList[Molpy.redactedVisible];
		}
		
		// If a position is invalid, get a random new position
		if(Molpy.redactedViewIndex == -1 || Molpy.redactedViewIndex > (redDiv.size() + 1)) {
			var maxPos = redDiv.size() + 1;
			Molpy.redactedViewIndex = Math.floor(maxPos * Math.random());
		}
		
		Molpy.redactedTitleList[Molpy.redactedVisible].toggleClass('redacted-area', true);
		
		if(Molpy.redactedViewIndex == 0)
			redDiv.prepend(Molpy.getRedactedDiv());
		else if(Molpy.redactedViewIndex > redDiv.size())
			redDiv.append(Molpy.getRedactedDiv());
		else
			redDiv.find(':nth-child(' + Molpy.redactedViewIndex + ')').before(Molpy.getRedactedDiv());	
	}
	
	Molpy.removeRedacted = function() {
		Molpy.redactedDiv.remove();
		Molpy.redactedDiv = null;
		Molpy.redactedTitleList[Molpy.redactedVisible].toggleClass('redacted-area', false);
	}
	
	Molpy.addGroupToDiv = function(whichDiv, group, maxIndex, dispCat, args) {
		if(!args) args = {};
		if(args.recalc) Molpy.CalcPriceFactor();
		
		var fnew = args.forceNew || true;
		var addHover = args.hover || true;
		
		var i = 0;	
		while(i <= maxIndex) {
			var nh = false;
			var object = group[i];
			
			// If mouse is currently hovering over this, it will start hovered
			var overID = '' + object.name + object.id;
			if(Molpy.mouseIsOver == overID) nh = true;
			
			whichDiv.append(object.getDiv({forceNew: fnew, hover: addHover, nohide: nh}));
			
			if(args.autoAdd) {
				var suc = Molpy.dispObjects[dispCat].push(object);
			} else {
				if($.inArray(Molpy.dispObjects[dispCat], object) == -1) Molpy.dispObjects[dispCat].push(object);
			}
			
			i ++;
		}
		
		//Molpy.repaintRedacted();
	}
	
	Molpy.updateShop = function() {
		for(var i in dispObjects.shop)
			dispObjects.shop[i].updateAll();
	}
	
	Molpy.updateTools = function() {
		for(var i in dispObjects.tools)
			dispObjects.tools[i].updateAll();
	}
	
	Molpy.updateLoot = function() {
		for(var grp in dispObjects)
			if(grp != 'boosts' || grp != 'tagged') continue;
			for(var i in dispObject[grp])
				dispObjects[grp][i].updateAll();
	}
	
	Molpy.updateBoosts = function() {
		for(var grp in dispObjects)
			if(grp != 'boosts' || grp != 'tagged' || grp != 'faves') continue;
			for(var i in dispObject[grp])
				dispObjects[grp][i].updateAll();
	}

	//TODO move mustard tool badge check to achronal dragon and mustard sale, perhaps somewhere else
	// was in RepaintShop before
		//if(Molpy.mustardTools == 12) {
		//	Molpy.EarnBadge('Mustard Tools');
		//}
	
	//the numbers that fly up when you click the pic for sand
	Molpy.sParticles = [];
	var str = '';
	for( var i = 0; i < 20; i++) {
		Molpy.sParticles[i] = {
			x: 0,
			y: 0,
			dx: 0,
			life: -1,
			text: ''
		};
		str += '<div id="sparticle' + i + '" class="notif"></div>';
	}
	g('sparticles').innerHTML = str;
	Molpy.sparticlesUpdate = function() {
		for( var i in Molpy.sParticles) {
			var me = Molpy.sParticles[i];
			if(me.life != -1) {

				me.y -= 300 / Molpy.fps;
				me.x += me.dx / Molpy.fps;

				me.life++;
				var el = me.l;
				me.l.style.left = Math.floor(me.x) + 'px';
				me.l.style.top = Math.floor(me.y) + 'px';
				el.style.opacity = 1;//-(me.life/(Molpy.fps*2));
				if(me.life >= Molpy.fps * 2) {
					me.life = -1;
					el.style.opacity = 0;
					el.style.display = 'none';
				}
			}
		}
	}

	Molpy.LayoutString = function(i) {
		var me = Molpy.layouts[i];
		var h = '<h1>' + me.name + '</h1>';
		var str = '<div class="layout minifloatbox">' + h;
		str += '<div class="minifloatbox layoutcontrol' + (me == Molpy.activeLayout ? ' depressed' : '') + '"><a onclick="Molpy.layouts[' + i + '].Activate()">Activate</a></div>';
		str += '<div class="minifloatbox layoutcontrol"><a onclick="Molpy.layouts[' + i + '].Rename()">Rename</a></div>';
		str += '<div class="minifloatbox layoutcontrol"><a onclick="Molpy.layouts[' + i + '].Clone()">Clone</a></div>';
		str += '<div class="minifloatbox layoutcontrol"><a onclick="Molpy.layouts[' + i + '].Overwrite()">Overwrite</a></div>';
		str += '<div class="minifloatbox layoutcontrol exportButton"><a onclick="Molpy.layouts[' + i + '].Export()">Export</a></div>';
		if(me != Molpy.activeLayout)
			str += '<div class="minifloatbox layoutcontrol"><a onclick="Molpy.layouts[' + i + '].Delete()">Delete</a></div>';

		return str + '</div>';
	}
	Molpy.RepaintLayouts = function() {
		Molpy.layoutNeedRepaint = 0;
		if(noLayout) return;
		if(Molpy.activeLayout.boxVis['Layouts']) {
			var str = '';
			for( var i in Molpy.layouts) {
				str += Molpy.LayoutString(i);
			}
			g('layouts').innerHTML = str;
		}
		if(Molpy.activeLayout.boxVis['QuickLayout']) {
			var str = '';
			for( var i in Molpy.layouts) {
				var me = Molpy.layouts[i];
				str += '<div class="minifloatbox layoutcontrol' + (me === Molpy.activeLayout ? ' depressed' : '')
					+ '"><a onclick="Molpy.layouts[' + i + '].Activate()">' + me.name + '</a></div>'
			}
			g('quickLayouts').innerHTML = str;
		}
	}

	Molpy.AddSandParticle = function(text) {
		//pick the first free (or the oldest) notification to replace it
		var highest = 0;
		var highestI = 0;
		for( var i in Molpy.sParticles) {
			if(Molpy.sParticles[i].life == -1) {
				highestI = i;
				break;
			}
			if(Molpy.sParticles[i].life > highest) {
				highest = Molpy.sParticles[i].life;
				highestI = i;
			}
		}
		var i = highestI;

		var rect = g('beach').getBoundingClientRect();
		var x = 0;
		var y = Math.floor((rect.height) * .7);
		x += (Math.random() - 0.5) * 180;
		y += (Math.random() - 0.5) * 120;
		var dx = (Math.random() - 0.5) * 60;

		var me = Molpy.sParticles[i];
		if(!me.l) me.l = g('sparticle' + i);
		me.life = 0;
		me.x = x;
		me.y = y;
		me.dx = dx;
		me.text = text;
		me.l.innerHTML = text;
		me.l.style.left = Math.floor(me.x) + 'px';
		me.l.style.top = Math.floor(me.y) + 'px';
		me.l.style.display = 'block';
	}

	//notifications.
	Molpy.notifs = [];
	Molpy.notifsY = 0;
	var str = '';
	for( var i = 0; i < 20; i++) {
		Molpy.notifs[i] = {
			x: 0,
			y: 0,
			life: -1,
			text: ''
		};
		str += '<div id="notif' + i + '" class="notif"></div>';
	}
	g('notifs').innerHTML = str;
	Molpy.notifsReceived = 0;
	Molpy.notifsUpdate = function() {
		Molpy.notifsY = 0;
		var trans = 0;
		for( var i in Molpy.notifs) {
			var me = Molpy.notifs[i];
			if(me.life != -1) {
				if(me.life < Molpy.fps * 3) Molpy.notifsY += me.l.clientHeight;

				var y = me.y;
				if(me.life < Molpy.fps / 2) {
					y -= 10;
				} else {
					y -= 10 * (1 - (me.life - Molpy.fps / 2) / (Molpy.fps * 5));
				}
				me.y = y;
				me.life++;
				var el = me.l;
				el.style.left = Math.floor(-200 + me.x) + 'px';
				el.style.bottom = Math.floor(-y) + 'px';
				if(trans < 9) {
					el.style.opacity = 1 - Math.pow(me.life / (Molpy.fps * 5), 2);
					trans++;
				} else {
					el.style.opacity = 1;
				}
				if(me.life >= Molpy.fps * 5) {
					me.life = -1;
					el.style.opacity = 0;
					el.style.display = 'none';
				}
			}
		}
	}
	
	LogEntry = function() {
		this.text="";
		this.qty=0;
		this.getLine = function()  {
			str = "<div ";
			if (this.details!="")
				str += "title=\"&#13;"+this.details.replace(/"/g, "&quot;") + "\"";
			if (this.clas != "")
				str += "class=\"" + this.clas
			str +=  "\">" + this.text;
			if (this.qty>1)
				str += ' (x'+this.qty+')';
			str += '</div>';
			return str; 
		}
		this.details="";
		this.clas="";
	};
	
	Molpy.ClearLog = function() {
		Molpy.logArchive = [];
		Molpy.logArchive[0] = [];
		Molpy.logArchive[0].np = Molpy.newpixNumber;
		Molpy.logArchive[0].time = new Date();
		Molpy.logArchive[0].string = "Loading..."
		Molpy.currentLog = 0;
		Molpy.selectedLog = 0;
		Molpy.notifLog = new LogEntry();
		Molpy.logBuffer = ""
		Molpy.notifLogPaint = 1;
		Molpy.logUpdatePaint = 0;
	}
	Molpy.ClearLog();
	Molpy.InMyPants = 0;
	
	Molpy.LogONG = function(){
		Molpy.currentLog++;
		Molpy.logArchive[Molpy.currentLog] = [];
		Molpy.logArchive[Molpy.currentLog].np = Molpy.newpixNumber;
		Molpy.logArchive[Molpy.currentLog].time = new Date();
		Molpy.selectedLog = Molpy.currentLog;
		Molpy.logArchive[Molpy.currentLog].string = ""
		Molpy.notifLogPaint = 1;
	}
	
	Molpy.LogBack = function(){
		if (Molpy.selectedLog > 0){
			Molpy.selectedLog--;
			Molpy.notifLogPaint = 1;
		}
	}
	
	Molpy.LogForward = function(){
		if (Molpy.selectedLog < Molpy.currentLog){
			Molpy.selectedLog++;
			Molpy.notifLogPaint = 1;
			if (Molpy.selectedLog == Molpy.currentLog) g('logCurrent').value="Current";
		}
	}
	
	Molpy.LogCurrent = function(){
		if (Molpy.selectedLog != Molpy.currentLog){
			Molpy.selectedLog = Molpy.currentLog;
			Molpy.notifLogPaint = 1;
		} else {
			var log = g('logItems');
			log.scrollTop = log.scrollHeight;
		}
		g('logCurrent').value="Current";
	}
	
	Molpy.Notify = function(text, log, clas, title, details) {
		if(Molpy.InMyPants) text += ' in my pants';
		text = format(text);
		//pick the first free (or the oldest) notification to replace it
		var highest = 0;
		var highestI = 0;
		for( var i in Molpy.notifs) {
			if(Molpy.notifs[i].life == -1) {
				highestI = i;
				break;
			}
			if(Molpy.notifs[i].life > highest) {
				highest = Molpy.notifs[i].life;
				highestI = i;
			}
		}
		var i = highestI;

		var x = Math.floor($(window).width() / 2);
		var y = Math.floor($(window).height() * 0.95);
		x += (Math.random() - 0.5) * 40;

		var me = Molpy.notifs[i];
		if(!me.l) me.l = g('notif' + i);
		me.life = 0;
		me.x = x;
		me.y = y + Molpy.notifsY;
		me.text = text;
		me.l.innerHTML = text;
		me.l.style.left = Math.floor(Molpy.notifs[i].x - 200) + 'px';
		me.l.style.bottom = Math.floor(-Molpy.notifs[i].y) + 'px';
		me.l.style.display = 'block';
		Molpy.notifsY += me.l.clientHeight;
		me.y += me.l.clientHeight;

		Molpy.notifsReceived++;
		Molpy.EarnBadge('Notified');
		if(Molpy.notifsReceived >= 2000) {
			Molpy.EarnBadge('Thousands of Them!');
		}
		if(log) {
			if (Molpy.notifLog.text == text){
				Molpy.notifLog.qty++;
			} else {
				Molpy.logBuffer += Molpy.notifLog.getLine();
				Molpy.notifLog.text = text;
				Molpy.notifLog.qty=1;
				Molpy.notifLog.details = details || "";
				Molpy.notifLog.clas = clas || "";
				Molpy.logUpdatePaint = 1;
			}
		}
	}
	Molpy.PaintLogUpdate = function() {
		Molpy.logUpdatePaint = 0;
		Molpy.logBuffer += Molpy.notifLog.getLine();
		Molpy.notifLog = new LogEntry();
		g('logCurrent').value="*NEW*"
		if(Molpy.currentLog == Molpy.selectedLog){
			var log = g('logItems');
			var scroll = (log.scrollTop == (log.scrollHeight - log.clientHeight));
			log.innerHTML += Molpy.logBuffer;
			if(scroll) {
				log.scrollTop = log.scrollHeight;
				g('logCurrent').value="Current";
			}
		}
		Molpy.logArchive[Molpy.currentLog].string += Molpy.logBuffer;
		Molpy.logBuffer = "";
	}
	Molpy.PaintNotifLog = function() {
		Molpy.notifLogPaint = 0;
		var title = g('logTitle');
		var today = Molpy.logArchive[Molpy.selectedLog].time;
		var h = today.getHours();
		var m = today.getMinutes();
		if(m < 10) m = "0" + m;
		title.title = h + ":" + m;
		title.innerHTML = "Notification log for Newpix " + Molpy.logArchive[Molpy.selectedLog].np;
		var log = g('logItems');
		log.innerHTML = Molpy.logArchive[Molpy.selectedLog].string;
		log.scrollTop = log.scrollHeight;
	}

	Molpy.subPixLetters = ['', 'a', 'b', 'c', 'd', 'e'];
	Molpy.FormatNP = function(np, format) {
		var minus = (np < 0);
		np = Math.abs(np);

		var floor = Math.floor(np);
		if(floor != np) {
			var subPix = Math.round(6 * (np - floor));
			if(format) floor = Molpify(floor, 3);
			np = floor + Molpy.subPixLetters[subPix];
		}
		return (minus ? '-' : '') + np;
	}
	Molpy.NewPixFor = function(np) {
		np = Math.abs(np);
		np = Molpy.FormatNP(np);
		var floor = Math.floor(np);

		var x = 200 + flandom(200);
		var y = 200 + flandom(400);
		if(Molpy.Got('Chromatic Heresy') && Molpy.options.colpix) {
			if(floor > 3094)
				return 'http://placekitten.com/' + x + '/' + y;
			else
				return 'http://178.79.159.24/Time/otcolorization/' + np;
		} else {
			if(floor > 3094)
				return 'http://placekitten.com/g/' + x + '/' + y;
			else
				return 'http://xkcd.mscha.org/frame/' + np;
		}
	}
	Molpy.ThumbNewPixFor = function(np) {
		np = Math.abs(np);
		np = Molpy.FormatNP(np);
		var floor = Math.floor(np);
		if(floor > 3094) return 'http://placekitten.com/g/' + x + '/' + y;
		else return 'http://xkcd.mscha.org/frame/' + np;
	}

	Molpy.Url = function(address) {
		return 'url(' + address + ')';
	}

	//call with argument to change to a specific np, otherwise defaults to the current np
	Molpy.UpdateBeach = function(np) {
		np = np || Molpy.newpixNumber;
		g('beach').style.backgroundImage = Molpy.Url(Molpy.NewPixFor(np));
		Molpy.preloadedBeach = 0;
	}
	Molpy.preloadedBeach = 0;
	Molpy.PreloadBeach = function(np) {
		//REMOVED because it's giving people console errors and wasn't working for me anyway:
		//$.get(Molpy.NewPixFor(np||Molpy.newpixNumber+1));
		if(!np) Molpy.preloadedBeach = 1;
	}
	/* In which we figure out how to draw stuff
	+++++++++++++++++++++++++++++++++++++++++++*/
	Molpy.redactedClassNames = ['hidden', 'floatbox sand tool shop', 'floatbox castle tool shop',
			'floatbox boost shop', 'lootbox boost loot', 'lootbox badge loot', 'lootbox badge shop'];
	Molpy.drawFrame = 0;
	Molpy.Draw = function() {
		var castleAmt = Molpy.Boosts['Castles'].power; //so we don't need lots of lookups
		g('castlecount').innerHTML = Molpify(castleAmt, 1) + ' castle' + plural(castleAmt);
		g('sandcount').innerHTML = Molpify(Molpy.Boosts['Sand'].power, 1) + ' sand' + (isFinite(castleAmt) ? ' of ' + Molpify(Molpy.Boosts['Castles'].nextCastleSand, 1) + ' needed' : '');
		g('sandrate').innerHTML = Molpify(Molpy.Boosts['Sand'].sandPermNP, 1) + ' sand/mNP';
		g('chipcount').innerHTML = Molpify(Molpy.Boosts['TF'].power, 1) + ' chips';
		g('chiprate').innerHTML = Molpify(Molpy.Boosts['TF'].loadedPermNP, 1) + ' chips/mNP';
		g('newtools').innerHTML = 'Built ' + Molpify(Molpy.toolsBuilt, 1) + ' new tool' + plural(Molpy.toolsBuilt);

		if(noLayout) {
			var finite = isFinite(Molpy.Boosts['Sand'].power) || isFinite(castleAmt) || isFinite(Molpy.spmNP);
			var tf = Molpy.Got('TF');
			$('#sectionTFCounts').toggleClass('hidden', !tf);
			if(tf) {
				$('#sectionSandCounts').toggleClass('hidden', !finite);
				$('#sectionAbout').toggleClass('hidden', finite);
			} else {
				$('#sectionSandCounts').removeClass('hidden');
				$('#sectionAbout').removeClass('hidden');
			}
		} else {
			$('#toggleTFCounts').removeClass('hidden');
		}

		g('newpixnum').innerHTML = 'Newpix ' + Molpy.FormatNP(Molpy.newpixNumber, 1);
		g('eon').innerHTML = Molpy.TimeEon;
		g('era').innerHTML = Molpy.TimeEra;
		g('period').innerHTML = Molpy.TimePeriod;
		$('.timeflip').toggleClass('flip-horizontal', (Molpy.previewNP ? Molpy.previewNP < 0 : Molpy.newpixNumber < 0));
		g('version').innerHTML = '<br>Version: ' + Molpy.version + (Molpy.version == 3.11 ? '<br>Windows?' : '');

		if(!noLayout) {
			g('stuffSandCount').innerHTML = 'Sand: ' + Molpify(Molpy.Boosts['Sand'].power, 3);
			g('stuffCastleCount').innerHTML = 'Castles: ' + Molpify(castleAmt, 3);
			g('stuffTFChipCount').innerHTML = 'TF Chips: ' + Molpify(Molpy.Boosts['TF'].Level, 3);
			for( var i in Molpy.BoostsByGroup['stuff']) {
				var bst = Molpy.BoostsByGroup['stuff'][i];
				if(bst.alias == "Sand" || bst.alias == "Castles") continue;
				if($('#stuff' + bst.alias + 'Count').length == 0) {
					$("#sectionStuffCountsBody").append("<div id=\"stuff" + bst.alias + "Count\"></div>");
				}
				g('stuff' + bst.alias + 'Count').innerHTML = bst.plural + ': ' + Molpify(bst.Level, 3);
				$('#stuff' + bst.alias + 'Count').toggleClass('hidden', !Molpy.Got(bst.alias));
			}

			g('incomeSandRate').innerHTML = 'Sand: ' + Molpify(Molpy.Boosts['Sand'].sandPermNP, 1) + '/mNP';
			g('incomeSandClickRate').innerHTML = 'Sand/click: ' + Molpify(Molpy.Boosts['Sand'].sandPerClick, 1);
			g('incomeChipRate').innerHTML = 'TF Chips: ' + Molpify(Molpy.Boosts['TF'].loadedPermNP, 1) + '/mNP';
			g('incomeChipClickRate').innerHTML = 'TF Chips/click: ' + Molpify(Molpy.Boosts['TF'].loadedPerClick, 1);
			g('incomeNewTools').innerHTML = 'Tools: ' + Molpify(Molpy.toolsBuilt, 1) + ' built this mNP';

			var tf = Molpy.Got('TF');
			$('#stuffTFChipCount').toggleClass('hidden', !tf);
			$('#incomeChipRate').toggleClass('hidden', !tf);
			$('#incomeChipClickRate').toggleClass('hidden', !tf);
			$('#incomeNewTools').toggleClass('hidden', !tf);
		}

		var repainted = Molpy.shopNeedRepaint || Molpy.boostNeedRepaint || Molpy.badgeNeedRepaint;
		var lootSelectionNeedRepaint = Molpy.boostNeedRepaint || Molpy.badgeNeedRepaint;

		//TODO want to repaint as little as possible, favoring updates instead
		if(Molpy.allNeedRepaint) {
			Moply.repaintAll();
		}
		if(Molpy.shopNeedRepaint) {
			Molpy.repaintShop();
		}
		if(Molpy.boostNeedRepaint) {
			Molpy.repaintBoosts();
		}
		if(Molpy.badgeNeedRepaint) {
			Molpy.repaintBadges();
		}
		if(Molpy.layoutNeedRepaint) {
			Molpy.RepaintLayouts();
		}
		if(lootSelectionNeedRepaint) Molpy.RepaintLootSelection();
		
		if(Molpy.shopNeedUpdate) {
			Molpy.updateShop();
		}
		if(Molpy.toolsNeedUpdate) {
			Molpy.updateTools();
		}
		if(Molpy.lootNeedUpdate) {
			Molpy.updateLoot();
		}
		
		if(Molpy.redactedVisible) {
			var ra = $('.redacted-area');
			if(ra) {
				Molpy.drawFrame++;
				if(Molpy.drawFrame >= Molpy.fps / 3) Molpy.drawFrame = 0;
				if(repainted || Molpy.drawFrame == 0) {
					var className = Molpy.redactedClassNames[Molpy.redactedVisible];
					if(Molpy.Boosts['Chromatic Heresy'].power > 0 && Molpy.Got('Technicolour Dream Cat') && Molpy.redactedDrawType[Molpy.redactedDrawType.length - 1] != 'hide2') {
						ra.removeClass(Molpy.redactedAreaClass);
						Molpy.redactedAreaClass = ['alert', 'action', 'toggle', '', ''][flandom(4)];
						className += ' ' + Molpy.redactedAreaClass;
						ra.addClass(Molpy.redactedAreaClass);
					}
					var redacteditem = g('redacteditem');
					if(redacteditem) redacteditem.className = className;
				}
			}
		}
		
		if(repainted && Molpy.options.fade) Molpy.AdjustFade();
		
		for( var grp in Molpy.dispObjects) {
			if(grp != 'tools' || grp != 'shop') continue;
			for(var i in Molpy.dispObjects[grp])
				Molpy.dispObjects[grp][i].updateBuy();
		}

		drawClockHand();
		Molpy.PaintStats();
		Molpy.UpdateFaves();
		Molpy.notifsUpdate();
		if(Molpy.notifLogPaint) Molpy.PaintNotifLog();
		if(Molpy.logUpdatePaint) Molpy.PaintLogUpdate();		
		if(Molpy.options.numbers) Molpy.sparticlesUpdate();

		if(Molpy.scrumptiousDonuts == 1) {
			g('scrumptiousdonuts').innerHTML = Molpy.BeanishToCuegish(Molpy.donuts[0]);
		} else if(Molpy.scrumptiousDonuts == -1) {
			g('scrumptiousdonuts').innerHTML = '';
		}
		if(Molpy.scrumptiousDonuts > 0) {
			Molpy.scrumptiousDonuts--;
		}
		Molpy.shrinkAll = 0;

		Molpy.CheckBeachClass();
		
		Molpy.Boosts['Temporal Rift'].updateRiftIMG();
	}

	Molpy.DescClass = function(me) {
		if(me.hovering) return 'descshow';
		return 'deschide';
	}

	Molpy.PaintStats = function() {
		g('totalsandstat').innerHTML = Molpify(Molpy.Boosts['Sand'].totalDug, 4);
		g('manualsandstat').innerHTML = Molpify(Molpy.Boosts['Sand'].manualDug, 4);
		g('clicksstat').innerHTML = Molpify(Molpy.beachClicks, 4);
		g('spclickstat').innerHTML = Molpify(Molpy.Boosts['Sand'].sandPerClick, 4);
		g('sandspentstat').innerHTML = Molpify(Molpy.Boosts['Sand'].spent, 4);
		g('totalcastlesstat').innerHTML = Molpify(Molpy.Boosts['Castles'].totalBuilt, 4);
		g('destroyedcastlesstat').innerHTML = Molpify(Molpy.Boosts['Castles'].totalDestroyed, 4);
		g('downcastlesstat').innerHTML = Molpify(Molpy.Boosts['Castles'].totalDown, 4);
		g('spentcastlesstat').innerHTML = Molpify(Molpy.Boosts['Castles'].spent, 4);

		g('ninjatimestat').innerHTML = Molpify(Molpy.ninjaTime / Molpy.NPlength, 1) + 'mNP';
		g('ninjastealthstat').innerHTML = Molpify(Molpy.ninjaStealth, 1) + 'NP';
		g('ninjaforgivestat').innerHTML = Molpify(Molpy.Boosts['Ninja Hope'].power * Molpy.Got('Ninja Hope')
			+ Molpy.Boosts['Ninja Penance'].power * Molpy.Got('Ninja Penance') + Molpy.Boosts['Impervious Ninja'].power
			* Molpy.Got('Impervious Ninja'));

		g('loadcountstat').innerHTML = Molpify(Molpy.loadCount, 1);
		g('savecountstat').innerHTML = Molpify(Molpy.saveCount, 1);
		g('notifstat').innerHTML = Molpify(Molpy.notifsReceived, 2);
		g('autosavecountstat').innerHTML = Molpify(Molpy.autosaveCountup, 1);

		g('sandtoolsownedstat').innerHTML = Molpify(Molpy.SandToolsOwned, 4);
		g('castletoolsownedstat').innerHTML = Molpify(Molpy.CastleToolsOwned, 4);
		g('boostsownedstat').innerHTML = Molpify(Molpy.BoostsOwned, 4);
		g('badgesownedstat').innerHTML = Molpify(Molpy.BadgesOwned, 4);
		g('discoveriesstat').innerHTML = Molpify((Molpy.groupBadgeCounts.discov || 0), 4);
		g('sandmonstat').innerHTML = Molpify((Molpy.groupBadgeCounts.monums || 0), 4);
		g('glassmonstat').innerHTML = Molpify((Molpy.groupBadgeCounts.monumg || 0), 4);

		g('sandmultiplierstat').innerHTML = Molpify(Molpy.globalSpmNPMult * 100, 4) + '%';
		g('redactedstat').innerHTML = Molpy.redactedWords + ": " + Molpify(Molpy.redactedClicks, 1);
		g('redactedmaxstat').innerHTML = 'Max ' + Molpy.redactedWord + " Chain: " + Molpify(Molpy.redactedChainMax, 1);

		g('glasschipstat').innerHTML = Molpify(Molpy.Boosts['GlassChips'].power, 4);
		g('glassblockstat').innerHTML = Molpify(Molpy.Boosts['GlassBlocks'].power, 4);
		g('sandusestat').innerHTML = Molpify(Molpy.CalcGlassUse(), 6) + '%';

		$('#chipspmnp').toggleClass('hidden', !Molpy.Got('AA'));
		$('#blockspmnp').toggleClass('hidden', !Molpy.Got('AA'));
		g('chipspmnpstat').innerHTML = Molpify(Molpy.Boosts['GlassChips'].chipsPermNP, 3);
		g('blockspmnpstat').innerHTML = Molpify(Molpy.Boosts['GlassBlocks'].blocksPermNP, 3);

		g('blackstat').innerHTML = Molpy.BlackprintReport();

		g('logicatstat').innerHTML = Molpify(Molpy.Boosts['Logicat'].bought, 1);
		g('totaltoolchipsstat').innerHTML = Molpify(Molpy.Boosts['TF'].totalLoaded, 4);
		g('destroyedtoolchipsstat').innerHTML = Molpify(Molpy.Boosts['TF'].totalDestroyed, 4);
		g('manualchipsstat').innerHTML = Molpify(Molpy.Boosts['TF'].manualLoaded, 4);
		g('chipclickstat').innerHTML = Molpify(Molpy.Boosts['TF'].loadedPerClick, 4);
		g('storagestat').innerHTML = (Molpy.supportsLocalStorage ? 'html5localstorage' : 'c**kies');
	}

	Molpy.UpdateFaves = function(force) {
		var fav = Molpy.activeLayout.faves;
		for( var i in fav) {
			var f = fav[i];
			if(f.boost && (f.boost.faveRefresh || force)) {
				f.BoostToScreen();
			}
		}
		for( var i in fav) {
			var f = fav[i];
			if(f.boost && f.boost.faveRefresh) {
				f.boost.faveRefresh = 0;
			}
		}
	}

	Molpy.oldBeachClass = '';
	Molpy.UpdateBeachClass = function(stateClass) {
		stateClass = stateClass || '';
		if(Molpy.Boosts['Beachball'].power) {
			if(Molpy.oldBeachClass != stateClass) {
				$('#beach').removeClass(Molpy.oldBeachClass).addClass(stateClass);
				Molpy.oldBeachClass = stateClass;
			}
		} else if(Molpy.oldBeachClass) {
			$('#beach').removeClass(Molpy.oldBeachClass);
			Molpy.oldBeachClass = '';
		}
	}

	Molpy.clockDegrees = 0;
	function createClockHand() {
		var clockSizeX = 40, clockSizeY = 40, handOriginX = clockSizeX / 2, handOriginY = clockSizeY / 2, handSize = 12;
		var hand = document.createElement("div");
		$(hand).css({
			position: "relative",
			left: handOriginX + "px",
			top: handOriginY + "px",
			width: "2px",
			height: handSize + "px",
			backgroundColor: "#222",
		});
		g("clockface").appendChild(hand);
	}
	function drawClockHand() {
		if(!g('game')) {
			return;
		}
		if(!Molpy.ONGelapsed) {
			Molpy.ONGelapsed = new Date().getTime() - Molpy.ONGstart.getTime();
		}
		var npPercent = Molpy.ONGelapsed / (Molpy.NPlength * 1000);
		Molpy.clockDegrees = (npPercent * 360) + 180; //rotation from top		

		$("#clockface").children('div').css({
			transformOrigin: "0% 0%",
			transform: "rotate(" + Molpy.clockDegrees + "deg)",
			'-ms-transform': "rotate(" + Molpy.clockDegrees + "deg)",
			'-ms-transform-origin': "0% 0%",
			WebkitTransform: "rotate(" + Molpy.clockDegrees + "deg)",
			'-webkit-transform-origin': "0% 0%"
		});
	}

	Molpy.LockLayoutToggle = function() {
		Molpy.layoutLocked = !Molpy.layoutLocked;

		$('.draggable-element,.resizable-element').toggleClass('editlock', Molpy.layoutLocked);
		$('.ui-resizable-handle').toggleClass('hidden', Molpy.layoutLocked);
		$('#toggleSnap').toggleClass('hidden', Molpy.layoutLocked);
		$('#toggleGrid').toggleClass('hidden', Molpy.layoutLocked);
		$('#toggleLockLayout').toggleClass('depressed', Molpy.layoutLocked);
		//toggling hidden doesn't work for some reason, would be nice if it did
		if(Molpy.layoutLocked) {
			$('.ui-border-color-button').hide();
		} else {
			$('.ui-border-color-button').show();
		}
	}
	Molpy.SnapLayoutToggle = function() {
		Molpy.layoutSnap = !Molpy.layoutSnap;

		$('#toggleSnap').toggleClass('depressed', Molpy.layoutSnap);
		$('.draggable-element').draggable('option', 'snap', Molpy.layoutSnap)
	}
	Molpy.GridLayoutToggle = function() {
		Molpy.layoutGrid = !Molpy.layoutGrid;

		$('#toggleGrid').toggleClass('depressed', Molpy.layoutGrid);
		var size = Molpy.layoutGrid ? 10 : 1;
		$('.draggable-element').draggable('option', 'grid', [size, size])
	}

	//Handles player clicking, not needed for loading layouts
	Molpy.CycleBorderClick = function(e) {
		var sectionName = $(e.target).parent().attr('id').match(/section(.+)/)[1];
		Molpy.CyclePanelBorder(sectionName);
	}

	//Does the actual Color cycling
	Molpy.CyclePanelBorder = function(panelName) {
		var newColor = ++Molpy.activeLayout.borderColors[panelName] || (Molpy.activeLayout.borderColors[panelName] = 0);
		if(newColor >= 11) {
			Molpy.activeLayout.borderColors[panelName] = newColor = 0;
		}
		
		var thisPanel = $('#section' + panelName);
		var borderbutton = thisPanel.find('.ui-border-color-button')
		for(var i=0; i<11; i++){
			thisPanel.removeClass('bordercolor' + i);
			borderbutton.removeClass('bordercolor' + i);
		}
		
		thisPanel.addClass('borderActive bordercolor' + newColor);
		Molpy.activeLayout.borderColors[panelName] = newColor;
		if(newColor != 0) {
			borderbutton.css('border-color', '');
			borderbutton.addClass('bordercolor' + newColor);
		} else {
			thisPanel.removeClass('borderActive');
			borderbutton.css('border-color', '#999');
		}
	}

	Molpy.nFaves = 40;
	Molpy.Layout = function(args) {
		this.name = args.name || '';
		this.lootVis = $.extend({}, args.lootVis);
		this.boxVis = $.extend({}, args.boxVis);
		this.positions = $.extend({}, args.positions);
		this.sizes = $.extend({}, args.sizes);
		this.borderColors = $.extend({}, args.borderColors)
		if(!noLayout) {
			this.faves = Molpy.EmptyFavePanes(Molpy.nFaves);
		}

		this.toString = function() {
			var p = 'P'; //Pipe seParator
			var s = 'S'; //Semicolon
			var c = 'C'; //Comma

			var thread = '';
			var threads = [];
			thread += Molpy.version + p + p;//some extra space!
			thread += this.name.toLowerCase() + p;

			for( var i in Molpy.lootVisOrder) {
				thread += this.lootVis[Molpy.lootVisOrder[i]] ? 1 : 0;
			}
			thread += p;
			for( var i in Molpy.boxVisOrder) {
				thread += this.boxVis[Molpy.boxVisOrder[i]] ? 1 : 0;
			}
			thread += p;
			for( var i in Molpy.draggableOrder) {
				var item = this.positions[Molpy.draggableOrder[i]]
				thread += item.left + c + item.top + s;
			}
			thread += p;
			for( var i in Molpy.sizableOrder) {
				var item = this.sizes[Molpy.sizableOrder[i]]
				thread += item.width + c + item.height + s;
			}
			thread += p;
			for( var i in this.faves) {
				var item = this.faves[i];
				thread += item.toString() + s;
			}
			thread+=p;
			for(var i in Molpy.borderColorOrder) {
				var item=this.borderColors[Molpy.borderColorOrder[i]] || 0;
				thread += item + s;
			}
			thread += p;

			return thread;
		}

		this.FromString = function(string) {
			var p = 'P'; //Pipe seParator
			var s = 'S'; //Semicolon
			var c = 'C'; //Comma
			var threads = string.split(p);
			var version = parseFloat(threads[0]);
			this.name = threads[2].replace(/\W/g, '').toLowerCase();

			this.lootVis = {};
			var pixels = threads[3].split('');
			for( var i in Molpy.lootVisOrder) {
				var vis = parseInt(pixels[i]) == 1;//we want a boolean because jQuery
				this.lootVis[Molpy.lootVisOrder[i]] = vis;
			}

			this.boxVis = {};
			pixels = threads[4].split('');
			for( var i in Molpy.boxVisOrder) {
				var vis = parseInt(pixels[i]) == 1;//ditto
				this.boxVis[Molpy.boxVisOrder[i]] = vis;
			}

			this.positions = {};
			pixels = threads[5].split(s);
			for( var i in Molpy.draggableOrder) {
				if(!pixels[i]) pixels[i] = '0C0';
				var pos = pixels[i].split(c);
				this.positions[Molpy.draggableOrder[i]] = {
					left: parseFloat(pos[0]),
					top: parseFloat(pos[1])
				};
			}

			this.sizes = {};
			pixels = threads[6].split(s);
			for( var i in Molpy.sizableOrder) {
				if(!pixels[i]) pixels[i] = '0C0';
				var pos = pixels[i].split(c);
				this.sizes[Molpy.sizableOrder[i]] = {
					width: parseFloat(pos[0]),
					height: parseFloat(pos[1])
				};
			}
			if(threads[7] && !noLayout) {
				this.faves = Molpy.EmptyFavePanes(Molpy.nFaves);
				pixels = threads[7].split(s);
				for( var i in pixels) {
					if(!pixels[i]) break;
					var fav = this.faves[i];
					fav.FromString(pixels[i]);
					this.faves.push(fav);
				}
			}
			if(threads[8] && !noLayout) {
				this.borderColors = {};
				pixels = threads[8].split(s);
				for( var i in Molpy.borderColorOrder) {
					if(!pixels[i]) pixels[i] = '0';
					this.borderColors[Molpy.borderColorOrder[i]] = parseInt(pixels[i]) || 0;
				}
			}
		}

		this.ToScreen = function() {
			for( var i in Molpy.lootVisOrder) {
				var el = Molpy.lootVisOrder[i];
				Molpy.ShowhideToggle(el, this.lootVis[el] == true); //==true incase there are missing values (otherwise they would toggle instead of set to false)
			}
			for( var i in Molpy.boxVisOrder) {
				var el = Molpy.boxVisOrder[i];
				Molpy.ToggleView(el, this.boxVis[el] == true);
			}
			if(noLayout) return;
			for( var i in Molpy.draggableOrder) {
				var item = Molpy.draggableOrder[i];
				var pos = this.positions[item];
				$('#section' + item).css(pos);
			}
			for( var i in Molpy.sizableOrder) {
				var item = Molpy.sizableOrder[i];
				var size = this.sizes[item];
				$('#section' + item + 'Body').css(size);
			}
			for( var i in this.faves) {
				this.faves[i].ToScreen();
			}
			for( var i in Molpy.borderColorOrder) {
				var item = Molpy.borderColorOrder[i];
				this.borderColors[item]--;
				Molpy.CyclePanelBorder(item);
			}

			Molpy.FixPaneWidths();
		}

		this.FromScreen = function() {
			this.positions = {};
			this.sizes = {};
			for( var i in Molpy.draggableOrder) {
				var item = g('section' + Molpy.draggableOrder[i]);
				this.positions[Molpy.draggableOrder[i]] = {
					left: parseFloat(item.style.left),
					top: parseFloat(item.style.top)
				};
			}
			for( var i in Molpy.sizableOrder) {
				var item = $('#section' + Molpy.sizableOrder[i] + 'Body');
				this.sizes[Molpy.sizableOrder[i]] = {
					width: item.width(),
					height: item.height()
				};
			}
			this.lootVis = $.extend({}, Molpy.activeLayout.lootVis); //because the active layout's vis settings ARE the screen settings
			this.boxVis = $.extend({}, Molpy.activeLayout.boxVis);
			for( var i in this.faves) {
				this.faves[i].FromScreen();
			}
			this.borderColors = $.extend({}, Molpy.activeLayout.borderColors);
		}

		this.Export = function() {
			Molpy.ToggleView('Export');
			g('exporttext').value = this.toString();
		}
		this.Overwrite = function() {
			if(confirm('Really overwrite the layout "' + this.name + '"with the current settings?')) {
				this.FromScreen();
			}
		}
		this.Activate = function() {
			Molpy.activeLayout = this;
			this.ToScreen();
			Molpy.layoutNeedRepaint = 1;
		}
		this.Clone = function() {
			var clone = new Molpy.Layout(this);
			clone.name += ' clone';
			Molpy.layouts.push(clone);
			Molpy.layoutNeedRepaint = 1;
		}
		this.Delete = function() {
			if(Molpy.layouts.length < 2) {
				Molpy.Notify('You need at least 1 layout!');
				return;
			}
			if(confirm('Really delete the layout "' + this.name + '"?')) {
				var i = Molpy.layouts.indexOf(this);
				if(i >= 0) {
					Molpy.layouts.splice(i, 1);
					Molpy.layoutNeedRepaint = 1;
				}
			}
		}
		this.Rename = function() {
			var str = prompt('Enter a layout name here:', 'lowercase123');
			str = str.replace(/\W/g, '').toLowerCase();
			if(!str) return;
			this.name = str;
			Molpy.layoutNeedRepaint = 1;
		}

	}
	Molpy.NewLayout = function() {
		var newLayout = new Molpy.Layout({});
		newLayout.FromScreen();
		newLayout.name = "new";
		Molpy.layouts.push(newLayout);
		Molpy.layoutNeedRepaint = 1;
	}
	Molpy.ImportLayout = function() {
		var thread = prompt('Paste a valid layout code here:\n(write "default" or "default2" for the defaults)', '');
		if(!thread) return;
		if(thread == 'default') thread = Molpy.defaultLayoutData;
		if(thread == 'default2') thread = Molpy.defaultLayoutData2;
		var newLayout = new Molpy.Layout({});
		newLayout.FromString(thread);
		Molpy.layouts.push(newLayout);
		Molpy.layoutNeedRepaint = 1;
	}

	Molpy.FixPaneWidths = function() {
		$('#lootselection').css({width: $('#sectionInventoryBody').width()});
		$('.layoutcontrols').css({width: $('#sectionLayoutsBody').width()});
	}
	Molpy.IsStatsVisible = function() {
		return Molpy.activeLayout.boxVis['Stats'];
	}

	Molpy.FavePane = function(i) {
		this.i = i;
		this.boost = 0;
		this.vis = false;
		this.position = {
			left: 0,
			top: 0
		};
		this.size = {
			width: 140,
			height: 50
		};

		this.toString = function() {
			var c = 'C'; //Comma
			var id = 'n';
			if(this.boost) {
				id = '' + this.boost.id;
				if(Molpy.BoostsById[id] !== this.boost) {
					if (id >= Molpy.DiscoveriesStartAt) { id = -1000000 -id +Molpy.DiscoveriesStartAt; }
					else { id = 1 - id; }
				}
			}
			return id + c + (this.vis ? 1 : 0) + c + (this.position.left || 0) + c + (this.position.top || 0) + c + (this.size.width || 0) + c + (this.size.height || 0);
		}
		this.FromString = function(str) {
			var c = 'C'; //Comma
			var pixels = str.split(c);
			var n = pixels[0];
			if (n == 'n') { this.boost = 0 }
			else if (n >= 0) { this.boost = Molpy.BoostsById[parseInt(n) || 0] }
			else if (n > -1000000) { this.boost = Molpy.BadgesById[1 - parseInt(n) || 0] }
			else { this.boost = Molpy.BadgesById[Molpy.DiscoveriesStartAt + 1000000 + parseInt(n) || 0] };
			this.boost.faveRefresh = 1;
			this.vis = pixels[1] == true;
			this.position = {
				left: parseFloat(pixels[2]),
				top: parseFloat(pixels[3])
			};
			this.size = {
				width: parseFloat(pixels[4]),
				height: parseFloat(pixels[5])
			};
		}
		this.ToScreen = function() {
			$('#sectionFave' + this.i).css(this.position);
			$('#sectionFaveBody' + this.i).css(this.size);
			this.BoostToScreen();
		}
		this.BoostToScreen = function() {
			var n = this.i;
			if(this.boost) {
				Molpy.DisplayingFave =1;
				g('optionFave' + n).text = this.boost.name;
				g('faveHeader' + n).innerHTML = this.boost.getHeading() + this.boost.getFormattedName();
				if(this.boost.boost) {
					g('faveContent' + n).innerHTML = (this.boost.unlocked ? this.boost.getDesc() : 'This Boost is locked!');
					this.boost.updateBuy(1);
				} else {
					g('faveContent' + n).innerHTML = (this.boost.earned ? this.boost.getDesc() : 'This Badge is unearned!');
				}
				g('sectionFave' + n).className = 'draggable-element table-wrapper ' + this.boost.getFullClass();
				Molpy.DisplayingFave =0;
			} else {
				g('optionFave' + n).text = n + ' (empty)';
				g('faveHeader' + n).innerHTML = '';
				g('faveContent' + n).innerHTML = 'Fave ' + n;
				g('sectionFave' + n).className = 'draggable-element table-wrapper';
			}
			$('#sectionFave' + this.i).toggleClass('hidden', !this.vis).toggleClass('editlock', Molpy.layoutLocked);
		}
		this.FromScreen = function() {
			var item = g('sectionFave' + this.i);
			this.position = {
				left: parseFloat(item.style.left),
				top: parseFloat(item.style.top)
			};

			var item = $('#sectionFaveBody' + this.i);
			this.size = {
				width: item.width(),
				height: item.height()
			};

			this.vis = Molpy.activeLayout.faves[this.i].vis; //because the active layout's vis settings ARE the screen settings
		}
	}

	Molpy.EmptyFavePanes = function(n) {
		var f = [];
		for( var i = 0; i < n; i++) {
			f.push(new Molpy.FavePane(i));
		}
		return f;
	}
	Molpy.MakeFavePanes = function() {
		var str = '';
		for( var i in Molpy.activeLayout.faves) {
			str += '<div id="sectionFave' + i + '" class="hidden draggable-element table-wrapper">\<div id="faveHeader' + i
				+ '" class="table-header"></div>\<div id="sectionFaveBody' + i
				+ '" class="table-content resizable-element">\<div id="faveContent' + i
				+ '" class="table-content-wrapper">Fave ' + i + '\</div>\</div>\</div>';
		}
		if(str) g('sectionFavePanes').innerHTML = str;
		var str = '';
		for( var i in Molpy.activeLayout.faves) {
			str += '<option id="optionFave' + i + '" value="' + i + '">' + i + ' (empty)</option>';
		}
		if(str) g('selectFave').innerHTML = '<option>None</option>' + str;
	}
	Molpy.InitGUI = function() {
		Molpy.lootVisOrder = ['boosts', 'ninj', 'cyb', 'hpt', 'chron', 'bean', 'badges', 'badgesav', 'discov',
				'monums', 'monumg', 'tagged', 'ceil', 'drac', 'stuff', 'land', 'prize'];
		Molpy.boxVisOrder = ['Clock', 'Timer', 'View', 'File', 'Links', 'Beach', 'Shop', 'Inventory', 'SandTools',
				'CastleTools', 'Options', 'Stats', 'Log', 'Export', 'About', 'SandCounts', 'NPInfo', 'Layouts',
				'Codex', 'Alerts', 'SandStats', 'GlassStats', 'NinjaStats', 'OtherStats', 'QuickLayout', 'TFCounts',
				'Faves', 'StuffCounts', 'IncomeCounts'];
		Molpy.draggableOrder = ['Clock', 'Timer', 'View', 'File', 'Links', 'Beach', 'Options', 'Stats', 'Log',
				'Export', 'SandCounts', 'TFCounts', 'NPInfo', 'About', 'SandTools', 'CastleTools', 'Shop', 'Inventory',
				'Layouts', 'Codex', 'Alerts', 'SandStats', 'GlassStats', 'NinjaStats', 'OtherStats', 'QuickLayout',
				'Faves', 'StuffCounts', 'IncomeCounts'];
		Molpy.sizableOrder = ['View', 'File', 'Links', 'Options', 'Stats', 'Log', 'Export', 'SandTools', 'CastleTools',
				'Shop', 'Inventory', 'Layouts', 'Codex', 'Alerts', 'SandStats', 'GlassStats', 'NinjaStats',
				'OtherStats', 'QuickLayout', 'Faves', 'StuffCounts', 'IncomeCounts'];
		Molpy.borderColorOrder = ['Clock', 'Timer', 'View', 'File', 'Links', 'Beach', 'Shop', 'Inventory', 'SandTools',
				'CastleTools', 'Options', 'Stats', 'Log', 'Export', 'About', 'SandCounts', 'NPInfo', 'Layouts',
				'Codex', 'Alerts', 'SandStats', 'GlassStats', 'NinjaStats', 'OtherStats', 'QuickLayout', 'TFCounts',
				'Faves', 'StuffCounts', 'IncomeCounts'];
		$('#sectionInventoryBody').resize(Molpy.FixPaneWidths);
		$('#sectionLayoutsBody').resize(Molpy.FixPaneWidths);
		Molpy.activeLayout = new Molpy.Layout({
			name: 'default',
			lootVis: {
				boosts: 1,
				badges: 1
			}
		});
		Molpy.activeLayout.FromString(Molpy.defaultLayoutData);
		if(!noLayout) Molpy.MakeFavePanes();
		Molpy.activeLayout.ToScreen();

		Molpy.layouts = [];
		Molpy.layouts.push(Molpy.activeLayout);
		if(!noLayout) {
			Molpy.layouts.push(new Molpy.Layout({}));
			Molpy.layouts[1].FromString(Molpy.defaultLayoutData2);
			Molpy.LoadLayouts();
			$('.resizable-element').resizable({cancel: '.editlock'});
			$('.draggable-element').draggable({cancel: '.editlock', scroll: true, grid: [10, 10], snap: true}).canColorBorder();
			Molpy.LockLayoutToggle();
		} else {
			Molpy.layoutLocked = true;
		}

		new Molpy.Puzzle('redacted', function() {
			Molpy.redactedDrawType[Molpy.redactedDrawType.length - 1] = 'show';
		});
		
		Molpy.allNeedRepaint = 1;
	}
	
	Molpy.newObjectDiv = function(type, object, flags) {
		var headingHTML = '';
		var purchaseHTML = '';
		var productionHTML = '';
		
		var heading = object.getHeading();
		if(heading != '') headingHTML = '	<H1 class="groupTitle">[' + heading + ']</H1>';
		
		var buysell = object.getBuySell();
		if(buysell != '') {
			var price = object.getPrice();
			var owned = object.getOwned();
			var ownedHTML = '';
			
			if(owned != '') ownedHTML = '<div class="owned">Owned: ' + owned + '</div>';		
			if(price != '') {
				purchaseHTML = '	<div class="purchase ">' + buysell + '</div>'
				             + ownedHTML
					         + '	<div class="price ">'
					         + Molpy.createPriceHTML(price)
					         + '	</div>';
			}
		}
		
		var production = object.getProduction();
		if(production != '') productionHTML = '	<div class="production">' + production + '</div>';
		
		var divHTML = '<div class="objDiv ' + object.getFullClass() + '">'
			        + '	<div class="icon ' + type + '_' + (object.icon ? object.icon : 'generic') + '" />'
			        + headingHTML
			        + '	<H2 class="objName">' + object.getFormattedName() + '</H2>'
			        + purchaseHTML
			        + productionHTML
			        + '	<div class="description"><br />' + object.getDesc() + '</div>'
			        + '</div>';
		
		var div = $(divHTML);
		if(flags.hover) {
			var oid = '' + object.name + object.id;
			div.mouseover({overID: oid}, Molpy.onMouseOver).mouseout({overID: oid}, Molpy.onMouseOut);
			if(!Molpy.Boosts['Expando'].IsEnabled && !flags.nohide) {
				div.find('.description').hide();
			}
		}
		return div;
	}
	
	Molpy.createPriceHTML = function(price) {
		var innerHTML = 'Price:';
		for(var p in price) {
			var pNum = price[p];
			//change all number representations into a number (40,000 40k 4e4)
			pNum = isNaN(pNum) ? DeMolpify(pNum) : pNum;
			innerHTML += '<br>&nbsp;&nbsp;- ' + Molpify(pNum, 1) + ' ' + p;
		}
		return innerHTML;
	}
}
