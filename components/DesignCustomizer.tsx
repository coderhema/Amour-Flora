import React from 'react';
import { FullDesign } from '../types';
import { Button } from './Button';

interface DesignCustomizerProps {
  design: FullDesign;
  onChange: (design: FullDesign) => void;
  onConfirm: () => void;
  onBack: () => void;
}

const PAPER_COLORS = [
  { name: 'Classic White', class: 'bg-[#fcfcfc]' },
  { name: 'Vintage Cream', class: 'bg-[#fffaf0]' },
  { name: 'Aged Parchment', class: 'bg-[#f4efea]' },
  { name: 'Midnight Navy', class: 'bg-[#1a2e2a]' },
  { name: 'Royal Crimson', class: 'bg-[#7c1c1c]' },
  { name: 'Dusty Rose', class: 'bg-[#fdf2f2]' },
  { name: 'Sage Green', class: 'bg-[#f1f5f1]' },
];

const PAPER_TEXTURES = [
  { name: 'Smooth', class: 'opacity-0' },
  { name: 'Subtle Linen', class: "opacity-40 bg-[url('https://www.transparenttextures.com/patterns/linen.png')]" },
  { name: 'Aged Vellum', class: "opacity-50 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" },
  { name: 'Handmade', class: "opacity-30 bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')]" },
  { name: 'Laid Paper', class: "opacity-20 bg-[url('https://www.transparenttextures.com/patterns/laid-paper.png')]" },
  { name: 'Rough Parchment', class: "opacity-60 bg-[url('https://www.transparenttextures.com/patterns/parchment.png')]" },
];

const TEXT_COLORS = [
  { name: 'Ink Black', class: 'text-stone-900' },
  { name: 'Deep Emerald', class: 'text-emerald-950' },
  { name: 'Royal Gold', class: 'text-amber-900' },
  { name: 'Soft Gray', class: 'text-stone-500' },
  { name: 'White', class: 'text-white' },
];

const ENVELOPE_COLORS = [
  { name: 'Stone Gray', class: 'bg-[#e5e5e5]' },
  { name: 'Forest Green', class: 'bg-[#1a2e2a]' },
  { name: 'Imperial Red', class: 'bg-[#7c1c1c]' },
  { name: 'Sandstone', class: 'bg-[#e8e0d5]' },
  { name: 'Midnight', class: 'bg-[#0a0a0a]' },
  { name: 'Royal Blue', class: 'bg-[#1e3a8a]' },
  { name: 'Deep Purple', class: 'bg-[#4c1d95]' },
  { name: 'Soft Pink', class: 'bg-[#fbcfe8]' },
];

const SEAL_ICONS = ['🌿', '👑', '⚪', '🔒', '🌹', '⚜️', '🕊️', '✉️'];

const LINING_PATTERNS = [
  { name: 'Solid Dark', class: 'bg-stone-800' },
  { name: 'Gold Foil', class: 'bg-amber-500/20' },
  { name: 'Emerald Silk', class: 'bg-emerald-900/50' },
  { name: 'Royal Velvet', class: 'bg-rose-900/50' },
  { name: 'Midnight', class: 'bg-slate-900' },
];

const FONTS = [
  { name: 'Serif (Classic)', class: 'font-serif' },
  { name: 'Sans (Modern)', class: 'font-sans' },
  { name: 'Mono (Typewriter)', class: 'font-mono' },
];

export const DesignCustomizer: React.FC<DesignCustomizerProps> = ({ 
  design, 
  onChange, 
  onConfirm,
  onBack
}) => {
  const updateLetter = (updates: Partial<typeof design.letter>) => {
    onChange({
      ...design,
      letter: { ...design.letter, ...updates }
    });
  };

  const updateEnvelope = (updates: Partial<typeof design.envelope>) => {
    onChange({
      ...design,
      envelope: { ...design.envelope, ...updates }
    });
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in space-y-12">
      <div className="text-center">
        <h2 className="font-serif text-4xl text-stone-800 mb-4 tracking-tight">Fine-Tune Your Design</h2>
        <p className="text-stone-500 italic">Customize every detail of your letter and envelope.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Letter Customization */}
        <div className="space-y-8 bg-white/50 p-8 rounded-3xl border border-stone-100 shadow-sm">
          <h3 className="text-lg font-serif text-stone-800 border-b border-stone-100 pb-2">The Letter</h3>
          
          <div className="space-y-4">
            <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">Paper Color</label>
            <div className="flex flex-wrap gap-3">
              {PAPER_COLORS.map((color) => (
                <button
                  key={color.name}
                  onClick={() => updateLetter({ paperBg: color.class })}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    design.letter.paperBg === color.class ? 'border-rose-500 scale-110 shadow-md' : 'border-stone-200 hover:border-stone-400'
                  } ${color.class}`}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">Text Color</label>
            <div className="flex flex-wrap gap-3">
              {TEXT_COLORS.map((color) => (
                <button
                  key={color.name}
                  onClick={() => updateLetter({ textColor: color.class })}
                  className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center ${
                    design.letter.textColor === color.class ? 'border-rose-500 scale-110 shadow-md' : 'border-stone-200 hover:border-stone-400'
                  } bg-white`}
                  title={color.name}
                >
                  <span className={`${color.class} font-bold`}>A</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">Typography</label>
            <div className="grid grid-cols-1 gap-2">
              {FONTS.map((font) => (
                <button
                  key={font.name}
                  onClick={() => updateLetter({ fontFamily: font.class })}
                  className={`px-4 py-3 rounded-xl border-2 text-left transition-all ${
                    design.letter.fontFamily === font.class ? 'border-rose-400 bg-rose-50 text-rose-700' : 'border-stone-100 hover:border-stone-200 text-stone-600'
                  } ${font.class}`}
                >
                  {font.name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">Paper Texture</label>
            <div className="grid grid-cols-2 gap-2">
              {PAPER_TEXTURES.map((texture) => (
                <button
                  key={texture.name}
                  onClick={() => updateLetter({ paperTexture: texture.class })}
                  className={`px-3 py-2 rounded-lg border-2 text-xs font-medium transition-all ${
                    design.letter.paperTexture === texture.class ? 'border-rose-400 bg-rose-50 text-rose-700' : 'border-stone-100 hover:border-stone-200 text-stone-500'
                  }`}
                >
                  {texture.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Envelope Customization */}
        <div className="space-y-8 bg-white/50 p-8 rounded-3xl border border-stone-100 shadow-sm">
          <h3 className="text-lg font-serif text-stone-800 border-b border-stone-100 pb-2">The Envelope</h3>
          
          <div className="space-y-4">
            <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">Envelope Color</label>
            <div className="flex flex-wrap gap-3">
              {ENVELOPE_COLORS.map((color) => (
                <button
                  key={color.name}
                  onClick={() => {
                    // Extract hex or color class and try to find a slightly darker version for flap
                    const baseClass = color.class;
                    updateEnvelope({ color: baseClass, flapColor: baseClass });
                  }}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    design.envelope.color === color.class ? 'border-rose-500 scale-110 shadow-md' : 'border-stone-200 hover:border-stone-400'
                  } ${color.class}`}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">Wax Seal Icon</label>
            <div className="flex flex-wrap gap-3">
              {SEAL_ICONS.map((icon) => (
                <button
                  key={icon}
                  onClick={() => updateEnvelope({ sealIcon: icon })}
                  className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center text-xl ${
                    design.envelope.sealIcon === icon ? 'border-rose-500 bg-rose-50 scale-110 shadow-md' : 'border-stone-200 hover:border-stone-400 bg-white'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">Seal Color</label>
            <div className="flex flex-wrap gap-3">
              {['bg-[#d14949]', 'bg-[#bf953f]', 'bg-[#ffd700]', 'bg-[#404040]', 'bg-[#1a2e2a]'].map((color) => (
                <button
                  key={color}
                  onClick={() => updateEnvelope({ sealColor: color })}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    design.envelope.sealColor === color ? 'border-rose-500 scale-110 shadow-md' : 'border-stone-200 hover:border-stone-400'
                  } ${color}`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">Inner Lining</label>
            <div className="grid grid-cols-2 gap-2">
              {LINING_PATTERNS.map((lining) => (
                <button
                  key={lining.name}
                  onClick={() => updateEnvelope({ liningPattern: lining.class })}
                  className={`px-3 py-2 rounded-lg border-2 text-xs font-medium transition-all ${
                    design.envelope.liningPattern === lining.class ? 'border-rose-400 bg-rose-50 text-rose-700' : 'border-stone-100 hover:border-stone-200 text-stone-500'
                  }`}
                >
                  {lining.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 justify-center">
        <Button variant="secondary" onClick={onBack} className="px-8">
          Back to Presets
        </Button>
        <Button onClick={onConfirm} className="px-12">
          Confirm Customization
        </Button>
      </div>
    </div>
  );
};
