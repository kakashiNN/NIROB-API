const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/edit', async (req, res) => {
    try {
        const { url, prompt } = req.query;
        if (!url || !prompt) return res.status(400).json({ error: 'Missing url or prompt' });

        // DeepAI API key (stored as an environment variable)
        const apiKey = process.env.DEEPAI_API_KEY;

        const response = await axios.post('https://api.deepai.org/api/text2img', 
            { text: prompt },
            { headers: { 'api-key': apiKey } }
        );

        const generatedImageUrl = response.data.output_url;

        res.json({ image_url: generatedImageUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate image' });
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
