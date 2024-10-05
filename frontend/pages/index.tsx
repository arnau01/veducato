import localFont from "next/font/local";
import { useState } from "react";
import { MistralCodeGenerator } from "@/components/MistralCodeGenerator";
import { VideoPlayer } from "@/components/VideoPlayer";
import { VoiceoverScript } from "@/agents/voiceoverScript";

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
	const [videoSrc, setVideoSrc] = useState<string | null>(null);
	const [voiceoverScript, setVoiceoverScript] = useState<VoiceoverScript | null>(null);

	const handleVideoGenerated = (videoSrc: string, voiceoverScript: VoiceoverScript) => {
		setVideoSrc(videoSrc);
		setVoiceoverScript(voiceoverScript);
	};

	return (
		<div className={`container mx-auto p-4 ${geistSans.variable} ${geistMono.variable} font-sans`}>
			<h1 className="text-2xl font-bold mb-4">Manim Video Generator</h1>
			<MistralCodeGenerator onVideoGenerated={handleVideoGenerated} />
			{videoSrc && <VideoPlayer videoSrc={videoSrc} />}
			{voiceoverScript && (
				<div className="mt-4">
					<h2 className="text-xl font-bold mb-2">Voiceover Script</h2>
					<pre className="bg-gray-100 p-4 rounded-md overflow-auto">
						{JSON.stringify(voiceoverScript, null, 2)}
					</pre>
				</div>
			)}
		</div>
	);
}