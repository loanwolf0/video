'use client'

import { Button } from '@/components/ui/button'
import React, { useEffect } from 'react'

import { useRouter } from 'next/navigation'


function Header() {

    // async function generateSpeech(text) {
    //     const response = await fetch("http://localhost:8000/generate-tts", {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify({ text })
    //     });

    //     const blob = await response.blob();
    //     const audioURL = URL.createObjectURL(blob);

    //     // Play the audio
    //     const audio = new Audio(audioURL);
    //     audio.play();
    //   }

    //   // Example usage
    //   generateSpeech("Hello, this is Coqui TTS running with JavaScript!");

    //     useEffect(() => {
    //         async function generateSpeech(text) {
    //             try {
    //                 const response = await fetch("http://localhost:8000/generate-tts", {
    //                     method: "POST",
    //                     headers: { "Content-Type": "application/json" },
    //                     body: JSON.stringify({ text }),
    //                 });
    // console.log(response, "response");

    //                 const blob = await response.blob();
    //                 const audioURL = URL.createObjectURL(blob);

    //                 // ✅ Ensure `Audio` is only used in the browser
    //                 if (typeof window !== "undefined") {
    //                     const audio = new Audio(audioURL);
    //                     audio.play();
    //                 } else {
    //                     console.warn("Audio cannot be played on the server");
    //                 }
    //             } catch (error) {
    //                 console.error("Error generating speech:", error);
    //             }
    //         }

    //         // Example usage - runs only in the browser
    //         generateSpeech("Hello, this is Coqui TTS running with JavaScript!");
    //     }, []);

    async function generateSpeech(text) {
        try {
            const response = await fetch("http://localhost:8000/generate-tts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text }),
            });

            // ✅ Check if response is OK before playing
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Server Error:", errorData.error);
                return;
            }

            console.log("✅ Audio received successfully");

            const blob = await response.blob();
            console.log("🔍 Blob Type:", blob.type, "| Size:", blob.size, "bytes");


            if (blob.size === 0) {
                console.error("❌ Error: Received an empty audio file!");
                return;
            }


            const audioURL = URL.createObjectURL(blob);

            if (typeof window !== "undefined") {
                const audio = new Audio(audioURL);
                audio.play()
                // ✅ Create a download link
                const a = document.createElement("a");
                a.href = audioURL;
                a.download = "generated_audio.wav";  // File name for download
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);  // Cleanup after download

                console.log("📥 WAV file downloaded successfully");
            }
        } catch (error) {
            console.error("❌ Error generating speech:", error);
        }
    }


    const handlePlaySpeech = () => {
        const PROMPT = `
        एक घना जंगल था, जहाँ एक क्रूर और लालची शेर रहता था। वह रोज़ बिना सोचे-समझे किसी भी जानवर को अपना शिकार बना लेता... , जंगल के सारे जानवर भयभीत और परेशान थे।, आखिरकार, उन्होंने मिलकर... एक उपाय सोचने का फैसला किया।`

        const TEST_PROMPT = `
        एक शक्तिशाली शेर ,🦁 जिसका नाम सूरज है। वह एक बड़ी चट्टान पर बैठा है... 
        उसकी मोटी गर्दन पर धूप पड़ रही है... ☀️ गर्म... और सुकून देने वाली। उसके चेहरे पर *गर्व और आलस्य का भाव* है।`
        
        generateSpeech(PROMPT)
    }

    const router = useRouter()
    const openLoginPage = () => {
        router.push('/login')
    }




    return (
        <div className=' w-100 flex justify-between mt-5'>
            <div>
                <h2 className='text-2xl font-bold'>Video Crafter</h2>
            </div>

            {/* <div>
                <Button onClick={handlePlaySpeech}> Get Play</Button>
            </div> */}
        </div>


    )
}

export default Header