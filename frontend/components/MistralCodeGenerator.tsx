import React, { useState } from 'react';
import axios from 'axios';
import { HoverBorderGradient } from './ui/hover-border-gradient';
import { generateManimInstructions } from '../agents/instructions';
import { generateManimCodeV2 } from '../agents/mistalV2';
import { generateVoiceoverScript } from '../agents/voiceoverScript';
import { FlickeringSkeleton } from './ui/flickering-skeleton';

interface MistralCodeGeneratorProps {
  onVideoGenerated: (videoSrc: string, voiceoverScript: VoiceoverScript) => void;
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
      // Step 1: Generate Manim instructions
      const instructions = await generateManimInstructions(topic);
      
      // Step 2: Generate Manim code
      const manimCode = await generateManimCodeV2(topic);
      
      // Step 3: Generate voiceover script
      const voiceoverScript = await generateVoiceoverScript(topic, instructions, manimCode);
      
      // Step 4: Generate video
      const response = await axios.post('http://127.0.0.1:5000/api/manim', { code: manimCode }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.data.error) {
        throw new Error(response.data.message || 'Unknown error occurred');
      }
      
      const videoSrc = `data:video/mp4;base64,${response.data.video}`;
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
      <HoverBorderGradient onClick={generateVideo} disabled={loading}>
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