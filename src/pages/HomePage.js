import React from 'react';
import styled from 'styled-components';
import { useMedia } from 'react-use';

// components
import Panel from '../components/Panel'
import { PageWrapper, ContentWrapper } from '../components'
import TitleSection from '../components/HomePageComponents/TitleSection'
import GlobalChart from '../components/Charts/GlobalChart'


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

const GridRow = styled.div`
    display: grid;
    width: 100%;
    grid-template-columns: 1fr 1fr;
    column-gap: 6px;
    align-items: start;
    justify-content: space-between;
`;

const MobileChartWrapper = styled.div`
    display: grid;
    grid-auto-rows: auto;
    grid-row-gap: 24px;
    marginTop: 6px;
`;

const HomePage = () => {

    const below800 = useMedia("(max-width: 800px)");

    return (
        <PageWrapper>
            <ContentWrapper>
                <TitleSection />
                <OverviewTitle>OVERVIEW</OverviewTitle>
                {!below800 && (
                    <GridRow>
                        <Panel>
                            <GlobalChart display="liquidity" />
                        </Panel>
                        <Panel>
                            <GlobalChart display="volume" />
                        </Panel>
                    </GridRow>
                )}
                {below800 && (
                    <MobileChartWrapper>
                        <Panel>
                            <GlobalChart display="liquidity" />
                        </Panel>
                    </MobileChartWrapper>
                )}
            </ContentWrapper>
        </PageWrapper>
    )
}


export default HomePage
