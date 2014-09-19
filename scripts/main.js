    var recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onstart = function() {console.log('pizza')};
    recognition.onresult = function(event) 
    { 
        console.log(event);
    }
    recognition.start();