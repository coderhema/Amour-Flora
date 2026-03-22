
import React, { useState } from 'react';
import { FullDesign } from '../types';
import { Envelope } from './Envelope';
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

export const DispatchView: React.FC<DispatchViewProps> = ({
  content,
  design,
  stampImage,
  recipientName,
  onShare,
  onEdit,
  onReset,
}) => {
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [showLetter, setShowLetter] = useState(false);

  const handleOpenEnvelope = () => {
    setEnvelopeOpened(true);
    setTimeout(() => setShowLetter(true), 1400);
  };

  const letterColClass = showLetter
    ? 'opacity-100 translate-y-0'
    : 'opacity-0 translate-y-10 pointer-events-none';

  const actionsClass = showLetter
    ? 'opacity-100 translate-y-0'
    : 'opacity-0 translate-y-6 pointer-events-none';

  return (
    <div className="flex flex-col items-center w-full min-h-[90vh] py-12 animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="font-serif text-4xl text-stone-800 mb-3 tracking-tight">Ready to Dispatch</h2>
        <p className="text-stone-400 italic text-sm">
          {envelopeOpened
            ? 'Your letter is revealed. Share it when ready.'
            : 'Click the envelope to reveal your letter.'}
        </p>
      </div>

      <div className="w-full max-w-6xl flex flex-col lg:flex-row items-start justify-center gap-10 px-4">

        {/* Envelope column */}
        <div className="w-full lg:w-1/2 flex flex-col items-center">
          <Envelope
            isOpened={envelopeOpened}
            onOpen={handleOpenEnvelope}
            design={design.envelope}
            paperDesign={design.letter}
            stampImage={stampImage}
            recipientName={recipientName}
          />
          {!envelopeOpened && (
            <p className="text-xs text-stone-400 mt-8 font-mono uppercase tracking-widest">
              ↑ Click to open
            </p>
          )}
        </div>

        {/* Letter column */}
        <div className={`w-full lg:w-1/2 transition-all duration-1000 ${letterColClass}`}>
          <div
            className={`relative ${design.letter.paperBg} ${design.letter.borderColor} border-[8px] p-8 md:p-14 shadow-2xl flex flex-col min-h-[500px] overflow-hidden rounded-sm`}
          >
            {/* Paper texture */}
            <div className={`absolute inset-0 pointer-events-none ${design.letter.paperTexture} opacity-20`}></div>
            <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] mix-blend-multiply"></div>

            {/* Foil frame */}
            <div
              className="absolute inset-4 border-2 border-transparent pointer-events-none"
              style={{
                borderImage:
                  'linear-gradient(45deg, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c) 1',
                opacity: 0.2,
              }}
            ></div>

            <div className="relative z-10 flex flex-col items-center flex-grow">
              <div className={`mb-8 text-3xl ${design.letter.textColor} opacity-20 select-none`}>
                ✧ ⚜ ✧
              </div>

              <div
                className={`w-full ${design.letter.fontFamily} ${design.letter.textColor} text-lg leading-relaxed tracking-wide whitespace-pre-wrap text-center`}
              >
                {content}
              </div>

              <div className={`mt-12 text-2xl ${design.letter.textColor} opacity-15`}>❦</div>
            </div>

            {/* Corner decorations */}
            <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-black/10"></div>
            <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-black/10"></div>
            <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-black/10"></div>
            <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-black/10"></div>
          </div>
        </div>
      </div>

      {/* Actions — shown once letter is visible */}
      <div className={`flex flex-wrap justify-center gap-5 mt-14 transition-all duration-700 delay-300 ${actionsClass}`}>
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
  );
};