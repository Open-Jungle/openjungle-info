import React from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';

// react icons
import { AiOutlineHome } from 'react-icons/ai';
import { GiSwapBag } from 'react-icons/gi';
import { FaSwimmingPool } from 'react-icons/fa';
import { BiGlobeAlt, BiRocket } from 'react-icons/bi';

// Components
import { ServiceRouterLink } from '../../Links'

const ServicesMenuWrapper = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const ServicesMenu = () => {
    return (
        <ServicesMenuWrapper>
            <ServiceRouterLink to={'/home'}>
                <AiOutlineHome /> HOME
            </ServiceRouterLink>
            <ServiceRouterLink to={'/swap'}>
                <GiSwapBag /> SWAP
            </ServiceRouterLink>
            <ServiceRouterLink to={'/liquidity'}>
                <FaSwimmingPool /> LIQUIDITY
            </ServiceRouterLink>
            <ServiceRouterLink to={'/explore'}>
                <BiGlobeAlt /> EXPLORE
            </ServiceRouterLink>
            <ServiceRouterLink to={'/launch'}>
                <BiRocket /> LAUNCH
            </ServiceRouterLink>
        </ServicesMenuWrapper>
    )
}

export default withRouter(ServicesMenu);
