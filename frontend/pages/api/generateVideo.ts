import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ message: 'Manim code is required' });
  }

  try {
    // Generate video
    const videoResponse = await axios.post('http://127.0.0.1:5000/api/manim', { code }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (videoResponse.data.error) {
      throw new Error(videoResponse.data.message || 'Unknown error occurred');
    }

    const videoSrc = `data:video/mp4;base64,${videoResponse.data.video}`;

    res.status(200).json({ videoSrc });
  } catch (error) {
    console.error('Error generating video:', error);
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      const errorStep = error.config?.url;
      res.status(500).json({ message: `Failed at step: ${errorStep}. Error: ${errorMessage}` });
    } else {
      res.status(500).json({ message: 'An unexpected error occurred. Please try again.' });
    }
  }
}