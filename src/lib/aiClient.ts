export interface AIResponse {
  answer: string;
  sources: string[];
}

export interface AIClient {
  ask: (query: string) => Promise<AIResponse>;
}

export class RealAIClient implements AIClient {
  async ask(query: string): Promise<AIResponse> {
    try {
      const response = await fetch('/api/knowledge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch AI response');
      }

      const data = await response.json();
      return {
        answer: data.answer,
        sources: data.sources || ['Bear Knowledge Base']
      };
    } catch (error) {
      console.error("AI Search Error:", error);
      return {
        answer: "I'm having trouble connecting to the knowledge base right now. Please try again later.",
        sources: []
      };
    }
  }
}

export const aiClient = new RealAIClient();
