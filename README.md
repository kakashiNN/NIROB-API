# Pornhub Video Downloader API (Unofficial)

This is a simple Node.js API built with **Next.js API routes** (or Express-compatible) that fetches and parses video download links from [xxx.xxvid.download](https://xxx.xxvid.download) (unofficial source).

⚠️ **Disclaimer**: This project is for educational and personal use only. The author is **not responsible** for misuse of this code. Downloading copyrighted or adult content may violate local laws.

---

## 🚀 Features
- Fetch video metadata (title, thumbnail, quality).
- Extract direct video download links.
- Handles request timeout and error responses gracefully.
- JSON formatted output for easy integration into apps or bots.

---

## 📂 Project Structure


---

## 🔧 Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/pornhub-downloader-api.git
   cd pornhub-downloader-api

##Endpoint 
   ```GET /api/handler?url=<video-url>```

## Response
  ``` {
  "author": "IMRAN AHMED",
  "title": "Sample Video Title",
  "thumbnail": "https://cdn.phncdn.com/videos/2025/09/28/sample.jpg",
  "videos": [
    {
      "quality": "720p",
      "url": "https://cdn.phncdn.com/video720.mp4"
    },
    {
      "quality": "480p",
      "url": "https://cdn.phncdn.com/video480.mp4"
    }
  ]
}```

