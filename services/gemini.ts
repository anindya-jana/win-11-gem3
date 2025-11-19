import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const createChatSession = (systemInstruction?: string): Chat => {
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: systemInstruction || 'You are a helpful AI assistant embedded in a Windows 11 Web Clone. You help the user with tasks and answer questions concisely.',
    },
  });
};

export const generateSearchResponse = async (query: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Provide a simulated search engine result page summary for: "${query}". Include 3 mock search results with titles, URLs, and snippets. Format as Markdown.`,
            config: {
                tools: [{ googleSearch: {} }]
            }
        });
        // Extract grounding chunks if available, otherwise fallback to text
        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        let text = response.text || "No results found.";
        
        if (chunks) {
            text += "\n\n**Sources:**\n";
            chunks.forEach((chunk: any) => {
                if (chunk.web) {
                    text += `- [${chunk.web.title}](${chunk.web.uri})\n`;
                }
            });
        }
        return text;
    } catch (e) {
        console.error(e);
        return "Error performing search. Please check your API key.";
    }
}

export const generateWebsiteContent = async (url: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `You are a web browser engine. The user wants to visit "${url}". 
            Generate a realistic, visually accurate single-file HTML string (with embedded CSS or Tailwind via CDN) that represents the homepage of this website.
            
            Requirements:
            1. Use <script src="https://cdn.tailwindcss.com"></script> for styling.
            2. Make it look like the real website as much as possible (colors, layout, hero sections).
            3. Use placeholder images (like https://picsum.photos/...) where necessary.
            4. Make links and buttons look interactive (hover states), even if they don't function.
            5. Do NOT include markdown code blocks (like \`\`\`html). Return ONLY the raw HTML string.
            6. If the input is a search query (e.g., "cute cats"), generate a realistic "Google Search Results" page for it.
            `,
        });
        let html = response.text || "<html><body><h1>Error loading page</h1></body></html>";
        
        // Robust extraction of HTML from code blocks if present
        const htmlBlockMatch = html.match(/```html\s*([\s\S]*?)\s*```/i);
        if (htmlBlockMatch) {
            html = htmlBlockMatch[1];
        } else {
            const genericBlockMatch = html.match(/```\s*([\s\S]*?)\s*```/i);
            if (genericBlockMatch) {
                html = genericBlockMatch[1];
            }
        }
        
        // Fallback cleanup if no blocks were found but the model was chatty
        html = html.replace(/```html/g, '').replace(/```/g, '');
        
        return html;
    } catch (e) {
        console.error(e);
        return "<html><body style='font-family:sans-serif; text-align:center; padding:50px;'><h1>404 - Page Not Found</h1><p>Could not generate website content.</p><p>Please ensure your API Key is valid.</p></body></html>";
    }
}