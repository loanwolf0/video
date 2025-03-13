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
            console.log(response, "response");

            const blob = await response.blob();
            const audioURL = URL.createObjectURL(blob);

            // ✅ Ensure `Audio` is only used in the browser
            if (typeof window !== "undefined") {
                const audio = new Audio(audioURL);
                audio.play();
            } else {
                console.warn("Audio cannot be played on the server");
            }
        } catch (error) {
            console.error("Error generating speech:", error);
        }
    }

    const handlePlaySpeech = () => {
        generateSpeech(`Waqf – एक ऐसा system जो इस्लामिक समाज में charity और welfare के लिए बनाया गया था।
            पुराने जमाने में नवाबों और अमीरों ने ज़मीन दान की ताकि इससे गरीबों की मदद हो सके।`);
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

            <div>
                <Button onClick={handlePlaySpeech}> Get Play</Button>
            </div>
        </div>


    )
}

export default Header