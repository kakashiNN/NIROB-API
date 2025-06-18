const express = require("express");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const app = express();

// Import YouTube functions (must exist in `yt.js`)
const {
  search,
  ytmp3,
  ytmp4,
  transcript,
  ytdlv2,
  channel,
} = require("./yt");

// Drive upload helper
async function uploadToDrive(fileUrl) {
  const driveApi = "https://glowing-octo-computing-machine-seven.vercel.app/api/upload?url=" + encodeURIComponent(fileUrl);
  try {
    const { data } = await axios.get(driveApi);
    return data?.directLink || null;
  } catch {
    return null;
  }
}

// Vercel-specific handler
module.exports = async (req, res) => {
  const { url, quality, q, format, id } = req.query;
  const route = req.url.split("?")[0];

  if (route === "/ytmp3") {
    try {
      const result = await ytmp3(url, quality);
      if (result?.download?.url) {
        const driveUrl = await uploadToDrive(result.download.url);
        result.download.driveUrl = driveUrl || result.download.url;
      }
      return res.json(result);
    } catch (err) {
      return res.status(500).json({ status: false, error: err.message });
    }
  }

  if (route === "/ytmp4") {
    try {
      const result = await ytmp4(url, quality);
      if (result?.download?.url) {
        const driveUrl = await uploadToDrive(result.download.url);
        result.download.driveUrl = driveUrl || result.download.url;
      }
      return res.json(result);
    } catch (err) {
      return res.status(500).json({ status: false, error: err.message });
    }
  }

  if (route === "/search") {
    const result = await search(q);
    return res.json(result);
  }

  if (route === "/transcript") {
    const result = await transcript(url);
    return res.json(result);
  }

  if (route === "/ytdlv2") {
    const result = await ytdlv2(url, format);
    return res.json(result);
  }

  if (route === "/channel") {
    const result = await channel(id);
    return res.json(result);
  }

  // Home or fallback
  return res.status(404).json({
    status: false,
    message: "Invalid endpoint. Try /ytmp3 or /ytmp4 with ?url=",
  });
};
