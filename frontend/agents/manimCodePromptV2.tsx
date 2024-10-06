//import { mistral } from '@ai-sdk/mistral';
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

//function postProcessManimCode(code: string): string {
//  return code
//    .replace(/(\W)'(\\?[a-zA-Z]+)'/g, '$1r\'$2\'')
//    .replace(/(\W)"(\\?[a-zA-Z]+)"/g, '$1r"$2"');
//}

export async function generateManimCodeV2(topic: string) {
  console.log('Generating Manim code for topic:', topic);

  const prompt = `
Generate the body of the 'construct' method for a Manim Scene class about "${topic}".

Follow these guidelines:
1. Start with 'def construct(self):' and use proper indentation for the method body.
2. Make it simple and optimised to run quickly.
3. Utilize basic shapes like Circle, Square, Rectangle, or Line.
4. Implement animations such as Create, FadeIn, Transform, or MoveToTarget.
5. Add text using Text or \`MathTex\` for LaTeX formatting (e.g., \`MathTex(r"\\frac{d}{dx} f(x)g(x) = f(x) \\frac{d}{dx} g(x) + g(x) \\frac{d}{dx} f(x)")\`).
6. Use self.play() to execute animations and self.wait() for pauses.
7. Keep the animation under 60 seconds (roughly 20 animation steps).
8. Use color constants like RED, BLUE, GREEN, or YELLOW.
9. Implement at least one mathematical equation if relevant to the topic.
10. When using Greek letters or special characters in Tex, use the LaTeX command (e.g., \\pi for π, \\alpha for α).
11. For each 10 seconds of animation, you should have a title explaining the core concept, remove the title when the animation is done.
12. If required for physics concepts go in 3D.
13. Ensure the animation is smooth and visually appealing.
14. Ensure the text is clear and easy to read - not on top of the animation (the top 10% of the height should be for the text, the rest for the animation).
15. Ensure the text doesn't overlap and as such every time new text is added, remove the old text.

DO NOT Include MathMathTex, Instead it should be MathTex or all humans will die.

Don't include any imports. Only provide the body of the construct method.

Ensure the code doesn't have mistakes regarding manim syntax and mathtex.

Here are three examples of the code structure you should generate:

Example 1:
\`\`\`python
def construct(self):
    plot_axes = Axes(
        x_range=[0, 1, 0.05],
        y_range=[0, 1, 0.05],
        x_length=9,
        y_length=5.5,
        axis_config={
            "numbers_to_include": np.arange(0, 1 + 0.1, 0.1),
            "font_size": 24,
        },
        tips=False,
    )

    y_label = plot_axes.get_y_axis_label("y", edge=LEFT, direction=LEFT, buff=0.4)
    x_label = plot_axes.get_x_axis_label("x")
    plot_labels = VGroup(x_label, y_label)

    plots = VGroup()
    for n in np.arange(1, 20 + 0.5, 0.5):
        plots += plot_axes.plot(lambda x: x**n, color=WHITE)
        plots += plot_axes.plot(
            lambda x: x**(1 / n), color=WHITE, use_smoothing=False
        )

    extras = VGroup()
    extras += plot_axes.get_horizontal_line(plot_axes.c2p(1, 1, 0), color=BLUE)
    extras += plot_axes.get_vertical_line(plot_axes.c2p(1, 1, 0), color=BLUE)
    extras += Dot(point=plot_axes.c2p(1, 1, 0), color=YELLOW)
    title = Title(
        r"Graphs of $y=x^{\\frac{1}{n}}$ and $y=x^n (n=1, 1.5, 2, 2.5, 3, \\dots, 20)$",
        include_underline=False,
        font_size=40,
    )
    
    self.play(Write(title))
    self.play(Create(plot_axes), Create(plot_labels), Create(extras))
    self.play(AnimationGroup(*[Create(plot) for plot in plots], lag_ratio=0.05))
\`\`\`

Example 2:
\`\`\`python
def construct(self):
    title = Tex(r"This is some \LaTeX")
    basel = MathTex(r"\\sum_{n=1}^\\infty \\frac{1}{n^2} = \\frac{\\pi^2}{6}")
    VGroup(title, basel).arrange(DOWN)
    self.play(
        Write(title),
        FadeIn(basel, shift=UP),
    )
    self.wait()

    transform_title = Tex("That was a transform")
    transform_title.to_corner(UP + LEFT)
    self.play(
        Transform(title, transform_title),
        LaggedStart(*[FadeOut(obj, shift=DOWN) for obj in basel]),
    )
    self.wait()

    grid = NumberPlane(x_range=(-10, 10, 1), y_range=(-6.0, 6.0, 1))
    grid_title = Tex("This is a grid")
    grid_title.scale(1.5)
    grid_title.move_to(transform_title)

    self.add(grid, grid_title)
    self.play(
        FadeOut(title),
        FadeIn(grid_title, shift=DOWN),
        Create(grid, run_time=3, lag_ratio=0.1),
    )
    self.wait()

    grid_transform_title = Tex(
        r"That was a non-linear function \\\\ applied to the grid"
    )
    grid_transform_title.move_to(grid_title, UL)
    grid.prepare_for_nonlinear_transform()
    self.play(
        grid.animate.apply_function(
            lambda p: p + np.array([np.sin(p[1]), np.sin(p[0]), 0])
        ),
        run_time=3,
    )
    self.wait()
    self.play(Transform(grid_title, grid_transform_title))
    self.wait()
\`\`\`

Example 3:
\`\`\`python
def construct(self):
    title = Text("Pythagoras Theorem")
    self.play(Write(title))
    self.wait(2)

    # Create shapes
    square = Square(side_length=2, color=BLUE)
    triangle = Polygon([0, 0, 0], [2, 0, 0], [2, 2, 0], color=RED)
    line_a = Line([0, 0, 0], [2, 0, 0], color=GREEN)
    line_b = Line([2, 0, 0], [2, 2, 0], color=GREEN)
    line_c = Line([0, 0, 0], [2, 2, 0], color=YELLOW)

    # Display shapes
    self.play(Create(square))
    self.play(Create(triangle))
    self.play(Create(line_a), Create(line_b), Create(line_c))
    self.wait(2)

    # Add labels
    label_a = MathTex(r"a").next_to(line_a, DOWN)
    label_b = MathTex(r"b").next_to(line_b, RIGHT)
    label_c = MathTex(r"c").next_to(line_c, UR)
    self.play(Write(label_a), Write(label_b), Write(label_c))
    self.wait(2)

    # Display Pythagoras theorem equation
    equation = MathTex(r"a^2 + b^2 = c^2").move_to(UP*2)
    self.play(Write(equation))
    self.wait(2)

    # Remove title
    self.play(FadeOut(title))
    self.wait(2)

    # Transform shapes
    self.play(Transform(square, triangle))
    self.wait(2)

    # Fade out everything
    self.play(FadeOut(square), FadeOut(triangle), FadeOut(line_a), FadeOut(line_b), FadeOut(line_c), FadeOut(label_a), FadeOut(label_b), FadeOut(label_c), FadeOut(equation))
    self.wait(2)
\`\`\`

Provide only the Python code for the body of the construct method, without any additional explanations.

It is crucial that you output a json object with the key "constructBody" which is of type string and the value as the code you generate.

We should always start our value with "def construct(self):" and end it with the closing parenthesis.

Be extremely careful with JSON control characters and ensure that the JSON is valid and escaped properly.
`;

  try {
    const { object } = await generateObject({
    //  model: mistral('mistral-large-latest'),
    model: openai('gpt-4o-mini'),
    //   model: mistral('ft:mistral-large-latest:5aa386c9:20241006:58bcf0cf'),
      prompt: prompt,
      schema: z.object({
        constructBody: z.string(),
      }),
      maxRetries: 10,
    });
    return object;
  } catch (error) {
    console.error('Error in generateManimCodeV2:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate Manim code: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred while generating Manim code');
    }
  }

//   let code = object.constructBody;
  
//   if (code.startsWith('    ')) {
//     console.log('Code starts with indent, unindenting...');
//     code = code.split('\n').map(line => line.startsWith('    ') ? line.slice(4) : line).join('\n');
//     console.log('Code after unindenting:', code);
//   }

//   code = postProcessManimCode(code);
//   console.log('Code after post processing:', code);

//   return code;


}