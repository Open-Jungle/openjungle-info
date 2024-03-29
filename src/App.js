import React from "react";
import styled from "styled-components";
import { Switch, Route, Redirect } from 'react-router-dom';

// == pages ==
import HomePage from './pages/HomePage'

// == components ==
import Nav from "./components/Nav"
import BackgroundLogo from "./components/BackgroundLogo"

const AppWrapper = styled.div`
    position: relative;
    width: 100%;
    min-height: 100vh;
    background: ${({ theme }) => theme.backgoundGradient};
    overflow: hidden;
    z-index: 0;
`;

const ContentWrapper = styled.div`
    display: grid;
    grid-template-columns: ${({ theme }) => theme.widths.SideNavWidth} 1fr; 

    @media screen and (max-width: 1080px) {
        grid-template-columns: 1fr;
        max-width: 100vw;
        overflow: hidden;
        grid-gap: 0;
    }
`;

const AppDisplay = styled.div`
    height: 100%;
    width: 100%;
    min-height: 100vh;
    transition: width 0.25s ease;
    background: ${({ theme }) => theme.appDisplayBackground};

    @media screen and (max-width: 1080px) {
        min-height: calc(100vh - ${({ theme }) => theme.heights.NavBarHeight});
    }
`

const LayoutWrapper = ({ children }) => {
    return (
        <ContentWrapper>
            <Nav />
            <BackgroundLogo />
            <AppDisplay>{children}</AppDisplay>
        </ContentWrapper>
    ); 
};

const App = () => {
    return (
        <AppWrapper>
            <Switch>
                <Route path="/home">
                    <LayoutWrapper>
                        <HomePage />
                    </LayoutWrapper>
                </Route>
                <Redirect to="/home" />
            </Switch>
        </AppWrapper>
    );
};
export default App;