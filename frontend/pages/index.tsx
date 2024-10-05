import localFont from "next/font/local";
import { useState, useEffect } from "react";
import { MistralCodeGenerator } from "@/components/MistralCodeGenerator";
import { VideoGenerator } from "@/components/VideoGenerator";
import { VideoPlayer } from "@/components/VideoPlayer";
import { FlickeringSkeleton } from "@/components/ui/flickering-skeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import ShinyButton from "@/components/ui/shiny-button";

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

const suggestionCategories = {
	math: [
		"Explain the Pythagorean theorem",
		"Visualize the Fibonacci sequence",
		"Demonstrate the concept of pi",
		"Illustrate the properties of prime numbers",
	],
	physics: [
		"Explain Newton's laws of motion",
		"Visualize the double-slit experiment",
		"Demonstrate the concept of entropy",
		"Illustrate the theory of relativity",
	],
	chemistry: [
		"Explain the periodic table of elements",
		"Visualize atomic orbitals",
		"Demonstrate chemical bonding",
		"Illustrate the concept of pH",
	],
	biology: [
		"Explain DNA replication",
		"Visualize cellular respiration",
		"Demonstrate natural selection",
		"Illustrate the human nervous system",
	],
};

interface VideoHistory {
	topic: string;
	videoSrc: string;
	audioSrc: string;
}

const fakeVideoHistory: VideoHistory[] = [
	{ topic: "Pythagorean theorem", videoSrc: "/fake-videos/pythagorean.mp4", audioSrc: "" },
	{ topic: "Newton's laws of motion", videoSrc: "/fake-videos/newton-laws.mp4", audioSrc: "" },
	{ topic: "Periodic table", videoSrc: "/fake-videos/periodic-table.mp4", audioSrc: "" },
	{ topic: "DNA replication", videoSrc: "/fake-videos/dna-replication.mp4", audioSrc: "" },
	{ topic: "Fibonacci sequence", videoSrc: "/fake-videos/fibonacci.mp4", audioSrc: "" },
];

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