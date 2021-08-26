// react basic imports
import React from "react";
import { ThemeProvider as StyledComponentsThemeProvider, createGlobalStyle } from "styled-components";

// context providers
import { useDarkModeManager, useSavedNetwork } from '../contexts/LocalStorage';

// instanciate the theme provider
export default function ThemeProvider({ children }) {
    
    // get the darkmode and selected chain setings from localStorage
    const [isDarkMode] = useDarkModeManager();
    const [selectedChain] = useSavedNetwork();

    return (
        <StyledComponentsThemeProvider theme={theme(isDarkMode, selectedChain)}>
            {children}
        </StyledComponentsThemeProvider>
    );
}

const theme = (isDarkMode, selectedChain) => {
    let isEthTheme = selectedChain === 'ETH_MAINNET' ? true : false;

    return {
        backgoundGradient: isDarkMode ? 
                "linear-gradient(116.82deg, #2C2C2C 18.54%, #000000 63.86%, #2B2B2B 100%)" :
                "linear-gradient(144.18deg, #F2EFEF 14.55%, #CFCFCF 53.5%, rgba(223, 221, 221, 0.6) 79.04%)",
        
        appDisplayBackground: 'rgba(233, 233, 233, 0.1)',
        advancedBG: isDarkMode ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.4)',

        colors: {
            mainColor: isDarkMode ?  "#8AC53C" : "#6F9F2F",
            mainHoverColor: isDarkMode ? "#6F9F2F" : "#8AC53C",
            mainColorZeroOp: isDarkMode ? 'rgba(138, 197, 60, 0)' : 'rgba(111, 159, 47, 0)',

            lightGray: isDarkMode ? "#616161" : "#919191",
            lightGray_1: isDarkMode ? "#D9D8D8" : "rgba(0,0,0,0.5)",
            lightGrayHover: isDarkMode ? "#919191" : "#616161",


            whiteBlack: isDarkMode ? '#DEDEDE' : '#323232',

            uniswapPink: '#FF007B',
            pancakeswapBlue: '#49D5DC',
        },

        isEthTheme: isEthTheme ? "block" : "none",
        isBnbTheme: !isEthTheme ? "block" : "none",

        widths: {
            SideNavWidth: "220px",
        },

        heights: {
            NavBarHeight: "60px",
        },

        paddings: {
            SideNavLeftPadding: "22%",
        },

        text1: isDarkMode ? '#fffdfa' : '#1F1F1F',
        bg3: isDarkMode ? '#40444F' : '#EDEEF2',
        bg4: isDarkMode ? '#565A69' : '#CED0D9',
        bg5: isDarkMode ? '#565A69' : '#888D9B',
        
    }
}

export const GlobalStyle = createGlobalStyle`
    html { 
        font-family: 'Encode Sans Expanded', sans-serif;
        background-color: black;
    }
    
    html, body {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
    }

    .three-line-legend {
        width: 100%;
        height: 70px;
        position: absolute;
        padding: 8px;
        font-size: 12px;
        background-color: rgba(255, 255, 255, 0.23);
        text-align: left;
        pointer-events: none;
        display: block;
        fontWeight: 500;
        left: -4px;
        top : -8px;
        background-color: transparent;
    }
`;