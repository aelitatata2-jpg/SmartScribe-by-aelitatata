
import { GoogleGenAI } from "@google/genai";

export async function processMeetingData(
  inputType: 'TEXT' | 'AUDIO',
  inputData: string | File,
  systemPrompt: string
): Promise<string> {
  // Согласно правилам, используем исключительно process.env.API_KEY
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const model = 'gemini-3-flash-preview';

  try {
    if (inputType === 'TEXT') {
      const response = await ai.models.generateContent({
        model,
        contents: `Данные для анализа:\n${inputData as string}`,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        },
      });
      return response.text || "Не удалось сгенерировать ответ.";
    } else {
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
              text: "Пожалуйста, проанализируй это аудио и составь протокол встречи согласно системной инструкции.",
            },
          ],
        },
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        },
      });
      return response.text || "Не удалось обработать аудио.";
    }
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Ошибка при работе с ИИ.");
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
