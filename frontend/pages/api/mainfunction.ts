// frontend/pages/api/instructions.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { generateManimInstructions } from '@/agents/instructions';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    console.log('Received non-POST request. Method Not Allowed.');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { topic } = req.body;

  console.log('Received request to generate instructions for topic:', topic);

  try {
    console.log('Calling generateManimInstructions function...');
    const instructions = await generateManimInstructions(topic);
    console.log('Instructions generation successful.');
    res.status(200).json(instructions);
  } catch (error) {
    console.error('Error generating instructions:', error);
    console.log('Sending 500 Internal Server Error response');
    res.status(500).json({ error: 'Internal Server Error' });
  }

  console.log('Request processing completed.');
}
