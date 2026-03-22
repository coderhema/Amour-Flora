import React from 'react';
import { Button } from './Button';

interface ShareModalProps {
  url: string;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ url, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-stone-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 space-y-6 animate-scale-in">
        <div className="text-center space-y-2">
          <div className="text-4xl">✉️</div>
          <h3 className="text-2xl font-serif text-stone-800">Letter Sealed & Ready</h3>
          <p className="text-stone-500">Your imperial sentiment has been encoded into a unique link. Share it with your recipient.</p>
        </div>

        <div className="relative group">
          <input 
            readOnly 
            value={url} 
            className="w-full px-4 py-4 bg-stone-50 border-2 border-stone-100 rounded-xl text-sm text-stone-600 font-mono focus:outline-none pr-24"
          />
          <button 
            onClick={handleCopy}
            className={`absolute right-2 top-2 bottom-2 px-4 rounded-lg text-xs font-bold transition-all ${
              copied ? 'bg-emerald-500 text-white' : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
            }`}
          >
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>

        <div className="flex justify-center pt-4">
          <Button onClick={onClose} className="px-12">
            Back to Letter
          </Button>
        </div>
      </div>
    </div>
  );
};
