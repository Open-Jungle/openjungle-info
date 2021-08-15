import React { createContext, useContext, useReducer, useMemo, useCallback, useEffect } from 'react';

// context
import { useSavedNetwork } from "./LocalStorage";

// reducer keys
const UPDATE_SELECTED_NETWORK = "UPDATE_SELECTED_NETWORK";

const NetworkContext = createContext();
function useNetworkContext() {
    return useContext(NetworkContext);
}

function reducer(state, { type, payload }) {
    switch (type) {
        case UPDATE_SELECTED_NETWORK: {
            const { selectedNetwork } = payload;
            return { ...state, selectedNetwork };
    }
    default: {
      throw Error(`Unexpected action type in DataContext reducer: '${type}'.`);
    }
  }
}

// ============= TODO ===========