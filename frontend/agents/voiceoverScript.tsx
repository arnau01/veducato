import { mistral } from '@ai-sdk/mistral';
import { generateObject } from 'ai';
import { z } from 'zod';

function extractKeyPoints(manimCode: string): string[] {
  const lines = manimCode.split('\n');
  const keyPoints: string[] = [];

  for (const line of lines) {
    if (line.includes('Title(') || line.includes('Tex(') || line.includes('MathTex(')) {
      const match = line.match(/["'](.*?)["']/);
      if (match) {
        keyPoints.push(match[1]);
      }
    }
  }

  return keyPoints;
}

export async function generateVoiceoverScript(
  topic: string,
  visualDescription: string,
  manimCode: string,
): Promise<string> {
  const keyPoints = extractKeyPoints(manimCode);

  const prompt = `
Create a voiceover script for a 60-second educational video about "${topic}". The script should align with the following visual description and key points:

Visual Description:
${visualDescription}

Key Points:
${keyPoints.join('\n')}

The script should have the following structure:
1. Introduction (5-10 seconds)
2. Main Content (45-50 seconds, divided into 5-6 segments)
3. Conclusion (5-10 seconds)

Each segment should include the spoken text and its approximate duration in seconds. The total duration should be close to 60 seconds.

Ensure the script:
- Is conversational and engaging
- Explains concepts clearly and concisely
- Aligns with the visual elements described
- Uses appropriate transitions between segments
- Avoids technical jargon unless necessary

Provide the script in the following format:
{
  "introduction": { "text": "...", "timing": X },
  "mainContent": [
    { "text": "...", "timing": X },
    { "text": "...", "timing": X },
    ...
  ],
  "conclusion": { "text": "...", "timing": X }
}
`;

  const { object } = await generateObject({
    model: mistral('mistral-small-latest'),
    prompt,
    schema: z.object({
      voiceoverScript: z.string()
    })
  });

  return object.voiceoverScript;
}