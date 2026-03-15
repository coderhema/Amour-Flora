
import React, { useState, useRef, useEffect } from 'react';
import { EnvelopeDesign, LetterDesign } from '../types';

const FOIL_GRADIENT = "linear-gradient(135deg, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c)";

interface EnvelopeProps {
  onOpen: () => void;
  isOpened: boolean;
  design: EnvelopeDesign;
  paperDesign: LetterDesign;
  stampImage?: string | null;
  recipientName?: string;
}

export const Envelope: React.FC<EnvelopeProps> = ({ 
  onOpen, 
  isOpened, 
  design, 
  paperDesign, 
  stampImage,
  recipientName = "Evelyn Thorne"
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  // Fix: Use ReturnType<typeof setTimeout> instead of NodeJS.Timeout to resolve type errors in browser context
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSingleClick = () => {
    if (isOpened || isExtracting) return;
    setIsExtracting(true);
    // Sequence: Flip to back (if on front) -> Open Flap -> Slide Letter
    if (!isFlipped) {
      setIsFlipped(true);
      setTimeout(() => {
        onOpen();
      }, 800);
    } else {
      onOpen();
    }
  };

  const handleDoubleClick = () => {
    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
      clickTimer.current = null;
    }
    setIsFlipped(!isFlipped);
  };

  const handleClickWrapper = () => {
    if (clickTimer.current) {
      handleDoubleClick();
    } else {
      clickTimer.current = setTimeout(() => {
        handleSingleClick();
        clickTimer.current = null;
      }, 250);
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-[600px] perspective-2000 select-none">
      <div 
        className={`relative w-[500px] h-[350px] transition-all duration-1000 transform-style-3d cursor-pointer 
        ${isFlipped ? 'rotate-y-180' : ''} 
        ${isOpened ? 'translate-y-[150px]' : 'hover:scale-105'}`}
        onClick={handleClickWrapper}
      >
        {/* --- FRONT OF ENVELOPE (Address & Stamps) --- */}
        <div className="absolute inset-0 backface-hidden rounded-sm shadow-2xl bg-[#fdfaf6] overflow-hidden border border-stone-200">
          {/* Paper Fiber Texture (SVG Noise via CSS) */}
          <div className="absolute inset-0 opacity-[0.18] pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>
          
          {/* Perimeter Dash */}
          <div className="absolute inset-4 border border-dashed border-[#d4af37]/40 rounded-sm pointer-events-none"></div>

          {/* Header Info */}
          <div className="absolute top-10 left-10">
            <div className="font-black text-[10px] uppercase tracking-[0.3em] text-[#4a0404]/80">Imperial Correspondence</div>
            <div className="font-mono text-[9px] uppercase tracking-wider text-stone-400">Series No. {new Date().getFullYear()}-FLORA</div>
          </div>

          {/* Stamp Zone */}
          <div className="absolute top-10 right-10 flex gap-4">
            {/* AI Generated Stamp */}
            <div className="w-20 h-24 border-2 border-dashed border-[#c5a059] bg-[#d4af37]/5 flex items-center justify-center relative overflow-hidden group">
               {stampImage ? (
                 <div className="absolute inset-[2px] bg-white shadow-sm p-1 flex flex-col justify-between z-10 animate-fade-in">
                    <img src={stampImage} alt="Stamp" className="w-full h-[75%] object-cover grayscale-[0.3]" />
                    <div className="text-[6px] font-mono text-center uppercase tracking-tighter opacity-50">AIR MAIL</div>
                 </div>
               ) : (
                 <div className="text-[8px] font-mono text-[#c5a059] -rotate-90 tracking-[2px]">POSTAGE</div>
               )}
            </div>
            {/* Second Static Stamp */}
            <div className="w-20 h-24 border-2 border-dashed border-[#c5a059] bg-[#d4af37]/5 flex items-center justify-center">
               <div className="absolute inset-[2px] bg-white shadow-sm p-1 flex flex-col justify-between rotate-2">
                  <div className="h-[75%] bg-[#4a0404] flex items-center justify-center text-white text-xl">⚜️</div>
                  <div className="text-[6px] font-mono text-center uppercase tracking-tighter opacity-50">CERTIFIED</div>
               </div>
            </div>
          </div>

          {/* Address */}
          <div className="absolute top-44 left-16 space-y-4">
             <h1 className="text-5xl font-black leading-none tracking-tight" style={{ background: FOIL_GRADIENT, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
               {recipientName || "Evelyn Thorne"}
             </h1>
             <div className="font-mono text-sm leading-relaxed text-stone-500 border-l border-[#d4af37] pl-5 max-w-[300px]">
               822 Gilded Terrace<br />
               Paper-Mill District, Floor 4<br />
               <span className="text-[#4a0404] font-semibold">ETERNAL CITY</span>
             </div>
          </div>

          {/* Seal Bottom Right */}
          <div className="absolute bottom-6 right-10 w-24 h-24 rounded-full flex items-center justify-center shadow-lg -rotate-12 overflow-hidden" style={{ background: FOIL_GRADIENT }}>
             <div className="w-[85px] h-[85px] border border-white/40 rounded-full flex items-center justify-center text-4xl font-black text-black/15">V</div>
          </div>
        </div>

        {/* --- BACK OF ENVELOPE (Flap & Seal) --- */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-sm shadow-2xl transition-colors duration-500 overflow-hidden bg-[#fdfaf6] border border-stone-200">
           <div className="absolute inset-0 opacity-[0.18] pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>
           
           {/* Flap & Opening logic needs to be z-indexed properly */}
           {/* REAR PANEL BASE */}
           <div className={`absolute inset-0 transition-colors duration-500 ${design.color}`}>
              <div className="absolute inset-0 opacity-15 bg-[url('https://www.transparenttextures.com/patterns/damask.png')]"></div>
              <div className="absolute inset-0 bg-black/10"></div>
           </div>

           {/* THE LETTER (SLIDING UP) */}
           <div 
             className={`absolute left-6 right-6 shadow-2xl transition-all duration-[2000ms] ease-in-out z-10 border-4 ${paperDesign.borderColor} ${paperDesign.paperBg}
               ${isOpened ? 'bottom-[65%] h-[600px] -translate-y-[20%] opacity-100' : 'bottom-2 h-[90%] opacity-0'}`}
           >
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>
              <div className="absolute inset-4 border border-transparent" style={{ borderImage: `${FOIL_GRADIENT} 1`, opacity: 0.3 }}></div>
              <div className={`p-12 space-y-8 mt-12 ${paperDesign.textColor} opacity-40 text-center`}>
                 <div className="text-3xl">⚜️</div>
                 <div className="space-y-4">
                   <div className="h-2 w-1/3 bg-current rounded-full mx-auto"></div>
                   <div className="h-2 w-full bg-current rounded-full"></div>
                   <div className="h-2 w-11/12 bg-current rounded-full mx-auto"></div>
                 </div>
              </div>
           </div>

           {/* V-FOLD SIDES */}
           <div className="absolute inset-0 z-20 pointer-events-none" style={{ clipPath: 'polygon(0% 0%, 50% 48%, 100% 0%, 100% 100%, 0% 100%)' }}>
              <div className={`absolute inset-0 transition-colors duration-500 ${design.color}`}></div>
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/damask.png')]"></div>
              <div className="absolute inset-0 bg-black/20 shadow-inner"></div>
           </div>

           {/* TOP FLAP */}
           <div className={`absolute top-0 left-0 w-full h-full origin-top transition-all duration-[1000ms] ease-in-out z-30 ${isOpened ? 'rotate-x-180 z-0' : 'z-30'}`}>
              <div className={`w-full h-full rounded-t-sm shadow-xl transition-colors duration-500 ${design.flapColor}`} style={{ clipPath: 'polygon(0 0, 100% 0, 50% 48%)' }}>
                 <div className="absolute inset-0 opacity-15 bg-[url('https://www.transparenttextures.com/patterns/damask.png')]"></div>
                 <div className="absolute inset-0" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 48%, 50% 50%, 100% 2%, 0 2%)', background: FOIL_GRADIENT }}></div>
              </div>
           </div>

           {/* WAX SEAL */}
           <div className={`absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 transition-all duration-700 ease-in
             ${isOpened ? 'opacity-0 scale-150 blur-sm' : 'opacity-100'}`}
           >
             <div className={`w-24 h-24 rounded-full shadow-2xl flex items-center justify-center border-4 border-white/20 transition-colors duration-500 ${design.sealColor} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-black/40 opacity-60"></div>
                <span className="text-4xl drop-shadow-2xl filter brightness-110">{design.sealIcon}</span>
             </div>
           </div>
        </div>

        {/* Action Tooltip */}
        {!isOpened && !isExtracting && (
           <div className="absolute -bottom-24 left-0 right-0 text-center pointer-events-none">
             <div className="inline-flex flex-col items-center gap-2">
                <span className="px-6 py-2 bg-stone-900 text-stone-100 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] shadow-2xl border border-white/10 animate-bounce">
                  {isFlipped ? 'Click to open' : 'Double click to flip'}
                </span>
             </div>
           </div>
        )}
      </div>
    </div>
  );
};
