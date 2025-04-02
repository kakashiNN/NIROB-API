import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { url, prompt } = req.query;

  if (!url || !prompt) {
    return res.status(400).json({ error: "Missing required parameters: url and prompt" });
  }

  try {
    const response = await axios.post(
      "https://api.deepai.org/api/text2img",
      { image: url, text: prompt },
      {
        headers: { "Api-Key": process.env.DEEPAI_API_KEY }
      }
    );

    if (!response.data || !response.data.output_url) {
      return res.status(500).json({ error: "DeepAI API did not return an image." });
    }

    return res.status(200).json({
      success: true,
      modified_image: response.data.output_url
    });

  } catch (error) {
    console.error("DeepAI API Error:", error.response?.data || error.message);

    return res.status(500).json({
      error: "Failed to modify image",
      details: error.response?.data || error.message
    });
  }
}
