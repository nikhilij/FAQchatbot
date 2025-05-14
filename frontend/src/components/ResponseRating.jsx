import { useState } from "react";
import { useTheme } from "../hooks/useTheme";

function ResponseRating({ messageId }) {
  const { darkMode } = useTheme();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleRating = async (value) => {
    setError("");
    try {
      const response = await fetch("http://localhost:5000/api/rating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId, rating: value }),
      });
      if (!response.ok) throw new Error("Failed to submit rating");
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting rating:", error);
      setError("Failed to submit rating. Please try again.");
    }
  };

  if (submitted) {
    return (
      <div className="flex items-center mt-2">
        <span className="text-xs text-green-500 dark:text-green-400">Thanks for your feedback!</span>
      </div>
    );
  }

  return (
    <div className="flex items-center mt-2">
      <span className="text-xs mr-2 text-gray-500 dark:text-gray-400">Was this helpful?</span>
      <button
        onClick={() => handleRating("helpful")}
        className={`p-1 rounded-full transition-colors ${
          darkMode
            ? "text-gray-300 hover:text-green-400 hover:bg-gray-700"
            : "text-gray-500 hover:text-green-500 hover:bg-gray-100"
        }`}
        title="Helpful"
        aria-label="Rate as helpful"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10 Fh-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
          />
        </svg>
      </button>
      <button
        onClick={() => handleRating("not-helpful")}
        className={`p-1 rounded-full transition-colors ${
          darkMode
            ? "text-gray-300 hover:text-red-400 hover:bg-gray-700"
            : "text-gray-500 hover:text-red-500 hover:bg-gray-100"
        }`}
        title="Not helpful"
        aria-label="Rate as not helpful"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4"
          />
        </svg>
      </button>
      {error && (
        <span className="text-xs text-red-500 dark:text-red-400 ml-2">{error}</span>
      )}
    </div>
  );
}

export default ResponseRating;