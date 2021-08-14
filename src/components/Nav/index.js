import React, { useState } from 'react';
import styled from 'styled-components';
import { useMedia } from 'react-use';

//assets and react-icons 
import FullLogo from '../../assets/jungleLogos/JungleLogoName.png';
import LeafLogo from '../../assets/jungleLogos/Leaf.png';
import { BiMenu } from 'react-icons/bi';

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
`;

// To display when the user is on desktop (screen > 1080px)
const SideNavWrapper = styled.div`
    padding-top: 85px;
    display: grid;
    grid-template-rows: 20px calc(100vh - 270px) 60px 25px 80px;
`;

// to display when the user in on mobile (screen < 1080px)
const NavBarWrapper = styled.div`
    height: ${({ theme }) => theme.heights.NavBarHeight};
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    content-align: center;
`;

// Always displays on the top left corner
const JungleLogo = styled.img`
    position: absolute;
    top: 0;
    left: 0;
    width: ${({ theme }) => theme.widths.SideNavWidth};

    @media screen and (max-width: 1080px) {
        top: 5px;
        width: auto;
        height: 50px;
    }
`;

// display when user on mobile opens the main menu on top right
const MobileNavWrapper = styled.div`
    position: absolute;
    top: ${({ theme }) => theme.heights.NavBarHeight};
    right: 0;
    width: 100vw;
    height: calc(100vh - ${({ theme }) => theme.heights.NavBarHeight});
    background: rgba(196, 196, 196, 0.01);
    backdrop-filter: blur(100px);
    z-index: 5;
    display: ${({ isActive }) => (isActive ? 'flex' : 'none')};
    justify-content: center;
`;

const MobileNavCenter = styled.div`
    padding-top: 20px;
    display: grid;
    grid-template-rows: 20px calc(100vh - 270px) 60px 25px 80px;
    width: ${({ theme }) => theme.widths.SideNavWidth};
`;

// when (screen < 1080px) always display on top right
const MobileHamburgerMenuWrapper = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    z-index: 9999;
    padding: 10px;
    cursor: pointer;
    color: ${({ theme }) => theme.colors.mainColor};
    :hover { color: ${({ theme }) => theme.colors.mainHoverColor}; }
`;

const Nav = () => {

    const below1080 = useMedia("(max-width: 1080px)");

    // for the mobile nav
    const [isMobileNavActive, setIsMobileNavActive] = useState(false);
    const toggleIsMobileNavActive = () => { setIsMobileNavActive(!isMobileNavActive); }

    return (
        <>
            <NavWrapper>
                <JungleLogo src={below1080 ? LeafLogo : FullLogo} alt={''} type={'img/png'} />
                {below1080 ? (
                    <NavBarWrapper>
                        {!isMobileNavActive && <ChainToggle />}
                        <MobileHamburgerMenuWrapper onClick={toggleIsMobileNavActive}>
                            <BiMenu size={40} />
                        </MobileHamburgerMenuWrapper>
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
                    <>
                        <MobileNavWrapper isActive={isMobileNavActive} >
                            <MobileNavCenter>
                                <SocialLinks />
                                <ServicesMenu />
                                <ChainToggle />
                                <ThemeToggle />
                                <StatusSection />
                            </MobileNavCenter>
                        </MobileNavWrapper>
                    </>
                )}
            </NavWrapper>
            
        </>
    )
}

export default Nav
