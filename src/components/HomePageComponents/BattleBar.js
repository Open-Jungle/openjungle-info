import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import { formattedNum } from '../../utils'
import { ChevronDown, ChevronUp } from 'react-feather'
import { StyledIcon } from '..'

import { useBattleBarData } from '../../contexts/GlobalData'

import { default as Pancake } from '../../assets/icons/pancakeswap-cake-logo.svg'
import { default as Uniswap } from '../../assets/icons/uniswap-uni-logo.svg'

const BattleBarWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
`;

const LiquidityWrapper = styled.div`
    width: 75%;
    margin: auto;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    transform: translateY(25px);

    @media screen and (max-width: 768px) {
        width: 65%;
        transform: translateY(12px);

    }
`;

const Liquidity = styled.div`   
    font-weight: bold;
    font-size: 24px;
    color: ${({ theme }) => theme.colors.lightGray_1};

    @media screen and (max-width: 768px) {
        font-size: 16px;
    }
`;

const BarWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
`;

const LogoCircle = styled.div`
    min-height: 80px;
    min-width: 80px;
    border-radius: 50%;
    background: ${({ theme, dex }) => dex === 'uniswap' ? theme.colors.uniswapPink : theme.colors.pancakeswapBlue};
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    transform: ${({ dex }) => dex === 'uniswap' ? 'translateX(-4px)' : 'translateX(4px)' };

    @media screen and (max-width: 768px) {
        min-height: 40px;
        min-width: 40px;
    }
`;

const Bar = styled.div`
    width: 80%;
    display: flex;
    flex-direction: row;
    justify-content: left;
    align-items: center;
`;

const PercentBar = styled.div`
    background: ${({ theme, dex }) => dex === 'uniswap' ? theme.colors.uniswapPink : theme.colors.pancakeswapBlue};
    height: 25px;
    width: ${({ width }) => width }%;

    @media screen and (max-width: 768px) {
        height: 12px;
    }
`;

const DexLogo = styled.img`
    height: 60px;

    @media screen and (max-width: 768px) {
        height: 30px;
    }
`;

const ShowChartButtonWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
`;

const ShowChartButton = styled.div`
    cursor: pointer;
    display: flex;
    flex-direction: row;
    justify-content: center;
    color: ${({ theme }) => theme.text1}
`;

const ArrowDownStyled = styled(ChevronDown)`
    height: 20px;
    width: 20px;
    margin-left: 6px;
`;

const ArrowUpStyled = styled(ChevronUp)`
    height: 20px;
    width: 20px;
    margin-left: 6px;
`;

const BattleBar = ({ isGlobalChartActive, toggleIsGlobalChartActive }) => {
    const [chartDataDailyUniswap, chartDataDailyPancakeswap] = useBattleBarData();
    const [uniswapTotalLiquidityUSD, setUniswapTotalLiquidityUSD] = useState();
    const [pancakeswapTotalLiquidityUSD, setPancakeswapTotalLiquidityUSD] = useState();
    const [sumOfLiquidityUSD,  setSumOfLiquidityUSD] = useState();

    useEffect(()=>{
        let uniswapLiquUSD = chartDataDailyUniswap && chartDataDailyUniswap[chartDataDailyUniswap.length - 1].totalLiquidityUSD;
        let pancakeswapLiquUSD = chartDataDailyPancakeswap && chartDataDailyPancakeswap[chartDataDailyPancakeswap.length - 1].totalLiquidityUSD;
        setUniswapTotalLiquidityUSD(uniswapLiquUSD);
        setPancakeswapTotalLiquidityUSD(pancakeswapLiquUSD);
        setSumOfLiquidityUSD(parseInt(uniswapLiquUSD) + parseInt(pancakeswapLiquUSD))
    },[chartDataDailyUniswap, chartDataDailyPancakeswap, setPancakeswapTotalLiquidityUSD, setUniswapTotalLiquidityUSD])

    return (
        <>
            {uniswapTotalLiquidityUSD && pancakeswapTotalLiquidityUSD && sumOfLiquidityUSD && 
                <BattleBarWrapper>
                    <LiquidityWrapper>
                        <Liquidity>
                            {formattedNum(pancakeswapTotalLiquidityUSD, true)}
                        </Liquidity>
                        <Liquidity>
                            {formattedNum(uniswapTotalLiquidityUSD, true)}
                        </Liquidity>
                    </LiquidityWrapper>
                    <BarWrapper>
                        <LogoCircle dex={'pancakeswap'}>
                            <DexLogo src={Pancake} />
                        </LogoCircle>
                        <Bar>
                            <PercentBar dex={'pancakeswap'} width={pancakeswapTotalLiquidityUSD / sumOfLiquidityUSD * 100}/>
                            <PercentBar dex={'uniswap'} width={uniswapTotalLiquidityUSD / sumOfLiquidityUSD * 100} />
                        </Bar>
                        <LogoCircle dex={'uniswap'}>
                            <DexLogo src={Uniswap} />
                        </LogoCircle>
                    </BarWrapper>
                    <ShowChartButtonWrapper>
                        <ShowChartButton onClick={toggleIsGlobalChartActive}>
                            Global Chart
                            <StyledIcon>
                                {isGlobalChartActive? <ArrowUpStyled /> : <ArrowDownStyled />}
                            </StyledIcon>
                        </ShowChartButton>
                    </ShowChartButtonWrapper>
                </BattleBarWrapper>
            }
        </>
    )
}

export default BattleBar
