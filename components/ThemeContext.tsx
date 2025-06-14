import React, { createContext, useContext, useState, ReactNode } from "react";
import { useColorScheme as useSystemColorScheme } from "react-native";

// Tipos de tema
export type ThemeType = "light" | "dark";

interface ThemeContextProps {
  theme: ThemeType;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemTheme = useSystemColorScheme() ?? "light";
  const [theme, setTheme] = useState<ThemeType>(systemTheme);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context)
    throw new Error("useThemeContext must be used within ThemeProvider");
  return context;
}
