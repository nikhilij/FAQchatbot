import { useState, useEffect, useRef } from "react";
import TailwindTest from "./components/TailwindTest";
import EmojiPicker from "./components/EmojiPicker";
import VoiceInput from "./components/VoiceInput";
import ResponseRating from "./components/ResponseRating";
import ThemeToggle from "./components/ThemeToggle";
import { ThemeProvider } from "./contexts/ThemeProvider.jsx";

function App() {
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    const savedChats = localStorage.getItem("chatHistory");
    if (savedChats) {
      try {
        setChatHistory(JSON.parse(savedChats));
      } catch (e) {
        console.error("Error parsing stored chat history:", e);
        localStorage.removeItem("chatHistory");
      }
    }
  }, []);

  useEffect(() => {
    if (chatHistory.length > 0) {
      const limitedHistory = chatHistory.slice(-100); // Limit to 100 messages
      localStorage.setItem("chatHistory", JSON.stringify(limitedHistory));
    }
  }, [chatHistory]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const askQuestion = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setError("");

    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const userMessage = {
      text: question,
      isUser: true,
      timestamp,
      id: Date.now(),
    };

    setChatHistory((prevHistory) => [...prevHistory, userMessage]);

    try {
      const response = await fetch("https://faqchatbot-amf6hxcja0ekgkf7.westcentralus-01.azurewebsites.net/api/faq", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      const botMessage = {
        text: data.answer,
        isUser: false,
        timestamp,
        id: Date.now() + 1,
      };

      setChatHistory((prevHistory) => [...prevHistory, botMessage]);
      setQuestion("");
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch answer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setChatHistory([]);
    localStorage.removeItem("chatHistory");
  };

  const formatContent = (content) => {
    if (!content) return "";
    return content
      .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
      .replace(/\n/g, "<br />")
      .replace(/^\*+|\*+$/g, "");
  };

  return (
    <ThemeProvider>
      <div className="flex flex-col h-screen bg-white">
        <TailwindTest />
        <header className="bg-white shadow-sm z-10 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-primary-500 rounded-full p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-800">FAQ Chatbot</h1>
          </div>
          <div className="flex items-center space-x-2">
            {chatHistory.length > 0 && (
              <button
                onClick={clearChat}
                className="bg-red-50 text-red-500 hover:bg-red-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150"
              >
                Clear History
              </button>
            )}
            <ThemeToggle />
          </div>
        </header>
        <div className="flex-1 relative">
          <div className="h-full overflow-y-auto px-4 sm:px-6 py-4" style={{ scrollbarWidth: "thin" }}>
            {chatHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <div className="bg-primary-50 p-6 rounded-full mb-6 animate-pulse-slow">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-primary-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome to FAQ Chatbot!</h2>
                <p className="text-gray-500 max-w-md mb-8">
                  I'm here to help answer your questions. Type your question in the box below to get started.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center space-x-3 hover:shadow-md transition-shadow duration-200">
                    <div className="bg-blue-50 p-2 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-blue-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-600">Ask about our products</span>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center space-x-3 hover:shadow-md transition-shadow duration-200">
                    <div className="bg-green-50 p-2 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-600">Get help with orders</span>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center space-x-3 hover:shadow-md transition-shadow duration-200">
                    <div className="bg-purple-50 p-2 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-purple-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-600">FAQ about services</span>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center space-x-3 hover:shadow-md transition-shadow duration-200">
                    <div className="bg-amber-50 p-2 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-amber-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-600">Contact support team</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6 pb-4" role="list">
                {chatHistory.map((chat, index) => (
                  <div
                    key={chat.id}
                    role="listitem"
                    aria-label={`${chat.isUser ? "User" : "Bot"} message at ${chat.timestamp}`}
                    className={`flex ${chat.isUser ? "justify-end" : "justify-start"} animate-[fadeIn_0.3s_ease-out]`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div
                      className={`
                      flex max-w-[80%] sm:max-w-[70%] 
                      ${
                        chat.isUser
                          ? "bg-primary-500 text-white border border-primary-600 rounded-t-2xl rounded-bl-2xl"
                          : "bg-white text-gray-900 border border-gray-200 rounded-t-2xl rounded-br-2xl shadow-sm"
                      }
                    `}
                    >
                      <div className="p-4">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`text-xs font-medium ${chat.isUser ? "text-primary-50" : "text-gray-400"}`}>
                            {chat.isUser ? "You" : "Bot"}
                          </span>
                          <span className={`text-xs ${chat.isUser ? "text-primary-50" : "text-gray-400"}`}>
                            • {chat.timestamp}
                          </span>
                        </div>
                        <div
                          className={`prose prose-sm sm:prose-base ${chat.isUser ? "prose-invert" : ""} max-w-none`}
                          dangerouslySetInnerHTML={{ __html: formatContent(chat.text) }}
                        />
                        {!chat.isUser && <ResponseRating messageId={chat.id} />}
                      </div>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start animate-fadeIn" role="status" aria-label="Bot is typing">
                    <div className="bg-white shadow-sm border border-gray-200 rounded-t-2xl rounded-br-2xl p-4">
                      <div className="flex items-center space-x-2">
                        <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-primary-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                          </svg>
                        </div>
                        <div className="typing-indicator ml-2">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {error && (
                  <div className="bg-red-50 text-red-500 p-4 rounded-lg mt-4 flex justify-between items-center">
                    <span>{error}</span>
                    <button onClick={askQuestion} className="text-sm text-red-600 hover:underline">
                      Retry
                    </button>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            )}
          </div>
        </div>
        <div className="border-t border-gray-200 bg-white p-4">
          <div className="max-w-4xl mx-auto">
            {chatHistory.length === 0 && (
              <div className="mb-4 flex overflow-x-auto pb-2 space-x-2 scrollbar-hide">
                <button
                  onClick={() => setQuestion("What services do you provide?")}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm whitespace-nowrap px-3 py-1.5 rounded-full transition-colors"
                >
                  What services do you provide?
                </button>
                <button
                  onClick={() => setQuestion("How do I contact support?")}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm whitespace-nowrap px-3 py-1.5 rounded-full transition-colors"
                >
                  How do I contact support?
                </button>
                <button
                  onClick={() => setQuestion("What are your business hours?")}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm whitespace-nowrap px-3 py-1.5 rounded-full transition-colors"
                >
                  What are your business hours?
                </button>
              </div>
            )}
            <div className="flex rounded-lg shadow-sm border border-gray-200 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500 transition-all duration-200">
              <div className="flex items-center pl-2">
                <EmojiPicker onSelect={(emoji) => setQuestion((prev) => prev + emoji)} />
              </div>
              <div className="relative flex-1">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Type your question here..."
                  className="w-full pl-2 pr-10 py-3.5 border-0 focus:outline-none focus:ring-0 bg-white text-gray-900 placeholder-gray-500"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      askQuestion();
                    }
                  }}
                  disabled={loading}
                />
                {question && (
                  <button
                    onClick={() => setQuestion("")}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              <div className="border-l border-gray-200 flex items-center">
                <VoiceInput onTranscript={(text) => setQuestion((prev) => prev + text)} />
                <div className="border-l border-gray-200">
                  <button
                    onClick={askQuestion}
                    disabled={loading}
                    className="h-full bg-white hover:bg-gray-100 text-primary-500 px-4 py-3 flex items-center justify-center transition-colors duration-200 disabled:opacity-50"
                    aria-label="Send message"
                  >
                    {loading ? (
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-2 text-xs text-center text-gray-500">
              Press Enter to send • Try asking about products, services, or support
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
