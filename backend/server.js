// imported essenital modules

const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// the code below will load environment variables
// dotenv is a module used for this purpose

require('dotenv').config();


//initialization and defining port
const app = express();
const port = 5000;

// Middleware
app.use(cors()); // Applies the CORS middleware to your application, allowing requests from any origin.
app.use(bodyParser.json());

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Route to handle FAQ requests
app.post('/api/faq', async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const result = await model.generateContent(question);
    const response = await result.response;
    const answer = response.text();

    res.json({ answer });
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


//start the server 
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
