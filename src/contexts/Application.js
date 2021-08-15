import React, { createContext, useContext, useReducer, useMemo, useCallback } from 'react'

// Keys of the Application context
const BASE_CURRENCY = 'BASE_CURRENCY'; // To be usd or chain => (chain = eth or bnb)

// Update keys for the reducer
const UPDATE_BASE_CURRENCY = 'UPDATE_BASE_CURRENCY';


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
        default: {
            throw Error(`Unexpected action type in DataContext reducer: '${type}'.`);
        }
    }
}

const INITIAL_STATE = {
    BASE_CURRENCY: 'USD',
}

export default function Provider({ children }) {
    const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
    
    const updateBaseCurrency = useCallback((currency) => {
        dispatch({
            type: UPDATE_BASE_CURRENCY,
            payload: { currency }
        })
    },[])

    return (
    <ApplicationContext.Provider value={
        useMemo(() => [state, {
            updateBaseCurrency,
        }], [state, updateBaseCurrency])
    }>
      {children}
    </ApplicationContext.Provider>
  );
}

export function useBaseCurrency() {
    const [state, { updateBaseCurrency }] = useApplicationContext()
    const toggleCurrency = useCallback(() => {
        if (state[BASE_CURRENCY] !== 'USD') { updateBaseCurrency(state.chain === 'BSC' ? 'BNB' : 'ETH') } 
        else { updateBaseCurrency('USD') }
  }, [state, updateBaseCurrency])
  return [state[BASE_CURRENCY], toggleCurrency]
}