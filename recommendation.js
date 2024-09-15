// Function to fetch and display Q&A data
async function fetchQAData() {
    try {
        // Fetch the Q&A data from your backend API
        const response = await fetch('/api/qa-data');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        displayQAData(data);
    } catch (error) {
        console.error('Error fetching Q&A data:', error);
        document.querySelector('#qa-section').innerHTML = '<p>Error loading Q&A data. Please try again later.</p>';
    }
}

// Function to display Q&A data on the page
function displayQAData(data) {
    const qaSection = document.querySelector('#qa-section');
    qaSection.innerHTML = ''; // Clear previous content

    data.forEach(item => {
        const qaBox = document.createElement('div');
        qaBox.className = 'qa-box';
        
        const questionElement = document.createElement('p');
        questionElement.className = 'question';
        questionElement.textContent = `Q: ${item.question}`;
        
        const answerElement = document.createElement('p');
        answerElement.className = 'answer';
        answerElement.textContent = `A: ${item.answer}`;

        const timeElement = document.createElement('p');
        timeElement.className = 'time';
        timeElement.textContent = `Date & Time: ${new Date(item.timestamp).toLocaleString()}`;

        qaBox.appendChild(questionElement);
        qaBox.appendChild(answerElement);
        qaBox.appendChild(timeElement);

        qaSection.appendChild(qaBox);
    });
}

// Initialize the page by fetching and displaying Q&A data
document.addEventListener('DOMContentLoaded', fetchQAData);
