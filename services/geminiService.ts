import { GoogleGenAI } from "@google/genai";

// Initialize Gemini
// Note: In a real environment, keys should be protected.
// For this demo, we assume the environment variable is injected.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateVideoSummary = async (title: string, description: string): Promise<string> => {
  if (!process.env.API_KEY) return "API Key missing. Cannot generate summary.";

  try {
    const prompt = `
      Please provide a concise, engaging summary (max 2 sentences) for a video with the following metadata:
      Title: ${title}
      Description: ${description}
      
      The summary should encourage users to watch.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Summary not available.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI Summary currently unavailable.";
  }
};

export const chatAboutVideo = async (title: string, description: string, query: string): Promise<string> => {
    if (!process.env.API_KEY) return "API Key missing.";
    
    try {
        const prompt = `
        You are a helpful assistant for a video platform.
        Context: User is watching a video titled "${title}".
        Description: "${description}".
        
        User Question: "${query}"
        
        Answer based on general knowledge and the provided context. Keep it short.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        
        return response.text || "I couldn't generate an answer.";
    } catch (e) {
        console.error("Gemini Chat Error", e);
        return "Error connecting to AI assistant.";
    }
}
