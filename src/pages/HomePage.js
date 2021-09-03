import React, { useState } from 'react';
import styled from 'styled-components';
import { useMedia } from 'react-use';

// components
import { AutoRow, RowBetween } from '../components/Rows'
//import { CustomRouterLink } from '../components/Links'
import Panel from '../components/Panel'
import { PageWrapper, ContentWrapper } from '../components'
import TitleSection from '../components/HomePageComponents/TitleSection'
import BattleBar from '../components/HomePageComponents/BattleBar'
import GlobalChart from '../components/Charts/GlobalChart'
import TopTokenList from '../components/Lists/TopTokenList'

import { GoFlame } from 'react-icons/go'

// contexts
import { useAllTokenData } from '../contexts/TokenData'

const ListOptions = styled(AutoRow)`
    height: 40px;
    width: 100%;
    font-size: 1.25rem;
    font-weight: 600;

    @media screen and (max-width: 640px) {
        font-size: 1rem;
    }
`

const OverviewTitle = styled.div`
    font-weight: bold;
    font-size: 1.125rem;
    color: ${({ theme }) => theme.colors.whiteBlack};
    width: 100%;
    text-align: center;
    white-space: nowrap;
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
    const allTokens = useAllTokenData()

    const below800 = useMedia("(max-width: 800px)");

    const [isGlobalChartActive, setIsGlobalChartActive] = useState(false);
    const toggleIsGlobalChartActive = () => {
        setIsGlobalChartActive(!isGlobalChartActive);
    }

    return (
        <PageWrapper>
            <ContentWrapper>
                <TitleSection />

                <BattleBar isGlobalChartActive={isGlobalChartActive} toggleIsGlobalChartActive={toggleIsGlobalChartActive} />
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
                <ListOptions style={{ marginTop: '2rem', marginBottom: '.5rem' }}>
                    <RowBetween>
                        <OverviewTitle >
                            <GoFlame /> Top Gainers Today <GoFlame />
                        </OverviewTitle>
                        {/* <CustomRouterLink to={'/tokens'}>See All</CustomRouterLink> */}
                    </RowBetween>
                </ListOptions>
                <Panel style={{ marginTop: '6px', padding: '1.125rem 0 ' }}>
                    <TopTokenList tokens={allTokens} />
                </Panel>
            </ContentWrapper>
        </PageWrapper>
    )
}


export default HomePage
