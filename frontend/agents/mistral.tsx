import { mistral } from '@ai-sdk/mistral';
import { generateObject } from 'ai';
import { z } from 'zod';

export async function generateManimCode(topic: string) {
  const prompt = `
Generate the body of the 'construct' method for a Manim Scene class about "${topic}". Follow these guidelines:
1. Do not include the 'def construct(self):' line or any class definition.
2. Start directly with the content of the method.
3. Utilize basic shapes like Circle, Square, Rectangle, or Line.
4. Implement animations such as Create, FadeIn, Transform, or MoveToTarget.
5. Add text using Text or Tex for LaTeX formatting.
6. Use self.play() to execute animations and self.wait() for pauses.
7. Keep the animation under 15 seconds (roughly 5-10 animation steps).
8. Use color constants like RED, BLUE, GREEN, or YELLOW.
9. Implement at least one mathematical equation if relevant to the topic.
10. Ensure proper indentation for the method body (4 spaces).

Provide only the Python code for the body of the construct method, without any explanations or the method definition itself.
`;

  const { object } = await generateObject({
    model: mistral('mistral-small-latest'),
    prompt: prompt,
    schema: z.object({
      constructBody: z.string(),
    }),
  });
  
  return object.constructBody;
}