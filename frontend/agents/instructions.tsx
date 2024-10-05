import { mistral } from '@ai-sdk/mistral';
import { generateObject } from 'ai';
import { z } from 'zod';

export async function generateManimInstructions(topic: string) {
  const prompt = `
Explain ${topic} using visual animations. Break down the concept into its fundamental components, and show how they build up to the main idea for a 60 second video animation. Follow these guidelines:

1. Conceptualization and Simplification:
   - Start with the most basic elements of ${topic}
   - Gradually introduce more complex ideas
   - Use visual representations to break down abstract concepts

2. Visual Progression:
   - Begin with simple shapes or diagrams
   - Build up to more detailed visualizations
   - Show step-by-step development of key ideas

3. Connections and Relationships:
   - Illustrate how different components of ${topic} relate to each other
   - Use animations to demonstrate cause-and-effect relationships
   - Highlight important connections with visual cues (e.g., arrows, color coding)

4. Key Visualizations:
   - [VISUAL ELEMENT 1] to represent [FUNDAMENTAL CONCEPT 1] (10 seconds)
   - [VISUAL ELEMENT 2] to demonstrate [FUNDAMENTAL CONCEPT 2] (10 seconds)
   - [VISUAL ELEMENT 3] to illustrate [FUNDAMENTAL CONCEPT 3] (10 seconds)
   - [VISUAL ELEMENT 4] to show [FUNDAMENTAL CONCEPT 4] (10 seconds)
   - [VISUAL ELEMENT 5] to explain [FUNDAMENTAL CONCEPT 5] (10 seconds)
   - [VISUAL ELEMENT 6] to show [FUNDAMENTAL CONCEPT 6] (10 seconds)

5. Synthesis and Conclusion:
   - Visually bring together all elements to show the complete picture of ${topic}
   - Emphasize how individual components contribute to the main idea

Please provide:
1. A detailed description of the visual elements and animations to be included in a Manim scene, following the above structure.

Example:

For "Explain Euler's Identity"

1. Visual Description:

Conceptualization and Simplification:
- Start with a unit circle on a complex plane
- Introduce e^(ix) as a point rotating around the circle
- Visualize complex exponentials as colorful spirals emanating from the origin
- Break down e^(ix) into cos(x) + isin(x) geometrically on the circle
- Highlight π on the circle, showing it as half a rotation
- Build up to e^(iπ) visually, step-by-step rotation
- Reveal how this lands at -1 on the real axis
- Connect the five fundamental constants (0, 1, e, i, π) with animated lines

Visual Progression:
- Begin with a simple unit circle
- Gradually add complex plane coordinates
- Introduce rotating point for e^(ix)
- Overlay spirals for complex exponentials
- Show geometric representation of cos(x) and isin(x)
- Animate full rotation to π
- Highlight final position at -1
- Bring in labels for 0, 1, e, i, and π

Connections and Relationships:
- Use color-coded arrows to show relationships between elements
- Animate transitions between exponential and trigonometric forms
- Highlight how π relates to rotation in radians

Key Visualizations:
- Unit circle to represent the complex plane
- Rotating vector to demonstrate e^(ix)
- Colorful spirals to illustrate complex exponentials
- Trigonometric functions as projections on axes
- Connecting lines to show relationship between constants

Synthesis and Conclusion:
- Animate the equation e^(iπ) + 1 = 0 being formed
- Visually emphasize how each constant plays a role in the identity

`;

  const { object } = await generateObject({
    model: mistral('mistral-small-latest'),
    prompt: prompt,
    schema: z.object({
      visualDescription: z.string(),
    }),
  });

  return object;
}