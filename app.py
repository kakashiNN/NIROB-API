from flask import Flask, request, send_file, jsonify
from pytube import YouTube
from pydub import AudioSegment
import os

app = Flask(__name__)

@app.route('/download', methods=['GET'])
def download_mp3():
    try:
        url = request.args.get('url')
        if not url:
            return jsonify({"error": "URL parameter is missing"}), 400

        # Ensure the URL is a valid YouTube URL
        if "youtube.com" not in url and "youtu.be" not in url:
            return jsonify({"error": "Invalid YouTube URL"}), 400

        yt = YouTube(url)
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
