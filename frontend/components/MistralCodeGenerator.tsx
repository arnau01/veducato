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
import { getCodeForTopic, topics } from '../data/examples';

export function MistralCodeGenerator() {
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const generateVideo = async (customTopic?: string) => {
    setIsLoading(true);
    setVideoSrc(null);
    setAudioSrc(null);
    setIsError(false);

    const currentTopic = customTopic || topic;

    try {
      let manimCode: string | undefined;

      manimCode = getCodeForTopic(currentTopic);
      console.log('Manim code before generation', manimCode);

      if (!manimCode) {
        const manimCodeResponse = await axios.post('/api/generateManimCodeV2', { topic: currentTopic });
        manimCode = manimCodeResponse.data.constructBody;
        console.log('Manim code generated', manimCode);
      }

      const voiceoverScript = await axios.post('/api/generateVoiceoverScript', { topic: currentTopic, manimCode: manimCode });
      console.log('Voiceover script generated', voiceoverScript);

      const videoResponse = await axios.post('/api/generateVideo', { code: manimCode });

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

  const suggestedTopics = topics;

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
              <RainbowButton onClick={() => generateVideo()}>
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
                    onClick={() => {
                      setTopic(suggestedTopic);
                      generateVideo(suggestedTopic);
                    }}
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