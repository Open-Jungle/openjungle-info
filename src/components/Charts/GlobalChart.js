import React, { useRef, useEffect, useState } from 'react'
import { ResponsiveContainer } from 'recharts'
import TradingviewChart, { CHART_TYPES } from './TradingviewChart'

const GlobalChart = ({ display }) => {

    const ref = useRef()
    const isClient = typeof window === 'object'
    const [width, setWidth] = useState(ref?.current?.container?.clientWidth)
    useEffect(() => {
        if (!isClient) { return false }
        function handleResize() { setWidth(ref?.current?.container?.clientWidth ?? width) }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [isClient, width])

    return (
        <ResponsiveContainer aspect={60 / 28}>
            <TradingviewChart 
                data={[
                    {'date': 2345000000, 'dailyVolumeUSD': '123123123123'},
                ]}
                base={67890}
                baseChange={12}
                title={display}
                field="totalLiquidityUSD"
                width={width}
                type={display === 'liquidity' ? CHART_TYPES.AREA : CHART_TYPES.BAR } 
            />
        </ResponsiveContainer>
    )
}

export default GlobalChart
