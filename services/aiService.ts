
import { AIProvider } from "../types";
import { GeminiService } from "./geminiService";
import { OpenRouterService } from "./openRouterService";

export class AIService implements AIProvider {
  private gemini: GeminiService;
  private openRouter: OpenRouterService;

  constructor() {
    this.gemini = new GeminiService();
    this.openRouter = new OpenRouterService();
  }

  async callPhase(
    phase: 'planning' | 'coding' | 'review' | 'security' | 'performance' | 'uiux',
    input: string,
    modelName: string = 'gemini-3-pro-preview',
    retries: number = 3
  ): Promise<any> {
    if (modelName.startsWith('gemini')) {
      return this.gemini.callPhase(phase, input, modelName, retries);
    } else {
      return this.openRouter.callPhase(phase, input, modelName, retries);
    }
  }
}
