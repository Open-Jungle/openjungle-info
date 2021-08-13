// basic imports
import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from "react-router-dom";
import App from './App';

// theme
import ThemeProvider, { GlobalStyle } from "./Theme";

ReactDOM.render(
    <ThemeProvider>
        <HashRouter>
            <GlobalStyle />
            <App />
        </HashRouter>
    </ThemeProvider>,
  document.getElementById('root')
);