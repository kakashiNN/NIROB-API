const express = require("express");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 3000;

// Import your functions
const {
  search,
  ytmp3,
  ytmp4,
  transcript,
  ytdlv2,
  channel
} = require("./yt");

// Ensure 'public' folder exists
const publicDir = path.join(__dirname, "public");
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

// Middleware
app.use(express.json());
app.use(express.static(publicDir)); // for MP3 files, thumbnails, etc.

// Routes

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "MAHABUB", "Mahabub.html"));
});


app.get("/search", async (req, res) => {
  const { q } = req.query;
  const result = await search(q);
  res.json(result);
});

app.get("/cdn", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ status: false, error: "Missing URL" });

  try {
    const audioQualities = ["320kbps", "256kbps", "192kbps", "128kbps"];
    const videoQualities = ["1080p", "720p", "480p", "360p", "240p"];

    let audioResult = null;
    for (const quality of audioQualities) {
      try {
        const temp = await ytmp3(url, quality);
        if (temp?.download?.url) {
          audioResult = { ...temp, quality };
          break;
        }
      } catch {}
    }

    let videoResult = null;
    for (const quality of videoQualities) {
      try {
        const temp = await ytmp4(url, quality);
        if (temp?.download?.url) {
          videoResult = { ...temp, quality };
          break;
        }
      } catch {}
    }

    if (!audioResult && !videoResult) {
      return res.status(500).json({ status: false, error: "No working quality found." });
    }

    // Extract metadata title and thumbnail safely
    const title =
      audioResult?.metadata?.title ||
      videoResult?.metadata?.title ||
      audioResult?.title ||
      videoResult?.title ||
      "Unknown Title";

    const thumbnail =
      audioResult?.metadata?.image ||
      videoResult?.metadata?.image ||
      audioResult?.thumbnail ||
      videoResult?.thumbnail ||
      null;

    res.json({
      status: true,
      dev: "@‎MR᭄﹅ MAHABUB﹅ メꪜ",
      devfb: "https://www.facebook.com/www.xnxx.com140",
      title,
      thumbnail,
      cdna: audioResult?.download?.url || null,
      cdnv: videoResult?.download?.url || null,
      audioQuality: audioResult?.quality || null,
      videoQuality: videoResult?.quality || null
    });
  } catch (err) {
    res.status(500).json({ status: false, error: err.message });
  }
});


app.get("/ytmp3", async (req, res) => {
  const { url, quality } = req.query;
  try {
    const result = await ytmp3(url, quality);
    if (result?.download?.url) {
      const fileUrl = result.download.url;
      let filename = result.download.filename.replace(/[/\\?%*:|"<>]/g, "");
      if (!filename.endsWith(".mp3")) filename += ".mp3";
      const filePath = path.join(publicDir, filename);

      if (!fs.existsSync(filePath)) {
        const response = await axios({
          method: "GET",
          url: fileUrl,
          responseType: "stream",
          headers: { "User-Agent": "Mozilla/5.0" }
        });

        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);
        await new Promise((resolve, reject) => {
          writer.on("finish", resolve);
          writer.on("error", reject);
        });
      }

      result.download.url = `${req.protocol}://${req.get("host")}/${encodeURIComponent(filename)}`;
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ status: false, error: err.message });
  }
});

app.get("/ytmp4", async (req, res) => {
  const { url, quality } = req.query;
  try {
    const result = await ytmp4(url, quality);
    if (result?.download?.url) {
      const fileUrl = result.download.url;
      let filename = result.download.filename.replace(/[/\\?%*:|"<>]/g, "");
      if (!filename.endsWith(".mp4")) filename += ".mp4";
      const filePath = path.join(publicDir, filename);

      if (!fs.existsSync(filePath)) {
        const response = await axios({
          method: "GET",
          url: fileUrl,
          responseType: "stream",
          headers: { "User-Agent": "Mozilla/5.0" }
        });

        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);
        await new Promise((resolve, reject) => {
          writer.on("finish", resolve);
          writer.on("error", reject);
        });
      }

      // Use /video/ route for proper streaming
      result.download.url = `${req.protocol}://${req.get("host")}/video/${encodeURIComponent(filename)}`;
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ status: false, error: err.message });
  }
});

app.get("/transcript", async (req, res) => {
  const { url } = req.query;
  const result = await transcript(url);
  res.json(result);
});

app.get("/ytdlv2", async (req, res) => {
  const { url, format } = req.query;
  const result = await ytdlv2(url, format);
  res.json(result);
});

app.get("/channel", async (req, res) => {
  const { id } = req.query;
  const result = await channel(id);
  res.json(result);
});

// Serve MP4 files properly via /video/:filename
app.get("/video/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(publicDir, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("Video not found");
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    const chunksize = end - start + 1;
    const file = fs.createReadStream(filePath, { start, end });

    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "video/mp4"
    });
    file.pipe(res);
  } else {
    res.writeHead(200, {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4"
    });
    fs.createReadStream(filePath).pipe(res);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
