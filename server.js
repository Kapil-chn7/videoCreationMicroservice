// server.js

import express from "express";
import axios from "axios";
import { textToSpeech } from "./speech.js";
import dotenv from "dotenv";
import OpenAI from "openai/index.mjs";
import { processVideoAudio } from "./combineVideo.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

app.post("/process-text", async (req, res) => {
  const prompt = req.body.inputText + " Gives result without commentary.";
  console.log("this is the prompt " + req.body.inputText);
  if (true) {
    const data =
      "In the small village of Hikari, a mysterious fog rolled in one autumn evening. The residents brushed it off as a strange weather phenomenon, but soon they began to hear eerie whispers in the mist As the fog thickened, people started disappearing one by one. Rumors spread of a vengeful spirit haunting the village, seeking revenge for a long-forgotten injustice. Those who ventured out at night never returned, their screams echoing through the fog. The villagers locked themselves inside their homes, afraid to even breathe the cursed air outside. One night, a brave young woman ventured out into the fog to uncover the truth. She followed the whispers to an ancient shrine, where she discovered the spirit of a young girl who had been wronged in the past. With tears in her eyes, the spirit begged for justice and release from her torment. The young woman promised to help, and together they confronted the villagers responsible for the girl's suffering.As the sun rose, the fog lifted, revealing a village changed forever. The spirit was finally at peace, and the villagers learned the true cost of their actions. But some say that on misty autumn nights, the whispers can still be heard, a reminder of the horrors that once plagued Hikari.       ";
    // const audioData = await textToSpeech(data);
    processVideoAudio();
    //console.log("this is the audioData" + audioData);
    res.send(data);
    return;
  }
  if (!req.body) {
    return res.status(400).json({ error: "Input text is required" });
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const openaiResult = completion.choices[0].message.content;
    console.log("this si the result " + openaiResult);
    //const audioData = await textToSpeech(openaiResult);

    res.json({
      openaiResponse: openaiResult,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
