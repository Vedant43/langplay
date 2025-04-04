from fastapi import FastAPI, UploadFile, File
import shutil
import os

from .utils import get_video_duration
from .transcriber import transcribe_locally, transcribe_with_openai

app = FastAPI()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/transcribe/")
async def transcribe_video(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    duration = get_video_duration(file_path)

    if duration <= 300:
        text = transcribe_locally(file_path)
    else:
        text = transcribe_with_openai(file_path)

    return {"transcript": text}
