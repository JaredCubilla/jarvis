
if (typeof String.prototype.startsWith !== 'function') {
  String.prototype.startsWith = function (str){
  	'use strict';
    return (this.slice(0, str.length) === str);
  };
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

	globals.modules = [0];
	globals.allModules = [
		{name: 'core', description: 'Includes all basic features for Jarvis. Only mandatory module.'},
		{name: 'webdev', description: 'Includes features for web developers and web designers, such as docs for popular libraries, placeholder text/images, and trending dev news.'}
	];

	function addConvo(str) {
		globals.conversation.push({speaker: 'jarvis', text: str});
		$('#result').html(str);
	}

	function parseReady(str) {
		var parsedText = str.toLowerCase().split(',').join('');
		if (parsedText.split(' ')[0] === 'jarvis' || parsedText.split(' ')[0] === 'jervis') {
			parsedText = parsedText.replace('jarvis', '');
		}

		parsedText = parsedText.split('underscore').join('_');
		parsedText = parsedText.split('what\'s').join('what is');
		console.log('Parsed string: ' + parsedText);
		return parsedText;
	}

	globals.allModules[0].parse = function(str) {
		if (str === 'what time is it' || str === 'what time is it now') {
			addConvo(moment().format('h:mmA'));
		} else if (str.split('/')[0] === 'what is trending on r' || str.split('/')[0] === 'what is hot on r' || str.split('/')[0] === 'what is new on r' || str.split('/')[0] === 'what is interesting on r') {
			var redditJSON = '/hot.json?limit=10';
			var comments = 's';

			if (str.split('/')[0] === 'what is new on r') {
				redditJSON = '/new.json?limit=10';
			}

			$.getJSON('https://www.reddit.com/r/' + str.split('/')[1].split(' ').join('') + redditJSON, function(json) {
				var convoText = '<div class="list"><div class="title"><b>trending</b> on <a href="https://www.reddit.com/r/' + str.split('/')[1].split(' ').join('') + '"><b>r/' + str.split('/')[1].split(' ').join('') + '</b></a></div>';
				for (var i = 0, len = json.data.children.length; i < len; i++) {
					if(!json.data.children[i].data.stickied) {
						if (json.data.children[i].data.num_comments === 1) {
							comments = '';
						} else if (json.data.children[i].data.num_comments !== 1) {
							comments = 's';
						}
						convoText += '<div class="item"><div class="title"><a href="' + json.data.children[i].data.url + '">' + json.data.children[i].data.title + '</a></div> <div class="meta">' + json.data.children[i].data.score + ' points | <a href="https://www.reddit.com' + json.data.children[i].data.permalink + '">' + json.data.children[i].data.num_comments + ' comment' + comments + '</a> | ' + moment.unix(json.data.children[i].data.created_utc).fromNow() + '</div></div>';
					}
				}
				convoText += '</div>';
				addConvo(convoText);
			}).fail(function(d, status, error) {
				$('#result').empty();
				console.log('reddit failed');
				if (error === 'Forbidden') {
					addConvo('It appears the subreddit you are trying to access is private. Sorry.');
				} else if (error === 'Not Found') {
					addConvo('I don\'t think that subreddit exists. Sorry.');
				} else if (status === 'error' && !error) {
					addConvo('I wasn\'t able to do that. It\'s possible that the subreddit doesn\'t exist. Sorry.');
				}
			});
		} else if (str.split(' ')[0] === 'calculate' || str.split(' ')[0] === 'compute') {
			var calculateText = str.split(' ');
			if (str.split(' ')[1] === 'the') {
				calculateText = calculateText.splice(1, 1);
			}
			calculateText = calculateText.join('+');
			$.get('https://www.calcatraz.com/calculator/api?c=' + calculateText, function(data) {
				console.log(data);
			});
		} else if (str.startsWith('should i watch')) {
			console.log(str.split('should i watch ').join(''));
			$.ajax({
				type: 'POST',
			    url: 'https://byroredux-metacritic.p.mashape.com/find/movie?retry=4&title=Interstellar',
			    headers: {'X-Mashape-Key': 'ufgugDhX2Qmsh6AyUSNw0dDrsHRlp19B8MvjsnTrGDJw6NeQ8u', 'Content-Type': 'application/x-www-form-urlencoded'},
			}).done(function(data) {
				console.log(data);
			});
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
				addConvo(convoText);
			});
		} else if ((str.split('get me the docs for').slice(1).length === 1 && str.split('get me the docs for ').slice(1)[0] !== '') || (str.split('get me the documentation for').slice(1).length === 1 && str.split('get me the documentation for ').slice(1)[0] !== '')) {
			$.getJSON('assets/module-specific/webdev-docs.json', function(data) {
				console.log(typeof data[str.split('get me the docs for ').slice(1)[0]]);
				if (typeof data[str.split('get me the docs for ').slice(1)[0]] === 'string') {
					addConvo('<a href="' + data[str.split('get me the docs for ').slice(1)[0]] + '">' + data[str.split('get me the docs for ').slice(1)[0]] + '</a>');
				} else {
					addConvo('I don\'t know about that library. Sorry.');
				}
			});
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
	}

	$('#input').keypress(function(e) {
		if (e.keyCode === 13) {
			parse(parseReady($('#input').val()));
		}
	});

	// should only run recognition code if there is browser support
	if (globals.recognition) {
		console.log('Speech recognition is supported in this browser.');

		// called when recognition is started
		globals.recognition.onstart = function() {
			console.log('Recognition started.');
		};

		// called when a result is found
		globals.recognition.onresult = function(event) {
			// result is only true if confidence is pretty good
			if (event.results[0][0].confidence > 0.6) {
				globals.result = true;
				console.log('Recognition result detected.');

				// pushing this piece of conversation to the conversation object
				var convo = {speaker: 'user'};
				convo.text = event.results[0][0].transcript.charAt(0).toUpperCase() + event.results[0][0].transcript.slice(1);
				globals.conversation.push(convo);
				console.log('User said \'' + convo.text + '\'.');

				parse(parseReady(convo.text));

			} else {
				console.log('Result rejected, due to lack of confidence. Condidence: ' + event.results[0][0].confidence);
			}
		};

		// called when recognition is ended
		globals.recognition.onend = function() {
			// checks if there was confident result
			if (!globals.result) {
				console.log('No result. Starting recognition again.');
				globals.recognition.start();
			}

			globals.result = false;
			console.log('Recognition ended.');
		};

		// initializing function
		init = function() {
			document.getElementById('microphone-button').addEventListener('click', function(event) {
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
