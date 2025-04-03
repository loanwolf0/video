// const {
//     GoogleGenerativeAI,
//     HarmCategory,
//     HarmBlockThreshold,
// } = require("@google/generative-ai");
// const { GoogleAIFileManager } = require("@google/generative-ai/server");
// const fs = require("node:fs");
// const mime = require("mime-types");

// const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
// const genAI = new GoogleGenerativeAI(apiKey);
// const fileManager = new GoogleAIFileManager(apiKey);

// /**
//  * Uploads the given file to Gemini.
//  *
//  * See https://ai.google.dev/gemini-api/docs/prompting_with_media
//  */
// async function uploadToGemini(path, mimeType) {
//     const uploadResult = await fileManager.uploadFile(path, {
//         mimeType,
//         displayName: path,
//     });
//     const file = uploadResult.file;
//     console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
//     return file;
// }

// const model = genAI.getGenerativeModel({
//     model: "gemini-2.0-flash-exp-image-generation",
// });

// const generationConfig = {
//     temperature: 1,
//     topP: 0.95,
//     topK: 40,
//     maxOutputTokens: 8192,
//     responseModalities: [
//         "image",
//         "text",
//     ],
//     responseMimeType: "text/plain",
// };


// // TODO: Following code needs to be updated for client-side apps.

// const run = () => {
//     const inlineFiles = [];
//     try {
//         let filename = '';
//         filename = 'input_0';
//         fs.writeFileSync(filename, Buffer.from("iVBORw0KGgoAAAANSUhEUgAABAAAAAI+CAIAAACt3+8zAAAgAElEQVR4nGT9264kyZIliK0lombue++IyJOnrl0NkpiZdwIE/4Vv/D4+EOAH8IEEQT6QIMHBNDg9fauqru5zqZMnMyNj39zdTEUWH0TVfGdNFOpkxN5+MVNTFVmyZIkI//f/u//ND3/68xZws9ZIA5EG0ki6mSQjQYmeBhqNBGigYARIwAgAgBlIihQIkkYKMBCWIEkSAgAJBASBRL0CxvkxkAwGECYAV", 'base64'));
//         console.log(`Input written to: ${filename}`);
//         inlineFiles.push(await uploadToGemini(filename, "image/png"));
//     } catch (err) {
//         console.error(err);
//     }

//     const generateCartoonStory = model.startChat({
//         generationConfig,
//         history: [
//             {
//                 role: "user",
//                 parts: [
//                     { text: "Generate a story about a loin and clever fox in hindi in a 3d cartoon animation style. For each scene, generate an image." },
//                 ],
//             },
//             {
//                 role: "model",
//                 parts: [
//                     { text: "## शेर और चालाक लोमड़ी\n\n**दृश्य 1:** घने जंगल का एक सुंदर दृश्य। सूरज की सुनहरी किरणें पेड़ों की पत्तियों से छनकर नीचे आ रही हैं। एक शक्तिशाली शेर, जिसका नाम सूरज है, एक बड़ी चट्टान पर बैठा हुआ है, अपनी मोटी गर्दन पर धूप सेंक रहा है। उसके चेहरे पर गर्व और आलस्य का भाव है।\n\n" },
//                     {
//                         fileData: {
//                             mimeType: inlineFiles[0].mimeType,
//                             fileUri: inlineFiles[0].uri,
//                         },
//                     },
//                     { text: "**दृश्य 2:** एक चालाक लोमड़ी, जिसका नाम चतुरक है, झाड़ियों के पीछे से दबे पांव आती है। उसकी आँखें तेज हैं और वह आसपास का ध्यान से निरीक्षण कर रहा है। वह सूरज को देखता है और उसके दिमाग में एक योजना बनती है।\n\n" },
//                     {
//                         fileData: {
//                             mimeType: inlineFiles[1].mimeType,
//                             fileUri: inlineFiles[1].uri,
//                         },
//                     },
//                     { text: "**दृश्य 3:** चतुरक धीरे-धीरे सूरज के पास जाता है और अदब से झुककर कहता है, \"महाराज, आपको मेरा प्रणाम।\" सूरज अपनी आँखें खोलता है और उसे घूरता है।\n\n" },
//                     {
//                         fileData: {
//                             mimeType: inlineFiles[2].mimeType,
//                             fileUri: inlineFiles[2].uri,
//                         },
//                     },
//                     { text: "**दृश्य 4:** सूरज दहाड़ता है, \"तुम कौन हो छोटी जीव? और मेरे आराम में विघ्न क्यों डाल रहे हो?\" चतुरक डरने का नाटक करता है और कहता है, \"महाराज, मेरा नाम चतुरक है। मैं आपको एक महत्वपूर्ण सूचना देने आया हूँ।\"\n\n" },
//                     {
//                         fileData: {
//                             mimeType: inlineFiles[3].mimeType,
//                             fileUri: inlineFiles[3].uri,
//                         },
//                     },
//                     { text: "**दृश्य 5:** सूरज अपनी पूंछ हिलाता है और कहता है, \"सूचना? कैसी सूचना?\" चतुरक उत्सुकता से कहता है, \"महाराज, मैंने सुना है कि इस जंगल में एक बहुत बड़ा और मोटा हिरण आया है। वह इतना मोटा है कि आपके एक भोजन के लिए पर्याप्त होगा।\"\n\n" },
//                     {
//                         fileData: {
//                             mimeType: inlineFiles[4].mimeType,
//                             fileUri: inlineFiles[4].uri,
//                         },
//                     },
//                     { text: "**दृश्य 6:** सूरज की आँखें चमक उठती हैं। वह अपने पेट को छूता है और कहता है, \"सच में? कहाँ है वह हिरण? मुझे अभी बताओ!\" चतुरक मुस्कुराता है और कहता है, \"महाराज, वह एक खतरनाक गुफा के पास छिपा हुआ है। लेकिन मैं आपको वहां तक ले जा सकता हूँ।\"\n\n" },
//                     {
//                         fileData: {
//                             mimeType: inlineFiles[5].mimeType,
//                             fileUri: inlineFiles[5].uri,
//                         },
//                     },
//                     { text: "**दृश्य 7:** सूरज चतुरक के पीछे-पीछे चलता है। चतुरक उसे एक संकरे और पथरीले रास्ते पर ले जाता है। सूरज को चलने में कठिनाई हो रही है, लेकिन मोटे हिरण के लालच में वह आगे बढ़ता रहता है।\n\n" },
//                     {
//                         fileData: {
//                             mimeType: inlineFiles[6].mimeType,
//                             fileUri: inlineFiles[6].uri,
//                         },
//                     },
//                     { text: "**दृश्य 8:** अंत में वे एक गहरी गुफा के मुहाने पर पहुँचते हैं। चतुरक रुक जाता है और कहता है, \"महाराज, हिरण अंदर ही है। आप जाइए और उसे पकड़ लीजिए।\"\n\n" },
//                     {
//                         fileData: {
//                             mimeType: inlineFiles[7].mimeType,
//                             fileUri: inlineFiles[7].uri,
//                         },
//                     },
//                     { text: "**दृश्य 9:** सूरज बिना सोचे-समझे गुफा के अंदर चला जाता है। अंदर अंधेरा और फिसलन भरा है। अचानक, उसे पैरों की आवाज सुनाई देती है और कुछ तेज धारदार पंजे उस पर हमला करते हैं। वह दर्द से दहाड़ता है।\n\n" },
//                     {
//                         fileData: {
//                             mimeType: inlineFiles[8].mimeType,
//                             fileUri: inlineFiles[8].uri,
//                         },
//                     },
//                     { text: "**दृश्य 10:** गुफा के बाहर चतुरक शांति से बैठा हुआ है और सूरज की दहाड़ सुन रहा है। वह मंद-मंद मुस्कुराता है। गुफा के अंदर से एक तेंदुआ निकलता है, जो सूरज पर हमला करने वाला शिकारी था। तेंदुआ चतुरक को धन्यवाद भरी नजरों से देखता है।\n\n" },
//                     {
//                         fileData: {
//                             mimeType: inlineFiles[9].mimeType,
//                             fileUri: inlineFiles[9].uri,
//                         },
//                     },
//                     { text: "**दृश्य 11:** चतुरक धीरे-धीरे जंगल में वापस चला जाता है, अपनी चालाकी पर गर्व महसूस कर रहा है। सूरज गुफा में बुरी तरह घायल पड़ा रहता है, अपनी मूर्खता पर पछता रहा होता है।\n\n" },
//                     {
//                         fileData: {
//                             mimeType: inlineFiles[10].mimeType,
//                             fileUri: inlineFiles[10].uri,
//                         },
//                     },
//                     { text: "**निष्कर्ष:** इस कहानी से हमें यह सीख मिलती है कि हमें कभी भी दूसरों की बातों पर आँख मूंदकर विश्वास नहीं करना चाहिए, खासकर जब लालच हमारे विवेक पर हावी हो। चालाक लोग हमेशा अपने फायदे के लिए दूसरों का इस्तेमाल करने की कोशिश करते हैं।" },
//                 ],
//             },
//         ],
//     });
// }

// // const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
// // // TODO: Following code needs to be updated for client-side apps.

// // console.log(result.response.text());



const { GoogleGenerativeAI } = require("@google/generative-ai");

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
    responseModalities: ["image", "text"], // Request both text & image
    // responseMimeType: "application/json",
};

/**
 * Generates a Hindi kids' story with image prompts.
 */
export const generateCartoonStory = model.startChat({
    generationConfig,
    history: [
        {
            role: "user",
            parts: [
                {
                    text: "Generate a kids' story in Hindi with a 3D cartoon animation style. For each scene, generate an image. minimum 20 images",
                },
            ],
        },
    ],
});
