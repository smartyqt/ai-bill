import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { provider, amount, tenure = "1 year", savings = "unknown" } = await req.json();

  const systemPrompt = `
You are a helpful assistant who writes professional, polite negotiation messages for users trying to lower their bills.
Keep it short and friendly, under 100 words. Include that the user is a loyal customer and saw better deals elsewhere.
`;

  const userPrompt = `
Provider: ${provider}
Current bill: $${amount}
Time with provider: ${tenure}
Potential savings: ~$${savings}/month

Write a message the user can send to their provider to ask for a lower rate.
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    max_tokens: 200,
  });

  const script = completion.choices[0].message.content;
  return NextResponse.json({ script });
}
