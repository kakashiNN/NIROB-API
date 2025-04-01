from fastapi import FastAPI, Query
from fastapi.responses import JSONResponse
from pytube import YouTube
from pydub import AudioSegment
import uuid
import os
import requests
from io import BytesIO

app = FastAPI()

COOKIES_FILE = "cookies.txt"

@app.get("/download")
async def download_audio(url: str = Query(..., title="YouTube Video URL")):
    if not url:
        return JSONResponse(content={"error": "No URL provided"}, status_code=400)

    try:
        # Use Pytube to download the YouTube video
        yt = YouTube(url)
        video_stream = yt.streams.filter(only_audio=True, file_extension="mp4").first()
        audio_file = video_stream.download(output_path="/tmp", filename="temp_video.mp4")

        # Convert the downloaded audio to MP3 using Pydub
        audio = AudioSegment.from_file(audio_file)
        unique_filename = f"{uuid.uuid4().hex}.mp3"
        mp3_file_path = f"/tmp/{unique_filename}"
        audio.export(mp3_file_path, format="mp3")

        # Return the MP3 file URL
        return JSONResponse(content={"file_url": f"https://your-vercel-app.vercel.app/api/static/{unique_filename}", "message": "Download and conversion successful"})

    except Exception as e:
        return JSONResponse(content={"error": f"An error occurred: {str(e)}"}, status_code=500)

@app.get("/channel")
async def get_channel():
    return {"channel_link": "https://m.youtube.com/mirrykal"}
