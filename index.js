const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

// Replace with your DeepAI API Key
const DEEP_AI_API_KEY = '814425f0-9739-4d36-a8a8-94898630fb03';

app.use(express.json());

app.get('/mahabub', async (req, res) => {
    const { url, prompt } = req.query;

    if (!url || !prompt) {
        return res.status(400).send({ error: 'Both image URL and prompt are required.' });
    }

    try {
        const response = await axios.post('https://api.deepai.org/api/text2img', {
            text: prompt,
            image: url
        }, {
            headers: { 'api-key': DEEP_AI_API_KEY },
        });

        if (response.data && response.data.output_url) {
            res.json({ image: response.data.output_url });
        } else {
            res.status(500).send({ error: 'Unexpected response from DeepAI API.' });
        }
    } catch (error) {
        console.error('Error:', error.message || error);  // Log the error for debugging
        res.status(500).send({ error: 'Failed to process the image. Check the logs for more details.' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
