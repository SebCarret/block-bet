import '../styles/globals.css';
import 'antd/dist/antd.less';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import change from '../reducers/change';
import date from '../reducers/date';
import web3 from '../reducers/web3';
import player from '../reducers/player';

const store = createStore(combineReducers({ change, date, web3, player }));


function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  )
};

export default MyApp
