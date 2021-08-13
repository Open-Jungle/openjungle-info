import React from 'react';
import styled from 'styled-components';
import { useMedia } from 'react-use';

//assets
import FullLogo from '../../assets/jungleLogos/JungleLogoName.png';
import LeafLogo from '../../assets/jungleLogos/Leaf.png';

//components
import ThemeToggle from './NavComponents/ThemeToggle';
import StatusSection from './NavComponents/StatusSection';
import ChainToggle from './NavComponents/ChainToggle';
import ServicesMenu from './NavComponents/ServicesMenu';
import SocialLinks from './NavComponents/SocialLinks';

// position all the Navs in top corner
const NavWrapper = styled.div`
    position: sticky;
    top: 0px;
    left: 0px;
    z-index: 9999;
`;

// To display when the user is on desktop (screen > 1080px)
const SideNavWrapper = styled.div`
    padding-top: 85px;
    display: grid;
    grid-template-rows: 20px calc(100vh - 270px) 60px 25px 80px;
`;

// to display when the user in on mobile (screen < 1080px)
const NavBarWrapper = styled.div`
    height: 60px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    content-align: center;

`;

// display when user on mobile opens the main menu on top right
const MobileNavWrapper = styled.div`

`;

// Always displays on the top left corner
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
                        <SocialLinks />
                        <ServicesMenu />
                        <ChainToggle />
                        <ThemeToggle />
                        <StatusSection />
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
