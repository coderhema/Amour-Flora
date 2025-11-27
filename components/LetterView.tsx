import React, { useState, useEffect, useRef } from 'react';
import { Button } from './Button';
import { Envelope } from './Envelope';

interface LetterViewProps {
  content: string | null;
  onEdit: () => void;
  onReset: () => void;
}

// Improved hook for character-by-character writing effect
const useHandwriting = (text: string, isReading: boolean) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    // Reset state when text changes or reading stops
    setDisplayedText('');
    setIsComplete(false);
    indexRef.current = 0;
  }, [text, isReading]);

  useEffect(() => {
    if (!isReading) return;

    const interval = setInterval(() => {
      if (indexRef.current < text.length) {
        const char = text.charAt(indexRef.current);
        setDisplayedText(prev => prev + char);
        indexRef.current++;
      } else {
        setIsComplete(true);
        clearInterval(interval);
      }
    }, 40); // 40ms per character for a natural writing pace

    return () => clearInterval(interval);
  }, [isReading, text]);

  return { displayedText, isComplete };
};

export const LetterView: React.FC<LetterViewProps> = ({ content, onEdit, onReset }) => {
  // Stages: 'closed' -> user clicks -> 'opening' -> animation done -> 'reading'
  const [stage, setStage] = useState<'closed' | 'opening' | 'reading'>('closed');
  
  // Use the hook at the top level, but it only activates when stage is 'reading'
  const { displayedText, isComplete } = useHandwriting(content || '', stage === 'reading');

  if (!content) return null;

  const handleOpenEnvelope = () => {
    setStage('opening');
    // Allow envelope animation (flap open + slide up) to play out before switching view
    setTimeout(() => {
      setStage('reading');
    }, 1600);
  };

  const handleShare = async () => {
    // Create a shareable link
    const shareUrl = `${window.location.origin}${window.location.pathname}?note=${encodeURIComponent(content)}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'A Letter for You',
          text: 'I wrote something special for you...',
          url: shareUrl,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard! You can now send it to your recipient.');
    }
  };

  return (
    <div className="flex flex-col items-center w-full min-h-[85vh] justify-center relative py-10">
      
      {/* 1. Envelope Stage */}
      <div className={`transition-all duration-1000 absolute inset-0 flex items-center justify-center z-10
        ${stage === 'reading' ? 'opacity-0 pointer-events-none scale-150' : 'opacity-100 scale-100'}`}
      >
        <Envelope isOpened={stage !== 'closed'} onOpen={handleOpenEnvelope} />
      </div>

      {/* 2. Reading Stage (Paper View) */}
      <div 
        className={`w-full max-w-3xl transition-all duration-1000 transform
        ${stage === 'reading' ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-20 scale-95 pointer-events-none'}`}
      >
        <div className="bg-[#fcfaf7] p-8 md:p-16 rounded-sm shadow-2xl shadow-stone-300 mb-8 relative overflow-hidden min-h-[600px] flex flex-col">
          
          {/* Paper Texture & Lines */}
          <div className="absolute inset-0 opacity-[0.4] pointer-events-none" 
               style={{ backgroundImage: 'linear-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '100% 3rem' }}>
          </div>
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-repeat" 
               style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}>
          </div>
          
          {/* Top Gold Foil Accent */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-yellow-100 via-yellow-400 to-yellow-100 opacity-60"></div>

          {/* Content */}
          <div className="relative z-10 flex-grow">
            <div className="font-handwriting text-2xl md:text-4xl text-stone-800 leading-[2.2] tracking-wide whitespace-pre-wrap max-w-2xl mx-auto">
              {displayedText}
              {!isComplete && stage === 'reading' && (
                <span className="inline-block w-0.5 h-8 bg-stone-400 animate-pulse ml-0.5 align-middle -mt-2"></span>
              )}
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className={`flex flex-wrap justify-center gap-4 transition-opacity duration-1000 delay-1000 ${stage === 'reading' ? 'opacity-100' : 'opacity-0'}`}>
          <Button variant="secondary" onClick={onEdit}>
            Edit Draft
          </Button>
          <Button onClick={handleShare}>
            Share Link
          </Button>
          <Button variant="ghost" onClick={onReset}>
            Write New
          </Button>
        </div>
      </div>
    </div>
  );
};
