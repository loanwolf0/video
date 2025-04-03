import { generateStoryWithImages, } from "@/configs/AiModeImage";
import { NextResponse } from "next/server";
import { fs } from 'fs'
import { generateCartoonStory } from "@/configs/Ai-cartoon-story";
import { dividePrompt } from "@/configs/AiModel";


// export async function POST(req) {
//     const { title } = await req.json()
//     console.log(title, "title");

//     const PROMPT = process.env.CARTOON_STORY_PROMPT.replace('{PROMPT}', title)

//     const result = await generateCartoonStory.sendMessage(PROMPT)

//     console.log(JSON.stringify(result.response))

//     const parts = result?.response?.candidates[0]?.content?.parts || [];
//     console.log(result?.response?.candidates[0], "PPPP");

//     console.log(JSON.stringify(result.response).length< "length")
//     const formattedResponse = parts
//         .map((part) => {
//             return {
//                 text: part.text || "", // Get extracted or original text
//                 image: part.inlineData?.data || "", // Get image URL if available
//             };
//         });

//     return NextResponse.json(formattedResponse);

// }


export async function POST(req) {
    const { title } = await req.json();
    console.log(title, "title");

    const enhanced_title = await dividePrompt.sendMessage(title);

    let TITLES = enhanced_title.response.candidates[0]?.content.parts[0]?.text || "[]";

    console.log(TITLES, "TITLES");

    // Check and remove `{}` if they exist
    if (TITLES.startsWith("{") && TITLES.endsWith("}")) {
        TITLES = TITLES.slice(1, -1); // Remove first and last character (curly braces)
    }

    try {
        TITLES = JSON.parse(TITLES); // Convert string to array
    } catch (error) {
        console.error("Error parsing TITLES:", error);
        TITLES = []; // Default to empty array if parsing fails
    }



    console.log(TITLES, "TITLES");

    if (!Array.isArray(TITLES)) {
        console.error("TITLES is not an array:", TITLES);
        return NextResponse.json({ error: "Invalid response format from AI" }, { status: 500 });
    }

    // Use Promise.all() to run API calls in parallel
    const results = await Promise.all(
        TITLES.map(async (sceneTitle, index) => {
            console.log("Started:", index);

            const PROMPT = process.env.CARTOON_STORY_PROMPT.replace('{PROMPT}', sceneTitle);
            const result = await generateCartoonStory.sendMessage(PROMPT);

            console.log("Completed:", index);

            const parts = result?.response?.candidates[0]?.content?.parts || [];
            console.log(parts.length, "parts:", index);

            return parts.map((part) => ({
                text: part.text || "", // Extract text
                image: part.inlineData?.data || "", // Extract image
            }));
        })
    );

    // Flatten the results array (since each `map` returns an array)
    const formattedResponse = results.flat();

    let imC = 0
    let noImgc = 0
    formattedResponse.forEach((item, index) => {
        console.log(`Part ${index}:`, item.image ? imC++ : noImgc++,);
    });

    console.log("Complete API call", formattedResponse.length, imC, noImgc, 17 % 2 !== 0);

    return NextResponse.json(formattedResponse);
}