import React, { Component } from "react";
// import ReactDOM from "react-dom";
import FacebookLogin from "react-facebook-login";

class PrivacyPolicy extends Component {
  responseFacebook(response) {
    console.log("^^^^^ response ^^^^^^: ", response);
  }
  /**
   * Class constructor.
   */
  constructor(props, context) {
    super(props, context);
    this.state = {
      loading: true,
      error: null,
    };
  }

  componentDidMount() {
    this.setState({
      loading: false,
    });
  }

  renderLoading() {
    return (
      <img
        className="loader-center"
        src="https://www.donnieslist.com/img/ajax-loader.gif"
        alt=""
      />
    );
  }

  renderError() {
    return (
      <div className="error-message">Uh oh: {this.state.error.message}</div>
    );
  }

  renderPosts() {
    if (this.state.error) {
      return this.renderError();
    }

    return (
      <div id="how-it-works-wrapper" className="how-it-works-wrapper">
        <div className="container">
          <div className="page-title text-center">
            <h2>Privacy Policy</h2>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="row">
                <FacebookLogin
                  appId="979601722141411"
                  autoLoad={true}
                  fields="name,email,picture"
                  scope="public_profile,user_friends"
                  callback={this.responseFacebook}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Render the component.
   */
  render() {
    return (
      <div>
        {this.state.loading ? this.renderLoading() : this.renderPosts()}
      </div>
    );
  }
}
export default PrivacyPolicy;
