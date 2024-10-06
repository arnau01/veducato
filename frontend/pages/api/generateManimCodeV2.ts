// frontend/pages/api/generateManimCode.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { generateManimCodeV2 } from '@/agents/manimCodePromptV2';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    console.log('Received non-POST request. Method Not Allowed.');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { topic } = req.body;

  console.log('Received request to generate code for topic:', topic);

  try {
    console.log('Calling generateManimCode function...');
    const code = await generateManimCodeV2(topic);
    // console.log('Code generation successful. Length:', code.constructBody.length);
    res.status(200).json(code);
  } catch (error) {
    console.error('Error generating code:', error);
    if (error && typeof error === 'object' && 'issues' in error) {
      console.log('Validation error detected. Sending 400 Bad Request response');
      res.status(400).json({ error: 'Bad Request', details: error.issues });
    } else {
      console.log('Sending 500 Internal Server Error response');
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  console.log('Request processing completed.');
}
