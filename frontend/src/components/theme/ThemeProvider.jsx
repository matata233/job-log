import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { initVChartSemiTheme } from "@visactor/vchart-semi-theme";

// CITATION: This component was inspired by ChatGPT 4o on July 1, 2024
// The prompt used was: "How to setup a ThemeProvider component that changes the theme of the app with tailwindcss easily. The theme can be 'light', 'dark', or 'system'. If the theme is 'system', the app should use the system theme. "
// The generated code was adapted: used redux store to manage the theme state
const ThemeProvider = ({ children }) => {
  const theme = useSelector((state) => state.theme.theme);

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (theme) => {
      if (theme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
      initVChartSemiTheme({ defaultMode: theme });
    };

    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";

    if (theme === "system") {
      applyTheme(systemTheme);
    } else {
      applyTheme(theme);
    }
  }, [theme]);

  return <>{children}</>;
};

export default ThemeProvider;
