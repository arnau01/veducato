from manim import *
import tempfile
import base64
import os
import random
import numpy as np
import scipy.stats as stats

config.media_width = "75%"
config.verbosity = "WARNING"

def create_scene(code):
    class CustomScene(Scene):
        exec(code)

    return CustomScene

def run_manim_code(code):
    with tempfile.TemporaryDirectory() as tmpdirname:
        config.output_file = f"{tmpdirname}/output.mp4"
        config.video_dir = tmpdirname
        
        CustomScene = create_scene(code)
        scene = CustomScene()
        scene.render()
        
        # Search for the generated video file
        video_files = [f for f in os.listdir(tmpdirname) if f.endswith('.mp4')]
        if not video_files:
            raise FileNotFoundError("No video file was generated")
        
        output_file = os.path.join(tmpdirname, video_files[0])
        with open(output_file, 'rb') as f:
            video_data = f.read()
    
    return base64.b64encode(video_data).decode('utf-8')