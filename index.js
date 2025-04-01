const express = require("express");
const ytdl = require("ytdl-core");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());

// Read cookies from ck.txt file
const youtubeCookie = fs.readFileSync("ck.txt", "utf8").trim();

app.get("/download", async (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) return res.status(400).json({ error: "URL is required" });

    try {
        const info = await ytdl.getInfo(videoUrl, {
            requestOptions: { headers: { Cookie: youtubeCookie } }
        });

        const title = info.videoDetails.title.replace(/[^\w\s]/gi, "");
        res.setHeader("Content-Disposition", `attachment; filename="${title}.mp3"`);
        res.setHeader("Content-Type", "audio/mpeg");

        ytdl(videoUrl, { 
            filter: "audioonly", 
            quality: "highestaudio", 
            requestOptions: { headers: { Cookie: youtubeCookie } }
        }).pipe(res);
    } catch (error) {
        res.status(500).json({ error: "Failed to download audio", details: error.message });
    }
});

app.get("/", (req, res) => {
    res.send("YouTube Audio Downloader API is running!");
});

module.exports = app;
