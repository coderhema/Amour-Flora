
import React from 'react';

export const BackgroundPatterns: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      <svg className="w-full h-full opacity-[0.18]" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes growPath {
            from { stroke-dashoffset: 2000; }
            to { stroke-dashoffset: 0; }
          }
          @keyframes gentleSway {
            0%, 100% { transform: rotate(0deg) translateX(0); }
            50% { transform: rotate(1deg) translateX(5px); }
          }
          .animate-grow {
            stroke-dasharray: 2000;
            stroke-dashoffset: 2000;
            animation: growPath 12s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }
          .sway {
            animation: gentleSway 20s ease-in-out infinite;
          }
        `}} />

        {/* --- RIGHT SIDE GROWTH --- */}
        <g className="sway" style={{ transformOrigin: 'right center' }}>
          {/* Main Climbing Vine - Right */}
          <path 
            className="animate-grow text-sage-300" 
            d="M1020 200 C 950 250, 920 150, 850 300 S 800 500, 750 450 S 700 600, 650 550 S 600 700, 680 800" 
            stroke="currentColor" 
            strokeWidth="1.2" 
            strokeLinecap="round" 
          />
          
          {/* Blooming Rose - Top Right */}
          <path 
            className="animate-grow text-rose-300" 
            d="M850 300 C 870 280, 900 280, 910 310 S 880 350, 850 340 S 820 310, 850 300 M 850 300 C 840 270, 870 240, 900 250 S 930 300, 910 330 M 850 300 C 820 280, 800 320, 830 350 S 880 370, 910 340" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            style={{ animationDelay: '2s' }}
          />

          {/* Leaves - Right Side */}
          <path className="animate-grow text-sage-200" d="M920 150 Q 900 130, 880 150 T 900 170 Z" stroke="currentColor" fill="currentColor" fillOpacity="0.05" style={{ animationDelay: '1s' }} />
          <path className="animate-grow text-sage-200" d="M780 480 Q 760 460, 740 480 T 760 500 Z" stroke="currentColor" fill="currentColor" fillOpacity="0.05" style={{ animationDelay: '4s' }} />
        </g>

        {/* --- LEFT SIDE GROWTH --- */}
        <g className="sway" style={{ transformOrigin: 'left center', animationDelay: '-10s' }}>
          {/* Main Vine - Left */}
          <path 
            className="animate-grow text-sage-300" 
            d="M-20 700 C 50 650, 80 750, 150 600 S 200 400, 250 450 S 300 300, 350 350 S 400 200, 320 100" 
            stroke="currentColor" 
            strokeWidth="1.2" 
            strokeLinecap="round" 
            style={{ animationDelay: '1.5s' }}
          />

          {/* Lily Bloom - Center Left */}
          <path 
            className="animate-grow text-rose-200" 
            d="M150 600 Q 130 570, 150 540 Q 170 570, 150 600 M 150 600 Q 180 580, 210 600 Q 180 620, 150 600 M 150 600 Q 130 630, 150 660 Q 170 630, 150 600 M 150 600 Q 120 580, 90 600 Q 120 620, 150 600" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            style={{ animationDelay: '3.5s' }}
          />

          {/* Heart Vines - Bottom Left */}
          <path 
            className="animate-grow text-rose-100" 
            d="M50 850 C 70 830, 100 830, 100 850 S 70 890, 50 900 S 0 890, 0 850 S 30 830, 50 850" 
            stroke="currentColor" 
            strokeWidth="1" 
            style={{ animationDelay: '5s' }}
          />
        </g>

        {/* --- ACCENT STROKES --- */}
        {/* Floating Petals */}
        <path className="animate-grow text-rose-100" d="M400 100 Q 410 110, 400 120 Q 390 110, 400 100" stroke="currentColor" style={{ animationDelay: '8s' }} />
        <path className="animate-grow text-rose-100" d="M600 850 Q 610 860, 600 870 Q 590 860, 600 850" stroke="currentColor" style={{ animationDelay: '9s' }} />
        
        {/* Subtle Horizontal Connectors */}
        <path 
          className="animate-grow text-sage-100" 
          d="M350 350 Q 500 400, 650 350" 
          stroke="currentColor" 
          strokeWidth="0.5" 
          strokeDasharray="4 8"
          style={{ animationDelay: '6s' }}
        />
      </svg>
    </div>
  );
};
