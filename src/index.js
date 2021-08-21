// basic imports
import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from "react-router-dom";
import App from './App';

// theme
import ThemeProvider, { GlobalStyle } from "./Theme";

// Context Providers
import LocalStorageContextProvider, { Updater as LocalStorageContextUpdater } from './contexts/LocalStorage';
import ApplicationContextProvider from './contexts/Application';
import NetworkContextProvider from "./contexts/Network";
import GlobalDataContextProvider from './contexts/GlobalData';

function ContextProviders({ children }) {
    return (
        <LocalStorageContextProvider>
            <ApplicationContextProvider>
                <NetworkContextProvider>
                    <GlobalDataContextProvider>
                        {children}
                    </GlobalDataContextProvider>
                </NetworkContextProvider>
            </ApplicationContextProvider>
        </LocalStorageContextProvider>
    );
}

function Updaters() {
    return (
        <>
            <LocalStorageContextUpdater />
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