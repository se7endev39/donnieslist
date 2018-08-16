import React, { Component } from 'react';
import cookie from 'react-cookie';
import { connect } from 'react-redux';
import { API_URL, CLIENT_ROOT_URL, errorHandler } from '../../actions/index';
import axios from 'axios';

class LoginSocial extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const currentUser = cookie.load('user');

    if(this.props.location.query.facebook_token){
      axios.post(`${API_URL}/auth/facebook-send-jwt-token`,{token : this.props.location.query.facebook_token})
      .then((response) => {
        cookie.save('token', response.data.token, { path: '/' });
        cookie.save('user', response.data.user, { path: '/' });
        opener.location.href = `${CLIENT_ROOT_URL}`;
        setTimeout(function(){
          close();
        },1500);
      })
      .catch((error) => {
        errorHandler(dispatch, error.response, AUTH_ERROR);
      });
    }

    if(this.props.location.query.twitter_token){
      axios.post(`${API_URL}/auth/twitter-send-jwt-token`,{token : this.props.location.query.twitter_token})
      .then((response) => {
        cookie.save('token', response.data.token, { path: '/' });
        cookie.save('user', response.data.user, { path: '/' });
        opener.location.href = `${CLIENT_ROOT_URL}`;
        setTimeout(function(){
          close();
        },1500);
      })
      .catch((error) => {
        errorHandler(dispatch, error.response, AUTH_ERROR);
      });
    }

    return (
        <div className="col-sm-6 col-sm-offset-3">
          <img className="loader-center" src="/src/public/img/ajax-loader.gif"/>
          <h3 className="text-center">Logging you in...</h3>
        </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    errorMessage: state.auth.error,
    message: state.auth.message,
    authenticated: state.auth.authenticated
  };
}

export default connect(mapStateToProps)(LoginSocial);
