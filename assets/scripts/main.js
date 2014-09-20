// Defining recognition, making the webkitSpeechRecognition object.
var recognition = new webkitSpeechRecognition();
var result = false;
var confidence = 0;

// Removing commas, periods, punctuation, making it lowercase.
function parse(str) {
	'use strict';
	
}

console.log(recognition);

recognition.onstart = function(event) {
	'use strict';
	console.log('Begin.');
};

// On result event.
recognition.onresult = function(event) {
	'use strict';
	var sound = new Howl({
		urls: ['http://pause-geek.fr/audio/temp/whatislove.ogg']
	}).play();
	window.result = event.results[0][0].transcript.toLowerCase().replace(/,/g, '');
	window.confidence = event.results[0][0].confidence;

	if (window.confidence > 0.6) {
		$('#test').html(result);
	}
};

recognition.onend = function(event) {
	'use strict';
	if (!window.result || window.confidence < 0.6) {
		console.log('Could you repeat that? Confidence: ' + window.confidence);
		recognition.start();
	}
	window.result = false;
	window.confidence = 0;
	console.log('End.');
};



document.getElementById('microphone-button').addEventListener('click', function(event) {
	'use strict';
	recognition.start();
});