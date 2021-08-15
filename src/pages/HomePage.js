import React from 'react';
import styled from 'styled-components';

// components
import { PageWrapper, ContentWrapper } from '../components'
import TitleSection from '../components/HomePageComponents/TitleSection'


const OverviewTitle = styled.div`
    font-weight: bold;
    font-size: 36px;
    color: ${({ theme }) => theme.colors.whiteBlack};
    width: 100%;
    text-align: center;

    @media screen and (max-width: 768px) {
        font-size: 22px;
    }
`;

const HomePage = () => {
    return (
        <PageWrapper>
            <ContentWrapper>
                <TitleSection />
                <OverviewTitle>OVERVIEW</OverviewTitle>
                {/* <BattleBar /> */}
                {/* <GlobalCharts /> */}
            </ContentWrapper>
        </PageWrapper>
    )
}


export default HomePage
