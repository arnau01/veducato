import { mistral } from '@ai-sdk/mistral';
import { generateObject } from 'ai';
import { z } from 'zod';

export async function generateManimInstructions(topic: string) {
  try {

    const prompt = `
Explain ${topic} using visual animations for a 60-second educational video in the style of 3Blue1Brown. Focus on fundamental ideas and axioms. Follow these guidelines:

1. Introduction (10 seconds):
   - Start with a clear, concise statement of ${topic}
   - Introduce the main question or problem to be explored

2. Core Concepts (40 seconds):
   - Present 3-4 key ideas or axioms related to ${topic}
   - For each concept:
     - Provide a simple visual representation
     - Explain its significance briefly
     - Show how it relates to the main topic

3. Connections and Implications (10 seconds):
   - Illustrate how the core concepts work together
   - Demonstrate a key result or application of ${topic}

4. Visual Elements:
   - Use simple, clean animations throughout
   - Employ consistent color coding for related ideas
   - Utilize mathematical notation where appropriate, but keep it accessible

5. Narration Guidelines:
   - Use clear, conversational language
   - Sync narration with visual elements
   - Pose thought-provoking questions to engage the viewer

Please provide:
1. A concise description of the visual elements and animations to be included in a Manim scene, following the above structure.
2. An outline for the narration script, highlighting key points to be explained.

Example for "Explain the Pythagorean Theorem":

Visual Description:
- Start with a right-angled triangle, labeling sides a, b, and c
- Animate squares growing from each side of the triangle
- Show area formulas for each square (a², b², c²)
- Demonstrate visually that a² + b² = c²
- Illustrate a few examples with different triangle sizes

Narration Outline:
- Introduce the Pythagorean Theorem and its importance in geometry
- Explain the concept of squares on each side of a right triangle
- Describe how the areas of the smaller squares relate to the largest
- Conclude by emphasizing the theorem's fundamental nature in mathematics

`;

    const { object } = await generateObject({
      model: mistral('mistral-small-latest'),
      prompt: prompt,
      schema: z.object({
        visualDescription: z.string(),
      }),
    });

    return object;

  } catch (error: unknown) {
    if (error instanceof Error && 'response' in error && typeof error.response === 'object' && error.response && 'status' in error.response && error.response.status === 401) {
      throw new Error('Unauthorized: Invalid API credentials');
    }
    // Handle other types of errors
    throw error;
  }
}