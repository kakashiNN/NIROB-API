from flask import Flask, request, send_file, jsonify
from pytube import YouTube
from pydub import AudioSegment
import os
import re

app = Flask(__name__)

@app.route('/download', methods=['GET'])
def download_mp3():
    try:
        url = request.args.get('url')
        if not url:
            return jsonify({"error": "URL parameter is missing"}), 400

        # Extract the base URL of the YouTube video
        match = re.match(r'(https?://(?:www\.)?youtu\.be/[\w\-]+|https?://(?:www\.)?youtube\.com/watch\?v=[\w\-]+)', url)
        if not match:
            return jsonify({"error": "Invalid YouTube URL"}), 400
        video_url = match.group(0)

        yt = YouTube(video_url)
        stream = yt.streams.filter(only_audio=True).first()
        output_file = stream.download()

        audio = AudioSegment.from_file(output_file)
        mp3_file = output_file.replace('.mp4', '.mp3')
        audio.export(mp3_file, format='mp3')

        os.remove(output_file)

        return send_file(mp3_file, as_attachment=True, download_name='download.mp3')
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run()
