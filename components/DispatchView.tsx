
import React, { useState, useEffect } from 'react';
import { FullDesign } from '../types';
import { Button } from './Button';

interface DispatchViewProps {
  content: string;
  design: FullDesign;
  stampImage?: string | null;
  recipientName?: string;
  onShare: () => void;
  onEdit: () => void;
  onReset: () => void;
}

// Animation stages:
// 'letter'   — full letter displayed, "Seal it" button visible
// 'folding'  — letter scales down and slides into envelope position
// 'closing'  — envelope flap rotates shut
// 'sealed'   — final sealed envelope, wax seal pulses, action buttons appear

type Stage = 'letter' | 'folding' | 'closing' | 'sealed';

export const DispatchView: React.FC<DispatchViewProps> = ({
  content,
  design,
  stampImage,
  recipientName = 'You',
  onShare,
  onEdit,
  onReset,
}) => {
  const [stage, setStage] = useState<Stage>('letter');

  const handleSeal = () => {
    setStage('folding');
    setTimeout(() => setStage('closing'), 900);
    setTimeout(() => setStage('sealed'), 2000);
  };

  // Letter style based on stage
  const letterStyle: React.CSSProperties =
    stage === 'folding'
      ? {
          transform: 'translateY(60%) scale(0.18)',
          opacity: 0.6,
          transition: 'transform 900ms cubic-bezier(0.7,0,0.3,1), opacity 700ms ease',
        }
      : stage === 'closing' || stage === 'sealed'
      ? {
          transform: 'translateY(60%) scale(0.18)',
          opacity: 0,
          transition: 'opacity 300ms ease',
        }
      : {
          transform: 'translateY(0) scale(1)',
          opacity: 1,
          transition: 'transform 900ms cubic-bezier(0.7,0,0.3,1), opacity 700ms ease',
        };

  // Envelope visibility
  const envelopeVisible = stage === 'folding' || stage === 'closing' || stage === 'sealed';

  // Flap closed when stage is closing or sealed
  const flapClosed = stage === 'closing' || stage === 'sealed';

  const envDesign = design.envelope;
  const paperDesign = design.letter;

  return (
    <div className="flex flex-col items-center w-full min-h-[90vh] justify-center py-12 relative animate-fade-in overflow-hidden">

      {/* ── LETTER (full-size, fades and shrinks into envelope) ── */}
      {(stage === 'letter' || stage === 'folding') && (
        <div
          className="w-full max-w-2xl mx-auto px-4 origin-bottom"
          style={letterStyle}
        >
          {/* Paper */}
          <div
            className={`relative ${paperDesign.paperBg} ${paperDesign.borderColor} border-[8px] p-8 md:p-16 shadow-[0_40px_80px_rgba(0,0,0,0.25)] flex flex-col min-h-[500px] overflow-hidden`}
          >
            {/* Texture */}
            <div className={`absolute inset-0 pointer-events-none ${paperDesign.paperTexture} opacity-20`} />
            <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] mix-blend-multiply" />
            {/* Foil frame */}
            <div
              className="absolute inset-4 border-2 border-transparent pointer-events-none"
              style={{ borderImage: 'linear-gradient(45deg,#bf953f,#fcf6ba,#b38728,#fbf5b7,#aa771c) 1', opacity: 0.22 }}
            />
            {/* Fold lines */}
            <div className="absolute inset-0 pointer-events-none flex flex-col opacity-10">
              <div className="h-1/3 w-full border-b border-black/10" />
              <div className="h-1/3 w-full border-b border-black/10" />
            </div>
            <div className="relative z-10 flex flex-col items-center flex-grow">
              <div className={`mb-8 text-3xl ${paperDesign.textColor} opacity-20 select-none`}>✧ ⚜ ✧</div>
              <div className={`w-full ${paperDesign.fontFamily} ${paperDesign.textColor} text-xl leading-relaxed tracking-wide whitespace-pre-wrap text-center`}>
                {content}
              </div>
              <div className={`mt-12 text-2xl ${paperDesign.textColor} opacity-15`}>❦</div>
            </div>
            {/* Corner decorations */}
            <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-black/10" />
            <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-black/10" />
            <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-black/10" />
            <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-black/10" />
          </div>

          {/* Seal button — hidden while folding */}
          {stage === 'letter' && (
            <div className="flex flex-col items-center mt-10 gap-4 animate-fade-in">
              <p className="text-stone-400 italic text-sm">Your letter is ready.</p>
              <Button
                onClick={handleSeal}
                className="rounded-full px-12 py-4 bg-stone-900 text-white shadow-2xl hover:bg-black text-lg"
              >
                🕯 Seal & Dispatch
              </Button>
            </div>
          )}
        </div>
      )}

      {/* ── ENVELOPE (rises up as letter folds in) ── */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{
          opacity: envelopeVisible ? 1 : 0,
          transition: 'opacity 400ms ease',
          pointerEvents: stage === 'sealed' ? 'auto' : 'none',
        }}
      >
        <div className="flex flex-col items-center gap-8 px-4 w-full max-w-lg">

          {/* ── CUSTOM ENVELOPE (no interactive open) ── */}
          <div className="relative w-full aspect-[5/3.5] select-none"
            style={{ perspective: '1200px' }}
          >
            {/* Back / body */}
            <div className={`absolute inset-0 rounded-sm shadow-[20px_30px_40px_rgba(44,40,37,0.25)] ${envDesign.color} overflow-hidden border border-stone-200/20`}>
              <div className="absolute inset-0 opacity-25 pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
              <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/40" />
            </div>

            {/* Front V-folds */}
            <div className="absolute inset-0 z-30 pointer-events-none">
              <div className={`absolute inset-0 ${envDesign.color}`} style={{ clipPath: 'polygon(0 100%, 50% 40%, 100% 100%)' }}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
              </div>
              <div className={`absolute inset-0 ${envDesign.color}`} style={{ clipPath: 'polygon(0 0, 50% 40%, 0 100%)' }}>
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-black/5" />
              </div>
              <div className={`absolute inset-0 ${envDesign.color}`} style={{ clipPath: 'polygon(100% 0, 50% 40%, 100% 100%)' }}>
                <div className="absolute inset-0 bg-gradient-to-l from-white/10 to-black/5" />
              </div>
            </div>

            {/* Address — hidden once sealed */}
            <div
              className="absolute inset-0 z-40 pointer-events-none transition-opacity duration-500"
              style={{ opacity: flapClosed ? 0 : 1 }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/4 w-full px-12 text-center">
                <div className="space-y-1">
                  <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-stone-500/60 mb-2">Deliver To:</div>
                  <h2 className="text-3xl md:text-5xl font-serif italic text-stone-800 drop-shadow-sm leading-tight">
                    {recipientName}
                  </h2>
                </div>
              </div>
            </div>

            {/* Stamp */}
            {stampImage && (
              <div
                className="absolute top-3 right-3 z-50 w-14 h-14 md:w-16 md:h-16 overflow-hidden shadow-lg border-2 border-white/40"
                style={{ transition: 'opacity 600ms ease', opacity: envelopeVisible ? 1 : 0 }}
              >
                <img src={stampImage} alt="stamp" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/10" />
              </div>
            )}

            {/* TOP FLAP — animates closed */}
            <div
              className="absolute top-0 left-0 w-full h-[65%] z-40 origin-top"
              style={{
                clipPath: 'polygon(0 0, 100% 0, 100% 20%, 50% 100%, 0 20%)',
                transform: flapClosed ? 'rotateX(0deg)' : 'rotateX(180deg)',
                transition: 'transform 900ms cubic-bezier(0.6,0,0.4,1)',
                transformStyle: 'preserve-3d',
              }}
            >
              <div className={`absolute inset-0 ${envDesign.flapColor} shadow-2xl`}>
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-black/20" />
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
                {/* Wax seal — only shown when sealed */}
                <div
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 transition-all duration-700"
                  style={{
                    opacity: stage === 'sealed' ? 1 : 0,
                    transform: stage === 'sealed' ? 'scale(1)' : 'scale(0.4)',
                    transitionDelay: stage === 'sealed' ? '600ms' : '0ms',
                  }}
                >
                  <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full ${envDesign.sealColor} shadow-xl flex items-center justify-center text-xl md:text-2xl border border-white/10 relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-black/40" />
                    <span className="relative z-10">{envDesign.sealIcon}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── ACTIONS — appear after sealed ── */}
          <div
            className="flex flex-wrap justify-center gap-5 w-full transition-all duration-700"
            style={{
              opacity: stage === 'sealed' ? 1 : 0,
              transform: stage === 'sealed' ? 'translateY(0)' : 'translateY(16px)',
              transitionDelay: stage === 'sealed' ? '900ms' : '0ms',
              pointerEvents: stage === 'sealed' ? 'auto' : 'none',
            }}
          >
            <p className="w-full text-center text-stone-400 italic text-sm mb-1">Your letter is sealed.</p>
            <Button onClick={onShare} className="rounded-full px-10 bg-stone-900 text-white shadow-2xl hover:bg-black">
              Share Letter
            </Button>
            <Button variant="secondary" onClick={onEdit} className="rounded-full px-10 border-stone-200 shadow-xl bg-white">
              Modify Design
            </Button>
            <Button variant="ghost" onClick={onReset} className="text-stone-400 hover:text-stone-600">
              Write New
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
