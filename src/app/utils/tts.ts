import axios from 'axios';

const ELEVENLABS_API_KEY = process.env.NEXT_PUBLIC_ELEVEN_LABS_API_KEY;
const VOICE_ID = '8ZPF691fXVTPP7rJRqlO'; // Default voice ID (you can change this)

export async function textToSpeech(text: string) {
  try {
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        text,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
        },
      },
      {
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
          accept: 'audio/mpeg',
        },
        responseType: 'blob', // Get audio as a blob
      }
    );

    // Create an audio element and play the response
    const audio = new Audio(URL.createObjectURL(response.data));
    audio.play();
  } catch (error) {
    console.error('Error generating TTS:', error);
  }
}