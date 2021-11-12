import '../styles/globals.css';
import 'antd/dist/antd.css';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import date from '../reducers/date';
import web3 from '../reducers/web3';

const store = createStore(combineReducers({ date, web3 }));


function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  )
};

export default MyApp
