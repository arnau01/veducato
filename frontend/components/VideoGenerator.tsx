import React, { useState } from 'react';
import axios from 'axios';

interface VideoGeneratorProps {
  code: string | null;
  onVideoGenerated: (videoSrc: string) => void;
}

export function VideoGenerator({ code, onVideoGenerated }: VideoGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateVideo = async () => {
    if (!code) {
      setError('No Manim code available. Please generate code first.');
      return;
    }

    setLoading(true);
    setError(null);
    console.log('code to be sent to backend', code);
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/manim', { code }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('response from backend', response.data);
      if (response.data.error) {
        throw new Error(response.data.message || 'Unknown error occurred');
      }
      const videoSrc = `data:video/mp4;base64,${response.data.video}`;
      onVideoGenerated(videoSrc);
    } catch (error) {
      console.error('Error:', error);
      if (axios.isAxiosError(error) && error.response) {
        setError(`Failed to generate video: ${error.response.data.message || error.message}`);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={generateVideo}
        disabled={loading || !code}
        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:bg-green-300"
      >
        {loading ? 'Generating Video...' : 'Generate Video from Code'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}