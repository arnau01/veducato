import localFont from "next/font/local";
import { useState, useEffect } from "react";
import { MistralCodeGenerator } from "@/components/MistralCodeGenerator";
import { VideoGenerator } from "@/components/VideoGenerator";
import { VideoPlayer } from "@/components/VideoPlayer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function Home() {
  const [manimCode, setManimCode] = useState<string | null>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  useEffect(() => {
    console.log('manimCode to be sent to backend in index.tsx \n', manimCode);
  }, [manimCode])

  useEffect(() => {
    console.log('videoSrc in index.tsx', videoSrc);
  }, [videoSrc])

  return (
    <div className={`container mx-auto p-4 ${geistSans.variable} ${geistMono.variable} font-sans`}>
      <h1 className="text-2xl font-bold mb-4">Manim Video Generator</h1>
      <MistralCodeGenerator onCodeGenerated={setManimCode} />
      <VideoGenerator code={manimCode} onVideoGenerated={setVideoSrc} />
      {videoSrc && <VideoPlayer videoSrc={videoSrc} />}
    </div>
  );
}