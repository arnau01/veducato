// frontend/pages/api/generateVoiceoverScript.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { generateVoiceoverScript } from '../../agents/voiceoverScriptPrompt';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { topic, instructions, manimCode } = req.body;

  if (!topic || !instructions || !manimCode) {
    return res.status(400).json({ message: 'Topic, instructions, and Manim code are required' });
  }

  try {
    const voiceoverScript = await generateVoiceoverScript(topic, instructions.visualDescription, manimCode);
    res.status(200).json({ voiceoverScript });
  } catch (error) {
    console.error('Error generating voiceover script:', error);
    res.status(500).json({ message: `Failed to generate voiceover script: ${error instanceof Error ? error.message : 'Unknown error'}` });
  }
}