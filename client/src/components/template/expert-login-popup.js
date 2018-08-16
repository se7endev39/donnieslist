import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, IndexLink } from 'react-router';
import cookie from 'react-cookie';
import { Modal, Button, Panel } from 'react-bootstrap';
//import * as actions from '../../actions/messaging';
import $ from 'jquery';
const currentUser = cookie.load('user');

class ExpertLoginPopup extends Component {
  constructor(props) {
    super(props);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    console.log('componentDidMount: ',this.props.showStatus);

    this.state = {
      show: this.props.showStatus
    };
  }

  componentDidMount(){
    console.log('componentDidMount');
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  render() {
    return (
        <div show={this.state.show} onHide={this.handleClose}>Hello Donny</div>
    );
  }
}

function mapStateToProps(state) {
  return {
    /*content: state.auth.content,
    messages: state.communication.messages*/
  };
}

export default connect(null, { })(ExpertLoginPopup);