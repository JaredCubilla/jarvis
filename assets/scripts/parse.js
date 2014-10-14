function parse(str) {
	'use strict';
	var responses, response;
	var strArray = str.split(' ');
	if (strArray[0] === 'jarvis' || strArray[0] === 'jervis') {
		strArray.shift();
	}
	if ((strArray[0] === 'could' || strArray[0] === 'can') && strArray[1] === 'you') {
		strArray.shift();
		strArray.shift();
	}
	switch (strArray[0]) {
		case 'search':
			responses = ['Sure thing.', 'No problem.', 'Can do.', 'Just gimme a sec.'];
			var endpoint, query;
			switch (strArray.slice(1, strArray.indexOf('for')).join(' ')) {
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

			response = responses[Math.floor(Math.random() * responses.length)];

			$('#i').html('Jarvis: ' + response);

			query = strArray.slice(strArray.indexOf('for')+1, strArray.length).join(' ');
			window.open(endpoint + query, '_self');

			break;

		case 'goodbye':
		case 'bye':
			responses = ['See ya soon.', 'Goodbye!', 'I\'ll miss you! Bye!'];
			window.close();
			break;
	}
}