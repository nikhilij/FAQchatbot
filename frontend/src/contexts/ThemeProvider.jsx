import React from "react";
import { ThemeContext } from "./ThemeContext";

export const ThemeProvider = ({ children }) => {
  // Always light mode, no dark mode logic
  return (
    <ThemeContext.Provider value={{ darkMode: false, toggleDarkMode: () => {} }}>{children}</ThemeContext.Provider>
  );
};
