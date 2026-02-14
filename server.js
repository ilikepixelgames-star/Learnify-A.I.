// server.js
import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

// Make sure you set your API key in an environment variable
// Example in terminal: export OPENAI_API_KEY="your_key_here"
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/generate-quiz", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "No text provided" });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that generates multiple-choice quizzes."
        },
        {
          role: "user",
          content: `Create 5 multiple-choice quiz questions from the following text:\n\n${text}\nFormat as JSON like this: [{"question":"...", "choices":["A","B","C","D"], "answer":"A"}]`
        }
      ],
      temperature: 0.7
    });

    // GPT output as text
    const quizText = response.choices[0].message.content;

    res.json({ quiz: quizText });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate quiz" });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
