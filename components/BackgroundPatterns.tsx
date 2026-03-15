
import React from 'react';

const PATHS = {
  CORNER_FILIGREE: "M0 0 C 20 0, 40 20, 40 40 M 10 0 C 30 10, 40 30, 40 50 M 0 10 C 10 30, 30 40, 50 40 M 5 5 L 25 25 M 0 20 C 5 35, 20 45, 35 45",
  SIDE_VINE: "M0 0 Q 30 100, 0 200 T 0 400 T 0 600",
  TOP_VINE: "M0 0 Q 100 30, 200 0 T 400 0 T 600 0",
  CROWN_MOTIF: "M50 20 L 60 40 L 80 45 L 65 60 L 70 80 L 50 70 L 30 80 L 35 60 L 20 45 L 40 40 Z"
};

const GOLD_COLOR = 'text-[#d4af37]'; // Imperial Gold

interface OrnamentProps {
  path: string;
  transform?: string;
  duration?: number;
  delay?: number;
}

const Ornament: React.FC<OrnamentProps> = ({ path, transform, duration = 4, delay = 0 }) => (
  <g transform={transform}>
    <path
      d={path}
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      fill="none"
      className={`${GOLD_COLOR} opacity-0`}
      style={{
        strokeDasharray: 3000,
        strokeDashoffset: 3000,
        animation: `
          drawStroke ${duration}s cubic-bezier(0.35, 0, 0.25, 1) ${delay}s forwards,
          fadeIn 0.8s ease-out ${delay}s forwards,
          breathe 6s ease-in-out ${delay + duration}s infinite alternate
        `
      }}
    />
  </g>
);

export const BackgroundPatterns: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#fdfaf6]">
      <svg 
        className="w-full h-full opacity-[0.25]" 
        viewBox="0 0 1000 1000" 
        preserveAspectRatio="xMidYMid slice" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes drawStroke {
            to { stroke-dashoffset: 0; }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes breathe {
            from { opacity: 1; }
            to { opacity: 0.6; }
          }
        `}} />

        {/* Fixed Corner Ornaments - Quick, crisp entry */}
        <Ornament path={PATHS.CORNER_FILIGREE} transform="translate(50, 50) scale(2.5)" duration={3} delay={0.2} />
        <Ornament path={PATHS.CORNER_FILIGREE} transform="translate(950, 50) scale(2.5) rotate(90)" duration={3} delay={0.4} />
        <Ornament path={PATHS.CORNER_FILIGREE} transform="translate(50, 950) scale(2.5) rotate(-90)" duration={3} delay={0.6} />
        <Ornament path={PATHS.CORNER_FILIGREE} transform="translate(950, 950) scale(2.5) rotate(180)" duration={3} delay={0.8} />

        {/* Side Borders - Slower, elegant draw */}
        <Ornament path={PATHS.SIDE_VINE} transform="translate(30, 300) scale(1, 1)" duration={8} delay={1.5} />
        <Ornament path={PATHS.SIDE_VINE} transform="translate(970, 300) scale(-1, 1)" duration={8} delay={1.7} />
        
        {/* Top and Bottom Borders - Longest draw */}
        <Ornament path={PATHS.TOP_VINE} transform="translate(300, 30)" duration={10} delay={2.0} />
        <Ornament path={PATHS.TOP_VINE} transform="translate(300, 970) scale(1, -1)" duration={10} delay={2.3} />

        {/* Subtle Background Pattern (Damask style repetition) - Late entry */}
        {[...Array(5)].map((_, i) => (
          <React.Fragment key={i}>
            <Ornament 
              path={PATHS.CROWN_MOTIF} 
              transform={`translate(${150 + i * 175}, 150) scale(0.5)`} 
              duration={6} 
              delay={3 + i * 0.3} 
            />
            <Ornament 
              path={PATHS.CROWN_MOTIF} 
              transform={`translate(${150 + i * 175}, 850) scale(0.5)`} 
              duration={6} 
              delay={3.5 + i * 0.3} 
            />
          </React.Fragment>
        ))}
      </svg>
      
      {/* Texture & Lighting Overlays */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-[0.04] pointer-events-none mix-blend-multiply"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-stone-200/20 pointer-events-none"></div>
    </div>
  );
};
