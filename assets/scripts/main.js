
if (typeof String.prototype.startsWith !== 'function') {
  String.prototype.startsWith = function (str){
  	'use strict';
    return (this.slice(0, str.length) === str);
  };
}

if (typeof String.prototype.endsWith !== 'function') {
	String.prototype.endsWith = function(suffix) {
		'use strict';
    	return this.indexOf(suffix, this.length - suffix.length) !== -1;
	};
}

function number(num) {
	'use strict';
	var howl, howl2, howl3;
	if (num < 21) {
		howl = new Howl({
			urls: ['assets/module-specific/audio/number/' + num.toString() + '.wav']
		}).play();
	} else if (num < 100) {
		howl = new Howl({
			urls: ['assets/module-specific/audio/number/' + num.toString().charAt(0) + '0.wav'],
			onend: function() {
				if (num.toString().charAt(1) !== '0') {
					howl2 = new Howl({
						urls: ['assets/module-specific/audio/number/' + num.toString().charAt(1) + '.wav']
					}).play();
				}
			}
		}).play();
	} else if (num < 1000) {
		howl = new Howl({
			urls: ['assets/module-specific/audio/number/' + num.toString().charAt(0) + '.wav'],
			onend: function() {
				howl2 = new Howl({
					urls: ['assets/module-specific/audio/number/100.wav'],
					onend: function() {
						if (num % 100 !== 0) {
							howl3 = new Howl({
								urls: ['assets/module-specific/audio/number/and.wav'],
								onend: function() {
									number(parseInt(num.toString().substring(1)));
								}
							}).play();
						}
					}
				}).play();
			}
		}).play();
	}
}

// creating the everything via an anonymous function, so as to add variables and preserve global namespace
var App = function(){
	'use strict';

	console.log('Beginning of app.');

	// initializing basic variables, pretty much everything is an object
	var app, globals, init, constants;
	app = globals = constants = {};

	// Just in case speech recognition lands in other browsers any time soon, if browser doesn't support it's just false
	window.SpeechRecognition = window.speechRecognition || window.webkitSpeechRecognition || false;

	// initializing some globals
	globals.recognition = (window.SpeechRecognition) ? new SpeechRecognition() : false;
	globals.result = false;
	globals.conversation = [];
	globals.found = true;

	globals.modules = [0];
	globals.allModules = [
		{name: 'core', description: 'Includes all basic features for Jarvis. Only mandatory module.'},
		{name: 'webdev', description: 'Includes features for web developers and web designers, such as docs for popular libraries, placeholder text/images, and trending dev news.'},
		{name: 'random', description: 'Includes basic random generators, including coin flips, dice rolls and others.'}
	];

	function addConvo(str) {
		globals.conversation.push({speaker: 'jarvis', text: str});
		$('<div class="jarvis">' + str + '</div>').hide().appendTo('#conversation').fadeIn(200);
	}

	function addDiv(str) {
		globals.conversation.push({speaker: 'jarvis', text: str});
		$(str).hide().appendTo('#conversation').fadeIn(200);
	}

	function parseReady(str) {
		var parsedText = str.toLowerCase().split(',').join('');
		parsedText = str.toLowerCase().split('?').join('');
		if (parsedText.split(' ')[0] === 'jarvis' || parsedText.split(' ')[0] === 'jervis') {
			parsedText = parsedText.replace('jarvis ', '');
			parsedText = parsedText.replace('jervis ', '');
		}

		parsedText = parsedText.split('fuck').join('f**k');
		parsedText = parsedText.split('shit').join('s**t');
		parsedText = parsedText.split('bitch').join('b***h');
		parsedText = parsedText.split('cunt').join('c**t');
		parsedText = parsedText.split('asshole').join('a******');
		parsedText = parsedText.split('asswipe').join('a******');

		parsedText = parsedText.split('underscore').join('_');
		parsedText = parsedText.split('what\'s').join('what is');
		console.log('Parsed string: ' + parsedText);
		return parsedText;
	}

	globals.allModules[0].parse = function(str) {
		var sound1, sound2, sound3, sound4;
		var url;
		if (str.indexOf('f**k') !== -1 || str.indexOf('s**t') !== -1 || str.indexOf('b***h') !== -1 || str.indexOf('c**t') !== -1) {
			sound1 = new Howl({
				urls: ['assets/module-specific/audio/Core/No-Swearing.wav']
			}).play();
			addConvo('Hey! No swearing!');
		} else if (str === 'who are you' || str === 'what are you' || str === 'what do you do') {
			sound1 = new Howl({
				urls: ['assets/module-specific/audio/Core/I-Am.wav']
			}).play();
			addConvo('I am Jarvis, an intelligent voice-powered virtual personal assistant. I\'m basically Siri for the web, but more extensible, and open-source too.');
		} else if (str === 'what time is it' || str === 'what time is it now' || str === 'what is the time') {
			sound1 = new Howl({
				urls: ['assets/module-specific/audio/Core/Time.wav'],
				onend: function() {
					sound2 = new Howl({
						urls: ['assets/module-specific/audio/number/' + parseInt(moment().format('h')) + '.wav'],
						onend: function() {
							if (!(parseInt(moment().format('mm')))) {
								sound3 = new Howl({
									urls: ['assets/module-specific/audio/number/o-clock.wav']
								}).play();

							} else if (parseInt(moment().format('mm')) < 10) {
								sound3 = new Howl({
									urls: ['assets/module-specific/audio/number/0 - 2.wav'],
									onend: function() {
										number(parseInt(moment().format('mm')));
									}
								}).play();
							} else {
								number(moment().format('mm'));
							}
						}
					}).play();
				}
			}).play();
			addConvo('The time is <b>' + moment().format('h:mm A') + '</b>.');
		} else if (str === 'i love you' || str === 'i like you') {
			sound1 = new Howl({
				urls: ['assets/module-specific/audio/Core/Ditto.wav']
			}).play();
			addConvo('Ditto.');
		} else if (str === 'make me a sandwich') {
			sound1 = new Howl({
				urls: ['assets/module-specific/audio/Core/Sandwich.wav']
			}).play();
			addConvo('Poof! You\'re a sandwich!');
		} else if (str.startsWith('search')) {
			var endpoint;
			switch (str.split(' ').slice(1, str.split(' ').indexOf('for')).join(' ')) {
				case '':
				case 'google':
					endpoint = 'https://www.google.com/search?q=';
					break;
				case 'bing':
					endpoint = 'https://www.bing.com/search?q=';
					break;
				case 'google images':
				case 'images':
				case 'pictures':
					endpoint = 'https://www.google.com/search?site=&tbm=isch&q=';
					break;
				case 'youtube':
				case 'video':
				case 'videos':
					endpoint = 'https://www.youtube.com/results?search_query=';
					break;
				case 'vimeo':
					endpoint = 'http://vimeo.com/search?q=';
					break;
				case 'github':
					endpoint = 'https://github.com/search?utf8=✓&q=';
					break;
				case 'spotify':
					endpoint = 'https://play.spotify.com/search/';
					break;
				case 'duckduckgo':
				case 'duck duck go':
					endpoint = 'https://duckduckgo.com/?q=';
					break;
				case 'flickr':
				case 'flicker':
					endpoint = 'https://www.flickr.com/search/?q=';
					break;
				case 'behance':
					endpoint = 'https://www.behance.net/search?search=';
					break;
				case 'dribble':
				case 'dribbble':
					endpoint = 'https://dribbble.com/search?q=';
					break;
				case 'wikipedia':
					endpoint = 'https://en.wikipedia.org/wiki/';
					break;
				case 'stack overflow':
				case 'stackoverflow':
				case 'stock overflow':
					endpoint = 'http://stackoverflow.com/search?q=';
					break;
				case 'soundcloud':
				case 'sound cloud':
					endpoint = 'https://soundcloud.com/search?q=';
					break;
				case 'last.fm':
				case 'last dot fm':
				case 'last. fm':
					endpoint = 'http://www.last.fm/search?q=';
					break;
				default:
					endpoint = 'https://www.google.com/search?q=';
			}
			var query = str.split(' ').slice(str.split(' ').indexOf('for')+1, str.split(' ').length).join(' ');
			sound1 = new Howl({
				urls: ['assets/module-specific/audio/Core/New-Tab.wav'],
				onend: function() {
					window.open(endpoint + query, '_blank');
				}
			}).play();
			addConvo('Opening new tab in 3, 2, 1...');

		} else if (str.startsWith('go to ') || str.startsWith('goto ')) {
			if (str.startsWith('go to')) {
				url = str.replace('go to ', '').split(' ').join('');
			} else if (str.startsWith('goto')) {
				url = str.replace('goto ', '').split(' ').join('');
			}

			if (url.indexOf('.') === -1) {
				url += '.com';
			}
			sound1 = new Howl({
				urls: ['assets/module-specific/audio/Core/New-Tab.wav'],
				onend: function() {
					window.open('https://www.' + url, '_blank');
				}
			}).play();
			addConvo('Opening new tab in 3, 2, 1...');

		} else if (str === 'hello' || str === 'hey' || str === 'hi' || str === 'hello jarvis' || str === 'hey jarvis' || str === 'hi jarvis') {
			var response = ['Hello.', 'Hey.', 'Hi.'][Math.floor(Math.random() * 3)];
			switch (response) {
				case 'Hello.':
					url = 'assets/module-specific/audio/Core/Hello.wav';
					break;
				case 'Hey.':
					url = 'assets/module-specific/audio/Core/Hey.wav';
					break;
				case 'Hi.':
					url = 'assets/module-specific/audio/Core/Hi.wav';
					break;
			}
			sound1 = new Howl({
				urls: [url],
				onend: function() {
					var sound2 = new Howl({
						urls: ['assets/module-specific/audio/Core/Assistance.wav']
					}).play();
				}
			}).play();

			addConvo(response + ' May I be of assistance?');

	} else if (str.startsWith('go to ')) {
		console.log('go to');

	} else if (str.split('/')[0] === 'what is trending on r' || str.split('/')[0] === 'what is hot on r' || str.split('/')[0] === 'what is new on r' || str.split('/')[0] === 'what is interesting on r') {
			var redditJSON = '/hot.json?limit=10';
			var comments = 's';

			if (str.split('/')[0] === 'what is new on r') {
				redditJSON = '/new.json?limit=10';
			}

			$.getJSON('https://www.reddit.com/r/' + str.split('/')[1].split(' ').join('') + redditJSON, function(json) {
				var divText = '<div class="list"><div class="title"><b>trending</b> on <a href="https://www.reddit.com/r/' + str.split('/')[1].split(' ').join('') + '"><b>r/' + str.split('/')[1].split(' ').join('') + '</b></a></div>';
				for (var i = 0, len = json.data.children.length; i < len; i++) {
					if(!json.data.children[i].data.stickied) {
						if (json.data.children[i].data.num_comments === 1) {
							comments = '';
						} else if (json.data.children[i].data.num_comments !== 1) {
							comments = 's';
						}
						divText += '<div class="item"><div class="title"><a href="' + json.data.children[i].data.url + '">' + json.data.children[i].data.title + '</a></div> <div class="meta">' + json.data.children[i].data.score + ' points | <a href="https://www.reddit.com' + json.data.children[i].data.permalink + '">' + json.data.children[i].data.num_comments + ' comment' + comments + '</a> | ' + moment.unix(json.data.children[i].data.created_utc).fromNow() + '</div></div>';
					}
				}
				divText += '</div>';
				var response = ['I believe this is what you requested.', 'Here you go.', 'Got it. Here you go.'][Math.floor(Math.random() * 3)];
				var url;

				switch (response) {
					case 'I believe this is what you requested.':
						url = 'assets/module-specific/audio/Core/Request.wav';
						break;
					case 'Here you go.':
						url = 'assets/module-specific/audio/Core/Here-you-go.wav';
						break;
					case 'Got it. Here you go.':
						url = 'assets/module-specific/audio/Core/Got-It.wav';
				}

				var sound1 = new Howl({
					urls: [url]
				}).play();

				addConvo(response);
				addDiv(divText);
			}).fail(function(d, status, error) {
				$('#result').empty();
				console.log('reddit failed');
				var url;
				if (error === 'Forbidden') {
					addConvo('It appears the subreddit you are trying to access is private. Sorry.');
					url = 'assets/module-specific/audio/Core/Subreddit-Private.wav';
				} else if (error === 'Not Found') {
					addConvo('I don\'t think that subreddit exists. Sorry.');
					url = 'assets/module-specific/audio/Core/Subreddit-Exists.wav';
				} else if (status === 'error' && !error) {
					addConvo('I wasn\'t able to do that. It\'s possible that the subreddit doesn\'t exist. Sorry.');
					url = 'assets/module-specific/audio/Core/Subreddit-Unknown.wav';
				}
				var sound1 = new Howl({
					urls: [url]
				}).play();
			});
		} else if (str.startsWith('should i watch')) {
			$.ajax({
				type: 'GET',
			    url: 'http://www.omdbapi.com/?t=' + encodeURIComponent(str.split('should i watch ').join('')) + '&plot=short&r=json&tomatoes=true',
			}).done(function(data) {
				var realdata = data;
				if (realdata.Error !== 'Movie not found!' || realdata.Type === 'episode') {
					if (realdata.Type === 'movie') {
						realdata.type = 'Film';
					} else if (realdata.Type === 'series') {
						realdata.type = 'TV Series';
					}

					var reviews = '<div class="reviews">', sum = 0, count = 0;
					if (realdata.imdbRating !== 'N/A') {
						reviews += '<div class="review">IMDB: ' + realdata.imdbRating + '/10</div>';
						sum += parseFloat(realdata.imdbRating) * 10;
						count++;
					}

					if(realdata.tomatoMeter !== 'N/A') {
						reviews += '<div class="review">Rotten Tomatoes: ' + realdata.tomatoMeter + '/100</div>';
						sum += parseFloat(realdata.tomatoMeter);
						count++;
					}

					if(realdata.Metascore !== 'N/A') {
						reviews += '<div class="review">Metacritic: ' + realdata.Metascore + '/100</div>';
						sum += parseFloat(realdata.Metascore);
						count++;
					}

					reviews += '<br><div class="review">Average: ' + Math.round(sum / count * 100) / 100 + '%</div></div>';

					var convoText = '<div class="movie box"><div class="title">' + realdata.Title + '</div><div class="subtitle">' + realdata.Year + ' ' + realdata.type + '</div><div class="description">' + realdata.Plot + '</div>' + reviews + '</div>';
					var sound1 = new Howl({
						urls: ['assets/module-specific/audio/Core/What-I-Could-Find.wav']
					}).play();
					addConvo('Here is what I could find:');
					addDiv(convoText);
				} else {
					addConvo('Sorry, I couldn\'t find that movie.');
				}
			});
		} else if (str === 'tell me a joke' || str === 'make me laugh' || str === 'be funny') {
			var joke = Math.floor(Math.random() * 10);
			switch (joke) {
				case 0:
					// Howl joke 0
					break;
				case 1:
					// Howl joke 1
					break;
				case 2:
					// Howl joke 2
					break;
				case 3:
					// Howl joke 3
					break;
				case 4:
					// Howl joke 4
					break;
				case 5:
					// Howl joke 5
					break;
				case 6:
					// Howl joke 6
					break;
				case 7:
					// Howl joke 7
					break;
				case 8:
					// Howl joke 8
					break;
				case 9:
					// Howl joke 9
			}
			addConvo([
				/*0*/'The last thing I want to do is hurt you, but it\'s still on the list.',
				/*1*/'The early bird might get the worm, but the second mouse gets the cheese.',
				/*2*/'I think my neighbour\'s stalking me because she\'s been Googling my name. I saw it through my telescope last night.',
				/*3*/'I hate when I\'m about to hug someone really attractive and I hit the mirror.',
				/*4*/'Apparently, I snore so loudly that it scares everyone in the car I\'m driving.',
				/*5*/'I used to think that I was indecisive, but now I\'m not sure.',
				/*6*/'There are three kinds of people in this world. Those who can count and those who can\'t.',
				/*7*/'I like birthdays, but like everything else: too much will kill you.',
				/*8*/'There\'s two types of people in this world. Those who finish their sentences',
				/*9*/'Woman shouldn\'t have children after 35. Really ... 35 is enough.'
				][joke]);
			console.log(joke);
		} else {
			globals.found = false;
		}
	};

	globals.allModules[1].parse = function(str) {
		if (str === 'what is trending on hacker news' || str === 'what is hot on hacker news') {
			$.getJSON('http://hnify.herokuapp.com/get/top/', function(json) {
				var comments = 's';
				var convoText = '<div class="list"><div class="title"><b>trending</b> on <a href="https://news.ycombinator.com/"><b>Hacker News</b></a></div>';
				for (var i = 0; i < 10; i++) {
					if (json.stories[i].num_comments === 1) {
						comments = '';
					} else {
						comments = 's';
					}
					convoText += '<div class="item"><div class="title"><a href="' + json.stories[i].link + '">' + json.stories[i].title + '</a></div><div class="meta">' + json.stories[i].points + ' points | <a href="' + json.stories[i].comments_link + '">' + json.stories[i].num_comments + ' comment' + comments + '</a> | ' + json.stories[i].published_time + '</div></div>';
				}
				var response = ['I believe this is what you requested.', 'Here you go.', 'Got it. Here you go.'][Math.floor(Math.random() * 3)];
				var url;

				switch (response) {
					case 'I believe this is what you requested.':
						url = 'assets/module-specific/audio/Core/Request.wav';
						break;
					case 'Here you go.':
						url = 'assets/module-specific/audio/Core/Here-you-go.wav';
						break;
					case 'Got it. Here you go.':
						url = 'assets/module-specific/audio/Core/Got-It.wav';
				}

				var sound1 = new Howl({
					urls: [url]
				}).play();
				addConvo(response);
				addDiv(convoText);
			});
		} else if (str.startsWith('get me the docs for ') || str.startsWith('get me the documentation for ')) {
			var startwith;

			if (str.startsWith('get me the docs for ')) {
				startwith = 'get me the docs for ';
			} else if (str.startsWith('get me the documentation for ')) {
				startwith = 'get me the documentation for ';
			}
			$.getJSON('assets/module-specific/webdev-docs.json', function(data) {
				console.log(typeof data[str.split(startwith).slice(1)[0]]);
				if (typeof data[str.split('get me the docs for ').slice(1)[0]] === 'string') {
					var sound1 = new Howl({
						urls: ['assets/module-specific/audio/Core/Here-you-go.wav']
					}).play();
					addConvo('Here you go: <a href="' + data[str.split('get me the docs for ').slice(1)[0]] + '">' + data[str.split('get me the docs for ').slice(1)[0]] + '</a>');
				} else {
					addConvo('I don\'t know about that library. Sorry.');
				}
			});
		} else {
			globals.found = false;
		}
	};

	$('input[type="checkbox"]').change(function() {
		$(this).toggleClass('checked');

		globals.modules = [0];
		for (var i = 0, len = $('.checked').length; i < len; i++) {
			globals.modules.push(parseInt($('.checked')[i].id.slice(9)));
		}
		console.log(globals.modules);
	});

	function parse(str) {
		for (var i = 0; i < globals.modules.length; i++) {
			for (var ii = 0; ii < globals.allModules.length; ii++) {
				if (globals.modules[i] === ii) {
					globals.allModules[i].parse(str);
				}
			}
		}

		$('#loading').fadeOut(100);

		if (globals.found === false) {
			addConvo('Sorry, I couldn\'t figure out what you wanted me to do. I\'ll bring you to a Google Search instead.');
			sound1 = new Howl({
				urls: ['assets/module-specific/audio/Core/No-Go.wav'],
				onend: function() {
					addConvo('Opening new tab in 3, 2, 1...');
					var sound2 = new Howl({
						urls: ['assets/module-specific/audio/Core/New-Tab.wav'],
						onend: function() {
							window.open('https://www.google.ca/search?q=' + str, '_blank');
						}
					}).play();
				}
			}).play();
			addConvo('Opening new tab in 3, 2, 1...');

		}

	}

	$('#input').keypress(function(e) {
		if (e.keyCode === 13) {
			$('#conversation div').fadeOut(100, function() {
				$(this).remove();
			});

			setTimeout(function() {
				globals.conversation.push({speaker: 'user', text: '<div class="user">' + $('#input').val().charAt(0).toUpperCase() + $('#input').val().slice(1) + '</div>'});
				$('<div class="user">' + $('#input').val().charAt(0).toUpperCase() + $('#input').val().slice(1) + '</div>').hide().appendTo('#conversation').fadeIn(200);
				setTimeout(function() {
					$('#loading').fadeIn(100);
					parse(parseReady($('#input').val()));
				}, 500);
			}, 200);
		}
	});

	// should only run recognition code if there is browser support
	if (globals.recognition) {
		console.log('Speech recognition is supported in this browser.');

		// called when recognition is started
		globals.recognition.onstart = function() {
			console.log('Recognition started.');
			$('#microphone-button').addClass('recording');
			$('#microphone-button .fa').addClass('recording');
		};

		// called when a result is found
		globals.recognition.onresult = function(event) {
			// result is only true if confidence is pretty good
			if (event.results[0][0].confidence > 0.6) {
				globals.result = true;
				console.log('Recognition result detected.');

				$('#conversation div').fadeOut(100, function() {
					$(this).remove();
				});


				setTimeout(function() {
					var convo = {speaker: 'user'};
					convo.text = event.results[0][0].transcript.charAt(0).toUpperCase() + event.results[0][0].transcript.slice(1);
					globals.conversation.push(convo);
					console.log('User said \'' + convo.text + '\'.');

					$('<div class="user">' + convo.text + '</div>').hide().appendTo('#conversation').fadeIn(200);
					setTimeout(function() {
						$('#loading').fadeIn(100);
						parse(parseReady(convo.text));
					}, 500);
				}, 200);

			} else {
				console.log('Result rejected, due to lack of confidence. Condidence: ' + event.results[0][0].confidence);
			}
		};

		// called when recognition is ended
		globals.recognition.onend = function() {
			// checks if there was confident result
			$('#microphone-button').removeClass('recording');
			$('#microphone-button .fa').removeClass('recording');
			if (!globals.result) {
				var text = ['Could you repeat that again?', 'Sorry, do you mind repeating that again?'][Math.floor(Math.random() * 2)];
				var sound1, url;
				switch (text) {
					case 'Could you repeat that again?':
						url = 'assets/module-specific/audio/Core/Repeat1.wav';
						break;
					case 'Sorry, do you mind repeating that again?':
						url = 'assets/module-specific/audio/Core/Repeat2.wav';
						break;
				}
				sound1 = new Howl({
					urls: [url],
					onend: function() {
						globals.recognition.start();
					}
				}).play();
				addConvo(text);
			}

			globals.result = false;
			console.log('Recognition ended.');
		};

		// initializing function
		init = function() {
			$('#microphone-button').hover(function() {
				$(this).addClass('hover');
				$('#microphone-button .fa').addClass('hover');
			}, function() {
				$(this).removeClass('hover');
				$('#microphone-button .fa').removeClass('hover');
			});

			$('#microphone-button').click(function() {
				globals.recognition.start();
			});
		};
	} else {
		console.log('Speech recognition is not supported in this browser.');
	}

	// Let's initialize everything
	init();

	app.globals = globals;
	app.init = init;

	return app;
};

App();
