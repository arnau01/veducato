// frontend/pages/api/instructions.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { generateManimInstructions } from '@/agents/instructionPrompt';

interface APICallError extends Error {
  name: 'APICallError';
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    console.log('Received non-POST request. Method Not Allowed.');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { topic } = req.body;

  if (!topic || typeof topic !== 'string') {
    console.log('Invalid or missing topic in request body');
    return res.status(400).json({ error: 'Invalid or missing topic' });
  }

  console.log('Received request to generate instructions for topic:', topic);

  try {
    console.log('Calling generateManimInstructions function...');
    const instructions = await generateManimInstructions(topic);
    console.log('Instructions generation successful.');
    return res.status(200).json(instructions);
  } catch (error) {
    console.error('Error generating instructions:', error);
    
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      if ((error as APICallError).name === 'APICallError') {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Failed to authenticate with the AI service. Please check your API credentials.'
        });
      }
    }
    
    return res.status(500).json({ 
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'An unexpected error occurred'
    });
  }
}
