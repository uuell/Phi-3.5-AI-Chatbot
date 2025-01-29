import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_TOKEN);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Store chat history in memory (Resets on server restart)
let chat = model.startChat({ history: [] });

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    console.log(prompt);

    if (!prompt) {
        console.log("no prompt");
      return new Response(JSON.stringify({ error: "Prompt is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Send message while keeping conversation context
    const result = await chat.sendMessage(prompt);
    const responseText = result.response.text();
    console.log(result);

    return new Response(JSON.stringify({ response: responseText }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
