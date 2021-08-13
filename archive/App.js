import React, { useState } from "react";
import theme from "./theme";
import { ThemeProvider } from "styled-components";

import useTestData from './contexts/testData'

import BasePage from './pages/basePage'

const App = () => {

    const [isLightTheme, setIsLightTheme] = useState(true);
    const toggleLightTheme = () => { setIsLightTheme(!isLightTheme); }

    const [isEthChain, setIsEthChain] = useState(true);
    const toggleChain = () => { setIsEthChain(!isEthChain); }

    

    return (
        <ThemeProvider theme={theme(isLightTheme, isEthChain)}>
            <BasePage 
                toggleLightTheme={toggleLightTheme}
                toggleChain={toggleChain}
            />
        </ThemeProvider>
    );
};
export default App;