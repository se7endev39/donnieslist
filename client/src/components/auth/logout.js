import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/auth';

class Logout extends Component {
  componentWillMount() {
    this.props.logoutUser();
  }

  render() {
    return  <div className="col-sm-6 mtop100 col-sm-offset-3">
              <div className="page-title text-center">Sorry to see you go!</div>
            </div>;
  }
}

export default connect(null, actions)(Logout);
