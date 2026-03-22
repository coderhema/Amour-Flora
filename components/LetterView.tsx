
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
        className={`w-full max-w-4xl transition-all duration-[1200ms] transform px-4 md:px-0
        ${stage === 'reading' ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-40 scale-95 pointer-events-none'}`}
      >
        <div className={`relative ${design.letter.paperBg} ${design.letter.borderColor} border-[8px] md:border-[16px] p-8 md:p-24 shadow-[0_50px_100px_rgba(0,0,0,0.3)] md:shadow-[0_100px_200px_rgba(0,0,0,0.4)] mb-12 flex flex-col min-h-[600px] md:min-h-[900px] overflow-hidden rounded-sm`}>
          
          {/* Deckled Edge Effect (Using a mask or a pseudo-element with rough edges) */}
          <div className="absolute inset-0 pointer-events-none z-20 shadow-[inset_0_0_15px_rgba(0,0,0,0.1)]"></div>
          
          {/* Paper Texture Overlay */}
          <div className={`absolute inset-0 pointer-events-none ${design.letter.paperTexture} mix-blend-multiply opacity-40`}></div>
          <div className="absolute inset-0 pointer-events-none opacity-15 bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')]"></div>
          
          {/* Realistic Paper Edge (Roughness) */}
          <div className="absolute inset-0 pointer-events-none" style={{ 
            clipPath: 'polygon(0% 0.5%, 2% 0%, 5% 0.5%, 10% 0%, 15% 0.5%, 20% 0%, 25% 0.5%, 30% 0%, 35% 0.5%, 40% 0%, 45% 0.5%, 50% 0%, 55% 0.5%, 60% 0%, 65% 0.5%, 70% 0%, 75% 0.5%, 80% 0%, 85% 0.5%, 90% 0%, 95% 0.5%, 100% 0%, 100% 100%, 0% 100%)',
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.05)'
          }}></div>

          {/* Folded Paper Effect */}
          <div className="absolute inset-0 pointer-events-none flex flex-col">
            <div className="h-1/3 w-full border-b border-black/5 shadow-[inset_0_-20px_40px_-20px_rgba(0,0,0,0.1)]"></div>
            <div className="h-1/3 w-full border-b border-black/5 shadow-[inset_0_-20px_40px_-20px_rgba(0,0,0,0.1)]"></div>
          </div>

          {/* Inner Foil Frame */}
          <div className="absolute inset-6 md:inset-10 border-2 border-transparent pointer-events-none" style={{ borderImage: 'linear-gradient(45deg, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c) 1', opacity: 0.25 }}></div>

          <div className="relative z-10 flex-grow flex flex-col items-center">
            {/* Header Ornament */}
            {design.id === 'dossier' ? (
              <div className="mb-10 md:mb-20 text-4xl md:text-7xl font-mono font-bold tracking-[0.3em] text-stone-900/10 select-none pointer-events-none uppercase">
                CONFIDENTIAL
              </div>
            ) : (
              <div className={`mb-10 md:mb-20 text-4xl md:text-6xl ${design.letter.textColor} opacity-20 select-none pointer-events-none`}>
                ✧ ⚜ ✧
              </div>
            )}
            
            <div className={`w-full max-w-3xl ${design.letter.fontFamily} ${design.letter.textColor} text-xl md:text-5xl leading-[2.2] md:leading-[2.6] tracking-wide whitespace-pre-wrap text-center drop-shadow-[0_1px_1px_rgba(0,0,0,0.1)]`}>
              {displayedText}
              {!isComplete && stage === 'reading' && (
                <span className="inline-block w-1 h-8 md:h-14 bg-current animate-pulse ml-1 align-middle -mt-1 md:-mt-2 opacity-40"></span>
              )}
            </div>
            
            {/* Footer Ornament */}
            <div className={`mt-16 md:mt-32 text-3xl md:text-5xl ${design.letter.textColor} opacity-15`}>❦</div>
          </div>

          {/* Corner Decorations */}
          <div className="absolute top-4 left-4 md:top-6 md:left-6 w-10 h-10 md:w-16 md:h-16 border-t-2 border-l-2 border-black/10"></div>
          <div className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 md:w-16 md:h-16 border-t-2 border-r-2 border-black/10"></div>
          <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 w-10 h-10 md:w-16 md:h-16 border-b-2 border-l-2 border-black/10"></div>
          <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 w-10 h-10 md:w-16 md:h-16 border-b-2 border-r-2 border-black/10"></div>
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
