
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { LetterRequest, FlowerRequest } from '../types';

// Models
const TEXT_MODEL = 'gemini-2.0-flash';

export const generateLetter = async (request: LetterRequest): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
    Write a ${request.tone} ${request.occasion} to ${request.recipient}.
    
    Relationship to recipient: ${request.relationship}
    
    Specific memories or characteristics to weave in:
    ${request.memories}
    
    Other details to include:
    ${request.details}
    
    Ensure the formatting is elegant. If it is a poem, format it with stanzas. 
    Do not include markdown code blocks (like \`\`\`), just the raw text of the letter.
    Sign it off with a placeholder [Your Name] if not specified.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: prompt,
      config: {
        systemInstruction: "You are an expert writer, poet, and romantic helper. You craft emotionally resonant, well-structured, and beautiful letters."
      }
    });

    if (response.text) {
      return response.text;
    }
    throw new Error("No text generated.");
  } catch (error) {
    console.error("Letter generation failed:", error);
    throw error;
  }
};

export const generateFlower = async (request: FlowerRequest): Promise<string> => {
  // Use Pollinations.ai — completely free, no API key required
  const prompt = encodeURIComponent(
    `${request.style} image of ${request.colorPalette} ${request.flowerType}, high resolution, artistically composed, centered, visually stunning, intricate petal details, beautiful lighting`
  );
  const width = 512;
  const height = 512;
  const seed = Math.floor(Math.random() * 1000000);
  const imageUrl = `https://image.pollinations.ai/prompt/${prompt}?width=${width}&height=${height}&seed=${seed}&nologo=true`;

  try {
    // Verify the image is reachable
    const res = await fetch(imageUrl);
    if (!res.ok) throw new Error(`Pollinations request failed: ${res.status}`);
    return imageUrl;
  } catch (error) {
    console.error("Flower generation failed:", error);
    throw error;
  }
};
