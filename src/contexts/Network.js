import React, { createContext, useContext, useReducer, useMemo, useCallback } from "react";

// context
import { useSavedNetwork } from "./LocalStorage";

// reducer keys
const UPDATE_SELECTED_NETWORK = "UPDATE_SELECTED_NETWORK";

// instanciate the context
const NetworkContext = createContext();
function useNetworkContext() { return useContext(NetworkContext) }

// reducer function
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


export default function Provider({ children }) {
  const [
    previouslySelectedNetwork,
    updateSavedSelectedNetwork,
  ] = useSavedNetwork();
  const INITIAL_STATE = {
    selectedNetwork: previouslySelectedNetwork,
  };
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const updateSelectedNetwork = useCallback(
    (selectedNetwork) => {
      dispatch({
        type: UPDATE_SELECTED_NETWORK,
        payload: { selectedNetwork },
      });
      updateSavedSelectedNetwork(selectedNetwork);
    },
    [updateSavedSelectedNetwork]
  );

  return (
    <NetworkContext.Provider
      value={useMemo(() => [state, { updateSelectedNetwork }], [
        state,
        updateSelectedNetwork,
      ])}
    >
      {children}
    </NetworkContext.Provider>
  );
}

export function useSelectedNetwork() {
    const [ state, { updateSelectedNetwork }] = useNetworkContext();
    return [state.selectedNetwork, { updateSelectedNetwork }];
}