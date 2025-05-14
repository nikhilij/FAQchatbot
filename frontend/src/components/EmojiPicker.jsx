import { useState, useRef, useEffect } from "react";
import Picker from "emoji-picker-react";
import { useTheme } from "../hooks/useTheme";

function EmojiPicker({ onSelect }) {
  const { darkMode } = useTheme();
  const [showPicker, setShowPicker] = useState(false);
  const buttonRef = useRef(null);
  const pickerRef = useRef(null);

  // Position picker just above the icon, slightly to the right
  const [pickerStyle, setPickerStyle] = useState({});

  useEffect(() => {
    if (showPicker && buttonRef.current) {
      // Wait for next tick to ensure DOM is ready
      setTimeout(() => {
        const rect = buttonRef.current.getBoundingClientRect();
        setPickerStyle({
          position: "fixed",
          left: rect.left + 30, // move a bit to the right
          bottom: window.innerHeight - rect.top + 8, // just above the icon
          zIndex: 9999,
          width: 320, // w-80 in px, prevents initial resize glitch
        });
      }, 0);
    }
  }, [showPicker]);

  // Keep picker open after selecting emoji
  const handleEmojiClick = (emojiObject) => {
    onSelect(emojiObject.emoji);
    // Do not close the picker after selection
  };

  // Close picker if clicked outside or Escape key is pressed
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowPicker(false);
      }
    }
    function handleEsc(event) {
      if (event.key === "Escape") {
        setShowPicker(false);
      }
    }
    if (showPicker) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEsc);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [showPicker]);

  return (
    <div className="relative">
      <button
        type="button"
        ref={buttonRef}
        onClick={() => setShowPicker((prev) => !prev)}
        className={`p-2 rounded-full transition-colors ${
          darkMode
            ? "text-gray-300 hover:text-white hover:bg-gray-700"
            : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
        }`}
        aria-label="Toggle emoji picker"
        aria-expanded={showPicker}
        title="Add emoji"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>
      {showPicker && (
        <div ref={pickerRef} style={pickerStyle} className="bg-white border border-gray-200 rounded-lg shadow-lg">
          <Picker onEmojiClick={handleEmojiClick} theme={darkMode ? "dark" : "light"} width="100%" />
        </div>
      )}
    </div>
  );
}

export default EmojiPicker;
