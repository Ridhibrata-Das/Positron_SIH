// Modify speechAI.js to send user query to the backend and get a response from ChatGPT

const micIcon = document.getElementById('mic');
const searchBar = document.getElementById('search-bar');
const searchButton = document.getElementById('search-btn');

const synth = window.speechSynthesis;
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

recognition.interimResults = false;
recognition.lang = 'en-US';

// Event listener to start speech recognition
micIcon.addEventListener('click', () => {
    recognition.start();
});

recognition.addEventListener('result', async (e) => {
    const speechResult = e.results[0][0].transcript;
    searchBar.value = speechResult;
    const response = await sendQueryToBackend(speechResult);
    speak(response);
});

// Event listener to handle text-based queries
searchButton.addEventListener('click', async () => {
    const userQuery = searchBar.value;
    const response = await sendQueryToBackend(userQuery);
    speak(response);
});

// Function to handle the API request to the backend
async function sendQueryToBackend(query) {
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question: query }),
        });
        const data = await response.json();
        return data.answer;
    } catch (error) {
        console.error('Error fetching from backend:', error);
        return 'I am having trouble processing your request.';
    }
}

// Function to convert text to speech
function speak(responseText) {
    const utterance = new SpeechSynthesisUtterance(responseText);
    synth.speak(utterance);
}
