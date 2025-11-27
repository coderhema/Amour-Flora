import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { LetterRequest, FlowerRequest } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Models
const TEXT_MODEL = 'gemini-2.5-flash';
const IMAGE_MODEL = 'gemini-2.5-flash-image';

export const generateLetter = async (request: LetterRequest): Promise<string> => {
  const prompt = `
    Write a ${request.tone} ${request.occasion} to ${request.recipient}.
    
    Specific details to include:
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
  const prompt = `
    Generate a ${request.style} image of ${request.colorPalette} ${request.flowerType}.
    The image should be high resolution, artistically composed, centered, and visually stunning.
    Focus on the intricate details of the petals and lighting.
    Aspect ratio 1:1.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: IMAGE_MODEL,
      contents: prompt,
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        }
      }
    });

    // Parse response for image data
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64Data = part.inlineData.data;
          const mimeType = part.inlineData.mimeType || 'image/png';
          return `data:${mimeType};base64,${base64Data}`;
        }
      }
    }
    
    throw new Error("No image generated.");
  } catch (error) {
    console.error("Flower generation failed:", error);
    throw error;
  }
};