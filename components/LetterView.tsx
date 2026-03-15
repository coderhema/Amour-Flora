
import React, { useState, useEffect, useRef } from 'react';
import { Button } from './Button';
import { Envelope } from './Envelope';
import { FullDesign } from '../types';

interface LetterViewProps {
  content: string | null;
  onEdit: () => void;
  onReset: () => void;
  design: FullDesign;
  stampImage?: string | null;
  recipientName?: string;
}

const useHandwriting = (text: string, isReading: boolean) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
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
    }, 40);

    return () => clearInterval(interval);
  }, [isReading, text]);

  return { displayedText, isComplete };
};

export const LetterView: React.FC<LetterViewProps> = ({ content, onEdit, onReset, design, stampImage, recipientName }) => {
  const [stage, setStage] = useState<'closed' | 'opening' | 'reading'>('closed');
  const { displayedText, isComplete } = useHandwriting(content || '', stage === 'reading');

  if (!content) return null;

  const handleOpenEnvelope = () => {
    setStage('opening');
    setTimeout(() => {
      setStage('reading');
    }, 1600);
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?note=${encodeURIComponent(content)}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'A Royal Letter for You',
          text: 'You have been sent a custom imperial sentiment...',
          url: shareUrl,
        });
      } catch (err) { console.log(err); }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="flex flex-col items-center w-full min-h-[90vh] justify-center relative py-20 animate-fade-in">
      
      {/* 3D Envelope Layer */}
      <div className={`transition-all duration-1000 absolute inset-0 flex items-center justify-center z-10
        ${stage === 'reading' ? 'opacity-0 pointer-events-none scale-150 blur-lg' : 'opacity-100 scale-100'}`}
      >
        <Envelope 
          isOpened={stage !== 'closed'} 
          onOpen={handleOpenEnvelope} 
          design={design.envelope}
          paperDesign={design.letter}
          stampImage={stampImage}
          recipientName={recipientName}
        />
      </div>

      {/* Neat Letter Presentation */}
      <div 
        className={`w-full max-w-4xl transition-all duration-[1200ms] transform
        ${stage === 'reading' ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-40 scale-95 pointer-events-none'}`}
      >
        <div className={`relative ${design.letter.paperBg} ${design.letter.borderColor} border-8 p-12 md:p-24 shadow-[0_80px_160px_rgba(0,0,0,0.25)] mb-12 flex flex-col min-h-[750px]`}>
          
          {/* Paper Texture Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>
          
          {/* Inner Foil Frame */}
          <div className="absolute inset-6 border border-transparent pointer-events-none" style={{ borderImage: 'linear-gradient(45deg, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c) 1', opacity: 0.3 }}></div>

          <div className="relative z-10 flex-grow flex flex-col items-center">
            {/* Header Ornament */}
            <div className={`mb-12 text-3xl ${design.letter.textColor} opacity-30`}>⚜️</div>
            
            <div className={`w-full max-w-2xl ${design.letter.fontFamily} ${design.letter.textColor} text-2xl md:text-4xl leading-[2.2] tracking-wide whitespace-pre-wrap text-center`}>
              {displayedText}
              {!isComplete && stage === 'reading' && (
                <span className="inline-block w-0.5 h-10 bg-current animate-pulse ml-0.5 align-middle -mt-2"></span>
              )}
            </div>
            
            {/* Footer Ornament */}
            <div className={`mt-16 text-3xl ${design.letter.textColor} opacity-10`}>❦</div>
          </div>
        </div>
        
        {/* Actions */}
        <div className={`flex flex-wrap justify-center gap-6 transition-all duration-1000 delay-1000 ${stage === 'reading' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Button variant="secondary" onClick={onEdit} className="rounded-full px-10 border-stone-200 shadow-xl bg-white">
            Modify Design
          </Button>
          <Button onClick={handleShare} className="rounded-full px-10 bg-stone-900 text-white shadow-2xl hover:bg-black">
            Seal & Dispatch
          </Button>
          <Button variant="ghost" onClick={onReset} className="text-stone-400 hover:text-stone-600">
            Write New
          </Button>
        </div>
      </div>
    </div>
  );
};
