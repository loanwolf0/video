const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
const fs = require("node:fs");
const mime = require("mime-types");

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp-image-generation",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseModalities: [
    "image",
    "text",
  ],
  responseMimeType: "text/plain",
};

  export const generateStoryWithImages = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [
          {text: "Generate a story ,example added below, in a 3d cartoon animation style, use text in hindi for 50-60sec. For each scene, generate an image., min(8-9 images) give me output in this schema :\n[\n{\ntext: \"\",\nimage: \"\"\n}\n],,,,add the image urls also, use story like this one or kids book story which they read in their classrooms and create visual story , एक घना जंगल था, जहाँ एक लालची शेर रहता था। वह रोज़ किसी भी जानवर को पकड़कर खा जाता। सारे जानवर बहुत डर गए और मिलकर एक योजना बनाई।\n\nएक दिन, खरगोश की बारी आई। वह चतुर था। उसने धीरे-धीरे चलते हुए शेर के पास पहुँचने में देर कर दी। शेर गुस्से में दहाड़ा, \"तू देर से क्यों आया?\"\n\nखरगोश ने डरते हुए कहा, \"महाराज! मैं समय पर आ रहा था, लेकिन रास्ते में एक और शेर ने मुझे रोक लिया। वह कह रहा था कि यह जंगल अब उसका है!\"\n\nशेर गुस्से में आगबबूला हो गया, \"कौन है वो? मुझे दिखाओ!\"\n\nखरगोश शेर को जंगल के पुराने कुएँ के पास ले गया और कहा, \"महाराज, वो इसी कुएँ में रहता है!\"\n\nशेर ने गुस्से में कुएँ में झाँका, तो उसे अपनी ही परछाई दिखी। उसने सोचा कि दूसरा शेर उसे घूर रहा है! गुस्से में उसने जोर से दहाड़ा और कुएँ में छलांग लगा दी। 🌀💦\n\nबस! शेर कुएँ में गिरकर डूब गया। सारे जानवर खुशी से नाचने लगे, और चतुर खरगोश हीरो बन गया! 🎉🐰"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "Okay, here's the story in Hindi with image descriptions and example image URLs, designed for a 3D cartoon animation style (approximately 50-60 seconds if each scene is around 5-7 seconds long).\n\n**Please note:** I cannot directly generate images. I will provide descriptions for the images you need to create or imagine, along with placeholder image URLs. You will need to use an image generation tool to create the actual images based on these descriptions and replace the placeholder URLs.\n\nHere's the output in the requested schema:\n\n**Story:**\n\nएक घना जंगल था, जहाँ एक लालची शेर रहता था। वह रोज़ किसी भी जानवर को पकड़कर खा जाता। सारे जानवर बहुत डर गए और मिलकर एक योजना बनाई।\n\nएक दिन, खरगोश की बारी आई। वह चतुर था। उसने धीरे-धीरे चलते हुए शेर के पास पहुँचने में देर कर दी। शेर गुस्से में दहाड़ा, \"तू देर से क्यों आया?\"\n\nखरगोश ने डरते हुए कहा, \"महाराज! मैं समय पर आ रहा था, लेकिन रास्ते में एक और शेर ने मुझे रोक लिया। वह कह रहा था कि यह जंगल अब उसका है!\"\n\nशेर गुस्से में आगबबूला हो गया, \"कौन है वो? मुझे दिखाओ!\"\n\nखरगोश शेर को जंगल के पुराने कुएँ के पास ले गया और कहा, \"महाराज, वो इसी कुएँ में रहता है!\"\n\nशेर ने गुस्से में कुएँ में झाँका, तो उसे अपनी ही परछाई दिखी। उसने सोचा कि दूसरा शेर उसे घूर रहा है! गुस्से में उसने जोर से दहाड़ा और कुएँ में छलांग लगा दी। 🌀💦\n\nबस! शेर कुएँ में गिरकर डूब गया। सारे जानवर खुशी से नाचने लगे, और चतुर खरगोश हीरो बन गया! 🎉🐰\n\n**Schema:**\n\n**Scene 1:**\n\n{\ntext: \"एक घना जंगल था, जहाँ एक लालची शेर रहता था।\",\nimage: \"https://image.pollinations.ai/prompt/3d%20cartoon%20style,%20a%20dense%20forest,%20a%20cunning%20lion%20sitting\"\n}\n\n**Scene 2:**\n\n{\ntext: \"वह रोज़ किसी भी जानवर को पकड़कर खा जाता।\",\nimage: \"https://image.pollinations.ai/prompt/3d%20cartoon%20style,%20a%20lion%20catching%20a%20scared%20deer\"\n}\n\n**Scene 3:**\n\n{\ntext: \"सारे जानवर बहुत डर गए और मिलकर एक योजना बनाई।\",\nimage: \"https://image.pollinations.ai/prompt/3d%20cartoon%20style,%20group%20of%20scared%20animals%20(rabbit,fox,elephant)%20whispering%20a%20plan\"\n}\n\n**Scene 4:**\n\n{\ntext: \"एक दिन, खरगोश की बारी आई। वह चतुर था। उसने धीरे-धीरे चलते हुए शेर के पास पहुँचने में देर कर दी।\",\nimage: \"https://image.pollinations.ai/prompt/3d%20cartoon%20style,%20a%20clever%20rabbit%20walking%20slowly%20towards%20an%20impatient%20lion\"\n}\n\n**Scene 5:**\n\n{\ntext: \"शेर गुस्से में दहाड़ा, 'तू देर से क्यों आया?'\",\nimage: \"https://image.pollinations.ai/prompt/3d%20cartoon%20style,%20an%20angry%20lion%20roaring%20at%20a%20nervous%20rabbit,%20text%20bubble%20with%20'तू%20देर%20से%20क्यों%20आया?'\"\n}\n\n**Scene 6:**\n\n{\ntext: \"खरगोश ने डरते हुए कहा, 'महाराज! मैं समय पर आ रहा था, लेकिन रास्ते में एक और शेर ने मुझे रोक लिया। वह कह रहा था कि यह जंगल अब उसका है!'\",\nimage: \"https://image.pollinations.ai/prompt/3d%20cartoon%20style,%20a%20frightened%20rabbit%20explaining%20to%20the%20lion,%20text%20bubble%20with%20'महाराज!%20मैं%20समय%20पर%20आ%20रहा%20था,%20लेकिन%20रास्ते%20में%20एक%20और%20शेर%20ने%20मुझे%20रोक%20लिया।%20वह%20कह%20रहा%20था%20कि%20यह%20जंगल%20अब%20उसका%20है!'\"\n}\n\n**Scene 7:**\n\n{\ntext: \"शेर गुस्से में आगबबूला हो गया, 'कौन है वो? मुझे दिखाओ!'\",\nimage: \"https://image.pollinations.ai/prompt/3d%20cartoon%20style,%20a%20very%20angry%20lion%20with%20fiery%20eyes,%20text%20bubble%20with%20'कौन%20है%20वो?%20मुझे%20दिखाओ!'\"\n}\n\n**Scene 8:**\n\n{\ntext: \"खरगोश शेर को जंगल के पुराने कुएँ के पास ले गया और कहा, 'महाराज, वो इसी कुएँ में रहता है!'\",\nimage: \"https://image.pollinations.ai/prompt/3d%20cartoon%20style,%20a%20rabbit%20leading%20a%20lion%20to%20an%20old%20well,%20text%20bubble%20with%20'महाराज,%20वो%20इसी%20कुएँ%20में%20रहता%20है!'\"\n}\n\n**Scene 9:**\n\n{\ntext: \"शेर ने गुस्से में कुएँ में झाँका, तो उसे अपनी ही परछाई दिखी। उसने सोचा कि दूसरा शेर उसे घूर रहा है! गुस्से में उसने जोर से दहाड़ा और कुएँ में छलांग लगा दी। 🌀💦\",\nimage: \"https://image.pollinations.ai/prompt/3d%20cartoon%20style,%20a%20lion%20peering%20into%20a%20well%20seeing%20his%20reflection,%20then%20jumping%20in%20with%20water%20splash%20and%20a%20swirl%20emoji\"\n}\n\n**Scene 10:**\n\n{\ntext: \"बस! शेर कुएँ में गिरकर डूब गया। सारे जानवर खुशी से नाचने लगे, और चतुर खरगोश हीरो बन गया! 🎉🐰\",\nimage: \"https://image.pollinations.ai/prompt/3d%20cartoon%20style,%20animals%20(rabbit,fox,elephant,deer)%20happily%20dancing%20around%20a%20well,%20a%20rabbit%20with%20a%20hero%20cape%20and%20confetti,%20party%20popper%20and%20rabbit%20emojis\"\n}\n\nRemember to replace the placeholder URLs with the actual images you generate. Good luck with your animation!"},
        ],
      },
    ],
  });

  // const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
  // // TODO: Following code needs to be updated for client-side apps.
  // const candidates = result.response.candidates;
  // for(let candidate_index = 0; candidate_index < candidates.length; candidate_index++) {
  //   for(let part_index = 0; part_index < candidates[candidate_index].content.parts.length; part_index++) {
  //     const part = candidates[candidate_index].content.parts[part_index];
  //     if(part.inlineData) {
  //       try {
  //         const filename = `output_${candidate_index}_${part_index}.${mime.extension(part.inlineData.mimeType)}`;
  //         fs.writeFileSync(filename, Buffer.from(part.inlineData.data, 'base64'));
  //         console.log(`Output written to: ${filename}`);
  //       } catch (err) {
  //         console.error(err);
  //       }
  //     }
  //   }
  // }
  // console.log(result.response.text());
