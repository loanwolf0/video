import fs from 'fs';
import path from 'path';
import axios from 'axios';

export async function POST(req) {
    try {
        const { url } = await req.json();
        if (!url) {
            return new Response(JSON.stringify({ error: "No URL provided" }), { status: 400 });
        }

        console.log("Fetching audio from:", url);

        // Define storage path
        const tempDir = path.join(process.cwd(), 'temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        const filePath = path.join(tempDir, 'audio.wav');

        // Download with streaming to ensure full audio is saved
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream',
        });

        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        console.log("Audio successfully saved:", filePath);

        return new Response(JSON.stringify({ message: 'Audio saved', filePath }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
