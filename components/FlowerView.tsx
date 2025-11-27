import React from 'react';
import { Button } from './Button';

interface FlowerViewProps {
  imageUrl: string | null;
  onReset: () => void;
}

export const FlowerView: React.FC<FlowerViewProps> = ({ imageUrl, onReset }) => {
  if (!imageUrl) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `flower-generated-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="animate-fade-in flex flex-col items-center">
      <div className="bg-white p-4 rounded-2xl shadow-xl shadow-stone-200/50 mb-6 w-full max-w-md mx-auto">
        <div className="aspect-square w-full rounded-xl overflow-hidden relative group">
          <img 
            src={imageUrl} 
            alt="Generated Flower" 
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
        </div>
      </div>
      
      <div className="flex gap-4">
        <Button variant="secondary" onClick={onReset}>
          Create Another
        </Button>
        <Button onClick={handleDownload}>
          Download Image
        </Button>
      </div>
    </div>
  );
};