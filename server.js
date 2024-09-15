const express = require('express');
const { handleSpeechQuery } = require('./chatBackend'); // Import the function from chatBackend.js
const app = express();

app.use(express.json()); // To parse JSON request bodies

// API route for handling ChatGPT queries
app.post('/api/chat', async (req, res) => {
    const { question } = req.body;

    try {
        const response = await handleSpeechQuery(question); // Get response from ChatGPT and MongoDB function
        res.json({ answer: response });
    } catch (error) {
        res.status(500).send('Error processing the request');
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
