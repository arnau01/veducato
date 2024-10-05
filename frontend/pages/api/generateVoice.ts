import { NextApiRequest, NextApiResponse } from 'next';
import { ElevenLabsClient } from 'elevenlabs';
import { Readable } from 'stream';

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY
});

const DEFAULT_VOICE_ID = 'onwK4e9ZLuTAKqWW03F9';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text, voiceId = DEFAULT_VOICE_ID } = req.body;

  if (!text || !voiceId) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    const audio = await elevenlabs.generate({
      voice: voiceId,
      text: text,
      model_id: "eleven_multilingual_v2"
    });

    const chunks: Buffer[] = [];
    for await (const chunk of audio as Readable) {
      chunks.push(Buffer.from(chunk));
    }
    const audioBuffer = Buffer.concat(chunks);
    
    // Convert the buffer to Base64
    const base64Audio = audioBuffer.toString('base64');
    
    res.status(200).json({ audio: base64Audio });
  } catch (error) {
    console.error('Error generating audio:', error);
    res.status(500).json({ error: 'Failed to generate audio' });
  }
}