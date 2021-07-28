import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { useCookies } from 'react-cookie'; 

import store from './store';
import Routes from './routes';

import HeaderTemplate from './components/template/header';
import FooterTemplate from "./components/template/footer";


import { AUTH_USER } from './constants/actions';


const App = () => {
  const [cookies,] = useCookies();

  useEffect(() => {
    const token = cookies.token;
    if (token) {
      // console.log('[COOKIE]:[USER]', cookies.user);
      // console.log('[COOKIE]:[TOKEN]', cookies.token);
      store.dispatch({type: AUTH_USER});
    }
  }, [cookies]);

  return (
    <Provider store={store}>
      <Router>
        <HeaderTemplate logo="Donnie's List" />
        <Routes />
        <FooterTemplate />
      </Router>
    </Provider>
  );
}

export default App;
