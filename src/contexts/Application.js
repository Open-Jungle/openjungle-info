import React, { createContext, useContext, useReducer, useMemo, useCallback } from 'react'

// constants
import { timeframeOptions } from '../constants';

// contexts
import { useSavedNetwork } from './LocalStorage';

// Keys of the Application context
const BASE_CURRENCY = 'BASE_CURRENCY'; // To be usd or chain => (chain = eth or bnb)
const TIME_FRAME = 'TIME_FRAME';

// Update keys for the reducer
const UPDATE_BASE_CURRENCY = 'UPDATE_BASE_CURRENCY';
const UPDATE_TIMEFRAME = 'UPDATE_TIMEFRAME'




const ApplicationContext = createContext();
function useApplicationContext() {
    return useContext(ApplicationContext);
}

function reducer(state, { type, payload }) {
    switch (type) {
        case UPDATE_BASE_CURRENCY: {
            const { currency } = payload;
            return { ...state, [BASE_CURRENCY]: currency }
        }
        case UPDATE_TIMEFRAME: {
        const { newTimeFrame } = payload
            return { ...state, [TIME_FRAME]: newTimeFrame }
        }
        default: {
            throw Error(`Unexpected action type in DataContext reducer: '${type}'.`);
        }
    }
}

const INITIAL_STATE = {
    BASE_CURRENCY: 'USD',
    TIME_FRAME: timeframeOptions.ALL_TIME,
}

export default function Provider({ children }) {
    const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
    
    const updateBaseCurrency = useCallback((currency) => {
        dispatch({
            type: UPDATE_BASE_CURRENCY,
            payload: { currency }
        })
    },[])

    // global time window for charts - see timeframe options in constants
    const updateTimeframe = useCallback((newTimeFrame) => {
        dispatch({
            type: UPDATE_TIMEFRAME,
            payload: { newTimeFrame },
        })
    }, [])

    return (
    <ApplicationContext.Provider value={
        useMemo(() => [state, {
            updateBaseCurrency,
            updateTimeframe
        }], [state, updateBaseCurrency, updateTimeframe])
    }>
      {children}
    </ApplicationContext.Provider>
  );
}

export function useBaseCurrency() {
    const [state, { updateBaseCurrency }] = useApplicationContext()
    const [savedSelectedNetwork] = useSavedNetwork()
    const toggleCurrency = useCallback(() => {
        if (state[BASE_CURRENCY] === 'USD') { updateBaseCurrency(savedSelectedNetwork === 'BSC_MAINNET' ? 'BNB' : 'ETH') } 
        else { updateBaseCurrency('USD') }
  }, [state, updateBaseCurrency, savedSelectedNetwork])
  return [state[BASE_CURRENCY], toggleCurrency]
}

export function useTimeframe() {
    const [state, { updateTimeframe }] = useApplicationContext()
    const activeTimeframe = state?.[TIME_FRAME]
    return [activeTimeframe, updateTimeframe]
}