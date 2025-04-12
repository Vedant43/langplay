import subprocess
import json
import subprocess
import os
import json
from openai import OpenAI
from openai_client import client
import yt_dlp
import shutil
import tempfile

def download_audio_from_youtube(url: str) -> str:
    # Create temp directory to store files
    temp_dir = tempfile.mkdtemp()
    temp_file_base = os.path.join(temp_dir, "audio")
    
    # Step 1: Define output templates
    # Note: yt-dlp will add extensions automatically
    temp_output = temp_file_base
    
    # Step 2: Configure yt-dlp options
    ydl_opts = {
        "format": "bestaudio/best",
        "outtmpl": temp_output,
        "postprocessors": [
            {
                "key": "FFmpegExtractAudio",
                "preferredcodec": "mp3",
                "preferredquality": "192",
            }
        ],
        # For debugging:
        "quiet": False,  # Set to True in production
        "no_warnings": False,  # Set to True in production
    }
    
    try:
        # Step 3: Download and extract audio
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])
        
        # Step 4: Find the created MP3 file
        # yt-dlp adds extensions and may modify filenames
        mp3_file = None
        for file in os.listdir(temp_dir):
            if file.endswith(".mp3"):
                mp3_file = os.path.join(temp_dir, file)
                break
        
        if not mp3_file or not os.path.exists(mp3_file):
            raise FileNotFoundError(f"No MP3 file found in {temp_dir}")
        
        # Step 5: Convert to WAV with proper parameters for speech recognition
        temp_wav = os.path.join(temp_dir, "audio.wav")
        
        result = subprocess.run(
            [
                "ffmpeg", 
                "-y", 
                "-i", mp3_file, 
                "-ar", "16000",  # 16kHz sample rate for best speech recognition
                "-ac", "1",      # Mono channel
                temp_wav
            ],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
        
        if result.returncode != 0 or not os.path.exists(temp_wav):
            stderr = result.stderr.decode('utf-8')
            raise RuntimeError(f"ffmpeg failed: {stderr}")
        
        return temp_wav
        
    except Exception as e:
        # Clean up temp directory on error
        if os.path.exists(temp_dir):
            shutil.rmtree(temp_dir, ignore_errors=True)
        raise e

def extract_audio(video_path: str, output_audio_path: str):
    cmd = [
        "ffmpeg",
        "-y",  # Overwrite without asking
        "-i", video_path,
        "-ar", "16000",  # Sample rate required by whisper
        "-ac", "1",      # Mono channel
        "-f", "wav",
        output_audio_path
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

def get_video_duration(audio_path: str) -> float:
    if not os.path.exists(audio_path):
        raise FileNotFoundError(f"Audio file not found at path: {audio_path}")

    try:
        cmd = [
            "ffprobe",
            "-v", "error",
            "-show_entries", "format=duration",
            "-of", "json",
            audio_path
        ]
        output = subprocess.check_output(cmd).decode("utf-8")
        duration_data = json.loads(output)

        duration = float(duration_data["format"]["duration"])
        return duration

    except subprocess.CalledProcessError as e:
        raise RuntimeError(f"ffprobe failed: {e}")
    except (KeyError, ValueError, json.JSONDecodeError) as e:
        raise RuntimeError(f"Error parsing ffprobe output: {e}")

# Usage
# duration = get_video_duration("video.mp4")  # Returns seconds (float)

def generate_quiz_for_chunk(chunk: str):
    prompt = f"""
        Text: "{chunk}"

        Make 1 fill-in-the-blank, 1 meaning (MCQ), 1 comprehension (MCQ). Include answers. Format:

        {{
            "fill_blank": "...",
            "fill_blank_answer": "...",
            "meaning_question": "...",
            "meaning_options": ["A", "B", "C", "D"],
            "meaning_answer": "B",
            "comprehension_question": "...",
            "comprehension_options": ["A", "B", "C", "D"],
            "comprehension_answer": "D"
        }}
    """

    res = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}]
    )
    content = res.choices[0].message.content.strip()
    
    try:
        return json.loads(content)  # safe to return a real dict now
    except json.JSONDecodeError:
        print("❌ GPT messed up the JSON. Here's what it gave:\n", content)
        return None

def chunk_transcript(transcript: str, max_chars: int = 500):
    sentences = transcript.split(". ")
    chunks, current_chunk = [], ""

    for sentence in sentences:
        if len(current_chunk) + len(sentence) < max_chars:
            current_chunk += sentence + ". "
        else:
            chunks.append(current_chunk.strip())
            current_chunk = sentence + ". "

    if current_chunk:
        chunks.append(current_chunk.strip())

    return chunks