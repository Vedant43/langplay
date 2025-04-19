import WebSocket from "ws";
import { prisma } from "../prisma";

export const generateQuizAndTranscript = async (videoId: number, videoUrl: string) => {
  const video = await prisma.video.findUnique({
    where: { id: videoId },
    select: { transcriptLang: true, quizGenerated: true }
  });

  if (video?.transcriptLang && video?.quizGenerated) {
    console.log("✅ Transcript and quiz already generated. Skipping WebSocket.");
    return;
  }
  
  const ws = new WebSocket("ws://localhost:8000/ws");

  ws.on("open", () => {
    console.log("🧠 Connected to FastAPI WebSocket");

    ws.send(JSON.stringify({
      videoUrl: videoUrl
    }));
  });

  ws.on("message", async (data) => {
    const message = JSON.parse(data.toString());
    console.log("Message from FastAPI:", message);

    if (message.event === "transcript_ready") {
      try {
        await prisma.video.update({
          where: { 
            id: videoId 
          },
          data: { 
            transcriptLang: message.transcript 
          }
        });
        console.log("Transcript saved to DB");
      } catch (err) {
        console.error("Failed to save transcript:", err);
      }
    }

    if (message.event === "quiz_ready") {
      try {
        await prisma.video.update({
          where: { 
            id: videoId 
          },
          data: {
            quiz: message.quiz,
            quizGenerated: true
          }
        });
        console.log("🎯 Quiz saved to DB");
        
      } catch (err) {
        console.error("❌ Failed to save quiz:", err);
      }
    }

    if (message.event === "error") {
      console.error("🚨 Error from FastAPI:", message.message);
      
    }
  });

  ws.on("close", () => {
    console.log("🔌 Disconnected from FastAPI WebSocket");
  });

  ws.on("error", (err) => {
    console.error("WebSocket error:", err);
  });
};
