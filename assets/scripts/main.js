var recognition = new webkitSpeechRecognition();

function parse(str) {
	'use strict';
	console.log(str);
}

recognition.onresult = function(event) {
	'use strict';
	$('#test').html('You just said "' + event.results[0][0].transcript + '"');
	parse(event.results[0][0].transcript);
};

document.getElementById('microphone-button').addEventListener('click', function(event) {
	'use strict';
	recognition.start();
});