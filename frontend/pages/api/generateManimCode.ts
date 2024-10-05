// frontend/pages/api/generateManimCode.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { generateManimCode } from '@/agents/manimCodePrompt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    console.log('Received non-POST request. Method Not Allowed.');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { topic, instructions } = req.body;

  console.log('Received request to generate code for topic:', topic);

  try {
    console.log('Calling generateManimCode function...');
    const code = await generateManimCode(topic, instructions);
    console.log('Code generation successful. Length:', code.length);
    res.status(200).json({ code });
  } catch (error) {
    console.error('Error generating code:', error);
    console.log('Sending 500 Internal Server Error response');
    res.status(500).json({ error: 'Internal Server Error' });
  }

  console.log('Request processing completed.');
}
