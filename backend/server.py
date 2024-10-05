from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
import logging
from script import run_manim_code
import base64
import io

app = Flask(__name__)

# Configure CORS to allow specific origins
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000", "http://127.0.0.1:3001"]}}, supports_credentials=True)

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

@app.route('/', methods=['GET'])
def home():
    logger.debug("Received GET request at '/'")
    return "Hello World"

@app.route('/api/hello', methods=['GET'])
def api_hello():
    logger.debug("Received GET request at '/api/hello'")
    return jsonify({"message": "Hello World from Flask!"})

@app.route('/api/manim', methods=['POST', 'OPTIONS'])
def manim_api():
    logger.debug(f"Received {request.method} request at /api/manim from {request.remote_addr}")
    
    if request.method == 'OPTIONS':
        logger.debug("Handling OPTIONS request")
        response = jsonify({'status': 'OK'})
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        return response
    
    try:
        video_base64 = run_manim_code()
        logger.debug("Video generated successfully")
        return jsonify({'video': video_base64})
    except Exception as e:
        logger.error(f"Error generating video: {str(e)}", exc_info=True)
        return jsonify({'error': 'Internal Server Error', 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)