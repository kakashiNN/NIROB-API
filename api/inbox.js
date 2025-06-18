import axios from "axios";

const API_KEY = "mahabub4x";

const headers = {
  authority: "api.internal.temp-mail.io",
  accept: "*/*",
  "accept-language": "en-US,en;q=0.9",
  "application-name": "web",
  "application-version": "4.0.0",
  "content-type": "application/json",
  origin: "https://temp-mail.io",
  referer: "https://temp-mail.io/",
  "sec-ch-ua": '"Chromium";v="137", "Not/A)Brand";v="24"',
  "sec-ch-ua-mobile": "?1",
  "sec-ch-ua-platform": '"Android"',
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-site",
  "user-agent":
    "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36",
  "x-cors-header": "iaWg3pchvFx48fY",
};

export default async function handler(req, res) {
  const { key, mail } = req.query;

  if (key !== API_KEY) {
    return res.status(401).json({ status: "error", message: "Invalid API key" });
  }

  if (!mail) {
    return res.status(400).json({ status: "error", message: "Missing ?mail= parameter" });
  }

  try {
    const inboxRes = await axios.get(
      `https://api.internal.temp-mail.io/api/v3/email/${encodeURIComponent(mail)}/messages`,
      { headers }
    );

    res.json({
      status: "success",
      email: mail,
      messages: inboxRes.data,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch inbox",
      error: error.response?.data || error.message,
    });
  }
}
