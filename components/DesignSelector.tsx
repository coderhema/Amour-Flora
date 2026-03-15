
import React from 'react';
import { LetterDesign, EnvelopeDesign, FullDesign } from '../types';
import { Button } from './Button';

// --- ATELIER CONSTANTS ---

const ROYAL_GOLD_GRADIENT = "linear-gradient(45deg, #BF953F 0%, #FCF6BA 25%, #B38728 50%, #FBF5B7 75%, #AA771C 100%)";

const PAPER_STYLES: LetterDesign[] = [
  { id: 'royal-cream', name: 'Royal Ivory & Gold', paperBg: 'bg-[#fcfbf4]', paperTexture: 'opacity-40', textColor: 'text-stone-800', borderColor: 'border-[#d4af37]', fontFamily: 'font-serif' },
  { id: 'noir-gold', name: 'Midnight Gold Foil', paperBg: 'bg-[#1a1a1a]', paperTexture: 'opacity-10', textColor: 'text-[#fcf6ba]', borderColor: 'border-[#d4af37]', fontFamily: 'font-serif' },
  { id: 'sage-linen', name: 'Victorian Sage', paperBg: 'bg-[#f4f7f2]', paperTexture: 'opacity-50', textColor: 'text-[#2d4234]', borderColor: 'border-[#8ea696]', fontFamily: 'font-handwriting' },
  { id: 'imperial-red', name: 'Imperial Crimson', paperBg: 'bg-[#4a0404]', paperTexture: 'opacity-20', textColor: 'text-[#f7ef8a]', borderColor: 'border-[#f7ef8a]', fontFamily: 'font-fancy' },
];

const ENVELOPE_STYLES = [
  { id: 'emperor', name: 'Emperor Red', color: 'bg-[#6d0000]', flap: 'bg-[#7d0000]', accent: '#d4af37' },
  { id: 'duke', name: 'Duke Blue', color: 'bg-[#001f3f]', flap: 'bg-[#002a54]', accent: '#c0c0c0' },
  { id: 'monarch', name: 'Monarch Emerald', color: 'bg-[#06402b]', flap: 'bg-[#085237]', accent: '#d4af37' },
  { id: 'onyx', name: 'Onyx Noir', color: 'bg-[#121212]', flap: 'bg-[#1a1a1a]', accent: '#f7ef8a' },
  { id: 'princess', name: 'Antique Pearl', color: 'bg-[#f8f1e9]', flap: 'bg-[#fff9f3]', accent: '#eec0c6' },
];

const SEAL_ICONS = ['⚜️', '👑', '🌹', '🦁', '🕊️'];

interface DesignSelectorProps {
  design: FullDesign;
  setDesign: (d: FullDesign) => void;
  onConfirm: () => void;
  onBack: () => void;
}

export const DesignSelector: React.FC<DesignSelectorProps> = ({ design, setDesign, onConfirm, onBack }) => {
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="font-serif text-5xl text-stone-900 mb-3 tracking-tight italic">The Royal Atelier</h2>
        <div className="h-0.5 w-24 bg-rose-200 mx-auto mb-4"></div>
        <p className="text-stone-500 text-lg font-light max-w-xl mx-auto">Commission your custom digital masterpiece. Every detail is hand-picked for elegance.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
        
        {/* PREVIEW AREA: Side-by-Side (Column 1-8) */}
        <div className="xl:col-span-8 space-y-12">
          <div className="flex flex-col md:flex-row gap-8 items-center justify-center p-12 bg-white/40 backdrop-blur-xl rounded-[3rem] border border-white/60 shadow-2xl relative overflow-hidden group">
            
            {/* Background Texture for the Studio */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]"></div>

            {/* ENVELOPE PREVIEW */}
            <div className="relative w-[320px] h-[240px] transform transition-transform duration-500 hover:scale-105 hover:-rotate-1">
              {/* Main Body */}
              <div className={`absolute inset-0 rounded-sm shadow-2xl overflow-hidden ${design.envelope.color}`}>
                 {/* ENGRAVED PATTERN OVERLAY */}
                 <div className="absolute inset-0 opacity-15 bg-[url('https://www.transparenttextures.com/patterns/damask.png')]"></div>
                 <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/30"></div>
                 
                 {/* Gold Foil Accent (Engraved look) */}
                 <div className="absolute inset-0 border-[10px] border-transparent" style={{ borderImage: `${ROYAL_GOLD_GRADIENT} 1`, opacity: 0.15 }}></div>
              </div>

              {/* Side Folds Effect */}
              <div className="absolute inset-0 z-10 pointer-events-none" style={{ clipPath: 'polygon(0% 0%, 50% 48%, 100% 0%, 100% 100%, 0% 100%)' }}>
                 <div className={`absolute inset-0 ${design.envelope.color} opacity-95`}></div>
                 <div className="absolute inset-0 bg-black/10"></div>
              </div>

              {/* Top Flap */}
              <div className="absolute top-0 left-0 w-full h-full z-20">
                 <div className={`w-full h-full rounded-t-sm ${design.envelope.flapColor} shadow-lg`} style={{ clipPath: 'polygon(0 0, 100% 0, 50% 48%)' }}>
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/damask.png')]"></div>
                    {/* Gold Edge on Flap */}
                    <div className="absolute inset-0" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 48%, 50% 50%, 100% 2%, 0 2%)', background: ROYAL_GOLD_GRADIENT }}></div>
                 </div>
              </div>

              {/* Wax Seal */}
              <div className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
                 <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 border-white/20 shadow-xl ${design.envelope.sealColor} relative`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-black/40 opacity-50 rounded-full"></div>
                    <span className="text-2xl filter drop-shadow-md brightness-110">{design.envelope.sealIcon}</span>
                 </div>
              </div>
            </div>

            {/* THE LETTER PREVIEW */}
            <div className={`relative w-[280px] h-[360px] shadow-2xl p-6 transition-all duration-500 hover:scale-105 hover:rotate-1 ${design.letter.paperBg} ${design.letter.borderColor} border-4`}>
               {/* Paper Texture */}
               <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>
               
               {/* Foil Border Accent */}
               <div className="absolute inset-2 border border-transparent pointer-events-none" style={{ borderImage: `${ROYAL_GOLD_GRADIENT} 1`, opacity: 0.4 }}></div>

               <div className={`relative z-10 h-full flex flex-col items-center justify-center text-center space-y-4 ${design.letter.textColor} ${design.letter.fontFamily}`}>
                  <div className="text-xl opacity-20">⚜️</div>
                  <div className="h-0.5 w-8 bg-current opacity-20"></div>
                  <div className="space-y-2 w-full px-4">
                    <div className="h-2 w-2/3 bg-current opacity-10 mx-auto rounded"></div>
                    <div className="h-2 w-full bg-current opacity-10 rounded"></div>
                    <div className="h-2 w-5/6 bg-current opacity-10 mx-auto rounded"></div>
                    <div className="h-2 w-full bg-current opacity-10 rounded"></div>
                    <div className="h-2 w-1/2 bg-current opacity-10 mx-auto rounded"></div>
                  </div>
                  <div className="pt-4 text-xs tracking-widest uppercase opacity-40">Your Sentiment</div>
               </div>
            </div>
          </div>

          <div className="flex gap-4 max-w-md mx-auto">
             <Button variant="secondary" onClick={onBack} className="flex-1 py-4 rounded-2xl border-stone-200">Back to Draft</Button>
             <Button onClick={onConfirm} className="flex-1 py-4 rounded-2xl bg-stone-900 text-white shadow-2xl hover:bg-black">Finalize & Seal</Button>
          </div>
        </div>

        {/* CUSTOMIZATION PANEL (Column 9-12) */}
        <div className="xl:col-span-4 space-y-10">
          
          {/* Paper Catalog */}
          <section className="bg-white p-6 rounded-[2rem] border border-stone-100 shadow-xl shadow-stone-200/40">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400 mb-6 block">I. Stationery Base</h3>
            <div className="grid grid-cols-2 gap-3">
              {PAPER_STYLES.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setDesign({ ...design, letter: style })}
                  className={`group relative p-1 rounded-xl transition-all ${
                    design.letter.id === style.id ? 'ring-2 ring-stone-900 ring-offset-2 scale-95' : 'hover:scale-[1.02]'
                  }`}
                >
                  <div className={`h-20 w-full rounded-lg ${style.paperBg} border-2 ${style.borderColor} shadow-sm flex items-center justify-center`}>
                    <span className={`text-xl ${style.textColor} ${style.fontFamily} opacity-40`}>Aa</span>
                  </div>
                  <div className="mt-2 text-[10px] font-semibold text-stone-500 text-center uppercase tracking-wider">{style.name}</div>
                </button>
              ))}
            </div>
          </section>

          {/* Envelope Catalog */}
          <section className="bg-white p-6 rounded-[2rem] border border-stone-100 shadow-xl shadow-stone-200/40">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400 mb-6 block">II. Outer Envelope</h3>
            <div className="grid grid-cols-5 gap-3">
              {ENVELOPE_STYLES.map((env) => (
                <button
                  key={env.id}
                  onClick={() => setDesign({ ...design, envelope: { ...design.envelope, color: env.color, flapColor: env.flap } })}
                  className={`aspect-square rounded-full border-4 transition-all relative flex items-center justify-center ${
                    design.envelope.color === env.color ? 'border-stone-900 scale-110' : 'border-stone-50 hover:border-stone-200 shadow-inner'
                  } ${env.color}`}
                  title={env.name}
                >
                  <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/damask.png')] rounded-full"></div>
                </button>
              ))}
            </div>
          </section>

          {/* Seal Customization */}
          <section className="bg-white p-6 rounded-[2rem] border border-stone-100 shadow-xl shadow-stone-200/40 space-y-6">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400 mb-2 block">III. Imperial Signet</h3>
            
            <div className="grid grid-cols-5 gap-2">
              {SEAL_ICONS.map((icon) => (
                <button
                  key={icon}
                  onClick={() => setDesign({ ...design, envelope: { ...design.envelope, sealIcon: icon } })}
                  className={`aspect-square flex items-center justify-center text-xl rounded-xl transition-all ${
                    design.envelope.sealIcon === icon ? 'bg-stone-900 text-white shadow-lg' : 'bg-stone-50 border border-stone-100 hover:bg-white'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
               {['bg-[#8b0000]', 'bg-[#d4af37]', 'bg-[#1a1a1a]', 'bg-[#c0c0c0]'].map(c => (
                 <button
                   key={c}
                   onClick={() => setDesign({ ...design, envelope: { ...design.envelope, sealColor: c } })}
                   className={`flex-1 h-8 rounded-lg border-2 ${design.envelope.sealColor === c ? 'border-stone-900' : 'border-transparent'} ${c}`}
                 />
               ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};
