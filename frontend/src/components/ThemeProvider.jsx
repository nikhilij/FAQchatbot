import { ThemeContext } from "../contexts/ThemeContext";

export function ThemeProvider({ children }) {
  return <ThemeContext.Provider value={{ darkMode: false }}>{children}</ThemeContext.Provider>;
}
