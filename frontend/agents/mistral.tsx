import { mistral } from '@ai-sdk/mistral';
import { generateObject } from 'ai';
import { z } from 'zod';

export async function generateManimCode(topic: string) {
  const prompt = `
Generate the body of the 'construct' method for a Manim Scene class about "${topic}". Follow these guidelines:
1. Include the 'def construct(self):' line and any class definition.
2. Make it simple and optimised to run quickly
2. Start directly with the content of the method.
3. Utilize basic shapes like Circle, Square, Rectangle, or Line.
4. Implement animations such as Create, FadeIn, Transform, or MoveToTarget.
5. Add text using Text or Tex for LaTeX formatting.
6. Use self.play() to execute animations and self.wait() for pauses.
7. Keep the animation under 15 seconds (roughly 5-10 animation steps).
8. Use color constants like RED, BLUE, GREEN, or YELLOW.
9. Implement at least one mathematical equation if relevant to the topic.
10. Ensure proper indentation, we should start with no indentation but add indentation when needed.

Don't include the imports. Only the body of the code.

Provide only the Python code for the body of the construct method, without any explanations or the method definition itself.

Improve the code to add ensure it doesn't do mistakes regarding manim syntax and mathtex.

Here is an example of the code you should generate:
\`\`\`
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
        r"Graphs of $y=x^{\frac{1}{n}}$ and $y=x^n (n=1, 1.5, 2, 2.5, 3, \dots, 20)$",
        include_underline=False,
        font_size=40,
    )
    
    self.play(Write(title))
    self.play(Create(plot_axes), Create(plot_labels), Create(extras))
    self.play(AnimationGroup(*[Create(plot) for plot in plots], lag_ratio=0.05))
\`\`\`

Here is another example:
\`\`\`
def construct(self):
    title = Tex(r"This is some \LaTeX")
    basel = MathTex(r"\sum_{n=1}^\infty \frac{1}{n^2} = \frac{\pi^2}{6}")
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
        r"That was a non-linear function \\ applied to the grid"
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
`;

  const { object } = await generateObject({
    model: mistral('mistral-large-latest'),
    prompt: prompt,
    schema: z.object({
      constructBody: z.string(),
    }),
  });

  let code = object.constructBody;
  
  if (code.startsWith('    ')) {
    console.log('code starts with indent, unindenting...', code);
    code = code.split('\n').map(line => line.startsWith('    ') ? line.slice(4) : line).join('\n');
    console.log('code after unindenting...', code);
  }

  return code;
}