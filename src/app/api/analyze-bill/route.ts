import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { billText } = await req.json();

  // You can instruct GPT to estimate savings and return a number
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant that analyzes bills and estimates monthly savings. Reply only with a number (the estimated monthly savings in dollars).",
      },
      {
        role: "user",
        content: `Here is the bill text: ${billText}`,
      },
    ],
    max_tokens: 10,
  });

  const result = completion.choices[0].message.content;
  return NextResponse.json({ savings: result });
}   