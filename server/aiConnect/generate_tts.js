
export async function generateSpeech(text) {
    const response = await fetch("http://localhost:4000/generate-tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
    });

    const blob = await response.blob();
    const audioURL = URL.createObjectURL(blob);

    // Play the audio
    const audio = new Audio(audioURL);
    audio.play();
}

// Example usage
generateSpeech("Hello, this is Coqui TTS running with JavaScript!");
