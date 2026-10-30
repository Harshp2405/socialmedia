
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { message, image } = await req.json();

    const parts: any[] = [];
    if (message) parts.push({ text: message });
    if (image) {
        parts.push({
            inline_data: {
                mime_type: "image/jpeg",
                data: image,
            },
        });
    }

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [
                        {
                            role: "user",
                            parts,
                        },
                    ],
                }),
            }
        );

        const data = await response.json();

        if (data.error) {
            console.error("Gemini response error:", data.error);
            return NextResponse.json({ reply: "Gemini API error: " + data.error.message });
        }

        const reply = data?.candidates?.[0]?.content?.parts?.map((p: { text: string }) => p.text).join(" ") ||
            "No reply from Gemini.";
        return NextResponse.json({ reply });
    } catch (error: any) {
        console.error("Gemini API error:", error);
        return NextResponse.json(
            {
                reply: "Gemini request failed",
                error: error.message,
            },
            { status: 500 }
        );
    }
}



//Open Ai

// import OpenAI from "openai";
// import { NextResponse } from "next/server";

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// export async function POST(req: Request) {
//     const { message, image } = await req.json();

//     try {
//         const response = await openai.chat.completions.create({
//             model: "gpt-4o",
//             messages: [
//                 {
//                     role: "user",
//                     content: [
//                         { type: "text", text: message || "What's in this image?" },
//                         ...(image
//                             ? [
//                                 {
//                                     type: "image_url",
//                                     image_url: {
//                                         url: `data:image/jpeg;base64,${image}`,
//                                     },
//                                 },
//                             ]
//                             : []),
//                     ],
//                 },
//             ],
//         });

//         const reply = response.choices[0].message.content;
//         return NextResponse.json({ reply });
//     } catch (error: any) {
//         console.error("OpenAI API error:", error);
//         return NextResponse.json(
//             { reply: "Request failed", error: error.message },
//             { status: 500 }
//         );
//     }
// }
