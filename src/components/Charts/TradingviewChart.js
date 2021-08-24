import React, { useState, useEffect, useRef } from 'react'
import { createChart } from 'lightweight-charts'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import styled from 'styled-components'
import { usePrevious } from 'react-use'
import { Play } from 'react-feather'
import { formattedNum } from '../../utils'
import { useDarkModeManager } from '../../contexts/LocalStorage'

dayjs.extend(utc)

export const CHART_TYPES = {
    BAR: 'BAR',
    AREA: 'AREA',
}

export const IconWrapper = styled.div`
    position: absolute;
    right: 0;
    border-radius: 3px;
    height: 16px;
    width: 16px;
    padding: 0px;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme.colors.whiteBlack};

    :hover {
        cursor: pointer;
        opacity: 0.7;
    }
`;

const Wrapper = styled.div`
  position: relative;
`

// constant height for charts
const HEIGHT = 300

const TradingViewChart = ({ type, data, base, baseChange, field, title, width, useWeekly = true }) => {
    // reference for DOM element to create with chart
    const ref = useRef()

    // pointer to the chart object
    const [chartCreated, setChartCreated] = useState(false)
    const dataPrev = usePrevious(data)

    useEffect(() => {
        if (data !== dataPrev && chartCreated && type === CHART_TYPES.BAR) {
            // remove the tooltip element
            let tooltip = document.getElementById('tooltip-id' + type)
            let node = document.getElementById('test-id' + type)
            node.removeChild(tooltip)
            chartCreated.resize(0, 0)
            setChartCreated()
        }
    }, [chartCreated, data, dataPrev, type])

    // parese the data and format for tardingview consumption
    const formattedData = data?.map((entry) => {
        return {
            time: dayjs.unix(entry.date).utc().format('YYYY-MM-DD'),
            value: parseFloat(entry[field]),
        }
    })


    // adjust the scale based on the type of chart
    const topScale = type === CHART_TYPES.AREA ? 0.32 : 0.2

    const [darkMode] = useDarkModeManager()
    const textColor = darkMode ? 'white' : 'black'
    const previousTheme = usePrevious(darkMode)

    // reset the chart if theme switches
    useEffect(() => {
        if (chartCreated && previousTheme !== darkMode) {
            // remove the tooltip element
            let tooltip = document.getElementById('tooltip-id' + type)
            let node = document.getElementById('test-id' + type)
            node.removeChild(tooltip) // NOTE: if you want more than one area chart you need better tooltip ids
            chartCreated.resize(0, 0)
            setChartCreated()
        }
    }, [chartCreated, darkMode, previousTheme, type])

    // if no chart created yet, create one with options and add to DOM manually
    useEffect(() => {
        if (!chartCreated && formattedData) {

            console.log('creating chart '+ type)

            var chart = createChart(ref.current, {
                width: width,
                height: HEIGHT,
                layout: {
                    backgroundColor: 'transparent',
                    textColor: textColor,
                },

                rightPriceScale: {
                    scaleMargins: {
                        top: topScale,
                        bottom: 0,
                    },
                    borderVisible: false,
                },
                
                timeScale: {
                    borderVisible: false,
                },
                
                grid: {
                    horzLines: {
                        color: 'rgba(197, 203, 206, 0.5)',
                        visible: false,
                    },
                    vertLines: {
                        color: 'rgba(197, 203, 206, 0.5)',
                        visible: false,
                    },
                },
        
                crosshair: {
                    horzLine: {
                        visible: false,
                        labelVisible: false,
                    },
                    vertLine: {
                        visible: true,
                        style: 0,
                        width: 2,
                        color: 'rgba(32, 38, 46, 0.1)',
                        labelVisible: false,
                    },
                },
                
                localization: {
                    priceFormatter: (val) => formattedNum(val, true),
                },
            })

            var series = (type === CHART_TYPES.BAR ? 
                chart.addHistogramSeries({
                    color: '#8AC53C',
                    priceFormat: { type: 'volume' },
                    scaleMargins: {
                        top: 0.32,
                        bottom: 0,
                    },
                    lineColor: '#8AC53C',
                    lineWidth: 3,
                }): 
                chart.addAreaSeries({
                    topColor: '#8AC53C',
                    bottomColor: 'rgba(138, 197, 60, 0)',
                    lineColor: '#8AC53C',
                    lineWidth: 3,
                })
            )

            
            try{ series.setData(formattedData) }
            catch (e) { 
                console.log(`chart create ${type} failled`)
                console.log(formattedData)
                console.log(data)
            }
            
            // create the tooltip
            var toolTip = document.createElement('div')
            toolTip.setAttribute('id', 'tooltip-id' + type)
            toolTip.className = 'three-line-legend'
            toolTip.style.color = darkMode ? 'white' : '#20262E'
            ref.current.appendChild(toolTip)

            // format numbers
            let percentChange = baseChange?.toFixed(2)
            let formattedPercentChange = (percentChange > 0 ? '+' : '') + percentChange + '%'
            let color = percentChange >= 0 ? 'green' : 'red'

            // set the title of the chart
            function setLastBarText() { toolTip.innerHTML = 
                `<div style="font-size: 16px; margin: 4px 0px; color: ${textColor};">
                    ${title} ${ type === CHART_TYPES.BAR && !useWeekly ? '(24hr)' : ''}
                </div>
                <div style="font-size: 22px; margin: 4px 0px; color:${textColor}" >` +
                    formattedNum(base ?? 0, true) + `<span style="margin-left: 10px; font-size: 16px; color: ${color};">${formattedPercentChange}</span>
                </div>`
            }
            setLastBarText()

            // update the title when hovering on the chart
            chart.subscribeCrosshairMove(function (param) {
                if (
                    param === undefined ||
                    param.time === undefined ||
                    param.point.x < 0 ||
                    param.point.x > width ||
                    param.point.y < 0 ||
                    param.point.y > HEIGHT
                ) { setLastBarText() } 
                else {
                    let dateStr = useWeekly ? 
                            dayjs(param.time.year + '-' + param.time.month + '-' + param.time.day).startOf('week').format('MMMM D, YYYY') + '-' 
                            + dayjs(param.time.year + '-' + param.time.month + '-' + param.time.day).endOf('week').format('MMMM D, YYYY')
                        : 
                            dayjs(param.time.year + '-' + param.time.month + '-' + param.time.day).format('MMMM D, YYYY');

                    var price = param.seriesPrices.get(series)

                    toolTip.innerHTML = (
                        `<div style="font-size: 16px; margin: 4px 0px; color: ${textColor};">
                            ${title}
                        </div>` +
                        `<div style="font-size: 22px; margin: 4px 0px; color: ${textColor}">` +
                            formattedNum(price, true) +
                        '</div>' +
                        '<div>' +
                            dateStr +
                        '</div>'
                    )
                }
            })

            chart.timeScale().fitContent()

            setChartCreated(chart)
        }
    }, [base, baseChange, chartCreated, darkMode, data, formattedData, textColor, title, topScale, type, useWeekly, width])

    // responsiveness
    useEffect(() => {
        if (width) {
            chartCreated && chartCreated.resize(width, HEIGHT);
            chartCreated && chartCreated.timeScale().scrollToPosition(0);
        }
    }, [chartCreated, width])

    return (
        <Wrapper>
            <div ref={ref} id={'test-id' + type} />
            <IconWrapper>
                <Play onClick={() => { chartCreated && chartCreated.timeScale().fitContent() }}/>
            </IconWrapper>
        </Wrapper>
    )
}

export default TradingViewChart
