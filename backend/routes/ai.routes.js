// import express from 'express';
// import { Router } from 'express';
// import OpenAI from 'openai'; // Import the OpenAI library
// import dotenv from 'dotenv'; // Import dotenv to access .env variables

// dotenv.config(); // Load environment variables from .env file

// const router = Router();

// // Initialize OpenAI client
// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// // Middleware to check for API key
// const checkApiKey = (req, res, next) => {
//   if (!process.env.OPENAI_API_KEY) {
//     console.error('OpenAI API key is missing. Set OPENAI_API_KEY in .env file.');
//     return res.status(500).json({ message: 'OpenAI API key is not configured.' });
//   }
//   next();
// };

// router.post('/process', checkApiKey, async (req, res) => {
//   try {
//     const { text, action } = req.body;

//     if (!text || !action) {
//       return res.status(400).json({ message: 'Text and action are required.' });
//     }

//     let aiResponse = '';

//     switch (action) {
//       case 'summarize':
//         try {
//           const completion = await openai.chat.completions.create({
//             messages: [{ role: 'user', content: `Summarize this text: ${text}` }],
//             model: 'gpt-3.5-turbo', // Choose your desired model
//             max_tokens: 100, // Adjust as needed
//           });
//           aiResponse = completion.choices[0].message.content;
//         } catch (error) {
//           console.error('OpenAI Summarization Error:', error);
//           aiResponse = 'Error summarizing text.'; // Provide a user-friendly error message
//         }
//         break;

//       case 'suggest':
//         try {
//           const suggestions = await openai.chat.completions.create({
//             messages: [{ role: 'user', content: `Suggest improvements for this text: ${text}` }],
//             model: 'gpt-3.5-turbo',
//             max_tokens: 100,
//           });
//           aiResponse = suggestions.choices[0].message.content;
//         } catch (error) {
//           console.error('OpenAI Suggestion Error:', error);
//           aiResponse = 'Error suggesting improvements.';
//         }
//         break;

//       // Add more cases for other AI actions (e.g., 'rewrite', 'translate')

//       default:
//         return res.status(400).json({ message: 'Invalid action.' });
//     }

//     res.status(200).json({ response: aiResponse });
//   } catch (error) {
//     console.error('AI processing error:', error);
//     res.status(500).json({ message: 'Error processing with AI.' });
//   }
// });

// export default router;





import express from 'express';
import { Router } from 'express';
import { GoogleGenerativeAI } from "@google/generative-ai"; // Use the correct Gemini API library
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); // Use GEMINI_API_KEY

// Middleware to check for Gemini API key
const checkApiKey = (req, res, next) => {
  if (!process.env.GEMINI_API_KEY) {
    console.error('Gemini API key is missing. Set GEMINI_API_KEY in .env file.');
    return res.status(500).json({ message: 'Gemini API key is not configured.' });
  }
  next();
};

router.post('/process', checkApiKey, async (req, res) => {
  try {
    const { text, action } = req.body;

    if (!text || !action) {
      return res.status(400).json({ message: 'Text and action are required.' });
    }

    let aiResponse = '';
    // console.log(genAI.listModels());
    
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); // Specify the model

    switch (action) {
      case 'summarize':
        try {
          const prompt = `Summarize this text: ${text}. Just give the plain text, no formatting and no extra words except the actual content response.`;
          const result = await model.generateContent(prompt);
          const response = await result.response;
          aiResponse = response.text();
          if (!aiResponse) {
            aiResponse = 'Error: No summary generated.';
          }
        } catch (error) {
          console.error('Gemini Summarization Error:', error);
          aiResponse = 'Error summarizing text.';
        }
        break;

      case 'suggest':
        try {
          const prompt = `Suggest improvements for this text: ${text}. Just give the plain text, no formatting and no extra words except the actual content response.`;
          const result = await model.generateContent(prompt);
          const suggestions = await result.response;
          aiResponse = suggestions.text();
          if (!aiResponse) {
            aiResponse = 'Error: No suggestions generated.';
          }
        } catch (error) {
          console.error('Gemini Suggestion Error:', error);
          aiResponse = 'Error suggesting improvements.';
        }
        break;

        case 'chat':
          try {
            const prompt = `${text}. Just give the plain text, no formatting and no extra words except the actual content response.`;
            const result = await model.generateContent(prompt);
            const suggestions = await result.response;
            aiResponse = suggestions.text();
            if (!aiResponse) {
              aiResponse = 'Error genrating response.';
            }
          } catch (error) {
            console.error('Gemini Suggestion Error:', error);
            aiResponse = 'Error genrating response.';
          }
          break;

      // Add more cases for other AI actions

      default:
        return res.status(400).json({ message: 'Invalid action.' });
    }

    res.status(200).json({ response: aiResponse });
  } catch (error) {
    console.error('AI processing error:', error);
    res.status(500).json({ message: 'Error processing with AI.' });
  }
});

export default router;