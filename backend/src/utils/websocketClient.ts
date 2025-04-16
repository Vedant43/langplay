import WebSocket from "ws";
import axios from "axios";
import { prisma } from "../prisma";

export const generateQuizAndTranscript = (videoId: number, videoUrl: string) => {
  const ws = new WebSocket("ws://localhost:8000/ws");

  ws.on("open", () => {
    console.log("Connected to FastAPI WebSocket");

    ws.send(JSON.stringify({
      videoUrl: videoUrl
    }));
  });

  ws.on("message", async (data) => {
    const message = JSON.parse(data.toString());

    console.log("Message from FastAPI:", message);

    if (message.event === "transcript_ready") {
      await prisma.video.update({
        where: { 
            id: videoId 
        },
        data: { 
            transcriptLang: message.transcript 
        }
      });
      console.log("Transcript saved to DB");
    }

    if (message.event === "quiz_ready") {
      await prisma.video.update({
        where: { 
            id: videoId 
        },
        data: { 
            quiz: message.quiz, quizGenerated: true 
        }
      });
      console.log("Quiz saved to DB");
    }

    if (message.event === "error") {
      console.error("Error from FastAPI:", message.message);
    }
  });

  ws.on("close", () => {
    console.log("Disconnected from FastAPI WebSocket");
  });

  ws.on("error", (err) => {
    console.error("WebSocket error:", err);
  });
};
