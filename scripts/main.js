var recognition = new webkitSpeechRecognition();
recognition.onstart = function() {console.log('pizza')};
recognition.onresult = function(event) 
{ 
    console.log(event);
}

document.getElementById('microphone-button').addEventListener('click', function(event) {
	recognition.start();
});