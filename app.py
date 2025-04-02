const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

app.get('/edit', async (req, res) => {
    try {
        const { url, prompt } = req.query;
        if (!url || !prompt) return res.status(400).json({ error: 'Missing url or prompt' });

        // DeepAI API key (replace with your own)
        const apiKey = 'YOUR_DEEPAI_API_KEY';

        // Make a request to DeepAI Text-to-Image API
        const response = await axios.post('https://api.deepai.org/api/text2img', 
            { text: prompt },
            { headers: { 'api-key': apiKey } }
        );

        // The API will return a URL to the generated image
        const generatedImageUrl = response.data.output_url;

        // Send the generated image URL as the response
        res.json({ image_url: generatedImageUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate image' });
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
