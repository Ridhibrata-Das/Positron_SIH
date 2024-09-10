// transcript div from the HTML
const micButton = document.getElementById('micButton');
const transcriptDiv = document.getElementById('transcript');

// Speech Recognition API
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-US'; // Set the language
recognition.interimResults = false; // We only care about the final result

// listening
micButton.addEventListener('click', () => {
    recognition.start(); // Start speech recognition
});

// recognized
recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript; // Get the spoken text
    transcriptDiv.textContent = `You said: ${transcript}`; // Display the spoken text
    
    // processing
    processAIResponse(transcript);
};

// request to the backend
function processAIResponse(query) {
    // AI's response, API call
    fetch('/ai-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }) 
    })
    .then(response => response.json()) 
    .then(data => {
        const aiResponse = data.response; 
        transcriptDiv.textContent = `AI Response: ${aiResponse}`; 

        // AI's response 
        speak(aiResponse);
    })
    .catch(error => {
        console.error('Error processing AI response:', error);
    });
}


function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text); // Create a speech object
    window.speechSynthesis.speak(utterance); // Speak out the text
}
