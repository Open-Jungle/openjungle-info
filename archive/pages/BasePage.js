import React from 'react'
import styled, { ThemeProvider } from "styled-components";
import Sidebar from '../../components/sidebar';
import AppPanel from '../../components/appPanel';
import { default as ethLogo } from '../../assets/icons/eth-logo.svg';
import { default as bnbLogo } from '../../assets/icons/bnb-logo.svg';

const BasePageWrapper = styled.div`
    position: absolute;
    width: 100vw;
    height: 100vh;
    background: ${(props) => (props.theme.background.backgoundGradient)};
    z-index: -1;
    overflow: hidden;
`;

const BackgroundLogoWrapper = styled.div`
    opacity: 25%;
    position: absolute;
    top: 20%;
    left: 60%;
    height: 100%;

    @media screen and (max-width: 650px) {
        transform: translateX(-200px);
        height: 80%;
    }

`;

const BackgroundLogoEth = styled.img`
    height: 100%;
    display: ${(props) => (props.theme.background.isEthTheme)};
`;

const BackgroundLogoBnb = styled.img`
    height: 100%;
    display: ${(props) => (props.theme.background.isBnbTheme)};
`;

const BasePage = ({
    toggleLightTheme,
    toggleChain,
}) => {

    return (
        <BasePageWrapper>
            <BackgroundLogoWrapper>
                <BackgroundLogoBnb src={bnbLogo} type={'img/svg'}/>
                <BackgroundLogoEth src={ethLogo} type={'img/svg'}/>
            </BackgroundLogoWrapper>

            <Sidebar toggleLightTheme={toggleLightTheme} toggleChain={toggleChain} />
            <AppPanel />
        </BasePageWrapper>
    )
}

export default BasePage
