import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { HashRouter } from 'react-router-dom';
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import reducers from './redux/reducers';
import IndexRoute from './router/index-router';

const store = createStore(reducers, compose(applyMiddleware(thunk), window.devToolsExtension ? window.devToolsExtension() : fn => fn))
ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
      <IndexRoute></IndexRoute>
    </HashRouter>
  </Provider>,
  document.getElementById('root'));
serviceWorker.unregister();
