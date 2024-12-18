import axios from "axios";
import fs from "fs";
export const textToSpeech = async (text) => {
  const apiKey = process.env.GOOGLE_API_KEY; // Replace with your actual API key

  const data = {
    input: {
      text: text,
    },
    voice: {
      languageCode: "en-US",
      name: "en-US-Wavenet-D",
    },
    audioConfig: {
      audioEncoding: "MP3",
    },
  };

  axios
    .post(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    )
    .then((response) => {
      // The audio content will be in base64 format in response.data.audioContent
      const audioContent = response.data.audioContent;

      // Decode the base64 string to binary data
      const audioBuffer = Buffer.from(audioContent, "base64");

      // Save the binary data as an MP3 file
      fs.writeFile("output.mp3", audioBuffer, (err) => {
        if (err) {
          console.error("Error saving audio file:", err);
        } else {
          console.log("Audio file saved as output.mp3");
        }
      });
    })
    .catch((error) => {
      console.error("Error converting text to speech:", error);
    });
};
