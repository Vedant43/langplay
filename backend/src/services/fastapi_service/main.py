from fastapi import FastAPI, UploadFile, File, HTTPException
import shutil
import os
from pydantic import BaseModel, Field
import requests
from openai import OpenAI
from utils import get_video_duration
from utils import extract_audio
from utils import chunk_transcript
from utils import generate_quiz_for_chunk
from utils import download_audio_from_youtube
from transcriber import transcribe_locally, transcribe_with_openai
from openai_client import client
import time

app = FastAPI()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

class TranscribeRequest(BaseModel):
    video_url: str = Field(..., alias="videoUrl")

    class Config:
        allow_population_by_field_name = True

@app.post("/generate-transcribe/")
async def transcribe_video(req: TranscribeRequest):
    start_time = time.time()
    video_url = req.video_url
    audio_path = None
    temp_dir = None

    try:
        print(f"📥 Processing video URL: {video_url}")
        
        # Download with more detailed error handling
        try:
            audio_path = download_audio_from_youtube(video_url)
            print(f"✅ Downloaded audio to: {audio_path}")
            temp_dir = os.path.dirname(audio_path)  # Save dir path for cleanup
        except Exception as download_error:
            print(f"❌ Download failed: {str(download_error)}")
            raise HTTPException(status_code=400, detail=f"Failed to download audio: {str(download_error)}")
            
        if not audio_path or not os.path.exists(audio_path):
            raise HTTPException(status_code=500, detail="Failed to download audio: audio path is invalid")

        # Get duration with better error handling
        try:
            duration = get_video_duration(audio_path)
            print(f"ℹ️ Video duration: {duration:.2f} seconds")
        except Exception as duration_error:
            print(f"❌ Failed to get duration: {str(duration_error)}")
            raise HTTPException(status_code=500, detail=f"Failed to process audio: {str(duration_error)}")

        # Try transcription with fallback mechanism
        try:
            # First try local if short enough
            if duration <= 300:  # 13 minutes
                print("🔄 Using local transcription")
                try:
                    text = transcribe_locally(audio_path)
                except Exception as local_error:
                    print(f"⚠️ Local transcription failed: {str(local_error)}")
                    print("🔄 Falling back to OpenAI transcription")
                    text = transcribe_with_openai(audio_path)
            else:
                print("🔄 Using OpenAI transcription")
                text = transcribe_with_openai(audio_path)
                
            if not text or not isinstance(text, str):
                raise ValueError("Transcription produced invalid output")
                
            print(f"✅ Transcription complete: {len(text)} characters")
        except Exception as transcribe_error:
            print(f"❌ Transcription failed: {str(transcribe_error)}")
            raise HTTPException(status_code=500, detail=f"Transcription failed: {str(transcribe_error)}")

        transcript_time = time.time() - start_time
        print(f"⏱️ Transcript time: {transcript_time:.2f} seconds")

        return {
            "transcript": text,
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

    finally:
        # Clean up temporary files
        if temp_dir and os.path.exists(temp_dir):
            try:
                import shutil
                shutil.rmtree(temp_dir, ignore_errors=True)
                print(f"🧹 Cleaned up temporary directory: {temp_dir}")
            except Exception as cleanup_error:
                print(f"⚠️ Failed to clean up directory {temp_dir}: {str(cleanup_error)}")


class TranscriptIn(BaseModel):
    transcript: str

@app.post("/generate-quiz/")
async def generate_quiz(data: TranscriptIn):
    try:
        start_time = time.time()

        # No chunking, just use full transcript
        quiz = generate_quiz_for_chunk(data.transcript)
        if not quiz:
            raise ValueError("Quiz generation failed")

        quiz_time = time.time() - start_time
        print(f"quiz time: {quiz_time:.2f} seconds")
        return {"quiz": quiz}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")