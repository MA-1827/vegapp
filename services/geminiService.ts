
import { GoogleGenAI, Type } from "@google/genai";
import { NutritionData } from "../types";

const getNucleusAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const fetchVegetableData = async (name: string): Promise<NutritionData> => {
  const ai = getNucleusAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Provide detailed nutrition information for the vegetable: ${name}. Be accurate and scientific.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          scientificName: { type: Type.STRING },
          description: { type: Type.STRING },
          calories: { type: Type.NUMBER },
          macros: {
            type: Type.OBJECT,
            properties: {
              carbohydrates: { type: Type.NUMBER },
              protein: { type: Type.NUMBER },
              fat: { type: Type.NUMBER },
              fiber: { type: Type.NUMBER },
              sugar: { type: Type.NUMBER }
            },
            required: ["carbohydrates", "protein", "fat", "fiber", "sugar"]
          },
          vitamins: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                amount: { type: Type.STRING },
                percentageDV: { type: Type.NUMBER }
              },
              required: ["name", "amount", "percentageDV"]
            }
          },
          minerals: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                amount: { type: Type.STRING },
                percentageDV: { type: Type.NUMBER }
              },
              required: ["name", "amount", "percentageDV"]
            }
          },
          healthBenefits: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          cookingTips: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          seasonality: { type: Type.STRING }
        },
        required: ["name", "scientificName", "description", "calories", "macros", "vitamins", "minerals", "healthBenefits", "cookingTips", "seasonality"]
      }
    }
  });

  if (!response.text) {
    throw new Error("Failed to get response from Gemini");
  }

  return JSON.parse(response.text.trim());
};

export const fetchVegetableImage = async (name: string): Promise<string> => {
  const ai = getNucleusAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: `A high-quality, professional food photography shot of a fresh ${name} vegetable on a clean, minimal wooden background. Natural lighting, vibrant colors, 4k resolution.` }]
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  throw new Error("Failed to generate image");
};
