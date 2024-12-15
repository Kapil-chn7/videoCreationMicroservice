import axios from "axios";

export const textToSpeech = async (text) => {
  const GOOGLE_TTS_API_URL =
    "https://texttospeech.googleapis.com/v1/text:synthesize";
  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

  try {
    const requestBody = {
      input: { text },
      voice: { languageCode: "en-US", name: "en-US-Wavenet-D" },
      audioConfig: { audioEncoding: "MP3" },
    };

    const response = await axios.post(GOOGLE_TTS_API_URL, requestBody, {
      headers: {
        Authorization: `Bearer ${GOOGLE_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    return response.data.audioContent;
  } catch (error) {
    console.error("Error converting text to speech:", error);
    throw new Error("Failed to convert text to speech.");
  }
};
