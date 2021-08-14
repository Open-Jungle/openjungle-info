import React from 'react';
import styled from 'styled-components';
import { withRouter, Link as RouterLink } from 'react-router-dom';

// react icons
import { AiOutlineHome } from 'react-icons/ai';
import { GiSwapBag } from 'react-icons/gi';
import { FaSwimmingPool } from 'react-icons/fa';
import { BiGlobeAlt, BiRocket } from 'react-icons/bi';

const ServicesMenuWrapper = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const ServiceMenuItem = styled(RouterLink)`
    padding-left: ${({ theme }) => theme.paddings.SideNavLeftPadding};
    text-decoration: none;
    font-size: 18px;
    line-height: 36px;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.lightGray};

    :hover {
        color: ${({ theme }) => theme.colors.lightGrayHover};
    }
`;

const ServicesMenu = () => {
    return (
        <ServicesMenuWrapper>
            <ServiceMenuItem to={'/home'}>
                <AiOutlineHome /> HOME
            </ServiceMenuItem>
            <ServiceMenuItem to={'/swap'}>
                <GiSwapBag /> SWAP
            </ServiceMenuItem>
            <ServiceMenuItem to={'/liquidity'}>
                <FaSwimmingPool /> LIQUIDITY
            </ServiceMenuItem>
            <ServiceMenuItem to={'/explore'}>
                <BiGlobeAlt /> EXPLORE
            </ServiceMenuItem>
            <ServiceMenuItem to={'/launch'}>
                <BiRocket /> LAUNCH
            </ServiceMenuItem>
        </ServicesMenuWrapper>
    )
}

export default withRouter(ServicesMenu);
