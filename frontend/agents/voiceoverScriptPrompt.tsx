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
  manimCode: string,
): Promise<string> {
  const keyPoints = extractKeyPoints(manimCode);

  const prompt = `
Create a voiceover script for an educational video about "${topic}". The script should align with the following key points:

Key Points:
${keyPoints.join('\n')}

Ensure the script:
- Is conversational and engaging
- Explains concepts clearly and concisely
- Aligns with the visual elements described
- Uses appropriate transitions between segments
- Avoids technical jargon unless necessary

Provide only the text to be spoken, including appropriate paragraph and line breaks. Use correct punctuation to indicate these breaks and pauses. The total duration should be appropriate for a 60-second video.

Provide the script in the following format:
{
  "voiceoverScript": "Welcome to our video on ${topic}! \n\nLet's begin by exploring... \n\nNext, we'll look at... \n\nTo summarize... \n\nThank you for watching!"
}

We are returning the voiceover script in the format of a JSON object with a single key "voiceoverScript". We need to be extra careful with the format of the JSON control characters. Please escape them properly, especially newline characters (\\n) and quotation marks.

Be extremely careful with the format of the JSON control characters. Please escape them properly, especially newline characters (\\n) and quotation marks.
`;

  const { object } = await generateObject({
    model: mistral('mistral-small-latest'),
    prompt,
    schema: z.object({
      voiceoverScript: z.string()
    }),
    maxRetries: 5,
  });

  return object.voiceoverScript;
}