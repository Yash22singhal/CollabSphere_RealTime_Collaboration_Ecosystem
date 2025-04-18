// test.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

async function run() {
  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: "Tell me a joke" }] }],
    });
    const response = await result.response;
    console.log("AI Response:", response.text());
  } catch (error) {
    console.error("Error:", error);
  }
}

run();
