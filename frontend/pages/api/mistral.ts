// frontend/pages/api/mistral.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { generateManimCode } from '@/agents/mistral';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { topic } = req.body;

  console.log('Generating code for topic:', topic);

  try {
    const code = await generateManimCode(topic);
    res.status(200).json({ code });
  } catch (error) {
    console.error('Error generating code:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
