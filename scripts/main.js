var recognition = new webkitSpeechRecognition();

function parse(str) {
	console.log(str);
}

recognition.onresult = function(event) {
    $("#test").html("You just said \"" + event.results[0][0].transcript + "\"");
    parse(event.results[0][0].transcript);
}

document.getElementById('microphone-button').addEventListener('click', function(event) {
	recognition.start();
});