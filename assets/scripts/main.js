// Defining recognition, making the webkitSpeechRecognition object.
var recognition = new webkitSpeechRecognition();
var result = false;
var confidence = 0;

// Removing commas, periods, punctuation, making it lowercase.
function parse(str) {
	'use strict';
	str.toLowerCase();
	str.replace(/r/g, '');
	return str;
}

console.log(recognition);

recognition.onstart = function(event) {
	'use strict';
	console.log('Begin.');
};

// On result event.
recognition.onresult = function(event) {
	'use strict';
	window.result = parse(event.results[0][0].transcript);
	window.confidence = event.results[0][0].confidence;

	if (window.confidence > 0.75) {
		$('#test').html('You just said "' + event.results[0][0].transcript + '"');
	}
};

recognition.onend = function(event) {
	'use strict';
	if (!window.result || window.confidence < 0.75) {
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