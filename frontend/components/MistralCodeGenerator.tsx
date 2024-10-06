import React, { useState } from 'react';
import axios from 'axios';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { FlickeringSkeleton } from './ui/flickering-skeleton';
import { VideoPlayer } from './VideoPlayer';
import { RainbowButton } from './ui/rainbow-button';

export function MistralCodeGenerator() {
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  const generateVideo = async () => {

    setIsLoading(true);
    setError(null);
    setVideoSrc(null);

    try {
      console.log('Generating instructions for topic:', topic);
      const instructionsResponse = await axios.post('/api/generateInstructions', { topic });

      const visualDescription = instructionsResponse.data.visualDescription;
      console.log('Instructions generated:', visualDescription);

      console.log('Generating Manim code');
      const manimCodeResponse = await axios.post('/api/generateManimCodeV2', { topic });

      const manimCode = manimCodeResponse.data.constructBody;
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
      
      const { videoSrc: generatedVideoSrc } = videoResponse.data;
      
      console.log('Setting video source');
      setVideoSrc(generatedVideoSrc);
    } catch (err) {
      console.error('Error during video generation flow:', err);
      setError('Failed to generate video. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedTopics = [
    "Sin Curve and Unit Circle",
    "Pythagorean Theorem",
    "Integral Area Under Curve",
    "Vector Matrices",
    "Basic Neural Network",
    "Network Effects",
    "Complex Numbers",
    "Elliptic Curves",
    "Basic Trigonometry",
    "Speed, Velocity and Acceleration",
    "Word Embeddings",
    "Probability Distributions",
    "Bubble Sort",
    "Sierpinski Triangle Fractal"
  ];

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      <Card className="relative z-10 bg-white/80 text-black">
        <CardHeader>
          <CardTitle className="text-7xl font-bold text-center bg-gradient-to-b from-black to-gray-600 bg-clip-text text-transparent">Veducato</CardTitle>
          <p className="text-center text-gray-700 text-lg font-light tracking-wide">
            Transforming education through captivating visualizations
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-6">
            <Input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Visualise any concept"
              className="text-xl py-6 px-4 rounded-xl bg-gray-200 text-black placeholder-gray-500 border-2 border-gray-300 focus:border-blue-500 transition duration-300"
            />
            <div className="flex justify-center">
              <RainbowButton onClick={generateVideo}>
                {isLoading ? 'Generating...' : 'Generate Video'}
              </RainbowButton>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            <div className="mt-4">
              <p className="text-sm font-medium mb-2 text-gray-700">Suggested Topics:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedTopics.map((suggestedTopic, index) => (
                  <button
                    key={index}
                    onClick={() => setTopic(suggestedTopic)}
                    className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full transition-colors duration-200"
                  >
                    {suggestedTopic}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-center items-center mt-8">
              <div className="w-full max-w-[640px] aspect-video">
                {isLoading && <FlickeringSkeleton className="w-full h-full" />}
                {videoSrc && <VideoPlayer videoSrc={videoSrc} />}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}