

const theme = (isLightTheme, isEthTheme) => {
    return {
        background: {
            backgoundGradient: isLightTheme ? 
                "linear-gradient(144.18deg, #F2EFEF 14.55%, #CFCFCF 53.5%, rgba(223, 221, 221, 0.6) 79.04%)" :
                "linear-gradient(116.82deg, #2C2C2C 18.54%, #000000 63.86%, #2B2B2B 100%)",
            isEthTheme: isEthTheme ? "block" : "none",
            isBnbTheme: !isEthTheme ? "block" : "none",
        },

        colors: {
            mainColor: isLightTheme ? "#8AC53C" : "#6F9F2F",
        },
    }
}

export default theme;