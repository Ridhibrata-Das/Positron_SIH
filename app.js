const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000; // You can change this if needed

const OPENAI_API_KEY = 'sk-4MFy5CecNyjA2qdh9lZmVrrPb0q1amnIPED0el5b-KT3BlbkFJgcB72y1gNP8E-JTQgpk4cH12hZGZMfZDqaVwNesKAA';

app.use(express.json());

// AI queries
app.post('/ai-query', async (req, res) => {
    const userQuery = req.body.query; // Get the user's query from the request

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: userQuery }],
            max_tokens: 150
        }, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const aiResponse = response.data.choices[0].message.content; // Get AI's response
        res.json({ response: aiResponse }); // Send the response back to the frontend
    } catch (error) {
        console.error('Error with OpenAI API:', error);
        res.status(500).send('Error generating AI response');
    }
});

// frontend files
app.use(express.static('public'));

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
