
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
  const handleOpenClick = () => {
    if (isOpened) return;
    onOpen();
  };

  return (
    <div className="flex items-center justify-center w-full h-[500px] md:h-[600px] perspective-2000 select-none px-4">
      <div 
        className={`relative w-full max-w-[600px] aspect-[5/3.5] transition-all duration-1000 transform-style-3d cursor-pointer 
        ${isOpened ? 'rotate-x-12 -translate-y-20' : 'hover:rotate-x-12 hover:-rotate-y-2 hover:rotate-z-1'}`}
        onClick={handleOpenClick}
      >
        {/* --- ENVELOPE BACK (Pocket Base) --- */}
        <div className={`absolute inset-0 rounded-sm shadow-[20px_30px_40px_rgba(44,40,37,0.2),5px_10px_15px_rgba(44,40,37,0.4)] ${design.color} overflow-hidden border border-stone-200/20`}>
           <div className="absolute inset-0 opacity-[0.25] pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>
           <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/40 shadow-inner"></div>
           
           {/* Lining (Visible when opened) */}
           <div className={`absolute inset-0 transition-opacity duration-700 ${isOpened ? 'opacity-100' : 'opacity-0'}`}>
              <div className={`absolute inset-0 ${design.liningPattern || 'bg-stone-800'}`}>
                 <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/vintage-speckles.png')]"></div>
                 <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent"></div>
              </div>
           </div>
        </div>

        {/* --- THE LETTER (Inside the pocket) --- */}
        <div 
          className={`absolute left-[2%] right-[2%] top-[2%] bottom-[2%] shadow-[0_-5px_15px_rgba(0,0,0,0.1)] transition-all duration-[1200ms] ease-[cubic-bezier(0.8,0,0.2,1)] z-20 border-2 ${paperDesign.borderColor} ${paperDesign.paperBg}
            ${isOpened ? '-translate-y-[85%] shadow-2xl z-20 opacity-100' : 'z-10 opacity-100 translate-y-0'}`}
        >
           <div className={`absolute inset-0 pointer-events-none ${paperDesign.paperTexture} opacity-20`}></div>
           <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-black/10 pointer-events-none"></div>
           
           {/* Fold Lines */}
           <div className="absolute inset-0 pointer-events-none flex flex-col opacity-10">
             <div className="h-1/3 w-full border-b border-black/10"></div>
             <div className="h-1/3 w-full border-b border-black/10"></div>
           </div>

           {/* Preview Content */}
           <div className={`p-8 space-y-4 mt-8 ${paperDesign.textColor} text-center flex flex-col items-center justify-center h-full`}>
              {design.id === 'dossier-env' ? (
                <div className="text-4xl font-mono font-bold tracking-[0.3em] text-black/5 select-none pointer-events-none uppercase mb-4">
                  CONFIDENTIAL
                </div>
              ) : (
                <div className="text-4xl font-serif italic opacity-10 select-none pointer-events-none mb-4">
                  My Dearest...
                </div>
              )}
              <div className="space-y-2 w-full max-w-[200px] opacity-20">
                <div className="h-1.5 w-1/3 bg-current rounded-full mx-auto opacity-50"></div>
                <div className="h-1.5 w-full bg-current rounded-full opacity-30"></div>
                <div className="h-1.5 w-11/12 bg-current rounded-full mx-auto opacity-40"></div>
              </div>
           </div>
        </div>

        {/* --- ENVELOPE FRONT PANELS (The "V" folds) --- */}
        <div className="absolute inset-0 z-30 preserve-3d pointer-events-none">
          {/* Bottom Fold */}
          <div 
            className={`absolute inset-0 ${design.color} shadow-[inset_0_20px_30px_-10px_rgba(0,0,0,0.1)]`}
            style={{ clipPath: 'polygon(0 100%, 50% 40%, 100% 100%)' }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
          </div>
          
          {/* Left Fold */}
          <div 
            className={`absolute inset-0 ${design.color}`}
            style={{ clipPath: 'polygon(0 0, 50% 40%, 0 100%)' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-black/5"></div>
          </div>

          {/* Right Fold */}
          <div 
            className={`absolute inset-0 ${design.color}`}
            style={{ clipPath: 'polygon(100% 0, 50% 40%, 100% 100%)' }}
          >
            <div className="absolute inset-0 bg-gradient-to-l from-white/10 to-black/5"></div>
          </div>
        </div>

        {/* --- FRONT DETAILS (Address & Labels) --- */}
        <div className={`absolute inset-0 z-40 pointer-events-none transition-opacity duration-500 ${isOpened ? 'opacity-0' : 'opacity-100'}`}>
          {/* Recipient Address */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/4 w-full px-12 text-center md:text-left">
             <div className="space-y-1 md:space-y-2">
               <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-stone-500/60 mb-2">Deliver To:</div>
               <h1 className="text-3xl md:text-5xl font-serif italic leading-tight text-stone-800 drop-shadow-sm">
                 {recipientName}
               </h1>
               <div className="font-mono text-[10px] md:text-xs leading-relaxed text-stone-500/80 max-w-[280px] mx-auto md:mx-0 pt-2 border-t border-stone-200/50">
                 822 Gilded Terrace, Floor 4<br />
                 Paper-Mill District<br />
                 <span className="text-[#4a0404] font-bold tracking-widest">ETERNAL CITY</span>
               </div>
             </div>
          </div>
        </div>

        {/* --- TOP FLAP --- */}
        <div 
          className={`absolute top-0 left-0 w-full h-[65%] origin-top transition-all duration-[1200ms] ease-[cubic-bezier(0.8,0,0.2,1)] z-40
            ${isOpened ? 'rotate-x-180 z-15' : 'rotate-x-0'}`}
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 20%, 50% 100%, 0 20%)' }}
        >
          <div className={`absolute inset-0 ${design.flapColor} shadow-2xl`}>
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-black/20"></div>
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>
            
            {/* Decorative Border on Flap */}
            <div className="absolute inset-2 border border-white/10" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 20%, 50% 100%, 0 20%)' }}></div>
            
            {/* Wax Seal */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
              <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full ${design.sealColor} shadow-xl flex items-center justify-center text-xl md:text-2xl border border-white/10 relative overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-black/40"></div>
                <span className="relative z-10">{design.sealIcon}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Tooltip */}
        {!isOpened && (
           <div className="absolute -bottom-16 left-0 right-0 text-center pointer-events-none animate-fade-in">
              <span className="px-6 py-2 bg-stone-900 text-stone-100 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] shadow-2xl border border-white/10">
                Click to open
              </span>
           </div>
        )}
      </div>
    </div>
  );
};
