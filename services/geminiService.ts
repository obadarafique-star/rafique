
import { GoogleGenAI, Chat } from '@google/genai';
import { ChatMode } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const refinedSystemInstruction = `You are a specialized AI assistant with deep expertise in the constitutional law of India. Your primary function is to provide informative and educational answers to questions about the Constitution of India.

When responding, adhere to the following guidelines:
1. **Disclaimer First:** Always begin every response with the disclaimer: "This is not legal advice and I am not a lawyer."
2. **Cite Sources:** When appropriate, cite relevant constitutional Articles, Schedules, or landmark Supreme Court of India cases to support your answer. For example, mention Kesavananda Bharati v. State of Kerala when discussing the basic structure doctrine.
3. **Maintain Neutrality:** Present information in a neutral, objective, and professional tone.
4. **Clarity and Structure:** Structure your answers clearly for easy understanding.
5. **Scope:** Strictly limit your responses to matters of Indian constitutional law. Do not provide opinions or advice on personal legal situations.`;

export const createChatSession = (): Chat => {
    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: refinedSystemInstruction,
        }
    });
};

export const sendMessageToAI = async (
    chat: Chat, 
    message: string, 
    mode: ChatMode
): Promise<string> => {
    try {
        let fullPrompt = '';

        if (mode === ChatMode.EMERGENCY) {
            fullPrompt = `URGENT: Provide a concise, direct, and actionable answer to the following query related to Indian law. Be as brief as possible. Query: "${message}"`;
        } else if (mode === ChatMode.CASE_LAW) {
            fullPrompt = `Act as a legal case database. Provide a detailed summary of the following Indian constitutional case law. Include key facts, the main judgment, and the constitutional principles established. If the query is a keyword, find the most relevant landmark case. Case/Keyword: "${message}"`;
        } else {
            fullPrompt = `Provide a detailed, elaborated, and comprehensive answer to the following query related to Indian law. If possible, cite relevant constitutional articles or legal precedents from India. Query: "${message}"`;
        }
        
        const response = await chat.sendMessage({ message: fullPrompt });
        return response.text;

    } catch (error) {
        console.error("Error sending message to Gemini:", error);
        return "I'm sorry, but I encountered an error while processing your request. Please check the console for details and try again.";
    }
};