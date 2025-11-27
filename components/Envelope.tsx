import React, { useState } from 'react';

interface EnvelopeProps {
  onOpen: () => void;
  isOpened: boolean;
}

export const Envelope: React.FC<EnvelopeProps> = ({ onOpen, isOpened }) => {
  const [hasClicked, setHasClicked] = useState(false);

  const handleClick = () => {
    if (hasClicked || isOpened) return;
    setHasClicked(true);
    // Trigger the parent's open sequence
    onOpen();
  };

  return (
    <div className="flex items-center justify-center py-10 w-full h-[400px]">
      <div 
        className="relative w-[320px] md:w-[360px] h-[240px] perspective-1000 group cursor-pointer"
        onClick={handleClick}
      >
        <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${hasClicked ? 'translate-y-[60px]' : 'hover:scale-105'}`}>
          
          {/* Back of Envelope */}
          <div className="absolute inset-0 bg-rose-200 rounded-lg shadow-xl"></div>

          {/* The Letter Inside (Slides up) */}
          <div 
            className={`absolute left-3 right-3 bg-[#fcfaf7] shadow-sm transition-all duration-[1500ms] ease-in-out z-10
              ${hasClicked ? 'bottom-[50%] h-[300px] -translate-y-[20%]' : 'top-2 bottom-2'}`}
          >
             {/* Fake text lines for preview */}
             <div className="p-6 space-y-3 opacity-30 mt-4">
                <div className="h-1.5 w-1/3 bg-stone-400 rounded-full"></div>
                <div className="h-1.5 w-full bg-stone-400 rounded-full"></div>
                <div className="h-1.5 w-11/12 bg-stone-400 rounded-full"></div>
                <div className="h-1.5 w-full bg-stone-400 rounded-full"></div>
                <div className="h-1.5 w-2/3 bg-stone-400 rounded-full"></div>
             </div>
          </div>

          {/* Front Pocket of Envelope */}
          <div 
            className="absolute inset-0 z-20 pointer-events-none rounded-lg"
            style={{ 
               // Simple CSS clip path for the pocket shape
               background: 'linear-gradient(to bottom right, #ffe4e6 50%, #fecdd3 50%)',
               clipPath: 'polygon(0 0, 50% 55%, 100% 0, 100% 100%, 0 100%)'
            }}
          >
             {/* Add a subtle shadow overlay for depth */}
             <div className="absolute inset-0 bg-black/5" style={{ clipPath: 'polygon(0 0, 50% 55%, 100% 0, 100% 100%, 0 100%)' }}></div>
          </div>
          
          {/* Top Flap */}
          <div 
            className={`absolute top-0 left-0 w-full h-full origin-top transition-all duration-700 ease-in-out z-30
            ${hasClicked ? 'rotate-x-180 z-0' : 'z-30'}`}
          >
            <div 
              className="w-full h-full bg-rose-300 rounded-lg shadow-md"
              style={{ clipPath: 'polygon(0 0, 50% 55%, 100% 0)' }}
            ></div>
          </div>

          {/* Wax Seal */}
          <div className={`absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 transition-all duration-500 ease-out
            ${hasClicked ? 'opacity-0 scale-150' : 'opacity-100'}`}
          >
            <div className="w-14 h-14 bg-rose-700 rounded-full shadow-lg flex items-center justify-center border-[3px] border-rose-800/20 box-border">
              <span className="font-serif text-rose-100 font-bold text-2xl italic pt-1">A</span>
            </div>
          </div>
          
        </div>
        
        {!hasClicked && (
           <div className="absolute -bottom-16 left-0 right-0 text-center">
             <span className="inline-block px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full text-rose-500 text-sm font-medium animate-bounce shadow-sm">
               Tap to open letter
             </span>
           </div>
        )}
      </div>
    </div>
  );
};