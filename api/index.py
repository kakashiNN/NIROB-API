from fastapi import FastAPI, Query
from fastapi.responses import JSONResponse
import subprocess
import uuid
import os

app = FastAPI()

COOKIES_FILE = "cookies.txt"

@app.get("/download")
async def download_audio(url: str = Query(..., title="YouTube Video URL")):
    if not url:
        return JSONResponse(content={"error": "No URL provided"}, status_code=400)
    
    unique_filename = f"{uuid.uuid4().hex}.mp3"
    output_path = f"/tmp/{unique_filename}"  # Vercel-এর জন্য /tmp ব্যবহার করা হয়
    
    command = [
        "yt-dlp",
        "--extract-audio",
        "--audio-format", "mp3",
        "--output", output_path,
        "--cookies", COOKIES_FILE,
        url
    ]
    
    try:
        subprocess.run(command, check=True)
        return JSONResponse(content={"file_url": f"https://your-vercel-app.vercel.app/api/static/{unique_filename}", "message": "Download successful"})
    except subprocess.CalledProcessError as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.get("/channel")
async def get_channel():
    return {"channel_link": "https://m.youtube.com/mirrykal"}
