import React, { createContext, useContext, useReducer, useMemo, useCallback } from 'react'

// Keys of the Application context
const BASE_CURRENCY = 'BASE_CURRENCY'; // To be usd or chain => (chain = eth or bnb)
const SELECTED_CHAIN = 'SELECTED_CHAIN';

// Update keys for the reducer
const UPDATE_BASE_CURRENCY = 'UPDATE_BASE_CURRENCY';
const UPDATE_SELECTED_CHAIN = 'UPDATE_SELECTED_CHAIN';


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
        case UPDATE_SELECTED_CHAIN: {
            const { chain } = payload;
            return { ...state, [SELECTED_CHAIN]: chain }
        }
        default: {
            throw Error(`Unexpected action type in DataContext reducer: '${type}'.`);
        }
    }
}

const INITIAL_STATE = {
    BASE_CURRENCY: 'USD',
    SELECTED_CHAIN: 'ETH',
}

export default function Provider({ children }) {
    const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
    
    const updateBaseCurrency = useCallback((currency) => {
        dispatch({
            type: UPDATE_BASE_CURRENCY,
            payload: { currency }
        })
    },[])

    const updateSelectedChain = useCallback((chain)=>{
        dispatch({
            type: UPDATE_SELECTED_CHAIN,
            payload: { chain }
        })
    },[])

    return (
    <ApplicationContext.Provider value={
        useMemo(() => [state, {
            updateBaseCurrency,
            updateSelectedChain
        }], [state, updateBaseCurrency, updateSelectedChain])
    }>
      {children}
    </ApplicationContext.Provider>
  );
}

export function useSelectedChain() {
    const [state, { updateSelectedChain }] = useApplicationContext();
    const toggleChain = useCallback(() => {
        if (state[SELECTED_CHAIN] === 'ETH') { updateSelectedChain('BSC') }
        else { updateSelectedChain('ETH') }
    }, [state, updateSelectedChain])
    return [state[SELECTED_CHAIN], toggleChain]
}

export function useBaseCurrency() {
    const [state, { updateBaseCurrency }] = useApplicationContext()
    const toggleCurrency = useCallback(() => {
        if (state[BASE_CURRENCY] !== 'USD') { updateBaseCurrency(state.chain === 'BSC' ? 'BNB' : 'ETH') } 
        else { updateBaseCurrency('USD') }
  }, [state, updateBaseCurrency])
  return [state[BASE_CURRENCY], toggleCurrency]
}