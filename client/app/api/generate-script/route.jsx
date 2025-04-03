import { generateStoryWithImages } from "@/configs/AiModeImage";
import { generateScript } from "@/configs/AiModel";
import { NextResponse } from "next/server";

export async function POST(req) {
    const {topic} = await req.json()
    
    const PROMPT= process.env.SCRIPT_PROMPT.replace('{topic}', topic)
    
    const result = await generateStoryWithImages.sendMessage(PROMPT)
 
    const resp = result?.response?.text();

    return NextResponse.json(JSON.parse(resp));
    
}