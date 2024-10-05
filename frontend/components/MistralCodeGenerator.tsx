import React, { useState } from 'react';
import axios from 'axios';
import { CodeDisplay } from './CodeDisplay';

interface MistralCodeGeneratorProps {
  onCodeGenerated: (code: string) => void;
}

export function MistralCodeGenerator({ onCodeGenerated }: MistralCodeGeneratorProps) {
  const [topic, setTopic] = useState('');
  const [code, setCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateCode = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      console.log(`Generating code for topic: ${topic}`);
      const response = await axios.post('/api/mistral', { topic });
      const generatedCode = response.data.code;
      setCode(generatedCode);
      onCodeGenerated(generatedCode);
    } catch (err) {
      setError('Failed to generate code. Please try again.');
      console.error('Error generating code:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Enter a mathematical topic"
        className="border border-gray-300 rounded-md px-4 py-2 mr-2"
      />
      <button
        onClick={generateCode}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
      >
        {loading ? 'Generating...' : 'Generate Manim Code'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {code && <CodeDisplay code={code} />}
    </div>
  );
}