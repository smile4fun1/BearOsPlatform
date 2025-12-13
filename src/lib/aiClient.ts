export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface AIResponse {
  answer: string;
  sources: string[];
  suggestedQuestions?: string[];
}

export interface AIClient {
  ask: (query: string, history?: Message[]) => Promise<AIResponse>;
}

export class RealAIClient implements AIClient {
  async ask(query: string, history: Message[] = []): Promise<AIResponse> {
    try {
      // Prepare messages: history + current query
      const messages: Message[] = [...history];
      if (query) {
        messages.push({ role: 'user', content: query });
      }

      const response = await fetch('/api/knowledge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          query, 
          messages 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch AI response');
      }

      const data = await response.json();
      return {
        answer: data.answer,
        sources: data.sources || ['Bear Knowledge Base'],
        suggestedQuestions: data.suggestedQuestions || []
      };
    } catch (error) {
      console.error("AI Search Error:", error);
      return {
        answer: "I'm having trouble connecting to the knowledge base right now. Please try again later.",
        sources: [],
        suggestedQuestions: []
      };
    }
  }
}

export const aiClient = new RealAIClient();
