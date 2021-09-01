// basic imports
import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from "react-router-dom";
import App from './App';

// theme
import ThemeProvider, { GlobalStyle } from "./Theme";

// Context Providers
import LocalStorageContextProvider, { Updater as LocalStorageContextUpdater } from './contexts/LocalStorage';
import TokenDataContextProvider, { Updater as TokenDataContextUpdater } from './contexts/TokenData'
import ApplicationContextProvider from './contexts/Application';
import NetworkContextProvider from "./contexts/Network";
import GlobalDataContextProvider from './contexts/GlobalData';

function ContextProviders({ children }) {
    return (
        <LocalStorageContextProvider>
            <ApplicationContextProvider>
                <NetworkContextProvider>
                    <TokenDataContextProvider>
                        <GlobalDataContextProvider>
                            {children}
                        </GlobalDataContextProvider>
                    </TokenDataContextProvider>
                </NetworkContextProvider>
            </ApplicationContextProvider>
        </LocalStorageContextProvider>
    );
}

function Updaters() {
    return (
        <>
            <LocalStorageContextUpdater />
            <TokenDataContextUpdater />
        </>
    );
}

ReactDOM.render(
    <ContextProviders>
        <Updaters />
        <ThemeProvider>
            <HashRouter>
                <GlobalStyle />
                <App />
            </HashRouter>
        </ThemeProvider>
    </ContextProviders>,
  document.getElementById('root')
);