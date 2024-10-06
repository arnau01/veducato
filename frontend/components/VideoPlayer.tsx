import React, { useRef, useEffect } from 'react';

interface VideoPlayerProps {
  videoSrc: string;
  audioSrc: string | null;
}

export function VideoPlayer({ videoSrc, audioSrc }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const audio = audioRef.current;

    if (video && audio) {
      const syncAudioVideo = () => {
        if (Math.abs(video.currentTime - audio.currentTime) > 0.1) {
          audio.currentTime = video.currentTime;
        }
      };

      const handlePlay = () => {
        audio.play().catch(error => console.error('Audio playback failed:', error));
      };

      const handlePause = () => {
        audio.pause();
      };

      video.addEventListener('play', handlePlay);
      video.addEventListener('pause', handlePause);
      video.addEventListener('seeked', syncAudioVideo);
      video.addEventListener('timeupdate', syncAudioVideo);

      return () => {
        video.removeEventListener('play', handlePlay);
        video.removeEventListener('pause', handlePause);
        video.removeEventListener('seeked', syncAudioVideo);
        video.removeEventListener('timeupdate', syncAudioVideo);
      };
    }
  }, [videoSrc, audioSrc]);

  return (
    <div className="relative w-full h-full">
      <video
        ref={videoRef}
        src={videoSrc}
        className="w-full h-full"
        controls
      />
      {audioSrc && <audio ref={audioRef} src={audioSrc} />}
    </div>
  );
}