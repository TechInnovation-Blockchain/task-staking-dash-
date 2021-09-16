import React, { useContext, useState } from "react";

const Context = React.createContext({});

const Provider = ({ children }) => {
  //Dark: true, Light: false
  const [darkMode, setDarkMode] = useState(true);

  return (
    <Context.Provider
      value={{
        darkMode,
        setDarkMode,
      }}
    >
      {children}
    </Context.Provider>
  );
};
export default Context;

export const ThemeContextProvider = Provider;

export const useTheme = () => {
  return useContext(Context);
};
