import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { BEAR_ROBOTICS_KNOWLEDGE, faqData } from '@/lib/bearKnowledge';

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export async function POST(request: Request) {
  try {
    const { query, messages } = await request.json();

    if (!query && (!messages || messages.length === 0)) {
      return NextResponse.json({ error: 'Query or messages are required' }, { status: 400 });
    }

    // 1. Try OpenAI if available
    if (openai) {
      try {
        // Construct messages array
        let apiMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
          {
            role: "system",
            content: `You are a helpful Bear Robotics support assistant. 
            Use the following Knowledge Base to answer the user's question accurately.
            
            KNOWLEDGE BASE:
            ${BEAR_ROBOTICS_KNOWLEDGE}
            
            ADDITIONAL FAQ DATA:
            ${JSON.stringify(faqData)}
            
            If the answer is not in the knowledge base, say "I couldn't find specific information about that in my documentation, but I can help you contact support."
            
            IMPORTANT: Return your response as a valid JSON object with the following structure:
            {
              "answer": "Your answer here in markdown format",
              "suggestedQuestions": ["Follow-up question 1", "Follow-up question 2", "Follow-up question 3"]
            }
            
            Keep answers concise, friendly, and formatted with markdown.`
          }
        ];

        if (messages && Array.isArray(messages)) {
            apiMessages = [...apiMessages, ...messages];
        } else {
            apiMessages.push({ role: "user", content: query });
        }

        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: apiMessages,
          temperature: 0.3,
          max_tokens: 500,
          response_format: { type: "json_object" }
        });

        const content = response.choices[0]?.message?.content;
        let parsedResponse;
        
        try {
          parsedResponse = content ? JSON.parse(content) : { answer: "I couldn't generate an answer at this time.", suggestedQuestions: [] };
        } catch (e) {
          parsedResponse = { answer: content || "Error parsing response", suggestedQuestions: [] };
        }
        
        return NextResponse.json({
          answer: parsedResponse.answer,
          suggestedQuestions: parsedResponse.suggestedQuestions || [],
          sources: ["Knowledge Base", "Official Documentation"]
        });
      } catch (aiError) {
        console.error("OpenAI API Error:", aiError);
        // Fallback to local search if API fails
      }
    }

    // 2. Local Fallback Search (if no API key or API fails)
    let effectiveQuery = query;
    if (!effectiveQuery && messages && messages.length > 0) {
      effectiveQuery = messages[messages.length - 1].content;
    }

    if (!effectiveQuery) {
        return NextResponse.json({
          answer: "I couldn't understand your request.",
          suggestedQuestions: [],
          sources: []
        });
    }

    const lowerQuery = effectiveQuery.toLowerCase();
    const relevantFaqs = faqData.filter(faq => 
      faq.question.toLowerCase().includes(lowerQuery) || 
      faq.answer.toLowerCase().includes(lowerQuery) ||
      faq.keywords.some(k => lowerQuery.includes(k))
    );

    if (relevantFaqs.length > 0) {
      const bestMatch = relevantFaqs[0];
      // Generate simple follow-up questions based on other FAQs in the same category
      const related = faqData
        .filter(f => f.category === bestMatch.category && f.id !== bestMatch.id)
        .slice(0, 3)
        .map(f => f.question);
        
      return NextResponse.json({
        answer: bestMatch.answer,
        suggestedQuestions: related,
        sources: [`FAQ: ${bestMatch.category}`]
      });
    }

    return NextResponse.json({
      answer: "I couldn't find specific information matching your query in the local database. Please try different keywords or contact support directly.",
      suggestedQuestions: ["How do I contact support?", "What are the robot models?", "How to charge the robot?"],
      sources: []
    });

  } catch (error) {
    console.error("Knowledge API Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

