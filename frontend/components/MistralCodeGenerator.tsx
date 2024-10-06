import React, { useState } from 'react';
import axios from 'axios';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { FlickeringSkeleton } from './ui/flickering-skeleton';
import ShinyButton from './ui/shiny-button';
import { HoverBorderGradient } from './ui/hover-border-gradient';
import { VideoPlayer } from './VideoPlayer';
import { BackgroundBeams } from './ui/background-beams';

export function MistralCodeGenerator() {
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [voiceoverScript, setVoiceoverScript] = useState<string | null>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  const generateVideo = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    setIsLoading(true);
    setError(null);
    setVoiceoverScript(null);
    setVideoSrc(null);

    try {
      console.log('Generating instructions for topic:', topic);
      const instructionsResponse = await axios.post('/api/generateInstructions', { topic });

      const visualDescription = instructionsResponse.data.visualDescription;
      console.log('Instructions generated:', visualDescription);

      console.log('Generating Manim code');
      const manimCodeResponse = await axios.post('/api/generateManimCodeV2', { topic });

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
      
      const { videoSrc: generatedVideoSrc } = videoResponse.data;
      
      console.log('Setting voiceover script and video source');
      setVoiceoverScript(generatedVoiceoverScript);
      setVideoSrc(generatedVideoSrc);
    } catch (err) {
      console.error('Error during video generation flow:', err);
      setError('Failed to generate video. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedTopics = [
    "Pythagorean Theorem",
    "Quadratic Equations",
    "Calculus Basics",
    "Linear Algebra",
    "Probability Theory"
  ];

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      <Card className="relative z-10">
        <CardHeader>
          <CardTitle className="text-7xl font-bold text-center bg-gradient-to-b from-neutral-950 to-neutral-400 bg-clip-text text-transparent">Veducato</CardTitle>
          <p className="text-center text-muted-foreground">Using visualisation to make education digestible</p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <Input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter a mathematical topic"
            />
            <HoverBorderGradient onClick={generateVideo}>
              {isLoading ? 'Generating...' : 'Generate Video'}
            </HoverBorderGradient>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            {isLoading && <FlickeringSkeleton className="h-64 w-full" />}
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Suggested Topics:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedTopics.map((suggestedTopic, index) => (
                  <ShinyButton
                    key={index}
                    className="text-xs"
                    onPress={() => setTopic(suggestedTopic)}
                  >
                    {suggestedTopic}
                  </ShinyButton>
                ))}
              </div>
            </div>
            {videoSrc && (
              <div className="flex justify-center items-center mt-8">
                <div className="w-full max-w-[640px] aspect-video">
                  <VideoPlayer videoSrc={videoSrc} />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}