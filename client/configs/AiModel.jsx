const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
};


export const generateScript = model.startChat({
    generationConfig,
    history: [
        {
            role: "user",
            parts: [
                { text: "give me response just like my schema is, i have an array of scripts (just like a human tells ) where two scripts content will come, inside the content field i need the actulal script , if two script then there should be two content filed with thier scripts and they are in scripts array, do not add time , visuals or audio only scripts needed, not other things, write a two different script for 30 seconds video on topic : kids story,\nGive me response in json format and follow the schema\n-{\nscripts- [\n{\ncontent: ''\n},\n],\n}" },
            ],
        },
        {
            role: "model",
            parts: [
                { text: "```json\n{\n  \"scripts\": [\n    {\n      \"content\": \"Once upon a time, in a land filled with candy trees and lollipop flowers, lived a little gummy bear named Gummy. Gummy loved adventures, but he was also very shy. One day, he decided to overcome his fear and explore the Whispering Woods.\"\n    },\n    {\n      \"content\": \"As Gummy bravely walked through the woods, he heard a tiny whimper. Following the sound, he found a little lost firefly whose light had gone out. Gummy, despite being scared, shared his sweet candy heart with the firefly. The firefly's light returned, shining brighter than ever, and they became the best of friends.\"\n    }\n  ]\n}\n```\n" },
            ],
        },
    ],
});

// const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
// console.log(result.response.text());
