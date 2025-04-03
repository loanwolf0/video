const Replicate = require("replicate");
const { writeFile } = require("node:fs/promises");

async function generateSpeech() {
    const replicate = new Replicate();

    const input = {
        text: "Hi! I'm Kokoro, a text-to-speech voice crafted by hexgrad — based on StyleTTS2. You can also find me in Kuluko, an app that lets you create fully personalized audiobooks — from characters to storylines — all tailored to your preferences. Want to give it a go? Search for Kuluko on the Apple or Android app store and start crafting your own story today!",
        // voice: "af_nicole"
    };

    // const input = {
    //     text: "Hey there my name is Tara, <chuckle> and I'm a speech generation model that can sound like a person."
    // };
    
    
    // import { writeFile } from "node:fs/promises";
    // await writeFile("output.wav", output);

    try {
        // const output = await replicate.run(
        //     "jaaari/kokoro-82m:f559560eb822dc509045f3921a1921234918b91739db4bf3daab2169b71c7a13",
        //     { input }
        // );

        const output = await replicate.run("lucataco/orpheus-3b-0.1-ft:79f2a473e6a9720716a473d9b2f2951437dbf91dc02ccb7079fb3d89b881207f", { input });
    

        await writeFile("output.wav", output);
        console.log("output.wav written to disk");
    } catch (error) {
        console.error("Error generating speech:", error);
    }
}

// Call the function
generateSpeech();
