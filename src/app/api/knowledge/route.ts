import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { BEAR_ROBOTICS_KNOWLEDGE, faqData } from '@/lib/bearKnowledge';

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // 1. Try OpenAI if available
    if (openai) {
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `You are a helpful Bear Robotics support assistant. 
              Use the following Knowledge Base to answer the user's question accurately.
              
              KNOWLEDGE BASE:
              ${BEAR_ROBOTICS_KNOWLEDGE}
              
              ADDITIONAL FAQ DATA:
              ${JSON.stringify(faqData)}
              
              If the answer is not in the knowledge base, say "I couldn't find specific information about that in my documentation, but I can help you contact support."
              Keep answers concise, friendly, and formatted with markdown.`
            },
            {
              role: "user",
              content: query
            }
          ],
          temperature: 0.3,
          max_tokens: 500,
        });

        const answer = response.choices[0]?.message?.content || "I couldn't generate an answer at this time.";
        
        return NextResponse.json({
          answer,
          sources: ["Knowledge Base", "Official Documentation"]
        });
      } catch (aiError) {
        console.error("OpenAI API Error:", aiError);
        // Fallback to local search if API fails
      }
    }

    // 2. Local Fallback Search (if no API key or API fails)
    const lowerQuery = query.toLowerCase();
    const relevantFaqs = faqData.filter(faq => 
      faq.question.toLowerCase().includes(lowerQuery) || 
      faq.answer.toLowerCase().includes(lowerQuery) ||
      faq.keywords.some(k => lowerQuery.includes(k))
    );

    if (relevantFaqs.length > 0) {
      const bestMatch = relevantFaqs[0];
      return NextResponse.json({
        answer: bestMatch.answer,
        sources: [`FAQ: ${bestMatch.category}`]
      });
    }

    return NextResponse.json({
      answer: "I couldn't find specific information matching your query in the local database. Please try different keywords or contact support directly.",
      sources: []
    });

  } catch (error) {
    console.error("Knowledge API Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

