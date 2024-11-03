import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API as string);

export const runtime = "edge";

export async function POST(req: Request) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt =
            `Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.`;

        const result = await model.generateContent(prompt);
        console.log("AI Response:", result);
        const response = result.response;
        const text = response.text() || "No valid response received.";
        console.log("Extracted Text:", text);

        if (!text.includes("||")) {
            console.warn("AI response is missing the '||' separator.");
            return NextResponse.json(
              { error: "AI did not return properly formatted questions." },
              { status: 500 }
            );
        }

        return new Response(text, {
            headers: { "Content-Type": "text/plain" },
        });
    } catch (error) {
        if (error instanceof Error) {
            console.error("An error occurred:", error.message);
            return NextResponse.json({ error: error.message }, { status: 500 });
        } else {
            console.error("An unexpected error occurred:", error);
            return NextResponse.json(
                { error: "An unexpected error occurred" },
                { status: 500 }
            );
        }
    }
}