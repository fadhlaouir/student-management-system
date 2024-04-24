/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */
// Packages
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';

// redux
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { ConfigProvider } from 'antd';

import * as serviceWorker from './serviceWorker';

// Store, helpers & utils
import store from './store';
import Loader from './shared/Components/Loader';
import { renderRoutes } from './routes';

// Style
import './index.css';

// Load store from local storage
const persistor = persistStore(store);

/* -------------------------------------------------------------------------- */
/*                                App rendering                               */
/* -------------------------------------------------------------------------- */

// eslint-disable-next-line react/no-deprecated
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ConfigProvider>
          <Suspense fallback={<Loader />}>{renderRoutes()}</Suspense>
        </ConfigProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
