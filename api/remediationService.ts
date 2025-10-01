import { GoogleGenAI, Type } from "@google/genai";
import { RemediationRecommendation } from '../types';

const model = 'gemini-2.5-flash';

export const getRemediationAdvice = async (context: string, apiKey: string): Promise<RemediationRecommendation[]> => {
    try {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `You are a principal cybersecurity expert specializing in incident response and system hardening. Based on the following context, provide a concise and actionable summary of remediation recommendations. Return the output as a JSON array of objects.
        
        - If the context contains specific security threats, focus your recommendations on addressing those directly.
        - If the context is general, provide practical strategies for system hardening and privacy.
        
        Context:
        \`\`\`
        ${context}
        \`\`\`
        `;

        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            category: { type: Type.STRING },
                            details: { type: Type.ARRAY, items: { type: Type.STRING } },
                            priority: { type: Type.STRING }
                        },
                        required: ["title", "category", "details", "priority"]
                    }
                }
            }
        });
        
        return JSON.parse(response.text.trim()) as RemediationRecommendation[];
    } catch (error) {
        console.error("Error in remediationService.getRemediationAdvice:", error);
        throw new Error("Failed to get remediation advice. The API may have returned an invalid format or the key is invalid.");
    }
};