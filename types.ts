
export enum AppTab {
  LETTERS = 'LETTERS',
  FLOWERS = 'FLOWERS'
}

export enum LetterOccasion {
  LOVE = 'Love Letter',
  ANNIVERSARY = 'Anniversary',
  APOLOGY = 'Apology',
  BIRTHDAY = 'Birthday',
  CONGRATULATIONS = 'Congratulations',
  THANK_YOU = 'Thank You',
  MISS_YOU = 'Thinking of You',
  POEM = 'Poem'
}

export enum LetterTone {
  ROMANTIC = 'Romantic',
  FUNNY = 'Funny & Witty',
  FORMAL = 'Formal',
  POETIC = 'Poetic & Shakespearean',
  CASUAL = 'Casual & Warm',
  INTENSE = 'Passionate & Intense'
}

export enum FlowerStyle {
  REALISTIC = 'Photorealistic 4k',
  WATERCOLOR = 'Soft Watercolor',
  OIL_PAINTING = 'Classic Oil Painting',
  SKETCH = 'Pencil Sketch',
  VINTAGE = 'Vintage Botanical Illustration',
  CYBERPUNK = 'Neon Cyberpunk'
}

export interface LetterRequest {
  recipient: string;
  occasion: LetterOccasion;
  tone: LetterTone;
  details: string;
}

export interface FlowerRequest {
  flowerType: string;
  colorPalette: string;
  style: FlowerStyle;
}

// --- DESIGN TYPES ---

export interface LetterDesign {
  id: string;
  name: string;
  paperBg: string;
  paperTexture: string;
  textColor: string;
  borderColor: string;
  fontFamily: string;
}

export interface EnvelopeDesign {
  color: string;
  flapColor: string;
  sealColor: string;
  sealIcon: string;
  liningPattern?: string;
}

export interface FullDesign {
  letter: LetterDesign;
  envelope: EnvelopeDesign;
}

export enum LetterCategory {
  PERSONAL = 'Personal',
  PROFESSIONAL = 'Professional',
  FORMAL = 'Formal'
}

export interface LetterTemplate {
  id: string;
  category: LetterCategory;
  title: string;
  content: string;
}

export interface FlowerOption {
  id: string;
  name: string;
  icon: string;
}

export interface ColorOption {
  id: string;
  name: string;
  class: string;
  isGradient?: boolean;
}
