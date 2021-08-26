import React, { useState } from 'react';
import styled from 'styled-components';
import { useMedia } from 'react-use';

// components
import Panel from '../components/Panel'
import { PageWrapper, ContentWrapper } from '../components'
import TitleSection from '../components/HomePageComponents/TitleSection'
import BattleBar from '../components/HomePageComponents/BattleBar'
import GlobalChart from '../components/Charts/GlobalChart'


const OverviewTitle = styled.div`
    font-weight: bold;
    font-size: 22px;
    color: ${({ theme }) => theme.colors.whiteBlack};
    width: 100%;
    text-align: center;

    @media screen and (max-width: 768px) {
        font-size: 16px;
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

    const [isGlobalChartActive, setIsGlobalChartActive] = useState(false);
    const toggleIsGlobalChartActive = () => {
        setIsGlobalChartActive(!isGlobalChartActive);
    }

    return (
        <PageWrapper>
            <ContentWrapper>
                <TitleSection />
                <OverviewTitle>TOP DECENTRALIZED EXCHANGES</OverviewTitle>
                <BattleBar toggleIsGlobalChartActive={toggleIsGlobalChartActive} />
                {isGlobalChartActive ? 
                    <>
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
                    </>:<></>
                }
            </ContentWrapper>
        </PageWrapper>
    )
}


export default HomePage
