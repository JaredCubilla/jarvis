var recognition = new webkitSpeechRecognition();
recognition.onresult = function(event) {
    console.log(event.results[0][0].transcript);
}

document.getElementById('microphone-button').addEventListener('click', function(event) {
	recognition.start();
});