import { GoogleGenAI } from "@google/genai";
import { AspectRatio } from "../types";

// Note: API Key will be injected by the environment or retrieved from the user selection for Veo
// Removed top-level apiKey variable to ensure we always use the latest process.env.API_KEY

/**
 * Enhances a simple prompt into a detailed, professional image generation prompt.
 */
export const enhancePrompt = async (simplePrompt: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Reword the following image prompt to be highly detailed, artistic, and suitable for a high-quality AI image generator. 
      Add keywords for lighting, texture, and composition. Keep it under 50 words.
      Original Prompt: "${simplePrompt}"`,
    });
    return response.text?.trim() || simplePrompt;
  } catch (error) {
    console.error("Error enhancing prompt:", error);
    return simplePrompt;
  }
};

/**
 * Generates an image using Gemini.
 */
export const generateImage = async (
  prompt: string,
  aspectRatio: AspectRatio,
  style: string,
  negativePrompt?: string
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const fullPrompt = style && style !== 'None' 
      ? `${style} style. ${prompt} ${negativePrompt ? `Exclude: ${negativePrompt}` : ''}`
      : `${prompt} ${negativePrompt ? `Exclude: ${negativePrompt}` : ''}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: fullPrompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
        },
      },
    });

    // Extract the image from the response
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const base64Data = part.inlineData.data;
        const mimeType = part.inlineData.mimeType || 'image/png';
        return `data:${mimeType};base64,${base64Data}`;
      }
    }
    
    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};

/**
 * Upscales an existing image to 4K using Gemini 3 Pro.
 */
export const upscaleImage = async (
  imageBase64: string,
  prompt: string,
  aspectRatio: AspectRatio
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Remove data URL prefix if present to get raw base64
  const cleanBase64 = imageBase64.replace(/^data:image\/(png|jpeg|webp);base64,/, "");

  try {
    // We use gemini-3-pro-image-preview for high quality operations like upscaling/editing
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          { 
            inlineData: { 
              mimeType: 'image/png', 
              data: cleanBase64 
            } 
          },
          { 
            text: `Upscale this image to 4K resolution. Enhance details, sharpen focus, and improve textures while maintaining the original composition and style. ${prompt}` 
          }
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
          imageSize: '4K', // Explicitly request 4K for upscaling
        },
      },
    });

    // Extract the image from the response
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const base64Data = part.inlineData.data;
        const mimeType = part.inlineData.mimeType || 'image/png';
        return `data:${mimeType};base64,${base64Data}`;
      }
    }
    
    throw new Error("No image data found in upscale response");
  } catch (error: any) {
    console.error("Error upscaling image:", error);
    // Handle API Key requirement for pro models if necessary (though handled in UI usually)
    if (error.message?.includes("Requested entity was not found")) {
         if (window.aistudio && window.aistudio.openSelectKey) {
             throw new Error("API_KEY_REQUIRED");
         }
    }
    throw error;
  }
};