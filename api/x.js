// api/x.js
import axios from "axios";

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ status: "error", message: "Missing url parameter" });
  }

  try {
    const response = await axios.post(
      'https://xxx.xxvid.download/xxx-download/video-info-v3',
      {
        platform: 'Pornhub',
        url: url,
        app_id: 'pornhub_downloader'
      },
      {
        timeout: 12000, // 8 seconds timeout to avoid Vercel 504
        headers: {
          'authority': 'xxx.xxvid.download',
          'accept': '*/*',
          'accept-language': 'en-US,en;q=0.9',
          'content-type': 'application/json',
          'origin': 'https://pornhubdownloader.io',
          'referer': 'https://pornhubdownloader.io/',
          'sec-ch-ua': '"Chromium";v="137", "Not/A)Brand";v="24"',
          'sec-ch-ua-mobile': '?1',
          'sec-ch-ua-platform': '"Android"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'cross-site',
          'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36'
        }
      }
    );

    const data = response?.data?.data;

    if (!data || !data.videos) {
      return res.status(502).json({
        status: "error",
        message: "Failed to retrieve valid video data"
      });
    }

    const filtered = {
      author: "IMRAN AHMED",
      title: data.title || null,
      thumbnail: data.img || null,
      videos: data.videos.map(v => ({
        quality: v.quality,
        url: v.url
      }))
    };

    return res.status(200).json(filtered);

  } catch (error) {
    const msg = error.code === 'ECONNABORTED'
      ? "Request timeout: source site too slow or unreachable"
      : error.message;

    console.error("API fetch error:", msg);

    return res.status(500).json({
      status: "error",
      message: "Failed to fetch video info",
      error: msg
    });
  }
}
