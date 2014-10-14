recognition.onstart = function(event) {
	'use strict';
	console.log('Begin.');
};

// On result event.
recognition.onresult = function(event) {
	'use strict';
	window.result = event.results[0][0].transcript.toLowerCase().replace(/,/g, '');
	window.confidence = event.results[0][0].confidence;

	if (window.confidence > 0.6) {
		$('#you').html('You: ' + event.results[0][0].transcript);
		parse(event.results[0][0].transcript.toLowerCase().replace(/,/g, ''));
	}
};

recognition.onend = function(event) {
	'use strict';
	if (!window.result || window.confidence < 0.6) {
		console.log('Could you repeat that? Confidence: ' + window.confidence);
		$('#i').html('Jarvis: Could you repeat that again?')
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