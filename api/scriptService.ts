import { GoogleGenAI, Type } from "@google/genai";
import { ScriptType, EvaluationResult } from '../types';

const model = 'gemini-2.5-flash';

export const generateScript = async (prompt: string, type: ScriptType, apiKey: string): Promise<string> => {
    try {
        const ai = new GoogleGenAI({ apiKey });
        const fullPrompt = `You are an expert cybersecurity professional specializing in digital forensics and incident response. Generate a ${type} script based on the following request. The script should be robust, follow best practices for error handling, and be clearly commented. ONLY output the raw script code, without any markdown formatting, explanations, or code block fences (\`\`\`).
        Request: "${prompt}"`;
        
        const response = await ai.models.generateContent({ model, contents: fullPrompt });
        return response.text;
    } catch (error) {
        console.error("Error in scriptService.generateScript:", error);
        throw new Error("Failed to generate script. Check your API key, network connection, and Google AI settings.");
    }
};

export const evaluateAndImproveScript = async (script: string, type: ScriptType, apiKey: string): Promise<EvaluationResult> => {
    try {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `You are a senior cybersecurity script analyst and code reviewer. Your task is to perform a security audit on the provided script.
        Analyze the following ${type} script for security best practices, efficiency, and potential risks. Specifically identify: Command Injection, Hardcoded Secrets, Insecure File Permissions, Insecure Deserialization, Weak Encryption, and Sensitive Data Exposure.
        For each finding, provide a clear explanation and a recommendation. Finally, provide an improved version of the entire script that remediates all identified issues.
        Script: \`\`\`${type.toLowerCase()}\n${script}\n\`\`\``;
        
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                       vulnerabilities: {
                           type: Type.ARRAY,
                           items: {
                               type: Type.OBJECT,
                               properties: {
                                   vulnerabilityType: { type: Type.STRING },
                                   riskLevel: { type: Type.STRING },
                                   lineNumber: { type: Type.STRING },
                                   explanation: { type: Type.STRING },
                                   recommendation: { type: Type.STRING }
                               },
                               required: ["vulnerabilityType", "riskLevel", "lineNumber", "explanation", "recommendation"]
                           }
                       },
                        improvedScript: { type: Type.STRING }
                    },
                    required: ["vulnerabilities", "improvedScript"]
                }
            }
        });

        return JSON.parse(response.text.trim()) as EvaluationResult;
    } catch (error) {
        console.error("Error in scriptService.evaluateAndImproveScript:", error);
        throw new Error("Failed to evaluate script. The API may have returned an invalid format or the key is invalid.");
    }
};

export const getPromptSuggestions = async (partialPrompt: string, apiKey: string): Promise<string[]> => {
    try {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `You are a creative cybersecurity assistant. Based on the user's partial prompt, generate 3 concise and relevant suggestions to complete it. The suggestions should be for generating forensic scripts (PowerShell or Bash). Return the output as a JSON array of strings.
        User's partial prompt: "${partialPrompt.trim()}"`;

        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
        });
        
        const suggestions = JSON.parse(response.text.trim()) as string[];
        return suggestions.slice(0, 3);
    } catch (error) {
        console.error("Error in scriptService.getPromptSuggestions:", error);
        throw new Error("Failed to fetch suggestions. The model may be unable to generate suggestions for this input.");
    }
};