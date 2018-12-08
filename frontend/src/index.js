import React from 'react';
import ReactDOM from 'react-dom';
import { SnackbarProvider } from 'notistack';
import * as serviceWorker from './serviceWorker';
import App from './App';
import './index.css';
import 'font-awesome/css/font-awesome.css';
import 'typeface-roboto';

ReactDOM.render(
    // TODO: wrap with <BrowserRouter>
    <SnackbarProvider maxSnack={5}>
        <App />
    </SnackbarProvider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
