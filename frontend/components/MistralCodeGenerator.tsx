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
  const [voiceoverScript, setVoiceoverScript] = useState<string | null>(null);

  const generateVideo = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    setLoading(true);
    setError(null);
    setVoiceoverScript(null);
    try {
      console.log('Generating instructions for topic:', topic);
      const instructionsResponse = await axios.post('/api/generateInstructions', { topic });
      console.log('Instructions generated:', instructionsResponse.data);

      console.log('Generating Manim code');
      const manimCodeResponse = await axios.post('/api/generateManimCode', { topic, instructions: instructionsResponse.data });
      console.log('Manim code generated');

      console.log('Generating voiceover script');
      const voiceoverScriptResponse = await axios.post('/api/generateVoiceoverScript', { 
        topic, 
        instructions: instructionsResponse.data, 
        manimCode: manimCodeResponse.data 
      });
      console.log('Voiceover script generated');

      console.log('Generating video');
      const videoResponse = await axios.post('/api/generateVideo', { manimCode: manimCodeResponse.data });
      console.log('Video generated');
      
      const { videoSrc } = videoResponse.data;
      const generatedVoiceoverScript = voiceoverScriptResponse.data;
      
      console.log('Setting voiceover script and calling onVideoGenerated');
      setVoiceoverScript(generatedVoiceoverScript);
      onVideoGenerated(videoSrc, generatedVoiceoverScript);
    } catch (err) {
      console.error('Error generating video:', err);
      setError('Failed to generate video. Please try again.');
    } finally {
      console.log('Setting loading to false');
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
      {voiceoverScript && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Voiceover Script:</h3>
          <p className="whitespace-pre-wrap">{voiceoverScript}</p>
        </div>
      )}
    </div>
  );
}