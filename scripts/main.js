var recognition = new webkitSpeechRecognition();
recognition.onresult = function(event) {
    $("#test").html("You just said \"" + event.results[0][0].transcript + "\"");
    parse(event.results[0][0].transcript);
}

function parse(str) {
	console.log(str);
}

document.getElementById('microphone-button').addEventListener('click', function(event) {
	recognition.start();
});