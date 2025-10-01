import { GoogleGenAI } from '@google/genai';

const model = 'gemini-2.5-flash';

export const analyzeLogs = async (logs: string, apiKey: string, focusTerm?: string): Promise<string> => {
    try {
        const ai = new GoogleGenAI({ apiKey });

        let focusInstruction = '';
        if (focusTerm && focusTerm.trim()) {
            focusInstruction = `Pay special attention to any entries related to the term "${focusTerm.trim()}". Prioritize findings related to this term in your report.`;
        }

        const prompt = `You are a senior security analyst and forensic investigator with expertise in log analysis and threat detection. Analyze the following log data for security incidents, anomalies, and indicators of compromise. ${focusInstruction}
        
        Provide a concise but comprehensive report in markdown format. Structure your report with the following sections:
        - **Executive Summary:** A brief overview of your findings.
        - **Key Findings:** A bulleted list of the most important discoveries.
        - **Detected Anomalies/Incidents:** Detailed descriptions of any suspicious activity.
        - **Recommendations:** Actionable steps to take based on the analysis.
        
        Log data:
        \`\`\`
        ${logs}
        \`\`\`
        `;

        const response = await ai.models.generateContent({ model, contents: prompt });
        return response.text;
    } catch (error) {
        console.error("Error in logService.analyzeLogs:", error);
        throw new Error("Failed to analyze logs. Check your API key, network connection, and Google AI settings.");
    }
};