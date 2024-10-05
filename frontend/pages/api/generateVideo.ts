import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { generateManimInstructions } from '../../agents/instructions';
import { generateManimCodeV2 } from '../../agents/mistalV2';
import { generateVoiceoverScript } from '../../agents/voiceoverScript';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { topic } = req.body;

  if (!topic) {
    return res.status(400).json({ message: 'Topic is required' });
  }

  try {
    const instructions = await generateManimInstructions(topic);

    const manimCode = await generateManimCodeV2(topic, instructions.visualDescription);
    
    const voiceoverScript = await generateVoiceoverScript(topic, instructions.visualDescription, manimCode);
    
    // Generate video
    const response = await axios.post('http://127.0.0.1:5000/api/manim', { code: manimCode }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.data.error) {
      throw new Error(response.data.message || 'Unknown error occurred');
    }
    
    const videoSrc = `data:video/mp4;base64,${response.data.video}`;

    res.status(200).json({ videoSrc, voiceoverScript });
  } catch (error) {
    console.error('Error generating video:', error);
    res.status(500).json({ message: 'Failed to generate video. Please try again.' });
  }
}