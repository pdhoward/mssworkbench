import React, { useState, useContext } from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

export const ThemeContext = React.createContext(null);

export const GlobalThemeProvider = ({ children, theme }) => {
    let defaultTheme = window.localStorage.getItem(`theme`)
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)') //this must be outside of the if clause to maintain the rule of hooks
    if (!defaultTheme) {
      defaultTheme = prefersDarkMode ? `dark` : `light`
    }

    const [currentTheme, setCurrentTheme] = useState(
        theme || defaultTheme
    );

    const saveTheme = (values) => {
        setCurrentTheme(values)
        window.localStorage.setItem(`theme`, values)
    };

    let palette = {
      type: "light"
    }

    if (currentTheme === `dark`) {
      palette = {
        type: "dark",
        primary: {
          main: "#90caf9"
        },
        secondary: {
          main: "#f48fb1"
        }
      }
    }
    const materialTheme = React.useMemo(
		() =>
		  createMuiTheme({palette}),
		[currentTheme],
	);

    return (
       <ThemeContext.Provider
          value={{ theme: currentTheme, saveTheme }}
       >
           <ThemeProvider theme={materialTheme}>
           <CssBaseline />
          {children}
          </ThemeProvider>
       </ThemeContext.Provider>
    );
 };

export const useTheme = () => {
    const context = useContext(ThemeContext)
    return context
}