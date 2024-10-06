import React, { useState } from 'react';
import axios from 'axios';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { FlickeringSkeleton } from './ui/flickering-skeleton';
import { VideoPlayer } from './VideoPlayer';
import { RainbowButton } from './ui/rainbow-button';
import { generateManimCodeV2 } from '../agents/manimCodePromptV2';
import { generateVoiceoverScript } from '../agents/voiceoverScriptPrompt';
import { Icons } from './ui/icons';

export function MistralCodeGenerator() {
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const generateVideo = async () => {
    setIsLoading(true);
    setVideoSrc(null);
    setAudioSrc(null);
    setIsError(false);

    try {
      const manimCodeResponse = await generateManimCodeV2(topic);
      const manimCode = manimCodeResponse.constructBody;
      console.log('Manim code generated', manimCode);

      const voiceoverScript = await generateVoiceoverScript(topic, manimCode);
      console.log('Voiceover script generated', voiceoverScript);

      const [voiceResponse, videoResponse] = await Promise.all([
        axios.post('/api/generateVoice', { text: voiceoverScript }),
        axios.post('/api/generateVideo', { code: manimCode })
      ]);

      const audioBase64 = voiceResponse.data.audio;
      const audioSrc = `data:audio/mpeg;base64,${audioBase64}`;
      setAudioSrc(audioSrc);
      console.log('Voice audio generated');

      const { videoSrc: generatedVideoSrc } = videoResponse.data;
      setVideoSrc(generatedVideoSrc);
      console.log('Video generated');

    } catch (err) {
      console.error('Error during generation:', err);
      setIsError(true);
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
          <CardTitle className="text-7xl font-bold text-center bg-gradient-to-b from-black to-gray-400 bg-clip-text text-transparent">Veducato</CardTitle>
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
                {isLoading ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Video'
                )}
              </RainbowButton>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium mb-2 text-gray-700">Suggested Topics:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedTopics.map((suggestedTopic, index) => (
                  <button
                    key={index}
                    onClick={() => setTopic(suggestedTopic)}
                    className="px-2 py-0.5 text-xs bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full transition-colors duration-200"
                  >
                    {suggestedTopic}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-center items-center mt-8">
              <div className="w-full max-w-[800px] aspect-video">
                {isLoading && <FlickeringSkeleton className="w-full h-full" />}
                {isError && <FlickeringSkeleton className="w-full h-full bg-red-200" />}
                {videoSrc && <VideoPlayer videoSrc={videoSrc} />}
              </div>
              {audioSrc && (
                <div className="mt-4">
                  <audio controls src={audioSrc} className="w-full">
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}