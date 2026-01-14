
import { GoogleGenAI } from "@google/genai";

export async function processMeetingData(
  inputType: 'TEXT' | 'AUDIO',
  inputData: string | File,
  systemPrompt: string
): Promise<string> {
  const apiKey = process.env.API_KEY || (import.meta as any).env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Gemini API Key is missing. Please set VITE_GEMINI_API_KEY.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  // Use Gemini 3 Flash for efficiency and multimodal support
  const model = 'gemini-3-flash-preview';

  try {
    if (inputType === 'TEXT') {
      const response = await ai.models.generateContent({
        model,
        contents: `Input Data:\n${inputData as string}`,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        },
      });
      return response.text || "No response generated.";
    } else {
      // Handle Audio
      const audioFile = inputData as File;
      const base64Data = await fileToBase64(audioFile);
      
      const response = await ai.models.generateContent({
        model,
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: audioFile.type,
                data: base64Data,
              },
            },
            {
              text: "Please transcribe this meeting audio and generate minutes according to your instructions.",
            },
          ],
        },
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        },
      });
      return response.text || "No response generated from audio.";
    }
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to process data with Gemini AI.");
  }
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
}
