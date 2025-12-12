export interface AIResponse {
  answer: string;
  sources: string[];
}

export interface AIClient {
  ask: (query: string) => Promise<AIResponse>;
}

// Mock implementation (can be swapped for RealAIClient later)
export class MockAIClient implements AIClient {
  async ask(query: string): Promise<AIResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      answer: `Based on the Bear Robotics knowledge base, here is what I found regarding "${query}":\n\nThe Servi Plus robot is designed to handle up to 40kg of payload, distributed across its trays. For optimal performance, ensure weight is balanced. If you are experiencing navigation issues, check that the LIDAR sensors are clean and not obstructed by tablecloths or debris.`,
      sources: ['Manual: Servi Plus Operation', 'FAQ: Weight Limits', 'Troubleshooting: Navigation']
    };
  }
}

export const aiClient = new MockAIClient();

