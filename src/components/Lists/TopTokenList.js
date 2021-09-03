import React, { useState, useEffect, useMemo } from 'react'
import { useMedia } from 'react-use'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import { Flex, Box, Text } from 'rebass'

import { formattedNum, formattedPercent } from '../../utils'
import Row from '../Rows'
import { CustomRouterLink } from '../Links'
import TokenLogo from '../TokenLogo'
import { TOKEN_BLACKLIST } from '../../constants'

// possible sorting tags. Change is used by default
const SORT_FIELD = {
    LIQ: 'totalLiquidityUSD',
    VOL: 'oneDayVolumeUSD',
    VOL_UT: 'oneDayVolumeUT',
    SYMBOL: 'symbol',
    NAME: 'name',
    PRICE: 'priceUSD',
    CHANGE: 'priceChangeUSD',
}

const DashGrid = styled.div`
    display: grid;
    grid-gap: 1em;
    grid-template-columns: 100px 1fr 1fr;
    grid-template-areas: 'name price change';
    padding: 0 1.125rem;
    background: ${({ isTitle }) => isTitle ? "rgba(0, 0, 0, 0)" : "rgba(255, 0, 123, 0.05)"};

    > * {
        justify-content: flex-end;

        &:first-child {
            justify-content: flex-start;
            text-align: left;
            width: 100px;
        }
    }

    @media screen and (min-width: 680px) {
        display: grid;
        grid-gap: 1em;
        grid-template-columns: 180px 1fr 1fr 1fr;
        grid-template-areas: 'name symbol price change';

        > * {
            justify-content: flex-end;
            width: 100%;

            &:first-child {
                justify-content: flex-start;
            }
        }   
    }

    @media screen and (min-width: 1340px) {
        display: grid;
        grid-gap: 0.5em;
        grid-template-columns: 1.5fr 0.6fr 1fr 1fr 1fr 1fr;
        grid-template-areas: 'name symbol price liq vol change';
    }
`;

const Arrow = styled.div`
    color: ${({ theme }) => theme.colors.mainColor};
    opacity: ${(props) => (props.faded ? 0.3 : 1)};
    padding: 0 20px;
    user-select: none;
    
    :hover {
        cursor: pointer;
    }
`;

const PageButtons = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 2em;
    margin-bottom: 2em;
`;

const ListWrapper = styled.div``;
const List = styled(Box)``;

const ClickableText = styled(Text)`
    text-align: end;
    user-select: none;
    color: ${({ theme }) => theme.text1} !important;

    &:hover {
        cursor: pointer;
        opacity: 0.6;
    }
    
    @media screen and (max-width: 640px) {
        font-size: 0.85rem;
    }
`;

const DataText = styled(Flex)`
    align-items: center;
    text-align: center;
    color: ${({ theme }) => theme.text1} !important;

    & > * { font-size: 14px; }

    @media screen and (max-width: 600px) {
        font-size: 12px;
    }
`;

const Divider = styled(Box)`
    height: 1px;
    background-color: ${({ theme }) => theme.colors.divider};
`;

const PageText = styled.div`
    font-weight: 400;
    font-size: 14px;
    color: ${({ theme }) => theme.text1};
`;

function TopTokenList({ tokens, itemMax = 10, useTracked = false }) {
    // page state
    const [page, setPage] = useState(1)
    const [maxPage, setMaxPage] = useState(1)

    // sorting
    const [sortDirection, setSortDirection] = useState(true)
    const [sortedColumn, setSortedColumn] = useState(SORT_FIELD.CHANGE)

    //const below1080 = useMedia('(max-width: 1080px)')
    const below1340 = useMedia('(max-width: 1340px)')
    const below680 = useMedia('(max-width: 680px)')

    const formattedTokens = useMemo(() => {
        return ( tokens && Object.keys(tokens).filter((key) => {
            return !TOKEN_BLACKLIST.includes(key)
        }).map((key) => tokens[key]))
    }, [tokens])

    useEffect(() => {
        if (tokens && formattedTokens) {
            let extraPages = 1
            if (tokens.length % itemMax === 0) { extraPages = 0 }
            setMaxPage(Math.floor(formattedTokens.length / itemMax) + extraPages - 1)
        }
    }, [tokens, formattedTokens, itemMax])

    const filteredList = useMemo(() => {return (formattedTokens && formattedTokens.sort((a, b) => {
        if (sortedColumn === SORT_FIELD.SYMBOL || sortedColumn === SORT_FIELD.NAME) {
            return a[sortedColumn] > b[sortedColumn] ? (sortDirection ? -1 : 1) * 1 : (sortDirection ? -1 : 1) * -1
        }
        return parseFloat(a[sortedColumn]) > parseFloat(b[sortedColumn])
            ? (sortDirection ? -1 : 1) * 1
            : (sortDirection ? -1 : 1) * -1
        })
        .slice(itemMax * (page - 1), page * itemMax)
    )}, [formattedTokens, itemMax, page, sortDirection, sortedColumn])

    const ListItem = ({ item, index }) => { return (
        <DashGrid style={{ height: '48px' }} focus={true}>
            <DataText area="name" fontWeight="500">
                <Row>
                    {!below680 && <div style={{ marginRight: '1rem', width: '10px' }}>{index}</div>}
                    <TokenLogo address={item.id} />
                    <CustomRouterLink style={{ marginLeft: '16px', whiteSpace: 'nowrap' }} to={'/token/' + item.id}>
                        {below680 ? item.symbol : item.name}
                        {/* <FormattedName
                            text={below680 ? item.symbol : item.name}
                            maxCharacters={below600 ? 8 : 16}
                            adjustSize={true}
                            link={true}
                        /> */}
                    </CustomRouterLink>
                </Row>
            </DataText>
            {!below680 && (
                <DataText area="symbol" color="text" fontWeight="500">
                    {item.symbol}
                    {/* <FormattedName text={item.symbol} maxCharacters={5} /> */}
                </DataText>
            )}
            <DataText area="price" color="text" fontWeight="500"> {formattedNum(item.priceUSD, true)}</DataText>
            {!below1340 && <DataText area="vol">{formattedNum(item.oneDayVolumeUSD, true)}</DataText>}
            {!below1340 && <DataText area="liq">{formattedNum(item.totalLiquidityUSD, true)}</DataText>}
            <DataText area="change">{formattedPercent(item.priceChangeUSD)}</DataText>
        </DashGrid>
    )}

    return (
        <ListWrapper>
            <DashGrid center={true} style={{ height: 'fit-content', padding: '0 1.125rem 1rem 1.125rem' }} isTitle={true}>
                <Flex alignItems="center" justifyContent="flexStart">
                    <ClickableText
                        color="text"
                        area="name"
                        fontWeight="500"
                        onClick={(e) => {
                            setSortedColumn(SORT_FIELD.NAME)
                            setSortDirection(sortedColumn !== SORT_FIELD.NAME ? true : !sortDirection)
                        }}
                    >
                        {below680 ? 'Symbol' : 'Name'} {sortedColumn === SORT_FIELD.NAME ? (!sortDirection ? '↑' : '↓') : ''}
                    </ClickableText>
                </Flex>
                {!below680 && (
                    <Flex alignItems="center">
                        <ClickableText
                            area="symbol"
                            onClick={() => {
                                setSortedColumn(SORT_FIELD.SYMBOL)
                                setSortDirection(sortedColumn !== SORT_FIELD.SYMBOL ? true : !sortDirection)
                            }}
                        >
                            Symbol {sortedColumn === SORT_FIELD.SYMBOL ? (!sortDirection ? '↑' : '↓') : ''}
                        </ClickableText>
                    </Flex>
                )}

                <Flex alignItems="center">
                    <ClickableText
                        area="price"
                        onClick={(e) => {
                            setSortedColumn(SORT_FIELD.PRICE)
                            setSortDirection(sortedColumn !== SORT_FIELD.PRICE ? true : !sortDirection)
                        }}
                    >
                        Price {sortedColumn === SORT_FIELD.PRICE ? (!sortDirection ? '↑' : '↓') : ''}
                    </ClickableText>
                </Flex>
                
                {!below1340 && (
                    <Flex alignItems="center">
                        <ClickableText
                            area="liq"
                            onClick={(e) => {
                                setSortedColumn(SORT_FIELD.LIQ)
                                setSortDirection(sortedColumn !== SORT_FIELD.LIQ ? true : !sortDirection)
                            }}
                        >
                            Liquidity {sortedColumn === SORT_FIELD.LIQ ? (!sortDirection ? '↑' : '↓') : ''}
                        </ClickableText> 
                    </Flex>
                )}
                {!below1340 && (
                    <Flex alignItems="center">
                        <ClickableText
                            area="vol"
                            onClick={() => {
                                setSortedColumn(useTracked ? SORT_FIELD.VOL_UT : SORT_FIELD.VOL)
                                setSortDirection(sortedColumn !== (useTracked ? SORT_FIELD.VOL_UT : SORT_FIELD.VOL) ? true : !sortDirection)
                            }}
                        >
                            Volume (24hrs) {sortedColumn === (useTracked ? SORT_FIELD.VOL_UT : SORT_FIELD.VOL) ? (!sortDirection ? '↑' : '↓') : ''}
                        </ClickableText>
                    </Flex>
                )}
                <Flex alignItems="center">
                    <ClickableText
                        area="change"
                        onClick={(e) => {
                            setSortedColumn(SORT_FIELD.CHANGE)
                            setSortDirection(sortedColumn !== SORT_FIELD.CHANGE ? true : !sortDirection)
                        }}
                    >
                        Change (24hrs) {sortedColumn === SORT_FIELD.CHANGE ? (!sortDirection ? '↑' : '↓') : ''}
                    </ClickableText>
                </Flex>
            </DashGrid>
            <Divider />
            <List p={0}>
                {filteredList && filteredList.map((item, index) => {
                    return (
                        <div key={index}>
                            <ListItem key={index} index={(page - 1) * itemMax + index + 1} item={item} />
                            <Divider />
                        </div>
                    )
                })}
            </List>
            <PageButtons>
                <div onClick={() => setPage(page === 1 ? page : page - 1)}>
                    <Arrow faded={page === 1 ? true : false}>←</Arrow>
                </div>
                <PageText>{'Page ' + page + ' of ' + maxPage}</PageText>
                <div onClick={() => setPage(page === maxPage ? page : page + 1)}>
                    <Arrow faded={page === maxPage ? true : false}>→</Arrow>
                </div>
            </PageButtons>
        </ListWrapper>
    )
}

export default withRouter(TopTokenList)