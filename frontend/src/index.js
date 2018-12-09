import React from 'react';
import ReactDOM from 'react-dom';
import { SnackbarProvider } from 'notistack';
import * as serviceWorker from './serviceWorker';
import App from './App';
import './styles/index.css';
import 'font-awesome/css/font-awesome.css';
import 'typeface-roboto';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(

    <BrowserRouter>
        <SnackbarProvider maxSnack={3}>
            <App />
        </SnackbarProvider>
    </BrowserRouter>,

    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
