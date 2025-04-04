from moviepy.editor import VideoFileClip

def get_video_duration(path: str) -> float:
    clip = VideoFileClip(path)
    duration = clip.duration
    clip.close()
    return duration
