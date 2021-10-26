import '../styles/globals.css';
import 'antd/dist/antd.css';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import date from '../reducers/date';

const store = createStore(combineReducers({ date }));


function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  )
};

export default MyApp
