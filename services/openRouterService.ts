
import { AIProvider } from "../types";
import { Logger } from "./Logger";

export class OpenRouterService implements AIProvider {
  async callPhase(
    phase: 'planning' | 'coding' | 'review' | 'security' | 'performance' | 'uiux',
    input: string,
    modelName: string = 'openai/gpt-4o',
    retries: number = 3
  ): Promise<any> {
    const key = process.env.OPENROUTER_API_KEY;
    if (!key) throw new Error("OPENROUTER_API_KEY not found.");

    let lastError;
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${key}`,
            "Content-Type": "application/json",
            "HTTP-Referer": window.location.origin,
            "X-Title": "OneClick Studio",
          },
          body: JSON.stringify({
            model: modelName,
            messages: [
              { role: "system", content: "You are an AI assistant." },
              { role: "user", content: input }
            ],
            response_format: { type: "json_object" }
          }),
        });

        if (!response.ok) throw new Error(`OpenRouter API error: ${response.statusText}`);
        
        const data = await response.json();
        const content = data.choices[0].message.content;
        return JSON.parse(content);
      } catch (error: any) {
        Logger.warn(`Attempt ${attempt} failed`, { component: 'OpenRouterService', model: modelName, attempt }, error);
        lastError = error;
        if (attempt < retries) {
          const delay = Math.pow(2, attempt) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    throw new Error(`OpenRouter API failed after ${retries} attempts: ${lastError?.message}`);
  }
}
