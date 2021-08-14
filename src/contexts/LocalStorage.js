// react basic import
import React, { createContext, useContext, useReducer, useMemo, useCallback, useEffect } from 'react';

// Main storage key
const JUNGLE = 'JUNGLE'; // main storage key (head)

// Updatable storage keys
const DARK_MODE = 'DARK_MODE';
const ETH_CHAIN = 'ETH_CHAIN';
const UPDATABLE_KEYS = [DARK_MODE, ETH_CHAIN];

// Reducer keys
const UPDATE_KEY = 'UPDATE_KEY';

// Instanciate the new context and its useHook
const LocalStorageContext = createContext();
function useLocalStorageContext() {
    return useContext(LocalStorageContext);
}

// Reducer for the local storage context, Only possible type is: UPDATE_KEY where payload is { key, value }
function reducer(state, { type, payload }) {
    switch (type) {
        case UPDATE_KEY: {
            const { key, value } = payload;
            // Check that the payload.key matches at leat one updatatble key, if yes then update it
            if (!UPDATABLE_KEYS.some((k) => k === key)) { throw Error(`Unexpected key in LocalStorageContext reducer: '${key}'.`); }
            else { return { ...state, [key]: value } }
        }
        default: {
            // this should not happen. If you are here, the reducer call has a wrong type arg
            throw Error(`Unexpected action type in LocalStorageContext reducer: '${type}'.`);
        }
    } 
}

// function to instanciate the value from storage or create default ones
function init() {
    const defaultValues = {
        [DARK_MODE]: true,
        [ETH_CHAIN]: true,
    }

    try { 
        // try to read data from the storages main key
        const parsedStorageData = JSON.parse(window.localStorage.getItem(JUNGLE));
        return { ...defaultValues, ...parsedStorageData };
    } 
    catch { 
        // if no data in the local storage, return the default storage values
        return defaultValues;
    }
}

// Build the context provider using the reducer and init fct
export default function Provider({ children }) {
    // init the values and create the dispatch
    const [state, dispatch] = useReducer(reducer, undefined, init);

    const updateKey = useCallback((key, value) => {
        dispatch({ type: UPDATE_KEY, payload: {key, value}});
    }, [])

    return (
        // useMemo will prevent updateKey if argments didnt change
        <LocalStorageContext.Provider value={useMemo(() => [state, { updateKey }], [state, updateKey])}>
            {children}
        </LocalStorageContext.Provider>
    )
}

// Updater to store the data in local storage everytime their state changes
export function Updater() {
    // get the states of the local storage context
    const [state] = useLocalStorageContext();

    // with a use effect, listen tot he states and fire on change
    useEffect(() => { window.localStorage.setItem(JUNGLE, JSON.stringify({ ...state }))});

    // return null to render nothing
    return null;
}

// custom hook to work with darkmode theme
export function useDarkModeManager() {
    // Extract the value of the darkmode storage key
    const [state, { updateKey }] = useLocalStorageContext();
    let isDarkMode = state[DARK_MODE];

    // create function to toggle the dark mode
    const toggleDarkMode = useCallback(() => {
        updateKey(DARK_MODE, !isDarkMode);
    },[updateKey, isDarkMode]);

    // return the value of darkmode and its toggle fct
    return [isDarkMode, toggleDarkMode];
}