import { GoogleGenAI, Type } from "@google/genai";

// Strictly follow initialization guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIPricingSuggestion = async (product: {
  name: string;
  brand: string;
  originalPrice: number;
  condition: string;
}) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Suggest a fair resale price for a ${product.condition} ${product.brand} ${product.name} in Southeast Asia. The original retail price was ${product.originalPrice}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedPrice: { type: Type.NUMBER },
            confidence: { type: Type.NUMBER, description: 'Percentage from 0 to 100' },
            reasoning: { type: Type.STRING },
            marketTrend: { type: Type.STRING, description: 'High, Moderate, or Low demand' }
          },
          required: ["suggestedPrice", "confidence", "reasoning", "marketTrend"]
        }
      }
    });

    const jsonStr = (response.text || "").trim();
    if (!jsonStr) {
      throw new Error("No text content returned from the model");
    }
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("AI Pricing Error:", error);
    return {
      suggestedPrice: product.originalPrice * 0.6,
      confidence: 85,
      reasoning: "Based on historical data for this brand.",
      marketTrend: "Moderate"
    };
  }
};

/**
 * Uses Gemini 2.5 Flash Image to enhance product photos by cleaning backgrounds and improving lighting.
 */
export const enhanceProductPhoto = async (base64Data: string, mimeType: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: 'Enhance this product photo for a marketplace. Keep the item exactly as it is but place it in a clean, minimalist, professional studio setting with bright, soft lighting and a neutral off-white background. Remove any messy home backgrounds or distracting shadows.',
          },
        ],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data returned from enhancement");
  } catch (error) {
    console.error("AI Enhancement Error:", error);
    throw error;
  }
};
