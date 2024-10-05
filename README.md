# AI-Powered Educational Videos Generator

## Hackathon Project: 3Blue1Brown-Style Videos with Mistral AI and Eleven Labs

This project aims to create educational videos in the style of 3Blue1Brown using cutting-edge AI technologies. We leverage Mistral AI for content generation and Eleven Labs for voice synthesis, combined with Manim for stunning mathematical animations.

### 🚀 Features

- Generate educational content using Mistral AI
- Create high-quality voice-overs with Eleven Labs
- Produce beautiful mathematical animations with Manim
- Combine all elements into engaging, 3Blue1Brown-style videos

### 🛠️ Technologies Used

- [Mistral AI](https://mistral.ai/) for content generation
- [Eleven Labs](https://elevenlabs.io/) for voice synthesis
- [Manim](https://www.manim.community/) for mathematical animations
- Python for scripting and integration


### 🚀 Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/your-username/ai-educational-videos.git
   cd ai-educational-videos
   ```

2. Set up a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Set up API keys:
   Create a `.env` file in the root directory and add your API keys:
   ```
   MISTRAL_AI_API_KEY=your_mistral_ai_key
   ELEVEN_LABS_API_KEY=your_eleven_labs_key
   ```

5. Run the Jupyter notebook:
   ```
   jupyter notebook playground.ipynb
   ```

### 🎥 Creating Videos

1. Use the `playground.ipynb` notebook to experiment with Manim animations.
2. Implement content generation in `scripts/content_generator.py`.
3. Set up voice synthesis in `scripts/voice_synthesizer.py`.
4. Combine animations, content, and voice-over in `scripts/video_creator.py`.

### 🤝 Contributing

This is a hackathon project, but we welcome contributions! Feel free to open issues or submit pull requests.

### 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### 🙏 Acknowledgements

- [3Blue1Brown](https://www.3blue1brown.com/) for inspiration
- The Manim Community for their amazing animation library
- Mistral AI and Eleven Labs for their cutting-edge AI technologies
