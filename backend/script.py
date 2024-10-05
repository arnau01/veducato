from manim import *
import tempfile
import base64
import os

config.media_width = "75%"
config.verbosity = "WARNING"

class CircleToSquare(Scene):
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

def run_manim_code():
    with tempfile.TemporaryDirectory() as tmpdirname:
        config.output_file = f"{tmpdirname}/output.mp4"
        config.video_dir = tmpdirname
        scene = CircleToSquare()
        scene.render()
        
        # Search for the generated video file
        video_files = [f for f in os.listdir(tmpdirname) if f.endswith('.mp4')]
        if not video_files:
            raise FileNotFoundError("No video file was generated")
        
        output_file = os.path.join(tmpdirname, video_files[0])
        with open(output_file, 'rb') as f:
            video_data = f.read()
    
    return base64.b64encode(video_data).decode('utf-8')