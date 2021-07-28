import React, { Component } from "react";
import { Cookies, withCookies } from "react-cookie";
import { connect } from "react-redux";
import { instanceOf } from "prop-types";
class LoginSocial extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired,
  };

  render() {
    return (
      <div className="col-sm-6 col-sm-offset-3">
        <img
          className="loader-center"
          src="/img/ajax-loader.gif"
          alt="loader center"
        />
        <h3 className="text-center">Logging you in...</h3>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    errorMessage: state.auth.error,
    message: state.auth.message,
    authenticated: state.auth.authenticated,
  };
}

export default connect(mapStateToProps)(withCookies(LoginSocial));
