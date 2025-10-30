# LangPlay 🎯

An interactive language learning platform that makes language acquisition engaging through AI-generated quizzes, video content, and social features.

## 🎥 Video Demo

Experience how **LangPlay** makes language learning interactive and AI-powered - from real-time quizzes to automatic video transcription.

[![LangPlay Demo]](https://youtu.be/FGh6LMI4khc)

## 🌟 Features

### Core Learning Features
- **AI-Generated Quizzes** - Dynamic, personalized quizzes powered by OpenAI API via FastAPI microservice
- **Real-time Quiz Generation** - Live quiz creation using WebSocket connections for instant feedback
- **Audio Transcription** - Automatic transcript generation using Whisper AI for better accessibility

### Content Management
- **Channel Creation** - Create and manage your own language learning channels
- **Playlist Management** - Organize content into structured learning playlists
- **Video Integration** - Content sourced from YouTube API (initial phase) and direct uploads
- **Audio Transcription** - Automatic generation of transcripts for video content using Whisper AI

## 🏗️ Tech Stack

- **Frontend**: React.js 
- **Backend**: Node.js / Express.js
- **Microservices**: FastAPI (Python) for AI operations
- **Database**: PostgreSQL
- **AI Integration**: 
  - OpenAI API for quiz generation
  - Whisper AI for audio transcription
- **Real-time**: WebSocket for live quiz generation
- **Video Content**: YouTube API (initial phase)
- **Authentication**: JWT
- **Styling**: Tailwind CSS

## 📱 Usage

### Creating Your First Channel
1. Sign up for an account
2. Navigate to "Create Channel"
3. Fill in channel details (name, description, language focus)
4. Start uploading content or creating quizzes

### Taking AI Quizzes
1. Browse available channels and content
2. Select a quiz that matches your level
3. Experience real-time quiz generation via WebSocket connection
4. Complete the interactive exercises powered by OpenAI
5. View your results and progress with detailed analytics

### Working with Video Content
1. Automatic transcript generation using Whisper AI
2. AI-generated quizzes based on video content
3. Organize videos into learning playlists

### Building Playlists
1. Explore content across different channels
2. Click "Add to Playlist" on videos or quizzes you like
3. Organize your saved content into themed playlists
4. Access your playlists anytime from your dashboard

Made with ❤️ by [Vedant43](https://github.com/Vedant43) 
