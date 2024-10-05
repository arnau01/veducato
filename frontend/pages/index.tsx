import localFont from "next/font/local";
import axios from "axios";
import { useState } from "react";
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
	const [videoSrc, setVideoSrc] = useState('')
	const [audioSrc, setAudioSrc] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [activeCategory, setActiveCategory] = useState('math')
	const [videoHistory, setVideoHistory] = useState<VideoHistory[]>(fakeVideoHistory)

	const [testAudioSrc, setTestAudioSrc] = useState<string | null>(null);
	const [testLoading, setTestLoading] = useState(false);
	const [testError, setTestError] = useState<string | null>(null);

	async function handleGenerateContent(topic: string) {
		setLoading(true)
		setError(null)
		try {
			const videoResponse = await axios.post('http://127.0.0.1:5000/api/manim', { topic }, {
				withCredentials: true,
				headers: { 'Content-Type': 'application/json' },
			})
			
			if (videoResponse.data.error) {
				throw new Error(videoResponse.data.message || 'Unknown error occurred');
			}
			
			const newVideoSrc = `data:video/mp4;base64,${videoResponse.data.video}`
			setVideoSrc(newVideoSrc)

			const scriptResponse = await axios.post('http://127.0.0.1:5000/api/generate-script', { topic }, {
				withCredentials: true,
				headers: { 'Content-Type': 'application/json' },
			});

			if (scriptResponse.data.error) {
				throw new Error(scriptResponse.data.message || 'Unknown error occurred');
			}

			const audioResponse = await axios.post('/api/elevenlabs', {
				text: scriptResponse.data.script,
				voiceId: 'Rachel',
			});

			if (audioResponse.data.error) {
				throw new Error(audioResponse.data.error || 'Failed to generate audio');
			}

			const newAudioSrc = `data:audio/mpeg;base64,${audioResponse.data.audio}`;
			setAudioSrc(newAudioSrc);

			setVideoHistory(prevHistory => [
				{ topic, videoSrc: newVideoSrc, audioSrc: newAudioSrc },
				...prevHistory.slice(0, 9)
			])
		} catch (error) {
			console.error('Error:', error)
			setError('An unexpected error occurred. Please try again.')
		} finally {
			setLoading(false)
		}
	}

	async function handleTestAudioGeneration() {
		setTestLoading(true);
		setTestError(null);
		try {
			const testText = `Welcome to this mathematical animation.

We begin with a LaTeX title appearing on screen. It reads: "This is some LaTeX".

Below it, a mathematical equation fades in. The equation shows the Basel problem: the sum of the reciprocals of the squares of natural numbers equals pi squared over six.

Now, watch as the title transforms. It moves to the upper left corner and changes to say: "That was a transform".

Simultaneously, the equation below fades out.

Next, we introduce a grid. A new title appears, stating: "This is a grid".

Observe as a coordinate plane materializes on the screen. It extends from negative 10 to positive 10 on the x-axis, and from negative 6 to positive 6 on the y-axis.

Now, prepare to see a non-linear transformation of this grid.

The grid begins to warp and undulate. Each point on the grid is shifted based on a sine function of its coordinates.

As the transformation completes, the title changes once more. It now reads: "That was a non-linear function applied to the grid".

And with that, our mathematical journey through transformations and grids comes to an end.

Thank you for watching this visualization of mathematical concepts.`;
			
			const audioResponse = await axios.post('/api/elevenlabs', {
				text: testText
			});

			if (audioResponse.data.error) {
				throw new Error(audioResponse.data.error || 'Failed to generate audio');
			}

			const newAudioSrc = `data:audio/mpeg;base64,${audioResponse.data.audio}`;
			setTestAudioSrc(newAudioSrc);
		} catch (error) {
			console.error('Error:', error);
			setTestError('An error occurred while testing audio generation.');
		} finally {
			setTestLoading(false);
		}
	}

	return (
		<div className={`container mx-auto p-4 ${geistSans.variable} ${geistMono.variable} font-sans bg-white text-black`}>
			<h1 className="text-3xl font-bold text-center mb-6">1Brown3Blue Video Generator</h1>
			<VideoGenerator onSubmit={handleGenerateContent} isLoading={loading} />
			<Tabs defaultValue="math" className="w-full max-w-2xl mx-auto mt-4">
				<TabsList className="grid w-full grid-cols-4">
					{Object.keys(suggestionCategories).map((category) => (
						<TabsTrigger
							key={category}
							value={category}
							onClick={() => setActiveCategory(category)}
							className="text-black data-[state=active]:bg-gray-200"
						>
							{category.charAt(0).toUpperCase() + category.slice(1)}
						</TabsTrigger>
					))}
				</TabsList>
				{Object.entries(suggestionCategories).map(([category, suggestions]) => (
					<TabsContent key={category} value={category} className="mt-4">
						<div className="flex flex-wrap justify-center gap-2">
							{suggestions.map((suggestion, index) => (
								<ShinyButton
									key={index}
									onClick={() => handleGenerateContent(suggestion)}
									disabled={loading}
								>
									{suggestion}
								</ShinyButton>
							))}
						</div>
					</TabsContent>
				))}
			</Tabs>
			{error && <p className="text-red-500 mb-4 text-center">{error}</p>}
			<div className="mt-8 max-w-2xl mx-auto h-[480px] rounded-md overflow-hidden border border-gray-200">
				{loading ? (
					<FlickeringSkeleton className="w-full h-full" />
				) : videoSrc ? (
					<VideoPlayer videoSrc={videoSrc} audioSrc={audioSrc} />
				) : (
					<div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
						Generate content to see it here
					</div>
				)}
			</div>

			<div className="mt-8 max-w-2xl mx-auto">
				<h2 className="text-2xl font-bold mb-4">Test Audio Generation</h2>
				<Button 
					onClick={handleTestAudioGeneration} 
					disabled={testLoading}
					className="bg-blue-500 text-white hover:bg-blue-600"
				>
					{testLoading ? 'Generating...' : 'Generate Test Audio'}
				</Button>
				{testError && <p className="text-red-500 mt-2">{testError}</p>}
				{testAudioSrc && (
					<div className="mt-4">
						<audio controls src={testAudioSrc} className="w-full">
							Your browser does not support the audio element.
						</audio>
					</div>
				)}
			</div>

			{videoHistory.length > 0 && (
				<div className="mt-16">
					<h2 className="text-2xl font-bold text-center mb-4">Previously Generated Videos</h2>
					<InfiniteMovingCards
						items={videoHistory.map(item => ({
							quote: item.topic,
							name: "Generated Video",
							title: "Math Visualization",
							content: (
								<div className="flex flex-col items-center">
									<video
										src={item.videoSrc}
										className="w-48 h-36 object-cover rounded-md"
										controls={false}
										muted
										loop
										autoPlay
									/>
									<p className="mt-2 text-sm text-center">{item.topic}</p>
								</div>
							)
						}))}
						direction="right"
						speed="slow"
						className="py-4"
					/>
				</div>
			)}
		</div>
	)
}