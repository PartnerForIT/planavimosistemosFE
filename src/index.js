import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import './i18n';
import { Provider } from 'react-redux';
import App from './App';
import * as serviceWorker from './serviceWorker';
import store from './store';

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));

// If you want your auth to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
