import React from "react";
import { ThemeProvider as StyledComponentsThemeProvider, createGlobalStyle } from "styled-components";

export default function ThemeProvider({ children }) {
    return (
        <StyledComponentsThemeProvider theme={theme(true, false)}>
            {children}
        </StyledComponentsThemeProvider>
    );
}

const theme = (isLightTheme, isEthTheme) => ({
        backgoundGradient: isLightTheme ? 
                "linear-gradient(144.18deg, #F2EFEF 14.55%, #CFCFCF 53.5%, rgba(223, 221, 221, 0.6) 79.04%)" :
                "linear-gradient(116.82deg, #2C2C2C 18.54%, #000000 63.86%, #2B2B2B 100%)",
        
        appDisplayBackground: 'rgba(233, 233, 233, 0.1)',

        colors: {
            mainColor: isLightTheme ? "#8AC53C" : "#6F9F2F",
        },


        isEthTheme: isEthTheme ? "block" : "none",
        isBnbTheme: !isEthTheme ? "block" : "none",

        SideNavWidth: "220px",
})

export const GlobalStyle = createGlobalStyle`
    html { font-family: 'Encode Sans Expanded', sans-serif; }
    
    html, body {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
    }
`;