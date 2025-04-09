from faster_whisper import WhisperModel
from openai_client import client
# You can also use 'medium', 'large-v2', etc., depending on your needs
# model = WhisperModel("base", compute_type="int8")  # "int8" is good for performance

def transcribe_locally(video_path: str) -> str:
    try:
        # Use a smaller model and more memory-efficient settings
        model_size = "tiny"  # Try with the smallest model first
        compute_type = "int8"  # Use int8 quantization to reduce memory usage
        
        print(f"📊 Initializing WhisperModel with size={model_size}, compute_type={compute_type}")
        model = WhisperModel(model_size, compute_type=compute_type, device="cpu")
        
        # Process in smaller chunks if needed
        segments, _ = model.transcribe(
            video_path,
            beam_size=1,  # Reduce beam size to save memory
            vad_filter=True,  # Voice activity detection can help with efficiency
            vad_parameters=dict(min_silence_duration_ms=500)  # Adjust if needed
        )
        
        # Collect transcript
        transcript = " ".join(segment.text for segment in segments)
        return transcript
        
    except Exception as e:
        print(f"⚠️ Local transcription error: {str(e)}")
        # Fall back to OpenAI if local transcription fails
        print("🔄 Falling back to OpenAI transcription")
        return transcribe_with_openai(video_path)

def transcribe_with_openai(video_path: str) -> str:
    print("✅ Calling openai api.")

    with open(video_path, "rb") as f:
        transcript = client.audio.transcriptions.create(
            model="whisper-1",
            file=f
        )
    print("✅ OpenAI API response received.")

    return transcript.text