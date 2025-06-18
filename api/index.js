const axios = require("axios");
const path = require("path");

async function handleYTMP(req, res, type) {
  const { url, quality } = req.query;
  if (!url) return res.status(400).json({ status: false, error: "Missing URL" });

  try {
    // Get the CDN download link from external API
    const cdnApi = `https://mahabub-api-delta.vercel.app/api/${type}?url=${encodeURIComponent(url)}&quality=${quality || ""}`;
    const cdnResponse = await axios.get(cdnApi);
    const downloadUrl = cdnResponse.data?.download?.url;

    if (!downloadUrl) {
      return res.status(500).json({ status: false, error: "No download link found." });
    }

    // Upload to Google Drive using your upload API
    const uploadApi = `https://glowing-octo-computing-machine-seven.vercel.app/api/upload?url=${encodeURIComponent(downloadUrl)}`;
    const uploadResponse = await axios.get(uploadApi);
    const { fileId, directLink, name, mimeType } = uploadResponse.data;

    return res.json({
      status: true,
      title: cdnResponse.data?.title || "Unknown",
      type,
      quality: cdnResponse.data?.quality || quality || null,
      driveFileId: fileId,
      driveLink: directLink,
      fileName: name,
      mimeType: mimeType,
      owner: "MAHABUB"
    });
  } catch (err) {
    return res.status(500).json({ status: false, error: err.message });
  }
}

exports.ytmp3drive = async (req, res) => handleYTMP(req, res, "ytmp3");
exports.ytmp4drive = async (req, res) => handleYTMP(req, res, "ytmp4");
