var recognition = new webkitSpeechRecognition();
recognition.onresult = function(event) {
    console.log(event.results);
}

document.getElementById('microphone-button').addEventListener('click', function(event) {
	recognition.start();
});