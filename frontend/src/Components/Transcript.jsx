import { useState } from 'react';

export const Transcript = ({ transcript }) => {
  const [copyStatus, setCopyStatus] = useState('');

  // If transcript is empty or not available yet
  if (!transcript || transcript.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="animate-pulse flex flex-col items-center justify-center">
          <div className="rounded-full bg-blue-100 p-4 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">Generating transcript...</h3>
          <p className="text-gray-600 max-w-sm">We're processing the video content.</p>
        </div>
      </div>
    );
  }

  // Function to handle copying transcript to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(transcript);
      setCopyStatus('Copied!');
      
      // Reset status after 2 seconds
      setTimeout(() => {
        setCopyStatus('');
      }, 2000);
    } catch (err) {
      setCopyStatus('Failed to copy');
      console.error('Failed to copy transcript: ', err);
    }
  };

  // Function to handle transcript download
  const handleDownload = () => {
    // Create a blob from the transcript text
    const blob = new Blob([transcript], { type: 'text/plain' });
    
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
    
    // Create a temporary anchor element
    const a = document.createElement('a');
    a.href = url;
    a.download = 'video-transcript.txt';
    
    // Trigger download
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="transcript-container">
      {/* Transcript header with actions */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-800">Full Transcript</h3>
        <div className="flex space-x-2">
          <button 
            onClick={handleCopy}
            className="text-sm flex items-center text-primary hover:text-h-primary transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {copyStatus || 'Copy'}
          </button>
        </div>
      </div>

      {/* Simple transcript content */}
      <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
        <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
          {transcript}
        </div>
      </div>

      {/* Optional: Learning features */}
      <div className="mt-6 flex flex-wrap gap-2">
        <button 
            onClick={handleDownload}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-primary text-sm rounded-full transition-colors flex justify-center items-center"        
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
        </button>
        <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-primary text-sm rounded-full transition-colors">
          Difficult words
        </button>
        {/* <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition-colors">
          Key phrases
        </button>
        <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition-colors">
          Grammar notes
        </button> */}
      </div>
    </div>
  );
};