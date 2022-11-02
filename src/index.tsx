import 'core-js/stable/symbol';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import 'fast-text-encoding/text';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './style/index.css';

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);
