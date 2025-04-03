const { createClient } = require("@deepgram/sdk");
const fs = require("fs");
import { NextResponse } from "next/server";
import path from "path";

export async function POST(req) {
  try {
    const audioFilePath = path.join(process.cwd(), 'temp', 'audio.wav');
    console.log(audioFilePath, "audioFilePath");
    
    const { filePath } = await req.json(); 


    const deepgram = createClient(process.env.CAPTION_API_KEY);

    const { result, error } = await deepgram.listen.prerecorded.transcribeUrl(
      {
        url: filePath,
      },
      {
        model: "nova-2", // Use Nova-2 instead of Nova-3 (for hindi)
        language: "hi",   // Specify Hindi
        smart_format: true,

      }
    );

    if (error) throw error;

    return NextResponse.json(result.channels[0]?.alternatives[0]?.words);
  } catch (err) {
    console.log(err.message, "hello erro");
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


