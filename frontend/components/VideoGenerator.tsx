import React, { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface VideoGeneratorProps {
  onSubmit: (topic: string) => void;
  isLoading: boolean;
}

export function VideoGenerator({ onSubmit, isLoading }: VideoGeneratorProps) {
  const [topic, setTopic] = useState('');

  const handleSubmit = () => {
    onSubmit(topic);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <Textarea
        placeholder="Enter a math topic for your video..."
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className="mb-4"
      />
      <Button 
        onClick={handleSubmit} 
        disabled={isLoading || !topic.trim()} 
        className="w-full"
      >
        {isLoading ? 'Generating...' : 'Generate Video'}
      </Button>
    </div>
  );
}