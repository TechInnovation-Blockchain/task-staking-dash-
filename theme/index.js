import React from "react";
import { ThemeProvider as StyledComponentsThemeProvider } from "styled-components";
import { useTheme } from "../contexts/ThemeContext";

export function colors(darkMode) {
  return {
    // base
    white: "#FFFFFF",
    black: "#000000",

    default: darkMode ? "#00E6CC" : "#000000",

    gray: "#8898AA",
    gray1: "#ADB5BD",
    gray2: "#6C6C6C",
    gray3: "#828282",
    gray80: "#545454",
    gray100: "#212121",
    grayLight: "#F4F4F4",

    blue60: "#005AFF",

    purple: "rgba(65, 0, 202, 1)",

    success: "#2DCE89",

    gradient1: "linear-gradient(90deg, #4100CA 0%, #224BDB 100%)",
    gradient2: "linear-gradient(90deg, #2DE4C5 0%, #224BDB 100%)",

    // backgrounds / greys
    bg1: "#212429",

    //primary colors
    primary1: "#11CDEF",

    // secondary colors
    secondary1: "#2172E5",

    // other
    red1: "#FD4040",
    pink1: "#FA00FF",
    danger: "#F5365C",
    interactive2: darkMode ? "#00E6CC" : "#7800FF",
    interactive3: darkMode ? "#00E6CC" : "#7800FF",

    text1: darkMode ? "#fff" : "#fff",
    text2: darkMode ? "#6c6c6c" : "#6c6c6c",
    text5: darkMode ? "#ABABAB" : "#ABABAB",

    link1: darkMode ? "#00E6CC" : "#7800FF",
    violet0: darkMode ? "#F3F1FF" : "#F3F1FF",
    light: darkMode ? "#F7F9FB" : "#F7F9FB",

    // default colors
    text10: darkMode ? "#ffffff" : "#000000",
    bg10: darkMode ? "#000000" : "#ffffff",

    // 2nd Jul
    greenMain: darkMode ? "#27C29D" : "#27C29D",
    greenMain08: darkMode
      ? "rgba(43, 213, 173, .08)"
      : "rgba(43, 213, 173, .08)",
    greenBuy10: darkMode ? "rgba(26, 211, 122, .1)" : "rgba(26, 211, 122, .1)",
    greenBuy: darkMode ? "#1AD37A" : "#1AD37A",
    monoBlack: darkMode ? "#030C16" : "#ffffff",
    monoWhite: darkMode ? "#ffffff" : "#030C16",
    monoWhite08: darkMode
      ? "rgba(255, 255, 255, .08)"
      : "rgba(255, 255, 255, .08)",
    monoWhite48: darkMode
      ? "rgba(255, 255, 255, .48)"
      : "rgba(255, 255, 255, .48)",
    monoWhite68: darkMode
      ? "rgba(255, 255, 255, .68)"
      : "rgba(255, 255, 255, .68)",
    monoGrey1: darkMode ? "#1A1F28" : "#FFFFFF",
    monoGrey2: darkMode ? "#2F3641" : "#2F3641",
    monoGrey4: darkMode ? "#7E848F" : "#7E848F",
    textGrey: darkMode ? "#888A8F" : "#787E85",
  };
}

export function theme(darkMode) {
  return {
    color: { ...colors(darkMode) },

    grids: {
      sm: 8,
      md: 12,
      lg: 24,
    },
  };
}

export default function ThemeProvider({ children }) {
  const { darkMode } = useTheme();

  return (
    <StyledComponentsThemeProvider theme={theme(darkMode)}>
      {children}
    </StyledComponentsThemeProvider>
  );
}
