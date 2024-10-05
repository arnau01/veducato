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

      const visualDescription = instructionsResponse.data.visualDescription;
      console.log('Instructions generated:', visualDescription);


      console.log('Generating Manim code');
      const manimCodeResponse = await axios.post('/api/generateManimCode', { topic, instructions: visualDescription });

      const manimCode = manimCodeResponse.data.code;
      console.log('Manim code generated', manimCode);

      console.log('Generating voiceover script');
      const voiceoverScriptResponse = await axios.post('/api/generateVoiceoverScript', { 
        topic, 
        instructions: visualDescription, 
        manimCode: manimCode 
      });

      const generatedVoiceoverScript = voiceoverScriptResponse.data.voiceoverScript;
      console.log('Voiceover script generated', generatedVoiceoverScript);

      console.log('Generating video');
      
      const videoResponse = await axios.post('/api/generateVideo', { code: manimCode });
      console.log('Video generated');
      
      const { videoSrc } = videoResponse.data;
      
      console.log('Setting voiceover script and calling onVideoGenerated');
      setVoiceoverScript(generatedVoiceoverScript);
      onVideoGenerated(videoSrc, generatedVoiceoverScript);
    } catch (err) {
      console.error('Error during video generation flow:', err);
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