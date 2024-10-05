import { useRef, useEffect } from 'react';

interface VideoPlayerProps {
  videoSrc: string;
  audioSrc?: string;
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

      video.addEventListener('play', () => audio.play());
      video.addEventListener('pause', () => audio.pause());
      video.addEventListener('seeked', syncAudioVideo);
      video.addEventListener('timeupdate', syncAudioVideo);

      return () => {
        video.removeEventListener('play', () => audio.play());
        video.removeEventListener('pause', () => audio.pause());
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
      <audio ref={audioRef} src={audioSrc} />
    </div>
  );
}