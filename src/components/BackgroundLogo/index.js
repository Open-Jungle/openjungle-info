import React from 'react'
import styled from "styled-components";
import { default as ethLogo } from '../../assets/icons/eth-logo.svg';
import { default as bnbLogo } from '../../assets/icons/bnb-logo.svg';

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
    display: ${({ theme }) => (theme.isEthTheme)};
`;

const BackgroundLogoBnb = styled.img`
    height: 100%;
    display: ${({ theme }) => (theme.isBnbTheme)};
`;

const BackgroundLogo = () => {
    return (
        <BackgroundLogoWrapper>
            <BackgroundLogoBnb src={bnbLogo} type={'img/svg'}/>
            <BackgroundLogoEth src={ethLogo} type={'img/svg'}/>
        </BackgroundLogoWrapper>
    )
}

export default BackgroundLogo
