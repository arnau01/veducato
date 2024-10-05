import React from 'react';

interface VideoPlayerProps {
  videoSrc: string;
}

export function VideoPlayer({ videoSrc }: VideoPlayerProps) {
  return (
    <div className="mt-8 max-w-2xl mx-auto">
      <div className="rounded-md overflow-hidden shadow-lg">
        <video controls className="w-full">
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}