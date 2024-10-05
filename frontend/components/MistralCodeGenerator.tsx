import React, { useState } from 'react';
import axios from 'axios';
import { HoverBorderGradient } from './ui/hover-border-gradient';
import { FlickeringSkeleton } from './ui/flickering-skeleton';

interface MistralCodeGeneratorProps {
  onVideoGenerated: (videoSrc: string, voiceoverScript: string) => void;
}

export function MistralCodeGenerator({ onVideoGenerated }: MistralCodeGeneratorProps) {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateVideo = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/generateVideo', { topic });
      const { videoSrc, voiceoverScript } = response.data;
      onVideoGenerated(videoSrc, voiceoverScript);
    } catch (err) {
      setError('Failed to generate video. Please try again.');
      console.error('Error generating video:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Enter a mathematical topic"
        className="border border-gray-300 rounded-md px-4 py-2 mr-2"
      />
      <HoverBorderGradient onClick={generateVideo}>
        {loading ? 'Generating...' : 'Generate Video'}
      </HoverBorderGradient>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {loading && (
        <div className="mt-4">
          <FlickeringSkeleton className="h-64 w-full" />
        </div>
      )}
    </div>
  );
}