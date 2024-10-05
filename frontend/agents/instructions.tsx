import { mistral } from '@ai-sdk/mistral';
import { generateObject } from 'ai';
import { z } from 'zod';

export async function generateManimInstructions(topic: string) {
  const prompt = `
Describe a Manim animation to explain ${topic}. Focus primarily on visual representations with minimal text. Follow these guidelines:

1. Use concise text only for section titles at the top of the screen.

2. Emphasize visual demonstrations of key concepts related to ${topic}.

3. Include the following visual elements:
   a. [VISUAL ELEMENT 1] to represent [CONCEPT 1]
   b. [VISUAL ELEMENT 2] to demonstrate [CONCEPT 2]
   c. [VISUAL ELEMENT 3] to illustrate [CONCEPT 3]
   d. [VISUAL ELEMENT 4] to show [CONCEPT 4]
   e. [VISUAL ELEMENT 5] to explain [CONCEPT 5]

4. Use color coding to differentiate between various aspects or subtopics within ${topic}.

5. Incorporate smooth transitions between different concepts or subtopics.

6. Include animations that compare and contrast key ideas within ${topic}.

7. Visualize abstract concepts in a concrete, intuitive manner.

8. Create a text script for voiceover narration that matches the cadence of the video.

9. Ensure the script only includes relevant text to be narrated, omitting visual descriptions.

10. Optimize the animation to be simple and efficient while effectively conveying the concepts.

Please provide:
1. A detailed description of the visual elements and animations to be included in the Manim scene.
2. A separate text script for the voiceover narration that aligns with the visual elements.
`;

  const { object } = await generateObject({
    model: mistral('mistral-large-latest'),
    prompt: prompt,
    schema: z.object({
      visualDescription: z.string(),
      voiceoverScript: z.string(),
    }),
  });

  return object;
}