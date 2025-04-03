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


export const generateImagePrompts = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        { text: "Generate image promt of cinematicStyle with all details for each for 30 seconds video : script: At 1:15 AM on January 8, 2008, an alarm blares at Lego Garcia Airbase in the United States. The radar has detected an unknown aircraft approaching their airspace from the South Indian Ocean.\n\nImmediately, two F-15E Strike Eagles are scrambled to intercept the unidentified plane. As the F-15s close in, they identify the aircraft—it's a Russian Tu-95 Bear bomber.\n\nThe American pilots issue a warning, instructing the bomber to change course. However, the Russian pilot responds over the radio:\n\"We are in international airspace, and we have every right to fly here.\"\n\nSuddenly, the F-15 pilots notice two small drones launching from the bomber. Acting swiftly, the American pilots neutralize the drones before they pose any threat.\n\nRealizing the situation, the Russian bomber alters its course and gradually moves away, heading back over the South Indian Ocean.\n\njust give specific image prompt depends on the story line\ndo not give camera angle image prompt\nfollow the following schema and return the JSON data (max image : 5-6 images)\n[\n{\nimagePrompt: \"\",\nscheneContent: '<script content>'\n}\n]" },
      ],
    },
    {
      role: "model",
      parts: [
        { text: "```json\n[\n{\n\"imagePrompt\": \"Cinematic still, wide shot, Lego Garcia Airbase at night, January 8, 2008, 1:15 AM. Radar tower illuminated, runway lights stretching into the darkness. Two F-15E Strike Eagles taxiing rapidly, engines glowing, alarm lights flashing across the base. Emphasis on the sense of urgent activity and military atmosphere.\",\n\"scheneContent\": \"At 1:15 AM on January 8, 2008, an alarm blares at Lego Garcia Airbase in the United States. The radar has detected an unknown aircraft approaching their airspace from the South Indian Ocean.\"\n},\n{\n\"imagePrompt\": \"Cinematic still, close-up shot, radar screen in a darkened control room. Radar blip moving rapidly towards the US airspace, originating from the South Indian Ocean. Focus on the glowing screen and the tense atmosphere of the control room.\",\n\"scheneContent\": \"The radar has detected an unknown aircraft approaching their airspace from the South Indian Ocean.\"\n},\n{\n\"imagePrompt\": \"Cinematic still, medium shot, two F-15E Strike Eagles soaring through the night sky, afterburners blazing. Silhouette of the aircraft against the star-filled background. Emphasis on speed and power.\",\n\"scheneContent\": \"Immediately, two F-15E Strike Eagles are scrambled to intercept the unidentified plane.\"\n},\n{\n\"imagePrompt\": \"Cinematic still, wide shot, F-15E Strike Eagles flanking a Russian Tu-95 Bear bomber in the dark sky. The Bear bomber is distinct and easily identifiable. Focus on the standoff between the two aircraft types.\",\n\"scheneContent\": \"As the F-15s close in, they identify the aircraft—it's a Russian Tu-95 Bear bomber.\"\n},\n{\n\"imagePrompt\": \"Cinematic still, close-up shot from inside the cockpit of an F-15E, pilot's face illuminated by the instruments, looking intently. Radio communication display visible. Tension and focus in the pilot's expression.\",\n\"scheneContent\": \"The American pilots issue a warning, instructing the bomber to change course. However, the Russian pilot responds over the radio: \\\"We are in international airspace, and we have every right to fly here.\\\"\"\n},\n{\n\"imagePrompt\": \"Cinematic still, action shot, F-15E firing flares, two small drones exploding in mid-air near the Tu-95 Bear bomber. Emphasis on the rapid action and the effectiveness of the countermeasures.\",\n\"scheneContent\": \"Suddenly, the F-15 pilots notice two small drones launching from the bomber. Acting swiftly, the American pilots neutralize the drones before they pose any threat.\"\n},\n{\n\"imagePrompt\": \"Cinematic still, wide shot, the Russian Tu-95 Bear bomber turning away from the US airspace, heading back towards the South Indian Ocean. F-15E Strike Eagles flying alongside, maintaining surveillance. Sense of de-escalation and controlled retreat.\",\n\"scheneContent\": \"Realizing the situation, the Russian bomber alters its course and gradually moves away, heading back over the South Indian Ocean.\"\n}\n]\n```" },
      ],
    },
  ],
});


export const dividePrompt = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        { text: "just divide this prompt: \"A rabbit who helps a baby lion after some times when rabbit in danger then lion helps him\" ,  into 3 parts, short and concisse, do not add extra thing like schene or parts , just need exact value , follow schema : {[\"\", \"\", \"\", ]};" },
      ],
    },
    {
      role: "model",
      parts: [
        { text: "{[\"Rabbit helps lion cub\", \"Rabbit in danger\", \"Lion helps rabbit\"]}\n" },
      ],
    },
  ],
});
