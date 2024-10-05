import localFont from "next/font/local";
import axios from "axios";
import { useState } from "react";
import { VideoGenerator } from "@/components/VideoGenerator";
import { VideoPlayer } from "@/components/VideoPlayer";
import { FlickeringSkeleton } from "@/components/ui/flickering-skeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";

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
}

const fakeVideoHistory: VideoHistory[] = [
	{ topic: "Pythagorean theorem", videoSrc: "/fake-videos/pythagorean.mp4" },
	{ topic: "Newton's laws of motion", videoSrc: "/fake-videos/newton-laws.mp4" },
	{ topic: "Periodic table", videoSrc: "/fake-videos/periodic-table.mp4" },
	{ topic: "DNA replication", videoSrc: "/fake-videos/dna-replication.mp4" },
	{ topic: "Fibonacci sequence", videoSrc: "/fake-videos/fibonacci.mp4" },
];

export default function Home() {
	const [videoSrc, setVideoSrc] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [activeCategory, setActiveCategory] = useState('math')
	const [videoHistory, setVideoHistory] = useState<VideoHistory[]>(fakeVideoHistory)

	async function handleGenerateVideo(topic: string) {
		setLoading(true)
		setError(null)
		try {
			const response = await axios.post('http://127.0.0.1:5000/api/manim', { topic }, {
				withCredentials: true,
				headers: {
					'Content-Type': 'application/json',
				},
			})
			if (response.data.error) {
				throw new Error(response.data.message || 'Unknown error occurred');
			}
			const newVideoSrc = `data:video/mp4;base64,${response.data.video}`
			setVideoSrc(newVideoSrc)
			setVideoHistory(prevHistory => [
				{ topic, videoSrc: newVideoSrc },
				...prevHistory.slice(0, 9) // Keep only the last 10 videos
			])
		} catch (error) {
			console.error('Error:', error)
			if (axios.isAxiosError(error) && error.response) {
				setError(`Failed to generate video: ${error.response.data.message || error.message}`)
			} else {
				setError('An unexpected error occurred. Please try again.')
			}
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className={`container mx-auto p-4 ${geistSans.variable} ${geistMono.variable} font-sans`}>
			<h1 className="text-3xl font-bold text-center mb-6">1Blue3Brown Video Generator</h1>
			<VideoGenerator onSubmit={handleGenerateVideo} isLoading={loading} />
			<Tabs defaultValue="math" className="w-full max-w-2xl mx-auto mt-4">
				<TabsList className="grid w-full grid-cols-4 bg-white">
					{Object.keys(suggestionCategories).map((category) => (
						<TabsTrigger
							key={category}
							value={category}
							onClick={() => setActiveCategory(category)}
							className="text-black data-[state=active]:bg-black"
						>
							{category.charAt(0).toUpperCase() + category.slice(1)}
						</TabsTrigger>
					))}
				</TabsList>
				{Object.entries(suggestionCategories).map(([category, suggestions]) => (
					<TabsContent key={category} value={category} className="mt-4">
						<div className="flex flex-wrap justify-center gap-2">
							{suggestions.map((suggestion, index) => (
								<Button
									key={index}
									variant="outline"
									size="sm"
									onClick={() => handleGenerateVideo(suggestion)}
									disabled={loading}
								>
									{suggestion}
								</Button>
							))}
						</div>
					</TabsContent>
				))}
			</Tabs>
			{error && <p className="text-red-500 mb-4 text-center">{error}</p>}
			<div className="mt-8 max-w-2xl mx-auto h-[480px] rounded-md overflow-hidden">
				{loading ? (
					<FlickeringSkeleton className="w-full h-full" />
				) : videoSrc ? (
					<VideoPlayer videoSrc={videoSrc} />
				) : (
					<div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
						Generate a video to see it here
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