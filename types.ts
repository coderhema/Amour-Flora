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

export interface GeneratedContent {
  type: 'text' | 'image';
  content: string; // Text content or Base64 image string
  timestamp: number;
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