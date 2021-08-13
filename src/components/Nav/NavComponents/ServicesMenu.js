import React from 'react';
import styled from 'styled-components';
import { withRouter, Link as RouterLink } from 'react-router-dom';

const ServicesMenuWrapper = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const ServiceMenuItem = styled(RouterLink)`
    padding-left: 35px;
    text-decoration: none;
    font-size: 24px;
    line-height: 36px;
    font-weight: bold;
    color: #919191;
`;

const ServicesMenu = () => {
    return (
        <ServicesMenuWrapper>
            <ServiceMenuItem>HOME</ServiceMenuItem>
            <ServiceMenuItem>SWAP</ServiceMenuItem>
            <ServiceMenuItem>LIQUIDITY</ServiceMenuItem>
            <ServiceMenuItem>EXPLORE</ServiceMenuItem>
            <ServiceMenuItem>LAUNCH</ServiceMenuItem>
        </ServicesMenuWrapper>
    )
}

export default withRouter(ServicesMenu);
