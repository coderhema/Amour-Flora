import { FullDesign } from '../types';

export const DESIGNS: FullDesign[] = [
  {
    id: 'midnight-botanical',
    name: 'Midnight Botanical',
    letter: {
      id: 'midnight-paper',
      name: 'Midnight Paper',
      paperBg: 'bg-[#fdfcf0]',
      paperTexture: "opacity-40 bg-[url('https://www.transparenttextures.com/patterns/linen.png')]",
      borderColor: 'border-emerald-900/20',
      textColor: 'text-emerald-950',
      fontFamily: 'font-serif',
    },
    envelope: {
      id: 'midnight-env',
      name: 'Midnight Envelope',
      color: 'bg-[#1a2e2a]',
      flapColor: 'bg-[#142421]',
      sealColor: 'bg-[#bf953f]',
      sealIcon: '🌿',
      liningPattern: 'bg-emerald-900/50',
    }
  },
  {
    id: 'royal-gold',
    name: 'Royal Gold',
    letter: {
      id: 'royal-paper',
      name: 'Royal Paper',
      paperBg: 'bg-[#fffaf0]',
      paperTexture: "opacity-20 bg-[url('https://www.transparenttextures.com/patterns/laid-paper.png')]",
      borderColor: 'border-amber-400/30',
      textColor: 'text-amber-950',
      fontFamily: 'font-serif',
    },
    envelope: {
      id: 'royal-env',
      name: 'Royal Envelope',
      color: 'bg-[#7c1c1c]',
      flapColor: 'bg-[#631616]',
      sealColor: 'bg-[#ffd700]',
      sealIcon: '👑',
      liningPattern: 'bg-amber-500/20',
    }
  },
  {
    id: 'minimalist-zen',
    name: 'Minimalist Zen',
    letter: {
      id: 'zen-paper',
      name: 'Zen Paper',
      paperBg: 'bg-[#fcfcfc]',
      paperTexture: "opacity-0",
      borderColor: 'border-stone-200',
      textColor: 'text-stone-700',
      fontFamily: 'font-sans',
    },
    envelope: {
      id: 'zen-env',
      name: 'Zen Envelope',
      color: 'bg-[#e5e5e5]',
      flapColor: 'bg-[#d4d4d4]',
      sealColor: 'bg-[#404040]',
      sealIcon: '⚪',
      liningPattern: 'bg-stone-100',
    }
  },
  {
    id: 'dossier',
    name: 'Secret Dossier',
    letter: {
      id: 'dossier-paper',
      name: 'Field Report',
      paperBg: 'bg-[#f4efea]',
      paperTexture: "opacity-60 bg-[url('https://www.transparenttextures.com/patterns/parchment.png')]",
      borderColor: 'border-stone-300',
      textColor: 'text-stone-800',
      fontFamily: 'font-mono',
    },
    envelope: {
      id: 'dossier-env',
      name: 'Classified',
      color: 'bg-[#e8e0d5]',
      flapColor: 'bg-[#dfd7cc]',
      sealColor: 'bg-[#d14949]',
      sealIcon: '🔒',
      liningPattern: 'bg-stone-900',
    }
  }
];
