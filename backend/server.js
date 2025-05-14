// imported essenital modules

const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// the code below will load environment variables
// dotenv is a module used for this purpose

require("dotenv").config();

//initialization and defining port
const app = express();
const port = 5000;

// Middleware
app.use(cors()); // Applies the CORS middleware to your application, allowing requests from any origin.
app.use(bodyParser.json());

// Initialize Gemini API with updated SDK
const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.error("API_KEY not found in environment variables. Please check your .env file.");
  process.exit(1);
}
// Initialize the Google GenerativeAI client with API key
const genAI = new GoogleGenerativeAI(apiKey);
// Model to use
const modelName = "gemini-1.5-flash";

// Route to handle FAQ requests with streaming
app.post("/api/faq", async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    const contents = [
      {
        role: "user",
        parts: [
          {
            text: question,
          },
        ],
      },
    ]; // Get the model instance and generate content stream
    const model = genAI.getGenerativeModel({ model: modelName });

    // Generate content stream with configuration
    const generationConfig = {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1000,
    }; // Generate content (non-streaming for better compatibility)
    const result = await model.generateContent({
      contents,
      generationConfig,
    });

    // Process the response
    let answer = "";
    if (
      result &&
      result.response &&
      result.response.candidates &&
      result.response.candidates.length > 0 &&
      result.response.candidates[0].content &&
      result.response.candidates[0].content.parts
    ) {
      // Extract text from all parts
      for (const part of result.response.candidates[0].content.parts) {
        if (part.text) {
          answer += part.text;
        }
      }
    } else {
      answer = "Sorry, I couldn't generate a response at this time.";
    }

    res.json({ answer });
  } catch (error) {
    console.error("Error handling request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
