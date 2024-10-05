import Image from "next/image";
import localFont from "next/font/local";
import axios from "axios";
import { useState } from "react";

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
  const [videoSrc, setVideoSrc] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleGenerateVideo() {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/manim', {}, {
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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Next.js with Manim</h1>
      <button 
        onClick={handleGenerateVideo} 
        className="bg-blue-500 text-white p-2 rounded mb-4 disabled:bg-gray-400"
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate Video'}
      </button>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {videoSrc && (
        <video controls className="w-full max-w-2xl">
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  )
}