import localFont from "next/font/local";
import axios from "axios";
import { useState } from "react";
import { VideoGenerator } from "@/components/VideoGenerator";
import { VideoPlayer } from "@/components/VideoPlayer";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

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

const suggestions = [
  "Explain the Pythagorean theorem",
  "Visualize the Fibonacci sequence",
  "Demonstrate the concept of pi",
  "Illustrate the properties of prime numbers",
];

export default function Home() {
  const [videoSrc, setVideoSrc] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
      setVideoSrc(`data:video/mp4;base64,${response.data.video}`)
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
      <h1 className="text-3xl font-bold text-center mb-6">3Blue1Brown Video Generator</h1>
      <VideoGenerator onSubmit={handleGenerateVideo} isLoading={loading} />
      <div className="max-w-2xl mx-auto mt-4 mb-4 flex flex-wrap justify-center gap-2">
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
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      {loading ? (
        <div className="mt-8 max-w-2xl mx-auto">
          <Skeleton className="w-full h-[480px] rounded-md" />
        </div>
      ) : (
        videoSrc && <VideoPlayer videoSrc={videoSrc} />
      )}
    </div>
  )
}