import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Optional: Fetch initial data from an API (if applicable)
  }, []);

  const askQuestion = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/faq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setChatHistory([
        ...chatHistory,
        { question, answer: data.answer, isUser: true },
        { question: data.answer, isUser: false },
      ]);
      setQuestion(''); // Clear the input field
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch answer');
    } finally {
      setLoading(false);
    }
  };

  const formatContent = (content) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')  // Replace **text** with <b>text</b>
      .replace(/\n/g, '<br />')               // Replace newlines with <br />
      .replace(/^\*+|\*+$/g, '');             // Remove leading and trailing asterisks
  };
  
  
  

  return (
    <div className="App">
      <h1 className="app-heading">FAQ Chatbot</h1>
      <div className="chat-window">
        <div className="chat-history">
          {chatHistory.map((chat, index) => (
            <div
              key={index}
              className={`chat-message ${chat.isUser ? 'user' : 'bot'}`}
              dangerouslySetInnerHTML={{ __html: formatContent(chat.question) }}
            />
          ))}
          {loading && <p className="loading">Loading...</p>}
          {error && <p className="error">{error}</p>}
        </div>
      </div>
      <div className="chat-input-container">
        <div className="chat-input">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question..."
            onKeyPress={(e) => {
              if (e.key === 'Enter') askQuestion();
            }}
            disabled={loading}
          />
          <button onClick={askQuestion} disabled={loading}>
            {loading ? 'Loading...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
