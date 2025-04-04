import whisper
import openai
import os

openai.api_key = os.getenv("OPENAI_API_KEY")

local_model = whisper.load_model("base")

def transcribe_locally(video_path: str) -> str:
    result = local_model.transcribe(video_path)
    return result['text']

def transcribe_with_openai(video_path: str) -> str:
    with open(video_path, "rb") as f:
        transcript = openai.Audio.transcribe("whisper-1", f)
    return transcript["text"]
