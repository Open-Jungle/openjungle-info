import React, { useRef, useEffect, useState, useMemo } from 'react'
import styled from 'styled-components'
import { ResponsiveContainer } from 'recharts'
import TradingviewChart, { CHART_TYPES } from './TradingviewChart'
import { useGlobalChartDataUniswap, useGlobalChartDataPancakeswap } from '../../contexts/GlobalData'
import { getTimeframe } from '../../utils'
import { useTimeframe } from '../../contexts/Application'

const CHART_VIEW = {
    VOLUME: 'Volume',
    LIQUIDITY: 'Liquidity',
}

const VOLUME_WINDOW = {
    WEEKLY: 'WEEKLY',
    DAYS: 'DAYS',
}

const OptionText = styled.div`
    font-weight: 400;
    font-size: 14px;
    color: ${({ theme }) => theme.colors.mainColor}
`;

const OptionButton = styled.button`
    background-color: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: black;
    height: 100%;
    font-weight: 400;
    
    &:hover,:focus {
        background-color: rgba(255, 255, 255, 0.25);
        border-color: rgba(255, 255, 255, 0.25);
    }
    
    &:focus {
        box-shadow: 0 0 0 1pt rgba(255, 255, 255, 0.25);
    }
    
    &:active {
        background-color: rgba(255, 255, 255, 0.25);
        border-color: rgba(255, 255, 255, 0.25);
    }
`;

const Row = styled.div`
    width: 100%;
    display: flex;
    padding: 0;
    align-items: center;
    width: fit-content;
`;

const GlobalChart = ({ display }) => {
    // chart options
    const [chartView] = useState(display === 'volume' ? CHART_VIEW.VOLUME : CHART_VIEW.LIQUIDITY)

    // time window and window size for chart
    const timeWindow = useTimeframe();
    const [volumeWindow, setVolumeWindow] = useState(VOLUME_WINDOW.DAYS)

    // global historical data
    const [dailyDataUniswap, weeklyDataUniswap] = useGlobalChartDataUniswap()
    const [dailyDataPancakeswap, weeklyDataPancakeswap] = useGlobalChartDataPancakeswap()
    const weeklyVolumeChange = 0;
    const oneWeekVolume = 0;
    const liquidityChangeUSD = 3.23;
    const volumeChangeUSD = 0;
    const oneDayVolumeUSD = 0;
    const totalLiquidityUSD = 4810000000;


    // based on window, get starttime
    let utcStartTime = getTimeframe(timeWindow)

    const chartDataFilteredUniswap = useMemo(() => {
        let currentData = volumeWindow === VOLUME_WINDOW.DAYS ? dailyDataUniswap : weeklyDataUniswap
        return (
            currentData && Object.keys(currentData)?.map((key) => {
                let item = currentData[key]
                if (item.date > utcStartTime) { return item } 
                else { return true }
            })
            .filter((item) => { return !!item })
        )
    }, [dailyDataUniswap, utcStartTime, volumeWindow, weeklyDataUniswap])

    const chartDataFilteredPancakeswap = useMemo(() => {
        let currentData = volumeWindow === VOLUME_WINDOW.DAYS ? dailyDataPancakeswap : weeklyDataPancakeswap
        return (
            currentData && Object.keys(currentData)?.map((key) => {
                let item = currentData[key]
                if (item.date > utcStartTime) { return item } 
                else { return true }
            })
            .filter((item) => { return !!item })
        )
    }, [dailyDataPancakeswap, utcStartTime, volumeWindow, weeklyDataPancakeswap])
    
    const ref = useRef()
    const isClient = typeof window === 'object'
    const [width, setWidth] = useState(ref?.current?.container?.clientWidth)
    useEffect(() => {
        if (!isClient) { return false }
        function handleResize() { setWidth(ref?.current?.container?.clientWidth ?? width) }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [isClient, width])

    return chartDataFilteredUniswap ? (
        <>
            {chartDataFilteredUniswap && chartView === CHART_VIEW.LIQUIDITY && (
                <ResponsiveContainer aspect={60 / 28} ref={ref}>
                    <TradingviewChart
                        dataUniswap={dailyDataUniswap}
                        dataPancakeswap={dailyDataPancakeswap}
                        base={totalLiquidityUSD}
                        baseChange={liquidityChangeUSD}
                        title="Liquidity"
                        field="totalLiquidityUSD"
                        width={width}
                        type={CHART_TYPES.AREA}
                    />
                </ResponsiveContainer>
            )}
            {chartDataFilteredUniswap && chartView === CHART_VIEW.VOLUME && (
                <ResponsiveContainer aspect={60 / 28}>
                    <TradingviewChart
                        dataUniswap={chartDataFilteredUniswap}
                        dataPancakeswap={chartDataFilteredPancakeswap}
                        base={volumeWindow === VOLUME_WINDOW.WEEKLY ? oneWeekVolume : oneDayVolumeUSD}
                        baseChange={volumeWindow === VOLUME_WINDOW.WEEKLY ? weeklyVolumeChange : volumeChangeUSD}
                        title={volumeWindow === VOLUME_WINDOW.WEEKLY ? 'Volume (7d)' : 'Volume'}
                        field={volumeWindow === VOLUME_WINDOW.WEEKLY ? 'weeklyVolumeUSD' : 'dailyVolumeUSD'}
                        width={width}
                        type={CHART_TYPES.BAR}
                        useWeekly={volumeWindow === VOLUME_WINDOW.WEEKLY}
                        timeframe={volumeWindow}
                    />
                
                </ResponsiveContainer>
            )}
            {display === 'volume' && (
                <Row>
                    <OptionButton
                        active={volumeWindow === VOLUME_WINDOW.DAYS}
                        onClick={() => setVolumeWindow(VOLUME_WINDOW.DAYS)}
                    >
                        <OptionText>D</OptionText>
                    </OptionButton>
                    <OptionButton
                        style={{ marginLeft: '4px' }}
                        active={volumeWindow === VOLUME_WINDOW.WEEKLY}
                        onClick={() => setVolumeWindow(VOLUME_WINDOW.WEEKLY)}
                    >
                        <OptionText>W</OptionText>
                    </OptionButton>
                </Row>
            )}
    </>
    ) : ('')
}

export default GlobalChart
