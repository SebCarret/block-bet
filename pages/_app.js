import '../styles/globals.css';
import 'antd/dist/antd.css';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import date from '../reducers/date';
import web3 from '../reducers/web3';
import player from '../reducers/player';

const store = createStore(combineReducers({ date, web3, player }));


function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  )
};

export default MyApp
