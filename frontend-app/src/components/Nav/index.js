import React from 'react';
import styled from 'styled-components';
import { useMedia } from 'react-use';

//assets
import FullLogo from '../../assets/jungleLogos/JungleLogoName.png';
import LeafLogo from '../../assets/jungleLogos/Leaf.png';

//components
import ThemeToggle from '../ThemeToggle';

const NavWrapper = styled.div`
    position: sticky;
    top: 0px;
    z-index: 9999;
`;

const SideNavWrapper = styled.div`
    padding-top: 200px;

`;

const NavBarWrapper = styled.div`
    height: 60px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    content-align: center;

`;

const MobileNavWrapper = styled.div`

`;

const JungleLogo = styled.img`
    position: absolute;
    top: 0;
    left: 0;
    width: ${({ theme }) => theme.SideNavWidth};

    @media screen and (max-width: 1080px) {
        top: 5px;
        width: auto;
        height: 50px;
    }
`;

const Nav = () => {

    const below1080 = useMedia("(max-width: 1080px)");

    const isMobileNavActive = false;

    return (
        <>
            <NavWrapper>
                <JungleLogo src={below1080 ? LeafLogo : FullLogo} alt={''} type={'img/png'} />
                {below1080 ? (
                    <NavBarWrapper>

                    </NavBarWrapper>
                ) : (
                   <SideNavWrapper>
                        <ThemeToggle />
                    </SideNavWrapper> 
                )}
                
                {isMobileNavActive && (
                    <MobileNavWrapper>
                    </MobileNavWrapper>
                )}
            </NavWrapper>
            
        </>
    )
}

export default Nav
