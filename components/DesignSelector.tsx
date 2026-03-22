import React from 'react';
import { FullDesign } from '../types';
import { DESIGNS } from '../data/designs';

interface DesignSelectorProps {
  selectedDesign: FullDesign;
  onSelect: (design: FullDesign) => void;
  onConfirm: () => void;
  onBack: () => void;
  onCustomise: () => void;
}

export const DesignSelector: React.FC<DesignSelectorProps> = ({ 
  selectedDesign, 
  onSelect, 
  onConfirm,
  onBack,
  onCustomise
}) => {
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="font-serif text-4xl text-stone-800 mb-4 tracking-tight">Choose Your Aesthetic</h2>
        <p className="text-stone-500 italic">Select a design that matches the mood of your message.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {DESIGNS.map((design) => (
          <button
            key={design.id}
            onClick={() => onSelect(design)}
            className={`group relative flex flex-col items-center p-6 rounded-3xl border-2 transition-all duration-500 ${
              selectedDesign.id === design.id 
                ? 'bg-white border-rose-400 shadow-2xl scale-[1.02]' 
                : 'bg-white/50 border-stone-100 hover:border-rose-200 hover:bg-white/80'
            }`}
          >
            {/* Design Preview */}
            <div className="w-full aspect-[4/3] rounded-xl overflow-hidden mb-6 relative shadow-inner bg-stone-100">
              {/* Envelope Preview */}
              <div className={`absolute inset-0 flex items-center justify-center p-4`}>
                <div className={`w-full h-full ${design.envelope.color} rounded-lg shadow-lg relative overflow-hidden`}>
                   {/* Letter Peek */}
                   <div className={`absolute inset-1 ${design.letter.paperBg} rounded-sm shadow-inner transition-transform duration-500 group-hover:-translate-y-4`}>
                      <div className={`absolute inset-0 ${design.letter.paperTexture} mix-blend-multiply opacity-30`}></div>
                   </div>
                   {/* Flap */}
                   <div 
                     className={`absolute top-0 left-0 right-0 h-2/3 ${design.envelope.flapColor} origin-top transition-transform duration-500 group-hover:rotate-x-180 z-20`}
                     style={{ clipPath: 'polygon(0 0, 100% 0, 100% 20%, 50% 100%, 0 20%)' }}
                   ></div>
                   {/* Seal */}
                   <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 ${design.envelope.sealColor} rounded-full shadow-md flex items-center justify-center text-xl z-30 transition-opacity duration-300 group-hover:opacity-0`}>
                     {design.envelope.sealIcon}
                   </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <h3 className={`text-xl font-serif mb-1 ${selectedDesign.id === design.id ? 'text-rose-700' : 'text-stone-800'}`}>
                {design.name}
              </h3>
              <p className="text-sm text-stone-400 font-medium uppercase tracking-widest">{design.letter.name}</p>
            </div>

            {selectedDesign.id === design.id && (
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-lg animate-bounce-subtle">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="flex gap-4 justify-center">
        <button 
          onClick={onBack}
          className="px-8 py-4 rounded-xl border-2 border-stone-200 text-stone-600 font-bold hover:bg-stone-50 transition-all"
        >
          Back to Draft
        </button>
        <button 
          onClick={onCustomise}
          className="px-8 py-4 rounded-xl border-2 border-rose-200 text-rose-600 font-bold hover:bg-rose-50 transition-all"
        >
          Customise Details
        </button>
        <button 
          onClick={onConfirm}
          className="px-12 py-4 rounded-xl bg-stone-900 text-white font-bold hover:bg-stone-800 transition-all shadow-xl shadow-stone-200"
        >
          Finalize Design
        </button>
      </div>
    </div>
  );
};
